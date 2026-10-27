
$port = 8080
$folder = $PSScriptRoot
$dbFile = Join-Path $folder "database.json"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  GrozCalc - Calorie Calculator Local Server" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Port: $port" -ForegroundColor Green
Write-Host "URL: http://localhost:$port/index.html" -ForegroundColor Green
Write-Host "Database file: $dbFile" -ForegroundColor Gray
Write-Host "========================================================" -ForegroundColor Cyan

$tcpListener = $null
try {
    $tcpListener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
    $tcpListener.Start()
} catch {
    $port = 8081
    $tcpListener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
    $tcpListener.Start()
    Write-Host "Port 8080 was busy, using backup port: $port" -ForegroundColor Yellow
}

Write-Host "SERVER IS RUNNING at http://localhost:$port/" -ForegroundColor Green
Write-Host "All changes are automatically saved to database.json on disk!" -ForegroundColor Cyan
Write-Host "To stop the server, close this window or press Ctrl+C." -ForegroundColor Gray
Write-Host "--------------------------------------------------------" -ForegroundColor Gray

Start-Process "http://localhost:$port/index.html"

while ($true) {
    try {
        $client = $tcpListener.AcceptTcpClient()
        $stream = $client.GetStream()
        $stream.ReadTimeout = 5000
        $stream.WriteTimeout = 5000

        $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::UTF8)
        $reqLine = $reader.ReadLine()

        if (-not [string]::IsNullOrWhiteSpace($reqLine)) {
            $parts = $reqLine.Split(' ')
            $method = "GET"
            $cleanUrl = "index.html"

            if ($parts.Length -ge 2) {
                $method = $parts[0].ToUpper()
                $rawUrl = $parts[1]
                $noQuery = $rawUrl.Split('?')[0].TrimStart('/')
                if (-not [string]::IsNullOrWhiteSpace($noQuery)) {
                    $cleanUrl = $noQuery
                }
            }

            $contentLength = 0
            while ($true) {
                $headerLine = $reader.ReadLine()
                if ([string]::IsNullOrEmpty($headerLine)) { break }
                if ($headerLine -match "^Content-Length:\s*(\d+)") {
                    $contentLength = [int]$matches[1]
                }
            }

            if ($method -eq "OPTIONS") {
                $corsHeader = "HTTP/1.1 204 No Content`r`nAccess-Control-Allow-Origin: *`r`nAccess-Control-Allow-Methods: GET, POST, OPTIONS`r`nAccess-Control-Allow-Headers: Content-Type`r`nConnection: close`r`n`r`n"
                $hBytes = [System.Text.Encoding]::ASCII.GetBytes($corsHeader)
                $stream.Write($hBytes, 0, $hBytes.Length)
            }
            elseif ($method -eq "GET" -and ($cleanUrl -eq "api/database" -or $cleanUrl -eq "database.json")) {
                if (Test-Path $dbFile) {
                    $bodyBytes = [System.IO.File]::ReadAllBytes($dbFile)
                    $respHeader = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($bodyBytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                    $hBytes = [System.Text.Encoding]::ASCII.GetBytes($respHeader)
                    $stream.Write($hBytes, 0, $hBytes.Length)
                    $stream.Write($bodyBytes, 0, $bodyBytes.Length)
                } else {
                    $hBytes = [System.Text.Encoding]::ASCII.GetBytes("HTTP/1.1 404 Not Found`r`nContent-Length: 0`r`nConnection: close`r`n`r`n")
                    $stream.Write($hBytes, 0, $hBytes.Length)
                }
            }
            elseif ($method -eq "POST" -and ($cleanUrl -eq "api/database" -or $cleanUrl -eq "database.json")) {
                $postBody = ""
                if ($contentLength -gt 0) {
                    $buffer = New-Object char[] $contentLength
                    $totalRead = 0
                    while ($totalRead -lt $contentLength) {
                        $read = $reader.Read($buffer, $totalRead, $contentLength - $totalRead)
                        if ($read -le 0) { break }
                        $totalRead += $read
                    }
                    $postBody = [string]::new($buffer, 0, $totalRead)
                }

                if (-not [string]::IsNullOrWhiteSpace($postBody)) {
                    [System.IO.File]::WriteAllText($dbFile, $postBody, [System.Text.Encoding]::UTF8)
                    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] [POST] Database successfully saved to database.json!" -ForegroundColor Green
                }

                $ackBody = [System.Text.Encoding]::UTF8.GetBytes('{"status":"ok"}')
                $respHeader = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($ackBody.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                $hBytes = [System.Text.Encoding]::ASCII.GetBytes($respHeader)
                $stream.Write($hBytes, 0, $hBytes.Length)
                $stream.Write($ackBody, 0, $ackBody.Length)
            }
            else {
                $localFilePath = Join-Path $folder $cleanUrl.Replace('/', '\')
                if (Test-Path $localFilePath -PathType Leaf) {
                    $fileBytes = [System.IO.File]::ReadAllBytes($localFilePath)
                    $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()
                    $mime = "application/octet-stream"
                    switch ($ext) {
                        ".html" { $mime = "text/html; charset=utf-8" }
                        ".css"  { $mime = "text/css; charset=utf-8" }
                        ".js"   { $mime = "application/javascript; charset=utf-8" }
                        ".json" { $mime = "application/json; charset=utf-8" }
                        ".sql"  { $mime = "text/plain; charset=utf-8" }
                        ".svg"  { $mime = "image/svg+xml" }
                        ".png"  { $mime = "image/png" }
                        ".ico"  { $mime = "image/x-icon" }
                    }

                    $respHeader = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($fileBytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                    $hBytes = [System.Text.Encoding]::ASCII.GetBytes($respHeader)
                    $stream.Write($hBytes, 0, $hBytes.Length)
                    $stream.Write($fileBytes, 0, $fileBytes.Length)
                } else {
                    $hBytes = [System.Text.Encoding]::ASCII.GetBytes("HTTP/1.1 404 Not Found`r`nContent-Length: 0`r`nConnection: close`r`n`r`n")
                    $stream.Write($hBytes, 0, $hBytes.Length)
                }
            }
            $stream.Flush()
        }
        $client.Close()
    } catch {
    }
}
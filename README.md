# GrozCalc - Kaloriju Kalkulators (Prototips)

> **Projekta autori:**  
> • Daniils Galviņš (241RDB283)  
> • Deniss Smirnovs (241RDB243)  
> • Vladislavs Hatiņecs (241RDB015)  

---

## 1. Projekta failu struktūra

```text
grozcalc-prototype/
│
├── START_SERVER.bat      # Galvenais servera palaišanas fails
├── start.bat             # Alternatīvs palaišanas fails
├── start-server.ps1      # PowerShell iebūvētais HTTP serveris
├── server.js             # Node.js aizmugursistēmas serveris
├── package.json          # Node.js konfigurācijas fails
├── database.json         # Datubāzes fails
├── schema.sql            # Relāciju SQL datubāzes shēma
├── index.html            # Galvenā lietotāja tīmekļa saskarne
├── style.css             # Vizuālais noformējums
├── app.js                # Klienta biznesa loģika, lēmumu tabulas un sinhronizācija
├── .gitignore
└── README.md
```

---

## 2. Kā palaist prototipu servera režīmā

Prototips ir izstrādāts, lai darbotos kā lokāls tīmekļa serveris ar automātisku datu saglabāšanu diskā

Veiciet dubultklikšķi uz faila:
```text
START_SERVER.bat
```
Skripts automātiski palaidīs lokālo HTTP serveri un atvērs pārlūkprogrammā adresi
```text
http://localhost:8080/index.html
```
*(Datorā jābūt instalētam node.js un ja ir uzstādīts Node.js, tas automātiski izmantos `node server.js` portā `3000`).*

---

## 2. Trīs funkcionālo sadaļu apraksts

### 1. Uztura uzskaites un dienasgrāmatas modulis
- Ielādē izvēlētā datuma patērētās pārtikas ierakstus un salīdzina ar lietotāja kaloriju mērķi.
- Pārrēķina atlikušās kalorijas un pielāgo krāsu joslas.
- Iespēja labot porcijas gramus ar tūlītēju kopsummu pārrēķinu vai dzēst ierakstus no dienas žurnāla.

### 2. Produktu meklēšana, katalogs un melnais saraksts
- Iekļauti produkti.
- Dinamiska meklēšana pēc nosaukuma/zīmola, veikala atlase (Rimi, Maxima) un kvalitātes zīmogu filtri.
- Lietotājs var bloķēt nevēlamu preci ar pamatojumu. Bloķētās preces tiek paslēptas no meklēšanas rezultātiem.
- Poga `[ + Grozā ]` atver porcijas ievadi un pievieno produktu tieši aktīvās dienas uzturam.

### 3. Administratora pārvaldības modulis
- Pieejams tikai administratora lomai. Parastam lietotājam šī sadaļa un JSON saglabāšanas poga netiek rādīta.
- Ievades forma ar stingru lauku un uzturvērtību validāciju.
- Datu korekcija un dzēšana.

---

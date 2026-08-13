# 🎓 Virtual College – Digitales Campus-Portal

Virtual College ist eine vollständige Full-Stack-Webanwendung für ein digitales Hochschulportal, entwickelt im Rahmen des Moduls **Softwaretechnik 2** an der **Fachhochschule Dortmund**. Die Anwendung richtet sich an zwei Nutzerrollen – **Studierende** und **Professoren** – und bildet zentrale Hochschulprozesse digital ab.

---

## 📖 Inhaltsverzeichnis

- [Über das Projekt](#-über-das-projekt)
- [Features](#-features)
- [Technologie-Stack](#-technologie-stack)
- [Architektur](#-architektur)
- [Entwurfsmuster](#-entwurfsmuster-design-patterns)
- [Projektstruktur](#-projektstruktur)
- [Installation & Setup](#-installation--setup)

---

## 📌 Über das Projekt

Virtual College digitalisiert den Studienalltag an einer Hochschule: von der Kursverwaltung über Lernmaterialien bis hin zur Prüfungsanmeldung und dem Studienfortschritt – alles zentral an einem Ort, für Studierende und Lehrende gleichermaßen zugänglich.

Die Architektur ist vollständig **containerisiert (Docker)** und kombiniert **synchrone Kommunikation** (REST/HTTP zwischen Frontend und Backend, JDBC zur Datenbank) mit **asynchroner Kommunikation** (MQTT Publish/Subscribe zwischen Backend und einem simulierten externen System).

---

## ✨ Features

### Für Studierende
- 📊 **Studienfortschritt** – ECTS, Notenschnitt, bestandene/offene/nicht bestandene Prüfungen als Radial-Diagramme mit Notenverteilung
- 📄 **PDF-Export** des Studienfortschritts (serverseitig generiert)
- 📝 **Prüfungsanmeldung** – An-/Abmeldung zu Prüfungen mit Anmeldezeitraum-Validierung und Erinnerung vor Fristende
- 📚 **Kursübersicht** mit sortierbarer Materialtabelle (PDF-Download, externe Links)
- 👤 **Profilverwaltung** mit editierbaren Feldern und Live-Statistiken

### Für Professoren
- 🏫 **Kursverwaltung** – Kurse anlegen mit Titel, Beschreibung und Modul-Zuordnung
- 📎 **Lernmaterial-Upload** – PDF-Dateien oder externe Links, inklusive Löschfunktion
- 📋 **Dashboard** mit Übersicht über eigene Kurse und Materialien

### Systemweit
- 🔔 **Echtzeit-Benachrichtigungen** mit Live-Polling und Ungelesen-Zähler
- 🔐 **Rollenbasierte Authentifizierung** (Student/Professor) mit JWT
- 📱 Responsive, mobile-freundliche Oberfläche

---

## 🛠 Technologie-Stack

### Frontend
| Technologie | Zweck |
|---|---|
| **React** | Single Page Application, komponentenbasiert, Hooks-basiertes State-Management |
| **npm** | Paketmanager & Build-Tool (`npm start`, `npm run build`) |

### Backend
| Technologie | Zweck |
|---|---|
| **Spring Boot** (Java) | Anwendungs-Framework |
| **Spring Data JPA** | Objektrelationale Datenbankanbindung (Repositories, Entities) |
| **Spring Security** | Rollenbasierte Authentifizierung/Autorisierung (JWT/Bearer-Token, `@PreAuthorize`) |
| **Maven** | Build- und Dependency-Management (`pom.xml`, `mvn package`) |
| **OpenPDF** | Serverseitige PDF-Generierung (Studienfortschritt-Export) |
| **Apache PDFBox** | PDF-Metadaten (Seitenanzahl beim Materialupload) |

### Datenbank
| Technologie | Zweck |
|---|---|
| **PostgreSQL** | Relationales Datenbanksystem |

### Messaging / Asynchrone Kommunikation
| Technologie | Zweck |
|---|---|
| **MQTT** | Publish/Subscribe-Kommunikation zwischen Backend und Datensimulator |
| **Eclipse Mosquitto** | Containerisierter MQTT-Broker |

### Infrastruktur & DevOps
| Technologie | Zweck |
|---|---|
| **Docker / Docker Compose** | Containerisierung aller Systemkomponenten |
| **GitHub** | Versionskontrolle, Branching, Pull Requests, Code Reviews, Issue-Tracking |

---

## 🏗 Architektur

### Verteilungsdiagramm (Deployment)

Die Anwendung läuft vollständig containerisiert über Docker Compose, mit klar getrennten Kommunikationsarten:
<img width="917" height="800" alt="image" src="https://github.com/user-attachments/assets/2fab15db-a839-4245-a14a-cbb1790b0833" />

**Kernprinzipien:**
- Jede Komponente läuft in einem eigenen Docker-Container auf einem eigenen (virtuellen) Host — unabhängig skalier- und deploybar
- **Synchron**: HTTP/REST zwischen Client↔Frontend↔Backend, JDBC zwischen Backend↔Datenbank
- **Asynchron**: MQTT Publish/Subscribe zwischen Backend und Datensimulator über den Mosquitto-Broker
- Der Datensimulator publiziert Ereignisse, das Backend abonniert sie – dies korrespondiert direkt mit dem **Observer-Pattern** im Code (`MqttAnmeldePublisher` als konkreter Observer)

### Schichtenarchitektur (Backend)

Durchgängiges Strukturprinzip über alle Domänen hinweg:

```
Controller → Service → Repository → Entity
```

Beispiele:
- `KursController` → `KursService` → `KursRepository` → `Kurs`
- `StudienfortschrittController` → `StudienfortschrittService` → nutzt `ModulService`, `PruefungService`
- `PruefungsController` → `PruefungService` → `PruefungRepository` → `Pruefung`
- `LernmaterialController` → `LernmaterialService` → `BaseMaterialRepository` → `BaseMaterial`

---

## 🧩 Entwurfsmuster (Design Patterns)

### 1. Factory Method Pattern – Lernmaterial-Erstellung

Entkoppelt die Materialerzeugung vom konkreten Materialtyp (PDF-Upload vs. externer Link).

Neue Materialtypen (z. B. Video, Quiz) können ergänzt werden, ohne bestehenden Code zu ändern (Open-Closed-Prinzip). Der Service greift dabei **nur auf den abstrakten Typ `LernmaterialFactory`** zu (per `Map<String, LernmaterialFactory>` injiziert) – konkrete Fabrikklassen sind dem Service nicht bekannt.

### 2. Observer Pattern – Prüfungsanmeldungs-Benachrichtigungen

Lose Kopplung zwischen dem Prüfungsanmeldungs-Kernprozess und den Komponenten, die auf Statusänderungen reagieren müssen.


Neue Beobachter (z. B. weitere Benachrichtigungskanäle) lassen sich hinzufügen, ohne die Kernlogik der Prüfungsanmeldung zu ändern.

### 3. Schichtenarchitektur (Layered Architecture)

Siehe [Architektur](#-architektur) – konsistente Trennung von Presentation, Business-Logik und Datenzugriff über alle Domänen hinweg.

### 4. Vererbungshierarchie für das Rollenmodell

```
User (abstrakt)
  ├── Student   → StudentService, StudentRepository
  └── Professor → ProfService, ProfRepository
```

Gemeinsame Attribute/Methoden zentral in `User`, rollenspezifisches Verhalten in den Subklassen.

---

## 📁 Projektstruktur

```
Virtual-College-SWT2-Neu/
├── api-backend/                 # Spring Boot Backend
│   ├── src/main/java/com/example/api/
│   │   ├── auth/                # Authentifizierung (Login, JWT)
│   │   ├── user/                # User-Basisklasse
│   │   ├── student/              # Student-Entity, Service, Repository
│   │   ├── professor/            # Professor-Entity, Service, Repository
│   │   ├── kurs/                 # Kursverwaltung
│   │   ├── modul/                # Modulverwaltung
│   │   ├── materialien/          # Lernmaterialien (Factory Pattern)
│   │   ├── prufung/               # Prüfungsverwaltung
│   │   ├── prufungsanmeldung/     # Prüfungsanmeldung (Observer Pattern)
│   │   ├── studienfortschritt/    # Studienfortschritt-Berechnung & PDF-Export
│   │   └── benachrichtigung/      # Echtzeit-Benachrichtigungen
│   └── pom.xml
│
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── api/authApi.js        # Zentraler API-Client
│   │   ├── components/           # Wiederverwendbare Komponenten (TopNav, Globe, Toast, Modal)
│   │   ├── views/                # Seiten (HomeView, KurseView, StudienfortschrittView, ...)
│   │   ├── context/authContext.js
│   │   └── config/roles.js
│   └── package.json
│
├── docker-compose.yml            # Orchestrierung aller Container
├── mosquitto.conf                # MQTT-Broker-Konfiguration
└── README.md
```

---

## 🚀 Installation & Setup

### Voraussetzungen
- Docker & Docker Compose
- Node.js & npm (für lokale Frontend-Entwicklung)
- Java 17+ & Maven (für lokale Backend-Entwicklung)

### Mit Docker Compose (empfohlen)

```bash
git clone https://github.com/youssefrhd/virtual-college.git
cd virtual-college
docker-compose up --build
```

### Backend lokal starten

```bash
cd api-backend
mvn spring-boot:run
```

### Frontend lokal starten

```bash
cd frontend
npm install
npm start
```

Standardmäßig läuft das Backend auf `http://localhost:8080`, das Frontend auf `http://localhost:3000`.



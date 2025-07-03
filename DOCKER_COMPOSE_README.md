# 🐋 Docker Compose Setup - M324 Todo List

## 📋 Übersicht

Dieses Projekt verwendet Docker Compose für eine vollständige containerisierte Entwicklungs- und Produktionsumgebung. Wir haben drei verschiedene Compose-Konfigurationen:

- **`docker-compose.yml`** - Basis-Konfiguration
- **`docker-compose.dev.yml`** - Entwicklungsumgebung mit Hot Reload
- **`docker-compose.prod.yml`** - Produktionsumgebung mit Optimierungen

## 🏗️ Container-Architektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │     MySQL       │
│   (React)       │────│  (Spring Boot)  │────│   (Database)    │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                        │                      │
          └────────────────────────┼──────────────────────┘
                                   │
                        ┌─────────────────┐
                        │  phpMyAdmin     │
                        │  (DB Management)│
                        │  Port: 8081     │
                        └─────────────────┘
```

## 🚀 Schnellstart

### Entwicklungsumgebung starten:
```bash
# Alle Services in Entwicklungsmodus
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Oder im Hintergrund
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

### Produktionsumgebung starten:
```bash
# Alle Services in Produktionsmodus
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

### Nur bestimmte Services starten:
```bash
# Nur Backend und Datenbank
docker-compose up mysql backend

# Nur Frontend
docker-compose up frontend
```

## 📦 Service-Details

### 🗄️ **MySQL Database**
- **Image**: `mysql:8.0`
- **Port**: `3306`
- **Database**: `todolist_db`
- **User**: `todouser` / `todopass`
- **Volume**: Persistente Datenspeicherung

### ☕ **Backend (Spring Boot)**
- **Build**: Multi-Stage Dockerfile
- **Port**: `8080`
- **Health Check**: `/api/actuator/health`
- **Debug Port** (Dev): `5005`
- **Profiles**: `docker`, `dev`, `prod`

### ⚛️ **Frontend (React)**
- **Build**: Multi-Stage mit Nginx
- **Port**: `3000`
- **Hot Reload**: In Entwicklungsmodus
- **Proxy**: API-Calls zu Backend

### 🛠️ **phpMyAdmin**
- **Image**: `phpmyadmin/phpmyadmin`
- **Port**: `8081`
- **Access**: http://localhost:8081
- **Login**: `todouser` / `todopass`

## 🔧 Nützliche Docker Compose Befehle

### Container Management:
```bash
# Services anzeigen
docker-compose ps

# Logs anzeigen
docker-compose logs -f backend
docker-compose logs -f frontend

# Container stoppen
docker-compose down

# Container stoppen und Volumes löschen
docker-compose down -v

# Images neu bauen
docker-compose build --no-cache

# Einzelnen Service neu starten
docker-compose restart backend
```

### Entwicklung:
```bash
# Backend Shell öffnen
docker-compose exec backend bash

# Frontend Shell öffnen
docker-compose exec frontend sh

# MySQL Shell öffnen
docker-compose exec mysql mysql -u todouser -p todolist_db

# Maven Tests im Backend Container
docker-compose exec backend mvn test
```

## 🌍 Environment-spezifische Konfigurationen

### Development Environment:
- **Hot Reload**: Aktiviert für Frontend und Backend
- **Debug Ports**: Backend Debug auf Port 5005
- **Volume Mounts**: Source Code für Live-Änderungen
- **Logging**: Detaillierte Debug-Logs

### Production Environment:
- **Optimized Images**: Multi-Stage Builds für kleinere Images
- **Security**: Non-root User, minimale Dependencies
- **Performance**: JVM-Optimierungen, Nginx-Caching
- **Monitoring**: Erweiterte Health Checks

## 📊 URLs und Endpoints

### Development:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Backend Health**: http://localhost:8080/api/actuator/health
- **phpMyAdmin**: http://localhost:8081
- **MySQL**: localhost:3306

### Production:
- **Application**: http://localhost (Nginx Reverse Proxy)
- **API**: http://localhost/api
- **Health Checks**: http://localhost/health

## 🔍 Monitoring und Debugging

### Health Checks:
```bash
# Backend Health Check
curl http://localhost:8080/api/actuator/health

# Frontend Health Check
curl http://localhost:3000/health

# MySQL Health Check
docker-compose exec mysql mysqladmin ping -h localhost
```

### Logs und Debugging:
```bash
# Alle Container Logs
docker-compose logs -f

# Spezifische Service Logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Container Status
docker-compose ps

# Resource Usage
docker stats
```

## 🛡️ Sicherheitsfeatures

### Container Security:
- **Non-root Users**: Alle Container laufen mit beschränkten Benutzern
- **Minimal Images**: Alpine-basierte Images für geringere Angriffsfläche
- **Health Checks**: Automatische Container-Überwachung
- **Network Isolation**: Separate Docker-Netzwerke

### Application Security:
- **CORS Configuration**: Kontrollierte Frontend-Backend Kommunikation
- **Security Headers**: Nginx-basierte Security Headers
- **Database Isolation**: Separate Datenbank-Credentials

## 🔧 Troubleshooting

### Häufige Probleme:

#### Port-Konflikte:
```bash
# Prüfen welche Ports belegt sind
netstat -tulpn | grep :3000
netstat -tulpn | grep :8080

# Alternative Ports in docker-compose.yml ändern
```

#### Container startet nicht:
```bash
# Detaillierte Logs anzeigen
docker-compose logs backend

# Container-Status prüfen
docker-compose ps

# Container neu bauen
docker-compose build --no-cache backend
```

#### Database Connection Issues:
```bash
# MySQL Container Status
docker-compose exec mysql mysqladmin ping

# Database Logs
docker-compose logs mysql

# Connection testen
docker-compose exec backend curl -f http://mysql:3306
```

#### Frontend Build Fehler:
```bash
# Node Modules neu installieren
docker-compose exec frontend npm install

# Cache leeren
docker-compose exec frontend npm cache clean --force

# Image neu bauen
docker-compose build --no-cache frontend
```

## 📁 File Structure

```
M324_PROJEKT_TODOLIST/
├── docker-compose.yml          # Basis-Konfiguration
├── docker-compose.dev.yml      # Development Overrides
├── docker-compose.prod.yml     # Production Overrides
├── backend/
│   ├── Dockerfile              # Production Backend Image
│   ├── Dockerfile.dev          # Development Backend Image
│   └── src/main/resources/
│       └── application-docker.properties
├── frontend/
│   ├── Dockerfile              # Production Frontend Image
│   ├── Dockerfile.dev          # Development Frontend Image
│   └── nginx.conf              # Nginx Konfiguration
└── README files...
```

## 🚀 Deployment Workflow

### Local Development:
1. `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`
2. Code ändern (Hot Reload aktiviert)
3. Tests laufen automatisch

### Testing:
1. `docker-compose -f docker-compose.yml up --build`
2. Automatische Tests in CI/CD Pipeline
3. E2E Tests mit Cypress

### Production:
1. `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
2. Health Checks überwachen
3. Logs und Metriken prüfen

---

**🎯 Docker Compose Setup erfolgreich konfiguriert!**  
**Entwicklung**: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`  
**Produktion**: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`

# Kurzanleitung für die Installation der Entwicklungsumgebung zum Basisprojekt im Modul 324

## NEUE FEATURES (von features branch) (causing a merge conflict)
- ✨ Real-time search and filter functionality implemented
- 🎨 Modern dark theme design with improved UX
- 📊 Todo statistics and filtered count display
- 🔍 Case-insensitive search with clear button
- 🧪 Comprehensive JUnit test suite (8 tests total)

## TLDR 

ToDo-Liste mit React (frontend) und Spring (backend). Weitere Details sind in den
Kommentaren vor allem in App.js zu finden.

## Relevante Dateien in den Teil-Projekten (Verzeichnisse):

1. diese Beschreibung
2. frontend (Tools: npm und VSCode)
	* App.js

3. backend (Eclipse oder VS-Code)
	* DemoApplication.java
	* Task.java
	* pom.xml (JAR configuration, mit div. Plugins s.u.)

## Inbetriebnahme

1. forken oder clonen
1. *backend* in Eclipse importieren und mit Maven starten, oder in VS-Code via Java Extension Pack. Ohne Persistenz - nach dem Serverneustart sind die Todos futsch. Läuft auf default port 8080.
2. Im Terminal im *frontend* Verzeichnis
	1. mit `npm install` benötige Module laden 
	2. mit `npm start` den Frontend-Server starten

## Benutzung 

1. http://localhost:3000 zeigt das Frontend an. Hier kann man Tasks eingeben, die sofort darunter in der Liste mit einem *Done*-Button angezeigt werden. 
2. Klickt man auf den *Done*-Button eines Tasks wird dieser aus der Liste entfernt (und natürlich auch von Backend-Server). 
3. Die Task Beschreibungen müssen eindeutig (bzw. einmalig) sein.

### Anstehende Aufgaben

- Erweiterung der Funktionalität durch die Lernenden
- Alternatives Backend für eine VM (WAR Konfiguration)
- Test Umbegung mit Unit-Tests erweitern

(Ausgaben für white-box debugging sind bereits auf den beiden Server vorhanden)
--Testawd
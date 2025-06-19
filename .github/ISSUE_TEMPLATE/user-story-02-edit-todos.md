---
name: ✏️ Todo-Bearbeitung
about: Als Benutzer möchte ich bestehende Todos bearbeiten können
title: '[FEATURE] Todo-Bearbeitungsfunktion implementieren'
labels: enhancement, frontend, backend
assignees: ''
---

### 🧑‍🤝‍🧑 Rolle  
*Als* Benutzer der Todo-Liste

### 🎯 Ziel / Wunsch  
*möchte ich* bestehende Todo-Einträge bearbeiten können, anstatt sie löschen und neu erstellen zu müssen

### 💡 Nutzen  
*damit* ich Tippfehler korrigieren und Aufgaben präzisieren kann, ohne den Fortschritt zu verlieren

---

### ✅ Teilaufgaben  
- [ ] Edit-Button neben dem Done-Button in renderTasks hinzufügen
- [ ] Edit-Modus State für einzelne Todos implementieren
- [ ] Input-Feld für Inline-Bearbeitung in der Liste
- [ ] Backend API-Endpoint PUT /tasks/{id} für Updates erstellen
- [ ] handleEdit Funktion in App.jsx implementieren
- [ ] Task.java um ID-Feld erweitern (aktuell nur taskdescription)
- [ ] CSS-Styling für Edit-Modus

---

### 📎 Weitere Hinweise  
- Aktuell haben Tasks keine eindeutige ID, nur taskdescription
- Backend muss erweitert werden um Update-Funktionalität
- Edit-Modus sollte mit ESC abgebrochen werden können
- Inline-Editing direkt in der Todo-Liste für bessere UX

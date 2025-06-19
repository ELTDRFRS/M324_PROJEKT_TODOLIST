---
name: 🔍 Filter- und Suchfunktion
about: Als Benutzer möchte ich meine Todos durchsuchen und filtern können
title: '[FEATURE] Filter- und Suchfunktion hinzufügen'
labels: enhancement, frontend
assignees: ''
---

### 🧑‍🤝‍🧑 Rolle  
*Als* Benutzer mit vielen Todo-Einträgen in der aktuellen Liste

### 🎯 Ziel / Wunsch  
*möchte ich* meine Aufgaben in Echtzeit durchsuchen und nach verschiedenen Kriterien filtern können

### 💡 Nutzen  
*damit* ich in der wachsenden Todo-Liste schnell die relevanten Aufgaben finde und nicht scrollen muss

---

### ✅ Teilaufgaben  
- [ ] Suchfeld oberhalb der Todo-Liste in App.jsx hinzufügen
- [ ] Echtzeit-Filterlogik für taskdescription implementieren
- [ ] useState Hook für Suchbegriff ergänzen
- [ ] renderTasks Funktion um Filterfunktionalität erweitern
- [ ] CSS-Styling für Suchfeld hinzufügen

---

### 📎 Weitere Hinweise  
- Suchfunktion sollte case-insensitive sein
- Filterung erfolgt client-seitig ohne API-Aufrufe
- Bei leerem Suchfeld werden alle Todos angezeigt
- Implementierung als zusätzlicher useState Hook neben taskdescription

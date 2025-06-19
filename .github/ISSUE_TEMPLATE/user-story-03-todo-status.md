---
name: ✅ Todo-Status Management
about: Als Benutzer möchte ich Todos als erledigt markieren ohne sie zu löschen
title: '[FEATURE] Todo-Status (erledigt/offen) implementieren'
labels: enhancement, frontend, backend
assignees: ''
---

### 🧑‍🤝‍🧑 Rolle  
*Als* produktivitätsorientierter Benutzer der Todo-Liste

### 🎯 Ziel / Wunsch  
*möchte ich* Todos als "erledigt" markieren können, ohne sie komplett aus der Liste zu entfernen

### 💡 Nutzen  
*damit* ich meinen Fortschritt verfolgen, erledigte Aufgaben als Motivation sehen und bei Bedarf darauf zurückgreifen kann

---

### ✅ Teilaufgaben  
- [ ] Task.java um boolean "completed" Attribut erweitern
- [ ] Backend API um Status-Update Endpoint ergänzen (/tasks/{id}/toggle)
- [ ] Frontend: Toggle-Button anstatt Delete-Button implementieren
- [ ] Visuelle Unterscheidung zwischen erledigten/offenen Todos (CSS)
- [ ] Filter-Option für "Alle" / "Offen" / "Erledigt" hinzufügen
- [ ] handleToggleStatus Funktion in App.jsx erstellen
- [ ] Strikethrough-Styling für erledigte Todos

---

### 📎 Weitere Hinweise  
- Aktuell werden Todos nur gelöscht (handleDelete), nicht als erledigt markiert
- Erledigte Todos sollten visuell gedimmt oder durchgestrichen dargestellt werden
- Optional: Prozentanzeige des Fortschritts (X von Y Todos erledigt)
- "Erledigt rückgängig machen" Funktionalität einbauen

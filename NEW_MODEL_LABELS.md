# 🎯 Nouveau Modèle - 10 Classes

## Classes d'entraînement
```python
["bicycle", "The Eiffel Tower", "pizza", "cat", "cloud", "apple", "tree", "car", "sun", "house"]
```

## ⚠️ Important: Ordre Alphabétique du LabelEncoder

Quand `LabelEncoder` encode les labels, il les **trie par ordre alphabétique**.

**ATTENTION**: En Python, les majuscules (A-Z) viennent AVANT les minuscules (a-z) dans l'ordre ASCII.
- 'T' (ASCII 84) < 'a' (ASCII 97)
- Donc "The Eiffel Tower" se place en PREMIER

## 📊 Mapping Index → Label

| Index | Label Encodé      | Affichage Frontend    | Description           |
|-------|-------------------|-----------------------|-----------------------|
| 0     | The Eiffel Tower  | "The Eiffel Tower"   | 🗼 Tour Eiffel       |
| 1     | apple             | "Apple"              | 🍎 Pomme             |
| 2     | bicycle           | "Bicycle"            | 🚲 Vélo              |
| 3     | car               | "Car"                | 🚗 Voiture           |
| 4     | cat               | "Cat"                | 🐱 Chat              |
| 5     | cloud             | "Cloud"              | ☁️ Nuage             |
| 6     | house             | "House"              | 🏠 Maison            |
| 7     | pizza             | "Pizza"              | 🍕 Pizza             |
| 8     | sun               | "Sun"                | ☀️ Soleil            |
| 9     | tree              | "Tree"               | 🌲 Arbre             |

## ✅ Configuration Frontend

### Canvas.jsx
```javascript
const CNN_LABELS = [
  "The Eiffel Tower",  // index 0 - capital T sorts first
  "Apple",             // index 1
  "Bicycle",           // index 2
  "Car",               // index 3
  "Cat",               // index 4
  "Cloud",             // index 5
  "House",             // index 6
  "Pizza",             // index 7
  "Sun",               // index 8
  "Tree"               // index 9
];
```

### Keywords disponibles
```javascript
keywords = ["Apple", "Bicycle", "Car", "Cat", "Cloud", "House", "Pizza", "Sun", "The Eiffel Tower", "Tree"]
```

## 🧪 Tests Recommandés

Dessinez chaque classe et vérifiez:

1. **The Eiffel Tower** 🗼 → Devrait prédire "The Eiffel Tower"
2. **Apple** 🍎 → Devrait prédire "Apple"
3. **Bicycle** 🚲 → Devrait prédire "Bicycle"
4. **Car** 🚗 → Devrait prédire "Car"
5. **Cat** 🐱 → Devrait prédire "Cat"
6. **Cloud** ☁️ → Devrait prédire "Cloud"
7. **House** 🏠 → Devrait prédire "House"
8. **Pizza** 🍕 → Devrait prédire "Pizza"
9. **Sun** ☀️ → Devrait prédire "Sun"
10. **Tree** 🌲 → Devrait prédire "Tree"

## 🔍 Vérification du Tri Alphabétique en Python

```python
labels = ["bicycle", "The Eiffel Tower", "pizza", "cat", "cloud", "apple", "tree", "car", "sun", "house"]
sorted_labels = sorted(labels)
print(sorted_labels)
# Output: ['The Eiffel Tower', 'apple', 'bicycle', 'car', 'cat', 'cloud', 'house', 'pizza', 'sun', 'tree']

# Avec LabelEncoder
from sklearn.preprocessing import LabelEncoder
encoder = LabelEncoder()
encoder.fit(labels)
print(encoder.classes_)
# Output: ['The Eiffel Tower' 'apple' 'bicycle' 'car' 'cat' 'cloud' 'house' 'pizza' 'sun' 'tree']
```

## 📝 Notes Importantes

1. **"The Eiffel Tower"** est l'UNIQUE classe avec une majuscule au début
   - Elle sera TOUJOURS à l'index 0 après le tri
   
2. **Ordre des classes d'entraînement n'a PAS d'importance**
   - LabelEncoder trie automatiquement
   - Seul l'ordre APRÈS le tri compte

3. **Capitalisation dans le frontend**
   - Les labels d'entraînement sont en minuscules (sauf "The Eiffel Tower")
   - Le frontend capitalise pour l'affichage
   - L'ordre reste le MÊME

## ✅ Checklist de Déploiement

- [x] CNN_LABELS mis à jour avec l'ordre alphabétique correct
- [x] Keywords mis à jour avec les 10 classes disponibles
- [x] Commentaires ajoutés pour expliquer l'ordre
- [ ] Tester toutes les 10 classes
- [ ] Vérifier les images 64x64 dans "Model Input"
- [ ] Vérifier les scores de confidence

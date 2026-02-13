# 🔧 Correction du Problème de Prédiction

## 🐛 Problème Identifié

Votre modèle confondait "House" et "Tree" à cause d'un **désalignement des labels** entre l'entraînement et l'application.

---

## 📊 Analyse du Problème

### Entraînement du Modèle (Notebook)
Dans `Doodles_Dataset_with_CNN.ipynb`:
```python
words_to_keep = ['apple', 'cat', 'dog', 'bird', 'hammer','bicycle','car','house','tree']

encoder = LabelEncoder()
df['label'] = encoder.fit_transform(df['word'])
```

**LabelEncoder encode PAR ORDRE ALPHABÉTIQUE:**
```
Index  →  Label
  0    →  apple
  1    →  bicycle
  2    →  bird
  3    →  car
  4    →  cat
  5    →  dog
  6    →  hammer
  7    →  house      ← Index 7
  8    →  tree       ← Index 8
```

### Application Frontend (AVANT la correction)
```javascript
const CNN_LABELS = [
  "Bicycle",      // index 0  ← Devrait être Apple!
  "Eiffel Tower", // index 1  ← N'existe pas dans le modèle!
  "Pizza",        // index 2  ← N'existe pas dans le modèle!
  "Cat",          // index 3
  "Cloud",        // index 4  ← N'existe pas dans le modèle!
  "Apple",        // index 5
  "Tree",         // index 6
  "Car",          // index 7
  "Sun",          // index 8  ← N'existe pas dans le modèle!
  "House"         // index 9  ← Hors limites! (le modèle a 9 classes max)
];
```

### 💥 Conséquences

| Modèle prédit | Index | Frontend affichait | Résultat |
|---------------|-------|-------------------|----------|
| Apple | 0 | "Bicycle" | ❌ Faux |
| Bicycle | 1 | "Eiffel Tower" | ❌ N'existe pas |
| House | 7 | "Car" | ❌ Confusion! |
| Tree | 8 | "Sun" | ❌ Confusion! |

**Pourquoi "Apple" marchait parfois?** Par chance, quand le modèle prédisait index 5 (dog), le frontend affichait "Apple" (index 5), ce qui pouvait sembler correct même si c'était juste une coïncidence.

---

## ✅ Solution Appliquée

### Frontend (Canvas.jsx) - CORRIGÉ

```javascript
// ⚠️ IMPORTANT: Ordre des labels selon LabelEncoder (par ordre alphabétique)
// Le modèle CNN a été entraîné sur: ['apple', 'bicycle', 'bird', 'car', 'cat', 'dog', 'hammer', 'house', 'tree']
const CNN_LABELS = [
  "Apple",    // index 0  ✅
  "Bicycle",  // index 1  ✅
  "Bird",     // index 2  ✅
  "Car",      // index 3  ✅
  "Cat",      // index 4  ✅
  "Dog",      // index 5  ✅
  "Hammer",   // index 6  ✅
  "House",    // index 7  ✅ Maintenant correct!
  "Tree"      // index 8  ✅ Maintenant correct!
];
```

### Keywords Ajustés
```javascript
if (route === 'predict_cnn') {
  // Utiliser uniquement les mots que le modèle CNN connaît
  keywords = ['Apple', 'House', 'Cat', 'Tree', 'Bicycle', 'Car'];
}
```

---

## 🎯 Vérification Rapide

### Test Simple
1. Dessiner une **Apple** → Devrait prédire "Apple ✅"
2. Dessiner une **House** → Devrait prédire "House ✅" (plus de confusion avec Tree!)
3. Dessiner un **Tree** → Devrait prédire "Tree ✅" (plus de confusion avec House!)

### Tableau de Correspondance CORRECT

| Index | Label Real (Modèle) | Frontend Affiche | Status |
|-------|---------------------|------------------|--------|
| 0 | apple | Apple | ✅ |
| 1 | bicycle | Bicycle | ✅ |
| 2 | bird | Bird | ✅ |
| 3 | car | Car | ✅ |
| 4 | cat | Cat | ✅ |
| 5 | dog | Dog | ✅ |
| 6 | hammer | Hammer | ✅ |
| 7 | house | House | ✅ |
| 8 | tree | Tree | ✅ |

---

## 📝 Classes Disponibles vs Non Disponibles

### ✅ Classes Disponibles (Modèle CNN entraîné)
- Apple
- Bicycle
- Bird
- Car
- Cat
- Dog
- Hammer
- House
- Tree

### ❌ Classes NON Disponibles
- Eiffel Tower (n'existe pas dans le modèle)
- Pizza (n'existe pas dans le modèle)
- Cloud (n'existe pas dans le modèle)
- Sun (n'existe pas dans le modèle)

**Note:** Si vous dessinez ces classes, le modèle tentera de classifier en tant qu'une des 9 classes qu'il connaît.

---

## 🔍 Comment Éviter ce Problème à l'Avenir?

### Option 1: Documentation dans le Code
Toujours documenter l'ordre des labels pendant l'entraînement:
```python
# Dans le notebook d'entraînement
print("Label encoding order:")
for i, label in enumerate(sorted(words_to_keep)):
    print(f"{i}: {label}")
```

### Option 2: Sauvegarder le LabelEncoder
```python
import pickle

# Après fit_transform
with open('label_encoder.pkl', 'wb') as f:
    pickle.dump(encoder, f)

# Pour récupérer l'ordre
with open('label_encoder.pkl', 'rb') as f:
    encoder = pickle.load(f)
    labels = encoder.classes_
    print(labels)  # ['apple', 'bicycle', 'bird', ...]
```

### Option 3: Fichier de Configuration
Créer un `labels_config.json`:
```json
{
  "cnn_labels": [
    "apple", "bicycle", "bird", "car", "cat",
    "dog", "hammer", "house", "tree"
  ],
  "lstm_labels": [
    "Bicycle", "Eiffel Tower", "Pizza", "Cat", "Cloud",
    "Apple", "Tree", "Car", "Sun", "House"
  ]
}
```

---

## 🎨 Qualité du Modèle

Maintenant que les labels sont corrects, si vous avez encore des confusions entre House et Tree, cela peut venir de:

1. **Similarité Visuelle:** En 64x64, house et tree peuvent se ressembler
2. **Qualité d'Entraînement:** Le modèle peut avoir besoin de plus d'epochs
3. **Qualité du Dessin:** Dessiner plus clairement

### Améliorer les Prédictions

**Entraînement:**
- Augmenter les epochs (actuellement 10)
- Ajouter du data augmentation
- Ajuster l'architecture du CNN

**Application:**
- Améliorer la normalisation de l'image
- Augmenter la résolution (64x64 → 128x128)
- Lissage des traits

---

## ✅ Checklist Post-Correction

- [x] CNN_LABELS correspond à l'ordre d'entraînement
- [x] Keywords utilise uniquement les classes disponibles
- [x] Commentaires ajoutés pour éviter confusion future
- [ ] Tester avec chaque classe du modèle
- [ ] Vérifier la matrice de confusion

---

## 🚀 Commande de Test

```bash
# Rafraîchir le frontend
cd Quick_Draw/frontend-v2
npm run dev

# Tester dans le navigateur
# http://localhost:5173
# Mode CNN: Dessiner Apple, House, Tree, Car, etc.
```

---

## 📊 Résultats Attendus

**AVANT (avec le bug):**
```
Dessine Apple   → Prédit "Bicycle" ❌
Dessine House   → Prédit "Car" ❌
Dessine Tree    → Prédit "Sun" ❌
```

**APRÈS (corrigé):**
```
Dessine Apple   → Prédit "Apple" ✅
Dessine House   → Prédit "House" ✅
Dessine Tree    → Prédit "Tree" ✅
```

---

**Fichier modifié:** `frontend-v2/src/components/canvas/Canvas.jsx`

**Corrections effectuées:**
1. ✅ CNN_LABELS mis à jour avec l'ordre correct (alphabétique)
2. ✅ Keywords ajusté pour CNN
3. ✅ Commentaires explicatifs ajoutés

**Status:** Prêt à tester! 🎉

# 🖼️ Visualisation de l'Image d'Entrée du Modèle

## ✅ Fonctionnalité Ajoutée

Vous pouvez maintenant **voir l'image 64x64** qui est présentée en entrée du modèle CNN/LSTM.

### 📍 Où apparaît l'image?

**Position:** En haut à droite de l'écran de dessin

```
┌─────────────────────────────────────────────┐
│  [Round] [Dessinez: Apple] [Timer]          │
│                               ┌─────────┐   │
│                               │ Model   │   │
│                               │ Input:  │   │
│                               │ [Image] │   │
│                               └─────────┘   │
│                                              │
│          [Votre dessin ici]                  │
│                                              │
│       [I see Apple] [87.4%]                  │
│                                              │
│         [Clear]  [Done]                      │
└─────────────────────────────────────────────┘
```

---

## 🎨 Ce que Vous Voyez

### Image Affichée (64x64 pixels)
- **Fond:** Blanc (255)
- **Traits:** Noir (0)
- **Format:** PNG
- **Taille:** 120x120px à l'écran (agrandie pour lisibilité)

### Caractéristiques
✅ Image pixelisée (style rétro pour voir les détails)
✅ Bordure noire autour
✅ Label "Model Input:"
✅ Animation d'apparition fluide
✅ Disparaît quand vous effacez le dessin

---

## 🔧 Modifications Appliquées

### 1. Frontend (Canvas.jsx)
```javascript
// État ajouté pour stocker l'image
const [processedImage, setProcessedImage] = useState("");

// Récupération de l'image depuis l'API
if (result.image_base64) {
  setProcessedImage(result.image_base64);
}

// Affichage de l'image
{processedImage && (
  <div className="processed-image-preview">
    <div className="preview-label">Model Input:</div>
    <img src={processedImage} alt="Processed drawing" />
  </div>
)}
```

### 2. ML Server (ml_server.py)
```python
# Conversion de l'image en base64
buffered = BytesIO()
image.save(buffered, format="PNG")
img_str = base64.b64encode(buffered.getvalue()).decode()

# Retour dans la réponse
return PredictionResponse(
    predicted_index=predicted_index,
    confidence_percentage=round(confidence, 2),
    image_base64=f"data:image/png;base64,{img_str}"
)
```

### 3. CSS (Canvas.css)
```css
.processed-image-preview {
  position: absolute;
  top: 120px;
  right: 40px;
  background: white;
  border: 3px solid #1a1a1a;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 6px 6px 0px #1a1a1a;
  animation: slideInRight 0.4s;
}

.processed-image-preview img {
  width: 120px;
  height: 120px;
  border: 2px solid #1a1a1a;
  image-rendering: pixelated; /* Voir les pixels */
}
```

---

## 🚀 Comment Tester

### Étape 1: Lancer le ML Server
```bash
cd Quick_Draw/ml-server
python ml_server.py
```

### Étape 2: Lancer le Frontend
```bash
cd Quick_Draw/frontend-v2
npm run dev
```

### Étape 3: Dessiner
1. Ouvrir `http://localhost:5173`
2. Aller à la page Canvas
3. Dessiner quelque chose
4. **👀 Regarder en haut à droite** → Vous verrez l'image 64x64

---

## 🔍 Comprendre l'Image

### Ce que le Modèle Voit

L'image affichée est **exactement** ce que le modèle CNN reçoit en entrée:

1. **Conversion des deltas en coordonnées absolues**
   ```
   [[dx, dy, pen], ...] → Points absolus (x, y)
   ```

2. **Normalisation**
   ```
   Tous les points sont remappés dans un carré 64x64
   avec un padding de 2px
   ```

3. **Dessin**
   ```
   Fond blanc (255) + traits noirs (0)
   Épaisseur: 2px
   ```

### Exemple Visuel

**Votre dessin sur canvas:**
```
Grande résolution (ex: 1920x1080)
Couleur: noir (#1a1a1a)
Épaisseur: 5px
```

**Image du modèle (64x64):**
```
██████        ← Pomme stylisée
██████████     
████  ████
████  ████
  ██████
```

---

## 💡 Utilité de Cette Visualisation

### 1. Débogage
✅ Vérifier que le dessin est bien converti
✅ Voir si le trait est trop fin/épais
✅ Détecter des problèmes de normalisation

### 2. Compréhension
✅ Comprendre ce que "voit" le modèle
✅ Expliquer pourquoi certaines prédictions sont fausses
✅ Améliorer la qualité des dessins

### 3. Feedback Visuel
✅ L'utilisateur voit ce qui est analysé
✅ Plus de transparence
✅ Expérience éducative

---

## 🎯 Cas d'Usage

### Dessin Trop Petit
**Symptôme:** L'image 64x64 montre un dessin minuscule dans un coin

**Solution:** Dessiner plus grand sur le canvas

### Dessin Incomplet
**Symptôme:** L'image 64x64 ne montre qu'une partie du dessin

**Solution:** Vérifier que tous les traits sont connectés

### Normalisation Incorrecte
**Symptôme:** L'image 64x64 est déformée ou coupée

**Solution:** Vérifier le code de `vector_to_image()` dans ml_server.py

---

## 📱 Version Mobile

Sur mobile, l'image s'affiche en bas à droite (au-dessus des boutons):

```
┌──────────────────────┐
│                      │
│   [Votre dessin]     │
│                      │
│                      │
│  [I see Apple]       │
│            ┌────┐    │
│  [Clear]   │IMG │    │
│  [Done]    └────┘    │
└──────────────────────┘
```

---

## 🔧 Configuration Avancée

### Changer la Taille d'Affichage

Dans `Canvas.css`:
```css
.processed-image-preview img {
  width: 150px;   /* Au lieu de 120px */
  height: 150px;
}
```

### Désactiver l'Image

Dans `Canvas.jsx`:
```javascript
// Commenter cette section:
{processedImage && (
  <div className="processed-image-preview">
    ...
  </div>
)}
```

### Changer la Position

Dans `Canvas.css`:
```css
.processed-image-preview {
  top: 120px;    /* Vertical */
  right: 40px;   /* Horizontal */
  /* Essayez: left: 40px; pour mettre à gauche */
}
```

---

## 🐛 Problèmes Courants

### L'image n'apparaît pas
**Vérifier:**
1. Le ML Server est bien lancé
2. La console (F12) ne montre pas d'erreurs
3. `result.image_base64` existe bien dans la réponse API

### L'image est floue
**Normal!** C'est une image 64x64 agrandie à 120px.
Le `image-rendering: pixelated` est volontaire pour voir les pixels.

### L'image ne correspond pas au dessin
**Vérifier:**
1. Le format des données envoyées: `[[dx, dy, pen], ...]`
2. La fonction `vector_to_image()` dans ml_server.py
3. Les logs du ML Server pour voir les erreurs

---

## ✨ Améliorations Possibles

### Court terme
- Ajouter un toggle pour montrer/cacher l'image
- Afficher les dimensions (64x64)
- Ajouter un zoom au survol

### Long terme
- Montrer plusieurs étapes de preprocessing
- Overlay des activations du CNN
- Heatmap des zones importantes

---

## 📊 Performance

**Impact sur les performances:**
- ✅ Négligeable (l'image est déjà générée pour le modèle)
- ✅ Transfert base64 léger (~5-10KB)
- ✅ Pas de ralentissement visible

---

## 🎉 Résumé

✅ **Fonctionnalité ajoutée:** Visualisation de l'image d'entrée
✅ **Position:** Haut droite (desktop) / Bas droite (mobile)
✅ **Activation:** Automatique quand vous dessinez
✅ **Modèles supportés:** CNN et LSTM
✅ **Format:** Image 64x64 en PNG base64

**Pour tester:** Dessinez quelque chose et regardez en haut à droite! 🎨

---

**Fichiers modifiés:**
- ✅ Canvas.jsx (état + affichage)
- ✅ ml_server.py (génération image base64)
- ✅ Canvas.css (déjà prêt)

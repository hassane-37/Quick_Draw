import requests
from pathlib import Path

# URL de votre API
API_URL = "http://127.0.0.1:8000/predict"

# Chemin vers une image de test (modifiez selon votre dossier)
# Par exemple, prenez une image du dossier doodle
test_image_path = r"C:\Users\ainar\.cache\kagglehub\datasets\ashishjangra27\doodle-dataset\versions\1\doodle\airplane\4503614502469632.png"


# Vérifier que l'image existe
if Path(test_image_path).exists():
    # Envoyer la requête
    with open(test_image_path, "rb") as f:
        files = {"file": f}
        response = requests.post(API_URL, files=files)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error response text: {response.text}")
else:
    print(f"Image non trouvée: {test_image_path}")
    print("\nModifiez le chemin dans test_api.py pour pointer vers une image existante.")

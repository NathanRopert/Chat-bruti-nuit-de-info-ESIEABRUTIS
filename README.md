# Chat-bruti 🤪

Un chatbot complètement à côté de la plaque, philosophe du dimanche et délicieusement inutile !

## 🎯 Description

Chat-bruti est un chatbot qui ne répond jamais vraiment à vos questions. Au lieu de cela, il sublime vos interrogations, les détourne avec panache, ou part dans des digressions absurdes. C'est un compagnon de conversation délicieusement inutile mais passionnément vivant !

## ✨ Fonctionnalités

- 🤔 **Avatar animé** avec expressions faciales qui changent selon les réponses
- 🎭 **Système d'humeur** : Philosophe, Poète raté, Confus, Dormeur, Inspiré
- 📊 **Statistiques absurdes** : Questions ignorées, sujets détournés, digressions philosophiques
- 🧙 **Mode Philosophe du dimanche** avec fond animé
- 🏆 **Système de badges** et compétences absurdes
- ⚙️ **Personnalisation** : Nom, personnalité, avatar
- 🎉 **Easter eggs** cachés partout !

## 🚀 Installation et Lancement

### Prérequis

- Docker et Docker Compose installés
- Ou Python 3.11+ avec pip

### Méthode 1 : Avec Docker Compose (Recommandé)

1. **Cloner ou télécharger le projet**

2. **Lancer l'application avec Docker Compose :**
   ```bash
   docker-compose up --build
   ```

3. **Télécharger le modèle Ollama :**
   
   **Sur Linux/Mac :**
   ```bash
   chmod +x setup-ollama.sh
   ./setup-ollama.sh
   ```
   
   **Sur Windows :**
   ```cmd
   setup-ollama.bat
   ```
   
   **Ou manuellement :**
   ```bash
   docker exec -it chat-bruti-nuit-de-info-ESIEABRUTIS-ollama-1 ollama pull gemma3:270m
   ```
   *(Note : Le nom du conteneur peut varier, utilisez `docker ps` pour trouver le bon nom)*

4. **Accéder à l'application :**
   - Ouvrez votre navigateur à l'adresse : `http://localhost:5000`

### Méthode 2 : Avec Docker uniquement

1. **Construire l'image :**
   ```bash
   docker build -t chat-bruti .
   ```

2. **Lancer le conteneur :**
   ```bash
   docker run -d -p 5000:5000 --name chat-bruti chat-bruti
   ```

3. **Assurez-vous qu'Ollama est accessible** (sur votre machine ou dans un autre conteneur)

### Méthode 3 : Sans Docker (Développement local) ⚡ RAPIDE

**Si Docker ne fonctionne pas, utilisez cette méthode :**

1. **Installer les dépendances :**
   ```bash
   pip install -r requirements.txt
   ```
   
   Ou si vous utilisez un environnement virtuel :
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # ou
   source venv/bin/activate  # Linux/Mac
   pip install -r requirements.txt
   ```

2. **Installer et lancer Ollama :**
   - Téléchargez Ollama depuis [ollama.ai](https://ollama.ai/download)
   - Installez et lancez Ollama (il devrait démarrer automatiquement)
   - Vérifiez qu'Ollama fonctionne : ouvrez `http://localhost:11434` dans votre navigateur
   - Téléchargez le modèle : 
     ```bash
     ollama pull gemma3:270m
     ```

3. **Lancer l'application :**
   ```bash
   python main.py
   ```

4. **Accéder à l'application :**
   - Ouvrez votre navigateur à l'adresse : `http://localhost:5000`

## 🛠️ Configuration

### Variables d'environnement

- `OLLAMA_HOST` : URL du serveur Ollama (par défaut : `http://localhost:11434`)
- `FLASK_ENV` : Environnement Flask (`development` ou `production`)

### Modifier le modèle Ollama

Pour utiliser un autre modèle, modifiez la variable `model_name` dans `main.py` :

```python
model_name = "gemma3:270m"  # Remplacez par votre modèle préféré
```

Puis téléchargez le modèle avec :
```bash
ollama pull nom-du-modele
```

## 🎮 Utilisation

1. **Posez une question** dans la zone de saisie
2. **Observez** Chat-bruti l'ignorer avec panache
3. **Explorez** les statistiques en cliquant sur 📊
4. **Activez** le mode Philosophe avec 🧙
5. **Personnalisez** le bot via ⚙️
6. **Découvrez** les easter eggs cachés !

## 🐳 Commandes Docker utiles

### Arrêter l'application
```bash
docker-compose down
```

### Voir les logs
```bash
docker-compose logs -f
```

### Redémarrer l'application
```bash
docker-compose restart
```

### Reconstruire l'image
```bash
docker-compose build --no-cache
```

### Accéder au shell du conteneur
```bash
docker exec -it chat-bruti-nuit-de-info-ESIEABRUTIS-chat-bruti-1 /bin/bash
```

### Vérifier les modèles Ollama disponibles
```bash
docker exec -it chat-bruti-nuit-de-info-ESIEABRUTIS-ollama-1 ollama list
```

## 🐛 Dépannage

### Erreur "unable to get image" ou "dockerDesktopLinuxEngine"

**Sur Windows :**
- **Docker Desktop n'est pas lancé** : Ouvrez Docker Desktop et attendez qu'il soit complètement démarré (icône Docker dans la barre des tâches)
- Vérifiez que Docker Desktop est bien installé
- Redémarrez Docker Desktop si nécessaire
- Vérifiez que Docker fonctionne : `docker ps` (doit afficher une liste, même vide)

**Sur Linux :**
- Vérifiez que le service Docker est lancé : `sudo systemctl status docker`
- Si nécessaire, démarrez Docker : `sudo systemctl start docker`

### L'application ne se lance pas

- Vérifiez que le port 5000 n'est pas déjà utilisé
- Vérifiez les logs : `docker-compose logs`
- Vérifiez que Docker est bien lancé : `docker ps`

### Le chatbot ne répond pas

- Vérifiez qu'Ollama est bien lancé : `docker ps`
- Vérifiez que le modèle est téléchargé : 
  ```bash
  docker exec -it chat-bruti-nuit-de-info-ESIEABRUTIS-ollama-1 ollama list
  ```
- Vérifiez les logs Ollama : `docker-compose logs ollama`
- Vérifiez les logs de l'application : `docker-compose logs chat-bruti`

### Erreur de connexion à Ollama

- Si Ollama est dans Docker, vérifiez que les conteneurs sont sur le même réseau
- Vérifiez la variable `OLLAMA_HOST` dans `docker-compose.yml`
- Vérifiez que le conteneur Ollama répond : 
  ```bash
  docker exec -it chat-bruti-nuit-de-info-ESIEABRUTIS-ollama-1 curl http://localhost:11434/api/tags
  ```

### Le modèle n'est pas trouvé

- Téléchargez le modèle manuellement :
  ```bash
  docker exec -it chat-bruti-nuit-de-info-ESIEABRUTIS-ollama-1 ollama pull gemma3:270m
  ```
- Vérifiez que le nom du modèle dans `main.py` correspond au modèle téléchargé

## 📝 Structure du projet

```
Chat-bruti-nuit-de-info-ESIEABRUTIS/
├── main.py                 # Application Flask principale
├── requirements.txt        # Dépendances Python
├── Dockerfile              # Configuration Docker
├── docker-compose.yml      # Configuration Docker Compose
├── .dockerignore           # Fichiers ignorés par Docker
├── README.md              # Ce fichier
├── templates/
│   └── index.html         # Interface utilisateur
└── static/
    ├── style.css          # Styles CSS
    └── script.js          # Logique JavaScript
```

## 🎨 Personnalisation

Le bot peut être personnalisé via l'interface :
- **Nom** : Changez le nom du bot
- **Personnalité** : Choisissez parmi 5 personnalités
- **Avatar** : Sélectionnez parmi 6 emojis

Les modifications sont sauvegardées dans le localStorage du navigateur.

## 🏆 Badges à débloquer

- 🥇 **Maître de la digression** : Ignorez 10 questions
- 🥇 **Roi du hors-sujet** : 20 réponses complètement à côté
- 🥇 **Philosophe confirmé** : 15 digressions philosophiques

## 🎉 Easter Eggs

Découvrez les easter eggs cachés :
- Konami Code : ↑↑↓↓←→←→BA
- Clics multiples sur le logo
- Triple-clic sur le titre
- Ctrl+Shift+B pour le mode BRUTI
- Et bien d'autres...

## 📄 Licence

Ce projet a été créé pour la Nuit de l'Info - Défi Chat'bruti.

## 👥 Auteurs

Équipe ESIEABRUTIS

---

**Prêt à vous CHAT-llenger ? 😉**


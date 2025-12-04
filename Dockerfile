FROM python:3.11-slim

WORKDIR /app

# Copier les fichiers de dépendances
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste de l'application
COPY . .

# Exposer le port Flask
EXPOSE 5000

# Variables d'environnement
ENV FLASK_APP=main.py
ENV FLASK_ENV=production

# Commande pour lancer l'application
CMD ["python", "main.py"]


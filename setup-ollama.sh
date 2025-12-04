#!/bin/bash

# Script pour télécharger le modèle Ollama nécessaire

echo "📥 Téléchargement du modèle gemma3:270m..."

# Vérifier si Ollama est accessible
if command -v ollama &> /dev/null; then
    ollama pull gemma3:270m
    echo "✅ Modèle téléchargé avec succès !"
elif docker ps | grep -q ollama; then
    echo "🐳 Ollama détecté dans Docker, téléchargement du modèle..."
    CONTAINER_NAME=$(docker ps --format "{{.Names}}" | grep ollama | head -n 1)
    docker exec -it $CONTAINER_NAME ollama pull gemma3:270m
    echo "✅ Modèle téléchargé avec succès !"
else
    echo "❌ Ollama n'est pas accessible. Assurez-vous qu'Ollama est installé et lancé."
    exit 1
fi


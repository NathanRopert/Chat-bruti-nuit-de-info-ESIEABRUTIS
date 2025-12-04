@echo off
REM Script Windows pour télécharger le modèle Ollama nécessaire

echo 📥 Telechargement du modele gemma3:270m...

REM Vérifier si Ollama est accessible
where ollama >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    ollama pull gemma3:270m
    echo ✅ Modele telecharge avec succes !
    exit /b 0
)

REM Vérifier si Ollama est dans Docker
docker ps | findstr ollama >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo 🐳 Ollama detecte dans Docker, telechargement du modele...
    for /f "tokens=1" %%i in ('docker ps --format "{{.Names}}" ^| findstr ollama') do (
        docker exec -it %%i ollama pull gemma3:270m
        echo ✅ Modele telecharge avec succes !
        exit /b 0
    )
)

echo ❌ Ollama n'est pas accessible. Assurez-vous qu'Ollama est installe et lance.
exit /b 1


$(document).ready(function () {
    // ========== VARIABLES GLOBALES ==========
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let clickCount = 0;
    let easterEggsFound = [];
    let isDarkTheme = true;
    let isPhilosopherMode = false;
    
    // Statistiques
    let stats = {
        ignored: 0,
        detoured: 0,
        philosophy: 0,
        offTopic: 0,
        confusion: 0,
        offTopicSkill: 0,
        poetrySkill: 0
    };
    
    // Configuration du bot
    let botConfig = {
        name: 'Chat-bruti',
        personality: 'philosophe',
        avatar: '🤔'
    };
    
    // Humeurs possibles
    const moods = [
        { emoji: '🤔', name: 'Philosophe', color: '#6366f1' },
        { emoji: '📝', name: 'Poète raté', color: '#8b5cf6' },
        { emoji: '🤯', name: 'Confus', color: '#f59e0b' },
        { emoji: '😴', name: 'Dormeur', color: '#64748b' },
        { emoji: '🎭', name: 'Inspiré', color: '#10b981' }
    ];
    let currentMood = moods[0];
    
    // Citations absurdes
    const quotes = [
        "Les chaussettes sont les nuages de nos pieds.",
        "Si un arbre tombe dans une forêt et que personne n'est là pour l'entendre, est-ce qu'il fait du bruit ? Non, il fait des chips.",
        "La philosophie, c'est comme un sandwich : ça se mange mieux avec de la mayonnaise.",
        "Pourquoi les pingouins ne volent-ils pas ? Parce qu'ils préfèrent nager dans les pensées profondes.",
        "L'existence précède l'essence, mais l'essence précède le petit-déjeuner.",
        "Je pense donc je suis... confus.",
        "Un philosophe du dimanche, c'est comme un week-end : ça ne dure jamais assez longtemps.",
        "Les nuages sont des pensées flottantes qui n'ont pas encore décidé de pleuvoir.",
        "Si la vie vous donne des citrons, demandez-vous pourquoi les citrons existent.",
        "La sagesse, c'est savoir qu'on ne sait rien, mais avec style."
    ];
    
    // Messages de réflexion absurdes
    const thinkingMessages = [
        "Je médite sur l'existence des chaussettes...",
        "Hmm, laissez-moi réfléchir à la vacuité du vide...",
        "Je contemple la profondeur de cette question... inexistante.",
        "Un instant, je dois consulter mes pensées profondes...",
        "Je médite sur la signification de... attendez, j'ai oublié la question.",
        "Laissez-moi philosopher sur cette interrogation... ou pas.",
        "Je réfléchis intensément... à autre chose.",
        "Un moment, je dois digresser mentalement..."
    ];
    
    // Tags possibles pour les messages
    const messageTags = {
        'philosophie': 'Philosophe',
        'recette': 'Cuisine détournée',
        'heure': 'Temps ignoré',
        'technique': 'Aide ignorée',
        'simple': 'Question simple ignorée',
        'serieuse': 'Sérieux évité',
        'absurde': 'Absurdité maximale'
    };
    
    // ========== INITIALISATION ==========
    init();
    
    function init() {
        loadBotConfig();
        setupEventListeners();
        setupCharCounter();
        setupParticles();
        setupConfetti();
        updateStatsDisplay();
        updateAvatar();
        showRandomQuote();
        setInterval(showRandomQuote, 30000); // Citation toutes les 30 secondes
    }
    
    // ========== CONFIGURATION DES ÉCOUTEURS ==========
    function setupEventListeners() {
        // Envoi de message
        $('#send-btn').click(sendMessage);
        $('#user-input').keypress(function (e) {
            if (e.which === 13 && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Boutons
        $('#logo-easter-egg').click(handleLogoClick);
        $('#attach-btn').click(handleAttachClick);
        $('#theme-btn').click(toggleTheme);
        $('#settings-btn').click(() => $('#settings-modal').addClass('active'));
        $('#philosopher-mode-btn').click(togglePhilosopherMode);
        $('#stats-btn').click(() => $('#stats-sidebar').toggleClass('open'));
        $('#close-stats').click(() => $('#stats-sidebar').removeClass('open'));
        $('#save-settings').click(saveSettings);
        
        // Konami Code
        $(document).keydown(handleKonamiCode);
        
        // Double-clic sur le header
        $('.app-header').dblclick(handleHeaderDoubleClick);
        
        // Triple-clic sur le titre
        let titleClickCount = 0;
        $('#bot-name').click(function() {
            titleClickCount++;
            setTimeout(() => {
                if (titleClickCount === 3) {
                    if (!easterEggsFound.includes('title')) {
                        easterEggsFound.push('title');
                        $(this).addClass('rainbow');
                        appendMessage('bot', "Vous avez activé le mode arc-en-ciel ! 🌈");
                    }
                }
                titleClickCount = 0;
            }, 500);
        });
        
        // Combinaison de touches secrète (Ctrl+Shift+B)
        $(document).keydown(function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'B') {
                activateBrutiMode();
            }
        });
        
        // Fermeture des modales
        $('.close-modal').click(function() {
            $(this).closest('.easter-modal').removeClass('active');
        });
        
        // Sélection d'avatar
        $('.avatar-option').click(function() {
            $('.avatar-option').removeClass('active');
            $(this).addClass('active');
        });
    }
    
    // ========== COMPTEUR DE CARACTÈRES ==========
    function setupCharCounter() {
        $('#user-input').on('input', function() {
            const length = $(this).val().length;
            $('#char-count').text(`${length} / 2000`);
            
            if (length > 1800) {
                $('#char-count').css('color', 'var(--error)');
            } else if (length > 1500) {
                $('#char-count').css('color', 'var(--warning)');
            } else {
                $('#char-count').css('color', 'var(--text-secondary)');
            }
            
            // Easter egg : taper exactement 42 caractères
            if (length === 42) {
                showEasterEgg('42', "La réponse à la vie, l'univers et le reste ! 🎉");
            }
            
            // Easter egg : taper "bruti" plusieurs fois
            const text = $(this).val().toLowerCase();
            const brutiCount = (text.match(/bruti/g) || []).length;
            if (brutiCount >= 5 && !easterEggsFound.includes('bruti5')) {
                easterEggsFound.push('bruti5');
                showEasterEgg('bruti5', "Vous aimez vraiment dire 'bruti' ! 🤪");
            }
        });
    }
    
    // ========== ENVOI DE MESSAGE ==========
    function sendMessage() {
        const message = $('#user-input').val().trim();
        if (message === '') return;
        
        // Analyser le type de question
        const questionType = analyzeQuestion(message);
        updateStats(questionType);
        
        // Changer l'humeur selon le type de question
        changeMood(questionType);
        
        appendMessage('user', message, questionType);
        $('#user-input').val('');
        $('#char-count').text('0 / 2000');
        
        // Animation de réflexion
        showThinkingAnimation();
        
        // Délai aléatoire pour simuler la réflexion
        setTimeout(function () {
            hideThinkingAnimation();
            $.ajax({
                url: '/chat',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ message: message }),
                success: function (response) {
                    const botResponse = response.response;
                    const responseType = analyzeResponse(botResponse);
                    appendMessage('bot', botResponse, responseType);
                    updateStats(responseType);
                    changeMood(responseType);
                    triggerReaction(responseType);
                },
                error: function () {
                    appendMessage('bot', "Désolé, une erreur s'est produite. Mon cerveau a peut-être besoin d'une mise à jour...", 'error');
                }
            });
        }, 800 + Math.random() * 2000);
    }
    
    // ========== ANALYSE DES QUESTIONS ==========
    function analyzeQuestion(message) {
        const lower = message.toLowerCase();
        if (lower.includes('heure') || lower.includes('time') || lower.includes('quel heure')) {
            return 'heure';
        }
        if (lower.includes('recette') || lower.includes('cuisine') || lower.includes('gâteau') || lower.includes('manger')) {
            return 'recette';
        }
        if (lower.includes('python') || lower.includes('code') || lower.includes('programme') || lower.includes('aide technique')) {
            return 'technique';
        }
        if (lower.includes('comment') || lower.includes('pourquoi') || lower.includes('qu\'est-ce')) {
            return 'serieuse';
        }
        if (message.length < 20) {
            return 'simple';
        }
        return 'philosophie';
    }
    
    function analyzeResponse(response) {
        const lower = response.toLowerCase();
        if (lower.includes('philosoph') || lower.includes('existence') || lower.includes('essence')) {
            return 'philosophie';
        }
        if (lower.includes('chaussette') || lower.includes('nuage') || lower.includes('pingouin')) {
            return 'absurde';
        }
        return 'offTopic';
    }
    
    // ========== AJOUT DE MESSAGE ==========
    function appendMessage(sender, text, type = null) {
        const avatar = sender === 'user' ? '👤' : botConfig.avatar;
        const className = sender;
        const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        // Supprimer la section de bienvenue si c'est le premier message utilisateur
        if (sender === 'user') {
            $('.welcome-section').fadeOut(300);
        }
        
        // Déterminer les tags
        let tags = [];
        if (type && messageTags[type]) {
            tags.push(messageTags[type]);
        }
        if (sender === 'bot' && type === 'philosophie') {
            tags.push('Digression');
        }
        
        const tagsHtml = tags.length > 0 ? `<div class="message-tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : '';
        
        const html = `
            <div class="message ${className}">
                <div class="message-avatar">
                    <div class="avatar-circle">${avatar}</div>
                </div>
                <div class="message-content">
                    <div class="message-text">${escapeHtml(text)}</div>
                    <div class="message-time">${time}</div>
                    ${tagsHtml}
                </div>
            </div>
        `;
        
        $('#chat-box').append(html);
        scrollToBottom();
        
        // Mettre à jour l'avatar du message
        if (sender === 'bot') {
            $('#message-avatar').text(botConfig.avatar);
        }
    }
    
    // ========== ÉCHAPPER LE HTML ==========
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    // ========== SCROLL ==========
    function scrollToBottom() {
        const chatBox = $('#chat-box')[0];
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    // ========== ANIMATION DE RÉFLEXION ==========
    function showThinkingAnimation() {
        const messages = thinkingMessages;
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        $('#typing-indicator').html(`
            <span>${randomMessage}</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `).addClass('active');
        
        // Animation de l'avatar
        const avatarFace = $('#avatar-face');
        avatarFace.addClass('thinking');
        $('#avatar-mouth').addClass('confused');
    }
    
    function hideThinkingAnimation() {
        $('#typing-indicator').removeClass('active').html('');
        $('#avatar-face').removeClass('thinking');
        $('#avatar-mouth').removeClass('confused');
    }
    
    // ========== SYSTÈME D'HUMEUR ==========
    function changeMood(type) {
        let newMood;
        switch(type) {
            case 'philosophie':
                newMood = moods[0]; // Philosophe
                break;
            case 'recette':
                newMood = moods[1]; // Poète raté
                break;
            case 'technique':
                newMood = moods[2]; // Confus
                break;
            case 'simple':
                newMood = moods[3]; // Dormeur
                break;
            case 'absurde':
                newMood = moods[4]; // Inspiré
                break;
            default:
                newMood = moods[Math.floor(Math.random() * moods.length)];
        }
        
        if (newMood.name !== currentMood.name) {
            currentMood = newMood;
            updateMoodDisplay();
            updateAvatarExpression();
        }
    }
    
    function updateMoodDisplay() {
        $('#mood-text').text(currentMood.name);
        $('#avatar-mood').html(`${currentMood.emoji} ${currentMood.name}`);
    }
    
    function updateAvatarExpression() {
        const avatarFace = $('#avatar-face');
        const mouth = $('#avatar-mouth');
        
        avatarFace.removeClass('thinking confused happy sleeping');
        mouth.removeClass('smile confused sleep');
        
        switch(currentMood.name) {
            case 'Philosophe':
                avatarFace.addClass('thinking');
                break;
            case 'Confus':
                avatarFace.addClass('confused');
                mouth.addClass('confused');
                break;
            case 'Dormeur':
                avatarFace.addClass('sleeping');
                mouth.addClass('sleep');
                break;
            case 'Inspiré':
                avatarFace.addClass('happy');
                mouth.addClass('smile');
                break;
        }
    }
    
    // ========== STATISTIQUES ==========
    function updateStats(type) {
        switch(type) {
            case 'heure':
            case 'recette':
            case 'technique':
            case 'simple':
            case 'serieuse':
                stats.ignored++;
                break;
            case 'philosophie':
                stats.philosophy++;
                stats.confusion += 2;
                break;
            case 'absurde':
            case 'offTopic':
                stats.offTopic++;
                stats.offTopicSkill += 3;
                stats.poetrySkill += 1;
                break;
        }
        
        stats.detoured++;
        stats.confusion = Math.min(stats.confusion, 100);
        stats.offTopicSkill = Math.min(stats.offTopicSkill, 100);
        stats.poetrySkill = Math.min(stats.poetrySkill, 100);
        
        updateStatsDisplay();
        checkBadges();
    }
    
    function updateStatsDisplay() {
        $('#stat-ignored').text(stats.ignored);
        $('#stat-detoured').text(stats.detoured);
        $('#stat-philosophy').text(stats.philosophy);
        $('#stat-off-topic').text(stats.offTopic);
        
        $('#confusion-progress').css('width', stats.confusion + '%');
        $('#offtopic-progress').css('width', stats.offTopicSkill + '%');
        $('#poetry-progress').css('width', stats.poetrySkill + '%');
    }
    
    function checkBadges() {
        if (stats.ignored >= 10 && !easterEggsFound.includes('badge-ignored')) {
            unlockBadge('Maître de la digression');
            easterEggsFound.push('badge-ignored');
        }
        if (stats.offTopic >= 20 && !easterEggsFound.includes('badge-offtopic')) {
            unlockBadge('Roi du hors-sujet');
            easterEggsFound.push('badge-offtopic');
        }
        if (stats.philosophy >= 15 && !easterEggsFound.includes('badge-philosophy')) {
            unlockBadge('Philosophe confirmé');
            easterEggsFound.push('badge-philosophy');
        }
    }
    
    function unlockBadge(badgeName) {
        $(`.badge:contains("${badgeName}")`).addClass('unlocked').removeClass('locked');
        triggerConfetti();
        appendMessage('bot', `🏆 Badge débloqué : ${badgeName} !`, 'absurde');
    }
    
    // ========== RÉACTIONS VISUELLES ==========
    function triggerReaction(type) {
        if (type === 'absurde' || type === 'offTopic') {
            // Petite animation de confettis pour les réponses absurdes
            if (Math.random() > 0.7) {
                triggerConfetti();
            }
        }
    }
    
    // ========== CITATIONS ==========
    function showRandomQuote() {
        if (Math.random() > 0.5) {
            const quote = quotes[Math.floor(Math.random() * quotes.length)];
            $('#quote-text').text(`"${quote}"`);
            $('#quote-container').addClass('show');
            setTimeout(() => {
                $('#quote-container').removeClass('show');
            }, 5000);
        }
    }
    
    // ========== MODE PHILOSOPHE ==========
    function togglePhilosopherMode() {
        isPhilosopherMode = !isPhilosopherMode;
        if (isPhilosopherMode) {
            $('body').addClass('philosopher-mode');
            $('#philosopher-mode-btn').addClass('active');
            toggleParticles();
            appendMessage('bot', "🧙 Mode Philosophe du Dimanche activé ! Laissez-moi vous parler de l'existence des nuages...", 'philosophie');
        } else {
            $('body').removeClass('philosopher-mode');
            $('#philosopher-mode-btn').removeClass('active');
        }
    }
    
    // ========== PERSONNALISATION ==========
    function saveSettings() {
        botConfig.name = $('#bot-name-input').val() || 'Chat-bruti';
        botConfig.personality = $('#personality-select').val();
        botConfig.avatar = $('.avatar-option.active').data('avatar') || '🤔';
        
        $('#bot-name').text(botConfig.name);
        $('#avatar-name-display').text(botConfig.name);
        $('#message-avatar').text(botConfig.avatar);
        updateAvatar();
        
        saveBotConfig();
        $('#settings-modal').removeClass('active');
        
        appendMessage('bot', `Parfait ! Je suis maintenant ${botConfig.name}, ${botConfig.personality} !`, 'absurde');
    }
    
    function loadBotConfig() {
        const saved = localStorage.getItem('botConfig');
        if (saved) {
            botConfig = JSON.parse(saved);
            $('#bot-name-input').val(botConfig.name);
            $('#personality-select').val(botConfig.personality);
            $(`.avatar-option[data-avatar="${botConfig.avatar}"]`).addClass('active');
        }
        updateAvatar();
    }
    
    function saveBotConfig() {
        localStorage.setItem('botConfig', JSON.stringify(botConfig));
    }
    
    function updateAvatar() {
        $('#bot-name').text(botConfig.name);
        $('#avatar-name-display').text(botConfig.name);
        $('#message-avatar').text(botConfig.avatar);
        updateMoodDisplay();
    }
    
    // ========== EASTER EGGS ==========
    function handleLogoClick() {
        clickCount++;
        if (clickCount === 5) {
            clickCount = 0;
            $('#logo-modal').addClass('active');
            if (!easterEggsFound.includes('logo')) {
                easterEggsFound.push('logo');
            }
        } else {
            $(this).css('transform', `rotate(${clickCount * 72}deg) scale(1.1)`);
            setTimeout(() => {
                $(this).css('transform', '');
            }, 300);
        }
    }
    
    function handleAttachClick() {
        appendMessage('bot', "📎 Ah, vous voulez joindre quelque chose ? Moi, je préfère joindre mes pensées... qui sont déjà parties ailleurs !", 'absurde');
    }
    
    function handleKonamiCode(e) {
        konamiCode.push(e.key);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.length === konamiSequence.length) {
            let match = true;
            for (let i = 0; i < konamiSequence.length; i++) {
                if (konamiCode[i] !== konamiSequence[i]) {
                    match = false;
                    break;
                }
            }
            
            if (match) {
                activateKonamiMode();
                konamiCode = [];
            }
        }
    }
    
    function activateKonamiMode() {
        if (!easterEggsFound.includes('konami')) {
            easterEggsFound.push('konami');
        }
        $('#konami-modal').addClass('active');
        $('body').addClass('rainbow');
        toggleParticles();
        triggerConfetti();
        
        setTimeout(() => {
            appendMessage('bot', "🎉 Mode Konami activé ! Vous avez découvert le code secret !", 'absurde');
        }, 1000);
    }
    
    function handleHeaderDoubleClick() {
        if (!easterEggsFound.includes('header')) {
            easterEggsFound.push('header');
            $('.app-header').addClass('shake');
            setTimeout(() => {
                $('.app-header').removeClass('shake');
            }, 500);
            appendMessage('bot', "Pourquoi secouez-vous ma tête ? 😵", 'confus');
        }
    }
    
    function activateBrutiMode() {
        if (!easterEggsFound.includes('bruti')) {
            easterEggsFound.push('bruti');
            $('body').addClass('shake');
            setTimeout(() => {
                $('body').removeClass('shake');
            }, 500);
            appendMessage('bot', "BRUTI MODE ACTIVÉ ! 🤪💥🎉", 'absurde');
            triggerConfetti();
            toggleParticles();
        }
    }
    
    function showEasterEgg(id, message) {
        if (!easterEggsFound.includes(id)) {
            easterEggsFound.push(id);
            appendMessage('bot', message, 'absurde');
        }
    }
    
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        if (isDarkTheme) {
            $('body').removeClass('light-theme');
            $('#theme-btn').text('🌙');
        } else {
            $('body').addClass('light-theme');
            $('#theme-btn').text('☀️');
        }
    }
    
    // ========== PARTICULES ==========
    function setupParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
                ctx.fill();
            }
        }
        
        function initParticles() {
            particles = [];
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle());
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            
            animationId = requestAnimationFrame(animate);
        }
        
        window.toggleParticles = function() {
            if ($('#particles-canvas').hasClass('active')) {
                $('#particles-canvas').removeClass('active');
                cancelAnimationFrame(animationId);
            } else {
                $('#particles-canvas').addClass('active');
                initParticles();
                animate();
            }
        };
    }
    
    // ========== CONFETTIS ==========
    function setupConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let confetti = [];
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        class Confetti {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = Math.random() * 3 + 2;
                this.size = Math.random() * 5 + 3;
                this.color = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)];
                this.rotation = Math.random() * 360;
                this.rotationSpeed = (Math.random() - 0.5) * 10;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.1; // Gravité
                this.rotation += this.rotationSpeed;
                
                if (this.y > canvas.height) {
                    this.reset();
                    this.y = -10;
                }
            }
            
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();
            }
        }
        
        window.triggerConfetti = function() {
            confetti = [];
            for (let i = 0; i < 50; i++) {
                confetti.push(new Confetti());
            }
            
            $('#confetti-canvas').addClass('active');
            
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                let active = false;
                confetti.forEach(c => {
                    c.update();
                    c.draw();
                    if (c.y < canvas.height) active = true;
                });
                
                if (active) {
                    requestAnimationFrame(animate);
                } else {
                    $('#confetti-canvas').removeClass('active');
                }
            }
            
            animate();
        };
    }
});

// Base de datos de preguntas
const quizData = {
    historia: [
        { q: "¿Qué tratado puso fin a la Guerra de los Treinta Años en 1648?", options: ["Paz de Westfalia", "Tratado de Versalles", "Tratado de Tordesillas", "Paz de Utrecht"], answer: 0 },
        { q: "¿En qué año cayó el Imperio Romano de Occidente?", options: ["476 d.C.", "1453 d.C.", "395 d.C.", "711 d.C."], answer: 0 },
        { q: "¿Qué batalla en 1815 supuso la derrota definitiva de Napoleón?", options: ["Austerlitz", "Waterloo", "Trafalgar", "Leipzig"], answer: 1 },
        { q: "¿Quién fue el primer emperador de la dinastía Han en China?", options: ["Qin Shi Huang", "Sun Tzu", "Liu Bang", "Wu Zetian"], answer: 2 },
        { q: "¿Cómo se conocía a la red comercial que conectaba China con Europa?", options: ["Ruta del Ámbar", "Ruta de las Especias", "Ruta de la Plata", "Ruta de la Seda"], answer: 3 }
    ],
    geografia: [
        { q: "¿Cuál es el país más grande del mundo sin salida al mar?", options: ["Mongolia", "Kazajistán", "Bolivia", "Chad"], answer: 1 },
        { q: "¿Qué estrecho separa Asia de América del Norte?", options: ["Estrecho de Bering", "Estrecho de Magallanes", "Estrecho de Ormuz", "Estrecho de Gibraltar"], answer: 0 },
        { q: "¿En qué cordillera se encuentra el monte Aconcagua?", options: ["Montañas Rocosas", "Los Andes", "Himalaya", "Alpes"], answer: 1 },
        { q: "¿Cuál es la capital de Australia?", options: ["Sídney", "Melbourne", "Canberra", "Perth"], answer: 2 },
        { q: "¿Qué país africano no fue colonizado por europeos en el siglo XIX?", options: ["Kenia", "Etiopía", "Nigeria", "Angola"], answer: 1 }
    ],
    ciencias: [
        { q: "¿Quién formuló el Principio de Incertidumbre?", options: ["Niels Bohr", "Erwin Schrödinger", "Werner Heisenberg", "Albert Einstein"], answer: 2 },
        { q: "¿Cuál es el gas más abundante en la atmósfera terrestre?", options: ["Oxígeno", "Dióxido de Carbono", "Nitrógeno", "Argón"], answer: 2 },
        { q: "¿Qué partícula subatómica descubrió J.J. Thomson en 1897?", options: ["Protón", "Electrón", "Neutrón", "Positrón"], answer: 1 },
        { q: "¿Cuál es el símbolo químico del oro?", options: ["Ag", "Fe", "Au", "Cu"], answer: 2 },
        { q: "En termodinámica, ¿qué magnitud mide el grado de desorden de un sistema?", options: ["Entropía", "Entalpía", "Energía libre", "Temperatura"], answer: 0 }
    ],
    entretenimiento: [
        { q: "¿Qué película surcoreana ganó el Óscar a la Mejor Película en 2020?", options: ["Minari", "Oldboy", "Parásitos", "El viaje de Chihiro"], answer: 2 },
        { q: "En tenis, ¿cuántos torneos componen el Grand Slam?", options: ["3", "4", "5", "6"], answer: 1 },
        { q: "¿Qué compositor escribió la Novena Sinfonía estando casi sordo?", options: ["Mozart", "Bach", "Wagner", "Beethoven"], answer: 3 },
        { q: "¿Quién creó la aclamada serie 'Los Soprano'?", options: ["David Chase", "Vince Gilligan", "Matthew Weiner", "Aaron Sorkin"], answer: 0 },
        { q: "¿Qué pintor español es famoso por la obra 'El Guernica'?", options: ["Salvador Dalí", "Joan Miró", "Pablo Picasso", "Diego Velázquez"], answer: 2 }
    ]
};

// 1. ENCAPSULACIÓN DE ESTADO
const appState = {
    questions: [],
    currentIndex: 0,
    score: 0,
    timer: null,
    fxContainer: null // Cacheo del selector de partículas
};

const appContainer = document.querySelector('#app-container');

function clearApp() {
    appContainer.innerHTML = '';
    // Uso del selector cacheado para evitar consultas repetidas al DOM
    if (appState.fxContainer) {
        appState.fxContainer.remove();
        appState.fxContainer = null;
    }
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function init() {
    renderStartScreen();
    setupDarkModeToggle();
}

function renderStartScreen() {
    clearApp();
    const section = document.createElement('section');
    section.id = 'start-screen';
    section.classList.add('fade-in');

    const btnStart = document.createElement('button');
    btnStart.textContent = 'Empezar Juego';
    btnStart.addEventListener('click', renderCategories);

    section.appendChild(btnStart);
    appContainer.appendChild(section);
}

// 2. DELEGACIÓN DE EVENTOS EN CATEGORÍAS (Eventos)
function renderCategories() {
    clearApp();
    const grid = document.createElement('div');
    grid.classList.add('categories-grid', 'fade-in');

    const themes = [
        { id: 'historia', title: 'Historia', img: 'img/icono_historia.png' },
        { id: 'geografia', title: 'Geografía', img: 'img/icono_geografia.png' },
        { id: 'ciencias', title: 'Ciencias', img: 'img/icono_ciencias.png' },
        { id: 'entretenimiento', title: 'Entretenimiento', img: 'img/icono_entretenimiento.png' }
    ];

    themes.forEach(theme => {
        const figure = document.createElement('figure');
        figure.classList.add('category-card');
        figure.dataset.categoryId = theme.id; // Data attribute para delegación
        
        const img = document.createElement('img');
        img.src = theme.img;
        img.alt = `Imagen de ${theme.title}`;
        
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = theme.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        grid.appendChild(figure);
    });

    // Un único event listener en el contenedor padre
    grid.addEventListener('click', (event) => {
        const targetFigure = event.target.closest('figure.category-card');
        if (!targetFigure || targetFigure.classList.contains('spin-shrink')) return;

        targetFigure.classList.add('spin-shrink');
        const categoryId = targetFigure.dataset.categoryId;
        
        setTimeout(() => {
            startQuiz(categoryId);
        }, 600);
    });

    appContainer.appendChild(grid);
}

function startQuiz(categoryId) {
    appState.questions = shuffleArray(quizData[categoryId]).slice(0, 3);
    appState.currentIndex = 0;
    appState.score = 0;
    renderQuestion();
}

// 3. DELEGACIÓN DE EVENTOS EN RESPUESTAS
function renderQuestion() {
    clearApp();
    if (appState.currentIndex >= appState.questions.length) {
        renderResults();
        return;
    }

    const questionData = appState.questions[appState.currentIndex];
    const quizContainer = document.createElement('section');
    quizContainer.classList.add('quiz-container', 'fade-in');

    const title = document.createElement('h2');
    title.textContent = `Pregunta ${appState.currentIndex + 1} de 3`;

    const timerDisplay = document.createElement('p');
    timerDisplay.classList.add('timer-text');
    let timeLeft = 60;
    timerDisplay.textContent = `⏳ Tiempo restante: ${timeLeft}s`;

    const questionText = document.createElement('p');
    questionText.textContent = questionData.q;
    questionText.classList.add('question-text');

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    questionData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.dataset.index = index; // Data attribute para identificar la opción
        optionsContainer.appendChild(btn);
    });

    // Un único event listener para todas las opciones
    optionsContainer.addEventListener('click', (event) => {
        if (event.target.tagName !== 'BUTTON' || optionsContainer.dataset.locked === 'true') return;
        optionsContainer.dataset.locked = 'true'; // Prevenir múltiples clicks

        const selectedIndex = parseInt(event.target.dataset.index);
        handleAnswer(selectedIndex, questionData.answer, optionsContainer, timerDisplay);
    });

    quizContainer.appendChild(title);
    quizContainer.appendChild(timerDisplay);
    quizContainer.appendChild(questionText);
    quizContainer.appendChild(optionsContainer);
    appContainer.appendChild(quizContainer);

    appState.timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `⏳ Tiempo restante: ${timeLeft}s`;
        
        if (timeLeft <= 10) {
            timerDisplay.classList.add('timer-warning');
        }

        if (timeLeft <= 0) {
            clearInterval(appState.timer);
            timerDisplay.textContent = "¡Tiempo agotado!";
            optionsContainer.dataset.locked = 'true';
            handleAnswer(-1, questionData.answer, optionsContainer, timerDisplay);
        }
    }, 1000);
}

function handleAnswer(selectedIndex, correctIndex, containerNode, timerDisplay) {
    clearInterval(appState.timer);

    const buttons = containerNode.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    
    buttons[correctIndex].classList.add('btn-correct');

    if (selectedIndex === correctIndex) {
        appState.score++;
        timerDisplay.textContent = "¡Correcto!";
    } else {
        if (selectedIndex !== -1) {
            buttons[selectedIndex].classList.add('btn-incorrect');
            timerDisplay.textContent = "¡Incorrecto!";
        }
    }

    setTimeout(() => {
        appState.currentIndex++;
        renderQuestion();
    }, 2000);
}

function renderResults() {
    clearApp();

    const resultsContainer = document.createElement('section');
    resultsContainer.classList.add('quiz-container', 'fade-in');

    const title = document.createElement('h2');
    title.textContent = '¡Quiz Terminado!';

    const scoreText = document.createElement('p');
    scoreText.textContent = `Has acertado ${appState.score} de 3 preguntas.`;
    scoreText.classList.add('score-text');

    const feedback = document.createElement('p');
    feedback.classList.add('feedback-text');
    
    if (appState.score === 3) {
        feedback.textContent = '¡Qué genio! Puntuación perfecta.';
        feedback.classList.add('text-perfect');
        createParticles('confetti-piece', 40);
    } else if (appState.score === 2) {
        feedback.textContent = '¡Muy bien! Tienes un nivel estupendo.';
        feedback.classList.add('text-good');
        createParticles('star-piece', 25);
    } else if (appState.score === 1) {
        feedback.textContent = 'Bueno... podría haber sido peor.';
        feedback.classList.add('text-regular');
        createParticles('leaf-piece', 20);
    } else {
        feedback.textContent = '¡Qué pena! Toca repasar un poco más.';
        feedback.classList.add('text-bad');
        createParticles('rain-drop', 60);
    }

    const btnRestart = document.createElement('button');
    btnRestart.textContent = 'Volver al Menú';
    btnRestart.addEventListener('click', renderCategories);

    resultsContainer.appendChild(title);
    resultsContainer.appendChild(scoreText);
    resultsContainer.appendChild(feedback);
    resultsContainer.appendChild(btnRestart);
    appContainer.appendChild(resultsContainer);
}

// 4. UNIFICACIÓN DE SISTEMAS DE PARTÍCULAS
function createParticles(className, count) {
    const container = document.createElement('div');
    container.id = 'fx-container';
    appState.fxContainer = container; // Guardar referencia en el estado global

    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.classList.add(className);
        
        // Agregar modificadores aleatorios compartidos
        piece.classList.add(`p-${Math.floor(Math.random() * 10) + 1}`);
        piece.classList.add(`d-${Math.floor(Math.random() * 4) + 1}`);
        
        // El confeti requiere lógica de color adicional
        if (className === 'confetti-piece') {
            piece.classList.add(`c-${Math.floor(Math.random() * 4) + 1}`);
        }
        
        container.appendChild(piece);
    }
    document.body.appendChild(container);
}

function setupDarkModeToggle() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'm' || event.key === 'M') {
            document.body.classList.toggle('dark-mode');
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
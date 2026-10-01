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

// Variables globales
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;

const appContainer = document.querySelector('#app-container');

function clearApp() {
    appContainer.innerHTML = '';
    const fx = document.getElementById('fx-container');
    if (fx) fx.remove();
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

// PANTALLA 1: Inicio
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

// PANTALLA 2: Categorías
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
        
        const img = document.createElement('img');
        img.src = theme.img;
        img.alt = `Imagen de ${theme.title}`;
        
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = theme.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        
        // EVENTO con animación de giro
        figure.addEventListener('click', (event) => {
            // Añadir clase de giro y encogimiento al elemento pulsado
            const targetFigure = event.currentTarget;
            targetFigure.classList.add('spin-shrink');
            
            // Retrasar el inicio del quiz para que dé tiempo a ver la animación
            setTimeout(() => {
                startQuiz(theme.id);
            }, 600); // 600ms coinciden con el tiempo de animación en CSS
        });
        
        grid.appendChild(figure);
    });

    appContainer.appendChild(grid);
}

function startQuiz(categoryId) {
    currentQuestions = shuffleArray(quizData[categoryId]).slice(0, 3);
    currentQuestionIndex = 0;
    score = 0;
    renderQuestion();
}

// PANTALLA 3: Pregunta
function renderQuestion() {
    clearApp();
    if (currentQuestionIndex >= currentQuestions.length) {
        renderResults();
        return;
    }

    const questionData = currentQuestions[currentQuestionIndex];
    const quizContainer = document.createElement('section');
    quizContainer.classList.add('quiz-container', 'fade-in');

    const title = document.createElement('h2');
    title.textContent = `Pregunta ${currentQuestionIndex + 1} de 3`;

    const timerDisplay = document.createElement('p');
    timerDisplay.classList.add('timer-text');
    let timeLeft = 60;
    timerDisplay.textContent = `⏳ Tiempo restante: ${timeLeft}s`;

    const questionText = document.createElement('p');
    questionText.textContent = questionData.q;
    questionText.classList.add('question-text');

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    const optionButtons = [];

    questionData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.addEventListener('click', () => handleAnswer(index, questionData.answer, optionButtons, timerDisplay));
        optionsContainer.appendChild(btn);
        optionButtons.push(btn);
    });

    quizContainer.appendChild(title);
    quizContainer.appendChild(timerDisplay);
    quizContainer.appendChild(questionText);
    quizContainer.appendChild(optionsContainer);
    appContainer.appendChild(quizContainer);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `⏳ Tiempo restante: ${timeLeft}s`;
        
        if (timeLeft <= 10) {
            timerDisplay.classList.add('timer-warning');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "¡Tiempo agotado!";
            handleAnswer(-1, questionData.answer, optionButtons, timerDisplay);
        }
    }, 1000);
}

function handleAnswer(selectedIndex, correctIndex, buttons, timerDisplay) {
    clearInterval(timerInterval);

    buttons.forEach(btn => btn.disabled = true);
    buttons[correctIndex].classList.add('btn-correct');

    if (selectedIndex === correctIndex) {
        score++;
        timerDisplay.textContent = "¡Correcto!";
    } else {
        if (selectedIndex !== -1) {
            buttons[selectedIndex].classList.add('btn-incorrect');
            timerDisplay.textContent = "¡Incorrecto!";
        }
    }

    setTimeout(() => {
        currentQuestionIndex++;
        renderQuestion();
    }, 2000);
}

// PANTALLA 4: Resultados y 4 Tipos de Animaciones
function renderResults() {
    clearApp();

    const resultsContainer = document.createElement('section');
    resultsContainer.classList.add('quiz-container', 'fade-in');

    const title = document.createElement('h2');
    title.textContent = '¡Quiz Terminado!';

    const scoreText = document.createElement('p');
    scoreText.textContent = `Has acertado ${score} de 3 preguntas.`;
    scoreText.classList.add('score-text');

    const feedback = document.createElement('p');
    feedback.classList.add('feedback-text');
    
    // Asignación de animaciones y clases de color según nota
    if (score === 3) {
        feedback.textContent = '¡Qué genio! Puntuación perfecta.';
        feedback.classList.add('text-perfect'); // En lugar de style.color
        createConfetti();
    } else if (score === 2) {
        feedback.textContent = '¡Muy bien! Tienes un nivel estupendo.';
        feedback.classList.add('text-good'); // En lugar de style.color
        createStars();
    } else if (score === 1) {
        feedback.textContent = 'Bueno... podría haber sido peor.';
        feedback.classList.add('text-regular'); // En lugar de style.color
        createLeaves();
    } else {
        feedback.textContent = '¡Qué pena! Toca repasar un poco más.';
        feedback.classList.add('text-bad'); // En lugar de style.color
        createRain();
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

// ----------------------------------------------------
// CREADORES DE PARTÍCULAS DOM (4 Niveles)
// ----------------------------------------------------
function createConfetti() {
    const container = document.createElement('div');
    container.id = 'fx-container';
    for (let i = 0; i < 40; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');
        piece.classList.add(`c-${Math.floor(Math.random() * 4) + 1}`);
        piece.classList.add(`p-${Math.floor(Math.random() * 10) + 1}`);
        piece.classList.add(`d-${Math.floor(Math.random() * 4) + 1}`);
        container.appendChild(piece);
    }
    document.body.appendChild(container);
}

function createStars() {
    const container = document.createElement('div');
    container.id = 'fx-container';
    for (let i = 0; i < 25; i++) {
        const star = document.createElement('div');
        star.classList.add('star-piece');
        star.classList.add(`p-${Math.floor(Math.random() * 10) + 1}`);
        star.classList.add(`d-${Math.floor(Math.random() * 4) + 1}`);
        container.appendChild(star);
    }
    document.body.appendChild(container);
}

function createLeaves() {
    const container = document.createElement('div');
    container.id = 'fx-container';
    for (let i = 0; i < 20; i++) {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf-piece');
        leaf.classList.add(`p-${Math.floor(Math.random() * 10) + 1}`);
        leaf.classList.add(`d-${Math.floor(Math.random() * 4) + 1}`);
        container.appendChild(leaf);
    }
    document.body.appendChild(container);
}

function createRain() {
    const container = document.createElement('div');
    container.id = 'fx-container';
    for (let i = 0; i < 60; i++) {
        const drop = document.createElement('div');
        drop.classList.add('rain-drop');
        drop.classList.add(`p-${Math.floor(Math.random() * 10) + 1}`);
        drop.classList.add(`d-${Math.floor(Math.random() * 4) + 1}`);
        container.appendChild(drop);
    }
    document.body.appendChild(container);
}

// Modo Oscuro
function setupDarkModeToggle() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'm' || event.key === 'M') {
            document.body.classList.toggle('dark-mode');
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
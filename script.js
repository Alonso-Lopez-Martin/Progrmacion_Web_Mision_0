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

// Variables de estado global
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Referencias del DOM
const appContainer = document.querySelector('#app-container');

// Inicializador de la aplicación
function init() {
    renderStartScreen();
    setupDarkModeToggle();
}

// Pantalla de inicio
function renderStartScreen() {
    appContainer.innerHTML = ''; 

    const section = document.createElement('section');
    section.id = 'start-screen';

    const btnStart = document.createElement('button');
    btnStart.textContent = 'Empezar Juego';
    btnStart.addEventListener('click', renderCategories);

    section.appendChild(btnStart);
    appContainer.appendChild(section);
}

// Pantalla de selección de categoría
function renderCategories() {
    appContainer.innerHTML = '';
    
    const grid = document.createElement('div');
    grid.classList.add('categories-grid');

    const themes = [
        { id: 'historia', title: 'Historia', img: 'img/historia.png' },
        { id: 'geografia', title: 'Geografía', img: '' },
        { id: 'ciencias', title: 'Ciencias', img: '' },
        { id: 'entretenimiento', title: 'Entretenimiento', img: '' }
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

        figure.addEventListener('click', () => startQuiz(theme.id));
        grid.appendChild(figure);
    });

    appContainer.appendChild(grid);
}

// Preparar y empezar el quiz
function startQuiz(categoryId) {
    const allQuestions = [...quizData[categoryId]];
    currentQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 3);
    currentQuestionIndex = 0;
    score = 0;
    renderQuestion();
}

// Mostrar pregunta actual
function renderQuestion() {
    appContainer.innerHTML = '';
    
    if (currentQuestionIndex >= currentQuestions.length) {
        renderResults();
        return;
    }

    const questionData = currentQuestions[currentQuestionIndex];
    const quizContainer = document.createElement('section');
    quizContainer.classList.add('quiz-container');

    const title = document.createElement('h2');
    title.textContent = `Pregunta ${currentQuestionIndex + 1} de 3`;
    
    const questionText = document.createElement('p');
    questionText.textContent = questionData.q;
    questionText.style.marginBottom = '1.5rem';
    questionText.style.fontSize = '1.2rem';

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    questionData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.addEventListener('click', () => handleAnswer(index, questionData.answer));
        optionsContainer.appendChild(btn);
    });

    quizContainer.appendChild(title);
    quizContainer.appendChild(questionText);
    quizContainer.appendChild(optionsContainer);
    appContainer.appendChild(quizContainer);
}

// Evaluar respuesta
function handleAnswer(selectedIndex, correctIndex) {
    if (selectedIndex === correctIndex) {
        score++;
    }
    currentQuestionIndex++;
    renderQuestion();
}

// Pantalla final
function renderResults() {
    appContainer.innerHTML = '';

    const resultsContainer = document.createElement('section');
    resultsContainer.classList.add('quiz-container');

    const title = document.createElement('h2');
    title.textContent = '¡Quiz Terminado!';

    const scoreText = document.createElement('p');
    scoreText.textContent = `Has acertado ${score} de 3 preguntas.`;
    scoreText.style.fontSize = '1.2rem';
    scoreText.style.marginBottom = '1rem';

    const feedback = document.createElement('p');
    feedback.style.fontWeight = 'bold';
    feedback.style.marginBottom = '2rem';
    
    if (score === 3) feedback.textContent = '¡Qué genio! Puntuación perfecta.';
    else if (score === 2) feedback.textContent = '¡Muy bien! Tienes buen nivel.';
    else if (score === 1) feedback.textContent = 'Bueno... podría haber sido peor.';
    else feedback.textContent = '¡Qué pena! Toca repasar un poco más.';

    const btnRestart = document.createElement('button');
    btnRestart.textContent = 'Volver al Menú';
    btnRestart.addEventListener('click', renderCategories);

    resultsContainer.appendChild(title);
    resultsContainer.appendChild(scoreText);
    resultsContainer.appendChild(feedback);
    resultsContainer.appendChild(btnRestart);
    appContainer.appendChild(resultsContainer);
}

// Configuración del Modo Oscuro
function setupDarkModeToggle() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'm' || event.key === 'M') {
            document.body.classList.toggle('dark-mode');
        }
    });
}

// Iniciar app al cargar el DOM
document.addEventListener('DOMContentLoaded', init);
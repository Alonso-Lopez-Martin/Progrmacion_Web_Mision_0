// Base de datos con todas las preguntas separadas por categorías
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

// Objeto para guardar el estado actual de la partida
const appState = {
    questions: [],      
    currentIndex: 0,    
    score: 0,           
    timer: null,        
    fxContainer: null   
};

const appContainer = document.querySelector('#app-container');


// Función de ayuda para crear etiquetas HTML más rápido y no repetir código
function createNode(tag, options = {}) {
    const el = document.createElement(tag);
    if (options.id) el.id = options.id;
    if (options.classes) el.className = options.classes; 
    if (options.text) el.textContent = options.text;
    if (options.src) el.src = options.src;
    if (options.alt) el.alt = options.alt;
    if (options.dataset) {
        Object.entries(options.dataset).forEach(([key, value]) => {
            el.dataset[key] = value;
        });
    }
    return el;
}

// Limpiamos el main borrando los hijos uno a uno para evitar usar innerHTML
function clearApp() {
    while (appContainer.firstChild) {
        appContainer.removeChild(appContainer.firstChild);
    }
    
    // Si hay partículas en pantalla, las borramos también
    if (appState.fxContainer) {
        appState.fxContainer.remove();
        appState.fxContainer = null;
    }
}

// Barajamos el array usando Fisher-Yates para que sea totalmente aleatorio
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Inicializar la app
function init() {
    renderStartScreen();
    setupDarkModeToggle();
}

// Pantalla de inicio
function renderStartScreen() {
    clearApp();
    const section = createNode('section', { id: 'start-screen', classes: 'fade-in' });
    const btnStart = createNode('button', { text: 'Empezar Juego' });
    
    btnStart.addEventListener('click', renderCategories);
    section.appendChild(btnStart);
    appContainer.appendChild(section);
}

// Pantalla para elegir el tema
function renderCategories() {
    clearApp();
    const grid = createNode('div', { classes: 'categories-grid fade-in' });

    const themes = [
        { id: 'historia', title: 'Historia', img: 'img/icono_historia.png' },
        { id: 'geografia', title: 'Geografía', img: 'img/icono_geografia.png' },
        { id: 'ciencias', title: 'Ciencias', img: 'img/icono_ciencias.png' },
        { id: 'entretenimiento', title: 'Entretenimiento', img: 'img/icono_entretenimiento.png' }
    ];

    themes.forEach(theme => {
        const figure = createNode('figure', { classes: 'category-card', dataset: { categoryId: theme.id } });
        const img = createNode('img', { src: theme.img, alt: `Imagen de ${theme.title}` });
        const figcaption = createNode('figcaption', { text: theme.title });

        figure.appendChild(img);
        figure.appendChild(figcaption);
        grid.appendChild(figure);
    });

    // Usamos delegación de eventos en el grid para no poner un listener a cada imagen
    grid.addEventListener('click', (event) => {
        const targetFigure = event.target.closest('figure.category-card');
        
        // Evitamos que hagan doble clic mientras hace la animación
        if (!targetFigure || targetFigure.classList.contains('spin-shrink')) return;

        targetFigure.classList.add('spin-shrink'); 
        const categoryId = targetFigure.dataset.categoryId;
        
        // Esperamos a que termine de girar para cargar el quiz
        setTimeout(() => startQuiz(categoryId), 600);
    });

    appContainer.appendChild(grid);
}

// Preparamos los datos antes de mostrar la primera pregunta
function startQuiz(categoryId) {
    const categoryData = quizData[categoryId];
    
    // Por si acaso hay un fallo en los datos, evitamos que la app se rompa
    if (!categoryData || !Array.isArray(categoryData) || categoryData.length === 0) {
        console.error(`Error: Datos no encontrados para ${categoryId}`);
        renderCategories(); 
        return;
    }

    // Cogemos 3 preguntas o menos si la categoría no tiene suficientes
    const questionsToPlay = Math.min(3, categoryData.length);
    
    appState.questions = shuffleArray(categoryData).slice(0, questionsToPlay);
    appState.currentIndex = 0;
    appState.score = 0;
    renderQuestion();
}

// Mostramos la pregunta actual
function renderQuestion() {
    clearApp();
    
    // Si ya no quedan preguntas, pasamos a los resultados
    if (appState.currentIndex >= appState.questions.length) {
        renderResults();
        return;
    }

    const questionData = appState.questions[appState.currentIndex];
    const quizContainer = createNode('section', { classes: 'quiz-container fade-in' });
    const title = createNode('h2', { text: `Pregunta ${appState.currentIndex + 1} de ${appState.questions.length}` });
    
    let timeLeft = 60;
    const timerDisplay = createNode('p', { classes: 'timer-text', text: `⏳ Tiempo restante: ${timeLeft}s` });
    const questionText = createNode('p', { classes: 'question-text', text: questionData.q });
    const optionsContainer = createNode('div', { classes: 'options-container' });

    // Creamos los botones con las respuestas
    questionData.options.forEach((opt, index) => {
        const btn = createNode('button', { text: opt, dataset: { index: index } });
        optionsContainer.appendChild(btn);
    });

    // Usamos una variable para bloquear el clic y que no respondan dos veces
    let isAnswerLocked = false; 

    // Delegación de eventos para los botones de respuesta
    optionsContainer.addEventListener('click', (event) => {
        if (event.target.tagName !== 'BUTTON' || isAnswerLocked) return;
        
        isAnswerLocked = true;
        const selectedIndex = parseInt(event.target.dataset.index);
        handleAnswer(selectedIndex, questionData.answer, optionsContainer, timerDisplay);
    });

    quizContainer.appendChild(title);
    quizContainer.appendChild(timerDisplay);
    quizContainer.appendChild(questionText);
    quizContainer.appendChild(optionsContainer);
    appContainer.appendChild(quizContainer);

    // Arrancamos el cronómetro
    appState.timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `⏳ Tiempo restante: ${timeLeft}s`;
        
        // Efecto visual cuando quedan 10 segundos
        if (timeLeft <= 10) timerDisplay.classList.add('timer-warning');

        if (timeLeft <= 0) {
            clearInterval(appState.timer);
            timerDisplay.textContent = "¡Tiempo agotado!";
            isAnswerLocked = true; // Bloqueamos opciones si se acaba el tiempo
            handleAnswer(-1, questionData.answer, optionsContainer, timerDisplay);
        }
    }, 1000);
}

// Comprueba la respuesta y pone los colores
function handleAnswer(selectedIndex, correctIndex, containerNode, timerDisplay) {
    // Paramos el tiempo lo primero
    clearInterval(appState.timer);

    const buttons = containerNode.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    
    // Pintamos la correcta en verde
    buttons[correctIndex].classList.add('btn-correct');

    if (selectedIndex === correctIndex) {
        appState.score++;
        timerDisplay.textContent = "¡Correcto!";
    } else if (selectedIndex !== -1) {
        // Si ha fallado y llegó a pulsar una, la ponemos en rojo
        buttons[selectedIndex].classList.add('btn-incorrect');
        timerDisplay.textContent = "¡Incorrecto!";
    }

    // Esperamos 2 segundos para ver los colores antes de cambiar de pantalla
    setTimeout(() => {
        appState.currentIndex++;
        renderQuestion();
    }, 2000);
}

// Pantalla final con los resultados
function renderResults() {
    clearApp();

    const resultsContainer = createNode('section', { classes: 'quiz-container fade-in' });
    const title = createNode('h2', { text: '¡Quiz Terminado!' });
    const scoreText = createNode('p', { classes: 'score-text', text: `Has acertado ${appState.score} de ${appState.questions.length} preguntas.` });
    
    const feedback = getFeedbackAndRenderParticles();
    
    const btnRestart = createNode('button', { text: 'Volver al Menú' });
    btnRestart.addEventListener('click', renderCategories);

    resultsContainer.appendChild(title);
    resultsContainer.appendChild(scoreText);
    resultsContainer.appendChild(feedback);
    resultsContainer.appendChild(btnRestart);
    appContainer.appendChild(resultsContainer);
}

// Muestra el texto final según la nota y llama a las partículas
function getFeedbackAndRenderParticles() {
    const feedbackNode = createNode('p', { classes: 'feedback-text' });
    const ratio = appState.score / appState.questions.length;

    if (ratio === 1) {
        feedbackNode.textContent = '¡Qué genio! Puntuación perfecta.';
        feedbackNode.classList.add('text-perfect');
        mountParticles('confetti-piece', 40);
    } else if (ratio >= 0.66) {
        feedbackNode.textContent = '¡Muy bien! Tienes un nivel estupendo.';
        feedbackNode.classList.add('text-good');
        mountParticles('star-piece', 25);
    } else if (ratio > 0) {
        feedbackNode.textContent = 'Bueno... podría haber sido peor.';
        feedbackNode.classList.add('text-regular');
        mountParticles('leaf-piece', 20);
    } else {
        feedbackNode.textContent = '¡Qué pena! Toca repasar un poco más.';
        feedbackNode.classList.add('text-bad');
        mountParticles('rain-drop', 60);
    }
    
    return feedbackNode;
}


// Generamos los divs de los efectos en memoria antes de pasarlos al HTML
function generateParticlesFragment(className, count) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const piece = createNode('div', { classes: className });
        
        piece.classList.add(`p-${Math.floor(Math.random() * 10) + 1}`);
        piece.classList.add(`d-${Math.floor(Math.random() * 4) + 1}`);
        
        if (className === 'confetti-piece') {
            piece.classList.add(`c-${Math.floor(Math.random() * 4) + 1}`);
        }
        fragment.appendChild(piece);
    }
    return fragment;
}

// Pintamos las partículas en el HTML y nos lo guardamos en appState
function mountParticles(className, count) {
    const container = createNode('div', { id: 'fx-container' });
    const fragment = generateParticlesFragment(className, count); 
    
    container.appendChild(fragment);
    appState.fxContainer = container; 
    document.body.appendChild(container);
}

// Evento para activar y desactivar el modo oscuro con la letra M
function setupDarkModeToggle() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'm' || event.key === 'M') {
            document.body.classList.toggle('dark-mode');
        }
    });
}

// Cargar todo cuando el HTML esté listo
document.addEventListener('DOMContentLoaded', init);
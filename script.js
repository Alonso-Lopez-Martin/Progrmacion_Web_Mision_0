// ==========================================
// 1. BASE DE DATOS Y ESTADO GLOBAL
// ==========================================

// Base de datos estática de preguntas organizada por categorías.
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

// Objeto global de estado: Mantiene un seguimiento centralizado de la partida actual
const appState = {
    questions: [],      // Array de preguntas barajadas de la partida activa
    currentIndex: 0,    // Índice de la pregunta mostrada en pantalla
    score: 0,           // Puntuación acumulada
    timer: null,        // Referencia del intervalo del reloj para limpiarlo de forma segura
    fxContainer: null   // Referencia cacheada del contenedor de partículas (animaciones)
};

const appContainer = document.querySelector('#app-container');

// ==========================================
// 2. FUNCIONES HELPER (Utilidades)
// ==========================================

/**
 * Función genérica para crear elementos del DOM.
 * Aplica principios DRY (Don't Repeat Yourself) reduciendo la redundancia.
 */
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

/**
 * Purga el contenedor principal para montar la siguiente vista.
 * Destruye también los efectos visuales para evitar acumulación de nodos huérfanos.
 */
function clearApp() {
    appContainer.innerHTML = '';
    if (appState.fxContainer) {
        appState.fxContainer.remove();
        appState.fxContainer = null;
    }
}

/**
 * Algoritmo matemático Fisher-Yates para barajar arrays aleatoriamente.
 * Evita el sesgo estadístico de sort(Math.random).
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Inicia el flujo lógico general al cargar la página
function init() {
    renderStartScreen();
    setupDarkModeToggle();
}

// ==========================================
// 3. GENERADORES DE VISTAS (Lógica de Navegación)
// ==========================================

// Vista 1: Pantalla inicial de bienvenida
function renderStartScreen() {
    clearApp();
    const section = createNode('section', { id: 'start-screen', classes: 'fade-in' });
    const btnStart = createNode('button', { text: 'Empezar Juego' });
    
    btnStart.addEventListener('click', renderCategories);
    section.appendChild(btnStart);
    appContainer.appendChild(section);
}

// Vista 2: Selector visual de temas
function renderCategories() {
    clearApp();
    const grid = createNode('div', { classes: 'categories-grid fade-in' });

    const themes = [
        { id: 'historia', title: 'Historia', img: '' },
        { id: 'geografia', title: 'Geografía', img: '' },
        { id: 'ciencias', title: 'Ciencias', img: '' },
        { id: 'entretenimiento', title: 'Entretenimiento', img: '' }
    ];

    // Construcción del DOM para cada tarjeta
    themes.forEach(theme => {
        const figure = createNode('figure', { classes: 'category-card', dataset: { categoryId: theme.id } });
        const img = createNode('img', { src: theme.img, alt: `Imagen de ${theme.title}` });
        const figcaption = createNode('figcaption', { text: theme.title });

        figure.appendChild(img);
        figure.appendChild(figcaption);
        grid.appendChild(figure);
    });

    // Delegación de Eventos: Un solo listener en el contenedor padre
    // en lugar de múltiples listeners, uno por tarjeta.
    grid.addEventListener('click', (event) => {
        const targetFigure = event.target.closest('figure.category-card');
        
        // Prevención de errores y clicks dobles durante la animación
        if (!targetFigure || targetFigure.classList.contains('spin-shrink')) return;

        targetFigure.classList.add('spin-shrink'); // Inicia animación de salida
        const categoryId = targetFigure.dataset.categoryId;
        
        // Espera a que termine la transición CSS (600ms) antes de cargar la pregunta
        setTimeout(() => startQuiz(categoryId), 600);
    });

    appContainer.appendChild(grid);
}

// Lógica intermedia: Configuración de la partida con programación defensiva
function startQuiz(categoryId) {
    const categoryData = quizData[categoryId];
    
    // Control de fallos: Si los datos de la categoría están dañados, retrocede al menú
    if (!categoryData || !Array.isArray(categoryData) || categoryData.length === 0) {
        console.error(`Error: Datos no encontrados para ${categoryId}`);
        renderCategories(); 
        return;
    }

    // Calcula el número de preguntas garantizando que nunca se pidan más de las que hay
    const questionsToPlay = Math.min(3, categoryData.length);
    
    // Inicializa el estado para la nueva partida
    appState.questions = shuffleArray(categoryData).slice(0, questionsToPlay);
    appState.currentIndex = 0;
    appState.score = 0;
    renderQuestion();
}

// Vista 3: Interfaz principal del cuestionario
function renderQuestion() {
    clearApp();
    
    // Condición de finalización de partida
    if (appState.currentIndex >= appState.questions.length) {
        renderResults();
        return;
    }

    const questionData = appState.questions[appState.currentIndex];
    const quizContainer = createNode('section', { classes: 'quiz-container fade-in' });
    const title = createNode('h2', { text: `Pregunta ${appState.currentIndex + 1} de ${appState.questions.length}` });
    
    // Estructura del temporizador
    let timeLeft = 60;
    const timerDisplay = createNode('p', { classes: 'timer-text', text: `⏳ Tiempo restante: ${timeLeft}s` });
    const questionText = createNode('p', { classes: 'question-text', text: questionData.q });
    const optionsContainer = createNode('div', { classes: 'options-container' });

    // Renderizado dinámico de los botones de respuesta
    questionData.options.forEach((opt, index) => {
        const btn = createNode('button', { text: opt, dataset: { index: index } });
        optionsContainer.appendChild(btn);
    });

    // Delegación de Eventos en el contenedor de respuestas
    optionsContainer.addEventListener('click', (event) => {
        // Ignorar clicks si no fue en un botón o si ya se ha respondido
        if (event.target.tagName !== 'BUTTON' || optionsContainer.dataset.locked === 'true') return;
        
        optionsContainer.dataset.locked = 'true'; // Bloquea iteraciones futuras
        const selectedIndex = parseInt(event.target.dataset.index);
        handleAnswer(selectedIndex, questionData.answer, optionsContainer, timerDisplay);
    });

    quizContainer.appendChild(title);
    quizContainer.appendChild(timerDisplay);
    quizContainer.appendChild(questionText);
    quizContainer.appendChild(optionsContainer);
    appContainer.appendChild(quizContainer);

    // Motor lógico del tiempo restante
    appState.timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `⏳ Tiempo restante: ${timeLeft}s`;
        
        if (timeLeft <= 10) timerDisplay.classList.add('timer-warning');

        // Finalización por tiempo agotado
        if (timeLeft <= 0) {
            clearInterval(appState.timer);
            timerDisplay.textContent = "¡Tiempo agotado!";
            optionsContainer.dataset.locked = 'true';
            handleAnswer(-1, questionData.answer, optionsContainer, timerDisplay);
        }
    }, 1000);
}

// Validador de respuestas (Invocado por el usuario o por fin de tiempo)
function handleAnswer(selectedIndex, correctIndex, containerNode, timerDisplay) {
    // Parar temporizador inmediatamente para prevenir condiciones de carrera (Race Conditions)
    clearInterval(appState.timer);

    const buttons = containerNode.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    
    // Feedback visual (CSS classes, evadiendo styles inline)
    buttons[correctIndex].classList.add('btn-correct');

    if (selectedIndex === correctIndex) {
        appState.score++;
        timerDisplay.textContent = "¡Correcto!";
    } else if (selectedIndex !== -1) {
        buttons[selectedIndex].classList.add('btn-incorrect');
        timerDisplay.textContent = "¡Incorrecto!";
    }

    // Retraso intencionado para permitir lectura del feedback visual
    setTimeout(() => {
        appState.currentIndex++;
        renderQuestion();
    }, 2000);
}

// Vista 4: Pantalla de estadísticas finales
function renderResults() {
    clearApp();

    const resultsContainer = createNode('section', { classes: 'quiz-container fade-in' });
    const title = createNode('h2', { text: '¡Quiz Terminado!' });
    const scoreText = createNode('p', { classes: 'score-text', text: `Has acertado ${appState.score} de ${appState.questions.length} preguntas.` });
    
    // Delega la inyección de partículas y obtiene el texto de retroalimentación
    const feedback = getFeedbackAndRenderParticles();
    
    const btnRestart = createNode('button', { text: 'Volver al Menú' });
    btnRestart.addEventListener('click', renderCategories);

    resultsContainer.appendChild(title);
    resultsContainer.appendChild(scoreText);
    resultsContainer.appendChild(feedback);
    resultsContainer.appendChild(btnRestart);
    appContainer.appendChild(resultsContainer);
}

// Generador de comentarios en función de métricas relativas
function getFeedbackAndRenderParticles() {
    const feedbackNode = createNode('p', { classes: 'feedback-text' });
    const ratio = appState.score / appState.questions.length;

    // Asignación de clases CSS semánticas e inyección del tipo de partícula
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

// ==========================================
// 4. SISTEMA DE PARTÍCULAS (Responsabilidades Separadas)
// ==========================================

/**
 * Función Pura: Crea los nodos de animación en memoria.
 * Retorna un DocumentFragment para evitar Reflows en el DOM principal.
 */
function generateParticlesFragment(className, count) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const piece = createNode('div', { classes: className });
        
        // Randomización inyectando clases de CSS predefinidas
        piece.classList.add(`p-${Math.floor(Math.random() * 10) + 1}`);
        piece.classList.add(`d-${Math.floor(Math.random() * 4) + 1}`);
        
        if (className === 'confetti-piece') {
            piece.classList.add(`c-${Math.floor(Math.random() * 4) + 1}`);
        }
        fragment.appendChild(piece);
    }
    return fragment;
}

/**
 * Función Impura: Recibe el fragmento de memoria, lo inserta en el DOM real
 * y actualiza el objeto de estado global para que pueda ser rastreado.
 */
function mountParticles(className, count) {
    const container = createNode('div', { id: 'fx-container' });
    const fragment = generateParticlesFragment(className, count); 
    
    container.appendChild(fragment);
    appState.fxContainer = container; 
    document.body.appendChild(container);
}

// ==========================================
// 5. EVENTOS GLOBALES ADICIONALES
// ==========================================

// Habilita el modo oscuro alternando una clase global en el body
function setupDarkModeToggle() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'm' || event.key === 'M') {
            document.body.classList.toggle('dark-mode');
        }
    });
}

// Arranque seguro de la aplicación
document.addEventListener('DOMContentLoaded', init);
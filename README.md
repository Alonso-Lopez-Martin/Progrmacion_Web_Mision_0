# The Quiz Web

Misión M1 · El Despertar del DOM — Web Development I.

## Cómo probarlo
Abre `index.html` en el navegador (o con Live Server). Pulsa «Empezar Juego» y elige una de las cuatro categorías. Tienes 60 segundos para responder cada una de las 3 preguntas. Si el tiempo llega a cero, contará como fallo. Al finalizar, verás una animación distinta según tu nota. 
Tecla secreta: pulsa "m" o "M" en cualquier momento para alternar el modo oscuro.

## Uso de IA
Utilicé Gemini (Google) tanto como asistente de programación para tareas específicas como en calidad de tutor personal para afianzar conceptos técnicos.

Qué delegué y qué hice a mano:
- Delegado a la IA: La redacción de la batería de preguntas del Quiz, la implementación matemática del algoritmo Fisher-Yates, la lógica compleja del temporizador (con su respectivo bloqueo de botones) y la construcción de todas las animaciones, transiciones y sistemas de partículas (lluvia, confeti, hojas, estrellas). También he delegado en la IA algunas tareas de refactorización, sugeridas por la Web Arena para sacar la máxima nota, como por ejemplo: unificar createConfetti, createStars, createLeaves y createRain en una sola función parametrizada, o la creación del event delegation en el contenedor de categorías/opciones en vez de re-registrar listeners en cada render, como ejercicio de patrón alternativo.
- Hecho a mano: Todo el resto del proyecto. Me encargué de estructurar el HTML semántico, diseñar la arquitectura base del CSS, programar la lógica de creación y destrucción de pantallas en el DOM (`clearApp()`, `renderStartScreen`, etc.) y de integrar y adaptar todas las piezas en un único flujo funcional. Además, la implementación del modo oscuro fue desarrollada íntegramente por mí tras pedirle a la IA que me explicara la teoría de cómo estructurarlo utilizando variables CSS, sin que me diera el código final. 
También utilicé la herramienta para resolver mis dudas teóricas sobre la gestión de eventos, pidiéndole que me enseñara cómo funcionan internamente los listeners y cómo evitar fugas de memoria al crear nodos dinámicos.

Prompts clave utilizados:
1. "Hola, quiero añadir un temporizador de 60 segundos y que cuando se acabe el tiempo te lo cuente como respuesta incorrecta y bloquee los botones. También quiero alguna animación al final en el feedback, por ejemplo que llueva si lo has hecho mal o confeti si está perfecto. Hazme las animaciones manipulando el DOM pero sin usar estilos en línea."
2. "Tengo dudas sobre cómo funcionan exactamente los listeners y la gestión de eventos. ¿Me puedes explicar la teoría para entenderlo bien? Además, quiero implementar un modo oscuro pulsando la tecla M, pero no me des el código hecho, explícame la lógica con variables CSS para que pueda programarlo yo mismo."

Proceso de Verificación:
Verifiqué cada bloque generado integrándolo progresivamente en mis archivos fuente. Realicé pruebas manuales exhaustivas de los casos límite, como forzar el temporizador a cero varias veces seguidas para asegurar que no se solaparan los `setInterval`, y comprobé mediante la consola de desarrollo que los eventos no se duplicaban al destruir y recrear las tarjetas de las categorías.

## Autopsia
1. Uso clases CSS (ej. `text-perfect`, `btn-correct`) inyectadas vía `classList.add()` en lugar de manipular `element.style.xxx` directamente desde JS. Descarté aplicar estilos en línea porque mezcla la capa de presentación con la lógica de interacción y rompe el principio de Separation of Concerns.
2. Implementé el algoritmo Fisher-Yates (`shuffleArray`) para seleccionar las preguntas al azar. Descarté el uso común de `array.sort(() => 0.5 - Math.random())` porque es estadísticamente sesgado y no garantiza una distribución verdaderamente aleatoria en motores V8.
3. El reloj se gestiona guardando la referencia en `timerInterval` y ejecutando `clearInterval(timerInterval)` como primera instrucción al evaluar la respuesta. Descarté dejar que el intervalo se limpiara solo al llegar a cero, porque si el usuario pulsaba un botón en los últimos segundos, se generaban condiciones de carrera (race conditions) y bugs visuales al montarse dos pantallas a la vez.
4. Toda la generación del DOM se hace con `document.createElement()`, borrando previamente el contenedor con un helper `clearApp()`. Descarté usar `innerHTML` para estructurar la app porque crear y montar los nodos a mano garantiza un control total sobre los event listeners añadidos a las opciones y evita posibles fugas de memoria.
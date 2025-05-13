const API_URL = '/api/preguntas';
const totalPreguntas = 8;
const intentosMax = 2;

let preguntas = [];
let preguntaActual = 0;
let errores = 0;
let respuestasUsuario = [];

const elPregunta = document.getElementById('pregunta');
const elPrograma = document.getElementById('programa');
const elTip = document.getElementById('tip');
const elContador = document.getElementById('contador');
const elIntentos = document.getElementById('intentos');
const btnSiguiente = document.getElementById('siguiente');
const opcionesContainer = document.getElementById('opciones-container');

// Cargar preguntas
async function cargarPreguntas() {
  respuestasUsuario = [];

  if (cargarProgreso()) {
    mostrarPregunta();
    return;
  }

  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    preguntas = mezclarArray(data).slice(0, totalPreguntas);
    mostrarPregunta();
  } catch (err) {
    console.error('Error al cargar preguntas:', err);
  }
}

//Mostrar una pregunta
function mostrarPregunta() {
  const actual = preguntas[preguntaActual];

  elPregunta.textContent = actual.pregunta;
  elPrograma.textContent = actual.programa;

  // Limpiar opciones anteriores
  opcionesContainer.innerHTML = '';

  // Crear botones dinámicamente
  ['a', 'b', 'c'].forEach(op => {
    const texto = actual[`opcion_${op}`];
    const btn = document.createElement('button');
    btn.className = 'opcion';
    btn.dataset.opcion = op;
    btn.textContent = `${op.toUpperCase()}. ${texto}`;
    btn.onclick = () => verificarRespuesta(op);
    opcionesContainer.appendChild(btn);
  });

  elTip.style.display = actual.info_complementaria ? 'block' : 'none';
  elTip.textContent = actual.info_complementaria
    ? `💡 Pista: ${actual.info_complementaria}`
    : '';

  elContador.textContent = `Pregunta ${preguntaActual + 1} / ${totalPreguntas}`;
  elIntentos.textContent = `Intentos fallidos: ${errores} / ${intentosMax}`;
  btnSiguiente.style.display = 'none';

  guardarProgreso();
}

// Verificar respuesta
function verificarRespuesta(opcionSeleccionada) {
  if (btnSiguiente.style.display === 'block') return;

  const actual = preguntas[preguntaActual];
  const correcta = actual.correcta.toLowerCase();

  respuestasUsuario.push({
    pregunta: actual.pregunta,
    seleccion: opcionSeleccionada,
    correcta: actual.correcta,
    opciones: {
      a: actual.opcion_a,
      b: actual.opcion_b,
      c: actual.opcion_c
    },
    info: actual.info_complementaria
  });

  const botones = document.querySelectorAll('.opcion');
  botones.forEach(btn => {
    const opcion = btn.dataset.opcion;
    btn.disabled = true;
    if (opcion === correcta) {
      btn.classList.add('correcta');
    } else if (opcion === opcionSeleccionada) {
      btn.classList.add('incorrecta');
    }
  });

  if (opcionSeleccionada !== correcta) errores++;

  elIntentos.textContent = `Intentos fallidos: ${errores} / ${intentosMax}`;
  btnSiguiente.style.display = 'block';
}

// Siguiente pregunta
btnSiguiente.addEventListener('click', () => {
  preguntaActual++;

  if (errores >= intentosMax || preguntaActual >= totalPreguntas) {
    mostrarResultados();
  } else {
    mostrarPregunta();
  }
});

// Mostrar resultados
function mostrarResultados() {
  resetProgreso();

  let resultadoHTML = `
    <h2 class="h2juego">¡Juego terminado!</h2>
    <p><strong>Puntaje final:</strong> ${totalPreguntas - errores} / ${totalPreguntas}</p>
    <p><strong>Errores:</strong> ${errores} / ${intentosMax}</p>
    <h3>Resumen de respuestas:</h3>
    <div class="resumen-preguntas">
  `;

  respuestasUsuario.forEach((res, idx) => {
    const correcta = res.correcta.toLowerCase();
    const seleccion = res.seleccion.toLowerCase();

    resultadoHTML += `
      <div class="respuesta-item ${seleccion === correcta ? 'correcta' : 'incorrecta'}">
        <p><strong>${idx + 1}. ${res.pregunta}</strong></p>
        <ul>
          <li>A: ${res.opciones.a}</li>
          <li>B: ${res.opciones.b}</li>
          <li>C: ${res.opciones.c}</li>
        </ul>
        <p>✅ Respuesta correcta: <strong>${correcta.toUpperCase()}</strong></p>
        <p>🧠 Tu respuesta: <strong>${seleccion.toUpperCase()}</strong></p>
        ${res.info ? `<p>💡 Tip: ${res.info}</p>` : ''}
      </div>
    `;
  });

  resultadoHTML += `</div><br><button class='btn-next' onclick="window.location.reload()">Volver a jugar</button>`;
  document.querySelector('.quiz-container').innerHTML = resultadoHTML;
}

// Mezclar preguntas
function mezclarArray(arr) {
  let a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Progreso local
function guardarProgreso() {
  const progreso = {
    preguntaActual,
    errores,
    preguntas
  };
  localStorage.setItem('progresoQuiz', JSON.stringify(progreso));
}

function cargarProgreso() {
  const guardado = localStorage.getItem('progresoQuiz');
  if (guardado) {
    const progreso = JSON.parse(guardado);
    preguntaActual = progreso.preguntaActual;
    errores = progreso.errores;
    preguntas = progreso.preguntas;
    return true;
  }
  return false;
}

function resetProgreso() {
  localStorage.removeItem('progresoQuiz');
}

//Iniciar juego
cargarPreguntas();
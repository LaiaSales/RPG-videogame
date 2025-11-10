const INPUT = document.getElementById('caja-input');
const LISTA = document.getElementById('lista-tareas'); 

// BOTÓN VENTANA MODAL----------------------------------------------------------
let backpack = document.querySelector('#boton-backpack');
let ventana = document.querySelector('#ventana-tareas');
let cerrarVentana = document.querySelector('#cerrar-ventana');

// Abrir 
backpack.addEventListener('click', () =>{
    ventana.style.display = 'block'; 
});

// Cerrar
cerrarVentana.addEventListener('click', () =>{
    ventana.style.display = 'none'; 
});

//ENTRADA DE TAREAS ----------------------------------------------------------
const BOTONADD = document.querySelector('#boton-introducir');

BOTONADD.addEventListener('click', () => {
    //Se crea un elemento de lista <li> que contiene el texto introducido en INPUT
    let CREA = document.createElement('li');
    CREA.innerText = INPUT.value;   

    // Crear BOTÓN CHECK/TAREA COMPLETADA --------------------------
    let CHECK = document.createElement("button");
    CHECK.className = "boton-conseguido";
    CHECK.textContent = "✔";
    CREA.appendChild(CHECK); // Añade el botón conseguido al final del <li>

    // Crear BOTÓN ELIMINAR TAREAS ----------------------------------
    let SPAN = document.createElement("span");
    SPAN.className = "boton-eliminar";
    SPAN.textContent = "Eliminar";
    CREA.appendChild(SPAN);

    // Evento del checkbox para marcar la tarea como completada (!!!!!!)
    // CHECK.addEventListener('checkeado', () => {
    // if (CHECK.checked) {
    //     CREA.classList.add('completada'); // Añade clase 'completada' cuando se marca el checkbox
    // });

    // Evento de botón eliminar
    SPAN.addEventListener('click', () => {
        CREA.remove();
    });

    // Se añade CREA (un <li> que contiene el texto de INPUT) al último elemento [0] de LISTA.
    LISTA.appendChild(CREA);

    // Se borra la tarea introducida en INPUT automáticamente después de añadirla a la lista.
    INPUT.value = ''; 

});

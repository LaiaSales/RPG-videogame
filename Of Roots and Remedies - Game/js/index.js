const canvas = document.querySelector('canvas'); //coje elemento HTML y lo pone dentro de un objeto

// Creamos la constante context (c).
    // Referenciamos el "CANVAS CONTEXT", que es un objeto que nos da toda la API de canvas. Permite crear todo lo que necesitamos para el juego en el canvas.
const c = canvas.getContext('2d');

// Cambiar tamaño de canvas a 16:9 ratio (desktop)
canvas.width = 1075;
canvas.height = 576;

// COLISIONES 1.1 - CREARLAS --------------------------------------------------------------------------------------

// 1) Creamos array para las sub-arrays
const colisionesMapa = []

// 2) Parseamos la ROOT ARRAY (colisiones) en sub-arrays (tantas sub-arrays como filas en el mapa. Cada sub-array representa una fila del mapa. Las FILAS son de 190 tiles (la width del mapa)) y ponemos estas sub-arrays en la array colisionesMapa.

// Añadimos nuevos items a la array colisionesMapa (slice toma un "pedazo" de 190 elementos y push agrega el pedazo (fila) como un nuevo sub-array dentro de colisionesMapa.
for (let i = 0; i < colisiones.length; i += 190) {
    colisionesMapa.push(colisiones.slice(i, 190 + i)) 
    
    // "Recorre la array colsiones hasta el final y a cada iteración del loop suma 190: i (número actual) += 190 (suma 190). Pushea al array colisionesMapa un slice del array colisiones compuesto de i (número actual) a i + 190."

}

// 4) Como tendremos muchos límites en el mapa creamos "const limites" que los almacena. La coordenadas del mapa del punto de inicio del videojuego son const desviacion.
const limites = []
const desviacion = {
    x: -4265, 
    y: -1830, 
}

// Recorremos el mapa en 2D (colisionesMapa) y por cada tile que tenga un valor especial (17343 - colisión) creamos un nuevo objeto Limite, que representa una colisión y lo agregamos al array limites.

//forEach ejecuta una función por cada elemento de un array. "fila" y "símbolo" son nombres que tú defines para representar los ELEMENTOS del array que recorres.

// array.forEach((elemento, índice) => { ... }); El conjunto de elemento y su índice se llama PARÁMETRO.

colisionesMapa.forEach((fila, i) => { //el índex (i) de la fila de colisionesMapa por la que pasa el loop ahora
    fila.forEach((simbolo, j) => { // el índex (j) del tile (símbolo) de la fila por la que pasa el loop ahora
        if (simbolo === 17343) // solo queremos push un Limite si el símbolo por el que pasa el loop es 17343
        limites.push(
            new Limite({ //creas una INSTANCIA de la clase Limite que tiene las propiedades y métodos definidos en la clase Limite
                position: { 
                    x: j * Limite.width + desviacion.x, // Limte.width: 38.4. (índex del símbolo por el que pasa el loop ahora) * (Limite width) + (-3965)
                    y: i * Limite.height + desviacion.y, // (índex de fila por el que pasa el loop ahora) * (height de Limite) + (-1680) -> Esto consigue poner las tiles una encima de otra para que esten en un formato de fila perfecto
                }
            }) 
        ) 
    })
}) 


// RENDERIZAR EL MAPA Y EL JUGADOR - MOVIMIENTO DEL JUGADOR----------------------------------------------------------------------------------------------

// 1) Creamos las Image. Necesitamos crear objetos imagen HTML para usarlo con "drawImage".
    //("Image" viene del API nativo de Javascript)
const Mapa = new Image(); //creamos el objeto imagen del HTML
Mapa.src = './img/RESTORED Of Roots And Remedies NPC.png';

const imagenForeground = new Image(); //creamos el objeto imagen del HTML
imagenForeground.src = './img/foregroundObjects.png';

const imagenJugadorUp = new Image();
imagenJugadorUp.src = './img/walk_up_animation.png'

const imagenJugadorDown = new Image();
imagenJugadorDown.src = './img/walk_down_animation.png'

const imagenJugadorLeft = new Image();
imagenJugadorLeft.src = './img/walk_left_animation.png'

const imagenJugadorRight = new Image();
imagenJugadorRight.src = './img/walk_right_animation.png'

const imagenJugadorIdle = new Image();
imagenJugadorIdle.src = './img/idle_animation.png'


// 3) Creamos SPRITE JUGADOR

const jugador = new Sprite({
    position: {
        x: canvas.width / 2 - 148 / 4 / 2, //Centrado en eje x //No usamos "ImagenJugador.width" porque la imagen no se cargaría a tiempo ya que const jugador se llama en cuento ejecutamos el file. En su lugar, usamos la altura (148px) y ancho (70px) de la imagen 
        y: canvas.height / 2 - 70 / 2, //Centrado en eje y
    },
    image: imagenJugadorDown,
    frames: {
        max: 4
    },
    sprites: {
        up: imagenJugadorUp,
        down: imagenJugadorDown,
        left: imagenJugadorLeft,
        right: imagenJugadorRight,
        idle: imagenJugadorIdle,
    }
})


// 4) Creamos SPRITE FONDO

const fondo = new Sprite({ //podra acojer las propiedades declaradas antes en la class Sprite.
    position: { // Creas position y la guardas en la propiedad position (this.position)
        x: desviacion.x,
        y: desviacion.y
    },
    image: Mapa //***Hacemos esto para tener la constante Mapa dentro de class Sprite porque es buena praxis, aunque const Mapa sea global.
}) ;

// 5) Creamos SPRITE FOREGROUND OBJECTS

const foreground = new Sprite({ 
    position: { 
        x: desviacion.x, // asigna un nuevo valor a x que es el valor x de desviación
        y: desviacion.y
    },
    image: imagenForeground
}) ;


const teclas = {
    w: {
        pressed: false //no esta presionada por default
    },
    a: {
        pressed: false 
    },
    s: {
        pressed: false 
    },
    d: {
        pressed: false 
    },
}

// COSAS MÓVILES: array de todos los ítems que se mueven
const movibles = [fondo, ...limites, foreground] //(...) spread operator - selecciona todos los items del array "limites"

// COLISIONES 1.2 - FUNCIÓN colisionRectangular ----------------------------------------------------

// Seleccionamos el lado de nuestro jugador que contacta con la colisión y vemos si es más grande que la zona de contacto de la colisión
function colisionRectangular ({ rectangulo1, rectangulo2 }) { //rectangulo 1 representa al jugador, rectangulo 2
    return ( //"return" va a devolver TRUE o FALSE dependiendo de si se cumple todo lo de dentro
        rectangulo1.position.x + rectangulo1.width >= rectangulo2.position.x && //lado derecho del jugador es más grande que lado izquierdo del cuadrado de colisión
        rectangulo1.position.x <= rectangulo2.position.x + rectangulo2.width && //lado izquierdo del jugador es más grande que lado derecho del cuadrado de colisión
        rectangulo1.position.y <= rectangulo2.position.y + rectangulo2.height && // lado de abajo del cuadrado de colisión
        rectangulo1.position.y + rectangulo1.height >= rectangulo2.position.y // lado de arriba del cuadrado de colisión
    )
}

// 6) Creamos un animation LOOP que permitirá cambiar las coordenadas del jugador en el mapa.
// El LOOP es INFINITO ("function animacion" llama a "window.requestAnimationFrame(animacion), que vuelve a llamar la función)
function animacion() {
    window.requestAnimationFrame(animacion);
    fondo.dibujar()
    // Cargamos Mapa en el canvas context con "drawImage"(imagen HTML, x, y). 
    // ***Mapa es muy grande y tarda en cargarse - si estuviera fuera de la "function animacion", cuando se llamara a c.drawImage, la imagen no estaría cargada y no aparecería nada. Para arreglarlo pondríamos  "c.drawImage" dentro de "Mapa.onload", que no se ejecutaría hasta que la imagen se cargara. Después, ImagenJugador se cargaría antes que Mapa y quedaría cubierto por este. Para arreglarlo, pondríamos c.drawImage (ImagenJugador) dentro de Mapa.onload también. Quedaría así:
    // Mapa.onload = () => {
    //     c.drawImage(Mapa, -4048, -1680); (coordenadas donde queremos que el jugador aparezca en el mapa)
    //     c.drawImage(ImagenJugador, etc.);
    // }

    limites.forEach((limite) => {
        limite.dibujar()
    }) 

    jugador.dibujar();

    foreground.dibujar();

    // QUÉ HACE CADA TECLA. CÓDIGO DE DIRECCIÓN DEL PERSONAJE -----------------------------------------------------------

    let moving = true
    jugador.moving = false // hace que jugador.moving = true solo al presionar las teclas

    if(teclas.w.pressed && ultimaTecla ==='w') {
        jugador.moving = true
        jugador.image = jugador.sprites.up

        // COLISIONES 1.3 - Detectar si el jugador esta CASI colisionando con un límite
        for (let i = 0; i < limites.length; i++){ //cuando se presiona w el loop pasa por todos los limites
            const limite = limites[i] //constante limite que selecciona el elemento del array limites por el que pasa el loop actual
            if(
                colisionRectangular({
                    rectangulo1 : jugador,
                    rectangulo2: {
                        ...limite, //Creamos una copia de boundry con la position.y + 3 para adelantarnos a la colisión por 3 px. Spread operator (...) -> descompone arrays. {...limite} crea un clon del objeto limite sin overidear el original. Es el limite por el que pasa el loop en este momento. 
                        position: { //Damos un nuevo valor de la propiedad position aquí
                        x: limite.position.x,
                        y: limite.position.y + 5
                        }
                    } 
                })
            ) { 
                moving = false //si estamos a punto de colisionar con algo, moving = false
                break // al detectar 1 limite no queremos que el loop siga encontrando todos los otros límites del mapa -> break, sale del loop
            } 
        }

        if(moving)
        movibles.forEach((movible) => { //por cada movible dentro del array movibles se le añade 4 a medida que pasa el tiempo
            movible.position.y += 5 // movible.position.Y += 5 es lo mismo que movible.position.Y = movible.position.Y + 4
        }) 

    }else if(teclas.a.pressed && ultimaTecla ==='a') {
        jugador.moving = true
        jugador.image = jugador.sprites.left

        for (let i = 0; i < limites.length; i++){ 
            const limite = limites[i] 
            if(
                colisionRectangular({
                    rectangulo1 : jugador,
                    rectangulo2: {
                        ...limite, 
                        position: { 
                        x: limite.position.x + 5,
                        y: limite.position.y
                        }
                    } 
                })
            ) { 
                moving = false 
                break 
            } 
        }

        if(moving)    
            movibles.forEach((movible) => { 
            movible.position.x += 5
        }) 

    }else if(teclas.s.pressed && ultimaTecla ==='s') {
        jugador.moving = true
        jugador.image = jugador.sprites.down

        for (let i = 0; i < limites.length; i++){ 
            const limite = limites[i] 
            if(
                colisionRectangular({
                    rectangulo1 : jugador,
                    rectangulo2: {
                        ...limite, 
                        position: { 
                        x: limite.position.x,
                        y: limite.position.y - 5
                        }
                    } 
                })
            ) { 
                moving = false 
                break 
            } 
        }

        if(moving) 
        movibles.forEach((movible) => { 
            movible.position.y -= 5
        })

    }else if(teclas.d.pressed && ultimaTecla ==='d') {
        jugador.moving = true
        jugador.image = jugador.sprites.right

        for (let i = 0; i < limites.length; i++){ 
            const limite = limites[i] 
            if(
                colisionRectangular({
                    rectangulo1 : jugador,
                    rectangulo2: {
                        ...limite,  
                        position: { 
                        x: limite.position.x - 5,
                        y: limite.position.y
                        }
                    } 
                })
            ) { 
                moving = false 
                break 
            } 
        }

        if(moving) 
        movibles.forEach((movible) => { 
            movible.position.x -= 5
        })

    }else if(!teclas.pressed) {
        jugador.moving = false
        jugador.image = jugador.sprites.idle
    }

}
animacion();

let ultimaTecla = '' // Escucha qué tecla esta siendo presionada y si es la última que fue presionada.

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            teclas.w.pressed = true
            ultimaTecla = 'w'
            break;
        case 'a':
            teclas.a.pressed = true
            ultimaTecla = 'a'
            break;
        case 's':
            teclas.s.pressed = true
            ultimaTecla = 's'
            break;
        case 'd':
            teclas.d.pressed = true
            ultimaTecla = 'd'
            break;
    }
}) 

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            teclas.w.pressed = false
            break;
        case 'a':
            teclas.a.pressed = false
            break;
        case 's':
            teclas.s.pressed = false
            break;
        case 'd':
            teclas.d.pressed = false
            break;
    }
}) 

//INVESTIGAR evento TOUCH PARA MOBILE




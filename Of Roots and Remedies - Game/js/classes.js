// 2) Creamos una CLASS para los Sprites

// Una CLASS es una "plantilla" para crear objetos con ciertas PROPIEDADES (datos) y MÉTODOS (acciones o funciones).

class Sprite {
    constructor({ position, velocity, image, frames = { max: 1 }, sprites }) { //CONSTRUCTOR - permite crear propiedades para Sprite. // ({}) creamos un objeto para poder poner las propiedades en cualquier orden. //FRAMES = {MAX:1} - por default, el argumento frames = objeto con propiedad max=1, valor que podremos modificar cuando lo pasemos por un nuevo objeto frames.
        this.position = position //position es la propiedad y this.image es la instancia, un objeto específico que se crea a partir de ese molde
        this.image = image //cuando pasemos una imagen se almacena en this.image
        this.frames = { ...frames, val: 0, elapsed: 0 } //elapsed: cantidad de frames que han transcurrido desde la creación del sprite

        // Las propiedades "this.width" y "this.height" deben llamarse cuando la imagen en this.image ya esté cargada
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height 
        }
        this.moving = false
        this.sprites = sprites
    }

    dibujar() {

        // Poniendo c.drawImage(Mapa) y (ImagenJugador) dentro del LOOP INFINITO conseguimos que se esten cargando continuamente. *** Finalmente c.drawImage(Mapa, -4048, -1680) se acaba poniendo dentro de class Sprite (????????)
        // "c.drawImage" tiene que funcionar tanto para dibujar el mapa, como el jugador, etc.
        c.drawImage(  //drawImage: método +que se utiliza en el contexto canvas API
            this.image,

            // CORTE imagen
            this.frames.val * this.width,  //de donde empiezas a cortar en eje x (izquierda) //* 37 -> width del sprite 
            0, // y en eje y (arriba)
            this.image.width / this.frames.max, //this.frames.max: max cantidad de frames que deben tener la imagenes que dibujamos. Debería ser = 1 en creación del FONDO para que la imagen no este cropped, pero en la creación del JUGADOR debería ser 4 porque es el número de frames que hay en la imagen (4 sprites del jugador)
            this.image.height, // y en eje y

            // SITIO donde la imagen esta posicionada en el marco (en FONDO los valores de posotion estan declarados en const FONDO = new Sprite)
            this.position.x, //donde en eje x
            this.position.y, //donde en eje y
            this.image.width / this.frames.max, 
            this.image.height,
        )

        if (!this.moving) return //si this.moving = FALSE NO se ejecuta el código siguiente a partir de aquí

        if (this.frames.max > 1) { //this.frames.max > 1 significa: tenemos un sprite sheet
            this.frames.elapsed++
        }

        if(this.frames.elapsed % 10 === 0){ // Si this.frames.elapsed = múltiplos de 10 (relantizando la ejecucción del código)
            if(this.frames.val < this.frames.max - 1) this.frames.val++ 
            else this.frames.val = 0
        }

        // EXPLICACIÓN DIBUJAR() PARA LA ANIMACIÓN ------------------------------------------------------------
        // 1) Cada vez que corre DIBUJAR(), si this.moving = true (si se aprieta teclas) se ejecuta:
        // 2) Si hay una sprite sheet (this.frames.max > 1) entonces se suma 1 a "this.frames.elapsed".
        // 3) Si "this.frames.elapsed" es múltiplo de 10 (this.frames.elapsed % 10 === 0) (el 10 es un número arbitrario elegido para relentizar la ejecución del código siguiente) se ejecuta el código siguiente:
        // 4) Se incrementa "this.frames.val" +1 siempre que sea < que "this.frames.max" (tiene valor de 4 -4 sprites en la sprite sheet-). Si no, intentaria renderizar una porción del sprite sheet que no existe.
        // Escribimos "this.frames.max -1", porque queremos interaciones entre 0-3, ya que si iteramos 4 veces, 4 * 37 da la largada entera de la imagen del sprite sheet y el trozo renderizado quedaría fuera de la imagen y no se vería nada.
        //5) Si this.frames.val >= this.frames.max - 1 significa 
    }
}


class Limite {
    static width = 38.4 // static - PROPIEDAD ESTÁTICA de Limite
    static height = 38.4
    constructor ({position}) {
        // CONSTRUCTOR: método para crear e inicializar un objeto creado con una clase. Solo puede haber 1 "constructor" en una clase.

        this.position = position // PROPIEDAD DE INSTANCIA
        this.width = 38.4 // medida en px de cada tile (16px) * 240 (% de aumento del mapa utilizado) / 100
        this.height = 38.4
    }

    dibujar(){
        c.fillStyle = 'rgba(255, 0, 0, 0)' // Rojo para que sea parecido a los cuadrados de colisión que tenemos dibujados
        c.fillRect(this.position.x, this.position.y, this.width, this.height ) //fillRect (eje x, eje y, width, height)
    }

}



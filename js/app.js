// Selecciona el elemento canvas y otros elementos de la interfaz de usuario necesarios para la aplicación.
const canvas = document.querySelector('canvas'),
    toolsBtn = document.querySelectorAll('.tools'),
    fillColor = document.querySelector('#fill-color'),
    sizeSlidr = document.querySelector('#size-slider'),
    colorsBtn = document.querySelectorAll('.colors .option'),
    colorPiker = document.querySelector("#color-piker"),
    clearCanvas = document.querySelector('.cleatr-canvas'),
    saveImage = document.querySelector('.save-image'),
    ctx = canvas.getContext('2d'); // Obtiene el contexto 2D para dibujar en el canvas.

// Variables para almacenar la posición previa del mouse, una instantánea del canvas, y otras configuraciones.
let prevMauseX,
    prevMauseY,
    snapshot,
    isDrawin = false,
    brushwidth = 5,
    selectedTools = 'brush',
    selectedColor = '#000';

// Función para establecer el fondo del canvas.
const setCanvasBackground = () => {

    ctx.fillStyle = '#fff';  // Establece el color de relleno a blanco.
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Rellena el canvas con blanco.
    ctx.fillStyle = selectedColor; // Restablece el color de relleno al color seleccionado.

};

// Evento que se dispara cuando la ventana se carga.
window.addEventListener('load', () => {

    canvas.width = canvas.offsetWidth; // Establece el ancho del canvas al ancho del elemento.
    canvas.height = canvas.offsetHeight;// Establece la altura del canvas a la altura del elemento.
    setCanvasBackground(); // Llama a la función para establecer el fondo del canvas.
});

// Objeto para mapear los nombres de las herramientas a sus identificadores.
const cosntTools = {
    RECTANGLE: 'rectangle',
    CIRCLE: 'circle',
    TRIANGLE: 'triangle',
    BRUSH: 'brush',
    ERASER: 'eraser',
    BG_BTN: 'background-color'
};

// Funciones para dibujar formas en el canvas.
const drawReact = (e) => {
    if (!fillColor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMauseX - e.offsetX, prevMauseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMauseX - e.offsetX, prevMauseY - e.offsetY);
};

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMauseX - e.offsetX), 2) + Math.pow((prevMauseY - e.offsetY), 2));
    ctx.arc(prevMauseX, prevMauseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {

    ctx.beginPath();
    ctx.moveTo(prevMauseX, prevMauseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMauseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();


    fillColor.checked ? ctx.fill() : ctx.stroke();

};

// Función que se inicia cuando el usuario presiona el mouse sobre el canvas.
const startDrawign = (e) => {
    isDrawin = true;

    prevMauseX = e.offsetX;// Almacena la posición X donde el usuario comenzó a dibujar.
    prevMauseY = e.offsetY;// Almacena la posición Y donde el usuario comenzó a dibujar.

    // Prepara el canvas para dibujar.
    ctx.beginPath();
    ctx.lineWidth = brushwidth; // Establece el ancho del pincel.
    ctx.strokeStyle = selectedColor;// Establece el color del trazo.
    ctx.fillStyle = selectedColor;  // Establece el color de relleno.

    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);  // Toma una instantánea del canvas.

};

// Función que se dispara cuando el usuario mueve el mouse sobre el canvas mientras dibuja.
const drawign = (e) => {
    if (!isDrawin) return;// Si no está dibujando, no hace nada.

    ctx.putImageData(snapshot, 0, 0);  // Restaura la instantánea del canvas.

    // Comprueba qué herramienta está seleccionada y dibuja en consecuencia.
    if (selectedTools === cosntTools.BRUSH || selectedTools === cosntTools.ERASER) {
        // Si la herramienta es el pincel o la goma, dibuja una línea.
        ctx.strokeStyle = selectedTools === cosntTools.ERASER ?
            '#FFF' : selectedColor;

        ctx.lineTo(e.offsetX, e.offsetY);  // Dibuja una línea hasta la posición actual del mouse.
        ctx.stroke();// Aplica el trazo.

    } else if (selectedTools === cosntTools.RECTANGLE) {
        drawReact(e);// Llama a la función para dibujar un rectángulo.
    } else if (selectedTools === cosntTools.CIRCLE) {
        drawCircle(e)
    } else { // Llama a la función para dibujar un círculo.
        drawTriangle(e);// Llama a la función para dibujar un triángulo.
    };

};

// Eventos para manejar la interacción del usuario con la interfaz de usuario y el canvas.
[...toolsBtn].map(btn => {
    btn.addEventListener('click', () => {

        document.querySelector('.active').classList.remove('active');
        btn.classList.add('active');
        selectedTools = btn.id;

    });
});

[...colorsBtn].map(color => {
    color.addEventListener('click', () => {

        document.querySelector('.options .selected').classList.remove('selected');
        color.classList.add('selected');
        selectedColor = window.getComputedStyle(color).getPropertyValue(`${cosntTools.BG_BTN}`);

    });
});

colorPiker.addEventListener('change', () => {

    colorPiker.parentElement.style.background = colorPiker.value;
    colorPiker.parentElement.click();

});

clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImage.addEventListener('click', () => {

    const link = document.createElement('a');
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

sizeSlidr.addEventListener('change', () => brushwidth = sizeSlidr.value);
canvas.addEventListener('mousedown', startDrawign)
canvas.addEventListener('mousemove', drawign);
canvas.addEventListener('mouseup', () => isDrawin = false);
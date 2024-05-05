
const canvas = document.querySelector('canvas'),
    toolsBtn = document.querySelectorAll('.tools'),
    fillColor = document.querySelector('#fill-color'),
    sizeSlidr = document.querySelector('#size-slider'),
    colorsBtn = document.querySelectorAll('.colors .option'),
    colorPiker = document.querySelector("#color-piker"),
    clearCanvas = document.querySelector('.cleatr-canvas'),
    saveImage = document.querySelector('.save-image'),
    ctx = canvas.getContext('2d');

let prevMauseX,
    prevMauseY,
    snapshot,
    isDrawin = false,
    brushwidth = 5,
    selectedTools = 'brush',
    selectedColor = '#000';

const setCanvasBackground = () => {

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;

};

window.addEventListener('load', () => {

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const cosntTools = {
    RECTANGLE: 'rectangle',
    CIRCLE: 'circle',
    TRIANGLE: 'triangle',
    BRUSH: 'brush',
    ERASER: 'eraser',
    BG_BTN: 'background-color'
};

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
const startDrawign = (e) => {
    isDrawin = true;

    prevMauseX = e.offsetX;
    prevMauseY = e.offsetY;


    ctx.beginPath();
    ctx.lineWidth = brushwidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;

    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

};

const drawign = (e) => {
    if (!isDrawin) return;
    ctx.putImageData(snapshot, 0, 0);
    if (selectedTools === cosntTools.BRUSH || selectedTools === cosntTools.ERASER) {

        ctx.strokeStyle = selectedTools === cosntTools.ERASER ?
            '#FFF' : selectedColor;

        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

    } else if (selectedTools === cosntTools.RECTANGLE) {
        drawReact(e);
    } else if (selectedTools === cosntTools.CIRCLE) {
        drawCircle(e)
    } else {
        drawTriangle(e);
    };

};

[...toolsBtn].map(btn => {
    btn.addEventListener('click', () => {

        document.querySelector('.active').classList.remove('active');
        btn.classList.add('active');
        selectedTools = btn.id;

        console.log({ selectedTools });
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
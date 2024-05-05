
const canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');

let isDrawin = false,
    brushwidth = 5;

window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

const startDrawign = () => {
    isDrawin = true;

    ctx.beginPath();
    ctx.lineWidth = brushwidth;

};

const drawign = (e) => {
    if (!isDrawin) return;

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

};

canvas.addEventListener('mousedown', startDrawign)
canvas.addEventListener('mousemove', drawign);
canvas.addEventListener('mouseup', () => isDrawin = false);
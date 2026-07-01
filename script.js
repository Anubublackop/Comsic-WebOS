// --- Window Dragging Logic ---
const windows = document.querySelectorAll('.window');

windows.forEach(win => {
    const header = win.querySelector('.window-header');
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        // Bring clicked window to front
        windows.forEach(w => w.style.zIndex = "1");
        win.style.zIndex = "10";
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            win.style.left = (e.clientX - offsetX) + 'px';
            win.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});

// --- App Management ---
function openApp(appName) {
    document.getElementById(appName + '-window').classList.add('open');
    document.getElementById('start-menu').classList.remove('visible');
}

function closeApp(appName) {
    document.getElementById(appName + '-window').classList.remove('open');
}

function toggleStart() {
    document.getElementById('start-menu').classList.toggle('visible');
}

// --- Fun Feature 1: Jiggle Mode ---
function triggerJiggle() {
    document.getElementById('start-menu').classList.remove('visible');
    const allWindows = document.querySelectorAll('.window');
    
    // Add shake class to everything
    allWindows.forEach(win => win.classList.add('shake-animation'));
    
    // Stop shaking after 2 seconds
    setTimeout(() => {
        allWindows.forEach(win => win.classList.remove('shake-animation'));
    }, 2000);
}

// --- Fun Feature 2: Doodle Pad Logic ---
const canvas = document.getElementById('doodle-canvas');
const ctx = canvas.getContext('2d');
let painting = false;

function startPosition(e) {
    painting = true;
    draw(e);
}
function endPosition() {
    painting = false;
    ctx.beginPath();
}
function draw(e) {
    if (!painting) return;
    
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// --- Calculator Logic ---
let calcDisplay = document.getElementById('calc-display');

function calcPress(val) {
    if (calcDisplay.value === '0') {
        calcDisplay.value = val;
    } else {
        calcDisplay.value += val;
    }
}
function calcClear() {
    calcDisplay.value = '0';
}
function calcEval() {
    try {
        calcDisplay.value = eval(calcDisplay.value);
    } catch {
        calcDisplay.value = 'Error';
    }
}

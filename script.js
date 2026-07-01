// --- Window Dragging Logic ---
const windows = document.querySelectorAll('.window');

windows.forEach(win => {
    const header = win.querySelector('.window-header');
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('win-btn')) return; // Don't drag if clicking close button
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
    const appWindow = document.getElementById(appName + '-window');
    if (appWindow) {
        appWindow.classList.add('open');
        // Bring to front
        windows.forEach(w => w.style.zIndex = "1");
        appWindow.style.zIndex = "10";
    }
    document.getElementById('start-menu').classList.remove('visible');
}

function closeApp(appName) {
    const appWindow = document.getElementById(appName + '-window');
    if (appWindow) {
        appWindow.classList.remove('open');
    }
}

function toggleStart() {
    document.getElementById('start-menu').classList.toggle('visible');
}

// --- Smart Search Hub Command Logic ---
const searchInput = document.getElementById('desktop-search');
if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const command = searchInput.value.toLowerCase().trim();
            
            if (command === 'open calc' || command === 'calc') {
                openApp('calculator');
            } else if (command === 'open web' || command === 'web' || command === 'stardance') {
                openApp('browser');
            } else if (command === 'open doodle' || command === 'doodle') {
                openApp('doodle');
            } else if (command === 'jiggle') {
                triggerJiggle();
            }
            
            searchInput.value = ''; // Clear search box after hitting enter
        }
    });
}

// --- Jiggle Mode Fix ---
function triggerJiggle() {
    document.getElementById('start-menu').classList.remove('visible');
    
    // Target all windows that are currently open
    const openWindows = document.querySelectorAll('.window.open');
    
    if (openWindows.length === 0) {
        alert("Open a window first to see it jiggle!");
        return;
    }

    // Add shake class to open windows
    openWindows.forEach(win => win.classList.add('shake-animation'));
    
    // Stop shaking after 1.5 seconds
    setTimeout(() => {
        openWindows.forEach(win => win.classList.remove('shake-animation'));
    }, 1500);
}

// --- Doodle Pad Logic ---
const canvas = document.getElementById('doodle-canvas');
if (canvas) {
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
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineWidth = 4;
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

    window.clearCanvas = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
}

// --- Calculator Logic ---
let calcDisplay = document.getElementById('calc-display');

window.calcPress = function(val) {
    if (calcDisplay.value === '0') {
        calcDisplay.value = val;
    } else {
        calcDisplay.value += val;
    }
};

window.calcClear = function() {
    calcDisplay.value = '0';
};

window.calcEval = function() {
    try {
        calcDisplay.value = eval(calcDisplay.value);
    } catch {
        calcDisplay.value = 'Error';
    }
};

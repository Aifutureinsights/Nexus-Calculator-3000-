// =====================
// LOADING AND WELCOME SCREEN
// =====================
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const welcomeScreen = document.querySelector('.welcome-screen');
    const calculatorMain = document.querySelector('.nexus-ui');

    // Simulate loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');

        // Play welcome voice
        const welcomeAudio = new Audio('https://www.soundjay.com/misc/sounds/welcome-voice.mp3');
        welcomeAudio.play();

        // Transition to calculator UI
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            calculatorMain.classList.remove('hidden');
            calculatorMain.style.display = 'block';
        }, 3000);
    }, 3000);

    // Initialize tabs
    initTabs();

    // Initialize buttons
    initButtons();
});

// =====================
// TABS FUNCTIONALITY
// =====================
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Hide all tab contents
            tabContents.forEach(content => content.classList.add('hidden'));
            // Show the selected tab content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.remove('hidden');
        });
    });
}

// =====================
// ARITHMETIC SECTION
// =====================
function initButtons() {
    const arithmeticButtons = [
        '7', '8', '9', '/', 'C',
        '4', '5', '6', '*', '⌫',
        '1', '2', '3', '-', 'π',
        '0', '.', '=', '+', '√'
    ];

    arithmeticButtons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn;
        button.onclick = () => handleInput(btn, 'arithmetic');
        document.getElementById('arithmetic-buttons').appendChild(button);
    });

    const scientificButtons = [
        'sin', 'cos', 'tan', 'log', 'exp',
        '^', '(', ')', 'π', 'e'
    ];

    scientificButtons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn;
        button.onclick = () => handleInput(btn, 'scientific');
        document.getElementById('scientific-buttons').appendChild(button);
    });

    const memoryButtons = [
        'M+', 'M-', 'MR', 'MC', '='
    ];

    memoryButtons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn;
        button.onclick = () => handleInput(btn, 'memory');
        document.getElementById('memory-buttons').appendChild(button);
    });
}

let memory = 0;

function handleInput(value, tab) {
    const inputField = document.getElementById(`${tab}-input`);
    const outputField = document.getElementById(`${tab}-output`);

    if (value === 'C') {
        inputField.value = '';
        outputField.textContent = '';
    } else if (value === '⌫') {
        inputField.value = inputField.value.slice(0, -1);
    } else if (value === '=') {
        calculate(inputField.value, outputField);
    } else if (['M+', 'M-', 'MR', 'MC'].includes(value)) {
        handleMemory(value, inputField, outputField);
    } else {
        inputField.value += value;
    }
}

function calculate(expression, outputField) {
    try {
        expression = expression
            .replace(/π/g, Math.PI)
            .replace(/e/g, Math.E)
            .replace(/\^/g, '**')
            .replace(/sin/g, 'math.sin')
            .replace(/cos/g, 'math.cos')
            .replace(/tan/g, 'math.tan')
            .replace(/log/g, 'math.log10')
            .replace(/exp/g, 'math.exp');

        const result = math.evaluate(expression);
        outputField.textContent = result;
    } catch (error) {
        outputField.textContent = 'ERROR';
        alert('Invalid calculation.');
    }
}

function handleMemory(value, inputField, outputField) {
    if (value === 'M+') {
        memory += parseFloat(outputField.textContent || 0);
    } else if (value === 'M-') {
        memory -= parseFloat(outputField.textContent || 0);
    } else if (value === 'MR') {
        inputField.value = memory.toString();
    } else if (value === 'MC') {
        memory = 0;
    }
}

// =====================
// SOLVER SECTION
// =====================
document.querySelector('.solve-button').addEventListener('click', () => {
    const inputField = document.getElementById('solver-input');
    const outputField = document.getElementById('solver-output');
    const equation = inputField.value;

    try {
        const solution = math.simplify(equation).toString();
        outputField.textContent = solution;
    } catch (error) {
        outputField.textContent = 'ERROR';
        alert('Invalid equation.');
    }
});

// =====================
// GRAPHING SECTION
// =====================
document.querySelector('.plot-button').addEventListener('click', () => {
    const ctx = document.getElementById('graph-canvas').getContext('2d');
    const equation = document.getElementById('graphing-input').value;

    const xValues = Array.from({ length: 100 }, (_, i) => i - 50);
    const yValues = xValues.map(x => math.evaluate(equation, { x }));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: equation,
                data: yValues,
                borderColor: 'rgba(0, 255, 255, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true }
            }
        }
    });
});

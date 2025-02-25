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

    // Initialize buttons
    initButtons();
});

// =====================
// CORE FUNCTIONALITY
// =====================
const questionDisplay = document.getElementById('question-display');
const answerDisplay = document.getElementById('answer-display');
let memory = 0;

function handleInput(value) {
    if (value === 'C') {
        // Clear the display
        questionDisplay.value = '';
        answerDisplay.textContent = '';
    } else if (value === '⌫') {
        // Backspace
        questionDisplay.value = questionDisplay.value.slice(0, -1);
    } else if (value === '=') {
        // Calculate the result
        calculate();
    } else if (value === 'Solve') {
        solveEquation();
    } else if (value === 'Plot') {
        plotGraph();
    } else if (['M+', 'M-', 'MR', 'MC'].includes(value)) {
        handleMemory(value);
    } else {
        // Append the input to the display
        questionDisplay.value += value;
    }
}

function calculate() {
    try {
        let expression = questionDisplay.value;

        // Replace constants and shorthand
        expression = expression
            .replace(/π/g, Math.PI)
            .replace(/e/g, Math.E)
            .replace(/\^/g, '**')
            .replace(/sin/g, 'math.sin')
            .replace(/cos/g, 'math.cos')
            .replace(/tan/g, 'math.tan')
            .replace(/log/g, 'math.log10')
            .replace(/exp/g, 'math.exp');

        const result = math.evaluate(expression); // Use math.js for evaluation
        answerDisplay.textContent = result;
    } catch (error) {
        answerDisplay.textContent = 'ERROR';
        alert('Invalid calculation.');
    }
}

function solveEquation() {
    try {
        const equation = questionDisplay.value;
        const solution = math.simplify(equation).toString(); // Simplify the equation
        answerDisplay.textContent = solution;
    } catch (error) {
        answerDisplay.textContent = 'ERROR';
        alert('Invalid equation.');
    }
}

function handleMemory(value) {
    if (value === 'M+') {
        memory += parseFloat(answerDisplay.textContent || 0);
    } else if (value === 'M-') {
        memory -= parseFloat(answerDisplay.textContent || 0);
    } else if (value === 'MR') {
        questionDisplay.value = memory.toString();
    } else if (value === 'MC') {
        memory = 0;
    }
}

function plotGraph() {
    const ctx = document.getElementById('graph-canvas').getContext('2d');
    const equation = questionDisplay.value;

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
}

// =====================
// BUTTON INITIALIZATION
// =====================
function initButtons() {
    const buttons = [
        '7', '8', '9', '/', 'C',
        '4', '5', '6', '*', '⌫',
        '1', '2', '3', '-', 'π',
        '0', '.', '=', '+', '√',
        'sin', 'cos', 'tan', 'log', 'exp',
        '^', 'M+', 'M-', 'MR', 'MC',
        'Solve', 'Plot'
    ];

    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn;
        button.onclick = () => handleInput(btn);
        document.getElementById('buttons').appendChild(button);
    });
}

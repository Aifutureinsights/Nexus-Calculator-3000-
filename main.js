// =====================
// LOADING AND WELCOME SCREEN
// =====================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelector('.loading-screen').classList.add('hidden');
        document.querySelector('.welcome-screen').classList.remove('hidden');

        // Play welcome audio
        const welcomeAudio = new Audio('https://www.soundjay.com/misc/sounds/welcome-voice.mp3');
        welcomeAudio.play();

        setTimeout(() => {
            document.querySelector('.welcome-screen').classList.add('hidden');
            document.querySelector('.nexus-ui').classList.remove('hidden');
        }, 3000);
    }, 3000);

    initTabs();
    initSubTabs();
    initButtons();
    updateCryptoPrices();
    setInterval(updateCryptoPrices, 10000);
    initVoiceCommands();
});

// =====================
// TABS FUNCTIONALITY
// =====================
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => content.classList.add('hidden'));
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.remove('hidden');
        });
    });
}

function initSubTabs() {
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    const subTabContents = document.querySelectorAll('.sub-tab-content');

    subTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            subTabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            subTabContents.forEach(content => content.classList.add('hidden'));
            const subTabId = button.getAttribute('data-subtab');
            document.getElementById(subTabId).classList.remove('hidden');
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
        outputField.style.color = 'var(--matrix-green)';
    } catch (error) {
        outputField.textContent = 'Error';
        outputField.style.color = 'var(--hacker-red)';
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
        outputField.textContent = 'Error';
        outputField.style.color = 'var(--hacker-red)';
    }
});

// =====================
// GRAPHING SECTION
// =====================
let currentChart = null;
document.querySelector('.plot-button').addEventListener('click', () => {
    const ctx = document.getElementById('graph-canvas').getContext('2d');
    const equation = document.getElementById('graphing-input').value;

    if (currentChart) {
        currentChart.destroy();
    }

    try {
        const xValues = Array.from({ length: 100 }, (_, i) => i - 50);
        const yValues = xValues.map(x => math.evaluate(equation, { x }));
        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xValues,
                datasets: [{
                    label: `f(x) = ${equation}`,
                    data: yValues,
                    borderColor: 'rgba(0, 255, 255, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        grid: { color: 'rgba(0, 255, 0, 0.1)' }
                    },
                    y: {
                        grid: { color: 'rgba(0, 255, 0, 0.1)' }
                    }
                }
            }
        });
    } catch (error) {
        alert('Invalid function. Please try again.');
    }
});

// =====================
// HEALTH CALCULATOR
// =====================
document.getElementById('calculate-bmi').addEventListener('click', () => {
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const height = parseFloat(document.getElementById('bmi-height').value) / 100;
    const bmiOutput = document.getElementById('bmi-output');

    if (!weight || !height) {
        bmiOutput.textContent = 'Please enter valid values.';
        return;
    }

    const bmi = (weight / (height * height)).toFixed(2);
    bmiOutput.textContent = `BMI: ${bmi}`;
});

document.getElementById('calculate-calories').addEventListener('click', () => {
    const age = parseFloat(document.getElementById('calories-age').value);
    const weight = parseFloat(document.getElementById('calories-weight').value);
    const height = parseFloat(document.getElementById('calories-height').value);
    const gender = document.getElementById('calories-gender').value;
    const caloriesOutput = document.getElementById('calories-output');

    if (!age || !weight || !height) {
        caloriesOutput.textContent = 'Please enter valid values.';
        return;
    }

    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    caloriesOutput.textContent = `Daily Calories: ${Math.round(bmr)}`;
});

// =====================
// AGE CALCULATOR
// =====================
document.getElementById('calculate-age').addEventListener('click', () => {
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    const ageOutput = document.getElementById('age-output');

    if (!startDate || !endDate) {
        ageOutput.textContent = 'Please select valid dates.';
        return;
    }

    const diffTime = Math.abs(endDate - startDate);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    ageOutput.textContent = `Age Difference: ${diffYears} years`;
});

// =====================
// CRYPTO PRICES
// =====================
async function updateCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        const data = await response.json();
        document.getElementById('crypto-ticker').innerHTML = `
            <div class="crypto-item">BTC: $${data.bitcoin.usd}</div>
            <div class="crypto-item">ETH: $${data.ethereum.usd}</div>
        `;
    } catch {
        document.getElementById('crypto-ticker').textContent = "Quantum data stream offline";
    }
}

// =====================
// VOICE COMMANDS
// =====================
let isListening = false;

function initVoiceCommands() {
    if (annyang) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
                const commands = {
                    'calculate *term': (term) => {
                        const activeInput = document.querySelector('.question-display:not([hidden])');
                        activeInput.value = term.replace(/plus/g, '+').replace(/minus/g, '-');
                        calculate(activeInput.value, activeInput.nextElementSibling);
                    },
                    'clear': () => document.querySelector('.question-display').value = '',
                    'switch to *tab': (tab) => {
                        document.querySelector(`[data-tab="${tab.toLowerCase()}"]`).click();
                    },
                    'graph *function': (func) => {
                        document.getElementById('graphing-input').value = func;
                        document.querySelector('.plot-button').click();
                    },
                    'explain *concept': (concept) => {
                        explainConcept(concept);
                    }
                };

                annyang.addCommands(commands);

                document.getElementById('voice-command').onclick = () => {
                    if (!isListening) {
                        annyang.start();
                        document.getElementById('jarvis-response').textContent = "Listening...";
                        isListening = true;
                    } else {
                        annyang.abort();
                        document.getElementById('jarvis-response').textContent = "";
                        isListening = false;
                    }
                };
            })
            .catch((error) => {
                console.error('Microphone access denied:', error);
            });
    }
}

// Enhanced Error Handling
function explainConcept(concept) {
    const explanations = {
        'pi': 'Pi (π) is a mathematical constant representing the ratio of a circle\'s circumference to its diameter.',
        'sqrt': 'The square root (√) of a number is a value that, when multiplied by itself, gives the original number.',
        'sin': 'Sine (sin) is a trigonometric function that relates an angle to the ratio of opposite side to hypotenuse in a right triangle.',
        'cos': 'Cosine (cos) is a trigonometric function that relates an angle to the ratio of adjacent side to hypotenuse in a right triangle.',
        'tan': 'Tangent (tan) is a trigonometric function that relates an angle to the ratio of opposite side to adjacent side in a right triangle.'
    };

    const explanation = explanations[concept.toLowerCase()] || 'Sorry, I don\'t know about that concept yet.';
    alert(explanation);
                                               }

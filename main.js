// =====================
// LOADING AND WELCOME SCREEN
// =====================
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const nexusUI = document.querySelector('.nexus-ui');

    // Simulate loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        nexusUI.classList.remove('hidden');
    }, 2000);

    // Initialize tabs
    initTabs();
    initSubTabs();

    // Initialize buttons
    initButtons();

    // Fetch live crypto prices
    updateCryptoPrices();
    setInterval(updateCryptoPrices, 10000);

    // Initialize voice commands
    initVoiceAI();

    // AI Input Handler
    document.getElementById('ai-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const ai = new NexusAI();
            ai.processCommand(e.target.value);
            e.target.value = '';
        }
    });
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
        outputField.textContent = handleCalculationError(error);
        outputField.style.color = 'var(--hacker-red)';
        outputField.style.animation = 'error-pulse 0.5s';
        setTimeout(() => outputField.style.animation = '', 500);
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
        outputField.textContent = handleCalculationError(error);
        outputField.style.animation = 'error-pulse 0.5s';
        setTimeout(() => outputField.style.animation = '', 500);
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
        document.getElementById('graphing-output').textContent = 'Invalid function';
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

function initVoiceAI() {
    if (annyang) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
                const commands = {
                    'Nexus calculate *expression': (expression) => {
                        const activeTab = document.querySelector('.tab-content:not(.hidden)');
                        const activeInput = activeTab.querySelector('.question-display');
                        expression = expression
                            .replace(/plus/g, '+')
                            .replace(/minus/g, '-')
                            .replace(/times/g, '*')
                            .replace(/divided by/g, '/');
                        activeInput.value = expression;
                        calculate(expression, activeInput.nextElementSibling);
                    },
                    'Nexus clear': () => {
                        const activeInput = document.querySelector('.question-display');
                        activeInput.value = '';
                        activeInput.nextElementSibling.textContent = '';
                    },
                    'Nexus switch to *tab': (tab) => {
                        const tabButton = [...document.querySelectorAll('.tab-button')].find(
                            btn => btn.textContent.toLowerCase() === tab.toLowerCase()
                        );
                        if (tabButton) tabButton.click();
                    },
                    'Nexus graph *function': (func) => {
                        document.getElementById('graphing-input').value = func;
                        document.querySelector('.plot-button').click();
                    }
                };
                annyang.addCommands(commands);
            })
            .catch((error) => {
                console.error('Microphone access denied:', error);
            });

        document.getElementById('voice-command').addEventListener('click', () => {
            if (!isListening) {
                annyang.start();
                document.getElementById('voice-status').textContent = "Listening...";
                isListening = true;
            } else {
                annyang.abort();
                document.getElementById('voice-status').textContent = "";
                isListening = false;
            }
        });
    }
}

// Enhanced Error Handling
function handleCalculationError(error) {
    const errorMessages = {
        'Division by zero': "Warning: Attempting to divide by zero",
        'Undefined symbol': "Error: Unknown variable detected",
        'Parenthesis mismatch': "Syntax Error: Parenthesis mismatch"
    };

    const message = errorMessages[error.message] || "Quantum computation error";
    speak(message);
    return message;
}

// Text-to-Speech
function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synth.getVoices().find(voice => voice.name === 'Microsoft David - English (United States)');
    synth.speak(utterance);
                                             }

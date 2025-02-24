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

    // Initialize hologram effect
    initHologram();

    // Fetch live crypto prices
    updateCryptoPrices();
    setInterval(updateCryptoPrices, 10000);

    // Initialize buttons
    initButtons();

    // Voice Recognition
    const voiceButton = document.getElementById('voice-button');
    voiceButton.addEventListener('click', startVoiceRecognition);
});

// =====================
// 3D HOLOGRAM BACKGROUND
// =====================
function initHologram() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('hologram-bg'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.IcosahedronGeometry(3);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const hologram = new THREE.Mesh(geometry, material);
    scene.add(hologram);

    camera.position.z = 5;

    const animate = () => {
        requestAnimationFrame(animate);
        hologram.rotation.x += 0.01;
        hologram.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    animate();
}

// =====================
// CALCULATOR CORE
// =====================
const questionDisplay = document.getElementById('question-display');
const answerDisplay = document.getElementById('answer-display');

function initButtons() {
    const buttons = [
        '7', '8', '9', '/', 'C',
        '4', '5', '6', '*', '⌫',
        '1', '2', '3', '-', 'π',
        '0', '.', '=', '+', '√'
    ];

    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn;
        button.onclick = () => handleInput(btn);
        document.getElementById('buttons').appendChild(button);
    });
}

function handleInput(value) {
    if (value === 'C') {
        questionDisplay.value = '';
        answerDisplay.textContent = '';
    } else if (value === '⌫') {
        questionDisplay.value = questionDisplay.value.slice(0, -1);
    } else if (value === '=') {
        calculate();
    } else {
        questionDisplay.value += value;
    }
}

function calculate() {
    try {
        const expression = questionDisplay.value;
        const result = math.evaluate(expression);

        // Generate steps
        const steps = [];
        const parsed = math.parse(expression);
        const compiled = parsed.compile();
        steps.push(`Expression: ${expression}`);
        steps.push(`Result: ${result}`);

        // Display steps
        const liveFeed = document.getElementById('live-feed');
        liveFeed.innerHTML = '';
        steps.forEach(step => {
            const div = document.createElement('div');
            div.textContent = step;
            liveFeed.appendChild(div);
        });

        answerDisplay.textContent = result;
    } catch {
        answerDisplay.textContent = 'ERROR';
        alert('Invalid calculation.');
    }
}

// =====================
// VOICE AI INTEGRATION
// =====================
function startVoice

// =====================
// BOOT SEQUENCE
// =====================
document.addEventListener('DOMContentLoaded', () => {
    const bootLoader = document.querySelector('.boot-loader');
    const bootText = document.querySelector('.neon-text');
    const calculatorMain = document.querySelector('.nexus-ui');

    // Simulate boot sequence
    setTimeout(() => {
        bootLoader.style.display = 'none';
        bootText.textContent = 'System Online.';
        setTimeout(() => {
            bootText.style.display = 'none';
            calculatorMain.classList.remove('hidden');
            calculatorMain.style.display = 'block';
        }, 1000);
    }, 3000);

    // Initialize hologram effect
    initHologram();

    // Fetch live crypto prices
    updateCryptoPrices();
    setInterval(updateCryptoPrices, 10000);

    // Initialize buttons
    initButtons();
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
const display = document.getElementById('display');

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
        display.textContent = '0';
    } else if (value === '⌫') {
        backspace();
    } else if (value === '=') {
        calculate();
    } else {
        display.textContent = display.textContent === '0' ? value : display.textContent + value;
    }
}

function backspace() {
    display.textContent = display.textContent.slice(0, -1) || '0';
}

function calculate() {
    try {
        display.textContent = math.evaluate(display.textContent);
    } catch {
        display.textContent = 'ERROR';
    }
}

// =====================
// VOICE AI INTEGRATION
// =====================
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.lang = 'en-US';

recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    if (command.includes('calculate')) {
        const equation = command.replace('calculate', '').trim();
        display.textContent = equation;
        calculate();
    }
};

recognition.start();

// =====================
// LIVE CRYPTO PRICES
// =====================
async function updateCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        const data = await response.json();
        document.getElementById('crypto-ticker').innerHTML = `
            <div>BTC: $${data.bitcoin.usd}</div>
            <div>ETH: $${data.ethereum.usd}</div>
        `;
    } catch {
        document.getElementById('crypto-ticker').textContent = "Quantum data stream offline";
    }
}

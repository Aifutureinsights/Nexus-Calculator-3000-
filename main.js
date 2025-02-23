// =====================
// IRON MAN INTRO
// =====================
const intro = document.getElementById('ironman-intro');
const nexusUI = document.querySelector('.nexus-ui');

setTimeout(() => {
    intro.style.display = 'none';
    nexusUI.style.display = 'block';
    speak("Welcome to Nexus Calculator 3000");
}, 5000); // 5-second intro

// =====================
// J.A.R.V.I.S. VOICE
// =====================
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes('Zira'));
    speechSynthesis.speak(utterance);
}

// =====================
// 3D HOLOGRAM BACKGROUND
// =====================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('hologram-bg'),
    alpha: true 
});
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

// =====================
// CALCULATOR CORE
// =====================
const display = document.getElementById('display');
const buttons = [
    '7','8','9','/','C',
    '4','5','6','*','⌫',
    '1','2','3','-','π',
    '0','.','=','+','√'
];

buttons.forEach(btn => {
    const button = document.createElement('button');
    button.textContent = btn;
    button.onclick = () => handleInput(btn);
    document.getElementById('buttons').appendChild(button);
});

function handleInput(value) {
    if(value === 'C') display.textContent = '0';
    else if(value === '⌫') backspace();
    else if(value === '=') calculate();
    else display.textContent = 
        display.textContent === '0' ? value : display.textContent + value;
}

function calculate() {
    try {
        display.textContent = math.evaluate(display.textContent);
    } catch {
        display.textContent = 'ERROR';
    }
}

// =====================
// LIVE CRYPTO PRICES
// =====================
async function updateCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        document.getElementById('crypto-ticker').innerHTML = `
            <div>BTC: $${data.bitcoin.usd}</div>
            <div>ETH: $${data.ethereum.usd}</div>
        `;
    } catch {
        document.getElementById('crypto-ticker').textContent = "Quantum data stream offline";
    }
}
setInterval(updateCryptoPrices, 10000);

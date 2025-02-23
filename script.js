class NexusCalculator { constructor() { this.display = document.getElementById('display'); this.speechSynthesis = window.speechSynthesis; this.initCalculator(); this.initHologram(); this.loadCryptoPrices(); this.initVoiceCommands(); }

initCalculator() {
    const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'];
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn;
        button.onclick = () => this.handleInput(btn);
        document.getElementById('buttons').appendChild(button);
    });
}

handleInput(value) {
    if (value === 'C') {
        this.display.textContent = '0';
    } else if (value === '=') {
        this.calculate();
    } else {
        this.display.textContent =
            this.display.textContent === '0' ? value : this.display.textContent + value;
    }
    this.speak(value);
}

calculate() {
    try {
        this.display.textContent = eval(this.display.textContent);
        this.speak(`The result is ${this.display.textContent}`);
    } catch {
        this.display.textContent = 'ERROR';
        this.speak("Error in calculation");
    }
}

async loadCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        document.getElementById('crypto-feed').textContent = `BTC: $${data.bitcoin.usd}`;
    } catch {
        document.getElementById('crypto-feed').textContent = "Live data unavailable";
    }
}

initHologram() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('hologram-bg'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.TorusGeometry(5, 2, 16, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc, wireframe: true });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    const light = new THREE.PointLight(0xffffff);
    light.position.set(10, 10, 10);
    scene.add(light);

    camera.position.z = 20;
    function animate() {
        requestAnimationFrame(animate);
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
}

initVoiceCommands() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript.trim();
        this.handleVoiceCommand(command);
    };
    recognition.start();
}

handleVoiceCommand(command) {
    if (command.includes("calculate")) {
        this.calculate();
    } else if (command.includes("clear")) {
        this.display.textContent = "0";
    } else {
        this.display.textContent += command;
    }
    this.speak(`You said: ${command}`);
}

speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    this.speechSynthesis.speak(utterance);
}

}

document.addEventListener("DOMContentLoaded", () => new NexusCalculator());


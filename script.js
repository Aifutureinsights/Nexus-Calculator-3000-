class NexusCalculator {
    constructor() {
        this.display = document.getElementById('display');
        this.speechSynthesis = window.speechSynthesis;
        this.initCalculator();
        this.initHologram();
        this.loadCryptoPrices();
    }

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
            this.display.textContent = this.display.textContent === '0' ? value : this.display.textContent + value;
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
        const renderer = new THREE.WebGLRenderer({ alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('hologram-bg').appendChild(renderer.domElement);

        const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const knot = new THREE.Mesh(geometry, material);
        scene.add(knot);

        camera.position.z = 50;

        function animate() {
            requestAnimationFrame(animate);
            knot.rotation.x += 0.01;
            knot.rotation.y += 0.01;
            renderer.render(scene, camera);
        }

        animate();
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        this.speechSynthesis.speak(utterance);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new NexusCalculator();
});

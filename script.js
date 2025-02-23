class NexusCalculator {
    constructor() {
        this.display = document.getElementById('display');
        this.initInterface();
        this.initHologram();
        this.initDataStream();
    }

    initInterface() {
        const buttons = [
            '7','8','9','/','C',
            '4','5','6','*','⌫',
            '1','2','3','-','π',
            '0','.','=','+','√'
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'cyber-btn';
            button.textContent = btn;
            button.addEventListener('click', () => this.handleInput(btn));
            document.getElementById('buttons').appendChild(button);
        });
    }

    handleInput(value) {
        if(value === 'C') this.clearDisplay();
        else if(value === '⌫') this.backspace();
        else if(value === '=') this.calculate();
        else this.updateDisplay(value);
    }

    updateDisplay(value) {
        this.display.textContent = this.display.textContent === '0' ? value : this.display.textContent + value;
    }

    calculate() {
        try {
            this.display.textContent = math.evaluate(this.display.textContent);
        } catch {
            this.display.textContent = 'ERROR';
        }
    }

    async initDataStream() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
            const data = await response.json();
            document.getElementById('live-feed').textContent = 
                `BTC: $${data.bitcoin.usd} | ETH: $${data.ethereum?.usd || 'N/A'}`;
        } catch {
            document.getElementById('live-feed').textContent = "Quantum data stream offline";
        }
    }

    initHologram() {
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
    }
}

// Initialize
window.addEventListener('load', () => new NexusCalculator());

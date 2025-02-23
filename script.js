class NexusCalculator {
    constructor() {
        this.display = document.getElementById('display');
        this.buttons = [
            '7','8','9','/','C',
            '4','5','6','*','⌫',
            '1','2','3','-','π',
            '0','.','=','+','√'
        ];
        this.init();
    }

    init() {
        // Create buttons
        this.buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'cyber-btn';
            button.textContent = btn;
            button.addEventListener('click', () => this.handleInput(btn));
            document.getElementById('buttons').appendChild(button);
        });

        // Initialize 3D background
        this.initHologram();
        
        // Start data feed
        this.startDataStream();
    }

    handleInput(value) {
        if(value === 'C') this.clear();
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

    async startDataStream() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
            const data = await response.json();
            document.getElementById('live-feed').textContent = 
                `BTC: $${data.bitcoin.usd} | ETH: $${data.ethereum?.usd || 'N/A'}`;
        } catch {
            document.getElementById('live-feed').textContent = "Live data unavailable";
        }
    }

    initHologram() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('hologram-bg') });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            wireframe: true 
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();
    }
}

// Initialize
window.addEventListener('load', () => new NexusCalculator());
class HologramEffect {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('tron-grid'), alpha: true });
        this.initScene();
    }

    initScene() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        const grid = new THREE.GridHelper(100, 100, 0x00ffff, 0x003333);
        this.scene.add(grid);

        this.camera.position.z = 50;

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the hologram effect
new HologramEffect();

document.addEventListener('DOMContentLoaded', () => {
    const bootLoader = document.querySelector('.boot-loader');
    const bootText = document.querySelector('.neon-text');
    const calculatorMain = document.querySelector('.calculator-main');

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

    // Initialize Three.js effects
    new HologramEffect();

    // Fetch live crypto price
    fetchCryptoPrice();

    // Button click event
    document.getElementById('calc-button').addEventListener('click', () => {
        const input = document.getElementById('calc-input').value;
        try {
            const calculator = new NexusCalculator();
            const { result, steps } = calculator.calculate(input);

            // Display steps
            const stepsList = document.getElementById('steps-list');
            stepsList.innerHTML = '';
            steps.forEach(step => {
                const li = document.createElement('li');
                li.textContent = step;
                stepsList.appendChild(li);
            });
        } catch (error) {
            alert('Invalid calculation.');
        }
    });
});

async function fetchCryptoPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        document.getElementById('crypto-price').textContent = `Bitcoin Price: $${data.bitcoin.usd}`;
    } catch (error) {
        document.getElementById('crypto-price').textContent = 'Failed to load crypto price.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const calculator = new NexusCalculator();
    const voiceAI = new VoiceAI();

    // Initialize Three.js effects
    new HologramEffect();

    // Button click event
    document.getElementById('calc-button').addEventListener('click', () => {
        const input = document.getElementById('calc-input').value;
        try {
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

    // Fetch live crypto price
    fetchCryptoPrice();
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
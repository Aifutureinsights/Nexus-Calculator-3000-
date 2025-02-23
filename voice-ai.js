class VoiceAI {
    constructor() {
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.synth = window.speechSynthesis;
        this.configureVoice();
    }

    configureVoice() {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.onresult = (event) => this.handleVoiceInput(event);
    }

    handleVoiceInput(event) {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        if (event.results[0].isFinal) {
            this.processCommand(transcript);
        }
    }

    processCommand(command) {
        const calculator = new NexusCalculator();
        if (command.includes('calculate')) {
            const equation = command.replace('calculate', '').trim();
            const { result, steps } = calculator.calculate(equation);

            // Display steps in the UI
            const stepsList = document.getElementById('steps-list');
            stepsList.innerHTML = '';
            steps.forEach(step => {
                const li = document.createElement('li');
                li.textContent = step;
                stepsList.appendChild(li);
            });

            const response = new SpeechSynthesisUtterance(`The result is ${result}`);
            this.synth.speak(response);
        }
    }
}
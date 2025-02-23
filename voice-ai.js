class VoiceAI {
    constructor() {
        // Check if the Web Speech API is supported
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice recognition is not supported in this browser. Please use Google Chrome.");
            return;
        }

        // Initialize speech recognition
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.synth = window.speechSynthesis;

        // Configure voice recognition settings
        this.configureVoice();
    }

    configureVoice() {
        this.recognition.continuous = true; // Listen continuously
        this.recognition.interimResults = true; // Show interim results
        this.recognition.lang = 'en-US'; // Set language to English

        // Handle recognized speech
        this.recognition.onresult = (event) => this.handleVoiceInput(event);

        // Handle errors
        this.recognition.onerror = (event) => {
            console.error("Voice recognition error:", event.error);
            alert("Error with voice recognition. Please try again.");
        };
    }

    handleVoiceInput(event) {
        // Extract the transcript from the speech recognition result
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        // Process the command when the result is final
        if (event.results[0].isFinal) {
            this.processCommand(transcript);
        }
    }

    processCommand(command) {
        const calculator = new NexusCalculator();

        // Check if the command includes "calculate"
        if (command.toLowerCase().includes('calculate')) {
            const equation = command.replace(/calculate/i, '').trim(); // Remove "calculate" from the input
            try {
                const { result, steps } = calculator.calculate(equation);

                // Display steps in the UI
                const stepsList = document.getElementById('steps-list');
                stepsList.innerHTML = '';
                steps.forEach(step => {
                    const li = document.createElement('li');
                    li.textContent = step;
                    stepsList.appendChild(li);
                });

                // Speak the result
                const response = new SpeechSynthesisUtterance(`The result is ${result}`);
                this.synth.speak(response);
            } catch (error) {
                alert('Invalid calculation.');
            }
        } else {
            alert('Command not recognized. Try saying "Calculate 2 + 2".');
        }
    }
}

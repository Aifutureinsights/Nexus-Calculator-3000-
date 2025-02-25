// Voice Commands Simplified
let isListening = false;

function initVoiceCommands() {
    if (annyang) {
        annyang.addCommands({
            'calculate *term': (term) => {
                const activeInput = document.querySelector('.question-display:not([hidden])');
                activeInput.value = term.replace(/plus/g, '+').replace(/minus/g, '-');
                calculate(activeInput.value, activeInput.nextElementSibling);
            },
            'clear': () => document.querySelector('.question-display').value = '',
            'switch to *tab': (tab) => {
                document.querySelector(`[data-tab="${tab.toLowerCase()}"]`).click();
            }
        });
        
        document.getElementById('voice-command').onclick = () => {
            if (!isListening) {
                annyang.start();
                document.getElementById('jarvis-response').textContent = "Listening...";
                isListening = true;
            } else {
                annyang.abort();
                document.getElementById('jarvis-response').textContent = "";
                isListening = false;
            }
        };
    }
}

// Mobile-Optimized Calculator Logic
function calculate(expression, output) {
    try {
        expression = expression
            .replace(/π/g, 'pi')
            .replace(/√/g, 'sqrt')
            .replace(/\^/g, '^');
        
        const result = math.evaluate(expression);
        output.textContent = result;
        output.style.color = var(--matrix-green);
    } catch (e) {
        output.textContent = 'Error';
        output.style.color = var(--hacker-red);
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelector('.loading-screen').classList.add('hidden');
        document.querySelector('.nexus-ui').classList.remove('hidden');
        initVoiceCommands();
    }, 2000);
});

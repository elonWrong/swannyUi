import { generateResponse } from './api.js';
import { state } from '../main.js';

export function setupUI() {
    // Auto-resize textarea
    const textarea = document.getElementById('prompt');
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });

    // Make temperature value editable
    setupEditableTemperature();

    // Enter key to submit
    textarea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateResponse();
        }
    });

    // Setup settings modal events
    setupModals();
}
function updateTemperatureValue(value) {
    const formattedValue = parseFloat(value).toFixed(1);
    document.getElementById('temperatureValue').textContent = formattedValue;
}

function setupEditableTemperature() {
    const temperatureValue = document.getElementById('temperatureValue');
    const temperatureSlider = document.getElementById('temperature');

    temperatureValue.addEventListener('click', function () {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.max = '2';
        input.step = '0.1';
        input.value = this.textContent;
        input.style.width = '50px';

        input.addEventListener('blur', function () {
            const newValue = Math.min(Math.max(parseFloat(this.value) || 0, 0), 2);
            updateTemperatureValue(newValue);
            temperatureSlider.value = newValue;
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                this.blur();
            }
        });

        this.textContent = '';
        this.appendChild(input);
        input.focus();
    });
}

function setupModals() {
    // Settings modal functionality
    document.getElementById('settingsButton').addEventListener('click', openSettingsModal);
    document.querySelector('.close-button').addEventListener('click', closeSettingsModal);

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('settingsModal');
        if (event.target === modal) {
            closeSettingsModal();
        }
    });
}

export function openSettingsModal() {
    document.getElementById('settingsModal').style.display = 'block';
    // Refresh model list
    import('./api.js').then(module => module.fetchModels());
}

export function closeSettingsModal() {
    document.getElementById('settingsModal').style.display = 'none';
}
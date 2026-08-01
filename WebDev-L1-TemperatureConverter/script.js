document.addEventListener('DOMContentLoaded', () => {
    const tempInput = document.getElementById('temp-value');
    const unitSelect = document.getElementById('unit-select');
    const convertBtn = document.getElementById('convert-btn');
    const errorBox = document.getElementById('error-box');
    const errorText = document.getElementById('error-text');
    const resultsArea = document.getElementById('results-area');

    const resCelsius = document.getElementById('res-celsius');
    const resFahrenheit = document.getElementById('res-fahrenheit');
    const resKelvin = document.getElementById('res-kelvin');

    // Convert Action Trigger
    convertBtn.addEventListener('click', performConversion);

    // Auto Trigger on Enter Key
    tempInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performConversion();
        }
    });

    function performConversion() {
        const rawValue = tempInput.value.trim();
        const selectedUnit = unitSelect.value;

        // 1. Validation: Reject Empty / Non-numeric Inputs
        if (rawValue === '' || isNaN(rawValue)) {
            showError("Please enter a valid numeric temperature value.");
            return;
        }

        const value = parseFloat(rawValue);

        // 2. Absolute Zero Edge Case Validation Check
        // Absolute Zero thresholds: C: -273.15°C | F: -459.67°F | K: 0K
        if (selectedUnit === 'C' && value < -273.15) {
            showError("Temperature cannot be below Absolute Zero (-273.15°C).");
            return;
        } else if (selectedUnit === 'F' && value < -459.67) {
            showError("Temperature cannot be below Absolute Zero (-459.67°F).");
            return;
        } else if (selectedUnit === 'K' && value < 0) {
            showError("Temperature cannot be below Absolute Zero (0 K).");
            return;
        }

        // Clear any previous error state
        hideError();

        // 3. Perform Temperature Calculations
        let celsius, fahrenheit, kelvin;

        if (selectedUnit === 'C') {
            celsius = value;
            fahrenheit = (value * 9/5) + 32;
            kelvin = value + 273.15;
        } else if (selectedUnit === 'F') {
            celsius = (value - 32) * 5/9;
            fahrenheit = value;
            kelvin = (value - 32) * 5/9 + 273.15;
        } else if (selectedUnit === 'K') {
            celsius = value - 273.15;
            fahrenheit = (value - 273.15) * 9/5 + 32;
            kelvin = value;
        }

        // 4. Render Converted Results to Display Area
        resCelsius.textContent = `${celsius.toFixed(2)} °C`;
        resFahrenheit.textContent = `${fahrenheit.toFixed(2)} °F`;
        resKelvin.textContent = `${kelvin.toFixed(2)} K`;

        // Show Results Container
        resultsArea.style.display = 'block';
    }

    function showError(msg) {
        errorText.textContent = msg;
        errorBox.style.display = 'flex';
        resultsArea.style.display = 'none';
    }

    function hideError() {
        errorBox.style.display = 'none';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Left Panel
    const tempInput = document.getElementById('temperatureInput');
    const inputUnitLabel = document.getElementById('inputUnitLabel');
    const unitFrom = document.getElementById('unitFrom');
    const unitTo = document.getElementById('unitTo');
    const swapBtn = document.getElementById('swapBtn');
    const convertBtn = document.getElementById('convertBtn');
    const errorMessage = document.getElementById('errorMessage');
    const presetBtns = document.querySelectorAll('.preset-btn');

    // DOM Elements - Right Panel
    const outputValue = document.getElementById('outputValue');
    const outputUnit = document.getElementById('outputUnit');
    const scaleCelsius = document.getElementById('scale-celsius');
    const scaleFahrenheit = document.getElementById('scale-fahrenheit');
    const scaleKelvin = document.getElementById('scale-kelvin');
    const rowCelsius = document.getElementById('row-celsius');
    const rowFahrenheit = document.getElementById('row-fahrenheit');
    const rowKelvin = document.getElementById('row-kelvin');
    const thermoLiquid = document.getElementById('thermoLiquid');
    const formulaText = document.getElementById('formulaText');
    const formulaDesc = document.getElementById('formulaDesc');

    // Event Listeners
    convertBtn.addEventListener('click', handleConversion);
    
    swapBtn.addEventListener('click', () => {
        const temp = unitFrom.value;
        unitFrom.value = unitTo.value;
        unitTo.value = temp;
        updateInputUnitLabel();
        clearOutput();
    });

    unitFrom.addEventListener('change', updateInputUnitLabel);
    
    unitTo.addEventListener('change', () => {
        updateActiveScaleRow();
    });

    tempInput.addEventListener('input', () => {
        if (tempInput.value === '') {
            clearOutput();
        }
    });

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-value');
            const unit = btn.getAttribute('data-unit');
            unitFrom.value = unit;
            tempInput.value = val;
            updateInputUnitLabel();
            handleConversion();
        });
    });

    // Helper: Update floating unit label in input
    function updateInputUnitLabel() {
        const from = unitFrom.value;
        if (from === 'celsius') inputUnitLabel.textContent = '°C';
        else if (from === 'fahrenheit') inputUnitLabel.textContent = '°F';
        else if (from === 'kelvin') inputUnitLabel.textContent = 'K';
    }

    // Helper: Update highlighted row in equivalent scales
    function updateActiveScaleRow() {
        rowCelsius.classList.remove('active');
        rowFahrenheit.classList.remove('active');
        rowKelvin.classList.remove('active');
        
        const to = unitTo.value;
        if (to === 'celsius') rowCelsius.classList.add('active');
        else if (to === 'fahrenheit') rowFahrenheit.classList.add('active');
        else if (to === 'kelvin') rowKelvin.classList.add('active');
    }

    function getUnitSymbol(unit) {
        if (unit === 'celsius') return '°C';
        if (unit === 'fahrenheit') return '°F';
        if (unit === 'kelvin') return 'K';
        return '';
    }

    function clearOutput() {
        outputValue.textContent = '--';
        outputUnit.textContent = '';
        scaleCelsius.textContent = '--';
        scaleFahrenheit.textContent = '--';
        scaleKelvin.textContent = '--';
        formulaText.textContent = '--';
        formulaDesc.textContent = 'Enter a temperature to see the formula.';
        errorMessage.textContent = '';
        thermoLiquid.style.height = '0%';
    }

    function handleConversion() {
        const val = parseFloat(tempInput.value);
        const from = unitFrom.value;
        const to = unitTo.value;

        if (isNaN(val)) {
            errorMessage.textContent = 'Please enter a valid number.';
            clearOutput();
            return;
        }

        errorMessage.textContent = '';
        updateActiveScaleRow();

        try {
            const results = calculateTemperatures(val, from);
            
            // Set main output
            let finalVal = results[to];
            outputValue.textContent = finalVal.toFixed(2);
            outputUnit.textContent = getUnitSymbol(to);

            // Set equivalent scales
            scaleCelsius.textContent = results.celsius.toFixed(2);
            scaleFahrenheit.textContent = results.fahrenheit.toFixed(2);
            scaleKelvin.textContent = results.kelvin.toFixed(2);

            // Update thermometer (-20C to 100C maps to 0% to 100%)
            // Let's cap the visual range between -20C and 100C for the fill
            let cVal = results.celsius;
            let percent = ((cVal + 20) / 120) * 100;
            if (percent < 0) percent = 0;
            if (percent > 100) percent = 100;
            thermoLiquid.style.height = `${percent}%`;

            // Update Formula Explainer
            const formulaData = getFormulaExplainer(val, from, to, finalVal.toFixed(2));
            formulaText.textContent = formulaData.formula;
            formulaDesc.textContent = formulaData.desc;

        } catch (error) {
            errorMessage.textContent = error.message;
            clearOutput();
        }
    }

    function calculateTemperatures(value, from) {
        let celsius;

        if (from === 'celsius') {
            celsius = value;
        } else if (from === 'fahrenheit') {
            celsius = (value - 32) * 5 / 9;
        } else if (from === 'kelvin') {
            celsius = value - 273.15;
        }

        if (celsius < -273.15) {
            throw new Error('Temperature cannot be below absolute zero.');
        }

        return {
            celsius: celsius,
            fahrenheit: (celsius * 9 / 5) + 32,
            kelvin: celsius + 273.15
        };
    }

    function getFormulaExplainer(val, from, to, result) {
        if (from === to) {
            return {
                formula: `${val} ${getUnitSymbol(from)} = ${result} ${getUnitSymbol(to)}`,
                desc: 'No conversion needed for the same unit.'
            };
        }

        if (from === 'celsius' && to === 'fahrenheit') {
            return {
                formula: `(${val}°C × 9/5) + 32 = ${result}°F`,
                desc: 'Multiply the Celsius temperature by 9/5 (1.8) and then add 32.'
            };
        }
        if (from === 'celsius' && to === 'kelvin') {
            return {
                formula: `${val}°C + 273.15 = ${result}K`,
                desc: 'Add 273.15 to the Celsius temperature.'
            };
        }
        if (from === 'fahrenheit' && to === 'celsius') {
            return {
                formula: `(${val}°F - 32) × 5/9 = ${result}°C`,
                desc: 'Subtract 32 from the Fahrenheit temperature, then multiply by 5/9.'
            };
        }
        if (from === 'fahrenheit' && to === 'kelvin') {
            return {
                formula: `(${val}°F - 32) × 5/9 + 273.15 = ${result}K`,
                desc: 'Convert Fahrenheit to Celsius, then add 273.15.'
            };
        }
        if (from === 'kelvin' && to === 'celsius') {
            return {
                formula: `${val}K - 273.15 = ${result}°C`,
                desc: 'Subtract 273.15 from the Kelvin temperature.'
            };
        }
        if (from === 'kelvin' && to === 'fahrenheit') {
            return {
                formula: `(${val}K - 273.15) × 9/5 + 32 = ${result}°F`,
                desc: 'Convert Kelvin to Celsius, then convert to Fahrenheit.'
            };
        }
    }

    // Initialize UI state
    updateInputUnitLabel();
    updateActiveScaleRow();
});

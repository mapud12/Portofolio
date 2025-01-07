const display = document.querySelector('.calculator-display');
        const buttons = document.querySelectorAll('.calculator-buttons button');
        let currentInput = '';
        let result = '';

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.textContent;

                if (value === 'C') {
                    currentInput = '';
                    result = '';
                    display.textContent = '0';
                } else if (value === 'DEL') {
                    currentInput = currentInput.slice(0, -1);
                    display.textContent = currentInput || '0';
                } else if (value === '=') {
                    try {
                        result = eval(currentInput);
                        display.textContent = result;
                        currentInput = result;
                    } catch {
                        display.textContent = 'Error';
                        currentInput = '';
                    }
                } else {
                    currentInput += value;
                    display.textContent = currentInput;
                }
            });
        });
    

        document.addEventListener('DOMContentLoaded', () => {
            const previousOperandElement = document.getElementById('previous-operand');
            const currentOperandElement = document.getElementById('current-operand');
            const numberButtons = document.querySelectorAll('.number-btn');
            const operationButtons = document.querySelectorAll('.operation-btn');
            const equalsButton = document.getElementById('equals');
            const clearButton = document.getElementById('clear');
            const deleteButton = document.getElementById('delete');
            const decimalButton = document.getElementById('decimal');
            
            let currentOperand = '0';
            let previousOperand = '';
            let operation = undefined;
            let resetScreen = false;

            function updateDisplay() {
                currentOperandElement.textContent = currentOperand;
                if (operation != null) {
                    previousOperandElement.textContent = 
                        `${previousOperand} ${getOperationSymbol(operation)}`;
                } else {
                    previousOperandElement.textContent = '';
                }
            }

            function getOperationSymbol(operation) {
                switch(operation) {
                    case '+': return '+';
                    case '-': return '−';
                    case '*': return '×';
                    case '/': return '÷';
                    default: return '';
                }
            }

            function appendNumber(number) {
                if (currentOperand === '0' || resetScreen) {
                    currentOperand = '';
                    resetScreen = false;
                }
                
                // Prevent numbers longer than 12 digits
                if (currentOperand.length >= 12) return;
                
                currentOperand += number;
            }

            function appendDecimal() {
                if (resetScreen) {
                    currentOperand = '0';
                    resetScreen = false;
                }
                
                if (currentOperand.includes('.')) return;
                
                if (currentOperand === '') {
                    currentOperand = '0';
                }
                
                currentOperand += '.';
            }

            function chooseOperation(op) {
                if (currentOperand === '') return;
                
                if (previousOperand !== '') {
                    compute();
                }
                
                operation = op;
                previousOperand = currentOperand;
                resetScreen = true;
            }

            function compute() {
                let computation;
                const prev = parseFloat(previousOperand);
                const current = parseFloat(currentOperand);
                
                if (isNaN(prev) || isNaN(current)) return;
                
                switch (operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '*':
                        computation = prev * current;
                        break;
                    case '/':
                        if (current === 0) {
                            currentOperand = 'Error';
                            resetScreen = true;
                            operation = undefined;
                            previousOperand = '';
                            updateDisplay();
                            return;
                        }
                        computation = prev / current;
                        break;
                    default:
                        return;
                }
                
                // Round to 10 decimal places to avoid floating point issues
                computation = Math.round(computation * 10000000000) / 10000000000;
                
                // Convert to exponential notation if number is too large
                if (computation.toString().length > 12 && 
                    Math.abs(computation) > 999999999999) {
                    computation = computation.toExponential(6);
                }
                
                currentOperand = computation.toString();
                operation = undefined;
                previousOperand = '';
                resetScreen = true;
            }

            function deleteNumber() {
                currentOperand = currentOperand.slice(0, -1);
                if (currentOperand === '') {
                    currentOperand = '0';
                }
            }

            function clearAll() {
                currentOperand = '0';
                previousOperand = '';
                operation = undefined;
            }

            function handleButtonClick(button) {
                button.classList.add('pressed');
                setTimeout(() => {
                    button.classList.remove('pressed');
                }, 100);
            }

            // Button event listeners
            numberButtons.forEach(button => {
                button.addEventListener('click', () => {
                    handleButtonClick(button);
                    appendNumber(button.textContent);
                    updateDisplay();
                });
            });

            operationButtons.forEach(button => {
                button.addEventListener('click', () => {
                    handleButtonClick(button);
                    chooseOperation(button.id === 'multiply' ? '*' : 
                                   button.id === 'divide' ? '/' : 
                                   button.id === 'add' ? '+' : 
                                   button.id === 'subtract' ? '-' : '');
                    updateDisplay();
                });
            });

            equalsButton.addEventListener('click', () => {
                handleButtonClick(equalsButton);
                compute();
                updateDisplay();
            });

            clearButton.addEventListener('click', () => {
                handleButtonClick(clearButton);
                clearAll();
                updateDisplay();
            });

            deleteButton.addEventListener('click', () => {
                handleButtonClick(deleteButton);
                deleteNumber();
                updateDisplay();
            });

            decimalButton.addEventListener('click', () => {
                handleButtonClick(decimalButton);
                appendDecimal();
                updateDisplay();
            });

            // Keyboard support
            document.addEventListener('keydown', (e) => {
                if (/^[0-9.]$/.test(e.key)) {
                    e.preventDefault();
                    const button = e.key === '.' ? decimalButton : 
                        document.getElementById(
                            e.key === '0' ? 'zero' : 
                            e.key === '1' ? 'one' : 
                            e.key === '2' ? 'two' : 
                            e.key === '3' ? 'three' : 
                            e.key === '4' ? 'four' : 
                            e.key === '5' ? 'five' : 
                            e.key === '6' ? 'six' : 
                            e.key === '7' ? 'seven' : 
                            e.key === '8' ? 'eight' : 'nine'
                        );
                    if (button) {
                        handleButtonClick(button);
                        if (e.key === '.') {
                            appendDecimal();
                        } else {
                            appendNumber(e.key);
                        }
                        updateDisplay();
                    }
                } else if (/^[+\-*/]$/.test(e.key)) {
                    e.preventDefault();
                    const button = 
                        e.key === '+' ? document.getElementById('add') : 
                        e.key === '-' ? document.getElementById('subtract') : 
                        e.key === '*' ? document.getElementById('multiply') : 
                        document.getElementById('divide');
                    if (button) {
                        handleButtonClick(button);
                        chooseOperation(e.key);
                        updateDisplay();
                    }
                } else if (e.key === 'Enter' || e.key === '=') {
                    e.preventDefault();
                    handleButtonClick(equalsButton);
                    compute();
                    updateDisplay();
                } else if (e.key === 'Backspace') {
                    e.preventDefault();
                    handleButtonClick(deleteButton);
                    deleteNumber();
                    updateDisplay();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    handleButtonClick(clearButton);
                    clearAll();
                    updateDisplay();
                }
            });
            
            // Initial display
            updateDisplay();
        });
    
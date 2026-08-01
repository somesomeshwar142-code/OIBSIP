/**
 * Precision Vanilla JS Calculator Engine
 * Strict evaluation logic without using eval()
 */

class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.isError = false;
        this.updateDisplay();
    }

    delete() {
        if (this.isError) {
            this.clear();
            return;
        }
        if (this.shouldResetScreen) return;
        if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.isError) {
            this.clear();
        }
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.isError) return;
        if (this.currentOperand === '') return;

        if (this.previousOperand !== '') {
            this.compute();
            if (this.isError) return;
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
            case '−':
                computation = prev - current;
                break;
            case '×':
            case '*':
                computation = prev * current;
                break;
            case '÷':
            case '/':
                if (current === 0) {
                    this.currentOperand = 'Cannot divide by 0';
                    this.previousOperand = '';
                    this.operation = undefined;
                    this.isError = true;
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Clean floating point precision issues (e.g., 0.1 + 0.2 = 0.3)
        computation = Math.round(computation * 1e12) / 1e12;

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    toggleSign() {
        if (this.isError || this.currentOperand === '0') return;
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.slice(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
        this.updateDisplay();
    }

    percentage() {
        if (this.isError) return;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
        this.updateDisplay();
    }

    getDisplayNumber(number) {
        if (this.isError) return number;
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        if (this.isError) {
            this.currentOperandElement.innerText = this.currentOperand;
            this.currentOperandElement.classList.add('error-state');
            this.previousOperandElement.innerText = '';
            return;
        }

        this.currentOperandElement.classList.remove('error-state');
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);

        if (this.operation != null) {
            this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// Initialize Calculator on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previousOperand');
    const currentOperandElement = document.getElementById('currentOperand');
    const calculator = new Calculator(previousOperandElement, currentOperandElement);

    // Dynamic Event Delegation for Buttons
    const buttonsGrid = document.querySelector('.buttons-grid');

    buttonsGrid.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        if (button.dataset.number !== undefined) {
            calculator.appendNumber(button.dataset.number);
        } else if (button.dataset.operator !== undefined) {
            calculator.chooseOperation(button.dataset.operator);
        } else if (button.dataset.action) {
            switch (button.dataset.action) {
                case 'clear':
                    calculator.clear();
                    break;
                case 'backspace':
                    calculator.delete();
                    break;
                case 'equals':
                    calculator.compute();
                    break;
                case 'decimal':
                    calculator.appendNumber('.');
                    break;
                case 'toggle-sign':
                    calculator.toggleSign();
                    break;
                case 'percent':
                    calculator.percentage();
                    break;
            }
        }
    });

    // Keyboard Access Support
    document.addEventListener('keydown', (e) => {
        if ((e.key >= '0' && e.key <= '9')) {
            calculator.appendNumber(e.key);
        } else if (e.key === '.') {
            calculator.appendNumber('.');
        } else if (e.key === '+' || e.key === '-') {
            calculator.chooseOperation(e.key);
        } else if (e.key === '*') {
            calculator.chooseOperation('×');
        } else if (e.key === '/') {
            e.preventDefault();
            calculator.chooseOperation('÷');
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            calculator.compute();
        } else if (e.key === 'Backspace') {
            calculator.delete();
        } else if (e.key === 'Escape') {
            calculator.clear();
        }
    });
});

'use client'

// Node Modules
import { useState } from "react";
import cn from "classnames";

// Component
import Toggle from "@/components/Toggle";
import CalculatorButton from "@/components/CalculatorButton";

// Lib
import { numberWithCommas } from "@/lib/helpers";
import { Button } from "@/components/ui/button";

function CalculatorPage() {
  const [toggleTheme, setToggleTheme] = useState(1);
  const [operand1, setOperand1] = useState<string>('');
  const [operator, setOperator] = useState<string | undefined>();
  const [operand2, setOperand2] = useState<string | undefined>();

  const handleClickToggle = () => {
    setToggleTheme((toggleTheme % 3) + 1);
  };

  const operateCalculator = async (
    operand1: string,
    operator: string,
    operand2: string
  ): Promise<string> => {
    const response = await fetch('http://127.0.0.1:5000/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        operand1: Number(operand1), 
        operator: operator === '+' ? 'ADD' : operator === '-' ? 'SUBTRACT' : operator === '*' ? 'MULTIPLY' : 'DIVIDE', 
        operand2: Number(operand2) 
      }),
    });

    if (!response.ok) {
      return 'Error';
    }

    const data = await response.json();
    return data.result.toString();
  };

  const handleClickButton = async (value: string) => {
    if (!isNaN(Number(value)) || value === '0' || value === '.') {
      if (!operator) {
        const newOperand1 = operand1 === 'Error' ? value : 
          (value === '.' && !operand1.includes('.') ? operand1 + value : operand1 + value);
        setOperand1(newOperand1);
      } else {
        const newOperand2 = operand2 ? 
          (value === '.' && !operand2.includes('.') ? operand2 + value : operand2 + value) : 
          value;
        setOperand2(newOperand2);
      }
    } else if (['+', '-', '*', '/'].includes(value)) {
      if (operand1 && !operator) {
        setOperator(value);
      }
    } else if (value === '=') {
      if (operand1 && operator && operand2) {
        const result = await operateCalculator(operand1, operator, operand2);
        console.log(result); // Debugging: log the result
        if (result === 'Error') {
          setOperand1('Error');
        } else {
          setOperand1(result);
        }
        setOperator(undefined);
        setOperand2(undefined);
      }
    } else if (value === 'DELETE') {
      if (operand2) {
        if (operand2.length > 1) {
          setOperand2(operand2.slice(0, -1));
        } else {
          setOperand2(undefined);
        }
      } else if (operand1.length > 1) {
        setOperand1(operand1.slice(0, -1));
      } else {
        setOperand1('0');
      }
    } else if (value === 'RESET') {
      setOperand1('0');
      setOperator(undefined);
      setOperand2(undefined);
    }
  };

  // Display logic: Show operand1 or operand2 based on input
  const displayValue = operand2 ? numberWithCommas(operand2) : numberWithCommas(operand1);

  return (
    <main className={cn("min-h-screen", `bg-main-${toggleTheme}`)}>
      <div className="block max-w-xl mx-auto py-20 px-6">
        {/* Header */}
        <div className="flex justify-between space-x-0 h-full w-full items-center">
          <h1 className={cn("text-2xl font-bold", `font-color-${toggleTheme}`)}>calculator</h1>
          <div className="flex">
            <p className={cn("text-sm font-bold mr-8 pb-1 self-end", `font-color-${toggleTheme}`)}>THEME</p>
            <Toggle currentTogglePosition={toggleTheme} onClickToggle={handleClickToggle} toggleAmount={3} />
          </div>
        </div>
        {/* Calculator Screen */}
        <div className={cn("h-32 w-full mt-6 p-8 rounded-lg", `bg-content-var-a-${toggleTheme}`)}>
          <p className={cn("font-bold text-6xl text-right overflow-scroll", `font-color-${toggleTheme}`)}>
            {displayValue}
          </p>
        </div>
        {/* Calculator Buttons */}
        <div className={cn("w-full grid grid-cols-4 gap-6 mt-6 p-8 rounded-lg", `bg-content-var-a-${toggleTheme}`)}>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('7')}>7</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('8')}>8</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('9')}>9</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('DELETE')}>DEL</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('4')}>4</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('5')}>5</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('6')}>6</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('+')}>+</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('1')}>1</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('2')}>2</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('3')}>3</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('-')}>-</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('.')}>.</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('0')}>0</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('/')}>/</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('*')}>*</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('RESET')}>RESET</Button>
          <Button variant='outline' size="lg" onClick={() => handleClickButton('=')}>=</Button>
        </div>
      </div>

      <footer className={"block bg-white w-full"}>
        <p className={"text-xs"}>
          
          Coded by <a className={"text-blue-700"} href="https://indivillage.com">Indivillage Tech Solutions</a>.
        </p>
      </footer>
    </main>
  );
}

export default CalculatorPage;
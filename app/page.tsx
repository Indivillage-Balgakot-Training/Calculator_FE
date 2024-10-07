'use client'

// Node Modules
import { useState, useEffect } from "react";
import cn from "classnames";
import { useRouter } from 'next/navigation';

// Components
import { Button } from "@/components/ui/button";

function CalculatorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expression, setExpression] = useState<string>('');
  const [history, setHistory] = useState<{ expression: string, result: string }[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');

    if (authStatus !== 'true') {
      router.push('/login');
    }
  }, [router]);

  const operateCalculator = async (expr: string): Promise<string> => {
    const response = await fetch('http://127.0.0.1:5000/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression: expr }),
    });

    if (!response.ok) return 'Error';

    const data = await response.json();
    setHistory(prev => [...prev, { expression: expr, result: data.result }]);
    return data.result.toString();
  };

  const handleClickButton = async (value: string) => {
    if (!isNaN(Number(value)) || value === '.' || ['+', '-', '*', '/', 'Cos', 'Sin', 'Tan', 'log', 'ln', 'π', '√', '^', 'e', '²', '^3', '%', '(', ')'].includes(value)) {
      setExpression(prev => prev + value);
    } else if (value === '=') {
      const result = await operateCalculator(expression);
      setExpression(result === 'Error' ? 'Error' : result);
    } else if (value === 'RESET') {
      setExpression('');
    } else if (value === 'DEL') {
      setExpression(expression.slice(0, -1));
    }
  };

  const toggleHistory = () => setShowHistory(prev => !prev);
  const displayValue = expression || '0';

  return (
    <main className={cn("min-h-screen ")}>
      <div className="block max-w-xl mx-auto mt-10 py-5 px-2 border border-gray-200 rounded-lg shadow-lg bg-black">
        {/* Header */}
        <div className="flex justify-between space-x-0 h-full w-full items-center ">
          <h1 className={cn("text-2xl font-bold shadow-lg text-white")}>Calculator</h1>
        </div>

        {/* Calculator Screen */}
        <div className={cn("h-32 w-full mt-6 p-8 border rounded-lg bg-white overflow-hidden")}>
          <p className={cn("font-bold text-6xl text-right text-black")}>{displayValue}</p>
        </div>
        {showHistory && (
        <div className={cn("mt-4 p-4 border rounded-lg bg-gray-100")}>
          <h2 className="text-lg font-bold">History</h2>
          <ul>
            {history.map((item, index) => (
              <li key={index} className="text-sm">{item.expression} = {item.result}</li>
            ))}
          </ul>
        </div>
      )}
        {/* Calculator Buttons */}
        <div className={cn("w-full grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 mt-6 p-4 rounded-lg")}>
          <Button variant='outline' size="lg" className="bg-teal-300 hover:bg-teal-500 text-white" onClick={() => handleClickButton('Cos')}>Cos</Button>
          <Button variant='outline' size="lg" className="bg-teal-300 hover:bg-teal-500 text-white" onClick={() => handleClickButton('Sin')}>Sin</Button>
          <Button variant='outline' size="lg" className="bg-teal-300 hover:bg-teal-500 text-white" onClick={() => handleClickButton('Tan')}>Tan</Button>
          <Button variant='outline' size="lg" className="bg-teal-300 hover:bg-teal-500 text-white" onClick={() => handleClickButton('log')}>log</Button>
          <Button variant='outline' size="lg" className="bg-teal-300 hover:bg-teal-500 text-white" onClick={() => handleClickButton('ln')}>ln</Button>
          <Button variant='outline' size="lg" className="bg-lime-300 hover:bg-lime-500 text-white" onClick={() => handleClickButton('(')}>(</Button>
          <Button variant='outline' size="lg" className="bg-lime-400 hover:bg-lime-400 text-white" onClick={() => handleClickButton(')')}>)</Button>
          <Button variant='outline' size="lg" className="bg-zinc-400 hover:bg-zinc-600 text-white" onClick={() => handleClickButton('7')}>7</Button>
          <Button variant='outline' size="lg" className="bg-zinc-400 hover:bg-zinc-600 text-white" onClick={() => handleClickButton('8')}>8</Button>
          <Button variant='outline' size="lg" className="bg-zinc-400 hover:bg-zinc-600 text-white" onClick={() => handleClickButton('9')}>9</Button>
          <Button variant='outline' size="lg" className="bg-orange-800 hover:bg-orange-900 text-white" onClick={() => handleClickButton('%')}>%</Button> 
          <Button variant='outline' size="lg"  className="hover:bg-gray-500 " onClick={() => handleClickButton('e')}>e</Button>
          <Button variant='outline' size="lg"  className="hover:bg-gray-500 " onClick={() => handleClickButton('²')}>x²</Button>
          <Button variant='outline' size="lg"  className="hover:bg-gray-500 " onClick={() => handleClickButton('^3')}>x^3</Button>
          <Button variant='outline' size="lg" className="bg-zinc-400 hover:bg-zinc-600 text-white" onClick={() => handleClickButton('4')}>4</Button>
          <Button variant='outline' size="lg" className="bg-zinc-400 hover:bg-zinc-600 text-white" onClick={() => handleClickButton('5')}>5</Button>
          <Button variant='outline' size="lg" className="bg-zinc-400 hover:bg-zinc-600 text-white" onClick={() => handleClickButton('6')}>6</Button>
          <Button variant='outline' size="lg" className="bg-orange-800 hover:bg-orange-900 text-white" onClick={() => handleClickButton('*')}>*</Button>
          <Button variant='outline' size="lg" className="bg-orange-800 hover:bg-orange-900 text-white" onClick={() => handleClickButton('/')}>/</Button>
          <Button variant='outline' size="lg"  className="hover:bg-gray-500 " onClick={() => handleClickButton('π')}>π</Button>
          <Button variant='outline' size="lg"  className="hover:bg-gray-500 " onClick={() => handleClickButton('√')}>√</Button>
          <Button variant='outline' size="lg" className="bg-zinc-400 hover:bg-zinc-600 text-white" onClick={() => handleClickButton('1')}>1</Button>
          <Button variant='outline' size="lg" className="bg-zinc-400 hover:bg-zinc-600 text-white" onClick={() => handleClickButton('2')}>2</Button>
          <Button variant='outline' size="lg" className="bg-zinc-400 hover:bg-zinc-600 text-white" onClick={() => handleClickButton('3')}>3</Button>
          <Button variant='outline' size="lg" className="bg-orange-800 hover:bg-orange-900 text-white" onClick={() => handleClickButton('+')}>+</Button>
          <Button variant='outline' size="lg" className="bg-orange-800 hover:bg-orange-900 text-white" onClick={() => handleClickButton('-')}>-</Button>
          <Button variant='outline' size="lg" className="bg-orange-800 hover:bg-orange-900 text-white" onClick={() => handleClickButton('.')}>.</Button>
          <Button variant='outline' size="lg" className="bg-orange-800 hover:bg-orange-900 text-white" onClick={() => handleClickButton('^')}>^</Button>
          <Button variant='outline' size="lg" className="bg-zinc-400 hover:bg-zinc-600 text-white" onClick={() => handleClickButton('0')}>0</Button>
          <Button variant='outline' size="lg" className="bg-indigo-500 hover:bg-indigo-900 top-1 left-1 text-white" onClick={toggleHistory}>
          📜  </Button>
          <Button variant='outline' size="lg" className="bg-blue-400 hover:bg-blue-600 text-white" onClick={() => handleClickButton('DEL')}>DEL</Button>
          <Button variant='outline' size="lg" className="col-span-2 bg-blue-400 hover:bg-blue-600 text-white" onClick={() => handleClickButton('RESET')}>RESET</Button>
          <Button variant='outline' size="lg" className="col-span-2 bg-purple-400 hover:bg-purple-600 text-white" onClick={() => handleClickButton('=')}>=</Button>
        </div>
      </div>
</main>
  );
}

export default CalculatorPage;

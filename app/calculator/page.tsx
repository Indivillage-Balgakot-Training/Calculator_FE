'use client';

import { useState, useEffect } from "react";
import cn from "classnames";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

function CalculatorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expression, setExpression] = useState<string>('');
  const [history, setHistory] = useState<{ username: string, expression: string, result: string }[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');

    if (authStatus !== 'true') {
      router.push('/login');
    } else {
      const username = localStorage.getItem('username') || '';
      const fetchUserHistory = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://127.0.0.1:5000/api/logs/${username}`);
          if (response.ok) {
            const data = await response.json();
            // Filter history to only include the current user
            const userHistory = data.filter((item: { username: string }) => item.username === username);
            setHistory(userHistory.map((item: { username: string; expression: string; result: string }) => ({
              username: item.username,
              expression: item.expression,
              result: item.result
            })));
            // Store in localStorage for persistence
            localStorage.setItem('userHistory', JSON.stringify(userHistory));
          } else {
            console.error('Failed to fetch history');
          }
        } catch (error) {
          console.error('Error fetching history:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserHistory();
    }
  }, [router]);

  useEffect(() => {
    // Load history from localStorage on component mount
    const storedHistory = localStorage.getItem('userHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const operateCalculator = async (expr: string): Promise<string> => {
    const username = localStorage.getItem('username');
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:5000/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: expr, username }),
      });

      if (!response.ok) throw new Error('Error calculating result');

      const data = await response.json();
      const newEntry = { username: username || "Anonymous", expression: expr, result: data.result };

      setHistory(prev => [...prev, newEntry]);
      // Update localStorage with new history
      localStorage.setItem('userHistory', JSON.stringify([...history, newEntry]));
      
      return data.result.toString();
    } catch (error) {
      console.error('Calculation error:', error);
      return 'Error';
    } finally {
      setLoading(false);
    }
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
    <main className={cn("min-h-screen flex flex-col items-center bg-[url('/img3.jpg')]")}>
      <div className="block max-w-xl mx-auto mt-10 py-5 px-2 border border-gray-200 rounded-lg shadow-lg bg-black">
        <div className="flex justify-between h-full items-center">
          <h1 className={cn("text-2xl font-bold shadow-lg text-white")}>Calculator</h1>
          <Link 
            href="/logout" 
            className="text-2xl bg-black-400 hover:bg-blue-600 text-white"
          >
            Logout
          </Link>
        </div>

        <div className={cn("h-32 w-full mt-6 p-8 border rounded-lg bg-white overflow-hidden")}>
          <p className={cn("font-bold text-6xl text-right text-black")}>{displayValue}</p>
        </div>
        
        {showHistory && (
          <div className={cn("mt-4 p-4 border rounded-lg bg-gray-100 max-h-40 overflow-y-auto")}>
            <h2 className="text-lg font-bold">History</h2>
            <ul>
              {history.map((item, index) => (
                <li key={index} className="text-sm">{item.username}: {item.expression} = {item.result}</li>
              ))}
            </ul>
            <Button variant='outline' size="sm" onClick={() => setHistory([])}>Clear History</Button>
          </div>
        )} 
        {/* Calculator Buttons */}
        <div className={cn("w-full grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 mt-6 p-4 rounded-lg")}>
          <Button variant='outline' size="lg" className="hidden sm:block bg-zinc-400 hover:bg-zinc-600 text-white col-span-1" onClick={() => handleClickButton('Cos')}>Cos</Button>
          <Button variant='outline' size="lg" className="hidden sm:block bg-zinc-400 hover:bg-zinc-600 text-white col-span-1" onClick={() => handleClickButton('Sin')}>Sin</Button>
          <Button variant='outline' size="lg" className="hidden sm:block bg-zinc-400 hover:bg-zinc-600 text-white col-span-1" onClick={() => handleClickButton('Tan')}>Tan</Button>
          <Button variant='outline' size="lg" className="hidden sm:block bg-zinc-400 hover:bg-zinc-600 text-white col-span-1" onClick={() => handleClickButton('log')}>log</Button>
          <Button variant='outline' size="lg" className="hidden sm:block bg-zinc-400 hover:bg-zinc-600 text-white col-span-1" onClick={() => handleClickButton('ln')}>ln</Button>
          <Button variant='outline' size="lg" className="hidden sm:block bg-zinc-400 hover:bg-zinc-600 text-white col-span-1" onClick={() => handleClickButton('(')}>(</Button>
          <Button variant='outline' size="lg" className="hidden sm:block bg-zinc-400 hover:bg-zinc-600 text-white col-span-1" onClick={() => handleClickButton(')')}>)</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('7')}>7</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('8')}>8</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('9')}>9</Button>
          <Button variant='outline' size="lg" className="  hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('%')}>%</Button> 
          <Button variant='outline' size="lg"  className="hidden sm:block hover:bg-gray-500 col-span-1" onClick={() => handleClickButton('e')}>e</Button>
          <Button variant='outline' size="lg"  className="hidden sm:block hover:bg-gray-500 col-span-1" onClick={() => handleClickButton('²')}>x²</Button>
          <Button variant='outline' size="lg"  className="hidden sm:block hover:bg-gray-500 col-span-1" onClick={() => handleClickButton('^3')}>x^3</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('4')}>4</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('5')}>5</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('6')}>6</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('*')}>*</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('/')}>/</Button>
          <Button variant='outline' size="lg"  className="hidden sm:block hover:bg-gray-500 col-span-1" onClick={() => handleClickButton('π')}>π</Button>
          <Button variant='outline' size="lg"  className="hidden sm:block hover:bg-gray-500 col-span-1" onClick={() => handleClickButton('√')}>√</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('1')}>1</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('2')}>2</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('3')}>3</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('+')}>+</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('-')}>-</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('.')}>.</Button>
          <Button variant='outline' size="lg" className="hidden sm:block hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('^')}>^</Button>
          <Button variant='outline' size="lg" className=" hover:bg-zinc-600 col-span-1" onClick={() => handleClickButton('0')}>0</Button>
          <Button variant='outline' size="lg" className="bg-indigo-400 hover:bg-indigo-900 top-1 left-1 text-white col-span-1" onClick={toggleHistory}>
          📜  </Button>
          <Button variant='outline' size="lg" className="bg-blue-400 hover:bg-blue-600 text-white col-span-1" onClick={() => handleClickButton('DEL')}>DEL</Button>
          <Button variant='outline' size="lg" className="col-span-1 col-span-2 bg-blue-400 hover:bg-blue-600 text-white " onClick={() => handleClickButton('RESET')}>RESET</Button>
          <Button variant='outline' size="lg" className="col-span-1 col-span-2 bg-zinc-400 hover:bg-zinc-600 text-white " onClick={() => handleClickButton('=')}>=</Button>
        </div>
      </div>
    </main>
  );
}

export default CalculatorPage;
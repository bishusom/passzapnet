'use client'

import { useState, useCallback, useEffect } from 'react'
import { 
  Calculator, 
  FunctionSquare, 
  Code2, 
  History, 
  Copy, 
  Check,
  RotateCcw,
  Binary,
  Zap,
  Cpu,
  Clock,
  Shield
} from 'lucide-react'

type CalculatorMode = 'basic' | 'scientific' | 'programmer'
type Operation = 
  | '+' | '-' | '×' | '÷' 
  | 'x²' | 'x³' | 'x^y' | '√' | '∛'
  | 'sin' | 'cos' | 'tan' | 'log' | 'ln'
  | '!' | 'π' | 'e' | '1/x'
  | 'AND' | 'OR' | 'XOR' | 'NOT' | '<<' | '>>' | 'ROL' | 'ROR'
  | ''

type NumberBase = 'BIN' | 'OCT' | 'DEC' | 'HEX'
type WordSize = 8 | 16 | 32 | 64

interface Calculation {
  expression: string
  result: string
  timestamp: Date
}

interface CalculatorProps {
  compact?: boolean
}

export default function CalculatorComponent({ compact = false }: CalculatorProps) {
  const [mode, setMode] = useState<CalculatorMode>('basic')
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<Operation>('')
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState<Calculation[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Programmer mode states
  const [numberBase, setNumberBase] = useState<NumberBase>('DEC')
  const [wordSize, setWordSize] = useState<WordSize>(32)
  const [bitView, setBitView] = useState<boolean[]>(Array(32).fill(false))

  // Input digit - handles different number bases
  const inputDigit = useCallback((digit: string) => {
    if (mode === 'programmer') {
      // Validate digit for current number base
      const validDigits = {
        'BIN': ['0', '1'],
        'OCT': ['0', '1', '2', '3', '4', '5', '6', '7'],
        'DEC': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        'HEX': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
      }
      
      if (!validDigits[numberBase].includes(digit.toUpperCase())) {
        return
      }
    }

    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }, [display, waitingForOperand, mode, numberBase])

  // Input decimal - only in DEC mode
  const inputDot = useCallback(() => {
    if (mode !== 'programmer' || numberBase === 'DEC') {
      if (waitingForOperand) {
        setDisplay('0.')
        setWaitingForOperand(false)
      } else if (display.indexOf('.') === -1) {
        setDisplay(display + '.')
      }
    }
  }, [display, waitingForOperand, mode, numberBase])

  // Clear display
  const clearDisplay = useCallback(() => {
    setDisplay('0')
    setWaitingForOperand(false)
    setOperation('')
    setPreviousValue(null)
    updateBitView(0)
  }, [])

  // Clear entry
  const clearEntry = useCallback(() => {
    setDisplay('0')
    updateBitView(0)
  }, [])

  // Toggle sign - only in DEC mode
  const toggleSign = useCallback(() => {
    if (mode !== 'programmer' || numberBase === 'DEC') {
      const value = parseFloat(display)
      if (value > 0) {
        setDisplay('-' + display)
      } else if (value < 0) {
        setDisplay(display.slice(1))
      }
    }
  }, [display, mode, numberBase])

  // Percentage - only in basic/scientific modes
  const inputPercent = useCallback(() => {
    if (mode !== 'programmer') {
      const value = parseFloat(display)
      setDisplay((value / 100).toString())
    }
  }, [display, mode])

  // Convert number to current base
  const convertToBase = useCallback((value: number, base: NumberBase): string => {
    switch (base) {
      case 'BIN':
        return (value >>> 0).toString(2)
      case 'OCT':
        return (value >>> 0).toString(8)
      case 'HEX':
        return (value >>> 0).toString(16).toUpperCase()
      case 'DEC':
      default:
        return value.toString()
    }
  }, [])

  // Convert from current base to number
  const convertFromBase = useCallback((value: string, base: NumberBase): number => {
    switch (base) {
      case 'BIN':
        return parseInt(value, 2)
      case 'OCT':
        return parseInt(value, 8)
      case 'HEX':
        return parseInt(value, 16)
      case 'DEC':
      default:
        return parseFloat(value)
    }
  }, [])

  // Update bit view
  const updateBitView = useCallback((value: number) => {
    const bits = Array(wordSize).fill(false)
    for (let i = 0; i < wordSize; i++) {
      bits[wordSize - 1 - i] = !!(value & (1 << i))
    }
    setBitView(bits)
  }, [wordSize])

  // Perform operation
  const performOperation = useCallback((nextOperation: Operation) => {
    const inputValue = mode === 'programmer' 
      ? convertFromBase(display, numberBase)
      : parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      let newValue: number

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue
          break
        case '-':
          newValue = currentValue - inputValue
          break
        case '×':
          newValue = currentValue * inputValue
          break
        case '÷':
          newValue = currentValue / inputValue
          break
        case 'x^y':
          newValue = Math.pow(currentValue, inputValue)
          break
        case 'AND':
          newValue = currentValue & inputValue
          break
        case 'OR':
          newValue = currentValue | inputValue
          break
        case 'XOR':
          newValue = currentValue ^ inputValue
          break
        case '<<':
          newValue = currentValue << inputValue
          break
        case '>>':
          newValue = currentValue >> inputValue
          break
        default:
          newValue = inputValue
      }

      const result = mode === 'programmer' 
        ? convertToBase(newValue, numberBase)
        : `${newValue}`

      setDisplay(result)
      setPreviousValue(newValue)
      if (mode === 'programmer') {
        updateBitView(newValue)
      }

      // Add to history
      if (!['x^y', '<<', '>>', 'AND', 'OR', 'XOR'].includes(operation)) {
        setHistory(prev => [{
          expression: `${currentValue} ${operation} ${inputValue}`,
          result: result.toString(),
          timestamp: new Date()
        }, ...prev.slice(0, 9)])
      }
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }, [display, previousValue, operation, mode, numberBase, convertToBase, convertFromBase, updateBitView])

  // Scientific functions
  const scientificFunction = useCallback((func: Operation) => {
    const value = parseFloat(display)
    let result: number

    switch (func) {
      case 'x²':
        result = Math.pow(value, 2)
        break
      case 'x³':
        result = Math.pow(value, 3)
        break
      case '√':
        result = Math.sqrt(value)
        break
      case '∛':
        result = Math.cbrt(value)
        break
      case 'sin':
        result = Math.sin(value * Math.PI / 180)
        break
      case 'cos':
        result = Math.cos(value * Math.PI / 180)
        break
      case 'tan':
        result = Math.tan(value * Math.PI / 180)
        break
      case 'log':
        result = Math.log10(value)
        break
      case 'ln':
        result = Math.log(value)
        break
      case '!':
        result = factorial(value)
        break
      case '1/x':
        result = 1 / value
        break
      case 'π':
        result = Math.PI
        break
      case 'e':
        result = Math.E
        break
      case 'NOT':
        result = ~convertFromBase(display, numberBase)
        break
      default:
        result = value
    }

    const resultDisplay = mode === 'programmer' && ['NOT'].includes(func)
      ? convertToBase(result, numberBase)
      : result.toString()

    setDisplay(resultDisplay)
    if (mode === 'programmer') {
      updateBitView(result)
    }

    setHistory(prev => [{
      expression: `${func}(${value})`,
      result: resultDisplay,
      timestamp: new Date()
    }, ...prev.slice(0, 9)])
  }, [display, mode, numberBase, convertToBase, convertFromBase, updateBitView])

  // Factorial function
  const factorial = (n: number): number => {
    if (n < 0) return NaN
    if (n === 0 || n === 1) return 1
    let result = 1
    for (let i = 2; i <= n; i++) {
      result *= i
    }
    return result
  }

  // Memory functions
  const memoryClear = useCallback(() => setMemory(0), [])
  const memoryRecall = useCallback(() => {
    const value = mode === 'programmer' ? convertToBase(memory, numberBase) : memory.toString()
    setDisplay(value)
    if (mode === 'programmer') {
      updateBitView(memory)
    }
  }, [memory, mode, numberBase, convertToBase, updateBitView])
  
  const memoryAdd = useCallback(() => {
    const currentValue = mode === 'programmer' ? convertFromBase(display, numberBase) : parseFloat(display)
    setMemory(memory + currentValue)
  }, [display, memory, mode, numberBase, convertFromBase])
  
  const memorySubtract = useCallback(() => {
    const currentValue = mode === 'programmer' ? convertFromBase(display, numberBase) : parseFloat(display)
    setMemory(memory - currentValue)
  }, [display, memory, mode, numberBase, convertFromBase])

  // Copy result
  const copyResult = useCallback(() => {
    navigator.clipboard.writeText(display)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [display])

  // Handle number base change
  const handleBaseChange = useCallback((newBase: NumberBase) => {
    const currentValue = convertFromBase(display, numberBase)
    const newValue = convertToBase(currentValue, newBase)
    setDisplay(newValue)
    setNumberBase(newBase)
  }, [display, numberBase, convertFromBase, convertToBase])

  // Handle word size change
  const handleWordSizeChange = useCallback((newSize: WordSize) => {
    setWordSize(newSize)
    const currentValue = convertFromBase(display, numberBase)
    updateBitView(currentValue)
  }, [display, numberBase, convertFromBase, updateBitView])

  // Toggle individual bit
  const toggleBit = useCallback((index: number) => {
    if (mode === 'programmer') {
      const currentValue = convertFromBase(display, numberBase)
      const bitMask = 1 << (wordSize - 1 - index)
      const newValue = currentValue ^ bitMask
      const newDisplay = convertToBase(newValue, numberBase)
      setDisplay(newDisplay)
      updateBitView(newValue)
    }
  }, [mode, display, numberBase, wordSize, convertFromBase, convertToBase, updateBitView])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event

      if (/[0-9]/.test(key)) {
        inputDigit(key)
      } else if (key === '.') {
        inputDot()
      } else if (key === '+') {
        performOperation('+')
      } else if (key === '-') {
        performOperation('-')
      } else if (key === '*') {
        performOperation('×')
      } else if (key === '/') {
        event.preventDefault()
        performOperation('÷')
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault()
        performOperation('')
      } else if (key === 'Escape') {
        clearDisplay()
      } else if (key === 'Backspace') {
        clearEntry()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [inputDigit, inputDot, performOperation, clearDisplay, clearEntry])

  // Update bit view when display changes in programmer mode
  useEffect(() => {
    if (mode === 'programmer' && display) {
      try {
        const value = convertFromBase(display, numberBase)
        updateBitView(value)
      } catch {
        // Invalid input for current base
      }
    }
  }, [display, mode, numberBase, convertFromBase, updateBitView])

  // Button classes with green theme
  const buttonClasses = {
    number: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    operation: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    scientific: 'bg-teal-600 hover:bg-teal-700 text-white',
    memory: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    clear: 'bg-rose-500 hover:bg-rose-600 text-white',
    utility: 'bg-gray-600 hover:bg-gray-700 text-white',
    programmer: 'bg-violet-600 hover:bg-violet-700 text-white'
  }

  // Basic calculator buttons
  const basicButtons = [
    [{ label: 'C', action: clearDisplay, className: buttonClasses.clear },
     { label: '±', action: toggleSign, className: buttonClasses.utility },
     { label: '%', action: inputPercent, className: buttonClasses.utility },
     { label: '÷', action: () => performOperation('÷'), className: buttonClasses.operation }],
    
    [{ label: '7', action: () => inputDigit('7'), className: buttonClasses.number },
     { label: '8', action: () => inputDigit('8'), className: buttonClasses.number },
     { label: '9', action: () => inputDigit('9'), className: buttonClasses.number },
     { label: '×', action: () => performOperation('×'), className: buttonClasses.operation }],
    
    [{ label: '4', action: () => inputDigit('4'), className: buttonClasses.number },
     { label: '5', action: () => inputDigit('5'), className: buttonClasses.number },
     { label: '6', action: () => inputDigit('6'), className: buttonClasses.number },
     { label: '-', action: () => performOperation('-'), className: buttonClasses.operation }],
    
    [{ label: '1', action: () => inputDigit('1'), className: buttonClasses.number },
     { label: '2', action: () => inputDigit('2'), className: buttonClasses.number },
     { label: '3', action: () => inputDigit('3'), className: buttonClasses.number },
     { label: '+', action: () => performOperation('+'), className: buttonClasses.operation }],
    
    [{ label: '0', action: () => inputDigit('0'), className: `col-span-2 ${buttonClasses.number}` },
     { label: '.', action: inputDot, className: buttonClasses.number },
     { label: '=', action: () => performOperation(''), className: buttonClasses.operation }]
  ]

  // Scientific calculator buttons
  const scientificButtons = [
    [{ label: 'x²', action: () => scientificFunction('x²'), className: buttonClasses.scientific },
     { label: 'x³', action: () => scientificFunction('x³'), className: buttonClasses.scientific },
     { label: 'x^y', action: () => performOperation('x^y'), className: buttonClasses.scientific },
     { label: '√', action: () => scientificFunction('√'), className: buttonClasses.scientific }],
    
    [{ label: 'sin', action: () => scientificFunction('sin'), className: buttonClasses.scientific },
     { label: 'cos', action: () => scientificFunction('cos'), className: buttonClasses.scientific },
     { label: 'tan', action: () => scientificFunction('tan'), className: buttonClasses.scientific },
     { label: '∛', action: () => scientificFunction('∛'), className: buttonClasses.scientific }],
    
    [{ label: 'log', action: () => scientificFunction('log'), className: buttonClasses.scientific },
     { label: 'ln', action: () => scientificFunction('ln'), className: buttonClasses.scientific },
     { label: '!', action: () => scientificFunction('!'), className: buttonClasses.scientific },
     { label: '1/x', action: () => scientificFunction('1/x'), className: buttonClasses.scientific }],
    
    [{ label: 'π', action: () => scientificFunction('π'), className: buttonClasses.scientific },
     { label: 'e', action: () => scientificFunction('e'), className: buttonClasses.scientific },
     { label: '(', action: () => inputDigit('('), className: buttonClasses.utility },
     { label: ')', action: () => inputDigit(')'), className: buttonClasses.utility }]
  ]

  // Programmer calculator buttons
  const programmerButtons = [
    [{ label: 'AND', action: () => performOperation('AND'), className: buttonClasses.programmer },
     { label: 'OR', action: () => performOperation('OR'), className: buttonClasses.programmer },
     { label: 'XOR', action: () => performOperation('XOR'), className: buttonClasses.programmer },
     { label: 'NOT', action: () => scientificFunction('NOT'), className: buttonClasses.programmer }],
    
    [{ label: '<<', action: () => performOperation('<<'), className: buttonClasses.programmer },
     { label: '>>', action: () => performOperation('>>'), className: buttonClasses.programmer },
     { label: 'A', action: () => inputDigit('A'), className: buttonClasses.number },
     { label: 'B', action: () => inputDigit('B'), className: buttonClasses.number }],
    
    [{ label: 'C', action: () => inputDigit('C'), className: buttonClasses.number },
     { label: 'D', action: () => inputDigit('D'), className: buttonClasses.number },
     { label: 'E', action: () => inputDigit('E'), className: buttonClasses.number },
     { label: 'F', action: () => inputDigit('F'), className: buttonClasses.number }]
  ]

  // If compact mode, just return the calculator UI without side content
  if (compact) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
          {/* Mode Selection */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => setMode('basic')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mode === 'basic' ? 'bg-white text-emerald-600' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Calculator className="h-4 w-4 inline mr-2" />
                  Basic
                </button>
                <button
                  onClick={() => setMode('scientific')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mode === 'scientific' ? 'bg-white text-emerald-600' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FunctionSquare className="h-4 w-4 inline mr-2" />
                  Scientific
                </button>
                <button
                  onClick={() => setMode('programmer')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mode === 'programmer' ? 'bg-white text-emerald-600' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Code2 className="h-4 w-4 inline mr-2" />
                  Programmer
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                  title="History"
                >
                  <History className="h-5 w-5" />
                </button>
                <button
                  onClick={copyResult}
                  className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                  title="Copy result"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Programmer Mode Controls */}
            {mode === 'programmer' && (
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex space-x-1 bg-white/20 rounded-lg p-1">
                  {(['BIN', 'OCT', 'DEC', 'HEX'] as NumberBase[]).map((base) => (
                    <button
                      key={base}
                      onClick={() => handleBaseChange(base)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        numberBase === base ? 'bg-white text-emerald-600' : 'text-white hover:bg-white/20'
                      }`}
                    >
                      {base}
                    </button>
                  ))}
                </div>
                
                <div className="flex space-x-1 bg-white/20 rounded-lg p-1">
                  {([8, 16, 32, 64] as WordSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleWordSizeChange(size)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        wordSize === size ? 'bg-white text-emerald-600' : 'text-white hover:bg-white/20'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-4 gap-6 p-6">
            {/* Main Calculator */}
            <div className={`${showHistory ? 'md:col-span-3' : 'md:col-span-4'}`}>
              {/* Display */}
              <div className="bg-gray-900 rounded-xl p-6 mb-6">
                <div className="text-right">
                  <div className="text-gray-400 text-sm mb-2 h-6">
                    {previousValue !== null && `${previousValue} ${operation}`}
                  </div>
                  <div className="text-white text-4xl font-mono overflow-x-auto">
                    {display}
                  </div>
                  {memory !== 0 && (
                    <div className="text-emerald-400 text-sm mt-2">M: {memory}</div>
                  )}
                </div>

                {/* Bit Display for Programmer Mode */}
                {mode === 'programmer' && (
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-emerald-400 text-sm font-mono">Bit View</span>
                      <span className="text-gray-400 text-sm">{wordSize}-bit</span>
                    </div>
                    <div className="grid grid-cols-8 md:grid-cols-16 gap-1">
                      {bitView.map((bit, index) => (
                        <button
                          key={index}
                          onClick={() => toggleBit(index)}
                          className={`w-6 h-6 rounded text-xs font-mono transition-colors ${
                            bit 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          }`}
                          title={`Bit ${wordSize - 1 - index}`}
                        >
                          {bit ? '1' : '0'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Memory Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <button
                  onClick={memoryClear}
                  className={`p-3 rounded-lg font-medium transition-colors ${buttonClasses.memory}`}
                >
                  MC
                </button>
                <button
                  onClick={memoryRecall}
                  className={`p-3 rounded-lg font-medium transition-colors ${buttonClasses.memory}`}
                >
                  MR
                </button>
                <button
                  onClick={memoryAdd}
                  className={`p-3 rounded-lg font-medium transition-colors ${buttonClasses.memory}`}
                >
                  M+
                </button>
                <button
                  onClick={memorySubtract}
                  className={`p-3 rounded-lg font-medium transition-colors ${buttonClasses.memory}`}
                >
                  M-
                </button>
              </div>

              {/* Calculator Buttons */}
              <div className="grid grid-cols-4 gap-3">
                {/* Basic buttons - show in all modes */}
                {basicButtons.map((row, rowIndex) =>
                  row.map((button, buttonIndex) => (
                    <button
                      key={`${rowIndex}-${buttonIndex}`}
                      onClick={button.action}
                      className={`p-4 rounded-xl font-semibold text-lg transition-colors ${button.className}`}
                    >
                      {button.label}
                    </button>
                  ))
                )}

                {/* Scientific buttons - show in scientific mode */}
                {mode === 'scientific' && scientificButtons.map((row, rowIndex) =>
                  row.map((button, buttonIndex) => (
                    <button
                      key={`sci-${rowIndex}-${buttonIndex}`}
                      onClick={button.action}
                      className={`p-3 rounded-xl font-medium text-sm transition-colors ${button.className}`}
                    >
                      {button.label}
                    </button>
                  ))
                )}

                {/* Programmer buttons - show in programmer mode */}
                {mode === 'programmer' && programmerButtons.map((row, rowIndex) =>
                  row.map((button, buttonIndex) => (
                    <button
                      key={`prog-${rowIndex}-${buttonIndex}`}
                      onClick={button.action}
                      className={`p-3 rounded-xl font-medium text-sm transition-colors ${button.className}`}
                    >
                      {button.label}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* History Panel */}
            {showHistory && (
              <div className="md:col-span-1 bg-gray-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">History</h3>
                  <button
                    onClick={() => setHistory([])}
                    className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                    title="Clear history"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">No calculations yet</p>
                  ) : (
                    history.map((calc, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-emerald-200">
                        <div className="text-xs text-gray-500 mb-1">
                          {calc.timestamp.toLocaleTimeString()}
                        </div>
                        <div className="text-sm text-gray-700 font-mono">{calc.expression}</div>
                        <div className="text-lg font-semibold text-emerald-600">= {calc.result}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyboard Shortcuts</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <div className="flex justify-between mb-2">
                <span>Numbers 0-9</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">0-9</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Basic Operations</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">+ - * /</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Calculate</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">Enter or =</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Clear</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">Escape</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Decimal Point</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">.</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Clear Entry</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">Backspace</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // FULL PAGE LAYOUT with side content and FAQ
  return (
    <div className="max-w-7xl mx-auto">
      {/* Main Calculator Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden mb-8">
        {/* Mode Selection */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setMode('basic')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === 'basic' ? 'bg-white text-emerald-600' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Calculator className="h-4 w-4 inline mr-2" />
                Basic
              </button>
              <button
                onClick={() => setMode('scientific')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === 'scientific' ? 'bg-white text-emerald-600' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <FunctionSquare className="h-4 w-4 inline mr-2" />
                Scientific
              </button>
              <button
                onClick={() => setMode('programmer')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === 'programmer' ? 'bg-white text-emerald-600' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Code2 className="h-4 w-4 inline mr-2" />
                Programmer
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                title="History"
              >
                <History className="h-5 w-5" />
              </button>
              <button
                onClick={copyResult}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                title="Copy result"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Programmer Mode Controls */}
          {mode === 'programmer' && (
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex space-x-1 bg-white/20 rounded-lg p-1">
                {(['BIN', 'OCT', 'DEC', 'HEX'] as NumberBase[]).map((base) => (
                  <button
                    key={base}
                    onClick={() => handleBaseChange(base)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      numberBase === base ? 'bg-white text-emerald-600' : 'text-white hover:bg-white/20'
                    }`}
                  >
                    {base}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-1 bg-white/20 rounded-lg p-1">
                {([8, 16, 32, 64] as WordSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleWordSizeChange(size)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      wordSize === size ? 'bg-white text-emerald-600' : 'text-white hover:bg-white/20'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-6 p-6">
          {/* Main Calculator */}
          <div className={`${showHistory ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {/* Display */}
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <div className="text-right">
                <div className="text-gray-400 text-sm mb-2 h-6">
                  {previousValue !== null && `${previousValue} ${operation}`}
                </div>
                <div className="text-white text-4xl font-mono overflow-x-auto">
                  {display}
                </div>
                {memory !== 0 && (
                  <div className="text-emerald-400 text-sm mt-2">M: {memory}</div>
                )}
              </div>

              {/* Bit Display for Programmer Mode */}
              {mode === 'programmer' && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-emerald-400 text-sm font-mono">Bit View</span>
                    <span className="text-gray-400 text-sm">{wordSize}-bit</span>
                  </div>
                  <div className="grid grid-cols-8 md:grid-cols-16 gap-1">
                    {bitView.map((bit, index) => (
                      <button
                        key={index}
                        onClick={() => toggleBit(index)}
                        className={`w-6 h-6 rounded text-xs font-mono transition-colors ${
                          bit 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        }`}
                        title={`Bit ${wordSize - 1 - index}`}
                      >
                        {bit ? '1' : '0'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Memory Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={memoryClear}
                className={`p-3 rounded-lg font-medium transition-colors ${buttonClasses.memory}`}
              >
                MC
              </button>
              <button
                onClick={memoryRecall}
                className={`p-3 rounded-lg font-medium transition-colors ${buttonClasses.memory}`}
              >
                MR
              </button>
              <button
                onClick={memoryAdd}
                className={`p-3 rounded-lg font-medium transition-colors ${buttonClasses.memory}`}
              >
                M+
              </button>
              <button
                onClick={memorySubtract}
                className={`p-3 rounded-lg font-medium transition-colors ${buttonClasses.memory}`}
              >
                M-
              </button>
            </div>

            {/* Calculator Buttons */}
            <div className="grid grid-cols-4 gap-3">
              {/* Basic buttons - show in all modes */}
              {basicButtons.map((row, rowIndex) =>
                row.map((button, buttonIndex) => (
                  <button
                    key={`${rowIndex}-${buttonIndex}`}
                    onClick={button.action}
                    className={`p-4 rounded-xl font-semibold text-lg transition-colors ${button.className}`}
                  >
                    {button.label}
                  </button>
                ))
              )}

              {/* Scientific buttons - show in scientific mode */}
              {mode === 'scientific' && scientificButtons.map((row, rowIndex) =>
                row.map((button, buttonIndex) => (
                  <button
                    key={`sci-${rowIndex}-${buttonIndex}`}
                    onClick={button.action}
                    className={`p-3 rounded-xl font-medium text-sm transition-colors ${button.className}`}
                  >
                    {button.label}
                  </button>
                ))
              )}

              {/* Programmer buttons - show in programmer mode */}
              {mode === 'programmer' && programmerButtons.map((row, rowIndex) =>
                row.map((button, buttonIndex) => (
                  <button
                    key={`prog-${rowIndex}-${buttonIndex}`}
                    onClick={button.action}
                    className={`p-3 rounded-xl font-medium text-sm transition-colors ${button.className}`}
                  >
                    {button.label}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* History Panel */}
          {showHistory && (
            <div className="lg:col-span-1 bg-gray-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">History</h3>
                <button
                  onClick={() => setHistory([])}
                  className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                  title="Clear history"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">No calculations yet</p>
                ) : (
                  history.map((calc, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-emerald-200">
                      <div className="text-xs text-gray-500 mb-1">
                        {calc.timestamp.toLocaleTimeString()}
                      </div>
                      <div className="text-sm text-gray-700 font-mono">{calc.expression}</div>
                      <div className="text-lg font-semibold text-emerald-600">= {calc.result}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Keyboard Shortcuts Help */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyboard Shortcuts</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Numbers 0-9</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">0-9</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Basic Operations</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">+ - * /</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Calculate</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">Enter or =</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Clear</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">Escape</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Decimal Point</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">.</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Clear Entry</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">Backspace</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculator FAQ</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {calculatorFaqItems.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-emerald-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="lg:col-span-1 space-y-6">
          {/* Features */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 text-emerald-500 mr-2" />
              Calculator Features
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <Calculator className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong>Basic Mode</strong> - Simple arithmetic operations</span>
              </li>
              <li className="flex items-start space-x-2">
                <FunctionSquare className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong>Scientific Mode</strong> - Advanced math functions</span>
              </li>
              <li className="flex items-start space-x-2">
                <Code2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong>Programmer Mode</strong> - Bitwise operations</span>
              </li>
              <li className="flex items-start space-x-2">
                <History className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span><strong>Calculation History</strong> - Review past calculations</span>
              </li>
            </ul>
          </div>

          {/* Use Cases */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Perfect For</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-semibold text-blue-800 mb-1">🎓 Students</h4>
                <p className="text-blue-700 text-xs">
                  Math homework, science projects, and engineering courses
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-semibold text-green-800 mb-1">💼 Professionals</h4>
                <p className="text-green-700 text-xs">
                  Engineering calculations, financial analysis, programming
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <h4 className="font-semibold text-purple-800 mb-1">👨‍💻 Developers</h4>
                <p className="text-purple-700 text-xs">
                  Bitwise operations, number base conversions, debugging
                </p>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 text-emerald-500 mr-2" />
              Privacy First
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              All calculations happen locally in your browser. No data is sent to our servers.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">Local Processing</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">No Data Stored</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Calculator-specific FAQ items
const calculatorFaqItems = [
  {
    question: "How do I use the scientific functions?",
    answer: "Switch to Scientific mode using the top buttons. You'll get access to trigonometric functions, logarithms, exponents, and mathematical constants."
  },
  {
    question: "What's the difference between the calculator modes?",
    answer: "Basic mode offers simple arithmetic. Scientific adds advanced math functions. Programmer mode provides bitwise operations and number base conversions."
  },
  {
    question: "Can I use keyboard shortcuts?",
    answer: "Yes! Use number keys for digits, + - * / for operations, Enter or = to calculate, Escape to clear, and Backspace to clear entry."
  },
  {
    question: "How does the memory function work?",
    answer: "Use MC to clear memory, MR to recall, M+ to add to memory, and M- to subtract. The memory persists between calculations."
  },
  {
    question: "What are the programmer mode features?",
    answer: "Programmer mode includes bitwise operations (AND, OR, XOR, NOT), bit shifting, number base conversion (BIN, OCT, DEC, HEX), and bit toggling."
  },
  {
    question: "Is there a calculation history?",
    answer: "Yes! Click the history icon to view your recent calculations. You can clear history or copy results from past calculations."
  }
]
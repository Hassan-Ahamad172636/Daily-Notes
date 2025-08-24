"use client"

import { useState } from 'react'
import { Plus, Check, X, Calculator, Edit3, Edit2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import apiService from "../util/apiService"
import { useEffect } from 'react'
import { toast } from 'sonner'

const incomeCategories = ['job', 'freelance', 'investment', 'business', 'other']
const expenseCategories = ['Housing', 'Food', 'Transportation', 'Bills', 'Entertainment', 'Healthcare', 'Shopping', 'Other']

export default function AddTransactionDialog({ isOpen, onClose, selecteTransaction }) {

  useEffect(() => {
  }, [selecteTransaction])
  useEffect(() => {
    if (selecteTransaction) {
      setNewTransaction({
        type: selecteTransaction.transactionType || 'income',
        title: selecteTransaction.transactionTitle || '',
        amount: selecteTransaction.transactionAmount || '',
        category: selecteTransaction.transactions || (selecteTransaction.transactionType === 'income' ? 'job' : 'Housing'),
        date: selecteTransaction.date || new Date().toISOString().split('T')[0],
        description: selecteTransaction.description || '',
        recurring: false
      })
    } else {
      // Reset for create mode
      setNewTransaction({
        type: 'income',
        title: '',
        amount: '',
        category: 'job',
        date: new Date().toISOString().split('T')[0],
        description: '',
        recurring: false
      })
    }
  }, [selecteTransaction])

  const [newTransaction, setNewTransaction] = useState({
    type: 'income',
    title: selecteTransaction?.transactionTitle || '',
    amount: selecteTransaction?.transactionAmount || '',
    category: selecteTransaction?.transactions || 'job',
    date: selecteTransaction?.date || new Date().toISOString().split('T')[0],
    description: selecteTransaction?.description || '',
    recurring: false
  })
  const [loading, setLoading] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [calculatorDisplay, setCalculatorDisplay] = useState('0')
  const [calculatorPrevious, setCalculatorPrevious] = useState(null)
  const [calculatorOperation, setCalculatorOperation] = useState(null)
  const [calculatorWaitingForOperand, setCalculatorWaitingForOperand] = useState(false)

  // Calculator functions
  const inputNumber = (num) => {
    if (calculatorWaitingForOperand) {
      setCalculatorDisplay(String(num))
      setCalculatorWaitingForOperand(false)
    } else {
      setCalculatorDisplay(calculatorDisplay === '0' ? String(num) : calculatorDisplay + num)
    }
  }

  const inputDecimal = () => {
    if (calculatorWaitingForOperand) {
      setCalculatorDisplay('0.')
      setCalculatorWaitingForOperand(false)
    } else if (calculatorDisplay.indexOf('.') === -1) {
      setCalculatorDisplay(calculatorDisplay + '.')
    }
  }

  const clear = () => {
    setCalculatorDisplay('0')
    setCalculatorPrevious(null)
    setCalculatorOperation(null)
    setCalculatorWaitingForOperand(false)
  }

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(calculatorDisplay)

    if (calculatorPrevious === null) {
      setCalculatorPrevious(inputValue)
    } else if (calculatorOperation) {
      const currentValue = calculatorPrevious || 0
      const newValue = calculate(currentValue, inputValue, calculatorOperation)

      setCalculatorDisplay(String(newValue))
      setCalculatorPrevious(newValue)
    }

    setCalculatorWaitingForOperand(true)
    setCalculatorOperation(nextOperation)
  }

  const calculate = (firstOperand, secondOperand, operation) => {
    switch (operation) {
      case '+':
        return firstOperand + secondOperand
      case '-':
        return firstOperand - secondOperand
      case '*':
        return firstOperand * secondOperand
      case '/':
        return firstOperand / secondOperand
      case '=':
        return secondOperand
      default:
        return secondOperand
    }
  }

  const handleCalculatorEquals = () => {
    const inputValue = parseFloat(calculatorDisplay)

    if (calculatorPrevious !== null && calculatorOperation) {
      const newValue = calculate(calculatorPrevious, inputValue, calculatorOperation)
      setCalculatorDisplay(String(newValue))
      setCalculatorPrevious(null)
      setCalculatorOperation(null)
      setCalculatorWaitingForOperand(true)
    }
  }

  const useCalculatorResult = () => {
    setNewTransaction({ ...newTransaction, amount: calculatorDisplay })
    setShowCalculator(false)
  }

  const handleAddTransaction = async () => {
    if (!newTransaction.title || !newTransaction.amount) {
      // alert("Please fill all required fields")
      toast.error("Please fill all required fields!")
      return
    }

    try {
      setLoading(true)
      await apiService.postApi('/transaction/create', {
        transactionType: newTransaction.type,
        transactionTitle: newTransaction.title,
        transactionAmount: parseFloat(newTransaction.amount),
        transactions: newTransaction.category,
        date: newTransaction.date,
        description: newTransaction.description,
        // recurring: newTransaction.recurring
      })
      // alert("Transaction added successfully!")
      toast.success("Transaction added successfully!")
      onClose();
      setNewTransaction({
        type: 'income',
        title: '',
        amount: '',
        category: 'job',
        date: new Date().toISOString().split('T')[0],
        description: '',
        // recurring: false
      })
      onClose()
    } catch (error) {
      console.error(error)
      // alert("Failed to add transaction")
      toast.error("Failed to add transaction")
    } finally {
      setLoading(false)
    }
  }

  const handleEditTransaction = async () => {
    if (!newTransaction.title || !newTransaction.amount) {
      // alert("Please fill all required fields")
      toast.error("Please fill all required fields")
      return
    }

    try {
      setLoading(true)
      await apiService.patchApi('/transaction/update/' + selecteTransaction._id, {
        transactionType: newTransaction.type,
        transactionTitle: newTransaction.title,
        transactionAmount: parseFloat(newTransaction.amount),
        transactions: newTransaction.category,
        date: newTransaction.date,
        description: newTransaction.description,
        // recurring: newTransaction.recurring
      })
      // alert("Transaction added successfully!")
      toast.success("Transaction added successfully!")
      onClose();
      setNewTransaction({
        type: 'income',
        title: '',
        amount: '',
        category: 'job',
        date: new Date().toISOString().split('T')[0],
        description: '',
        // recurring: false
      })
      onClose()
    } catch (error) {
      console.error(error)
      // alert("Failed to add transaction")
      toast.error("Failed to add transaction")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              {!selecteTransaction && (
                <>
                  <Plus className="w-5 h-5 text-teal-400" />
                  Add New Transaction
                </>
              )}
              {selecteTransaction && (
                <>
                  <Edit3 className="w-5 h-5 text-teal-400" />
                  Edit Transaction
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Select
              value={newTransaction.type}
              onValueChange={(value) =>
                setNewTransaction({
                  ...newTransaction,
                  type: value,
                  category: value === 'income' ? 'job' : 'Housing'
                })
              }
            >
              <SelectTrigger className="w-full bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Transaction title..."
              value={newTransaction.title}
              onChange={(e) => setNewTransaction({ ...newTransaction, title: e.target.value })}
              className="w-full bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50"
            />

            <div className="relative">
              <Input
                type="text"
                placeholder="Amount..."
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                className="w-full bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCalculator(true)}
                className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-slate-600/50"
              >
                <Calculator className="w-4 h-4 text-slate-400" />
              </Button>
            </div>

            <Select
              className={'capitalize'}
              value={newTransaction.category}
              onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
            >
              <SelectTrigger className="capitalize w-full bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className={'capitalize'}>
                {(newTransaction.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                  <SelectItem className={'capitalize'} key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              className="w-full bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50"
            />

            <Textarea
              placeholder="Description (optional)..."
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              rows={3}
              className="w-full bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50 resize-none"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={newTransaction.recurring}
                  onChange={(e) => setNewTransaction({ ...newTransaction, recurring: e.target.checked })}
                  className="rounded border-slate-600 bg-slate-700 text-teal-500 focus:ring-teal-500/20"
                />
                Recurring transaction
              </label> */}

              <div className="flex justify-end w-full gap-3 float-end">
                {selecteTransaction && (
                  <Button
                    onClick={handleEditTransaction}
                    disabled={loading}
                    className="cursor-pointer bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                    {loading ? "Editing..." : "Edit Transaction"}
                  </Button>
                )}
                {!selecteTransaction && (
                  <Button
                    onClick={handleAddTransaction}
                    disabled={loading}
                    className="cursor-pointer bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    <Check className="w-4 h-4" />
                    {loading ? "Adding..." : "Add Transaction"}
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="cursor-pointer bg-slate-600 hover:bg-slate-700 text-white"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calculator Modal */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-teal-400" />
              Calculator
            </DialogTitle>
          </DialogHeader>

          <div className="bg-slate-900/50 rounded-xl p-3 sm:p-4 mb-4">
            <div className="text-right text-xl sm:text-3xl font-mono text-white overflow-hidden">
              {calculatorDisplay}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <Button
              onClick={clear}
              className="col-span-2 bg-red-500/20 hover:bg-red-500/30 cursor-pointer text-red-400 font-semibold"
            >
              Clear
            </Button>
            <Button
              onClick={() => performOperation('/')}
              className="bg-teal-500/20 hover:bg-teal-500/30 cursor-pointer text-teal-400 font-semibold"
            >
              ÷
            </Button>
            <Button
              onClick={() => performOperation('*')}
              className="bg-teal-500/20 hover:bg-teal-500/30 cursor-pointer text-teal-400 font-semibold"
            >
              ×
            </Button>

            {[7, 8, 9].map((num) => (
              <Button
                key={num}
                onClick={() => inputNumber(num)}
                className="bg-slate-700/50 hover:bg-slate-600/50 cursor-pointer text-white font-semibold"
              >
                {num}
              </Button>
            ))}
            <Button
              onClick={() => performOperation('-')}
              className="bg-teal-500/20 cursor-pointer hover:bg-teal-500/30 text-teal-400 font-semibold"
            >
              −
            </Button>

            {[4, 5, 6].map((num) => (
              <Button
                key={num}
                onClick={() => inputNumber(num)}
                className="bg-slate-700/50 cursor-pointer hover:bg-slate-600/50 text-white font-semibold"
              >
                {num}
              </Button>
            ))}
            <Button
              onClick={() => performOperation('+')}
              className="cursor-pointer bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 font-semibold"
            >
              +
            </Button>

            {[1, 2, 3].map((num) => (
              <Button
                key={num}
                onClick={() => inputNumber(num)}
                className="cursor-pointer bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold"
              >
                {num}
              </Button>
            ))}
            <Button
              onClick={handleCalculatorEquals}
              className="cursor-pointer row-span-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold"
            >
              =
            </Button>

            <Button
              onClick={() => inputNumber(0)}
              className="cursor-pointer col-span-2 bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold"
            >
              0
            </Button>
            <Button
              onClick={inputDecimal}
              className="cursor-pointer bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold"
            >
              .
            </Button>
          </div>

          <Button
            onClick={useCalculatorResult}
            className="cursor-pointer w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold"
          >
            Use Result (${calculatorDisplay})
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
"use client"

import { useState, useEffect } from 'react'
import { Plus, Minus, DollarSign, TrendingUp, TrendingDown, Calculator, PieChart, BarChart3, Calendar, Edit3, Trash2, Check, X, Search, Wallet, CreditCard, Banknote, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const mockTransactions = [
  {
    id: 1,
    type: 'income',
    title: 'Salary',
    amount: 5000,
    category: 'Job',
    date: '2024-01-15',
    description: 'Monthly salary payment',
    recurring: true
  },
  {
    id: 2,
    type: 'expense',
    title: 'Rent',
    amount: 1200,
    category: 'Housing',
    date: '2024-01-14',
    description: 'Monthly apartment rent',
    recurring: true
  },
  {
    id: 3,
    type: 'income',
    title: 'Freelance Project',
    amount: 800,
    category: 'Freelance',
    date: '2024-01-13',
    description: 'Web development project',
    recurring: false
  },
  {
    id: 4,
    type: 'expense',
    title: 'Groceries',
    amount: 150,
    category: 'Food',
    date: '2024-01-12',
    description: 'Weekly grocery shopping',
    recurring: false
  },
  {
    id: 5,
    type: 'expense',
    title: 'Utilities',
    amount: 200,
    category: 'Bills',
    date: '2024-01-11',
    description: 'Electricity and water bills',
    recurring: true
  }
]

const incomeCategories = ['Job', 'Freelance', 'Investment', 'Business', 'Other']
const expenseCategories = ['Housing', 'Food', 'Transportation', 'Bills', 'Entertainment', 'Healthcare', 'Shopping', 'Other']

export default function Income() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showCalculator, setShowCalculator] = useState(false)
  const [calculatorDisplay, setCalculatorDisplay] = useState('0')
  const [calculatorPrevious, setCalculatorPrevious] = useState(null)
  const [calculatorOperation, setCalculatorOperation] = useState(null)
  const [calculatorWaitingForOperand, setCalculatorWaitingForOperand] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    type: 'income',
    title: '',
    amount: '',
    category: 'Job',
    date: new Date().toISOString().split('T')[0],
    description: '',
    recurring: false
  })

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
    setNewTransaction({...newTransaction, amount: calculatorDisplay})
    setShowCalculator(false)
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || transaction.type === filterType
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory
    
    return matchesSearch && matchesType && matchesCategory
  })

  // Calculate totals
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const netIncome = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : 0

  // Add transaction
  const addTransaction = () => {
    if (newTransaction.title.trim() && newTransaction.amount) {
      const transaction = {
        id: Date.now(),
        ...newTransaction,
        amount: parseFloat(newTransaction.amount)
      }
      setTransactions([transaction, ...transactions])
      setNewTransaction({
        type: 'income',
        title: '',
        amount: '',
        category: 'Job',
        date: new Date().toISOString().split('T')[0],
        description: '',
        recurring: false
      })
      setIsAddingTransaction(false)
    }
  }

  // Delete transaction
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id))
  }

  // Get category breakdown
  const getCategoryBreakdown = (type) => {
    const categoryTotals = {}
    transactions
      .filter(t => t.type === type)
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
      })
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: type === 'income' 
        ? ((amount / totalIncome) * 100).toFixed(1)
        : ((amount / totalExpenses) * 100).toFixed(1)
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-teal-500/20 rounded-xl">
                  <DollarSign className="w-6 h-6 text-teal-400" />
                </div>
                <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                  Income Tracker
                </h1>
              </div>
              <p className="text-slate-400">Track your earnings and expenses with smart analytics</p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCalculator(!showCalculator)}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white"
              >
                <Calculator className="w-5 h-5" />
                Calculator
              </Button>
              <Button
                onClick={() => setIsAddingTransaction(true)}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-teal-500/25 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Income</p>
                  <p className="text-3xl font-bold text-green-400">${totalIncome.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  </div>
                  <ArrowDownRight className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Expenses</p>
                  <p className="text-3xl font-bold text-red-400">${totalExpenses.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${netIncome >= 0 ? 'bg-teal-500/10' : 'bg-red-500/10'}`}>
                    <Wallet className={`w-6 h-6 ${netIncome >= 0 ? 'text-teal-400' : 'text-red-400'}`} />
                  </div>
                  <Target className={`w-5 h-5 ${netIncome >= 0 ? 'text-teal-400' : 'text-red-400'}`} />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Net Income</p>
                  <p className={`text-3xl font-bold ${netIncome >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                    ${Math.abs(netIncome).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <PieChart className="w-6 h-6 text-blue-400" />
                  </div>
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Savings Rate</p>
                  <p className="text-3xl font-bold text-blue-400">{savingsRate}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 backdrop-blur-md border-slate-700/50 text-white placeholder:text-slate-400 focus:border-teal-500/50"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 text-white focus:border-teal-500/50">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expenses</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 text-white focus:border-teal-500/50">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {[...incomeCategories, ...expenseCategories].map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add Transaction Form */}
            {isAddingTransaction && (
              <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-teal-400" />
                    Add New Transaction
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Select
                      value={newTransaction.type}
                      onValueChange={(value) => setNewTransaction({
                        ...newTransaction, 
                        type: value,
                        category: value === 'income' ? 'Job' : 'Housing'
                      })}
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50">
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
                      onChange={(e) => setNewTransaction({...newTransaction, title: e.target.value})}
                      className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Amount..."
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                        className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowCalculator(true)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-slate-600/50"
                      >
                        <Calculator className="w-4 h-4 text-slate-400" />
                      </Button>
                    </div>
                    
                    <Select
                      value={newTransaction.category}
                      onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {(newTransaction.type === 'income' ? incomeCategories : expenseCategories).map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                      className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50"
                    />
                  </div>
                  
                  <Textarea
                    placeholder="Description (optional)..."
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    rows={3}
                    className="mb-4 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50 resize-none"
                  />
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-slate-300">
                      <input
                        type="checkbox"
                        checked={newTransaction.recurring}
                        onChange={(e) => setNewTransaction({...newTransaction, recurring: e.target.checked})}
                        className="rounded border-slate-600 bg-slate-700 text-teal-500 focus:ring-teal-500/20"
                      />
                      Recurring transaction
                    </label>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={addTransaction}
                        className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        <Check className="w-4 h-4" />
                        Add Transaction
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setIsAddingTransaction(false)}
                        className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transactions List */}
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No transactions found</h3>
                  <p className="text-slate-400">
                    {searchTerm || filterType !== 'all' || filterCategory !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'Add your first transaction to get started'}
                  </p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <Card
                    key={transaction.id}
                    className={`bg-slate-800/50 backdrop-blur-md border transition-all duration-200 hover:border-slate-600/50 ${
                      transaction.type === 'income' 
                        ? 'border-green-500/20 hover:border-green-500/30' 
                        : 'border-red-500/20 hover:border-red-500/30'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${
                            transaction.type === 'income' 
                              ? 'bg-green-500/10 text-green-400' 
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {transaction.type === 'income' ? (
                              <TrendingUp className="w-5 h-5" />
                            ) : (
                              <TrendingDown className="w-5 h-5" />
                            )}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-white">{transaction.title}</h3>
                              {transaction.recurring && (
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                                  Recurring
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span className="px-2 py-1 bg-slate-700/50 rounded-full">{transaction.category}</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(transaction.date).toLocaleDateString()}
                              </span>
                            </div>
                            {transaction.description && (
                              <p className="text-sm text-slate-300 mt-2">{transaction.description}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className={`text-2xl font-bold ${
                            transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingTransaction(transaction.id)}
                              className="hover:bg-slate-700/50"
                            >
                              <Edit3 className="w-4 h-4 text-slate-400 hover:text-teal-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteTransaction(transaction.id)}
                              className="hover:bg-slate-700/50"
                            >
                              <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Breakdown */}
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-teal-400" />
                  Income Breakdown
                </h3>
                <div className="space-y-3">
                  {getCategoryBreakdown('income').map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <span className="text-slate-300">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-medium">${item.amount.toLocaleString()}</span>
                        <span className="text-xs text-slate-400">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-red-400" />
                  Expense Breakdown
                </h3>
                <div className="space-y-3">
                  {getCategoryBreakdown('expense').map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <span className="text-slate-300">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-medium">${item.amount.toLocaleString()}</span>
                        <span className="text-xs text-slate-400">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Calculator Modal */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 w-full max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-teal-400" />
              Calculator
            </DialogTitle>
          </DialogHeader>
          
          {/* Calculator Display */}
          <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
            <div className="text-right text-3xl font-mono text-white overflow-hidden">
              {calculatorDisplay}
            </div>
          </div>
          
          {/* Calculator Buttons */}
          <div className="grid grid-cols-4 gap-3">
            <Button
              onClick={clear}
              className="col-span-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold"
            >
              Clear
            </Button>
            <Button
              onClick={() => performOperation('/')}
              className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 font-semibold"
            >
              ÷
            </Button>
            <Button
              onClick={() => performOperation('*')}
              className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 font-semibold"
            >
              ×
            </Button>
            
            {[7, 8, 9].map(num => (
              <Button
                key={num}
                onClick={() => inputNumber(num)}
                className="bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold"
              >
                {num}
              </Button>
            ))}
            <Button
              onClick={() => performOperation('-')}
              className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 font-semibold"
            >
              −
            </Button>
            
            {[4, 5, 6].map(num => (
              <Button
                key={num}
                onClick={() => inputNumber(num)}
                className="bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold"
              >
                {num}
              </Button>
            ))}
            <Button
              onClick={() => performOperation('+')}
              className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 font-semibold"
            >
              +
            </Button>
            
            {[1, 2, 3].map(num => (
              <Button
                key={num}
                onClick={() => inputNumber(num)}
                className="bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold"
              >
                {num}
              </Button>
            ))}
            <Button
              onClick={handleCalculatorEquals}
              className="row-span-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold"
            >
              =
            </Button>
            
            <Button
              onClick={() => inputNumber(0)}
              className="col-span-2 bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold"
            >
              0
            </Button>
            <Button
              onClick={inputDecimal}
              className="bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold"
            >
              .
            </Button>
          </div>
          
          {/* Use Result Button */}
          {isAddingTransaction && (
            <Button
              onClick={useCalculatorResult}
              className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold"
            >
              Use Result (${calculatorDisplay})
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
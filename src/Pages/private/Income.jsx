"use client"

import { useEffect, useState } from 'react'
import { Plus, DollarSign, TrendingUp, TrendingDown, Wallet, Target, PieChart, BarChart3, Calendar, Edit3, Trash2, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import AddTransactionDialog from '../../util/TransactionDialog'
import { getAllTransactions, removeTransactions } from '@/util/endPoints/transaction'
import ConfirmDialog from '@/util/confirmatoin'
import { toast } from 'sonner'

const incomeCategories = ['job', 'freelance', 'investment', 'business', 'other']
const expenseCategories = ['Housing', 'Food', 'Transportation', 'Bills', 'Entertainment', 'Healthcare', 'Shopping', 'Other']

export default function Income() {
  const [transactions, setTransactions] = useState(null)
  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchTransaction = async () => {
    const res = await getAllTransactions()
    setTransactions(res.data)
  }

  useEffect(() => {
    fetchTransaction();
  }, [])

  // Filter transactions
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = transaction.transactionTitle?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchTerm?.toLowerCase())
    const matchesType = filterType === 'all' || transaction.transactionType === filterType
    const matchesCategory = filterCategory === 'all' || transaction.transactions?.toLowerCase() === filterCategory.toLowerCase()

    return matchesSearch && matchesType && matchesCategory
  }) || []

  // Calculate totals
  const totalIncome = transactions?.filter(t => t.transactionType === 'income').reduce((sum, t) => sum + t.transactionAmount, 0) || 0
  const totalExpenses = transactions?.filter(t => t.transactionType === 'expense').reduce((sum, t) => sum + t.transactionAmount, 0) || 0
  const netIncome = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : 0

  // Add transaction
  const addTransaction = (newTransaction) => {
    if (newTransaction.title?.trim() && newTransaction.amount) {
      const transaction = {
        _id: Date.now().toString(), 
        ...newTransaction,
        transactionTitle: newTransaction.title,
        transactionAmount: parseFloat(newTransaction.amount),
        transactionType: newTransaction.type,
        transactions: newTransaction.category, 
        date: newTransaction.date,
        description: newTransaction.description
      }
      setTransactions([transaction, ...transactions])
      setIsAddingTransaction(false)
    }
  }

  // Delete transaction
  const handleDelete = async () => {
    // console.log(selectedTransaction)
    await removeTransactions(selectedTransaction._id)
    toast.success('Transaction deleted successfully!')
    setDialogOpen(false);
    fetchTransaction();
  }

  // Get category breakdown
  const getCategoryBreakdown = (type) => {
    const categoryTotals = {}
    transactions?.filter(t => t.transactionType === type)
      .forEach(t => {
        const cat = t.transactions?.charAt(0).toUpperCase() + t.transactions?.slice(1)
        categoryTotals[cat] = (categoryTotals[cat] || 0) + t.transactionAmount
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-teal-500/20 rounded-xl">
                  <DollarSign className="w-6 h-6 text-teal-400" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                  Income Tracker
                </h1>
              </div>
              <p className="text-slate-400">Track your earnings and expenses with smart analytics</p>
            </div>

            <div className="mt-4 sm:mt-0 flex gap-3">
              <Button
                onClick={() => setIsAddingTransaction(true)}
                className="cursor-pointer flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-teal-500/25 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 min-w-0">
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 w-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Income</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-400">${totalIncome.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 w-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  </div>
                  <ArrowDownRight className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Expenses</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-400">${totalExpenses.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 w-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${netIncome >= 0 ? 'bg-teal-500/10' : 'bg-red-500/10'}`}>
                    <Wallet className={`w-6 h-6 ${netIncome >= 0 ? 'text-teal-400' : 'text-red-400'}`} />
                  </div>
                  <Target className={`w-5 h-5 ${netIncome >= 0 ? 'text-teal-400' : 'text-red-400'}`} />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Net Income</p>
                  <p className={`text-2xl sm:text-3xl font-bold ${netIncome >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                    ${Math.abs(netIncome).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 w-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <PieChart className="w-6 h-6 text-blue-400" />
                  </div>
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Savings Rate</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-400">{savingsRate}%</p>
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
                      <SelectItem className={'capitalize'} key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                    key={transaction._id}
                    className={`bg-slate-800/50 backdrop-blur-md border transition-all duration-200 hover:border-slate-600/50 ${transaction.transactionType === 'income'
                      ? 'border-green-500/20 hover:border-green-500/30'
                      : 'border-red-500/20 hover:border-red-500/30'
                      }`}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${transaction.transactionType === 'income'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                            }`}>
                            {transaction.transactionType === 'income' ? (
                              <TrendingUp className="w-5 h-5" />
                            ) : (
                              <TrendingDown className="w-5 h-5" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-white">{transaction.transactionTitle}</h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-slate-400">
                              <span className="px-2 py-1 bg-slate-700/50 rounded-full">{transaction.transactions}</span>
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

                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                          <div className={`text-xl sm:text-2xl font-bold ${transaction.transactionType === 'income' ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {transaction.transactionType === 'income' ? '+' : '-'}${transaction.transactionAmount.toLocaleString()}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { setEditingTransaction(transaction), setIsAddingTransaction(true), setSelectedTransaction(transaction) }}
                              className="hover:bg-slate-700/50 cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4 text-slate-400 hover:text-teal-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {setDialogOpen(true), setSelectedTransaction(transaction)}}
                              className="cursor-pointer hover:bg-slate-700/50"
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
              <CardContent className="p-4 sm:p-6">
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
              <CardContent className="p-4 sm:p-6">
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

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        isOpen={isAddingTransaction}
        onClose={() => { setIsAddingTransaction(false), fetchTransaction(), setSelectedTransaction(null) }}
        onAddTransaction={addTransaction}
        selecteTransaction={selectedTransaction}
      />

      {dialogOpen && (
        <ConfirmDialog
          open={dialogOpen}
          onConfirm={handleDelete}
          onCancel={() => setDialogOpen(false)}
          title="Delete Confirmation"
          message="Are you sure you want to delete this item? This action cannot be undone."
        />
      )}
    </div>
  )
}
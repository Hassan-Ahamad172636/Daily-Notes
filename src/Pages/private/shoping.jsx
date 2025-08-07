"use client"

import { useState, useEffect } from 'react'
import { Plus, ShoppingCart, Calendar, Clock, Trash2, Edit3, Check, X, Search, Filter, Package, Receipt, History, Star, Tag, DollarSign, TrendingUp, BarChart3, Archive, ShoppingBag } from 'lucide-react'

const mockShoppingHistory = [
  {
    id: 1,
    date: '2024-01-15',
    items: [
      { id: 1, name: 'Wireless Headphones', price: 89.99, quantity: 1, category: 'Electronics', priority: 'medium' },
      { id: 2, name: 'Coffee Beans', price: 24.50, quantity: 2, category: 'Food', priority: 'high' }
    ],
    total: 138.99,
    status: 'completed'
  },
  {
    id: 2,
    date: '2024-01-10',
    items: [
      { id: 3, name: 'Running Shoes', price: 129.99, quantity: 1, category: 'Clothing', priority: 'high' },
      { id: 4, name: 'Protein Powder', price: 45.00, quantity: 1, category: 'Health', priority: 'medium' }
    ],
    total: 174.99,
    status: 'completed'
  }
]

const categories = ['Electronics', 'Clothing', 'Food', 'Health', 'Home', 'Books', 'Sports', 'Beauty', 'Other']
const priorities = ['low', 'medium', 'high']

const priorityColors = {
  high: "text-red-400 bg-red-500/10 border-red-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  low: "text-green-400 bg-green-500/10 border-green-500/20"
}

const categoryColors = {
  Electronics: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Clothing: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Food: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Health: "text-green-400 bg-green-500/10 border-green-500/20",
  Home: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  Books: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  Sports: "text-red-400 bg-red-500/10 border-red-500/20",
  Beauty: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  Other: "text-slate-400 bg-slate-500/10 border-slate-500/20"
}

export default function Shopping() {
  const [currentItems, setCurrentItems] = useState([])
  const [shoppingHistory, setShoppingHistory] = useState(mockShoppingHistory)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [showHistory, setShowHistory] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    quantity: 1,
    category: 'Other',
    priority: 'medium',
    notes: '',
    targetDate: new Date().toISOString().split('T')[0]
  })

  // Filter current items
  const filteredItems = currentItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.notes.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority
    
    return matchesSearch && matchesCategory && matchesPriority
  })

  // Calculate totals
  const currentTotal = currentItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalSpent = shoppingHistory.reduce((sum, purchase) => sum + purchase.total, 0)
  const averageSpent = shoppingHistory.length > 0 ? totalSpent / shoppingHistory.length : 0

  // Add item to current list
  const addItem = () => {
    if (newItem.name.trim() && newItem.price) {
      const item = {
        id: Date.now(),
        ...newItem,
        price: parseFloat(newItem.price),
        quantity: parseInt(newItem.quantity)
      }
      setCurrentItems([...currentItems, item])
      setNewItem({
        name: '',
        price: '',
        quantity: 1,
        category: 'Other',
        priority: 'medium',
        notes: '',
        targetDate: new Date().toISOString().split('T')[0]
      })
      setIsAddingItem(false)
    }
  }

  // Update item
  const updateItem = (id, updatedItem) => {
    setCurrentItems(currentItems.map(item => 
      item.id === id ? { ...item, ...updatedItem } : item
    ))
    setEditingItem(null)
  }

  // Delete item
  const deleteItem = (id) => {
    setCurrentItems(currentItems.filter(item => item.id !== id))
  }

  // Complete purchase and save to history
  const completePurchase = () => {
    if (currentItems.length > 0) {
      const purchase = {
        id: Date.now(),
        date: selectedDate,
        items: [...currentItems],
        total: currentTotal,
        status: 'completed'
      }
      setShoppingHistory([purchase, ...shoppingHistory])
      setCurrentItems([])
      setSelectedDate(new Date().toISOString().split('T')[0])
    }
  }

  // Clear current list
  const clearCurrentList = () => {
    setCurrentItems([])
  }

  // Get shopping stats
  const getShoppingStats = () => {
    const totalItems = shoppingHistory.reduce((sum, purchase) => sum + purchase.items.length, 0)
    const mostBoughtCategory = categories.reduce((max, category) => {
      const categoryCount = shoppingHistory.reduce((count, purchase) => 
        count + purchase.items.filter(item => item.category === category).length, 0
      )
      return categoryCount > max.count ? { category, count: categoryCount } : max
    }, { category: 'None', count: 0 })

    return {
      totalPurchases: shoppingHistory.length,
      totalItems,
      totalSpent,
      averageSpent,
      mostBoughtCategory: mostBoughtCategory.category
    }
  }

  const stats = getShoppingStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-teal-500/20 rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-teal-400" />
                </div>
                <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                  Shopping List
                </h1>
              </div>
              <p className="text-slate-400">Plan your purchases and track your shopping history</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                  showHistory 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                <History className="w-5 h-5" />
                History
              </button>
              <button
                onClick={() => setIsAddingItem(true)}
                className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-teal-500/25 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                Add Item
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-teal-500/10 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-teal-400" />
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Current Items</p>
                <p className="text-2xl font-bold text-teal-400">{currentItems.length}</p>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Current Total</p>
                <p className="text-2xl font-bold text-green-400">${currentTotal.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Receipt className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Purchases</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalPurchases}</p>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-purple-400">${stats.totalSpent.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Avg. Purchase</p>
                <p className="text-2xl font-bold text-orange-400">${stats.averageSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {showHistory ? (
          /* Shopping History View */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <History className="w-6 h-6 text-teal-400" />
                Shopping History
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200"
              >
                <ShoppingCart className="w-4 h-4" />
                Back to Current List
              </button>
            </div>

            {shoppingHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No purchase history</h3>
                <p className="text-slate-400">Complete your first purchase to see history here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {shoppingHistory.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 transition-all duration-200 hover:border-slate-600/50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-500/10 rounded-lg">
                          <Receipt className="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            Purchase #{purchase.id}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Calendar className="w-4 h-4" />
                            {new Date(purchase.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-teal-400">${purchase.total.toFixed(2)}</p>
                        <p className="text-sm text-slate-400">{purchase.items.length} items</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {purchase.items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white truncate">{item.name}</h4>
                            <span className="text-teal-400 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs border ${categoryColors[item.category]}`}>
                              {item.category}
                            </span>
                            <span className="text-slate-400">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Current Shopping List View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl text-white placeholder:text-slate-400 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
                
                <div className="flex gap-3">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-3 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl text-white focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-4 py-3 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl text-white focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Add Item Form */}
              {isAddingItem && (
                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-teal-400" />
                    Add New Item
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Item name..."
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                    
                    <input
                      type="number"
                      placeholder="Price..."
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <input
                      type="number"
                      placeholder="Quantity"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                      className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                    
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    
                    <select
                      value={newItem.priority}
                      onChange={(e) => setNewItem({...newItem, priority: e.target.value})}
                      className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    
                    <input
                      type="date"
                      value={newItem.targetDate}
                      onChange={(e) => setNewItem({...newItem, targetDate: e.target.value})}
                      className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                  </div>
                  
                  <textarea
                    placeholder="Notes (optional)..."
                    value={newItem.notes}
                    onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all mb-4 resize-none"
                  />
                  
                  <div className="flex gap-3">
                    <button
                      onClick={addItem}
                      className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-all duration-200"
                    >
                      <Check className="w-4 h-4" />
                      Add Item
                    </button>
                    <button
                      onClick={() => setIsAddingItem(false)}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-4">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No items in your list</h3>
                    <p className="text-slate-400">
                      {searchTerm || filterCategory !== 'all' || filterPriority !== 'all' 
                        ? 'Try adjusting your search or filters' 
                        : 'Add your first item to get started'}
                    </p>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 transition-all duration-200 hover:border-slate-600/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-teal-500/10 rounded-lg">
                            <Package className="w-5 h-5 text-teal-400" />
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                            <div className="flex items-center gap-4 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs border ${categoryColors[item.category]}`}>
                                {item.category}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs border ${priorityColors[item.priority]}`}>
                                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                              </span>
                              <span className="text-slate-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.targetDate).toLocaleDateString()}
                              </span>
                              <span className="text-slate-400">Qty: {item.quantity}</span>
                            </div>
                            {item.notes && (
                              <p className="text-sm text-slate-300 mt-2">{item.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-slate-400">Unit: ${item.price.toFixed(2)}</p>
                            <p className="text-2xl font-bold text-teal-400">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingItem(item.id)}
                              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4 text-slate-400 hover:text-teal-400" />
                            </button>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Purchase Summary */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-teal-400" />
                  Purchase Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Items</span>
                    <span className="text-white font-medium">{currentItems.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Subtotal</span>
                    <span className="text-white font-medium">${currentTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-slate-600/50 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-white">Total</span>
                      <span className="text-2xl font-bold text-teal-400">${currentTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm text-slate-300 mb-2">Purchase Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={completePurchase}
                        disabled={currentItems.length === 0}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200"
                      >
                        <Check className="w-4 h-4" />
                        Complete Purchase
                      </button>
                      
                      <button
                        onClick={clearCurrentList}
                        disabled={currentItems.length === 0}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                        Clear List
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-teal-400" />
                  Category Breakdown
                </h3>
                
                <div className="space-y-3">
                  {categories.map(category => {
                    const categoryItems = currentItems.filter(item => item.category === category)
                    const categoryTotal = categoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                    
                    if (categoryItems.length === 0) return null
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs border ${categoryColors[category]}`}>
                            {category}
                          </span>
                          <span className="text-slate-400 text-sm">({categoryItems.length})</span>
                        </div>
                        <span className="text-white font-medium">${categoryTotal.toFixed(2)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-400" />
                  Quick Stats
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Most Bought Category</span>
                    <span className="text-teal-400">{stats.mostBoughtCategory}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Total Items Bought</span>
                    <span className="text-teal-400">{stats.totalItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Average Item Price</span>
                    <span className="text-teal-400">
                      ${currentItems.length > 0 ? (currentTotal / currentItems.reduce((sum, item) => sum + item.quantity, 0)).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

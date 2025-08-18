"use client"

import React, { useState, useEffect } from 'react'
import { Plus, Lightbulb, Star, Tag, Calendar, Clock, Edit3, Trash2, Check, X, Search, Filter, Brain, Zap, Target, TrendingUp, Archive, BookOpen, Palette, Code, Music, Camera, Rocket, Heart, Eye, EyeOff, Copy, Share2, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const mockIdeas = [
  {
    id: 1,
    title: "AI-Powered Personal Assistant",
    description: "Create a smart assistant that learns from user behavior and provides personalized recommendations for daily tasks, scheduling, and productivity optimization.",
    category: "Technology",
    priority: "high",
    status: "in-progress",
    tags: ["AI", "Machine Learning", "Productivity"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    isFavorite: true,
    isPrivate: false,
    color: "blue",
    notes: "Research existing solutions and identify unique value proposition"
  },
  {
    id: 2,
    title: "Sustainable Urban Garden App",
    description: "Mobile app that helps urban dwellers create and maintain sustainable gardens in small spaces, with AR visualization and community features.",
    category: "Environment",
    priority: "medium",
    status: "idea",
    tags: ["Sustainability", "Mobile App", "AR", "Community"],
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
    isFavorite: false,
    isPrivate: false,
    color: "green",
    notes: "Partner with local nurseries and gardening experts"
  },
  {
    id: 3,
    title: "Interactive Learning Platform",
    description: "Gamified learning platform that adapts to different learning styles and provides immersive educational experiences through VR/AR technology.",
    category: "Education",
    priority: "high",
    status: "research",
    tags: ["Education", "VR", "Gamification", "Adaptive Learning"],
    createdAt: "2024-01-13",
    updatedAt: "2024-01-14",
    isFavorite: true,
    isPrivate: true,
    color: "purple",
    notes: "Focus on STEM subjects initially, then expand to other areas"
  },
  {
    id: 4,
    title: "Mindfulness Music Generator",
    description: "AI-powered music generator that creates personalized ambient soundscapes based on mood, stress levels, and environmental factors.",
    category: "Wellness",
    priority: "low",
    status: "completed",
    tags: ["Music", "AI", "Wellness", "Personalization"],
    createdAt: "2024-01-12",
    updatedAt: "2024-01-13",
    isFavorite: false,
    isPrivate: false,
    color: "teal",
    notes: "Prototype completed, ready for user testing"
  }
]

const categories = ['Technology', 'Business', 'Art', 'Education', 'Environment', 'Health', 'Entertainment', 'Social', 'Other']
const priorities = ['low', 'medium', 'high']
const statuses = ['idea', 'research', 'in-progress', 'completed', 'on-hold']
const colors = ['blue', 'green', 'purple', 'red', 'yellow', 'pink', 'indigo', 'teal', 'orange']

const priorityColors = {
  high: "text-red-400 bg-red-500/10 border-red-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  low: "text-green-400 bg-green-500/10 border-green-500/20"
}

const statusColors = {
  idea: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  research: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  'in-progress': "text-orange-400 bg-orange-500/10 border-orange-500/20",
  completed: "text-green-400 bg-green-500/10 border-green-500/20",
  'on-hold': "text-slate-400 bg-slate-500/10 border-slate-500/20"
}

const categoryIcons = {
  Technology: Code,
  Business: Target,
  Art: Palette,
  Education: BookOpen,
  Environment: Heart,
  Health: Heart,
  Entertainment: Music,
  Social: Share2,
  Other: Lightbulb
}

const ideaColors = {
  blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  green: "from-green-500/20 to-green-600/10 border-green-500/30",
  purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  red: "from-red-500/20 to-red-600/10 border-red-500/30",
  yellow: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
  pink: "from-pink-500/20 to-pink-600/10 border-pink-500/30",
  indigo: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30",
  teal: "from-teal-500/20 to-teal-600/10 border-teal-500/30",
  orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30"
}

export default function Idea() {
  const [ideas, setIdeas] = useState(mockIdeas)
  const [isAddingIdea, setIsAddingIdea] = useState(false)
  const [editingIdea, setEditingIdea] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    category: 'Technology',
    priority: 'medium',
    status: 'idea',
    tags: [],
    isPrivate: false,
    color: 'blue',
    notes: ''
  })
  const [newTag, setNewTag] = useState('')

  // Initialize editing idea
  useEffect(() => {
    if (editingIdea) {
      const idea = ideas.find(i => i.id === editingIdea)
      if (idea) {
        setNewIdea({
          title: idea.title,
          description: idea.description,
          category: idea.category,
          priority: idea.priority,
          status: idea.status,
          tags: idea.tags,
          isPrivate: idea.isPrivate,
          color: idea.color,
          notes: idea.notes
        })
      }
    } else {
      setNewIdea({
        title: '',
        description: '',
        category: 'Technology',
        priority: 'medium',
        status: 'idea',
        tags: [],
        isPrivate: false,
        color: 'blue',
        notes: ''
      })
    }
  }, [editingIdea, ideas])

  // Filter ideas
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || idea.category === filterCategory
    const matchesStatus = filterStatus === 'all' || idea.status === filterStatus
    const matchesPriority = filterPriority === 'all' || idea.priority === filterPriority
    const matchesFavorites = !showFavoritesOnly || idea.isFavorite
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesFavorites
  })

  // Sort ideas by priority and date
  const sortedIdeas = filteredIdeas.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  })

  // Add idea
  const addIdea = () => {
    if (newIdea.title.trim() && newIdea.description.trim()) {
      const idea = {
        id: Date.now(),
        ...newIdea,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        isFavorite: false
      }
      setIdeas([idea, ...ideas])
      setNewIdea({
        title: '',
        description: '',
        category: 'Technology',
        priority: 'medium',
        status: 'idea',
        tags: [],
        isPrivate: false,
        color: 'blue',
        notes: ''
      })
      setIsAddingIdea(false)
    }
  }

  // Update idea
  const updateIdea = () => {
    if (newIdea.title.trim() && newIdea.description.trim()) {
      setIdeas(ideas.map(idea => 
        idea.id === editingIdea ? { ...idea, ...newIdea, updatedAt: new Date().toISOString().split('T')[0] } : idea
      ))
      setEditingIdea(null)
      setNewIdea({
        title: '',
        description: '',
        category: 'Technology',
        priority: 'medium',
        status: 'idea',
        tags: [],
        isPrivate: false,
        color: 'blue',
        notes: ''
      })
    }
  }

  // Delete idea
  const deleteIdea = (id) => {
    setIdeas(ideas.filter(idea => idea.id !== id))
    if (selectedIdea && selectedIdea.id === id) {
      setSelectedIdea(null)
    }
  }

  // Toggle favorite
  const toggleFavorite = (id) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, isFavorite: !idea.isFavorite, updatedAt: new Date().toISOString().split('T')[0] } : idea
    ))
  }

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !newIdea.tags.includes(newTag.trim())) {
      setNewIdea({
        ...newIdea,
        tags: [...newIdea.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  // Remove tag
  const removeTag = (tagToRemove) => {
    setNewIdea({
      ...newIdea,
      tags: newIdea.tags.filter(tag => tag !== tagToRemove)
    })
  }

  // Get idea stats
  const getIdeaStats = () => {
    return {
      total: ideas.length,
      favorites: ideas.filter(i => i.isFavorite).length,
      inProgress: ideas.filter(i => i.status === 'in-progress').length,
      completed: ideas.filter(i => i.status === 'completed').length,
      highPriority: ideas.filter(i => i.priority === 'high').length
    }
  }

  const stats = getIdeaStats()

  // Get category breakdown
  const getCategoryBreakdown = () => {
    const breakdown = {}
    ideas.forEach(idea => {
      breakdown[idea.category] = (breakdown[idea.category] || 0) + 1
    })
    return Object.entries(breakdown).map(([category, count]) => ({
      category,
      count,
      percentage: ((count / ideas.length) * 100).toFixed(1)
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-teal-500/20 rounded-xl">
                  <Lightbulb className="w-6 h-6 text-teal-400" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                  Ideas
                </h1>
              </div>
              <p className="text-slate-400">Capture, organize, and develop your creative thoughts</p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center gap-2 ${showFavoritesOnly 
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                  : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
              >
                <Star className={`w-5 h-5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                Favorites
              </Button>
              <Button
                onClick={() => setIsAddingIdea(true)}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-teal-500/25 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                New Idea
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-teal-500/10 rounded-lg">
                    <Brain className="w-5 h-5 text-teal-400" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Ideas</p>
                  <p className="text-2xl font-bold text-teal-400">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Favorites</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.favorites}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Zap className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">In Progress</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.inProgress}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Target className="w-5 h-5 text-red-400" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">High Priority</p>
                  <p className="text-2xl font-bold text-red-400">{stats.highPriority}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search ideas, descriptions, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 backdrop-blur-md border-slate-700/50 text-white placeholder:text-slate-400 focus:border-teal-500/50"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 text-white focus:border-teal-500/50">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 text-white focus:border-teal-500/50">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 text-white focus:border-teal-500/50">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Add/Edit Idea Form */}
        <Dialog open={isAddingIdea || editingIdea !== null} onOpenChange={() => {
          setIsAddingIdea(false)
          setEditingIdea(null)
        }}>
          <DialogContent className="bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 w-full max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-400" />
                {editingIdea ? 'Edit Idea' : 'Capture New Idea'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                type="text"
                placeholder="Idea title..."
                value={newIdea.title}
                onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50"
              />
              
              <Select value={newIdea.category} onValueChange={(value) => setNewIdea({...newIdea, category: value})}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              placeholder="Describe your idea in detail..."
              value={newIdea.description}
              onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
              rows={4}
              className="mb-4 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50 resize-none"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Select value={newIdea.priority} onValueChange={(value) => setNewIdea({...newIdea, priority: value})}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={newIdea.status} onValueChange={(value) => setNewIdea({...newIdea, status: value})}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={newIdea.color} onValueChange={(value) => setNewIdea({...newIdea, color: value})}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50">
                  <SelectValue placeholder="Select Color" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map(color => (
                    <SelectItem key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <label className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIdea.isPrivate}
                  onChange={(e) => setNewIdea({...newIdea, isPrivate: e.target.checked})}
                  className="rounded border-slate-600 bg-slate-700 text-teal-500 focus:ring-teal-500/20"
                />
                <EyeOff className="w-4 h-4" />
                Private
              </label>
            </div>
            
            {/* Tags Input */}
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50"
                />
                <Button
                  onClick={addTag}
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newIdea.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-sm border border-teal-500/30"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTag(tag)}
                      className="h-4 w-4 hover:text-teal-300"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </span>
                ))}
              </div>
            </div>
            
            <Textarea
              placeholder="Additional notes (optional)..."
              value={newIdea.notes}
              onChange={(e) => setNewIdea({...newIdea, notes: e.target.value})}
              rows={3}
              className="mb-4 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50 resize-none"
            />
            
            <div className="flex gap-3">
              <Button
                onClick={editingIdea ? updateIdea : addIdea}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Check className="w-4 h-4" />
                {editingIdea ? 'Update Idea' : 'Save Idea'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsAddingIdea(false)
                  setEditingIdea(null)
                }}
                className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedIdeas.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No ideas found</h3>
              <p className="text-slate-400">
                {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' || filterPriority !== 'all' || showFavoritesOnly
                  ? 'Try adjusting your search or filters' 
                  : 'Capture your first brilliant idea to get started'}
              </p>
            </div>
          ) : (
            sortedIdeas.map((idea) => {
              const CategoryIcon = categoryIcons[idea.category] || Lightbulb
              
              return (
                <Card
                  key={idea.id}
                  className={`bg-gradient-to-br ${ideaColors[idea.color]} backdrop-blur-md border rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer group`}
                  onClick={() => setSelectedIdea(idea)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${idea.color}-500/20 rounded-lg`}>
                          <CategoryIcon className={`w-5 h-5 text-${idea.color}-400`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-teal-200 transition-colors">
                            {idea.title}
                          </h3>
                          <p className="text-sm text-slate-400">{idea.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {idea.isPrivate && (
                          <EyeOff className="w-4 h-4 text-slate-400" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(idea.id)
                          }}
                          className="hover:scale-110"
                        >
                          <Star className={`w-5 h-5 ${idea.isFavorite ? 'text-yellow-400 fill-current' : 'text-slate-400 hover:text-yellow-400'}`} />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                      {idea.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs border ${priorityColors[idea.priority]}`}>
                        {idea.priority.charAt(0).toUpperCase() + idea.priority.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[idea.status]}`}>
                        {idea.status.charAt(0).toUpperCase() + idea.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {idea.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {idea.tags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-700/50 text-slate-400 rounded text-xs">
                          +{idea.tags.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(idea.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingIdea(idea.id)
                          }}
                          className="hover:bg-slate-700/50"
                        >
                          <Edit3 className="w-3 h-3 hover:text-teal-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteIdea(idea.id)
                          }}
                          className="hover:bg-slate-700/50"
                        >
                          <Trash2 className="w-3 h-3 hover:text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>

      {/* Idea Detail Modal */}
      <Dialog open={selectedIdea !== null} onOpenChange={() => setSelectedIdea(null)}>
        <DialogContent className="bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`p-3 bg-${selectedIdea?.color}-500/20 rounded-xl`}>
                {selectedIdea && React.createElement(categoryIcons[selectedIdea.category] || Lightbulb, {
                  className: `w-6 h-6 text-${selectedIdea.color}-400`
                })}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedIdea?.title}</h2>
                <p className="text-slate-400">{selectedIdea?.category}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-slate-300 leading-relaxed">{selectedIdea?.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Priority</h4>
                <span className={`px-3 py-1 rounded-full text-sm border ${selectedIdea && priorityColors[selectedIdea.priority]}`}>
                  {selectedIdea?.priority.charAt(0).toUpperCase() + selectedIdea?.priority.slice(1)}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Status</h4>
                <span className={`px-3 py-1 rounded-full text-sm border ${selectedIdea && statusColors[selectedIdea.status]}`}>
                  {selectedIdea?.status.charAt(0).toUpperCase() + selectedIdea?.status.slice(1).replace('-', ' ')}
                </span>
              </div>
            </div>
            
            {selectedIdea?.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedIdea.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-sm border border-teal-500/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {selectedIdea?.notes && (
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Notes</h4>
                <p className="text-slate-300 bg-slate-700/30 rounded-lg p-4">{selectedIdea.notes}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-slate-600/50">
              <div>
                <p>Created: {selectedIdea && new Date(selectedIdea.createdAt).toLocaleDateString()}</p>
                <p>Updated: {selectedIdea && new Date(selectedIdea.updatedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedIdea?.isPrivate && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <EyeOff className="w-4 h-4" />
                    Private
                  </div>
                )}
                <Button
                  variant="ghost"
                  onClick={() => toggleFavorite(selectedIdea.id)}
                  className="flex items-center gap-1 hover:text-yellow-400"
                >
                  <Star className={`w-4 h-4 ${selectedIdea?.isFavorite ? 'text-yellow-400 fill-current' : ''}`} />
                  {selectedIdea?.isFavorite ? 'Favorited' : 'Add to Favorites'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

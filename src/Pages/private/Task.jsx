"use client"

import { useEffect, useState } from 'react'
import { Plus, Edit3, Trash2, Check, X, Calendar, Clock, Flag, Search, CheckCircle2, Circle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { create, get, isCompleted, update } from '@/util/endPoints/task'

const priorityColors = {
  high: "text-red-400 bg-red-500/10 border-red-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  low: "text-green-400 bg-green-500/10 border-green-500/20"
}

const categoryColors = {
  Work: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Health: "text-green-400 bg-green-500/10 border-green-500/20",
  Personal: "text-purple-400 bg-purple-500/10 border-purple-500/20"
}

export default function Task() {
  const [tasks, setTasks] = useState()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: 'Personal'
  })
  const [selectedItem, setSelectedItem] = useState(null)
  const [error, setError] = useState('')

  const fetchTasks = async () => {
    const res = await get();
    setTasks(res.tasks)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Initialize dialog state when editing
  const openDialog = (task = null) => {
    if (task) {
      setEditingTask(task)
      setNewTask({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        category: task.category
      })
    } else {
      setEditingTask(null)
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        category: 'Personal'
      })
    }
    setError('')
    setIsDialogOpen(true)
  }

  // Filter tasks based on search and filters
  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      task.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'completed' && task.completed) ||
      (filterStatus === 'pending' && !task.completed)

    return matchesSearch && matchesPriority && matchesStatus
  })

  // Add new task
  const addTask = async () => {
    if (!newTask.title?.trim()) {
      // setError('Task title is required')
      return
    }
    const task = {
      ...newTask,
      completed: false,
      createdAt: new Date()?.toISOString()?.split('T')[0]
    }
    setTasks([task, ...tasks])
    setIsDialogOpen(false)
    // setNewTask({
    //   title: '',
    //   description: '',
    //   priority: 'medium',
    //   dueDate: '',
    //   category: 'Personal'
    // })
    await create({
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      category: newTask.category
    })
    setError('')
  }

  // Update task
const updateTask = async () => {
  if (!newTask.title.trim()) {
    setError('Task title is required')
    return
  }

  try {
    await update(selectedItem, {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      category: newTask.category,
    })

    // Option 1: Fetch fresh data from server
    await fetchTasks()

    // Option 2 (faster): Update local state directly
    setTasks(prev =>
      prev.map(task =>
        task.id === selectedItem
          ? { ...task, ...newTask }
          : task
      )
    )

    setIsDialogOpen(false)
    setEditingTask(null)
    setError('')
  } catch (err) {
    console.error(err)
    setError('Failed to update task')
  }
}


  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  // Toggle task completion
  const toggleTask = async (id) => {
    const res = await isCompleted(id)
    if(res.success == true) {
      setTasks(tasks.map(task =>
        task._id === id ? { ...task, completed: !task.completed } : task
      ))
    }
  }

  // Get task stats
  const taskStats = {
    total: tasks?.length,
    completed: tasks?.filter(t => t?.completed)?.length,
    pending: tasks?.filter(t => !t?.completed)?.length,
    overdue: tasks?.filter(t => !t?.completed && new Date(t?.dueDate) < new Date())?.length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                Daily Tasks
              </h1>
              <p className="text-slate-400">Organize and track your daily activities</p>
            </div>

            <Button
              onClick={() => openDialog()}
              className="cursor-pointer flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md shadow-lg hover:shadow-teal-500/25 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              Add Task
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total</p>
                    <p className="text-2xl font-bold text-white">{taskStats.total}</p>
                  </div>
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-green-400">{taskStats.completed}</p>
                  </div>
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-yellow-400">{taskStats.pending}</p>
                  </div>
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Overdue</p>
                    <p className="text-2xl font-bold text-red-400">{taskStats.overdue}</p>
                  </div>
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Flag className="w-5 h-5 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 backdrop-blur-md border-slate-700/50 text-white placeholder:text-slate-400 focus:border-teal-500/50"
              />
            </div>

            <div className="flex gap-3">
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 text-white focus:border-teal-500/50">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 text-white focus:border-teal-500/50">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Task Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={() => {
          setIsDialogOpen(false)
          setEditingTask(null)
          setError('')
        }}>
          <DialogContent className="bg-slate-800 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 w-full max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
                {editingTask ? (
                  <>
                    <Edit3 className="w-5 h-5 text-teal-400" />
                    Edit Task
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-teal-400" />
                    Add New Task
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50"
              />

              <Textarea
                placeholder="Task description..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50 resize-none"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={newTask.category}
                  onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={editingTask ? updateTask : addTask}
                  className="cursor-pointer flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white"
                >
                  <Check className="w-4 h-4" />
                  {editingTask ? 'Save' : 'Add Task'}
                </Button>
                <Button
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingTask(null)
                    setError('')
                  }}
                  variant="secondary"
                  className="cursor-pointer flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks?.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
              <p className="text-slate-400">
                {searchTerm || filterPriority !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add your first task to get started'}
              </p>
            </div>
          ) : (
            filteredTasks?.map((task) => (
              <Card
                key={task.id}
                className={`bg-slate-800/50 backdrop-blur-md border border-slate-700/50 transition-all duration-200 hover:border-slate-600/50 ${task.completed ? 'opacity-75' : ''
                  }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Button
                      // variant="ghost"
                      size="icon"
                      onClick={() => toggleTask(task._id)}
                      className="cursor-pointer mt-1 hover:scale-110 hover:bg-teal-800 bg-teal-700"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-teal-400" />
                      ) : (
                        <Circle className="w-6 h-6 hover:text-teal-400 text-teal-400" />
                      )}
                    </Button>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-lg font-semibold transition-all duration-200 ${task.completed ? 'text-slate-400 line-through' : 'text-white'
                          }`}>
                          {task.title}
                        </h3>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              openDialog(task)
                              setSelectedItem(task._id)
                            }}
                            className="cursor-pointer hover:bg-slate-700/50"
                          >
                            <Edit3 className="w-4 h-4 text-slate-400 hover:text-teal-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            className="cursor-pointer hover:bg-slate-700/50"
                          >
                            <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                          </Button>
                        </div>
                      </div>

                      {task.description && (
                        <p className={`mb-3 transition-all duration-200 ${task.completed ? 'text-slate-500' : 'text-slate-300'
                          }`}>
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>

                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[task.category]}`}>
                          {task.category}
                        </span>

                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
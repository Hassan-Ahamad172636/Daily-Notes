"use client"

import { useState, useEffect } from 'react'
import { Plus, Calendar, Clock, MapPin, Users, Edit3, Trash2, Check, X, Search, ChevronLeft, ChevronRight, CalendarDays, Bell, BellOff, Briefcase, Heart, BookOpen, Zap, Star, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const mockEvents = [
  {
    id: 1,
    title: "Team Standup Meeting",
    description: "Daily standup with the development team to discuss progress and blockers",
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "09:30",
    location: "Conference Room A",
    attendees: ["John Doe", "Jane Smith", "Mike Johnson"],
    category: "Work",
    priority: "high",
    type: "meeting",
    isRecurring: true,
    recurringType: "daily",
    reminderEnabled: true,
    reminderTime: 15,
    color: "blue",
    status: "confirmed"
  },
  {
    id: 2,
    title: "Lunch with Sarah",
    description: "Catch up lunch at the new Italian restaurant downtown",
    date: "2024-01-15",
    startTime: "12:30",
    endTime: "14:00",
    location: "Bella Vista Restaurant",
    attendees: ["Sarah Wilson"],
    category: "Personal",
    priority: "medium",
    type: "social",
    isRecurring: false,
    recurringType: "none",
    reminderEnabled: true,
    reminderTime: 30,
    color: "green",
    status: "confirmed"
  },
  {
    id: 3,
    title: "Gym Workout",
    description: "Upper body strength training session",
    date: "2024-01-15",
    startTime: "18:00",
    endTime: "19:30",
    location: "FitLife Gym",
    attendees: [],
    category: "Health",
    priority: "medium",
    type: "personal",
    isRecurring: true,
    recurringType: "weekly",
    reminderEnabled: true,
    reminderTime: 60,
    color: "red",
    status: "confirmed"
  },
  {
    id: 4,
    title: "Project Review",
    description: "Quarterly project review with stakeholders",
    date: "2024-01-16",
    startTime: "14:00",
    endTime: "16:00",
    location: "Virtual Meeting",
    attendees: ["Alex Brown", "Lisa Davis", "Tom Wilson"],
    category: "Work",
    priority: "high",
    type: "meeting",
    isRecurring: false,
    recurringType: "none",
    reminderEnabled: true,
    reminderTime: 30,
    color: "purple",
    status: "tentative"
  },
  {
    id: 5,
    title: "Doctor Appointment",
    description: "Annual health checkup",
    date: "2024-01-17",
    startTime: "10:00",
    endTime: "11:00",
    location: "City Medical Center",
    attendees: [],
    category: "Health",
    priority: "high",
    type: "appointment",
    isRecurring: false,
    recurringType: "none",
    reminderEnabled: true,
    reminderTime: 120,
    color: "teal",
    status: "confirmed"
  }
]

const categories = ['Work', 'Personal', 'Health', 'Education', 'Social', 'Travel', 'Other']
const priorities = ['low', 'medium', 'high']
const eventTypes = ['meeting', 'appointment', 'personal', 'social', 'work', 'health', 'other']
const recurringTypes = ['none', 'daily', 'weekly', 'monthly', 'yearly']
const colors = ['blue', 'green', 'red', 'purple', 'yellow', 'pink', 'indigo', 'teal', 'orange']
const reminderTimes = [5, 10, 15, 30, 60, 120, 1440] // minutes

const priorityColors = {
  high: "text-red-400 bg-red-500/10 border-red-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  low: "text-green-400 bg-green-500/10 border-green-500/20"
}

const statusColors = {
  confirmed: "text-green-400 bg-green-500/10 border-green-500/20",
  tentative: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  cancelled: "text-red-400 bg-red-500/10 border-red-500/20"
}

const categoryIcons = {
  Work: Briefcase,
  Personal: Heart,
  Health: Heart,
  Education: BookOpen,
  Social: Users,
  Travel: MapPin,
  Other: Calendar
}

const eventColors = {
  blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  green: "from-green-500/20 to-green-600/10 border-green-500/30",
  red: "from-red-500/20 to-red-600/10 border-red-500/30",
  purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  yellow: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
  pink: "from-pink-500/20 to-pink-600/10 border-pink-500/30",
  indigo: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30",
  teal: "from-teal-500/20 to-teal-600/10 border-teal-500/30",
  orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30"
}

export default function Schedule() {
  const [events, setEvents] = useState(mockEvents)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('day') // day, week, month
  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    attendees: [],
    category: 'Work',
    priority: 'medium',
    type: 'meeting',
    isRecurring: false,
    recurringType: 'none',
    reminderEnabled: true,
    reminderTime: 15,
    color: 'blue',
    status: 'confirmed'
  })
  const [newAttendee, setNewAttendee] = useState('')

  // Initialize editing event
  useEffect(() => {
    if (editingEvent) {
      const event = events.find(e => e.id === editingEvent)
      if (event) {
        setNewEvent({
          title: event.title,
          description: event.description,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          attendees: event.attendees,
          category: event.category,
          priority: event.priority,
          type: event.type,
          isRecurring: event.isRecurring,
          recurringType: event.recurringType,
          reminderEnabled: event.reminderEnabled,
          reminderTime: event.reminderTime,
          color: event.color,
          status: event.status
        })
      }
    } else {
      setNewEvent({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        attendees: [],
        category: 'Work',
        priority: 'medium',
        type: 'meeting',
        isRecurring: false,
        recurringType: 'none',
        reminderEnabled: true,
        reminderTime: 15,
        color: 'blue',
        status: 'confirmed'
      })
    }
  }, [editingEvent, events])

  // Get events for current view
  const getEventsForView = () => {
    const startDate = new Date(currentDate)
    const endDate = new Date(currentDate)
    
    if (viewMode === 'day') {
      // Same day
    } else if (viewMode === 'week') {
      startDate.setDate(currentDate.getDate() - currentDate.getDay())
      endDate.setDate(startDate.getDate() + 6)
    } else if (viewMode === 'month') {
      startDate.setDate(1)
      endDate.setMonth(startDate.getMonth() + 1)
      endDate.setDate(0)
    }
    
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= startDate && eventDate <= endDate
    })
  }

  // Filter events
  const filteredEvents = getEventsForView().filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory
    const matchesPriority = filterPriority === 'all' || event.priority === filterPriority
    
    return matchesSearch && matchesCategory && matchesPriority
  })

  // Sort events by time
  const sortedEvents = filteredEvents.sort((a, b) => {
    if (a.date !== b.date) {
      return new Date(a.date) - new Date(b.date)
    }
    return a.startTime.localeCompare(b.startTime)
  })

  // Add event
  const addEvent = () => {
    if (newEvent.title.trim() && newEvent.date && newEvent.startTime && newEvent.endTime) {
      const event = {
        id: Date.now(),
        ...newEvent,
        attendees: newEvent.attendees.filter(a => a.trim())
      }
      setEvents([...events, event])
      setNewEvent({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        attendees: [],
        category: 'Work',
        priority: 'medium',
        type: 'meeting',
        isRecurring: false,
        recurringType: 'none',
        reminderEnabled: true,
        reminderTime: 15,
        color: 'blue',
        status: 'confirmed'
      })
      setNewAttendee('')
      setIsAddingEvent(false)
    }
  }

  // Update event
  const updateEvent = () => {
    if (newEvent.title.trim() && newEvent.date && newEvent.startTime && newEvent.endTime) {
      setEvents(events.map(event => 
        event.id === editingEvent ? { ...event, ...newEvent, attendees: newEvent.attendees.filter(a => a.trim()) } : event
      ))
      setNewEvent({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        attendees: [],
        category: 'Work',
        priority: 'medium',
        type: 'meeting',
        isRecurring: false,
        recurringType: 'none',
        reminderEnabled: true,
        reminderTime: 15,
        color: 'blue',
        status: 'confirmed'
      })
      setNewAttendee('')
      setEditingEvent(null)
    }
  }

  // Delete event
  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id))
    if (selectedEvent && selectedEvent.id === id) {
      setSelectedEvent(null)
    }
  }

  // Add attendee
  const addAttendee = () => {
    if (newAttendee.trim() && !newEvent.attendees.includes(newAttendee.trim())) {
      setNewEvent({
        ...newEvent,
        attendees: [...newEvent.attendees, newAttendee.trim()]
      })
      setNewAttendee('')
    }
  }

  // Remove attendee
  const removeAttendee = (attendeeToRemove) => {
    setNewEvent({
      ...newEvent,
      attendees: newEvent.attendees.filter(attendee => attendee !== attendeeToRemove)
    })
  }

  // Navigate dates
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate)
    
    if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + direction)
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction * 7))
    } else if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + direction)
    }
    
    setCurrentDate(newDate)
  }

  // Get schedule stats
  const getScheduleStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayEvents = events.filter(e => e.date === today)
    const upcomingEvents = events.filter(e => new Date(e.date) > new Date())
    const highPriorityEvents = events.filter(e => e.priority === 'high' && new Date(e.date) >= new Date())
    
    return {
      total: events.length,
      today: todayEvents.length,
      upcoming: upcomingEvents.length,
      highPriority: highPriorityEvents.length,
      thisWeek: events.filter(e => {
        const eventDate = new Date(e.date)
        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return eventDate >= weekStart && eventDate <= weekEnd
      }).length
    }
  }

  const stats = getScheduleStats()

  // Format time for display
const formatTime = (time) => {
  if (!time || typeof time !== 'string') return ''  // avoid crash

  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}


  // Format date for display
  const formatDate = (date, format = 'full') => {
    const d = new Date(date)
    if (format === 'short') {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get current view title
  const getViewTitle = () => {
    if (viewMode === 'day') {
      return formatDate(currentDate)
    } else if (viewMode === 'week') {
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return `${formatDate(weekStart, 'short')} - ${formatDate(weekEnd, 'short')}`
    } else if (viewMode === 'month') {
      return currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-teal-500/20 rounded-xl">
                  <Calendar className="w-6 h-6 text-teal-400" />
                </div>
                <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                  Schedule
                </h1>
              </div>
              <p className="text-slate-400">Manage your time and stay organized</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-1">
                {['day', 'week', 'month'].map((mode) => (
                  <Button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      viewMode === mode
                        ? 'bg-teal-500 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                    variant={viewMode === mode ? 'default' : 'ghost'}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Button>
                ))}
              </div>
              
              <Button
                onClick={() => setIsAddingEvent(true)}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-teal-500/25 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                Add Event
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-teal-500/10 rounded-lg">
                    <CalendarDays className="w-5 h-5 text-teal-400" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Events</p>
                  <p className="text-2xl font-bold text-teal-400">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Today</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.today}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Zap className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">This Week</p>
                  <p className="text-2xl font-bold text-green-400">{stats.thisWeek}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Star className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Upcoming</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.upcoming}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">High Priority</p>
                  <p className="text-2xl font-bold text-red-400">{stats.highPriority}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation and Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Date Navigation */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigateDate(-1)}
                className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 hover:bg-slate-700/50"
                variant="ghost"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </Button>
              
              <Card className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50">
                <CardContent className="px-4 py-2">
                  <h2 className="text-lg font-semibold text-white whitespace-nowrap">
                    {getViewTitle()}
                  </h2>
                </CardContent>
              </Card>
              
              <Button
                onClick={() => navigateDate(1)}
                className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 hover:bg-slate-700/50"
                variant="ghost"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </Button>
              
              <Button
                onClick={() => setCurrentDate(new Date())}
                className="bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30"
                variant="ghost"
              >
                Today
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-1 gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 backdrop-blur-md border-slate-700/50 text-white placeholder:text-slate-400 focus:border-teal-500/50"
                />
              </div>
              
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

        {/* Add/Edit Event Form */}
        <Dialog open={isAddingEvent || editingEvent !== null} onOpenChange={() => {
          setIsAddingEvent(false)
          setEditingEvent(null)
        }}>
          <DialogContent className="bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 w-full max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-400" />
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                type="text"
                placeholder="Event title..."
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50"
              />
              
              <Select value={newEvent.category} onValueChange={(value) => setNewEvent({...newEvent, category: value})}>
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
              placeholder="Event description..."
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              rows={3}
              className="mb-4 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50 resize-none"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50"
              />
              
              <Input
                type="time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50"
              />
              
              <Input
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50"
              />
              
              <Input
                type="text"
                placeholder="Location..."
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Select value={newEvent.priority} onValueChange={(value) => setNewEvent({...newEvent, priority: value})}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={newEvent.color} onValueChange={(value) => setNewEvent({...newEvent, color: value})}>
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
              
              <Select value={newEvent.status} onValueChange={(value) => setNewEvent({...newEvent, status: value})}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="tentative">Tentative</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Attendees */}
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Add attendee..."
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAttendee()}
                  className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-teal-500/50"
                />
                <Button
                  onClick={addAttendee}
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newEvent.attendees.map((attendee, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30"
                  >
                    <Users className="w-3 h-3" />
                    {attendee}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttendee(attendee)}
                      className="h-4 w-4 hover:text-blue-300"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </span>
                ))}
              </div>
            </div>
            
            {/* Additional Options */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={newEvent.isRecurring}
                  onChange={(e) => setNewEvent({...newEvent, isRecurring: e.target.checked})}
                  className="rounded border-slate-600 bg-slate-700 text-teal-500 focus:ring-teal-500/20"
                />
                Recurring Event
              </label>
              
              {newEvent.isRecurring && (
                <Select value={newEvent.recurringType} onValueChange={(value) => setNewEvent({...newEvent, recurringType: value})}>
                  <SelectTrigger className="px-3 py-1 bg-slate-700/50 border-slate-600/50 text-white text-sm">
                    <SelectValue placeholder="Select Recurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    {recurringTypes.slice(1).map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={newEvent.reminderEnabled}
                  onChange={(e) => setNewEvent({...newEvent, reminderEnabled: e.target.checked})}
                  className="rounded border-slate-600 bg-slate-700 text-teal-500 focus:ring-teal-500/20"
                />
                <Bell className="w-4 h-4" />
                Reminder
              </label>
              
              {newEvent.reminderEnabled && (
                <Select value={newEvent.reminderTime} onValueChange={(value) => setNewEvent({...newEvent, reminderTime: parseInt(value)})}>
                  <SelectTrigger className="px-3 py-1 bg-slate-700/50 border-slate-600/50 text-white text-sm">
                    <SelectValue placeholder="Select Reminder Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {reminderTimes.map(time => (
                      <SelectItem key={time} value={time}>
                        {time < 60 ? `${time} min` : time < 1440 ? `${time / 60} hr` : `${time / 1440} day`} before
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={editingEvent ? updateEvent : addEvent}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Check className="w-4 h-4" />
                {editingEvent ? 'Update Event' : 'Add Event'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsAddingEvent(false)
                  setEditingEvent(null)
                }}
                className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Events List */}
        <div className="space-y-4">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
              <p className="text-slate-400">
                {searchTerm || filterCategory !== 'all' || filterPriority !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Add your first event to get started'}
              </p>
            </div>
          ) : (
            sortedEvents.map((event) => {
              const CategoryIcon = categoryIcons[event.category] || Calendar
              
              return (
                <Card
                  key={event.id}
                  className={`bg-gradient-to-r ${eventColors[event.color]} backdrop-blur-md border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer group`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 bg-${event.color}-500/20 rounded-lg`}>
                          <CategoryIcon className={`w-5 h-5 text-${event.color}-400`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-white group-hover:text-teal-200 transition-colors">
                              {event.title}
                            </h3>
                            {event.isRecurring && (
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                                Recurring
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(event.startTime)} - {formatTime(event.endTime)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(event.date, 'short')}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </div>
                            )}
                            {event.attendees.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                          
                          {event.description && (
                            <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs border ${priorityColors[event.priority]}`}>
                              {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[event.status]}`}>
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </span>
                            <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs">
                              {event.category}
                            </span>
                            {event.reminderEnabled && (
                              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs border border-yellow-500/30 flex items-center gap-1">
                                <Bell className="w-3 h-3" />
                                Reminder
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingEvent(event.id)
                          }}
                          className="hover:bg-slate-700/50"
                        >
                          <Edit3 className="w-4 h-4 text-slate-400 hover:text-teal-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteEvent(event.id)
                          }}
                          className="hover:bg-slate-700/50"
                        >
                          <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
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

      {/* Event Detail Modal */}
      <Dialog open={selectedEvent !== null} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`p-3 bg-${selectedEvent?.color}-500/20 rounded-xl`}>
                {selectedEvent && React.createElement(categoryIcons[selectedEvent.category] || Calendar, {
                  className: `w-6 h-6 text-${selectedEvent.color}-400`
                })}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedEvent?.title}</h2>
                <p className="text-slate-400">{selectedEvent?.category}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {selectedEvent?.description && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-slate-300 leading-relaxed">{selectedEvent.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-3">Event Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">{selectedEvent && formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">
                      {selectedEvent && formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent?.endTime)}
                    </span>
                  </div>
                  {selectedEvent?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-3">Status & Priority</h4>
                <div className="space-y-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm border ${selectedEvent && priorityColors[selectedEvent.priority]}`}>
                    {selectedEvent?.priority.charAt(0).toUpperCase() + selectedEvent?.priority.slice(1)} Priority
                  </span>
                  <br />
                  <span className={`inline-block px-3 py-1 rounded-full text-sm border ${selectedEvent && statusColors[selectedEvent.status]}`}>
                    {selectedEvent?.status.charAt(0).toUpperCase() + selectedEvent?.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            {selectedEvent?.attendees.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-3">Attendees ({selectedEvent.attendees.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.attendees.map((attendee, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30"
                    >
                      <Users className="w-3 h-3" />
                      {attendee}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-slate-600/50">
              <div className="flex items-center gap-4">
                {selectedEvent?.isRecurring && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Repeats {selectedEvent.recurringType}</span>
                  </div>
                )}
                {selectedEvent?.reminderEnabled && (
                  <div className="flex items-center gap-1">
                    <Bell className="w-4 h-4" />
                    <span>
                      Reminder {selectedEvent.reminderTime < 60 
                        ? `${selectedEvent.reminderTime} min` 
                        : selectedEvent.reminderTime < 1440 
                          ? `${selectedEvent.reminderTime / 60} hr` 
                          : `${selectedEvent.reminderTime / 1440} day`} before
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
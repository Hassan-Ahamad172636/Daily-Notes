"use client"

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Search, ArrowLeft, User, MessageCircle, Image, Mic, Plus } from 'lucide-react'

const mockMessages = [
  {
    id: 1,
    text: "Hey! How's your day going?",
    sender: "other",
    time: "10:30 AM",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: 2,
    text: "Pretty good! Just working on some new designs. What about you?",
    sender: "me",
    time: "10:32 AM"
  },
  {
    id: 3,
    text: "That sounds exciting! I'd love to see them when you're ready to share.",
    sender: "other",
    time: "10:33 AM",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: 4,
    text: "I'll send some screenshots in a bit. The color scheme is really coming together nicely.",
    sender: "me",
    time: "10:35 AM"
  },
  {
    id: 5,
    text: "Can't wait to see! Are you using that teal and dark theme we discussed?",
    sender: "other",
    time: "10:36 AM",
    avatar: "/placeholder.svg?height=40&width=40"
  }
]

const contacts = [
  { id: 1, name: "Alex Johnson", lastMessage: "Can't wait to see!", time: "10:36 AM", unread: 2, avatar: "/placeholder.svg?height=40&width=40", online: true },
  { id: 2, name: "Sarah Chen", lastMessage: "Thanks for the help!", time: "9:45 AM", unread: 0, avatar: "/placeholder.svg?height=40&width=40", online: true },
  { id: 3, name: "Mike Wilson", lastMessage: "See you tomorrow", time: "Yesterday", unread: 0, avatar: "/placeholder.svg?height=40&width=40", online: false },
  { id: 4, name: "Emma Davis", lastMessage: "Perfect! Let's do it", time: "Yesterday", unread: 1, avatar: "/placeholder.svg?height=40&width=40", online: true },
]

export default function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(mockMessages)
  const [selectedContact, setSelectedContact] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "me",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMessage])
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleContactSelect = (contact) => {
    setSelectedContact(contact)
    // Only hide sidebar on mobile screens (below sm breakpoint)
    if (window.innerWidth < 640) {
      setShowSidebar(false)
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 sm:w-72 h-40 sm:h-72 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 sm:w-72 h-40 sm:h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar - Contacts */}
      <div className={`
        ${showSidebar ? 'w-full sm:w-80' : 'w-0'} 
        transition-all duration-300 bg-slate-800/50 backdrop-blur-md border-r border-slate-700/50 
        flex flex-col relative z-10 sm:block
      `}>
        {showSidebar && (
          <>
            {/* Sidebar Header */}
            <div className="p-4 sm:p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Messages</h1>
                <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                  <Plus className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleContactSelect(contact)}
                  className={`p-3 sm:p-4 border-b border-slate-700/30 cursor-pointer transition-all hover:bg-slate-700/30 ${
                    selectedContact?.id === contact.id ? 'bg-teal-500/10 border-r-2 border-r-teal-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={contact.avatar || "/placeholder.svg"}
                        alt={contact.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                      />
                      {contact.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-slate-800 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium truncate text-sm sm:text-base">{contact.name}</h3>
                        <span className="text-xs text-slate-400">{contact.time}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1 sm:hidden">
                        <p className="text-sm text-slate-400 truncate">{contact.lastMessage}</p>
                        {contact.unread > 0 && (
                          <span className="bg-teal-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main Chat Area */}
      <div className={`
        flex-1 flex flex-col relative z-10
        ${selectedContact ? 'block' : 'hidden sm:block'}
      `}>
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-3 sm:p-4 bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors sm:hidden"
                >
                  <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedContact.avatar || "/placeholder.svg"}
                      alt={selectedContact.name}
                      className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover"
                    />
                    {selectedContact.online && (
                      <div className="absolute -bottom-1 -right-1 w-2 sm:w-3 h-2 sm:h-3 bg-green-500 border-2 border-slate-800 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-sm sm:text-base">{selectedContact.name}</h2>
                    <p className="text-xs text-slate-400">
                      {selectedContact.online ? 'Online' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                  <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
                </button>
                <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                  <Video className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
                </button>
                <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                  <MoreVertical className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[80%] sm:max-w-md ${msg.sender === 'me' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {msg.sender === 'other' && (
                      <img
                        src={msg.avatar || "/placeholder.svg"}
                        alt="Avatar"
                        className="w-6 sm:w-8 h-6 sm:h-8 rounded-full object-cover"
                      />
                    )}
                    
                    <div className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl backdrop-blur-md border transition-all hover:scale-[1.02] ${
                      msg.sender === 'me'
                        ? 'bg-gradient-to-r from-teal-500/80 to-teal-600/80 border-teal-400/30 text-white rounded-br-md'
                        : 'bg-slate-700/50 border-slate-600/30 text-white rounded-bl-md'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'me' ? 'text-teal-100' : 'text-slate-400'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-3 sm:p-4 bg-slate-800/50 backdrop-blur-md border-t border-slate-700/50">
              <div className="flex items-end space-x-2 sm:space-x-3">
                <button className="p-2 sm:p-3 hover:bg-slate-700/50 rounded-xl transition-colors">
                  <Paperclip className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows="1"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder:text-slate-400 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all resize-none text-sm sm:text-base"
                    style={{ minHeight: '40px', maxHeight: '100px' }}
                  />
                  
                  <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2">
                    <button className="p-1 hover:bg-slate-600/50 rounded-lg transition-colors">
                      <Smile className="w-3 sm:w-4 h-3 sm:h-4 text-slate-400" />
                    </button>
                    <button className="p-1 hover:bg-slate-600/50 rounded-lg transition-colors">
                      <Image className="w-3 sm:w-4 h-3 sm:h-4 text-slate-400" />
                    </button>
                    <button className="p-1 hover:bg-slate-600/50 rounded-lg transition-colors">
                      <Mic className="w-3 sm:w-4 h-3 sm:h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="p-2 sm:p-3 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-xl transition-all duration-200 group"
                >
                  <Send className="w-4 sm:w-5 h-4 sm:h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm sm:text-base">
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  )
}
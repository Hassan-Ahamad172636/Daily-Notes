"use client"

import { useState, useEffect } from "react"
import {Link} from "react-router-dom"
import { MessageCircle, Calendar, CheckSquare, BookOpen, Lightbulb, Clock, Heart, Landmark, DollarSign, ShoppingBasket } from 'lucide-react'

const bubbleItems = [
  {
    id: 1,
    icon: <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />,
    title: "Daily Chat",
    description: "Quick thoughts & conversations",
    color: "from-teal-400/30 to-teal-500/20",
    position: "center",
    link: "/chat"
  },
  {
    id: 2,
    icon: <Calendar className="w-5 h-5 md:w-7 md:h-7" />,
    title: "Schedule",
    description: "Today's appointments",
    color: "from-teal-300/30 to-cyan-400/20",
    position: "ring",
    link: "/schedule"
  },
  {
    id: 3,
    icon: <CheckSquare className="w-5 h-5 md:w-7 md:h-7" />,
    title: "Tasks",
    description: "Daily to-do items",
    color: "from-emerald-400/30 to-teal-400/20",
    position: "ring",
    link: "/task"
  },
  {
    id: 4,
    icon: <ShoppingBasket className="w-5 h-5 md:w-7 md:h-7" />,
    title: "Shoping",
    description: "Personal reflections",
    color: "from-teal-500/30 to-slate-400/20",
    position: "ring",
    link: "/shoping"
  },
  {
    id: 5,
    icon: <Lightbulb className="w-5 h-5 md:w-7 md:h-7" />,
    title: "Ideas",
    description: "Creative inspirations",
    color: "from-cyan-400/30 to-teal-300/20",
    position: "ring",
    link: "/ideas"
  },
  {
    id: 6,
    icon: <Landmark className="w-5 h-5 md:w-7 md:h-7" />,
    title: "Namaz",
    description: "Protect from bad habits.",
    color: "from-teal-400/30 to-emerald-400/20",
    position: "ring",
    link: "/namaz"
  },
  {
    id: 7,
    icon: <DollarSign className="w-5 h-5 md:w-7 md:h-7" />,
    title: "Income",
    description: "Salary Usage",
    color: "from-teal-300/30 to-teal-500/20",
    position: "ring",
    link: "/income"
  }
]

export default function BubbleHexagon() {
  const [hoveredBubble, setHoveredBubble] = useState(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [showBubbles, setShowBubbles] = useState(false)

  useEffect(() => {
    // Trigger all bubbles animation after center bubble
    const timer = setTimeout(() => {
      setShowBubbles(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Perfect hexagon positions - center + 6 surrounding
  const getHexPosition = (index) => {
    if (index === 0) return { x: 0, y: 0 } // Center bubble
    
    const angle = ((index - 1) * 60) * (Math.PI / 180)
    const radius = window.innerWidth < 768 ? 100 : 140

    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    }
  }

  const handleInteraction = (e, containerRef, itemId, bubblePos) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const containerCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }

    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0

    // Calculate tooltip position relative to bubble
    const bubbleX = containerCenter.x + bubblePos.x
    const bubbleY = containerCenter.y + bubblePos.y

    // Adjust tooltip position to appear above bubble with offset
    const tooltipX = bubbleX
    const tooltipY = bubbleY - (window.innerWidth < 768 ? 80 : 100)

    // Ensure tooltip stays within viewport
    const tooltipWidth = 180
    const tooltipHeight = 80
    const adjustedX = Math.max(10, Math.min(tooltipX, window.innerWidth - tooltipWidth - 10))
    const adjustedY = Math.max(10, Math.min(tooltipY, window.innerHeight - tooltipHeight - 10))

    setTooltipPosition({
      x: adjustedX,
      y: adjustedY
    })

    setHoveredBubble(itemId)
    setShowTooltip(true)
  }

  const handleInteractionEnd = () => {
    setShowTooltip(false)
    setHoveredBubble(null)
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-1 to-slate-900 flex flex-col items-center justify-center p-4 md:p-6">
      <style>
        {`
          @keyframes rotateCenter {
            0% { transform: rotate(0deg) scale(0.3); opacity: 0; }
            50% { transform: rotate(180deg) scale(1.1); opacity: 0.7; }
            100% { transform: rotate(360deg) scale(1); opacity: 1; }
          }
          @keyframes bubbleSpawn {
            0% { transform: translate(0, 0) scale(0.2); opacity: 0; }
            60% { transform: translate(var(--tx), var(--ty)) scale(1.15); opacity: 0.8; }
            100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 1; }
          }
          .animate-center {
            animation: rotateCenter 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .animate-spawn {
            animation: bubbleSpawn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `}
      </style>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 md:top-16 md:left-16 w-40 h-40 md:w-80 md:h-80 bg-teal-500/8 rounded-full blur-2xl md:blur-3xl"></div>
        <div className="absolute bottom-10 right-10 md:bottom-16 md:right-16 w-40 h-40 md:w-80 md:h-80 bg-cyan-500/8 rounded-full blur-2xl md:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 md:w-96 md:h-96 bg-teal-400/5 rounded-full blur-2xl md:blur-3xl"></div>
      </div>

      {/* Header section */}
      <div className="text-center mb-8 md:mb-12 z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-teal-500/20 rounded-full mb-4 md:mb-6">
          <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-teal-400" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
          Daily Notes
        </h1>
        <p className="text-slate-400 text-sm md:text-xl max-w-sm md:max-w-2xl mx-auto px-4">
          Your personal space for organizing daily activities
        </p>
      </div>

      {/* Hexagon bubble container */}
      <div 
        className="relative flex items-center justify-center z-10" 
        style={{ minHeight: '320px' }}
      >
        {/* Central glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 md:w-24 md:h-24 bg-teal-400/10 rounded-full blur-xl"></div>
        </div>

        {bubbleItems.map((item, index) => {
          const position = getHexPosition(index)
          const isHovered = hoveredBubble === item.id
          const isCenter = index === 0
          
          return (
            <Link
              key={item.id}
              to={item.link}
              className={`absolute cursor-pointer transition-all duration-300 ease-out group ${
                isCenter ? 'animate-center' : showBubbles ? 'animate-spawn' : 'opacity-0'
              }`}
              style={{
                transform: isCenter ? 'translate(0, 0)' : showBubbles ? `translate(${position.x}px, ${position.y}px)` : 'translate(0, 0)',
                '--tx': `${position.x}px`,
                '--ty': `${position.y}px`
              }}
              onMouseEnter={(e) => handleInteraction(e, { current: e.currentTarget.parentElement }, item.id, position)}
              onTouchStart={(e) => handleInteraction(e, { current: e.currentTarget.parentElement }, item.id, position)}
              onMouseLeave={handleInteractionEnd}
              onTouchEnd={handleInteractionEnd}
            >
              {/* Main bubble */}
              <div className={`
                relative rounded-full backdrop-blur-lg border transition-all duration-300 ease-out
                bg-gradient-to-br ${item.color}
                flex flex-col items-center justify-center
                shadow-2xl
                ${isCenter 
                  ? 'w-20 h-20 md:w-28 md:h-28 border-teal-400/30' 
                  : 'w-16 h-16 md:w-24 md:h-24 border-white/10'
                }
                ${isHovered 
                  ? 'scale-110 border-teal-400/60 shadow-teal-500/40 bg-gradient-to-br from-teal-400/50 to-teal-500/40' 
                  : 'hover:scale-105 hover:border-white/20'
                }
              `}>
                {/* Icon */}
                <div className={`transition-all duration-300 ${
                  isHovered ? 'text-teal-100 scale-110' : 'text-white'
                } ${isCenter ? 'mb-1 md:mb-2' : ''}`}>
                  {item.icon}
                </div>
                
                {/* Title - only show on larger bubbles */}
                <span className={`text-xs font-medium text-center px-1 transition-all duration-300 ${
                  isHovered ? 'text-white' : 'text-white/90'
                } ${isCenter ? 'block' : 'hidden md:block'}`}>
                  {item.title}
                </span>

                {/* Inner glow for center bubble */}
                {isCenter && (
                  <div className="absolute inset-1 md:inset-2 rounded-full bg-gradient-to-br from-teal-400/20 to-transparent pointer-events-none"></div>
                )}

                {/* Pulsing ring when hovered */}
                {isHovered && (
                  <div className="absolute inset-0 rounded-full border-2 border-teal-400/40 animate-ping"></div>
                )}
              </div>
            </Link>
          )
        })}

        {/* Floating tooltip */}
        {showTooltip && hoveredBubble && (
          <div 
            className="fixed z-50 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-200"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
          >
            <div className="bg-slate-800/95 backdrop-blur-md border border-teal-500/40 rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-2xl shadow-teal-500/20 min-w-[160px] sm:min-w-[180px] max-w-[220px] sm:max-w-[250px]">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="text-teal-400">
                  {bubbleItems.find(item => item.id === hoveredBubble)?.icon}
                </div>
                <p className="text-white text-xs sm:text-sm font-semibold">
                  {bubbleItems.find(item => item.id === hoveredBubble)?.title}
                </p>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {bubbleItems.find(item => item.id === hoveredBubble)?.description}
              </p>
            </div>
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800/95"></div>
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="text-center mt-8 md:mt-12 space-y-2 md:space-y-4 z-10">
        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs md:text-sm">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-teal-400/50 rounded-full"></div>
          <span>Tap or hover to explore</span>
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-teal-400/50 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
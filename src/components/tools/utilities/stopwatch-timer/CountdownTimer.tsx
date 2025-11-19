'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX,
  Clock,
  Zap
} from 'lucide-react'

type TimerMode = 'countdown' | 'stopwatch'
type TimerState = 'idle' | 'running' | 'paused' | 'finished'

export default function CountdownTimer() {
  const [mode, setMode] = useState<TimerMode>('countdown')
  const [state, setState] = useState<TimerState>('idle')
  const [time, setTime] = useState(300) // 5 minutes in seconds
  const [initialTime, setInitialTime] = useState(300)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showPresets, setShowPresets] = useState(true)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Predefined time presets (in seconds)
  const presets = [
    { label: '1 min', value: 60 },
    { label: '2 min', value: 120 },
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
    { label: '15 min', value: 900 },
    { label: '20 min', value: 1200 },
    { label: '30 min', value: 1800 },
    { label: '45 min', value: 2700 },
    { label: '1 hour', value: 3600 },
    { label: '1.5 hours', value: 5400 },
    { label: '2 hours', value: 7200 },
    { label: '3 hours', value: 10800 },
  ]

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/sounds/alarm.mp3') // You'll need to add this file to public/sounds/
    audioRef.current.volume = 0.7
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Format time as MM:SS or HH:MM:SS
  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Start timer
  const startTimer = useCallback(() => {
    if (state === 'running') return

    setState('running')
    
    timerRef.current = setInterval(() => {
      setTime(prev => {
        if (mode === 'countdown') {
          if (prev <= 1) {
            setState('finished')
            if (timerRef.current) clearInterval(timerRef.current)
            
            // Play sound if enabled
            if (soundEnabled && audioRef.current) {
              audioRef.current.play().catch(() => {
                // Ignore autoplay restrictions
              })
            }
            return 0
          }
          return prev - 1
        } else {
          // Stopwatch mode
          return prev + 1
        }
      })
    }, 1000)
  }, [state, mode, soundEnabled])

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setState('paused')
  }, [])

  // Reset timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setState('idle')
    setTime(mode === 'countdown' ? initialTime : 0)
    
    // Stop any playing alarm
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [mode, initialTime])

  // Set custom time
  const setCustomTime = useCallback((hours: number, minutes: number, seconds: number = 0) => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    setTime(totalSeconds)
    setInitialTime(totalSeconds)
    setState('idle')
  }, [])

  // Use preset time
  const usePreset = useCallback((seconds: number) => {
    setTime(seconds)
    setInitialTime(seconds)
    setState('idle')
    setShowPresets(false)
  }, [])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return

    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }, [isFullscreen])

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Time color based on remaining time (for countdown)
  const getTimeColor = () => {
    if (mode !== 'countdown') return 'text-gray-900'
    
    if (state === 'finished') return 'text-red-600'
    
    const percentage = (time / initialTime) * 100
    if (percentage <= 10) return 'text-red-500'
    if (percentage <= 25) return 'text-orange-500'
    if (percentage <= 50) return 'text-yellow-500'
    return 'text-emerald-600'
  }

  // Font size based on fullscreen
  const getTimeFontSize = () => {
    if (isFullscreen) return 'text-9xl'
    return 'text-7xl'
  }

  return (
    <div 
      ref={containerRef}
      className={`bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden ${
        isFullscreen ? 'w-full h-screen flex flex-col' : 'max-w-4xl mx-auto'
      }`}
    >
      {/* Header Controls */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mode Toggle */}
            <div className="flex bg-white/20 rounded-lg p-1">
              <button
                onClick={() => {
                  setMode('countdown')
                  resetTimer()
                }}
                className={`px-4 py-2 rounded-md transition-colors ${
                  mode === 'countdown' ? 'bg-white text-blue-600' : 'text-white/80 hover:text-white'
                }`}
              >
                Countdown
              </button>
              <button
                onClick={() => {
                  setMode('stopwatch')
                  resetTimer()
                }}
                className={`px-4 py-2 rounded-md transition-colors ${
                  mode === 'stopwatch' ? 'bg-white text-blue-600' : 'text-white/80 hover:text-white'
                }`}
              >
                Stopwatch
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              title={soundEnabled ? 'Mute sound' : 'Enable sound'}
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className={`flex-1 flex flex-col ${isFullscreen ? 'p-8' : 'p-8'}`}>
        {/* Time Display - Centered in fullscreen */}
        <div className={`flex-1 flex items-center justify-center ${isFullscreen ? 'mb-0' : 'mb-8'}`}>
          <div className={`font-mono font-bold ${getTimeColor()} ${getTimeFontSize()} select-none text-center`}>
            {formatTime(time)}
          </div>
        </div>

        {/* Progress Bar (Countdown only) */}
        {mode === 'countdown' && state !== 'idle' && (
          <div className={`max-w-md mx-auto ${isFullscreen ? 'mb-8' : 'mb-8'}`}>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-emerald-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${(time / initialTime) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Control Buttons - Positioned near bottom in fullscreen */}
        <div className={`flex justify-center space-x-4 ${isFullscreen ? 'mt-auto mb-16' : 'mb-8'}`}>
          {state === 'running' ? (
            <button
              onClick={pauseTimer}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center space-x-3 shadow-lg"
            >
              <Pause className="h-6 w-6" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={startTimer}
              disabled={mode === 'countdown' && time === 0}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center space-x-3 shadow-lg"
            >
              <Play className="h-6 w-6" />
              <span>{state === 'finished' ? 'Restart' : 'Start'}</span>
            </button>
          )}
          
          <button
            onClick={resetTimer}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center space-x-3 shadow-lg"
          >
            <RotateCcw className="h-6 w-6" />
            <span>Reset</span>
          </button>
        </div>

        {/* Quick Presets */}
        {!isFullscreen && showPresets && mode === 'countdown' && (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => usePreset(preset.value)}
                  className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-3 py-3 rounded-lg font-medium transition-colors text-sm"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Time Input */}
        {!isFullscreen && mode === 'countdown' && (
          <div className="max-w-md mx-auto mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Time</h3>
            <div className="flex space-x-4 justify-center">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="23"
                  placeholder="0"
                  className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center"
                  onChange={(e) => {
                    const hours = parseInt(e.target.value) || 0
                    const minutes = Math.floor((time % 3600) / 60)
                    const seconds = time % 60
                    setCustomTime(hours, minutes, seconds)
                  }}
                />
                <span className="text-gray-600 text-sm">hr</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="0"
                  className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center"
                  onChange={(e) => {
                    const minutes = parseInt(e.target.value) || 0
                    const hours = Math.floor(time / 3600)
                    const seconds = time % 60
                    setCustomTime(hours, minutes, seconds)
                  }}
                />
                <span className="text-gray-600 text-sm">min</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="0"
                  className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center"
                  onChange={(e) => {
                    const seconds = parseInt(e.target.value) || 0
                    const hours = Math.floor(time / 3600)
                    const minutes = Math.floor((time % 3600) / 60)
                    setCustomTime(hours, minutes, seconds)
                  }}
                />
                <span className="text-gray-600 text-sm">sec</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center">
              Set hours, minutes, and seconds for precise timing
            </div>
          </div>
        )}

        {/* Full Screen Instructions */}
        {isFullscreen && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
            Press ESC to exit fullscreen
          </div>
        )}
      </div>

      {/* Status Bar */}
      {!isFullscreen && (
        <div className="bg-gray-50 border-t border-gray-200 p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  state === 'running' ? 'bg-green-500 animate-pulse' : 
                  state === 'paused' ? 'bg-yellow-500' : 
                  state === 'finished' ? 'bg-red-500' : 'bg-gray-400'
                }`}></div>
                <span>
                  {state === 'running' ? 'Running' : 
                   state === 'paused' ? 'Paused' : 
                   state === 'finished' ? 'Finished' : 'Ready'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span>Sound {soundEnabled ? 'On' : 'Off'}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono">{formatTime(time)}</div>
              <div className="text-xs text-gray-500">
                {mode === 'countdown' ? 'Countdown' : 'Stopwatch'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
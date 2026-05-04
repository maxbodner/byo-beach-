import { useState, useEffect, useRef } from 'react'
import LandingScreen from './components/LandingScreen'
import MapScreen from './components/MapScreen'
import { fetchPinCount } from './lib/supabase'
import { track } from './lib/analytics'

export default function App() {
  const [stage, setStage] = useState('landing') // 'landing' | 'transitioning' | 'map'
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [pinCount, setPinCount] = useState(0)
  const audioRef = useRef(null)

  // Initial pin count fetch
  useEffect(() => {
    fetchPinCount().then(setPinCount)
  }, [])

  // Restore mute state from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('byo-muted')
    if (stored === 'true') setIsMuted(true)
  }, [])

  // Apply mute state to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
    sessionStorage.setItem('byo-muted', String(isMuted))
  }, [isMuted])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => {
      // Loop the track
      audio.currentTime = 0
      audio.play().catch(() => {})
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const handlePlay = async () => {
    track('song_play')
    if (audioRef.current) {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (err) {
        console.error('Play failed:', err)
      }
    }
    // Trigger transition to map
    setStage('transitioning')
    setTimeout(() => setStage('map'), 400)
  }

  const handleTogglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      track('song_pause')
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
      track('song_play')
    }
  }

  const handleToggleMute = () => {
    setIsMuted(prev => {
      track(prev ? 'song_unmute' : 'song_mute')
      return !prev
    })
  }

  const handlePinAdded = () => {
    setPinCount(prev => prev + 1)
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-navy">
      {/* Audio element persists across screens */}
      <audio
        ref={audioRef}
        src="/audio/byo-beach.mp3"
        preload="auto"
        playsInline
      />

      {stage !== 'map' && (
        <div className={stage === 'transitioning' ? 'animate-fade-out' : ''}>
          <LandingScreen
            onPlay={handlePlay}
            pinCount={pinCount}
          />
        </div>
      )}

      {stage === 'map' && (
        <div className="animate-fade-in h-full">
          <MapScreen
            isPlaying={isPlaying}
            isMuted={isMuted}
            currentTime={currentTime}
            duration={duration}
            pinCount={pinCount}
            onTogglePlay={handleTogglePlay}
            onToggleMute={handleToggleMute}
            onPinAdded={handlePinAdded}
          />
        </div>
      )}
    </div>
  )
}

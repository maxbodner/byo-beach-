import { useState, useEffect } from 'react'
import PlayerBar from './PlayerBar'
import PinMap from './PinMap'
import PinModal from './PinModal'
import SuccessToast from './SuccessToast'
import { fetchApprovedPins, submitPin } from '../lib/supabase'
import { track } from '../lib/analytics'

export default function MapScreen({
  isPlaying,
  isMuted,
  currentTime,
  duration,
  pinCount,
  onTogglePlay,
  onToggleMute,
  onPinAdded,
}) {
  const [pins, setPins] = useState([])
  const [pendingLocation, setPendingLocation] = useState(null) // {lat, lng}
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchApprovedPins().then(setPins)
  }, [])

  const handleMapClick = (latlng) => {
    track('map_click', { lat: latlng.lat, lng: latlng.lng })
    setPendingLocation({ lat: latlng.lat, lng: latlng.lng })
  }

  const handleSubmit = async (formData) => {
    if (!pendingLocation || submitting) return
    setSubmitting(true)
    try {
      const newPin = await submitPin({
        ...pendingLocation,
        ...formData,
      })
      track('pin_submit', { state: formData.state })

      // Optimistically add pin (assumes auto-approval; remove if using moderation queue)
      if (newPin) {
        setPins(prev => [
          {
            id: newPin.id,
            lat: newPin.lat,
            lng: newPin.lng,
            first_name: newPin.first_name,
            beach_name: newPin.beach_name,
            state: newPin.state,
            note: newPin.note,
          },
          ...prev,
        ])
      }
      onPinAdded()
      setPendingLocation(null)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3500)
    } catch (err) {
      track('pin_submit_error', { message: err.message })
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setPendingLocation(null)
  }

  return (
    <div className="flex flex-col h-full">
      <PlayerBar
        isPlaying={isPlaying}
        isMuted={isMuted}
        currentTime={currentTime}
        duration={duration}
        onTogglePlay={onTogglePlay}
        onToggleMute={onToggleMute}
      />

      {/* Stats bar */}
      <div className="bg-stats-bg border-b border-black/5 py-2.5 px-4 text-center text-xs sm:text-sm text-stats-text flex items-center justify-center gap-2">
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" className="flex-shrink-0">
          <path d="M7 0C3.13 0 0 3.13 0 7C0 12.25 7 18 7 18S14 12.25 14 7C14 3.13 10.87 0 7 0Z" fill="#854F0B" />
          <circle cx="7" cy="7" r="2.5" fill="#FAEEDA" />
        </svg>
        <span>
          <strong className="font-semibold">{pinCount.toLocaleString()}</strong>
          <span className="hidden sm:inline"> sunshine states of mind · click the map to add yours</span>
          <span className="sm:hidden"> pins · tap the map</span>
        </span>
      </div>

      {/* Map fills remaining height */}
      <div className="flex-1 relative">
        <PinMap
          pins={pins}
          pendingLocation={pendingLocation}
          onMapClick={handleMapClick}
        />
      </div>

      {pendingLocation && (
        <PinModal
          location={pendingLocation}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitting={submitting}
        />
      )}

      {showSuccess && <SuccessToast />}
    </div>
  )
}

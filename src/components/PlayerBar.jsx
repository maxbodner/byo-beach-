function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function PlayerBar({
  isPlaying,
  isMuted,
  currentTime,
  duration,
  onTogglePlay,
  onToggleMute,
}) {
  return (
    <div className="bg-navy text-white px-4 py-2.5 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Equalizer animation */}
        <div className="flex items-end gap-[3px] h-4 flex-shrink-0">
          {isPlaying ? (
            <>
              <div className="eq-bar animate-eq-1" />
              <div className="eq-bar animate-eq-2" />
              <div className="eq-bar animate-eq-3" />
              <div className="eq-bar animate-eq-4" />
            </>
          ) : (
            <>
              <div className="eq-bar h-[40%]" />
              <div className="eq-bar h-[40%]" />
              <div className="eq-bar h-[40%]" />
              <div className="eq-bar h-[40%]" />
            </>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium leading-tight truncate">BYO Beach</p>
          <p className="text-[11px] text-white/70 leading-tight truncate">
            Brian Kelley · {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Play/Pause */}
        <button
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="3" height="10" fill="white" />
              <rect x="9" y="2" width="3" height="10" fill="white" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 1L13 7L2 13V1Z" fill="white" />
            </svg>
          )}
        </button>

        {/* Mute */}
        <button
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          {isMuted ? (
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
              <path d="M9 0L5 4H2C0.9 4 0 4.9 0 6V8C0 9.1 0.9 10 2 10H5L9 14V0Z" fill="white" />
              <line x1="11" y1="4" x2="15" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="15" y1="4" x2="11" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
              <path d="M9 0L5 4H2C0.9 4 0 4.9 0 6V8C0 9.1 0.9 10 2 10H5L9 14V0Z" fill="white" />
              <path d="M11 4C12 5 12 9 11 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M13 2C15 4 15 10 13 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

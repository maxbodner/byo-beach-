export default function LandingScreen({ onPlay, pinCount }) {
  const formattedCount = pinCount > 0 ? pinCount.toLocaleString() : null

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #B5D4F4 0%, #85B7EB 40%, #FAC775 75%, #F5C4B3 100%)'
      }}
    >
      {/* Sun */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: '15%',
          width: '140px',
          height: '140px',
          background: '#FAC775',
          opacity: 0.85,
          filter: 'blur(0.5px)'
        }}
      />

      {/* Subtle US silhouette behind content */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.08 }}
      >
        <path
          d="M 60 320 L 90 300 L 140 295 L 200 285 L 260 280 L 320 278 L 380 282 L 430 288 L 470 300 L 510 315 L 540 340 L 545 370 L 530 395 L 510 410 L 480 425 L 440 435 L 400 445 L 360 450 L 320 452 L 280 450 L 240 445 L 200 435 L 165 425 L 130 410 L 100 390 L 75 365 L 60 340 Z"
          fill="#042C53"
        />
      </svg>

      {/* Content stack */}
      <div className="relative z-10 max-w-md flex flex-col items-center">
        <p
          className="text-xs font-medium tracking-[0.2em] text-white mb-3"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
        >
          BRIAN KELLEY · NEW SINGLE
        </p>

        <h1
          className="font-serif text-5xl sm:text-6xl font-medium text-white mb-3"
          style={{
            textShadow: '0 2px 6px rgba(0,0,0,0.25)',
            letterSpacing: '-0.02em'
          }}
        >
          BYO Beach
        </h1>

        <p
          className="text-base sm:text-lg text-white mb-8 leading-snug"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
        >
          What spot gets you in your<br />sunshine state of mind?
        </p>

        {/* Big play button */}
        <button
          onClick={onPlay}
          aria-label="Play BYO Beach"
          className="group w-24 h-24 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          style={{
            boxShadow: '0 10px 30px rgba(4, 44, 83, 0.3)'
          }}
        >
          <svg
            width="32"
            height="36"
            viewBox="0 0 32 36"
            fill="none"
            className="ml-1"
          >
            <path d="M0 0L32 18L0 36V0Z" fill="#042C53" />
          </svg>
        </button>

        <p
          className="text-sm font-medium text-white mt-5"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
        >
          Press play, then drop your pin
        </p>

        {formattedCount && (
          <p
            className="text-xs text-white/85 mt-1"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
          >
            {formattedCount} fans have already shared theirs
          </p>
        )}
      </div>
    </div>
  )
}

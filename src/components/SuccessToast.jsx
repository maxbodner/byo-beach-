export default function SuccessToast({ onDismiss }) {
  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onClick={onDismiss}
    >
      <div
        className="bg-white rounded-2xl px-8 py-8 mx-6 flex flex-col items-center gap-4 animate-fade-in text-center"
        style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.2)', maxWidth: 360 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
          <svg width="20" height="16" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-navy leading-snug">
          Thanks for sharing your sunshine state of mind!
        </p>
        <div className="flex flex-col gap-2 w-full mt-1">
          <a
            href="https://onerpm.link/662234195146"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-2.5 rounded-full bg-navy text-white text-sm font-medium text-center hover:opacity-90 transition-opacity"
          >
            Listen to "BYO Beach"
          </a>
          <a
            href="https://www.youtube.com/watch?v=MLd0WuGMCSQ&list=RDMLd0WuGMCSQ&start_radio=1"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-6 py-2.5 rounded-full border border-navy text-navy text-sm font-medium text-center hover:bg-navy/5 transition-colors"
          >
            Watch the Music Video
          </a>
        </div>
        <button
          onClick={onDismiss}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}

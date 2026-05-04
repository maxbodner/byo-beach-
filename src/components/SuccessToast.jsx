export default function SuccessToast() {
  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-white rounded-full px-5 py-2.5 flex items-center gap-2 animate-fade-in"
      style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
    >
      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="text-sm font-medium text-navy">Pin dropped! Welcome to BYO Beach 🌅</p>
    </div>
  )
}

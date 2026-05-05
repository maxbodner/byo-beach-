import { useState, useEffect, useRef } from 'react'

export default function PinModal({ location, onSubmit, onCancel, submitting }) {
  const [firstName, setFirstName] = useState('')
  const [beachName, setBeachName] = useState('')
  const [country, setCountry] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({})
  const firstNameRef = useRef(null)

  useEffect(() => {
    // Auto-focus the first field
    setTimeout(() => firstNameRef.current?.focus(), 100)

    // Lock body scroll
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Close on escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && !submitting) onCancel()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCancel, submitting])

  const validate = () => {
    const errs = {}
    if (!firstName.trim()) errs.firstName = 'Required'
    else if (firstName.length > 30) errs.firstName = 'Max 30 characters'

    if (!beachName.trim()) errs.beachName = 'Required'
    else if (beachName.length > 60) errs.beachName = 'Max 60 characters'

    if (!country.trim()) errs.country = 'Required'
    else if (country.length > 60) errs.country = 'Max 60 characters'

    if (note.length > 200) errs.note = 'Max 200 characters'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ firstName, beachName, country, note })
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(4, 44, 83, 0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onCancel()
      }}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto modal-scroll"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#FAECE7' }}>
            <svg width="12" height="16" viewBox="0 0 14 18" fill="none">
              <path d="M7 0C3.13 0 0 3.13 0 7C0 12.25 7 18 7 18S14 12.25 14 7C14 3.13 10.87 0 7 0Z" fill="#D85A30" />
              <circle cx="7" cy="7" r="2.5" fill="white" />
            </svg>
          </div>
          <h2 className="text-base sm:text-lg font-medium text-navy">Drop your pin here?</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* First name */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              First name
            </label>
            <input
              ref={firstNameRef}
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value.slice(0, 30))}
              maxLength={30}
              placeholder="Sarah"
              disabled={submitting}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 ${
                errors.firstName ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
          </div>

          {/* Beach + country row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">
                Happy place
              </label>
              <input
                type="text"
                value={beachName}
                onChange={(e) => setBeachName(e.target.value.slice(0, 60).replace(/(?:^|\s)\S/g, c => c.toUpperCase()))}
                maxLength={60}
                placeholder="Siesta Key"
                disabled={submitting}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 ${
                  errors.beachName ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.beachName && <p className="text-xs text-red-500 mt-1">{errors.beachName}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                State/Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value.slice(0, 60))}
                maxLength={60}
                placeholder="USA"
                disabled={submitting}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 ${
                  errors.country ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Why this spot? <span className="text-gray-400">(optional, {200 - note.length} left)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 200))}
              maxLength={200}
              placeholder="My grandparents took me here every summer..."
              disabled={submitting}
              rows={2}
              className={`w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-navy/30 ${
                errors.note ? 'border-red-400' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-navy text-white py-3 rounded-lg text-sm font-medium hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Dropping pin...' : 'Drop my pin'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="w-full text-gray-500 text-xs py-1 hover:text-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

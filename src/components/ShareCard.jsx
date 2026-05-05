import { useEffect, useState } from 'react'

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(' ')
  let line = ''
  let currentY = y
  let drawn = 0

  for (const word of words) {
    if (drawn >= maxLines) break
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxWidth && line !== '') {
      ctx.fillText(line.trim(), x, currentY)
      line = word + ' '
      currentY += lineHeight
      drawn++
    } else {
      line = test
    }
  }
  if (line.trim() && drawn < maxLines) {
    ctx.fillText(line.trim(), x, currentY)
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

async function buildCanvas(firstName, beachName, country, note) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920
  const ctx = canvas.getContext('2d')

  // Load background via fetch to avoid CORS cache issues
  const resp = await fetch('/IMG_4828.jpg')
  const blob = await resp.blob()
  const objUrl = URL.createObjectURL(blob)
  const img = new Image()
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = objUrl })
  URL.revokeObjectURL(objUrl)

  // Cover-fit the landscape photo into portrait canvas
  const scale = Math.max(1080 / img.width, 1920 / img.height)
  const dw = img.width * scale
  const dh = img.height * scale
  ctx.drawImage(img, (1080 - dw) / 2, (1920 - dh) / 2, dw, dh)

  // Dark overlay
  ctx.fillStyle = 'rgba(0,0,0,0.48)'
  ctx.fillRect(0, 0, 1080, 1920)

  // Bottom navy gradient
  const grad = ctx.createLinearGradient(0, 1480, 0, 1920)
  grad.addColorStop(0, 'rgba(4,44,83,0)')
  grad.addColorStop(1, 'rgba(4,44,83,0.8)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 1480, 1080, 440)

  await document.fonts.ready
  ctx.textAlign = 'center'

  // Title
  ctx.font = 'italic bold 112px "Playfair Display", Georgia, serif'
  ctx.fillStyle = 'white'
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 14
  ctx.fillText('B·Y·O Beach', 540, 310)

  // Artist line
  ctx.font = '400 44px "Inter", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.shadowBlur = 6
  ctx.fillText('BRIAN KELLEY & NIKO MOON', 540, 390)
  ctx.shadowBlur = 0
  ctx.shadowColor = 'transparent'

  // Frosted glass card
  ctx.fillStyle = 'rgba(255,255,255,0.13)'
  roundRect(ctx, 80, 720, 920, 580, 32)
  ctx.fill()

  // Name
  ctx.font = 'bold 80px "Inter", sans-serif'
  ctx.fillStyle = 'white'
  ctx.fillText(firstName, 540, 850)

  // Beach + country
  ctx.font = '500 52px "Inter", sans-serif'
  ctx.fillStyle = '#FAC775'
  const locationLine = country ? `${beachName}, ${country}` : beachName
  ctx.fillText(locationLine, 540, 942)

  // Divider
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(200, 988)
  ctx.lineTo(880, 988)
  ctx.stroke()

  // Note
  if (note) {
    ctx.font = 'italic 400 42px "Inter", sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    wrapText(ctx, `"${note}"`, 540, 1060, 860, 58, 4)
  }

  // Footer CTA
  ctx.font = '500 46px "Inter", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.fillText('Add your spot at', 540, 1390)
  ctx.fillText('officialbriankelley.com/byobeach', 540, 1448)

  return canvas.toDataURL('image/jpeg', 0.92)
}

export default function ShareCard({ firstName, beachName, country, note, onClose }) {
  const [imageUrl, setImageUrl] = useState(null)
  const [generating, setGenerating] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    buildCanvas(firstName, beachName, country, note)
      .then(setImageUrl)
      .catch(err => {
        console.error('ShareCard generation failed:', err)
        setErrorMsg('Could not generate graphic.')
      })
      .finally(() => setGenerating(false))
  }, [])

  const triggerDownload = () => {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = 'byo-beach.jpg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleShareToInstagram = async () => {
    if (!imageUrl) return
    const resp = await fetch(imageUrl)
    const blob = await resp.blob()
    const file = new File([blob], 'byo-beach.jpg', { type: 'image/jpeg' })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'BYO Beach' })
        return
      } catch (err) {
        if (err.name === 'AbortError') return
      }
    }
    // Desktop fallback: download
    triggerDownload()
  }

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl mx-4 flex flex-col items-center overflow-hidden animate-fade-in"
        style={{ maxWidth: 360, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Preview */}
        <div
          className="w-full flex items-center justify-center"
          style={{ height: 260, background: '#042C53' }}
        >
          {generating && (
            <p className="text-white text-sm" style={{ opacity: 0.6 }}>Building your graphic…</p>
          )}
          {errorMsg && (
            <p className="text-white text-sm px-6 text-center" style={{ opacity: 0.7 }}>{errorMsg}</p>
          )}
          {imageUrl && (
            <img src={imageUrl} alt="Your BYO Beach story card" className="h-full w-auto" />
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 w-full px-5 py-5">
          <p className="text-center text-xs text-gray-400 mb-0.5">
            Your story graphic is ready to share
          </p>
          <button
            onClick={handleShareToInstagram}
            disabled={!imageUrl}
            className="w-full py-3 rounded-full text-white text-sm font-medium disabled:opacity-40 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)' }}
          >
            Share
          </button>
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}

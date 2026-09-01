import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'

export default function CameraPage() {
  const navigate  = useNavigate()
  const inputRef  = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const MAX = 1200
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) {
          height = Math.round(height * MAX / width)
          width  = MAX
        } else {
          width  = Math.round(width * MAX / height)
          height = MAX
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.80)
      URL.revokeObjectURL(url)
      navigate('/preview', { state: { photo: dataUrl } })
    }
    img.src = url
  }

  return (
    <div className="fixed inset-0 bg-black" style={{ zIndex: 50 }}>
      {/* 隠しファイル入力 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 上部コントロール */}
      <div
        className="absolute left-0 right-0 flex items-center px-5"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 44px) + 12px)' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 flex items-center justify-center"
          aria-label="閉じる"
        >
          <X size={28} color="white" strokeWidth={2} />
        </button>
      </div>

      {/* 中央ヒント */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className="text-white/40 text-sm tracking-wide">シャッターをタップして撮影</p>
      </div>

      {/* 下部コントロールバー */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-black flex items-center justify-center"
        style={{
          height:        'calc(116px + env(safe-area-inset-bottom, 0px))',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <button
          onClick={() => inputRef.current?.click()}
          className="w-[74px] h-[74px] rounded-full border-[3px] border-white flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
          aria-label="撮影"
        >
          <div className="w-[60px] h-[60px] bg-white rounded-full" />
        </button>
      </div>
    </div>
  )
}

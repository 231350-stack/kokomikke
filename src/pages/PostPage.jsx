import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Lock, Users, Globe, Plus, X } from 'lucide-react'

const TAGS = ['自然', '散歩道', '景色']

const PRIVACY_OPTIONS = [
  { id: 'private',   label: '自分だけ', Icon: Lock },
  { id: 'followers', label: 'フォロワー', Icon: Users },
  { id: 'public',    label: 'みんな',    Icon: Globe },
]

/* Canvas でリサイズ・圧縮して dataURL を返す */
function compressImage(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const MAX = 1200
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX }
        else                { width  = Math.round(width  * MAX / height); height = MAX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.80))
    }
    img.src = url
  })
}

export default function PostPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const initialPhoto = state?.photo

  const [photos, setPhotos]             = useState(initialPhoto ? [initialPhoto] : [])
  const [comment, setComment]           = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [privacy, setPrivacy]           = useState('private')

  const addInputRef = useRef(null)

  const toggleTag = (tag) =>
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )

  const handleAddFile = async (e) => {
    const files = Array.from(e.target.files)
    for (const file of files) {
      const dataUrl = await compressImage(file)
      setPhotos(prev => [...prev, dataUrl])
    }
    e.target.value = ''
  }

  const removePhoto = (idx) =>
    setPhotos(prev => prev.filter((_, i) => i !== idx))

  const handleSave = () =>
    navigate('/saved', { state: { photos, comment, selectedTags, privacy } })

  return (
    <div className="flex flex-col min-h-dvh">
      {/* 戻るボタン */}
      <div
        className="px-3 pb-2"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 44px) + 10px)' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center"
          aria-label="戻る"
        >
          <ChevronLeft size={22} strokeWidth={2} className="text-gray-600" />
        </button>
      </div>

      {/* スクロールコンテンツ */}
      <div className="flex-1 overflow-y-auto px-5">

        {/* ── 写真（横スクロール）── */}
        <div className="mb-6">
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>

            {/* サムネイル一覧 */}
            {photos.map((p, i) => (
              <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
                {/* 1枚目バッジ */}
                {i === 0 && photos.length > 1 && (
                  <div style={{
                    position: 'absolute', top: '5px', left: '5px', zIndex: 2,
                    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: '4px',
                    padding: '1px 5px', fontSize: '9px', color: '#fff', fontWeight: 600,
                  }}>
                    代表
                  </div>
                )}
                <div style={{
                  width: '90px', height: '90px',
                  borderRadius: '14px', overflow: 'hidden', background: '#e0e0e0',
                }}>
                  <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {/* 削除ボタン */}
                <button
                  onClick={() => removePhoto(i)}
                  aria-label="削除"
                  style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    width: '22px', height: '22px', borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.62)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={11} strokeWidth={3} color="white" />
                </button>
              </div>
            ))}

            {/* 写真を追加ボタン */}
            <button
              onClick={() => addInputRef.current?.click()}
              aria-label="写真を追加"
              style={{
                flexShrink: 0, width: '90px', height: '90px', borderRadius: '14px',
                border: '2px dashed #ccc', backgroundColor: '#f5f3ef',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '4px', cursor: 'pointer',
              }}
            >
              <Plus size={22} strokeWidth={1.5} color="#bbb" />
              <span style={{ fontSize: '11px', color: '#bbb' }}>追加</span>
            </button>
          </div>

          {/* 隠しファイル入力（multiple、カメラ＋ライブラリ両対応） */}
          <input
            ref={addInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleAddFile}
          />
        </div>

        {/* コメント入力 */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="一言コメントを入力"
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="w-full px-4 py-4 bg-white rounded-2xl text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
        </div>

        {/* タグを選ぶ */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-3">タグを選ぶ</p>
          <div className="flex gap-2 items-center flex-wrap">
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-5 py-2 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag) ? 'bg-sage-400 text-white' : 'text-gray-700'
                }`}
                style={selectedTags.includes(tag) ? {} : { backgroundColor: '#dedad3' }}
              >
                {tag}
              </button>
            ))}
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 text-lg leading-none"
              style={{ backgroundColor: '#dedad3' }}
              aria-label="タグを追加"
            >
              +
            </button>
          </div>
        </div>

        {/* 公開範囲 */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-3">公開範囲</p>
          <div className="flex gap-2">
            {PRIVACY_OPTIONS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setPrivacy(id)}
                className={`flex-1 flex flex-col items-center justify-center gap-2 py-5 rounded-xl transition-colors ${
                  privacy === id ? 'bg-sage-400 text-white' : 'bg-white text-gray-500'
                }`}
              >
                <Icon size={24} strokeWidth={1.5} />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 保存するボタン */}
      <div
        className="px-5 py-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        <button
          onClick={handleSave}
          disabled={photos.length === 0}
          className="w-full py-4 bg-sage-400 text-white rounded-full text-base font-medium disabled:opacity-40"
        >
          保存する
        </button>
      </div>
    </div>
  )
}

import { useNavigate, useLocation } from 'react-router-dom'

export default function PreviewPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const photo = state?.photo

  return (
    <div className="fixed inset-0 bg-black flex flex-col" style={{ zIndex: 50 }}>
      {/* 写真プレビュー */}
      {photo ? (
        <img
          src={photo}
          alt="撮影した写真"
          className="flex-1 w-full object-cover"
        />
      ) : (
        <div className="flex-1 bg-neutral-900" />
      )}

      {/* 下部ボタン */}
      <div
        className="bg-black px-6 pt-5"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
      >
        <button
          onClick={() => navigate('/camera')}
          className="w-full py-4 bg-white/10 text-white rounded-full text-base font-medium mb-3"
        >
          撮り直す
        </button>
        <button
          onClick={() => navigate('/post', { state: { photo } })}
          className="w-full py-4 rounded-full text-base font-medium text-white"
          style={{ backgroundColor: '#7a9e7e' }}
        >
          記録する
        </button>
      </div>
    </div>
  )
}

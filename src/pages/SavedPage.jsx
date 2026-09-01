import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { savePost } from '../utils/storage'

export default function SavedPage() {
  const navigate   = useNavigate()
  const { state }  = useLocation()
  const savedRef   = useRef(false)

  useEffect(() => {
    if (savedRef.current) return
    savedRef.current = true
    const photos = state?.photos?.length
      ? state.photos
      : (state?.photo ? [state.photo] : [])
    if (photos.length > 0) {
      savePost({
        photos,
        comment: state?.comment     ?? '',
        tags:    state?.selectedTags ?? [],
        privacy: state?.privacy     ?? 'private',
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col min-h-dvh">
      {/* メインコンテンツ（上下中央寄せ） */}
      <div className="flex-1 flex flex-col items-center justify-center gap-7 px-8">

        {/* 葉っぱアイコン + スパークル */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: '210px', height: '210px' }}
        >
          {/* 背景サークル */}
          <div
            className="rounded-full flex-shrink-0"
            style={{ width: '150px', height: '150px', backgroundColor: '#e4ede5' }}
          />

          {/* 葉っぱアイコン（中央） */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf size={52} strokeWidth={1.5} className="text-sage-400" />
          </div>

          {/* スパークル ✦（4箇所） */}
          <span
            className="absolute select-none text-sage-300"
            style={{ top: '20px', right: '16px', fontSize: '20px', lineHeight: 1 }}
          >
            ✦
          </span>
          <span
            className="absolute select-none text-sage-300"
            style={{ top: '52px', right: '2px', fontSize: '12px', lineHeight: 1 }}
          >
            ✦
          </span>
          <span
            className="absolute select-none text-sage-300"
            style={{ bottom: '28px', left: '10px', fontSize: '16px', lineHeight: 1 }}
          >
            ✦
          </span>
          <span
            className="absolute select-none text-sage-300"
            style={{ bottom: '12px', left: '48px', fontSize: '10px', lineHeight: 1 }}
          >
            ✦
          </span>
        </div>

        {/* テキスト */}
        <div className="text-center">
          <h1 className="text-[26px] font-medium text-gray-800 mb-2 tracking-tight">
            保存しました
          </h1>
          <p className="text-sm text-gray-500 leading-6">
            あなたの地図に<br />
            新しい発見が加わりました
          </p>
        </div>
      </div>

      {/* ボタン群 */}
      <div
        className="px-5 py-4 flex flex-col gap-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        <button
          onClick={() => navigate('/encyclopedia')}
          className="w-full py-4 bg-sage-400 text-white rounded-full text-base font-medium"
        >
          図鑑を開く
        </button>
        <button
          onClick={() => navigate('/home')}
          className="w-full py-4 rounded-full text-base font-medium text-gray-500"
          style={{ backgroundColor: '#ede9e0' }}
        >
          地図で見る
        </button>
      </div>
    </div>
  )
}

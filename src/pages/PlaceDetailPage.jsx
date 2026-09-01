import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Heart, Bookmark, Trash2 } from 'lucide-react'
import { isLiked, toggleLike, deletePost } from '../utils/storage'

export default function PlaceDetailPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const result = state?.result

  /* ── いいね・ブックマーク・削除確認 ── */
  const [liked,          setLiked]         = useState(() => isLiked(result?.id))
  const [bookmarked,     setBookmarked]    = useState(false)
  const [confirmDelete,  setConfirmDelete] = useState(false)

  const handleDelete = () => {
    deletePost(result.id)
    navigate(-1)
  }

  const baseCount = result?.likes ?? 32
  const likeCount = liked ? baseCount + 1 : baseCount

  const tags    = result?.tags    ?? ['海', '坂道', '絶景']
  const comment = result?.comment ?? 'ふと振り返ると、海がきらっと見える坂道。風が気持ちよくて、つい深呼吸したくなる場所でした。'
  const photoBg = result?.bg ?? 'linear-gradient(170deg,#c8d8e2 0%,#9abfce 28%,#6a9fb8 55%,#7aafca 80%,#8dc0d2 100%)'

  /* ── 写真カルーセル ── */
  const photos = result?.photos?.length
    ? result.photos
    : (result?.photo ? [result.photo] : [])
  const [photoIdx, setPhotoIdx] = useState(0)
  const touchStartX = useRef(null)

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta < -40) setPhotoIdx(i => Math.min(photos.length - 1, i + 1))
    if (delta > 40)  setPhotoIdx(i => Math.max(0, i - 1))
    touchStartX.current = null
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: '100dvh' }}
    >
      {/* ── 写真カルーセル ── */}
      <div
        className="absolute inset-x-0 top-0"
        style={{ height: '46%', background: photoBg, overflow: 'hidden' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {photos.map((p, i) => (
          <div
            key={i}
            style={{
              position:   'absolute',
              inset:      0,
              transform:  `translateX(${(i - photoIdx) * 100}%)`,
              transition: 'transform 0.32s ease',
            }}
          >
            {p && (
              <img
                src={p}
                alt={result?.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
        ))}

        {/* インジケーター（複数枚のとき） */}
        {photos.length > 1 && (
          <div style={{
            position:       'absolute',
            bottom:         '14px',
            left:           0,
            right:          0,
            display:        'flex',
            justifyContent: 'center',
            alignItems:     'center',
            gap:            '6px',
            zIndex:         2,
          }}>
            {photos.map((_, i) => (
              <div
                key={i}
                style={{
                  width:           i === photoIdx ? '18px' : '6px',
                  height:          '6px',
                  borderRadius:    '3px',
                  backgroundColor: `rgba(255,255,255,${i === photoIdx ? 0.95 : 0.48})`,
                  transition:      'width 0.22s ease, background-color 0.22s ease',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 戻るボタン */}
      <button
        onClick={() => navigate(-1)}
        className="absolute flex items-center justify-center"
        style={{
          top:    'calc(env(safe-area-inset-top, 44px) + 10px)',
          left:   '16px',
          width:  '36px',
          height: '36px',
          zIndex: 10,
        }}
        aria-label="戻る"
      >
        <ChevronLeft size={26} color="white" strokeWidth={2.2} />
      </button>

      {/* 削除ボタン（自分の投稿のみ） */}
      {result?.isUserPost && (
        <button
          onClick={() => setConfirmDelete(true)}
          className="absolute flex items-center justify-center"
          style={{
            top:             'calc(env(safe-area-inset-top, 44px) + 10px)',
            right:           '16px',
            width:           '36px',
            height:          '36px',
            zIndex:          10,
            borderRadius:    '50%',
            backgroundColor: 'rgba(0,0,0,0.28)',
            border:          'none',
            cursor:          'pointer',
          }}
          aria-label="削除"
        >
          <Trash2 size={17} color="white" strokeWidth={2} />
        </button>
      )}

      {/* 削除確認シート */}
      {confirmDelete && (
        <div
          style={{
            position:        'fixed',
            inset:           0,
            zIndex:          200,
            display:         'flex',
            flexDirection:   'column',
            justifyContent:  'flex-end',
          }}
        >
          {/* 背景オーバーレイ */}
          <div
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)' }}
            onClick={() => setConfirmDelete(false)}
          />

          {/* シート本体 */}
          <div
            style={{
              position:        'relative',
              backgroundColor: '#fff',
              borderRadius:    '24px 24px 0 0',
              padding:         '28px 20px',
              paddingBottom:   'calc(env(safe-area-inset-bottom, 0px) + 24px)',
              display:         'flex',
              flexDirection:   'column',
              gap:             '12px',
            }}
          >
            <p style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a1a', textAlign: 'center' }}>
              この記録を削除しますか？
            </p>
            <p style={{ fontSize: '13px', color: '#999', textAlign: 'center', lineHeight: 1.6 }}>
              削除すると元に戻せません。
            </p>

            <button
              onClick={handleDelete}
              style={{
                marginTop:       '4px',
                width:           '100%',
                padding:         '15px',
                borderRadius:    '999px',
                backgroundColor: '#d94040',
                color:           '#fff',
                fontSize:        '16px',
                fontWeight:      700,
                border:          'none',
                cursor:          'pointer',
                boxShadow:       '0 4px 14px rgba(200,40,40,0.30)',
              }}
            >
              削除する
            </button>

            <button
              onClick={() => setConfirmDelete(false)}
              style={{
                width:           '100%',
                padding:         '15px',
                borderRadius:    '999px',
                backgroundColor: '#f0f0ec',
                color:           '#555',
                fontSize:        '16px',
                fontWeight:      600,
                border:          'none',
                cursor:          'pointer',
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* ── 白いカード ── */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col"
        style={{
          top:              'calc(46% - 22px)',
          backgroundColor:  '#fff',
          borderRadius:     '24px 24px 0 0',
          padding:          '28px 20px',
          paddingBottom:    'calc(env(safe-area-inset-bottom, 0px) + 28px)',
          gap:              '14px',
        }}
      >
        {/* タイトル + 場所 */}
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3 }}>
            {result?.title ?? '海が見える坂の途中'}
          </h1>
          <p style={{ fontSize: '13px', color: '#999', marginTop: '6px', fontWeight: 500 }}>
            {result?.location ?? '鎌倉市・稲村ヶ崎'}
          </p>
        </div>

        {/* タグ */}
        <div className="flex gap-2 flex-wrap">
          {tags.map(tag => (
            <span
              key={tag}
              style={{
                padding:         '6px 14px',
                borderRadius:    '999px',
                backgroundColor: 'rgba(122,158,126,0.13)',
                border:          '1px solid rgba(93,132,95,0.22)',
                color:           '#496a4c',
                fontSize:        '13px',
                fontWeight:      500,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* コメント */}
        <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.85 }}>
          {comment}
        </p>

        {/* 公開範囲（自分の投稿のみ） */}
        {result?.isUserPost && result?.privacy && (
          <p style={{ fontSize: '12px', color: '#bbb' }}>
            {{ private: 'プライベート', followers: 'フォロワーのみ', public: '公開' }[result.privacy] ?? result.privacy}
          </p>
        )}

        {/* ナビを開始ボタン */}
        <button
          onClick={() => navigate('/directions', { state: { result } })}
          style={{
            marginTop:       'auto',
            width:           '100%',
            padding:         '16px',
            borderRadius:    '999px',
            backgroundColor: '#496a4c',
            color:           '#fff',
            fontSize:        '16px',
            fontWeight:      700,
            border:          'none',
            cursor:          'pointer',
            boxShadow:       '0 4px 16px rgba(58,84,60,0.35)',
            letterSpacing:   '0.04em',
          }}
        >
          ナビを開始
        </button>

        {/* いいね・ブックマーク */}
        <div className="flex items-center justify-between" style={{ paddingTop: '4px' }}>
          <button onClick={() => { setLiked(v => !v); if (!result?.isUserPost) toggleLike(result.id) }} className="flex items-center gap-2">
            <Heart
              size={22} strokeWidth={1.5}
              style={{
                color:      liked ? '#e85a5a' : '#bbb',
                fill:       liked ? '#e85a5a' : 'none',
                transition: 'color 0.2s, fill 0.2s',
              }}
            />
            <span style={{ fontSize: '15px', color: '#bbb' }}>{likeCount}</span>
          </button>
          <button onClick={() => setBookmarked(v => !v)}>
            <Bookmark
              size={22} strokeWidth={1.5}
              style={{
                color:      bookmarked ? '#7a9e7e' : '#bbb',
                fill:       bookmarked ? '#7a9e7e' : 'none',
                transition: 'color 0.2s, fill 0.2s',
              }}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

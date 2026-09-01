import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, LayoutGrid, BookOpen } from 'lucide-react'
import { PLACES } from '../data/places'
import { getPosts } from '../utils/storage'

/* ── カード背景色 ── */
function lightenColor(hex, amount) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${Math.round(r + (255 - r) * amount)},${Math.round(g + (255 - g) * amount)},${Math.round(b + (255 - b) * amount)})`
}
function cardBgFromEntry(entry) {
  const m = entry.bg?.match(/#[0-9a-fA-F]{6}/g)
  if (!m) return '#dce8dc'
  return lightenColor(m[m.length - 1], 0.72)
}

/* ── グリッドビュー ── */
function GridView({ entries }) {
  const navigate = useNavigate()
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap:                 '2px',
        backgroundColor:     '#d0c8b8',
      }}>
        {entries.map(entry => (
          <div
            key={entry.id}
            style={{ aspectRatio: '1', overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => navigate('/place-detail', { state: { result: entry } })}
          >
            {entry.photo
              ? <img src={entry.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <div style={{ width: '100%', height: '100%', background: entry.bg }} />
            }
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── フラッシュカード ── */
function FlashCard({ entry, onClick }) {
  const cardBg = cardBgFromEntry(entry)
  const photo  = entry.photo ?? null

  return (
    <div
      onClick={onClick}
      style={{
        width:           '100%',
        height:          '100%',       /* 親ラッパーの明示サイズに合わせる */
        borderRadius:    '22px',
        backgroundColor: cardBg,
        boxShadow:       '0 8px 36px rgba(60,80,60,0.13), 0 2px 8px rgba(60,80,60,0.08), inset 0 0 0 1px rgba(255,255,255,0.55)',
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        padding:         '22px 16px 18px',
        overflow:        'hidden',
        cursor:          onClick ? 'pointer' : 'default',
        boxSizing:       'border-box',
      }}
    >
      {/* 写真：シール風の白い縁取り */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {photo ? (
          <img
            src={photo}
            alt={entry.title}
            style={{
              width:        '72%',
              aspectRatio:  '1',
              objectFit:    'cover',
              borderRadius: '14px',
              boxShadow:    '0 0 0 8px white, 0 8px 24px rgba(0,0,0,0.18)',
              display:      'block',
              flexShrink:   0,
            }}
          />
        ) : (
          <div style={{
            width: '72%', aspectRatio: '1', borderRadius: '14px',
            background: entry.bg,
            boxShadow: '0 0 0 8px white, 0 8px 24px rgba(0,0,0,0.18)',
          }} />
        )}
      </div>

      {/* 場所名 */}
      <p style={{
        flexShrink:      0,
        fontSize:        '16px',
        fontFamily:      "'Hiragino Mincho ProN','YuMincho','Yu Mincho',Georgia,serif",
        color:           '#2a2e28',
        textAlign:       'center',
        letterSpacing:   '0.05em',
        lineHeight:      1.45,
        margin:          '14px 0 0',
        padding:         '0 4px',
        overflow:        'hidden',
        display:         '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {entry.title}
      </p>
    </div>
  )
}

/* ── メインコンポーネント ── */
export default function Encyclopedia() {
  const navigate  = useNavigate()
  const userPosts = getPosts()
  const entries   = [...userPosts, ...PLACES]

  /* カード寸法：左右にのぞき幅 PEEK px を確保して算出 */
  const PEEK   = 44
  const GAP    = 12
  const cardW  = Math.max(200, window.innerWidth - 2 * PEEK - 2 * GAP)
  const cardH  = Math.round(cardW * 7 / 5)   /* 5:7 タテ比率 */
  const stride = cardW + GAP                  /* カード中心間距離 */

  const [mode,           setMode]          = useState('flip')
  const [currentIdx,     setCurrentIdx]    = useState(0)
  const [cardOffset,     setCardOffset]    = useState(0)
  const [cardTransition, setCardTransition] = useState(false)
  const [animating,      setAnimating]     = useState(false)

  const touchStartX = useRef(null)
  const didSwipe    = useRef(false)

  const openFlip = useCallback((idx) => {
    setCurrentIdx(idx)
    setCardOffset(0)
    setCardTransition(false)
    setMode('flip')
  }, [])

  const backToGrid = useCallback(() => setMode('grid'), [])

  /* カード切り替え */
  const goCard = useCallback((dir) => {
    if (animating) return
    if (dir === 1  && currentIdx >= entries.length - 1) return
    if (dir === -1 && currentIdx <= 0)                  return

    setAnimating(true)
    setCardTransition(true)
    setCardOffset(-dir * stride)

    setTimeout(() => {
      setCardTransition(false)
      setCurrentIdx(i => i + dir)
      setCardOffset(0)
      setAnimating(false)
    }, 270)
  }, [animating, currentIdx, entries.length, stride])

  /* タッチ開始 */
  const handleTouchStart = useCallback((e) => {
    if (animating) return
    touchStartX.current = e.touches[0].clientX
    didSwipe.current    = false
    setCardTransition(false)
  }, [animating])

  /* タッチ移動：リアルタイム追従、端では抵抗 */
  const handleTouchMove = useCallback((e) => {
    if (touchStartX.current === null || animating) return
    const delta = e.touches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 10) didSwipe.current = true

    let offset = delta
    if (delta < 0 && currentIdx >= entries.length - 1) offset = delta * 0.25
    if (delta > 0 && currentIdx <= 0)                  offset = delta * 0.25
    setCardOffset(offset)
  }, [animating, currentIdx, entries.length])

  /* タッチ終了 */
  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current

    if (delta < -52 && currentIdx < entries.length - 1) {
      didSwipe.current = true
      goCard(1)
    } else if (delta > 52 && currentIdx > 0) {
      didSwipe.current = true
      goCard(-1)
    } else {
      setCardTransition(true)
      setCardOffset(0)
    }
    touchStartX.current = null
  }, [animating, currentIdx, entries.length, goCard])

  return (
    <div
      className="flex flex-col"
      style={{
        height:          'calc(100dvh - 60px - env(safe-area-inset-bottom, 0px))',
        overflow:        'hidden',
        backgroundColor: '#f5f0e8',
      }}
    >
      {/* ヘッダー */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: '14px 18px 10px' }}>
        <div style={{ width: '72px' }}>
          <button
            onClick={() => navigate(-1)}
            aria-label="戻る"
            style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ChevronLeft size={24} strokeWidth={2} style={{ color: '#3a2a14', opacity: 0.75 }} />
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {mode === 'flip' && (
            <span style={{
              fontSize: '14px', color: '#4a5a40',
              fontFamily: "'Hiragino Mincho ProN','YuMincho',Georgia,serif",
              letterSpacing: '0.10em', opacity: 0.75,
            }}>
              {currentIdx + 1} / {entries.length}
            </span>
          )}
        </div>

        <div style={{ width: '72px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={backToGrid}
            disabled={mode === 'grid'}
            aria-label="グリッド表示"
            style={{ border: 'none', background: 'none', padding: 0, cursor: mode === 'grid' ? 'default' : 'pointer', display: 'flex' }}
          >
            <LayoutGrid size={19} strokeWidth={1.5} style={{ color: '#3a2a14', opacity: mode === 'grid' ? 1 : 0.28, transition: 'opacity 0.25s ease' }} />
          </button>
          <button
            onClick={() => openFlip(currentIdx)}
            disabled={mode === 'flip'}
            aria-label="カード表示"
            style={{ border: 'none', background: 'none', padding: 0, cursor: mode === 'flip' ? 'default' : 'pointer', display: 'flex' }}
          >
            <BookOpen size={19} strokeWidth={1.5} style={{ color: '#3a2a14', opacity: mode === 'flip' ? 1 : 0.28, transition: 'opacity 0.25s ease' }} />
          </button>
        </div>
      </div>

      {/* コンテンツ */}
      {mode === 'grid' ? (

        <GridView entries={entries} />

      ) : (

        /*
         * カードエリア
         * ─ overflow: hidden でクリップ
         * ─ flex で縦中央揃え（top:50%+translateY に頼らない）
         * ─ 固定サイズの「アンカー div」を中央に置き、そこからカードを絶対配置
         */
        <div
          style={{
            flex:            1,
            minHeight:       0,
            overflow:        'hidden',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* アンカー：カード幅×高さの固定サイズ box。ここを基準に各カードを絶対配置 */}
          <div style={{ position: 'relative', width: cardW, height: cardH, flexShrink: 0 }}>
            {entries.map((entry, i) => {
              const rel = i - currentIdx
              if (Math.abs(rel) > 2) return null

              const x = rel * stride + cardOffset

              return (
                <div
                  key={entry.id}
                  style={{
                    position:      'absolute',
                    inset:         0,               /* アンカーと同じサイズ */
                    transform:     `translateX(${x}px)`,
                    transition:    cardTransition
                      ? 'transform 0.26s cubic-bezier(0.25,0.1,0.25,1)'
                      : 'none',
                    opacity:       rel === 0 ? 1 : 0.65,
                    pointerEvents: rel === 0 ? 'auto' : 'none',
                  }}
                >
                  <FlashCard
                    entry={entry}
                    onClick={rel === 0
                      ? () => { if (!didSwipe.current) navigate('/place-detail', { state: { result: entry } }) }
                      : undefined
                    }
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

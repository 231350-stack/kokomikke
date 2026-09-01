import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PLACES } from '../data/places'
import { OTHER_POSTS } from '../data/otherPosts'
import { getPosts, getLikes } from '../utils/storage'

/* ─────────────────────────────────────────────
   ポラロイド写真が重なった図鑑エントリービジュアル
───────────────────────────────────────────── */
function PhotoStack({ entries, spotCount, onPress }) {
  const [pressed, setPressed] = useState(false)

  /* 写真ありエントリーを優先しつつ最大3枚確保 */
  const withPhoto    = entries.filter(e => e.photo)
  const withoutPhoto = entries.filter(e => !e.photo)
  const pool         = [...withPhoto, ...withoutPhoto].slice(0, 3)

  /* カード設定：[奥 → 手前] の順。手前(index 2)が最新写真 */
  const STACK = [
    { rotate: -7,  tx:  -18, ty:  -8,  zIndex: 1 },  /* 奥・左 */
    { rotate:  6,  tx:   16, ty: -12,  zIndex: 2 },  /* 中・右 */
    { rotate: -0.5, tx:   0, ty:   0,  zIndex: 3 },  /* 手前・最新 */
  ]

  const CARD_W   = 188   /* カード全幅 */
  const PHOTO_H  = 124   /* 写真エリアの高さ */
  const BORDER_S = 10    /* 上・左右の白フチ */
  const BORDER_B = 26    /* 下の白フチ（ポラロイド） */

  return (
    <div
      onClick={onPress}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      role="button"
      aria-label="図鑑を開く"
      style={{
        cursor:     'pointer',
        transform:  pressed ? 'scale(0.96)' : 'scale(1)',
        transition: 'transform 0.15s ease',
        display:    'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap:        '14px',
      }}
    >
      {/* 写真スタック */}
      <div style={{
        position: 'relative',
        width:    CARD_W + 48,   /* 回転で飛び出す分を吸収 */
        height:   PHOTO_H + BORDER_S + BORDER_B + 36,
        display:  'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {STACK.map((cfg, stackIdx) => {
          /* 奥(0) → 古い写真、手前(2) → 最新(entries[0]) */
          const entry = pool[STACK.length - 1 - stackIdx] ?? pool[0]
          if (!entry) return null

          return (
            <div
              key={stackIdx}
              style={{
                position:        'absolute',
                width:           CARD_W,
                backgroundColor: '#ffffff',
                borderRadius:    '10px',
                padding:         `${BORDER_S}px ${BORDER_S}px ${BORDER_B}px`,
                boxShadow:       '0 6px 24px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08)',
                transform:       `rotate(${cfg.rotate}deg) translate(${cfg.tx}px, ${cfg.ty}px)`,
                zIndex:          cfg.zIndex,
                boxSizing:       'border-box',
              }}
            >
              {entry.photo ? (
                <img
                  src={entry.photo}
                  alt=""
                  style={{
                    width:        '100%',
                    height:       PHOTO_H,
                    objectFit:    'cover',
                    display:      'block',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <div style={{
                  width:        '100%',
                  height:       PHOTO_H,
                  background:   entry.bg,
                  borderRadius: '4px',
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* 件数表示 */}
      <p style={{
        fontSize:      '11px',
        color:         '#8a8070',
        letterSpacing: '0.03em',
        textAlign:     'center',
        margin:        0,
      }}>
        見つけた場所　{spotCount}スポット
      </p>
    </div>
  )
}

/* ─────────────────────────── メイン ─────────────────────────── */
export default function Profile() {
  const navigate    = useNavigate()
  const userPosts   = getPosts()
  const allPosts    = [...userPosts, ...PLACES]
  const likedIds    = getLikes()
  const likedPlaces = OTHER_POSTS.filter(p => likedIds.includes(p.id))

  const STATS = [
    { label: '記録',     value: userPosts.length },
    { label: 'フォロワー', value: 42 },
    { label: 'フォロー',  value: 18 },
  ]

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: 'calc(100dvh - 60px - env(safe-area-inset-bottom, 0px))' }}
    >
      {/* ── プロフィールヘッダー ── */}
      <div style={{
        background:    'linear-gradient(160deg,#d6e8d8 0%,#eaf2eb 100%)',
        paddingTop:    '48px',
        paddingBottom: '32px',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '12px',
      }}>
        {/* アバター */}
        <img
          src="/images/avatar.jpg"
          alt="Akari"
          style={{
            width:        '80px',
            height:       '80px',
            borderRadius: '50%',
            objectFit:    'cover',
            boxShadow:    '0 2px 12px rgba(90,138,90,0.25)',
          }}
        />

        {/* 名前 */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Akari</p>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>日々の小さな発見を記録中</p>
        </div>

        {/* 統計 */}
        <div style={{
          display:         'flex',
          gap:             '0',
          marginTop:       '8px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius:    '16px',
          overflow:        'hidden',
          boxShadow:       '0 2px 12px rgba(60,100,60,0.10)',
          border:          '1px solid rgba(90,130,90,0.15)',
        }}>
          {STATS.map(({ label, value }, idx) => (
            <div key={label} style={{
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              padding:       '12px 24px',
              borderRight:   idx < STATS.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none',
            }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#2a2a2a' }}>{value}</span>
              <span style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 図鑑セクション ── */}
      <div style={{ padding: '20px 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width:           '4px',
          height:          '16px',
          borderRadius:    '2px',
          backgroundColor: '#7a9e7e',
          flexShrink:      0,
        }} />
        <p style={{
          fontSize:      '15px',
          fontWeight:    700,
          color:         '#2a3a2a',
          letterSpacing: '0.04em',
          margin:        0,
        }}>
          図鑑
        </p>
      </div>

      {/* 写真スタックビジュアル */}
      <div style={{
        margin:          '12px 16px',
        borderRadius:    '20px',
        backgroundColor: '#dde8e0',
        border:          '1px solid rgba(90,130,90,0.18)',
        boxShadow:       '0 4px 18px rgba(60,100,60,0.12)',
        padding:         '28px 20px 28px',
        display:         'flex',
        justifyContent:  'center',
        alignItems:      'center',
      }}>
        <PhotoStack
          entries={allPosts}
          spotCount={allPosts.length}
          onPress={() => navigate('/encyclopedia')}
        />
      </div>

      {/* ── お気に入りの場所 ── */}
      <div style={{ padding: '4px 16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{
            width:           '4px',
            height:          '16px',
            borderRadius:    '2px',
            backgroundColor: '#7a9e7e',
            flexShrink:      0,
          }} />
          <p style={{
            fontSize:      '15px',
            fontWeight:    700,
            color:         '#2a3a2a',
            letterSpacing: '0.04em',
            margin:        0,
          }}>
            お気に入りの場所
          </p>
        </div>

        {likedPlaces.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#bbb', textAlign: 'center', padding: '24px 0' }}>
            いいねした場所がここに表示されます
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {likedPlaces.map(place => (
              <div
                key={place.id}
                style={{
                  borderRadius: '14px',
                  overflow:     'hidden',
                  cursor:       'pointer',
                  position:     'relative',
                  aspectRatio:  '1',
                  background:   place.bg,
                }}
                onClick={() => navigate('/place-detail', { state: { result: place } })}
                role="button"
              >
                {place.photo && (
                  <img
                    src={place.photo}
                    alt={place.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                <div style={{
                  position:   'absolute',
                  inset:      0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.38) 0%, transparent 55%)',
                  display:    'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding:    '10px',
                }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                    {place.title}
                  </p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>
                    {place.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

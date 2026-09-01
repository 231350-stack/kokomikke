import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Search, SlidersHorizontal, Camera, ChevronRight } from 'lucide-react'
import L from 'leaflet'
import { PLACES } from '../data/places'
import { getPosts } from '../utils/storage'

const DEFAULT_CENTER = [35.320, 139.548]
const DEFAULT_ZOOM   = 13
const USER_POS       = [35.325, 139.545]

/* 通常ピン */
const pinIcon = L.divIcon({
  html: `<svg viewBox="0 0 24 30" width="30" height="38" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C7.58 0 4 3.58 4 8c0 5.5 8 20 8 20s8-14.5 8-20c0-4.42-3.58-8-8-8z" fill="#7a9e7e"/>
    <circle cx="12" cy="8.5" r="3.2" fill="white"/>
  </svg>`,
  className:  '',
  iconSize:   [30, 38],
  iconAnchor: [15, 38],
})

/* 選択中ピン（大きく・濃い緑） */
const selectedPinIcon = L.divIcon({
  html: `<svg viewBox="0 0 24 30" width="38" height="48" xmlns="http://www.w3.org/2000/svg">
    <filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.35"/></filter>
    <path d="M12 0C7.58 0 4 3.58 4 8c0 5.5 8 20 8 20s8-14.5 8-20c0-4.42-3.58-8-8-8z" fill="#3d6b42" filter="url(#s)"/>
    <circle cx="12" cy="8.5" r="3.6" fill="white"/>
  </svg>`,
  className:  '',
  iconSize:   [38, 48],
  iconAnchor: [19, 48],
})

/* 現在地アイコン */
const locationIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#4A8FE8;border:2.5px solid white;box-shadow:0 0 0 4px rgba(74,143,232,0.25)"></div>`,
  className:  '',
  iconSize:   [14, 14],
  iconAnchor: [7, 7],
})

/* 地図タップ検出コンポーネント */
function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: onMapClick })
  return null
}

export default function Home() {
  const navigate        = useNavigate()
  const userPosts       = getPosts()
  const allPins         = [...userPosts, ...PLACES]
  const [selected, setSelected] = useState(null)

  const handlePinClick  = (place) => setSelected(place)
  const handleMapClick  = () => setSelected(null)

  /* カード・FAB のオフセット量 */
  const CARD_H = 92   /* カード高さの概算 */
  const cardVisible = selected !== null

  return (
    <div
      className="relative w-full flex flex-col"
      style={{ height: 'calc(100dvh - 60px - env(safe-area-inset-bottom, 0px))' }}
    >
      {/* ── 地図エリア ── */}
      <div className="relative flex-1 overflow-hidden">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          className="w-full h-full"
          zoomControl={false}
          attributionControl={false}
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* 地図タップ → 選択解除 */}
          <MapClickHandler onMapClick={handleMapClick} />

          {/* スポットピン */}
          {allPins.map(place => (
            <Marker
              key={place.id}
              position={place.pos}
              icon={selected?.id === place.id ? selectedPinIcon : pinIcon}
              eventHandlers={{ click: () => handlePinClick(place) }}
            />
          ))}

          {/* 現在地 */}
          <Marker position={USER_POS} icon={locationIcon} />
        </MapContainer>

        {/* ── 検索バー ── */}
        <div
          className="absolute top-3 left-3 right-3 flex gap-2"
          style={{ zIndex: 900 }}
        >
          <div
            className="bg-white rounded-2xl px-4 py-3 flex items-center gap-2 flex-1"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.07)', cursor: 'text' }}
            onClick={() => navigate('/search')}
          >
            <Search size={17} strokeWidth={2} style={{ color: '#7a9e7e', flexShrink: 0 }} />
            <span className="flex-1 text-sm" style={{ color: '#aaa' }}>どこへ行きますか？</span>
          </div>
          <div
            className="bg-white rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ width: '48px', height: '48px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.07)' }}
          >
            <SlidersHorizontal size={18} strokeWidth={2} style={{ color: '#5d845f' }} />
          </div>
        </div>

        {/* ── カメラ FAB（カード表示時は上に退避） ── */}
        <button
          onClick={() => navigate('/camera')}
          aria-label="撮る"
          style={{
            position:        'absolute',
            bottom:          cardVisible ? `${CARD_H + 16}px` : '20px',
            right:           '16px',
            width:           '56px',
            height:          '56px',
            borderRadius:    '50%',
            backgroundColor: '#7a9e7e',
            boxShadow:       '0 4px 16px rgba(90,138,90,0.40)',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            zIndex:          900,
            border:          'none',
            cursor:          'pointer',
            transition:      'bottom 0.28s ease',
          }}
        >
          <Camera size={24} color="white" strokeWidth={1.8} />
        </button>

        {/* ── 選択スポットカード（地図上オーバーレイ） ── */}
        <div
          style={{
            position:     'absolute',
            left:         '12px',
            right:        '12px',
            bottom:       '12px',
            zIndex:       850,
            /* ピンタップで slide-up、地図タップで slide-down */
            transform:    cardVisible ? 'translateY(0)' : `translateY(calc(100% + 20px))`,
            opacity:      cardVisible ? 1 : 0,
            transition:   'transform 0.28s ease, opacity 0.22s ease',
            pointerEvents: cardVisible ? 'auto' : 'none',
            /* カードの見た目 */
            backgroundColor: '#fff',
            borderRadius: '18px',
            boxShadow:    '0 6px 28px rgba(0,0,0,0.18)',
            border:       '1px solid rgba(0,0,0,0.07)',
            padding:      '12px 14px',
            display:      'flex',
            alignItems:   'center',
            gap:          '12px',
            cursor:       'pointer',
          }}
          onClick={() => selected && navigate('/place-detail', { state: { result: selected } })}
          role="button"
          aria-label={selected?.title}
        >
          {selected && (
            <>
              {/* サムネイル */}
              <div
                style={{
                  width:        '60px',
                  height:       '60px',
                  borderRadius: '12px',
                  overflow:     'hidden',
                  flexShrink:   0,
                  background:   selected.bg,
                }}
              >
                {selected.photo && (
                  <img
                    src={selected.photo}
                    alt={selected.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>

              {/* テキスト */}
              <div className="flex-1 min-w-0">
                <p
                  style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.3' }}
                >
                  {selected.title}
                </p>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '3px' }}>{selected.location}</p>
              </div>

              {/* 詳細矢印 */}
              <ChevronRight size={18} strokeWidth={2} style={{ color: '#7a9e7e', flexShrink: 0 }} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { PLACES } from '../data/places'

// 現在地（固定）
const CURRENT_POS = [35.3132, 139.5425]

// 徒歩アイコン
function WalkIcon() {
  return (
    <svg width="26" height="30" viewBox="0 0 26 30" fill="none" aria-hidden="true">
      <circle cx="15" cy="3.2" r="2.6" fill="#666" />
      <path d="M14 5.8 L11 14" stroke="#666" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M14 8.8 L19 12" stroke="#666" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M13 8.8 L8.5 11.2" stroke="#666" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M11 14 L14.5 21.5 L18 23.5" stroke="#666" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 14 L7.5 21.5 L4.5 23" stroke="#666" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// 現在地アイコン（青ドット）
const locationIcon = L.divIcon({
  html: `<div style="
    width:14px;height:14px;border-radius:50%;
    background:#4A8FE8;border:2.5px solid white;
    box-shadow:0 0 0 5px rgba(74,143,232,0.22);
  "></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

// 目的地ピン（緑）
const destIcon = L.divIcon({
  html: `<svg viewBox="0 0 24 30" width="30" height="38" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C7.58 0 4 3.58 4 8c0 5.5 8 20 8 20s8-14.5 8-20c0-4.42-3.58-8-8-8z" fill="#ff6429"/>
    <circle cx="12" cy="8.5" r="3.2" fill="white"/>
  </svg>`,
  className: '',
  iconSize: [30, 38],
  iconAnchor: [15, 38],
})

export default function DirectionsPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  // 目的地：PlaceDetailPage から渡された pos、なければ PLACES[0] をデフォルト
  const destPos = state?.result?.pos ?? PLACES[0].pos
  const destTitle = state?.result?.title ?? PLACES[0].title

  const center = [
    (CURRENT_POS[0] + destPos[0]) / 2,
    (CURRENT_POS[1] + destPos[1]) / 2,
  ]

  return (
    <div className="flex flex-col" style={{ height: '100dvh', backgroundColor: '#fff' }}>

      {/* ── ヘッダー ── */}
      <div
        className="flex-shrink-0 bg-white"
        style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}
      >
        <div className="relative flex items-center justify-center" style={{ height: '50px' }}>
          <button
            onClick={() => navigate(-1)}
            className="absolute left-3 flex items-center justify-center w-10 h-10"
            aria-label="戻る"
          >
            <ChevronLeft size={22} strokeWidth={2} className="text-gray-700" />
          </button>
          <span
            style={{
              fontSize:   '16px',
              fontWeight: 500,
              color:      '#1a1a1a',
            }}
          >
            行き方
          </span>
        </div>
      </div>

      {/* ── 地図 ── */}
      <div className="flex-1 relative overflow-hidden">
        <MapContainer
          center={center}
          zoom={13}
          className="absolute inset-0 w-full h-full"
          zoomControl={false}
          attributionControl={false}
          scrollWheelZoom={false}
          dragging={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 現在地 → 目的地：点線ルート */}
          <Polyline
            positions={[CURRENT_POS, destPos]}
            pathOptions={{
              color:     '#5d845f',
              weight:    3,
              dashArray: '10, 7',
              lineCap:   'round',
            }}
          />

          <Marker position={CURRENT_POS} icon={locationIcon} />
          <Marker position={destPos}     icon={destIcon} />
        </MapContainer>
      </div>

      {/* ── 下部カード ── */}
      <div
        className="flex-shrink-0 bg-white"
        style={{
          padding:       '20px 20px',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
          boxShadow:     '0 -1px 0 rgba(0,0,0,0.06)',
        }}
      >
        {/* 目的地名 */}
        <p
          style={{
            fontSize:     '13px',
            color:        '#aaa',
            marginBottom: '12px',
          }}
        >
          {destTitle}
        </p>

        {/* 徒歩情報 */}
        <div className="flex items-center gap-4 mb-5">
          <WalkIcon />
          <div>
            <p style={{ fontSize: '16px', fontWeight: 500, color: '#333' }}>
              徒歩 12分（850m）
            </p>
            <p style={{ fontSize: '13px', color: '#aaa', marginTop: '3px' }}>
              ゆるやかな坂道です
            </p>
          </div>
        </div>

        {/* ナビを開始ボタン */}
        <button
          onClick={() => navigate('/navigation-active')}
          className="w-full text-white font-medium rounded-full"
          style={{
            backgroundColor: '#7a9e7e',
            fontSize:        '16px',
            padding:         '16px',
          }}
        >
          ナビを開始
        </button>
      </div>
    </div>
  )
}

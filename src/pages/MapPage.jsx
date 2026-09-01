import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { Search, SlidersHorizontal } from 'lucide-react'
import L from 'leaflet'
import { PLACES } from '../data/places'

const DEFAULT_CENTER = [35.320, 139.548]
const DEFAULT_ZOOM   = 13

const USER_POS = [35.325, 139.545]

// 緑ピンアイコン
const pinIcon = L.divIcon({
  html: `<svg viewBox="0 0 24 30" width="30" height="38" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C7.58 0 4 3.58 4 8c0 5.5 8 20 8 20s8-14.5 8-20c0-4.42-3.58-8-8-8z" fill="#7a9e7e"/>
    <circle cx="12" cy="8.5" r="3.2" fill="white"/>
  </svg>`,
  className: '',
  iconSize:   [30, 38],
  iconAnchor: [15, 38],
})

// 現在地アイコン（青ドット）
const locationIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#4A8FE8;border:2.5px solid white;box-shadow:0 0 0 4px rgba(74,143,232,0.25)"></div>`,
  className: '',
  iconSize:   [14, 14],
  iconAnchor: [7, 7],
})

// 下部カードに表示する「近くの発見」（先頭エントリを使用）
const FEATURED = PLACES[0]

export default function MapPage() {
  const navigate = useNavigate()

  return (
    <div
      className="relative w-full flex flex-col"
      style={{ height: 'calc(100dvh - 60px - env(safe-area-inset-bottom, 0px))' }}
    >
      {/* 地図エリア */}
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

          {/* PLACES から発見ピンを生成 */}
          {PLACES.map(place => (
            <Marker key={place.id} position={place.pos} icon={pinIcon} />
          ))}

          {/* 現在地 */}
          <Marker position={USER_POS} icon={locationIcon} />
        </MapContainer>

        {/* 検索バー（地図上に重ねて表示） */}
        <div
          className="absolute top-3 left-3 right-3 flex gap-2"
          style={{ zIndex: 900 }}
        >
          {/* 検索インプット */}
          <div
            className="bg-white rounded-2xl px-4 py-3 flex items-center gap-2 flex-1"
            style={{ boxShadow: '0 2px 14px rgba(0,0,0,0.10)', cursor: 'text' }}
            onClick={() => navigate('/search')}
          >
            <Search size={17} strokeWidth={1.8} className="text-gray-400 flex-shrink-0" />
            <span className="flex-1 text-sm text-gray-400">どこへ行きますか？</span>
          </div>

          {/* フィルターボタン */}
          <div
            className="bg-white rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              width: '48px',
              height: '48px',
              boxShadow: '0 2px 14px rgba(0,0,0,0.10)',
            }}
          >
            <SlidersHorizontal size={18} strokeWidth={1.8} className="text-gray-600" />
          </div>
        </div>
      </div>

      {/* 下部カード（近くの発見プレビュー） */}
      <div
        className="bg-white px-4 py-3 flex items-center gap-3 active:opacity-80 transition-opacity"
        style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.06)' }}
        onClick={() => navigate('/place-detail', { state: { result: FEATURED } })}
        role="button"
      >
        {/* サムネイル */}
        <div
          className="rounded-xl overflow-hidden flex-shrink-0"
          style={{
            width: '64px',
            height: '64px',
            background: FEATURED.bg,
          }}
        />

        {/* テキスト */}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium text-gray-800 leading-tight">
            {FEATURED.title}
          </p>
          <p className="text-xs text-gray-400 mt-1">{FEATURED.location}</p>
        </div>
      </div>
    </div>
  )
}

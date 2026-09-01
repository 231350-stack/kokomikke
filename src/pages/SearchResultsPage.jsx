import { useNavigate, useLocation } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { Search, SlidersHorizontal, Heart } from 'lucide-react'
import L from 'leaflet'
import { PLACES } from '../data/places'

const CENTER = [35.315, 139.545]
const ZOOM = 12

// 件数バッジ付きクラスターアイコン
const clusterIcon = (count) =>
  L.divIcon({
    html: `<div style="
      width:36px;height:36px;border-radius:50%;
      background:#ff6429;color:#fff;
      font-size:13px;font-weight:600;
      display:flex;align-items:center;justify-content:center;
      font-family:-apple-system,BlinkMacSystemFont,'Hiragino Sans',sans-serif;
      box-shadow:0 2px 6px rgba(0,0,0,0.18);
    ">${count}</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })

const CLUSTERS = [
  { id: 1, pos: [35.355, 139.485], count: 12 },
  { id: 2, pos: [35.340, 139.568], count: 8 },
  { id: 3, pos: [35.298, 139.508], count: 5 },
  { id: 4, pos: [35.282, 139.572], count: 7 },
]

export default function SearchResultsPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const query = state?.query ?? '鎌倉'

  return (
    <div
      className="flex flex-col"
      style={{ height: 'calc(100dvh - 60px - env(safe-area-inset-bottom, 0px))' }}
    >
      {/* ── 地図エリア ── */}
      <div className="relative flex-shrink-0" style={{ height: '46%' }}>
        <MapContainer
          center={CENTER}
          zoom={ZOOM}
          className="w-full h-full"
          zoomControl={false}
          attributionControl={false}
          scrollWheelZoom={false}
          dragging={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {CLUSTERS.map(c => (
            <Marker key={c.id} position={c.pos} icon={clusterIcon(c.count)} />
          ))}
        </MapContainer>

        {/* 検索バー */}
        <div
          className="absolute top-3 left-3 right-3 flex gap-2"
          style={{ zIndex: 900 }}
        >
          <div
            className="bg-white rounded-2xl px-4 py-3 flex items-center gap-2 flex-1"
            style={{ boxShadow: '0 2px 14px rgba(0,0,0,0.10)', cursor: 'text' }}
            onClick={() => navigate('/search')}
          >
            <Search size={17} strokeWidth={1.8} className="text-gray-400 flex-shrink-0" />
            <span className="flex-1 text-sm text-gray-800">{query}</span>
          </div>
          <div
            className="bg-white rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ width: '48px', height: '48px', boxShadow: '0 2px 14px rgba(0,0,0,0.10)' }}
          >
            <SlidersHorizontal size={18} strokeWidth={1.8} className="text-gray-600" />
          </div>
        </div>
      </div>

      {/* ── 検索結果リスト ── */}
      <div className="flex-1 bg-white overflow-y-auto">
        {PLACES.map((item, idx) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-4 py-3 active:bg-gray-50 transition-colors ${
              idx < PLACES.length - 1 ? 'border-b border-gray-100' : ''
            }`}
            onClick={() => navigate('/place-detail', { state: { result: item } })}
            role="button"
          >
            {/* サムネイル */}
            <div
              className="flex-shrink-0 rounded-xl overflow-hidden"
              style={{ width: '72px', height: '72px', background: item.bg, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
            >
              {item.photo && (
                <img src={item.photo} alt={item.title} className="w-full h-full object-cover" />
              )}
            </div>

            {/* テキスト */}
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.title}
              </p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '4px', fontWeight: 500 }}>{item.location}</p>
            </div>

            {/* いいね数 */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Heart size={14} strokeWidth={1.5} style={{ color: '#e85a5a' }} />
              <span style={{ fontSize: '12px', color: '#aaa', fontWeight: 600 }}>{item.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Clock, X } from 'lucide-react'

const RECENT = [
  '鎌倉',
  '新宿御苑',
]

const SUGGESTIONS = [
  '鎌倉',
  '鎌倉駅',
  '鎌倉海岸',
  '鎌倉 大仏',
  '鎌倉 小町通り',
  '鎌倉 カフェ',
]

export default function SearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSelect = (item) => {
    navigate('/search-results', { state: { query: item } })
  }

  const displayList = query.trim() === ''
    ? { type: 'recent', items: RECENT }
    : { type: 'suggest', items: SUGGESTIONS.filter(s => s.includes(query)) }

  return (
    <div
      className="flex flex-col bg-white"
      style={{ minHeight: '100dvh' }}
    >
      {/* 検索バー行 */}
      <div
        className="flex items-center gap-3 px-4 pb-2"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 44px) + 10px)' }}
      >
        {/* 入力エリア */}
        <div
          className="flex items-center gap-2 flex-1 rounded-2xl px-4 py-3"
          style={{ backgroundColor: '#f0f0ec' }}
        >
          <Search size={16} strokeWidth={1.8} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm text-gray-800 bg-transparent outline-none"
            placeholder="どこへ行きますか？"
          />
          {query.length > 0 && (
            <button onClick={() => setQuery('')} className="flex-shrink-0">
              <X size={15} strokeWidth={2} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* キャンセル */}
        <button
          className="text-sm flex-shrink-0"
          style={{ color: '#7a9e7e' }}
          onClick={() => navigate(-1)}
        >
          キャンセル
        </button>
      </div>

      {/* セクションラベル */}
      <div className="px-5 pt-4 pb-2">
        <span className="text-xs font-medium text-gray-400 tracking-wider uppercase">
          {displayList.type === 'recent' ? '最近の検索' : '候補'}
        </span>
      </div>

      {/* リスト */}
      <ul className="flex-1">
        {displayList.items.map((item, idx) => (
          <li
            key={idx}
            className={`flex items-center gap-4 px-5 py-4 active:bg-gray-50 transition-colors ${
              idx < displayList.items.length - 1 ? 'border-b border-gray-100' : ''
            }`}
            onClick={() => handleSelect(item)}
            role="button"
          >
            {displayList.type === 'recent'
              ? <Clock size={16} strokeWidth={1.5} className="text-gray-400 flex-shrink-0" />
              : <Search size={16} strokeWidth={1.5} className="text-gray-400 flex-shrink-0" />
            }
            <span className="text-sm text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

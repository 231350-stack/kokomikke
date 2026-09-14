import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronRight } from 'lucide-react'
import { PLACES } from '../data/places'
import { getPosts, getCommentText } from '../utils/storage'

/** コメントをリスト用に表示するコンポーネント */
function CommentDisplay({ comment }) {
  if (comment?.type === 'haiku') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {comment.phrases.filter(Boolean).map((phrase, i) => (
          <span
            key={i}
            style={{
              fontSize:      '16px',
              color:         '#1a1a1a',
              lineHeight:    1.6,
              fontFamily:    "'Hiragino Mincho ProN','YuMincho','Yu Mincho',Georgia,serif",
              letterSpacing: '0.05em',
            }}
          >
            {phrase}
          </span>
        ))}
      </div>
    )
  }

  const text = getCommentText(comment)
  return (
    <p style={{
      fontSize:   '14px',
      color:      '#1a1a1a',
      lineHeight: 1.75,
      display:    '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow:   'hidden',
      margin:     0,
    }}>
      {text}
    </p>
  )
}

export default function WordsPage() {
  const navigate  = useNavigate()
  const [query, setQuery] = useState('')

  const allPosts  = [...getPosts(), ...PLACES]
  const q = query.trim()
  const filtered = q
    ? allPosts.filter(post => getCommentText(post.comment).includes(q))
    : allPosts

  return (
    <div style={{ minHeight: 'calc(100dvh - 60px - env(safe-area-inset-bottom, 0px))', backgroundColor: '#f5f0e8' }}>

      {/* ヘッダー + 検索バー */}
      <div style={{ padding: '22px 20px 14px' }}>
        <h1 style={{
          fontSize:      '20px',
          fontWeight:    700,
          color:         '#1a1a1a',
          letterSpacing: '0.03em',
          marginBottom:  '14px',
        }}>
          言葉から探す
        </h1>

        {/* 検索バー */}
        <div style={{
          display:         'flex',
          alignItems:      'center',
          gap:             '8px',
          backgroundColor: '#fff',
          borderRadius:    '14px',
          padding:         '10px 14px',
          boxShadow:       '0 2px 8px rgba(0,0,0,0.07)',
        }}>
          <Search size={16} strokeWidth={2} style={{ color: '#7a9e7e', flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="キーワードで絞り込む"
            style={{
              flex:       1,
              border:     'none',
              outline:    'none',
              fontSize:   '14px',
              color:      '#1a1a1a',
              background: 'transparent',
            }}
          />
          {q && (
            <button
              onClick={() => setQuery('')}
              style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', lineHeight: 1, color: '#ccc' }}
              aria-label="クリア"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* リスト */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px 16px 0 0' }}>
        {filtered.length === 0 && (
          <p style={{ padding: '40px 20px', textAlign: 'center', fontSize: '14px', color: '#bbb' }}>
            該当する投稿が見つかりませんでした
          </p>
        )}
        {filtered.map((post, idx) => (
          <div
            key={post.id}
            role="button"
            onClick={() => navigate('/place-detail', { state: { result: post } })}
            style={{
              display:       'flex',
              alignItems:    'center',
              gap:           '12px',
              padding:       '16px 20px',
              borderBottom:  idx < filtered.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none',
              cursor:        'pointer',
            }}
          >
            {/* 左の色帯：俳句か自由入力かを識別 */}
            <div style={{
              width:           '3px',
              alignSelf:       'stretch',
              borderRadius:    '2px',
              flexShrink:      0,
              backgroundColor: post.comment?.type === 'haiku' ? '#7a9e7e' : '#d0c8b8',
            }} />

            {/* コメント + サブテキスト */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <CommentDisplay comment={post.comment} />
              <p style={{
                fontSize:     '11px',
                color:        '#bbb',
                marginTop:    '6px',
                overflow:     'hidden',
                textOverflow: 'ellipsis',
                whiteSpace:   'nowrap',
              }}>
                {post.title}　{post.location}
              </p>
            </div>

            <ChevronRight size={16} strokeWidth={1.5} style={{ color: '#ccc', flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

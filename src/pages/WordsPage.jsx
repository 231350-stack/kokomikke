import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
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
  const allPosts  = [...getPosts(), ...PLACES]

  return (
    <div style={{ minHeight: 'calc(100dvh - 60px - env(safe-area-inset-bottom, 0px))', backgroundColor: '#f5f0e8' }}>

      {/* ヘッダー */}
      <div style={{ padding: '22px 20px 14px' }}>
        <h1 style={{
          fontSize:      '20px',
          fontWeight:    700,
          color:         '#1a1a1a',
          letterSpacing: '0.03em',
        }}>
          言葉から探す
        </h1>
      </div>

      {/* リスト */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px 16px 0 0' }}>
        {allPosts.map((post, idx) => (
          <div
            key={post.id}
            role="button"
            onClick={() => navigate('/place-detail', { state: { result: post } })}
            style={{
              display:       'flex',
              alignItems:    'center',
              gap:           '12px',
              padding:       '16px 20px',
              borderBottom:  idx < allPosts.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none',
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

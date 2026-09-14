import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, X } from 'lucide-react'
import { PLACES } from '../data/places'
import { getPosts, getCommentText } from '../utils/storage'

/* ─────────────────────────────────────────
   ユーティリティ
───────────────────────────────────────── */

/** 投稿のソート用タイムスタンプ（ms） */
function getTimestamp(post) {
  if (post.isUserPost) return post.id   // Date.now() で生成した数値ID
  const [y, m, d] = post.date.split('.')
  return new Date(+y, +m - 1, +d).getTime()
}

/** 相対時刻表示 */
function formatTime(post) {
  const ts   = getTimestamp(post)
  const diff = Date.now() - ts
  const min  = Math.floor(diff / 60_000)
  if (min < 1)  return 'たった今'
  if (min < 60) return `${min}分前`
  const hr = Math.floor(diff / 3_600_000)
  if (hr < 24)  return `${hr}時間前`
  const day = Math.floor(diff / 86_400_000)
  if (day < 30) return `${day}日前`
  return post.date   // 古い投稿はそのまま日付表示
}

/* ─────────────────────────────────────────
   コメント表示
───────────────────────────────────────── */
function CommentDisplay({ comment }) {
  if (comment?.type === 'haiku') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {comment.phrases.filter(Boolean).map((phrase, i) => (
          <span key={i} style={{
            fontSize:      '17px',
            color:         '#1a1a1a',
            lineHeight:    1.7,
            fontFamily:    "'Hiragino Mincho ProN','YuMincho','Yu Mincho',Georgia,serif",
            letterSpacing: '0.06em',
          }}>
            {phrase}
          </span>
        ))}
      </div>
    )
  }
  return (
    <p style={{
      fontSize:        '14px',
      color:           '#1a1a1a',
      lineHeight:      1.8,
      margin:          0,
      display:         '-webkit-box',
      WebkitLineClamp: 4,
      WebkitBoxOrient: 'vertical',
      overflow:        'hidden',
    }}>
      {getCommentText(comment)}
    </p>
  )
}

/* ─────────────────────────────────────────
   投稿カード
───────────────────────────────────────── */
function PostCard({ post, onTap }) {
  return (
    <div
      onClick={onTap}
      style={{
        backgroundColor: '#fff',
        borderRadius:    '16px',
        padding:         '16px 18px',
        boxShadow:       '0 2px 10px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        cursor:          'pointer',
      }}
    >
      {/* 色帯 + コメント */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{
          width:           '3px',
          alignSelf:       'stretch',
          borderRadius:    '2px',
          flexShrink:      0,
          backgroundColor: post.comment?.type === 'haiku' ? '#7a9e7e' : '#d0c8b8',
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <CommentDisplay comment={post.comment} />
        </div>
      </div>

      {/* 場所・時刻 */}
      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={11} strokeWidth={1.8} style={{ color: '#bbb', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: '#aaa' }}>{post.location}</span>
        </div>
        <span style={{ fontSize: '11px', color: '#ccc' }}>{formatTime(post)}</span>
      </div>

      {/* タグ */}
      {post.tags?.length > 0 && (
        <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {post.tags.map(tag => (
            <span key={tag} style={{
              fontSize:        '11px',
              color:           '#7a9e7e',
              backgroundColor: 'rgba(122,158,126,0.10)',
              border:          '1px solid rgba(93,132,95,0.18)',
              borderRadius:    '999px',
              padding:         '2px 10px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   メイン
───────────────────────────────────────── */
export default function WordsPage() {
  const navigate = useNavigate()
  const [keyword,  setKeyword]  = useState('')
  const [selTag,   setSelTag]   = useState('')   // '' = 全て
  const [locQuery, setLocQuery] = useState('')

  /* 全投稿を新着順にソート（マウント時1回） */
  const allPosts = useMemo(
    () => [...getPosts(), ...PLACES].sort((a, b) => getTimestamp(b) - getTimestamp(a)),
    [],
  )

  /* 全タグの重複除去リスト */
  const allTags = useMemo(
    () => [...new Set(allPosts.flatMap(p => p.tags ?? []))],
    [allPosts],
  )

  /* 絞り込み */
  const kw  = keyword.trim()
  const loc = locQuery.trim()
  const hasFilter = kw || selTag || loc

  const filtered = allPosts.filter(post => {
    if (kw     && !getCommentText(post.comment).includes(kw)) return false
    if (selTag && !(post.tags ?? []).includes(selTag))        return false
    if (loc    && !post.location?.includes(loc))              return false
    return true
  })

  const resetFilters = () => { setKeyword(''); setSelTag(''); setLocQuery('') }

  return (
    <div style={{
      minHeight:       'calc(100dvh - 60px - env(safe-area-inset-bottom, 0px))',
      backgroundColor: '#f5f0e8',
    }}>

      {/* ── フィルターエリア ── */}
      <div style={{ padding: '22px 16px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* タイトル + リセット */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.03em', margin: 0 }}>
            言葉から探す
          </h1>
          {hasFilter && (
            <button
              onClick={resetFilters}
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '3px',
                border:     'none',
                background: 'none',
                cursor:     'pointer',
                fontSize:   '12px',
                color:      '#7a9e7e',
                padding:    '4px 0',
              }}
            >
              <X size={12} strokeWidth={2} />
              絞り込みをリセット
            </button>
          )}
        </div>

        {/* キーワード検索 */}
        <div style={{
          display:         'flex',
          alignItems:      'center',
          gap:             '8px',
          backgroundColor: '#fff',
          borderRadius:    '14px',
          padding:         '10px 14px',
          boxShadow:       '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <Search size={15} strokeWidth={2} style={{ color: '#7a9e7e', flexShrink: 0 }} />
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
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
          {kw && (
            <button
              onClick={() => setKeyword('')}
              aria-label="クリア"
              style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: '#ccc', lineHeight: 1 }}
            >
              ✕
            </button>
          )}
        </div>

        {/* タグフィルター（横スクロール） */}
        <div style={{ overflowX: 'auto', display: 'flex', gap: '8px', paddingBottom: '2px' }}>
          {['', ...allTags].map(t => {
            const isActive = selTag === t
            return (
              <button
                key={t || '__all__'}
                onClick={() => setSelTag(t)}
                style={{
                  flexShrink:      0,
                  padding:         '6px 14px',
                  borderRadius:    '999px',
                  border:          `1px solid ${isActive ? '#7a9e7e' : 'rgba(0,0,0,0.12)'}`,
                  backgroundColor: isActive ? '#7a9e7e' : '#fff',
                  color:           isActive ? '#fff' : '#555',
                  fontSize:        '12px',
                  fontWeight:      500,
                  cursor:          'pointer',
                  whiteSpace:      'nowrap',
                }}
              >
                {t || 'すべて'}
              </button>
            )
          })}
        </div>

        {/* 場所フィルター */}
        <div style={{
          display:         'flex',
          alignItems:      'center',
          gap:             '8px',
          backgroundColor: '#fff',
          borderRadius:    '14px',
          padding:         '10px 14px',
          boxShadow:       '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <MapPin size={15} strokeWidth={2} style={{ color: '#7a9e7e', flexShrink: 0 }} />
          <input
            type="text"
            value={locQuery}
            onChange={e => setLocQuery(e.target.value)}
            placeholder="場所・エリアで絞り込む"
            style={{
              flex:       1,
              border:     'none',
              outline:    'none',
              fontSize:   '14px',
              color:      '#1a1a1a',
              background: 'transparent',
            }}
          />
          {loc && (
            <button
              onClick={() => setLocQuery('')}
              aria-label="クリア"
              style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: '#ccc', lineHeight: 1 }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── 件数 ── */}
      <div style={{ padding: '0 16px 8px' }}>
        <span style={{ fontSize: '12px', color: '#aaa' }}>{filtered.length}件</span>
      </div>

      {/* ── カード一覧 ── */}
      <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.length === 0 ? (
          <p style={{ padding: '40px 0', textAlign: 'center', fontSize: '14px', color: '#bbb' }}>
            該当する投稿が見つかりませんでした
          </p>
        ) : (
          filtered.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onTap={() => navigate('/place-detail', { state: { result: post } })}
            />
          ))
        )}
      </div>
    </div>
  )
}

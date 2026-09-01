const KEY       = 'kokomikke_posts'
const LIKES_KEY = 'kokomikke_likes_v2'

/* 動作確認用：初回アクセス時にデフォルトでいいね済みにするID（OTHER_POSTS のみ） */
const DEFAULT_LIKES = [101, 102, 103]

export function getLikes() {
  if (localStorage.getItem(LIKES_KEY) === null) {
    localStorage.setItem(LIKES_KEY, JSON.stringify(DEFAULT_LIKES))
    return DEFAULT_LIKES
  }
  try { return JSON.parse(localStorage.getItem(LIKES_KEY)) }
  catch { return [] }
}

export function isLiked(id) {
  return getLikes().includes(id)
}

export function toggleLike(id) {
  const likes = getLikes()
  const next  = likes.includes(id)
    ? likes.filter(l => l !== id)
    : [...likes, id]
  localStorage.setItem(LIKES_KEY, JSON.stringify(next))
  return next.includes(id)  // true = いいね済み、false = 解除
}

export function getPosts() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function savePost({ photos, comment, tags, privacy }) {
  const posts = getPosts()
  const now = new Date()
  const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
  const photoList = Array.isArray(photos) ? photos.filter(Boolean) : []
  const post = {
    id:       Date.now(),
    title:    comment?.trim() || '新しい発見',
    comment:  comment ?? '',
    date,
    location: '現在地',
    tags:     tags ?? [],
    privacy:  privacy ?? 'private',
    pos:      [35.320 + (Math.random() - 0.5) * 0.04, 139.548 + (Math.random() - 0.5) * 0.04],
    likes:    0,
    photo:    photoList[0] ?? null,   /* 代表写真（後方互換） */
    photos:   photoList,              /* 全枚数 */
    bg:       'linear-gradient(145deg,#5a7a6a 0%,#7a9a8a 55%,#9ab5a5 100%)',
    washi:    'rgba(122,158,126,0.55)',
    isUserPost: true,
  }
  posts.unshift(post)
  localStorage.setItem(KEY, JSON.stringify(posts))
  return post
}

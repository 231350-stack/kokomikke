/**
 * 他のユーザーの投稿（お気に入りの場所専用）
 * Encyclopedia・地図には表示しない
 * id は PLACES (1〜8) と衝突しないよう 101 以降を使用
 */
export const OTHER_POSTS = [
  {
    id: 101,
    title: '菜の花畑の小道',
    comment:
      '黄色い絨毯の中を歩いていると、時間を忘れてしまいそうになった。春の風が柔らかく、どこまでも続く黄色が眩しかった。',
    date: '2024.03.22',
    location: '神奈川県・大磯',
    tags: ['菜の花', '畑', '春'],
    privacy: 'public',
    pos: [35.307, 139.344],
    likes: 41,
    photo: '/images/other_01.jpg',
    photos: ['/images/other_01.jpg'],
    bg: 'linear-gradient(145deg,#8aaa3a 0%,#b8d060 50%,#d8e890 100%)',
    washi: 'rgba(160,180,60,0.55)',
  },
  {
    id: 102,
    title: '光の降る林道',
    comment:
      '木漏れ日が降り注ぐ静かな林道。朝の空気が澄んでいて、深呼吸するたびに体が軽くなっていくような気がした。',
    date: '2024.04.08',
    location: '神奈川県・丹沢',
    tags: ['林道', '朝', '木漏れ日'],
    privacy: 'public',
    pos: [35.488, 139.196],
    likes: 28,
    photo: '/images/other_02.jpg',
    photos: ['/images/other_02.jpg'],
    bg: 'linear-gradient(145deg,#2a4820 0%,#4a6a3a 50%,#6a8a5a 100%)',
    washi: 'rgba(80,120,60,0.55)',
  },
  {
    id: 103,
    title: '山と空が交わる場所',
    comment:
      '稜線の向こうに空が広がり、どこまでが山でどこからが空なのか分からなくなった。静かに、ただそこに立っていたくなった。',
    date: '2024.09.15',
    location: '長野県・八ヶ岳',
    tags: ['山', '空', '絶景'],
    privacy: 'public',
    pos: [35.980, 138.370],
    likes: 19,
    photo: '/images/other_03.jpg',
    photos: ['/images/other_03.jpg'],
    bg: 'linear-gradient(145deg,#3a5a8a 0%,#5a7aaa 50%,#8ab0d8 100%)',
    washi: 'rgba(80,120,180,0.55)',
  },
]

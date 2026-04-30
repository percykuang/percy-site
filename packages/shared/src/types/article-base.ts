export type ArticleTag = {
  name: string
  slug: string
}

export type ArticleListItem = {
  id: string
  title: string
  category: string
  excerpt: string
  wordCount: number
  publishedAt: string | null
  tags: ArticleTag[]
  createdAt: string
}

export type ArticleDetail = ArticleListItem & {
  content: string
}

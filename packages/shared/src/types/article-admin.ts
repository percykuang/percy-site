import type { PaginatedResult } from './pagination'
import type { ArticleDetail, ArticleListItem, ArticleTag } from './article-base'

export type AdminArticleTag = ArticleTag & {
  id: string
}

export type AdminArticleListItem = ArticleListItem

export type AdminArticle = Omit<ArticleDetail, 'tags'> & {
  tags: AdminArticleTag[]
}

export type AdminArticlesResponse = PaginatedResult<AdminArticleListItem>

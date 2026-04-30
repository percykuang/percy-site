import type { ArticleDetail } from './article-base'

export type PublicArticleDetail = Omit<ArticleDetail, 'content'> & {
  contentHtml: string
}

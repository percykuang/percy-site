import type { ArticleListItem } from '@ps/shared/article'

export async function usePublishedArticles() {
  return useAsyncData(
    'web-published-articles',
    () => webApiFetch<ArticleListItem[]>('/api/articles'),
    {
      default: () => [],
    },
  )
}

ALTER TABLE "Post" RENAME TO "Article";

ALTER TABLE "_PostToTag" RENAME TO "_ArticleToTag";

ALTER TABLE "Article" RENAME CONSTRAINT "Post_pkey" TO "Article_pkey";
ALTER TABLE "Article" RENAME CONSTRAINT "Post_categoryId_fkey" TO "Article_categoryId_fkey";

ALTER INDEX "Post_slug_key" RENAME TO "Article_slug_key";
ALTER INDEX "Post_published_publishedAt_idx" RENAME TO "Article_published_publishedAt_idx";
ALTER INDEX "Post_categoryId_idx" RENAME TO "Article_categoryId_idx";

ALTER TABLE "_ArticleToTag" RENAME CONSTRAINT "_PostToTag_AB_pkey" TO "_ArticleToTag_AB_pkey";
ALTER TABLE "_ArticleToTag" RENAME CONSTRAINT "_PostToTag_A_fkey" TO "_ArticleToTag_A_fkey";
ALTER TABLE "_ArticleToTag" RENAME CONSTRAINT "_PostToTag_B_fkey" TO "_ArticleToTag_B_fkey";

ALTER INDEX "_PostToTag_B_index" RENAME TO "_ArticleToTag_B_index";

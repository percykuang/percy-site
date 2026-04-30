DROP TABLE IF EXISTS "Asset";

CREATE TYPE "ResourceType" AS ENUM ('IMAGE', 'AUDIO', 'VIDEO', 'FILE');

CREATE TYPE "ResourceStatus" AS ENUM ('READY', 'PROCESSING', 'FAILED', 'DELETED');

CREATE TYPE "ResourceRefType" AS ENUM ('ARTICLE_CONTENT', 'ARTICLE_COVER');

CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "status" "ResourceStatus" NOT NULL DEFAULT 'READY',
    "storageKey" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "title" TEXT,
    "alt" TEXT,
    "mimeType" TEXT NOT NULL,
    "extension" TEXT,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "durationMs" INTEGER,
    "coverUrl" TEXT,
    "checksum" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ResourceReference" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "refType" "ResourceRefType" NOT NULL,
    "refId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceReference_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Resource_storageKey_key" ON "Resource"("storageKey");

CREATE INDEX "Resource_type_status_createdAt_idx" ON "Resource"("type", "status", "createdAt");

CREATE INDEX "Resource_createdById_createdAt_idx" ON "Resource"("createdById", "createdAt");

CREATE INDEX "ResourceReference_resourceId_refType_idx" ON "ResourceReference"("resourceId", "refType");

CREATE INDEX "ResourceReference_refType_refId_idx" ON "ResourceReference"("refType", "refId");

CREATE UNIQUE INDEX "ResourceReference_resourceId_refType_refId_key" ON "ResourceReference"("resourceId", "refType", "refId");

ALTER TABLE "Resource"
ADD CONSTRAINT "Resource_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "ResourceReference"
ADD CONSTRAINT "ResourceReference_resourceId_fkey"
FOREIGN KEY ("resourceId") REFERENCES "Resource"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

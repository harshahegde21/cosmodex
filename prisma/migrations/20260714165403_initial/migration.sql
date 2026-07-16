-- AlterTable
ALTER TABLE "users" ADD COLUMN     "experience_level" TEXT,
ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[];

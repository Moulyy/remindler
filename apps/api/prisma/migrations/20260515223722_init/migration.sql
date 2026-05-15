-- CreateEnum
CREATE TYPE "HouseMemberRole" AS ENUM ('owner', 'admin', 'member');

-- CreateEnum
CREATE TYPE "HouseTaskStatus" AS ENUM ('todo', 'in_progress', 'done', 'cancelled', 'blocked');

-- CreateEnum
CREATE TYPE "HouseTaskPriority" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "HouseTaskCategory" AS ENUM ('cleaning', 'shopping', 'admin', 'pet', 'health', 'maintenance', 'cooking', 'finance', 'other');

-- CreateEnum
CREATE TYPE "HouseTaskRecurrenceFrequency" AS ENUM ('none', 'daily', 'weekly', 'monthly');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_credentials" (
    "user_id" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_credentials_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "houses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "houses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "house_members" (
    "id" TEXT NOT NULL,
    "house_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "HouseMemberRole" NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "house_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "house_tasks" (
    "id" TEXT NOT NULL,
    "house_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "HouseTaskStatus" NOT NULL,
    "priority" "HouseTaskPriority" NOT NULL,
    "category" "HouseTaskCategory" NOT NULL,
    "assignee_ids" TEXT[],
    "due_date" TIMESTAMP(3),
    "recurrence_frequency" "HouseTaskRecurrenceFrequency",
    "recurrence_interval" INTEGER,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "house_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "house_members_house_id_user_id_key" ON "house_members"("house_id", "user_id");

-- AddForeignKey
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "houses" ADD CONSTRAINT "houses_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "house_members" ADD CONSTRAINT "house_members_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "houses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "house_members" ADD CONSTRAINT "house_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "house_tasks" ADD CONSTRAINT "house_tasks_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "houses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "house_tasks" ADD CONSTRAINT "house_tasks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

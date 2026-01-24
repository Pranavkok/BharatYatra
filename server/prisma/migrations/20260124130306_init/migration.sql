-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('WAITING', 'PLAYING', 'FINISHED');

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'WAITING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "stars" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameResult" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "winnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

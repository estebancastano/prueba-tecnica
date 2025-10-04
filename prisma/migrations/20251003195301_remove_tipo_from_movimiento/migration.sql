/*
  Warnings:

  - You are about to drop the column `tipo` on the `Movimiento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movimiento" DROP COLUMN "tipo";

-- DropEnum
DROP TYPE "public"."TipoMovimiento";

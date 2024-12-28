/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[price]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `subscriptions_title_key` ON `subscriptions`(`title`);

-- CreateIndex
CREATE UNIQUE INDEX `subscriptions_price_key` ON `subscriptions`(`price`);

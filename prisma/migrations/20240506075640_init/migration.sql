-- DropForeignKey
ALTER TABLE `order_detail` DROP FOREIGN KEY `order_detail_food_id_fkey`;

-- AlterTable
ALTER TABLE `order_detail` MODIFY `food_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `order_detail` ADD CONSTRAINT `order_detail_food_id_fkey` FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

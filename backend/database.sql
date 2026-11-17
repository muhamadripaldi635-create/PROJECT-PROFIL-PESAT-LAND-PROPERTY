-- ============================================================
-- Database Schema & Seed Data for Pesat Land Property
-- Database Name: pesat_land
-- ============================================================

CREATE DATABASE IF NOT EXISTS `pesat_land` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `pesat_land`;

-- ------------------------------------------------------------
-- Table structure for `properties`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `inquiries`;
DROP TABLE IF EXISTS `properties`;

CREATE TABLE `properties` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(15, 2) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `property_type` ENUM('Tanah', 'Rumah', 'Ruko', 'Villa') NOT NULL DEFAULT 'Tanah',
  `land_area` INT NOT NULL COMMENT 'dalam m2',
  `building_area` INT DEFAULT 0 COMMENT 'dalam m2, 0 jika hanya tanah',
  `bedrooms` INT DEFAULT 0,
  `bathrooms` INT DEFAULT 0,
  `status` ENUM('Tersedia', 'Terjual', 'Booking') NOT NULL DEFAULT 'Tersedia',
  `image_url` VARCHAR(500) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table structure for `inquiries`
-- ------------------------------------------------------------
CREATE TABLE `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `property_id` INT NOT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('Baru', 'Diproses', 'Selesai') DEFAULT 'Baru',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Seed Data for `properties`
-- ------------------------------------------------------------
INSERT INTO `properties` (`title`, `description`, `price`, `location`, `property_type`, `land_area`, `building_area`, `bedrooms`, `bathrooms`, `status`, `image_url`) VALUES
(
  'Kavling Strategis Pesat Eco Green Park',
  'Kavling siap bangun di kawasan perumahan bernuansa asri dan bebas banjir. Lokasi sangat dekat dengan gerbang tol dan pusat perbelanjaan. Cocok untuk hunian maupun investasi jangka panjang.',
  350000000.00,
  'Sentul, Bogor',
  'Tanah',
  120,
  0,
  0,
  0,
  'Tersedia',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'
),
(
  'Rumah Modern Minimalis Pesat Hills Cluster',
  'Hunian 2 lantai berkonsep tropis modern. Dilengkapi smart home system, keamanan 24 jam, clubhouse, dan area hijau yang luas. Siap huni dengan garasi 2 mobil.',
  1250000000.00,
  'BSD City, Tangerang Selatan',
  'Rumah',
  90,
  110,
  3,
  2,
  'Tersedia',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80'
),
(
  'Ruko Komersial 3 Lantai Pesat Boulevard',
  'Ruko premium di jalan utama ramai pengunjung. Ideal untuk restoran, kantor cabang, bank, atau showroom. Parkir sangat luas dan keamanan 24 jam.',
  2800000000.00,
  'Cibubur, Depok',
  'Ruko',
  75,
  210,
  0,
  3,
  'Tersedia',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80'
),
(
  'Luxury Villa Pesat Mountain Resort',
  'Villa mewah dengan pemandangan gunung spektakuler dan udara sejuk. Dilengkapi private pool, infinity garden, serta fasilitas resort bintang lima.',
  3450000000.00,
  'Puncak, Bogor',
  'Villa',
  500,
  320,
  4,
  4,
  'Tersedia',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80'
),
(
  'Tanah Kavling Komersial Hook Pesat Grand City',
  'Kavling sudut hook sangat potensial untuk pembangunan ruko atau gedung perkantoran 4 lantai. Akses jalan lebar 12 meter.',
  850000000.00,
  'Bandung Kota, Jawa Barat',
  'Tanah',
  250,
  0,
  0,
  0,
  'Tersedia',
  'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1000&q=80'
),
(
  'Rumah Asri Minimalis Type 45 Pesat Residence',
  'Rumah tinggal nyaman 1 lantai tipe 45 dengan halaman depan dan belakang yang cukup luas. Cocok untuk keluarga muda.',
  620000000.00,
  'Cikarang, Bekasi',
  'Rumah',
  72,
  45,
  2,
  1,
  'Booking',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80'
);

-- ------------------------------------------------------------
-- Seed Data for `inquiries`
-- ------------------------------------------------------------
INSERT INTO `inquiries` (`property_id`, `customer_name`, `email`, `phone`, `message`, `status`) VALUES
(1, 'Budi Santoso', 'budi@example.com', '081234567890', 'Saya tertarik dengan Kavling Pesat Eco Green Park. Bisakah dijadwalkan survey lokasi weekend ini?', 'Baru'),
(2, 'Siti Nurhaliza', 'siti@example.com', '085678901234', 'Apakah rumah Pesat Hills Cluster bisa KPR bank mana saja?', 'Diproses');

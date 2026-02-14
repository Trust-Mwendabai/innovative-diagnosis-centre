<?php
include_once __DIR__ . '/../config/database.php';

try {
    echo "Starting blog schema update...\n";

    // 1. Add missing columns to blog_posts
    $conn->exec("ALTER TABLE blog_posts 
        ADD COLUMN IF NOT EXISTS excerpt TEXT AFTER title,
        ADD COLUMN IF NOT EXISTS category VARCHAR(100) AFTER excerpt,
        ADD COLUMN IF NOT EXISTS read_time VARCHAR(50) AFTER category,
        ADD COLUMN IF NOT EXISTS image VARCHAR(255) AFTER featured_image");
    
    echo "Blog table columns updated successfully.\n";

    // 2. Map existing featured_image to image if needed (or just use both)
    // For now, let's ensure 'image' column is populated if featured_image is
    $conn->exec("UPDATE blog_posts SET image = featured_image WHERE image IS NULL AND featured_image IS NOT NULL");

    echo "Migration completed successfully.\n";
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
?>

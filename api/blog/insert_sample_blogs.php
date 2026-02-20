<?php
include_once __DIR__ . '/../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

try {
    $blogs = [
        [
            'title' => 'Understanding Your Blood Test Results',
            'excerpt' => 'A comprehensive guide to interpreting your lab reports and what those numbers actually mean for your health.',
            'content' => 'Full blood count (FBC) is one of the most common tests. It measures different types of cells in your blood, including red blood cells, white blood cells, and platelets. Low red blood cell count (anemia) can cause fatigue, while high white blood cell count might indicate an infection. This guide helps you navigate the complex terminology used in diagnostic reports.',
            'image' => 'https://images.unsplash.com/photo-1579152276506-53b64f351337?q=80&w=2070&auto=format&fit=crop',
            'author_id' => 1,
            'category' => 'Education',
            'status' => 'published',
            'read_time' => '5 min',
            'slug' => 'understanding-blood-test-results'
        ],
        [
            'title' => 'The Importance of Annual Diagnostic Screenings',
            'excerpt' => 'Why regular checkups are the secret to long-term wellness and early detection of potential health risks.',
            'content' => 'Preventative healthcare is always better than reactive treatment. Annual screenings can detect chronic conditions like diabetes, hypertension, and high cholesterol long before symptoms appear. At IDC, we use state-of-the-art diagnostic tools to provide a clear picture of your internal health architecture.',
            'image' => 'https://images.unsplash.com/photo-1576091160550-217359971f8b?q=80&w=2070&auto=format&fit=crop',
            'author_id' => 1,
            'category' => 'Wellness',
            'status' => 'published',
            'read_time' => '4 min',
            'slug' => 'importance-of-annual-screenings'
        ],
        [
            'title' => 'Preparing for Your Ultrasound: What to Expect',
            'excerpt' => 'Everything you need to know about preparing for an imaging session, from fasting requirements to clothing choices.',
            'content' => 'Ultrasound imaging uses sound waves to create pictures of the inside of the body. It is safe, non-invasive, and does not use radiation. Depending on the type of scan, you might need to drink several glasses of water or fast for 8-12 hours. This article provides a step-by-step preparation list for our patients.',
            'image' => 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop',
            'author_id' => 1,
            'category' => 'Tips',
            'status' => 'published',
            'read_time' => '3 min',
            'slug' => 'preparing-for-your-ultrasound'
        ]
    ];

    $stmt = $conn->prepare("INSERT INTO blog_posts (title, excerpt, content, image, author_id, category, status, read_time, slug, created_at) VALUES (:title, :excerpt, :content, :image, :author_id, :category, :status, :read_time, :slug, NOW())");

    $count = 0;
    foreach ($blogs as $blog) {
        $stmt->execute($blog);
        $count++;
    }

    echo json_encode([
        "success" => true,
        "message" => "Successfully inserted $count sample blog posts."
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error inserting sample blogs: " . $e->getMessage()
    ]);
}
?>

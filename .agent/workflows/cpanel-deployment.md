---
description: How to deploy the IDC Patient Portal to cPanel
---

### Prerequisites
- cPanel Hosting with MySQL support
- FTP or File Manager access
- Node.js installed locally (for building)

### Deployment Steps

1. **Build the Frontend**
   // turbo
   Run `npm run build` in the project root. This creates a `dist` directory.

2. **Prepare the Backend**
   - Navigate to `api/config/database.php`.
   - Update the `$is_production` block with your cPanel database credentials:
     - `db_name`: Your cPanel database name (usually `username_dbname`)
     - `username`: Your cPanel database user
     - `password`: Your database user password

3. **Upload Files**
   - Connect to your server via cPanel File Manager or FTP.
   - Upload all files from the `dist` directory to your `public_html` (or the target subdomain root).
   - Upload the `api` directory to the same location, so the path is `public_html/api`.

4. **Initialize Database**
   - Open phpMyAdmin in cPanel.
   - Select your new database.
   - Import the `database.sql` file (if provided) or create the necessary tables.

5. **Verify Configuration**
   - Visit your domain.
   - Try to log in or register to test API and Database connectivity.
   - Check the browser console for any CORS or 404 errors.

### Troubleshooting
- **404 on Refresh**: Ensure you have an `.htaccess` file in `public_html` to handle SPA routing:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```
- **CORS Errors**: Check `api/config/cors.php` and ensure it allows your domain.

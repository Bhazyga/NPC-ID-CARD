import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Custom plugin to generate static route directories (/ceo, /director, /cfo, /generator)
 * plus .htaccess and _redirects in dist/ so uploading dist/ to any domain/hosting works immediately.
 */
function staticRoutesPlugin() {
  return {
    name: 'generate-static-routes',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const indexHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) return;

      const htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');
      const routes = ['ceo', 'director', 'cfo', 'generator'];

      routes.forEach((route) => {
        const routeDir = path.join(distDir, route);
        fs.mkdirSync(routeDir, { recursive: true });
        fs.writeFileSync(path.join(routeDir, 'index.html'), htmlContent, 'utf-8');
      });

      // Apache / cPanel .htaccess fallback
      const htaccess = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
`;
      fs.writeFileSync(path.join(distDir, '.htaccess'), htaccess, 'utf-8');

      // Netlify / Cloudflare Pages _redirects fallback
      const redirects = `/*    /index.html   200\n`;
      fs.writeFileSync(path.join(distDir, '_redirects'), redirects, 'utf-8');
    },
  };
}

export default defineConfig({
  plugins: [react(), staticRoutesPlugin()],
});

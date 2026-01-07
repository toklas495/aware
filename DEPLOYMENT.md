# Deployment Guide

This guide covers different deployment options for Aware.

## Table of Contents
- [Vercel (Recommended)](#vercel-recommended)
- [Docker](#docker)
- [Other Platforms](#other-platforms)

## Vercel (Recommended)

Vercel is the easiest way to deploy Aware with zero configuration.

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free tier is fine)

### Steps

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Vercel will auto-detect the `vercel.json` config
   - Click "Deploy"

3. **That's it!** Your app is live.

### Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

## Docker

Deploy Aware anywhere Docker runs (VPS, cloud providers, etc.).

### Build and Run

```bash
# Build image
docker build -t aware:latest .

# Run container
docker run -d \
  --name aware-app \
  -p 8080:80 \
  --restart unless-stopped \
  aware:latest
```

### Using Docker Compose

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart
```

### Docker Hub Deployment

```bash
# Tag image
docker tag aware:latest yourusername/aware:latest

# Push to Docker Hub
docker push yourusername/aware:latest

# Pull and run on server
docker pull yourusername/aware:latest
docker run -d -p 8080:80 yourusername/aware:latest
```

### Reverse Proxy (Nginx Example)

If you want to use a reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Other Platforms

### Netlify

1. Push to Git
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add `_redirects` file in `public/`:
   ```
   /*    /index.html   200
   ```

### GitHub Pages

1. Install `gh-pages`: `npm install --save-dev gh-pages`
2. Add to `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/aware",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run: `npm run deploy`

### Cloudflare Pages

1. Push to Git
2. Connect to Cloudflare Pages
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Root directory: `/`

### AWS S3 + CloudFront

1. Build: `npm run build`
2. Upload `dist/` to S3 bucket
3. Enable static website hosting
4. Configure CloudFront with S3 origin
5. Set error document to `index.html`

### Railway

1. Push to Git
2. Connect to Railway
3. Railway will detect Dockerfile automatically
4. Deploy!

### Render

1. Push to Git
2. Create new Static Site
3. Build command: `npm run build`
4. Publish directory: `dist`

## Environment Variables

**No environment variables needed!** Aware runs 100% client-side with localStorage.

All data is stored in the user's browser - no backend required.

## Post-Deployment

After deployment:
1. ✅ Test the app loads correctly
2. ✅ Test routing (try different pages)
3. ✅ Test light/dark mode toggle
4. ✅ Verify data persists (localStorage works)
5. ✅ Check mobile responsiveness

## Troubleshooting

### Vercel
- **404 on refresh**: Make sure `vercel.json` has the rewrite rule
- **Build fails**: Check Node.js version (should be 20+)

### Docker
- **Container won't start**: Check logs with `docker logs aware-app`
- **Port conflict**: Change port mapping: `-p 3000:80`

### General
- **Routing issues**: Ensure SPA routing is configured (all routes → index.html)
- **Assets not loading**: Check base path in vite.config.ts if using subdirectory

## Performance Tips

1. **Enable Gzip/Brotli compression** (usually automatic on platforms)
2. **Use CDN** (automatic on Vercel/Netlify)
3. **Enable caching** (already configured in `vercel.json`)
4. **Optimize images** if you add any (not currently used)

---

Need help? Check the [README.md](README.md) or open an issue.


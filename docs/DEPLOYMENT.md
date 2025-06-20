# Deployment Guide

## Environment Setup

### Required Environment Variables

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hopebites

# JWT
JWT_SECRET=your_super_secure_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_client_secret
PAYPAL_MODE=live

# Security
BCRYPT_ROUNDS=12
CLIENT_URL=https://yourdomain.com
```

## Heroku Deployment

### 1. Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Login and Create App
```bash
heroku login
heroku create hope-bites-app
```

### 3. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
# ... set all other environment variables
```

### 4. Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 5. Scale and Open
```bash
heroku ps:scale web=1
heroku open
```

## Vercel Deployment

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Create vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
```

### 3. Deploy
```bash
vercel --prod
```

## DigitalOcean App Platform

### 1. Create App Spec
```yaml
name: hope-bites
services:
- name: api
  source_dir: /
  github:
    repo: your-username/hope-bites
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URI
    value: your_mongodb_uri
    type: SECRET
  # Add all other environment variables
```

### 2. Deploy via CLI
```bash
doctl apps create --spec app.yaml
```

## Docker Deployment

### 1. Create Dockerfile
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

USER node

CMD ["npm", "start"]
```

### 2. Create docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/hopebites
    depends_on:
      - mongo
    
  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### 3. Build and Run
```bash
docker-compose up -d
```

## AWS EC2 Deployment

### 1. Launch EC2 Instance
- Choose Ubuntu 20.04 LTS
- Select t2.micro (free tier)
- Configure security groups (ports 22, 80, 443, 5000)

### 2. Connect and Setup
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### 3. Deploy Application
```bash
# Clone repository
git clone https://github.com/your-username/hope-bites.git
cd hope-bites

# Install dependencies
npm install

# Create .env file with production variables
nano .env

# Start with PM2
pm2 start server.js --name "hope-bites"
pm2 startup
pm2 save
```

### 4. Configure Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Database Setup

### MongoDB Atlas (Recommended)
1. Create cluster at https://cloud.mongodb.com
2. Create database user
3. Whitelist IP addresses
4. Get connection string

### Self-hosted MongoDB
```bash
# Install MongoDB
sudo apt-get install -y mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## Monitoring and Logging

### PM2 Monitoring
```bash
pm2 monit
pm2 logs hope-bites
```

### Log Rotation
```bash
pm2 install pm2-logrotate
```

### Health Checks
```bash
# Add to crontab
*/5 * * * * curl -f http://localhost:5000/api/health || pm2 restart hope-bites
```

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure environment variables
- [ ] Enable firewall (UFW on Ubuntu)
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Use strong passwords and keys
- [ ] Enable 2FA on all accounts
- [ ] Regular backups

## Performance Optimization

### 1. Enable Compression
Already implemented in server.js with compression middleware.

### 2. Static File Caching
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Indexing
Ensure proper indexes are created for frequently queried fields.

### 4. CDN Setup
Consider using CloudFlare or AWS CloudFront for static assets.

## Backup Strategy

### Database Backup
```bash
# MongoDB backup
mongodump --uri="your_mongodb_uri" --out=/backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGO_URI" --out="/backup/$DATE"
find /backup -type d -mtime +7 -exec rm -rf {} \;
```

### File Backup
```bash
# Backup application files
tar -czf /backup/app_$DATE.tar.gz /path/to/app
```

## Troubleshooting

### Common Issues

1. **Port already in use**
```bash
sudo lsof -i :5000
sudo kill -9 PID
```

2. **Permission denied**
```bash
sudo chown -R $USER:$USER /path/to/app
```

3. **MongoDB connection issues**
- Check connection string
- Verify network access
- Check firewall settings

4. **SSL certificate issues**
```bash
sudo certbot renew --dry-run
```

### Log Locations
- Application logs: `~/.pm2/logs/`
- Nginx logs: `/var/log/nginx/`
- System logs: `/var/log/syslog`
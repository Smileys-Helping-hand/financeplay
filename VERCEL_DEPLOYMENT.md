# 🚀 Vercel Deployment Guide - Production Ready

Your ecosystem is ready for production on Vercel with domain: **xpfinance.co.za**

---

## 📊 Vercel Projects Setup

### **1. financeplay** (Main App)
- **Domain:** xpfinance.co.za
- **Type:** Next.js Frontend
- **Redeploy on:** Changes to frontend/

### **2. second-brain** (Ecosystem Hub)
- **Domain:** second-brain.xpfinance.co.za
- **Type:** Node.js + Express Backend
- **Redeploy on:** Changes to src/

### **3. lifestack** (Lifestyle App - Optional)
- **Domain:** life.xpfinance.co.za
- **Type:** Next.js
- **Status:** Ready to connect

### **4. healthstack** (Health App - Optional)
- **Domain:** health.xpfinance.co.za
- **Type:** Next.js
- **Status:** Ready to connect

---

## 🔑 API Keys Setup

### Generate Production Keys:
```bash
cd k:\Projects\second-brain
npx ts-node src/scripts/generate-production-keys.ts
```

This will output:
- ✅ Master API Key (SB-MRAAZ-...)
- ✅ Master Secret (keep safe!)
- ✅ Individual app keys
- ✅ Environment variable templates

---

## 🔧 Add to Vercel Environment Variables

### **financeplay Project**

Go to: Vercel → financeplay → Settings → Environment Variables

Add these variables:

```
ECOSYSTEM_MASTER_API_KEY = SB-MRAAZ-[your-generated-key]
ECOSYSTEM_API_URL = https://second-brain.xpfinance.co.za
FINANCEPLAY_API_KEY = FINANCEPLAY-MRAAZ-[your-generated-key]
NEXT_PUBLIC_API_URL = https://api.xpfinance.co.za
NEXT_PUBLIC_SECOND_BRAIN_URL = https://second-brain.xpfinance.co.za
DATABASE_URL = [your-database-url]
OPENAI_API_KEY = [your-openai-api-key]
```

**Apply to:** Production & Preview

---

### **second-brain Project**

Go to: Vercel → second-brain → Settings → Environment Variables

Add these variables:

```
MASTER_TOKEN_SECRET = [32-byte-hex-from-generation]
ECOSYSTEM_MASTER_API_KEY = SB-MRAAZ-[your-generated-key]
NODE_ENV = production
PORT = 3000
CORS_ORIGIN = https://xpfinance.co.za,https://app.xpfinance.co.za,https://second-brain.xpfinance.co.za,https://life.xpfinance.co.za,https://health.xpfinance.co.za
```

**Apply to:** Production & Preview

---

### **lifestack Project** (if deploying)

```
ECOSYSTEM_MASTER_API_KEY = SB-MRAAZ-[your-generated-key]
ECOSYSTEM_API_URL = https://second-brain.xpfinance.co.za
LIFESTACK_API_KEY = LIFESTACK-MRAAZ-[your-generated-key]
DATABASE_URL = [your-database-url]
```

---

### **healthstack Project** (if deploying)

```
ECOSYSTEM_MASTER_API_KEY = SB-MRAAZ-[your-generated-key]
ECOSYSTEM_API_URL = https://second-brain.xpfinance.co.za
HEALTHSTACK_API_KEY = HEALTHSTACK-MRAAZ-[your-generated-key]
DATABASE_URL = [your-database-url]
```

---

## 🌐 Domain Configuration

### DNS Records for xpfinance.co.za

In your domain registrar, point these to Vercel:

```
CNAME Records:
xpfinance.co.za → cname.vercel-dns.com
app.xpfinance.co.za → cname.vercel-dns.com
second-brain.xpfinance.co.za → cname.vercel-dns.com
life.xpfinance.co.za → cname.vercel-dns.com
health.xpfinance.co.za → cname.vercel-dns.com
```

**Vercel will auto-generate the exact CNAME values**

---

## ✅ Deployment Checklist

### Before Deploying:

- [ ] Generate production API keys (run generate-production-keys.ts)
- [ ] Copy all environment variables
- [ ] Add variables to Vercel projects
- [ ] Update DNS records for xpfinance.co.za
- [ ] Test API keys work
- [ ] Verify CORS origins are correct

### Deployment Order:

1. **Deploy second-brain FIRST** (backend must be ready)
2. **Deploy financeplay** (frontend)
3. **Deploy lifestack** (if ready)
4. **Deploy healthstack** (if ready)

### After Deploying:

- [ ] Test each endpoint responds
- [ ] Verify SSL certificates auto-installed
- [ ] Check admin panel works
- [ ] Test smart receipts
- [ ] Test JARVIS commands
- [ ] Test cross-app communication
- [ ] Monitor logs for errors

---

## 🧪 Test Your Deployment

### Test Second Brain:
```bash
curl https://second-brain.xpfinance.co.za/api/admin/master-key
```

Expected: Returns your master API key

### Test Admin Panel:
```
https://xpfinance.co.za/admin/ecosystem
```

Expected: Shows connected apps, master key, status

### Test JARVIS Command:
In app, say: "Log 500 at coffee"

Expected: Transaction created + synced to ecosystem

### Test API:
```bash
curl -H "x-master-api-key: SB-MRAAZ-..." \
  https://second-brain.xpfinance.co.za/api/admin/apps
```

Expected: Returns list of connected apps

---

## 🔒 Production Security

### Required:

- ✅ All API keys in Vercel env vars (NOT in code)
- ✅ HTTPS enabled (Vercel auto-enables)
- ✅ CORS configured for your domains only
- ✅ Master secret NOT exposed
- ✅ Database credentials in env vars
- ✅ OpenAI key in env vars
- ✅ Rate limiting on critical endpoints
- ✅ Error messages don't leak data

### Key Rotation:

- Rotate keys every 90 days
- Update Vercel env vars
- Redeploy all projects
- Update .env files locally

---

## 📊 Monitoring & Health Checks

### Health Endpoints:

```bash
# FinancePlay health
curl https://xpfinance.co.za/health

# Second Brain health
curl https://second-brain.xpfinance.co.za/health

# Ecosystem status
curl -H "x-master-api-key: YOUR-KEY" \
  https://second-brain.xpfinance.co.za/api/admin/status

# Connected apps
curl -H "x-master-api-key: YOUR-KEY" \
  https://second-brain.xpfinance.co.za/api/admin/apps
```

### Vercel Dashboard:

- Monitor deployments → Logs
- Check analytics → Performance
- View environment variables
- Check SSL certificates
- Monitor uptime

---

## 🚨 Common Issues

### "Cannot reach API"
- Wait 30 mins for DNS propagation
- Check env vars are set
- Verify domain DNS records
- Check CORS configuration

### "Unauthorized"
- Verify API key spelling
- Check key in env vars
- Regenerate if needed
- Restart deployment

### "CORS Error"
- Add domain to CORS_ORIGIN
- Clear browser cache
- Check domain is propagated

### "Apps not showing"
- Verify all use same master key
- Check ECOSYSTEM_API_URL
- Check app status in admin panel

---

## 📈 Scaling Tips

**As you grow:**

- Use database instead of in-memory
- Add Redis for caching
- Use CDN for static assets
- Monitor API latency
- Set up alerts in Vercel

---

## 📚 Quick Links

| Resource | URL |
|----------|-----|
| Vercel Docs | https://vercel.com/docs |
| Your Admin Panel | https://xpfinance.co.za/admin/ecosystem |
| API Status | https://second-brain.xpfinance.co.za/health |
| Ecosystem Setup | See: ECOSYSTEM_COMPLETE_SETUP.md |

---

## 🎊 Production Status

✅ Apps ready for Vercel
✅ API keys ready
✅ Environment template ready
✅ Domain configured
✅ SSL/TLS auto-enabled
✅ Monitoring configured
✅ Security checklist ready

**Next Step:** Run key generation and add to Vercel! 🚀

Domain: **xpfinance.co.za**
Backend: **second-brain.xpfinance.co.za**
Status: **Ready for Production** ✅


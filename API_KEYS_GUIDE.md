# 🔐 API Keys Guide - Understanding Your Ecosystem Keys

Your API keys now include your username for easy identification across dashboards!

---

## 🔑 Key Format Explained

### Master API Key Format
```
SB-{USERNAME}-{TIMESTAMP}-{RANDOM}
Example: SB-MRAAZ-1abcd2ef-x9y8z7w6v5u4t3s2r1q0
         ↑      ↑       ↑        ↑
       Prefix  Your   Time    Random
               Name   Stamp    Bits
```

**Parts:**
- `SB` = Second Brain (ecosystem hub)
- `MRAAZ` = Your username (easy to identify)
- `1abcd2ef` = Timestamp (version tracking)
- `x9y8z7...` = Random bits (security)

---

### App-Specific Key Format
```
{APPNAME}-{USERNAME}-{TIMESTAMP}-{RANDOM}
Example: FINANCEPLAY-MRAAZ-1abcd2ef-x9y8z7w6v5u4t3s2r1
         ↑             ↑       ↑        ↑
       App Name    Your   Time    Random
                   Name   Stamp   Bits
```

**Examples:**
- `FINANCEPLAY-MRAAZ-...` = FinancePlay's key
- `LIFESTACK-MRAAZ-...` = LifeStack's key
- `HEALTHSTACK-MRAAZ-...` = HealthStack's key

---

## 📊 Why This Matters

### Admin Dashboard Integration

When an admin dashboard picks up your API keys, it can:

✅ **Identify the owner:** See `MRAAZ` in the key → "This is Mraaz's ecosystem"
✅ **Track versions:** See timestamp → know when key was generated
✅ **Identify apps:** See `FINANCEPLAY`, `LIFESTACK` → know which app it belongs to
✅ **Enable auto-provisioning:** Parse key → auto-add to app without manual entry

### Example: Admin Dashboard Reading Your Keys

```typescript
// Admin dashboard parses your key
const key = "FINANCEPLAY-MRAAZ-1abcd2ef-x9y8z7w6v5u4t3s2r1";
const parts = key.split('-');

const appName = parts[0];      // "FINANCEPLAY"
const username = parts[1];     // "MRAAZ"
const timestamp = parts[2];    // "1abcd2ef"
const randomBits = parts[3];   // "x9y8z7w6v5u4t3s2r1"

// Display to admin
console.log(`${appName} API Key for user ${username}`);
// Output: "FINANCEPLAY API Key for user MRAAZ"
```

---

## 🚀 How to Generate Your Keys

### Step 1: Run Key Generation Script
```bash
cd k:\Projects\second-brain
npx ts-node src/scripts/generate-production-keys.ts
```

### Step 2: Copy Output

The script outputs all your keys in organized format:

```
MASTER API KEY (for all apps):
SB-MRAAZ-1abcd2ef-x9y8z7w6v5u4t3s2r1q0

MASTER SECRET (keep safe!):
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

APP-SPECIFIC API KEYS:

FinancePlay:
  API Key: FINANCEPLAY-MRAAZ-1abcd2ef-x9y8z7w6v5u4t3s2r1

LifeStack:
  API Key: LIFESTACK-MRAAZ-1abcd2ef-x9y8z7w6v5u4t3s2r1

HealthStack:
  API Key: HEALTHSTACK-MRAAZ-1abcd2ef-x9y8z7w6v5u4t3s2r1
```

### Step 3: Save Securely

**DO:**
- ✅ Save to password manager
- ✅ Store in secure .env files (not committed)
- ✅ Use for environment variables
- ✅ Rotate every 90 days

**DON'T:**
- ❌ Share publicly
- ❌ Commit to git
- ❌ Put in comments
- ❌ Share in Slack/Discord

---

## 🔧 Using Your Keys

### Master Key (SB-MRAAZ-...)

Use for:
- Admin operations
- Ecosystem configuration
- App registration
- Key regeneration

**Example:**
```bash
curl -H "x-master-api-key: SB-MRAAZ-..." \
  http://localhost:3000/api/admin/apps
```

---

### App Keys (FINANCEPLAY-MRAAZ-...)

Use for:
- App identification
- Per-app operations
- Isolated permissions
- App-to-app calls

**Example:**
```bash
curl -H "x-app-api-key: FINANCEPLAY-MRAAZ-..." \
  http://localhost:3005/api/config
```

---

## 🌐 Vercel Environment Variables

### Structure

```
Project: financeplay
  ECOSYSTEM_MASTER_API_KEY = SB-MRAAZ-...
  FINANCEPLAY_API_KEY = FINANCEPLAY-MRAAZ-...
  ECOSYSTEM_API_URL = https://second-brain.xpfinance.co.za

Project: second-brain
  ECOSYSTEM_MASTER_API_KEY = SB-MRAAZ-...
  MASTER_TOKEN_SECRET = [your-secret]
  NODE_ENV = production

Project: lifestack
  ECOSYSTEM_MASTER_API_KEY = SB-MRAAZ-...
  LIFESTACK_API_KEY = LIFESTACK-MRAAZ-...
  ECOSYSTEM_API_URL = https://second-brain.xpfinance.co.za

Project: healthstack
  ECOSYSTEM_MASTER_API_KEY = SB-MRAAZ-...
  HEALTHSTACK_API_KEY = HEALTHSTACK-MRAAZ-...
  ECOSYSTEM_API_URL = https://second-brain.xpfinance.co.za
```

---

## 📋 Key Rotation Schedule

### Every 90 Days:

**Step 1:** Generate new keys
```bash
npx ts-node src/scripts/generate-production-keys.ts
```

**Step 2:** Update Vercel environment variables
- Update each project with new keys
- Trigger redeployment

**Step 3:** Update local .env files
```
ECOSYSTEM_MASTER_API_KEY=SB-MRAAZ-[NEW-KEY]
FINANCEPLAY_API_KEY=FINANCEPLAY-MRAAZ-[NEW-KEY]
```

**Step 4:** Restart all apps

**Step 5:** Verify in admin panel

---

## 🔒 Security Best Practices

### Protect Your Master Key

**Master Key:** `SB-MRAAZ-...`
- ⚠️ **MOST SENSITIVE** - Controls entire ecosystem
- Share ONLY with trusted applications
- Never in client-side code
- Only in server-side environment variables
- Regenerate if compromised

### App Keys

**Example:** `FINANCEPLAY-MRAAZ-...`
- ⚠️ Less sensitive than master key
- Scoped to specific app
- Can be app-specific
- Still keep in environment variables
- Regenerate if compromised

### Master Secret

**`a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`**
- ⚠️ **EXTREMELY SENSITIVE** - Used for JWT signing
- NEVER share
- NEVER commit
- ONLY in server environment variables
- Keep in secure vault

---

## ✅ Checklist

Before deploying to production:

- [ ] Generated production keys with `generate-production-keys.ts`
- [ ] Keys include your username (MRAAZ)
- [ ] Stored all keys securely (password manager)
- [ ] Added to Vercel environment variables
- [ ] Tested keys work in each app
- [ ] Verified admin dashboard shows keys correctly
- [ ] Planned 90-day rotation schedule
- [ ] Set calendar reminder for key rotation

---

## 📊 Monitoring Your Keys

### Check Key Usage

```bash
# Get all app keys and their status
curl -H "x-master-api-key: SB-MRAAZ-..." \
  http://localhost:3000/api/admin/apps
```

Response shows:
- Which apps have which keys
- When keys were generated
- Last active timestamp
- Key format validation

### Verify Key Format

Your keys should:
- ✅ Start with correct prefix (SB-, FINANCEPLAY-, etc.)
- ✅ Include your username (MRAAZ)
- ✅ Have timestamp component
- ✅ Have random security bits
- ✅ Be 60+ characters long

### Detect Compromised Keys

If you suspect a key is compromised:

1. Regenerate immediately
2. Update Vercel environment variables
3. Redeploy all apps
4. Monitor logs for suspicious activity
5. Check admin dashboard for unauthorized access

---

## 🎯 Key Management Summary

| Key | Usage | Security | Rotation |
|-----|-------|----------|----------|
| **Master Key** (SB-MRAAZ-...) | Admin ops | CRITICAL | 90 days |
| **App Keys** (FINANCEPLAY-MRAAZ-...) | App ops | HIGH | 90 days |
| **Master Secret** (a1b2c3...) | JWT signing | CRITICAL | 90 days |

---

## 🚀 Next Steps

1. **Generate production keys:**
   ```bash
   npx ts-node src/scripts/generate-production-keys.ts
   ```

2. **Add to Vercel:**
   - Copy keys from output
   - Add to each project's environment variables
   - Trigger redeploy

3. **Verify in admin panel:**
   - Visit `/admin/ecosystem`
   - See master key with your name
   - See all connected apps

4. **Test cross-app commands:**
   - Say "Log 500 at coffee" in FinancePlay
   - Verify transaction appears
   - Check other apps get notified

---

**Your username:** MRAAZ  
**Your domain:** xpfinance.co.za  
**Status:** Ready for production! 🚀

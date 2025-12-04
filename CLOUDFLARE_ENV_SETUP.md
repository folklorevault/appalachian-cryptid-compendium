# Cloudflare Pages Environment Variables Setup

## The Problem
Environment variables in Cloudflare Pages need to be set in a specific way for Vite apps to read them properly.

## Critical Details

### Variable Name (MUST BE EXACT)
```
VITE_MAPBOX_TOKEN
```

**Important**:
- ✅ Must start with `VITE_` prefix
- ✅ All uppercase
- ✅ Underscore between VITE and MAPBOX
- ❌ NOT `MAPBOX_TOKEN`
- ❌ NOT `VITE_MAPBOX_API_KEY`
- ❌ NOT `Vite_Mapbox_Token`

### Where to Set It in Cloudflare Pages

**Step-by-step**:

1. **Go to Cloudflare Dashboard**
   - Navigate to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Click **Workers & Pages** in the left sidebar

2. **Select Your Project**
   - Click on your project name (probably `cryptid-directory` or `appalachiancryptid`)

3. **Go to Settings**
   - Click the **Settings** tab at the top

4. **Navigate to Environment Variables**
   - In the left sidebar under Settings, click **Environment variables**

5. **Add the Variable**
   - Click **Add variable** button (or **Add variables** if this is your first one)
   - **Variable name**: `VITE_MAPBOX_TOKEN`
   - **Value**: Your Mapbox token (starts with `pk.`)
   - **Environment**: Select both **Production** and **Preview** (or just Production)
   - Click **Save**

6. **Redeploy**
   - Go to **Deployments** tab
   - Click **Retry deployment** on the latest deployment
   - OR make a new git commit and push to trigger a new deployment

## Common Mistakes to Avoid

### ❌ Mistake #1: Wrong Location
Don't add it under:
- Account-level variables
- Worker scripts
- R2 buckets
- D1 databases

✅ **Correct**: Under your specific **Pages project** → Settings → Environment variables

### ❌ Mistake #2: Wrong Variable Name
```bash
MAPBOX_TOKEN=pk.xxx           # ❌ Missing VITE_ prefix
MAPBOX_API_TOKEN=pk.xxx       # ❌ Wrong name
Vite_Mapbox_Token=pk.xxx      # ❌ Wrong case
```

✅ **Correct**:
```bash
VITE_MAPBOX_TOKEN=pk.xxx      # ✅ Exact match
```

### ❌ Mistake #3: Not Redeploying
Environment variables are **only** applied during build time for Vite apps.

You MUST redeploy after adding the variable.

### ❌ Mistake #4: Adding Quotes
```bash
VITE_MAPBOX_TOKEN="pk.xxx"    # ❌ Don't add quotes
VITE_MAPBOX_TOKEN='pk.xxx'    # ❌ Don't add quotes
```

✅ **Correct**:
```bash
VITE_MAPBOX_TOKEN=pk.xxx      # ✅ No quotes
```

## Verifying It's Working

### Method 1: Check the Build Logs
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **View build logs**
4. Search for "VITE_MAPBOX_TOKEN"
5. You should see it referenced (but not the actual value)

### Method 2: Check Browser Console
1. Visit your site
2. Go to `/map` page
3. Open browser console (F12)
4. Look for these errors:

**If token is missing**:
```
"Mapbox token not configured. Please add VITE_MAPBOX_TOKEN to your .env file."
```

**If token is working**:
- No error about missing token
- Map should load
- Markers should appear

### Method 3: Test in Preview
You can also test this in a preview deployment before affecting production:

1. Create a test branch
2. Make a small change (add a space somewhere)
3. Push to trigger preview deployment
4. Check if map works on preview URL

## Production vs Preview Environments

Cloudflare Pages allows different variables for different environments:

- **Production**: Used for your main domain (appalachiancryptid.com)
- **Preview**: Used for preview deployments (branch deploys)

**Best practice**: Add the same Mapbox token to both environments so the map works in previews too.

## Screenshot Guide

Here's what you're looking for in the Cloudflare dashboard:

```
Cloudflare Dashboard
└── Workers & Pages
    └── [Your Project Name]
        └── Settings (tab)
            └── Environment variables (sidebar)
                └── [Add variable button]
                    ├── Variable name: VITE_MAPBOX_TOKEN
                    ├── Value: pk.your_actual_token
                    └── Environment: ☑ Production ☑ Preview
```

## Local Development

For local development, add to `.env` file:

```bash
# .env (in project root)
VITE_MAPBOX_TOKEN=pk.your_mapbox_token_here
```

Then restart your dev server:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

## Troubleshooting

### "I added it but map still doesn't work"

**Checklist**:
1. ✅ Variable name is exactly `VITE_MAPBOX_TOKEN`?
2. ✅ Added to **Pages project** (not Workers or account-level)?
3. ✅ Redeployed after adding?
4. ✅ No quotes around the value?
5. ✅ Token starts with `pk.`?
6. ✅ Checked correct environment (Production vs Preview)?

### "Map works locally but not in production"

This confirms the variable isn't set correctly in Cloudflare:
1. Double-check the variable name
2. Make sure it's in the correct project
3. Redeploy
4. Clear browser cache
5. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### "I don't see Environment Variables in Settings"

Make sure you're looking at a **Pages project**, not a Worker or D1 database.

Path should be: **Workers & Pages** → **[Project Name]** → **Settings** → **Environment variables**

## Build-Time vs Runtime Variables

**Important**: Vite variables (VITE_*) are **build-time** variables.

This means:
- ✅ They're embedded in your JavaScript during build
- ✅ They're safe to use in client-side code (they're public)
- ❌ They DON'T change without a redeploy
- ❌ They CAN'T be secret (they're in the browser code)

This is why Mapbox uses public tokens (`pk.*`) that are safe to expose.

## Quick Reference Card

```bash
# What to add in Cloudflare Pages
Variable name: VITE_MAPBOX_TOKEN
Value: pk.eyJ1IjoieW91cnVzZXIiLCJhIjoiY...
Environment: Production + Preview
Location: Workers & Pages → [Project] → Settings → Environment variables

# Then redeploy!
```

## Still Having Issues?

If the map still doesn't work after following these steps:

1. **Share the exact error** from browser console
2. **Verify variable** is showing in Cloudflare dashboard
3. **Check deployment logs** for any build errors
4. **Test locally** to confirm it's a Cloudflare config issue

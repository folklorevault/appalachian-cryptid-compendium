# Mapbox Integration Setup & Troubleshooting Guide

## Current Status
Your Mapbox implementation is **code-complete** and properly structured. The map just needs a valid Mapbox token to work.

## Quick Setup (5 minutes)

### Step 1: Get a Free Mapbox Token

1. Go to [https://account.mapbox.com/](https://account.mapbox.com/)
2. Sign up for a free account (no credit card required)
3. After logging in, navigate to **Access Tokens**
4. Copy your **Default public token** (starts with `pk.`)

**Note**: Mapbox offers 50,000 free map loads per month, which is more than enough for most sites.

### Step 2: Add Token to Your Project

**For Local Development:**
1. Open the `.env` file in your project root
2. Replace the empty value with your token:
   ```
   VITE_MAPBOX_TOKEN=pk.your_actual_token_here
   ```
3. Save the file
4. Restart your dev server: `npm run dev`

**For Production (Cloudflare Pages):**
1. Go to your Cloudflare Pages dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `VITE_MAPBOX_TOKEN`
   - **Value**: Your Mapbox token
   - **Environment**: Production (and Preview if desired)
5. Click **Save**
6. Redeploy your site

### Step 3: Test the Map

1. Visit `/map` on your site
2. You should see:
   - An interactive map centered on Appalachia
   - Colored markers for each cryptid location
   - Navigation controls in the top-right
   - Click markers to see cryptid details

## What Your Map Does

Your implementation includes:

✅ **Custom styled markers** - Color-coded by danger level:
- 🔴 Red = High danger
- 🟠 Orange = Medium danger
- 🟢 Green = Low danger

✅ **Interactive features**:
- Click markers to select a cryptid
- Hover effects on markers
- Smooth fly-to animations
- Navigation controls (zoom, pitch, rotation)
- Sidebar with cryptid details

✅ **Cryptid locations** currently mapped:
- Mothman (Point Pleasant, WV)
- Wampus Cat (Eastern Tennessee)
- Moon-Eyed People (Cherokee National Forest, NC)
- Skunk Ape (Everglades, FL)
- Lizard Man (Scape Ore Swamp, SC)
- Fouke Monster (Fouke, AR)
- Tailypo (Blue Ridge Mountains, VA)
- Grafton Monster (Grafton, WV)
- White Screamer (Alabama)

## Troubleshooting Common Issues

### Issue: "Mapbox token not configured" error

**Solution**:
- Make sure `.env` file exists in project root
- Token must start with `pk.`
- No quotes around the token value
- Restart dev server after adding token

### Issue: Map shows but no markers appear

**Check**:
1. Open browser console (F12)
2. Look for JavaScript errors
3. Verify cryptid locations exist in `cryptidLocations` object in `src/pages/Map.tsx`

**Fix**: The code already handles missing locations gracefully by skipping them.

### Issue: Map loads but is blank/gray

**Possible causes**:
1. **Invalid token** - Double-check you copied the full token
2. **Token restrictions** - Make sure your token allows your domain
3. **Network error** - Check browser console for API errors

**Solution**:
- Go to Mapbox dashboard → Access Tokens
- Click your token
- Under "Token restrictions", make sure your domain is allowed
- Or use a token without URL restrictions for development

### Issue: Map works locally but not in production

**Solution**:
1. Verify environment variable is set in Cloudflare Pages
2. Variable name must be exactly: `VITE_MAPBOX_TOKEN`
3. Redeploy after adding the environment variable
4. Clear browser cache

### Issue: Console error "accessToken must be set"

**Solution**: This means the token isn't being read from environment variables.
- Check spelling: `VITE_MAPBOX_TOKEN` (not `MAPBOX_TOKEN`)
- Must have `VITE_` prefix for Vite to expose it
- Restart dev server after changes

### Issue: Map is slow or laggy

**Optimization**:
Your current implementation is already optimized with:
- Marker reuse (not recreating on every render)
- Cleanup on unmount
- Efficient event listeners

**Additional optimization** (if needed):
- Reduce initial zoom level
- Disable pitch if not needed
- Use simpler map style: `mapbox://styles/mapbox/streets-v12`

## Environment Variables Explained

```bash
# .env file structure

# This is a PUBLIC token - safe to expose in client-side code
VITE_MAPBOX_TOKEN=pk.your_token_here

# The VITE_ prefix is required for Vite to include it in the build
# Without VITE_, the variable won't be accessible via import.meta.env
```

## Adding New Cryptid Locations

To add a new cryptid to the map:

1. Open `src/pages/Map.tsx`
2. Find the `cryptidLocations` object (around line 12)
3. Add your cryptid:

```typescript
const cryptidLocations: Record<string, { lat: number; lng: number }> = {
  // ... existing locations
  "your-cryptid-id": { lat: 35.1234, lng: -82.5678 },
};
```

4. Make sure the ID matches the cryptid ID in your data

**Finding coordinates**:
- Use [Google Maps](https://maps.google.com) - right-click location → "What's here?"
- Use [LatLong.net](https://www.latlong.net/)
- Format: latitude first, then longitude

## Security Notes

✅ **Public token is safe**: Mapbox public tokens (pk.*) are designed to be exposed
✅ **Domain restrictions**: You can restrict tokens to specific domains in Mapbox dashboard
✅ **Rate limiting**: Mapbox automatically rate-limits based on your account tier
✅ **No sensitive data**: The map only shows data you've already made public

## API Costs & Limits

**Free Tier** (Mapbox):
- 50,000 map loads/month
- Unlimited markers and interactions
- All map styles included
- No credit card required

**When you might need paid**:
- Over 50,000 monthly map views
- Need advanced features (directions, geocoding, etc.)

## Advanced Customization

Your map is built with Mapbox GL JS. You can customize:

### Change map style:
```typescript
style: "mapbox://styles/mapbox/satellite-v9"  // Satellite view
style: "mapbox://styles/mapbox/dark-v11"      // Dark mode
style: "mapbox://styles/mapbox/light-v11"     // Light mode
```

### Adjust initial view:
```typescript
center: [-84.5, 35.5],  // [longitude, latitude]
zoom: 5,                // Zoom level (0-22)
pitch: 30,              // Tilt angle (0-60)
```

### Custom marker styles:
Edit the marker styling in the `el.style.cssText` section (line 83-92)

## Next Steps

Once your token is added:
1. ✅ Map will load automatically
2. ✅ All cryptid markers will appear
3. ✅ Users can interact with the map
4. ✅ Production deployment will work

## Getting Help

If you encounter issues not covered here:

1. **Browser Console**: Check for specific error messages
2. **Mapbox Documentation**: [docs.mapbox.com](https://docs.mapbox.com/)
3. **Test token**: Try with a fresh token to rule out token issues
4. **Network tab**: Check if API requests are being blocked

## Files Modified/Created

- ✅ `src/pages/Map.tsx` - Map implementation (already complete)
- ✅ `.env` - Environment variables (created - needs your token)
- ✅ `.env.example` - Template for others (already exists)
- ✅ This guide - Setup instructions

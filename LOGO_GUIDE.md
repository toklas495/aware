# Logo Image Requirements Guide

This guide specifies exactly what logo images you need to generate for the Aware application.

## 📋 Required Images Summary

You need to generate **6 images** total:

1. **favicon.svg** - SVG format (scalable, recommended)
2. **favicon.ico** - ICO format (16x16, 32x32, 48x48 combined)
3. **favicon-96x96.png** - PNG format, 96x96 pixels
4. **apple-touch-icon.png** - PNG format, 180x180 pixels
5. **web-app-manifest-192x192.png** - PNG format, 192x192 pixels
6. **web-app-manifest-512x512.png** - PNG format, 512x512 pixels

---

## 🎨 Image Specifications

### 1. **favicon.svg** (PRIMARY - Most Important)
- **Format**: SVG (Scalable Vector Graphics)
- **Size**: Vector (scales to any size)
- **Background**: Transparent or transparent background
- **Colors**: Should work on both light and dark backgrounds
- **Usage**: Modern browsers, favicon, UI logo display
- **Recommended**: Use this as your source file - it's the most important!

### 2. **favicon.ico** (Legacy Browser Support)
- **Format**: ICO (Windows icon format)
- **Sizes**: Multiple sizes in one file (16x16, 32x32, 48x48)
- **Background**: Transparent or solid color
- **Usage**: Old browsers, Windows shortcuts
- **Tools**: Use online converter from PNG/SVG to ICO

### 3. **favicon-96x96.png** (Standard Favicon)
- **Format**: PNG
- **Size**: Exactly 96x96 pixels
- **Background**: Transparent recommended
- **Usage**: Browser tab icon, bookmarks
- **Quality**: High resolution, sharp edges

### 4. **apple-touch-icon.png** (iOS Home Screen)
- **Format**: PNG
- **Size**: Exactly 180x180 pixels
- **Background**: 
  - **Option A**: Transparent (iOS will add rounded corners automatically)
  - **Option B**: Solid color with rounded corners (iOS won't modify)
- **Usage**: When users add app to iPhone/iPad home screen
- **Design**: Should look good as a square icon (iOS adds rounded corners)

### 5. **web-app-manifest-192x192.png** (Android Small)
- **Format**: PNG
- **Size**: Exactly 192x192 pixels
- **Background**: 
  - **Recommended**: Transparent or solid color
  - Should have safe zone (10% padding) - keep important content in center 80%
- **Usage**: Android home screen, PWA icon (small)
- **Design**: "Maskable" - important content in center, safe zone around edges

### 6. **web-app-manifest-512x512.png** (Android Large / PWA)
- **Format**: PNG
- **Size**: Exactly 512x512 pixels
- **Background**: 
  - **Recommended**: Transparent or solid color
  - Should have safe zone (10% padding) - keep important content in center 80%
- **Usage**: Android home screen, PWA splash screen, app stores
- **Design**: "Maskable" - important content in center, safe zone around edges
- **Quality**: Highest quality needed

---

## 🎯 Background Recommendations

### **For Transparent Background:**
✅ **Best Choice** - Works everywhere, flexible
- Use transparent PNG
- Logo should work on both light (#fafafa) and dark (#0a0a0a) backgrounds
- Consider a subtle stroke/outline if logo might blend with background

### **For Solid Background:**
⚠️ **Alternative** - Less flexible but can look cleaner
- Use your brand color or app theme color
- Light mode: #fafafa (light gray)
- Dark mode: #0a0a0a (near black)
- Consider generating versions for both light/dark if needed

---

## 📐 Safe Zone Guide (for Maskable Icons)

For the two manifest PNGs (192x192 and 512x512), keep this in mind:

```
┌─────────────────────────┐
│  SAFE ZONE (10% margin) │ ← Keep important content here
│  ┌───────────────────┐  │
│  │                   │  │
│  │   MAIN CONTENT    │  │ ← Your logo/text
│  │                   │  │
│  └───────────────────┘  │
│  SAFE ZONE (10% margin) │
└─────────────────────────┘
```

- **Safe zone**: 80% of the image (center area)
- **Margin**: 10% on all sides
- This prevents Android from clipping your logo when applying mask/shape

---

## 🛠️ Generation Tools & Tips

### Recommended Tools:
1. **Figma** - Design SVG, export all sizes
2. **Adobe Illustrator** - Professional vector design
3. **Canva** - Easy online tool
4. **Favicon.io** - Generate all sizes from one image
5. **RealFaviconGenerator** - Online favicon generator

### Workflow:
1. **Start with SVG** - Design your logo in vector format
2. **Export SVG** - Save as `favicon.svg`
3. **Export PNGs** - Generate all PNG sizes from SVG
4. **Convert to ICO** - Use online converter for favicon.ico
5. **Test** - Check how they look in browser tabs, mobile home screens

---

## ✅ Checklist

- [ ] favicon.svg (vector, any size, transparent)
- [ ] favicon.ico (16x16, 32x32, 48x48 combined)
- [ ] favicon-96x96.png (96x96px, transparent recommended)
- [ ] apple-touch-icon.png (180x180px, transparent or rounded)
- [ ] web-app-manifest-192x192.png (192x192px, with safe zone)
- [ ] web-app-manifest-512x512.png (512x512px, with safe zone)

---

## 🎨 Design Tips for Aware

Since your app is:
- **Privacy-first**
- **Calm & minimal**
- **Dark/Light mode support**

Consider:
1. **Simple, geometric shapes** - Clean and professional
2. **Monochrome or subtle colors** - Fits calm aesthetic
3. **Works at small sizes** - Should be recognizable at 16x16
4. **Symbolic** - Represents awareness, observation, reflection

---

## 📍 Where to Place Files

All images go in the `/public` folder:

```
/public/
  ├── favicon.svg
  ├── favicon.ico
  ├── favicon-96x96.png
  ├── apple-touch-icon.png
  ├── web-app-manifest-192x192.png
  └── web-app-manifest-512x512.png
```

---

## 🧪 Testing

After generating images:
1. Replace files in `/public` folder
2. Run `npm run dev`
3. Check browser tab - should show your favicon
4. Check on mobile - add to home screen, test icons
5. Test in both light and dark mode

---

**Questions?** Make sure your logo:
- ✅ Looks good at 16x16 pixels (very small!)
- ✅ Works on both light and dark backgrounds
- ✅ Is centered in the safe zone for maskable icons
- ✅ Represents your "aware" brand clearly

Good luck with your logo! 🎨


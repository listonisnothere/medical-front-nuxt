# Image Generation Prompts — MedCore Group

Generate each image with ChatGPT (DALL·E) using the prompt below. Save the output to the specified path in `public/`.

Brand reference: primary color `#1f5fbf` (mid-blue), accent `#3b82f6`, background white `#ffffff`. Company name: **MedCore Group**. Kazakh medical equipment supplier.

---

## 1. `public/og-default.jpg`

**Size:** 1200 × 630 px  
**Format:** JPEG  
**Purpose:** Default Open Graph / Twitter Card preview image shown when any page is shared on social media or in messengers.

**Prompt:**
> A clean, professional Open Graph banner image for a medical equipment company called "MedCore Group". Wide landscape format (1200x630). Dark navy-to-blue gradient background (#1a3a6b to #1f5fbf). On the left side, the company logo text "MedCore Group" in bold white modern sans-serif font, with a subtle medical cross icon above it in light blue. On the right side, a flat-style illustration of high-end medical devices arranged neatly: an ultrasound machine, a patient monitor, and an MRI silhouette — all in white and light blue tones on the dark background. Bottom strip reads "Медицинское оборудование в Казахстане" in white, small font. No stock-photo realism — use clean vector-like flat illustration style. No people, no clutter.

---

## 2. `public/icon-192.png`

**Size:** 192 × 192 px  
**Format:** PNG (transparent background)  
**Purpose:** PWA app icon shown on Android home screens and in browser install prompts.

**Prompt:**
> A square app icon for a medical equipment company "MedCore Group". 192x192 pixels. Rounded square shape with a solid blue background (#1f5fbf). Centered: a bold white letter "M" in a clean geometric sans-serif font with a thin medical cross (+) integrated into the top-right of the letter as a superscript element, in light blue (#3b82f6). The icon should look crisp, minimal, and professional — similar in style to corporate health-tech app icons. No gradients, no drop shadows. Flat design.

---

## 3. `public/icon-512.png`

**Size:** 512 × 512 px  
**Format:** PNG (transparent background)  
**Purpose:** Large PWA icon used by browsers and operating systems for high-DPI displays.

**Prompt:**
> Same as the 192x192 app icon but at 512x512 pixels, higher detail allowed. A square app icon for "MedCore Group" medical equipment company. Solid blue background (#1f5fbf) with a bold white "M" in a geometric sans-serif font. A small medical cross symbol (+) in light blue (#3b82f6) is placed to the upper-right of the M. Clean, flat design, no gradients, professional health-tech aesthetic.

---

## 4. `public/icon-512-maskable.png`

**Size:** 512 × 512 px  
**Format:** PNG (no transparency — solid background required)  
**Purpose:** PWA "maskable" icon — Android may crop this into a circle, squircle, or other shape. The icon's key content must fit inside the **central 75% safe zone** (approximately 384×384 px inner area).

**Prompt:**
> A square 512x512 app icon for "MedCore Group" with a solid (non-transparent) blue background (#1f5fbf) that fills the entire canvas edge-to-edge — no rounded corners in the source file. Centered in the middle 75% of the canvas (leaving generous blue padding on all sides): a bold white "M" in a geometric sans-serif font with a small light-blue medical cross symbol (+) at the upper-right of the letter. The design must look good when cropped into a circle. Flat design, no shadows, no gradients.

---

## Checklist

- [ ] `public/og-default.jpg` — 1200×630 JPEG
- [ ] `public/icon-192.png` — 192×192 PNG
- [ ] `public/icon-512.png` — 512×512 PNG
- [ ] `public/icon-512-maskable.png` — 512×512 PNG (solid background, content in center 75%)

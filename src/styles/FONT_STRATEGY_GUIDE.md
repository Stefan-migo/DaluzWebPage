# 🎨 DA LUZ CONSCIENTE - FONT STRATEGY GUIDE

## 📊 **COMPLETE FONT SYSTEM**

Your project now has a **professional 4-font typography system** that covers all use cases:

---

## 🎯 **FONT HIERARCHY**

### **1. 🎭 DISPLAY (Malisha) - Brand Identity**
```css
Use: Hero titles, logos, decorative elements, special callouts
Class: .font-display | font-display
Variable: var(--font-display)
Example: Main homepage hero "DA LUZ CONSCIENTE"
```

### **2. 📖 TITLE (VELISTA) - Section Headers**
```css
Use: Page titles, section headers, elegant headings
Class: .font-title | font-title  
Variable: var(--font-title)
Example: "NUESTROS SERVICIOS", "LÍNEA ECOS"
```

### **3. 📰 SUBTITLE (Playfair Display) - Content Headers**
```css
Use: Article titles, card headers, subsection headings
Class: .font-subtitle | font-subtitle
Variable: var(--font-subtitle)
Example: Blog post titles, product names
```

### **4. 💬 TEXT (Inter) - Body Content**
```css
Use: Paragraphs, forms, buttons, navigation, UI elements
Class: .font-text | font-text
Variable: var(--font-text)
Example: Body paragraphs, form inputs, button text
```

### **5. 🏷️ CAPTION (Inter) - Small Text**
```css
Use: Captions, labels, metadata, small descriptions
Class: .font-caption | font-caption
Variable: var(--font-caption)
Example: Image captions, form labels, dates
```

---

## 💻 **HOW TO USE IN CODE**

### **React/TSX Components**
```tsx
// Hero section with display font
<h1 className="font-display text-6xl text-white">
  DA LUZ CONSCIENTE
</h1>

// Section title with VELISTA
<h2 className="font-title text-4xl text-brand-primary">
  NUESTROS SERVICIOS
</h2>

// Article heading
<h3 className="font-subtitle text-2xl text-gray-800">
  Los Beneficios de la Alkimia Natural
</h3>

// Body text
<p className="font-text text-base text-gray-600">
  Nuestros productos están cuidadosamente elaborados...
</p>

// Caption text
<span className="font-caption text-sm text-gray-500">
  Publicado el 15 de enero de 2024
</span>
```

### **CSS Variables**
```css
.custom-hero {
  font-family: var(--font-display);
  font-size: 4rem;
}

.custom-section-title {
  font-family: var(--font-title);
  font-size: 2.5rem;
}
```

---

## 🎨 **AUTOMATIC ELEMENT STYLING**

Your HTML elements now have **automatic font assignment**:

```html
<h1><!-- Uses VELISTA automatically --></h1>
<h2><!-- Uses VELISTA automatically --></h2>
<h3><!-- Uses Playfair Display automatically --></h3>
<h4><!-- Uses Playfair Display automatically --></h4>
<h5><!-- Uses Inter (bold) automatically --></h5>
<h6><!-- Uses Inter (bold) automatically --></h6>
<p> <!-- Uses Inter automatically --></p>
```

---

## 📋 **USAGE GUIDELINES**

### **DO ✅**
- Use **Malisha** for brand moments and hero elements
- Use **VELISTA** for important section headers
- Use **Playfair Display** for content headings
- Use **Inter** for all body text and UI elements
- Maintain consistent font pairings

### **DON'T ❌**
- Mix too many fonts in one component
- Use display fonts for body text
- Use body fonts for important headings
- Override the hierarchy without good reason

---

## 🚀 **PERFORMANCE OPTIMIZED**

Your fonts are already optimized:
- ✅ `font-display: swap` for fast loading
- ✅ Google Fonts with Next.js optimization
- ✅ Proper fallback fonts for each family
- ✅ CSS variables for consistent usage

---

## 🌟 **BRAND CONSISTENCY**

This system ensures:
- **Consistent** visual hierarchy
- **Professional** typography throughout
- **Brand-aligned** custom font usage
- **Accessible** fallback fonts
- **Performance** optimized loading

---

## 📝 **QUICK REFERENCE**

```
🎭 Malisha (Display)     → Brand moments, heroes
📖 VELISTA (Title)       → Section headers
📰 Playfair (Subtitle)   → Content headings  
💬 Inter (Text)          → Body content, UI
🏷️ Inter (Caption)       → Small text, labels
```

**Your 4-font system is perfect for a professional website!** 🎉

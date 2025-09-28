# 🏠 Ai Nostri - Platformă pentru Diaspora Românească din Franța

> **Platformă de anunțuri pentru diaspora românească** - Configurată cu Firebase și optimizată pentru producție

## 🎯 **Context și Public Țintă**

**Ai Nostri** este o platformă de anunțuri clasificate dedicată **românilor și moldovenilor din Franța**. Platforma facilitează schimbul de bunuri și servicii în cadrul diasporei, cu focus pe:

- 🏠 **Imobiliare** în orașele franceze cu comunități românești
- 🚗 **Vehicule** de la proprietari români care se întorc în țară
- 📱 **Electronice** și bunuri personale
- 🪑 **Mobilier românesc** adus din țară
- 👕 **Haine tradiționale** pentru evenimente culturale
- ⚽ **Articole sportive** pentru pasionații de fotbal

## 🛠️ **Stack Tehnologic**

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui + Lucide React
- **Validation**: Zod
- **Database**: Mock Repository (Firebase pregătit pentru migrare)
- **Authentication**: Mock Context (Firebase Auth pregătit)
- **Deployment**: Vercel Ready

## ✨ **Funcționalități Implementate (100% Mock)**

### 🏠 **Homepage (`/`) - ISR + SEO**
- ✅ **Server Component** cu ISR (revalidate = 60s)
- ✅ **generateMetadata()** dinamic pentru SEO
- ✅ **Paginare** cu `?page=1` + "Load more"
- ✅ **Filtre integrate** în hero section peste imagine
- ✅ **Grid responsive** 4 coloane (XL), 3 (LG), 2 (MD), 1 (SM)
- ✅ **Cache headers** via middleware (s-maxage=60, stale-while-revalidate=300)
- ✅ **Skeleton loading** pentru UX îmbunătățit

### 📝 **Publicare Anunț (`/new`) - Protected Route**
- ✅ **ProtectedRoute** - doar utilizatori autentificați
- ✅ **ImageUploader Mock** - validare URL-uri (jpg|jpeg|png|webp)
- ✅ **Validare Zod** completă cu server actions
- ✅ **Rate limiting** - max 3 anunțuri / 5 min / user (in-memory)
- ✅ **Redirect** la `/listing/[slug]` după publicare
- ✅ **TODO Cloudflare Turnstile** placeholder pentru anti-spam

### 🔍 **Detaliu Anunț (`/listing/[slug]`) - SEO Optimizat**
- ✅ **Slug-uri SEO** - `${slugify(title)}-${id}` format
- ✅ **generateMetadata()** dinamic cu OpenGraph
- ✅ **JSON-LD Rich Snippets** - Product + Offer schema
- ✅ **ISR** cu revalidate = 60s
- ✅ **Galerie imagini** cu Next/Image optimizat
- ✅ **Skeleton loading** pentru UX premium
- ✅ **Galerie imagini** cu Next.js Image optimizat
- ✅ **Informații complete**: preț, descriere, categorie, locație
- ✅ **Meta informații** și SEO dinamic
- ✅ **Sidebar contact** și acțiuni

### 🔐 **Autentificare Mock (`/login`, `/account`)**
- ✅ **AuthContext** cu mock users (email/password + Google)
- ✅ **ProtectedRoute** HOC pentru rute protejate
- ✅ **Profil utilizator** editabil (nume, telefon)
- ✅ **Logout** funcțional cu redirect
- ✅ **AuthHeader** dinamic în navbar

### 👨‍💼 **Admin Panel (`/admin/moderation`) - Mock**
- ✅ **Sistem moderare** - ascunde/afișează/șterge anunțuri
- ✅ **Filtrare** după status (all/active/hidden/reported)
- ✅ **Mock admin actions** cu feedback vizual
- ✅ **Rate limiting** verificare pentru utilizatori
- ✅ **TODO Firebase** - verificare roluri reale

## 🚀 **Cum să Rulezi Proiectul**

### 1. **Clonare și Instalare**
```bash
git clone <repo-url>
cd annonces-app
npm install
```

### 2. **Rulare în Dezvoltare**
```bash
npm run dev
# sau
yarn dev
# sau
pnpm dev
```

### 3. **Acces Aplicație**
- **Homepage**: http://localhost:3000
- **Publicare anunț**: http://localhost:3000/new (necesită login mock)
- **Login**: http://localhost:3000/login
- **Admin**: http://localhost:3000/admin/moderation (necesită login)

### 4. **Date Mock Disponibile**
- **6 categorii**: Imobiliare, Vehicule, Electronice, Casa & Grădina, Modă, Sport
- **8 locații**: Paris, Lyon, Marseille, Toulouse, Nice, Strasbourg, Bordeaux, Lille
- **6 anunțuri demo** cu conținut contextual pentru diaspora
- **Mock users** pentru testare autentificare

## 🛠 Tehnologii Utilizate

- **Next.js 15** - Framework React cu App Router și Server Components
- **TypeScript** - Tipare statică pentru cod robust
- **TailwindCSS v4** - Framework CSS utility-first
- **shadcn/ui** - Componente UI moderne și accesibile
- **Firebase** - Backend complet (temporar dezactivat - folosim date mock)
- **Zod** - Validare schema pentru formulare
- **Lucide React** - Iconițe moderne și consistente

## 📁 Structura Proiectului

```
src/
├── app/
│   ├── actions/
│   │   └── listings.ts          # Server actions pentru anunțuri
│   ├── listing/
│   │   └── [id]/
│   │       └── page.tsx         # Pagina detaliu anunț
│   ├── new/
│   │   └── page.tsx             # Pagina publicare anunț
│   ├── globals.css              # Stiluri globale + Tailwind
│   ├── layout.tsx               # Layout principal cu navbar
│   └── page.tsx                 # Pagina principală cu listare
├── components/
│   ├── ui/
│   │   └── button.tsx           # Componenta Button (shadcn/ui)
│   ├── AdCard.tsx               # Card pentru anunțuri
│   ├── Filters.tsx              # Componenta de filtrare
│   └── ImageUploader.tsx        # Upload imagini
├── lib/
│   ├── firebase.ts              # Configurare Firebase (dezactivat)
│   ├── firestore.ts             # Funcții CRUD (implementare mock)
│   └── utils.ts                 # Utilitare generale
```

## 🚀 Instalare și Configurare

### 1. **Clonare și Instalare**
```bash
git clone <repository-url>
cd ai-nostri-annonces-app
npm install
```

### 2. **Configurare Environment Variables**
Creează un fișier `.env.local` în root:
```bash
# Firebase Configuration (momentan dezactivat)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 3. **Rulare în Dezvoltare**
```bash
npm run dev
```
Aplicația va fi disponibilă la `http://localhost:3000`

### 4. **Build pentru Producție**
```bash
npm run build
npm start
```

## 📊 Performanță și Optimizări

### **Server-Side Rendering (SSR)**
- ✅ **ISR cu revalidare 60s** pentru pagini dinamice
- ✅ **Static Generation** pentru componente statice
- ✅ **Server Components** pentru performanță optimă

### **Optimizări Imagini**
- ✅ **Next.js Image** cu format WebP/AVIF automat
- ✅ **Lazy loading** și **responsive sizing**
- ✅ **Placeholder blur** pentru UX îmbunătățit

### **Indexuri Firestore Recomandate**
```javascript
// Pentru când Firebase va fi activat
collections.listings.indexes = [
  { fields: ['categoryId', 'createdAt'], order: 'desc' },
  { fields: ['locationId', 'createdAt'], order: 'desc' },
  { fields: ['price'], order: 'asc' },
  { fields: ['price'], order: 'desc' },
  { fields: ['status', 'createdAt'], order: 'desc' }
];
```

## 🎨 Design System

### **Paleta de Culori**
- **Verde Principal**: `#347433` - Elemente principale și branding
- **Galben Accent**: `#FFC107` - Highlight-uri și call-to-action secundare  
- **Portocaliu CTA**: `#FF6F3C` - Butoane principale și acțiuni importante
- **Roșu Accent**: `#B22222` - Alerte și elemente de atenție

### **Componente UI**
- **Navbar elegant** cu glassmorphism și gradient logo
- **Cards responsive** cu hover effects și shadow transitions
- **Formulare validate** cu feedback în timp real
- **Filtre interactive** cu URL sync și persistență

## 🔧 Funcționalități Viitoare

### **Autentificare**
- [ ] Firebase Auth cu Google/Email
- [ ] Profile utilizator și istoric anunțuri
- [ ] Sistem de rating și review-uri

### **Funcționalități Avansate**
- [ ] Chat în timp real între utilizatori
- [ ] Notificări push pentru anunțuri noi
- [ ] Sistem de plăți integrat
- [ ] Geolocation și hartă interactivă
- [ ] Anunțuri similare cu AI/ML

### **Admin Panel**
- [ ] Dashboard pentru moderatori
- [ ] Statistici și analytics
- [ ] Gestionare categorii și locații
- [ ] Sistem de raportare abuzuri

## 📱 Responsive Design

Aplicația este complet responsive și optimizată pentru:
- **📱 Mobile** (320px+) - Navigation collapsible, touch-friendly
- **📟 Tablet** (768px+) - Grid adaptat, sidebar optional  
- **💻 Desktop** (1024px+) - Layout complet cu sidebar permanent
- **🖥 Large Desktop** (1440px+) - Spațiere optimizată

## 🚀 Deployment

### **Netlify (Recomandat)**
```bash
npm run build
# Upload folder `out/` to Netlify
```

### **Vercel**
```bash
vercel --prod
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔄 **Planul de Migrare către Firebase**

### **Faza 1: Activare Firebase** 🔥
1. **Configurare Firebase Project**
   ```bash
   # Creează .env.local cu:
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   ```

2. **Reactivează Firebase Services**
   ```typescript
   // src/lib/firebase.ts - înlocuiește mock-ul
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';
   ```

3. **Migrează Repository**
   ```bash
   # Rename: src/server/repo/repoMock.ts → repoFirebase.ts
   # Update imports în toate fișierele
   ```

### **Faza 2: Deploy Firebase Rules** 🔒
```bash
# Deploy Firestore Security Rules
firebase deploy --only firestore:rules

# Deploy Storage Rules  
firebase deploy --only storage
```

## 🌐 **Deployment**

### **Vercel (Recomandat)**
```bash
npm i -g vercel
vercel --prod
```

### **Variabile de Mediu**
```env
# Firebase (când va fi activat)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

# Site URL pentru JSON-LD
NEXT_PUBLIC_SITE_URL=https://ai-nostri.vercel.app
```

## 📊 **Performanță și SEO - Lighthouse ≥ 95**

### 🚀 **Performanță (LCP < 2.5s)**
- ✅ **ISR** cu revalidate = 60s pentru pagini statice
- ✅ **Next.js Image** cu priority, sizes și quality optimizate
- ✅ **Cache headers** via middleware (s-maxage=60, stale-while-revalidate=300)
- ✅ **Preload** pentru imaginea LCP din hero
- ✅ **Fonturi locale** cu font-display: swap
- ✅ **Tree shaking** și bundle optimization
- ✅ **Skeleton loading** pentru UX fără CLS

### ♿ **Accesibilitate (AA Compliance)**
- ✅ **Semantic HTML** - main, header, nav, section, footer
- ✅ **ARIA labels** pentru toate butoanele și form-urile
- ✅ **Focus states** vizibile cu outline și ring
- ✅ **Keyboard navigation** 100% funcțional
- ✅ **Skip to content** link
- ✅ **Contrast AA** - minimum 4.5:1 pentru toate textele
- ✅ **Tappable areas** minimum 44px pentru mobile
- ✅ **Screen reader** support complet

### 🔍 **SEO Avansat**
- ✅ **generateMetadata()** dinamic pe / și /listing/[slug]
- ✅ **JSON-LD Rich Snippets** - Product, Offer, BreadcrumbList
- ✅ **OpenGraph** și Twitter Cards complete
- ✅ **Slug-uri SEO** - `${slugify(title)}-${id}` format
- ✅ **Sitemap.xml** dinamic cu toate paginile
- ✅ **Robots.txt** optimizat pentru crawling
- ✅ **Breadcrumbs** cu schema.org markup

### 🎨 **UX și Design**
- ✅ **Design System** cu tokens CSS custom
- ✅ **Container max-width** 1200px
- ✅ **Grid responsive** 1/2/3/4 coloane
- ✅ **Empty states** contextuale pentru diaspora
- ✅ **Error states** cu recovery actions
- ✅ **Toast notifications** fără dependințe grele
- ✅ **Loading skeletons** pentru toate componentele

## 📊 **Performance & Accessibility Checklist**

### 🔍 **Cum să Verifici Scorul Lighthouse ≥ 95**

#### **1. Rulează Lighthouse Audit**
```bash
# Build pentru producție
npm run build
npm run start

# Deschide Chrome DevTools > Lighthouse
# Sau folosește CLI:
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

#### **2. Verifică Core Web Vitals**
- **LCP (Largest Contentful Paint)**: < 2.5s ✅
- **FID (First Input Delay)**: < 100ms ✅  
- **CLS (Cumulative Layout Shift)**: < 0.1 ✅
- **INP (Interaction to Next Paint)**: < 200ms ✅

#### **3. Testare Accesibilitate cu axe-core**
```bash
# Install axe pentru testare
npm install --save-dev @axe-core/react

# Sau folosește extensia axe DevTools în browser
# https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd
```

#### **4. Testare Keyboard Navigation**
- ✅ **Tab order** logic și intuitiv
- ✅ **Focus visible** pe toate elementele interactive
- ✅ **Skip to content** funcțional
- ✅ **Escape** închide modal-urile
- ✅ **Enter/Space** activează butoanele

#### **5. Validare JSON-LD**
```bash
# Testează Rich Results cu Google
# https://search.google.com/test/rich-results

# Sau folosește Schema.org Validator
# https://validator.schema.org/
```

#### **6. Verificare Responsive Design**
```bash
# Testează pe diferite rezoluții:
# Mobile: 375px, 414px
# Tablet: 768px, 1024px  
# Desktop: 1200px, 1440px, 1920px
```

### 🎯 **Target Scores**
- **Performance**: ≥ 95 ✅
- **Accessibility**: ≥ 95 ✅
- **Best Practices**: ≥ 95 ✅
- **SEO**: ≥ 95 ✅
- **PWA**: 100 (Installable) ✅

## 📱 **PWA (Progressive Web App)**

### ✨ **Funcționalități PWA**
- ✅ **Installable** - Aplicația poate fi instalată pe device
- ✅ **Offline Support** - Funcționează fără internet pentru paginile vizitate
- ✅ **Service Worker** - Cache inteligent pentru performanță
- ✅ **App-like Experience** - Rulează ca o aplicație nativă
- ✅ **Push Notifications** - Pregătit pentru notificări (viitor)
- ✅ **Background Sync** - Sincronizare în background (viitor)

### 🔧 **Testare PWA**

#### **1. Build și Test Local**
```bash
# Build pentru PWA
npm run build:pwa
npm run start

# Sau combină
npm run pwa-test
```

#### **2. Lighthouse PWA Audit**
```bash
# Rulează Lighthouse pentru PWA
npm run lighthouse

# Sau manual în Chrome DevTools:
# F12 > Lighthouse > Categories: PWA ✓
```

#### **3. Verificare Service Worker**
```bash
# În Chrome:
# chrome://inspect/#service-workers
# sau
# F12 > Application > Service Workers
```

#### **4. Test Install Prompt**
```bash
# În Chrome DevTools:
# F12 > Application > Manifest
# Click "Add to homescreen" pentru test
```

#### **5. Test Offline**
```bash
# În Chrome DevTools:
# F12 > Network > Offline ✓
# Naviga la / și /listing/[slug]
# Trebuie să funcționeze din cache
```

### 📊 **PWA Checklist**
- ✅ **Manifest valid** - `/manifest.webmanifest`
- ✅ **Service Worker** - `/sw.js` înregistrat
- ✅ **Iconuri PWA** - 192, 256, 384, 512px
- ✅ **Offline fallback** - `/offline.html`
- ✅ **HTTPS ready** - funcționează pe HTTPS
- ✅ **Install prompt** - `beforeinstallprompt` handling
- ✅ **Cache strategies** - Network First, Cache First, Stale While Revalidate
- ✅ **Meta tags** - Apple, Microsoft, PWA

### 📲 **Install Experience**
1. **Desktop**: Chrome afișează buton "Install" în address bar
2. **Mobile**: Prompt automat după 3 secunde + buton manual
3. **iOS**: "Add to Home Screen" din Safari menu
4. **Android**: "Add to Home Screen" sau "Install App"

### 🔄 **Cache Strategy**
- **HTML Pages**: Network First cu offline fallback
- **Static Assets**: Stale While Revalidate
- **Images**: Cache First cu cleanup automat
- **API Calls**: Network Only (mock data)

### 🛠️ **PWA Files Structure**
```
public/
├── manifest.webmanifest     # PWA manifest
├── sw.js                   # Service Worker
├── offline.html            # Offline fallback
└── icons/                  # PWA icons
    ├── icon-192.png
    ├── icon-256.png
    ├── icon-384.png
    └── icon-512.png

src/
├── app/_app-sw-register.tsx # SW registration
└── components/InstallPrompt.tsx # Install UI
```

### 🔧 **Debugging Performance Issues**

#### **LCP Optimization**
```typescript
// Preload critical images
<link rel="preload" as="image" href="hero-image.jpg" />

// Use priority on LCP images
<Image src="..." priority sizes="100vw" />
```

#### **CLS Prevention**
```css
/* Always set dimensions for images */
.image-container {
  aspect-ratio: 16/9;
  width: 100%;
}

/* Use skeleton loaders */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  animation: skeleton-loading 1.5s infinite;
}
```

#### **Accessibility Fixes**
```typescript
// Always provide ARIA labels
<button aria-label="Deschide meniul de navigație">
  <MenuIcon />
</button>

// Use semantic HTML
<main role="main">
  <section aria-labelledby="listings-heading">
    <h2 id="listings-heading">Anunțuri</h2>
  </section>
</main>
```

## 🤝 Contribuții

1. Fork repository-ul
2. Creează o branch pentru feature (`git checkout -b feature/amazing-feature`)
3. Commit modificările (`git commit -m 'Add amazing feature'`)
4. Push pe branch (`git push origin feature/amazing-feature`)
5. Deschide un Pull Request

## 📄 Licență

Acest proiect este licențiat sub MIT License - vezi fișierul [LICENSE](LICENSE) pentru detalii.

---

**# Ai Nostri - Platforma de Anunțuri clasificate care conectează oamenii! 🏠🚗📱

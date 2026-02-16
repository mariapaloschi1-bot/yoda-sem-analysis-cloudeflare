# 🚀 YODA SEO DASHBOARD - NETLIFY DEPLOY

✅ **Pronto per deploy immediato su Netlify**

---

## 📦 CONTENUTO

- ✅ Next.js 14.2.35 con API Routes (funzionano su Netlify)
- ✅ `netlify.toml` configurato per Next.js
- ✅ Tema Yoda completo (Teal, Purple, Gold)
- ✅ Dashboard 4 tab + Budget Calculator
- ✅ DataForSEO + Gemini AI integration
- ✅ Export CSV/JSON

---

## 🚀 DEPLOY RAPIDO (2 MINUTI)

### **Step 1: Carica su GitHub**

```bash
# Unzip
unzip YODA-NETLIFY-READY.zip
cd yoda-netlify

# Push su GitHub
git init
git add .
git commit -m "feat: Yoda SEO Dashboard for Netlify"
git remote add origin https://github.com/mariapaloschi1-bot/yoda-sem-analysis-cloudeflare.git
git branch -M main
git push -f origin main
```

---

### **Step 2: Deploy su Netlify**

1. **Vai su**: https://app.netlify.com/start
2. Click **"Import from Git"** → **GitHub**
3. Seleziona repository: `yoda-sem-analysis-cloudeflare`
4. **Configurazione automatica** (Netlify rileva `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click **"Deploy site"**

---

### **Step 3: Attendi Build (2-3 min)**

```
✓ Installing dependencies
✓ Running npm run build
✓ Compiled successfully
✓ Creating optimized production build
✓ Collecting page data
✓ Generating static pages
✓ Deploying to Netlify
✅ Success: https://your-site-name.netlify.app
```

---

## ✅ COSA FUNZIONA SU NETLIFY

✅ **API Routes** (`app/api/analyze/route.ts`) → Netlify Functions  
✅ **Server-side rendering**  
✅ **Serverless functions** (125k req/mese free)  
✅ **Automatic HTTPS**  
✅ **CDN globale**  
✅ **Zero configurazione extra**  

---

## 💰 COSTI

| Servizio | Piano | Costo |
|----------|-------|-------|
| **Netlify** | Free | €0.00 (125k req/mese) |
| **DataForSEO** | Pay-as-you-go | ~€0.17 / 10 kw |
| **Gemini AI** | Free tier | €0.00 (15 req/min) |

---

## 🎨 FEATURES

- ✅ Background galassia con stelle animate
- ✅ Colori Yoda: Teal #2dd4bf, Purple #a78bfa, Gold #fbbf24
- ✅ Dashboard interattiva (Overview, Keywords, Insights, Charts)
- ✅ Budget Calculator con CTR 2%
- ✅ Export CSV/JSON
- ✅ Loading screen con Baby Yoda
- ✅ Responsive mobile/tablet/desktop

---

## 🔧 TROUBLESHOOTING

### **Build fallisce**
```bash
# Verifica che package.json abbia:
"next": "14.2.35"  # NON 15.x (problemi con Netlify)
```

### **404 su /api/analyze**
- Netlify converte automaticamente API Routes in Functions
- Verifica che `netlify.toml` esista
- Check log: https://app.netlify.com/sites/YOUR-SITE/deploys

### **"Module not found"**
```bash
# Verifica tsconfig.json:
"paths": { "@/*": ["./*"] }
```

---

## 📚 LINK UTILI

- **Netlify Dashboard**: https://app.netlify.com
- **Netlify Docs**: https://docs.netlify.com
- **DataForSEO**: https://app.dataforseo.com
- **Gemini AI**: https://aistudio.google.com/app/apikey

---

## 🎉 PRONTO!

1. Unzip → Push GitHub
2. Import su Netlify
3. **App live in 3 minuti!** 🚀

---

**Made with ❤️ by Maria Paloschi**

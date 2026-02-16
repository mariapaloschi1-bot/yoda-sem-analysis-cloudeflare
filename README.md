# 🌟 YODA SEO DASHBOARD

**Analisi Keywords avanzata con DataForSEO e Gemini AI**

![Status](https://img.shields.io/badge/status-production-success)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

---

## ✨ FEATURES

- 🔍 **Analisi Keywords**: Volume, CPC, Competition, Advertisers
- 🤖 **AI Insights**: Powered by Google Gemini
- 📊 **Dashboard Interattiva**: 4 tab (Overview, Keywords, Insights, Charts)
- 💰 **Budget Calculator**: Stima costi mensili (CTR 2%)
- 📥 **Export**: CSV e JSON
- 🎨 **Tema Yoda**: Galassia stellata + animazioni

---

## 🚀 DEPLOY SU CLOUDFLARE PAGES

### **Metodo 1: Connetti GitHub (CONSIGLIATO)**

1. Fork questo repository
2. Vai su: https://dash.cloudflare.com
3. Workers & Pages → **"Create application"** → **"Pages"**
4. Connetti GitHub → seleziona questo repository
5. **Framework preset**: Next.js (Static HTML Export)
6. **Build command**: `npm run build`
7. **Build output directory**: `out`
8. Clicca **"Save and Deploy"**
9. ✅ **App online in 2-3 minuti!**

### **Metodo 2: Deploy da locale**

```bash
# Clona repository
git clone https://github.com/TUO-USERNAME/yoda-seo-dashboard
cd yoda-seo-dashboard

# Installa dipendenze
npm install

# Build
npm run build

# Deploy su Cloudflare Pages
npx wrangler pages deploy out --project-name=yoda-seo-dashboard
```

---

## 🔧 CONFIGURAZIONE API

### **DataForSEO API**
1. Crea account su: https://app.dataforseo.com/api-access
2. Copia **Login** (email) e **Password** (API key)
3. Inserisci nell'app quando richiesto

### **Gemini AI API (opzionale)**
1. Vai su: https://aistudio.google.com/app/apikey
2. Crea API key
3. Inserisci nell'app per insights AI
4. ⚠️ **Fallback automatico**: App funziona anche senza Gemini

---

## 💻 SVILUPPO LOCALE

```bash
# Installa dipendenze
npm install

# Avvia dev server
npm run dev

# Apri browser
open http://localhost:3000
```

---

## 📊 UTILIZZO

1. Inserisci **keywords** (separate da virgola)
2. Inserisci **credenziali DataForSEO**
3. (Opzionale) Inserisci **Gemini API key**
4. (Opzionale) Inserisci **brand domain**
5. Clicca **"Inizia Analisi"**
6. ✅ **Dashboard con tutti i dati!**

---

## 🎨 STRUTTURA PROGETTO

```
yoda-seo-dashboard/
├── app/
│   ├── page.tsx              # Homepage + form
│   ├── layout.tsx            # Layout root
│   ├── globals.css           # Stili globali + tema Yoda
│   └── api/analyze/route.ts  # API endpoint
├── components/
│   ├── Dashboard.tsx         # Dashboard principale
│   ├── LoadingScreen.tsx     # Schermata caricamento
│   └── WelcomeScreen.tsx     # Schermata benvenuto
├── lib/
│   ├── dataforseo.ts         # Client DataForSEO
│   ├── gemini.ts             # Client Gemini AI
│   └── analyzer.ts           # Logica analisi
├── public/                   # Assets statici
├── package.json
├── next.config.js            # Config Next.js (export statico)
└── tailwind.config.js        # Config Tailwind CSS
```

---

## 🌐 ENDPOINT DATAFORSEO UTILIZZATI

- ✅ `/v3/keywords_data/google_ads/search_volume/live`
- ✅ `/v3/serp/google/ads_advertisers/task_post`
- ✅ `/v3/serp/google/organic/live/advanced`
- ✅ `/v3/keywords_data/google_ads/ad_traffic_by_keywords/live`

---

## 💰 COSTI

### **Cloudflare Pages (Hosting)**
- ✅ **FREE**: Build illimitati, deploy illimitati, bandwidth illimitato

### **DataForSEO API (per 10 keywords)**
| Servizio | Costo |
|----------|-------|
| Search Volume | $0.075 |
| Ad Traffic | $0.075 |
| Advertisers | $0.020 |
| Organic SERP | $0.015 |
| **TOTALE** | **~$0.19** |

### **Gemini AI API**
- ✅ **FREE**: 15 richieste/minuto, 1M token/giorno

---

## 🐛 TROUBLESHOOTING

### **Build fallisce su Cloudflare**
```bash
# Verifica che next.config.js abbia:
output: 'export'

# Verifica che package.json abbia:
"engines": {
  "node": ">=18.0.0"
}
```

### **DataForSEO error 40100**
- Verifica credenziali su: https://app.dataforseo.com/api-access
- Verifica credito su: https://app.dataforseo.com/billing

### **Gemini API error 404**
- Rigenera API key su: https://aistudio.google.com/app/apikey
- ⚠️ L'app funziona anche senza Gemini (fallback automatico)

---

## 📚 DOCUMENTAZIONE

- **Next.js**: https://nextjs.org/docs
- **Cloudflare Pages**: https://developers.cloudflare.com/pages
- **DataForSEO**: https://docs.dataforseo.com
- **Gemini AI**: https://ai.google.dev/docs

---

## 📄 LICENZA

MIT License - Libero per uso personale e commerciale

---

## 🙏 CREDITS

- **Framework**: Next.js 14 + React 18
- **Styling**: Tailwind CSS
- **APIs**: DataForSEO, Google Gemini AI
- **Hosting**: Cloudflare Pages

---

## 🔗 LINK

- **Demo live**: https://yoda-seo-dashboard.pages.dev
- **Repository**: https://github.com/mariapaloschi1-bot/yoda-seo-adv-analysis-tool
- **Issues**: https://github.com/mariapaloschi1-bot/yoda-seo-adv-analysis-tool/issues

---

**Made with ❤️ by Maria Paloschi**

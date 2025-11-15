# MindTrack AI - Frontend

React + Vite frontend for the MindTrack AI mental health monitoring system.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at http://localhost:5173

## 📦 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Recharts** - Data visualization (for future charts)

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Layout.jsx           # Main layout with header/footer
│   ├── pages/
│   │   ├── HomePage.jsx         # Landing page
│   │   ├── AnalyzePage.jsx      # Text analysis interface
│   │   └── TimelinePage.jsx     # Analysis history
│   ├── services/
│   │   └── api.js               # API client and methods
│   ├── App.jsx                  # Main app component with routes
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles + Tailwind
├── index.html
├── vite.config.js               # Vite configuration with proxy
├── tailwind.config.js           # Tailwind theme customization
├── postcss.config.js            # PostCSS for Tailwind
└── package.json
```

## 🎨 Pages

### Home Page (`/`)
- Hero section with CTAs
- Feature cards
- "How It Works" section

### Analyze Page (`/analyze`)
- Text input (50-5000 characters)
- Real-time character counter
- Submit for analysis
- Results display with:
  - Sentiment classification
  - Confidence score
  - Visual confidence bar
  - Timestamp

### Timeline Page (`/timeline`)
- Statistics cards (total, normal, stressed counts)
- List of all analyses with:
  - Sentiment badge
  - Confidence score
  - Text preview
  - Timestamp
- Clear history button

## 🔧 API Integration

The frontend connects to the Flask backend at `http://localhost:5000/api/v1`.

Vite proxy configuration (in `vite.config.js`) forwards `/api` requests to the backend.

### API Methods (in `src/services/api.js`)

```javascript
analyzeText(text)           // POST /api/v1/analyze/text
getTimeline(limit)          // GET /api/v1/timeline
getStats()                  // GET /api/v1/stats
clearHistory()              // DELETE /api/v1/timeline
```

## 🎨 Styling

### Tailwind Custom Theme

- **Primary colors**: Blue shades for brand
- **Sentiment colors**:
  - Normal: Green (`text-normal`, `bg-normal-light`)
  - Stressed: Red (`text-stressed`, `bg-stressed-light`)

### Custom CSS Classes

```css
.btn                  // Base button
.btn-primary          // Primary button (blue)
.btn-secondary        // Secondary button (gray)
.card                 // Card container
.input                // Text input/textarea
```

## 🚦 Development

### Start Backend First
Make sure the Flask backend is running:
```bash
# In project root
python run.py
```

### Then Start Frontend
```bash
cd frontend
npm run dev
```

### Build for Production
```bash
npm run build
```

Build output will be in `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## 📝 Environment Variables

Create `.env` file in `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## ✅ Features Implemented

- ✅ Responsive layout with header/footer
- ✅ Home page with features
- ✅ Text analysis interface
- ✅ Timeline/history view
- ✅ API integration
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation
- ✅ Tailwind styling
- ✅ Icon integration

## 🔜 Future Enhancements

- [ ] Authentication UI (login/register)
- [ ] Charts/graphs with Recharts
- [ ] Dark mode toggle
- [ ] Export timeline to CSV
- [ ] Advanced filtering
- [ ] User profile page
- [ ] Mobile-optimized UI improvements

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
```

### API Connection Issues
- Ensure backend is running on port 5000
- Check CORS configuration in Flask
- Verify proxy settings in `vite.config.js`

### Tailwind Not Working
```bash
# Reinstall Tailwind dependencies
npm install -D tailwindcss postcss autoprefixer
```

## 📚 Documentation

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

---

**Status**: ✅ Frontend structure complete, ready for development!

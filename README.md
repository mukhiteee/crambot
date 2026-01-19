# CramBot - AI-Powered Study Timetable Generator

A free, AI-powered study planner that generates personalized exam schedules using advanced algorithms. Cram smarter, not harder.

## 🚀 Features

- **AI-Powered Scheduling**: Uses Groq's LLaMA model to create intelligent study timetables
- **Multiple Export Formats**: Download as PDF or high-quality PNG images
- **Theme Customization**: 8+ beautiful color themes to choose from
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Free Forever**: No login required, completely free to use
- **Educational Blog**: Learn proven study techniques from our comprehensive blog
- **Dark/Light Mode**: Automatic theme switching for better UX

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **AI**: Groq API with LLaMA 3.3 (70B) model
- **Export**: html-to-image and jsPDF libraries
- **Design**: Custom CSS with variables for theming

## 📋 Project Structure

```
crambot/
├── index.html              # Main application page
├── blogs.html              # Blog listing page
├── app.js                  # Main application logic
├── blogs.js                # Blog functionality
├── config.js               # Configuration loader (secure)
├── style.css               # Main stylesheet
├── blogs.css               # Blog styling
├── manifest.json           # PWA manifest
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── assets/                 # Images and icons
```

## 🔒 Security & Configuration

### API Key Management

**The API key should NEVER be committed to version control.**

#### Development Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Groq API key:
   ```
   GROQ_API_KEY=your_actual_api_key_here
   ```

3. Run a local development server that injects the API key

#### Production Setup

For production, the API key must be handled securely:

**Option 1: Backend Proxy (Recommended)**
- Create a backend service that handles API requests
- The client sends requests to your backend, not directly to Groq
- Your backend includes the API key in its requests to Groq

**Option 2: Environment Variables at Build Time**
- Build the app with environment variables set
- The build process injects the key during build
- Works with services like Vercel, Netlify, etc.

**Option 3: Secure Config Endpoint**
- Create a secure endpoint that returns configuration
- Implement authentication/rate limiting
- Client fetches config on load

### Current Implementation

The `config.js` file handles configuration loading:

```javascript
// Tries to load API key from:
1. window.__CRAMBOT_CONFIG (set by build process)
2. Environment variables (if using Node.js build)
3. Backend API endpoint (recommended)
```

To enable backend loading, uncomment the fetch call in `config.js`:

```javascript
const response = await fetch('/api/config', { 
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
});
const config = await response.json();
window.__CRAMBOT_CONFIG.apiKey = config.groqApiKey;
```

## 🚀 Deployment Options

### Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variable: `GROQ_API_KEY`
4. Deploy

```bash
# In Vercel dashboard
Environment Variables:
GROQ_API_KEY = your_key_here
```

### Netlify

1. Connect your repository
2. Add build command (if using build tool)
3. Add environment variables
4. Deploy

### GitHub Pages

1. Push to `gh-pages` branch
2. GitHub Pages will serve static files
3. Note: For API key management, use a backend service

### Traditional Hosting

1. Upload files to web server
2. Ensure Node.js isn't required (it's a static site)
3. Handle API key via backend proxy

## 🔧 Installation & Local Development

### Prerequisites

- A modern web browser
- Groq API key (get one at https://console.groq.com)

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crambot.git
   cd crambot
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your Groq API key
   ```

3. Start a local server (required for CORS):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

4. Open http://localhost:8000 in your browser

## 📖 API Documentation

### Groq API

- **Base URL**: https://api.groq.com/openai/v1/chat/completions
- **Model**: llama-3.3-70b-versatile
- **Rate Limit**: 30 requests per minute (free tier)

### Request Flow

1. User enters courses and study hours
2. App sends request to `CONFIG.GROQ_API_URL`
3. Groq processes and returns timetable JSON
4. App renders timetable with selected theme
5. User can export as PDF/PNG or share

## 🎨 Customization

### Adding New Themes

Edit `app.js` and add to the `THEMES` object:

```javascript
myTheme: {
    name: 'My Theme',
    headerBg: 'linear-gradient(135deg, #color1, #color2)',
    headerText: '#ffffff',
    rowBg: '#ffffff',
    rowAlt: '#f5f5f5',
    text: '#333333',
    border: '#cccccc',
    watermark: '#color1'
}
```

### Changing Export Dimensions

Modify in `app.js`:

```javascript
EXPORT_WIDTH: 1200,  // Change to desired width
EXPORT_HEIGHT: 800   // Change to desired height
```

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Android Chrome)

## ⚠️ Known Limitations

- Requires JavaScript enabled
- Cannot work offline (needs API)
- Export quality depends on browser canvas support
- Rate limited by Groq API

## 🐛 Troubleshooting

### API Key Not Found

- Check `.env` file exists and has the key
- Verify key is valid at https://console.groq.com
- Check browser console for errors

### Export Not Working

- Ensure pop-ups aren't blocked
- Try a different browser
- Check console for error messages
- Verify `html-to-image` library loaded

### Timetable Not Generating

- Check network tab for API errors
- Verify Groq API status
- Ensure rate limit not exceeded
- Check browser console

## 📄 License

This project is open source. See LICENSE file for details.

## 👤 Author

Created by **Mukhiteee**

- 𝕏: [@mukhiteee](https://x.com/mukhiteee)
- Instagram: [@mukhiteee](https://instagram.com/mukhiteee)
- GitHub: [@mukhiteee](https://github.com/mukhiteee)

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📚 Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Study Techniques Blog](./blogs.html)
- [Spaced Repetition](./blogs.html?post=spaced-repetition)
- [Pomodoro Technique](./blogs.html?post=pomodoro-technique)

## 📧 Support

Found a bug? Have a feature request?

- Open an issue on GitHub
- Check existing issues first
- Include browser and OS information
- Describe steps to reproduce

## 🎯 Roadmap

- [ ] User accounts and saved timetables
- [ ] Calendar integration
- [ ] Mobile app
- [ ] Offline support
- [ ] More AI models
- [ ] Collaboration features

---

**Happy studying! Remember: Cram Smarter, Not Harder! 🧠**

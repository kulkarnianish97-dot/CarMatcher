# CarMatcher 🚗

**The Automotive Intelligence Review** — describe your ideal car, get AI-powered recommendations instantly.

Built with vanilla HTML/CSS/JS and powered by Google Gemini AI.

---

## Getting Started

### 1. Get a Free Gemini API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API key"**
4. Copy the key

### 2. Add Your Key

Open `js/config.js` and replace the placeholder:

```js
const CONFIG = {
  GEMINI_API_KEY: "YOUR_GEMINI_API_KEY_HERE", // ← paste here
  ...
};
```

### 3. Run It

Just open `index.html` in your browser. No build step, no server needed.

> **Tip:** If you hit CORS issues, run a simple local server:
> ```bash
> npx serve .
> # or
> python3 -m http.server 8080
> ```

---

## Project Structure

```
CarMatcher/
├── index.html          # Main page
├── css/
│   └── style.css       # All styles (magazine aesthetic)
├── js/
│   ├── config.js       # ← PUT YOUR API KEY HERE
│   └── app.js          # Gemini API logic + card rendering
└── README.md
```

---

## How It Works

1. User describes what they want in plain English
2. `app.js` sends a structured prompt to the **Gemini 2.0 Flash** API
3. Gemini returns a JSON array of car recommendations
4. Cards are rendered with name, category, price range, description, pros & cons

---

## Customization

| What | Where |
|---|---|
| Number of results | `CONFIG.MAX_RESULTS` in `js/config.js` |
| AI model | `CONFIG.GEMINI_MODEL` in `js/config.js` |
| Colors / fonts | CSS variables at top of `css/style.css` |
| Prompt behavior | `buildPrompt()` in `js/app.js` |

### Available Gemini Models

| Model | Speed | Quality |
|---|---|---|
| `gemini-2.0-flash` | ⚡ Fast | ★★★★ (recommended) |
| `gemini-1.5-pro` | 🐢 Slower | ★★★★★ |
| `gemini-1.5-flash` | ⚡ Fast | ★★★ |

---

## Security Note

> ⚠️ Your API key is visible in `js/config.js` — anyone who views the page source can see it.
>
> **This is fine for local/personal use.** If you deploy CarMatcher publicly, move the API call to a backend server (Node.js, Python, etc.) and keep the key server-side only.

---

## Tech Stack

- **HTML5 / CSS3 / Vanilla JS** — no frameworks or build tools
- **Google Gemini API** — `generativelanguage.googleapis.com`
- **Google Fonts** — Playfair Display, EB Garamond, Bebas Neue

---

*CarMatcher © 2026 — for informational purposes only*

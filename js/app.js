// ============================================================
//  CarMatcher — app.js
//  Handles Gemini API calls and renders recommendation cards.
// ============================================================

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent`;

// ── Build the prompt ──────────────────────────────────────
function buildPrompt(userInput) {
  return `
You are an expert automotive journalist and car-buying advisor with 25 years of experience.
A buyer has described what they want in a car. Recommend exactly ${CONFIG.MAX_RESULTS} vehicles that best match their needs.

Buyer's brief:
"${userInput}"

Respond ONLY with a valid JSON array. No markdown, no backticks, no explanation outside the JSON.
Each object in the array must have these exact fields:
{
  "rank": 1,
  "name": "Year Make Model Trim",
  "category": "e.g. Sports Sedan / Family SUV / Budget Hatchback",
  "priceRange": "e.g. $28,000–$34,000 used",
  "description": "2–3 sentence editorial description of why this car fits the buyer's brief.",
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2"]
}

Order results from best match (#1) to good match (#${CONFIG.MAX_RESULTS}).
Be specific with trim levels when it matters. Be honest about trade-offs.
`.trim();
}

// ── Call Gemini API ───────────────────────────────────────
async function callGemini(userInput) {
  if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    throw new Error("No API key set. Please open js/config.js and paste your Gemini API key.");
  }

  const url = `${GEMINI_ENDPOINT}?key=${CONFIG.GEMINI_API_KEY}`;

  const payload = {
    contents: [
      {
        parts: [{ text: buildPrompt(userInput) }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || `HTTP ${res.status}`;
    throw new Error(`Gemini API error: ${msg}`);
  }

  const data = await res.json();

  // Extract the text from Gemini's response structure
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("Gemini returned an empty response.");

  // Strip any accidental markdown fences
  const clean = rawText.replace(/```json|```/gi, "").trim();

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error("Could not parse the AI's response. Try again.");
  }
}

// ── Render car cards ──────────────────────────────────────
function renderResults(cars) {
  const section = document.getElementById("results");

  const header = `
    <div class="results-header">
      <h3>Your Matches</h3>
      <span>${cars.length} VEHICLES SELECTED</span>
    </div>
  `;

  const cards = cars.map((car, i) => `
    <article class="car-card" style="animation-delay: ${i * 0.1}s">
      <div class="car-rank">${car.rank ?? i + 1}</div>
      <div class="car-body">
        <h4 class="car-name">${escHtml(car.name)}</h4>
        <div class="car-meta">
          <span class="car-tag">${escHtml(car.category)}</span>
          <span class="car-price">${escHtml(car.priceRange)}</span>
        </div>
        <p class="car-desc">${escHtml(car.description)}</p>
        <div class="car-pros-cons">
          <div>
            <div class="pros-label">STRENGTHS</div>
            <ul class="pros-list">
              ${(car.pros || []).map(p => `<li>${escHtml(p)}</li>`).join("")}
            </ul>
          </div>
          <div>
            <div class="cons-label">TRADE-OFFS</div>
            <ul class="cons-list">
              ${(car.cons || []).map(c => `<li>${escHtml(c)}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  section.innerHTML = header + `<div class="car-cards">${cards}</div>`;
}

// ── Render error ──────────────────────────────────────────
function renderError(msg) {
  document.getElementById("results").innerHTML = `
    <div class="error-msg">⚠ ${escHtml(msg)}</div>
  `;
}

// ── Escape HTML helper ────────────────────────────────────
function escHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Main entry point ──────────────────────────────────────
async function findMatches() {
  const prompt = document.getElementById("userPrompt").value.trim();
  const loading = document.getElementById("loading");
  const results = document.getElementById("results");
  const btn = document.getElementById("matchBtn");

  if (!prompt) {
    document.getElementById("userPrompt").focus();
    return;
  }

  // UI: loading state
  results.innerHTML = "";
  loading.classList.add("visible");
  btn.disabled = true;
  btn.querySelector(".btn-text").textContent = "Finding…";

  try {
    const cars = await callGemini(prompt);
    renderResults(cars);
  } catch (err) {
    renderError(err.message);
  } finally {
    loading.classList.remove("visible");
    btn.disabled = false;
    btn.querySelector(".btn-text").textContent = "Find My Match";
  }
}

// ── Allow Enter+Ctrl/Cmd to submit ────────────────────────
document.getElementById("userPrompt").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) findMatches();
});

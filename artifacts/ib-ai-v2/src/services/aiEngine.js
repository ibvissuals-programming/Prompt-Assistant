// ── Knowledge base (v2 — tags array with semantic scoring) ───────────────────
const brain = [
  {
    tags: ["money", "cash", "currency", "finance", "economy", "rich", "poor"],
    response: "Money is a medium of exchange used to buy goods and services. It removes the need for direct barter."
  },
  {
    tags: ["reproduction", "reproduce", "biology", "birth", "offspring"],
    response: "Reproduction is the biological process where living organisms produce new individuals of the same species."
  },
  {
    tags: ["advice", "advise", "help", "guidance", "life", "suggest"],
    response: "Focus on consistency over motivation. Small daily actions create long-term success."
  },
  {
    tags: ["car", "vehicle", "automobile", "transport", "drive"],
    response: "A car is a road vehicle used for transportation, typically powered by an engine or motor."
  },
  {
    tags: ["ai", "artificial intelligence", "machine learning", "robot"],
    response: "Artificial Intelligence is the simulation of human intelligence in machines that can learn and make decisions."
  },
  {
    tags: ["python", "django", "flask", "pandas"],
    response: "Python is a high-level, readable programming language great for data science, automation, and web development."
  },
  {
    tags: ["javascript", "js", "node", "nodejs", "es6"],
    response: "JavaScript is the language of the web — it runs in browsers and on servers (Node.js) to build interactive apps."
  },
  {
    tags: ["react", "jsx", "component", "hooks", "useState"],
    response: "React is a JavaScript library for building user interfaces using reusable components and a virtual DOM."
  },
  {
    tags: ["code", "coding", "programming", "developer", "software", "bug", "error"],
    response: "Good code is readable, consistent, and easy to change. Start simple, refactor when patterns emerge."
  },
  {
    tags: ["learn", "learning", "study", "practice", "skill"],
    response: "Learning sticks best when you apply it immediately. Read a concept, then build something small with it."
  },
  {
    tags: ["productivity", "productive", "focus", "work", "efficiency"],
    response: "Productivity comes from doing fewer things with full focus — not doing more things at once."
  },
  {
    tags: ["health", "healthy", "fitness", "exercise", "diet", "sleep"],
    response: "Health is built on three basics: sleep, movement, and nutrition. Improve one and the others follow."
  },
  {
    tags: ["success", "successful", "goal", "achieve", "win"],
    response: "Success is the result of consistent small actions, not occasional big efforts."
  },
  {
    tags: ["motivation", "motivated", "inspire", "inspiration", "discipline"],
    response: "Motivation follows action — start before you feel ready and momentum builds naturally."
  },
  {
    tags: ["writing", "essay", "blog", "article", "draft", "creative"],
    response: "Good writing is clear thinking on paper. Write your first draft fast, then cut ruthlessly."
  },
];

function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

function handleDirect(text) {
  if (text.includes("what time")) {
    return `Current time: ${new Date().toLocaleTimeString()}`;
  }

  if (text.includes("what is today") || text === "date") {
    return `Today is ${new Date().toDateString()}`;
  }

  if (text.includes("who are you")) {
    return "I'm IB AI — your assistant for learning and problem solving.";
  }

  if (text.includes("what can you do")) {
    return "I can explain topics, answer questions, and help with ideas.";
  }

  return null;
}

function getBestBrainMatch(text, brainData) {
  let bestScore = 0;
  let bestResponse = null;

  for (const item of brainData) {
    let score = 0;

    for (const tag of item.tags) {
      const t = normalizeText(tag);

      if (text === t) score += 5;
      else if (text.includes(t)) score += 3;
      else if (t.split(" ").some(w => text.includes(w))) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestResponse = item.response;
    }
  }

  if (bestScore < 4) return null;

  return bestResponse;
}

function isTooNoisy(text) {
  return text.split(" ").some(w => w.length <= 2);
}

function fallbackResponse(input) {
  return "I don't understand this clearly. Please rephrase it.";
}

export function generateAIResponse(input, history = []) {
  if (!input || typeof input !== "string") {
    return "Please enter a valid message.";
  }

  let text = normalizeText(input);

  const direct = handleDirect(text);
  if (direct) return direct;

  if (isTooNoisy(text)) {
    return "I didn't understand that clearly. Please rephrase it.";
  }

  const brainResponse = getBestBrainMatch(text, brain);
  if (brainResponse) return brainResponse;

  if (text.includes("hello") || text.includes("hi")) {
    return "Hey 👋 What's up?";
  }

  if (text.includes("joke")) {
    return "Why did the developer go broke? Too many cache problems 😂";
  }

  if (text.includes("thank")) {
    return "Anytime 👍";
  }

  return fallbackResponse(input);
}

export function detectMode(input) {
  if (!input || typeof input !== "string") return "general";
  const text = input.toLowerCase();
  if (
    text.includes("generate a prompt") ||
    text.includes("improve this prompt") ||
    text.includes("optimize prompt")
  ) return "prompt_engineering";
  return "general";
}

export function generateResponse(input, history) {
  try {
    return generateAIResponse(input, history);
  } catch {
    return "Something went wrong. Please try again.";
  }
}

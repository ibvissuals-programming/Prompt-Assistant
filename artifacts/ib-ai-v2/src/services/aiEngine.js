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

// ── Normalizer ────────────────────────────────────────────────────────────────
function normalize(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

// ── Step 1: Direct handler ────────────────────────────────────────────────────
function handleDirect(input) {
  const text = input.toLowerCase().trim();

  if (text.includes("what time") || text.includes("current time")) {
    return `Current time: ${new Date().toLocaleTimeString()}`;
  }

  if (text.includes("what is today") || text.includes("what's today") || text === "date") {
    return `Today is ${new Date().toDateString()}`;
  }

  if (text === "tell me more") {
    return "What exactly should I expand on?";
  }

  if (text.includes("who are you") || text.includes("what are you")) {
    return "I'm IB AI — your assistant for learning and explanations.";
  }

  if (text.includes("what can you do")) {
    return "I can explain topics, answer questions, and help you learn anything step-by-step.";
  }

  if (
    text.includes("generate a prompt") ||
    text.includes("improve this prompt") ||
    text.includes("optimize prompt")
  ) {
    const cleaned = input
      .replace(/generate a prompt|improve this prompt|optimize prompt/gi, "")
      .trim();
    return `Improved Prompt:\n${cleaned}\n\nWhy this works:\nClearer, more specific, and reduces ambiguity.`;
  }

  return null;
}

// ── Step 2: Semantic scoring engine ──────────────────────────────────────────
function getBestBrainMatch(input, brainData) {
  for (const item of brainData) {
    for (const tag of item.tags) {
      if (input.toLowerCase().includes(tag.toLowerCase())) {
        return item.response;
      }
    }
  }

  return null;
}

function fallbackResponse(input) {
  return `I get what you're asking about: "${input}".\n\nHere’s a simple way to think about it:\n- I can explain it clearly\n- I can give examples\n- I can break it into steps\n\nTell me what you want 👍`;
}

// ── Main engine ───────────────────────────────────────────────────────────────
export function generateAIResponse(input, history = []) {
  if (!input || typeof input !== "string") {
    return "Please enter a valid message.";
  }

  const text = input.toLowerCase().trim();

  // 1. DIRECT LAYER
  const direct = handleDirect(input);
  if (direct) return direct;

  // 2. BRAIN MATCH (v2 semantic scoring)
  const brainResponse = getBestBrainMatch(input, brain);
  if (brainResponse) return brainResponse;

  // 3. INTENT MINI LAYER
  if (text.includes("hello") && text.length < 10) {
    return "Hey 👋 What's up?";
  }

  if (text.includes("hi") && text.length < 5) {
    return "Hey 👋 What's up?";
  }

  if (text.includes("hey") && text.length < 6) {
    return "Hey 👋 What's up?";
  }

  if (text.includes("joke") || text.includes("funny")) {
    return "Why did the developer go broke? Because he used up all his cache 😂";
  }

  if (text.includes("thank")) {
    return "Anytime 👍";
  }

  // 4. SMART FALLBACK
  return fallbackResponse(input);
}

// ── Compatibility exports (used by useChat.js and ChatApp.jsx) ────────────────
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

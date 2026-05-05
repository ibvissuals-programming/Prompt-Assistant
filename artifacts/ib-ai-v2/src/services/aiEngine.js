// ── Knowledge base (array format with keywords array) ────────────────────────
const brain = [
  { keywords: ["money", "currency", "cash"], response: "Money is a medium of exchange used to buy goods and services. It allows trade without barter." },
  { keywords: ["artificial intelligence", "what is ai", "about ai"], response: "Artificial Intelligence is the simulation of human intelligence in machines that can learn and solve problems." },
  { keywords: ["reproduction", "reproduce"], response: "Reproduction is the process by which living organisms produce new individuals of the same species." },
  { keywords: ["advice", "give me advice", "tip"], response: "Focus on consistency over motivation. Small daily progress builds long-term success." },
  { keywords: ["python"], response: "Python is a high-level, readable programming language great for data science, automation, and web development." },
  { keywords: ["javascript"], response: "JavaScript is the language of the web — it runs in browsers and on servers (Node.js) to build interactive apps." },
  { keywords: ["react"], response: "React is a JavaScript library for building user interfaces using reusable components and a virtual DOM." },
  { keywords: ["machine learning", "neural network", "deep learning"], response: "Machine learning teaches computers to improve at tasks through experience, without being explicitly programmed for each step." },
  { keywords: ["code", "coding", "programming"], response: "Good code is readable, consistent, and easy to change. Start simple, refactor when patterns emerge." },
  { keywords: ["learn", "learning", "study"], response: "Learning sticks best when you apply it immediately. Read a concept, then build something small with it." },
  { keywords: ["productivity", "productive"], response: "Productivity comes from doing fewer things with full focus — not doing more things at once." },
  { keywords: ["health", "healthy", "fitness"], response: "Health is built on three basics: sleep, movement, and nutrition. Improve one and the others follow." },
  { keywords: ["success", "successful"], response: "Success is the result of consistent small actions, not occasional big efforts." },
  { keywords: ["motivation", "motivated"], response: "Motivation follows action — start before you feel ready and momentum builds naturally." },
  { keywords: ["writing", "essay", "blog", "article"], response: "Good writing is clear thinking on paper. Write your first draft fast, then cut ruthlessly." },
  { keywords: ["hello", "hi", "hey"], response: "Hey 👋 What's up?" },
  { keywords: ["joke", "funny"], response: "Why did the developer go broke? Because he used up all his cache 😂" },
  { keywords: ["thank"], response: "Anytime 👍" },
];

// ── Step 1: Direct handler ────────────────────────────────────────────────────
function handleDirect(input) {
  const text = input.toLowerCase();

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
    return "I can explain topics, answer questions, and help with ideas.";
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

// ── Step 2: Knowledge base matcher ───────────────────────────────────────────
function getBrainResponse(input, brainData) {
  const text = input.toLowerCase();
  for (const item of brainData) {
    if (item.keywords.some(k => text.includes(k))) {
      return item.response;
    }
  }
  return null;
}

// ── Step 3: Universal fallback ────────────────────────────────────────────────
function fallbackResponse(input) {
  return `I understand you're asking about: "${input}".\n\nHere's a simple way to think about it:\n\nThis topic can be explained by breaking it into smaller parts. If you want, tell me which part you're most interested in and I'll go deeper.`;
}

// ── Main engine ───────────────────────────────────────────────────────────────
export function generateAIResponse(input, history = []) {
  if (!input || typeof input !== "string") {
    return "Please enter a valid message.";
  }

  const direct = handleDirect(input);
  if (direct) return direct;

  const brainResponse = getBrainResponse(input, brain);
  if (brainResponse) return brainResponse;

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

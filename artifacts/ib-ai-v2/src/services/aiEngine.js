const normalize = (text) =>
  text.toLowerCase().trim().replace(/\s+/g, " ");

// ── Brain map: keyword → response ────────────────────────────────────────────
const brain = {
  money: "Money is a medium of exchange used to buy goods and services. It allows trade without barter.",
  ai: "Artificial Intelligence is the simulation of human intelligence in machines that can learn and solve problems.",
  reproduction: "Reproduction is the process by which living organisms produce new individuals of the same species.",
  advice: "Focus on consistency over motivation. Small daily progress builds long-term success.",
  python: "Python is a high-level, readable programming language great for data science, automation, and web development.",
  javascript: "JavaScript is the language of the web — it runs in browsers and on servers (Node.js) to build interactive apps.",
  react: "React is a JavaScript library for building user interfaces using reusable components and a virtual DOM.",
  code: "Good code is readable, consistent, and easy to change. Start simple, refactor when patterns emerge.",
  learn: "Learning sticks best when you apply it immediately. Read a concept, then build something small with it.",
  productivity: "Productivity comes from doing fewer things with full focus — not doing more things at once.",
  health: "Health is built on three basics: sleep, movement, and nutrition. Improve one and the others follow.",
  success: "Success is the result of consistent small actions, not occasional big efforts.",
  motivation: "Motivation follows action — start before you feel ready and momentum builds naturally.",
  writing: "Good writing is clear thinking on paper. Write your first draft fast, then cut ruthlessly.",
  explain: "The best way to explain something is to break it into the smallest pieces, then build back up.",
};

function getBrainResponse(input) {
  const text = input.toLowerCase();
  for (const key in brain) {
    if (text.includes(key)) return brain[key];
  }
  return null;
}

export function generateAIResponse(input, history = []) {
  if (!input || typeof input !== "string") {
    return "Please enter a valid message.";
  }

  const text = normalize(input);

  // 🔴 DIRECT RESPONSES
  if (text.includes("what time")) {
    return `Current time: ${new Date().toLocaleTimeString()}`;
  }

  if (text.includes("what is today") || text === "date") {
    return `Today is ${new Date().toDateString()}`;
  }

  if (text === "tell me more") {
    return "What exactly should I expand on?";
  }

  if (text.includes("who are you")) {
    return "I'm IB AI — your assistant for learning, writing, and problem-solving.";
  }

  if (text.includes("what can you do")) {
    return "I can help with explanations, writing, coding, ideas, and prompt generation.";
  }

  // 🟢 SIMPLE INTENTS
  if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
    return "Hey 👋 What's up?";
  }

  if (text.includes("joke")) {
    return "Why did the developer go broke? Because he used up all his cache 😂";
  }

  if (text.includes("thank")) {
    return "Anytime 👍";
  }

  // 🟣 PROMPT MODE
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

  // 🟠 BRAIN MAP LOOKUP
  const brainResponse = getBrainResponse(input);
  if (brainResponse) return brainResponse;

  // 🔵 FALLBACK
  return "I understand your question, but I need a bit more detail to give a proper answer.";
}

// ── Compatibility exports (used by useChat.js and ChatApp.jsx) ────────────────

export function detectMode(input) {
  if (!input || typeof input !== "string") return "general";
  const text = normalize(input);
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

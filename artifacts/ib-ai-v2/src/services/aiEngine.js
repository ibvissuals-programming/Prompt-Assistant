const normalize = (text) =>
  text.toLowerCase().trim().replace(/\s+/g, " ");

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

  // 🔵 CLEAN NATURAL RESPONSE
  return `${input}\n\nIf you want, I can explain it better, give examples, or break it down.`;
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

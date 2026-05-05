const brain = [
  {
    tags: ["money", "cash", "finance", "economy"],
    response: "Money is a medium of exchange used for goods and services."
  },
  {
    tags: ["reproduction", "biology", "birth"],
    response: "Reproduction is how living organisms produce offspring."
  },
  {
    tags: ["ai", "artificial intelligence", "machine learning"],
    response: "AI is the simulation of human intelligence in machines."
  },
  {
    tags: ["advice", "life", "help"],
    response: "Focus on consistency over motivation. Small steps matter."
  }
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

function matchBrain(text) {
  const t = text.toLowerCase();

  for (const item of brain) {
    if (item.tags.some(tag => t.includes(tag))) {
      return item.response;
    }
  }

  return null;
}

function fallbackResponse(input) {
  return `I’m not fully sure about that.

I can still help if you:
• rephrase it
• ask a simpler version
• or tell me what you mean exactly`;
}

export function generateAIResponse(input, history = []) {
  if (!input || typeof input !== "string") {
    return "Please enter a valid message.";
  }

  const text = input.toLowerCase().trim();
  const enhancedInput = `
Carefully analyze and solve:

"${input}"

Think step-by-step and give a structured answer.
`;
  const memory = history?.find((item) => item?.name) || null;
  const prompt = `
You are IB AI — an advanced, highly intelligent assistant designed to think clearly, deeply, and practically.

CORE BEHAVIOR:
- Understand the user's true intent
- Break complex problems into smaller parts
- Think step-by-step before answering
- Be clear, structured, and useful
- Avoid fluff

REASONING STYLE:
- Analyze first
- Identify key points
- Solve logically in steps
- Then give a clean final answer

RESPONSE FORMAT:
1. Understanding
2. Step-by-step solution
3. Final answer
4. Optional improvement

USER CONTEXT:
${memory?.name ? `Name: ${memory.name}` : "Unknown"}

USER REQUEST:
${enhancedInput}
`;

  const direct = handleDirect(text);
  if (direct) return direct;

  const brainHit = matchBrain(text);
  if (brainHit) return brainHit;

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

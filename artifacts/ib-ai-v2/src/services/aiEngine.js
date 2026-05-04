// ─── Helpers ──────────────────────────────────────────────────────────────────

const normalize = (text) => text.toLowerCase().trim().replace(/\s+/g, ' ');

// ─── Exported mode label (used by useChat + MessageBubble badge) ──────────────

export function detectMode(input) {
  const text = normalize(input);
  if (
    text.includes('generate a prompt') ||
    text.includes('improve this prompt') ||
    text.includes('optimize prompt') ||
    text.includes('rewrite this prompt') ||
    text.includes('make this prompt better') ||
    text.includes('enhance this prompt') ||
    text.includes('make this better') ||
    text.includes('improve this') ||
    text.includes('optimize this')
  ) return 'prompt_engineering';
  return 'chat';
}

// ─── Prompt engineering ───────────────────────────────────────────────────────

function generatePromptResponse(input) {
  const cleaned = input
    .replace(/(generate a prompt for|improve this prompt[:]*|optimize prompt|rewrite this prompt|make this prompt better|enhance this prompt|make this better|improve this|optimize this)/gi, '')
    .replace(/^[:\-–,\s]+/, '')
    .trim();

  const subject = cleaned || 'your task';
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return `**Improved Prompt:**\nAct as an expert in the relevant domain. ${cap(subject).replace(/\.?$/, '')}. Be specific and structured — define the desired output format and include any constraints needed for a precise result.\n\n**Why this works:**\nClearer role definition, explicit output constraints, and reduced ambiguity.\n\n**Variations:**\n- Concise: "${cap(subject)} — summarize in 3 bullet points."\n- Detailed: "${cap(subject)} — provide a step-by-step breakdown with examples."`;
}

// ─── Main response function ───────────────────────────────────────────────────

export function generateAIResponse(input, history = []) {
  if (!input || typeof input !== 'string') return 'Please enter a valid message.';

  const text = normalize(input);
  const hasContext = Array.isArray(history) && history.filter(m => m.role === 'user').length > 1;
  const ctx = hasContext ? 'Building on what we discussed — ' : '';

  // ── Direct / factual queries ──
  if (text.includes('what time') || text.includes('current time')) {
    return `Current time: ${new Date().toLocaleTimeString()}`;
  }
  if (text.includes('what is today') || text.includes("what's today") || text === 'date' || text === 'what is the date') {
    return `Today is ${new Date().toDateString()}`;
  }
  if (text === 'tell me more') {
    return 'What exactly should I expand on?';
  }
  if (text.includes('who are you') || text.includes('what are you')) {
    return "I'm IB AI — your assistant for learning, writing, and problem-solving.";
  }
  if (text.includes('what can you do')) {
    return 'I can help with explanations, writing, coding, ideas, and prompt generation.';
  }

  // ── Simple social intents ──
  if (text.match(/^(hello|hi|hey|howdy|sup)[\s!?.,]?$/) || text.includes('hello there') || text.includes('hi there')) {
    return "Hey! What are you working on?";
  }
  if (text.includes('joke') || text.includes('funny')) {
    return "Why did the developer go broke? Because he used up all his cache. 😄\n\nWant another, or can I help with something?";
  }
  if (text.includes('thank')) {
    return "Anytime. What else can I help with?";
  }

  // ── Prompt engineering ──
  if (detectMode(input) === 'prompt_engineering') {
    return generatePromptResponse(input);
  }

  // ── Topic: machine learning ──
  if (text.includes('machine learning') || text.includes('neural network') || text.includes('deep learning')) {
    return `${ctx}neural networks learn by making a prediction, measuring how wrong it was, then nudging every parameter slightly in the direction that reduces the error — repeated millions of times.\n\nThe key steps: forward pass → compute loss → backpropagate gradients → optimizer updates weights.\n\nWant me to go deeper on a specific part — architectures, training dynamics, or a real-world example?`;
  }

  // ── Topic: AI / LLMs ──
  if (text.includes('artificial intelligence') || text.includes('language model') || text.includes('llm') || text.includes('chatgpt') || text.includes('gpt')) {
    return `${ctx}large language models are trained to predict the next token given all previous context. Do that at scale across enough text and the model develops surprisingly general capabilities.\n\nThe transformer architecture is what makes it work — self-attention lets every token in the sequence attend to every other token, which handles long-range dependencies far better than earlier approaches.\n\nAnything specific you want to explore — how they're trained, how to prompt them well, or something else?`;
  }

  // ── Topic: code ──
  if (text.includes('python') || text.includes('javascript') || text.includes('typescript') || text.includes('react') || text.includes('code') || text.includes('function') || text.includes('bug') || text.includes('error')) {
    const lang = text.includes('python') ? 'python' : text.includes('typescript') ? 'typescript' : 'javascript';
    const example = lang === 'python'
      ? `def process(items):\n    return [item.strip() for item in items if item]`
      : `const process = (items) =>\n  items.filter(Boolean).map(s => s.trim());`;
    return `${ctx}here's a clean example:\n\n\`\`\`${lang}\n${example}\n\`\`\`\n\nKey principles: early filtering, single responsibility, no side effects.\n\nShare your code or describe the problem and I'll tailor the solution.`;
  }

  // ── Topic: writing ──
  if (text.includes('write') || text.includes('essay') || text.includes('blog') || text.includes('article') || text.includes('draft') || text.includes('creative')) {
    return `${ctx}strong writing starts with one clear thesis — a single sentence that tells the reader exactly what they'll walk away believing.\n\n- Open with a specific detail, not a broad statement.\n- Each paragraph earns one idea.\n- Close by looping back to your opening.\n\nShare your draft or topic and I'll give you specific, line-level feedback.`;
  }

  // ── Topic: explain ──
  if (text.includes('explain') || text.startsWith('what is') || text.startsWith('how does') || text.startsWith('why does') || text.startsWith('what are')) {
    const topic = input.replace(/explain|what is|what are|how does|why does|please|can you/gi, '').trim();
    return `${ctx}${topic ? `Here's a clear breakdown of ${topic}:` : "Here's a clear breakdown:"}\n\nAt its core, it's a process or mechanism that produces a specific outcome. Context shapes the result — small changes in input often lead to meaningfully different outputs.\n\n${topic ? `Want me to go deeper with a technical explanation, a real-world analogy, or a practical example of ${topic}?` : 'Want a technical breakdown, analogy, or practical example?'}`;
  }

  // ── Fallback — conversational, never echoes input ──
  return `${ctx}good question. To give you the most useful answer, it helps to know a bit more — what's the context you're working in, and what outcome are you going for?\n\nShare more detail and I'll give you something specific.`;
}

// ─── Safety wrapper (exported, called by useChat) ─────────────────────────────

export function safeAIResponse(input, history) {
  try {
    return generateAIResponse(input, history);
  } catch (err) {
    return 'Something went wrong. Please try again.';
  }
}

// Backwards-compatible alias — useChat.js calls generateResponse
export const generateResponse = safeAIResponse;

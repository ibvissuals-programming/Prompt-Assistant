// ─── Helpers ─────────────────────────────────────────────────────────────────

const normalize = (text) => text.toLowerCase().trim().replace(/\s+/g, ' ');

// ─── Intent detection ─────────────────────────────────────────────────────────

function detectIntent(input) {
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

  if (text.includes('joke') || text.includes('funny')) return 'joke';
  if (text.includes('thank')) return 'thanks';
  if (text.includes('what can you do') || text.includes('who are you') || text.includes('what are you')) return 'capability';
  if (text.match(/^(hello|hi|hey|howdy|sup|what'?s up)[\s!?.,]?$/) || text.includes('hello there') || text.includes('hi there')) return 'greeting';

  if (text.includes('machine learning') || text.includes('neural network') || text.includes('deep learning')) return 'ml';
  if (text.includes(' ai ') || text.includes('artificial intelligence') || text.includes('language model') || text.includes('llm') || text.includes('gpt') || text.includes('chatgpt')) return 'ai';
  if (text.includes('python') || text.includes('javascript') || text.includes('typescript') || text.includes('react') || text.includes('code') || text.includes('function') || text.includes('bug') || text.includes('error')) return 'code';
  if (text.includes('write') || text.includes('essay') || text.includes('blog') || text.includes('article') || text.includes('draft') || text.includes('creative')) return 'writing';
  if (text.includes('explain') || text.match(/^what is\b/) || text.match(/^how does\b/) || text.match(/^why does\b/)) return 'explain';

  return 'chat';
}

// ─── Tone detection ───────────────────────────────────────────────────────────

function detectTone(input) {
  const text = normalize(input);
  if (text.includes('joke') || text.includes('funny') || text.includes('lol')) return 'casual';
  if (text.includes('explain') || text.includes('what is') || text.includes('how does')) return 'clear';
  if (text.includes('help') || text.includes('how do i') || text.includes('how can i') || text.includes('i need')) return 'helpful';
  if (text.includes('generate') || text.includes('prompt') || text.includes('write')) return 'structured';
  return 'natural';
}

// ─── Exported mode label (used by useChat + MessageBubble badge) ──────────────

export function detectMode(input) {
  return detectIntent(input) === 'prompt_engineering' ? 'prompt_engineering' : 'chat';
}

// ─── Prompt engineering ───────────────────────────────────────────────────────

function generatePromptResponse(input) {
  const cleaned = input
    .replace(/(generate a prompt for|improve this prompt[:]*|optimize prompt|rewrite this prompt|make this prompt better|enhance this prompt|make this better|improve this|optimize this)/gi, '')
    .replace(/^[:\-–,\s]+/, '')
    .trim();

  const subject = cleaned || 'your task';
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return `**Improved Prompt:**\nAct as an expert in the relevant domain. ${cap(subject).replace(/\.?$/, '')}. Be specific and structured — define the desired output format and include any constraints needed for a precise result.\n\n**Why this works:**\nClearer role definition, explicit output constraints, and reduced ambiguity. The model knows exactly who to be, what to produce, and how to format it.\n\n**Variations:**\n- Concise: "${cap(subject)} — summarize in 3 bullet points."\n- Detailed: "${cap(subject)} — provide a step-by-step breakdown with examples."`;
}

// ─── Natural chat response (tone-aware, never echoes input) ───────────────────

function generateNaturalResponse(input, history, tone) {
  const intent = detectIntent(input);
  const hasContext = history && history.filter(m => m.role === 'user').length > 1;
  const ctx = hasContext ? 'Building on what we discussed — ' : '';

  // ── Topic: machine learning ──
  if (intent === 'ml') {
    if (tone === 'casual') {
      return `${ctx}basically, neural nets learn by making a guess, seeing how wrong they were, and nudging their settings to do better next time. Repeat a million times and you've got a trained model.\n\nWant me to go deeper on any part?`;
    }
    if (tone === 'clear') {
      return `${ctx}here's the core loop:\n\n1. **Forward pass** — input flows through layers to produce a prediction.\n2. **Loss** — the prediction is compared to ground truth.\n3. **Backprop** — gradients flow back through layers via the chain rule.\n4. **Update** — an optimizer (SGD, Adam) adjusts the weights.\n\nWhich part would you like to dig into?`;
    }
    return `${ctx}neural networks learn through backpropagation — computing gradients of a loss function and stepping in the direction that reduces error. The transformer architecture extended this with self-attention, letting every token attend to every other token in context.\n\nAny specific area you want to explore — architectures, training, or applications?`;
  }

  // ── Topic: AI / LLMs ──
  if (intent === 'ai') {
    if (tone === 'casual') {
      return `${ctx}LLMs are basically very good at pattern-matching across enormous amounts of text — they learn to predict what comes next, and it turns out that scales into something that feels like reasoning.\n\nAnything specific you're curious about?`;
    }
    return `${ctx}modern large language models are trained on vast corpora using self-supervised objectives — predicting the next token given all previous context. The transformer's self-attention mechanism is what makes this scale: each token can attend to every other token, capturing long-range dependencies.\n\nWant to explore training, inference, fine-tuning, or prompting?`;
  }

  // ── Topic: code ──
  if (intent === 'code') {
    const lang = normalize(input).includes('python') ? 'python' : normalize(input).includes('typescript') ? 'typescript' : 'javascript';
    const example = lang === 'python'
      ? `def process(items):\n    return [item.strip() for item in items if item]`
      : `const process = (items) =>\n  items.filter(Boolean).map(s => s.trim());`;

    if (tone === 'helpful') {
      return `${ctx}let's work through this step by step. Here's a clean starting point:\n\n\`\`\`${lang}\n${example}\n\`\`\`\n\nShare your code or describe what it's supposed to do and I'll tailor it to your situation.`;
    }
    return `${ctx}here's a clean example:\n\n\`\`\`${lang}\n${example}\n\`\`\`\n\nKey principles: early filtering, single responsibility, no side effects. What's the specific problem you're solving?`;
  }

  // ── Topic: writing ──
  if (intent === 'writing') {
    if (tone === 'casual') {
      return `${ctx}good writing is really just clear thinking on paper — start with one sentence that says exactly what you want the reader to walk away believing, then build everything around that.\n\nShare what you're working on and I'll give you specific feedback.`;
    }
    return `${ctx}strong writing starts with a clear thesis — one sentence that anchors the whole piece.\n\n- Open with a specific, concrete detail, not a broad statement.\n- Each paragraph earns one idea with evidence.\n- Close by looping back to the opening.\n\nShare your draft or topic and I'll give line-level feedback.`;
  }

  // ── Topic: explain ──
  if (intent === 'explain') {
    const topic = input.replace(/explain|what is|how does|why does|please|can you/gi, '').trim();
    if (tone === 'clear') {
      return `${ctx}${topic ? `Here's a clear breakdown of ${topic}:` : "Here's a clear breakdown:"}\n\nAt its core, it's a mechanism that produces a specific outcome under certain conditions. The key variable is context — small changes in inputs often produce meaningfully different results.\n\n${topic ? `Want me to go deeper on the theory, show a real example, or explain the practical use of ${topic}?` : 'Want theory, examples, or practical use?'}`;
    }
    return `${ctx}${topic ? `Let me break down ${topic}:` : 'Let me break that down:'}\n\nThe concept works by establishing a relationship between inputs and outputs through a defined mechanism. Context and constraints shape the result significantly.\n\n${topic ? `Would a real-world analogy or a technical breakdown help more for ${topic}?` : 'Would a real-world analogy or technical breakdown help?'}`;
  }

  // ── Generic fallback ──
  if (tone === 'casual') {
    return `${ctx}good question — the short answer is that it depends on context, but the clearest path is usually to start simple and iterate.\n\nTell me more about what you're trying to do and I'll give you a more direct answer.`;
  }
  if (tone === 'helpful') {
    return `${ctx}let's figure this out. A good starting point:\n\n- What outcome are you aiming for?\n- What have you already tried?\n- Where exactly are you stuck?\n\nThe more context you share, the more specific I can be.`;
  }
  return `${ctx}that's worth thinking through carefully. Start by defining the outcome precisely — vague inputs tend to produce vague results. What's the specific context you're working in?`;
}

// ─── Main response router ─────────────────────────────────────────────────────

function generateAIResponse(input, history = []) {
  const intent = detectIntent(input);
  const tone = detectTone(input);

  switch (intent) {
    case 'greeting':
      return "Hey! I'm IB AI — what are you working on?";

    case 'joke':
      return "Why did the developer go broke? Because they used up all their cache. 😄\n\nWant another, or can I help with something?";

    case 'thanks':
      return "Anytime. What else can I help with?";

    case 'capability':
      return "I can help you explain things, solve problems, write and edit content, debug code, and generate better prompts. What do you want to tackle?";

    case 'prompt_engineering':
      return generatePromptResponse(input);

    default:
      return generateNaturalResponse(input, history, tone);
  }
}

// ─── Safety wrapper (exported, called by useChat) ─────────────────────────────

export function safeAIResponse(input, history) {
  try {
    if (!input || typeof input !== 'string' || !input.trim()) {
      return 'Please enter a valid message.';
    }
    return generateAIResponse(input.trim(), history);
  } catch (err) {
    return 'Something went wrong. Please try again.';
  }
}

// Backwards-compatible alias — useChat.js calls generateResponse
export const generateResponse = safeAIResponse;

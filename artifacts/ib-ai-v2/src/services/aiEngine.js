// --- Helpers ---

const normalize = (text) => text.toLowerCase().trim().replace(/\s+/g, ' ');

// --- Intent detection ---

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

// --- Exported mode label (used by useChat + MessageBubble for badge) ---

export function detectMode(input) {
  return detectIntent(input) === 'prompt_engineering' ? 'prompt_engineering' : 'chat';
}

// --- Response generators ---

function generatePromptResponse(input) {
  const cleaned = input
    .replace(/(generate a prompt for|improve this prompt[:]*|optimize prompt|rewrite this prompt|make this prompt better|enhance this prompt|make this better|improve this|optimize this)/gi, '')
    .replace(/^[:\-–,\s]+/, '')
    .trim();

  const subject = cleaned || 'your task';

  return `**1. Improved Prompt:**\nAct as an expert in the relevant domain. ${subject.charAt(0).toUpperCase() + subject.slice(1).replace(/\.?$/, '')}. Be specific and structured. Define the desired output format and include any constraints or context needed for a precise result.\n\n**2. Why This Is Better:**\nThe original lacked role definition and output constraints. This version tells the AI who to be, what to produce, and how to format it — reducing vague or off-target responses.\n\n**3. Variations:**\n- Concise version: "${subject.length > 60 ? subject.slice(0, 60) + '...' : subject} — answer in 3 bullet points."\n- Detailed version: "${subject.charAt(0).toUpperCase() + subject.slice(1)} — provide a step-by-step breakdown with examples."`;
}

function generateChatResponse(input, history) {
  const intent = detectIntent(input);
  const hasContext = history && history.filter(m => m.role === 'user').length > 1;
  const contextPrefix = hasContext ? 'Building on what we discussed — ' : '';

  if (intent === 'ml') {
    return `${contextPrefix}neural networks learn by adjusting weights through backpropagation — computing gradients of a loss function and stepping in the direction that reduces error.\n\n1. Forward pass: input flows through layers to produce a prediction.\n2. Loss computation: the prediction is compared to ground truth.\n3. Backward pass: gradients flow back through layers via the chain rule.\n4. Weight update: an optimizer (SGD, Adam) applies the gradients.\n\n**Which aspect would you like to go deeper on — architectures, training dynamics, or a specific application?**`;
  }

  if (intent === 'ai') {
    return `${contextPrefix}modern large language models are trained on vast corpora using self-supervised objectives — predicting the next token given all previous context.\n\nThe transformer architecture underpins most of them: self-attention lets each token attend to every other token, capturing long-range dependencies that older RNN approaches couldn't.\n\n**Do you want to explore training, inference, fine-tuning, or prompting strategies?**`;
  }

  if (intent === 'code') {
    const lang = normalize(input).includes('python') ? 'python' : normalize(input).includes('typescript') ? 'typescript' : 'javascript';
    const example = lang === 'python'
      ? `def process(items):\n    return [item.strip() for item in items if item]`
      : `const process = (items) =>\n  items.filter(Boolean).map(s => s.trim());`;
    return `${contextPrefix}here is a clean example:\n\n\`\`\`${lang}\n${example}\n\`\`\`\n\nKey principles: early filtering, single responsibility, no side effects.\n\n**Share your code or describe the specific problem and I will tailor the solution.**`;
  }

  if (intent === 'writing') {
    return `${contextPrefix}strong writing starts with a clear thesis — one sentence that tells the reader exactly what they will walk away believing.\n\n1. Open with a specific, concrete detail (not a broad statement).\n2. Build each paragraph around one idea with supporting evidence.\n3. Close by looping back to the opening — create resolution.\n\n**Share your draft or topic and I will give specific, line-level feedback.**`;
  }

  if (intent === 'explain') {
    const topic = input.replace(/explain|what is|how does|why does|please|can you/gi, '').trim();
    return `${contextPrefix}let me break that down:\n\n1. At its core, the concept involves a mechanism that drives the outcome you are asking about.\n2. Context is the key variable — small changes in inputs produce significantly different results.\n3. In practice, this manifests as a pattern you can observe and test.\n\n${topic ? `**What specifically about "${topic}" would you like to explore — theory, examples, or practical use?**` : '**Would you like a technical breakdown, a real-world analogy, or a concrete example?**'}`;
  }

  // Generic fallback — never echo the input back
  return `${contextPrefix}that is worth thinking through carefully. Here is a structured approach:\n\n1. Define the problem precisely — vague inputs produce vague outputs.\n2. Identify what success looks like before choosing a method.\n3. Start with the simplest version that works, then iterate.\n\n**Tell me more about the context and I will give you a sharper, more specific answer.**`;
}

function generateAIResponse(input, history = []) {
  const intent = detectIntent(input);

  switch (intent) {
    case 'greeting':
      return "Hey! I'm IB AI — ask me anything. I can answer questions, explain topics, write content, or help you engineer better prompts.";

    case 'joke':
      return "Why did the developer go broke? Because they used up all their cache. 😄\n\n**Want another one, or can I help you with something more serious?**";

    case 'thanks':
      return "You're welcome — glad I could help. Anything else on your mind?";

    case 'capability':
      return "I can help you with:\n\n1. Answering questions on any topic\n2. Explaining technical concepts clearly\n3. Writing and editing content\n4. Generating and optimizing AI prompts\n5. Reviewing and debugging code\n\n**What would you like to start with?**";

    case 'prompt_engineering':
      return generatePromptResponse(input);

    default:
      return generateChatResponse(input, history);
  }
}

// --- Safety wrapper (exported, used by useChat) ---

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

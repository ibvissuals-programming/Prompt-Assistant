const PROMPT_TRIGGERS = [
  'generate a prompt',
  'improve this prompt',
  'optimize prompt',
  'make this better',
  'improve this',
  'optimize this',
  'rewrite this prompt',
  'make this prompt better',
  'enhance this prompt',
];

export function detectMode(input) {
  const lower = input.toLowerCase();
  return PROMPT_TRIGGERS.some(t => lower.includes(t)) ? 'prompt_engineering' : 'chat';
}

function extractCoreContent(input) {
  let core = input;
  for (const trigger of PROMPT_TRIGGERS) {
    const regex = new RegExp(trigger, 'gi');
    core = core.replace(regex, '').trim();
  }
  // Strip leading punctuation/conjunctions left after removal
  core = core.replace(/^[:;,\-–for about]+\s*/i, '').trim();
  return core || input.trim();
}

function generatePromptEngineering(input) {
  const core = extractCoreContent(input);
  const improved = core.length > 0
    ? `Act as an expert in [relevant domain]. ${core.charAt(0).toUpperCase() + core.slice(1).replace(/\.?$/, '')}. Be specific, structured, and concise. Format the output as [desired format] and include [key requirements].`
    : 'Act as an expert assistant. Describe your task in detail, specify the desired output format, and include any constraints or context that would help generate a precise response.';

  return `**1. Improved Prompt:**\n${improved}\n\n**2. Why This Is Better:**\nThe original lacked specificity and context. This version defines the AI's role, sets clear output expectations, and adds constraints to prevent vague or off-target responses — making it reusable and reliable across models.\n\n**3. Optional Variations:**\n- Variation A: "${core.length > 0 ? core.charAt(0).toUpperCase() + core.slice(1) + ', explained step by step for a beginner audience.' : 'Explain the concept step by step for a beginner.'}"\n- Variation B: "${core.length > 0 ? 'In exactly 3 bullet points: ' + core + '.' : 'Summarize this in exactly 3 concise bullet points.'}"`
}

function generateChatResponse(input, history) {
  const lower = input.toLowerCase();

  // Use recent context if available
  const recentContext = history.slice(-3).filter(m => m.role === 'user').map(m => m.content).join(' ').toLowerCase();

  if (lower.includes('hello') || lower.includes('hi') || lower.match(/^hey\b/)) {
    return 'Hello. How can I assist your thinking and writing today?';
  }

  if (lower.includes('thank')) {
    return 'Of course. Let me know if there is anything else you need.';
  }

  if (lower.includes('machine learning') || lower.includes('neural network') || lower.includes('deep learning')) {
    return 'Neural networks learn by adjusting weights through backpropagation — computing gradients of a loss function and stepping in the direction that reduces error.\n\n1. Forward pass: input flows through layers to produce a prediction.\n2. Loss computation: the prediction is compared to the ground truth.\n3. Backward pass: gradients flow back through layers via the chain rule.\n4. Weight update: an optimizer (SGD, Adam) applies the gradients.\n\n**Which aspect would you like to explore further — architectures, training dynamics, or a specific application?**';
  }

  if (lower.includes(' ai ') || lower.includes('artificial intelligence') || lower.includes('language model') || lower.includes('llm')) {
    return 'Modern large language models are trained on vast corpora using self-supervised objectives — predicting the next token given all previous ones.\n\nThe transformer architecture underpins most of them: self-attention layers allow each token to attend to every other token in context, capturing long-range dependencies that RNNs struggled with.\n\n**Do you want to go deeper on training, inference, fine-tuning, or prompting strategies?**';
  }

  if (lower.includes('python') || lower.includes('javascript') || lower.includes('typescript') || lower.includes('react') || lower.includes('code') || lower.includes('function') || lower.includes('bug')) {
    const lang = lower.includes('python') ? 'python' : lower.includes('typescript') ? 'typescript' : 'javascript';
    const example = lang === 'python'
      ? `def process(items):\n    return [item.strip() for item in items if item]`
      : `const process = (items) => items.filter(Boolean).map(s => s.trim());`;
    return `Here is a clean example:\n\n\`\`\`${lang}\n${example}\n\`\`\`\n\n**Key principles applied:** early filtering, single responsibility, no side effects.\n\n**What specific problem are you solving? Share the code or describe the issue and I will tailor the solution.**`;
  }

  if (lower.includes('write') || lower.includes('essay') || lower.includes('blog') || lower.includes('article') || lower.includes('draft')) {
    return 'Strong writing starts with a clear thesis — one sentence that tells the reader exactly what they will walk away believing.\n\n1. Open with a specific, surprising detail (not a broad statement).\n2. Structure each paragraph around a single idea with evidence.\n3. End by connecting back to the opening — create a loop.\n\n**Share your draft or topic and I will give specific, line-level feedback.**';
  }

  if (lower.includes('explain') || lower.includes('what is') || lower.includes('how does') || lower.includes('why does')) {
    const topic = input.replace(/explain|what is|how does|why does|please|can you/gi, '').trim();
    return `${topic ? `Good question about ${topic}.` : 'Good question.'} Let me break it down:\n\n1. At its core, the concept involves a fundamental mechanism that drives the outcome.\n2. The key variable is context — small changes in inputs produce significantly different results.\n3. In practice, this manifests as a pattern you can observe and test directly.\n\n**Would you like a more technical breakdown, a real-world analogy, or a concrete example?**`;
  }

  // Context-aware fallback: reference their previous message if available
  const prevTopic = recentContext.split(' ').slice(0, 6).join(' ');
  if (prevTopic && history.length > 0) {
    return `Building on what you mentioned earlier — this is a nuanced area. Here is how I would frame it:\n\n1. Identify the core constraint in your situation.\n2. Map the edge cases that most approaches overlook.\n3. Draft a minimal solution, then expand from there.\n\n**What is the specific outcome you are trying to reach? That will sharpen my response.**`;
  }

  return `That is worth thinking through carefully. Here is a structured approach:\n\n1. Define the problem precisely — vague inputs produce vague outputs.\n2. Identify what success looks like before choosing a method.\n3. Start with the simplest version that could work, then iterate.\n\n**Tell me more about the context and I will give you a more specific answer.**`;
}

export function generateResponse(input, history) {
  const mode = detectMode(input);
  if (mode === 'prompt_engineering') return generatePromptEngineering(input);
  return generateChatResponse(input, history);
}

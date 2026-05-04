const PROMPT_TRIGGERS = [
  'generate a prompt', 'improve this prompt', 'optimize prompt',
  'make this better', 'improve this', 'optimize this', 'rewrite this prompt',
  'make this prompt better', 'enhance this prompt'
];

export function detectMode(input) {
  const lower = input.toLowerCase();
  return PROMPT_TRIGGERS.some(t => lower.includes(t)) ? 'prompt_engineering' : 'chat';
}

function generatePromptEngineering(input) {
  return `**1. Improved Prompt:**\n${input.replace(/improve this prompt|make this better/i, '').trim()} - optimized for clarity, context, and specific output format.\n\n**2. Why This Is Better:**\nAdded missing constraints and defined a clear tone. This ensures the model won't guess your intent and will structure the response perfectly.\n\n**3. Optional Variations:**\n- Variation A: Same intent, but tuned for a more professional, analytical tone.\n- Variation B: A shorter, punchier version for quick brainstorming.`;
}

function generateChatResponse(input, history) {
  const lower = input.toLowerCase();
  if (lower.includes('ai') || lower.includes('machine learning')) {
    return 'That is an excellent question about AI. From a technical standpoint, the core of modern machine learning relies on gradient descent and backpropagation to optimize high-dimensional parameter spaces. **Do you need a more specific breakdown of a certain architecture?**';
  }
  if (lower.includes('code') || lower.includes('javascript') || lower.includes('react')) {
    return `Sure, here is a quick coding example to help you out:\n\n\`\`\`javascript\nconst example = () => {\n  console.log("Hello from IB AI v2!");\n};\n\`\`\`\n\n**Let me know if you need this adapted to a specific use case.**`;
  }
  if (lower.includes('write') || lower.includes('creative')) {
    return 'For creative writing, the key is to show, not tell. Ground your concepts in specific, sensory details. Instead of saying something is "fast," describe how it blurs past. **What specific piece are you working on?**';
  }
  if (lower.includes('hello') || lower.includes('hi ')) {
    return 'Hello. How can I assist your thinking and writing today?';
  }
  
  return `I understand. You mentioned: "${input.substring(0, 50)}${input.length > 50 ? '...' : ''}".\n\nThis is a nuanced topic. To build on that, consider breaking it down into smaller, actionable components.\n\n1. Define the core constraint.\n2. Map the edge cases.\n3. Draft the initial response.\n\n**Would you like to explore one of these points further?**`;
}

export function generateResponse(input, history) {
  const mode = detectMode(input);
  if (mode === 'prompt_engineering') return generatePromptEngineering(input);
  return generateChatResponse(input, history);
}

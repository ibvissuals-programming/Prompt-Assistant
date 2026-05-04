import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Cpu, User } from 'lucide-react';

function renderBold(line) {
  return line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={j} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    return <span key={j}>{part}</span>;
  });
}

function renderContent(text) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;

    if (line.trim().startsWith('```')) return null;

    if (/^\d+\./.test(line.trim())) {
      const num = line.match(/^\d+/)[0];
      const rest = line.replace(/^\d+\.\s*/, '');
      return (
        <div key={i} className="flex gap-2 my-0.5">
          <span className="text-primary font-medium shrink-0">{num}.</span>
          <span>{renderBold(rest)}</span>
        </div>
      );
    }

    if (line.trim().startsWith('- ') || line.trim().startsWith('– ')) {
      const rest = line.replace(/^[-–]\s*/, '');
      return (
        <div key={i} className="flex gap-2 my-0.5">
          <span className="text-primary shrink-0 mt-0.5">–</span>
          <span>{renderBold(rest)}</span>
        </div>
      );
    }

    return <p key={i} className="leading-relaxed">{renderBold(line)}</p>;
  });
}

export function MessageBubble({ message, index }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isPromptEngineering = message.mode === 'prompt_engineering';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.03, 0.18) }}
      className={`flex gap-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      data-testid={`message-bubble-${message.id}`}
    >
      <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${
        isUser
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary border border-border text-muted-foreground'
      }`}>
        {isUser ? <User size={13} /> : <Cpu size={13} />}
      </div>

      <div className={`relative max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : isPromptEngineering
              ? 'bg-card border border-purple-500/30 text-foreground rounded-tl-sm'
              : 'bg-card border border-border text-foreground rounded-tl-sm'
          }`}
        >
          {isPromptEngineering && !isUser && (
            <div className="text-xs text-purple-400 font-medium mb-2 pb-2 border-b border-purple-500/20 tracking-wide uppercase">
              Prompt Engineering
            </div>
          )}
          <div className="space-y-1">
            {renderContent(message.content)}
          </div>
        </div>

        <button
          onClick={handleCopy}
          data-testid={`button-copy-${message.id}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity self-end flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </motion.div>
  );
}

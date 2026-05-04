import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { MessageBubble } from './MessageBubble';

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex gap-3 items-end"
    >
      <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center bg-secondary border border-border text-muted-foreground">
        <Cpu size={13} />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-border">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <Cpu size={20} className="text-primary" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">IB AI v2</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        Ask me anything. For prompt engineering, try: "generate a prompt for..." or "improve this prompt: ..."
      </p>
      <div className="mt-6 flex flex-col gap-2 w-full max-w-sm">
        {[
          'Explain gradient descent in simple terms',
          'Improve this prompt: Write a blog post about AI',
          'Help me structure a React component for a dashboard',
        ].map((suggestion, i) => (
          <div key={i} className="text-left text-xs text-muted-foreground px-3 py-2 rounded-lg border border-border/50 bg-secondary/30">
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatWindow({ messages, isTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (messages.length === 0 && !isTyping) {
    return (
      <div className="flex-1 overflow-y-auto">
        <EmptyState />
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-6 space-y-5 scroll-smooth"
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(217 33% 20%) transparent' }}
      data-testid="chat-window"
    >
      {messages.map((message, index) => (
        <MessageBubble key={message.id} message={message} index={index} />
      ))}
      <AnimatePresence>
        {isTyping && <TypingIndicator />}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}

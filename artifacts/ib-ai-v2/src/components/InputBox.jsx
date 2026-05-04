import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function InputBox({ onSend, onClear, disabled }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  const handleInput = (e) => {
    setValue(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    if (showClearConfirm) {
      onClear();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="px-4 pb-5 pt-3">
      <motion.div
        animate={{ boxShadow: focused ? '0 0 0 1px hsl(217 91% 60% / 0.4)' : '0 0 0 1px transparent' }}
        transition={{ duration: 0.15 }}
        className="relative rounded-2xl bg-card border border-border overflow-hidden"
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          rows={1}
          data-testid="input-message"
          placeholder='Message IB AI v2... (try "generate a prompt for...")'
          className="w-full bg-transparent text-foreground text-sm placeholder:text-muted-foreground/60 resize-none outline-none px-4 py-3.5 pr-24 leading-relaxed disabled:opacity-50"
          style={{ maxHeight: '120px', minHeight: '52px' }}
        />

        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          <button
            onClick={handleClear}
            data-testid="button-clear-chat"
            className={`p-2 rounded-xl transition-all text-xs font-medium ${
              showClearConfirm
                ? 'bg-destructive/20 text-destructive border border-destructive/30'
                : 'text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary'
            }`}
            title={showClearConfirm ? 'Click again to confirm' : 'Clear chat'}
          >
            {showClearConfirm ? (
              <span className="px-1">Clear?</span>
            ) : (
              <Trash2 size={14} />
            )}
          </button>

          <button
            onClick={handleSend}
            disabled={!canSend}
            data-testid="button-send"
            className={`p-2 rounded-xl transition-all ${
              canSend
                ? 'bg-primary text-primary-foreground hover:opacity-90 active:scale-95'
                : 'bg-secondary text-muted-foreground/30 cursor-not-allowed'
            }`}
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </motion.div>

      <p className="text-center text-xs text-muted-foreground/40 mt-2">
        Enter to send, Shift + Enter for new line
      </p>
    </div>
  );
}

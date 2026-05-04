import { LogOut, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header({ user, onLogout, currentMode }) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <Cpu size={14} className="text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm tracking-tight text-foreground">
          IB AI <span className="text-primary">v2</span>
        </span>
      </div>

      <div className="flex-1 flex justify-center">
        {currentMode === 'prompt_engineering' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-xs px-3 py-1 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 font-medium tracking-wide"
          >
            Prompt Engineering Mode
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground hidden sm:block">
          {user?.username}
        </span>
        <button
          onClick={onLogout}
          data-testid="button-logout"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-secondary"
        >
          <LogOut size={13} />
          <span className="hidden sm:block">Sign out</span>
        </button>
      </div>
    </header>
  );
}

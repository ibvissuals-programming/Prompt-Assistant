import { LogOut, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header({ user, onLogout, currentMode, onMenuToggle, mobileSidebarOpen, activeTitle }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10 gap-3">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        data-testid="button-mobile-menu"
        className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
      >
        {mobileSidebarOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Active chat title (center on mobile, left on desktop) */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        {activeTitle && (
          <span className="text-sm font-medium text-foreground truncate">{activeTitle}</span>
        )}
      </div>

      {/* Mode badge */}
      <div className="flex-shrink-0">
        {currentMode === 'prompt_engineering' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-xs px-2.5 py-1 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 font-medium tracking-wide hidden sm:block"
          >
            Prompt Engineering
          </motion.div>
        )}
      </div>

      {/* User + Logout */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground hidden lg:block">
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

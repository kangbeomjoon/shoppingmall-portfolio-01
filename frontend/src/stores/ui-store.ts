import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  toast: {
    isOpen: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null;
}

interface UIActions {
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleSearch: () => void;
  closeSearch: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState & UIActions>((set, get) => ({
  // State
  isMobileMenuOpen: false,
  isSearchOpen: false,
  theme: 'system',
  sidebarOpen: false,
  toast: null,

  // Actions
  toggleMobileMenu: () => {
    set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  closeMobileMenu: () => {
    set({ isMobileMenuOpen: false });
  },

  toggleSearch: () => {
    set(state => ({ isSearchOpen: !state.isSearchOpen }));
  },

  closeSearch: () => {
    set({ isSearchOpen: false });
  },

  setTheme: (theme: 'light' | 'dark' | 'system') => {
    set({ theme });
    
    // Apply theme to document
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (mediaQuery.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  },

  toggleSidebar: () => {
    set(state => ({ sidebarOpen: !state.sidebarOpen }));
  },

  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    set({
      toast: {
        isOpen: true,
        message,
        type,
      },
    });

    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      get().hideToast();
    }, 5000);
  },

  hideToast: () => {
    set({ toast: null });
  },
}));
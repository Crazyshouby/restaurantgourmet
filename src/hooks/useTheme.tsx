
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'system'
  );
  
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    // Default to light if no preference
    if (typeof window === 'undefined') return 'light';
    
    // Get from localStorage or use system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && savedTheme !== 'system') {
      return savedTheme as 'light' | 'dark';
    }
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme
    root.classList.remove('light', 'dark');
    
    // Determine and set the resolved theme
    let resolvedTheme: 'light' | 'dark';
    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolvedTheme = theme as 'light' | 'dark';
    }
    
    root.classList.add(resolvedTheme);
    setResolvedTheme(resolvedTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const newResolvedTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newResolvedTheme);
        setResolvedTheme(newResolvedTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return {
    theme,
    setTheme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
  };
}

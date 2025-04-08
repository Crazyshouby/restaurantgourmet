
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type AdminThemeType = 'dark' | 'light';

interface AdminThemeContextType {
  theme: AdminThemeType;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
};

interface AdminThemeProviderProps {
  children: ReactNode;
}

export const AdminThemeProvider: React.FC<AdminThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<AdminThemeType>('dark');

  // Initialiser le thème à partir du localStorage s'il existe
  useEffect(() => {
    const storedTheme = localStorage.getItem('admin-theme') as AdminThemeType | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  // Appliquer la classe de thème au conteneur admin
  useEffect(() => {
    const adminContainer = document.getElementById('admin-container');
    if (adminContainer) {
      if (theme === 'dark') {
        adminContainer.classList.add('admin-dark');
        adminContainer.classList.remove('admin-light');
      } else {
        adminContainer.classList.add('admin-light');
        adminContainer.classList.remove('admin-dark');
      }
    }
    // Stocker le thème dans localStorage
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

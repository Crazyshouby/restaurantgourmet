
import { Moon, Sun } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="w-9 h-9"></div>;
  }
  
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Toggle 
      aria-label="Basculer le thème"
      pressed={resolvedTheme === 'dark'}
      onPressedChange={toggleTheme}
      size="sm"
      className="relative overflow-hidden group transition-colors"
    >
      {resolvedTheme === 'dark' ? (
        <Moon className="h-4 w-4 transform transition-transform duration-300 animate-pulse-subtle" />
      ) : (
        <Sun className="h-4 w-4 transform transition-transform duration-300 animate-pulse-subtle" />
      )}
      <span 
        className="absolute inset-0 bg-primary/10 rounded-md -z-10 scale-0 transition-transform duration-300 group-hover:scale-100"
        aria-hidden="true"
      ></span>
    </Toggle>
  );
}

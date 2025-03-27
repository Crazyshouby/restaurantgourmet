
import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    const addScrollAnimation = () => {
      const animatedElements = document.querySelectorAll('.animate-on-scroll');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });
      
      animatedElements.forEach(element => {
        observer.observe(element);
      });
      
      return () => {
        animatedElements.forEach(element => {
          observer.unobserve(element);
        });
      };
    };
    
    // Apply scroll animations after a short delay to ensure DOM is ready
    const timeout = setTimeout(addScrollAnimation, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Grain texture overlay */}
      <div className="texture-overlay" aria-hidden="true"></div>
      
      <Header />
      <main className="animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

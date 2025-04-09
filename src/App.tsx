
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import StorageBucketCreator from '@/components/common/StorageBucketCreator';

// Import our pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Events from './pages/Events';
import Admin from './pages/Admin';
import MenuAdmin from './pages/MenuAdmin';
import EventsAdmin from './pages/EventsAdmin';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

// Create a QueryClient for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          {/* This component creates necessary storage buckets */}
          <StorageBucketCreator />
          
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/events" element={<Events />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/menu-admin" element={<MenuAdmin />} />
            <Route path="/events-admin" element={<EventsAdmin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

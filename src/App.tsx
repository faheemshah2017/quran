import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ChapterList from './pages/ChapterList';
import ChapterReader from './pages/ChapterReader';
import Bookmarks from './pages/Bookmarks';
import './index.css';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProgressProvider>
      <div className="flex h-screen overflow-hidden bg-slate-950">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chapters" element={<ChapterList />} />
              <Route path="/chapters/:id" element={<ChapterReader />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Routes>
          </main>
        </div>
      </div>
    </ProgressProvider>
  );
}

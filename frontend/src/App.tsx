import './App.css'
import Layout from './layouts/Layout'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Reviews from './pages/Reviews';
import Repositories from './pages/Repositories';
import Settings from './pages/Settings';
import ReviewDetails from './pages/ReviewDetails';
import { useEffect, useState } from 'react';

export type Theme = "light" | "dark";

function App() {
  const [theme, setTheme] = useState<Theme>(()=>{
    const savedTheme = localStorage.getItem("prism-theme");
    return savedTheme === "dark" ? "dark" : "light";
  })

  useEffect(()=>{
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("prism-theme", theme);
  }, [theme])

  function toggleTheme(){
    setTheme(currentTheme => currentTheme === "light" ? "dark" : "light");
  }
  return (
    <div className="app" data-theme={theme}>
      <Routes>
        <Route path="/" element={<Layout theme={theme} toggleTheme={toggleTheme} />}>
          <Route index element={<Dashboard />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="repositories" element={<Repositories />} />
          <Route path="settings" element={<Settings />} />
          <Route path="reviews/:id" element={<ReviewDetails />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

import React, { useRef, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import './assets/styles/globals.css';

// 导入组件
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GitHubStats from './components/GitHubStats';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Blog from './components/Blog';
// import LearningPath from './components/LearningPath';
import Tools from './components/Tools';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Toast from './components/Toast';

function App() {
  const toastRef = useRef(null);

  useEffect(() => {
    // 监听键盘快捷键
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K 快速搜索
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // 这里可以添加搜索功能
        showToast('搜索功能开发中...');
      }
      
      // T 键切换主题
      if ((e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
          themeToggle.click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 显示Toast通知
  const showToast = (message, duration = 3000) => {
    if (!toastRef.current) return;
    
    const toast = toastRef.current;
    const toastMessage = toast.querySelector('#toastMessage');
    
    if (toastMessage) {
      toastMessage.textContent = message;
    }
    
    // 显示toast
    toast.classList.remove('translate-x-full', 'opacity-0', 'invisible');
    toast.classList.add('translate-x-0', 'opacity-100', 'visible');
    
    setTimeout(() => {
      // 隐藏toast
      toast.classList.add('translate-x-full', 'opacity-0', 'invisible');
      toast.classList.remove('translate-x-0', 'opacity-100', 'visible');
    }, duration);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen text-github-text transition-colors duration-300">
        <Navbar toastRef={toastRef} />
        <Hero />
        <main className="max-w-6xl mx-auto px-6">
          <GitHubStats />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Blog />
          {/* <LearningPath /> */}
          <Tools />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
        <Toast ref={toastRef} />
      </div>
    </ThemeProvider>
  );
}

export default App;
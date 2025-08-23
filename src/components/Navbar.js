import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { showToast } from '../utils/helpers';

const Navbar = ({ toastRef }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // 导航栏背景透明度
      setScrolled(window.scrollY > 50);
      
      // 高亮当前页面部分
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    showToast(`已切换到${newTheme === 'dark' ? '深色' : '浅色'}模式`, 3000, toastRef);
  };

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`sticky top-0 bg-github-dark/95 dark:bg-github-dark/95 bg-light-bg/95 border-b border-github-border dark:border-github-border border-light-border z-50 ${scrolled ? 'backdrop-blur-md' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-github-gray dark:bg-github-gray bg-light-gray rounded-full flex items-center justify-center">
              <i className="fab fa-github text-github-blue"></i>
            </div>
            <span className="font-semibold">SlateJack</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6">
              {['about', 'skills', 'projects', 'experience', 'blog', 'contact'].map((section) => (
                <a 
                  key={section}
                  href={`#${section}`}
                  onClick={(e) => handleNavClick(e, section)}
                  className={`hover:text-github-blue transition-colors ${activeSection === section ? 'text-github-blue' : ''}`}
                >
                  {section === 'about' ? '关于' : 
                   section === 'skills' ? '技能' : 
                   section === 'projects' ? '项目' : 
                   section === 'experience' ? '经历' : 
                   section === 'blog' ? '博客' : '联系'}
                </a>
              ))}
            </div>
            {/* 主题切换按钮 */}
            <div className="flex items-center space-x-2">
              <i className="fas fa-moon text-blue-400 text-sm"></i>
              <div 
                className={`theme-toggle ${theme === 'light' ? 'light' : ''}`} 
                onClick={handleThemeToggle}
              ></div>
              <i className="fas fa-sun text-yellow-400 text-sm"></i>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
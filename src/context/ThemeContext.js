import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // 从localStorage获取保存的主题，默认为深色模式
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // 触发自定义事件，通知其他组件主题已更改
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    
    return newTheme;
  };

  const applyTheme = (theme) => {
    const html = document.documentElement;
    const body = document.body;
    
    if (theme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
      body.classList.add('dark');
      body.classList.add('bg-github-dark');
      body.classList.remove('light');
      body.classList.remove('bg-github-light');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      body.classList.remove('dark');
      body.classList.remove('bg-github-dark')
      body.classList.add('light');
      body.classList.add('bg-github-light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
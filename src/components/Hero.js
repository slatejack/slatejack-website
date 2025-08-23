import React, { useEffect, useRef } from 'react';
import { scrollToElement } from '../utils/helpers';

const Hero = () => {
  const titleRef = useRef(null);
  const typingRef = useRef(false);

  useEffect(() => {
    // 打字机效果
    const heroTitle = titleRef.current;
    if (heroTitle && !typingRef.current) {
      const text = "SlateJack";
      heroTitle.textContent = '';
    
      let i = 0;
      const typeWriter = () => {
        typingRef.current = true;
        if (i < text.length) {
          heroTitle.textContent = text.substring(0, i + 1);
          i++;
          setTimeout(typeWriter, 100);
        }
      };
      
      // 延迟开始打字效果
      const timerId = setTimeout(typeWriter, 500);
      return () => clearTimeout(timerId);
    }
  }, []);

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className="w-32 h-32 bg-github-gray dark:bg-github-gray bg-light-gray rounded-full flex items-center justify-center mx-auto mb-8">
          <i className="fab fa-github text-5xl text-github-blue"></i>
        </div>
        <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold mb-4"></h1>
        <p className="text-xl text-github-text/70 dark:text-github-text/70 text-light-secondary mb-8">开源贡献者 · 摸鱼技术爱好者</p>
        <div className="flex justify-center space-x-4">
          <a href="https://github.com/slatejack" target="_blank" rel="noopener noreferrer"
             className="bg-github-blue hover:bg-github-blue/80 px-6 py-3 rounded-lg transition-colors">
            <i className="fab fa-github mr-2"></i>查看 GitHub
          </a>
          <a href="#contact" onClick={(e) => {e.preventDefault(); scrollToElement('contact');}}
             className="border border-github-border dark:border-github-border border-light-border hover:border-github-blue px-6 py-3 rounded-lg transition-colors">
            联系我
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
import React, { useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const Contact = () => {
  const contactRef = useRef(null);
  
  const contactInfo = [
    { icon: 'fab fa-github', iconColor: 'text-github-blue', label: 'github.com/slatejack', url: 'https://github.com/slatejack' },
    { icon: 'fas fa-envelope', iconColor: 'text-github-green', label: '通过GitHub联系', url: null },
    { icon: 'fas fa-map-marker-alt', iconColor: 'text-red-400', label: '开源社区', url: null }
  ];
  
  const collaborationTypes = [
    { icon: 'fas fa-handshake', iconColor: 'text-github-blue', label: '开源项目合作' },
    { icon: 'fas fa-lightbulb', iconColor: 'text-yellow-400', label: '技术交流讨论' },
    { icon: 'fas fa-code-branch', iconColor: 'text-github-green', label: '代码审查与优化' }
  ];
  
  useIntersectionObserver(contactRef, () => {
    // 当组件进入视口时的动画效果已经通过CSS的fade-in类实现
  });

  return (
    <section id="contact" className="mb-16 fade-in" ref={contactRef}>
      <h2 className="text-2xl font-bold mb-8">联系方式</h2>
      <div className="bg-github-gray dark:bg-github-gray bg-light-gray rounded-lg p-8 border border-github-border dark:border-github-border border-light-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-6 text-github-blue">联系我</h3>
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <i className={`${item.icon} ${item.iconColor}`}></i>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                       className="text-github-text/80 dark:text-github-text/80 text-light-secondary hover:text-github-blue transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-github-text/80 dark:text-github-text/80 text-light-secondary">{item.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-6 text-github-blue">合作意向</h3>
            <div className="space-y-3">
              {collaborationTypes.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <i className={`${item.icon} ${item.iconColor}`}></i>
                  <span className="text-github-text/80 dark:text-github-text/80 text-light-secondary">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
import React, { useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const Experience = () => {
  const experienceRef = useRef(null);
  
  const experiences = [
    {
      title: 'TDesign Mobile React',
      subtitle: '一套完整的企业级设计体系，拥有基于React技术栈的组件库解决方案。',
      description: '用于构建 设计统一 / 跨端多技术栈 的前端应用时，TDesign 更有优势。',
      period: '2024 - 至今',
      link: 'https://tdesign.tencent.com/mobile-react/overview'
    },
    {
      title: 'rc-bullets-ts',
      subtitle: 'React 弹幕组件库',
      description: '基于 CSS3 Animation，使用 React 构建，可扩展，高性能的弹幕组件库。',
      period: '2022 - 至今',
      link: 'https://slatejack.github.io/rc-bullets-ts/',
    }
  ];
  
  useIntersectionObserver(experienceRef, () => {
    // 当组件进入视口时的动画效果已经通过CSS的fade-in类实现
  });

  return (
    <section id="experience" className="mb-16 fade-in" ref={experienceRef}>
      <h2 className="text-2xl font-bold mb-8">开发经历</h2>
      <div className="bg-github-gray dark:bg-github-gray bg-light-gray rounded-lg p-8 border border-github-border dark:border-github-border border-light-border">
        <div className="relative">
          <div className="timeline-line"></div>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="timeline-item relative pl-8">
                <div className="flex items-start justify-between">
                  <div>
                    <a href={exp.link}>
                      <h3 className="text-lg font-semibold text-github-blue">{exp.title}</h3>
                    </a>
                    <p className="text-github-text/80 dark:text-github-text/80 text-light-secondary">{exp.subtitle}</p>
                    <p className="text-sm text-github-text/60 dark:text-github-text/60 text-light-secondary mt-2">
                      {exp.description}
                    </p>
                  </div>
                  <span className="text-sm text-github-text/60 dark:text-github-text/60 text-light-secondary">{exp.period}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
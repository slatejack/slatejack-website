import React, { useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const About = () => {
  const aboutRef = useRef(null);
  
  useIntersectionObserver(aboutRef, () => {
    // 当组件进入视口时的动画效果已经通过CSS的fade-in类实现
  });

  return (
    <section id="about" className="mb-16 fade-in" ref={aboutRef}>
      <h2 className="text-2xl font-bold mb-8">关于我</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-github-gray dark:bg-github-gray bg-light-gray rounded-lg p-8 border border-github-border dark:border-github-border border-light-border">
          <h3 className="text-xl font-semibold mb-4 text-github-blue">个人简介</h3>
          <p className="text-github-text/80 dark:text-github-text/80 text-light-secondary leading-relaxed mb-4">
            前端小佬，轮子制造者，Vibe Coding实践者。
          </p>
          <p className="text-github-text/80 dark:text-github-text/80 text-light-secondary leading-relaxed">
            致力于编写高质量、可维护的代码。 相信开源的力量，积极参与社区贡献。
          </p>
        </div>
        <div className="bg-github-gray dark:bg-github-gray bg-light-gray rounded-lg p-8 border border-github-border dark:border-github-border border-light-border">
          <h3 className="text-xl font-semibold mb-4 text-github-blue">技术理念</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <i className="fas fa-lightbulb text-yellow-400 mt-1"></i>
              <div>
                <div className="font-medium">持续学习</div>
                <div className="text-sm text-github-text/70 dark:text-github-text/70 text-light-secondary">保持对新技术的好奇心和学习热情</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <i className="fas fa-users text-github-blue mt-1"></i>
              <div>
                <div className="font-medium">开源协作</div>
                <div className="text-sm text-github-text/70 dark:text-github-text/70 text-light-secondary">相信开源的力量，积极参与社区</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <i className="fas fa-cogs text-github-green mt-1"></i>
              <div>
                <div className="font-medium">代码质量</div>
                <div className="text-sm text-github-text/70 dark:text-github-text/70 text-light-secondary">追求简洁、高效、可维护的代码</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
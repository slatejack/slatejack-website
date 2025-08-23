import React, { useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const LearningPath = () => {
  const learningPathRef = useRef(null);
  
  const paths = [
    {
      icon: 'fas fa-code',
      iconColor: 'text-github-blue',
      bgColor: 'bg-github-blue/20',
      title: '基础编程',
      description: '掌握编程基础概念，学习多种编程语言'
    },
    {
      icon: 'fas fa-server',
      iconColor: 'text-github-green',
      bgColor: 'bg-github-green/20',
      title: '后端开发',
      description: '深入学习服务器端开发和数据库设计'
    },
    {
      icon: 'fas fa-cloud',
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      title: '云原生',
      description: '探索容器化、微服务和云平台技术'
    }
  ];
  
  useIntersectionObserver(learningPathRef, () => {
    // 当组件进入视口时的动画效果已经通过CSS的fade-in类实现
  });

  return (
    <section className="mb-16 fade-in" ref={learningPathRef}>
      <h2 className="text-2xl font-bold mb-8">学习路径</h2>
      <div className="bg-github-gray dark:bg-github-gray bg-light-gray rounded-lg p-8 border border-github-border dark:border-github-border border-light-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paths.map((path, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${path.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <i className={`${path.icon} text-2xl ${path.iconColor}`}></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">{path.title}</h3>
              <p className="text-github-text/70 dark:text-github-text/70 text-light-secondary text-sm">
                {path.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningPath;
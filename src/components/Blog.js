import React, { useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const Blog = () => {
  const blogRef = useRef(null);
  
  const blogPosts = [
    {
      type: '技术博客',
      icon: 'fas fa-blog',
      iconColor: 'text-github-blue',
      title: 'Casbin - 一个高效的授权访问控制库',
      content: 'Casbin 技术分享',
      date: '2023-01-09',
      link: 'https://articles.zsxq.com/id_3xn2tkeuda2r.html'
    },
    {
      type: '技术博客',
      icon: 'fas fa-blog',
      iconColor: 'text-github-blue',
      title: '使用ts重构React弹幕库rc-bullets',
      content: '用于记录在此次重构项目中的学习心得。',
      date: '2022-09-18',
      link: 'https://juejin.cn/post/7144576529622630407'
    },
  ];
  
  useIntersectionObserver(blogRef, () => {
    // 当组件进入视口时的动画效果已经通过CSS的fade-in类实现
  });

  return (
    <section id="blog" className="mb-16 fade-in" ref={blogRef}>
      <h2 className="text-2xl font-bold mb-8">技术分享</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post, index) => (
          <div key={index} className="bg-github-gray dark:bg-github-gray bg-light-gray rounded-lg p-6 border border-github-border dark:border-github-border border-light-border card-hover">
            <div className="flex items-center mb-3">
              <i className={`${post.icon} ${post.iconColor} mr-2`}></i>
              <span className="text-sm text-github-text/60 dark:text-github-text/60 text-light-secondary">{post.type}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-github-text/80 dark:text-github-text/80 text-light-secondary text-sm mb-4">
              {post.content}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-github-text/50 dark:text-github-text/50 text-light-secondary">{post.date}</span>
              <a href={post.link} className="text-github-blue hover:text-github-blue/80 text-sm">阅读更多</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blog;
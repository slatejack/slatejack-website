import React, { useRef, useEffect, useState } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const Projects = ({ username = 'slatejack' }) => {
  const projectsRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // 从缓存的JSON文件获取项目数据
  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        setLoading(true);
        
        // 获取缓存的项目数据
        const response = await fetch('https://raw.githubusercontent.com/slatejack/slatejack-website/refs/heads/master/public/data/projects.json');
        if (!response.ok) {
          throw new Error('无法获取项目数据');
        }
        
        const data = await response.json();
        setProjects(data.projects || []);
        setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString('zh-CN') : '未知');
        
        if (data.error) {
          setError(`数据可能不是最新: ${data.error}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('获取项目数据时出错:', err);
        setError(err.message);
        
        // 出错时使用默认项目
        setProjects([]);
        
        setLoading(false);
      }
    };
    
    fetchProjectsData();
  }, []);
  
  useIntersectionObserver(projectsRef, () => {
    // 当组件进入视口时的动画效果已经通过CSS的fade-in类实现
  });

  return (
    <section id="projects" className="mb-16 fade-in" ref={projectsRef}>
      <h2 className="text-2xl font-bold mb-8">精选项目</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-lg mb-6 text-center">
          <p>获取GitHub项目数据时出错: {error}</p>
          <p className="text-sm mt-2">使用默认项目数据展示</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // 加载中的骨架屏
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-github-gray dark:bg-github-gray bg-light-gray rounded-lg p-6 border border-github-border dark:border-github-border border-light-border">
              <div className="flex items-center justify-between mb-4">
                <div className="animate-pulse h-6 w-32 bg-github-border/30 rounded"></div>
                <div className="animate-pulse h-6 w-6 bg-github-border/30 rounded-full"></div>
              </div>
              <div className="animate-pulse h-16 bg-github-border/30 rounded mb-4"></div>
              <div className="flex items-center justify-between">
                <div className="animate-pulse h-5 w-24 bg-github-border/30 rounded"></div>
                <div className="animate-pulse h-5 w-16 bg-github-border/30 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          projects.map((project, index) => (
            <div key={index} className="bg-github-gray dark:bg-github-gray bg-light-gray rounded-lg p-6 border border-github-border dark:border-github-border border-light-border card-hover">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-github-blue">{project.name}</h3>
                <i className="fab fa-github text-github-text/50"></i>
              </div>
              <p className="text-github-text/80 dark:text-github-text/80 text-light-secondary text-sm mb-4 h-16 overflow-hidden">
                {project.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-github-text/60 dark:text-github-text/60 text-light-secondary">
                  <span className="flex items-center">
                    <div className={`w-3 h-3 ${project.languageColor} rounded-full mr-1`}></div>
                    {project.language}
                  </span>
                </div>
                <a href={project.url} target="_blank" rel="noopener noreferrer"
                   className="text-github-blue hover:text-github-blue/80 text-sm">
                  查看项目
                </a>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-github-border/30 dark:border-github-border/30 border-light-border/30">
                <div className="flex items-center space-x-3 text-xs text-github-text/50 dark:text-github-text/50 text-light-secondary">
                  <span className="flex items-center">
                    <i className="fas fa-star mr-1"></i>
                    {project.stars}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-code-branch mr-1"></i>
                    {project.forks}
                  </span>
                </div>
                <span className="text-xs text-github-text/50 dark:text-github-text/50 text-light-secondary">
                  更新于 {project.updatedAt}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="text-center mt-4 text-xs text-github-text/50 dark:text-github-text/50 text-light-secondary">
        数据来源: GitHub 缓存数据 • 最后更新: {lastUpdated || '未知'}
      </div>
    </section>
  );
};

export default Projects;
import React, { useRef, useEffect, useState } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const Tools = () => {
  const toolsRef = useRef(null);
  const [toolCategories, setToolCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // 从缓存的JSON文件获取工具数据
  useEffect(() => {
    const fetchToolsData = async () => {
      try {
        setLoading(true);
        
        // 获取缓存的工具数据
        const response = await fetch('https://raw.githubusercontent.com/slatejack/slatejack-website/refs/heads/master/public/data/tools.json');
        if (!response.ok) {
          throw new Error('无法获取工具数据');
        }
        
        const data = await response.json();
        setToolCategories(data.categories || []);
        setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString('zh-CN') : '未知');
        
        if (data.error) {
          setError(`数据可能不是最新: ${data.error}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('获取工具数据时出错:', err);
        setError(err.message);
        
        // 出错时使用默认工具数据
        setToolCategories([]);
        
        setLoading(false);
      }
    };
    
    fetchToolsData();
  }, []);
  
  useIntersectionObserver(toolsRef, () => {
    // 当组件进入视口时的动画效果已经通过CSS的fade-in类实现
  });

  return (
    <section className="mb-16 fade-in" ref={toolsRef}>
      <h2 className="text-2xl font-bold mb-8">工具推荐</h2>
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-lg mb-6 text-center">
          <p>获取工具数据时出错: {error}</p>
          <p className="text-sm mt-2">使用默认工具数据展示</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // 加载中的骨架屏
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-github-gray dark:bg-github-gray bg-light-gray rounded-lg p-6 border border-github-border dark:border-github-border border-light-border">
              <div className="animate-pulse h-6 w-32 bg-github-border/30 rounded mb-4"></div>
              <div className="space-y-3">
                {Array(3).fill(0).map((_, toolIndex) => (
                  <div key={toolIndex} className="flex items-center space-x-3">
                    <div className="animate-pulse h-4 w-4 bg-github-border/30 rounded-full"></div>
                    <div className="animate-pulse h-4 w-24 bg-github-border/30 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          toolCategories.map((category, index) => (
            <div key={index} className="bg-github-gray dark:bg-github-gray bg-light-gray rounded-lg p-6 border border-github-border dark:border-github-border border-light-border">
              <h3 className={`text-lg font-semibold mb-4 ${category.titleColor}`}>{category.title}</h3>
              <div className="space-y-3">
                {category.tools.map((tool, toolIndex) => (
                  <div key={toolIndex} className="flex items-center space-x-3">
                    <i className={`${tool.icon} ${tool.iconColor}`}></i>
                    <span>{tool.name}</span>
                  </div>
                ))}
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

export default Tools;
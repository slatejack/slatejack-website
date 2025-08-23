import React, { useRef, useEffect, useState, useMemo } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { animateNumber } from '../utils/helpers';

const GitHubStats = () => {
  const statsRef = useRef(null);
  const [animated, setAnimated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // 初始化统计数据结构
  const initialStats = useMemo(() => [
    { icon: 'fas fa-code', value: 0, label: '公开仓库', color: 'text-github-blue', key: 'public_repos' },
    { icon: 'fas fa-star', value: 0, label: '获得星标', color: 'text-yellow-400', key: 'stargazers' },
    { icon: 'fas fa-code-branch', value: 0, label: 'Fork 数量', color: 'text-purple-400', key: 'forks' },
    { icon: 'fas fa-users', value: 0, label: '关注者', color: 'text-github-blue', key: 'followers' }
  ], []);
  
  const [stats, setStats] = useState(initialStats);
  const [displayValues, setDisplayValues] = useState(initialStats.map(() => 0));

  // 从缓存的JSON文件获取GitHub统计数据
  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        setLoading(true);
        
        // 获取缓存的GitHub统计数据
        const response = await fetch('https://raw.githubusercontent.com/slatejack/slatejack-website/refs/heads/master/public/data/github-stats.json');
        if (!response.ok) {
          throw new Error('无法获取GitHub统计数据');
        }
        
        const data = await response.json();
        
        if (data.stats && Array.isArray(data.stats)) {
          setStats(data.stats);
          setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString('zh-CN') : '未知');
        } else {
          throw new Error('统计数据格式不正确');
        }
        
        if (data.error) {
          setError(`数据可能不是最新: ${data.error}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('获取GitHub统计数据时出错:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchGitHubStats();
  }, []);

  const handleIntersection = () => {
    if (animated || loading) return;
    
    stats.forEach((stat, index) => {
      animateNumber(0, stat.value, 1000, (value) => {
        setDisplayValues(prev => {
          const newValues = [...prev];
          newValues[index] = value;
          return newValues;
        });
      });
    });
    
    setAnimated(true);
  };

  useIntersectionObserver(statsRef, handleIntersection);

  return (
    <section className="mb-16 fade-in" ref={statsRef}>
      <h2 className="text-2xl font-bold mb-8 text-center">GitHub 统计</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-lg mb-6 text-center">
          <p>获取GitHub数据时出错: {error}</p>
          <p className="text-sm mt-2">请稍后再试或检查GitHub用户名是否正确</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="stats-card bg-github-gray dark:bg-github-gray bg-light-gray rounded-lg p-6 border border-github-border dark:border-github-border border-light-border text-center">
            <i className={`${stat.icon} text-3xl ${stat.color} mb-3`}></i>
            {loading ? (
              <div className="animate-pulse h-8 w-16 bg-github-border/30 rounded mx-auto"></div>
            ) : (
              <div className="text-2xl font-bold text-github-green">{displayValues[index]}</div>
            )}
            <div className="text-sm text-github-text/70 dark:text-github-text/70 text-light-secondary">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-4 text-xs text-github-text/50 dark:text-github-text/50 text-light-secondary">
        数据来源: GitHub 缓存数据 • 最后更新: {lastUpdated || '未知'}
      </div>
    </section>
  );
};

export default GitHubStats;
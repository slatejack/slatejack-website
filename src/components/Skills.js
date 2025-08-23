import React, { useRef, useEffect, useState } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const Skills = ({ username = 'slatejack' }) => {
  const skillsRef = useRef(null);
  const [animated, setAnimated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // 初始化编程语言和技术栈数据
  const [programmingLanguages, setProgrammingLanguages] = useState([]);
  const [technologies, setTechnologies] = useState([]);

  // 从缓存的JSON文件获取技能数据
  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        setLoading(true);
        
        // 获取缓存的技能数据
        const response = await fetch('https://raw.githubusercontent.com/slatejack/slatejack-website/refs/heads/master/public/data/skills.json');
        if (!response.ok) {
          throw new Error('无法获取技能数据');
        }
        
        const data = await response.json();
        
        // 设置语言数据
        if (data.languages && data.languages.length > 0) {
          const languagesArray = data.languages.map(lang => ({
            name: lang.name,
            percentage: lang.level || 0
          })).slice(0, 4);
          
          setProgrammingLanguages(languagesArray);
        } else {
          setProgrammingLanguages([
            { name: 'JavaScript', percentage: 85 },
            { name: 'Python', percentage: 75 },
            { name: 'Go', percentage: 70 },
            { name: 'Java', percentage: 65 }
          ]);
        }
        
        // 设置框架/技术栈数据
        if (data.frameworks && data.frameworks.length > 0) {
          const techArray = data.frameworks.map(tech => ({
            name: tech.name,
            percentage: tech.level || 0
          })).slice(0, 4);
          
          setTechnologies(techArray);
        } else {
          setTechnologies([
            { name: 'Node.js', percentage: 80 },
            { name: 'React', percentage: 75 },
            { name: 'Docker', percentage: 70 },
            { name: 'MySQL', percentage: 65 }
          ]);
        }
        
        setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString('zh-CN') : '未知');
        
        if (data.error) {
          setError(`数据可能不是最新: ${data.error}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('获取技能数据时出错:', err);
        setError(err.message);
        
        // 出错时使用默认值
        setProgrammingLanguages([]);
        setTechnologies([]);
        setLoading(false);
      }
    };
    
    fetchSkillsData();
  }, []);

  const handleIntersection = () => {
    if (animated || loading) return;
    
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
      const targetWidth = bar.getAttribute('data-width');
      setTimeout(() => {
        bar.style.width = targetWidth + '%';
      }, index * 200);
    });
    
    setAnimated(true);
  };

  useIntersectionObserver(skillsRef, handleIntersection);

  return (
    <section id="skills" className="mb-16 fade-in" ref={skillsRef}>
      <h2 className="text-2xl font-bold mb-8">技能栈</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-lg mb-6 text-center">
          <p>获取技能数据时出错: {error}</p>
          <p className="text-sm mt-2">使用默认数据展示</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-github-gray dark:bg-github-gray bg-light-gray rounded-lg p-8 border border-github-border dark:border-github-border border-light-border">
          <h3 className="text-xl font-semibold mb-6 text-github-blue">编程语言</h3>
          <div className="space-y-4">
            {loading ? (
              // 加载中的骨架屏
              Array(4).fill(0).map((_, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <div className="animate-pulse h-5 w-24 bg-github-border/30 rounded"></div>
                    <div className="animate-pulse h-5 w-10 bg-github-border/30 rounded"></div>
                  </div>
                  <div className="skill-bar">
                    <div className="animate-pulse h-full bg-github-border/30 rounded-full"></div>
                  </div>
                </div>
              ))
            ) : (
              programmingLanguages.map((lang, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span>{lang.name}</span>
                    <span className="text-sm text-github-text/70 dark:text-github-text/70 text-light-secondary">{lang.percentage}%</span>
                  </div>
                  <div className="skill-bar">
                    <div 
                      className="skill-progress" 
                      data-width={lang.percentage} 
                      style={{ width: animated ? `${lang.percentage}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="bg-github-gray dark:bg-github-gray bg-light-gray rounded-lg p-8 border border-github-border dark:border-github-border border-light-border">
          <h3 className="text-xl font-semibold mb-6 text-github-blue">技术栈</h3>
          <div className="space-y-4">
            {loading ? (
              // 加载中的骨架屏
              Array(4).fill(0).map((_, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <div className="animate-pulse h-5 w-24 bg-github-border/30 rounded"></div>
                    <div className="animate-pulse h-5 w-10 bg-github-border/30 rounded"></div>
                  </div>
                  <div className="skill-bar">
                    <div className="animate-pulse h-full bg-github-border/30 rounded-full"></div>
                  </div>
                </div>
              ))
            ) : (
              technologies.map((tech, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span>{tech.name}</span>
                    <span className="text-sm text-github-text/70 dark:text-github-text/70 text-light-secondary">{tech.percentage}%</span>
                  </div>
                  <div className="skill-bar">
                    <div 
                      className="skill-progress" 
                      data-width={tech.percentage}
                      style={{ width: animated ? `${tech.percentage}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4 text-xs text-github-text/50 dark:text-github-text/50 text-light-secondary">
        数据来源: GitHub 缓存数据 • 最后更新: {lastUpdated || '未知'}
      </div>
    </section>
  );
};

export default Skills;
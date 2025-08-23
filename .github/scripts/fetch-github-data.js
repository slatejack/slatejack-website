const axios = require('axios');
const fs = require('fs');
const path = require('path');

const username = 'slatejack'; // GitHub用户名
const token = process.env.GITHUB_TOKEN;

// 确保数据目录存在
const dataDir = path.join(__dirname, '../../public/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 设置API请求头
const headers = {
  'Authorization': token ? `token ${token}` : '',
  'Accept': 'application/vnd.github.v3+json'
};

// 获取仓库数据
async function fetchRepositories() {
  try {
    console.log('获取仓库数据...');
    const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`, { headers });
    
    // 筛选和格式化项目数据
    const languageColors = {
      JavaScript: 'bg-yellow-400',
      TypeScript: 'bg-blue-400',
      Python: 'bg-green-500',
      Java: 'bg-red-500',
      Go: 'bg-blue-500',
      Ruby: 'bg-red-600',
      PHP: 'bg-purple-500',
      C: 'bg-gray-500',
      'C++': 'bg-pink-500',
      'C#': 'bg-green-600',
      HTML: 'bg-orange-500',
      CSS: 'bg-blue-300',
      Shell: 'bg-green-400',
      Rust: 'bg-orange-600',
      Swift: 'bg-orange-500',
      Kotlin: 'bg-purple-400',
      Dart: 'bg-blue-300',
      Vue: 'bg-green-400',
      React: 'bg-blue-400',
      Angular: 'bg-red-500'
    };
    
    // 筛选非fork且有描述的仓库
    let filteredRepos = response.data
      .filter(repo => !repo.fork && repo.description)
      .sort((a, b) => {
        // 优先考虑有星标的项目
        if (a.stargazers_count !== b.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        // 其次考虑最近更新的项目
        return new Date(b.updated_at) - new Date(a.updated_at);
      })
      .slice(0, 6);
    
    // 如果筛选后的项目少于3个，则包含一些fork的项目
    if (filteredRepos.length < 3) {
      const additionalRepos = response.data
        .filter(repo => repo.fork && repo.description)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 3 - filteredRepos.length);
      
      filteredRepos = [...filteredRepos, ...additionalRepos];
    }
    
    // 格式化项目数据
    const formattedProjects = filteredRepos.map(repo => ({
      name: repo.name,
      description: repo.description || '暂无描述',
      language: repo.language || 'Unknown',
      languageColor: languageColors[repo.language] || 'bg-gray-400',
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: new Date(repo.updated_at).toISOString().split('T')[0]
    }));
    
    // 保存项目数据
    fs.writeFileSync(
      path.join(dataDir, 'projects.json'),
      JSON.stringify({
        projects: formattedProjects,
        lastUpdated: new Date().toISOString()
      }, null, 2)
    );
    
    console.log(`已保存 ${formattedProjects.length} 个项目数据`);
  } catch (error) {
    console.error('获取仓库数据失败:', error.message);
    // 创建默认项目数据
    const defaultProjects = [];
    
    fs.writeFileSync(
      path.join(dataDir, 'projects.json'),
      JSON.stringify({
        projects: defaultProjects,
        lastUpdated: new Date().toISOString(),
        error: error.message
      }, null, 2)
    );
    
    console.log('已保存默认项目数据');
  }
}

// 获取技能数据
async function fetchSkills() {
  try {
    console.log('获取技能数据...');
    
    // 获取用户的所有仓库
    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
    if (!reposResponse.status === 200) {
      throw new Error('无法获取GitHub仓库数据');
    }
    const reposData = reposResponse.data;
    
    // 分析编程语言使用情况
    const languagesMap = {};
    const techMap = {};
    
    // 获取每个仓库的语言数据
    const languagePromises = reposData.map(repo => 
      axios.get(repo.languages_url, { headers })
        .then(res => res.data)
        .catch(() => ({}))
    );
    
    const languagesData = await Promise.all(languagePromises);
    
    // 统计语言使用情况
    languagesData.forEach(langData => {
      Object.entries(langData).forEach(([lang, bytes]) => {
        if (!languagesMap[lang]) {
          languagesMap[lang] = 0;
        }
        languagesMap[lang] += bytes;
      });
    });
    
    // 分析技术栈（基于仓库描述、主题和依赖）
    const techKeywords = {
      'React': ['react', 'jsx', 'redux', 'hooks'],
      'Vue': ['vue', 'vuex', 'nuxt'],
      'Node.js': ['node', 'nodejs', 'npm', 'express', 'koa'],
      'Angular': ['angular', 'ng'],
      'Express': ['express', 'middleware', 'rest api'],
      'Spring Boot': ['spring', 'java web', 'boot'],
      'Django': ['django', 'python web'],
      'Flask': ['flask', 'python web'],
      'Docker': ['docker', 'container', 'dockerfile'],
      'Kubernetes': ['kubernetes', 'k8s', 'helm'],
      'AWS': ['aws', 'amazon', 'lambda', 's3', 'ec2'],
      'MongoDB': ['mongo', 'mongodb', 'nosql'],
      'MySQL': ['mysql', 'sql', 'mariadb'],
      'PostgreSQL': ['postgres', 'postgresql'],
      'GraphQL': ['graphql', 'apollo'],
      'Git': ['git', 'github', 'gitlab'],
      'CI/CD': ['ci', 'cd', 'pipeline', 'jenkins', 'github actions']
    };
    
    // 初始化技术栈计数
    Object.keys(techKeywords).forEach(tech => {
      techMap[tech] = 0;
    });
    
    // 分析仓库描述和主题
    reposData.forEach(repo => {
      const description = (repo.description || '').toLowerCase();
      const topics = (repo.topics || []).join(' ').toLowerCase();
      const content = `${description} ${topics} ${repo.language || ''}`.toLowerCase();
      
      Object.entries(techKeywords).forEach(([tech, keywords]) => {
        keywords.forEach(keyword => {
          if (content.includes(keyword.toLowerCase())) {
            techMap[tech] += 1;
          }
        });
      });
    });
    
    // 将语言数据转换为百分比和图标
    const languageIcons = {
      'JavaScript': { icon: 'fab fa-js-square', color: 'text-yellow-400' },
      'TypeScript': { icon: 'fab fa-js-square', color: 'text-blue-400' },
      'Python': { icon: 'fab fa-python', color: 'text-green-500' },
      'Java': { icon: 'fab fa-java', color: 'text-red-500' },
      'Go': { icon: 'fas fa-code', color: 'text-blue-500' },
      'Ruby': { icon: 'fab fa-gem', color: 'text-red-600' },
      'PHP': { icon: 'fab fa-php', color: 'text-purple-500' },
      'C': { icon: 'fas fa-code', color: 'text-gray-500' },
      'C++': { icon: 'fas fa-code', color: 'text-pink-500' },
      'C#': { icon: 'fas fa-code', color: 'text-green-600' },
      'HTML': { icon: 'fab fa-html5', color: 'text-orange-500' },
      'CSS': { icon: 'fab fa-css3-alt', color: 'text-blue-300' },
      'Shell': { icon: 'fas fa-terminal', color: 'text-green-400' },
      'Rust': { icon: 'fas fa-cog', color: 'text-orange-600' },
      'Swift': { icon: 'fab fa-swift', color: 'text-orange-500' },
      'Kotlin': { icon: 'fas fa-code', color: 'text-purple-400' },
      'Dart': { icon: 'fas fa-code', color: 'text-blue-300' }
    };
    
    // 计算总字节数
    const totalBytes = Object.values(languagesMap).reduce((sum, bytes) => sum + bytes, 0);
    
    // 转换为所需格式
    const languages = Object.entries(languagesMap)
      .map(([name, bytes]) => {
        const percentage = Math.round((bytes / totalBytes) * 100);
        const { icon = 'fas fa-code', color = 'text-gray-400' } = languageIcons[name] || {};
        return {
          name,
          level: percentage,
          icon,
          color
        };
      })
      .sort((a, b) => b.level - a.level)
      .slice(0, 5); // 只取前5种语言
    
    // 转换技术栈数据
    const techEntries = Object.entries(techMap)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);
    
    const totalTechCount = techEntries.reduce((sum, [_, count]) => sum + count, 0);
    
    const frameworks = techEntries
      .map(([name, count]) => {
        const level = Math.round((count / totalTechCount) * 100);
        let icon = 'fas fa-code';
        let color = 'text-gray-400';
        
        // 为常见框架设置图标
        switch(name) {
          case 'React':
            icon = 'fab fa-react';
            color = 'text-blue-400';
            break;
          case 'Vue':
            icon = 'fab fa-vuejs';
            color = 'text-green-400';
            break;
          case 'Node.js':
            icon = 'fab fa-node-js';
            color = 'text-green-500';
            break;
          case 'Angular':
            icon = 'fab fa-angular';
            color = 'text-red-500';
            break;
          case 'Docker':
            icon = 'fab fa-docker';
            color = 'text-blue-500';
            break;
          case 'AWS':
            icon = 'fab fa-aws';
            color = 'text-orange-400';
            break;
          case 'Git':
            icon = 'fab fa-git-alt';
            color = 'text-orange-500';
            break;
          case 'CI/CD':
            icon = 'fas fa-sync-alt';
            color = 'text-green-400';
            break;
          case 'Express':
            icon = 'fas fa-server';
            color = 'text-gray-400';
            break;
          case 'Spring Boot':
            icon = 'fas fa-leaf';
            color = 'text-green-500';
            break;
          default:
            icon = 'fas fa-code';
            color = 'text-gray-400';
        }
        
        return {
          name,
          level: level, // 确保至少有60%的进度条
          icon,
          color
        };
      })
      .slice(0, 5); // 只取前5种技术
    
    // 分离工具类技术
    const toolTechs = ['Docker', 'Kubernetes', 'AWS', 'Git', 'CI/CD'];
    const tools = frameworks
      .filter(item => toolTechs.includes(item.name))
      .slice(0, 5);
    
    // 确保frameworks不包含工具类技术
    const pureFameworks = frameworks
      .filter(item => !toolTechs.includes(item.name))
      .slice(0, 5);
    
    const skillsData = {
      languages,
      frameworks: pureFameworks,
      tools,
      lastUpdated: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(dataDir, 'skills.json'),
      JSON.stringify(skillsData, null, 2)
    );
    
    console.log('已保存技能数据');
  } catch (error) {
    console.error('获取技能数据失败:', error.message);
    
    // 创建默认技能数据
    const defaultSkills = {
      languages: [],
      frameworks: [],
      tools: [],
      lastUpdated: new Date().toISOString(),
      error: error.message
    };
    
    fs.writeFileSync(
      path.join(dataDir, 'skills.json'),
      JSON.stringify(defaultSkills, null, 2)
    );
    
    console.log('已保存默认技能数据');
  }
}

// 获取工具数据
async function fetchTools() {
  try {
    console.log('获取工具数据...');
    
    // 示例工具数据
    const toolsData = {
      categories: [
        {
          title: '开发工具',
          titleColor: 'text-github-blue',
          tools: [
            { icon: 'fas fa-code', iconColor: 'text-github-blue', name: 'JetBrains' },
            { icon: 'fas fa-code', iconColor: 'text-blue-400', name: 'VS Code' },
            { icon: 'fab fa-docker', iconColor: 'text-blue-500', name: 'Docker' }
          ]
        },
        {
          title: '测试工具',
          titleColor: 'text-github-blue',
          tools: [
            { icon: 'fas fa-vial', iconColor: 'text-github-green', name: 'Jest' },
            { icon: 'fas fa-bug', iconColor: 'text-red-400', name: 'Postman' },
          ]
        },
        {
          title: '部署工具',
          titleColor: 'text-github-blue',
          tools: [
            { icon: 'fab fa-aws', iconColor: 'text-orange-400', name: 'AWS' },
            { icon: 'fab fa-github', iconColor: 'text-github-blue', name: 'GitHub Pages' },
            { icon: 'fas fa-rocket', iconColor: 'text-purple-400', name: 'Vercel' }
          ]
        }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(dataDir, 'tools.json'),
      JSON.stringify(toolsData, null, 2)
    );
    
    console.log('已保存工具数据');
  } catch (error) {
    console.error('获取工具数据失败:', error.message);
    
    // 创建默认工具数据
    const defaultTools = {
      categories: [],
      lastUpdated: new Date().toISOString(),
      error: error.message
    };
    
    fs.writeFileSync(
      path.join(dataDir, 'tools.json'),
      JSON.stringify(defaultTools, null, 2)
    );
    
    console.log('已保存默认工具数据');
  }
}

// 获取GitHub统计数据
async function fetchGitHubStats() {
  try {
    console.log('获取GitHub统计数据...');
    
    // 获取用户基本信息
    const userResponse = await axios.get(`https://api.github.com/users/${username}`, { headers });
    if (!userResponse.status === 200) {
      throw new Error('无法获取GitHub用户数据');
    }
    const userData = userResponse.data;
    
    // 获取用户的所有仓库
    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
    if (!reposResponse.status === 200) {
      throw new Error('无法获取GitHub仓库数据');
    }
    const reposData = reposResponse.data;
    
    // 计算总星标数
    const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    
    // 计算总Fork数
    const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);
    
    // 格式化统计数据
    const statsData = {
      stats: [
        { 
          icon: 'fas fa-code', 
          value: userData.public_repos || 0, 
          label: '公开仓库', 
          color: 'text-github-blue', 
          key: 'public_repos' 
        },
        { 
          icon: 'fas fa-star', 
          value: totalStars || 0, 
          label: '获得星标', 
          color: 'text-yellow-400', 
          key: 'stargazers' 
        },
        { 
          icon: 'fas fa-code-branch', 
          value: totalForks || 0, 
          label: 'Fork 数量', 
          color: 'text-purple-400', 
          key: 'forks' 
        },
        { 
          icon: 'fas fa-users', 
          value: userData.followers || 0, 
          label: '关注者', 
          color: 'text-github-blue', 
          key: 'followers' 
        }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(dataDir, 'github-stats.json'),
      JSON.stringify(statsData, null, 2)
    );
    
    console.log('已保存GitHub统计数据');
  } catch (error) {
    console.error('获取GitHub统计数据失败:', error.message);
    
    // 创建默认统计数据
    const defaultStats = {
      stats: [],
      lastUpdated: new Date().toISOString(),
      error: error.message
    };
    
    fs.writeFileSync(
      path.join(dataDir, 'github-stats.json'),
      JSON.stringify(defaultStats, null, 2)
    );
    
    console.log('已保存默认GitHub统计数据');
  }
}

// 执行所有数据获取任务
async function main() {
  try {
    // 确保数据目录存在
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // 并行执行所有数据获取任务
    await Promise.all([
      fetchRepositories(),
      fetchSkills(),
      fetchTools(),
      fetchGitHubStats()
    ]);
    
    console.log('所有数据获取完成');
  } catch (error) {
    console.error('数据获取过程中出错:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
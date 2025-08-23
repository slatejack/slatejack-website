// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initScrollAnimations();
    initSkillBars();
    initStatsAnimation();
    initSmoothScroll();
    initNavigation();
    initCardInteractions();
    initTypingEffect();
    initScrollToTop();
    initLazyLoading();
});

// 主题切换功能
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // 从localStorage获取保存的主题，默认为深色模式
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // 点击切换主题
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // 显示切换提示
        showToast(`已切换到${newTheme === 'dark' ? '深色' : '浅色'}模式`);
    });
    
    function setTheme(theme) {
        const html = document.documentElement;
        
        if (theme === 'dark') {
            html.classList.add('dark');
            html.classList.remove('light');
            body.classList.add('dark');
            body.classList.remove('light');
            themeToggle.classList.remove('light');
        } else {
            html.classList.remove('dark');
            html.classList.add('light');
            body.classList.remove('dark');
            body.classList.add('light');
            themeToggle.classList.add('light');
        }
        
        // 触发自定义事件，通知其他组件主题已更改
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
}

// 滚动动画初始化
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // 触发技能条动画
                if (entry.target.querySelector('.skill-progress')) {
                    animateSkillBars(entry.target);
                }
                
                // 触发统计数字动画
                if (entry.target.querySelector('.stats-card')) {
                    animateStats(entry.target);
                }
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// 技能条动画
function initSkillBars() {
    // 初始化时设置宽度为0
    document.querySelectorAll('.skill-progress').forEach(bar => {
        bar.style.width = '0%';
    });
}

function animateSkillBars(container) {
    const skillBars = container.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        const targetWidth = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = targetWidth + '%';
        }, index * 200);
    });
}

// 统计数字动画
function initStatsAnimation() {
    // 为统计卡片添加初始状态
    document.querySelectorAll('.stats-card .text-2xl').forEach(el => {
        el.setAttribute('data-target', el.textContent);
        el.textContent = '0';
    });
}

function animateStats(container) {
    const statNumbers = container.querySelectorAll('.stats-card .text-2xl');
    statNumbers.forEach((el, index) => {
        const target = parseInt(el.getAttribute('data-target'));
        setTimeout(() => {
            animateNumber(el, 0, target, 1000);
        }, index * 200);
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * easeOutQuart(progress));
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // 考虑导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 导航栏交互
function initNavigation() {
    const nav = document.querySelector('nav');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // 导航栏背景透明度
        if (currentScrollY > 50) {
            nav.classList.add('backdrop-blur-md');
        } else {
            nav.classList.remove('backdrop-blur-md');
        }

        lastScrollY = currentScrollY;
    });

    // 高亮当前页面部分
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-github-blue');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-github-blue');
            }
        });
    });
}

// 卡片交互效果
function initCardInteractions() {
    const cards = document.querySelectorAll('.card-hover');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// 打字机效果
function initTypingEffect() {
    const heroTitle = document.querySelector('h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // 延迟开始打字效果
        setTimeout(typeWriter, 500);
    }
}

// 返回顶部按钮
function initScrollToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.add('opacity-0', 'invisible');
            backToTopButton.classList.remove('opacity-100', 'visible');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 懒加载
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('opacity-0');
                img.classList.add('opacity-100');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Toast 通知
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    
    // 显示toast
    toast.classList.remove('translate-x-full', 'opacity-0', 'invisible');
    toast.classList.add('translate-x-0', 'opacity-100', 'visible');
    
    setTimeout(() => {
        // 隐藏toast
        toast.classList.add('translate-x-full', 'opacity-0', 'invisible');
        toast.classList.remove('translate-x-0', 'opacity-100', 'visible');
    }, duration);
}

// 复制到剪贴板
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('已复制到剪贴板');
    }).catch(() => {
        showToast('复制失败');
    });
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 快速搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // 这里可以添加搜索功能
        showToast('搜索功能开发中...');
    }
    
    // T 键切换主题
    if (e.key === 't' || e.key === 'T') {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle && !e.ctrlKey && !e.metaKey && !e.altKey) {
            themeToggle.click();
        }
    }
});

// 工具函数
const utils = {
    // 防抖函数
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 节流函数
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // 格式化日期
    formatDate: function(date) {
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },
    
    // 随机颜色生成
    randomColor: function() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
};

// 性能监控
function initPerformanceMonitoring() {
    // 页面加载时间
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`页面加载时间: ${loadTime.toFixed(2)}ms`);
    });
    
    // 监听主题切换性能
    document.addEventListener('themeChanged', (e) => {
        console.log(`主题切换到: ${e.detail.theme}`);
    });
}

// 初始化性能监控
initPerformanceMonitoring();

// 导出工具函数（如果需要的话）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { utils, copyToClipboard, showToast };
}
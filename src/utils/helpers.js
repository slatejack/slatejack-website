// 防抖函数
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 节流函数
export const throttle = (func, limit) => {
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
};

// 格式化日期
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// 随机颜色生成
export const randomColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
};

// 动画数字
export const animateNumber = (start, end, duration, callback) => {
  const startTime = performance.now();
  
  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const current = Math.floor(start + (end - start) * easeOutQuart(progress));
    callback(current);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };
  
  requestAnimationFrame(update);
};

// 缓动函数
export const easeOutQuart = (t) => {
  return 1 - (--t) * t * t * t;
};

// Toast 通知
export const showToast = (message, duration = 3000, toastRef) => {
  if (!toastRef.current) return;
  
  const toast = toastRef.current;
  const toastMessage = toast.querySelector('#toastMessage');
  
  if (toastMessage) {
    toastMessage.textContent = message;
  }
  
  // 显示toast
  toast.classList.remove('translate-x-full', 'opacity-0', 'invisible');
  toast.classList.add('translate-x-0', 'opacity-100', 'visible');
  
  setTimeout(() => {
    // 隐藏toast
    toast.classList.add('translate-x-full', 'opacity-0', 'invisible');
    toast.classList.remove('translate-x-0', 'opacity-100', 'visible');
  }, duration);
};

// 复制到剪贴板
export const copyToClipboard = (text, toastRef) => {
  navigator.clipboard.writeText(text).then(() => {
    showToast('已复制到剪贴板', 3000, toastRef);
  }).catch(() => {
    showToast('复制失败', 3000, toastRef);
  });
};

// 平滑滚动到指定元素
export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    const offsetTop = element.offsetTop - 80; // 考虑导航栏高度
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
};
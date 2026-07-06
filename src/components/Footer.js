import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-github-gray dark:bg-github-gray bg-light-gray border-t border-github-border dark:border-github-border border-light-border py-8">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-github-text/60 dark:text-github-text/60 text-light-secondary">
          © {new Date().getFullYear()} SlateJack. 用 ❤️ 和 ☕ 制作
        </p>
        <a className="text-github-text/60 dark:text-github-text/60 text-light-secondary" href="https://beian.miit.gov.cn/">蜀ICP备19028675号</a>
      </div>
    </footer>
  );
};

export default Footer;

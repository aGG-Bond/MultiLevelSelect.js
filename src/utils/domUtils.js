/**
 * DOM 操作工具函数
 */

/**
 * 动态给类名添加CSS样式
 * @param {string} className - CSS类名选择器
 * @param {string} styles - CSS样式字符串
 */
export function addClassStyle(className, styles) {
  const style = document.createElement('style');
  style.type = 'text/css';

  const css = `
    ${className} {
      ${styles}
    }
  `;

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  document.head.appendChild(style);
}

/**
 * 更新元素位置动画
 * @param {Object} options - 配置选项
 * @param {string} options.scrollDom - 滚动容器选择器，默认 'html,body'
 * @param {number} options.top - 目标位置
 * @param {number} options.time - 动画时间，默认 500ms
 * @param {Function} options.callback - 回调函数
 */
export function updatePosition({ scrollDom = 'html,body', top, time = 500, callback = () => {} }) {
  $(scrollDom).animate({
    scrollTop: top
  }, time, callback);
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} delay - 延迟时间(ms)
 * @returns {Function} 节流后的函数
 */
export function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

/**
 * 监听滚动事件
 * @param {Object} options - 配置选项
 * @param {HTMLElement|Window} options.scrollDom - 滚动容器，默认 window
 * @param {number} options.time - 节流时间，默认 100ms
 * @param {Function} options.callback - 回调函数
 */
export function monitorScroll({ scrollDom = window, time = 100, callback = () => {} }) {
  $(scrollDom).on('scroll', { passive: true }, throttle(callback, time));
}

/**
 * 监听窗口大小变化
 * @param {Object} options - 配置选项
 * @param {HTMLElement|Window} options.scrollDom - 监听容器，默认 window
 * @param {number} options.time - 节流时间，默认 100ms
 * @param {Function} options.callback - 回调函数
 */
export function monitorResize({ scrollDom = window, time = 100, callback = () => {} }) {
  $(scrollDom).on('resize', throttle(callback, time));
}
/**
 * UI组件基类
 * 提供通用的组件渲染和生命周期管理
 */
export class BaseComponent {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.className = options.className || '';
    this.data = options.data || {};
    this.config = options.config || {};
    this.element = null;
  }

  /**
   * 初始化组件
   */
  init() {
    this.createElement();
    this.bindEvents();
    this.render();
  }

  /**
   * 创建DOM元素
   */
  createElement() {
    // 子类需要实现
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    // 子类需要实现
  }

  /**
   * 渲染组件
   */
  render() {
    if (this.element && this.container) {
      $(this.container).append(this.element);
    }
  }

  /**
   * 销毁组件
   */
  destroy() {
    if (this.element) {
      $(this.element).remove();
      this.element = null;
    }
  }

  /**
   * 更新数据并重新渲染
   * @param {Object} newData - 新数据
   */
  update(newData) {
    this.data = { ...this.data, ...newData };
    this.destroy();
    this.init();
  }
}
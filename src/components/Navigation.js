import { BaseComponent } from './BaseComponent.js';
import { addClassStyle, updatePosition, monitorScroll, monitorResize } from '../utils/domUtils.js';

/**
 * 导航组件
 * 提供固定导航和滚动监听功能
 */
export class Navigation extends BaseComponent {
  constructor(options) {
    super(options);
    this.items = options.items || [];
    this.currentIndex = 0;
    this.isClickScroll = false;
    this.onItemClick = options.onItemClick || (() => {});
    this.isMonitorScroll = options.isMonitorScroll !== false;
    this.styles = options.styles || this.getDefaultStyles();
  }

  getDefaultStyles() {
    return {
      container: `
        position: fixed;
        top: 0;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
        height: 12.533vw;
        line-height: 12.533vw;
        background: #FFFFFF;
        box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.08);
        opacity: 0;
        transition: all 1s;
      `,
      item: `
        flex: 1;
        font-family: Source Han Sans SC, Source Han Sans SC;
        font-weight: 400;
        font-size: 3.733vw;
        color: #999999;
        text-align: center;
      `,
      activeItem: `
        font-family: Source Han Sans SC, Source Han Sans SC;
        font-weight: bold;
        font-size: 4.267vw;
        color: var(--styleColor);
        text-align: center;
        transition: all 1s;
      `,
      line: `
        position: absolute;
        bottom: 2vw;
        left: ${this.calculateLinePosition()}vw;
        width: ${this.calculateLineWidth()}vw;
        height: 0.8vw;
        background-color: var(--styleColor);
        transition: 1s left;
      `
    };
  }

  calculateLinePosition() {
    const n = this.items.length;
    return n > 0 ? (100 / n / 2 / 2 + 100 / n * this.currentIndex) : 0;
  }

  calculateLineWidth() {
    const n = this.items.length;
    return n > 0 ? (100 / n / 2) : 0;
  }

  createElement() {
    let html = '<ul id="navBox">';
    
    this.items.forEach((item, index) => {
      const { title, className = '', target = '' } = item;
      html += `<li class="navItem ${index === 0 ? 'act' : ''} ${className}" 
                data-index="${index}" 
                data-target="${target}">${title}</li>`;
    });
    
    html += '<span id="navLine"></span></ul>';
    this.element = $(html);
  }

  bindEvents() {
    // 添加样式
    this.addStyles();
    
    // 绑定点击事件
    $(this.element).on('click', '.navItem', (e) => {
      this.handleItemClick(e);
    });

    // 启动滚动监听
    if (this.isMonitorScroll) {
      setTimeout(() => {
        this.startScrollMonitoring();
      }, 500);
    }
  }

  addStyles() {
    addClassStyle('#navBox', this.styles.container);
    addClassStyle('#navBox .navItem', this.styles.item);
    addClassStyle('#navBox .navItem.act', this.styles.activeItem);
    addClassStyle('#navBox #navLine', this.styles.line);
  }

  handleItemClick(e) {
    const target = $(e.currentTarget);
    const index = parseInt(target.attr('data-index'));
    const targetSelector = target.attr('data-target');

    if (this.currentIndex === index) return;

    this.currentIndex = index;
    this.updateActiveItem(index);
    this.updateLinePosition();

    this.isClickScroll = true;
    
    if (targetSelector) {
      const targetElement = $(targetSelector);
      if (targetElement.length) {
        updatePosition({
          top: targetElement.offset().top - 47,
          callback: () => {
            this.isClickScroll = false;
          }
        });
      }
    }

    this.onItemClick(index, targetSelector);
  }

  updateActiveItem(index) {
    $(this.element).find('.navItem')
      .removeClass('act')
      .eq(index)
      .addClass('act');
  }

  updateLinePosition() {
    const left = this.calculateLinePosition();
    const width = this.calculateLineWidth();
    
    $('#navLine').css({
      left: `${left}vw`,
      width: `${width}vw`,
    });
  }

  startScrollMonitoring() {
    const sections = this.items.map(item => {
      const targetElement = $(item.target);
      return {
        id: item.target,
        element: targetElement,
        top: targetElement.offset()?.top - 100,
        height: targetElement.outerHeight()
      };
    });

    let currentActiveIndex = -1;

    monitorScroll({
      callback: () => {
        if (this.isClickScroll) return;
        
        const scrollTop = $(window).scrollTop();
        
        sections.forEach((section, index) => {
          const { top, height } = section;
          
          // 未达到第一个导航前，导航栏隐藏
          if (index === 0 && scrollTop < top) {
            currentActiveIndex = -1;
            if ($(this.element).css('opacity') === '1') {
              $(this.element).css('opacity', '0');
              setTimeout(() => {
                $(this.element).css('display', 'none');
              }, 1000);
            }
          }
          
          if (scrollTop >= top && scrollTop < top + height) {
            if ($(this.element).css('opacity') === '0') {
              $(this.element).css({ 'display': 'flex', 'opacity': '1' });
            }
            
            if (currentActiveIndex !== index) {
              currentActiveIndex = index;
              this.updateActiveItem(index);
              this.updateLinePosition();
            }
          }
        });
      }
    });

    // 监听窗口大小变化
    monitorResize({
      callback: () => {
        sections.forEach(section => {
          section.top = section.element.offset()?.top - 100;
          section.height = section.element.outerHeight();
        });
      }
    });
  }

  /**
   * 更新导航项
   * @param {Array} newItems - 新的导航项数组
   */
  updateItems(newItems) {
    this.items = newItems;
    this.currentIndex = 0;
    this.destroy();
    this.init();
  }

  /**
   * 设置当前激活项
   * @param {number} index - 要激活的索引
   */
  setActiveItem(index) {
    if (index >= 0 && index < this.items.length) {
      this.currentIndex = index;
      this.updateActiveItem(index);
      this.updateLinePosition();
    }
  }
}
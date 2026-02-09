import { BaseComponent } from './BaseComponent.js';

/**
 * 模态框组件
 * 提供可配置的弹窗功能
 */
export class Modal extends BaseComponent {
  constructor(options) {
    super(options);
    this.title = options.title || '提示';
    this.content = options.content || '';
    this.buttons = options.buttons || [
      { text: '确定', className: 'btn-primary', action: 'confirm' },
      { text: '取消', className: 'btn-secondary', action: 'cancel' }
    ];
    this.onConfirm = options.onConfirm || (() => {});
    this.onCancel = options.onCancel || (() => {});
    this.onClose = options.onClose || (() => {});
    this.overlayClose = options.overlayClose !== false; // 默认允许点击遮罩关闭
  }

  createElement() {
    const buttonsHtml = this.buttons.map(button => 
      `<button class="modal-btn ${button.className}" data-action="${button.action}">
        ${button.text}
      </button>`
    ).join('');

    const html = `
      <div class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h3 class="modal-title">${this.title}</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            ${this.content}
          </div>
          <div class="modal-footer">
            ${buttonsHtml}
          </div>
        </div>
      </div>
    `;

    this.element = $(html);
  }

  bindEvents() {
    // 绑定关闭按钮事件
    $(this.element).find('.modal-close').on('click', () => {
      this.close();
    });

    // 绑定按钮事件
    $(this.element).find('.modal-btn').on('click', (e) => {
      const action = $(e.currentTarget).attr('data-action');
      this.handleAction(action);
    });

    // 绑定遮罩点击事件
    if (this.overlayClose) {
      $(this.element).find('.modal-overlay').on('click', (e) => {
        if (e.target === e.currentTarget) {
          this.close();
        }
      });
    }

    // 绑定键盘事件
    $(document).on('keydown.modal', (e) => {
      if (e.keyCode === 27) { // ESC键
        this.close();
      }
    });
  }

  handleAction(action) {
    switch (action) {
      case 'confirm':
        this.onConfirm();
        this.close();
        break;
      case 'cancel':
        this.onCancel();
        this.close();
        break;
      default:
        // 自定义动作
        if (this[action]) {
          this[action]();
        }
        break;
    }
  }

  open() {
    if (!this.element) {
      this.init();
    }
    $('body').append(this.element);
    $('body').addClass('modal-open');
    // 触发打开动画
    setTimeout(() => {
      $(this.element).addClass('modal-show');
    }, 10);
  }

  close() {
    $(this.element).removeClass('modal-show');
    setTimeout(() => {
      $(this.element).remove();
      $('body').removeClass('modal-open');
      this.onClose();
      // 移除键盘事件监听
      $(document).off('keydown.modal');
    }, 300);
  }

  /**
   * 显示确认对话框
   * @param {Object} options - 配置选项
   */
  static confirm(options) {
    const {
      title = '确认',
      content = '确定要执行此操作吗？',
      onConfirm = () => {},
      onCancel = () => {}
    } = options;

    const modal = new Modal({
      title,
      content,
      buttons: [
        { text: '确定', className: 'btn-primary', action: 'confirm' },
        { text: '取消', className: 'btn-secondary', action: 'cancel' }
      ],
      onConfirm,
      onCancel
    });

    modal.open();
    return modal;
  }

  /**
   * 显示警告对话框
   * @param {Object} options - 配置选项
   */
  static alert(options) {
    const {
      title = '提示',
      content = '',
      onConfirm = () => {}
    } = options;

    const modal = new Modal({
      title,
      content,
      buttons: [
        { text: '确定', className: 'btn-primary', action: 'confirm' }
      ],
      onConfirm
    });

    modal.open();
    return modal;
  }

  /**
   * 显示自定义模态框
   * @param {Object} options - 配置选项
   */
  static custom(options) {
    const modal = new Modal(options);
    modal.open();
    return modal;
  }
}
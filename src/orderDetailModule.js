/**
 * 订单详情模块 - 重构版本
 * 基于组件化和模块化的架构设计
 */

import { 
  InfoDisplay, 
  Navigation, 
  Modal 
} from './components/index.js';

import { 
  fileToBase64, 
  createFileUploadInput,
  loadFromCache,
  saveToCache,
  clearCache
} from './utils/index.js';

import { COMPONENT_TYPES, CACHE_KEYS } from './constants/index.js';
import { themeColors } from './config/styles.js';

/**
 * 订单详情管理器
 * 统一管理订单详情页面的所有功能
 */
export class OrderDetailManager {
  constructor(container) {
    this.container = container;
    this.components = new Map();
    this.cacheKey = CACHE_KEYS.FORM_DATA;
  }

  /**
   * 初始化订单详情页面
   * @param {Object} data - 页面数据
   * @param {Object} config - 配置选项
   */
  init(data, config = {}) {
    this.data = data;
    this.config = config;
    
    // 初始化各个组件
    this.initComponents();
    
    // 绑定全局事件
    this.bindGlobalEvents();
    
    // 加载缓存数据
    this.loadCachedData();
  }

  /**
   * 初始化组件
   */
  initComponents() {
    // 初始化产品信息组件
    if (this.config.productInfo) {
      this.initProductInfo();
    }

    // 初始化投保人信息组件
    if (this.config.applicantInfo) {
      this.initApplicantInfo();
    }

    // 初始化计划详情组件
    if (this.config.planInfo) {
      this.initPlanInfo();
    }

    // 初始化导航组件
    if (this.config.navigation) {
      this.initNavigation();
    }
  }

  /**
   * 初始化产品信息组件
   */
  initProductInfo() {
    const productComponent = new InfoDisplay({
      container: this.container,
      data: this.data.product,
      config: this.config.productInfo,
      type: COMPONENT_TYPES.PRODUCT_INFO
    });

    productComponent.init();
    this.components.set('productInfo', productComponent);
  }

  /**
   * 初始化投保人信息组件
   */
  initApplicantInfo() {
    const applicantComponent = new InfoDisplay({
      container: this.container,
      data: this.data.applicant,
      config: this.config.applicantInfo,
      type: COMPONENT_TYPES.APPLICANT_INFO
    });

    applicantComponent.init();
    this.components.set('applicantInfo', applicantComponent);
  }

  /**
   * 初始化计划详情组件
   */
  initPlanInfo() {
    const planComponent = new InfoDisplay({
      container: this.container,
      data: this.data.plans,
      config: this.config.planInfo,
      type: COMPONENT_TYPES.PLAN_INFO
    });

    planComponent.init();
    this.components.set('planInfo', planComponent);
  }

  /**
   * 初始化导航组件
   */
  initNavigation() {
    const navComponent = new Navigation({
      container: 'body',
      items: this.config.navigation.items,
      onItemClick: this.handleNavItemClick.bind(this),
      isMonitorScroll: this.config.navigation.monitorScroll,
      styles: this.config.navigation.styles
    });

    navComponent.init();
    this.components.set('navigation', navComponent);
  }

  /**
   * 处理导航项点击
   */
  handleNavItemClick(index, target) {
    console.log('导航项被点击:', index, target);
    // 可以在这里添加具体的业务逻辑
  }

  /**
   * 绑定全局事件
   */
  bindGlobalEvents() {
    // 绑定文件上传事件
    this.bindFileUploadEvents();

    // 绑定离开页面确认事件
    this.bindBeforeUnloadEvent();

    // 绑定按钮点击事件
    this.bindButtonEvents();
  }

  /**
   * 绑定文件上传事件
   */
  bindFileUploadEvents() {
    $(document).on('change', 'input[type="file"]', async (e) => {
      const fileInput = e.target;
      const files = fileInput.files;
      
      if (files.length > 0) {
        try {
          // 转换为base64
          const base64Data = await fileToBase64(files[0]);
          console.log('文件转换完成:', base64Data);
          
          // 显示预览
          const previewImg = $(fileInput).siblings('.previewImg');
          previewImg.attr('src', base64Data).show();
          $(fileInput).siblings('svg').hide();
        } catch (error) {
          console.error('文件处理失败:', error);
          this.showErrorMessage('文件处理失败，请重试');
        }
      }
    });
  }

  /**
   * 绑定离开页面事件
   */
  bindBeforeUnloadEvent() {
    let isDirty = false; // 标记表单是否有修改

    // 监听表单变化
    $(this.container).on('input change', 'input, select, textarea', () => {
      isDirty = true;
    });

    // 离开页面确认
    window.addEventListener('beforeunload', (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = '';
        this.showLeaveConfirm();
      }
    });
  }

  /**
   * 显示离开确认对话框
   */
  showLeaveConfirm() {
    Modal.confirm({
      title: '确认离开',
      content: '确定要离开吗？未保存的内容将会丢失！',
      onConfirm: () => {
        // 用户确认离开
        clearCache(this.cacheKey);
        window.close();
      },
      onCancel: () => {
        // 用户取消离开，保持页面状态
      }
    });
  }

  /**
   * 绑定按钮事件
   */
  bindButtonEvents() {
    // 这里可以绑定各种按钮事件
    $(document).on('click', '[data-action]', (e) => {
      const action = $(e.currentTarget).attr('data-action');
      this.handleAction(action, e);
    });
  }

  /**
   * 处理动作
   */
  handleAction(action, event) {
    switch (action) {
      case 'save':
        this.saveData();
        break;
      case 'reset':
        this.resetForm();
        break;
      case 'submit':
        this.submitForm();
        break;
      default:
        console.log('未知动作:', action);
    }
  }

  /**
   * 保存数据
   */
  saveData() {
    const formData = this.getFormData();
    if (saveToCache(this.cacheKey, formData)) {
      this.showSuccessMessage('数据保存成功');
    } else {
      this.showErrorMessage('数据保存失败');
    }
  }

  /**
   * 重置表单
   */
  resetForm() {
    Modal.confirm({
      title: '确认重置',
      content: '确定要重置所有表单数据吗？',
      onConfirm: () => {
        $(this.container).find('input, select, textarea').val('');
        clearCache(this.cacheKey);
        this.showSuccessMessage('表单已重置');
      }
    });
  }

  /**
   * 提交表单
   */
  submitForm() {
    const formData = this.getFormData();
    // 这里添加表单验证和提交逻辑
    console.log('提交表单数据:', formData);
    this.showSuccessMessage('表单提交成功');
  }

  /**
   * 获取表单数据
   */
  getFormData() {
    const formData = {};
    $(this.container).find('input[name], select[name], textarea[name]').each(function() {
      const name = $(this).attr('name');
      const value = $(this).val();
      formData[name] = value;
    });
    return formData;
  }

  /**
   * 加载缓存数据
   */
  loadCachedData() {
    const cachedData = loadFromCache(this.cacheKey);
    if (cachedData) {
      this.fillFormData(cachedData);
    }
  }

  /**
   * 填充表单数据
   */
  fillFormData(data) {
    Object.keys(data).forEach(key => {
      $(this.container).find(`[name="${key}"]`).val(data[key]);
    });
  }

  /**
   * 显示成功消息
   */
  showSuccessMessage(message) {
    // 这里可以集成消息提示组件
    console.log('成功:', message);
  }

  /**
   * 显示错误消息
   */
  showErrorMessage(message) {
    // 这里可以集成错误提示组件
    console.error('错误:', message);
  }

  /**
   * 更新组件数据
   */
  updateComponent(componentName, newData) {
    const component = this.components.get(componentName);
    if (component) {
      component.update(newData);
    }
  }

  /**
   * 销毁所有组件
   */
  destroy() {
    this.components.forEach(component => {
      component.destroy();
    });
    this.components.clear();
  }
}

/**
 * 工具函数 - 保持向后兼容
 */

// 创建文件上传HTML（向后兼容）
export function drawInputUpload(arr, key, className) {
  return createFileUploadInput({
    label: arr?.label,
    key: key,
    className: className,
    options: {
      placeholder: arr?.placeholder,
      readonly: arr?.readonly,
      uploadNum: arr?.uploadNum,
      accept: arr?.accept,
      isArrow: arr?.isArrow,
      labelClass: arr?.labelClass,
      containerClass: arr?.class
    }
  });
}

// 显示自定义模态框（向后兼容）
export function showCustomModal() {
  Modal.confirm({
    title: '确认离开',
    content: '确定要离开吗？内容将不会保存！',
    onConfirm: () => {
      window.close();
    }
  });
}

// 导出工具函数（向后兼容）
export {
  fileToBase64,
  loadFromCache as loadCachedData,
  saveToCache,
  clearCache
};

// 导出组件类（向后兼容）
export { InfoDisplay, Navigation, Modal };

// 默认导出管理器
export default OrderDetailManager;
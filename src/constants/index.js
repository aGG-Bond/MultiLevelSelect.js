/**
 * 常量定义
 */

// 组件类型常量
export const COMPONENT_TYPES = {
  PRODUCT_INFO: 'product',
  APPLICANT_INFO: 'applicant',
  PLAN_INFO: 'plan',
  DEFAULT: 'default'
};

// 事件常量
export const EVENTS = {
  NAV_ITEM_CLICK: 'navItemClick',
  MODAL_CONFIRM: 'modalConfirm',
  MODAL_CANCEL: 'modalCancel',
  MODAL_CLOSE: 'modalClose',
  DATA_UPDATE: 'dataUpdate'
};

// 缓存键名常量
export const CACHE_KEYS = {
  FORM_DATA: 'formData',
  USER_PREFERENCES: 'userPreferences',
  PAGE_STATE: 'pageState'
};

// 文件类型常量
export const FILE_TYPES = {
  IMAGE: 'image/*',
  PDF: 'application/pdf',
  EXCEL: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  WORD: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

// 状态常量
export const STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// 按钮类型常量
export const BUTTON_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  LINK: 'link'
};

// 导出所有常量
export default {
  COMPONENT_TYPES,
  EVENTS,
  CACHE_KEYS,
  FILE_TYPES,
  STATUS,
  BUTTON_TYPES
};
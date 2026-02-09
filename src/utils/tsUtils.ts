/**
 * TypeScript工具函数
 */

import type { SelectOption, Utils } from '../types/index.js';

/**
 * 深度查找选项
 */
export const findOption: Utils['findOption'] = (data, id) => {
  for (const item of data) {
    if (item.id === id) {
      return item;
    }
    if (item.children) {
      const found = findOption(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * 扁平化选项树
 */
export const flattenOptions: Utils['flattenOptions'] = (data) => {
  const result: SelectOption[] = [];
  
  const flatten = (items: SelectOption[]): void => {
    items.forEach(item => {
      result.push(item);
      if (item.children) {
        flatten(item.children);
      }
    });
  };
  
  flatten(data);
  return result;
};

/**
 * 过滤选项
 */
export const filterOptions: Utils['filterOptions'] = (data, predicate) => {
  const result: SelectOption[] = [];
  
  const filter = (items: SelectOption[]): void => {
    items.forEach(item => {
      if (predicate(item)) {
        const filteredItem = { ...item };
        if (filteredItem.children) {
          filteredItem.children = filter(filteredItem.children);
        }
        result.push(filteredItem);
      }
    });
  };
  
  filter(data);
  return result;
};

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function(...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 类型守卫：检查是否为SelectOption数组
 */
export function isSelectOptionArray(data: any): data is SelectOption[] {
  return Array.isArray(data) && 
         data.every(item => 
           typeof item === 'object' && 
           item !== null && 
           ('id' in item) && 
           ('name' in item)
         );
}

/**
 * 类型守卫：检查是否为有效的配置对象
 */
export function isValidConfig(config: any): config is Record<string, any> {
  return typeof config === 'object' && config !== null;
}

/**
 * 深度克隆对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        (clonedObj as any)[key] = deepClone((obj as any)[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
}

// 导出工具函数集合
export const tsUtils: Utils = {
  findOption,
  flattenOptions,
  filterOptions
};

export default tsUtils;
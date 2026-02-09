/**
 * 缓存管理工具函数
 */

/**
 * 从缓存加载数据
 * @param {string} key - 缓存键名
 * @returns {any|false} 解析后的数据或false
 */
export function loadFromCache(key) {
  const cachedData = sessionStorage.getItem(key);
  if (cachedData) {
    try {
      console.log(`从缓存加载数据: ${key}`);
      return JSON.parse(cachedData);
    } catch (e) {
      console.error(`解析缓存数据失败: ${key}`, e);
      return false;
    }
  }
  return null;
}

/**
 * 保存数据到缓存
 * @param {string} key - 缓存键名
 * @param {any} data - 要保存的数据
 * @returns {boolean} 保存是否成功
 */
export function saveToCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
    console.log(`数据已保存到缓存: ${key}`);
    return true;
  } catch (e) {
    console.error(`保存数据到缓存失败: ${key}`, e);
    return false;
  }
}

/**
 * 清除缓存数据
 * @param {string} key - 要清除的缓存键名
 * @returns {boolean} 清除是否成功
 */
export function clearCache(key) {
  try {
    sessionStorage.removeItem(key);
    console.log(`缓存数据已清除: ${key}`);
    return true;
  } catch (e) {
    console.error(`清除缓存失败: ${key}`, e);
    return false;
  }
}

/**
 * 清除所有缓存数据
 * @returns {boolean} 清除是否成功
 */
export function clearAllCache() {
  try {
    sessionStorage.clear();
    console.log('所有缓存数据已清除');
    return true;
  } catch (e) {
    console.error('清除所有缓存失败', e);
    return false;
  }
}
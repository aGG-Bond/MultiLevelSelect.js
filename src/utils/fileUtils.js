/**
 * 文件处理工具函数
 */

/**
 * 将文件转换为base64编码
 * @param {File} file - 需要转换的文件对象
 * @returns {Promise<string>} 返回包含base64编码的Promise
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    // 检查浏览器是否支持FileReader
    if (typeof FileReader === 'undefined') {
      reject(new Error('您的浏览器不支持文件读取功能'));
      return;
    }
    
    const reader = new FileReader();
    
    // 读取成功回调
    reader.onload = function() {
      try {
        // 获取base64数据
        const base64Data = reader.result;
        resolve(base64Data);
      } catch (error) {
        reject(new Error('转换base64时发生错误: ' + error.message));
      }
    };
    
    // 读取失败回调
    reader.onerror = function() {
      reject(new Error('文件读取失败'));
    };
    
    // 读取文件内容为data URL格式
    reader.readAsDataURL(file);
  });
}

/**
 * 创建文件上传输入框HTML
 * @param {Object} config - 配置对象
 * @param {string} config.label - 标签文本
 * @param {string} config.key - 输入框name和id
 * @param {string} config.className - 容器类名
 * @param {Object} config.options - 其他选项
 * @returns {string} HTML字符串
 */
export function createFileUploadInput(config) {
  const { label, key, className, options = {} } = config;
  const {
    placeholder = '',
    readonly = false,
    uploadNum = 1,
    accept = '*',
    isArrow = false,
    labelClass = '',
    containerClass = ''
  } = options;

  return `
    <div class="item ${containerClass}">
      <label class="item_left ${labelClass}">${label}</label>
      <p class="uploadBox ${isArrow ? 'isArrow' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="none">
          <rect x="0.5" y="0.5" width="59" height="59" rx="3.5" fill="white" stroke="#999999"/>
          <rect x="20" y="29" width="20" height="2" fill="#999999"/>
          <rect x="31" y="20" width="20" height="2" transform="rotate(90 31 20)" fill="#999999"/>
        </svg>
        <img src="" alt="img" class="previewImg" style="display:none;"/>
        <input type="file" 
               class="item_right" 
               name="${key}" 
               id="${key}" 
               placeholder="${placeholder}"
               ${readonly ? 'readonly' : ''}
               multiple=${uploadNum > 1}
               data-name="${className}" 
               accept="${accept}">
      </p>
    </div>
  `;
}
# 订单详情模块使用指南

## 概述

这是一个经过重构的订单详情模块，采用了现代化的组件化架构设计，具有更好的可复用性和可维护性。

## 目录结构

```
src/
├── components/          # UI组件
│   ├── BaseComponent.js # 基础组件类
│   ├── InfoDisplay.js   # 信息展示组件
│   ├── Navigation.js    # 导航组件
│   ├── Modal.js         # 模态框组件
│   └── index.js         # 组件出口
├── utils/              # 工具函数
│   ├── domUtils.js     # DOM操作工具
│   ├── fileUtils.js    # 文件处理工具
│   ├── cacheUtils.js   # 缓存管理工具
│   └── index.js        # 工具函数出口
├── config/             # 配置文件
│   └── styles.js       # 样式配置
├── constants/          # 常量定义
│   └── index.js        # 常量出口
└── orderDetailModule.js # 主模块文件
```

## 快速开始

### 1. 基本使用

```javascript
import OrderDetailManager from './src/orderDetailModule.js';

// 初始化管理器
const manager = new OrderDetailManager('#app');

// 准备数据
const pageData = {
  product: {
    productName: '保险产品A',
    productCode: 'INS001',
    price: '¥1000'
  },
  applicant: {
    name: '张三',
    phone: '13800138000',
    email: 'zhangsan@example.com'
  },
  plans: [
    {
      name: '基础计划',
      amount: '¥500',
      desc: '包含基本保障内容'
    },
    {
      name: '高级计划',
      amount: '¥1000',
      desc: '包含全面保障内容'
    }
  ]
};

// 配置选项
const config = {
  productInfo: {
    title: '产品信息',
    fields: {
      productName: '产品名称',
      productCode: '产品编号',
      price: '价格'
    },
    className: 'product-section'
  },
  applicantInfo: {
    title: '投保人信息',
    fields: {
      name: '姓名',
      phone: '手机号',
      email: '邮箱'
    },
    className: 'applicant-section'
  },
  planInfo: {
    title: '保障计划',
    className: 'plan-section'
  },
  navigation: {
    items: [
      { title: '产品信息', target: '.product-section' },
      { title: '投保人信息', target: '.applicant-section' },
      { title: '保障计划', target: '.plan-section' }
    ],
    monitorScroll: true
  }
};

// 初始化页面
manager.init(pageData, config);
```

### 2. 使用独立组件

```javascript
import { InfoDisplay, Navigation, Modal } from './src/components/index.js';

// 使用信息展示组件
const productDisplay = new InfoDisplay({
  container: '#product-container',
  data: productData,
  config: {
    title: '产品详情',
    fields: {
      name: '产品名称',
      price: '价格'
    }
  },
  type: 'product'
});

productDisplay.init();

// 使用导航组件
const nav = new Navigation({
  container: 'body',
  items: [
    { title: '首页', target: '#home' },
    { title: '关于', target: '#about' }
  ],
  onItemClick: (index, target) => {
    console.log('点击了导航项:', index, target);
  }
});

nav.init();

// 使用模态框
Modal.confirm({
  title: '确认操作',
  content: '确定要执行此操作吗？',
  onConfirm: () => {
    console.log('用户确认');
  },
  onCancel: () => {
    console.log('用户取消');
  }
});
```

### 3. 使用工具函数

```javascript
import { 
  fileToBase64, 
  createFileUploadInput,
  loadFromCache,
  saveToCache
} from './src/utils/index.js';

// 文件处理
document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const base64 = await fileToBase64(file);
      console.log('Base64结果:', base64);
    } catch (error) {
      console.error('转换失败:', error);
    }
  }
});

// 创建文件上传组件
const uploadHtml = createFileUploadInput({
  label: '身份证照片',
  key: 'idCard',
  className: 'upload-section',
  options: {
    accept: 'image/*',
    uploadNum: 2
  }
});

document.getElementById('upload-container').innerHTML = uploadHtml;

// 缓存操作
const userData = { name: 'John', age: 30 };
saveToCache('userInfo', userData);

const cachedData = loadFromCache('userInfo');
console.log('缓存数据:', cachedData);
```

## 高级功能

### 1. 自定义样式

```javascript
import { themeColors, navigationStyles } from './src/config/styles.js';

// 自定义导航样式
const customNavStyles = {
  ...navigationStyles,
  container: `
    ${navigationStyles.container}
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  `,
  activeItem: `
    ${navigationStyles.activeItem}
    color: #ffd700;
  `
};

const nav = new Navigation({
  // ... 其他配置
  styles: customNavStyles
});
```

### 2. 数据更新

```javascript
// 更新组件数据
manager.updateComponent('productInfo', {
  productName: '新产品',
  price: '¥1500'
});

// 手动保存数据
manager.saveData();

// 重置表单
manager.resetForm();
```

### 3. 事件处理

```javascript
// 监听组件事件
manager.on('dataUpdate', (data) => {
  console.log('数据已更新:', data);
});

// 自定义动作处理
$(document).on('click', '[data-action="custom"]', () => {
  manager.handleAction('custom');
});
```

## 最佳实践

### 1. 组件使用原则

- 每个组件应该职责单一
- 组件间通过配置进行通信
- 合理使用组件的生命周期方法

### 2. 性能优化

```javascript
// 及时销毁不需要的组件
manager.destroy();

// 合理使用缓存
saveToCache('largeData', largeDataSet, { expires: 3600 }); // 1小时过期

// 节流和防抖
import { throttle } from './src/utils/domUtils.js';
const throttledHandler = throttle(expensiveFunction, 300);
```

### 3. 错误处理

```javascript
try {
  await fileToBase64(largeFile);
} catch (error) {
  if (error.message.includes('浏览器不支持')) {
    // 降级处理
    showErrorMessage('请使用现代浏览器');
  } else {
    showErrorMessage('文件处理失败');
  }
}
```

## 向后兼容

原有的API仍然可用：

```javascript
// 传统方式仍然支持
import { drawInputUpload, showCustomModal } from './src/orderDetailModule.js';

const html = drawInputUpload(config, 'fieldName', 'className');
showCustomModal();
```

## 注意事项

1. 确保jQuery已正确加载
2. CSS变量 `--styleColor` 需要在全局定义
3. 文件上传功能需要服务器支持
4. 缓存数据存储在sessionStorage中，页面关闭后会清除

## 故障排除

### 常见问题

1. **组件不显示**: 检查容器选择器是否正确
2. **样式异常**: 确认CSS变量已定义
3. **事件不响应**: 检查事件绑定时机
4. **数据不更新**: 确认数据格式正确

### 调试技巧

```javascript
// 启用详细日志
localStorage.debug = 'order-detail:*';

// 检查组件状态
console.log(manager.components);

// 查看缓存数据
console.log(sessionStorage);
```

这个重构版本提供了更好的代码组织、更强的可复用性和更容易的维护性，同时保持了对原有API的兼容性。
# MultiLevelSelect.js

MultiLevelSelect.js 是一个轻量级、可定制的 JavaScript 插件，用于在网页应用中实现多级联动选择。该插件支持层级数据导航、搜索功能以及动态内容渲染，具有良好的移动端适配性和用户体验。

## 特性

- **多级导航** - 允许用户在层级数据中逐级导航，轻松找到目标选项
- **实时搜索** - 支持对所有层级数据进行搜索和过滤，快速定位目标选项
- **移动端友好** - 响应式设计，适配触控设备，提供流畅的移动端体验
- **自定义样式** - 用户可以自定义插件的外观样式，满足不同应用需求
- **类目导航** - 提供标签页形式的类目切换，更直观地进行层级数据选择
- **选择状态记忆** - 保存用户的选择状态，方便用户在多次操作之间恢复之前的选择

## 安装

### npm

```bash
npm install multi-level-select
```

### CDN

```html
<script type="module">
  import { MultiLevelSelect } from 'https://cdn.jsdelivr.net/npm/multi-level-select/+esm';
</script>
```

## 使用方法

### 基本示例

```javascript
// 导入插件模块
import { MultiLevelSelect } from 'multi-level-select';

// 实例化插件
const selector = new MultiLevelSelect({
  data: yourHierarchicalData,         // 必填(require)：层级数据数组
  containerId: 'your-container-id',   // 必填(require)：挂载容器的 DOM 元素 ID
  onSelectComplete: (selectedItems) => {
    console.log('选择完成:', selectedItems);
  },
  options: {
    title: '选择项目',               // 弹窗标题（默认值为"默认标题"）
    isBGFixing: true                   // 弹窗打开时固定背景
  }
});

// 打开选择弹窗
selector.openPopup();
// 打开选中弹窗保留选中数据
selector.openPopup(jobId);	// jobId 为选中数据的value,非必填
```

### 数据结构

输入数据应按照以下格式构建：

```javascript
const data = [
  {
    id: "id1",
    value: "1",
    label: "一级选项",
    children: [
      {
        id: "id1-1",
        value: "1-1",
        label: "二级选项",
        children: [
          // 继续定义后续级别...
        ]
      }
    ]
  }
];
```

## 构建

如果你想自己构建此库：

```bash
# 克隆仓库
git clone https://github.com/your-username/multi-level-select.git
cd multi-level-select

# 安装依赖
npm install

# 构建生产版本
npm run build

# 构建后文件将在 dist/ 目录下生成
```

或者直接双击 `build.bat` 运行构建（仅限Windows系统）。

## API 参考

### 构造函数

```javascript
new MultiLevelSelect({
  data: Array,               // 必填：层级数据数组
  containerId: String,       // 必填：挂载 DOM 元素的 ID
  onSelectComplete: Function, // 必填：选择完成后的回调函数
  options: {
    title: String,         // 可选：弹窗标题（默认："默认标题"）
    isBGFixing: Boolean    // 可选：弹窗打开时是否固定背景（默认：true）
  }
});
```

### 主要方法

- **openPopup()** - 打开选择弹窗。如果需要，可以传入 jobId 以预选特定项。
- **closePopup(time = 0)** - 关闭选择弹窗，可设置延时（单位：毫秒）。
- **resetData()** - 重置选择状态，返回初始视图。
- **updateCompleteData(jobId)** - 根据指定项的 ID 更新选择数据。

## 浏览器兼容性

支持所有主流现代浏览器，要求支持 ES6。

## License

MIT
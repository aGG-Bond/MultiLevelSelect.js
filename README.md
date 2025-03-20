# MultiLevelSelect.js 插件说明

MultiLevelSelect.js 是一个轻量级、可定制的 JavaScript 插件，用于在网页应用中实现多级联动选择。该插件支持层级数据导航、搜索功能以及动态内容渲染，具有良好的移动端适配性和用户体验。

## 概述

MultiLevelSelect.js 提供了多级联动下拉选择界面，允许用户方便地浏览和选择层级数据。其主要功能包括：

- 层级数据导航
- 实时搜索功能
- 自定义样式
- 动态内容渲染
- 类目导航
- 选择状态记忆

## 安装

通过 ES6 模块导入来使用此插件：

javascript

```
// 导入插件模块
import { MultiLevelSelect } from './MultiLevelSelect.js';
```

## 使用方法

### 基本示例

javascript

```
// 实例化插件
const selector = new MultiLevelSelect({
  data: yourHierarchicalData,         // 必填：层级数据数组
  containerId: 'your-container-id',   // 必填：挂载容器的 DOM 元素 ID
  onSelectComplete: (selectedItems) => {
    console.log('选择完成:', selectedItems);
  },
  options: {
    title: '选择项目',               // 弹窗标题（默认值为“默认标题”）
    isBGFixing: true                   // 弹窗打开时固定背景
  }
});

// 打开选择弹窗
selector.openPopup();
```

## 功能特性

- **多级导航**
  允许用户在层级数据中逐级导航，轻松找到目标选项。
- **实时搜索**
  支持对所有层级数据进行搜索和过滤，快速定位目标选项。
- **移动端友好**
  响应式设计，适配触控设备，提供流畅的移动端体验。
- **自定义样式**
  用户可以自定义插件的外观样式，满足不同应用需求。
- **类目导航**
  提供标签页形式的类目切换，更直观地进行层级数据选择。
- **选择状态记忆**
  保存用户的选择状态，方便用户在多次操作之间恢复之前的选择。

## API 参考

### 构造函数

javascript

```
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

### 数据结构

输入数据应按照以下格式构建：

javascript

```
[
  {
    id: "id1",
    value: "value1",
    label: "一级选项",
    children: [
      {
        id: "id1-1",
        value: "value1-1",
        label: "二级选项",
        children: [
          // 继续定义后续级别...
        ]
      }
    ]
  }
]
```

### 主要方法

- **openPopup()**
  打开选择弹窗。如果需要，可以传入 jobId 以预选特定项。
- **closePopup(time = 0)**
  关闭选择弹窗，可设置延时（单位：毫秒）。
- **resetData()**
  重置选择状态，返回初始视图。
- **updateCompleteData(jobId)**
  根据指定项的 ID 更新选择数据。

## 事件处理

插件会处理多种用户交互事件，包括：

- **搜索输入**
  实时过滤和匹配数据项。
- **类目切换**
  在不同层级之间进行切换导航。
- **项选择**
  处理用户在各层级数据中进行具体项选择的事件。
- **关闭操作**
  处理用户关闭弹窗的请求。

## 样式定制

默认情况下，插件会自动添加样式。用户可根据需要修改 CSS 样式，主要影响如下部分：

- 类目标签页
- 内容选择列表
- 搜索框
- 弹窗容器

## 浏览器兼容性

支持所有主流现代浏览器，要求支持 ES6。

# Multi Level Select 多级选择组件

## 🚀 现代化版本说明

这是一个支持**TypeScript**的现代化多级选择组件，具有以下特性：

- ✅ **TypeScript支持** - 完整的类型定义和类型安全
- ✅ **高可复用性** - 组件职责分明，可在不同项目中复用
- ✅ **易维护性** - 清晰的目录结构和代码组织
- ✅ **可扩展性** - 支持自定义配置和样式
- ✅ **向后兼容** - 保留原有API，平滑升级

## 📁 目录结构

```
src/
├── MultiLevelSelect.ts     # TypeScript核心源码
├── types/                  # TypeScript类型定义
│   └── index.ts           # 完整类型导出
├── utils/                 # 工具函数
│   └── tsUtils.ts         # TypeScript工具函数
├── components/            # UI组件（重构版本）
│   ├── BaseComponent.js   
│   ├── InfoDisplay.js     
│   ├── Navigation.js      
│   ├── Modal.js           
│   └── index.js           
├── config/                # 配置文件
│   └── styles.js         
├── constants/             # 常量定义
│   └── index.js          
└── orderDetailModule.js   # 传统版本（向后兼容）

dist/                      # 构建输出目录
├── MultiLevelSelect.js           # UMD格式
├── MultiLevelSelect.esm.js       # ES模块格式
├── MultiLevelSelect.min.js       # 压缩版本
└── types/                        # TypeScript声明文件
    └── MultiLevelSelect.d.ts

docs/                      # 文档目录
demo/                      # 示例目录
├── index.html            # 传统版本演示
├── refactored-demo.html  # 重构版本演示
└── ts-demo.html          # TypeScript版本演示
```

## 📖 快速开始

### 1. 安装和构建

```bash
# 克隆项目
git clone https://github.com/username/multi-level-select.git
cd multi-level-select

# 安装依赖
npm install

# 构建项目（包含TypeScript编译）
npm run build

# 开发模式（监听TypeScript变化）
npm run dev
npm run watch:types

# 类型检查
npm run type-check
```

### 2. TypeScript使用方式

```typescript
import MultiLevelSelect, { SelectOption, Config } from './dist/MultiLevelSelect.esm.js';

// 定义类型安全的数据
const data: SelectOption[] = [
  {
    id: '1',
    name: '前端开发',
    children: [
      {
        id: '1-1',
        name: 'JavaScript框架',
        children: [
          { id: '1-1-1', name: 'Vue.js' },
          { id: '1-1-2', name: 'React' },
          { id: '1-1-3', name: 'Angular' }
        ]
      }
    ]
  }
];

// 类型安全的配置
const config: Config = {
  title: '技术栈选择',
  enableSearch: true,
  fixedHeader: true,
  onSelectComplete: (selectedItems: SelectOption[]) => {
    console.log('选择完成:', selectedItems);
  }
};

// 创建实例（获得完整的类型支持）
const selector = new MultiLevelSelect(data, config);
selector.openPopup();
```

### 3. JavaScript兼容使用

```javascript
// 仍然支持传统的JavaScript使用方式
import MultiLevelSelect from './dist/MultiLevelSelect.esm.js';

const selector = new MultiLevelSelect(data, {
  title: '选择分类',
  enableSearch: true
});
```

## 🔧 核心特性

### TypeScript优势
- **类型安全**: 编译时捕获错误，减少运行时问题
- **智能提示**: IDE自动补全和参数提示
- **重构支持**: 安全的代码重构和重命名
- **文档生成**: 自动生成类型声明文件

### 组件化架构
- **BaseComponent**: 所有组件的基础类
- **InfoDisplay**: 通用信息展示组件
- **Navigation**: 智能导航组件
- **Modal**: 灵活的模态框组件

### 工具函数库
- **TypeScript工具**: 类型安全的工具函数
- **DOM操作**: 封装常用的DOM操作
- **文件处理**: 文件上传和base64转换
- **缓存管理**: 统一的sessionStorage操作

## 🎨 类型定义

### 完整的类型支持

```typescript
// 基础选项类型
interface SelectOption {
  id: string | number;
  name: string;
  children?: SelectOption[];
  [key: string]: any;
}

// 配置类型
interface Config {
  title?: string;
  fixedHeader?: boolean;
  enableSearch?: boolean;
  onSelectComplete?: (selectedItems: SelectOption[]) => void;
  jobId?: string | number;
  [key: string]: any;
}

// 搜索状态类型
interface SearchState {
  term: string;
  results: SelectOption[];
  isSearching: boolean;
}
```

## 📚 详细文档

查看以下文档获取更多信息：

- [使用指南](./docs/usage-example.md) - 完整的API文档和使用示例
- [TypeScript指南](./docs/typescript-guide.md) - TypeScript特性和最佳实践
- [重构版本说明](./docs/refactored-version.md) - 组件化架构详解

## 🔧 开发工具

```bash
# 代码构建（含类型声明）
npm run build

# 开发监听
npm run dev

# TypeScript监听
npm run watch:types

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 生成文档
npm run docs
```

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### TypeScript开发流程
1. Fork项目
2. 创建feature分支
3. 使用TypeScript编写代码
4. 运行类型检查：`npm run type-check`
5. 构建测试：`npm run build`
6. 提交PR

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 💡 最佳实践

### TypeScript使用建议
```typescript
// ✅ 推荐：使用明确的类型
const config: Config = {
  title: '选择器',
  enableSearch: true
};

// ✅ 推荐：利用类型推断
const data = [
  { id: '1', name: '选项1' } satisfies SelectOption[]
];

// ✅ 推荐：类型守卫
if (isSelectOptionArray(response.data)) {
  // TypeScript知道这里data是SelectOption[]类型
}
```

### 性能优化
- 合理使用泛型提高代码复用性
- 利用TypeScript的条件类型优化API设计
- 使用const断言保护字面量类型

---
**注意**: 此版本完全向后兼容旧版API，同时提供现代化的TypeScript支持。
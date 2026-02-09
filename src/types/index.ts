/**
 * MultiLevelSelect 类型定义
 */

// 基础选项类型
export interface SelectOption {
  /** 选项唯一标识 */
  id: string | number;
  /** 选项显示名称 */
  name: string;
  /** 子选项列表 */
  children?: SelectOption[];
  /** 其他自定义属性 */
  [key: string]: any;
}

// 配置选项类型
export interface Config {
  /** 弹窗标题 */
  title?: string;
  /** 是否固定头部 */
  fixedHeader?: boolean;
  /** 是否启用搜索功能 */
  enableSearch?: boolean;
  /** 选择完成回调函数 */
  onSelectComplete?: (selectedItems: SelectOption[]) => void;
  /** 预选项目ID */
  jobId?: string | number;
  /** 其他配置项 */
  [key: string]: any;
}

// 搜索状态类型
export interface SearchState {
  /** 搜索关键词 */
  term: string;
  /** 搜索结果 */
  results: SelectOption[];
  /** 是否正在搜索 */
  isSearching: boolean;
}

// 组件实例类型
export interface MultiLevelSelectInstance {
  /** 打开选择弹窗 */
  openPopup(): void;
  /** 关闭选择弹窗 */
  closePopup(): void;
  /** 重置选择状态 */
  reset(): void;
  /** 获取当前选择项 */
  getSelectedItems(): SelectOption[];
}

// 事件类型定义
export interface MultiLevelSelectEvents {
  /** 选择完成事件 */
  onSelectComplete?: (selectedItems: SelectOption[]) => void;
  /** 弹窗打开事件 */
  onPopupOpen?: () => void;
  /** 弹窗关闭事件 */
  onPopupClose?: () => void;
  /** 搜索事件 */
  onSearch?: (term: string, results: SelectOption[]) => void;
}

// CSS类名配置
export interface ClassNames {
  /** 弹窗容器类名 */
  popup?: string;
  /** 遮罩层类名 */
  overlay?: string;
  /** 头部类名 */
  header?: string;
  /** 搜索栏类名 */
  search?: string;
  /** 内容区域类名 */
  content?: string;
  /** 面包屑类名 */
  breadcrumb?: string;
  /** 选项列表类名 */
  optionsList?: string;
  /** 选项项类名 */
  optionItem?: string;
}

// 完整配置类型
export interface FullConfig extends Config {
  /** 自定义CSS类名 */
  classNames?: ClassNames;
  /** 动画持续时间 */
  animationDuration?: number;
  /** 最大层级深度 */
  maxDepth?: number;
  /** 事件处理器 */
  events?: MultiLevelSelectEvents;
}

// 工具类型
export type PartialConfig = Partial<FullConfig>;
export type RequiredConfig = Required<Pick<Config, 'title' | 'fixedHeader' | 'enableSearch'>> & 
                           Partial<Omit<Config, 'title' | 'fixedHeader' | 'enableSearch'>>;

// 工具函数类型
export interface Utils {
  /** 深度查找选项 */
  findOption: (data: SelectOption[], id: string | number) => SelectOption | null;
  /** 扁平化选项树 */
  flattenOptions: (data: SelectOption[]) => SelectOption[];
  /** 过滤选项 */
  filterOptions: (data: SelectOption[], predicate: (option: SelectOption) => boolean) => SelectOption[];
}

// 导出所有类型
export default {
  SelectOption,
  Config,
  SearchState,
  MultiLevelSelectInstance,
  MultiLevelSelectEvents,
  ClassNames,
  FullConfig,
  PartialConfig,
  RequiredConfig,
  Utils
};
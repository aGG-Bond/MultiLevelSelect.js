/**
 * MultiLevelSelect - TypeScript版本
 * 多级联动选择组件
 */

// 类型定义
interface SelectOption {
  id: string | number;
  name: string;
  children?: SelectOption[];
  [key: string]: any;
}

interface Config {
  title?: string;
  fixedHeader?: boolean;
  enableSearch?: boolean;
  onSelectComplete?: (selectedItems: SelectOption[]) => void;
  jobId?: string | number;
  [key: string]: any;
}

interface SearchState {
  term: string;
  results: SelectOption[];
  isSearching: boolean;
}

class MultiLevelSelect {
  private config: Config;
  private data: SelectOption[] = [];
  private selectedItems: SelectOption[] = [];
  private currentLevel: number = 0;
  private searchState: SearchState = {
    term: '',
    results: [],
    isSearching: false
  };
  private popupElement: HTMLElement | null = null;
  private isPopupOpen: boolean = false;

  constructor(data: SelectOption[], config: Config = {}) {
    this.config = {
      title: '请选择',
      fixedHeader: false,
      enableSearch: true,
      onSelectComplete: () => {},
      ...config
    };
    this.data = data;
    
    // 预选处理
    if (this.config.jobId) {
      this.preselectItem(this.config.jobId);
    }
  }

  /**
   * 预选指定项
   */
  private preselectItem(jobId: string | number): void {
    const findItem = (items: SelectOption[], targetId: string | number): SelectOption | null => {
      for (const item of items) {
        if (item.id === targetId) {
          return item;
        }
        if (item.children) {
          const found = findItem(item.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const item = findItem(this.data, jobId);
    if (item) {
      this.selectedItems = [item];
    }
  }

  /**
   * 打开选择弹窗
   */
  public openPopup(): void {
    if (this.isPopupOpen) return;
    
    this.isPopupOpen = true;
    this.renderPopup();
    this.bindEvents();
  }

  /**
   * 关闭选择弹窗
   */
  public closePopup(): void {
    if (!this.isPopupOpen) return;
    
    this.isPopupOpen = false;
    if (this.popupElement) {
      document.body.removeChild(this.popupElement);
      this.popupElement = null;
    }
  }

  /**
   * 重置选择状态
   */
  public reset(): void {
    this.selectedItems = [];
    this.currentLevel = 0;
    this.searchState = {
      term: '',
      results: [],
      isSearching: false
    };
  }

  /**
   * 获取当前选择项
   */
  public getSelectedItems(): SelectOption[] {
    return [...this.selectedItems];
  }

  /**
   * 渲染弹窗
   */
  private renderPopup(): void {
    const popup = document.createElement('div');
    popup.className = 'multi-level-select-popup';
    popup.innerHTML = this.generatePopupHTML();
    
    document.body.appendChild(popup);
    this.popupElement = popup;
  }

  /**
   * 生成弹窗HTML
   */
  private generatePopupHTML(): string {
    return `
      <div class="multi-level-select-overlay">
        <div class="multi-level-select-container">
          ${this.generateHeader()}
          ${this.generateSearchBar()}
          ${this.generateContent()}
        </div>
      </div>
    `;
  }

  /**
   * 生成头部
   */
  private generateHeader(): string {
    return `
      <div class="multi-level-select-header ${this.config.fixedHeader ? 'fixed' : ''}">
        <h3>${this.config.title}</h3>
        <button class="close-btn">&times;</button>
      </div>
    `;
  }

  /**
   * 生成搜索栏
   */
  private generateSearchBar(): string {
    if (!this.config.enableSearch) return '';
    
    return `
      <div class="multi-level-select-search">
        <input type="text" placeholder="搜索..." class="search-input">
        <button class="clear-search" style="display: none;">×</button>
      </div>
    `;
  }

  /**
   * 生成内容区域
   */
  private generateContent(): string {
    return `
      <div class="multi-level-select-content">
        ${this.generateBreadcrumb()}
        ${this.generateOptionsList()}
      </div>
    `;
  }

  /**
   * 生成面包屑导航
   */
  private generateBreadcrumb(): string {
    if (this.selectedItems.length === 0) return '';
    
    const breadcrumbItems = this.selectedItems.map((item, index) => 
      `<span class="breadcrumb-item" data-level="${index}">${item.name}</span>`
    ).join(' > ');
    
    return `<div class="multi-level-select-breadcrumb">${breadcrumbItems}</div>`;
  }

  /**
   * 生成选项列表
   */
  private generateOptionsList(): string {
    const currentData = this.getCurrentLevelData();
    const items = currentData.map(item => 
      `<div class="option-item" data-id="${item.id}">
        <span class="option-name">${item.name}</span>
        ${item.children ? '<span class="arrow">›</span>' : ''}
      </div>`
    ).join('');
    
    return `<div class="options-list">${items}</div>`;
  }

  /**
   * 获取当前层级数据
   */
  private getCurrentLevelData(): SelectOption[] {
    if (this.searchState.isSearching) {
      return this.searchState.results;
    }
    
    let currentData = this.data;
    for (let i = 0; i < this.currentLevel; i++) {
      const selectedItem = this.selectedItems[i];
      if (selectedItem && selectedItem.children) {
        currentData = selectedItem.children;
      } else {
        break;
      }
    }
    
    return currentData;
  }

  /**
   * 绑定事件
   */
  private bindEvents(): void {
    if (!this.popupElement) return;

    // 关闭按钮
    const closeBtn = this.popupElement.querySelector('.close-btn');
    closeBtn?.addEventListener('click', () => this.closePopup());

    // 遮罩层点击关闭
    const overlay = this.popupElement.querySelector('.multi-level-select-overlay');
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closePopup();
      }
    });

    // 选项点击
    const optionItems = this.popupElement.querySelectorAll('.option-item');
    optionItems.forEach(item => {
      item.addEventListener('click', (e) => this.handleOptionClick(e));
    });

    // 搜索功能
    if (this.config.enableSearch) {
      const searchInput = this.popupElement.querySelector('.search-input') as HTMLInputElement;
      const clearBtn = this.popupElement.querySelector('.clear-search');
      
      searchInput?.addEventListener('input', (e) => {
        const term = (e.target as HTMLInputElement).value.trim();
        this.handleSearch(term);
        clearBtn!.style.display = term ? 'block' : 'none';
      });
      
      clearBtn?.addEventListener('click', () => {
        searchInput.value = '';
        this.handleSearch('');
        clearBtn.style.display = 'none';
      });
    }

    // 面包屑导航
    const breadcrumbItems = this.popupElement.querySelectorAll('.breadcrumb-item');
    breadcrumbItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const level = parseInt((e.target as HTMLElement).dataset.level || '0');
        this.navigateToLevel(level);
      });
    });
  }

  /**
   * 处理选项点击
   */
  private handleOptionClick(e: Event): void {
    const target = e.currentTarget as HTMLElement;
    const id = target.dataset.id;
    
    if (!id) return;
    
    const currentData = this.getCurrentLevelData();
    const selectedItem = currentData.find(item => item.id.toString() === id);
    
    if (!selectedItem) return;
    
    // 更新选择状态
    this.selectedItems = this.selectedItems.slice(0, this.currentLevel);
    this.selectedItems.push(selectedItem);
    
    // 判断是否为叶子节点
    if (selectedItem.children && selectedItem.children.length > 0) {
      this.currentLevel++;
      this.updateContent();
    } else {
      // 选择完成
      this.config.onSelectComplete?.(this.getSelectedItems());
      this.closePopup();
    }
  }

  /**
   * 处理搜索
   */
  private handleSearch(term: string): void {
    this.searchState.term = term;
    this.searchState.isSearching = term.length > 0;
    
    if (this.searchState.isSearching) {
      this.searchState.results = this.searchInData(this.data, term);
    }
    
    this.updateContent();
  }

  /**
   * 在数据中搜索
   */
  private searchInData(data: SelectOption[], term: string): SelectOption[] {
    const results: SelectOption[] = [];
    
    const searchRecursive = (items: SelectOption[]): void => {
      items.forEach(item => {
        if (item.name.toLowerCase().includes(term.toLowerCase())) {
          results.push(item);
        }
        if (item.children) {
          searchRecursive(item.children);
        }
      });
    };
    
    searchRecursive(data);
    return results;
  }

  /**
   * 导航到指定层级
   */
  private navigateToLevel(level: number): void {
    this.currentLevel = level;
    this.selectedItems = this.selectedItems.slice(0, level);
    this.searchState = {
      term: '',
      results: [],
      isSearching: false
    };
    this.updateContent();
  }

  /**
   * 更新内容显示
   */
  private updateContent(): void {
    if (!this.popupElement) return;
    
    const content = this.popupElement.querySelector('.multi-level-select-content');
    if (content) {
      content.innerHTML = `
        ${this.generateBreadcrumb()}
        ${this.generateOptionsList()}
      `;
      this.bindEvents();
    }
  }
}

// 导出类型定义
export type { SelectOption, Config };
export default MultiLevelSelect;
export class MultiLevelSelect {
  /**
   * @param {Object} param0 
   * @param {data} param0.data 数据 required
   * @param {containerId} param0.containerId 要绑定的元素id,只能使用id
   * @param {onSelectComplete} param0.onSelectComplete 选择完成后的callback required
   * @param {{}} [param0.options={}] 修改的参数,title,isBGFixing...
   * isBGFixing 弹窗背景是否固定
   * 
  */
 
  constructor({ data, containerId, onSelectComplete, options = {} }) {
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("The 'data' parameter must be a non-empty array.");
    }
    
    if (containerId && typeof containerId !== 'string' || !document.getElementById(containerId)) {
      throw new Error("The 'containerId' parameter must be a valid string ID of an existing DOM element.");
    }
    
    if (typeof onSelectComplete !== 'function') {
      throw new Error("The 'onSelectComplete' parameter must be a function.");
    }
    //数据
    this.data = data;
    // 当前选中的级数
    this.currentCategoryChecked = 0;
    // 总级数
    this.depth = 0;
    // 选中的数据
    this.checkedList = [data[this.currentCategoryChecked]];
    // 搜索的数据
    this.filteredData = '';

    this.container = document.getElementById(containerId);

    this.isBGFixing = options.isBGFixing !== undefined ? options.isBGFixing : true;

    this.onSelectComplete = onSelectComplete || '';
    this.createSelectPopup(options);
    this.createSlectSearch({});

    this.createMultiLevelSelectContetn();

    this.drawData();
  }
  openPopup(jobId) {
    this.searchInput.value = '';
    
    if(jobId){
      this.updateCompleteData(jobId);
    }else {
      this.resetData()
    }
    if (this.isBGFixing) {
      // 固定背景
      document.body.style.overflow = 'hidden';
    }
    this.setStyle(this.maskBox, {
      display: 'block',
    })
    console.log('multilevelSelect', this.container.value, this.container,jobId);
  }
  // 设置样式的函数
  setStyle(ele, styleObj) {
    for (let attr in styleObj) {
      ele.style[attr] = styleObj[attr]
    }
  }

  createSelectPopup({ title = '默认标题',isBGFixing}) {
    // 遮罩
    this.maskBox = document.createElement('div');
    this.setStyle(this.maskBox, {
      display: 'none',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, .2)',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: '9999'
    });
    // 将遮罩放在body中显示
    if(this.container){
      this.container.appendChild(this.maskBox);
    }else {
      document.body.appendChild(this.maskBox);
    }

    this.contentBox = document.createElement('div');
    this.setStyle(this.contentBox, {
      position: 'absolute',
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '80vh',
      background: '#FFFFFF',
      boxShadow: '0px - 1px 4px 0px rgba(186, 186, 186, 0.15)',
      borderRadius: '10px 10px 0 0',
      padding: 0,
    })
    this.maskBox.appendChild(this.contentBox);
    //title
    this.titleBox = document.createElement('h2');
    this.contentBox.appendChild(this.titleBox);
    this.titleBox.innerText = title;
    this.setStyle(this.titleBox, {
      width: '100%',
      height: '14.4vw',
      lineHeight: '14.4vw',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '4.8vw'
    })
    this.contentBox.appendChild(this.titleBox);
    // closeBtn
    this.closeBtn = document.createElement('span');
    // this.closeBtn.innerHTML = 'X';
    this.closeBtn.innerHTML = '<svg t="1738923220682" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1631" width="16" height="16"><path d="M594.983303 512.554066l411.9697 411.9697a58.304836 58.304836 0 0 1-82.428037 82.428036L512.555267 594.982103 100.585567 1006.951802a58.304836 58.304836 0 0 1-82.428036-82.428036L430.127231 512.554066 18.157531 100.584367A58.304836 58.304836 0 1 1 100.585567 18.156331L512.555267 430.12603 924.524966 18.156331a58.304836 58.304836 0 0 1 82.428037 82.428036L594.983303 512.554066z" fill="#000000" p-id="1632"></path></svg>';

    this.setStyle(this.closeBtn, {
      position: 'absolute',
      top: '2.533vw',
      right: '4.267vw',
      fontSize: '6.4vw',
      // color: '#eee'
    })
    this.contentBox.appendChild(this.closeBtn);
    this.closeBtn.addEventListener('click', () =>
      this.closePopup());
  }
  createSlectSearch() {
    // searchBox
    this.searchBox = document.createElement('div');
    this.setStyle(this.searchBox, {
      position: 'relative',
      width: '100%',
      height: '10vw',
      lineHeight: '10vw',
      boxSizing: 'border-box',
      padding: '0 3.2vw'
    })
    this.contentBox.appendChild(this.searchBox);

    // searchInput
    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.placeholder = '请输入',
      this.setStyle(this.searchInput, {
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        padding: '0 10vw',
        border: 'none',
        backgroundColor: '#f7f7f7',
        borderRadius: '13vw',
      })
    this.searchBox.appendChild(this.searchInput);

    this.searchInput.addEventListener('input', this.handleSearch.bind(this));

    // searchIcon
    const searchIcon = `
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M10 2a8 8 0 1 0 6.32 13.32l4.39 4.39a1 1 0 0 0 1.41-1.41l-4.39-4.39A8 8 0 0 0 10 2zM10 4a6 6 0 1 1-6 6 6 6 0 0 1 6-6z">
        </path>
      </svg>
    `;
    this.searchInput.innerHTML = searchIcon;

  }
  createMultiLevelSelectContetn() {
    // multiLevelBox
    this.MultiLevelBox = document.createElement('div');
    this.setStyle(this.MultiLevelBox, {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    })
    this.contentBox.appendChild(this.MultiLevelBox);

    // 级数标题 categorySelect
    this.categorySelectBox = document.createElement('ul');
    this.setStyle(this.categorySelectBox, {
      display: 'flex',
      flexWrap: 'noWrap',
      height: '14vw',
      lineHeight: '14vw',
      borderBottom: '1px solid #f7f7f7',
      padding: '0 3.2vw',
      fontSize: '3.733vw'
    })
    this.MultiLevelBox.appendChild(this.categorySelectBox);

    // 选择的内容 contentSelectBox
    this.contentSelectBox = document.createElement('ul');
    this.setStyle(this.contentSelectBox, {
      flex: '1',
      padding: '3.2vw',
      overflow: 'auto',
      fontSize: '3.733vw'
    })
    this.MultiLevelBox.appendChild(this.contentSelectBox);
  }
  drawData() {
    // this.data
    this.depth = this.getDepth(this.data[0])
    console.log('层级深度:', this.depth);
    this.createCategorySelectElement({ depth: this.depth });

  }
  createClassName(html) {
    // 创建并应用样式
    const style = document.createElement('style');
    style.textContent = html;
    document.head.append(style);
  }
  getDepth(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return 0; // 基础情况：如果不是对象，返回0
    }

    let maxDepth = 0; // 初始化最大层级
    if (obj.hasOwnProperty('children')) {
      const depth = this.getDepth(obj.children[0]); // 递归调用
      console.log('key', depth, maxDepth, this.data);

      if (depth > maxDepth) {
        maxDepth = depth; // 更新最大层级
      }
    }

    return maxDepth + 1; // 返回当前层级加1
  }
  createCategorySelectElement({ textArr = ['一级', '二级', '三级', '四级', '五级', '六级', '七级', '八级', '九级', '十级'], depth, defaultIndex = 0, options, onChange }) {
    this.createClassName(`
      .CategoryChecked {
        color: #ff5e2e;
      }
      .ContentChecked {
        color: #ff5e2e;
      }
    `)
    for (let index = 0; index < depth; index++) {
      if (index == depth) return;
      const li = document.createElement('li');
      li.innerText = textArr[index];
      this.setStyle(li, {
        marginRight: '3vw'
      })
      li.setAttribute('data-index', index);
      if (index == defaultIndex) {
        li.classList.add('CategoryChecked');
      }
      li.addEventListener('click', () => {
        this.handleCategoryClick(index);  // Custom function to handle click
      });
      this.categorySelectBox.appendChild(li);
    }

    this.drawContentSelectData(this.data);


    // Bind click event to contentSelectBox
    this.contentSelectBox.addEventListener('click', (event) => {
      const target = event.target;
      if (target.tagName === 'LI') { // Assuming items are list items
        this.handleContentClick(target);
      }
    });
  }
  // category click bind
  handleCategoryClick(index) {
    console.log(`Category ${index} clicked`);

    console.log(this.checkedList)
    if (this.currentCategoryChecked === index) return;

    this.updateCategorySelection(index);

    if (!this.checkedList?.[index]?.id) {
      if (index == 0) {
        this.checkedList[index] = this.data[0];
      } else {
        this.checkedList[index] = this.checkedList[index - 1]?.children?.[0];
      }
    }

    this.drawContentSelectData(index === 0 ? this.data : this.checkedList?.[index - 1]?.children || []);
  }
  // Function to handle clicking any item in contentSelectBox
  handleContentClick(target) {
    const currentIndex = this.currentCategoryChecked;
    const currentlyChecked = this.contentSelectBox.querySelector('.ContentChecked');

    if (currentlyChecked) {
      currentlyChecked.classList.remove('ContentChecked');
    }


    // 给当前点击的元素添加 ContentChecked 类
    target.classList.add('ContentChecked');

    // 获取选中项的 ID 或相关属性
    const selectedId = target.getAttribute('data-id'); // 获取数据属性
    console.log(`Content item clicked: ${selectedId}`, this.checkedList);

    let arrData;
    if (this.filteredData) {
      arrData = this.filteredData;
      this.filteredData = '';
    } else {
      if (!this.checkedList?.[currentIndex]?.id) {
        if (currentIndex == 0) {
          this.checkedList[currentIndex] = this.data[0];
        } else {
          this.checkedList[currentIndex] = this.checkedList?.[currentIndex - 1]?.children?.[0];

        }
      }
      arrData = currentIndex === 0 ? this.data : this.checkedList?.[currentIndex - 1]?.children;
    }


    this.checkedList[currentIndex] = arrData.find(obj => obj.value === selectedId);
    console.log(this.checkedList);

    if (currentIndex === this.depth - 1) {
      this.closePopup();
      if (this.onSelectComplete) {
        this.onSelectComplete(this.checkedList);
      }
      return this.checkedList;
    }
    setTimeout(() => {
      this.checkedList[currentIndex + 1] = this.checkedList[currentIndex].children[0];
      this.drawContentSelectData(this.checkedList[currentIndex].children);

      this.updateCategorySelection(currentIndex + 1);

    }, 250);
  }
  // search blur bind
  // 输入事件处理函数
  handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase(); // 获取用户输入并转为小写
    this.renderSearchResults(searchTerm); // 渲染搜索结果
  }

  // 根据搜索内容渲染结果
  renderSearchResults(searchTerm) {
    this.clearContentSelectBox(); // 清空当前选择框内容

    // 筛选数据，并渲染符合条件的结果
    const filteredData = this.filterData(this.data, searchTerm);
    console.log('filtereddata', filteredData);
    this.filteredData = filteredData;
    this.drawContentSelectData(filteredData);
  }

  // 过滤数据的函数
  filterData(data, searchTerm) {
    // return data.filter(item => {
    //   // 匹配标签
    //   const matchesLabel = item.label.toLowerCase().includes(searchTerm);

    //   // 递归检查子项
    //   const hasChildrenMatch = item.children && item.children.length > 0
    //     ? this.filterData(item.children, searchTerm).length > 0
    //     : false;

    //   return matchesLabel || hasChildrenMatch;
    // });
    this.updateCategorySelection(this.depth - 1);
    return data.flatMap(item => {
      // 检查当前项是否有子项
      if (item.children && item.children.length > 0) {
        // 递归地过滤子项
        const filteredChildren = this.filterData(item.children, searchTerm);
        return filteredChildren; // 将匹配的最后一级子项返回
      } else {
        // 只有在最后一级子项中检查关键字匹配
        if (item.label.toLowerCase().includes(searchTerm)) {
          return [item]; // 只返回匹配项
        }
      }
      return []; // 如果没有匹配的，返回空数组
    });
  }

  // 清空选择框内容
  clearContentSelectBox() {
    this.contentSelectBox.innerHTML = '';
  }

  updateCategorySelection(targetIndexId=0) {
    // 使用示例
    // updateCategorySelection(2); // 将 index-id 为 2 的元素标记为选中

    // 查找 index-id 为 targetIndexId 的元素
    const targetElement = this.categorySelectBox.querySelector(`[data-index="${targetIndexId}"]`);

    if (targetElement) {
      const currentlyChecked = this.categorySelectBox.querySelector('.CategoryChecked');
      if (currentlyChecked) {
        currentlyChecked.classList.remove('CategoryChecked'); // 删除当前选中的 class
      }

      // 给目标元素添加 categoryChecked 类
      targetElement.classList.add('CategoryChecked');
      this.currentCategoryChecked = targetIndexId;
    }

  }

  drawContentSelectData(arrData = this.data) {
    const defaultIndex = this.currentCategoryChecked;
    this.clearContentSelectBox();

    arrData.map((item, index) => {
      console.log('item', item, index)
      const li = document.createElement('li');
      li.innerText = item.label;
      li.setAttribute('data-id', item.value);
      this.setStyle(li, {
        marginBottom: '2vw'
      })

      if (item.id == this.checkedList[defaultIndex]?.id) {
        li.classList.add('ContentChecked');
      }
      this.contentSelectBox.appendChild(li);
    })
  }
  handleCategoryChange() {
    const selectedCategory = this.categorySelect.value;
    this.updateSubcategories(selectedCategory);
    this.professionSelect.innerHTML = '<option value="">请选择职业</option>'; // 清空职业
  }

  updateSubcategories(categoryValue) {
    this.subcategorySelect.innerHTML = '<option value="">请选择子类</option>'; // 清空子类
    this.professionSelect.innerHTML = '<option value="">请选择职业</option>'; // 清空职业

    const children = this.data.find(cat => cat.value === categoryValue)?.children || [];
    children.forEach(sub => {
      const option = document.createElement("option");
      option.value = sub.value;
      option.textContent = sub.label;
      this.subcategorySelect.appendChild(option);
    });
  }
  // 更新补全数据
  updateCompleteData(jobId) {
    this.checkedList = [];
    this.findParents(jobId,this.data,this.depth);
    this.drawContentSelectData(this.checkedList?.[this.checkedList.length - 2]?.children || []);
  }
  findParents(jobId, data=this.data,level) {
    for (const item of data) {
      if (item.children) {
        const found = this.findParents(jobId, item.children); // 
        if (found) {
          this.checkedList.unshift(item);
          if (this.checkedList.length > level + 1) { // 限制长度
            this.checkedList.pop(); // 去掉多余的层级
        }
          return true; // 返回找到的状态
        }
      }
      // 检查当前项
      if (item.value === jobId) {
        this.checkedList.unshift(item); // 如果找到 jobId，则记录
        return true; // 返回找到的状态
      }
    }
    console.log('findParents',this.checkedList)

    return false; // 没有找到
  }
  //重置数据/渲染默认数据
  resetData() {
    this.currentCategoryChecked = 0;
    this.updateCategorySelection();
    this.checkedList = [this.data[this.currentCategoryChecked]]; // 重置选中列表
    this.searchInput.value = ''; // 清空搜索框
    this.clearContentSelectBox(); // 清空内容框
    this.drawContentSelectData(); // 重新渲染，显示所有数据
  }
  closePopup(time = 0) {
    this.timer = setTimeout(() => {
      if (this.maskBox) {

        this.setStyle(this.maskBox, {
          display: 'none',
        })
        // this.contentBox.innerHTML = '';
      }
      clearTimeout(this.timer);
      if (this.isBGFixing) {
        // 恢复背景
        document.body.style.overflow = '';
      }
    }, time);
    
  }
}

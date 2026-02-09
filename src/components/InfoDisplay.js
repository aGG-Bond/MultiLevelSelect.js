import { BaseComponent } from './BaseComponent.js';

/**
 * 信息展示组件
 * 用于渲染各种信息展示模块
 */
export class InfoDisplay extends BaseComponent {
  constructor(options) {
    super(options);
    this.type = options.type || 'default'; // 'product', 'applicant', 'plan' 等
  }

  createElement() {
    const { title, fields, statusImg, className = '' } = this.config;
    let html = '';

    switch (this.type) {
      case 'product':
        html = this.createProductHtml(title, fields, statusImg, className);
        break;
      case 'applicant':
        html = this.createApplicantHtml(title, fields, className);
        break;
      case 'plan':
        html = this.createPlanHtml(title, this.data, className);
        break;
      default:
        html = this.createDefaultHtml(title, fields, className);
    }

    this.element = $(html);
  }

  createProductHtml(title, fields, statusImg, className) {
    let html = `<div class="itemBox ${className}">
      <div class="title" style="${!title ? 'display: none' : ''}">${title}</div>
      <div class="itemBox">
        <div class="item_l">`;
    
    for (const key in fields) {
      if (Object.hasOwnProperty.call(fields, key)) {
        const label = fields[key];
        const value = this.data[key] || '';
        html += `<p>${label}: ${value}</p>`;
      }
    }
    
    html += `</div>
        <div class="item_r" style="${!statusImg ? 'display: none' : ''}">
          <img src="${statusImg}" alt="">
        </div>
      </div>
    </div>`;
    
    return html;
  }

  createApplicantHtml(title, fields, className) {
    let html = `<div class="itemBox ${className}">`;
    
    if (title) {
      html += `<h3>${title}</h3>`;
    }
    
    for (const key in fields) {
      if (Object.hasOwnProperty.call(fields, key)) {
        const label = fields[key];
        const value = this.data[key] || '';
        html += `<div class="itemBox" style="${!value ? 'display:none' : ''}">
          <div class="item_l">${label}</div>
          <div class="item_r ${key}">${value}</div>
        </div>`;
      }
    }
    
    html += `</div>`;
    return html;
  }

  createPlanHtml(title, plans, className) {
    let html = `<div class="itemBox ${className}">
      <h3 style="${!title ? 'display: none' : ''}">${title}</h3>`;
    
    plans.forEach(plan => {
      const { name, amount, desc } = plan;
      html += `<div class="${className}Item">
        <div class="plan">
          <div>${name}</div>
          <div>
            <span class="planPrice">${amount}</span>
            <i class="iconOpen"></i>
          </div>
        </div>
        <div class="planDesc">${desc}</div>
      </div>`;
    });
    
    html += `</div>`;
    return html;
  }

  createDefaultHtml(title, fields, className) {
    let html = `<div class="itemBox ${className}">`;
    
    if (title) {
      html += `<div class="title">${title}</div>`;
    }
    
    html += '<div class="content">';
    for (const key in fields) {
      if (Object.hasOwnProperty.call(fields, key)) {
        const label = fields[key];
        const value = this.data[key] || '';
        html += `<div class="field-item">
          <span class="label">${label}:</span>
          <span class="value">${value}</span>
        </div>`;
      }
    }
    html += '</div></div>';
    
    return html;
  }

  bindEvents() {
    // 为计划详情绑定展开/收起事件
    if (this.type === 'plan') {
      $(this.element).on('click', '.plan', function() {
        $(this).find('.iconOpen').toggleClass('act');
        $(this).siblings('.planDesc').slideToggle();
      });
    }
  }
}
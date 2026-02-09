/**
 * 样式配置文件
 * 统一管理系统中使用的样式变量
 */

// 主题颜色配置
export const themeColors = {
  primary: 'var(--styleColor)',
  secondary: '#999999',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff'
};

// 导航组件样式配置
export const navigationStyles = {
  container: `
    position: fixed;
    top: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 12.533vw;
    line-height: 12.533vw;
    background: #FFFFFF;
    box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.08);
    opacity: 0;
    transition: all 1s;
  `,
  item: `
    flex: 1;
    font-family: Source Han Sans SC, Source Han Sans SC;
    font-weight: 400;
    font-size: 3.733vw;
    color: ${themeColors.secondary};
    text-align: center;
  `,
  activeItem: `
    font-family: Source Han Sans SC, Source Han Sans SC;
    font-weight: bold;
    font-size: 4.267vw;
    color: ${themeColors.primary};
    text-align: center;
    transition: all 1s;
  `,
  line: `
    position: absolute;
    bottom: 2vw;
    height: 0.8vw;
    background-color: ${themeColors.primary};
    transition: 1s left;
  `
};

// 模态框样式配置
export const modalStyles = {
  overlay: `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `,
  container: `
    background: white;
    border-radius: 8px;
    min-width: 300px;
    max-width: 500px;
    width: 80%;
    transform: scale(0.7);
    transition: transform 0.3s ease;
  `,
  header: `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
  `,
  title: `
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  `,
  close: `
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
  `,
  body: `
    padding: 20px;
  `,
  footer: `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `,
  button: `
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  `
};

// 信息展示组件样式配置
export const infoDisplayStyles = {
  container: `
    margin-bottom: 20px;
  `,
  title: `
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  `,
  itemBox: `
    display: flex;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
  `,
  itemLeft: `
    flex: 1;
    color: #666;
  `,
  itemRight: `
    flex: 2;
    color: #333;
    font-weight: 500;
  `
};

// 响应式断点配置
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
};

// 动画配置
export const animations = {
  fadeIn: 'fade-in 0.3s ease',
  slideUp: 'slide-up 0.3s ease',
  scaleIn: 'scale-in 0.3s ease'
};

// CSS 动画关键帧
export const keyframes = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes scale-in {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

// 导出所有样式
export default {
  themeColors,
  navigationStyles,
  modalStyles,
  infoDisplayStyles,
  breakpoints,
  animations,
  keyframes
};
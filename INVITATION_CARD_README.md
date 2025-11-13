# InvitationCard 交互功能说明

## 功能概述

InvitationCard 组件现在具有类似 iOS 原生应用的滑动交互功能，提供流畅的用户体验。

## 核心功能

### 1. iOS 风格 Handle
- 位置：卡片顶部居中
- 样式：灰色圆角（36px × 5px，rgba(0,0,0,0.3)）
- 功能：视觉提示 + 拖动手柄

### 2. 自动收起/展开
**向下滚动时：**
- 当页面滚动超过 100px 时，卡片自动收起
- 收起状态下只显示 Handle + 积分区域（高度约 140px）
- 使用平滑的 300ms 动画过渡

**向上滚动时：**
- 任何向上滚动都会自动展开卡片
- 显示完整内容（积分区域 + 步骤说明）

### 3. 手动拖动控制
**在收起状态下：**
- 向上拖动 Handle 可以展开卡片
- 拖动距离 > 80px：释放后展开
- 快速向上滑动（高速度）：阈值降低到 50px

**在展开状态下：**
- 向下拖动 Handle 可以收起卡片
- 拖动距离 > 80px：释放后收起
- 快速向下滑动（高速度）：阈值降低到 50px

**拖动特性：**
- 实时跟随：拖动过程中卡片实时响应
- 阻尼效果：拖动距离限制在 200px 以内
- 回弹动画：拖动不足阈值时回弹到原状态

## 技术实现

### 零依赖方案
- **状态管理**：React Hooks (useState, useRef, useCallback)
- **滚动监听**：window scroll events + requestAnimationFrame
- **手势识别**：原生 Touch/Mouse Events
- **动画效果**：CSS transform + transition
- **性能优化**：RAF 节流 + passive listeners

### 关键技术点
1. **Fixed 定位**：卡片固定在页面底部，不随内容滚动
2. **Transform 动画**：使用 GPU 加速的 translateY
3. **Will-change**：提前通知浏览器优化
4. **Touch-action: none**：防止浏览器默认手势冲突
5. **双端兼容**：同时支持触摸和鼠标操作

## 交互逻辑流程图

```
用户操作 → 事件触发 → 状态更新 → 动画执行
    ↓           ↓           ↓           ↓
滚动/拖动   Listener   cardState   transform
```

## 状态管理

### CardState
- `expanded`：展开状态（默认）
- `collapsed`：收起状态

### 关键 Ref
- `touchStartY`：记录触摸起始位置
- `touchCurrentY`：记录当前触摸位置
- `lastScrollY`：记录上次滚动位置
- `dragOffset`：拖动偏移量

## 性能指标

- **FPS**：60 帧（拖动和滚动）
- **过渡时长**：300ms cubic-bezier(0.4, 0, 0.2, 1)
- **防抖阈值**：5px（忽略微小滚动）
- **代码体积**：< 5KB（零依赖）

## 浏览器兼容性

✅ **完全支持**
- Chrome 90+
- Safari 14+ (iOS/macOS)
- Firefox 88+
- Edge 90+

✅ **降级支持**
- 旧版浏览器：卡片保持固定展开状态

## 可访问性

- **ARIA 属性**：role="region", aria-label
- **键盘导航**：Tab 键可聚焦按钮
- **语义化标签**：正确的 HTML 结构
- **状态标识**：data-state 属性

## 使用示例

```tsx
import { InvitationCard } from '@/components/invitation/InvitationCard';

export default function Page() {
  return (
    <div>
      {/* 页面内容 */}
      <div className="content pb-[300px]">
        {/* 记得添加底部 padding 避免内容被遮挡 */}
      </div>
      
      {/* 固定在底部的邀请卡片 */}
      <InvitationCard invitationCode="YOUR_CODE" />
    </div>
  );
}
```

## Props

```typescript
interface InvitationCardProps {
  invitationCode?: string;  // 邀请码，默认 "ER56Y"
  className?: string;        // 额外的 CSS 类名
}
```

## 样式定制

卡片使用内联样式 + Tailwind CSS，可以通过以下方式定制：

1. **修改收起高度**：调整 `getTransform()` 中的 `calc(100% - 140px)`
2. **修改动画时长**：调整 transition 的 `0.3s`
3. **修改拖动阈值**：调整 `handleTouchEnd` 中的 `threshold`
4. **修改 Handle 样式**：修改 Handle div 的 className

## 调试技巧

### 查看当前状态
打开浏览器控制台，查看卡片元素的 `data-state` 属性：
```javascript
document.querySelector('[role="region"]').dataset.state
// "expanded" 或 "collapsed"
```

### 禁用自动收起
临时注释掉 scroll event listener：
```typescript
// window.addEventListener('scroll', handleScroll, { passive: true });
```

### 调整拖动灵敏度
修改 threshold 值：
```typescript
const threshold = dragVelocity > 0.5 ? 50 : 80; // 降低阈值使其更灵敏
```

## 已知限制

1. **滚动冲突**：如果页面内有其他滚动容器，可能需要额外处理
2. **橡皮筋效果**：iOS Safari 的橡皮筋效果可能影响体验
3. **横屏模式**：未专门优化横屏显示

## 未来优化方向

1. **弹性动画**：添加更自然的弹性效果（spring animation）
2. **手势速度**：更精确的速度计算
3. **多点触控**：支持双指缩放等高级手势
4. **状态持久化**：记住用户上次的展开/收起状态
5. **无障碍增强**：添加键盘展开/收起功能

## 故障排查

### 问题：卡片不显示
- 检查是否添加了 `pb-[300px]` 避免内容遮挡
- 检查 z-index 是否正确（当前为 z-50）

### 问题：拖动不响应
- 检查是否在移动设备上测试
- 检查浏览器是否支持 Touch Events
- 在桌面浏览器使用鼠标拖动测试

### 问题：动画卡顿
- 检查是否有其他 CPU 密集任务
- 打开浏览器性能监控工具
- 确认 will-change 属性生效

## 贡献指南

如需修改此功能，请：
1. 阅读 `IMPLEMENTATION_PLAN.md` 了解设计思路
2. 参考 `TEST_SCENARIOS.md` 进行完整测试
3. 保持零依赖原则
4. 确保 60 FPS 性能

## 技术支持

如遇问题，请提供：
- 浏览器版本和设备型号
- 操作步骤和预期行为
- 控制台错误信息（如有）
- 屏幕录屏（如有）


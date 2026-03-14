# Health Tracker - 个人健康管理应用

一个专为健康监测设计的 Web 应用，帮助您追踪血压、体重、腰围，管理补剂和体检报告，并获得 AI 健康指导。

![Health Tracker](https://img.shields.io/badge/Health-Tracker-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-cyan)

## ✨ 功能特性

- 📊 **数据追踪** - 记录血压（收缩压/舒张压）、体重、腰围
- 📈 **可视化图表** - 线性趋势图展示健康数据变化
- 💊 **补剂管理** - 记录营养补剂和药物服用情况
- 📄 **体检报告** - 管理医院和体检报告，记录关键指标
- 🤖 **AI 指导** - 基于数据的智能健康分析和建议
- 💾 **本地存储** - 数据保存在浏览器本地，隐私安全
- 📱 **响应式设计** - 支持桌面和移动设备

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 3. 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
health-tracker/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx           # 仪表盘（概览页面）
│   ├── entry/             # 每日录入页面
│   ├── history/           # 历史记录页面
│   ├── supplements/       # 补剂管理页面
│   ├── reports/           # 体检报告页面
│   └── ai-insights/       # AI 健康指导页面
├── components/            # React 组件
│   ├── Sidebar.tsx        # 侧边导航
│   ├── Card.tsx           # 卡片组件
│   ├── Button.tsx         # 按钮组件
│   └── Input.tsx          # 输入框组件
├── lib/                   # 工具库
│   └── storage.ts         # 本地存储操作
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── tailwind.config.ts     # Tailwind CSS 配置
└── next.config.js         # Next.js 配置
```

## 🛠 技术栈

- **框架**: [Next.js 14](https://nextjs.org/) - React 全栈框架
- **语言**: [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- **图表**: [Recharts](https://recharts.org/) - React 图表库
- **图标**: [Lucide React](https://lucide.dev/) - 图标库
- **日期**: [date-fns](https://date-fns.org/) - 日期处理库

## 📚 学习资源

作为初学者，建议按以下顺序学习：

1. **React 基础**
   - [React 官方文档](https://react.dev/)
   - 理解组件、Props、State、Hooks

2. **Next.js 基础**
   - [Next.js 学习路线](https://nextjs.org/learn)
   - 理解 App Router、页面路由

3. **TypeScript 基础**
   - [TypeScript 入门](https://www.typescriptlang.org/docs/handbook/intro.html)
   - 理解类型定义、接口

4. **Tailwind CSS**
   - [Tailwind 文档](https://tailwindcss.com/docs)
   - 学习常用工具类

## 🔮 未来扩展

- [ ] 接入 Supabase 数据库，支持云端同步
- [ ] 接入真正的 AI API（如 Kimi）进行智能分析
- [ ] 添加数据导入/导出 CSV 功能
- [ ] 添加提醒功能（服药提醒、测量提醒）
- [ ] PWA 支持，可安装为手机应用
- [ ] 多用户支持

## 📝 使用建议

1. **定期记录** - 建议每天固定时间测量并记录
2. **完整记录** - 尽量填写所有字段，获得更准确的趋势
3. **结合体检** - 将体检报告的关键指标录入系统
4. **数据备份** - 定期导出 JSON 备份数据
5. **咨询医生** - AI 分析仅供参考，重要决策请咨询医生

## 🤝 与 OpenClaw 结合

您可以将应用中的数据导出，然后问我（OpenClaw）：

> "这是我的健康数据 [粘贴 JSON]，请帮我分析趋势并给出建议。"

我会基于您的完整数据给出更深入的分析！

---

Made with ❤️ for your health

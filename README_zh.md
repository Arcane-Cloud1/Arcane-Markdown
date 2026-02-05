# Arcane Markdown

[English](./README.md) | 简体中文

一个为现代 Web 构建的强大的基于块的 Markdown 编辑器。

## 功能特性

- **基于块的编辑**：直观的拖拽界面用于组织内容。
- **丰富的内容支持**：
  - 标题、段落、引用
  - 列表（有序、无序、任务列表）支持智能分组
  - 代码块，支持语法高亮 (PrismJS) 和自动缩进
  - 数学公式 (LaTeX)
  - Mermaid 图表
  - 表格、折叠详情、图片
  - 提示框 (信息、警告、成功、错误)
- **实时预览**：所见即所得。
- **导出**：一键导出为标准 `.md` 文件。
- **多语言支持**：支持中文和英文界面切换。

## 快速开始

1. **安装依赖：**

   ```bash
   npm install
   ```

2. **启动开发服务器：**

   ```bash
   npm run dev
   ```

3. **打开应用：**
   在浏览器中访问 [http://localhost:3001](http://localhost:3001)。

## 📦 构建生产版本

创建生产构建：

```bash
npm run build
```

本项目使用 Next.js 静态导出（`output: 'export'`）并配置了相对路径，因此构建输出将位于 `out/` 目录中。

构建完成后，你可以：
1.  运行 `npm run preview` 启动本地服务器（推荐）。
2.  或者双击 `preview.bat` (Windows)。
3.  **技术上**，你也可以直接在浏览器中打开 `out/index.html`，因为我们已经启用了相对路径（`assetPrefix: './'`）。但是，某些高级路由功能可能仍需要服务器支持。

## 🛠 技术栈

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Lucide React](https://lucide.dev/)
- [PrismJS](https://prismjs.com/)

## 📚 文档

- [API 文档](./docs/API_zh.md)

## 🤝 贡献

欢迎贡献代码！请查看我们的 [贡献指南](docs/CONTRIBUTING.md) 了解详情。

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

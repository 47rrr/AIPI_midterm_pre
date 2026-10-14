# Return Pilot · AIPI 590 第二次 Presentation

这个仓库同时存放 presentation deck 和可交互的 Web MVP。目前 deck 已完成开场的 Project overview 与 Progress overview，后续内容继续在这里添加。

## 打开演示

直接用浏览器打开根目录 `index.html`。方向键或 Space 推进，左箭头后退，F 全屏。进展页中的 **Open Web demo** 可进入产品演示，再返回原来的展示位置。

也可以在项目目录运行：

```sh
python -m http.server 8000 --bind 127.0.0.1
```

然后打开 `http://127.0.0.1:8000/`。单独打开 MVP 使用 `demo/index.html`。

## 修改哪里

- `index.html`：展示内容和隐藏的中文讲述稿。
- `assets/presentation.css`：展示样式、布局和动画样式。
- `assets/presentation.js`：分步动画、翻页和 demo 开关。
- `assets/images/`：展示图片，目前包含真实 Web 原型截图。
- `demo/`：现有产品 MVP 的 HTML、CSS 和 JavaScript。
- `PRESENTATION_STYLE.md`：团队统一的视觉与交互规范。
- `exports/`：最终 PDF 等导出文件。

`deck/` 是之前预留的目录，目前未被入口引用；本次展示资源统一放在 `assets/`。

## 和队友同步

仓库：https://github.com/47rrr/AIPI_midterm_pre

首次使用克隆仓库；已有本地仓库的队友，开始修改前先拉取最新提交。建议每人使用自己的分支，完成后通过 Pull Request 合并，并提前约定谁修改哪个部分，尤其避免同时大改 `index.html`。

修改后检查页面能否打开、改动是否正常、相关按钮是否可用即可；涉及动画或翻页时再检查对应的前进与回退。不需要另外安装测试工具或生成验收文件。

## 待补充材料

- 本阶段正式支持的商家、条件和功能范围。
- AI 评估的真实实验设计、执行状态或结果。

这些位置目前明确标注待确认。Web 截图来自现有原型，里面的订单和政策是示例数据。素材说明见 `assets/SOURCES.md`。

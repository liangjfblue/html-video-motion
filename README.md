# HTML Video Motion · 视觉增强组件库

> **🖥️ 在线演示** [motion.liangjf.com](https://motion.liangjf.com/) · **代码** MIT · **字体** Smiley Sans / OFL

**41 条面向口播 / 解说类视频的动效能力**，三种形态一次集齐，线上逐卡 LIVE 实播、即选即用：

- **React 组件**（19 条）——挂载即动、颜色读 CSS 变量、固定 seed 可复现
- **纯 CSS 关键帧**（12 条）——零 JS，类名即用
- **HyperFrames 合成**（10 条）——独立 1920×1080 HTML + GSAP timeline，iframe 实播预览

> 🖥️ **在线演示站**：[https://motion.liangjf.com/](https://motion.liangjf.com/)

![HTML Video Motion 封面](public/media/html-video-motion-cover.jpg)

## ✨ 特性

- **LIVE 预览**：每张卡片自带 16:9 实播舞台，演示自动循环、逐卡变焦，滚动即浏览，不靠截图
- **随点随取**：hover「要点」弹出 参数 / 时机 / 禁忌；「给 agent」一键复制**自包含开发契约**
- **可 100% 复刻**：契约内嵌组件源码 + 关联样式 + 主题变量默认值，贴给任何 agent 即可复刻，无需访问本仓库
- **主题感知**：颜色全部走 CSS 变量，深 / 浅两套主题一键切换
- **可离线**：得意黑字体自托管、gsap vendor 进仓，断网也能跑

## 快速开始

```bash
npm install
npm run dev      # http://localhost:5175
npm run build    # 产出 dist/ 纯静态，任意服务器可托管
```

## 每张卡片看什么

上半：**实播舞台**——该动效在真实运行（非截图、非占位）
下半：**场景**（何时用）· **要点**（一句话记住它，hover 看详情）· **用法**（组件签名 / 类名 / 合成文件）

## 目录

```
src/motion/          组件与注册表（registry.ts 是唯一事实源）
src/enhance/         组件库页（本身就是全部页面，无其他路由）
src/styles/          纯 CSS 形态的关键帧与类
compositions/        HY 合成（独立 HTML，GSAP timeline）
public/fonts/        自托管字体（得意黑 Smiley Sans，OFL 许可随库）
public/media/        演示用中性素材（示意视频 / 示意图）
scripts/             deploy.sh 一键部署脚本
```

## 接入自己的项目

1. React 组件：复制对应 `src/motion/*.tsx`（含 `anim.ts`）与提取的 CSS 块——「给 agent」契约里已按条拆好。
2. 纯 CSS：复制关键帧块，按说明挂类名。
3. HY 合成：整个 HTML 是独立沙盒；仓库内置 `vendor/gsap`（MIT），也可换成 CDN 一行，改文案 / 节拍直接编辑 HTML 与脚本顶部的 `T` 常量。

## 部署

纯静态站点，`npm run build` 产出 `dist/`，任意静态服务器可托管（Nginx / Caddy / OSS+CDN 均可）。阿里云 ECS + 域名示例：

```bash
# 一次性：配置免密登录（本机执行）
ssh-keygen -t ed25519
ssh-copy-id root@your-server

# 之后每次更新，一条命令完成 推送 GitHub + 构建 + 同步上线
./scripts/publish.local.sh
```
> `publish.local.sh` 是本机私有脚本（已 gitignore，不入库），含你的服务器地址。
> CI 只做构建验证，不做自动部署——部署由本机脚本触发。

Nginx 站点配置（`/etc/nginx/conf.d/html-video-motion.conf`）：

```nginx
server {
    server_name your-domain.com;
    root /var/www/html-video-motion;
    index index.html;

    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    location /fonts/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    location /vendor/ { expires 7d; add_header Cache-Control "public"; }
    location /compositions/ { expires 7d; add_header Cache-Control "public"; }
    location = /index.html { add_header Cache-Control "no-cache"; }
    location / { try_files $uri $uri/ /index.html; }
}
```

域名解析一条 A 记录指向服务器 IP，HTTPS 用 certbot 一键签发：

```bash
certbot --nginx -d your-domain.com
```

## License

- 代码：MIT（见 LICENSE）
- 字体：`public/fonts/SmileySans-*.woff2` 为得意黑（Smiley Sans），OFL 许可随库分发；MiSans 经 CDN 按需加载
- `compositions/` 内为演示样例，接入前请替换为自有素材

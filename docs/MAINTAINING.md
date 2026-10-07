# 维护与发布说明

这是由魔戒品牌运营方维护的入口导航、使用指南、链接检查工具与静态网页源码项目。运营身份依据维护方于 2026-10-07 的明确说明。使用 Node.js 20 或更新版本，不需要 npm install。四个域名的注册按钮进入果冻云，维护方已确认这是正常业务安排，当前四个入口均已开放。

## 目录职责

| 路径 | 用途 |
| --- | --- |
| brand.json | 域名、地址更新日期、核对日期、实际注册服务、运营身份、部署地址的唯一配置 |
| performance.json | README 六份历史图表的时间、环境、解读；服务器状态原始记录仅归档，不生成展示内容 |
| assets/performance/ | 性能章节原始图片，保留完整尺寸与图示标记 |
| scripts/performance.mjs | 仅生成 README 的六份性能报告，不生成服务器表或网页性能板块 |
| templates/index.html | 页面主体模板 |
| templates/README.md | 宣传介绍和使用指南模板 |
| assets/ | 原创样式、图形及复制/收藏交互 |
| scripts/build.mjs | 从配置生成 index.html、README.md、robots.txt，配置真实域名后生成 sitemap.xml |
| scripts/check.mjs | 核对静态链接、域名一致性、资源及公开文件内容 |
| scripts/check-links.mjs | 读取公开页面，输出本地 HTTP、标题与跳转记录，不自动更改推荐状态 |
| docs/ACCESS.md | 访问故障判断、术语与报告字段说明 |
| scripts/serve.mjs | 只在本机 127.0.0.1 上提供预览 |
| docs/SOURCES.md | 公开出处与核对边界 |
| CHANGELOG.md | 实际变更记录 |

修改 brand.json 或 templates 后执行：

```sh
npm run build
npm run check
npm run check:links
npm run preview
```

打开 http://127.0.0.1:4173/ 。也可直接打开 index.html；页面正文和入口链接不依赖 JavaScript。暂停开放的记录仅显示“入口维护中，请使用其他地址”，不生成访问或复制按钮。

## 仓库信息建议

- 仓库名：`mojie-guide`
- Description：`魔戒机场（Mojie）入口导航与使用指南：常用地址、访问问题、套餐与订阅说明、静态网页源码及本地链接检查工具。`
- Topics：`mojie`、`link-checker`、`documentation`、`static-site`，按实际内容添加，不堆砌不相干词。
- 仓库地址：https://github.com/MarshHarte/mojie-guide
- Website：入口页实际部署 URL，确认部署后再填写。
- 仓库身份：魔戒品牌运营方维护的入口导航与使用指南。运营身份不等同于 GitHub 或搜索引擎认证。

## 发布步骤

1. 本项目使用公开仓库 `MarshHarte/mojie-guide`。只提交本目录，勿上传根目录的调研 Excel、后台摘录、研究脚本或其他品牌项目。
2. 在支持该内容与业务用途的自有站点或静态托管服务部署入口页。部署文件仅需 `index.html`、`assets/`、`robots.txt`，以及配置真实 URL 后生成的 `sitemap.xml`。
3. 将 `brand.json` 的 `siteUrl` 设为真实 HTTPS 页面根地址（末尾保留 `/`）。`repositoryUrl` 已配置为 `https://github.com/MarshHarte/mojie-guide`；当前 `siteUrl` 为 null，待入口页完成部署后再填写。
4. 重新执行 build 和 check。构建会自动补入 canonical、og:url、分享图元数据、WebPage 结构化数据、sitemap、README 访问指南链接及网页 GitHub 返回链接。结构化数据只描述实际页面，不包含评分、价格或官方身份。
5. 将生成文件同步至仓库和托管服务，核对电脑和手机展示、四个出站链接以及域名跳转。
6. 在自己能验证所有权的入口站点开通 Google Search Console / Bing Webmaster Tools，提交本站 sitemap。仓库 URL 的抓取索引由 GitHub 与搜索引擎处理，不能代替验证整个 github.com 的所有权。

若需要更换部署域名，先修改为新的实际 URL 再构建。若撤回为本地草稿并将 siteUrl 设为 null，构建会移除本地旧 sitemap.xml；同步部署时也须撤下线上旧文件。部署于子目录时，robots.txt 应由域名根路径统一管理，子目录里的 robots.txt 不控制整个站点。

仓库维护源码、README、图片与使用文档，入口页需单独部署。本项目没有添加自动发布工作流，GitHub Pages 不作为商业入口页的默认部署选项。

## 更新原则

三个日期分开维护：updatedAt 记录内容更新，linksUpdatedAt 记录地址清单更新，linksCheckedAt 记录实际入口核对。README 与入口页的“地址更新于”共同读取 linksUpdatedAt。只有地址清单发生更新才调整地址日期；只有完成核对后才调整核对日期。修改普通文案或重新构建不会自动刷新这两个日期。

链接检查首先核对最终跳转、品牌内容和 HTTPS，而不只看状态码。有些错误页面也返回 200。任何客户端耗时探测都不能当成代理节点测速；因此当前入口页不显示延迟、实时在线绿标或“最快线路”。

将来增加真实推广参数前，确认目标站支持且不会破坏原有参数。当前链接保留清单中的原始 HTTPS 地址，未植入任何他人的邀请码，也未增加统计脚本。如果存在返佣关系，应在对应链接附近明确披露，并为网页推广链接使用 `rel="sponsored noopener noreferrer"`。

## 推荐状态如何维护

recommendable 表示经人工审核后是否开放链接，不能由 HTTP 200 或标题匹配自动设置为 true。开放前核对实际服务、关键按钮去向与配置记录，并记录 reviewNote。它不是节点速度或在线率指标。

promotion.registrationService 和 promotion.registrationHost 记录预期注册服务及域名。开放记录的 registrationBrandObserved、registrationHostObserved 必须分别与这两个字段一致，构建时会校验。文章主题品牌与实际注册服务可以不同；不要修改观察记录来伪造品牌一致性。

页面按钮统一使用“打开入口”。按运营方要求，公开页面与 README 不显示第三方身份、入口推广提示、已核对标签或独立的核对说明板块。真实注册服务及域名仍保留在 brand.json 和维护记录中，HTML 链接继续保留 sponsored 与新窗口安全属性。未来实际去向与配置不符时，将相应记录设为待复核，再核对并更新配置；不自行推断账号或余额互通。

## GitHub 使用边界

GitHub《可接受使用政策》第 10 条允许与项目相关的推广图片、链接和文字，但账号内容的主体不能是广告或营销。项目的实际用途应是可维护的指南和工具；增加少量代码不能自动让以引流为主的广告仓库符合规则。

不批量复制关键词仓库、不自动刷日期或 Star、不在他人 Issue 中投放广告。商业入口页使用支持该业务用途的独立托管，是否符合规则仍取决于实际内容和行为。

若增加价格、节点数、测试结果，必须记录出处与日期，测试需说明地区、运营商、时间和套餐；缺资料时保留缺口。

性能章节仅在 README 展示六份历史图表，入口网页不展示性能板块，README 不展示服务器状态表。测试时间来自原图，2026-10-08 为资料整理日期，不是重新测速日期。新增或更换资料时同时维护 performance.json、原图和 docs/SOURCES.md，再执行 build 与 check。服务器原始记录仅在数据文件中归档，没有实时探测或自动刷新。README 图片链接使用仓库内相对路径，仓库中须保留整个 assets/performance/ 目录；入口网页不依赖该目录。

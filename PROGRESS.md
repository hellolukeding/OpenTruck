# 项目进度

## 当前状态

- 已完成项目主技术选型
- 已建立 `frontend/` 与 `backend/` 基础骨架
- 已添加 `docker-compose.yml` 用于本地 `PostgreSQL + Redis`
- 已补齐 `backend/.env.example`
- 已落地 `make check`
- 已修正后端入口导入路径
- 已接入 `SQLAlchemy + Alembic` 基础结构
- 已添加首个手写迁移 `20260511_0001_initial_schema`
- 已建立 `Tenant`、`ApiKey`、`Node`、`NodeModel` 四个模型
- 已在 Docker 中真实执行 Alembic 迁移并验证落表
- 已接入数据库会话依赖与数据库健康检查
- 已实现四类核心资源的基础 admin 创建/列表接口
- 已补充四类核心资源的获取、更新、删除接口
- 已补充统一错误响应与基础唯一性冲突处理
- 已完成首版前端管理台首页，并接入真实 admin API 数据
- 已通过 `next build` 验证前端构建
- 已在浏览器中检查桌面与移动端基础布局
- 已将前端基础层切到 `shadcn/ui` 风格组件
- 已完成 `en` / `zh-CN` 两种语言的首页支持
- 已将前端主视觉切到黑白中性色控制台风格
- 已为前端管理台补齐侧边导航与四类资源独立页面
- 已在浏览器中验证 `en` / `zh-CN` 的总览与资源页真实取数
- 已为四类资源接入创建表单与服务端提交链路
- 已在浏览器中完成 `tenant` 与 `node` 的真实创建冒烟验证
- 已修正前端首页语言切换，中文首页不再误跳转到后台页
- 已按 `pnpm` 重新验证前端安装与构建链路
- 已为四类 admin 列表接口补充分页、排序、搜索与基础筛选能力
- 已将 admin 列表返回结构统一为 `{ items, pagination }`
- 已兼容前端数据层同时读取旧数组结构与新分页结构
- 已用 FastAPI `TestClient` 对四类列表接口完成真实分页响应冒烟验证
- 已为核心 schema 补充字段长度、数值范围、URL 与状态枚举校验
- 已为列表查询参数补充状态枚举与排序方向校验
- 已将 FastAPI `RequestValidationError` 与未处理异常统一映射为标准错误响应
- 已将数据库完整性异常细分为唯一冲突、无效关联、缺少必填、约束失败与通用内部错误
- 已用 `TestClient` 验证 `422 validation_error`、`400 invalid_sort_by` 与 `409 conflict` 回归正常
- 已将四类资源页切到按资源分页取数，不再只消费总览聚合数据
- 已为四类资源页补齐基础筛选条、分页控件、编辑对话框与删除确认对话框
- 已将前端状态词从 `paused` 对齐为后端实际使用的 `disabled`
- 已在干净的 `next start` 实例上用浏览器验证 `/en/tenants` 编辑弹窗可打开，`/en/models` 创建区与行操作可正常渲染
- 已参考 `sub2api` 落地首版 `OpenAI OAuth / Codex` 上游账号接入链路
- 已新增多租户 `oauth_sessions` 与 `upstream_accounts` 两张表
- 已新增 `OpenAI OAuth PKCE` 授权链接生成、授权码换 token、OAuth 账号落库与 refresh token 接口
- 已用本地 Docker PostgreSQL 成功执行 `20260512_0002_oauth_upstream_accounts` 迁移
- 已用 FastAPI `TestClient + mock token exchange` 验证 `auth-url -> create-account -> list -> refresh` 主链路
- 已新增首版租户 API Key 鉴权依赖，支持 `Authorization: Bearer` 与 `X-API-Key`
- 已新增首版网关执行层，可将 `/v1/responses`、`/responses` 与 `/backend-api/codex/responses` 转发到租户自己的 `OpenAI OAuth` 上游账号
- 已将 `/v1/models` 接入租户 API Key 鉴权，并返回当前租户可见的基础模型信息
- 已用 `TestClient + external httpx mock` 验证 `Bearer API Key -> tenant -> upstream account -> Codex responses` 真实转发链路

## 已知问题

- 数据库连接尚未接入更完整的 FastAPI 生命周期管理
- admin 接口仍缺更细的资源级筛选校验与更完整的字段级错误元数据
- 前端资源页仍缺排序切换、更多筛选维度与详情面板
- 当前管理页摘要卡片仍以“当前页快照”为主，尚未拆出专门的聚合统计接口
- 网关首版仍只支持 `responses`/`codex responses` 主链路，尚未覆盖 `chat/completions`、流式转发与更多协议适配
- 上游账号调度仍是最简单的“租户内取一个 active OAuth 账号”，还没有接入更完整的优先级、限流、故障摘除与粘性策略

## 下一步

1. 为网关补 `chat/completions -> responses` 协议转换，继续向 `sub2api` 靠拢
2. 为上游账号选择补优先级、故障摘除、token 过期处理与更细的调度策略
3. 为前端资源页补 `upstream_accounts` 管理页，并接入 OAuth 创建和 refresh 操作
4. 将数据库连接与健康探测接入更完整的 FastAPI 生命周期管理

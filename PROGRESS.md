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
- 已新增首版 `chat/completions -> responses` 协议兼容层，并接入租户 OAuth 网关
- 已支持 `/v1/chat/completions` 与 `/chat/completions` 的非流式文本回复和 tool calls 回复
- 已用 `TestClient + external httpx mock` 验证 Chat Completions 请求转换、上游转发和响应逆向转换
- 已支持 `chat/completions` 的首版 SSE 流式转换，可将 Responses SSE 事件翻译为 Chat Completions SSE
- 已用 `TestClient + mock upstream stream response` 验证 `response.created / output_text.delta / completed` 到 `chat.completion.chunk` 的流式转换
- 已为 `upstream_accounts` 增加调度字段：`priority`、`last_used_at`、`last_error_at`、`last_error_code`、`consecutive_failures`、`cooldown_until`
- 已将租户内上游选择策略升级为“优先级 + 最久未使用”排序，并在转发前跳过冷却中的账号
- 已接入上游 token 过期自动禁用、`429/5xx/网络错误` 冷却摘除，以及 `401/403` 禁用处理
- 已在非流式与流式转发入口接入首版 failover，可在首个账号不可用时尝试下一个可用租户账号
- 已用真实 Alembic 迁移执行 `20260512_0003_upstream_account_scheduling`
- 已用 `TestClient + external httpx mock` 验证“过期账号自动禁用 -> 限流账号进入冷却 -> 下一健康账号接管请求”的主链路
- 已新增前端 `upstream_accounts` 资源页，支持分页读取、调度字段展示与租户映射
- 已新增前端 OAuth 接入台，支持生成 OpenAI OAuth 授权链接与手动完成账号落库
- 已为 `upstream_accounts` 资源页补齐编辑、refresh、删除操作入口
- 已将 `upstream_accounts` 接入控制台主导航与多语言文案
- 已通过 `pnpm --dir frontend build` 验证 `/{locale}/upstream-accounts` 新页面与相关组件构建通过
- 已在 `frontend/` 引入 `Auth.js`
- 已新增 `/api/auth/[...nextauth]` 路由、`/auth/signin` 登录页与 `middleware` 保护控制台路由
- 已将控制台 `/{locale}` 路由接到登录门禁，未登录访问会重定向到登录页并携带 `callbackUrl`
- 已将前端 `UserMenu` 接到真实 session，移除原本的本地假登录逻辑
- 已用浏览器验证 `http://localhost:3005/en` 会重定向到 `/auth/signin?callbackUrl=%2Fen`
- 已用浏览器验证未配置 provider 时登录页会正常渲染并提示所需环境变量

## 已知问题

- 数据库连接尚未接入更完整的 FastAPI 生命周期管理
- admin 接口仍缺更细的资源级筛选校验与更完整的字段级错误元数据
- 前端资源页仍缺排序切换、更多筛选维度与详情面板；`upstream_accounts` 目前也还没有单独的详情视图
- 当前管理页摘要卡片仍以“当前页快照”为主，尚未拆出专门的聚合统计接口
- `chat/completions` 流式兼容层目前只覆盖首批常见 Responses 事件，后续还需要补更完整的错误事件、更多 tool/reasoning 变体和断流恢复策略
- 上游账号调度已补到首版优先级与故障摘除，但仍缺粘性会话、并发占位、租户级配额联动与更细的负载均衡策略
- OAuth 登录虽然已经接通，但本地还未配置 `GitHub` / `Google` provider 凭据，因此当前只能验证门禁和登录页骨架，不能完成真实第三方授权往返
- `pnpm --dir frontend exec tsc --noEmit` 仍会受仓库现有 `.next/types` include 噪音影响；当前以 `pnpm build` 通过作为更可靠的前端验证结果

## 下一步

1. 为流式兼容层补更完整的 Responses 事件覆盖，尤其是更多 tool/reasoning 变体与错误事件
2. 继续把上游账号调度往 `sub2api` 方向推进，补粘性会话、并发占位与更细的故障恢复策略
3. 为 `upstream_accounts` 页面补更多筛选维度、排序切换与详情视图
4. 配置并验证至少一个真实 OAuth provider，完成登录回跳和 session 落地的端到端验证

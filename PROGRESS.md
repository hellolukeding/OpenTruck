# 项目进度

## 当前状态

- 已完成项目主技术选型
- 已建立 `frontend/` 与 `backend/` 基础骨架
- 已添加 `docker-compose.yml` 用于本地 `PostgreSQL + Redis`
- 已补齐 `backend/.env.example`
- 已落地 `make check`
- 已修正后端入口导入路径
- 已接入 `SQLAlchemy + Alembic` 基础结构
- 已将后端依赖管理切到 `Poetry`，并固定使用 `backend/.venv`
- 已生成 `backend/poetry.lock`，并验证 `poetry install` 与 `poetry run uvicorn --version` 可正常工作
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
- 已为网关补充 JWT Bearer 鉴权，支持基于 `tenant_id + api_key_id` 的签名 token 校验
- 已新增 `POST /admin/api-keys/{id}/issue-jwt`，可从现有 API Key 签发首版网关 JWT
- 已通过真实后端冒烟验证 `issue-jwt -> Authorization: Bearer <jwt> -> GET /v1/models` 链路可用，并会正常回写 `api_key.last_used_at`
- 已新增首版网关执行层，可将 `/v1/responses`、`/responses` 与 `/backend-api/codex/responses` 转发到租户自己的 `OpenAI OAuth` 上游账号
- 已将 `/v1/models` 接入租户 API Key 鉴权，并返回当前租户可见的基础模型信息
- 已用 `TestClient + external httpx mock` 验证 `Bearer API Key -> tenant -> upstream account -> Codex responses` 真实转发链路
- 已为 `/v1/responses` 与 `/responses` 接入首版 SSE 流式透传，可保留上游 Responses 事件原样下发
- 已为 `responses` 流式链路补 usage 记账和租户配额扣减，完成 `response.completed` 后会写入 `gateway_usage_ledger`
- 已新增首版 `chat/completions -> responses` 协议兼容层，并接入租户 OAuth 网关
- 已支持 `/v1/chat/completions` 与 `/chat/completions` 的非流式文本回复和 tool calls 回复
- 已用 `TestClient + external httpx mock` 验证 Chat Completions 请求转换、上游转发和响应逆向转换
- 已支持 `chat/completions` 的首版 SSE 流式转换，可将 Responses SSE 事件翻译为 Chat Completions SSE
- 已用 `TestClient + mock upstream stream response` 验证 `response.created / output_text.delta / completed` 到 `chat.completion.chunk` 的流式转换
- 已为 `chat/completions` 流式兼容层补充更多 Responses 事件覆盖：`response.output_item.done`、`response.function_call_arguments.done`、`response.reasoning_summary_text.done`
- 已继续扩展 `chat/completions` 流式兼容层，新增 `response.output_text.done` 与 `response.refusal.delta/done` 支持
- 已继续扩展 `chat/completions` 流式兼容层，支持从 `response.output_item.added/done` 中提取 `message.refusal` 与 `reasoning.summary`
- 已继续扩展 `chat/completions` 流式兼容层，支持 `response.failed` 在无正文输出时回填错误消息，并补齐 `response.cancelled/canceled` 终态兼容
- 已继续补强 `responses stream` 与 `chat/completions stream` 的断流处理：缺少 terminal event 时会补可读失败终态，并按失败/不完整请求记账，而不再误记为成功
- 已继续收紧 `responses stream` 终态语义：断流兜底保留 `response.failed` 失败事件，但不再额外注入 `[DONE]`；`response.failed` 的 ledger 错误码也会细化到 `safety_error` 级别
- 已继续补齐 `response.failed` 错误提取兼容：现在会优先读取 `response.error.*`，再回退到顶层 `error.*`
- 已继续补齐流式 usage 采集：`response.in_progress` 中提前出现的 usage 现在也会被 `responses` 与 `chat/completions` 两条流式链路纳入状态和失败账目
- 已继续补齐 `message output_item` 混合场景：若前面已通过 delta 输出文本，后续 `output_item.done` 仍可补回遗漏的 refusal，而不会重复文本
- 已将非流式 `responses -> chat/completions` 的 refusal 与 `content_filter` finish reason 对齐到流式行为
- 已修正流式工具参数映射逻辑，未匹配到 `output_index` 时不再错误写入默认工具槽位
- 已支持在缺少 delta 事件时，从 `message/function_call/reasoning` 的 done 事件回填 Chat Completions chunk
- 已将 `response.incomplete` 的 `content_filter` 原因映射为 `finish_reason=content_filter`
- 已用 mocked upstream SSE 验证 `reasoning done -> function_call done -> completed` 的整条 `/v1/chat/completions` 流式网关链路
- 已用本地冒烟验证 `output_text.done` 可回填文本，`refusal.done + content_filter` 可回填 refusal 并给出正确 `finish_reason`
- 已用本地冒烟验证 `output_item` 级别的 `message.refusal` 与 `reasoning.summary` 也能回填为 Chat Completions chunk
- 已用本地冒烟验证 `response.failed` 会回填 refusal，`safety_error` 会给出 `content_filter`，`response.cancelled` 会生成可读终态 chunk
- 已用本地冒烟验证“无输出断流”和“已输出部分内容后断流”都会生成明确终态，且 ledger 记录为 `upstream_missing_terminal_event`
- 已用本地冒烟验证 `responses` 断流兜底不再输出 `[DONE]`，并验证 `response.failed + safety_error` 会落成 `upstream_terminal_safety_error`
- 已用本地冒烟验证 `response.failed` 即使只在 `response.error` 下携带错误信息，也能正确回填 refusal、映射 `content_filter`，并写入细化错误码
- 已用本地冒烟验证仅收到 `response.in_progress` 后断流时，两条流式链路都会把预先上报的 usage 写进 `upstream_missing_terminal_event` 账目
- 已用本地冒烟验证“先输出 text delta，后在 message output_item 中补 refusal”时不会重复文本，且 refusal 能正确回填
- 已用本地冒烟验证非流式 `responses` 含 refusal 且 `incomplete.reason=content_filter` 时，会正确生成 `message.refusal` 与 `finish_reason=content_filter`
- 已为 `upstream_accounts` 增加调度字段：`priority`、`last_used_at`、`last_error_at`、`last_error_code`、`consecutive_failures`、`cooldown_until`
- 已将租户内上游选择策略升级为“优先级 + 最久未使用”排序，并在转发前跳过冷却中的账号
- 已接入上游 token 过期自动禁用、`429/5xx/网络错误` 冷却摘除，以及 `401/403` 禁用处理
- 已在非流式与流式转发入口接入首版 failover，可在首个账号不可用时尝试下一个可用租户账号
- 已为网关接入首版会话粘性调度：带 `conversation_id/session_id` 的请求会稳定命中同一租户上游账号
- 已采用按优先级分组的稳定 hash 排序做粘性选择，并在账号失效时自然回退到下一个可用账号
- 已为上游账号接入首版进程内并发槽位控制，支持按账号限制并发请求数
- 已支持通过 `upstream_account.extra.max_parallel_requests` 覆盖单账号并发上限，默认回退到全局配置
- 已在账号并发已满时自动切换到下一个可用账号，而不是继续挤占同一上游
- 已用真实 Alembic 迁移执行 `20260512_0003_upstream_account_scheduling`
- 已用 `TestClient + external httpx mock` 验证“过期账号自动禁用 -> 限流账号进入冷却 -> 下一健康账号接管请求”的主链路
- 已用真实 gateway 请求验证同一 `conversation_id` 会持续命中同一上游账号
- 已用真实 gateway 请求验证账号 A 并发占满时，请求会自动 failover 到账号 B
- 已新增 `gateway_usage_ledger` 账表，用于记录租户网关请求的 token usage、扣减额度、上游账号与 API Key 关联
- 已为 `/v1/responses` 与 `/v1/chat/completions` 接入首版租户级配额联动：成功请求后按 usage 扣减 `quota_balance`
- 已支持在租户 `quota_balance <= 0` 时于网关入口直接返回 `402 insufficient_quota`，避免继续打上游消耗账号池
- 已通过真实 gateway 冒烟验证 `responses` 与 `chat/completions` 两条链路的“成功扣减余额 + 写 usage ledger + 余额耗尽拦截”行为
- 已通过真实 gateway 冒烟验证 `responses stream` 链路的“SSE 透传 + usage 记账 + 余额扣减”行为
- 已为网关补充首版失败请求记账：`402 insufficient_quota`、failover 后的 `502 upstream_request_failed`、以及上游直接返回的失败响应都会写入 `gateway_usage_ledger`
- 已通过真实 gateway 冒烟验证失败请求不会扣减余额，但会按 `request_kind / error_code / conversation_id` 留下失败账目
- 已新增前端 `upstream_accounts` 资源页，支持分页读取、调度字段展示与租户映射
- 已新增前端 OAuth 接入台，支持生成 OpenAI OAuth 授权链接与手动完成账号落库
- 已为 `upstream_accounts` 资源页补齐编辑、refresh、删除操作入口
- 已将 `upstream_accounts` 接入控制台主导航与多语言文案
- 已通过 `pnpm --dir frontend build` 验证 `/{locale}/upstream-accounts` 新页面与相关组件构建通过
- 已为 `upstream_accounts` 页面补充专用筛选面板，支持按租户、账号类型、平台、状态与搜索词过滤
- 已为 `upstream_accounts` 页面补充排序切换，可按优先级、最近使用、冷却结束、最近错误、Token 过期与创建时间排序
- 已为 `upstream_accounts` 行操作补充详情视图，可直接查看调度字段、OAuth 身份字段与额外元数据
- 已通过 `pnpm --dir frontend build` 与 `make check` 重新验证 `upstream_accounts` 页面增强构建通过
- 已在 `frontend/` 引入 `Auth.js`
- 已新增 `/api/auth/[...nextauth]` 路由、`/auth/signin` 登录页与 `middleware` 保护控制台路由
- 已将控制台 `/{locale}` 路由接到登录门禁，未登录访问会重定向到登录页并携带 `callbackUrl`
- 已将前端 `UserMenu` 接到真实 session，移除原本的本地假登录逻辑
- 已用浏览器验证 `http://localhost:3005/en` 会重定向到 `/auth/signin?callbackUrl=%2Fen`
- 已用浏览器验证未配置 provider 时登录页会正常渲染并提示所需环境变量
- 已将首页匿名登录入口改为可关闭弹窗，不再强制跳整页登录
- 已为 Auth.js 补上首版账号密码登录，与 OAuth 共用一套登录面板
- 已为本地开发补充默认凭据回退：`admin / opentruck-dev-password`
- 已将 operator 凭据回退扩展到本地 `localhost / 127.0.0.1 / 局域网预览`，避免 `next start` 预览时密码入口消失

## 已知问题

- 数据库连接尚未接入更完整的 FastAPI 生命周期管理
- admin 接口仍缺更细的资源级筛选校验与更完整的字段级错误元数据
- 其余前端资源页仍缺更完整的排序切换、更多筛选维度与详情面板；当前这类增强已优先补到 `upstream_accounts`
- 当前管理页摘要卡片仍以“当前页快照”为主，尚未拆出专门的聚合统计接口
- `chat/completions` 流式兼容层已覆盖更多 done/failed/canceled 事件与回填逻辑，并补了 message/refusal 混合场景；后续仍需要补更完整的错误事件、更多 tool/reasoning 变体和断流恢复策略
- `responses` 流式主链路已经可透传，并在缺少 terminal event、失败终态和 `in_progress` 预上报 usage 场景下做更明确记账；后续仍需要补更完整的断流恢复、更多 error 变体与更细的事件观测
- 上游账号调度已补到首版优先级、故障摘除、会话粘性、进程内并发占位与基础租户配额/失败记账，但仍缺跨进程/分布式并发协调、按模型或账号的精细计费与更细的负载均衡策略
- OAuth 登录虽然已经接通，但本地还未配置 `GitHub` / `Google` provider 凭据，因此当前只能验证门禁和登录页骨架，不能完成真实第三方授权往返
- 账号密码登录当前仍是首版 operator 入口，凭据来源于环境变量或本地开发回退值，尚未接入独立用户表与密码存储
- `pnpm --dir frontend exec tsc --noEmit` 仍会受仓库现有 `.next/types` include 噪音影响；当前以 `pnpm build` 通过作为更可靠的前端验证结果
- JWT 首版已可用于网关，但当前还没有单独的 JWT 撤销/黑名单机制，失效主要依赖过期时间和底层 API Key / tenant 状态校验

## 下一步

1. 为流式兼容层与 `responses stream` 主链路补更完整的 Responses 事件覆盖，尤其是更多 tool/reasoning 变体、错误事件与断流处理
2. 继续把上游账号调度往 `sub2api` 方向推进，补跨进程并发协调、精细计费策略与更细的故障恢复策略
3. 把 `upstream_accounts` 页面继续往运营后台方向补强，例如更细的状态聚合、失败原因聚合与 tenant 视角的详情串联
4. 配置并验证至少一个真实 OAuth provider，完成登录回跳和 session 落地的端到端验证
5. 为新增的 Developer Console、Model Leaderboard、Merchant Dashboard 三页补充真实后端数据接入
6. 将新增页面的多语言文案整合到 `i18n` 字典中
7. 把前端新页面的导航入口接入 `PublicNav` 或控制台侧边栏

### 2026-05-15 — 按 design 文件对齐公共页面视觉

- 已将 Pricing 页面 `<main>` 加上 `grid-bg` 背景，对齐 opentruck_8 设计
- 已将 API Docs 页面 `<main>` 加上 `grid-bg` 背景，代码面板改用 VS Code 语法着色（`#569CD6` 关键字、`#CE9178` 字符串、`#9CDCFE` 属性、`#B5CEA8` 数字），footer 补充社交图标（public、hub、terminal）
- 已从 `app/api-docs/page.tsx` 提取 `ApiDocsSidebar`、`ApiCodePanel` 到独立组件，保持文件在 300 行以内
- 已在 `globals.css` 新增 `.grid-bg` 与 `.dark .grid-bg` CSS 类
- 已将 Model Leaderboard 页头、表格、页脚完全按 opentruck_4 设计重写（自定义 emerald 主题 header、SVG 通知铃图标、用户头像、social 图标 footer）
- 已将 Leaderboard 表格中所有 `brand-*` 颜色引用替换为已有设计系统 token（`primary-container`、`primary`），消除缺失 CSS 类的渲染问题
- 已通过 `pnpm build` 验证所有变动构建通过
- 已将 Merchant Dashboard 页头从 `PublicNav` 替换为 opentruck_6 自定义 header（settings 齿轮 + oidc_5118 用户 badge + expand_more 下拉箭头）
- 已将 Developer Console 侧边栏头像从字母初始替换为 `<img>` 标签，对齐 opentruck_3 设计
- 已完成全部非首页页面 vs design 文件的逐页差异审计并修复所有不一致项
- 已新增独立公共页 `/merchant`，按 `design/opentruck_5/screen.png` 高保真还原商家中心列表页，并通过 `next start` 浏览器验收与 `pnpm build` 构建验证
- 已将首页、模型页、商家页与排行榜页顶部导航统一到新版固定头部，不再因页面或登录态切换而改变 tab 集合，仅保留当前项高亮
- 已重做 `/auth/signin` 登录页与 `SignInPanel` 布局，移除横向滑出密码面板，改为稳定的双栏外壳 + 纵向认证卡片，避免公开登录页组件溢出
- 已按 `design/loginpage` 重新收紧 `/auth/signin` 的卡片宽度、圆角、表单密度与背景氛围，并确保登录卡片在新布局中稳定居中
- 已在干净的 `next dev --port 3011` 实例上实际验收 `/auth/signin?callbackUrl=%2Fzh-CN`，确认无横向溢出且视觉结构与新设计一致
- 已将 `/auth/signin` 改成更宽的居中单卡布局，利用横向双栏压缩垂直高度，确保桌面视口下无需滚动即可完整展示
- 已将登录页主要色彩从硬编码切回设计系统 token，并实际验证亮色 / 暗色两套主题下的背景、卡片和表单视觉都能自然衔接
- 已将后台 `AdminShell` 从旧的顶栏+侧栏结构重构为 `opentruck_6` 风格的公开顶栏 + 胶囊式控制台子导航 + 轻量页脚
- 已按 `design/opentruck_6` 重做后台首页 `AdminOverview`，替换为 emerald Hero、三段核心指标和分区信息卡片流
- 已将后台资源页共用的 `ResourceTableCard` 调整为与新控制台一致的标题、统计卡和圆角表格视觉
- 已在干净的 `next dev --port 3013` 实例上实际验收 `/zh-CN` 与 `/zh-CN/api-keys`，确认新后台骨架和首页/资源页都可正常渲染
- 已将后台总览页重构为参考图同类结构：问候区、8 项概览指标、分析面板 tabs、公告流与状态卡
- 已将总览页实现拆分为 `admin-overview-analysis / admin-overview-stats / admin-overview-notices`，保持单文件可读性并控制在 300 行以内
- 已为控制台新增 `钱包 / 日志 / 工单` 三个子 tab，并补齐 `/{locale}/wallet`、`/{locale}/logs`、`/{locale}/tickets` 路由
- 已按参考图完成钱包页和日志页的高保真静态骨架，并为工单页补齐同一设计语言下的支持面板与空态
- 已将控制台顶部主导航改为与公共页面一致的左侧对齐布局，切换到控制台时不再改变导航起始位置
- 已新增 `payment_orders`、`wallet_ledger`、`support_tickets` 三张后端业务表，并补齐 Alembic 迁移 `20260515_0005_wallet_and_support`
- 已新增 `/admin/dashboard`、`/admin/logs`、`/admin/wallet`、`/admin/tickets` 四组首版后端接口，为总览统计、日志查询、钱包概览/充值单和工单流转提供数据骨架
- 已将新后端模块接入 `make check` 的校验清单，并实际执行 `alembic upgrade head` 验证本地 PostgreSQL 可成功落表
- 已新增 `frontend/lib/admin-console-api.ts`，将总览、钱包、日志、工单四类控制台数据读取从旧 admin 资源接口中拆分
- 已将控制台总览页接入 `/admin/dashboard` 真实统计，并将分析图切到真实近 7 日 usage 趋势数据
- 已将钱包、日志、工单页面接入真实后端取数，改为展示最近订单、账本记录、usage 日志和工单列表，不再只是静态空壳
- 已将钱包历史卡片拆分到独立组件，继续保持前端单文件不超过 300 行
- 已新增 `frontend/lib/admin-console-actions.ts`，打通钱包页创建充值单与手动入账的服务端 action
- 已为日志页新增 URL 驱动的筛选与分页参数，支持按搜索词、模型、请求类型和状态过滤 usage 日志
- 已为控制台总览、钱包、日志、工单页补充后端取数容错，接口临时失败时页面会退回空数据而不是直接 500

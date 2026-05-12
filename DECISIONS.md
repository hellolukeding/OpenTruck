# 设计决策

## 2026-05-11

- 前端技术栈定为 `Next.js + TypeScript`
- 后端技术栈定为 `Python + FastAPI`
- 本地开发模式采用混合方案:
  - `frontend/` 直接在宿主机运行
  - `backend/` 直接在宿主机运行
  - `PostgreSQL` 和 `Redis` 通过 Docker Compose 运行
- 参考项目统一放在 `repo/` 目录下，不与主项目代码混放
- 仓库根目录保留 `Makefile`，并用 `make check` 作为基础一致性检查入口
- ORM 定为 `SQLAlchemy 2`
- 数据库迁移工具定为 `Alembic`
- 首批核心表先围绕网关最小闭环落地:
  - `tenants`
  - `api_keys`
  - `nodes`
  - `node_models`
- `api_keys` 在数据库中只存 `raw_key` 的 `SHA-256` 哈希，不存明文
- 首批管理面接口先提供创建与列表，优先打通完整主链路，再补更新删除
- 管理面错误响应统一为 `{ "error": { "code": "...", "message": "..." } }`
- 前端管理台先采用服务端取数模式直接读取 FastAPI admin 接口
- 前端读取后端的目标地址通过 `BACKEND_BASE_URL` 控制，默认回退到 `http://127.0.0.1:8000`
- 前端 UI 基础层采用 `shadcn/ui` 风格组件
- 前端默认提供 `en` 与 `zh-CN` 两种语言
- 前端视觉方向切为接近 OpenAI 的黑白中性色，而不是暖色运营风
- 前端包管理与本地运行链路统一使用 `pnpm`
- admin 列表接口的查询约定参考 `sub2api`，统一采用 `page`、`page_size`、`sort_by`、`sort_order`，并按资源补充 `status`、`search` 等筛选参数
- admin 列表接口的返回结构统一为 `{ items, pagination }`，前端数据层暂时保持对旧数组返回的兼容读取

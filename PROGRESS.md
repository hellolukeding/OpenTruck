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

## 已知问题

- 后端依赖尚未在当前机器完成安装验证
- Alembic 迁移尚未在真实 PostgreSQL 容器上执行验证
- 数据库连接目前只完成基础会话层，尚未接入 FastAPI 生命周期或依赖注入
- 前端仍是展示型首页，尚未进入管理后台实现

## 下一步

1. 启动 Docker 中的 PostgreSQL / Redis 并实际验证 Alembic 迁移
2. 在 FastAPI 中接入数据库会话依赖和健康检查
3. 实现 `tenants`、`api_keys`、`nodes`、`node_models` 的基础 CRUD
4. 为 `frontend/` 搭一个基础管理台框架

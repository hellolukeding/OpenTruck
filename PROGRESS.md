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

## 已知问题

- 后端依赖尚未在当前机器完成安装验证
- 数据库连接尚未接入更完整的 FastAPI 生命周期管理
- admin 接口还没有分页、过滤、统一校验规则与更细粒度错误分类
- 前端仍是展示型首页，尚未进入管理后台实现

## 下一步

1. 为 admin 接口补充分页、过滤和查询参数规范
2. 引入更完整的请求校验与数据库异常映射
3. 为 `frontend/` 搭一个基础管理台框架
4. 开始把前端接到真实 admin API

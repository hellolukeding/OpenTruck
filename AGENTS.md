<claude-mem-context>
# Memory Context

# [OpenTruck] recent context, 2026-05-12 1:58pm GMT+8

No previous sessions found.
</claude-mem-context>```

## 每次会话开始时（上班打卡）

1. 读 PROGRESS.md 了解当前状态
2. 读 DECISIONS.md 了解重要决策
3. 跑 make check 确认仓库处于一致状态
4. 从 PROGRESS.md 的"下一步"部分继续工作

## 每次会话结束前（下班打卡）

1. 更新 PROGRESS.md
2. 跑 make check 确认一致状态
3. 提交所有已完成的工作

## 项目目标

本项目需要重点参考sub2api的设计和代码，本项目的目标是构建一款社区共建的多租户的开源ai中转站

## 代码规范

- 前端每个代码文件不得超过300行，超过300行的需要创建新文件，保证代码的可读性

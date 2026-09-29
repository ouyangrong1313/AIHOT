// 可选模块。这两个模块是 AIHOT 针对 AI 行业做的，安防行业都用不到，全部关掉。
// 关掉以后：导航里不再出现入口，对应的定时任务不再运行，页面与接口返回 404。

export const FEATURES = {
  /** 模型榜：汇总公开评测，按公开方法 v15 计算共识排名（/leaderboard）。安防行业不需要。 */
  leaderboard: false,
  /** Codex 重置监控：盯 OpenAI Codex 负责人在 X 上的额度重置公告（/codex-reset）。安防行业不需要。 */
  codexResetMonitor: false,
} as const;

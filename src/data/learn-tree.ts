// 学习路径数据结构
// 后续内容填入后，slug 指向实际页面路径

export interface DayItem {
  day: number;         // Day 1-30
  title: string;        // 标题
  slug: string;        // 页面 slug
  status: 'done' | 'current' | 'locked' | 'pending';
}

export interface WeekItem {
  week: number;        // Week 1-5
  title: string;        // 周标题
  days: DayItem[];
}

export const LEARN_TREE: WeekItem[] = [
  {
    week: 1,
    title: 'Week 1 · Python 数据处理',
    days: [
      { day: 1, title: 'Day 1 · 变量、数据类型、列表与字典', slug: '', status: 'pending' },
      { day: 2, title: 'Day 2 · NumPy 向量化思维', slug: '', status: 'pending' },
      { day: 3, title: 'Day 3 · NumPy 进阶 + 小练习', slug: '', status: 'pending' },
      { day: 4, title: 'Day 4 · Pandas 数据读取与探索', slug: '', status: 'pending' },
      { day: 5, title: 'Day 5 · Pandas 数据清洗', slug: '', status: 'pending' },
      { day: 6, title: 'Day 6 · 分组聚合 + 可视化', slug: '', status: 'pending' },
      { day: 7, title: 'Day 7 · 统计学核心回顾', slug: '', status: 'pending' },
    ],
  },
  {
    week: 2,
    title: 'Week 2 · 机器学习核心概念',
    days: [
      { day: 8, title: 'Day 8 · 机器学习全景图', slug: '/blog/2026-06-03-learn-day08-ml-overview', status: 'done' },
      { day: 9, title: 'Day 9 · 线性回归', slug: '/blog/2026-06-04-learn-day09-linear-regression', status: 'done' },
      { day: 10, title: 'Day 10 · 逻辑回归与分类', slug: '/blog/2026-06-05-learn-day10-logistic-regression', status: 'done' },
      { day: 11, title: 'Day 11 · 决策树与随机森林', slug: '/blog/2026-06-06-learn-day11-decision-tree', status: 'done' },
      { day: 12, title: 'Day 12 · 无监督学习', slug: '/blog/2026-06-07-learn-day12-unsupervised-learning', status: 'done' },
      { day: 13, title: 'Day 13 · 模型评估与调优', slug: '/blog/2026-06-08-learn-day13-model-evaluation', status: 'done' },
      { day: 14, title: 'Day 14 · 正则化与特征工程', slug: '/blog/2026-06-09-learn-day14-regularization', status: 'current' },
    ],
  },
  {
    week: 3,
    title: 'Week 3 · 深度学习理论',
    days: [
      { day: 15, title: 'Day 15 · 神经网络基础', slug: '', status: 'pending' },
      { day: 16, title: 'Day 16 · 激活函数与损失函数', slug: '', status: 'pending' },
      { day: 17, title: 'Day 17 · 反向传播原理', slug: '', status: 'pending' },
      { day: 18, title: 'Day 18 · 优化器与学习率', slug: '', status: 'pending' },
      { day: 19, title: 'Day 19 · CNN 卷积网络', slug: '', status: 'pending' },
      { day: 20, title: 'Day 20 · RNN/LSTM 序列模型', slug: '', status: 'pending' },
      { day: 21, title: 'Day 21 · Attention 机制', slug: '', status: 'pending' },
    ],
  },
  {
    week: 4,
    title: 'Week 4 · PyTorch 框架入门',
    days: [
      { day: 22, title: 'Day 22 · PyTorch 张量', slug: '', status: 'pending' },
      { day: 23, title: 'Day 23 · 自动微分 Autograd', slug: '', status: 'pending' },
      { day: 24, title: 'Day 24 · 数据集与数据加载', slug: '', status: 'pending' },
      { day: 25, title: 'Day 25 · 模型定义与训练循环', slug: '', status: 'pending' },
      { day: 26, title: 'Day 26 · 迁移学习与 Fine-tuning', slug: '', status: 'pending' },
      { day: 27, title: 'Day 27 · Hugging Face Transformers', slug: '', status: 'pending' },
      { day: 28, title: 'Day 28 · 综合实战', slug: '', status: 'pending' },
    ],
  },
  {
    week: 5,
    title: 'Week 5 · 查漏补缺',
    days: [
      { day: 29, title: 'Day 29 · 薄弱环节强化', slug: '', status: 'pending' },
      { day: 30, title: 'Day 30 · 30 天总结', slug: '', status: 'pending' },
    ],
  },
];

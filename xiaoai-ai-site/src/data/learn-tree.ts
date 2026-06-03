// 学习路径数据结构
// 后续内容填入后，slug 指向实际页面路径

export interface DayItem {
  day: number;         // Day 1-70
  title: string;        // 标题
  slug: string;        // 页面 slug
  status: 'done' | 'current' | 'locked' | 'pending';
}

export interface WeekItem {
  week: number;        // Week 1-10
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
      { day: 14, title: 'Day 14 · 正则化与特征工程', slug: '/blog/2026-06-09-learn-day14-regularization', status: 'done' },
    ],
  },
  {
    week: 3,
    title: 'Week 3 · 深度学习理论',
    days: [
      { day: 15, title: 'Day 15 · 神经网络基础', slug: '/blog/2026-06-10-learn-day15-neural-network', status: 'done' },
      { day: 16, title: 'Day 16 · 激活函数与损失函数', slug: '/blog/2026-06-11-learn-day16-activation-loss', status: 'done' },
      { day: 17, title: 'Day 17 · 反向传播原理', slug: '/blog/2026-06-12-learn-day17-backpropagation', status: 'done' },
      { day: 18, title: 'Day 18 · 优化器与学习率', slug: '/blog/2026-06-13-learn-day18-optimizers', status: 'done' },
      { day: 19, title: 'Day 19 · CNN 卷积网络', slug: '/blog/2026-06-14-learn-day19-cnn', status: 'done' },
      { day: 20, title: 'Day 20 · RNN/LSTM 序列模型', slug: '/blog/2026-06-15-learn-day20-rnn-lstm', status: 'done' },
      { day: 21, title: 'Day 21 · Attention 机制', slug: '/blog/2026-06-16-learn-day21-attention', status: 'done' },
    ],
  },
  {
    week: 4,
    title: 'Week 4 · PyTorch 框架入门',
    days: [
      { day: 22, title: 'Day 22 · PyTorch 张量', slug: '/blog/2026-06-17-learn-day22-pytorch-tensors', status: 'done' },
      { day: 23, title: 'Day 23 · 自动微分 Autograd', slug: '/blog/2026-06-18-learn-day23-autograd', status: 'done' },
      { day: 24, title: 'Day 24 · 数据集与数据加载', slug: '/blog/2026-06-19-learn-day24-data-loader', status: 'done' },
      { day: 25, title: 'Day 25 · 模型定义与训练循环', slug: '/blog/2026-06-20-learn-day25-training-loop', status: 'done' },
      { day: 26, title: 'Day 26 · 迁移学习与 Fine-tuning', slug: '/blog/2026-06-21-learn-day26-transfer-learning', status: 'done' },
      { day: 27, title: 'Day 27 · Hugging Face Transformers', slug: '/blog/2026-06-22-learn-day27-huggingface', status: 'done' },
      { day: 28, title: 'Day 28 · 综合实战', slug: '/blog/2026-06-23-learn-day28-comprehensive-project', status: 'done' },
    ],
  },
  {
    week: 5,
    title: 'Week 5 · 深度学习进阶应用',
    days: [
      { day: 29, title: 'Day 29 · 现代 CNN 架构', slug: '/blog/2026-06-24-learn-day29-modern-cnn-architectures', status: 'current' },
      { day: 30, title: 'Day 30 · 目标检测', slug: '/blog/2026-06-25-learn-day30-object-detection', status: 'pending' },
      { day: 31, title: 'Day 31 · 语义分割', slug: '/blog/2026-06-26-learn-day31-semantic-segmentation', status: 'pending' },
      { day: 32, title: 'Day 32 · 模型部署', slug: '/blog/2026-06-27-learn-day32-model-deployment', status: 'pending' },
      { day: 33, title: 'Day 33 · GAN 与 Diffusion', slug: '/blog/2026-06-28-learn-day33-gans-and-diffusion', status: 'pending' },
      { day: 34, title: 'Day 34 · 大语言模型基础', slug: '/blog/2026-06-29-learn-day34-llm-fundamentals', status: 'pending' },
      { day: 35, title: 'Day 35 · 多模态与总结', slug: '/blog/2026-06-30-learn-day35-multimodal-and-summary', status: 'pending' },
    ],
  },
];

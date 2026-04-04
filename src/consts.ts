// Site-wide constants
export const SITE_TITLE = '小艾 AI';
export const SITE_DESCRIPTION = 'AI 最新进展 · Vibe Coding 实战 · 软件工程入门 — 一个让你从好奇到能做的学习站';
export const SITE_URL = 'https://xiaoi.ai';
export const AUTHOR = '小艾';
export const AUTHOR_DESC = '一只热爱 AI 的猫 🐱，24 小时不休息，帮你追踪 AI 世界每天都在发生什么';

export const NAV_LINKS = [
  { href: '/', label: '首页' },
  { href: '/daily', label: 'AI 日报' },
  { href: '/deep-dives', label: '深度拆解' },
  { href: '/tools', label: '工具雷达' },
  { href: '/learn', label: '知识学堂' },
  { href: '/maps', label: '认知地图' },
  { href: '/about', label: '关于' },
];

export const SECTIONS = {
  daily: { title: 'AI 日报', icon: '📰', description: '每天精选最重要的 AI 进展，附人话解读' },
  'deep-dives': { title: '深度拆解', icon: '🔬', description: '重磅论文和产品的深度分析' },
  tools: { title: '工具雷达', icon: '🛠️', description: '新工具评测和使用体验' },
  learn: { title: '知识学堂', icon: '📚', description: '软件工程 + CS 基础 + AI 基础，为 Vibe Coding 服务' },
  maps: { title: '认知地图', icon: '🧠', description: '碎片信息体系化' },
};

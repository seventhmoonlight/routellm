import React from 'react';
import { NavigationTab } from '../types';
import { 
  BookOpen, 
  Sliders, 
  Cpu, 
  BarChart3, 
  GitBranch, 
  Bookmark, 
  HelpCircle,
  Sparkles,
  Layers
} from 'lucide-react';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'guide', label: '白话导读 (核心通识)', icon: BookOpen },
    { id: 'workflow', label: '全景流程与Loss定位 (宏观到微观)', icon: GitBranch },
    { id: 'routers', label: '四大路由器 (架构·公式·代码)', icon: Cpu },
    { id: 'simulator', label: '决策沙盘 (实时试跑)', icon: Sliders },
    { id: 'metrics', label: '指标与损失 (计算实验室)', icon: BarChart3 },
    { id: 'pipeline', label: '数据与路线图 (落地方案)', icon: Layers },
    { id: 'jargon', label: '黑话白话词典 (避坑指南)', icon: Bookmark },
    { id: 'faq', label: '疑难答疑 (精选十问)', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur-md border-b border-amber-900/30 text-stone-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('guide')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-amber-100 font-serif">
                  服饰考证·核验路由方案
                </span>
                <span className="text-[11px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> 交互透彻版
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                将学术论文级稠密方案 · 转化为看得懂、能交互、可复现的完整指南
              </p>
            </div>
          </div>

          {/* Core Status indicator badge */}
          <div className="hidden lg:flex items-center space-x-2 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700/60 text-xs text-stone-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>核心命题：<b>整图核验后，到底值不值得追加局部特写？</b></span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-stone-800/80 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25 font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-amber-400/80'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

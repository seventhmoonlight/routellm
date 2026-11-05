import React, { useState } from 'react';
import { JARGON_LIST } from '../data/jargon';
import { JargonTerm } from '../types';
import { 
  Bookmark, 
  Search, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';

export const JargonDictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'math' | 'data' | 'system'>('all');

  const filteredJargon = JARGON_LIST.filter(item => {
    const matchesSearch = 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plainChinese.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.realWorldAnalogy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Bookmark className="w-3.5 h-3.5" />
            <span>避坑指南 · 方案黑话秒懂词典</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            GPT 方案里的学术黑话，翻译成人话是什么？
          </h2>
          <p className="mt-2 text-stone-300 text-sm sm:text-base leading-relaxed">
            方案中大量充斥着“共同成本”、“状态泄露”、“归属约束”、“PGR”等专业词汇。很多时候你不是看不懂思想，而是被这些学术包装的黑话唬住了。查阅下方对照表，秒懂每个概念！
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="搜索任何术语，如：共同成本、PGR、状态泄露、弱监督..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-all"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: '全部' },
              { id: 'core', label: '核心决策' },
              { id: 'math', label: '数学与指标' },
              { id: 'data', label: '数据与监督' },
              { id: 'system', label: '系统与归属' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-stone-950 font-bold shadow'
                    : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jargon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJargon.map((jargon, index) => (
          <div 
            key={index}
            className="bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 space-y-3.5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                  {jargon.category === 'core' ? '核心概念' :
                   jargon.category === 'math' ? '数学指标' :
                   jargon.category === 'data' ? '数据真值' : '系统架构'}
                </span>
                <span className="text-[10px] text-amber-400/80 font-mono">术语 #0{index + 1}</span>
              </div>

              <h3 className="text-base font-bold text-white font-serif mt-2">
                {jargon.term}
              </h3>

              {/* One Sentence Plain Chinese */}
              <div className="mt-2 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-xs text-amber-200 font-semibold leading-relaxed">
                🗣️ 大白话精髓：{jargon.plainChinese}
              </div>

              {/* Real World Analogy */}
              <div className="mt-2.5 text-xs text-stone-300 leading-relaxed bg-stone-950/70 p-3 rounded-xl border border-stone-800/80">
                <span className="font-bold text-emerald-400 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> 现实生动比喻：
                </span>
                {jargon.realWorldAnalogy}
              </div>

              {/* Original Quote */}
              <div className="mt-2.5 text-[11px] text-stone-400 italic bg-stone-950/40 p-2 rounded-lg border border-stone-800/60 font-serif">
                方案原文：“{jargon.originalContext}”
              </div>
            </div>

            {/* Pitfall Warning */}
            <div className="pt-2 border-t border-stone-800/80 text-[11px] text-rose-300/90 flex items-start gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span><b>答辩警示：</b>{jargon.pitfallWarning}</span>
            </div>
          </div>
        ))}

        {filteredJargon.length === 0 && (
          <div className="col-span-full py-12 text-center text-stone-400 text-sm">
            没有找到与 “{searchTerm}” 相关的术语，请尝试换一个关键词搜索。
          </div>
        )}
      </div>
    </div>
  );
};

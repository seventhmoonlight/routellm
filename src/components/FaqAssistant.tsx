import React, { useState } from 'react';
import { FAQ_LIST, FAQItem } from '../data/faq';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  MessageSquare, 
  BookOpen, 
  Send, 
  FileText,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const FaqAssistant: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(FAQ_LIST[0].id);
  const [userQuery, setUserQuery] = useState('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setIsThinking(true);
    // Instant smart grounding based on proposal
    setTimeout(() => {
      const q = userQuery.toLowerCase();
      let ans = '';

      if (q.includes('bert') || q.includes('多模态') || q.includes('图像')) {
        ans = `【针对 BERT 与多模态特征的建议】
方案第 6.2 与 8 节明确指出：
1. 演进路线：先做纯“问题文本 BERT”，再做“状态文本 BERT（包含整图观察和遮挡）”，最后再接入“图像特征（如 CLIP 向量）”。
2. 科学价值：只有当“状态文本”比“纯问题”好，且“图文多模态”比“纯文本”进一步提升时，你才能在论文里宣称“视觉特征在路由决策中提供了不可替代的物理增量”！
3. 警惕口癖：一定要做脱敏实验，防止 BERT 学到上游 VLM 的口头禅（如“无法看清”）。`;
      } else if (q.includes('q1') || q.includes('变差') || q.includes('负收益') || q.includes('致盲')) {
        ans = `【当局部核验 Q1 反而比整图 Q0 还差怎么办？】
方案第 11.3 节有专门预警：
1. 本项目局部并不保证绝对更强！当古籍剥蚀残损、或人物重叠张冠李戴时，放大局部反而会引起幻觉，导致 Q1 < Q0。
2. 此时 PGR 指标的分母为负，原有的“恢复强弱模型差距”解释失效。
3. 解决方案：转而报告“相同成本下的质量 (Quality at Fixed Cost)”与“避免假阳性率”，重点强调路由器成功识别并拦截了这些致盲陷阱题！`;
      } else if (q.includes('数据') || q.includes('标注') || q.includes('人工') || q.includes('启动')) {
        ans = `【关于数据标注与冷启动】
方案第 9.4 节明确说：人工标注绝不是开工门槛！
1. 启动规模：先用脚本全自动跑 100~200 个状态样本（双路径都跑一遍，记录真实 API 账单和延迟）。
2. 三层参照：将专家考证（强监督）、古籍原版图文对应（证据监督）和多模型投票（弱监督）区分开。
3. 未知也是宝：对于真无法辨别的样本，保存为 null 或未知，绝对不要为了图省事强行标注为 0 或 1。`;
      } else {
        ans = `【针对你所提问题的系统解答】
根据 2026-11-05 实验方案的设计准则：
1. 核心宗旨：系统不是凭空画图，而是从文献中检索原图并严格核验；
2. 核心权衡：在整图已经看完的前提下，仅比较追加局部核验的边际成本与质量收益（Δ - λ·Cost）；
3. 决策底线：严格防范状态泄露（不能用未来局部信息做输入），严防“错误接受不符图片”（假阳性扣 2 分），并允许保留科学的“未知 (Unknown)”状态！
如果你在具体实验环节有更细致的困惑，随时可以在本平台查阅对应章节的算盘推演。`;
      }

      setCustomAnswer(ans);
      setIsThinking(false);
    }, 400);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>彻底扫清疑虑 · 方案答疑专区</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            核心六大灵魂拷问与智能问答
          </h2>
          <p className="mt-2 text-stone-300 text-sm sm:text-base leading-relaxed">
            这里汇集了任何人读完这篇方案后最容易产生的深层困惑。点击展开查看详细推导，也可在底部输入你的个性化追问！
          </p>
        </div>
      </div>

      {/* Preset FAQ Accordion */}
      <div className="space-y-4">
        {FAQ_LIST.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <div 
              key={faq.id}
              className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden transition-all shadow-md"
            >
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-stone-850 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                    ?
                  </span>
                  <div>
                    <h3 className="font-bold text-stone-100 text-sm sm:text-base">
                      {faq.question}
                    </h3>
                    <p className="text-xs text-amber-300/90 font-medium mt-1">
                      ⚡ 一句话答复：{faq.shortAnswer}
                    </p>
                  </div>
                </div>
                <div className="text-stone-400 mt-1 shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-5 pt-0 border-t border-stone-800/80 bg-stone-950/60 space-y-4 text-xs leading-relaxed text-stone-300">
                  <div className="whitespace-pre-line pt-4 text-stone-200">
                    {faq.detailedExplanation}
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 font-serif italic text-stone-400 text-[11px]">
                    <span className="text-amber-400 not-italic font-bold block mb-1">
                      📜 方案原文对应表述：
                    </span>
                    {faq.gptProposalQuote}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Custom Query Box */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-amber-400 text-sm font-semibold">
          <MessageSquare className="w-4 h-4" />
          <span>还有没弄懂的地方？在这里直接提问</span>
        </div>
        <p className="text-xs text-stone-400">
          例如：“如果我想加入图像特征该怎么写？”、“为什么不能靠服装外形断代？”、“如何防止整图模型瞎编？”
        </p>

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            placeholder="输入你对方案的疑问..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-all"
          />
          <button
            type="submit"
            disabled={isThinking || !userQuery.trim()}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5"
          >
            <span>解读</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {isThinking && (
          <div className="text-xs text-amber-400 flex items-center gap-2 py-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>正在检索方案 14 个章节的理论边界并组织白话解答...</span>
          </div>
        )}

        {customAnswer && (
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 mt-4 text-xs text-stone-200">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 方案深度拆解回复：
            </div>
            <div className="whitespace-pre-line leading-relaxed text-stone-300">
              {customAnswer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

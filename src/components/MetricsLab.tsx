import React, { useState } from 'react';
import { 
  BarChart3, 
  HelpCircle, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  TrendingUp,
  Percent,
  Calculator,
  Sparkles
} from 'lucide-react';

export const MetricsLab: React.FC = () => {
  // Sliders for PGR calculation
  const [q0, setQ0] = useState<number>(70); // Full image only quality %
  const [q1, setQ1] = useState<number>(80); // Full + Local crop quality %
  const [qr, setQr] = useState<number>(78); // Router quality %
  const [callRate, setCallRate] = useState<number>(38); // % of samples routed to local check

  // Calculate PGR
  const gap = q1 - q0;
  let pgr = 0;
  let pgrStatus: 'normal' | 'super' | 'invalid' = 'normal';

  if (gap === 0) {
    pgrStatus = 'invalid';
  } else {
    pgr = (qr - q0) / gap;
    if (pgr > 1.0) pgrStatus = 'super';
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>方案第 10、11 节核心数学公式实操</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            指标与损失函数实验室：算明白 PGR 与 惩罚规则
          </h2>
          <p className="mt-2 text-stone-300 text-sm sm:text-base leading-relaxed">
            方案中最容易让外行懵圈的就是：<b>“PGR明明等于 0.8，为什么作者一再警告不能说准确率 80%？”</b>以及<b>“为什么错误接受要被狠扣 2 分？”</b>。在这里动手拨动滑块，一目了然！
          </p>
        </div>
      </div>

      {/* Interactive PGR Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-400" />
              PGR (性能差距恢复比) 交互算盘
            </h3>
            <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
              PGR = (Q_r - Q_0) / (Q_1 - Q_0)
            </span>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {/* Q0 */}
            <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300 font-medium">Q0 (仅保留整图核验质量，0额外开销)：</span>
                <span className="font-mono text-stone-200 font-bold">{q0}%</span>
              </div>
              <input 
                type="range" min="40" max="95" value={q0} 
                onChange={(e) => setQ0(parseInt(e.target.value))} 
                className="w-full accent-stone-400 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Q1 */}
            <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300 font-medium">Q1 (全部追加局部特写质量，100%全额开销)：</span>
                <span className="font-mono text-emerald-400 font-bold">{q1}%</span>
              </div>
              <input 
                type="range" min="40" max="95" value={q1} 
                onChange={(e) => setQ1(parseInt(e.target.value))} 
                className="w-full accent-emerald-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Qr */}
            <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300 font-medium">Qr (你的智能路由器质量)：</span>
                <span className="font-mono text-amber-400 font-bold">{qr}%</span>
              </div>
              <input 
                type="range" min="40" max="95" value={qr} 
                onChange={(e) => setQr(parseInt(e.target.value))} 
                className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Call rate */}
            <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-300 font-medium">真实局部调用比例 (你实际花了多少预算)：</span>
                <span className="font-mono text-blue-400 font-bold">{callRate}%</span>
              </div>
              <input 
                type="range" min="5" max="100" value={callRate} 
                onChange={(e) => setCallRate(parseInt(e.target.value))} 
                className="w-full accent-blue-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Visual Progress Bar of Gap Recovered */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-stone-400">提分空间图示：</span>
              <span className="text-stone-300">
                基准 Q0 ({q0}%) ──── 理论天花板 Q1 ({q1}%) [总差距: {gap}%]
              </span>
            </div>

            {/* Gap bar */}
            <div className="h-4 bg-stone-800 rounded-full overflow-hidden relative border border-stone-700">
              {pgrStatus !== 'invalid' && gap > 0 && (
                <div 
                  className={`h-full transition-all duration-300 rounded-full ${
                    pgr > 1.0 ? 'bg-gradient-to-r from-amber-500 to-emerald-400' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(Math.max(pgr * 100, 0), 100)}%` }}
                />
              )}
            </div>

            <div className="flex justify-between text-[11px] text-stone-400 font-mono">
              <span>0% (无任何改善)</span>
              <span>50%</span>
              <span>100% (完美达成全局部质量)</span>
            </div>
          </div>
        </div>

        {/* PGR Result & Interpretation */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
              计算结果判定
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-mono text-amber-300">
                {pgrStatus === 'invalid' ? 'N/A' : (pgr * 100).toFixed(1) + '%'}
              </span>
              <span className="text-xs text-stone-400">
                PGR 恢复度 (Gap Recovered)
              </span>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3 text-xs leading-relaxed text-stone-300">
              {pgrStatus === 'invalid' ? (
                <div className="text-amber-400 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>
                    <b>无法计算！</b> 当全局部质量 Q1 等于整图质量 Q0 时，分母为 0。方案第 11.3 节强调：此时不要盲目套用 PGR 指标。
                  </span>
                </div>
              ) : pgr > 1.0 ? (
                <div className="text-emerald-300 flex items-start gap-2">
                  <Sparkles className="w-5 h-5 shrink-0 text-emerald-400" />
                  <span>
                    <b>神级表现 (PGR &gt; 100%)！</b> 你的路由器质量 ({qr}%) 甚至超过了全做局部 ({q1}%)！这是因为路由器聪明地避开了那些“古画霉斑致盲”的陷阱题，达成了 1+1 &gt; 2 的互补奇迹！方案特别规定：必须如实报告，严禁截断成 100%。
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-emerald-400 font-bold">高性价比结论：</span>
                  你只动用了 <b className="text-blue-300">{callRate}%</b> 的局部调用开销，就挽回了昂贵土豪方案 <b className="text-amber-300">{(pgr * 100).toFixed(1)}%</b> 的提分差距！这就是 RouteLLM 思想在多模态视觉工程中的巨大商业与学术价值！
                </div>
              )}
            </div>

            {/* CPT 80% Explanation */}
            <div className="mt-4 p-3 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-blue-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-blue-300">
                <Info className="w-3.5 h-3.5" /> 什么是 CPT(80%)？
              </div>
              <p className="text-[11px] leading-relaxed text-stone-300">
                达到 80% 的差距恢复，最少需要付出多少比例的调用？如果你的曲线在调用达到 <b>{callRate}%</b> 时就突破了 80% 的 PGR，那么 CPT(80%) 就是 <b>{callRate}%</b>。
              </p>
            </div>
          </div>

          <div className="text-[11px] text-stone-500 border-t border-stone-800 pt-3">
            ⚠️ 牢记方案金句：PGR 是差距恢复率，千万别在答辩 PPT 里误写成准确率！
          </div>
        </div>
      </div>

      {/* Loss Function & Consequence Table (Section 10) */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-amber-400 text-sm font-semibold uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>方案第 10 节惩罚机制透析</span>
          </div>
          <h3 className="text-xl font-bold text-white font-serif mt-1">
            为什么“错误接受”要扣 2 分？任务后果损失值 (Loss) 详解
          </h3>
          <p className="text-xs text-stone-400 mt-2 leading-relaxed">
            服饰古籍文献考证绝非简单的二分类。在严肃历史考订中，<b>收录一张假图的学术灾难，远远大于漏掉一张真图！</b>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">判断完全正确</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">损失 = 0</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              该符合的支持、该不符的冲突。系统给出了无可辩驳的证据链。
            </p>
          </div>

          <div className="bg-rose-950/20 p-4 rounded-xl border border-rose-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400">错误接受（致命假阳性）</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">损失 = 2.0</span>
            </div>
            <p className="text-rose-200/80 leading-relaxed text-[11px]">
              把明代衣服当成宋代、把侍女立领当成主母。这是学术造假级暴雷，惩罚最重！
            </p>
          </div>

          <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400">错误拒绝（遗珠假阴性）</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">损失 = 1.0</span>
            </div>
            <p className="text-amber-200/80 leading-relaxed text-[11px]">
              明明画的是对的，模型粗心判定不符而丢弃。扣 1 分，留有遗憾但不至于致命。
            </p>
          </div>

          <div className="bg-blue-950/20 p-4 rounded-xl border border-blue-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400">确实不可判断，保留未知</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold">损失 = 0.0</span>
            </div>
            <p className="text-blue-200/80 leading-relaxed text-[11px]">
              古画本身破损或严重遮挡。如实标为未知存疑，不仅不扣分，还受方案赞赏！
            </p>
          </div>
        </div>

        {/* Huber Loss explanation */}
        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs text-stone-300 space-y-2">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> 为什么方案建议用 Huber 损失，而不是常规的均方误差 (MSE)？
          </div>
          <p className="leading-relaxed text-stone-400">
            真实古籍文献数据中，不可避免存在少数标签有噪声或极端大错样本（例如某张图收益极端的离群点）。普通的平方损失 (y - ŷ)² 遇到离群点会产生极其巨大的梯度，把整个模型带偏（甚至训练崩溃）。<b>Huber 损失在误差较小时保持平滑的二次曲线，误差很大时退化为绝对值线性增长</b>，既能保证精细拟合，又拥有极强的鲁棒性，不怕脏数据暴击！
          </p>
        </div>
      </div>
    </div>
  );
};

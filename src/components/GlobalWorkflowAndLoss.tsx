import React, { useState } from 'react';
import { 
  GitBranch, 
  ArrowRight, 
  Eye, 
  ZoomIn, 
  Database, 
  FileText, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  TrendingDown, 
  Zap, 
  Activity,
  HelpCircle,
  Scale
} from 'lucide-react';

export const GlobalWorkflowAndLoss: React.FC = () => {
  // Interactive Step Tracker
  const [activeStep, setActiveStep] = useState<number>(3); // Step 3: Router Junction
  
  // Interactive Loss Demonstration State
  const [scenario, setScenario] = useState<'correct_saved' | 'occluded_waste' | 'mold_blind' | 'already_clear'>('correct_saved');
  const [predictedGain, setPredictedGain] = useState<number>(0.8);

  // Scenario-based computation of Task Losses:
  // ell_full, ell_local, delta_true
  let ellFull = 2.0;   // Task loss of full image
  let ellLocal = 0.0;  // Task loss of local crop
  let deltaTrue = 2.0; // delta = ellFull - ellLocal
  let scenarioDesc = '';
  let scenarioTitle = '';

  if (scenario === 'correct_saved') {
    scenarioTitle = '场景 A：微小领口，整图看错，局部纠正挽救';
    ellFull = 2.0; // Whole image mistook it (Loss 2)
    ellLocal = 0.0; // Local crop corrected it (Loss 0)
    deltaTrue = 2.0; // Gain = 2 - 0 = +2.0
    scenarioDesc = '整图由于目标太小判断失误（被扣2分）；切出局部后看得一清二楚，做出了正确判断（扣0分）。因此本次追加局部的【真实质量收益 Δ】就是 2.0 - 0.0 = +2.0 分！';
  } else if (scenario === 'occluded_waste') {
    scenarioTitle = '场景 B：被项圈挡死，切了依然未知（纯浪费钱）';
    ellFull = 0.0; // Both preserved unknown (Loss 0)
    ellLocal = 0.0; 
    deltaTrue = 0.0; // Gain = 0 - 0 = 0
    scenarioDesc = '由于物理遮挡，整图是未知（合理未知损失为0）；切出局部后依然是未知（损失为0）。追加局部并没有挽回任何质量差距，真实收益 Δ = 0 分，白花了 API 费！';
  } else if (scenario === 'mold_blind') {
    scenarioTitle = '场景 C：古画破损霉斑，切了反而致盲误判（毒药样本）';
    ellFull = 0.0; // Whole image preserved unknown (Loss 0)
    ellLocal = 2.0; // Local crop hallucinated mold as embroidery (Loss 2)
    deltaTrue = -2.0; // Gain = 0 - 2.0 = -2.0
    scenarioDesc = '整图本来谨慎地标为存疑（损失0分）；切出局部后，模型把霉斑当成刺绣，错误接受了假图（致命扣2分）。追加局部带来严重的负收益 Δ = -2.0 分！';
  } else {
    scenarioTitle = '场景 D：全景长袍已经满分，切局部画蛇添足';
    ellFull = 0.0; // Already correct
    ellLocal = 0.0; // Still correct
    deltaTrue = 0.0; // Gain = 0
    scenarioDesc = '整图早就准确判断匹配了（扣0分）；切局部也对（扣0分）。真实收益 Δ = 0 分，纯纯扣减算力。';
  }

  // Training Loss Huber calculation (delta = 1.0)
  const error = Math.abs(predictedGain - deltaTrue);
  const huberLoss = error <= 1.0 ? 0.5 * error * error : 1.0 * (error - 0.5);

  const pipelineSteps = [
    {
      num: 1,
      title: '用户文摘卡输入',
      role: '任务起点',
      cost: '免费',
      desc: '用户提交一张古代服饰卡（如：“明代立领外衣，大襟，袖口外扩”），系统解析出规范化结构条件。'
    },
    {
      num: 2,
      title: '粗筛检索 (CLIP / 索引)',
      role: '海量初筛',
      cost: '共同成本 (已支出)',
      desc: '从成千上万页古籍 PDF 里捞出 Top-K 张候选图片。这是底座投入，不管后面怎么选都必须花。'
    },
    {
      num: 3,
      title: '整图初核验 (全景 VLM)',
      role: '全局观察',
      cost: '共同成本 (已支出)',
      desc: '视觉大模型看整张图，输出整图结论（未知/匹配）和观察文本（如“领口较小占3%，无遮挡”）。'
    },
    {
      num: 4,
      title: '⚡ 核心分水岭：路由器决策',
      role: '智能门禁 (本项目研究本体)',
      cost: '毫秒级计算 (~0.001元)',
      desc: '【你训练的小模型在这里工作！】接收当前证据，计算 Δ_hat - λ·Cost，决定是直接采纳整图，还是追加局部核验。'
    },
    {
      num: 5,
      title: '分流执行：保留 vs 局部特写',
      role: '动作分岔口',
      cost: '分支A: 0元 | 分支B: +0.08元',
      desc: '若不切局部，直接出结论；若要切局部，调度定位裁图模型 + 第二次高分辨率特写 VLM 进行微距核验。'
    },
    {
      num: 6,
      title: '产出最终卡片与出处页码',
      role: '交付终点',
      cost: '完成',
      desc: '补全缺图文摘卡，标注文献书名、页码、核验结论与置信度证据链，交付给学者。'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <GitBranch className="w-3.5 h-3.5" />
            <span>宏观全景 · 搞清系统的端到端全链路与 Loss 位置</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            从整体出发：一张古籍图片的全生命周期与 Loss 终极定位
          </h2>
          <p className="mt-2 text-stone-300 text-sm sm:text-base leading-relaxed">
            很多同学一上来就被公式绕晕，是因为**不知道这个路由器到底嵌在整个流水线的哪一环**，更搞不清楚**“Loss 到底由谁算、算完了去更新谁”**。看完下面这两张动态全景图，所有逻辑瞬间归位！
          </p>
        </div>
      </div>

      {/* PART 1: The Macro Pipeline */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone-800 pb-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            PART 1 · 宏观全貌
          </span>
          <h3 className="text-xl font-bold text-white font-serif mt-1">
            整个系统的 6 步完整流水线：路由器到底坐在哪里？
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            点击下方各环节卡片，查看该步骤的职责、输入输出与成本性质：
          </p>
        </div>

        {/* Pipeline Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipelineSteps.map((step) => {
            const isSelected = activeStep === step.num;
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between relative ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={isSelected ? 'text-stone-900' : 'text-amber-400 font-bold'}>
                      0{step.num}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-stone-900 text-amber-300' : 'bg-stone-800 text-stone-400'
                    }`}>
                      {step.role}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm mt-2">{step.title}</h4>
                </div>

                <div className={`mt-3 text-[10px] pt-2 border-t ${
                  isSelected ? 'border-stone-800 text-stone-900' : 'border-stone-800/80 text-stone-400'
                }`}>
                  成本: {step.cost}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Deep Explanation Card */}
        <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-amber-400 font-mono">
              步骤 0{activeStep} 深度透视 · {pipelineSteps[activeStep - 1].title}
            </div>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-4xl">
              {pipelineSteps[activeStep - 1].desc}
            </p>
          </div>
          {activeStep === 4 && (
            <div className="shrink-0 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> 本项目的核心科研主角在此！
            </div>
          )}
        </div>

        {/* Visual Architecture Diagram (ASCII / Visual Block Flow) */}
        <div className="bg-stone-950/80 p-6 rounded-xl border border-stone-800 space-y-4">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            端到端信息流向与二选一分叉架构图
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center text-xs">
            {/* Input */}
            <div className="p-3 bg-stone-900 rounded-lg border border-stone-800">
              <FileText className="w-5 h-5 mx-auto text-amber-400 mb-1" />
              <div className="font-bold text-stone-200">服饰文摘卡</div>
              <div className="text-[10px] text-stone-400 mt-0.5">立领、外扩袖</div>
            </div>

            <div className="hidden md:flex justify-center text-stone-600">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Whole Image VLM */}
            <div className="p-3 bg-stone-900 rounded-lg border border-stone-800">
              <Eye className="w-5 h-5 mx-auto text-blue-400 mb-1" />
              <div className="font-bold text-stone-200">整图初核验 (VLM)</div>
              <div className="text-[10px] text-stone-400 mt-0.5">产出整图观察与存疑结论</div>
            </div>

            <div className="hidden md:flex justify-center text-stone-600">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* The Router */}
            <div className="p-4 bg-amber-500/20 rounded-xl border-2 border-amber-500 text-amber-200 shadow-lg shadow-amber-500/10">
              <Cpu className="w-6 h-6 mx-auto text-amber-400 mb-1" />
              <div className="font-bold text-sm text-amber-100">路由智能体 (Router)</div>
              <div className="text-[10px] text-amber-300 mt-0.5 font-mono">Δ_hat - λ·Cost &gt; 0 ?</div>
            </div>
          </div>

          {/* Fork into Two Paths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-stone-800/80">
            {/* Branch A */}
            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-stone-800 text-stone-300 flex items-center justify-center shrink-0 font-bold text-xs">
                A
              </div>
              <div>
                <div className="font-bold text-stone-200 text-xs">分支 A：保留整图核验现状 (Keep Full)</div>
                <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                  路由器判定：“切局部没用或有致盲风险”。直接采用整图结论，<b>零新增花费</b>，流程结束！
                </p>
              </div>
            </div>

            {/* Branch B */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-stone-950 flex items-center justify-center shrink-0 font-bold text-xs">
                B
              </div>
              <div>
                <div className="font-bold text-emerald-300 text-xs">分支 B：追加定位与局部特写 (Add Local)</div>
                <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                  路由器判定：“微小无遮挡，切了能稳赚准确率”。调用定位裁切模型 + 局部 VLM 特写，<b>花 0.08 元</b>抢救结论！
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PART 2: WHERE ON EARTH IS THE LOSS? */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone-800 pb-4">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>彻底解开最大谜团</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
            那个神出鬼没的 Loss 到底在哪里？谁算出来的？更新了谁？
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
            很多初学者最困惑的就是：<b>大模型调的是 API，没有反向传播；那方案里的 Loss 到底是算谁的？</b>
          </p>
        </div>

        {/* 3 Truths about Loss */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
            <div className="text-rose-400 font-bold text-xs flex items-center gap-1.5 mb-2">
              <XCircle className="w-4 h-4" /> 误区 1：大模型被更新了？
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              <b>错！</b> 远程视觉大模型（GPT-4V / 阿里云百炼 Qwen-VL）权重根本不会动，我们也没权限去改它的参数。
            </p>
          </div>

          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
            <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4" /> 真相 2：到底是谁在更新？
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              <b>更新的是你本地的【路由器 Router】！</b> 是你的 BERT 分类头、矩阵分解的动作嵌入向量，或者本地 7B 小模型的 LoRA 权重！
            </p>
          </div>

          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
            <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5 mb-2">
              <Scale className="w-4 h-4" /> 真相 3：任务损失 vs 训练损失
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              任务损失 ℓ 负责<b>给大模型的回答打扣分</b>；训练损失 L 负责<b>衡量你的路由器“猜得准不准”</b>！两者千万别混为一谈！
            </p>
          </div>
        </div>

        {/* Step-by-Step Loss Calculation Flow */}
        <div className="bg-stone-950 p-6 rounded-xl border border-stone-800 space-y-6">
          <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            Loss 的诞生三部曲（跟着数值推一遍，终生不忘）：
          </h4>

          {/* Stepper with mathematical equations */}
          <div className="space-y-4 text-xs">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-mono text-amber-400 font-bold text-xs">
                  第一步：给现实后果打分 · 任务损失 ℓ (Task Loss)
                </span>
                <p className="text-stone-300">
                  两条路径实际跑完后，拿它们的回答和【专家真值】比对：
                </p>
                <div className="text-stone-400 font-mono text-[11px] bg-stone-950 p-2 rounded border border-stone-800/60 mt-1">
                  • 答对了：ℓ = 0 分 <br />
                  • 把假图当真图（致命错误接受）：ℓ = 2.0 分 <br />
                  • 把真图当假图（遗漏拒绝）：ℓ = 1.0 分 <br />
                  • 存疑未知：ℓ = 0 分
                </div>
              </div>
              <div className="shrink-0 bg-stone-950 p-3 rounded-lg border border-stone-800 text-center font-mono">
                <div className="text-[10px] text-stone-500">产出结果</div>
                <div className="text-amber-300 font-bold">ℓ(整图) 与 ℓ(局部)</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-mono text-emerald-400 font-bold text-xs">
                  第二步：算出切局部的真实收益 · 增益 Δ (True Gain)
                </span>
                <p className="text-stone-300">
                  切局部到底给系统减少了多少坏处？用整图的损失减去局部的损失：
                </p>
                <div className="text-emerald-300 font-mono text-sm bg-stone-950 p-2 rounded border border-stone-800/60 mt-1 font-bold">
                  Δ = ℓ(整图) - ℓ(局部)
                </div>
                <p className="text-[11px] text-stone-400">
                  例如：整图看错罚了 2 分，局部纠正了罚 0 分，那么真实收益 Δ = 2.0 - 0.0 = +2.0 分（极具价值）！
                </p>
              </div>
              <div className="shrink-0 bg-stone-950 p-3 rounded-lg border border-stone-800 text-center font-mono">
                <div className="text-[10px] text-stone-500">客观监督真值</div>
                <div className="text-emerald-300 font-bold text-sm">真实 Δ (标量)</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-mono text-purple-400 font-bold text-xs">
                  第三步：考核路由器猜得准不准 · 训练损失 L (Training Loss)
                </span>
                <p className="text-stone-300">
                  【这才是进入 PyTorch 反向传播的 Loss！】路由器预测的提分是 Δ_hat，真实的提分是 Δ。
                </p>
                <div className="text-purple-300 font-mono text-sm bg-stone-950 p-2 rounded border border-stone-800/60 mt-1 font-bold">
                  L_train = Huber( Δ_hat , Δ ) + α·Risk + β·Cost
                </div>
                <p className="text-[11px] text-stone-400">
                  衡量预测值和真实收益的差！梯度 ∂L / ∂θ_Router 一路反传，<b>更新路由器的参数</b>！
                </p>
              </div>
              <div className="shrink-0 bg-stone-950 p-3 rounded-lg border border-stone-800 text-center font-mono">
                <div className="text-[10px] text-stone-500">反向传播更新</div>
                <div className="text-purple-300 font-bold text-sm">∂L / ∂θ_Router</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Live Loss Calculator Demo */}
        <div className="bg-stone-950 p-6 rounded-xl border border-stone-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                动手演练：Loss 实时计算沙盒
              </h4>
              <p className="text-[11px] text-stone-400">
                切换不同现实处境，调节路由器的预测值，亲眼见证真实 Δ 与训练损失 L 的生成过程！
              </p>
            </div>

            {/* Scenario buttons */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'correct_saved', label: '纠正挽救(+2)' },
                { id: 'occluded_waste', label: '遮挡白费(0)' },
                { id: 'mold_blind', label: '霉斑致盲(-2)' },
                { id: 'already_clear', label: '全景已清(0)' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setScenario(item.id as any)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    scenario === item.id
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Real World Facts (6 cols) */}
            <div className="md:col-span-6 space-y-3 text-xs">
              <div className="font-bold text-stone-200">{scenarioTitle}</div>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                {scenarioDesc}
              </p>

              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                  <div className="text-[10px] text-stone-400">整图任务损失 ℓ_0</div>
                  <div className="font-bold text-rose-400 mt-1">{ellFull.toFixed(1)}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                  <div className="text-[10px] text-stone-400">局部任务损失 ℓ_1</div>
                  <div className="font-bold text-emerald-400 mt-1">{ellLocal.toFixed(1)}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <div className="text-[10px] text-amber-300 font-bold">真实质量收益 Δ</div>
                  <div className="font-bold text-amber-400 mt-1">
                    {deltaTrue > 0 ? `+${deltaTrue.toFixed(1)}` : deltaTrue.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Router Prediction & Huber Loss (6 cols) */}
            <div className="md:col-span-6 bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-300 font-semibold">
                  路由器预测的收益值 Δ_hat：
                </span>
                <span className="font-mono text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded">
                  {predictedGain.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="-2.5"
                max="2.5"
                step="0.1"
                value={predictedGain}
                onChange={(e) => setPredictedGain(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              />

              <div className="pt-2 border-t border-stone-800 space-y-1.5">
                <div className="flex justify-between text-stone-400">
                  <span>预测误差 |Δ_hat - Δ|：</span>
                  <span className="font-mono text-stone-200">{error.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-stone-950 border border-stone-800">
                  <span className="font-bold text-purple-300">
                    计算出的训练损失 L (Huber)：
                  </span>
                  <span className="font-mono font-bold text-base text-purple-400">
                    {huberLoss.toFixed(4)}
                  </span>
                </div>
                <div className="text-[10px] text-stone-400 leading-tight">
                  📌 解释：这个 <b className="text-purple-300">{huberLoss.toFixed(4)}</b> 就会作为 PyTorch 中 <code>loss.backward()</code> 的起点，自动更新路由器的分类头或投影矩阵！
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

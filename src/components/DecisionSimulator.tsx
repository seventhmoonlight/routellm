import React, { useState } from 'react';
import { SAMPLE_CASES } from '../data/cases';
import { ROUTER_INFOS } from '../data/routers';
import { CostumeCase, RouterType } from '../types';
import { 
  Eye, 
  ZoomIn, 
  Sliders, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Sparkles,
  Layers,
  HelpCircle,
  Coins,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const DecisionSimulator: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(SAMPLE_CASES[0].id);
  const [selectedRouter, setSelectedRouter] = useState<RouterType>('similarity');
  const [costSensitivityLambda, setCostSensitivityLambda] = useState<number>(5.0); // Lambda: 0 to 20
  const [customOccluded, setCustomOccluded] = useState<boolean | null>(null);

  const currentCase: CostumeCase = SAMPLE_CASES.find(c => c.id === selectedCaseId) || SAMPLE_CASES[0];
  const effectiveOccluded = customOccluded !== null ? customOccluded : currentCase.isOccluded;

  // Simulate Router predictions based on mathematical principles from proposal:
  // Expected Gain Delta_hat calculation:
  // 1. If occluded, expected gain is practically 0 or negative
  // 2. If target is huge (clear), gain is 0 (already resolved)
  // 3. If target is tiny and unoccluded, gain is positive (around 1.5 - 2.0)
  // 4. Different routers have slight prediction characteristics and confidence bounds
  let predictedDelta = 0;
  let predictedRisk = 0.05; // probability of False Acceptance
  const normalizedCost = 0.08; // Normalized marginal cost of API zoom-in call

  if (effectiveOccluded) {
    predictedDelta = selectedRouter === 'bert' ? 0.02 : (selectedRouter === 'mf' ? 0.1 : 0.0);
    predictedRisk = 0.25; // higher risk of illusion
  } else if (currentCase.visibility === 'clear') {
    predictedDelta = 0.05;
    predictedRisk = 0.02;
  } else if (currentCase.visibility === 'tiny') {
    predictedDelta = 1.95;
    predictedRisk = 0.04;
  } else {
    // ambiguous / damaged
    if (currentCase.groundTruthLocalOutcome === 'misleads_to_error') {
      predictedDelta = selectedRouter === 'causal_llm' ? -0.4 : (selectedRouter === 'similarity' ? -0.2 : 0.4);
      predictedRisk = 0.65;
    } else {
      predictedDelta = 1.45;
      predictedRisk = 0.08;
    }
  }

  // Cost penalty: lambda * cost
  const costDeduction = (costSensitivityLambda * normalizedCost);
  const netUtility = predictedDelta - costDeduction - (predictedRisk > 0.4 ? 1.0 : 0.0);

  // Decision rule: Net Utility > 0 and Risk under safety threshold
  const shouldAddLocal = netUtility > 0.2 && predictedRisk < 0.45;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Explanation */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>多模态视觉决策实时沙盘</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
              模拟器：当前证据状态 → 路由器如何下令？
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              选择一个典型服饰古籍核验处境，调节预算敏感度 λ，实时观察数学公式 Δ_hat - λ · Cost 如何决定命运！
            </p>
          </div>

          {/* Router Selector */}
          <div className="bg-stone-950 p-1.5 rounded-xl border border-stone-800 flex flex-wrap gap-1">
            {(Object.keys(ROUTER_INFOS) as RouterType[]).map((rId) => {
              const r = ROUTER_INFOS[rId];
              const isSelected = selectedRouter === rId;
              return (
                <button
                  key={rId}
                  onClick={() => setSelectedRouter(rId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  {r.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Case Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {SAMPLE_CASES.map((item) => {
          const isSelected = item.id === selectedCaseId;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedCaseId(item.id);
                setCustomOccluded(null);
              }}
              className={`p-3 rounded-xl text-left border transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/50'
                  : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="text-[10px] text-stone-400 font-serif">{item.period}</div>
              <div className="font-bold text-xs text-stone-200 truncate mt-0.5">{item.name.split('·')[0]}</div>
              <div className="text-[10px] text-amber-400/90 truncate mt-1">{item.name.split('·')[1]}</div>
              <div className="mt-2 flex items-center justify-between text-[10px]">
                <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                  item.visibility === 'tiny' ? 'bg-emerald-500/20 text-emerald-300' :
                  item.visibility === 'occluded' ? 'bg-amber-500/20 text-amber-300' :
                  item.visibility === 'clear' ? 'bg-blue-500/20 text-blue-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {item.visibility === 'tiny' ? '微小无遮挡' :
                   item.visibility === 'occluded' ? '严重遮挡' :
                   item.visibility === 'clear' ? '清晰全景' : '歧义/破损'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Representation & State Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Visual Card Representation */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                古籍候选图与整图核验状态（决策时刻已经知道的信息）
              </span>
              <span className="text-xs text-stone-400 font-serif">
                出处:《古籍珍本服饰谱》P.142
              </span>
            </div>

            {/* Visual Simulated Mock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-950 p-4 rounded-xl border border-stone-800/80">
              {/* Full Image Representation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-blue-400" /> 1. 整图全局视野</span>
                  <span className="text-[10px] text-stone-400">共同成本已支出</span>
                </div>
                <div className="aspect-[4/3] bg-stone-900 rounded-lg border border-stone-700/80 relative flex flex-col items-center justify-center p-4 overflow-hidden">
                  {/* Ancient canvas texture overlay */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* Schematic Ancient Character Silhouette */}
                  <div className="relative z-10 w-24 h-36 border-2 border-stone-600 rounded-t-full rounded-b-lg flex flex-col items-center justify-between py-2 bg-stone-800/50">
                    {/* Head / Collar area */}
                    <div className="relative w-8 h-8 rounded-full border border-stone-500 flex items-center justify-center">
                      {/* Collar crop box highlight */}
                      <div className={`absolute -bottom-2 w-6 h-4 border-2 border-dashed ${effectiveOccluded ? 'border-amber-400 bg-amber-500/20' : 'border-emerald-400 bg-emerald-500/20'} animate-pulse rounded`}>
                        <span className="absolute -top-3.5 left-0 text-[8px] font-bold text-amber-300 uppercase">目标区域</span>
                      </div>
                    </div>
                    {/* Torso & Robe */}
                    <div className="text-[9px] text-stone-400 text-center font-serif">
                      {currentCase.clothingLayer}
                    </div>
                    {/* Hem */}
                    <div className="w-16 h-3 bg-stone-700/60 rounded"></div>
                  </div>

                  <div className="absolute bottom-2 left-2 text-[10px] bg-stone-950/80 px-2 py-0.5 rounded text-stone-300 border border-stone-800">
                    目标占比: {currentCase.targetRatio}%
                  </div>

                  <div className="absolute top-2 right-2 text-[10px] bg-stone-950/80 px-2 py-0.5 rounded text-amber-300 border border-stone-800">
                    整图结论: {currentCase.fullImageResult === 'unknown' ? '存疑未知' : currentCase.fullImageResult === 'match' ? '判定匹配' : '判定不符'}
                  </div>
                </div>
              </div>

              {/* Local Zoom-in Candidate Crop */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5 text-emerald-400" /> 2. 拟追加局部特写视野</span>
                  <span className="text-[10px] text-amber-400 font-mono">+0.08 成本</span>
                </div>
                <div className="aspect-[4/3] bg-stone-900 rounded-lg border border-dashed border-stone-700 relative flex flex-col items-center justify-center p-3 text-center overflow-hidden">
                  {effectiveOccluded ? (
                    <div className="space-y-2 max-w-[180px]">
                      <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-amber-300">首饰项圈完全遮盖</div>
                      <p className="text-[10px] text-stone-400 leading-tight">
                        即使放大 10 倍，该处仍被厚重珠宝严密阻挡，无法窥见底层立领。
                      </p>
                    </div>
                  ) : currentCase.groundTruthLocalOutcome === 'misleads_to_error' ? (
                    <div className="space-y-2 max-w-[180px]">
                      <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                        <XCircle className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-rose-300">剥蚀霉斑极易致盲</div>
                      <p className="text-[10px] text-stone-400 leading-tight">
                        局部放大后破损边缘明显，模型极易产生幻觉误认。
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-w-[180px]">
                      <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-emerald-300">高清微距纤毫毕现</div>
                      <p className="text-[10px] text-stone-400 leading-tight">
                        局部特写能清晰看清纽扣、领口针脚与边缘外扩弧度。
                      </p>
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 text-[9px] text-stone-400">
                    注：此为真实效果，路由器此刻不可偷看！
                  </div>
                </div>
              </div>
            </div>

            {/* Input State Table */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="font-semibold text-stone-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                当前证据状态特征（合法的输入，无未来泄露）：
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-300">
                <div className="bg-stone-950/70 p-2.5 rounded-lg border border-stone-800">
                  <span className="text-stone-400">文摘要求：</span>
                  <span className="text-amber-200 font-medium ml-1">{currentCase.condition}</span>
                </div>
                <div className="bg-stone-950/70 p-2.5 rounded-lg border border-stone-800">
                  <span className="text-stone-400">整图观察记录：</span>
                  <span className="text-stone-200 ml-1">{currentCase.fullImageObs}</span>
                </div>
                <div className="bg-stone-950/70 p-2.5 rounded-lg border border-stone-800">
                  <span className="text-stone-400">目标人物与侧别：</span>
                  <span className="text-stone-200 ml-1">{currentCase.targetObject} · {currentCase.side}</span>
                </div>
                <div className="bg-stone-950/70 p-2.5 rounded-lg border border-stone-800">
                  <span className="text-stone-400">衣层与归属约束：</span>
                  <span className="text-stone-200 ml-1">{currentCase.clothingLayer}（防张冠李戴）</span>
                </div>
              </div>
            </div>

            {/* Story Analogy */}
            <div className="mt-4 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-200/90 leading-relaxed">
              <span className="font-bold text-amber-300">💡 场景剖析：</span>
              {currentCase.storyAnalogy}
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Decision Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base font-serif flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  {ROUTER_INFOS[selectedRouter].name.split(' ')[0]} 算盘推演
                </h3>
                <p className="text-[11px] text-stone-400">
                  {ROUTER_INFOS[selectedRouter].metaphor}
                </p>
              </div>
            </div>

            {/* Lambda Cost Sensitivity Slider */}
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-300 font-semibold flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  预算紧缺系数 λ (Lambda)：
                </span>
                <span className="font-mono text-amber-300 font-bold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                  {costSensitivityLambda.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={costSensitivityLambda}
                onChange={(e) => setCostSensitivityLambda(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>0.0 (不差钱，追求极致准确)</span>
                <span>20.0 (预算极紧，精打细算)</span>
              </div>
            </div>

            {/* Calculation Breakdown Cards */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-stone-950 border border-stone-800">
                <span className="text-stone-400">1. 预测质量收益 Δ_hat (预期提分)：</span>
                <span className={`font-mono font-bold text-sm ${predictedDelta > 0.8 ? 'text-emerald-400' : predictedDelta > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                  +{predictedDelta.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-stone-950 border border-stone-800">
                <span className="text-stone-400">2. 成本扣减 λ · Cost ({costSensitivityLambda} × 0.08)：</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  -{costDeduction.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-lg bg-stone-950 border border-stone-800">
                <span className="text-stone-400">3. 错误接受致盲风险惩罚：</span>
                <span className={`font-mono font-bold text-sm ${predictedRisk > 0.4 ? 'text-rose-400' : 'text-stone-400'}`}>
                  {predictedRisk > 0.4 ? '-1.00 (高危)' : '0.00 (安全)'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-amber-950/20 border border-amber-900/40">
                <span className="text-stone-200 font-bold">最终综合净收益 U_hat：</span>
                <span className={`font-mono font-extrabold text-base ${netUtility > 0.2 ? 'text-emerald-400' : 'text-stone-400'}`}>
                  {netUtility.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Final Action Verdict Banner */}
            <div className={`p-4 rounded-xl border flex items-center space-x-3.5 shadow-lg ${
              shouldAddLocal
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                : 'bg-stone-850 border-stone-700 text-stone-300'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                shouldAddLocal ? 'bg-emerald-500 text-stone-950' : 'bg-stone-800 text-stone-300'
              }`}>
                {shouldAddLocal ? <ZoomIn className="w-5 h-5 font-bold" /> : <Eye className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold opacity-80">
                  路由器最终裁定
                </div>
                <div className="text-base font-extrabold flex items-center gap-1.5 mt-0.5">
                  {shouldAddLocal ? (
                    <>
                      <span className="text-emerald-300">追加局部特写核验 (Add Local Crop)</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </>
                  ) : (
                    <>
                      <span className="text-stone-200">保留整图核验现状 (Keep Full Image)</span>
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </div>
                <div className="text-xs opacity-80 mt-1">
                  {shouldAddLocal
                    ? '净收益为正且风险可控，系统果断调度微距裁切视觉工具！'
                    : '追加核验预期收益不足或有致盲风险，及时刹车，省下珍贵预算。'}
                </div>
              </div>
            </div>

            {/* Quick Toggle Occlusion Button */}
            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-400">动手实验：如果此时有人戴了一条围巾呢？</span>
              <button
                onClick={() => setCustomOccluded(!effectiveOccluded)}
                className={`px-3 py-1 rounded-lg border font-semibold text-xs transition-all ${
                  effectiveOccluded
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-stone-800 border-stone-700 text-stone-300'
                }`}
              >
                {effectiveOccluded ? '当前：已被遮挡' : '当前：完全可见'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

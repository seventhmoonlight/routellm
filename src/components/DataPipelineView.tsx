import React, { useState } from 'react';
import { ROADMAP_STEPS, FIVE_STEP_DATA_PIPELINE } from '../data/roadmap';
import { 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  CircleDashed, 
  Layers, 
  Database, 
  FileCheck, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  ListOrdered
} from 'lucide-react';

export const DataPipelineView: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const toggleStep = (stepNum: number) => {
    if (completedSteps.includes(stepNum)) {
      setCompletedSteps(completedSteps.filter(s => s !== stepNum));
    } else {
      setCompletedSteps([...completedSteps, stepNum]);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <GitBranch className="w-3.5 h-3.5" />
            <span>落地实操指南 · 方案第 9、13、14 节</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            自动数据流水线与 8 步落地作战路线图
          </h2>
          <p className="mt-2 text-stone-300 text-sm sm:text-base leading-relaxed">
            很多同学以为做这个项目必须手工标几千张图，方案明确指出了<b>“无需人工逐张标就能冷启动的 5 步自动构造法”</b>，并规划了清晰严谨的 8 步落地里程碑。
          </p>
        </div>
      </div>

      {/* 5-Step Pipeline Visual Workflow */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              第 9 节核心落地武器
            </span>
            <h3 className="text-xl font-bold text-white font-serif mt-1">
              五步全自动数据流水线：把文献 PDF 变成训练数据
            </h3>
          </div>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold">
            零冷启动门槛
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {FIVE_STEP_DATA_PIPELINE.map((item, index) => (
            <div 
              key={item.num}
              className="bg-stone-950 p-4 rounded-xl border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center font-mono text-sm mb-3">
                  0{item.num}
                </div>
                <h4 className="font-bold text-stone-100 text-sm mb-2">{item.title}</h4>
                <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
              </div>

              {index < 4 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-stone-600 group-hover:text-amber-400 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 9.4 Pilot notice */}
        <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-xl text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <b>方案原著建议第一阶段规模：</b> 
            先自动试采 <b>100~200 个状态样本</b>！记录各层真值覆盖率、失败率与单样本 API 花销；验证各环节通畅无泄漏之后，再从容扩充到 1000~3000 个状态样本。步步为营，切忌好高骛远！
          </div>
        </div>
      </div>

      {/* 8-Step Execution Roadmap Checklist */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white font-serif flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-amber-400" />
              八步完整执行清单（点击勾选跟进你的实验进度）
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              已完成 {completedSteps.length} / {ROADMAP_STEPS.length} 个里程碑 · 不再无休止地调两张图的 Prompt
            </p>
          </div>

          <div className="text-xs text-stone-400 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800">
            进度: <b className="text-amber-400">{Math.round((completedSteps.length / ROADMAP_STEPS.length) * 100)}%</b>
          </div>
        </div>

        <div className="space-y-3">
          {ROADMAP_STEPS.map((step) => {
            const isDone = completedSteps.includes(step.step);
            return (
              <div 
                key={step.step}
                onClick={() => toggleStep(step.step)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isDone 
                    ? 'bg-emerald-950/20 border-emerald-800/40' 
                    : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <CircleDashed className="w-5 h-5 text-stone-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-amber-400">Step 0{step.step}</span>
                        <h4 className={`text-sm font-bold ${isDone ? 'text-emerald-200 line-through' : 'text-stone-200'}`}>
                          {step.title}
                        </h4>
                      </div>
                      <div className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                        <b className="text-stone-300">📦 可检查交付物：</b> {step.deliverable}
                      </div>
                      <div className="text-xs text-emerald-400/90 mt-1">
                        <b>🔑 核心铁律：</b> {step.keyRule}
                      </div>
                      <div className="text-xs text-rose-400/90 mt-1">
                        <b>🚫 必须避坑：</b> {step.pitfallToAvoid}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current State Boundary: What is Done vs What is to be implemented (Section 14) */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl font-bold text-white font-serif flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-amber-400" />
          方案第 14 节：已有成果与拟实现边界（不虚夸成绩，实事求是）
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-emerald-950/20 p-5 rounded-xl border border-emerald-900/40 space-y-2">
            <div className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> ✅ 实验室目前已有基础
            </div>
            <ul className="list-disc list-inside space-y-1 text-emerald-200/90 leading-relaxed">
              <li>真实整图与局部核验运行轨迹数据日志</li>
              <li>3 组 10 图 30 条件的开发探索实验</li>
              <li>结构化属性映射体系（领型、袖型、袍服、下摆）</li>
              <li>锚点定位工具与部分历史失败归因分析</li>
            </ul>
          </div>

          <div className="bg-amber-950/20 p-5 rounded-xl border border-amber-900/40 space-y-2">
            <div className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> 🚀 本方案需要做出的新突破（拟实现内容）
            </div>
            <ul className="list-disc list-inside space-y-1 text-amber-200/90 leading-relaxed">
              <li>四类任务适配路由器（相似度加权、MF、BERT、因果分类器）的正式训练</li>
              <li>具备严格防泄露机制的自动收益数据集构建流水线</li>
              <li>独立的跨文献、跨版型泛化评测体系</li>
              <li>带风险约束的多任务决策策略验证</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  Eye, 
  ZoomIn, 
  Coins, 
  Scale, 
  ShieldAlert, 
  Sparkles,
  Compass,
  FileQuestion,
  ChevronRight
} from 'lucide-react';
import { NavigationTab } from '../types';

interface PlainGuideViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const PlainGuideView: React.FC<PlainGuideViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner: The Plain English Essence */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 border border-amber-900/40 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>三分钟全景通关 · 彻底弄清你的研究方案</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif leading-tight">
            别被公式吓住：这个项目的本质，就是一个<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">“精明的古籍插画考证员”</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed">
            你手里有一张古代服饰卡片（例如写着：<b>“明代大襟披风，领口为立领，袖口外扩”</b>），但在历史文献古籍中，原图丢了。你的系统要从成百上千页古籍 PDF 里，找出真正符合这套描述的真实古画，补齐卡片并标出具体哪一页哪一幅图。
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl">
              <div className="text-amber-400 font-bold text-sm flex items-center gap-1.5 mb-1">
                <FileQuestion className="w-4 h-4" /> 绝非“用 AI 画假图”
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                不是用 Midjourney 或 SD 凭空造一张古代衣服，而是从真实历史古籍中严格检索原图、给出学术引用出处。
              </p>
            </div>

            <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl">
              <div className="text-amber-400 font-bold text-sm flex items-center gap-1.5 mb-1">
                <ZoomIn className="w-4 h-4" /> 核心矛盾：要不要切局部？
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                整图看完了，但领口太小看不真切。此时要不要专门调昂贵的裁图大模型把领口切下来做特写核验？
              </p>
            </div>

            <div className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl">
              <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 mb-1">
                <Scale className="w-4 h-4" /> 本项目的核心科研贡献
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                训练一个轻量级“智能门禁”，在几毫秒内准确判断：<b>“这道题切特写到底能不能挽救准确率？还是纯花冤枉钱？”</b>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Big Intuition: Why is Local Crop NOT always good? */}
      <section className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl mb-6">
          <div className="flex items-center space-x-2 text-amber-400 text-sm font-semibold uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            <span>核心认知突破</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 font-serif">
            为什么不能“遇到拿不准的，全无脑切个局部看一遍”？
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            很多人的思维定式是“放大镜总比肉眼强”。但这篇方案最精妙的地方，就在于指出了古代视觉文献核验中的 <b className="text-amber-300">4 种完全不同的现实处境</b>：
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Situation 1 */}
          <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-5 hover:border-emerald-500/60 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                处境 A · 黄金收益
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-bold text-stone-100 text-base">空旷小领口 · 边缘微糊</h3>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              领口只占画面 3%，整图模型看不清。但目标周围干干净净、无任何首饰遮挡。
            </p>
            <div className="mt-3 pt-3 border-t border-emerald-900/30 text-xs text-emerald-300 font-medium">
              💡 决策结果：<b>果断追加局部！</b> 高清裁图立刻看清立领扣，把“未知”纠正为“匹配”，这笔钱花得极值！
            </div>
          </div>

          {/* Situation 2 */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-5 hover:border-amber-500/60 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                处境 B · 纯属浪费
              </span>
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-stone-100 text-base">厚重璎珞围巾 · 彻底封死</h3>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              颈部挂满了重重珠宝珍珠项圈。整图模型记录：该部位 100% 被遮蔽。
            </p>
            <div className="mt-3 pt-3 border-t border-amber-900/30 text-xs text-amber-300 font-medium">
              ⚠️ 决策结果：<b>保留整图，拒绝切片！</b> 因为放大一百倍也是看项圈，不可能穿透物理遮挡看底下的领子，切图纯亏 API 费。
            </div>
          </div>

          {/* Situation 3 */}
          <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-5 hover:border-rose-500/60 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                处境 C · 致盲毒药
              </span>
              <XCircle className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="font-bold text-stone-100 text-base">古画破损霉斑 · 误导幻觉</h3>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              古籍原纸泛黄斑驳剥落。整图还能看出大致轮廓，切片特写后，模型把霉斑纹理误认为“精美刺绣”！
            </p>
            <div className="mt-3 pt-3 border-t border-rose-900/30 text-xs text-rose-300 font-medium">
              🚫 决策结果：<b>坚决不追加！</b> 局部切图不仅不涨分，反而由对变错，造成致命的“假阳性错误接受”（扣2分大过）。
            </div>
          </div>

          {/* Situation 4 */}
          <div className="bg-blue-950/20 border border-blue-800/40 rounded-xl p-5 hover:border-blue-500/60 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                处境 D · 画蛇添足
              </span>
              <AlertTriangle className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-bold text-stone-100 text-base">通裁大袍 · 全景一览无余</h3>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              题目问长袍是否垂至脚面，人物在原图中占 70%，整图已经一清二楚给出了满分判定。
            </p>
            <div className="mt-3 pt-3 border-t border-blue-900/30 text-xs text-blue-300 font-medium">
              ℹ️ 决策结果：<b>直接采纳整图！</b> 全景已经解决，不需要再把脚踝截出来复核一遍。
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Academic Boundaries */}
      <section className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-serif flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
          方案作者（GPT）设定的 3 条绝对红线（也是答辩时导师最爱抓的把柄）
        </h2>
        <div className="mt-6 space-y-4">
          <div className="flex items-start space-x-4 bg-stone-950/70 p-4 rounded-xl border border-stone-800">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-stone-200 text-base">严禁“状态泄露”作弊（不能偷看答案）</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                路由器在做决定那一秒，手头只有：① 题目文字；② 已经跑完的整图观察记录。<b>绝对不能把“切图之后清晰度怎样”、“局部核验的答案”提前塞进特征里！</b> 这就好比高考还没交卷，你就把参考答案当成已知题目输入，哪怕测试集准确率 100%，也属于严重的科研造假。
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-stone-950/70 p-4 rounded-xl border border-stone-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-stone-200 text-base">允许“保留未知”（不知道就是不知道，不要瞎猜）</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                在真实历史古籍中，很多古画本就损毁、残缺、模糊。如果系统不追加局部核验，结论维持“存疑/未知 (Unknown)”，这是科学严谨的胜利！<b>绝对不能因为不切图，就为了凑准确率而强行给一个“匹配”或“不符”。</b>
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-stone-950/70 p-4 rounded-xl border border-stone-800">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-stone-200 text-base">不能把“大模型的自信”当成“客观标准答案”</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                大模型自己说“我对这个判断有 99% 把握”，不代表它就真的对！方案严格区分了【强监督（学者权威标定）】与【弱监督（几个大模型互相投票印证）】。训练时弱监督必须打折降权，绝不能把 AI 的幻觉当成黄金真理。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Navigation */}
      <section className="bg-gradient-to-r from-amber-950/40 to-stone-900 border border-amber-900/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white font-serif">
            准备好动手体验了吗？
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            进入决策沙盘，随意切换案例，看看四大路由器如何计算 Δ 收益和成本！
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('simulator')}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-sm"
          >
            <span>进入决策沙盘试跑</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('routers')}
            className="flex items-center space-x-2 bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2.5 rounded-xl transition-all border border-stone-700 text-sm"
          >
            <span>拆解四大路由器原理</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

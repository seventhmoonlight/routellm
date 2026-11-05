import React, { useState } from 'react';
import { RouterType } from '../types';
import { 
  Cpu, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Code2, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Scale, 
  Table, 
  Activity,
  ArrowRight,
  Database,
  Terminal,
  Calculator
} from 'lucide-react';

interface RouterDetailedSpec {
  id: RouterType;
  title: string;
  subtitle: string;
  metaphor: string;
  inputDetailed: {
    rawInputText: string;
    tensorShape: string;
    featureBreakdown: string[];
  };
  mathFormulas: {
    title: string;
    formula: string;
    plainMeaning: string;
  }[];
  outputDetailed: {
    tensorShape: string;
    outputType: string;
    decisionRule: string;
  };
  pytorchCode: string;
  pitfalls: string;
  priorityNote: string;
}

const DETAILED_SPECS: Record<RouterType, RouterDetailedSpec> = {
  similarity: {
    id: 'similarity',
    title: '方法一：相似度加权 (Similarity / kNN-BT)',
    subtitle: '无需训练大模型 · 历史经验病历库检索法',
    metaphor: '“找既往病历”：遇到模糊领口，不看衣服外表好不好看，去历史库找“以前遇到类似模糊且无遮挡的领口，切局部后是赚了还是赔了”。',
    inputDetailed: {
      rawInputText: `// 当前决策状态 s 包含三项：
1. 需求文本: "明代大襟披风，外衣领口为竖立小立领"
2. 整图观察: "领口微小占2.8%，边缘模糊，无首饰围巾遮挡"
3. 结构特征: { is_occluded: 0, target_ratio: 0.028, layer: "outer" }`,
      tensorShape: `向量化表示：
• s_text  ∈ R^768 (经轻量预训练文本模型编码)
• s_image ∈ R^512 (原图经 CLIP-ViT 提取特征，可选)
• s_state ∈ R^8   (归一化结构特征：遮挡布尔、面积占比等)`,
      featureBreakdown: [
        '文本余弦相似度 S_text = cos(s_text, s_i_text)',
        '图像表征相似度 S_image = cos(s_image, s_i_image)',
        '结构距离相似度 S_state = 1 - ||s_state - s_i_state||_2'
      ]
    },
    mathFormulas: [
      {
        title: '1. 综合处境相似度加权公式',
        formula: 'S(s, s_i) = α · S_text + β · S_image + γ · S_state',
        plainMeaning: '把文字描述、图像外观和结构化状态的相似度按权重加权（验证集选定 α, β, γ）。'
      },
      {
        title: '2. Softmax 温度归一化近邻权重',
        formula: 'w_i = exp( S(s, s_i) / τ ) / Σ_j exp( S(s, s_j) / τ )',
        plainMeaning: '从训练库挑出 Top-K (如 K=10) 个最相似的历史处境，按相似度算权重（τ越小越只看最近的邻居）。'
      },
      {
        title: '3. 加权预测期望收益',
        formula: 'Δ_hat = Σ ( w_i · Δ_i )',
        plainMeaning: '用这 10 个历史邻居当年的真实提分 Δ_i，乘上各自的相似度权重，得到本次追加局部的预估提分！'
      }
    ],
    outputDetailed: {
      tensorShape: '标量数值 Δ_hat ∈ R (浮点数)',
      outputType: '预测追加局部核验能带来的净质量提分 (比如 +1.8 分)',
      decisionRule: '若 Δ_hat - λ·Cost > 0 且最近邻距离在安全阈值内 -> 追加局部；否则保留整图。'
    },
    pytorchCode: `# 核心 PyTorch / NumPy 实现逻辑 (极简 8 行)
def predict_knn_gain(curr_state, history_states, history_deltas, k=10, tau=0.1):
    # 1. 计算余弦相似度
    sims = F.cosine_similarity(curr_state.unsqueeze(0), history_states)
    # 2. 选取 Top-K 近邻
    top_sims, top_idx = torch.topk(sims, k=k)
    # 3. Softmax 归一化权重
    weights = F.softmax(top_sims / tau, dim=0)
    # 4. 加权预测期望提分
    pred_delta = torch.sum(weights * history_deltas[top_idx])
    return pred_delta.item()`,
    pitfalls: '切忌把“同款衣服（外貌像）”当成“相似处境”。领口清晰但问裙摆的案例，不能算作领口微小的近邻！且库中没有足够近邻时，必须回退到安全默认策略，不可瞎猜。',
    priorityNote: '🌟 建议全组首先实现！零训练成本、毫秒级执行，且每个决策都能把参考的历史案例打印出来，答辩时最能说服老师。'
  },
  mf: {
    id: 'mf',
    title: '方法二：矩阵分解 (Matrix Factorization, MF)',
    subtitle: '处境向量与动作向量的低维契合度点积',
    metaphor: '“推荐算法猜喜好”：把状态压缩成小向量，把“保留整图”和“切局部”也变成两条向量。算它们点积打分，看当前状态和哪个动作更搭。',
    inputDetailed: {
      rawInputText: `// 输入与方法一相同：状态向量经过多层感知机 (MLP) 投影
状态特征拼接：[s_text; s_image; s_state] -> 进入小型 Dense 投影层`,
      tensorShape: `状态嵌入: h(s) ∈ R^d (例如 d = 64 或 128)
动作库嵌入:
• v_keep  ∈ R^k (保留整图的动作向量)
• v_local ∈ R^k (追加局部的动作向量)`,
      featureBreakdown: [
        '每个动作 a 拥有一条可学习的动作嵌入向量 v_a',
        '双线性双向交互投影矩阵 W ∈ R^(k × d)',
        '计算双线性内积匹配打分'
      ]
    },
    mathFormulas: [
      {
        title: '1. 状态-动作匹配得分公式',
        formula: 'Score(s, a) = v_a^T · W · h(s)',
        plainMeaning: '把动作向量 v_a 和投影后的状态向量 h(s) 算双线性点积，分值越高表示该动作在此处境下越吃香。'
      },
      {
        title: '2. 动作胜出概率推导',
        formula: 'P(Local 胜出) = σ( Score(s, Local) - Score(s, Keep) )',
        plainMeaning: '通过 Sigmoid 函数把局部分数减去整图分数的差值，转化为局部动作胜出的概率 (0~1 之间)。'
      },
      {
        title: '3. 成对排序对数损失 (Pairwise Logistic Loss)',
        formula: 'L_mf = - log σ( Score(s, a_win) - Score(s, a_loss) )',
        plainMeaning: '如果在这个样本中局部比整图好，就强行推高局部内积得分，压低整图内积得分。'
      }
    ],
    outputDetailed: {
      tensorShape: '动作打分差值标量 (Score_local - Score_keep) ∈ R',
      outputType: '双动作的相对优势分',
      decisionRule: '若 Score(s, Local) - Score(s, Keep) > 阈值门限 -> 追加局部；否则保留整图。'
    },
    pytorchCode: `class MatrixFactorizationRouter(nn.Module):
    def __init__(self, state_dim=768, embed_dim=64):
        super().__init__()
        self.state_proj = nn.Linear(state_dim, embed_dim)
        # 两个动作的嵌入向量: 0=keep, 1=local
        self.action_embed = nn.Embedding(2, embed_dim)
        self.W = nn.Linear(embed_dim, embed_dim, bias=False)

    def forward(self, state_feats):
        h = self.state_proj(state_feats) # [B, embed_dim]
        # 计算整图分与局部分
        score_keep = torch.sum(self.action_embed.weight[0] * self.W(h), dim=-1)
        score_local = torch.sum(self.action_embed.weight[1] * self.W(h), dim=-1)
        return score_local - score_keep # 输出分差`,
    pitfalls: '在目前只有两个固定动作（整图 vs 局部）时，矩阵分解在数学上等价于对 h(s) 做的线性分类器 (Logistic Regression)！必须在实验里加入线性回归对照，不能把名字叫得高大上就当成新能力。',
    priorityNote: '适合作为超低延迟（微秒级）部署基线，以及未来扩展到 5~10 种复杂多模态工具（OCR/超分/换图）时的统一表征框架。'
  },
  bert: {
    id: 'bert',
    title: '方法三：BERT 分类器 (BERT Classifier)',
    subtitle: '结构化审查单据阅读器 · 学术界最稳健标准范式',
    metaphor: '“审阅巡检单”：质检员快速读完一份标准单据（“任务：查左袖；整图：模糊；遮挡：无”），直接盖章：“有增益”、“无增益”或“负收益”。',
    inputDetailed: {
      rawInputText: `// 固定模板拼接的结构化序列：
"[CLS] 任务：判断明代女性外衣领口是否为立领。 [SEP] 
整图结果：未知。 [SEP] 
整图观察：袖口较小，边缘不清；无明确遮挡证据。 [SEP] 
对象范围：已指定一人；衣层：外衣；已调用：整图核验。 [SEP]"`,
      tensorShape: `• input_ids ∈ LongTensor [BatchSize, SeqLen] (SeqLen ≤ 256)
• attention_mask ∈ LongTensor [BatchSize, SeqLen]
• 经过预训练中文模型 (如 Chinese-RoBERTa-wwm-ext)`,
      featureBreakdown: [
        '每个字段固定顺序，防止理由过长挤掉核心遮挡信息',
        '提取 [CLS] 位置的语义聚合向量 h_[CLS] ∈ R^768',
        '接入 MLP 分类头或回归头'
      ]
    },
    mathFormulas: [
      {
        title: '1. [CLS] 特征聚合与三分类打分',
        formula: 'logits = W_cls · h_[CLS] + b_cls ∈ R^3',
        plainMeaning: '把 768 维的语义总结向量，投射为 3 个类别的未归一化打分：[正收益, 无收益/平局, 负收益]。'
      },
      {
        title: '2. 收益回归预测 (回归方案)',
        formula: 'Δ_hat = W_reg · Dropout( GELU( W_1 · h_[CLS] ) ) + b_reg',
        plainMeaning: '或者直接让回归头吐出一个连续实数数值，预测追加局部后能提多少分。'
      },
      {
        title: '3. 联合优化训练目标',
        formula: 'L_bert = Huber( Δ_hat, Δ ) + α · CrossEntropy( risk_hat, risk )',
        plainMeaning: '同时训练收益预测头与错误接受防暴雷风险头！'
      }
    ],
    outputDetailed: {
      tensorShape: '三分类概率向量 P ∈ R^3 或收益回归标量 Δ_hat ∈ R^1',
      outputType: 'P(LOCAL_WIN), P(TIE), P(LOCAL_LOSS) 或连续收益预期',
      decisionRule: '若 P(LOCAL_WIN) > P(LOCAL_LOSS) + 门槛阈值 -> 追加局部；否则保留整图。'
    },
    pytorchCode: `class BertRouter(nn.Module):
    def __init__(self, pretrained_model="hfl/chinese-roberta-wwm-ext"):
        super().__init__()
        self.bert = AutoModel.from_pretrained(pretrained_model)
        # 收益预测头 (回归 Δ)
        self.gain_head = nn.Sequential(
            nn.Linear(768, 128), nn.GELU(), nn.Linear(128, 1)
        )
        # 风险防范头 (二分类: 是否会致盲误判)
        self.risk_head = nn.Linear(768, 2)

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        cls_feat = outputs.last_hidden_state[:, 0, :] # [B, 768]
        pred_gain = self.gain_head(cls_feat)         # [B, 1]
        pred_risk = self.risk_head(cls_feat)         # [B, 2]
        return pred_gain.squeeze(-1), pred_risk`,
    pitfalls: 'BERT 极其容易“偷懒学套话”！如果整图大模型每次拿不准时都习惯说“难以确认”，BERT 可能会偷偷记住这四个字就一律盲目调用切图。必须做提示词脱敏和关键词遮蔽消融实验。',
    priorityNote: '🏆 本项目的核心学术骨干！结构清晰、顶会审稿人认可度极高，必须重点训练和对比。'
  },
  causal_llm: {
    id: 'causal_llm',
    title: '方法四：因果大模型分类器 (Causal LLM LoRA)',
    subtitle: '小参数开源大模型微调 · 限制输出受限 Token',
    metaphor: '“请资深专家裁决”：给 7B 开源大模型完整历史和决策指令，限制它只能吐出受限的决策单词（如 LOCAL_WIN）。',
    inputDetailed: {
      rawInputText: `System: 你是古代服饰考据系统的路由质检专家。根据当前证据状态，判断追加局部核验是否能带来正向收益。只输出一个单词：[LOCAL_WIN / TIE / LOCAL_LOSS]。
User: 
【当前状态】
任务：明代女性外衣左袖是否外扩
整图观察：袖口微小边缘不清，未见明确遮挡
已调用：整图初检
Assistant: [预测目标位置]`,
      tensorShape: `Prompt 序列经过因果大模型自回归 forward:
Token 嵌入矩阵与冻结参数 + 挂载在 Q/K/V 投影层的 LoRA 权重矩阵 (Rank = 8/16)`,
      featureBreakdown: [
        '主干大模型参数全部冻结 (Freeze)，不浪费显存',
        '仅训练低秩适应矩阵 A ∈ R^(r×d) 和 B ∈ R^(d×r)',
        '只关心最后一个生成位置上对应特定单词的 Logits'
      ]
    },
    mathFormulas: [
      {
        title: '1. 受限标签 Token 概率计算',
        formula: 'P(LOCAL_WIN) = exp( z_win ) / [ exp( z_win ) + exp( z_tie ) + exp( z_loss ) ]',
        plainMeaning: '不要让大模型自由生成几百字小作文！只提取词表中这三个专属标签 Token 的对数概率 z，强制做归一化比较。'
      },
      {
        title: '2. LoRA 梯度更新目标',
        formula: 'L_lora = - log P( Target_Token | Prompt )',
        plainMeaning: '通过交叉熵损失反向传播，只更新小小的 LoRA 权重，让模型对该处境下正确标签的预测概率最大化。'
      }
    ],
    outputDetailed: {
      tensorShape: '3 维受限标签概率分布 [P_win, P_tie, P_loss]',
      outputType: '大模型基于长指令推理得出的离散动作胜负概率',
      decisionRule: '若 P(LOCAL_WIN) 占据显著绝对优势 -> 追加局部；否则保留整图。'
    },
    pytorchCode: `# 基于 HuggingFace PEFT / LoRA 的受限 Token 分类头
from peft import LoraConfig, get_peft_model

lora_config = LoraConfig(
    r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05, bias="none", task_type="CAUSAL_LM"
)
model = get_peft_model(base_causal_model, lora_config)

# 仅抽取目标 Token 的 logits 进行损失计算
target_token_ids = [tokenizer.encode(tok)[-1] for tok in ["LOCAL_WIN", "TIE", "LOCAL_LOSS"]]
loss_fn = nn.CrossEntropyLoss()`,
    pitfalls: '大炮打蚊子警告！如果路由一次决策需要消耗 2 秒 GPU 显存和额外算力，而调用局部 VLM 才花 1.5 秒，那么“为了省钱而加的路由器”本身反而成了系统最大的性能负担！',
    priorityNote: '适合在算力充足时作为对照组，或者用来检验长历史上下文与复杂服饰专有规则对决策的提升。'
  }
};

export const RoutersDeepDive: React.FC = () => {
  const [activeRouter, setActiveRouter] = useState<RouterType>('similarity');
  const spec = DETAILED_SPECS[activeRouter];

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>硬核架构解构 · 输入、公式、张量与代码全盘公开</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            四大路由器技术规格书：看清张量维度与数学推导
          </h2>
          <p className="mt-2 text-stone-300 text-sm sm:text-base leading-relaxed">
            告别模糊的伪概念！在这里，我们把每个路由器的**输入字段（原始文本与张量形状）、中间层计算公式、最终决策准则以及对应 PyTorch 极简实现**一次性展现在你面前。
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
          {(Object.keys(DETAILED_SPECS) as RouterType[]).map((rId) => {
            const item = DETAILED_SPECS[rId];
            const isSelected = activeRouter === rId;
            return (
              <button
                key={rId}
                onClick={() => setActiveRouter(rId)}
                className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-stone-950/80 text-stone-300 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="text-xs opacity-75 font-mono">方法 0{Object.keys(DETAILED_SPECS).indexOf(rId) + 1}</div>
                <div className="text-sm font-bold mt-1 truncate">{item.title.split('：')[1].split(' ')[0]}</div>
                <div className={`text-[10px] mt-2 line-clamp-1 ${isSelected ? 'text-stone-900' : 'text-stone-400'}`}>
                  {item.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Spec Sheet */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-8">
        {/* Title & Metaphor */}
        <div className="border-b border-stone-800 pb-5">
          <div className="text-xs text-amber-400 font-bold uppercase tracking-wider font-mono">
            ARCHITECTURAL SPECIFICATION · {activeRouter.toUpperCase()}
          </div>
          <h3 className="text-2xl font-bold text-white font-serif mt-1">
            {spec.title}
          </h3>
          <p className="text-xs text-stone-400 mt-1">{spec.subtitle}</p>

          <div className="mt-4 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-200 font-medium">
            🗣️ <b>大白话比喻：</b>{spec.metaphor}
          </div>
        </div>

        {/* Section 1: Inputs & Tensor Shapes */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            1. 输入是什么？（原始数据格式与张量维度）
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                原始输入字段示例 (Raw Input String)
              </span>
              <pre className="font-mono text-[11px] text-stone-300 bg-stone-900 p-3 rounded-lg border border-stone-800/80 overflow-x-auto whitespace-pre-wrap">
                {spec.inputDetailed.rawInputText}
              </pre>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                数学张量维度 (Tensor Shapes)
              </span>
              <pre className="font-mono text-[11px] text-emerald-300 bg-stone-900 p-3 rounded-lg border border-stone-800/80 overflow-x-auto whitespace-pre-wrap">
                {spec.inputDetailed.tensorShape}
              </pre>
              <ul className="list-disc list-inside space-y-1 text-stone-400 text-[11px] pt-1">
                {spec.inputDetailed.featureBreakdown.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2: Mathematical Forward Formulas */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            2. 中间怎么计算？（前向推导核心公式，逐条拆解人话）
          </h4>
          <div className="space-y-3">
            {spec.mathFormulas.map((math, idx) => (
              <div key={idx} className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-200 font-serif text-xs">
                    {math.title}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">公式 0{idx + 1}</span>
                </div>
                <div className="font-mono text-sm text-amber-300 bg-stone-900 px-3 py-2 rounded border border-stone-800 overflow-x-auto font-bold">
                  {math.formula}
                </div>
                <div className="text-stone-400 text-[11px] flex items-start gap-1.5 pt-1">
                  <span className="text-amber-400 font-bold shrink-0">💡 人话白话含义：</span>
                  <span>{math.plainMeaning}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Output & Decision Rules */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-blue-400" />
            3. 输出是什么？（张量输出与最终二选一门限）
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 text-[10px] uppercase font-bold">输出张量形式</span>
              <div className="font-mono text-stone-200 font-bold text-xs">{spec.outputDetailed.tensorShape}</div>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 text-[10px] uppercase font-bold">物理业务意义</span>
              <div className="text-amber-300 font-medium text-xs">{spec.outputDetailed.outputType}</div>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 text-[10px] uppercase font-bold">最终裁定准则</span>
              <div className="text-emerald-300 font-medium text-xs">{spec.outputDetailed.decisionRule}</div>
            </div>
          </div>
        </div>

        {/* Section 4: PyTorch Reference Implementation */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            4. 落地代码参考（极简 PyTorch 模块，可直接抄进论文工程）
          </h4>
          <div className="relative bg-stone-950 rounded-xl border border-stone-800 overflow-hidden text-xs">
            <div className="bg-stone-900 px-4 py-2 border-b border-stone-800 flex items-center justify-between text-stone-400 text-[11px] font-mono">
              <span>models/router_{activeRouter}.py</span>
              <span className="text-amber-400">PyTorch 2.0+</span>
            </div>
            <pre className="p-4 font-mono text-[11px] text-stone-300 overflow-x-auto leading-relaxed">
              {spec.pytorchCode}
            </pre>
          </div>
        </div>

        {/* Warnings & Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="bg-rose-950/20 p-4 rounded-xl border border-rose-900/40 space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> 方案明确警告的陷阱
            </div>
            <p className="text-rose-200/90 leading-relaxed text-[11px]">
              {spec.pitfalls}
            </p>
          </div>

          <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/40 space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 实战建议与推荐度
            </div>
            <p className="text-emerald-200/90 leading-relaxed text-[11px]">
              {spec.priorityNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

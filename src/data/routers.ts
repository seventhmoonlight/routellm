import { RouterInfo } from '../types';

export const ROUTER_INFOS: Record<string, RouterInfo> = {
  similarity: {
    id: 'similarity',
    name: '相似度加权 (Similarity / kNN-BT)',
    chineseName: '经验老档案检索（同病相怜近邻参考）',
    metaphor: '“找既往病历”：遇到模糊领口，不看衣服好不好看，而是去历史库查“以前遇到类似模糊且无遮挡的领口，放大看之后是赚了还是赔了”。',
    coreIdea: '借用 RouteLLM 中的 Bradley-Terry 相似度加权算法。不是找同款服装，而是计算“处境相似度”（文本描述、整图观察、遮挡状态）。找到最相似的 k 个历史案例，加权推算追加局部核验的期望净收益。',
    inputFormat: 'S(s, s_i) = α·S_text + β·S_image + γ·S_state，再经 Softmax(S/τ) 得到近邻权重 w_i。',
    algorithmSummary: 'Δ_hat = Σ(w_i · Δ_i)。若 Δ_hat - λ·Cost > 0 且邻居支持度充分，则触发追加局部；否则保留现状。',
    trainingCost: '极低',
    inferenceSpeed: '快（毫秒级）',
    interpretability: '极高（案例直观）',
    riskFactor: '如果库中没有相似处境的案例，切忌硬套；需要设定“近邻距离阈值”，距离太远时回退到安全默认策略。',
    suitability: '最适合作为冷启动首选基线！无需训练庞大模型，天然可解释，每一步都能把参考的历史卡片打印给用户看。'
  },
  mf: {
    id: 'mf',
    name: '矩阵分解 (Matrix Factorization, MF)',
    chineseName: '处境与动作的低维契合度打分',
    metaphor: '“推荐算法猜喜好”：把无数种图片状态压缩成一条小向量，把“保留整图”和“切局部”也变成两条向量。算它们点积，看哪个动作和当前状态最搭。',
    coreIdea: '借鉴推荐系统的协同过滤思想。将特征状态映射为稠密嵌入向量 h(s)，将动作表示为可训练嵌入向量 v_a。模型学习得分函数 S(s, a) = v_a^T · W · h(s)。',
    inputFormat: '状态向量 h(s) ∈ R^d 与动作向量 v_keep, v_local ∈ R^k，通过双线性投影矩阵 W 计算。',
    algorithmSummary: '通过成对排序损失 (Pairwise Logistic Loss) 优化：当某状态下局部明显优于整图时，拉高 v_local 在该状态下的内积，压低 v_keep。',
    trainingCost: '低',
    inferenceSpeed: '极快（矩阵乘法）',
    interpretability: '低（黑盒隐向量）',
    riskFactor: '在当前只有 2 个固定动作（整图 vs 局部）时，矩阵分解本质上等价于线性分类器 (Logistic Regression)！必须加入线性回归作为对照，不能被高大上的名字唬住。',
    suitability: '适合极低延迟场景，以及未来扩充到 5~10 种视觉动作（如“先重定位”、“查来源”、“超分辨率”、“OCR”）时的统一动作库。'
  },
  bert: {
    id: 'bert',
    name: 'BERT 分类器 (BERT Classifier)',
    chineseName: '严谨的质检员读文字审查报告',
    metaphor: '“审阅巡检单”：质检员快速读完一份标准单据（“任务：查左袖；整图：模糊；遮挡：无”），直接在表头上盖章：“有增益”、“无增益”或“负收益”。',
    coreIdea: '使用轻量中文预训练模型（如 RoBERTa-wwm / Chinese-BERT）。把整图输出的结构化文字（任务、观察、遮挡、衣层）拼接成固定模板序列，输入编码器，利用 [CLS] 向量接分类头输出概率。',
    inputFormat: '“任务：[条件] | 整图结果：[结果] | 观察：[观察简述] | 对象：[人物/侧别/衣层]”',
    algorithmSummary: '输出三分类概率 P(正收益), P(无收益), P(负收益)，或直接回归收益数值 Δ_hat。损失采用加权 Huber 损失 + 错误接受交叉熵。',
    trainingCost: '中等',
    inferenceSpeed: '中等',
    interpretability: '中（注意力热力）',
    riskFactor: '极其容易“投机取巧”学到提示词的口癖！例如如果整图模型常说“难以确认”，BERT 可能盲目记住这四个字就下令调用，而不是真正理解了视觉物理遮挡。需要做词汇扰动消融实验。',
    suitability: '学术界最标准、效果最扎实的判别式路由器基线。结构清晰，泛化能力强。'
  },
  causal_llm: {
    id: 'causal_llm',
    name: '因果大模型分类器 (Causal LLM Router / LoRA)',
    chineseName: '深思熟虑的带指令推理大模型',
    metaphor: '“请资深专家裁决”：给一个小参数开源大模型（如 Qwen-2.5-7B）一段完整的背景和决策指令，限制它只能吐出受限的决策 Token（如 LOCAL_WIN / TIE / LOCAL_LOSS）。',
    coreIdea: '在小型开源因果模型上做 LoRA 微调。不仅能吸收结构化状态，还能处理长历史对话、多步工具轨迹和复杂的服装专业先验知识。',
    inputFormat: '系统 Prompt + 状态描述上下文 -> 预测固定受限词表中的 Token 概率分布。',
    algorithmSummary: '通过反向传播微调 LoRA 秩矩阵（Rank 8/16），确保输出标签的对数似然最大化。可顺带生成可解释性理由用于事后人工排查。',
    trainingCost: '较高',
    inferenceSpeed: '较慢（显存大）',
    interpretability: '高（自然语言生成）',
    riskFactor: '大炮打蚊子风险！如果路由一个局部核验要花 3 秒钟大模型推理时间加 1000 个 Token 费用，那么“为了省钱而加的路由器”本身反而成了最大的成本黑洞！',
    suitability: '适合处理跨文献章节、多实体复杂长文本约束的顶层决策，或作为轻量路由器的教师模型（Teacher）。'
  }
};

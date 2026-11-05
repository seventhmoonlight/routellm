import { RoadmapStep } from '../types';

export const ROADMAP_STEPS: RoadmapStep[] = [
  {
    step: 1,
    title: '协议冻结与防泄漏边界划分',
    deliverable: '数据结构 Schema、损失函数惩罚真值表、特征防泄漏单元测试代码。',
    keyRule: '严禁将“尚未执行的局部框位置、局部核验清晰度、局部真实答案”打包进路由器的输入特征。',
    pitfallToAvoid: '把未来信息当成先验输入，导致离线评估虚假达到 99% 准确率。',
    status: 'ready'
  },
  {
    step: 2,
    title: '历史轨迹入库与真值来源对齐',
    deliverable: '版本化轨迹数据库（保留未核验标注为 null，不乱填 0）、强监督文献清单。',
    keyRule: '分清“模型自己的信心”与“真实客观真理 (Gold Truth)”。',
    pitfallToAvoid: '把模型过去的自言自语直接当作无偏真值来训练下个模型。',
    status: 'in_progress'
  },
  {
    step: 3,
    title: '自动化试采 100~200 个状态样本',
    deliverable: '首批双路径运行日志：强/弱/未知标签覆盖率统计、真实 API 失败与网络延迟分布报告。',
    keyRule: '即使 API 超时崩溃或裁图失败，也必须如实当作“操作失败样本”记入日志，绝不能手工悄悄删掉！',
    pitfallToAvoid: '只挑挑拣拣留下一看就很完美的样本，掩盖上游定位模型的天然崩溃率。',
    status: 'planned'
  },
  {
    step: 4,
    title: '搭建相似度收益基线与加权 BT 模型',
    deliverable: 'kNN 相似度检索器、加权 Bradley-Terry 求解器、调用阈值质量-成本权衡曲线。',
    keyRule: '每次做出“追加局部”决定时，系统必须能把“参考了哪 5 张历史相似案例”明确打印出来。',
    pitfallToAvoid: '将同款衣服（视觉外观）等同于相似处境；忽略遮挡特征。',
    status: 'planned'
  },
  {
    step: 5,
    title: '扩充数据至千级并训练 BERT 判别器',
    deliverable: '3 组随机种子训练的中文 BERT 路由分类器权重、跨提示词版本泛化对照表。',
    keyRule: '做“问题文本 BERT” vs “状态文本 BERT” 的消融实验，验证引入视觉观察状态的净贡献。',
    pitfallToAvoid: 'BERT 偷偷记住了整图模型的套话（如“难以确认”），导致对新提问模板瞬间失灵。',
    status: 'planned'
  },
  {
    step: 6,
    title: '双头架构：收益回归 + 归属风险抑制',
    deliverable: '联合损失函数训练模型、同覆盖率下错误接受率降低实验记录。',
    keyRule: '不仅要预测“能不能提高准确率”，还要给“错人/错侧/错衣层”单独加惩罚头。',
    pitfallToAvoid: '为了贪图覆盖率，导致把丫鬟的立领安到了主母身上。',
    status: 'planned'
  },
  {
    step: 7,
    title: '跨文献、跨版型盲测与泛化验收',
    deliverable: '跨文献独立测试集上的 PGR、APGR、CPT(80%) 严谨度量报告、错误案例归因卡片。',
    keyRule: '测试集严禁包含任何同书、同图的衍生切片！必须以整本原始古籍为单位分组。',
    pitfallToAvoid: '同一张古画裁成 3 个局部分别放进训练集和测试集，造成严重的跨图记忆作弊。',
    status: 'planned'
  },
  {
    step: 8,
    title: '端到端接入服饰缺图卡补全 Agent',
    deliverable: '上线运行的缺图卡修复智能体：自动引用原图来源页、附带置信度与证据链。',
    keyRule: '输出结果必须标注文献书名、页码、核验路径（整图判定 / 局部特写判定 / 存疑保留）。',
    pitfallToAvoid: '缺少引用来源页，导致学者无法二次核验。',
    status: 'planned'
  }
];

export const FIVE_STEP_DATA_PIPELINE = [
  {
    num: '1',
    title: '来源归档与去重分组',
    desc: '从海量 PDF 中提取图片，生成图像 Hash。以“原始文献图”为根节点进行严格分组，防止同图切片被拆分到训练和测试两头。'
  },
  {
    num: '2',
    title: '自动生成规范条件',
    desc: '利用服饰专著的权威文字，解析出结构化提问（必须严格绑定：人物主体、画面左/右侧、内衬/外衣层级）。'
  },
  {
    num: '3',
    title: '建立三层参照真值',
    desc: '第一层强监督（专家手标）；第二层证据监督（图文明确对应）；第三层弱监督（多模型一致性投票与一致性打折）。'
  },
  {
    num: '4',
    title: '真实执行两条对照路径',
    desc: '路径 A：仅保留整图大模型判断；路径 B：调用定位裁图模型 + 局部高分辨率细粒度核验。真实记录 API 费用、耗时及失败。'
  },
  {
    num: '5',
    title: '数学计算收益与防泄露过滤',
    desc: '根据损失公式计算真实收益 Δ = Loss(整图) - Loss(局部)。去除未来字段后，沉淀为标准格式的训练样本。'
  }
];

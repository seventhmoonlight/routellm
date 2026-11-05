export type NavigationTab = 
  | 'guide' 
  | 'workflow'
  | 'routers' 
  | 'simulator' 
  | 'metrics' 
  | 'pipeline' 
  | 'jargon' 
  | 'faq';

export interface CostumeCase {
  id: string;
  name: string;
  period: string;
  condition: string;
  targetObject: string;
  clothingLayer: string; // e.g., 外衣 / 内衬
  side: string; // 画面左侧 / 右侧
  fullImageObs: string;
  visibility: 'clear' | 'tiny' | 'occluded' | 'ambiguous';
  targetRatio: number; // % of image, e.g. 3% vs 45%
  isOccluded: boolean;
  occlusionReason?: string;
  fullImageResult: 'match' | 'mismatch' | 'unknown';
  groundTruthLocalOutcome: 'corrects_to_match' | 'corrects_to_mismatch' | 'still_unknown' | 'misleads_to_error';
  qualityGainDelta: number; // e.g. +2, 0, -2
  localCheckCost: number; // e.g. 0.08 normalized cost
  recommendedAction: 'keep_full' | 'add_local';
  storyAnalogy: string;
}

export type RouterType = 'similarity' | 'mf' | 'bert' | 'causal_llm';

export interface RouterInfo {
  id: RouterType;
  name: string;
  chineseName: string;
  metaphor: string;
  coreIdea: string;
  inputFormat: string;
  algorithmSummary: string;
  trainingCost: '极低' | '低' | '中等' | '较高';
  inferenceSpeed: '快（毫秒级）' | '极快（矩阵乘法）' | '中等' | '较慢（显存大）';
  interpretability: '极高（案例直观）' | '低（黑盒隐向量）' | '中（注意力热力）' | '高（自然语言生成）';
  riskFactor: string;
  suitability: string;
}

export interface JargonTerm {
  term: string;
  originalContext: string;
  plainChinese: string;
  realWorldAnalogy: string;
  pitfallWarning: string;
  category: 'core' | 'math' | 'data' | 'system';
}

export interface RoadmapStep {
  step: number;
  title: string;
  deliverable: string;
  keyRule: string;
  pitfallToAvoid: string;
  status: 'ready' | 'in_progress' | 'planned';
}

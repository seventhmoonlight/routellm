/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationTab } from './types';
import { Navbar } from './components/Navbar';
import { PlainGuideView } from './components/PlainGuideView';
import { GlobalWorkflowAndLoss } from './components/GlobalWorkflowAndLoss';
import { DecisionSimulator } from './components/DecisionSimulator';
import { RoutersDeepDive } from './components/RoutersDeepDive';
import { MetricsLab } from './components/MetricsLab';
import { DataPipelineView } from './components/DataPipelineView';
import { JargonDictionary } from './components/JargonDictionary';
import { FaqAssistant } from './components/FaqAssistant';
import { BookOpen, Sparkles, Compass, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('guide');

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Navigation */}
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'guide' && <PlainGuideView onNavigate={setCurrentTab} />}
        {currentTab === 'workflow' && <GlobalWorkflowAndLoss />}
        {currentTab === 'routers' && <RoutersDeepDive />}
        {currentTab === 'simulator' && <DecisionSimulator />}
        {currentTab === 'metrics' && <MetricsLab />}
        {currentTab === 'pipeline' && <DataPipelineView />}
        {currentTab === 'jargon' && <JargonDictionary />}
        {currentTab === 'faq' && <FaqAssistant />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-850 bg-stone-900/60 mt-auto py-8 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="font-serif font-bold text-stone-300">服饰文摘核验路由方案 · 交互式教学与科研透析平台</span>
          </div>
          <div className="flex items-center space-x-4 text-stone-500">
            <span>理论依托: RouteLLM (LMSYS) 质量-成本权衡框架</span>
            <span>·</span>
            <span>方案日期: 2026-11-05</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

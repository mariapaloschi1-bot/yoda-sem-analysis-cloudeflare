// components/Dashboard.tsx - Dashboard con Tema Yoda Completo
'use client';

import { AnalysisResult } from '@/lib/analyzer';
import { exportToCSV } from '@/lib/analyzer';
import { useState } from 'react';

interface DashboardProps {
  results: AnalysisResult;
}

export default function Dashboard({ results }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'insights' | 'charts'>('overview');
  const { results: keywords, insights, summary } = results;

  // 📊 Calcolo statistiche
  const competitionDistribution = {
    low: keywords.filter(k => k.metrics.competition < 0.3).length,
    medium: keywords.filter(k => k.metrics.competition >= 0.3 && k.metrics.competition < 0.7).length,
    high: keywords.filter(k => k.metrics.competition >= 0.7).length
  };

  const volumeDistribution = {
    veryLow: keywords.filter(k => k.metrics.search_volume < 100).length,
    low: keywords.filter(k => k.metrics.search_volume >= 100 && k.metrics.search_volume < 1000).length,
    medium: keywords.filter(k => k.metrics.search_volume >= 1000 && k.metrics.search_volume < 10000).length,
    high: keywords.filter(k => k.metrics.search_volume >= 10000).length
  };

  const cpcDistribution = {
    low: keywords.filter(k => k.metrics.cpc < 1).length,
    medium: keywords.filter(k => k.metrics.cpc >= 1 && k.metrics.cpc < 3).length,
    high: keywords.filter(k => k.metrics.cpc >= 3).length
  };

  // 💰 Budget totale stimato (CTR 2%)
  const totalBudget = keywords.reduce((sum, k) => {
    const clicks = k.metrics.search_volume * 0.02;
    return sum + (clicks * k.metrics.cpc);
  }, 0);

  // 📥 Export CSV/JSON
  const handleExportCSV = () => {
    const csv = exportToCSV(keywords);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `yoda-seo-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `yoda-seo-analysis-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // 🎨 Stile raccomandazioni con tema Yoda
  const getRecommendationStyle = (rec: string) => {
    switch (rec) {
      case 'YES_PAID':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          label: 'Investi in Paid',
          icon: '💰'
        };
      case 'NO_PAID':
        return {
          bg: 'bg-teal-500/10',
          border: 'border-teal-500/30',
          text: 'text-teal-400',
          label: 'Focus su SEO',
          icon: '🌱'
        };
      case 'TEST':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          text: 'text-purple-400',
          label: 'Test con budget',
          icon: '🧪'
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/30',
          text: 'text-gray-400',
          label: 'Sconosciuto',
          icon: '❓'
        };
    }
  };

  return (
    <div className="min-h-screen bg-stardust text-gray-100">
      {/* Header con tema Yoda */}
      <div className="border-b border-teal-500/20 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl yoda-pulse">🧙</div>
              <div>
                <h1 className="text-2xl font-bold text-teal-400">Yoda SEO Dashboard</h1>
                <p className="text-sm text-gray-400 mt-1">
                  {summary.totalKeywords} keywords • Budget stimato: <span className="text-amber-400 font-semibold">€{totalBudget.toFixed(2)}/mese</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 rounded-lg text-sm font-medium transition-all glow-teal flex items-center gap-2"
              >
                📊 Esporta CSV
              </button>
              <button
                onClick={handleExportJSON}
                className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                📦 Esporta JSON
              </button>
            </div>
          </div>

          {/* Tabs con tema Yoda */}
          <div className="flex gap-4 mt-6">
            {[
              { id: 'overview', label: 'Panoramica', icon: '📊' },
              { id: 'keywords', label: 'Keywords', icon: '🔑' },
              { id: 'insights', label: 'Insights AI', icon: '🤖' },
              { id: 'charts', label: 'Grafici', icon: '📈' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-500/20 text-teal-400 border-b-2 border-teal-500'
                    : 'text-gray-400 hover:text-teal-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* TAB: Panoramica */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCard
                title="Keywords Totali"
                value={summary.totalKeywords}
                icon="🔑"
                color="text-teal-400"
                bgColor="bg-teal-500/10"
              />
              <SummaryCard
                title="Investi in Paid"
                value={summary.yes_paid}
                subtitle={`${((summary.yes_paid / summary.totalKeywords) * 100).toFixed(0)}%`}
                icon="💰"
                color="text-amber-400"
                bgColor="bg-amber-500/10"
              />
              <SummaryCard
                title="Focus su SEO"
                value={summary.no_paid}
                subtitle={`${((summary.no_paid / summary.totalKeywords) * 100).toFixed(0)}%`}
                icon="🌱"
                color="text-teal-400"
                bgColor="bg-teal-500/10"
              />
              <SummaryCard
                title="Test Budget"
                value={summary.test}
                subtitle={`${((summary.test / summary.totalKeywords) * 100).toFixed(0)}%`}
                icon="🧪"
                color="text-purple-400"
                bgColor="bg-purple-500/10"
              />
            </div>

            {/* Budget Card */}
            <div className="bg-gradient-to-r from-teal-500/10 to-purple-500/10 border border-teal-500/30 rounded-xl p-6 glow-teal">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-1">💸 Budget Mensile Stimato</h3>
                  <p className="text-4xl font-bold text-amber-400">€{totalBudget.toFixed(2)}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    CTR 2% • CPC medio: €{(keywords.reduce((sum, k) => sum + k.metrics.cpc, 0) / keywords.length).toFixed(2)}
                  </p>
                </div>
                <div className="text-6xl opacity-20">💰</div>
              </div>
            </div>

            {/* Top Keywords */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <KeywordListCard
                title="🔥 Top Paid"
                keywords={keywords.filter(k => k.recommendation === 'YES_PAID').slice(0, 5)}
                emptyMessage="Nessuna"
                color="amber"
              />
              <KeywordListCard
                title="🌿 Top SEO"
                keywords={keywords.filter(k => k.recommendation === 'NO_PAID').slice(0, 5)}
                emptyMessage="Nessuna"
                color="teal"
              />
              <KeywordListCard
                title="🔬 Top Test"
                keywords={keywords.filter(k => k.recommendation === 'TEST').slice(0, 5)}
                emptyMessage="Nessuna"
                color="purple"
              />
            </div>
          </div>
        )}

        {/* TAB: Keywords */}
        {activeTab === 'keywords' && (
          <div className="bg-slate-900/50 border border-teal-500/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-teal-500/10 border-b border-teal-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-teal-400 uppercase">Keyword</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-teal-400 uppercase">Volume</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-teal-400 uppercase">CPC</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-teal-400 uppercase">Competition</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-teal-400 uppercase">Advertisers</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-teal-400 uppercase">Raccomandazione</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-teal-400 uppercase">Budget/mese</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {keywords.map((keyword, idx) => {
                    const style = getRecommendationStyle(keyword.recommendation || '');
                    const monthlyBudget = keyword.metrics.search_volume * 0.02 * keyword.metrics.cpc;
                    return (
                      <tr key={idx} className="hover:bg-teal-500/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{keyword.keyword}</td>
                        <td className="px-6 py-4 text-gray-300">{keyword.metrics.search_volume.toLocaleString()}</td>
                        <td className="px-6 py-4 text-amber-400 font-medium">€{keyword.metrics.cpc.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  keyword.metrics.competition < 0.3 ? 'bg-teal-500' :
                                  keyword.metrics.competition < 0.7 ? 'bg-purple-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${keyword.metrics.competition * 100}%` }}
                              />
                            </div>
                            <span className="text-gray-400 text-sm">{(keyword.metrics.competition * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{keyword.advertisers.length}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${style.bg} ${style.border} ${style.text} border`}>
                            {style.icon} {style.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-purple-400 font-medium">€{monthlyBudget.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Insights AI */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <InsightCard title="📖 Strategia Generale" content={insights.summary} color="purple" />
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-teal-400 mb-4">⚡ Raccomandazioni</h3>
              <ul className="space-y-2">
                {insights.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <span className="text-teal-400">✓</span> {rec}
                  </li>
                ))}
              </ul>
            </div>
            <InsightCard title="💰 Budget Estimate" content={insights.budget_estimate} color="amber" />
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4">🎯 Priority Keywords</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {insights.priority_keywords.map((kw, idx) => (
                  <div key={idx} className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-3 text-center text-white font-medium">
                    {kw}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Grafici */}
        {activeTab === 'charts' && (
          <div className="space-y-6">
            {/* Pie Chart */}
            <div className="bg-slate-900/50 border border-teal-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-teal-400 mb-6">📊 Distribuzione Raccomandazioni</h3>
              <div className="flex items-center justify-center gap-8">
                <div className="relative w-64 h-64">
                  <svg viewBox="0 0 200 200" className="transform -rotate-90">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#fbbf24" strokeWidth="40"
                      strokeDasharray={`${(summary.yes_paid / summary.totalKeywords) * 502.65} 502.65`} />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#2dd4bf" strokeWidth="40"
                      strokeDasharray={`${(summary.no_paid / summary.totalKeywords) * 502.65} 502.65`}
                      strokeDashoffset={`-${(summary.yes_paid / summary.totalKeywords) * 502.65}`} />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#a78bfa" strokeWidth="40"
                      strokeDasharray={`${(summary.test / summary.totalKeywords) * 502.65} 502.65`}
                      strokeDashoffset={`-${((summary.yes_paid + summary.no_paid) / summary.totalKeywords) * 502.65}`} />
                  </svg>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-amber-500 rounded"></div>
                    <span className="text-gray-300">Paid: {summary.yes_paid} ({((summary.yes_paid / summary.totalKeywords) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-teal-500 rounded"></div>
                    <span className="text-gray-300">SEO: {summary.no_paid} ({((summary.no_paid / summary.totalKeywords) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-gray-300">Test: {summary.test} ({((summary.test / summary.totalKeywords) * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 border border-teal-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-400 mb-4">Competition</h3>
                <div className="space-y-3">
                  <BarChart label="Bassa" value={competitionDistribution.low} max={summary.totalKeywords} color="bg-teal-500" />
                  <BarChart label="Media" value={competitionDistribution.medium} max={summary.totalKeywords} color="bg-purple-500" />
                  <BarChart label="Alta" value={competitionDistribution.high} max={summary.totalKeywords} color="bg-amber-500" />
                </div>
              </div>
              <div className="bg-slate-900/50 border border-teal-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-400 mb-4">Volume</h3>
                <div className="space-y-3">
                  <BarChart label="<100" value={volumeDistribution.veryLow} max={summary.totalKeywords} color="bg-gray-500" />
                  <BarChart label="100-1K" value={volumeDistribution.low} max={summary.totalKeywords} color="bg-teal-500" />
                  <BarChart label="1K-10K" value={volumeDistribution.medium} max={summary.totalKeywords} color="bg-purple-500" />
                  <BarChart label=">10K" value={volumeDistribution.high} max={summary.totalKeywords} color="bg-amber-500" />
                </div>
              </div>
              <div className="bg-slate-900/50 border border-teal-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-400 mb-4">CPC</h3>
                <div className="space-y-3">
                  <BarChart label="<€1" value={cpcDistribution.low} max={summary.totalKeywords} color="bg-teal-500" />
                  <BarChart label="€1-€3" value={cpcDistribution.medium} max={summary.totalKeywords} color="bg-purple-500" />
                  <BarChart label=">€3" value={cpcDistribution.high} max={summary.totalKeywords} color="bg-amber-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 📦 Helper Components
function SummaryCard({ title, value, subtitle, icon, color, bgColor }: {
  title: string; value: number; subtitle?: string; icon: string; color: string; bgColor: string;
}) {
  return (
    <div className={`${bgColor} border border-teal-500/20 rounded-xl p-6 hover:border-teal-500/40 transition-all`}>
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        {subtitle && <span className="text-sm text-gray-400">{subtitle}</span>}
      </div>
    </div>
  );
}

function KeywordListCard({ title, keywords, emptyMessage, color }: {
  title: string; keywords: any[]; emptyMessage: string; color: 'amber' | 'teal' | 'purple';
}) {
  const colorClasses = {
    amber: 'border-amber-500/30 bg-amber-500/5',
    teal: 'border-teal-500/30 bg-teal-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5'
  };

  return (
    <div className={`bg-slate-900/50 border ${colorClasses[color]} rounded-xl p-6`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {keywords.length === 0 ? (
        <p className="text-gray-400 text-sm">{emptyMessage}</p>
      ) : (
        <ul className="space-y-3">
          {keywords.map((kw, idx) => (
            <li key={idx} className="border-b border-gray-700/30 pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-1">
                <span className="text-white font-medium">{kw.keyword}</span>
                <span className="text-amber-400 text-sm">€{kw.metrics.cpc.toFixed(2)}</span>
              </div>
              <div className="flex gap-4 text-xs text-gray-400">
                <span>Vol: {kw.metrics.search_volume.toLocaleString()}</span>
                <span>Comp: {(kw.metrics.competition * 100).toFixed(0)}%</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InsightCard({ title, content, color }: { title: string; content: string; color: 'amber' | 'teal' | 'purple'; }) {
  const colorClasses = {
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    teal: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-6`}>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{content}</p>
    </div>
  );
}

function BarChart({ label, value, max, color }: { label: string; value: number; max: number; color: string; }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

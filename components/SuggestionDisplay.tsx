
import React, { useState } from 'react';
import type { AnalysisResult, Suggestion } from '../types';

type CategoryKey = keyof AnalysisResult;

const categoryConfig: Record<CategoryKey, { name: string; icon: string; color: string }> = {
  html: { name: 'HTML', icon: 'fa-brands fa-html5', color: 'text-orange-400' },
  css: { name: 'CSS', icon: 'fa-brands fa-css3-alt', color: 'text-blue-400' },
  javascript: { name: 'JavaScript', icon: 'fa-brands fa-js', color: 'text-yellow-400' },
  ui_ux: { name: 'UI/UX', icon: 'fa-solid fa-palette', color: 'text-purple-400' },
  performance: { name: 'Performance', icon: 'fa-solid fa-bolt', color: 'text-green-400' },
  accessibility: { name: 'Accessibility', icon: 'fa-solid fa-universal-access', color: 'text-pink-400' },
};

const SuggestionCard: React.FC<{ suggestion: Suggestion }> = ({ suggestion }) => {
  return (
    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
      <h4 className="font-semibold text-white mb-2">{suggestion.title}</h4>
      <p className="text-gray-300 text-sm mb-3">{suggestion.description}</p>
      {suggestion.codeSnippet && (
        <pre className="bg-gray-900/70 p-3 rounded-md text-xs font-mono text-cyan-300 overflow-x-auto">
          <code>{suggestion.codeSnippet.replace(/\\`\\`\\`/g, '```')}</code>
        </pre>
      )}
    </div>
  );
};


const SuggestionCategory: React.FC<{ categoryKey: CategoryKey; suggestions: Suggestion[] }> = ({ categoryKey, suggestions }) => {
    const [isOpen, setIsOpen] = useState(true);
    const config = categoryConfig[categoryKey];

    if (!suggestions || suggestions.length === 0) {
        return null;
    }

    return (
        <div className="mb-4">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="flex items-center gap-3">
                    <i className={`${config.icon} ${config.color} text-xl`}></i>
                    <h3 className="text-lg font-bold text-gray-100">{config.name} ({suggestions.length})</h3>
                </div>
                <i className={`fa-solid fa-chevron-down transform transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            {isOpen && (
                 <div className="mt-3 pl-4 border-l-2 border-gray-600 space-y-4">
                    {suggestions.map((s, index) => <SuggestionCard key={index} suggestion={s} />)}
                </div>
            )}
        </div>
    )
}

const SuggestionDisplay: React.FC<{ suggestions: AnalysisResult }> = ({ suggestions }) => {
  const categories = Object.keys(suggestions) as CategoryKey[];
  const totalSuggestions = categories.reduce((acc, key) => acc + (suggestions[key]?.length || 0), 0);

  if (totalSuggestions === 0) {
      return (
         <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400">
            <i className="fa-solid fa-circle-check text-6xl text-green-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-300">Great Job!</h3>
            <p className="mt-2 max-w-sm">The AI didn't find any specific areas for improvement based on your goal. Your code looks solid!</p>
         </div>
      )
  }

  return (
    <div className="space-y-6">
      {categories.map(key => (
        <SuggestionCategory key={key} categoryKey={key} suggestions={suggestions[key]} />
      ))}
    </div>
  );
};

export default SuggestionDisplay;

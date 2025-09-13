
import React, { useState, useCallback, useEffect } from 'react';
import { getWebsiteSuggestions } from './services/geminiService';
import type { AnalysisResult } from './types';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import Loader from './components/Loader';
import SuggestionDisplay from './components/SuggestionDisplay';
import Preview from './components/Preview';

const App: React.FC = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [improvementGoal, setImprovementGoal] = useState('Make it more modern and improve accessibility.');
  const [suggestions, setSuggestions] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'preview'>('suggestions');

  const [debouncedHtml, setDebouncedHtml] = useState('');
  const [debouncedCss, setDebouncedCss] = useState('');
  const [debouncedJs, setDebouncedJs] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
        setDebouncedHtml(htmlCode);
        setDebouncedCss(cssCode);
        setDebouncedJs(jsCode);
    }, 500); // 500ms debounce

    return () => {
        clearTimeout(handler);
    };
  }, [htmlCode, cssCode, jsCode]);


  const handleAnalyze = useCallback(async () => {
    if (!htmlCode && !cssCode && !jsCode) {
      setError('Please provide some code to analyze.');
      return;
    }
    if (!improvementGoal) {
        setError('Please specify your improvement goal.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    setActiveTab('suggestions');

    try {
      const result = await getWebsiteSuggestions(htmlCode, cssCode, jsCode, improvementGoal);
      setSuggestions(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while analyzing the code. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [htmlCode, cssCode, jsCode, improvementGoal]);

  const tabButtonBase = "py-3 px-5 font-semibold text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-t-lg flex items-center gap-2";
  const activeTabClass = "text-white border-b-2 border-cyan-400 bg-gray-800";
  const inactiveTabClass = "text-gray-400 hover:text-white hover:bg-gray-700/50";

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col gap-6 sticky top-8">
          <h2 className="text-2xl font-bold text-cyan-400">Your Website Code</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CodeInput language="HTML" value={htmlCode} onChange={setHtmlCode} placeholder="Paste your HTML here..." />
              <CodeInput language="CSS" value={cssCode} onChange={setCssCode} placeholder="Paste your CSS here..." />
          </div>
          <CodeInput language="JavaScript" value={jsCode} onChange={setJsCode} placeholder="Paste your JavaScript here..." />
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-300 mb-2">Improvement Goal</label>
            <input
              id="goal"
              type="text"
              value={improvementGoal}
              onChange={(e) => setImprovementGoal(e.target.value)}
              placeholder="e.g., Improve performance and UI/UX"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader />
                Analyzing...
              </>
            ) : (
                <>
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                Analyze Website
                </>
            )}
          </button>
          {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 min-h-[50vh] flex flex-col">
            <div className="flex border-b border-gray-700 -mt-6 -mx-6 mb-6 px-4" role="tablist" aria-label="Analysis Tabs">
                <button
                onClick={() => setActiveTab('suggestions')}
                className={`${tabButtonBase} ${activeTab === 'suggestions' ? activeTabClass : inactiveTabClass}`}
                aria-selected={activeTab === 'suggestions'}
                role="tab"
                >
                <i className="fa-solid fa-lightbulb"></i>
                AI Suggestions
                </button>
                <button
                onClick={() => setActiveTab('preview')}
                className={`${tabButtonBase} ${activeTab === 'preview' ? activeTabClass : inactiveTabClass}`}
                aria-selected={activeTab === 'preview'}
                role="tab"
                >
                <i className="fa-solid fa-eye"></i>
                Live Preview
                </button>
            </div>
            <div className="flex-grow" role="tabpanel">
                {activeTab === 'suggestions' && (
                    <>
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <Loader />
                            <p className="text-lg mt-4 font-semibold text-gray-300">AI is analyzing your code...</p>
                            <p className="text-gray-400 mt-2">This might take a moment.</p>
                        </div>
                    )}
                    {!isLoading && !suggestions && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400">
                            <i className="fa-solid fa-lightbulb text-6xl text-gray-600 mb-4"></i>
                            <h3 className="text-xl font-semibold text-gray-300">Ready for insights?</h3>
                            <p className="mt-2 max-w-sm">Paste your code and define your goal on the left, then click "Analyze Website" to get AI-powered improvement suggestions.</p>
                        </div>
                    )}
                    {suggestions && <SuggestionDisplay suggestions={suggestions} />}
                    </>
                )}
                 {activeTab === 'preview' && (
                    <Preview html={debouncedHtml} css={debouncedCss} js={debouncedJs} />
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;


import React from 'react';

interface CodeInputProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const CodeInput: React.FC<CodeInputProps> = ({ language, value, onChange, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{language}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-48 bg-gray-700 border border-gray-600 rounded-lg p-3 font-mono text-sm text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-y"
        spellCheck="false"
      />
    </div>
  );
};

export default CodeInput;

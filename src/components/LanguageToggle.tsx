import React from 'react';
import { Languages } from 'lucide-react';
import { Language } from '../types';

interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  language,
  onLanguageChange
}) => {
  return (
    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
      <Languages className="w-4 h-4 text-white" />
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-white text-purple-600'
            : 'text-white hover:bg-white/20'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onLanguageChange('pt')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          language === 'pt'
            ? 'bg-white text-purple-600'
            : 'text-white hover:bg-white/20'
        }`}
      >
        PT
      </button>
    </div>
  );
};
import React from 'react';
import { Palette } from 'lucide-react';
import { Theme, Language } from '../types';
import { themes } from '../utils/themes';
import { translations } from '../utils/translations';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  language: Language;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
  language
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentThemeConfig = themes[currentTheme];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${currentThemeConfig.buttonSecondary}`}
      >
        <Palette className="w-4 h-4" />
        <span className="text-sm font-medium">{translations.theme[language]}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute right-0 top-12 z-20 ${currentThemeConfig.cardBackground} rounded-xl shadow-xl ${currentThemeConfig.border} border p-2 min-w-[160px]`}>
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => {
                  onThemeChange(key as Theme);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center space-x-3 ${
                  currentTheme === key
                    ? `${currentThemeConfig.buttonPrimary.split(' ').slice(0, 2).join(' ')} ${currentThemeConfig.textPrimary}`
                    : `hover:bg-white/10 ${currentThemeConfig.textPrimary}`
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-white/30"
                  style={{
                    background: key === 'light' 
                      ? 'linear-gradient(45deg, #f3f4f6, #ffffff)' 
                      : key === 'dark'
                      ? 'linear-gradient(45deg, #1f2937, #374151)'
                      : key === 'gradient'
                      ? 'linear-gradient(45deg, #7c3aed, #3b82f6)'
                      : key === 'ocean'
                      ? 'linear-gradient(45deg, #0891b2, #06b6d4)'
                      : 'linear-gradient(45deg, #ea580c, #dc2626)'
                  }}
                />
                <span className="text-sm">{theme.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
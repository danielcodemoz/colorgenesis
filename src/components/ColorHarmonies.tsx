import React from 'react';
import { ColorHarmony, Language, Theme } from '../types';
import { translations } from '../utils/translations';
import { themes } from '../utils/themes';

interface ColorHarmoniesProps {
  harmonies: ColorHarmony[];
  language: Language;
  theme: Theme;
}

export const ColorHarmonies: React.FC<ColorHarmoniesProps> = ({
  harmonies,
  language,
  theme
}) => {
  const themeConfig = themes[theme];

  if (harmonies.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className={`${themeConfig.cardBackground} rounded-3xl p-8 shadow-2xl ${themeConfig.border} border`}>
        <h2 className={`text-2xl font-bold ${themeConfig.textPrimary} mb-8`}>
          {translations.colorHarmonies[language]}
        </h2>
        
        <div className="space-y-6">
          {harmonies.map((harmony) => (
            <div key={harmony.type} className="space-y-3">
              <h3 className={`text-lg font-semibold ${themeConfig.textPrimary} capitalize`}>
                {translations[harmony.type]?.[language] || harmony.type}
              </h3>
              
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {harmony.colors.map((color, index) => (
                  <div
                    key={`${harmony.type}-${index}`}
                    className="flex-shrink-0 group cursor-pointer"
                  >
                    <div
                      className="w-16 h-16 rounded-xl shadow-lg transition-transform group-hover:scale-110 ring-2 ring-white/10"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                    <p className={`text-xs ${themeConfig.textSecondary} text-center mt-2 font-mono`}>
                      {color.toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { ColorHarmony, Language, Theme } from '../types';
import { translations } from '../utils/translations';
import { themes } from '../utils/themes';
import { ExportUtils } from '../utils/exportUtils';

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
  const [copied, setCopied] = useState<string | null>(null);

  if (harmonies.length === 0) return null;

  const handleCopy = (color: string) => {
    ExportUtils.copyToClipboard(color);
    setCopied(color);
    window.setTimeout(() => setCopied(null), 1600);
  };

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
                  <button
                    type="button"
                    key={`${harmony.type}-${index}`}
                    className="flex-shrink-0 group cursor-pointer bg-transparent border-0 p-0"
                    onClick={() => handleCopy(color)}
                    title={`${translations.copyHex[language]} ${color}`}
                  >
                    <div
                      className="w-16 h-16 rounded-xl shadow-lg transition-transform group-hover:scale-110 ring-2 ring-white/10"
                      style={{ backgroundColor: color }}
                    />
                    <p className={`text-xs ${themeConfig.textSecondary} text-center mt-2 font-mono`}>
                      {copied === color ? translations.copied[language] : color.toUpperCase()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

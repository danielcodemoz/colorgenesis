import React from 'react';
import { ColorSwatch } from './ColorSwatch';
import { Color, Language, Theme } from '../types';
import { translations } from '../utils/translations';
import { themes } from '../utils/themes';

interface ColorPaletteProps {
  colors: Color[];
  language: Language;
  theme: Theme;
  imageUrl?: string;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  language,
  theme,
  imageUrl
}) => {
  const themeConfig = themes[theme];

  if (colors.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className={`${themeConfig.cardBackground} rounded-3xl p-8 shadow-2xl ${themeConfig.border} border`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-2xl font-bold ${themeConfig.textPrimary}`}>
            {translations.colorPalette[language]}
          </h2>
          {imageUrl && (
            <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg ring-2 ring-white/20">
              <img
                src={imageUrl}
                alt="Source"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {colors.map((color, index) => (
            <ColorSwatch
              key={`${color.hex}-${index}`}
              color={color}
              language={language}
              theme={theme}
              size="medium"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
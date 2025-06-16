import React from 'react';
import { Trash2 } from 'lucide-react';
import { ColorPalette, Language, Theme } from '../types';
import { translations } from '../utils/translations';
import { themes } from '../utils/themes';
import { ColorSwatch } from './ColorSwatch';

interface PaletteGalleryProps {
  palettes: ColorPalette[];
  language: Language;
  theme: Theme;
  onDelete: (id: string) => void;
}

export const PaletteGallery: React.FC<PaletteGalleryProps> = ({
  palettes,
  language,
  theme,
  onDelete
}) => {
  const themeConfig = themes[theme];

  if (palettes.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className={`${themeConfig.cardBackground} rounded-3xl p-8 shadow-2xl ${themeConfig.border} border`}>
        <h2 className={`text-2xl font-bold ${themeConfig.textPrimary} mb-8`}>
          {translations.savedPalettes[language]} ({palettes.length})
        </h2>
        
        <div className="space-y-8">
          {palettes.map((palette) => (
            <div
              key={palette.id}
              className={`${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} rounded-2xl p-6 hover:${theme === 'light' ? 'bg-gray-100' : 'bg-white/10'} transition-all ${themeConfig.border} border`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`text-lg font-semibold ${themeConfig.textPrimary}`}>
                    {palette.name}
                  </h3>
                  <p className={`text-sm ${themeConfig.textSecondary}`}>
                    {new Date(palette.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <button
                  onClick={() => onDelete(palette.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-full transition-colors"
                  title={translations.delete[language]}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3">
                {palette.colors.slice(0, 8).map((color, index) => (
                  <ColorSwatch
                    key={`${palette.id}-${index}`}
                    color={color}
                    language={language}
                    theme={theme}
                    size="small"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
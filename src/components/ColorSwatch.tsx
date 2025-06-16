import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Color, Language, Theme } from '../types';
import { translations } from '../utils/translations';
import { themes } from '../utils/themes';
import { ExportUtils } from '../utils/exportUtils';

interface ColorSwatchProps {
  color: Color;
  language: Language;
  theme: Theme;
  size?: 'small' | 'medium' | 'large';
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  language,
  theme,
  size = 'medium'
}) => {
  const [copied, setCopied] = useState(false);
  const themeConfig = themes[theme];

  const handleCopy = (text: string) => {
    ExportUtils.copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const isLight = color.hsl[2] > 50;

  return (
    <div className={`group ${themeConfig.cardBackground} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${themeConfig.border} border`}>
      <div
        className={`${sizeClasses[size]} w-full rounded-t-2xl relative overflow-hidden`}
        style={{ backgroundColor: color.hex }}
      >
        <button
          onClick={() => handleCopy(color.hex)}
          className={`
            absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            ${isLight ? 'bg-black/20' : 'bg-white/20'}
          `}
          title={translations.copyHex[language]}
        >
          {copied ? (
            <Check className={`w-6 h-6 ${isLight ? 'text-white' : 'text-black'}`} />
          ) : (
            <Copy className={`w-6 h-6 ${isLight ? 'text-white' : 'text-black'}`} />
          )}
        </button>
      </div>
      
      <div className="p-4 space-y-2">
        <button
          onClick={() => handleCopy(color.hex)}
          className={`font-mono font-bold ${textSizeClasses[size]} ${themeConfig.textPrimary} hover:${themeConfig.accent} transition-colors`}
        >
          {color.hex.toUpperCase()}
        </button>
        
        <div className={`${textSizeClasses[size]} ${themeConfig.textSecondary} space-y-1`}>
          <button
            onClick={() => handleCopy(`rgb(${color.rgb.join(', ')})`)}
            className={`block hover:${themeConfig.accent} transition-colors`}
          >
            RGB({color.rgb.join(', ')})
          </button>
          <button
            onClick={() => handleCopy(`hsl(${color.hsl.join(', ')})`)}
            className={`block hover:${themeConfig.accent} transition-colors`}
          >
            HSL({color.hsl[0]}°, {color.hsl[1]}%, {color.hsl[2]}%)
          </button>
        </div>
        
        {copied && (
          <div className="text-xs text-green-500 font-medium animate-pulse">
            {translations.copied[language]}
          </div>
        )}
      </div>
    </div>
  );
};
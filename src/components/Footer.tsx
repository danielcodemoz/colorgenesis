import React from 'react';
import { Theme, Language } from '../types';
import { themes } from '../utils/themes';
import { translations } from '../utils/translations';

interface FooterProps {
  theme: Theme;
  language?: Language;
}

export const Footer: React.FC<FooterProps> = ({ theme, language = 'pt' }) => {
  const themeConfig = themes[theme];

  return (
    <footer className={`py-8 mt-16 border-t ${themeConfig.border}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-2">
          <p className={themeConfig.textSecondary}>
            <a
              href="https://danielpro.dev"
              className={`font-semibold ${themeConfig.accent} hover:underline`}
            >
              Daniel Marcos · Labs
            </a>
            <span> · Maputo</span>
          </p>
          <p className={`text-sm ${themeConfig.textSecondary}`}>
            {translations.labNote[language]}
          </p>
        </div>
      </div>
    </footer>
  );
};

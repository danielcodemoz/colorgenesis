import React from 'react';
import { Heart } from 'lucide-react';
import { Theme } from '../types';
import { themes } from '../utils/themes';

interface FooterProps {
  theme: Theme;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const themeConfig = themes[theme];

  return (
    <footer className={`py-8 mt-16 border-t ${themeConfig.border}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <p className={`flex items-center justify-center space-x-2 ${themeConfig.textSecondary}`}>
            <span>Website developed with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
            <span>by</span>
            <a
              href="https://github.com/Daniel258"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold ${themeConfig.accent} hover:underline transition-colors`}
            >
              Daniel258
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
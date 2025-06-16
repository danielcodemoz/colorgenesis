import React, { useState } from 'react';
import { X, Download, FileImage, FileText, Code, FileType } from 'lucide-react';
import { Color, Language, ColorPalette, Theme } from '../types';
import { translations } from '../utils/translations';
import { themes } from '../utils/themes';
import { ExportUtils } from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: Color[];
  language: Language;
  theme: Theme;
  onSave: (palette: ColorPalette) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  colors,
  language,
  theme,
  onSave
}) => {
  const [paletteName, setPaletteName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const themeConfig = themes[theme];

  if (!isOpen) return null;

  const handleExportPNG = async () => {
    setIsExporting('png');
    const name = paletteName || 'palette';
    await ExportUtils.exportAsPNG(colors, name);
    setIsExporting(null);
  };

  const handleExportPDF = async () => {
    setIsExporting('pdf');
    const name = paletteName || 'palette';
    await ExportUtils.exportAsPDF(colors, name);
    setIsExporting(null);
  };

  const handleExportCSS = () => {
    const name = paletteName || 'palette';
    ExportUtils.exportAsCSS(colors, name);
  };

  const handleSave = () => {
    if (!paletteName.trim()) return;
    
    setIsSaving(true);
    const palette: ColorPalette = {
      id: Date.now().toString(),
      name: paletteName.trim(),
      colors,
      createdAt: new Date()
    };
    
    onSave(palette);
    setIsSaving(false);
    onClose();
    setPaletteName('');
  };

  const handleExportJSON = () => {
    const palette: ColorPalette = {
      id: Date.now().toString(),
      name: paletteName || 'palette',
      colors,
      createdAt: new Date()
    };
    ExportUtils.exportAsJSON(palette);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${themeConfig.cardBackground} rounded-3xl p-8 max-w-md w-full shadow-2xl ${themeConfig.border} border`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${themeConfig.textPrimary}`}>
            {translations.export[language]}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 hover:bg-white/10 rounded-full transition-colors ${themeConfig.textSecondary}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className={`block text-sm font-medium ${themeConfig.textPrimary} mb-2`}>
              {translations.paletteName[language]}
            </label>
            <input
              type="text"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              placeholder="My Beautiful Palette"
              className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                theme === 'light' 
                  ? 'border border-gray-300 bg-white text-gray-900' 
                  : 'border border-white/20 bg-white/10 text-white placeholder-white/50'
              }`}
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleExportPNG}
            disabled={isExporting === 'png'}
            className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all ${
              isExporting === 'png' 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-lg transform hover:-translate-y-0.5'
            } bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700`}
          >
            <FileImage className="w-5 h-5" />
            <span>{isExporting === 'png' ? 'Exporting...' : translations.exportPNG[language]}</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting === 'pdf'}
            className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all ${
              isExporting === 'pdf' 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-lg transform hover:-translate-y-0.5'
            } bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700`}
          >
            <FileType className="w-5 h-5" />
            <span>{isExporting === 'pdf' ? 'Exporting...' : translations.exportPDF[language]}</span>
          </button>

          <button
            onClick={handleExportCSS}
            className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Code className="w-5 h-5" />
            <span>{translations.exportCSS[language]}</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <FileText className="w-5 h-5" />
            <span>{translations.exportJSON[language]}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={!paletteName.trim() || isSaving}
            className={`w-full flex items-center justify-center space-x-3 p-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5 ${themeConfig.buttonPrimary}`}
          >
            <Download className="w-5 h-5" />
            <span>
              {isSaving ? '...' : translations.savePalette[language]}
            </span>
          </button>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={onClose}
            className={`px-6 py-2 transition-colors ${themeConfig.textSecondary} hover:${themeConfig.textPrimary}`}
          >
            {translations.cancel[language]}
          </button>
        </div>
      </div>
    </div>
  );
};
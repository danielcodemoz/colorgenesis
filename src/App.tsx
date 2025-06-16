import React, { useState, useCallback } from 'react';
import { Download, Palette, RefreshCw } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { ColorPalette } from './components/ColorPalette';
import { ColorHarmonies } from './components/ColorHarmonies';
import { ExportModal } from './components/ExportModal';
import { PaletteGallery } from './components/PaletteGallery';
import { LanguageToggle } from './components/LanguageToggle';
import { ThemeSelector } from './components/ThemeSelector';
import { Footer } from './components/Footer';
import { ColorExtractor } from './utils/colorExtraction';
import { ColorHarmonyGenerator } from './utils/colorHarmonies';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Color, ColorPalette as ColorPaletteType, Language, ColorHarmony, Theme } from './types';
import { translations } from './utils/translations';
import { themes } from './utils/themes';

function App() {
  const [colors, setColors] = useState<Color[]>([]);
  const [harmonies, setHarmonies] = useState<ColorHarmony[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en');
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'gradient');
  const [savedPalettes, setSavedPalettes] = useLocalStorage<ColorPaletteType[]>('savedPalettes', []);

  const colorExtractor = new ColorExtractor();
  const themeConfig = themes[theme];

  const handleImageUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const imageUrl = URL.createObjectURL(file);
      setCurrentImage(imageUrl);
      
      const extractedColors = await colorExtractor.extractColors(file, 8);
      setColors(extractedColors);
      
      // Generate harmonies from the dominant color
      if (extractedColors.length > 0) {
        const dominantColor = extractedColors[0];
        const colorHarmonies = ColorHarmonyGenerator.generateHarmonies(dominantColor.hex);
        setHarmonies(colorHarmonies);
      }
    } catch (error) {
      console.error('Error extracting colors:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleSavePalette = (palette: ColorPaletteType) => {
    setSavedPalettes(prev => [palette, ...prev]);
  };

  const handleDeletePalette = (id: string) => {
    setSavedPalettes(prev => prev.filter(p => p.id !== id));
  };

  const handleGenerateNew = () => {
    setColors([]);
    setHarmonies([]);
    setCurrentImage('');
  };

  return (
    <div className={`min-h-screen ${themeConfig.background}`}>
      {/* Background Pattern */}
      {theme === 'gradient' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${themeConfig.textPrimary}`}>
                  {translations.title[language]}
                </h1>
                <p className={`${themeConfig.textSecondary} text-sm`}>
                  {translations.subtitle[language]}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeSelector
                currentTheme={theme}
                onThemeChange={setTheme}
                language={language}
              />
              <LanguageToggle language={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 pb-12">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Upload Section */}
            {colors.length === 0 && (
              <div className="text-center space-y-8">
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  language={language}
                  theme={theme}
                  isProcessing={isProcessing}
                />
              </div>
            )}

            {/* Results Section */}
            {colors.length > 0 && (
              <>
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Download className="w-5 h-5" />
                    <span>{translations.export[language]}</span>
                  </button>
                  
                  <button
                    onClick={handleGenerateNew}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${themeConfig.buttonSecondary}`}
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>{translations.generateNew[language]}</span>
                  </button>
                </div>

                {/* Color Palette */}
                <ColorPalette
                  colors={colors}
                  language={language}
                  theme={theme}
                  imageUrl={currentImage}
                />

                {/* Color Harmonies */}
                {harmonies.length > 0 && (
                  <ColorHarmonies harmonies={harmonies} language={language} theme={theme} />
                )}
              </>
            )}

            {/* Saved Palettes */}
            <PaletteGallery
              palettes={savedPalettes}
              language={language}
              theme={theme}
              onDelete={handleDeletePalette}
            />
          </div>
        </main>

        {/* Footer */}
        <Footer theme={theme} />

        {/* Export Modal */}
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          colors={colors}
          language={language}
          theme={theme}
          onSave={handleSavePalette}
        />
      </div>
    </div>
  );
}

export default App;
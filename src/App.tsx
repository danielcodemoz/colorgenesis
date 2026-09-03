import React, { useState, useCallback } from 'react';
import { Download, Palette, RefreshCw, Sparkles } from 'lucide-react';
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

type HarmonyPick = 'all' | ColorHarmony['type'];

function App() {
  const [colors, setColors] = useState<Color[]>([]);
  const [harmonies, setHarmonies] = useState<ColorHarmony[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [language, setLanguage] = useLocalStorage<Language>('language', 'pt');
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'gradient');
  const [savedPalettes, setSavedPalettes] = useLocalStorage<ColorPaletteType[]>('savedPalettes', []);
  const [seedColor, setSeedColor] = useState('#0F766E');
  const [harmonyPick, setHarmonyPick] = useState<HarmonyPick>('all');

  const colorExtractor = new ColorExtractor();
  const themeConfig = themes[theme];

  const applyHarmonies = useCallback((seed: string, pick: HarmonyPick) => {
    const generated = ColorHarmonyGenerator.generateHarmonies(seed);
    setHarmonies(generated);
    const types: ColorHarmony['type'][] =
      pick === 'all' ? ['complementary', 'analogous', 'triadic'] : [pick];
    const palette = ColorHarmonyGenerator.uniqueColorsFromHarmonies(generated, types);
    setColors(palette);
    setCurrentImage('');
  }, []);

  const handleRandomPalette = useCallback(() => {
    const seed = ColorHarmonyGenerator.randomHex();
    setSeedColor(seed);
    applyHarmonies(seed, harmonyPick);
  }, [applyHarmonies, harmonyPick]);

  const handleSeedPalette = useCallback(() => {
    applyHarmonies(seedColor, harmonyPick);
  }, [applyHarmonies, seedColor, harmonyPick]);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const imageUrl = URL.createObjectURL(file);
      setCurrentImage(imageUrl);

      const extractedColors = await colorExtractor.extractColors(file, 8);
      setColors(extractedColors);

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
        <header className="p-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <a
                  href="https://danielpro.dev"
                  className={`text-xs font-semibold tracking-wide uppercase ${themeConfig.textSecondary} hover:underline`}
                >
                  Daniel Marcos <span className={themeConfig.accent}>· Labs</span>
                </a>
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

        <main className="px-6 pb-12">
          <div className="max-w-6xl mx-auto space-y-12">
            {colors.length === 0 && (
              <div className="text-center space-y-8">
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  language={language}
                  theme={theme}
                  isProcessing={isProcessing}
                />

                <div className={`max-w-2xl mx-auto ${themeConfig.cardBackground} rounded-2xl p-6 shadow-lg ${themeConfig.border} border text-left`}>
                  <p className={`text-sm font-semibold uppercase tracking-wide ${themeConfig.textSecondary} mb-2`}>
                    {translations.orGenerate[language]}
                  </p>
                  <p className={`${themeConfig.textPrimary} font-medium mb-4`}>
                    {translations.randomPaletteHint[language]}
                  </p>
                  <div className="flex flex-wrap items-end gap-3">
                    <label className={`text-sm ${themeConfig.textSecondary}`}>
                      {translations.seedColor[language]}
                      <input
                        type="color"
                        value={seedColor}
                        onChange={(e) => setSeedColor(e.target.value)}
                        className="mt-1 block h-10 w-16 cursor-pointer rounded border-0 bg-transparent p-0"
                        aria-label={translations.seedColor[language]}
                      />
                    </label>
                    <label className={`text-sm ${themeConfig.textSecondary} flex-1 min-w-[12rem]`}>
                      {translations.harmonyType[language]}
                      <select
                        value={harmonyPick}
                        onChange={(e) => setHarmonyPick(e.target.value as HarmonyPick)}
                        className={`mt-1 block w-full rounded-lg px-3 py-2 ${themeConfig.cardBackground} ${themeConfig.textPrimary} ${themeConfig.border} border`}
                      >
                        <option value="all">{translations.allHarmonies[language]}</option>
                        <option value="complementary">{translations.complementary[language]}</option>
                        <option value="analogous">{translations.analogous[language]}</option>
                        <option value="triadic">{translations.triadic[language]}</option>
                        <option value="monochromatic">{translations.monochromatic[language]}</option>
                      </select>
                    </label>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleRandomPalette}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>{translations.randomPalette[language]}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSeedPalette}
                      className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full ${themeConfig.buttonSecondary}`}
                    >
                      <Palette className="w-5 h-5" />
                      <span>{seedColor.toUpperCase()}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Download className="w-5 h-5" />
                    <span>{translations.export[language]}</span>
                  </button>

                  <button
                    onClick={handleRandomPalette}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>{translations.randomPalette[language]}</span>
                  </button>

                  <button
                    onClick={handleGenerateNew}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${themeConfig.buttonSecondary}`}
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>{translations.generateNew[language]}</span>
                  </button>
                </div>

                <ColorPalette
                  colors={colors}
                  language={language}
                  theme={theme}
                  imageUrl={currentImage}
                />

                {harmonies.length > 0 && (
                  <ColorHarmonies harmonies={harmonies} language={language} theme={theme} />
                )}
              </>
            )}

            <PaletteGallery
              palettes={savedPalettes}
              language={language}
              theme={theme}
              onDelete={handleDeletePalette}
            />
          </div>
        </main>

        <Footer theme={theme} language={language} />

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

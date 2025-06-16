import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Language, Theme } from '../types';
import { translations } from '../utils/translations';
import { themes } from '../utils/themes';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  language: Language;
  theme: Theme;
  isProcessing: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  language,
  theme,
  isProcessing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const themeConfig = themes[theme];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files[0] && files[0].type.startsWith('image/')) {
      onImageUpload(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 ${themeConfig.cardBackground} ${themeConfig.border}
          ${isDragOver
            ? `border-blue-400 ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-500/10'} transform scale-105`
            : `hover:${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} hover:border-opacity-70`
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {isProcessing ? (
              <div className="relative">
                <div className={`w-16 h-16 border-4 ${themeConfig.border} border-t-blue-500 rounded-full animate-spin`} />
                <Sparkles className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          
          <div>
            <h3 className={`text-xl font-semibold ${themeConfig.textPrimary} mb-2`}>
              {isProcessing 
                ? translations.extracting[language]
                : translations.uploadTitle[language]
              }
            </h3>
            {!isProcessing && (
              <p className={themeConfig.textSecondary}>
                {translations.uploadSubtitle[language]}
              </p>
            )}
          </div>
          
          {!isProcessing && (
            <button
              type="button"
              className={`inline-flex items-center px-6 py-3 rounded-full font-medium transition-all hover:shadow-lg transform hover:-translate-y-0.5 ${
                theme === 'light' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white text-purple-600 hover:bg-gray-100'
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              {translations.browseFiles[language]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
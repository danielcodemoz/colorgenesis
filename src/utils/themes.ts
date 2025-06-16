import { ThemeConfig } from '../types';

export const themes: Record<string, ThemeConfig> = {
  gradient: {
    name: 'Gradient',
    background: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900',
    cardBackground: 'bg-white/10 backdrop-blur-md',
    textPrimary: 'text-white',
    textSecondary: 'text-white/70',
    border: 'border-white/20',
    accent: 'text-purple-300',
    buttonPrimary: 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white',
    buttonSecondary: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
  },
  dark: {
    name: 'Dark',
    background: 'bg-gray-900',
    cardBackground: 'bg-gray-800/90 backdrop-blur-md',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-300',
    border: 'border-gray-700',
    accent: 'text-blue-400',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
  },
  light: {
    name: 'Light',
    background: 'bg-gray-50',
    cardBackground: 'bg-white/90 backdrop-blur-md shadow-lg',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    accent: 'text-blue-600',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
  },
  ocean: {
    name: 'Ocean',
    background: 'bg-gradient-to-br from-blue-900 via-teal-800 to-cyan-900',
    cardBackground: 'bg-white/10 backdrop-blur-md',
    textPrimary: 'text-white',
    textSecondary: 'text-cyan-100',
    border: 'border-cyan-400/30',
    accent: 'text-cyan-300',
    buttonPrimary: 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white',
    buttonSecondary: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-cyan-400/30'
  },
  sunset: {
    name: 'Sunset',
    background: 'bg-gradient-to-br from-orange-800 via-red-800 to-pink-900',
    cardBackground: 'bg-white/10 backdrop-blur-md',
    textPrimary: 'text-white',
    textSecondary: 'text-orange-100',
    border: 'border-orange-400/30',
    accent: 'text-orange-300',
    buttonPrimary: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white',
    buttonSecondary: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-orange-400/30'
  }
};
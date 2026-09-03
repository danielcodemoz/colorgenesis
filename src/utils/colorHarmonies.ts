import { Color, ColorHarmony } from '../types';

export class ColorHarmonyGenerator {
  static generateHarmonies(baseHex: string): ColorHarmony[] {
    const hsl = this.hexToHsl(baseHex);
    const harmonies: ColorHarmony[] = [];

    // Complementary
    harmonies.push({
      type: 'complementary',
      colors: [
        baseHex,
        this.hslToHex([(hsl[0] + 180) % 360, hsl[1], hsl[2]])
      ]
    });

    // Analogous
    harmonies.push({
      type: 'analogous',
      colors: [
        this.hslToHex([(hsl[0] - 30 + 360) % 360, hsl[1], hsl[2]]),
        baseHex,
        this.hslToHex([(hsl[0] + 30) % 360, hsl[1], hsl[2]])
      ]
    });

    // Triadic
    harmonies.push({
      type: 'triadic',
      colors: [
        baseHex,
        this.hslToHex([(hsl[0] + 120) % 360, hsl[1], hsl[2]]),
        this.hslToHex([(hsl[0] + 240) % 360, hsl[1], hsl[2]])
      ]
    });

    // Monochromatic
    harmonies.push({
      type: 'monochromatic',
      colors: [
        this.hslToHex([hsl[0], hsl[1], Math.max(hsl[2] - 30, 0)]),
        this.hslToHex([hsl[0], hsl[1], Math.max(hsl[2] - 15, 0)]),
        baseHex,
        this.hslToHex([hsl[0], hsl[1], Math.min(hsl[2] + 15, 100)]),
        this.hslToHex([hsl[0], hsl[1], Math.min(hsl[2] + 30, 100)])
      ]
    });

    return harmonies;
  }

  static randomHex(): string {
    const h = Math.floor(Math.random() * 360);
    const s = 52 + Math.floor(Math.random() * 38);
    const l = 40 + Math.floor(Math.random() * 22);
    return this.hslToHex([h, s, l]);
  }

  static hexToColor(hex: string, frequency = 1): Color {
    const normalized = hex.startsWith('#') ? hex : `#${hex}`;
    const rgb = this.hexToRgb(normalized);
    const hsl = this.hexToHsl(normalized);
    return {
      hex: `#${normalized.slice(1).toUpperCase()}`,
      rgb,
      hsl,
      frequency
    };
  }

  static uniqueColorsFromHarmonies(harmonies: ColorHarmony[], types?: ColorHarmony['type'][]): Color[] {
    const allow = types && types.length ? new Set(types) : null;
    const seen = new Set<string>();
    const colors: Color[] = [];
    for (const harmony of harmonies) {
      if (allow && !allow.has(harmony.type)) continue;
      for (const hex of harmony.colors) {
        const key = hex.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        colors.push(this.hexToColor(hex, 1 / (colors.length + 1)));
      }
    }
    return colors;
  }

  static contrastRatio(hexA: string, hexB: string): number {
    const l1 = this.relativeLuminance(hexA);
    const l2 = this.relativeLuminance(hexB);
    const hi = Math.max(l1, l2);
    const lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  static wcagHint(hex: string): { best: 'white' | 'black'; ratio: number; level: 'AAA' | 'AA' | 'AA-large' | 'fail' } {
    const white = this.contrastRatio(hex, '#FFFFFF');
    const black = this.contrastRatio(hex, '#000000');
    const best = white >= black ? 'white' as const : 'black' as const;
    const ratio = best === 'white' ? white : black;
    const level = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA-large' : 'fail';
    return { best, ratio, level };
  }

  static relativeLuminance(hex: string): number {
    const [r, g, b] = this.hexToRgb(hex).map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  static hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16)
    ];
  }

  static hexToHsl(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  static hslToHex(hsl: [number, number, number]): string {
    const h = hsl[0] / 360;
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
}

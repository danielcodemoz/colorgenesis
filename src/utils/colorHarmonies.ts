import { ColorHarmony } from '../types';

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

  private static hexToHsl(hex: string): [number, number, number] {
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

  private static hslToHex(hsl: [number, number, number]): string {
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
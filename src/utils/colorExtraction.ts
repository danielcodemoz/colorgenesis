import { Color } from '../types';

export class ColorExtractor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async extractColors(imageFile: File, numColors: number = 8): Promise<Color[]> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Resize image for faster processing
        const maxSize = 400;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        this.canvas.width = img.width * ratio;
        this.canvas.height = img.height * ratio;

        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        const colors = this.kMeansClustering(imageData.data, numColors);
        resolve(colors);
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }

  private kMeansClustering(pixels: Uint8ClampedArray, k: number): Color[] {
    const colors: [number, number, number][] = [];
    
    // Sample pixels (every 4th pixel for performance)
    for (let i = 0; i < pixels.length; i += 16) {
      colors.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
    }

    // Initialize centroids randomly
    const centroids: [number, number, number][] = [];
    for (let i = 0; i < k; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      centroids.push([...randomColor]);
    }

    // K-means iterations
    for (let iteration = 0; iteration < 20; iteration++) {
      const clusters: [number, number, number][][] = Array(k).fill(null).map(() => []);
      
      // Assign each color to nearest centroid
      colors.forEach(color => {
        let minDistance = Infinity;
        let closestCentroid = 0;
        
        centroids.forEach((centroid, index) => {
          const distance = this.colorDistance(color, centroid);
          if (distance < minDistance) {
            minDistance = distance;
            closestCentroid = index;
          }
        });
        
        clusters[closestCentroid].push(color);
      });

      // Update centroids
      centroids.forEach((centroid, index) => {
        if (clusters[index].length > 0) {
          const avgR = clusters[index].reduce((sum, c) => sum + c[0], 0) / clusters[index].length;
          const avgG = clusters[index].reduce((sum, c) => sum + c[1], 0) / clusters[index].length;
          const avgB = clusters[index].reduce((sum, c) => sum + c[2], 0) / clusters[index].length;
          centroids[index] = [Math.round(avgR), Math.round(avgG), Math.round(avgB)];
        }
      });
    }

    // Convert centroids to Color objects and sort by frequency
    return centroids
      .map(([r, g, b]) => ({
        hex: this.rgbToHex(r, g, b),
        rgb: [r, g, b] as [number, number, number],
        hsl: this.rgbToHsl(r, g, b),
        frequency: colors.filter(color => 
          this.colorDistance(color, [r, g, b]) < 50
        ).length / colors.length
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }

  private colorDistance(c1: [number, number, number], c2: [number, number, number]): number {
    return Math.sqrt(
      Math.pow(c1[0] - c2[0], 2) +
      Math.pow(c1[1] - c2[1], 2) +
      Math.pow(c1[2] - c2[2], 2)
    );
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

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
}
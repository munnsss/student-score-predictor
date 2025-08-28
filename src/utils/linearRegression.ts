export interface DataPoint {
  x: number;
  y: number;
}

export class LinearRegression {
  private slope: number = 0;
  private intercept: number = 0;
  private trained: boolean = false;

  train(data: DataPoint[]): void {
    if (data.length < 2) {
      throw new Error("Need at least 2 data points to train the model");
    }

    const n = data.length;
    const sumX = data.reduce((sum, point) => sum + point.x, 0);
    const sumY = data.reduce((sum, point) => sum + point.y, 0);
    const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);

    // Calculate slope (m) and intercept (b) for y = mx + b
    this.slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    this.intercept = (sumY - this.slope * sumX) / n;
    this.trained = true;
  }

  predict(x: number): number {
    if (!this.trained) {
      throw new Error("Model must be trained before making predictions");
    }
    return this.slope * x + this.intercept;
  }

  getRegressionLine(minX: number, maxX: number, points: number = 100): DataPoint[] {
    if (!this.trained) {
      throw new Error("Model must be trained before generating regression line");
    }

    const step = (maxX - minX) / (points - 1);
    const line: DataPoint[] = [];

    for (let i = 0; i < points; i++) {
      const x = minX + i * step;
      const y = this.predict(x);
      line.push({ x, y });
    }

    return line;
  }

  getMetrics(): { slope: number; intercept: number } {
    return { slope: this.slope, intercept: this.intercept };
  }

  isTrainedModel(): boolean {
    return this.trained;
  }
}
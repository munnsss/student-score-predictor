import { useState } from "react";
import { LinearRegression, DataPoint } from "@/utils/linearRegression";
import { TrainingSection } from "@/components/TrainingSection";
import { PredictionSection } from "@/components/PredictionSection";
import { VisualizationSection } from "@/components/VisualizationSection";
import { Brain, Sparkles } from "lucide-react";

const Index = () => {
  const [model] = useState(new LinearRegression());
  const [trainingData, setTrainingData] = useState<DataPoint[]>([]);
  const [regressionLine, setRegressionLine] = useState<DataPoint[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);
  const [isModelTrained, setIsModelTrained] = useState(false);

  const handleTrain = (data: DataPoint[]) => {
    try {
      model.train(data);
      setTrainingData(data);
      setIsModelTrained(true);
      
      // Generate regression line for visualization
      const minX = Math.min(...data.map(p => p.x));
      const maxX = Math.max(...data.map(p => p.x));
      const line = model.getRegressionLine(minX, maxX);
      setRegressionLine(line);
      
    } catch (error) {
      console.error('Training failed:', error);
      throw error;
    }
  };

  const handlePredict = (hours: number): number => {
    if (!isModelTrained) {
      throw new Error("Model not trained yet!");
    }
    return model.predict(hours);
  };

  const handleShowVisualization = () => {
    if (!isModelTrained) return;
    setShowVisualization(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="w-8 h-8 text-primary" />
              <Sparkles className="w-4 h-4 text-accent absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Student Score Predictor
              </h1>
              <p className="text-muted-foreground">
                Advanced ML-powered academic performance prediction
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Training Section */}
          <TrainingSection
            onTrain={handleTrain}
            onShowVisualization={handleShowVisualization}
            isModelTrained={isModelTrained}
          />

          {/* Prediction Section */}
          <PredictionSection
            onPredict={handlePredict}
            isModelTrained={isModelTrained}
          />
        </div>

        {/* Visualization Section */}
        <VisualizationSection
          trainingData={trainingData}
          regressionLine={regressionLine}
          isVisible={showVisualization}
        />

        {/* Model Info */}
        {isModelTrained && (
          <div className="mt-8 p-6 rounded-xl bg-card/50 border border-border/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Model Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Algorithm:</span>
                <span className="ml-2 font-mono">Linear Regression</span>
              </div>
              <div>
                <span className="text-muted-foreground">Training Points:</span>
                <span className="ml-2 font-mono">{trainingData.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Slope:</span>
                <span className="ml-2 font-mono">{model.getMetrics().slope.toFixed(4)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Intercept:</span>
                <span className="ml-2 font-mono">{model.getMetrics().intercept.toFixed(4)}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
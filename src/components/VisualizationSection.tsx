import { MLCard } from "./MLCard";
import { DataPoint } from "@/utils/linearRegression";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { BarChart3 } from "lucide-react";

interface VisualizationSectionProps {
  trainingData: DataPoint[];
  regressionLine: DataPoint[];
  isVisible: boolean;
}

export function VisualizationSection({ trainingData, regressionLine, isVisible }: VisualizationSectionProps) {
  if (!isVisible) return null;

  const combinedData = trainingData.map(point => ({
    x: point.x,
    actual: point.y,
    predicted: regressionLine.find(p => Math.abs(p.x - point.x) < 0.1)?.y || 0
  }));

  return (
    <MLCard 
      title="Model Visualization" 
      description="Interactive chart showing training data and regression line"
      className="col-span-full"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <BarChart3 className="w-5 h-5" />
          <span className="font-semibold">Student Score Prediction Model</span>
        </div>
        
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={regressionLine} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="x" 
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'Hours Studied', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}`,
                  name === 'y' ? 'Predicted Score' : name
                ]}
                labelFormatter={(value) => `Hours: ${value}`}
              />
              <Legend />
              
              {/* Regression Line */}
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={3}
                dot={false}
                name="Regression Line"
              />
              
              {/* Training Data Points */}
              {trainingData.map((point, index) => (
                <Line
                  key={`point-${index}`}
                  data={[point]}
                  type="monotone"
                  dataKey="y"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={0}
                  dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 6 }}
                  name={index === 0 ? "Training Data" : undefined}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-sm text-muted-foreground">Training Points</div>
            <div className="text-lg font-semibold text-primary">{trainingData.length}</div>
          </div>
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="text-sm text-muted-foreground">Min Score</div>
            <div className="text-lg font-semibold text-accent">
              {Math.min(...trainingData.map(p => p.y)).toFixed(1)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-ml-success/10 border border-ml-success/20">
            <div className="text-sm text-muted-foreground">Max Score</div>
            <div className="text-lg font-semibold text-ml-success">
              {Math.max(...trainingData.map(p => p.y)).toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </MLCard>
  );
}
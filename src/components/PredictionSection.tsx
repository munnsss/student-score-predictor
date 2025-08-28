import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MLCard } from "./MLCard";
import { Calculator, Target } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PredictionSectionProps {
  onPredict: (hours: number) => number;
  isModelTrained: boolean;
}

export function PredictionSection({ onPredict, isModelTrained }: PredictionSectionProps) {
  const [hoursInput, setHoursInput] = useState("");
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const handlePredict = async () => {
    try {
      setIsPredicting(true);
      
      const hours = parseFloat(hoursInput);
      if (isNaN(hours)) {
        toast({
          title: "Invalid Input",
          description: "Please enter a valid number of hours",
          variant: "destructive"
        });
        return;
      }

      if (hours < 0) {
        toast({
          title: "Invalid Input",
          description: "Hours studied cannot be negative",
          variant: "destructive"
        });
        return;
      }

      // Simulate prediction delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = onPredict(hours);
      setPrediction(result);
      
      toast({
        title: "Prediction Complete",
        description: `Predicted score: ${result.toFixed(1)} marks`,
      });
      
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Model not trained",
        variant: "destructive"
      });
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <MLCard 
      title="Make Predictions" 
      description="Enter hours studied to predict the expected score"
      glowing={isPredicting}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prediction-hours" className="text-sm font-medium">
            Hours Studied
          </Label>
          <Input
            id="prediction-hours"
            type="number"
            value={hoursInput}
            onChange={(e) => setHoursInput(e.target.value)}
            className="ml-input"
            placeholder="e.g., 6.5"
            min="0"
            step="0.1"
          />
        </div>
        
        <Button
          onClick={handlePredict}
          disabled={!isModelTrained || isPredicting}
          className="ml-button w-full"
        >
          <Calculator className={`w-4 h-4 mr-2 ${isPredicting ? 'animate-spin' : ''}`} />
          {isPredicting ? 'Calculating...' : 'Predict Score'}
        </Button>
        
        {prediction !== null && (
          <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-accent" />
              <span className="font-semibold text-accent">Prediction Result</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {prediction.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">marks</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              For {hoursInput} hours of study
            </p>
          </div>
        )}
      </div>
    </MLCard>
  );
}
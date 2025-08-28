import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MLCard } from "./MLCard";
import { DataPoint } from "@/utils/linearRegression";
import { Brain, TrendingUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface TrainingSectionProps {
  onTrain: (data: DataPoint[]) => void;
  onShowVisualization: () => void;
  isModelTrained: boolean;
}

export function TrainingSection({ onTrain, onShowVisualization, isModelTrained }: TrainingSectionProps) {
  const [hoursInput, setHoursInput] = useState("1,2,3,4,5,6,7,8,9");
  const [scoresInput, setScoresInput] = useState("35,50,55,65,70,75,80,85,95");
  const [isTraining, setIsTraining] = useState(false);

  const handleTrain = async () => {
    try {
      setIsTraining(true);
      
      const hours = hoursInput.split(',').map(h => parseFloat(h.trim()));
      const scores = scoresInput.split(',').map(s => parseFloat(s.trim()));

      if (hours.length !== scores.length) {
        toast({
          title: "Data Mismatch",
          description: "Hours and scores must have the same number of values",
          variant: "destructive"
        });
        return;
      }

      if (hours.some(isNaN) || scores.some(isNaN)) {
        toast({
          title: "Invalid Data",
          description: "All values must be valid numbers",
          variant: "destructive"
        });
        return;
      }

      const data: DataPoint[] = hours.map((h, i) => ({ x: h, y: scores[i] }));
      
      // Simulate training delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onTrain(data);
      
      toast({
        title: "Model Trained Successfully!",
        description: `Trained with ${data.length} data points`,
      });
      
    } catch (error) {
      toast({
        title: "Training Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <MLCard 
      title="Training Data" 
      description="Enter your training data to build the prediction model"
      glowing={isTraining}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hours" className="text-sm font-medium">
            Hours Studied (comma separated)
          </Label>
          <Input
            id="hours"
            value={hoursInput}
            onChange={(e) => setHoursInput(e.target.value)}
            className="ml-input"
            placeholder="e.g., 1,2,3,4,5"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="scores" className="text-sm font-medium">
            Scores (comma separated)
          </Label>
          <Input
            id="scores"
            value={scoresInput}
            onChange={(e) => setScoresInput(e.target.value)}
            className="ml-input"
            placeholder="e.g., 35,50,55,65,70"
          />
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleTrain}
            disabled={isTraining}
            className="ml-button flex-1"
          >
            <Brain className={`w-4 h-4 mr-2 ${isTraining ? 'animate-spin' : ''}`} />
            {isTraining ? 'Training Model...' : 'Train Model'}
          </Button>
          
          <Button
            onClick={onShowVisualization}
            disabled={!isModelTrained}
            variant="outline"
            className="flex-1 border-primary/50 hover:bg-primary/10"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Visualize
          </Button>
        </div>
      </div>
    </MLCard>
  );
}
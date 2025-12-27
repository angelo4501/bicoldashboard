import { ProvinceData } from "@/data/provinceData";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { MapPin, Target, CheckCircle, AlertCircle, Users, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProvinceCardProps {
  data: ProvinceData;
  onClick?: () => void;
  isSelected?: boolean;
  delay?: number;
}

export function ProvinceCard({ data, onClick, isSelected, delay = 0 }: ProvinceCardProps) {
  const { grandTotal } = data;
  const progressPercentage = Math.round(
    (grandTotal.systemResult / grandTotal.target) * 100
  );
  const isOnTrack = grandTotal.systemVariance <= grandTotal.target * 0.2;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg animate-slide-up",
        isSelected && "ring-2 ring-primary shadow-glow",
        "hover:border-primary/50"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground mb-2">{data.name}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-1">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium text-foreground">{data.municipalities.length}</span>
                <span className="text-muted-foreground">municipalities</span>
              </Badge>
              {data.staffAssigned !== undefined && (
                <Badge variant="outline" className="text-xs font-normal gap-1.5 px-2.5 py-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">{data.staffAssigned}</span>
                  <span className="text-muted-foreground">staff</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2",
            isOnTrack
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          )}
        >
          {isOnTrack ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <AlertCircle className="h-3 w-3" />
          )}
          {isOnTrack ? "On Track" : "Behind"}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Target className="h-4 w-4" />
            Progress
          </span>
          <span className="font-semibold text-foreground">{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Target</p>
            <p className="text-lg font-bold text-foreground">
              {grandTotal.target.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">System Result</p>
            <p className="text-lg font-bold text-primary">
              {grandTotal.systemResult.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Variance</p>
            <p className={cn(
              "text-lg font-bold",
              grandTotal.systemVariance <= 0 ? "text-success" : "text-warning"
            )}>
              {grandTotal.systemVariance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

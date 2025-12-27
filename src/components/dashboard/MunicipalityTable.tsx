import { useState, useMemo } from "react";
import { ProvinceData, MunicipalityData } from "@/data/provinceData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface MunicipalityTableProps {
  data: ProvinceData;
}

type SortField = 'municipality' | 'target100k' | 'target200k' | 'target' | 'systemResult' | 'systemVariance' | 'progress';
type SortDirection = 'asc' | 'desc';

export function MunicipalityTable({ data }: MunicipalityTableProps) {
  const [sortField, setSortField] = useState<SortField>('municipality');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedMunicipalities = useMemo(() => {
    const sorted = [...data.municipalities].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      if (sortField === 'municipality') {
        aValue = a.municipality.toLowerCase();
        bValue = b.municipality.toLowerCase();
      } else if (sortField === 'progress') {
        aValue = Math.min(Math.round((a.systemResult / a.target) * 100), 100);
        bValue = Math.min(Math.round((b.systemResult / b.target) * 100), 100);
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    return sorted;
  }, [data.municipalities, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-foreground">        
          {data.name === "All Provinces" ? "Province" : data.name +" - Municipality"} Breakdown
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Target vs System Result by {data.name === "All Provinces" ? "Province" : "Municipality"}
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead 
                className="font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('municipality')}
              >
                <div className="flex items-center">
                  {data.name === "All Provinces" ? "Province" : "Municipality"}
                  <SortIcon field="municipality" />
                </div>
              </TableHead>
              <TableHead 
                className="text-right font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('target100k')}
              >
                <div className="flex items-center justify-end">
                  Target (100K)
                  <SortIcon field="target100k" />
                </div>
              </TableHead>
              <TableHead 
                className="text-right font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('target200k')}
              >
                <div className="flex items-center justify-end">
                  Target (200K)
                  <SortIcon field="target200k" />
                </div>
              </TableHead>
              <TableHead 
                className="text-right font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('target')}
              >
                <div className="flex items-center justify-end">
                  Total Target
                  <SortIcon field="target" />
                </div>
              </TableHead>
              <TableHead 
                className="text-right font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('systemResult')}
              >
                <div className="flex items-center justify-end">
                  System Result
                  <SortIcon field="systemResult" />
                </div>
              </TableHead>
              <TableHead 
                className="text-right font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('systemVariance')}
              >
                <div className="flex items-center justify-end">
                  System Variance
                  <SortIcon field="systemVariance" />
                </div>
              </TableHead>
              <TableHead 
                className="w-[200px] font-semibold cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('progress')}
              >
                <div className="flex items-center">
                  Progress
                  <SortIcon field="progress" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMunicipalities.map((municipality) => {
              const progress = Math.min(
                Math.round((municipality.systemResult / municipality.target) * 100),
                100
              );
              const isComplete = municipality.systemVariance <= 0;

              return (
                <TableRow
                  key={municipality.municipality}
                  className="transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {municipality.municipality}
                      {isComplete && (
                        <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                          Complete
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {municipality.target100k.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {municipality.target200k.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">
                    {municipality.target.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold text-primary">
                    {municipality.systemResult.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "tabular-nums font-medium",
                        municipality.systemVariance <= 0
                          ? "text-success"
                          : municipality.systemVariance > municipality.target * 0.3
                          ? "text-destructive"
                          : "text-warning"
                      )}
                    >
                      {municipality.systemVariance.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="h-2 flex-1" />
                      <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                        {progress}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow className="bg-primary/5 font-bold border-t-2 border-primary/30">
              <TableCell className="font-bold text-foreground">Grand Total</TableCell>
              <TableCell className="text-right tabular-nums font-bold">
                {data.grandTotal.target100k.toLocaleString()}
              </TableCell>
              <TableCell className="text-right tabular-nums font-bold">
                {data.grandTotal.target200k.toLocaleString()}
              </TableCell>
              <TableCell className="text-right tabular-nums font-bold">
                {data.grandTotal.target.toLocaleString()}
              </TableCell>
              <TableCell className="text-right tabular-nums font-bold text-primary">
                {data.grandTotal.systemResult.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-bold">
                <span
                  className={cn(
                    "tabular-nums",
                    data.grandTotal.systemVariance <= 0 ? "text-success" : "text-warning"
                  )}
                >
                  {data.grandTotal.systemVariance.toLocaleString()}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress
                    value={Math.min(
                      Math.round(
                        (data.grandTotal.systemResult / data.grandTotal.target) * 100
                      ),
                      100
                    )}
                    className="h-2 flex-1"
                  />
                  <span className="text-xs font-medium w-12 text-right">
                    {Math.round(
                      (data.grandTotal.systemResult / data.grandTotal.target) * 100
                    )}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

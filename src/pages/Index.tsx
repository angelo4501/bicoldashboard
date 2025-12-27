import { useState, useMemo } from "react";
import { Target, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProvinceCard } from "@/components/dashboard/ProvinceCard";
import { MunicipalityTable } from "@/components/dashboard/MunicipalityTable";
import { ValidationChart } from "@/components/dashboard/ValidationChart";
import { Header } from "@/components/dashboard/Header";
import { useGoogleSheetData, PROVINCE_SHEETS, ProvinceKey } from "@/hooks/useGoogleSheetData";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type TabValue = 'all' | ProvinceKey;
type ProvinceSortField = 'name' | 'target' | 'systemResult' | 'systemVariance' | 'progress' | 'municipalities' | 'staffAssigned';

const Index = () => {
  const { data, loading, error, lastUpdated, refresh } = useGoogleSheetData();
  const [selectedTab, setSelectedTab] = useState<TabValue>('all');
  const [provinceSortField, setProvinceSortField] = useState<ProvinceSortField>('name');

  const currentData = selectedTab === 'all' 
    ? data?.combined 
    : data?.provinces[selectedTab];

  const grandTotal = currentData?.grandTotal || { target: 0, target100k: 0, target200k: 0, systemResult: 0, systemVariance: 0, municipality: '' };
  const progressPercentage = grandTotal.target > 0 
    ? Math.round((grandTotal.systemResult / grandTotal.target) * 100) 
    : 0;

  const provinceKeys = Object.keys(PROVINCE_SHEETS) as ProvinceKey[];

  const sortedProvinceKeys = useMemo(() => {
    if (!data || selectedTab !== 'all') return provinceKeys;

    const sorted = [...provinceKeys].sort((a, b) => {
      const provinceA = data.provinces[a];
      const provinceB = data.provinces[b];
      
      if (!provinceA || !provinceB) return 0;

      let aValue: number | string;
      let bValue: number | string;

      switch (provinceSortField) {
        case 'name':
          aValue = provinceA.name.toLowerCase();
          bValue = provinceB.name.toLowerCase();
          return (aValue as string).localeCompare(bValue as string);
        case 'target':
          aValue = provinceA.grandTotal.target;
          bValue = provinceB.grandTotal.target;
          break;
        case 'systemResult':
          aValue = provinceA.grandTotal.systemResult;
          bValue = provinceB.grandTotal.systemResult;
          break;
        case 'systemVariance':
          aValue = provinceA.grandTotal.systemVariance;
          bValue = provinceB.grandTotal.systemVariance;
          break;
        case 'progress':
          aValue = Math.round((provinceA.grandTotal.systemResult / provinceA.grandTotal.target) * 100);
          bValue = Math.round((provinceB.grandTotal.systemResult / provinceB.grandTotal.target) * 100);
          break;
        case 'municipalities':
          aValue = provinceA.municipalities.length;
          bValue = provinceB.municipalities.length;
          break;
        case 'staffAssigned':
          aValue = provinceA.staffAssigned ?? 0;
          bValue = provinceB.staffAssigned ?? 0;
          break;
        default:
          return 0;
      }

      return (bValue as number) - (aValue as number); // Descending by default for numeric fields
    });

    return sorted;
  }, [data, provinceKeys, provinceSortField, selectedTab]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 space-y-8">
        {/* Province Selector Tabs */}
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as TabValue)} className="w-full">
          <TabsList className="flex flex-wrap md:flex-nowrap w-full md:w-auto gap-1 md:gap-1 h-auto md:h-10">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap flex-shrink-0"
            >
              All Provinces
            </TabsTrigger>
            {provinceKeys.map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap flex-shrink-0"
              >
                {PROVINCE_SHEETS[key].name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Data Status Bar */}
        <div className={cn(
          "flex items-center justify-between bg-card rounded-lg border p-4",
          error && "border-destructive border-2"
        )}>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : lastUpdated ? (
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              ) : null}
            </div>
            {error && (
              <span className="text-sm text-destructive font-medium">{error}</span>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Overview */}
        <section className="grid gap-4 md:grid-cols-3">
          {loading && !data ? (
            <>
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </>
          ) : (
            <>
              <StatCard
                title="Target"
                value={grandTotal.target}
                subtitle="Total target beneficiaries"
                icon={Target}
                variant="info"
                delay={0}
              />
              <StatCard
                title="System Result"
                value={grandTotal.systemResult}
                subtitle={`${progressPercentage}% of target achieved`}
                icon={TrendingUp}
                variant="primary"
                trend={{
                  value: progressPercentage,
                  isPositive: progressPercentage >= 50,
                }}
                delay={100}
              />
              <StatCard
                title="System Variance"
                value={grandTotal.systemVariance}
                subtitle="Remaining to achieve target"
                icon={AlertTriangle}
                variant="warning"
                delay={200}
              />
            </>
          )}
        </section>

        {/* Province Cards - Only show when "All Provinces" is selected */}
        {selectedTab === 'all' && data && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Province Overview</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={provinceSortField} onValueChange={(value) => setProvinceSortField(value as ProvinceSortField)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="target">Target</SelectItem>
                    <SelectItem value="systemResult">System Result</SelectItem>
                    <SelectItem value="systemVariance">Variance</SelectItem>
                    <SelectItem value="progress">Progress %</SelectItem>
                    <SelectItem value="municipalities">Municipalities</SelectItem>
                    <SelectItem value="staffAssigned">Staff Assigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {sortedProvinceKeys.map((key, index) => (
                data.provinces[key] && (
                  <ProvinceCard
                    key={key}
                    data={data.provinces[key]}
                    onClick={() => setSelectedTab(key)}
                    delay={index * 100}
                  />
                )
              ))}
            </div>
          </section>
        )}

        {/* Charts Section */}
        {currentData && (
          <section className="grid gap-6 lg:grid-cols-2">
            <ValidationChart data={currentData} type="bar" />
            <ValidationChart data={currentData} type="pie" />
          </section>
        )}

        {/* Municipality Table */}
        {currentData && (
          <section>
            <MunicipalityTable data={currentData} />
          </section>
        )}

        {/* Loading State for Table */}
        {loading && !data && (
          <section className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-96 rounded-xl" />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Scale-Up Results Dashboard • Bicol Region</p>
          <p className="mt-1">By: Angelo</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

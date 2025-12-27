import { useState, useEffect, useCallback } from 'react';
import { ProvinceData, MunicipalityData } from '@/data/provinceData';

// Configuration: Update these values for your region
// See CONFIGURATION_GUIDE.md for detailed instructions

const SHEET_ID = '1e4tUUkePxBzaCYtZvsd4cMyNV5jHwVJFsDSwOx2aZDs';
const REFRESH_INTERVAL = 30000;
const STAFF_ASSIGNMENT_GID = 1713821295;

export const PROVINCE_SHEETS = {
  albay: { name: 'Albay', gid: 0 },
  camarinesnorte: { name: 'Camarines Norte', gid: 994448163 },
  camarinessur: { name: 'Camarines Sur', gid: 1099131531 },
  catanduanes: { name: 'Catanduanes', gid: 1492615546 },
  masbate: { name: 'Masbate', gid: 306476118 },
  sorsogon: { name: 'Sorsogon', gid: 752950571 },
} as const;

const PROVINCE_NAME_MAP: Record<string, ProvinceKey> = {
  'ALBAY': 'albay',
  'CAMARINES NORTE': 'camarinesnorte',
  'CAMARINES SUR': 'camarinessur',
  'CATANDUANES': 'catanduanes',
  'MASBATE': 'masbate',
  'SORGOSON': 'sorsogon',
};

export type ProvinceKey = keyof typeof PROVINCE_SHEETS;

interface AllProvincesData {
  provinces: Record<ProvinceKey, ProvinceData>;
  combined: ProvinceData;
}

interface UseGoogleSheetDataResult {
  data: AllProvincesData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;z
  refresh: () => Promise<void>; 
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseNumber(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

async function fetchStaffAssignments(): Promise<Record<ProvinceKey, number>> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${STAFF_ASSIGNMENT_GID}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch staff assignments: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    const dataLines = lines.slice(1);
    const staffAssignments: Record<string, number> = {};
    
    for (const line of dataLines) {
      const columns = parseCSVLine(line);
      const provinceName = columns[0]?.trim().toUpperCase();
      const staffCount = parseNumber(columns[1] || '0');
      
      if (provinceName && provinceName !== 'PROVINCES') {
        const provinceKey = PROVINCE_NAME_MAP[provinceName];
        if (provinceKey && staffCount > 0) {
          staffAssignments[provinceKey] = staffCount;
        }
      }
    }
    
    return staffAssignments as Record<ProvinceKey, number>;
  } catch (error) {
    console.error('Error fetching staff assignments:', error);
    return {} as Record<ProvinceKey, number>;
  }
}

async function fetchSheetData(gid: number, provinceName: string, provinceKey?: ProvinceKey): Promise<ProvinceData> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${provinceName} data: ${response.statusText}`);
  }
  
  const csvText = await response.text();
  const lines = csvText.split('\n').filter(line => line.trim());
  const headerLine = lines[0] || '';
  const headerColumns = parseCSVLine(headerLine);
  const hasTotalTarget = headerColumns.some(col => col.toUpperCase().includes('TOTAL TARGET'));
  const dataLines = lines.slice(1);
  
  const municipalities: MunicipalityData[] = [];
  
  for (const line of dataLines) {
    const columns = parseCSVLine(line);
    
    const lgu = columns[0]?.trim();
    let target100k: number, target200k: number, target: number, systemResult: number, systemVariance: number;
    
    if (provinceKey === 'sorsogon' || provinceKey === 'camarinessur') {
      target100k = 0;
      target200k = parseNumber(columns[4] || '0');
      target = target200k;
      systemResult = parseNumber(columns[5] || '0');
      systemVariance = parseNumber(columns[6] || '0');
    } else {
      if (hasTotalTarget) {
        target100k = parseNumber(columns[1] || '0');
        target200k = parseNumber(columns[4] || '0');
        const totalTargetFromSheet = parseNumber(columns[7] || '0');
        target = totalTargetFromSheet > 0 ? totalTargetFromSheet : target100k + target200k;
        systemResult = parseNumber(columns[8] || '0');
        systemVariance = parseNumber(columns[9] || '0');
      } else {
        target100k = parseNumber(columns[1] || '0');
        target200k = 0;
        target = target100k;
        systemResult = parseNumber(columns[2] || '0');
        systemVariance = parseNumber(columns[3] || '0');
      }
    }
    
    if (lgu && 
        lgu.toUpperCase() !== 'TOTAL' && 
        lgu.toUpperCase() !== 'LGU' &&
        !lgu.toUpperCase().includes('GRAND TOTAL')) {
      municipalities.push({
        municipality: lgu,
        target,
        target100k,
        target200k,
        systemResult,
        systemVariance,
      });
    }
  }
  
  const grandTotal = municipalities.reduce(
    (acc, m) => ({
      municipality: 'Grand Total',
      target: acc.target + m.target,
      target100k: acc.target100k + m.target100k,
      target200k: acc.target200k + m.target200k,
      systemResult: acc.systemResult + m.systemResult,
      systemVariance: acc.systemVariance + m.systemVariance,
    }),
    { municipality: 'Grand Total', target: 0, target100k: 0, target200k: 0, systemResult: 0, systemVariance: 0 }
  );
  
  return {
    name: provinceName,
    municipalities,
    grandTotal,
  };
}

function calculateCombinedData(provinces: Record<ProvinceKey, ProvinceData>): ProvinceData {
  const allMunicipalities: MunicipalityData[] = Object.entries(provinces).map(([key, province]) => ({
    municipality: province.name,
    target: province.grandTotal.target,
    target100k: province.grandTotal.target100k,
    target200k: province.grandTotal.target200k,
    systemResult: province.grandTotal.systemResult,
    systemVariance: province.grandTotal.systemVariance,
  }));

  const grandTotal = allMunicipalities.reduce(
    (acc, m) => ({
      municipality: 'Grand Total',
      target: acc.target + m.target,
      target100k: acc.target100k + m.target100k,
      target200k: acc.target200k + m.target200k,
      systemResult: acc.systemResult + m.systemResult,
      systemVariance: acc.systemVariance + m.systemVariance,
    }),
    { municipality: 'Grand Total', target: 0, target100k: 0, target200k: 0, systemResult: 0, systemVariance: 0 }
  );

  return {
    name: 'All Provinces',
    municipalities: allMunicipalities,
    grandTotal,
  };
}

export function useGoogleSheetData(): UseGoogleSheetDataResult {
  const [data, setData] = useState<AllProvincesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all provinces in parallel
      const provinceEntries = Object.entries(PROVINCE_SHEETS) as [ProvinceKey, typeof PROVINCE_SHEETS[ProvinceKey]][];
      
      const results = await Promise.allSettled(
        provinceEntries.map(([key, { name, gid }]) => 
          fetchSheetData(gid, name, key).then(data => ({ key, data }))
        )
      );
      
      const provinces = {} as Record<ProvinceKey, ProvinceData>;
      const errors: string[] = [];
      
      for (const result of results) {
        if (result.status === 'fulfilled') {
          provinces[result.value.key] = result.value.data;
        } else {
          errors.push(result.reason?.message || 'Unknown error');
        }
      }
      
      // Only proceed if we have at least one province
      if (Object.keys(provinces).length === 0) {
        throw new Error('Failed to fetch any province data');
      }
      
      // Fetch staff assignments
      const staffAssignments = await fetchStaffAssignments();
      
      // Add staff assignments to province data
      for (const [key, province] of Object.entries(provinces)) {
        if (staffAssignments[key as ProvinceKey]) {
          province.staffAssigned = staffAssignments[key as ProvinceKey];
        }
      }
      
      const combined = calculateCombinedData(provinces);
      
      setData({ provinces, combined });
      setLastUpdated(new Date());
      
      if (errors.length > 0) {
        setError(`Some data failed to load: ${errors.join(', ')}`);
      }
    } catch (err) {
      console.error('Error fetching Google Sheet data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh interval
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [fetchData]);

  return { data, loading, error, lastUpdated, refresh: fetchData };
}

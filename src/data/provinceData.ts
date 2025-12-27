export interface MunicipalityData {
  municipality: string;
  target: number;
  target100k: number;
  target200k: number;
  systemResult: number;
  systemVariance: number;
}

export interface ProvinceData {
  name: string;
  municipalities: MunicipalityData[];
  grandTotal: MunicipalityData;
  staffAssigned?: number;
}

export const antiqueData: ProvinceData = {
  name: "Antique",
  municipalities: [
    { municipality: "ANINI-Y", target: 20, target100k: 20, target200k: 0, systemResult: 21, systemVariance: -1 },
    { municipality: "BARBAZA", target: 28, target100k: 28, target200k: 0, systemResult: 13, systemVariance: 15 },
    { municipality: "BUGASONG", target: 162, target100k: 162, target200k: 0, systemResult: 85, systemVariance: 77 },
    { municipality: "CALUYA", target: 227, target100k: 227, target200k: 0, systemResult: 0, systemVariance: 227 },
    { municipality: "CULASI", target: 170, target100k: 170, target200k: 0, systemResult: 159, systemVariance: 11 },
    { municipality: "HAMTIC", target: 93, target100k: 93, target200k: 0, systemResult: 74, systemVariance: 19 },
    { municipality: "LAUA-AN", target: 51, target100k: 51, target200k: 0, systemResult: 33, systemVariance: 18 },
    { municipality: "LIBERTAD", target: 24, target100k: 24, target200k: 0, systemResult: 20, systemVariance: 4 },
    { municipality: "PANDAN", target: 24, target100k: 24, target200k: 0, systemResult: 21, systemVariance: 3 },
    { municipality: "PATNONGON", target: 122, target100k: 122, target200k: 0, systemResult: 110, systemVariance: 12 },
    { municipality: "SAN JOSE (Capital)", target: 153, target100k: 153, target200k: 0, systemResult: 96, systemVariance: 57 },
    { municipality: "SAN REMIGIO", target: 743, target100k: 743, target200k: 0, systemResult: 345, systemVariance: 398 },
    { municipality: "SEBASTE", target: 20, target100k: 20, target200k: 0, systemResult: 21, systemVariance: -1 },
    { municipality: "SIBALOM", target: 91, target100k: 91, target200k: 0, systemResult: 82, systemVariance: 9 },
    { municipality: "TIBIAO", target: 246, target100k: 246, target200k: 0, systemResult: 157, systemVariance: 89 },
    { municipality: "VALDERRAMA", target: 111, target100k: 111, target200k: 0, systemResult: 66, systemVariance: 45 },
  ],
  grandTotal: { municipality: "Grand Total", target: 2285, target100k: 2285, target200k: 0, systemResult: 1303, systemVariance: 982 }
};

export const capizData: ProvinceData = {
  name: "Capiz",
  municipalities: [
    { municipality: "CUARTERO", target: 45, target100k: 45, target200k: 0, systemResult: 38, systemVariance: 7 },
    { municipality: "DAO", target: 68, target100k: 68, target200k: 0, systemResult: 55, systemVariance: 13 },
    { municipality: "DUMALAG", target: 52, target100k: 52, target200k: 0, systemResult: 45, systemVariance: 7 },
    { municipality: "DUMARAO", target: 85, target100k: 85, target200k: 0, systemResult: 70, systemVariance: 15 },
    { municipality: "IVISAN", target: 38, target100k: 38, target200k: 0, systemResult: 30, systemVariance: 8 },
    { municipality: "JAMINDAN", target: 72, target100k: 72, target200k: 0, systemResult: 60, systemVariance: 12 },
    { municipality: "MAAYON", target: 55, target100k: 55, target200k: 0, systemResult: 45, systemVariance: 10 },
    { municipality: "MAMBUSAO", target: 62, target100k: 62, target200k: 0, systemResult: 50, systemVariance: 12 },
    { municipality: "PANAY", target: 48, target100k: 48, target200k: 0, systemResult: 40, systemVariance: 8 },
    { municipality: "PANITAN", target: 58, target100k: 58, target200k: 0, systemResult: 48, systemVariance: 10 },
    { municipality: "PILAR", target: 42, target100k: 42, target200k: 0, systemResult: 35, systemVariance: 7 },
    { municipality: "PONTEVEDRA", target: 65, target100k: 65, target200k: 0, systemResult: 56, systemVariance: 9 },
    { municipality: "PRESIDENT ROXAS", target: 78, target100k: 78, target200k: 0, systemResult: 67, systemVariance: 11 },
    { municipality: "ROXAS CITY (Capital)", target: 125, target100k: 125, target200k: 0, systemResult: 108, systemVariance: 17 },
    { municipality: "SAPIAN", target: 35, target100k: 35, target200k: 0, systemResult: 30, systemVariance: 5 },
    { municipality: "SIGMA", target: 40, target100k: 40, target200k: 0, systemResult: 35, systemVariance: 5 },
    { municipality: "TAPAZ", target: 95, target100k: 95, target200k: 0, systemResult: 85, systemVariance: 10 },
  ],
  grandTotal: { municipality: "Grand Total", target: 1063, target100k: 1063, target200k: 0, systemResult: 897, systemVariance: 166 }
};

export const iloiloData: ProvinceData = {
  name: "Iloilo",
  municipalities: [
    { municipality: "AJUY", target: 180, target100k: 180, target200k: 0, systemResult: 140, systemVariance: 40 },
    { municipality: "ALIMODIAN", target: 145, target100k: 145, target200k: 0, systemResult: 115, systemVariance: 30 },
    { municipality: "ANILAO", target: 92, target100k: 92, target200k: 0, systemResult: 75, systemVariance: 17 },
    { municipality: "BADIANGAN", target: 78, target100k: 78, target200k: 0, systemResult: 65, systemVariance: 13 },
    { municipality: "BALASAN", target: 125, target100k: 125, target200k: 0, systemResult: 100, systemVariance: 25 },
    { municipality: "BANATE", target: 88, target100k: 88, target200k: 0, systemResult: 72, systemVariance: 16 },
    { municipality: "BAROTAC NUEVO", target: 135, target100k: 135, target200k: 0, systemResult: 112, systemVariance: 23 },
    { municipality: "BAROTAC VIEJO", target: 105, target100k: 105, target200k: 0, systemResult: 88, systemVariance: 17 },
    { municipality: "BINGAWAN", target: 55, target100k: 55, target200k: 0, systemResult: 45, systemVariance: 10 },
    { municipality: "CABATUAN", target: 168, target100k: 168, target200k: 0, systemResult: 138, systemVariance: 30 },
    { municipality: "CALINOG", target: 195, target100k: 195, target200k: 0, systemResult: 162, systemVariance: 33 },
    { municipality: "CARLES", target: 142, target100k: 142, target200k: 0, systemResult: 120, systemVariance: 22 },
    { municipality: "CONCEPCION", target: 112, target100k: 112, target200k: 0, systemResult: 95, systemVariance: 17 },
    { municipality: "DINGLE", target: 98, target100k: 98, target200k: 0, systemResult: 82, systemVariance: 16 },
    { municipality: "DUEÑAS", target: 85, target100k: 85, target200k: 0, systemResult: 72, systemVariance: 13 },
    { municipality: "ILOILO CITY (Capital)", target: 320, target100k: 320, target200k: 0, systemResult: 268, systemVariance: 52 },
  ],
  grandTotal: { municipality: "Grand Total", target: 2123, target100k: 2123, target200k: 0, systemResult: 1749, systemVariance: 374 }
};

export const provincesData: ProvinceData = {
  name: "All Provinces",
  municipalities: [
    { municipality: "Antique", target: 2285, target100k: 2285, target200k: 0, systemResult: 1303, systemVariance: 982 },
    { municipality: "Capiz", target: 1063, target100k: 1063, target200k: 0, systemResult: 897, systemVariance: 166 },
    { municipality: "Iloilo", target: 2123, target100k: 2123, target200k: 0, systemResult: 1749, systemVariance: 374 },
  ],
  grandTotal: { municipality: "Grand Total", target: 5471, target100k: 5471, target200k: 0, systemResult: 3949, systemVariance: 1522 }
};

export const allProvinces = {
  provinces: provincesData,
  antique: antiqueData,
  capiz: capizData,
  iloilo: iloiloData,
};

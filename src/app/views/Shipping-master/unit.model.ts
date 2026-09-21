export interface UnitModel {
  unitId: number;
  name: string;
  nameAr: string;
}

export function parseUnit(json: any): UnitModel {
  return {
    unitId: json.unitId,
    name: json.name,
    nameAr: json.nameAr,
  };
}

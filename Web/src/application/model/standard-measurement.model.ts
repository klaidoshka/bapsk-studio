import {UnitOfMeasureType} from './unit-of-measure-type.model';

export const measurementCodeUnits = [
  {code: '120', label: 'misc.measurement.unit.120'},
  {code: 'ASV', label: 'misc.measurement.unit.ASV'},
  {code: 'CEN', label: 'misc.measurement.unit.CEN'},
  {code: 'GRM', label: 'misc.measurement.unit.GRM'},
  {code: 'HLT', label: 'misc.measurement.unit.HLT'},
  {code: 'KGM', label: 'misc.measurement.unit.KGM'},
  {code: 'KLT', label: 'misc.measurement.unit.KLT'},
  {code: 'LPA', label: 'misc.measurement.unit.LPA'},
  {code: 'LTR', label: 'misc.measurement.unit.LTR'},
  {code: 'MIL', label: 'misc.measurement.unit.MIL'},
  {code: 'NAR', label: 'misc.measurement.unit.NAR'},
  {code: 'NPR', label: 'misc.measurement.unit.NPR'}
]

export const defaultStandardMeasurement = 'NAR';

export const measurementTypes = [
  {label: 'misc.measurement.type.code', value: UnitOfMeasureType.UnitOfMeasureCode},
  {label: 'misc.measurement.type.other', value: UnitOfMeasureType.UnitOfMeasureOther}
];

export const toMeasurementLabel = (measurement: string): string => {
  const measurementUnit = measurementCodeUnits.find(it => it.code === measurement);

  if (measurementUnit) {
    return measurementUnit.label;
  }

  return measurement;
};

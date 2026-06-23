import { handleCutZero } from '@/utils/tools';
import type { Page7TableRow } from './parameterDefaults';

/** 电机转速(r/min) → 标准单位转速(rad/s)，与 page3-1 计算一致 */
export function computeStdSpeedFromRpm(rpm: string | number | undefined): string {
  const n = Number(rpm);
  if (!Number.isFinite(n)) return '';
  return handleCutZero(((n * 6.283) / 60).toFixed(3));
}

/** 负载刚度 = (标准单位空载转速 − 标准单位额定转速) / 电机额定转矩 */
export function computeLoadStiffness(
  noLoadRpm: string | number | undefined,
  ratedRpm: string | number | undefined,
  ratedTorque: string | number | undefined,
): string {
  const torque = Number(ratedTorque);
  if (!Number.isFinite(torque) || torque === 0) return '';

  const stdNoLoad = Number(computeStdSpeedFromRpm(noLoadRpm));
  const stdRated = Number(computeStdSpeedFromRpm(ratedRpm));
  if (!Number.isFinite(stdNoLoad) || !Number.isFinite(stdRated)) return '';

  const val = (stdNoLoad - stdRated) / torque;
  if (!Number.isFinite(val)) return '';
  return handleCutZero(val.toFixed(3));
}

/** 舟它额定负载时电机转矩 = 舟它额定负载 / 总减速比 / 传动效率 */
export function computeRatedLoadMotorTorque(
  ratedLoad: string | number | undefined,
  totalReductionRatio: string | number | undefined,
  transmissionEfficiency: string | number | undefined,
): string {
  const load = Number(ratedLoad);
  const ratio = Number(totalReductionRatio);
  const efficiency = Number(transmissionEfficiency);
  if (!Number.isFinite(load) || !Number.isFinite(ratio) || !Number.isFinite(efficiency)) return '';
  if (ratio === 0 || efficiency === 0) return '';

  const val = load / ratio / efficiency;
  if (!Number.isFinite(val)) return '';
  return handleCutZero(val.toFixed(3));
}

/** 舟它额定负载时电机转速 = 标准单位空载转速 − 负载刚度 × 舟它额定负载时电机转矩 */
export function computeRatedLoadMotorSpeedFromRow(row: Page7TableRow): string {
  const stdNoLoad = Number(computeStdSpeedFromRpm(row.p15));
  const stiffness = Number(computeLoadStiffness(row.p15, row.p16, row.p17));
  const motorTorque = Number(computeRatedLoadMotorTorque(row.auxRatedLoad, row.p20, row.p19));

  if (!Number.isFinite(stdNoLoad) || !Number.isFinite(stiffness) || !Number.isFinite(motorTorque)) {
    return '';
  }

  const val = stdNoLoad - stiffness * motorTorque;
  if (!Number.isFinite(val)) return '';
  return handleCutZero(val.toFixed(2));
}

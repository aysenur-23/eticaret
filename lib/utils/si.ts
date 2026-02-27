/**
 * SI Unit Conversion Utilities
 * Handles conversion between different units (V, A, W, °C, Nm, etc.)
 */

export type UnitType = 'voltage' | 'current' | 'power' | 'temperature' | 'torque' | 'length' | 'weight' | 'frequency'

export interface Unit {
  name: string
  symbol: string
  toBase: (value: number) => number // Convert to base SI unit
  fromBase: (value: number) => number // Convert from base SI unit
}

const units: Record<UnitType, Record<string, Unit>> = {
  voltage: {
    V: { name: 'Volt', symbol: 'V', toBase: (v) => v, fromBase: (v) => v },
    mV: { name: 'Millivolt', symbol: 'mV', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    kV: { name: 'Kilovolt', symbol: 'kV', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  },
  current: {
    A: { name: 'Ampere', symbol: 'A', toBase: (v) => v, fromBase: (v) => v },
    mA: { name: 'Milliampere', symbol: 'mA', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    kA: { name: 'Kiloampere', symbol: 'kA', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  },
  power: {
    W: { name: 'Watt', symbol: 'W', toBase: (v) => v, fromBase: (v) => v },
    mW: { name: 'Milliwatt', symbol: 'mW', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    kW: { name: 'Kilowatt', symbol: 'kW', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    MW: { name: 'Megawatt', symbol: 'MW', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
  },
  temperature: {
    C: { name: 'Celsius', symbol: '°C', toBase: (v) => v + 273.15, fromBase: (v) => v - 273.15 },
    F: { name: 'Fahrenheit', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9 + 273.15, fromBase: (v) => ((v - 273.15) * 9) / 5 + 32 },
    K: { name: 'Kelvin', symbol: 'K', toBase: (v) => v, fromBase: (v) => v },
  },
  torque: {
    Nm: { name: 'Newton-meter', symbol: 'Nm', toBase: (v) => v, fromBase: (v) => v },
    mNm: { name: 'Millinewton-meter', symbol: 'mNm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    kNm: { name: 'Kilonewton-meter', symbol: 'kNm', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  },
  length: {
    m: { name: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
    mm: { name: 'Millimeter', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    cm: { name: 'Centimeter', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    km: { name: 'Kilometer', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  },
  weight: {
    g: { name: 'Gram', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    kg: { name: 'Kilogram', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
    mg: { name: 'Milligram', symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
  },
  frequency: {
    Hz: { name: 'Hertz', symbol: 'Hz', toBase: (v) => v, fromBase: (v) => v },
    kHz: { name: 'Kilohertz', symbol: 'kHz', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    MHz: { name: 'Megahertz', symbol: 'MHz', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
  },
}

/**
 * Convert a value from one unit to another within the same type
 */
export function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
  type: UnitType
): number {
  const typeUnits = units[type]
  const from = typeUnits[fromUnit]
  const to = typeUnits[toUnit]

  if (!from || !to) {
    throw new Error(`Invalid unit conversion: ${fromUnit} to ${toUnit} for type ${type}`)
  }

  const baseValue = from.toBase(value)
  return to.fromBase(baseValue)
}

/**
 * Normalize a value to base SI unit
 */
export function normalizeToBase(value: number, unit: string, type: UnitType): number {
  const typeUnits = units[type]
  const unitDef = typeUnits[unit]

  if (!unitDef) {
    throw new Error(`Invalid unit: ${unit} for type ${type}`)
  }

  return unitDef.toBase(value)
}

/**
 * Format a value with unit symbol
 */
export function formatUnit(value: number, unit: string, decimals: number = 2): string {
  return `${value.toFixed(decimals)} ${unit}`
}

/**
 * Parse a value with unit (e.g., "12V" -> { value: 12, unit: "V" })
 */
export function parseUnit(str: string): { value: number; unit: string } | null {
  const match = str.match(/^([\d.]+)\s*([a-zA-Z°]+)$/)
  if (!match) return null

  return {
    value: parseFloat(match[1]),
    unit: match[2],
  }
}

/**
 * Get available units for a type
 */
export function getAvailableUnits(type: UnitType): Unit[] {
  return Object.values(units[type])
}


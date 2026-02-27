/**
 * Türkiye 81 il ve ilçe listesi – GES teklif formu ve adres seçimleri için.
 */

import trCitiesData from './tr-cities-data.json'

export type CityWithDistricts = {
  name: string
  districts: string[]
}

export const TR_CITIES: CityWithDistricts[] = trCitiesData as CityWithDistricts[]

export function getDistrictsByCity(cityName: string): string[] {
  const city = TR_CITIES.find((c) => c.name === cityName)
  return city?.districts ?? []
}

/*
  Mô hình dữ liệu thời tiết
  Nguồn dữ liệu: http://www.nmc.cn (Đài Khí tượng Trung ương)
*/

/**
 * Định vị
 */
export interface Position {
  /** Thành phố */
  city: string;
  /** Mã */
  code: string;
  /** Tỉnh */
  province: string;
  /** Trang chuyên dụng */
  url: string;
}

/**
 * Tỉnh
 */
export interface Province {
  /** Mã */
  code: string;
  /** Tên */
  name: string;
  /** Trang chuyên dụng */
  url: string;
}

export interface Air {
  aq: number;
  aqi: number;
  aqiCode: string;
  forecasttime: Date;
  text: string;
}

export interface Weather {
  airpressure: number;
  feelst: number;
  humidity: number;
  icomfort: number;
  img: string;
  info: string;
  rain: number;
  rcomfort: number;
  temperature: number;
  temperatureDiff: number;
}

export interface Wind {
  degree: number;
  direct: string;
  power: string;
  speed: number;
}

export interface PredictDetail {
  date: Date;
  pt: Date;
  day: { weather: Weather; wind: Wind };
  night: { weather: Weather; wind: Wind };
}

export interface Predict {
  detail: PredictDetail[];
  publish_time: Date;
  station: Position;
}

export interface Real {
  publish_time: Date;
  station: Position;
  weather: Weather;
  wind: Wind;
}

export interface Tempchart {
  day_img: string;
  day_text: string;
  max_temp: number;
  min_temp: number;
  night_img: string;
  night_text: string;
  time: Date;
}

export interface WeatherInfo {
  air: Air;
  predict: Predict;
  real: Real;
  tempchart: Tempchart;
}

export interface WeatherResult {
  code: number;
  msg: string;
  data: WeatherInfo;
}

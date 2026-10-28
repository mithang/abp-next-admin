export * from './dto';
export * from './error';
// dto.ts và error.ts đều định nghĩa RemoteServiceErrorInfo (bản dto.ts bắt
// buộc validationErrors, bản error.ts để tùy chọn — consumer duy nhất
// useErrorFormat đã guard validationErrors nên dùng bản error.ts). Export tường
// minh này thắng export * và gỡ lỗi TS2308 do trùng tên.
export type { RemoteServiceErrorInfo } from './error';
export * from './features';
export * from './global';
export * from './localization';
export * from './openid';
export * from './permissions';
export * from './rules';
export * from './settings';
export * from './table';
export * from './validations';

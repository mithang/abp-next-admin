import type { LanguageDto } from '../localization/types';

export interface CulturePickerOption {
  /** '' = nội dung mặc định, không gắn culture. */
  value: string;
  label: string;
}

/**
 * Danh sách chọn culture cho màn nội dung mẫu văn bản.
 *
 * Nguồn thật duy nhất: GET /api/localization/languages (ngôn ngữ đã cấu
 * hình trong hệ thống) — không hardcode danh sách culture, vì culture
 * khả dụng phụ thuộc dữ liệu tenant/hệ thống, không phải một hằng số
 * của app. Luôn có lựa chọn đầu tiên là nội dung mặc định (value '').
 *
 * Quy tắc:
 * - Bỏ qua cultureName rỗng/khoảng trắng, trim hai đầu.
 * - Khử trùng theo cultureName chính xác (backend dùng cultureName làm
 *   khóa ngôn ngữ); giữ bản ghi đầu tiên gặp.
 * - Sắp xếp theo cultureName tăng dần để danh sách ổn định, không phụ
 *   thuộc thứ tự phân trang trả về.
 * - Nhãn: "displayName (cultureName)" khi displayName khác rỗng và khác
 *   cultureName; ngược lại chỉ cultureName.
 */
export function buildCulturePickerOptions(
  languages: readonly LanguageDto[],
  defaultLabel: string,
): CulturePickerOption[] {
  const seen = new Set<string>();
  const options: CulturePickerOption[] = [{ value: '', label: defaultLabel }];
  const sorted = [...languages]
    .map((lang) => ({
      cultureName: lang.cultureName?.trim() ?? '',
      displayName: lang.displayName?.trim() ?? '',
    }))
    .filter((lang) => lang.cultureName.length > 0)
    .sort((a, b) => (a.cultureName < b.cultureName ? -1 : a.cultureName > b.cultureName ? 1 : 0));
  for (const lang of sorted) {
    if (seen.has(lang.cultureName)) continue;
    seen.add(lang.cultureName);
    options.push({
      value: lang.cultureName,
      label:
        lang.displayName.length > 0 && lang.displayName !== lang.cultureName
          ? `${lang.displayName} (${lang.cultureName})`
          : lang.cultureName,
    });
  }
  return options;
}

/** Culture đang chọn có nằm trong danh sách picker không ('' luôn hợp lệ). */
export function isCultureInOptions(culture: string, options: readonly CulturePickerOption[]): boolean {
  return options.some((option) => option.value === culture);
}

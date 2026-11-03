import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { AppSelect, type AppSelectOption } from './AppSelect';

interface AppFormSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  options: AppSelectOption[];
  placeholder?: string;
  clearable?: boolean;
  testID?: string;
  /** Ham dich loi field (createFieldError): neu khong truyen, khong hien loi. */
  fieldError?: (message?: string) => string | undefined;
}

/**
 * Select cua form dung chung: Controller + AppSelect trong 1 tag.
 *
 * Truoc vong 50, 6 form select trong `src/app` tu lap cung khoi
 * Controller 12-16 dong (control/name/render + AppSelect voi
 * label/value/options/onChange/placeholder/error/clearable/testID).
 * Moi lan doi quy tac select cua form (vi du value undefined -> ''
 * hay cach truyen loi) phai sua 6 cho. Helper nay giu nguyen ngu
 * nghia goc theo tung site: value `field.value ?? ''` (site
 * valueType dung `field.value` cho field string co default '0',
 * 5 site con lai dung `field.value ?? ''` — cung ket qua khi value
 * da co, va AppSelect hien '' nhu "chua chon" giong undefined),
 * error chi dich qua `fieldError` khi caller truyen ham (giong
 * AppFormInput, ca 6 site goc deu truyen fieldError).
 *
 * Co tinh KHONG bao gom: cac AppSelect dung ngoai Controller
 * (filter list, picker khong phai field form) va cac Controller
 * AppInput/AppSwitchField (pattern rieng, co helper cua chung).
 */
export function AppFormSelect<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  clearable,
  testID,
  fieldError,
}: AppFormSelectProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <AppSelect
          label={label}
          value={field.value ?? ''}
          options={options}
          onChange={field.onChange}
          placeholder={placeholder}
          error={fieldError ? fieldError(fieldState.error?.message) : undefined}
          clearable={clearable}
          testID={testID}
        />
      )}
    />
  );
}

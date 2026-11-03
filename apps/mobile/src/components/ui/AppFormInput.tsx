import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { AppInput } from './AppInput';

interface AppFormInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  multiline?: boolean;
  secureTextEntry?: boolean;
  testID?: string;
  /** Ham dich loi field (createFieldError): neu khong truyen, khong hien loi. */
  fieldError?: (message?: string) => string | undefined;
}

/**
 * Field text cua form dung chung: Controller + AppInput trong 1 tag.
 *
 * Truoc vong 49, 124 form field trong `src/app` tu lap cung khoi
 * Controller 9-13 dong (control/name/render + AppInput voi
 * value/onChangeText/placeholder/error/testID). Moi lan doi quy tac
 * field (vi du value undefined -> '' hay cach truyen loi) phai sua
 * 124 cho. Helper nay giu nguyen ngu nghia goc theo tung site:
 * value `field.value ?? ''` (cac site goc dung `field.value` cho field
 * bat buoc va `field.value ?? ''` cho field tuy chon — cung ket qua khi
 * value da co, va tranh crash khi value undefined), error chi dich qua
 * `fieldError` khi caller truyen ham (cac site khong co error giu
 * nguyen khong hien loi).
 *
 * Co tinh KHONG bao gom: Controller co onChange phu (side effect),
 * Controller name dong (form render theo danh sach field runtime),
 * Controller boc AppInput trong fragment (error render rieng), va cac
 * Controller AppSelect/AppSwitchField (pattern rieng, de vong sau).
 */
export function AppFormInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  autoCapitalize,
  keyboardType,
  multiline,
  secureTextEntry,
  testID,
  fieldError,
}: AppFormInputProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <AppInput
          label={label}
          value={field.value ?? ''}
          onChangeText={field.onChange}
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          error={fieldError ? fieldError(fieldState.error?.message) : undefined}
          testID={testID}
        />
      )}
    />
  );
}

import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { AppSwitchField } from './AppSwitchField';

interface AppFormSwitchProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  layout?: 'row' | 'stack';
  testID?: string;
}

/**
 * Switch cua form dung chung: Controller + AppSwitchField trong 1 tag.
 *
 * Truoc vong 50, 23 form switch trong `src/app` tu lap cung khoi
 * Controller 8-9 dong (control/name/render + AppSwitchField voi
 * label/value/onValueChange/layout). Moi lan doi quy tac switch
 * cua form (vi du value undefined -> false hay cach truyen layout)
 * phai sua 23 cho. Helper nay giu nguyen ngu nghia goc theo tung
 * site: layout truyen thang (mac dinh 'row' cua AppSwitchField khi
 * khong truyen), value `field.value ?? false` (cac site goc dung
 * `field.value` cho field boolean co default — cung ket qua khi
 * value da co, va tranh warning Switch khi value undefined).
 *
 * Co tinh KHONG bao gom: 2 site Controller custom (claim-types
 * valueType dung View + Pressable rieng, data-dictionaries
 * allowBeNull dung VStack + Switch tran — khong phai AppSwitchField).
 */
export function AppFormSwitch<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  layout,
  testID,
}: AppFormSwitchProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <AppSwitchField
          label={label}
          value={field.value ?? false}
          onValueChange={field.onChange}
          layout={layout}
          testID={testID}
        />
      )}
    />
  );
}

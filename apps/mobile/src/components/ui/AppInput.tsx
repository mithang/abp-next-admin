import { Input, InputField } from '@/components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';

interface AppInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  testID?: string;
}

/** Input chuẩn: label + error theo field, dùng trong mọi form (kèm RHF ở vòng sau). */
export function AppInput({ label, value, onChangeText, placeholder, error, secureTextEntry, keyboardType, autoCapitalize, testID }: AppInputProps) {
  return (
    <VStack space="xs">
      <FormControl isInvalid={Boolean(error)}>
        {label ? (
          <FormControlLabel>
            <FormControlLabelText>{label}</FormControlLabelText>
          </FormControlLabel>
        ) : null}
        <Input className="rounded-xl">
          <InputField
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            testID={testID}
          />
        </Input>
        {error ? (
          <FormControlError>
            <FormControlErrorText>{error}</FormControlErrorText>
          </FormControlError>
        ) : null}
      </FormControl>
    </VStack>
  );
}

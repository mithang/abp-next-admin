import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** solid = nút chính, outline = nút phụ. */
  variant?: 'solid' | 'outline';
  /** negative = destructive (đăng xuất, xóa). */
  action?: 'primary' | 'negative';
  testID?: string;
}

/**
 * Wrapper thống nhất trên Gluestack v5 Button: mọi nút bấm đều có hành vi,
 * loading và disabled rõ ràng. API map: solid→default, outline→outline,
 * negative→destructive (theo đúng variant của component v5 đã cài).
 */
export function AppButton({ title, onPress, disabled, loading, variant = 'solid', action = 'primary', testID }: AppButtonProps) {
  const gluestackVariant = action === 'negative' ? 'destructive' : variant === 'outline' ? 'outline' : 'default';
  return (
    <Button
      onPress={onPress}
      disabled={disabled || loading}
      variant={gluestackVariant}
      testID={testID}
      className="rounded-xl"
    >
      {loading ? <ButtonSpinner /> : null}
      <ButtonText>{title}</ButtonText>
    </Button>
  );
}

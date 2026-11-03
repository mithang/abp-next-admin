import { useRouter } from 'expo-router';
import { AppButton } from './AppButton';

interface AppNavButtonProps {
  title: string;
  /** Duong dan dich: co the la chuoi tinh hoac template co tham so. */
  href: string;
  variant?: 'solid' | 'outline';
  /** negative = destructive (giong AppButton). */
  action?: 'primary' | 'negative';
  testID?: string;
}

/**
 * Nut dieu huong dung chung: AppButton + router.push(href) trong 1 tag.
 *
 * Truoc vong 52, gan 80 nut bam trong `src/app` tu lap cung khoi
 * AppButton 3-9 dong chi de dieu huong (title + onPress router.push
 * + variant/testID tuy chon). Moi lan doi quy tac dieu huong (vi du
 * them guard, log, hay doi cach truyen href) phai sua gan 80 cho.
 * Helper nay giu nguyen ngu nghia goc theo tung site: title, variant
 * (mac dinh 'solid' cua AppButton khi khong truyen), action va testID
 * truyen thang; href la bieu thuc goc (chuoi tinh hoac template co
 * encodeURIComponent) nen duong dan dich khong doi.
 *
 * Co tinh KHONG bao gom: nut co onPress lam them viec khac ngoai
 * router.push (set state, goi mutation, xac nhan), nut dung Link
 * asChild, va nut back (router.back) — khac khuon dieu huong toi.
 */
export function AppNavButton({ title, href, variant, action, testID }: AppNavButtonProps) {
  const router = useRouter();
  return (
    <AppButton
      title={title}
      onPress={() => router.push(href)}
      variant={variant}
      action={action}
      testID={testID}
    />
  );
}

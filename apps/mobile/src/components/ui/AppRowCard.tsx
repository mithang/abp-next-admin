import type { ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';

type AppRowCardProps = Omit<PressableProps, 'children'> & {
  children: ReactNode;
};

/**
 * Khung dòng danh sách dùng chung: Pressable > Card p-4 > VStack xs.
 * Đúng mẫu của 35 dòng danh sách (33 Link asChild từ vòng 44 + 2 dòng
 * onPress trực tiếp manage.tsx và caches.tsx từ vòng 63): mọi prop
 * Pressable — kể cả onPress do Link clone vào — được forward xuống
 * Pressable nên điều hướng không đổi. Không dùng cho thẻ cây
 * (dùng AppTreeRowCard) hay thẻ không phải dòng danh sách.
 */
export function AppRowCard({ children, ...pressableProps }: AppRowCardProps) {
  return (
    <Pressable {...pressableProps}>
      <Card className="p-4">
        <VStack space="xs">{children}</VStack>
      </Card>
    </Pressable>
  );
}

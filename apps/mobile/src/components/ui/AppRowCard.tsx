import type { ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';

type AppRowCardProps = Omit<PressableProps, 'children'> & {
  children: ReactNode;
};

/**
 * Khung dòng danh sách dùng chung: Pressable > Card p-4 > VStack xs.
 * Đúng mẫu của 33 dòng danh sách (Link asChild bọc ngoài): mọi prop
 * Pressable — kể cả onPress do Link clone vào — được forward xuống
 * Pressable nên điều hướng không đổi. Không dùng cho thẻ không phải
 * dòng danh sách (thẻ cây organization-units có paddingLeft riêng,
 * thẻ manage.tsx, thẻ detail) — các thẻ đó giữ nguyên.
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

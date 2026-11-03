import type { ReactNode } from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import { Card } from '@/components/ui/card';

type AppTreeRowCardProps = Omit<PressableProps, 'children'> & {
  children: ReactNode;
  /** Độ sâu của nút cây; thụt lề = depth * indent. */
  depth: number;
  /** Số điểm thụt lề cho mỗi cấp (mặc định 16, như menus/data-dictionaries). */
  indent?: number;
  /**
   * Cách thụt lề: 'margin' (mặc định, như menus/data-dictionaries/
   * menu-favorites) hoặc 'padding' (organization-units dùng paddingLeft
   * depth*20 — giữ nguyên để vùng nhấn gồm cả phần thụt lề không đổi).
   */
  indentStyle?: 'margin' | 'padding';
};

/**
 * Khung dòng cây dùng chung: Pressable > View thụt theo depth > Card p-4.
 * Children giữ nguyên verbatim (VStack ở 3 dòng Link, Text trần ở
 * menu-favorites) nên nội dung và điều hướng không đổi. Mọi prop
 * Pressable — kể cả onPress do Link asChild clone vào — được forward.
 * Không dùng cho dòng danh sách phẳng (dùng AppRowCard) hay thẻ không
 * phải dòng cây (thẻ picker menu-allot, thẻ blobs không VStack).
 */
export function AppTreeRowCard({
  children,
  depth,
  indent = 16,
  indentStyle = 'margin',
  ...pressableProps
}: AppTreeRowCardProps) {
  return (
    <Pressable {...pressableProps}>
      <View
        style={
          indentStyle === 'padding'
            ? { paddingLeft: depth * indent }
            : { marginLeft: depth * indent }
        }
      >
        <Card className="p-4">{children}</Card>
      </View>
    </Pressable>
  );
}

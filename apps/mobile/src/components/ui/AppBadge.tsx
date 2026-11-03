import type { ReactNode } from 'react';
import { Badge, BadgeText } from '@/components/ui/badge';

type AppBadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

type AppBadgeProps = {
  label: ReactNode;
  variant?: AppBadgeVariant;
};

/**
 * Nhãn badge dùng chung: Badge > BadgeText với className self-start.
 * Đúng mẫu của 13 điểm gọi trước đây ở 8 màn hình (claim-types,
 * roles, users, openiddict): mọi điểm đều dùng className
 * "self-start" và chỉ khác nhau ở nhãn + variant (mặc định
 * "default", riêng users đổi default/destructive theo isActive).
 * Variant được giữ làm prop để điểm gọi vẫn nói rõ ý nghĩa
 * trạng thái, không gộp thành một kiểu mù duy nhất.
 */
export function AppBadge({ label, variant = 'default' }: AppBadgeProps) {
  return (
    <Badge variant={variant} className="self-start">
      <BadgeText>{label}</BadgeText>
    </Badge>
  );
}

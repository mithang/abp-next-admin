import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';

type AppSectionCardProps = {
  children: ReactNode;
};

/**
 * Khung thẻ nội dung tĩnh dùng chung: Card p-4 > VStack xs.
 * Đúng mẫu của 21 thẻ nội dung trong 15 màn hình (cài đặt hệ thống,
 * tính năng tenant, cài đặt WeChat, SMS, nhật ký gửi, phiên, hội thoại
 * AI, văn bản, chuỗi kết nối, job nền, webhook, menu-allot,
 * menu-favorites, chi tiết từ điển): children giữ nguyên verbatim nên
 * nội dung không đổi. Không dùng cho dòng danh sách nhấn được
 * (dùng AppRowCard/AppTreeRowCard) hay thẻ có children không phải
 * VStack xs (thẻ dashboard, thẻ blobs, thẻ {body} của send-attempts,
 * thẻ VStack sm của menu-favorites).
 */
export function AppSectionCard({ children }: AppSectionCardProps) {
  return (
    <Card className="p-4">
      <VStack space="xs">{children}</VStack>
    </Card>
  );
}

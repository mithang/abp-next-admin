import { Link } from 'expo-router';
import { AppScreen } from '../components/ui/AppScreen';

export default function NotFound() {
  return (
    <AppScreen title="Không tìm thấy trang">
      <Link href="/(tabs)">Về trang chính</Link>
    </AppScreen>
  );
}

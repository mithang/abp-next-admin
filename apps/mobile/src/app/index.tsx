import { Redirect } from 'expo-router';

/** Entry: route guard trong _layout sẽ chuyển về login khi chưa xác thực. */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}

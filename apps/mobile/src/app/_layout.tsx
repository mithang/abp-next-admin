import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { queryClient } from '../lib/query-client';
import { useAuthStore } from '../stores/auth-store';
import '../i18n';
import '@/global.css';

function RouteGuard({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    const inAuthGroup = segments[0] === '(auth)';
    if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (status === 'authenticated' && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [status, segments, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return (
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
        <RouteGuard>
          <Stack screenOptions={{ headerShown: false }} />
        </RouteGuard>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}

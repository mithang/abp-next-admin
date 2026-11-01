import { useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppInput } from '../../components/ui/AppInput';
import { AppEmptyState, AppErrorState, AppLoading } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { getBackgroundJobsPaged } from '../../features/tasks/tasks-api';
import {
  JOB_PRIORITY_LABELS,
  JOB_STATUS_LABELS,
  JOB_TYPE_LABELS,
  type BackgroundJobInfoDto,
} from '../../features/tasks/types';
import { toApiError } from '../../lib/errors';

const PAGE_SIZE = 20;

function JobRow({ item }: { item: BackgroundJobInfoDto }) {
  return (
    <Link href={`/tasks/background-jobs/${encodeURIComponent(item.id)}`} asChild>
      <Pressable>
        <Card className="p-4">
          <VStack space="xs">
            <Text>{item.name}</Text>
            <Text>
              {item.group} · {item.type}
            </Text>
            <Text>
              {JOB_STATUS_LABELS[item.status] ?? item.status} · {JOB_TYPE_LABELS[item.jobType] ?? item.jobType} ·{' '}
              {JOB_PRIORITY_LABELS[item.priority] ?? item.priority}
              {item.isEnabled ? '' : ' · disabled'}
            </Text>
            {item.nextRunTime ? <Text>{new Date(item.nextRunTime).toLocaleString()}</Text> : null}
          </VStack>
        </Card>
      </Pressable>
    </Link>
  );
}

/**
 * Danh sách tác vụ nền: đúng backend — GET
 * /api/task-management/background-jobs (phân trang ABP, lọc filter).
 * Điều khiển (pause/resume/trigger/stop/start) ở màn detail; API bulk
 * có sẵn ở tasks-api nhưng UI chọn nhiều để vòng sau.
 */
export default function BackgroundJobsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(filter);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [filter]);

  const query = useQuery({
    queryKey: ['tasks-background-jobs', debounced, page],
    queryFn: () =>
      getBackgroundJobsPaged({
        filter: debounced || undefined,
        skipCount: page * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
      }),
  });

  const items = query.data?.items ?? [];
  const total = query.data?.totalCount ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  return (
    <AppScreen title={t('backgroundJobs.title')} subtitle={`${t('backgroundJobs.total')}: ${total}`}>
      <AppInput
        value={filter}
        onChangeText={setFilter}
        placeholder={t('backgroundJobs.searchPlaceholder')}
        autoCapitalize="none"
        testID="background-jobs-search"
      />
      <AppButton
        title={t('backgroundJobs.createTitle')}
        onPress={() => router.push('/tasks/background-jobs/form')}
        testID="background-jobs-create"
      />
      <View style={{ height: 8 }} />
      {query.isPending ? (
        <AppLoading />
      ) : query.isError ? (
        <AppErrorState message={toApiError(query.error).message} onRetry={() => void query.refetch()} />
      ) : items.length === 0 ? (
        <AppEmptyState message={t('backgroundJobs.empty')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <JobRow item={item} />}
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
        />
      )}
      {hasMore ? (
        <AppButton title={t('common.loadMore')} onPress={() => setPage((p) => p + 1)} variant="outline" />
      ) : null}
    </AppScreen>
  );
}

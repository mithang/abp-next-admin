import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppFormInput } from '../../../components/ui/AppFormInput';
import { AppFormSubmit } from '../../../components/ui/AppFormSubmit';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import {
  createConversation,
  getConversation,
  getWorkspacesPaged,
  updateConversation,
} from '../../../features/ai/ai-api';
import {
  aiConversationCreateDefaults,
  aiConversationCreateSchema,
  aiConversationRenameSchema,
  type AIConversationCreateValues,
  type AIConversationRenameValues,
} from '../../../features/ai/ai-conversation-form-schema';
import { toApiError } from '../../../lib/errors';
import { queryStateElement } from '../../../lib/query-state';
import { createFieldError } from '../../../lib/field-error';
import { useInvalidateAndBack } from '../../../lib/mutation-success';
import { navPath } from '../../../lib/nav-href';

/**
 * Form tạo phiên mới (?id trống) hoặc đổi tên (?id=...).
 * Tạo: name tùy chọn (backend đặt tên mặc định khi trống), workspace bắt
 * buộc — gợi ý lấy từ danh sách workspace hiện có. Đổi tên: chỉ name
 * bắt buộc, đúng ConversationUpdateDto (web không có UI đổi tên nhưng
 * API có update; mobile lộ thao tác này từ màn chat).
 */
export default function AIConversationFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const invalidateAndBack = useInvalidateAndBack(['ai-conversations']);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const detail = useQuery({
    queryKey: ['ai-conversations', id],
    queryFn: () => getConversation(id as string),
    enabled: isEdit,
  });
  const workspacesQuery = useQuery({
    queryKey: ['ai-workspaces', 'names'],
    queryFn: () => getWorkspacesPaged({ maxResultCount: 50 }),
  });

  const createForm = useForm<AIConversationCreateValues>({
    resolver: zodResolver(aiConversationCreateSchema),
    defaultValues: aiConversationCreateDefaults,
  });
  const renameForm = useForm<AIConversationRenameValues>({
    resolver: zodResolver(aiConversationRenameSchema),
    defaultValues: { name: '' },
    values: detail.data ? { name: detail.data.name } : undefined,
  });

  const fieldError = createFieldError(t, 'aiConversations');

  const createMutation = useMutation({
    mutationFn: async (values: AIConversationCreateValues) =>
      createConversation({
        name: values.name?.trim() || undefined,
        workspace: values.workspace.trim(),
      }),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
      router.replace(navPath('/ai/conversations', created.id));
    },
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  const renameMutation = useMutation({
    mutationFn: async (values: AIConversationRenameValues) =>
      updateConversation(id as string, { name: values.name.trim() }),
    onSuccess: invalidateAndBack,
    onError: (error) => setSubmitError(toApiError(error).message),
  });

  const queryState = queryStateElement(detail);
  if (isEdit && queryState) return queryState;

  const workspaceNames = workspacesQuery.data?.items.map((w) => w.name).join(', ') ?? '';

  if (isEdit) {
    return (
      <AppScreen scrollable title={t('aiConversations.renameTitle')}>
        <VStack space="sm">
          <AppFormInput
            control={renameForm.control}
            name="name"
            label={t('aiConversations.name')}
            placeholder={t('aiConversations.namePlaceholder')}
            autoCapitalize="none"
            fieldError={fieldError}
          />
          <AppFormSubmit
            error={submitError}
            title={t('common.save')}
            loading={renameMutation.isPending}
            disabled={renameMutation.isPending}
            onPress={() =>
              void renameForm.handleSubmit((values) => renameMutation.mutate(values))()
            }
          />
        </VStack>
      </AppScreen>
    );
  }

  return (
    <AppScreen scrollable title={t('aiConversations.createTitle')}>
      <VStack space="sm">
        <AppFormInput
          control={createForm.control}
          name="name"
          label={t('aiConversations.name')}
          placeholder={t('aiConversations.namePlaceholder')}
          autoCapitalize="none"
          fieldError={fieldError}
        />
        <AppFormInput
          control={createForm.control}
          name="workspace"
          label={t('aiConversations.workspace')}
          placeholder={t('aiConversations.workspacePlaceholder')}
          autoCapitalize="none"
          fieldError={fieldError}
        />
        {workspaceNames ? (
          <Text>
            {t('aiConversations.workspacesHint')}: {workspaceNames}
          </Text>
        ) : null}
        <AppFormSubmit
          error={submitError}
          title={t('common.create')}
          loading={createMutation.isPending}
          disabled={createMutation.isPending}
          onPress={() => void createForm.handleSubmit((values) => createMutation.mutate(values))()}
        />
      </VStack>
    </AppScreen>
  );
}

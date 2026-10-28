import { ref } from 'vue';
import { TabItem } from './data';

export function useTasks() {
  const tasksRef = ref<TabItem>({
    key: '3',
    name: 'Việc cần làm',
    list: [],
  });

  return {
    tasksRef,
  };
}

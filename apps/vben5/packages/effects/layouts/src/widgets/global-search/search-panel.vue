<script setup lang="ts">
import type { MenuRecordRaw } from '@vben/types';

import { nextTick, onMounted, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';

import { SearchX, X } from '@vben/icons';
import { $t } from '@vben/locales';
import { mapTree, traverseTreeValues, uniqueByField } from '@vben/utils';

import { VbenIcon, VbenScrollbar } from '@vben-core/shadcn-ui';
import { isHttpUrl } from '@vben-core/shared/utils';

import { onKeyStroke, useLocalStorage, useThrottleFn } from '@vueuse/core';

defineOptions({
  name: 'SearchPanel',
});

const props = withDefaults(
  defineProps<{ keyword?: string; menus?: MenuRecordRaw[] }>(),
  {
    keyword: '',
    menus: () => [],
  },
);
const emit = defineEmits<{ close: [] }>();

const router = useRouter();
const searchHistory = useLocalStorage<MenuRecordRaw[]>(
  `__search-history-${location.hostname}__`,
  [],
);
const activeIndex = ref(-1);
const searchItems = shallowRef<MenuRecordRaw[]>([]);
const searchResults = ref<MenuRecordRaw[]>([]);

const handleSearch = useThrottleFn(search, 200);

// Hàm tìm kiếm, dùng để tìm các mục menu khớp với từ khóa tìm kiếm
function search(searchKey: string) {
  // Loại bỏ khoảng trắng ở đầu và cuối từ khóa tìm kiếm
  searchKey = searchKey.trim();

  // Nếu từ khóa tìm kiếm rỗng, xóa kết quả tìm kiếm và trả về
  if (!searchKey) {
    searchResults.value = [];
    return;
  }

  // Tạo biểu thức chính quy từ từ khóa tìm kiếm
  const reg = createSearchReg(searchKey);

  // Khởi tạo mảng kết quả
  const results: MenuRecordRaw[] = [];

  // Duyệt qua các mục tìm kiếm
  traverseTreeValues(searchItems.value, (item) => {
    // Nếu tên của mục menu khớp với biểu thức chính quy, thêm nó vào mảng kết quả
    if (reg.test(item.name?.toLowerCase())) {
      results.push(item);
    }
  });

  // Cập nhật kết quả tìm kiếm
  searchResults.value = results;

  // Nếu có kết quả tìm kiếm, đặt chỉ số thành 0
  if (results.length > 0) {
    activeIndex.value = 0;
  }

  // Gán chỉ số thành 0
  activeIndex.value = 0;
}

// When the keyboard up and down keys move to an invisible place
// the scroll bar needs to scroll automatically
function scrollIntoView() {
  const element = document.querySelector(
    `[data-search-item="${activeIndex.value}"]`,
  );

  if (element) {
    element.scrollIntoView({ block: 'nearest' });
  }
}

// enter keyboard event
async function handleEnter() {
  if (searchResults.value.length === 0) {
    return;
  }
  const result = searchResults.value;
  const index = activeIndex.value;
  if (result.length === 0 || index < 0) {
    return;
  }
  const to = result[index];
  if (to) {
    searchHistory.value = uniqueByField([...searchHistory.value, to], 'path');
    handleClose();
    await nextTick();
    if (isHttpUrl(to.path)) {
      window.open(to.path, '_blank');
    } else {
      router.push({ path: to.path, replace: true });
    }
  }
}

// Arrow key up
function handleUp() {
  if (searchResults.value.length === 0) {
    return;
  }
  activeIndex.value--;
  if (activeIndex.value < 0) {
    activeIndex.value = searchResults.value.length - 1;
  }
  scrollIntoView();
}

// Arrow key down
function handleDown() {
  if (searchResults.value.length === 0) {
    return;
  }
  activeIndex.value++;
  if (activeIndex.value > searchResults.value.length - 1) {
    activeIndex.value = 0;
  }
  scrollIntoView();
}

// close search modal
function handleClose() {
  searchResults.value = [];
  emit('close');
}

// Activate when the mouse moves to a certain line
function handleMouseenter(e: MouseEvent) {
  const index = (e.target as HTMLElement)?.dataset.index;
  activeIndex.value = Number(index);
}

function removeItem(index: number) {
  if (props.keyword) {
    searchResults.value.splice(index, 1);
  } else {
    searchHistory.value.splice(index, 1);
  }
  activeIndex.value = Math.max(activeIndex.value - 1, 0);
  scrollIntoView();
}

// Lưu trữ tất cả các ký tự đặc biệt cần escape
const code = new Set([
  '$',
  '(',
  ')',
  '*',
  '+',
  '.',
  '?',
  '[',
  '\\',
  ']',
  '^',
  '{',
  '|',
  '}',
]);

// Hàm chuyển đổi, dùng để escape các ký tự đặc biệt
function transform(c: string) {
  // Nếu ký tự nằm trong danh sách ký tự đặc biệt, trả về ký tự đã được escape
  // Nếu không, trả về chính ký tự đó
  return code.has(c) ? `\\${c}` : c;
}

// Tạo biểu thức chính quy tìm kiếm
function createSearchReg(key: string) {
  // Tách chuỗi nhập vào thành từng ký tự riêng lẻ
  // Escape từng ký tự
  // Sau đó nối tất cả các ký tự bằng '.*' để tạo biểu thức chính quy
  const keys = [...key].map((item) => transform(item)).join('.*');
  // Trả về biểu thức chính quy đã tạo
  return new RegExp(`.*${keys}.*`);
}

watch(
  () => props.keyword,
  (val) => {
    if (val) {
      handleSearch(val);
    } else {
      searchResults.value = [...searchHistory.value];
    }
  },
);

onMounted(() => {
  searchItems.value = mapTree(props.menus, (item) => {
    return {
      ...item,
      name: $t(item?.name),
    };
  });
  if (searchHistory.value.length > 0) {
    searchResults.value = searchHistory.value;
  }
  // enter search
  onKeyStroke('Enter', handleEnter);
  // Monitor keyboard arrow keys
  onKeyStroke('ArrowUp', handleUp);
  onKeyStroke('ArrowDown', handleDown);
  // esc close
  onKeyStroke('Escape', handleClose);
});
</script>

<template>
  <VbenScrollbar>
    <div class="!flex h-full justify-center px-2 sm:max-h-[450px]">
      <!-- Không có kết quả tìm kiếm -->
      <div
        v-if="keyword && searchResults.length === 0"
        class="text-muted-foreground text-center"
      >
        <SearchX class="mx-auto mt-4 size-12" />
        <p class="mb-10 mt-6 text-xs">
          {{ $t('ui.widgets.search.noResults') }}
          <span class="text-foreground text-sm font-medium">
            "{{ keyword }}"
          </span>
        </p>
      </div>
      <!-- Lịch sử tìm kiếm & không có kết quả tìm kiếm -->
      <div
        v-if="!keyword && searchResults.length === 0"
        class="text-muted-foreground text-center"
      >
        <p class="my-10 text-xs">
          {{ $t('ui.widgets.search.noRecent') }}
        </p>
      </div>

      <ul v-show="searchResults.length > 0" class="w-full">
        <li
          v-if="searchHistory.length > 0 && !keyword"
          class="text-muted-foreground mb-2 text-xs"
        >
          {{ $t('ui.widgets.search.recent') }}
        </li>
        <li
          v-for="(item, index) in uniqueByField(searchResults, 'path')"
          :key="item.path"
          :class="
            activeIndex === index
              ? 'active bg-primary text-primary-foreground'
              : ''
          "
          :data-index="index"
          :data-search-item="index"
          class="bg-accent flex-center group mb-3 w-full cursor-pointer rounded-lg px-4 py-4"
          @click="handleEnter"
          @mouseenter="handleMouseenter"
        >
          <VbenIcon
            :icon="item.icon"
            class="mr-2 size-5 flex-shrink-0"
            fallback
          />

          <span class="flex-1">{{ item.name }}</span>
          <div
            class="flex-center dark:hover:bg-accent hover:text-primary-foreground rounded-full p-1 hover:scale-110"
            @click.stop="removeItem(index)"
          >
            <X class="size-4" />
          </div>
        </li>
      </ul>
    </div>
  </VbenScrollbar>
</template>

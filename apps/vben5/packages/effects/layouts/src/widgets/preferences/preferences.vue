<script lang="ts" setup>
import { computed, useAttrs } from 'vue';

import { Settings } from '@vben/icons';
import { $t, loadLocaleMessages } from '@vben/locales';
import { preferences, updatePreferences } from '@vben/preferences';
import { capitalizeFirstLetter } from '@vben/utils';

import { useVbenDrawer } from '@vben-core/popup-ui';
import { VbenButton } from '@vben-core/shadcn-ui';

import PreferencesDrawer from './preferences-drawer.vue';

const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: PreferencesDrawer,
});

/**
 * Chuyển preferences thành props của vue
 * preferences.widget.fullscreen=>widgetFullscreen
 */
const attrs = computed(() => {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(preferences)) {
    for (const [subKey, subValue] of Object.entries(value)) {
      result[`${key}${capitalizeFirstLetter(subKey)}`] = subValue;
    }
  }
  return result;
});

// Gộp fallthrough attrs với preferences attrs như template cũ
// (`{ ...$attrs, ...attrs }`), nhưng chuẩn hóa `class` từ ClassValue của Vue
// (chấp nhận false/null) về ClassType của DrawerProps — tương đương khi render.
const fallthroughAttrs = useAttrs();
const drawerAttrs = computed(() => {
  const { class: fallthroughClass, ...rest } = fallthroughAttrs;
  return {
    ...rest,
    ...attrs.value,
    class:
      fallthroughClass === undefined
        ? undefined
        : fallthroughClass || undefined,
  };
});

/**
 * Chuyển preferences thành listener của vue
 * preferences.widget.fullscreen=>@update:widgetFullscreen
 */
const listen = computed(() => {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(preferences)) {
    if (typeof value === 'object') {
      for (const subKey of Object.keys(value)) {
        result[`update:${key}${capitalizeFirstLetter(subKey)}`] = (
          val: any,
        ) => {
          updatePreferences({ [key]: { [subKey]: val } });
          if (key === 'app' && subKey === 'locale') {
            loadLocaleMessages(val);
          }
        };
      }
    } else {
      result[key] = value;
    }
  }
  return result;
});
</script>
<template>
  <div>
    <Drawer v-bind="drawerAttrs" v-on="listen" />

    <div @click="() => drawerApi.open()">
      <slot>
        <VbenButton
          :title="$t('preferences.title')"
          class="bg-primary flex-col-center size-10 cursor-pointer rounded-l-lg rounded-r-none border-none"
        >
          <Settings class="size-5" />
        </VbenButton>
      </slot>
    </div>
  </div>
</template>

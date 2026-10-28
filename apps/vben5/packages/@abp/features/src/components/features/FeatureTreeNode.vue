<!-- components/FeatureTreeNode.vue -->
<script setup lang="ts">
import type { FeatureDto } from '../../types/features';
import type { TreeNode } from './tree';

import { computed } from 'vue';

import FeatureInput from './FeatureInput.vue';
import { getIndentStyle } from './useFeatureTree';

const props = defineProps<{
  baseIndentSize?: number;
  groupIndex: number;
  node: TreeNode;
}>();

const emit = defineEmits<{
  (event: 'change', feature: FeatureDto, groupIndex: number, value: any): void;
}>();

const indentSize = computed(() => props.baseIndentSize || 8);
const indentStyle = computed(() =>
  getIndentStyle(props.node.level, indentSize.value),
);
</script>

<template>
  <div v-if="node.visible">
    <div :style="{ marginLeft: indentStyle }">
      <FeatureInput
        :feature="node.feature"
        :group-index="groupIndex"
        :feature-index="0"
        @change="(feature, idx, value) => emit('change', feature, idx, value)"
      />
    </div>

    <template v-for="child in node.children" :key="child.feature.name">
      <FeatureTreeNode
        :node="child"
        :group-index="groupIndex"
        :base-indent-size="baseIndentSize"
        @change="(feature, idx, value) => emit('change', feature, idx, value)"
      />
    </template>
  </div>
</template>

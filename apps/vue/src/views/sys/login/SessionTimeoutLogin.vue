<template>
  <transition>
    <div :class="prefixCls">
      <Login sessionTimeout />
    </div>
  </transition>
</template>
<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import Login from './Login.vue';
  import { useRoute } from 'vue-router';
  import { useGo } from '/@/hooks/web/usePage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { useAppStore } from '/@/store/modules/app';
  import { PermissionModeEnum } from '/@/enums/appEnum';

  const { prefixCls } = useDesign('st-login');
  const go = useGo();
  const { path } = useRoute();
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  const appStore = useAppStore();
  const userId = ref<Nullable<number | string>>(0);

  const isBackMode = () => {
    return appStore.getProjectConfig.permissionMode === PermissionModeEnum.BACK;
  };

  onMounted(() => {
    // Ghi lại UserId hiện tại
    userId.value = userStore.getUserInfo?.userId;
    console.log('Mounted', userStore.getUserInfo);
    go(`/login?redirect=${path}`);
  });

  onBeforeUnmount(() => {
    if (userId.value && userId.value !== userStore.getUserInfo.userId) {
      // Không phải cùng một người dùng đăng nhập, refresh toàn bộ trang để loại bỏ trạng thái trang của người dùng trước
      document.location.reload();
    } else if (isBackMode() && permissionStore.getLastBuildMenuTime === 0) {
      // Ở chế độ quyền backend, nếu chưa từng tải menu thành công thì tải lại toàn bộ trang. Điều này thường xảy ra trong kịch bản module này được tải sau khi nhấn F5 refresh toàn bộ trang khi phiên đã hết hạn
      document.location.reload();
    }
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-st-login';

  .@{prefix-cls} {
    position: fixed;
    width: 100%;
    height: 100%;
    background: @component-background;
  }
</style>

<script lang="ts">
  import { defineComponent, h } from 'vue';
  import { Input } from 'ant-design-vue';

  /** Đóng gói thành component input vô hiệu hóa tự động hoàn thành trên toàn cục */
  export default defineComponent({
    name: 'BInput',
    render() {
      return h(Input, {
        ...this.$attrs,
        autocomplete: 'off',
      });
    },
  });
</script>

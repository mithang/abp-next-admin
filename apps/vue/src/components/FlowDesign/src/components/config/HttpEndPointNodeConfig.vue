<template>
  <div class="end-point">
    <Form layout="vertical">
      <Tabs v-model:activeKey="state.activeKey">
        <TabPane key="common" tab="Thường dùng">
          <FormItem label="Tên" extra="Tên của hoạt động." name="name">
            <Input v-model:value="nodeProps.name" />
          </FormItem>
          <FormItem label="Tên hiển thị" extra="Tên hiển thị của hoạt động." name="displayName">
            <Input v-model:value="nodeProps.displayName" />
          </FormItem>
          <FormItem label="Mô tả" extra="Mô tả của hoạt động." name="description">
            <TextArea v-model:value="nodeProps.description" show-count :autoSize="{ minRows: 3 }" />
          </FormItem>
        </TabPane>
        <TabPane key="properties" tab="Thuộc tính">
          <FormItem label="Đường dẫn" extra="Đường dẫn tương đối kích hoạt hoạt động này" name="path">
            <Input v-model:value="nodeProps.path" />
          </FormItem>
          <FormItem label="Phương thức yêu cầu" extra="Phương thức HTTP kích hoạt hoạt động này." name="methods">
            <Select v-model:value="nodeProps.methods" mode="multiple">
              <SelectOption value="GET">GET</SelectOption>
              <SelectOption value="POST">POST</SelectOption>
              <SelectOption value="PUT">PUT</SelectOption>
              <SelectOption value="PATCH">PATCH</SelectOption>
              <SelectOption value="DELETE">DELETE</SelectOption>
              <SelectOption value="OPTIONS">OPTIONS</SelectOption>
              <SelectOption value="HEAD">HEAD</SelectOption>
            </Select>
          </FormItem>
          <FormItem
            label="Đọc nội dung"
            extra="Cho biết có nên đọc và lưu trữ thân yêu cầu HTTP như một phần của mô hình yêu cầu HTTP hay không. Định dạng lưu trữ phụ thuộc vào tiêu đề loại nội dung."
            name="readContent"
            class="user-type"
          >
            <Checkbox v-model:checked="nodeProps.readContent" />
          </FormItem>
        </TabPane>
        <TabPane key="advanced" tab="Nâng cao">
          <FormItem label="Loại dữ liệu" extra="Loại dữ liệu biểu mẫu" name="targetType">
            <Input v-model:value="nodeProps.targetType" />
          </FormItem>
          <FormItem label="Lược đồ" extra="Lược đồ dữ liệu định dạng Json" name="schema">
            <CodeEditor v-model:value="nodeProps.schema" />
          </FormItem>
        </TabPane>
        <TabPane key="security" tab="Bảo mật">
          <FormItem label="Xác thực danh tính" extra="Chọn để chỉ cho phép các yêu cầu đã xác thực" name="authorize">
            <Checkbox v-model:checked="nodeProps.authorize" />
          </FormItem>
          <FormItem
            label="Chính sách"
            extra="Cung cấp một chính sách cần đánh giá. Nếu chính sách thất bại, yêu cầu sẽ bị cấm."
            name="policy"
          >
            <Input v-model:value="nodeProps.policy" />
          </FormItem>
        </TabPane>
      </Tabs>
    </Form>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { Checkbox, Form, Input, Select, Tabs } from 'ant-design-vue';
  import { CodeEditor } from '/@/components/CodeEditor';
  import { useFlowStoreWithOut } from '/@/store/modules/flow';

  const FormItem = Form.Item;
  const SelectOption = Select.Option;
  const TabPane = Tabs.TabPane;
  const TextArea = Input.TextArea;

  defineProps({
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });
  const flowStore = useFlowStoreWithOut();
  const nodeProps = computed(() => {
    return flowStore.selectedNode.props;
  });
  const state = reactive({
    activeKey: 'common',
  });
</script>

<style scoped></style>

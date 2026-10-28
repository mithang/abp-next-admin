<template>
  <div>
    <Form layout="vertical">
      <FormItem label="⚙ Chọn đối tượng phê duyệt" name="text" class="user-type">
        <RadioGroup v-model:value="nodeProps.assignedType">
          <Radio v-for="t in state.approvalTypes" :value="t.type" :key="t.type">{{ t.name }}</Radio>
        </RadioGroup>
        <div v-if="nodeProps.assignedType === 'ASSIGN_USER'">
          <Button size="small" type="primary" @click="handleSelectUser" round>
            <template #icon>
              <PlusOutlined />
            </template>
            Chọn nhân sự
          </Button>
          <OrgItems v-model:value="nodeProps.assignedUser" />
        </div>
        <div v-else-if="nodeProps.assignedType === 'SELF_SELECT'">
          <RadioGroup size="small" v-model:value="nodeProps.selfSelect.multiple">
            <RadioButton :value="false">Tự chọn một người</RadioButton>
            <RadioButton :value="true">Tự chọn nhiều người</RadioButton>
          </RadioGroup>
        </div>
        <div v-else-if="nodeProps.assignedType === 'ROLE'">
          <Button size="small" type="primary" @click="handleSelectRole" round>
            <template #icon>
              <PlusOutlined />
            </template>
            Chọn vai trò hệ thống
          </Button>
          <OrgItems v-model:value="nodeProps.role" />
        </div>
        <div v-else-if="nodeProps.assignedType === 'FORM_USER'">
          <FormItem label="Chọn mục liên hệ trong biểu mẫu" name="text" class="approve-end">
            <Select
              style="width: 80%"
              size="small"
              v-model:value="nodeProps.formUser"
              placeholder="Vui lòng chọn mục biểu mẫu chứa liên hệ"
            >
              <SelectOption v-for="op in forms" :value="op.id">{{ op.title }}</SelectOption>
            </Select>
          </FormItem>
        </div>
        <div v-else>
          <span class="item-desc">Người khởi tạo tự làm người phê duyệt</span>
        </div>
      </FormItem>

      <Divider></Divider>
      <FormItem label="👤 Khi người phê duyệt trống" name="text" class="line-mode">
        <RadioGroup v-model:value="nodeProps.nobody.handler">
          <Radio value="TO_PASS">Tự động thông qua</Radio>
          <Radio value="TO_REFUSE">Tự động bác bỏ</Radio>
          <Radio value="TO_ADMIN">Chuyển giao cho quản trị viên phê duyệt</Radio>
          <Radio value="TO_USER">Chuyển giao cho nhân sự được chỉ định</Radio>
        </RadioGroup>

        <div style="margin-top: 10px" v-if="nodeProps.nobody.handler === 'TO_USER'">
          <Button size="small" type="primary" @click="handleSelectNoSetUser" round>
            <template #icon>
              <PlusOutlined />
            </template>
            Chọn nhân sự</Button
          >
          <OrgItems v-model:value="nodeProps.assignedUser" />
        </div>
      </FormItem>

      <div v-if="showMode">
        <Divider />
        <FormItem label="👩‍👦‍👦 Phương thức phê duyệt khi nhiều người phê duyệt" name="text" class="approve-mode">
          <RadioGroup v-model:value="nodeProps.mode">
            <Radio value="NEXT">Hội ký (phê duyệt theo thứ tự đã chọn, mọi người đều phải đồng ý)</Radio>
            <Radio value="AND">Hội ký (có thể phê duyệt đồng thời, mọi người đều phải đồng ý)</Radio>
            <Radio value="OR">Hoặc ký (chỉ cần một người đồng ý)</Radio>
          </RadioGroup>
        </FormItem>
      </div>

      <Divider>Cài đặt nâng cao</Divider>
      <FormItem label="✍ Khi phê duyệt đồng ý có cần ký tên không" name="text">
        <Switch
          checked-children="Cần"
          un-checked-children="Không cần"
          v-model:checked="nodeProps.sign"
        ></Switch>
        <Tooltip
          class="item"
          effect="dark"
          content="Nếu cài đặt toàn cục đã yêu cầu ký tên thì cài đặt này không có hiệu lực"
          placement="top"
        >
          <QuestionOutlined style="margin-left: 10px; font-size: medium; color: #b0b0b1" />
        </Tooltip>
      </FormItem>
      <FormItem label="⏱ Thời hạn phê duyệt (bằng 0 thì không có hiệu lực)" name="timeLimit">
        <InputGroup style="width: 180px" compact>
          <Input
            style="width: 100px"
            placeholder="Thời lượng"
            size="small"
            type="number"
            v-model:value="nodeProps.timeLimit.timeout.value"
          />
          <Select
            style="width: 75px"
            v-model:value="nodeProps.timeLimit.timeout.unit"
            size="small"
            placeholder="Vui lòng chọn"
          >
            <SelectOption value="D">Ngày</SelectOption>
            <SelectOption value="H">Giờ</SelectOption>
            <SelectOption value="M">Phút</SelectOption>
          </Select>
        </InputGroup>
      </FormItem>
      <FormItem
        label="Thực hiện sau khi quá thời hạn phê duyệt"
        name="level"
        v-if="nodeProps.timeLimit.timeout.value > 0"
      >
        <RadioGroup v-model:value="nodeProps.timeLimit.handler.type">
          <Radio value="PASS">Tự động thông qua</Radio>
          <Radio value="REFUSE">Tự động bác bỏ</Radio>
          <Radio value="NOTIFY">Gửi nhắc nhở</Radio>
        </RadioGroup>
        <div v-if="nodeProps.timeLimit.handler.type === 'NOTIFY'">
          <div style="color: #409eef; font-size: small">Mặc định nhắc nhở người phê duyệt hiện tại</div>
          <Switch
            checked-children="Một lần"
            un-checked-children="Lặp lại"
            v-model:checked="nodeProps.timeLimit.handler.notify.once"
          ></Switch>
          <span style="margin-left: 20px" v-if="!nodeProps.timeLimit.handler.notify.once">
            Cứ mỗi
            <InputNumber
              :min="0"
              :max="10000"
              :step="1"
              size="small"
              v-model:value="nodeProps.timeLimit.handler.notify.hour"
            />
            giờ nhắc nhở một lần
          </span>
        </div>
      </FormItem>
      <FormItem label="🙅‍ Nếu phê duyệt bị bác bỏ 👇">
        <RadioGroup v-model:value="nodeProps.refuse.type">
          <Radio value="TO_END">Kết thúc trực tiếp quy trình</Radio>
          <Radio value="TO_BEFORE">Bác bỏ về nút phê duyệt cấp trên</Radio>
          <Radio value="TO_NODE">Bác bỏ về nút được chỉ định</Radio>
        </RadioGroup>
        <div v-if="nodeProps.refuse.type === 'TO_NODE'">
          <span>Nút được chỉ định:</span>
          <Select
            style="margin-left: 10px; width: 150px"
            placeholder="Chọn bước chuyển đến"
            size="small"
            v-model:value="nodeProps.refuse.target"
          >
            <SelectOption v-for="(node, i) in nodeOptions" :key="i" :value="node.id">{{
              node.name
            }}</SelectOption>
          </Select>
        </div>
      </FormItem>
    </Form>
    <OrgPicker
      multiple
      :title="pickerTitle"
      :type="state.orgPickerType"
      ref="orgPickerRef"
      :selected="state.orgPickerSelected"
      @ok="selected"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, reactive, ref, unref } from 'vue';
  import {
    Button,
    Divider,
    Form,
    Radio,
    Input,
    InputNumber,
    Select,
    Switch,
    Tooltip,
  } from 'ant-design-vue';
  import { PlusOutlined, QuestionOutlined } from '@ant-design/icons-vue';
  import { useFlowStoreWithOut } from '/@/store/modules/flow';
  import OrgPicker from '../OrgPicker.vue';
  import OrgItems from '../OrgItems.vue';

  const FormItem = Form.Item;
  const InputGroup = Input.Group;
  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;
  const SelectOption = Select.Option;

  const props = defineProps({
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });
  const orgPickerRef = ref<any>();
  const flowStore = useFlowStoreWithOut();

  const nodeProps = computed(() => {
    return flowStore.selectedNode.props;
  });

  const selectUser = computed(() => {
    return props.config.assignedUser || [];
  });

  const selectRole = computed(() => {
    return props.config.role || [];
  });

  const forms = computed(() => {
    return flowStore.design.formItems.filter((f) => {
      return f.name === 'UserPicker';
    });
  });

  const pickerTitle = computed(() => {
    switch (state.orgPickerType) {
      case 'user':
        return 'Vui lòng chọn nhân sự';
      case 'role':
        return 'Vui lòng chọn vai trò hệ thống';
      default:
        return undefined;
    }
  });

  const nodeOptions = computed(() => {
    let values: any[] = [];
    const excType = ['ROOT', 'EMPTY', 'CONDITION', 'CONDITIONS', 'CONCURRENT', 'CONCURRENTS'];
    flowStore.nodeMap.forEach((v) => {
      if (excType.indexOf(v.type) === -1) {
        values.push({ id: v.id, name: v.name });
      }
    });
    return values;
  });

  const showMode = computed(() => {
    const node = unref(nodeProps);
    switch (node.assignedType) {
      case 'ASSIGN_USER':
        return node.assignedUser.length > 0;
      case 'SELF_SELECT':
        return node.selfSelect.multiple;
      case 'FORM_USER':
        return true;
      case 'ROLE':
        return true;
      default:
        return false;
    }
  });

  const state = reactive({
    showOrgSelect: false,
    orgPickerSelected: [] as any[],
    orgPickerType: 'user',
    approvalTypes: [
      { name: 'Nhân sự được chỉ định', type: 'ASSIGN_USER' },
      { name: 'Người khởi tạo tự chọn', type: 'SELF_SELECT' },
      { name: 'Vai trò', type: 'ROLE' },
      { name: 'Bản thân người khởi tạo', type: 'SELF' },
      { name: 'Liên hệ trong biểu mẫu', type: 'FORM_USER' },
    ],
  });

  function handleSelectUser() {
    state.orgPickerSelected = unref(selectUser);
    state.orgPickerType = 'user';
    nextTick(() => {
      const orgPicker = unref(orgPickerRef);
      orgPicker?.show();
    });
  }

  function handleSelectNoSetUser() {
    state.orgPickerSelected = props.config.nobody.assignedUser;
    state.orgPickerType = 'user';
    nextTick(() => {
      const orgPicker = unref(orgPickerRef);
      orgPicker?.show();
    });
  }

  function handleSelectRole() {
    state.orgPickerSelected = unref(selectRole);
    state.orgPickerType = 'role';
    nextTick(() => {
      const orgPicker = unref(orgPickerRef);
      orgPicker?.show();
    });
  }

  function selected(select) {
    switch (state.orgPickerType) {
      case 'user':
        nodeProps.value.role = [];
        nodeProps.value.assignedUser = select;
        state.orgPickerSelected.length = 0;
        select.forEach((val) => state.orgPickerSelected.push(val));
        break;
      case 'role':
        nodeProps.value.assignedUser = [];
        nodeProps.value.role = select;
        state.orgPickerSelected.length = 0;
        select.forEach((val) => state.orgPickerSelected.push(val));
        break;
    }
  }

  function removeUserItem(index) {
    selectUser.value.splice(index, 1);
  }

  function removeRoleItem(index) {
    selectRole.value.splice(index, 1);
  }

  defineExpose({
    removeUserItem,
    removeRoleItem,
  });
</script>

<style lang="less" scoped>
  .user-type {
    :deep(.a-radio) {
      width: 110px;
      margin-top: 10px;
      margin-bottom: 20px;
    }
  }

  :deep(.line-mode) {
    .a-radio {
      width: 150px;
      margin: 5px;
    }
  }

  :deep(.a-form-item__label) {
    line-height: 25px;
  }

  :deep(.approve-mode) {
    .a-radio {
      float: left;
      width: 100%;
      display: block;
      margin-top: 15px;
    }
  }

  :deep(.approve-end) {
    position: relative;

    .a-radio-group {
      width: 160px;
    }

    .a-radio {
      margin-bottom: 5px;
      width: 100%;
    }

    .approve-end-leave {
      position: absolute;
      bottom: -5px;
      left: 150px;
    }
  }

  :deep(.a-divider--horizontal) {
    margin: 10px 0;
  }
</style>

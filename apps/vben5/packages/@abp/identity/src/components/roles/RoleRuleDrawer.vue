<script setup lang="ts">
import type {
  DataAccessFilterGroup,
  DataAccessFilterRule,
  EntityPropertyInfoDto,
  EntityTypeInfoDto,
  RoleEntityRuleDto,
} from '@abp/data-protection';
import type { FormInstance } from 'ant-design-vue/es/form/Form';

import type { IdentityRoleDto } from '../../types';

import { h, reactive, ref, toValue, useTemplateRef } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useLocalization, useLocalizationSerializer } from '@abp/core';
import {
  DataAccessFilterLogic,
  DataAccessFilterOperate,
  DataAccessOperation,
  DataAccessStrategy,
  useEntityTypeInfosApi,
  useRoleEntityRulesApi,
  useSubjectStrategysApi,
} from '@abp/data-protection';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  FormItem,
  FormItemRest,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Switch,
} from 'ant-design-vue';

/**
 * Form model của drawer: gộp 2 khái niệm backend — RoleEntityRuleDto (quy tắc theo
 * entity) và strategy cấp subject (lấy qua useSubjectStrategysApi, không nằm trong
 * RoleEntityRuleDto). `strategy` là bắt buộc vì template luôn bind Select vào nó
 * và onSubmit luôn rẽ nhánh theo nó.
 */
interface RoleRuleFormModel extends RoleEntityRuleDto {
  strategy: DataAccessStrategy;
}

const defaultModel: RoleRuleFormModel = {
  accessedProperties: [],
  creationTime: new Date(),
  entityTypeFullName: '',
  entityTypeId: '',
  filterGroup: {
    groups: [],
    logic: DataAccessFilterLogic.Or,
    rules: [],
  },
  id: '',
  isEnabled: true,
  operation: DataAccessOperation.Read,
  roleId: '',
  roleName: '',
  strategy: DataAccessStrategy.All,
};

const form = useTemplateRef<FormInstance>('form');
const formModel = ref<RoleRuleFormModel>({ ...defaultModel });
const entityTypes = ref<EntityTypeInfoDto[]>([]);
const entityTypeProps = ref<EntityPropertyInfoDto[]>([]);
const strategyOptions = reactive([
  {
    label: 'Có thể truy cập mọi dữ liệu',
    value: DataAccessStrategy.All,
  },
  {
    label: 'Quy tắc tuỳ chỉnh',
    value: DataAccessStrategy.Custom,
  },
  {
    label: 'Chỉ người dùng hiện tại',
    value: DataAccessStrategy.CurrentUser,
  },
  {
    label: 'Chỉ vai trò của người dùng hiện tại',
    value: DataAccessStrategy.CurrentRoles,
  },
  {
    label: 'Chỉ tổ chức của người dùng hiện tại',
    value: DataAccessStrategy.CurrentOrganizationUnits,
  },
  {
    label: 'Chỉ tổ chức của người dùng hiện tại và các tổ chức cấp dưới',
    value: DataAccessStrategy.CurrentAndSubOrganizationUnits,
  },
]);
const operationOptions = reactive([
  {
    label: 'Truy vấn',
    value: DataAccessOperation.Read,
  },
  {
    label: 'Chỉnh sửa',
    value: DataAccessOperation.Write,
  },
  {
    label: 'Xoá',
    value: DataAccessOperation.Delete,
  },
]);
const logicOptions = reactive([
  {
    label: 'Và',
    value: DataAccessFilterLogic.And,
  },
  {
    label: 'Hoặc',
    value: DataAccessFilterLogic.Or,
  },
]);
const dataAccessFilterOptions = reactive([
  {
    label: 'Bằng',
    value: DataAccessFilterOperate.Equal,
  },
  {
    label: 'Lớn hơn',
    value: DataAccessFilterOperate.Greater,
  },
  {
    label: 'Lớn hơn hoặc bằng',
    value: DataAccessFilterOperate.GreaterOrEqual,
  },
  {
    label: 'Nhỏ hơn',
    value: DataAccessFilterOperate.Less,
  },
  {
    label: 'Nhỏ hơn hoặc bằng',
    value: DataAccessFilterOperate.LessOrEqual,
  },
  {
    label: 'Không bằng',
    value: DataAccessFilterOperate.NotEqual,
  },
  {
    label: 'Bắt đầu bằng',
    value: DataAccessFilterOperate.StartsWith,
  },
  {
    label: 'Kết thúc bằng',
    value: DataAccessFilterOperate.EndsWith,
  },
  {
    label: 'Không chứa',
    value: DataAccessFilterOperate.NotContains,
  },
  {
    label: 'Không bằng',
    value: DataAccessFilterOperate.NotEqual,
  },
]);
const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-1/2',
  onConfirm: onSubmit,
  async onOpenChange(isOpen) {
    entityTypeProps.value = [];
    formModel.value = { ...defaultModel };
    if (isOpen) {
      await onInitStrategys();
    }
  },
});

const { getApi: getEntityTypeInfoApi, getPagedListApi } =
  useEntityTypeInfosApi();
const {
  createApi,
  getApi: getRoleEntityRuleApi,
  updateApi,
} = useRoleEntityRulesApi();
const { getApi: getStrategysApi, setApi: setStrategysApi } =
  useSubjectStrategysApi();
const { deserialize } = useLocalizationSerializer();
const { Lr } = useLocalization();

async function onInitStrategys() {
  const roleInfo = drawerApi.getData<IdentityRoleDto>();
  const result = await getStrategysApi({
    subjectId: roleInfo.name,
    subjectName: 'R',
  });
  if (result) {
    formModel.value.isEnabled = result.isEnabled;
    formModel.value.strategy = result.strategy;
    await onInitEntityTypes();
  }
}

async function onInitEntityTypes(filter?: string) {
  const { items } = await getPagedListApi({ filter });
  entityTypes.value = items.map((item) => {
    const displayName = deserialize(item.displayName);
    return {
      ...item,
      displayName: Lr(displayName.resourceName, displayName.name),
    };
  });
}

function onNewGroup(logic: DataAccessFilterLogic) {
  formModel.value.filterGroup.groups.push({
    groups: [],
    logic,
    rules: [],
  });
}

function onDeleteGroup(index: number) {
  formModel.value.filterGroup.groups.splice(index, 1);
}

function onNewRule(group: DataAccessFilterGroup) {
  group.rules.push({
    field: '',
    isLeft: false,
    javaScriptType: '',
    operate: DataAccessFilterOperate.Equal,
    typeFullName: '',
    value: '',
  });
}

function onDeleteRule(group: DataAccessFilterGroup, index: number) {
  group.rules.splice(index, 1);
}

async function onSubmit() {
  try {
    await form.value?.validate();
    drawerApi.setState({ confirmLoading: true });
    const input = toValue(formModel);
    await (input.strategy === DataAccessStrategy.Custom
      ? submitCustomRule(input)
      : submitStrategys(input));
    message.success($t('AbpUi.SavedSuccessfully'));
    drawerApi.close();
  } finally {
    drawerApi.setState({ confirmLoading: false });
  }
}

async function submitStrategys(input: RoleRuleFormModel) {
  const roleInfo = drawerApi.getData<IdentityRoleDto>();
  await setStrategysApi({
    isEnabled: input.isEnabled,
    strategy: input.strategy,
    subjectId: roleInfo.name,
    subjectName: 'R',
  });
}

async function submitCustomRule(input: RoleRuleFormModel) {
  const roleInfo = drawerApi.getData<IdentityRoleDto>();
  const api = input.id
    ? updateApi(input.id, {
        accessedProperties: input.accessedProperties,
        entityTypeId: input.entityTypeId,
        filterGroup: input.filterGroup,
        isEnabled: input.isEnabled,
        operation: input.operation,
        roleId: roleInfo.id,
        roleName: roleInfo.id,
      })
    : createApi({
        accessedProperties: input.accessedProperties,
        entityTypeId: input.entityTypeId,
        filterGroup: input.filterGroup,
        isEnabled: input.isEnabled,
        operation: input.operation,
        roleId: roleInfo.id,
        roleName: roleInfo.name,
      });
  await api;
}

async function onGetEntityType() {
  try {
    drawerApi.setState({ confirmLoading: true, loading: true });
    const { entityTypeId, operation } = formModel.value;
    const roleInfo = drawerApi.getData<IdentityRoleDto>();
    const ruleEntityRule = await getRoleEntityRuleApi({
      entityTypeId,
      operation,
      roleName: roleInfo.name,
    });
    formModel.value = ruleEntityRule?.id
      ? {
          ...ruleEntityRule,
          strategy: DataAccessStrategy.Custom,
        }
      : {
          ...defaultModel,
          entityTypeId,
          operation,
        };
  } finally {
    drawerApi.setState({ confirmLoading: false, loading: false });
  }
}

async function onStrategyChange(strategy: DataAccessStrategy) {
  if (strategy === DataAccessStrategy.Custom) {
    await onInitEntityTypes();
  }
}

async function onEntityTypeChange(entityTypeId: string) {
  const entityTypeInfo = await getEntityTypeInfoApi(entityTypeId);
  entityTypeProps.value = entityTypeInfo.properties.map((item) => {
    const displayName = deserialize(item.displayName);
    if (item.enums) {
      item.enums = item.enums.map((enumItem) => {
        const enumDisplayName = deserialize(enumItem.displayName);
        return {
          ...enumItem,
          displayName: Lr(enumDisplayName.resourceName, enumDisplayName.name),
        };
      });
    }
    return {
      ...item,
      displayName: Lr(displayName.resourceName, displayName.name),
    };
  });
  await onGetEntityType();
}

// Việc thay đổi lựa chọn thuộc tính sẽ kích hoạt thay đổi kiểu nhập của giá trị so sánh
function onPropertyTypeChange(
  rule: DataAccessFilterRule,
  option: EntityPropertyInfoDto,
) {
  rule.value = '';
  rule.typeFullName = option.typeFullName;
  rule.javaScriptType = option.javaScriptType;
}
</script>

<template>
  <Drawer title="Quyền dữ liệu">
    <Form
      :model="formModel"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 24 }"
    >
      <FormItem name="isEnabled" label="Có bật hay không">
        <Checkbox v-model:checked="formModel.isEnabled">
          Có bật hay không
        </Checkbox>
      </FormItem>
      <FormItem name="isEnabled" label="Chính sách quyền dữ liệu">
        <Select
          class="w-full"
          :options="strategyOptions"
          v-model:value="formModel.strategy"
          @change="(value) => onStrategyChange(Number(value!))"
        />
      </FormItem>
      <template v-if="formModel.strategy === DataAccessStrategy.Custom">
        <FormItem required name="entityTypeId" label="Loại thực thể">
          <Select
            class="w-full"
            :options="entityTypes"
            :field-names="{ label: 'displayName', value: 'id' }"
            v-model:value="formModel.entityTypeId"
            @change="(value) => onEntityTypeChange(value!.toString())"
          />
        </FormItem>
        <FormItem required name="operation" label="Thao tác">
          <Select
            class="w-full"
            :options="operationOptions"
            v-model:value="formModel.operation"
            @change="onGetEntityType"
          />
        </FormItem>
        <FormItem name="accessedProperties" label="Các trường có thể truy cập">
          <Select
            class="w-full"
            mode="multiple"
            :options="entityTypeProps"
            v-model:value="formModel.accessedProperties"
            :field-names="{ label: 'displayName', value: 'name' }"
          />
        </FormItem>
        <FormItemRest>
          <!-- Nhóm -->
          <div class="flex w-full flex-col">
            <div class="w-full items-center divide-dashed border-2">
              <div class="m-2 text-sm">Quy tắc truy cập dữ liệu</div>
              <template
                v-for="(group, gi) in formModel.filterGroup.groups"
                :key="gi"
              >
                <div class="flex flex-row items-center justify-items-center">
                  <!-- Điều kiện -->
                  <div class="m-2 flex w-full flex-row">
                    <div class="w-full border-2 border-dashed">
                      <template v-for="(rule, ri) in group.rules" :key="ri">
                        <div
                          class="m-2 flex flex-row items-center justify-items-center gap-1"
                        >
                          <div class="basis-2/5">
                            <Select
                              class="w-full"
                              :options="entityTypeProps"
                              v-model:value="rule.field"
                              :field-names="{
                                label: 'displayName',
                                value: 'name',
                              }"
                              @change="
                                (_, option: any) =>
                                  onPropertyTypeChange(rule, option)
                              "
                            />
                          </div>
                          <div class="basis-1/5">
                            <Select
                              class="w-full"
                              :options="dataAccessFilterOptions"
                              v-model:value="rule.operate"
                            />
                          </div>
                          <div class="basis-2/5">
                            <InputNumber
                              v-if="rule.javaScriptType === 'number'"
                              class="w-full"
                              v-model:value="rule.value"
                            />
                            <Switch
                              v-else-if="rule.javaScriptType === 'boolean'"
                              v-model:checked="rule.value"
                            />
                            <DatePicker
                              v-else-if="rule.javaScriptType === 'Date'"
                              class="w-full"
                              v-model:value="rule.value"
                              value-format="YYYY-MM-DDT00:00:00"
                            />
                            <Input
                              v-else
                              class="w-full"
                              v-model:value="rule.value"
                            />
                          </div>
                          <div class="basis-1/5">
                            <Popconfirm
                              title="Bạn có chắc chắn không?"
                              description="Sẽ xoá điều kiện lọc này"
                              @confirm="onDeleteRule(group, ri)"
                            >
                              <Button
                                type="link"
                                danger
                                :icon="h(DeleteOutlined)"
                              />
                            </Popconfirm>
                          </div>
                        </div>
                      </template>
                      <div
                        class="flex flex-row items-center justify-items-center gap-2"
                      >
                        <div class="m-2 min-w-[60px]">
                          <Select
                            size="small"
                            class="w-full"
                            v-model:value="group.logic"
                            :options="logicOptions"
                          />
                        </div>
                        <Button
                          type="link"
                          :icon="h(PlusOutlined)"
                          @click="onNewRule(group)"
                        >
                          Thêm điều kiện
                        </Button>
                        <Popconfirm
                          title="Bạn có chắc chắn không?"
                          description="Sẽ xoá nhóm điều kiện này"
                          @confirm="onDeleteGroup(gi)"
                        >
                          <Button type="link" :icon="h(DeleteOutlined)" danger>
                            Xoá nhóm
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div
                class="flex flex-row items-center justify-items-center gap-2"
              >
                <div class="m-2 min-w-[60px]">
                  <Select
                    size="small"
                    class="w-full"
                    v-model:value="formModel.filterGroup.logic"
                    :options="logicOptions"
                  />
                </div>
                <div>
                  <Button
                    size="small"
                    type="link"
                    :icon="h(PlusOutlined)"
                    @click="onNewGroup(formModel.filterGroup.logic)"
                  >
                    Thêm nhóm
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FormItemRest>
      </template>
    </Form>
  </Drawer>
</template>

<style scoped></style>

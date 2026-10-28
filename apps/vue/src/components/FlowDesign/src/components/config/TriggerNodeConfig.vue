<template>
  <div>
    <Form layout="vertical">
      <FormItem label="Chọn hành động kích hoạt" name="text" class="user-type">
        <RadioGroup v-model:value="config.type">
          <Radio value="WEBHOOK">Gửi yêu cầu mạng</Radio>
          <Radio value="EMAIL">Gửi email</Radio>
        </RadioGroup>
      </FormItem>
      <div v-if="config.type === 'WEBHOOK'">
        <FormItem label="Địa chỉ yêu cầu" name="text">
          <InputGroup compact>
            <Select style="width: 20%" v-model:value="config.http.method" placeholder="URL">
              <Option value="GET">GET</Option>
              <Option value="POST">POST</Option>
              <Option value="PUT">PUT</Option>
              <Option value="DELETE">DELETE</Option>
            </Select>
            <Input
              style="width: 80%"
              placeholder="Vui lòng nhập địa chỉ URL"
              size="middle"
              v-model:value="config.http.url"
            />
          </InputGroup>
        </FormItem>
        <FormItem name="text">
          <template #label>
            <span style="margin-right: 10px">Tiêu đề yêu cầu Header</span>
            <Button type="link" @click="addItem(config.http.headers)"> + Thêm</Button>
          </template>
          <div
            style="margin-top: 6px"
            v-for="(header, index) in config.http.headers"
            :key="header.name"
          >
            -
            <Input
              placeholder="Tên tham số"
              size="small"
              style="width: 100px"
              v-model:value="header.name"
            />
            <RadioGroup size="small" style="margin: 0 5px" v-model:value="header.isField">
              <RadioButton :value="true">Biểu mẫu</RadioButton>
              <RadioButton :value="false">Cố định</RadioButton>
            </RadioGroup>
            <Select
              v-if="header.isField"
              style="width: 180px"
              v-model:value="header.value"
              size="small"
              placeholder="Vui lòng chọn trường biểu mẫu"
            >
              <Option v-for="form in forms" :key="form.id" :value="form.title">{{
                form.title
              }}</Option>
            </Select>
            <Input
              v-else
              placeholder="Vui lòng đặt giá trị trường"
              size="small"
              v-model:value="header.value"
              style="width: 180px"
            />
            <DeleteOutlined
              @click="delItem(config.http.headers, index)"
              style="margin-left: 5px; color: #c75450; cursor: pointer"
            />
          </div>
        </FormItem>
        <FormItem name="text">
          <template #label>
            <span style="margin-right: 10px">Tham số yêu cầu Header </span>
            <Button style="margin-right: 20px" type="link" @click="addItem(config.http.params)">
              + Thêm</Button
            >
            <span>Loại tham số - </span>
            <RadioGroup size="small" style="margin: 0 5px" v-model:value="config.http.contentType">
              <RadioButton value="JSON">json</RadioButton>
              <RadioButton value="FORM">form</RadioButton>
            </RadioGroup>
          </template>
          <div
            style="margin-top: 6px"
            v-for="(param, index) in config.http.params"
            :key="param.name"
          >
            -
            <Input
              placeholder="Tên tham số"
              size="small"
              style="width: 100px"
              v-model:value="param.name"
            />
            <RadioGroup size="small" style="margin: 0 5px" v-model:value="param.isField">
              <RadioButton :value="true">Biểu mẫu</RadioButton>
              <RadioButton :value="false">Cố định</RadioButton>
            </RadioGroup>
            <Select
              v-if="param.isField"
              style="width: 180px"
              v-model:value="param.value"
              size="small"
              placeholder="Vui lòng chọn trường biểu mẫu"
            >
              <Option v-for="form in forms" :key="form.id" :value="form.title">{{
                form.title
              }}</Option>
            </Select>
            <Input
              v-else
              placeholder="Vui lòng đặt giá trị trường"
              size="small"
              v-model:value="param.value"
              style="width: 180px"
            />
            <DeleteOutlined
              @click="delItem(config.http.params, index)"
              style="margin-left: 5px; color: #c75450; cursor: pointer"
            />
          </div>
          <div> </div>
        </FormItem>
        <FormItem name="text">
          <template #label>
            <span>Xử lý kết quả yêu cầu</span>
            <span style="margin-left: 20px">Tập lệnh tùy chỉnh: </span>
            <Switch v-model:checked="config.http.handlerByScript"></Switch>
          </template>
          <span class="item-desc" v-if="config.http.handlerByScript">
            👉 Giá trị trả về là ture thì quy trình được thông qua, là false thì quy trình sẽ bị từ chối
            <div
              >Hỗ trợ hàm
              <span style="color: dodgerblue"
                >setFormByName(
                <span style="color: #939494">'Tên trường biểu mẫu', 'Giá trị trường biểu mẫu'</span>
                )</span
              >
              Có thể sửa dữ liệu biểu mẫu
            </div>
          </span>
          <span class="item-desc" v-else>👉 Bất kể kết quả yêu cầu ra sao, đều được thông qua</span>
          <div v-if="config.http.handlerByScript">
            <div>
              <span>Yêu cầu thành công😀：</span>
              <Textarea v-model:value="config.http.success" :rows="3"></Textarea>
            </div>
            <div>
              <span>Yêu cầu thất bại😥：</span>
              <Textarea v-model:value="config.http.fail" :rows="3"></Textarea>
            </div>
          </div>
        </FormItem>
      </div>
      <div v-else-if="config.type === 'EMAIL'">
        <FormItem label="Chủ đề email" name="text">
          <Input placeholder="Vui lòng nhập chủ đề email" size="middle" v-model:value="config.email.subject" />
        </FormItem>
        <FormItem label="Người nhận" name="text">
          <Select
            size="small"
            style="width: 100%"
            v-model:value="config.email.to"
            filterable
            multiple
            allow-create
            default-first-option
            placeholder="Vui lòng nhập người nhận"
          >
            <Option v-for="item in config.email.to" :key="item" :value="item">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="Nội dung email" name="text">
          <Textarea
            v-model:value="config.email.content"
            :rows="4"
            placeholder="Nội dung email, hỗ trợ biến trích xuất dữ liệu biểu mẫu ${Tên trường biểu mẫu} "
          ></Textarea>
        </FormItem>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, toRefs } from 'vue';
  import { Button, Form, Input, Select, Switch, Textarea, Radio } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useFlowStoreWithOut } from '/@/store/modules/flow';

  const FormItem = Form.Item;
  const Option = Select.Option;
  const InputGroup = Input.Group;
  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;

  const flowStore = useFlowStoreWithOut();

  defineProps({
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });
  const forms = computed(() => {
    return flowStore.design.formItems || [];
  });
  const state = reactive({
    cmOptions: {
      tabSize: 4, // tab
      indentUnit: 4,
      styleActiveLine: true, // Làm nổi bật dòng đã chọn
      lineNumbers: true, // Hiển thị số dòng
      styleSelectedText: true,
      line: true,
      foldGutter: true, // Rãnh gấp
      gutters: ['CodeMirror-linenumbers', 'lock', 'warn'],
      highlightSelectionMatches: { showToken: /w/, annotateScrollbar: true }, // Có thể bật tùy chọn này để làm nổi bật mọi thể hiện của nội dung đang chọn hiện tại
      mode: 'javascript',
      // hint.js options
      hintOptions: {
        // Khi chỉ có một kết quả khớp thì có tự động hoàn thiện không
        completeSingle: false,
      },
      // Phím tắt, có thể cung cấp ba chế độ sublime, emacs, vim
      keyMap: 'sublime',
      matchBrackets: true,
      showCursorWhenSelecting: false,
      // scrollbarStyle:null,
      // readOnly:true,  //có chỉ đọc không
      theme: 'material', // Chủ đề material
      extraKeys: { Ctrl: 'autocomplete' }, // Có thể dùng để chỉ định các liên kết phím bổ sung cho trình soạn thảo, cũng như các liên kết phím do keyMap định nghĩa
      lastLineBefore: 0,
    },
  });
  const { createMessage } = useMessage();

  function addItem(items: any) {
    if (
      items.length > 0 &&
      (items[items.length - 1].name.trim() === '' || items[items.length - 1].value.trim() === '')
    ) {
      createMessage.warning('Vui lòng hoàn thiện các mục trước rồi mới thêm');
      return;
    }
    items.push({ name: '', value: '', isField: true });
  }

  function delItem(items: any, index: number) {
    items.splice(index, 1);
  }

  defineExpose({
    ...toRefs(state),
  });
</script>

<style lang="less" scoped>
  .item-desc {
    color: #939494;
  }
</style>

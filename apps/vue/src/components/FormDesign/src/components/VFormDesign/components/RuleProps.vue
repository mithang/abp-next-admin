<!--
 * @Description: Thành phần tùy chọn kiểm tra regex
-->
<template>
  <div class="rule-props-content">
    <Form v-if="formConfig.currentItem && formConfig.currentItem['rules']">
      <div
        v-for="(item, index) of formConfig.currentItem['rules']"
        :key="index"
        class="rule-props-item"
      >
        <Icon
          icon="ant-design:close-circle-filled"
          class="rule-props-item-close"
          @click="removeRule(index)"
        />
        <FormItem label="Regex" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
          <AutoComplete
            v-model:value="item.pattern"
            placeholder="Vui lòng nhập biểu thức chính quy"
            :dataSource="patternDataSource"
          />
        </FormItem>
        <FormItem label="Nội dung" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
          <Input v-model:value="item.message" placeholder="Vui lòng nhập nội dung nhắc nhở" />
        </FormItem>
      </div>
    </Form>
    <a @click="addRules">
      <Icon icon="ant-design:file-add-outlined" />
      Thêm regex
    </a>
  </div>
</template>
<script lang="ts">
  import { ref, defineComponent } from 'vue';
  import { remove } from '../../../utils';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { isArray } from 'lodash-es';
  import { Form, FormItem, AutoComplete, Input } from 'ant-design-vue';
  import Icon from '/@/components/Icon';
  export default defineComponent({
    name: 'RuleProps',
    components: {
      Form,
      FormItem,
      AutoComplete,
      Input,
      Icon,
    },
    setup() {
      // Lấy trạng thái của component tổ tiên
      const { formConfig } = useFormDesignState();
      // Tách currentItem
      /**
       * Thêm kiểm tra regex, kiểm tra xem rules của component hiện tại có phải là mảng không, nếu không phải mảng thì dùng phương thức set để đặt lại thành mảng, sau đó thêm kiểm tra regex
       */
      const addRules = () => {
        if (!isArray(formConfig.value.currentItem!.rules))
          formConfig.value.currentItem!['rules'] = [];
        formConfig.value.currentItem!.rules?.push({ pattern: '', message: '' });
      };
      /**
       * Xóa kiểm tra regex, khi số quy tắc regex bằng 0 thì xóa thuộc tính rules
       * @param index {number} Chỉ số của quy tắc cần xóa
       */
      const removeRule = (index: number) => {
        remove(formConfig.value.currentItem!.rules as Array<any>, index);
        if (formConfig.value.currentItem!.rules?.length === 0)
          delete formConfig.value.currentItem!['rules'];
      };
      const patternDataSource = ref([
        {
          value: '/^(?:(?:\\+|00)86)?1[3-9]\\d{9}$/',
          text: 'Số điện thoại di động',
        },
        {
          value: '/^((ht|f)tps?:\\/\\/)?[\\w-]+(\\.[\\w-]+)+:\\d{1,5}\\/?$/',
          text: 'URL có cổng',
        },
        {
          value:
            '/^(((ht|f)tps?):\\/\\/)?[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:/~+#-\\(\\)]*[\\w@?^=%&/~+#-\\(\\)])?$/',
          text: 'URL có tham số',
        },
        {
          value: '/^[0-9A-HJ-NPQRTUWXY]{2}\\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/',
          text: 'Mã tín dụng xã hội thống nhất',
        },
        {
          value: '/^(s[hz]|S[HZ])(000[\\d]{3}|002[\\d]{3}|300[\\d]{3}|600[\\d]{3}|60[\\d]{4})$/',
          text: 'Mã cổ phiếu',
        },
        {
          value: '/^([a-f\\d]{32}|[A-F\\d]{32})$/',
          text: 'Định dạng md5 (32 ký tự)',
        },
        {
          value: '/^[a-f\\d]{4}(?:[a-f\\d]{4}-){4}[a-f\\d]{12}$/i',
          text: 'GUID/UUID',
        },
        {
          value: '/^\\d+(?:\\.\\d+){2}$/',
          text: 'Định dạng số phiên bản (x.y.z)',
        },
        {
          value:
            '/^https?:\\/\\/(.+\\/)+.+(\\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4))$/i',
          text: 'Địa chỉ liên kết video',
        },
        {
          value: '/^https?:\\/\\/(.+\\/)+.+(\\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i',
          text: 'Địa chỉ liên kết hình ảnh',
        },
        {
          value: '/^-?\\d+(,\\d{3})*(\\.\\d{1,2})?$/',
          text: 'Số/tiền tệ (hỗ trợ số âm, dấu phân tách hàng nghìn)',
        },
        {
          value:
            '/(?:^[1-9]([0-9]+)?(?:\\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\\.[0-9](?:[0-9])?$)/',
          text: 'Số/tiền tệ',
        },
        {
          value: '/^[1-9]\\d{9,29}$/',
          text: 'Số thẻ ngân hàng',
        },
        {
          value: '/^(?:[\u4e00-\u9fa5·]{2,16})$/',
          text: 'Tên tiếng Trung',
        },
        {
          value: '/(^[a-zA-Z][a-zA-Z\\s]{0,20}[a-zA-Z]$)/',
          text: 'Tên tiếng Anh',
        },
        {
          value:
            '/^[\u4eac\u6d25\u6caa\u6e1d\u5180\u8c6b\u4e91\u8fbd\u9ed1\u6e58\u7696\u9c81\u65b0\u82cf\u6d59\u8d63\u9102\u6842\u7518\u664b\u8499\u9655\u5409\u95fd\u8d35\u7ca4\u9752\u85cf\u5ddd\u5b81\u743c\u4f7f\u9886][A-HJ-NP-Z](?:((\\d{5}[A-HJK])|([A-HJK][A-HJ-NP-Z0-9][0-9]{4}))|[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9\u6302\u5b66\u8b66\u6e2f\u6fb3])$/',
          text: 'Biển số xe (năng lượng mới)',
        },
        {
          value:
            '/^[\u4eac\u6d25\u6caa\u6e1d\u5180\u8c6b\u4e91\u8fbd\u9ed1\u6e58\u7696\u9c81\u65b0\u82cf\u6d59\u8d63\u9102\u6842\u7518\u664b\u8499\u9655\u5409\u95fd\u8d35\u7ca4\u9752\u85cf\u5ddd\u5b81\u743c\u4f7f\u9886][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9\u6302\u5b66\u8b66\u6e2f\u6fb3]$/',
          text: 'Biển số xe (không phải năng lượng mới)',
        },
        {
          value:
            '/^[\u4eac\u6d25\u6caa\u6e1d\u5180\u8c6b\u4e91\u8fbd\u9ed1\u6e58\u7696\u9c81\u65b0\u82cf\u6d59\u8d63\u9102\u6842\u7518\u664b\u8499\u9655\u5409\u95fd\u8d35\u7ca4\u9752\u85cf\u5ddd\u5b81\u743c\u4f7f\u9886][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9\u6302\u5b66\u8b66\u6e2f\u6fb3]$/',
          text: 'Biển số xe (năng lượng mới + không phải năng lượng mới)',
        },
        {
          value:
            '/^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/',
          text: 'email (hộp thư)',
        },
        {
          value: '/^(?:(?:\\d{3}-)?\\d{8}|^(?:\\d{4}-)?\\d{7,8})(?:-\\d+)?$/',
          text: 'Điện thoại cố định',
        },
        {
          value:
            '/^[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\\d|30|31)\\d{3}[\\dXx]$/',
          text: 'Số chứng minh nhân dân',
        },
        {
          value:
            '/(^[EeKkGgDdSsPpHh]\\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\\d{7}$)/',
          text: 'Hộ chiếu',
        },
        {
          value:
            '/^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/',
          text: 'Ký tự tiếng Trung',
        },
        {
          value: '/^\\d+\\.\\d+$/',
          text: 'Số thập phân',
        },
        {
          value: '/^\\d{1,}$/',
          text: 'Số',
        },
        {
          value: '/^[1-9][0-9]{4,10}$/',
          text: 'Số QQ',
        },
        {
          value: '/^[A-Za-z0-9]+$/',
          text: 'Kết hợp chữ số và chữ cái',
        },
        {
          value: '/^[a-zA-Z]+$/',
          text: 'Chữ cái tiếng Anh',
        },
        {
          value: '/^[a-z]+$/',
          text: 'Chữ cái tiếng Anh viết thường',
        },
        {
          value: '/^[A-Z]+$/',
          text: 'Chữ cái tiếng Anh viết hoa',
        },
        {
          value: '/^[a-zA-Z0-9_-]{4,16}$/',
          text: 'Kiểm tra tên người dùng, 4 đến 16 ký tự (chữ cái, chữ số, dấu gạch dưới, dấu gạch ngang)',
        },
        {
          value: '/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/',
          text: 'Màu hệ thập lục phân',
        },
        {
          value: '/^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/',
          text: 'ID WeChat',
        },
        {
          value: '/^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\\d{4}$/',
          text: 'Mã bưu chính (Trung Quốc)',
        },
        {
          value: '/^[^A-Za-z]*$/',
          text: 'Không được chứa chữ cái',
        },
        {
          value: '/^\\+?[1-9]\\d*$/',
          text: 'Số nguyên dương, không bao gồm 0',
        },
        {
          value: '/^-[1-9]\\d*$/',
          text: 'Số nguyên âm, không bao gồm 0',
        },
        {
          value: '/^-?[0-9]\\d*$/',
          text: 'Số nguyên',
        },
        {
          value: '/^(-?\\d+)(\\.\\d+)?$/',
          text: 'Số thực',
        },
        {
          value: '/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$/',
          text: 'email (hỗ trợ hộp thư tiếng Trung)',
        },
      ]);
      return { addRules, removeRule, formConfig, patternDataSource };
    },
  });
</script>

<style lang="less" scoped>
  :deep(.icon) {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .rule-props-content {
    :deep(.ant-form-item) {
      margin-bottom: 0;
    }

    .rule-props-item {
      position: relative;
      background-color: #f0eded;
      padding: 3px 2px;
      border-radius: 5px;
      margin-bottom: 5px;

      :deep(.ant-form-item) {
        border: 0 !important;
      }

      &-close {
        position: absolute;
        top: -5px;
        right: -5px;
        color: #ccc;
        cursor: pointer;
        border-radius: 7px;
        background-color: #a3a0a0;
        z-index: 999;

        &:hover {
          color: #00c;
        }
      }
    }
  }
</style>

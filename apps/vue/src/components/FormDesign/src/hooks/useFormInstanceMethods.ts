import { IAnyObject } from '../typings/base-type';
import { Ref, SetupContext } from 'vue';
import { cloneDeep, forOwn, isFunction } from 'lodash-es';
import { AForm, IVFormComponent } from '../typings/v-form-component';
import { getCurrentInstance } from 'vue';
import { Form } from 'ant-design-vue';
import { toRaw } from 'vue';

export function useFormInstanceMethods(
  props: IAnyObject,
  formdata,
  context: Partial<SetupContext>,
  _formInstance: Ref<AForm | null>,
) {
  /**
   * Bind ngữ cảnh trong props và on thành parent
   */
  const bindContext = () => {
    const instance = getCurrentInstance();
    const vm = instance?.parent;
    if (!vm) return;

    (props.formConfig.schemas as IVFormComponent[]).forEach((item) => {
      // Bind ngữ cảnh trong props
      forOwn(item.componentProps, (value: any, key) => {
        if (isFunction(value)) {
          item.componentProps![key] = value.bind(vm);
        }
      });
      // Bind ngữ cảnh của listener sự kiện (v-on)
      forOwn(item.on, (value: any, key) => {
        if (isFunction(value)) {
          item.componentProps![key] = value.bind(vm);
        }
      });
    });
  };
  bindContext();

  const { emit } = context;

  const useForm = Form.useForm;

  const { resetFields, validate, clearValidate, validateField } = useForm(formdata, []);

  const submit = async () => {
    //const _result = await validate();

    const data = cloneDeep(toRaw(formdata.value));
    emit?.('submit', data);
    props.formConfig.submit?.(data);
    return data;
  };

  return {
    validate,
    validateField,
    resetFields,
    clearValidate,
    submit,
  };
}
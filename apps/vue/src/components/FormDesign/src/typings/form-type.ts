import { Ref } from 'vue';
import { IAnyObject } from './base-type';
import { IFormConfig, IVFormComponent } from './v-form-component';

export interface IToolbarMethods {
  showModal: (jsonData: IAnyObject) => void;
}

type ChangeTabKey = 1 | 2;
export interface IPropsPanel {
  changeTab: (key: ChangeTabKey) => void;
}
export interface IState {
  // Ngôn ngữ
  locale: any;
  // Component dùng chung
  baseComponents: IVFormComponent[];
  // Component tùy chỉnh
  customComponents: IVFormComponent[];
  // Component bố cục
  layoutComponents: IVFormComponent[];
  // Instance bảng thuộc tính
  propsPanel: Ref<null | IPropsPanel>;
  // Instance hộp thoại json
  jsonModal: Ref<null | IToolbarMethods>;
  // Hộp thoại nhập dữ liệu json
  importJsonModal: Ref<null | IToolbarMethods>;
  // Hộp thoại xem trước code
  codeModal: Ref<null | IToolbarMethods>;
  // Hộp thoại xem trước
  eFormPreview: Ref<null | IToolbarMethods>;

  eFormPreview2: Ref<null | IToolbarMethods>;
}

export interface IFormDesignMethods {
  // Đặt control đang được chọn hiện tại
  handleSetSelectItem(item: IVFormComponent): void;
  // Thêm control vào formConfig.formItems
  handleListPush(item: IVFormComponent): void;
  // Sao chép control
  handleCopy(item?: IVFormComponent, isCopy?: boolean): void;
  // Thêm thuộc tính control
  handleAddAttrs(schemas: IVFormComponent[], index: number): void;
  setFormConfig(config: IFormConfig): void;
  // Kích hoạt trước khi thêm vào form
  handleBeforeColAdd(
    event: { newIndex: string },
    schemas: IVFormComponent[],
    isCopy?: boolean,
  ): void;
}
import type { VNodeChild } from 'vue';
import type { PaginationProps } from './pagination';
import type { FormProps } from '/@/components/Form';
import type {
  TableRowSelection as ITableRowSelection,
  Key,
} from 'ant-design-vue/lib/table/interface';
import type { AdvanceSearchProps } from './advancedSearch';

import type { ColumnProps } from 'ant-design-vue/lib/table';

import { ComponentType } from './componentType';
import { VueNode } from '/@/utils/propTypes';
import { RoleEnum } from '/@/enums/roleEnum';
import { FixedType } from 'ant-design-vue/es/vc-table/interface';

import AntDesignVueTable from 'ant-design-vue/es/table';

export declare type SortOrder = 'ascend' | 'descend';

export interface TableCurrentDataSource<T = Recordable> {
  currentDataSource: T[];
}

export interface TableRowSelection<T = any> extends ITableRowSelection {
  /**
   * Callback executed when selected rows change
   * @param selectedRowKeys keyValues đã chọn
   * @param selectedRows records đã chọn
   * @param isClickCustomRow Có phải được kích hoạt khi nhấn vào hàng hay không (ngược lại, tức là nhấn checkbox/radiobox)
   * @returns void
   */
  onChange?: (selectedRowKeys: Key[], selectedRows: T[], isClickCustomRow?: boolean) => void;

  /**
   * Callback executed when select/deselect one row
   * @type Function
   */
  onSelect?: (record: T, selected: boolean, selectedRows: Object[], nativeEvent: Event) => any;

  /**
   * Callback executed when select/deselect all rows
   * @type Function
   */
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => any;

  /**
   * Callback executed when row selection is inverted
   * @type Function
   */
  onSelectInvert?: (selectedRows: Key[]) => any;
}

export interface TableCustomRecord<T> {
  record?: T;
  index?: number;
}

export interface ExpandedRowRenderRecord<T> extends TableCustomRecord<T> {
  indent?: number;
  expanded?: boolean;
}
export interface ColumnFilterItem {
  text?: string;
  value?: string;
  children?: any;
}

export interface TableCustomRecord<T = Recordable> {
  record?: T;
  index?: number;
}

export interface SorterResult {
  column: ColumnProps;
  order: SortOrder;
  field: string;
  columnKey: string;
}

export interface FetchParams {
  searchInfo?: Recordable;
  page?: number;
  sortInfo?: Recordable;
  filterInfo?: Recordable;
}

export interface GetColumnsParams {
  ignoreIndex?: boolean;
  ignoreAction?: boolean;
  sort?: boolean;
}

export type SizeType = 'default' | 'middle' | 'small' | 'large';

export interface TableActionType {
  reload: (opt?: FetchParams) => Promise<Recordable<any>[] | undefined>;
  setSelectedRows: (rows: Recordable[]) => void;
  getSelectRows: <T = Recordable>() => T[];
  clearSelectedRowKeys: () => void;
  expandAll: () => void;
  collapseAll: () => void;
  expandRows: (keyValues: Key[]) => void;
  collapseRows: (keyValues: Key[]) => void;
  scrollTo: (pos: string) => void; // pos: id | "top" | "bottom"
  getSelectRowKeys: () => Key[];
  deleteSelectRowByKey: (keyValue: Key) => void;
  setPagination: (info: Partial<PaginationProps>) => void;
  setTableData: <T = Recordable>(values: T[]) => void;
  updateTableDataRecord: (keyValue: Key, record: Recordable) => Recordable | void;
  deleteTableDataRecord: (keyValues: Key | Key[]) => void;
  insertTableDataRecord: (record: Recordable | Recordable[], index?: number) => Recordable[] | void;
  findTableDataRecord: (keyValue: Key) => Recordable | void;
  getColumns: (opt?: GetColumnsParams) => BasicColumn[];
  setColumns: (columns: BasicColumn[] | string[]) => void;
  getDataSource: <T = Recordable>() => T[];
  getRawDataSource: <T = Recordable>() => T;
  setLoading: (loading: boolean) => void;
  setProps: (props: Partial<BasicTableProps>) => void;
  redoHeight: () => void;
  setSelectedRowKeys: (keyValues: Key[]) => void;
  getPaginationRef: () => PaginationProps | boolean;
  getSize: () => SizeType;
  getRowSelection: () => TableRowSelection<Recordable>;
  getCacheColumns: () => BasicColumn[];
  emit?: EmitType;
  updateTableData: (index: number, key: string, value: any) => Recordable;
  setShowPagination: (show: boolean) => Promise<void>;
  getShowPagination: () => boolean;
  setCacheColumnsByField?: (dataIndex: string | undefined, value: BasicColumn) => void;
  setCacheColumns?: (columns: BasicColumn[]) => void;
}

export interface FetchSetting {
  // Số trang hiện tại của API yêu cầu
  pageField: string;
  // Số bản ghi hiển thị mỗi trang
  sizeField: string;
  // Trường danh sách kết quả yêu cầu, hỗ trợ a.b.c
  listField: string;
  // Trường tổng số kết quả yêu cầu, hỗ trợ a.b.c
  totalField: string;
}

export interface TableSetting {
  redo?: boolean;
  size?: boolean;
  export?: boolean;
  setting?: boolean;
  settingCache?: boolean;
  fullScreen?: boolean;
}

export interface BasicTableProps<T = any> {
  // Nhấn vào hàng để chọn
  clickToRowSelect?: boolean;
  isTreeTable?: boolean;
  accordion?: boolean; // Hỗ trợ khi isTreeTable hoặc expandRowByClick
  // Phương thức sắp xếp tùy chỉnh
  sortFn?: (sortInfo: SorterResult) => any;
  // Phương thức sắp xếp
  filterFn?: (data: Partial<Recordable<string[]>>) => any;
  // Hủy padding mặc định của bảng
  inset?: boolean;
  // Hiển thị cài đặt bảng
  showTableSetting?: boolean;
  tableSetting?: TableSetting;
  // Sọc ngựa vằn
  striped?: boolean;
  // Có tự động tạo key hay không
  autoCreateKey?: boolean;
  // Phương thức tính hàng tổng cộng
  summaryFunc?: (...arg: any) => Recordable[];
  // Nội dung bảng tổng cộng tùy chỉnh
  summaryData?: Recordable[];
  // Có hiển thị hàng tổng cộng hay không
  showSummary?: boolean;
  // Có thể kéo thả cột hay không
  canColDrag?: boolean;
  // Đối tượng yêu cầu API
  api?: (...arg: any) => Promise<any>;
  // Xử lý tham số trước khi yêu cầu
  beforeFetch?: Fn;
  // Xử lý kết quả trước khi phản hồi
  beforeResponse?: Fn;
  // Xử lý tùy chỉnh tham số trả về của API
  afterFetch?: Fn;
  // Xử lý trước khi yêu cầu điều kiện truy vấn
  handleSearchInfoFn?: Fn;
  // Cấu hình API yêu cầu
  fetchSetting?: Partial<FetchSetting>;
  // Yêu cầu API ngay lập tức
  immediate?: boolean;
  // Khi mở biểu mẫu tìm kiếm, nếu không có dữ liệu thì có hiển thị bảng hay không
  emptyDataIsShowTable?: boolean;
  // Tham số yêu cầu bổ sung
  searchInfo?: Recordable;
  // Tham số sắp xếp mặc định
  defSort?: Recordable;
  // Sử dụng biểu mẫu tìm kiếm
  useSearchForm?: boolean;
  // Cấu hình biểu mẫu
  formConfig?: Partial<FormProps>;
  // Cấu hình truy vấn nâng cao
  advancedSearchConfig?: Partial<AdvanceSearchProps>;
  // Sử dụng nhắc đã chọn
  useSelectedAlert?: boolean;
  // Cấu hình cột
  columns: BasicColumn[];
  // Có hiển thị cột số thứ tự hay không
  showIndexColumn?: boolean;
  // Cấu hình cột số thứ tự
  indexColumnProps?: BasicColumn;
  actionColumn?: BasicColumn;
  // Văn bản vượt quá chiều rộng có hiển thị hay không...
  ellipsis?: boolean;
  // Có kế thừa chiều cao của phần tử cha hay không (chiều cao phần tử cha - chiều cao biểu mẫu - chiều cao padding)
  isCanResizeParent?: boolean;
  // Có thể tự điều chỉnh chiều cao hay không
  canResize?: boolean;
  // Độ lệch chiều cao tự điều chỉnh, kết quả tính toán - độ lệch
  resizeHeightOffset?: number;

  // Xóa lựa chọn khi phân trang thay đổi
  clearSelectOnPageChange?: boolean;
  //
  rowKey?: InstanceType<typeof AntDesignVueTable>['$props']['rowKey'];
  // Dữ liệu
  dataSource?: Recordable[];
  // Nhắc phía bên phải tiêu đề
  titleHelpMessage?: string | string[];
  // Chiều cao tối đa khi cuộn bảng
  maxHeight?: number;
  // Có hiển thị viền hay không
  bordered?: boolean;
  // Cấu hình phân trang
  pagination?: PaginationProps | boolean;
  // loading đang tải
  loading?: boolean;

  /**
   * The column contains children to display
   * @default 'children'
   * @type string | string[]
   */
  childrenColumnName?: string;

  /**
   * Override default table elements
   * @type object
   */
  components?: object;

  /**
   * Expand all rows initially
   * @default false
   * @type boolean
   */
  defaultExpandAllRows?: boolean;

  /**
   * Initial expanded row keys
   * @type string[]
   */
  defaultExpandedRowKeys?: string[];

  /**
   * Current expanded row keys
   * @type string[]
   */
  expandedRowKeys?: string[];

  /**
   * Expanded container render for each row
   * @type Function
   */
  expandedRowRender?: (record?: ExpandedRowRenderRecord<T>) => VNodeChild | JSX.Element;

  /**
   * Customize row expand Icon.
   * @type Function | VNodeChild
   */
  expandIcon?: Function | VNodeChild | JSX.Element;

  /**
   * Whether to expand row by clicking anywhere in the whole row
   * @default false
   * @type boolean
   */
  expandRowByClick?: boolean;

  /**
   * The index of `expandIcon` which column will be inserted when `expandIconAsCell` is false. default 0
   */
  expandIconColumnIndex?: number;

  /**
   * Table footer renderer
   * @type Function | VNodeChild
   */
  footer?: Function | VNodeChild | JSX.Element;

  /**
   * Indent size in pixels of tree data
   * @default 15
   * @type number
   */
  indentSize?: number;

  /**
   * i18n text including filter, sort, empty text, etc
   * @default { filterConfirm: 'Ok', filterReset: 'Reset', emptyText: 'No Data' }
   * @type object
   */
  locale?: object;

  /**
   * Row's className
   * @type Function
   */
  rowClassName?: (record: TableCustomRecord<T>, index: number) => string;

  /**
   * Row selection config
   * @type object
   */
  rowSelection?: TableRowSelection;

  /**
   * Show table selection bar (Hiển thị thanh trạng thái chọn nhiều)
   * @type boolean
   */
  showSelectionBar?: boolean;

  /**
   * Set horizontal or vertical scrolling, can also be used to specify the width and height of the scroll area.
   * It is recommended to set a number for x, if you want to set it to true,
   * you need to add style .ant-table td { white-space: nowrap; }.
   * @type object
   */
  scroll?: InstanceType<typeof AntDesignVueTable>['$props']['scroll'];

  /**
   * Whether to show table header
   * @default true
   * @type boolean
   */
  showHeader?: boolean;

  /**
   * Size of table
   * @default 'default'
   * @type string
   */
  size?: SizeType;

  /**
   * Table title renderer
   * @type Function | ScopedSlot
   */
  title?: VNodeChild | JSX.Element | string | ((data: Recordable) => string);

  /**
   * Set props on per header row
   * @type Function
   */
  customHeaderRow?: (column: ColumnProps, index: number) => object;

  /**
   * Set props on per row
   * @type Function
   */
  customRow?: (record: T, index: number) => object;

  /**
   * `table-layout` attribute of table element
   * `fixed` when header/columns are fixed, or using `column.ellipsis`
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout
   * @version 1.5.0
   */
  tableLayout?: 'auto' | 'fixed' | string;

  /**
   * the render container of dropdowns in table
   * @param triggerNode
   * @version 1.5.0
   */
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;

  /**
   * Data can be changed again before rendering.
   * The default configuration of general user empty data.
   * You can configured globally through [ConfigProvider](https://antdv.com/components/config-provider-cn/)
   *
   * @version 1.5.4
   */
  transformCellText?: Function;

  /**
   * Callback executed before editable cell submit value, not for row-editor
   *
   * The cell will not submit data while callback return false
   */
  beforeEditSubmit?: (data: {
    record: Recordable;
    index: number;
    key: Key;
    value: any;
  }) => Promise<any>;

  /**
   * Callback executed when pagination, filters or sorter is changed
   * @param pagination
   * @param filters
   * @param sorter
   * @param currentDataSource
   */
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;

  /**
   * Callback executed when the row expand icon is clicked
   *
   * @param expanded
   * @param record
   */
  onExpand?: (expanded: boolean, record: T) => void;

  /**
   * Callback executed when the expanded rows change
   * @param expandedRows
   */
  onExpandedRowsChange?: (expandedRows: string[] | number[]) => void;

  onColumnsChange?: (data: ColumnChangeParam[]) => void;
}

export type CellFormat =
  | string
  | ((text: string, record: Recordable, index: number) => string | number)
  | Map<string | number, any>;

// @ts-ignore
export interface BasicColumn extends ColumnProps<Recordable> {
  children?: BasicColumn[];
  filters?: {
    text: string;
    value: string;
    children?:
      | unknown[]
      | (((props: Record<string, unknown>) => unknown[]) & (() => unknown[]) & (() => unknown[]));
  }[];

  //
  flag?: 'INDEX' | 'DEFAULT' | 'CHECKBOX' | 'RADIO' | 'ACTION';
  customTitle?: VueNode;

  slots?: Recordable;

  // Kết xuất header tùy chỉnh
  customHeaderRender?: (column: BasicColumn) => string | VNodeChild | JSX.Element;
  // Whether to hide the column by default, it can be displayed in the column configuration
  defaultHidden?: boolean;

  // Help text for table column header
  helpMessage?: string | string[] | VNodeChild | JSX.Element;

  format?: CellFormat;

  // Editable
  edit?: boolean;
  editRow?: boolean;
  editable?: boolean;
  editComponent?: ComponentType;
  editComponentProps?:
    | ((opt: {
        text: string | number | boolean | Recordable;
        record: Recordable;
        column: BasicColumn;
        index: number;
      }) => Recordable)
    | Recordable;
  editRule?: boolean | ((text: string, record: Recordable) => Promise<string>);
  editValueMap?: (value: any) => string;
  onEditRow?: () => void;
  // Mã quyền kiểm soát việc hiển thị
  auth?: RoleEnum | RoleEnum[] | string | string[];
  // Nghiệp vụ kiểm soát việc hiển thị
  ifShow?: boolean | ((column: BasicColumn) => boolean);
  // Nội dung hiển thị tùy chỉnh sau khi sửa
  editRender?: (opt: {
    text: string | number | boolean | Recordable;
    record: Recordable;
    column: BasicColumn;
    index: number;
    currentValue: string | number | boolean | Recordable;
  }) => VNodeChild | JSX.Element;
  // Disabled động
  editDynamicDisabled?: boolean | ((record: Recordable) => boolean);
}

export type ColumnChangeParam = {
  dataIndex: string;
  fixed: boolean | 'left' | 'right' | undefined;
  visible: boolean;
};

export interface InnerHandlers {
  onColumnsChange: (data: ColumnChangeParam[]) => void;
  deSelect: () => void;
}

export interface InnerMethods {
  clearSelectedRowKeys: TableActionType['clearSelectedRowKeys'];
  getSelectRowKeys: TableActionType['getSelectRowKeys'];
}

export interface ColumnOptionsType {
  value: string;
  label: string;
  //
  column: {
    defaultHidden?: boolean;
  };
  //
  fixed?: FixedType;
}
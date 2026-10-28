/** Cặp tên/giá trị */
interface NameValue<T> {
	/** Tên */
	name: string;
	/** Giá trị */
	value: T;
}
interface AuthConfig {
	audience?: string;
	authority: string;
	clientId: string;
	clientSecret: string;
}
interface Environment {
	authConfig: AuthConfig;
	dev: boolean;
	prod: boolean;
}
/** Đối tượng dữ liệu văn bản bản địa hoá */
interface LocalizableStringInfo {
	/** Tên văn bản */
	name: string;
	/** Tên tài nguyên */
	resourceName: string;
}
/** Đối tượng từ điển cặp khóa-giá trị */
type Dictionary<TKey extends number | string | symbol = any, KValue = any> = {
	[key in TKey]: KValue;
};
/** Từ điển thuộc tính mở rộng */
interface ExtraPropertyDictionary {
	[key: string]: any;
}
/** Giao diện đồng thời */
interface IHasConcurrencyStamp {
	/** Token đồng thời, cần mang theo khi cập nhật dữ liệu */
	concurrencyStamp?: string;
}
/** Giao diện thuộc tính mở rộng */
interface IHasExtraProperties {
	/** Thuộc tính mở rộng */
	extraProperties: ExtraPropertyDictionary;
}
/** Mục lựa chọn */
interface ISelectionStringValueItem {
	[key: string]: any;
	/** Đối tượng đa ngôn ngữ của văn bản hiển thị mục lựa chọn */
	displayText: LocalizableStringInfo;
	/** Giá trị mục lựa chọn */
	value: string;
}
/** Nguồn dữ liệu mục lựa chọn */
interface ISelectionStringValueItemSource {
	/** Danh sách mục lựa chọn */
	items: ISelectionStringValueItem[];
}
/** Trình kiểm chứng */
interface Validator {
	/** Tên */
	name: string;
	/** Thuộc tính */
	properties: { [key: string]: string };
}
/** Kiểu giá trị */
interface ValueType {
	/** Tên */
	name: string;
	/** Thuộc tính */
	properties: { [key: string]: string };
	/** Trình kiểm chứng */
	validator: Validator;
}
/** Kiểu giá trị mục lựa chọn */
interface SelectionStringValueType extends ValueType {
	/** Nguồn dữ liệu mục lựa chọn */
	itemSource: ISelectionStringValueItemSource;
}
/** Mô tả đa ngôn ngữ */
interface LanguageInfo {
	/**
	 * Tên văn hoá
	 * @summary Tiếng Trung giản thể: zh-Hans
	 * @summary English：en-Us
	 */
	cultureName: string;
	/** Tên hiển thị */
	displayName: string;
	/**
	 * Tên mô tả hai ký tự
	 * @summary Tiếng Trung giản thể: zh
	 * @summary English：en
	 */
	twoLetterISOLanguageName: string;
	/** Tên văn hoá dùng cho UI (chỉ phía backend) */
	uiCultureName: string;
}
/** Mô tả định dạng ngày giờ */
interface DateTimeFormat {
	/** Loại thuật toán lịch */
	calendarAlgorithmType: string;
	/** Ký tự phân tách ngày */
	dateSeparator: string;
	/** Định dạng ngày giờ dài */
	dateTimeFormatLong: string;
	/** Mẫu ngày giờ đầy đủ */
	fullDateTimePattern: string;
	/** Mẫu thời gian dài */
	longTimePattern: string;
	/** Mẫu ngày ngắn */
	shortDatePattern: string;
	/** Mẫu thời gian ngắn */
	shortTimePattern: string;
}
/** Mô tả ngôn ngữ hiện tại */
interface CurrentCulture {
	/** Tên văn hoá */
	cultureName: string;
	/** Cấu hình định dạng ngày giờ */
	dateTimeFormat: DateTimeFormat;
	/** Tên hiển thị */
	displayName: string;
	/** Tên tiếng Anh */
	englishName: string;
	/** Có viết từ phải sang trái hay không */
	isRightToLeft: boolean;
	/** Tên */
	name: string;
	/** Tên bản địa */
	nativeName: string;
	/** Tên mô tả ba ký tự */
	threeLetterIsoLanguageName: string;
	/** Tên mô tả hai ký tự */
	twoLetterIsoLanguageName: string;
}
/** Múi giờ Windows */
interface WindowsTimeZone {
	/** Định danh múi giờ */
	timeZoneId: string;
}
/** Múi giờ IANA */
interface IanaTimeZone {
	/** Tên múi giờ */
	timeZoneName: string;
}
/** Mô tả múi giờ */
interface TimeZone {
	/** Cấu hình múi giờ IANA */
	iana: IanaTimeZone;
	/** Cấu hình múi giờ Windows */
	windows: WindowsTimeZone;
}
/** Mô tả đồng hồ */
interface Clock {
	/** Loại đồng hồ
	 * @summary UTC Giờ Greenwich
	 * @summary Local Giờ địa phương
	 */
	kind: string;
}
/** Mô tả đa ngôn ngữ */
interface MultiTenancyInfo {
	/** Có bật đa tenant hay không */
	isEnabled: boolean;
}
/** Tenant hiện tại */
interface CurrentTenant {
	/** Định danh tenant */
	id?: string;
	/** Tenant có khả dụng hay không */
	isAvailable: boolean;
	/** Tên tenant */
	name?: string;
}
/** Người dùng hiện tại */
interface CurrentUser {
	/** Địa chỉ email */
	email: string;
	/** Email đã được xác nhận hay chưa */
	emailVerified: boolean;
	/** Định danh người dùng */
	id?: string;
	/** Định danh tenant mô phỏng */
	impersonatorTenantId?: string;
	/** Tên tenant mô phỏng */
	impersonatorTenantName?: string;
	/** Định danh người dùng mô phỏng */
	impersonatorUserId?: string;
	/** Tên người dùng mô phỏng */
	impersonatorUserName?: string;
	/** Đã xác thực hay chưa */
	isAuthenticated: boolean;
	/** Tên */
	name?: string;
	/** Số điện thoại */
	phoneNumber?: string;
	/** Số điện thoại đã được xác nhận hay chưa */
	phoneNumberVerified: boolean;
	/** Danh sách vai trò */
	roles: string[];
	/** Định danh phiên */
	sessionId?: string;
	/** Họ */
	surName?: string;
	/** Định danh tenant */
	tenantId?: string;
	/** Tên đăng nhập */
	userName: string;
}

interface IHasSimpleStateCheckers<TState extends IHasSimpleStateCheckers<TState>> {
	// eslint-disable-next-line no-use-before-define
	stateCheckers: ISimpleStateChecker<TState>[];
}

// type SimpleStateRecord<TState extends IHasSimpleStateCheckers<TState>, TValue> = {
// 	[P in keyof TState]: TValue;
// };

// type SimpleStateCheckerResult<TState extends IHasSimpleStateCheckers<TState>> = SimpleStateRecord<TState, boolean>;
type SimpleStateCheckerResult<TState> = Map<TState, boolean>;

interface SimpleStateCheckerContext<TState extends IHasSimpleStateCheckers<TState>> {
	state: TState;
}

interface SimpleBatchStateCheckerContext<TState extends IHasSimpleStateCheckers<TState>> {
	states: TState[];
}

interface ISimpleStateChecker<TState extends IHasSimpleStateCheckers<TState>> {
	isEnabled(context: SimpleStateCheckerContext<TState>): boolean;
	serialize(): string | undefined;
}

interface ISimpleBatchStateChecker<TState extends IHasSimpleStateCheckers<TState>> {
	isEnabled(context: SimpleBatchStateCheckerContext<TState>): SimpleStateCheckerResult<TState>;
	serialize(): string | undefined;
}

interface ISimpleStateCheckerSerializer {
	deserialize<TState extends IHasSimpleStateCheckers<TState>>(
		jsonObject: any,
		state: TState,
	): ISimpleStateChecker<TState> | undefined;
	deserializeArray<TState extends IHasSimpleStateCheckers<TState>>(
		value: string,
		state: TState,
	): ISimpleStateChecker<TState>[];
	serialize<TState extends IHasSimpleStateCheckers<TState>>(checker: ISimpleStateChecker<TState>): string | undefined;
	serializeArray<TState extends IHasSimpleStateCheckers<TState>>(
		stateCheckers: ISimpleStateChecker<TState>[],
	): string | undefined;
}

export type {
	Clock,
	CurrentCulture,
	CurrentTenant,
	CurrentUser,
	DateTimeFormat,
	Dictionary,
	Environment,
	ExtraPropertyDictionary,
	IanaTimeZone,
	IHasConcurrencyStamp,
	IHasExtraProperties,
	IHasSimpleStateCheckers,
	ISelectionStringValueItem,
	ISelectionStringValueItemSource,
	ISimpleBatchStateChecker,
	ISimpleStateChecker,
	ISimpleStateCheckerSerializer,
	LanguageInfo,
	LocalizableStringInfo,
	MultiTenancyInfo,
	NameValue,
	SelectionStringValueType,
	SimpleBatchStateCheckerContext,
	SimpleStateCheckerContext,
	SimpleStateCheckerResult,
	TimeZone,
	Validator,
	ValueType,
	WindowsTimeZone,
};

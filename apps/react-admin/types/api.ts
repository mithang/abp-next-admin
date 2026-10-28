export interface Result<T = any> {
	code: string;
	/** Chi tiết lỗi */
	details?: string;
	message: string;
	result: T;
}

export interface BasicPageParams {
    page: number;
    pageSize: number;
  }
  
  export interface BasicFetchResult<T> {
    items: T[];
    total: number;
  }
  
  export interface IAvailable {
    isAvailable: boolean;
  }
  
  export class Available implements IAvailable {
    isAvailable!: boolean;
  }
  
  /** Giao diện ủy quyền */
  export interface IPermission {
    /** Tên quyền */
    name: string;
    /** Có được ủy quyền hay không */
    isGranted: boolean;
  }
  
  /** Áp dụng cho giao diện */
  export interface IScope {
    /** Phạm vi */
    scope: string;
  }
  
  /** Khóa bí mật */
  export interface ISecret {
    /** Loại khóa bí mật */
    type: string;
    /** Giá trị khóa bí mật */
    value: string;
    /** Mô tả khóa bí mật */
    description: string | undefined;
    /** Ngày hết hạn */
    expiration: Date | undefined;
  }
  
  /** Token */
  export interface IClaim {
    /** Loại */
    type: string;
    /** Giá trị */
    value: string;
  }
  
  export class SecretBase implements ISecret {
    type = '';
    value = '';
    description = '';
    expiration: Date | undefined;
  }
  
  export enum HashType {
    Sha256,
    Sha512,
  }
  
  export class Claim implements IClaim {
    type = '';
    value = '';
  }
  
  export class KeyValue<TKey, TValue> {
    key!: TKey;
    value?: TValue;
  }
  
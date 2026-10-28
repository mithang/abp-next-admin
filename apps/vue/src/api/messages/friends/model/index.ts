import { UserCard } from '../../model';

export interface UserFriend extends UserCard {
  friendId: string;
  black: boolean;
  specialFocus: boolean;
  dontDisturb: boolean;
  remarkName: string;
  /** Có trực tuyến hay không, chỉ dự án ui sử dụng */
  onLined: boolean;
}

export interface FriendCreateRequest {
  friendId: string;
}

export interface FriendAddRequest extends FriendCreateRequest {
  remarkName: string;
}

export interface GetMyFriendsRequest {
  sorting?: string;
}

export interface GetMyFriendsPagedRequest extends PagedAndSortedResultRequestDto {
  filter?: string;
}

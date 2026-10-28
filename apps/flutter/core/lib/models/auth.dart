import 'package:json_annotation/json_annotation.dart';

part 'auth.g.dart';

/// Thể mang yêu cầu xác thực cổng doanh nghiệp
@JsonSerializable()
class PortalTokenRequest extends TokenRequest {
  PortalTokenRequest({
    required clientId,
    clientSecret,
    required this.userName,
    required this.password,
    this.enterpriseId,
  }) : super(
    grantType: 'portal',
    clientId: clientId,
    clientSecret: clientSecret,
  );
  /// Tên người dùng
  @JsonKey(name: 'username')
  String userName;
  /// Mật khẩu
  @JsonKey(name: 'password')
  String password;
  /// Nhà cung cấp xác thực hai yếu tố
  @JsonKey(name: 'enterpriseId')
  String? enterpriseId;

  @override
  String toFormUrlencodedData() {
    return '${super.toFormUrlencodedData()}&enterpriseId=${enterpriseId ?? ''}&username=$userName&password=$password';
  }

  factory PortalTokenRequest.fromJson(Map<String, dynamic> json) => _$PortalTokenRequestFromJson(json);
  
  Map<String, dynamic> toJson() => _$PortalTokenRequestToJson(this);
}

/// Thể mang yêu cầu xác thực bằng điện thoại cho xác thực hai yếu tố
@JsonSerializable()
class TwoFactorPhoneNumberTokenRequest extends PhoneNumberTokenRequest {
  TwoFactorPhoneNumberTokenRequest({
    required super.clientId,
    super.clientSecret,
    required super.phoneNumber,
    required super.code,
    required this.twoFactorProvider,
    required this.twoFactorCode,
  });
  /// Nhà cung cấp xác thực hai yếu tố
  @JsonKey(name: 'twoFactorProvider')
  String twoFactorProvider;
  /// Mã xác minh xác thực hai yếu tố
  @JsonKey(name: 'twoFactorCode')
  String twoFactorCode;

  @override
  String toFormUrlencodedData() {
    return '${super.toFormUrlencodedData()}&phone_number=$phoneNumber&phone_verify_code=$code&twoFactorProvider=twoFactorProvider&twoFactorCode=$twoFactorCode';
  }

  factory TwoFactorPhoneNumberTokenRequest.fromJson(Map<String, dynamic> json) => _$TwoFactorPhoneNumberTokenRequestFromJson(json);
  
  @override
  Map<String, dynamic> toJson() => _$TwoFactorPhoneNumberTokenRequestToJson(this);
}

/// Thể mang yêu cầu xác minh điện thoại cho xác thực danh tính
@JsonSerializable()
class PhoneNumberTokenRequest extends TokenRequest {
  PhoneNumberTokenRequest({
    required clientId,
    clientSecret,
    required this.phoneNumber,
    required this.code,
  }) : super(grantType: 'phone_verify', clientId: clientId, clientSecret: clientSecret);
  /// Số điện thoại
  // ignore: non_constant_identifier_names
  @JsonKey(name: 'phone_number')
  late String phoneNumber;
  /// Mã xác minh
  // ignore: non_constant_identifier_names
  @JsonKey(name: 'phone_verify_code')
  late String code;

  @override
  String toFormUrlencodedData() {
    return '${super.toFormUrlencodedData()}&phone_number=$phoneNumber&phone_verify_code=$code';
  }

  factory PhoneNumberTokenRequest.fromJson(Map<String, dynamic> json) => _$PhoneNumberTokenRequestFromJson(json);
  Map<String, dynamic> toJson() => _$PhoneNumberTokenRequestToJson(this);
}

/// Thể mang yêu cầu xác thực bằng mật khẩu cho xác thực hai yếu tố
@JsonSerializable()
class TwoFactorPasswordTokenRequest extends PasswordTokenRequest {
  TwoFactorPasswordTokenRequest({
    required super.clientId,
    super.clientSecret,
    required super.userName,
    required super.password,
    required this.twoFactorProvider,
    required this.twoFactorCode,
  });
  /// Nhà cung cấp xác thực hai yếu tố
  @JsonKey(name: 'twoFactorProvider')
  String twoFactorProvider;
  /// Mã xác minh xác thực hai yếu tố
  @JsonKey(name: 'twoFactorCode')
  String twoFactorCode;

  @override
  String toFormUrlencodedData() {
    return '${super.toFormUrlencodedData()}&twoFactorProvider=$twoFactorProvider&twoFactorCode=$twoFactorCode';
  }

  factory TwoFactorPasswordTokenRequest.fromJson(Map<String, dynamic> json) => _$TwoFactorPasswordTokenRequestFromJson(json);
  
  @override
  Map<String, dynamic> toJson() => _$TwoFactorPasswordTokenRequestToJson(this);
}

/// Thể mang yêu cầu xác minh mật khẩu cho xác thực danh tính
@JsonSerializable()
class PasswordTokenRequest extends TokenRequest {
  PasswordTokenRequest({
    required clientId,
    clientSecret,
    required this.userName,
    required this.password,
  }) : super(
    grantType: 'password',
    clientId: clientId,
    clientSecret: clientSecret,
  );
  /// Tên người dùng
  @JsonKey(name: 'username')
  String userName;
  /// Mật khẩu
  @JsonKey(name: 'password')
  String password;

  @override
  String toFormUrlencodedData() {
    return '${super.toFormUrlencodedData()}&username=$userName&password=$password';
  }

  factory PasswordTokenRequest.fromJson(Map<String, dynamic> json) => _$PasswordTokenRequestFromJson(json);
  Map<String, dynamic> toJson() => _$PasswordTokenRequestToJson(this);
}

/// Thể mang yêu cầu làm mới token
@JsonSerializable()
class RefreshTokenRequest extends TokenRequest {
  RefreshTokenRequest({
    required String clientId,
    String? clientSecret,
    required this.refreshToken,
  }) : super(
    grantType: 'refresh_token',
    clientId: clientId,
    clientSecret: clientSecret,
  );
  /// Token làm mới
  // ignore: non_constant_identifier_names
  @JsonKey(name: 'refresh_token')
  late String refreshToken;

  @override
  String toFormUrlencodedData() {
    return '${super.toFormUrlencodedData()}&refresh_token=$refreshToken';
  }

  factory RefreshTokenRequest.fromJson(Map<String, dynamic> json) => _$RefreshTokenRequestFromJson(json);
  Map<String, dynamic> toJson() => _$RefreshTokenRequestToJson(this);
}

/// Thể mang yêu cầu xác thực danh tính
abstract class TokenRequest {
  TokenRequest({
    required this.grantType,
    required this.clientId,
    this.clientSecret,
  });
  /// Loại xác thực
  // ignore: non_constant_identifier_names
  @JsonKey(name: 'grant_type')
  late String grantType;
  /// Mã định danh client
  // ignore: non_constant_identifier_names
  @JsonKey(name: 'client_id')
  late String clientId;
  /// Khóa bí mật client
  // ignore: non_constant_identifier_names
  @JsonKey(name: 'client_secret')
  String? clientSecret;

  String toFormUrlencodedData() {
    return 'grant_type=$grantType&client_id=$clientId&client_secret=$clientSecret';
  }
}

/// Thể mang yêu cầu xác thực hai yếu tố
abstract class TwoFactorRequest {
  TwoFactorRequest({
    required this.twoFactorProvider,
    required this.twoFactorCode,
  });
  /// Nhà cung cấp xác thực hai yếu tố
  @JsonKey(name: 'twoFactorProvider')
  String twoFactorProvider;
  /// Mã xác minh xác thực hai yếu tố
  @JsonKey(name: 'twoFactorCode')
  String twoFactorCode;
}

/// Thể mang token xác thực danh tính
@JsonSerializable()
class Token {
  Token({
    required this.accessToken,
    this.expiresIn,
    this.expiration,
    this.tokenType,
    this.refreshToken,
    this.scope,
  });
  /// Token
  @JsonKey(name: 'access_token')
  String accessToken;
  /// Thời gian hết hạn
  @JsonKey(name: 'expires_in')
  int? expiresIn;
  /// Thời gian hết hạn
  @JsonKey(name: 'expiration')
  DateTime? expiration;
  /// Loại token
  @JsonKey(name: 'token_type')
  String? tokenType;
  /// Token làm mới
  @JsonKey(name: 'refresh_token')
  String? refreshToken;
  /// Phạm vi
  @JsonKey(name: 'scope')
  String? scope;

  factory Token.fromJson(Map<String, dynamic> json) => _$TokenFromJson(json);
  Map<String, dynamic> toJson() => _$TokenToJson(this);
}

@JsonSerializable()
class UserProfile {
  UserProfile({
    required this.id,
    required this.userName,
    this.avatarUrl,
    this.name,
    this.surName,
    this.email,
    this.emailVerified,
    this.phoneNumber,
    this.phoneNumberVerified,
  });
  @JsonKey(name: 'sub')
  String id;
  @JsonKey(name: 'name')
  String userName;
  @JsonKey(name: 'avatarUrl')
  String? avatarUrl;
  @JsonKey(name: 'given_name')
  String? name;
  @JsonKey(name: 'family_name')
  String? surName;
  @JsonKey(name: 'email')
  String? email;
  @JsonKey(name: 'email_verified')
  String? emailVerified;
  @JsonKey(name: 'phoneNumber')
  String? phoneNumber;
  @JsonKey(name: 'phone_number_verified')
  String? phoneNumberVerified;

  bool get isEmailVerified => emailVerified?.toLowerCase() == 'true';
  bool get isPhoneNumberVerified => phoneNumberVerified?.toLowerCase() == 'true';

  factory UserProfile.fromJson(Map<String, dynamic> json) => _$UserProfileFromJson(json);
  Map<String, dynamic> toJson() => _$UserProfileToJson(this);
}

class PortalLoginProvider {
  PortalLoginProvider({
    required this.id,
    required this.name,
    this.logo,
  });
  String id;
  String name;
  String? logo;

  factory PortalLoginProvider.fromJson(Map<String, dynamic> json) => 
    PortalLoginProvider(
      id: json['Id'] as String,
      name: json['Name'] as String,
      logo: json['Logo'] as String?,
    );
    
  Map<String, dynamic> toJson() => 
    <String, dynamic>{
      'Id': id,
      'Name': name,
      'Logo': logo,
    };
}

class PortalLoginException implements Exception {
  PortalLoginException(this.providers);
  List<PortalLoginProvider> providers;
}

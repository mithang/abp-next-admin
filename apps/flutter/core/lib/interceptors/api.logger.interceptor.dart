import 'package:core/utils/logging.dart';
import 'package:dio/dio.dart';

class LoggerInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    logger.debug('Bắt đầu yêu cầu mạng: ${options.uri.toString()}');
    return handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    logger.debug('Kết thúc yêu cầu mạng, status: ${response.statusCode}, message: ${response.statusMessage}');
    return handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    logger.error('Lỗi yêu cầu mạng', err, err.stackTrace);
    return handler.next(err);
  }
}

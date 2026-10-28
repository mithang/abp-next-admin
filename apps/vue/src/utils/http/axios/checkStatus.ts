import type { ErrorMessageMode } from '/#/axios';
import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
// import router from '/@/router';
// import { PageEnum } from '/@/enums/pageEnum';
import { useUserStoreWithOut } from '/@/store/modules/user';
import projectSetting from '/@/settings/projectSetting';
import { SessionTimeoutProcessingEnum } from '/@/enums/appEnum';

const { createMessage, createErrorModal } = useMessage();
const error = createMessage.error!;
const stp = projectSetting.sessionTimeoutProcessing;

export function checkStatus(
  response: any,
  msg: string,
  errorMessageMode: ErrorMessageMode = 'message',
): void {
  const { t } = useI18n();
  const userStore = useUserStoreWithOut();
  let errMessage = '';

  switch (response.status) {
    case 400:
      errMessage = `${msg}`;
      break;
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401:
      userStore.setToken(undefined);
      errMessage = msg || t('sys.api.errMsg401');
      if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
        userStore.setSessionTimeout(true);
      } else {
        userStore.logout(true);
      }
      break;
    case 403:
      errMessage = t('sys.api.errMsg403');
      break;
    // 404: request không tồn tại
    case 404:
      errMessage = t('sys.api.errMsg404');
      break;
    case 405:
      errMessage = t('sys.api.errMsg405');
      break;
    case 408:
      errMessage = t('sys.api.errMsg408');
      break;
    case 500:
      errMessage = t('sys.api.errMsg500');
      break;
    case 501:
      errMessage = t('sys.api.errMsg501');
      break;
    case 502:
      errMessage = t('sys.api.errMsg502');
      break;
    case 503:
      errMessage = t('sys.api.errMsg503');
      break;
    case 504:
      errMessage = t('sys.api.errMsg504');
      break;
    case 505:
      errMessage = t('sys.api.errMsg505');
      break;
    default:
      errMessage = t('sys.api.apiRequestFailed');
      break;
  }

  if (errMessage) {
    if (errorMessageMode === 'modal') {
      createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
    } else if (errorMessageMode === 'message') {
      error({ content: errMessage, key: `global_error_message_status_${status}` });
    }
  }
}

export function checkResponse(response: any): string | undefined {
  // Hết thời gian phiên
  if (response?.status === 401) {
    const userStore = useUserStoreWithOut();
    userStore.setToken(undefined);
    userStore.setSessionTimeout(true);
    const { t } = useI18n();
    return t('sys.api.errMsg401');
  }
  
  if (!response?.data) {
    // Nếu không bắt được gì thì hiển thị thông báo lỗi mặc định
    checkStatus(response, '');
    return undefined;
  }

  if (response?.data.Enterprises) {
    return response.data.Enterprises;
  }

  let errorJson = response?.data.error;

  // Thông tin ngoại lệ do framework abp ném ra
  if (response.headers['_abperrorformat'] === 'true') {
    if (errorJson === undefined && response.data.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = function (e) {
        errorJson = JSON.parse(e.target?.result as string);
        console.log(errorJson);
        error(errorJson.error.message);
      };
      reader.readAsText(response.data);
    } else {
      let errorMessage = errorJson.message;
      if (errorJson.validationErrors) {
        errorMessage += errorJson.validationErrors.map((v) => v.message).join('\n');
      }
      error(errorMessage);
      return errorMessage;
    }
  }

  // Thông tin lỗi oauth
  if (response?.data.error_description) {
    error(response.data.error_description);
    return response.data;
  }

  // Lỗi khác
  if (response?.data.error.details) {
    error(response.data.error.details);
    return response.data.error.details;
  }

  if (response?.data.error.message) {
    error(response.data.error.message);
    return response.data.error.message;
  }

  return undefined;
}

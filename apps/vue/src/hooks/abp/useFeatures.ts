import { computed } from 'vue';
import { useAbpStoreWithOut } from '/@/store/modules/abp';

type FeatureValue = NameValue<string>;

/**
 * Interface kiểm tra tính năng
 */
export interface IFeatureChecker {
  /**
   * Tính năng có được bật không
   * @param featureNames Tên tính năng
   * @param requiresAll Có thỏa mãn tất cả không
   */
  isEnabled(featureNames: string | string[], requiresAll?: boolean): boolean;
  /**
   * Lấy giá trị tính năng
   * @param name Tên tính năng
   * @returns Trả về giá trị tính năng đã đặt, nếu không tồn tại thì là chuỗi rỗng
   */
  getOrEmpty(name: string): string;
}

export function useFeatures() {
  const getFeatures = computed(() => {
    const abpStore = useAbpStoreWithOut();
    const fetures = abpStore.getApplication.features.values ?? {};
    const fetureValues = Object.keys(fetures).map((key): FeatureValue => {
      return {
        name: key,
        value: fetures[key],
      };
    });
    return fetureValues;
  });

  function get(name: string): FeatureValue | undefined {
    return getFeatures.value.find((feature) => name === feature.name);
  }

  function _isEnabled(name: string): boolean {
    var setting = get(name);
    return setting?.value.toLowerCase() === 'true';
  }

  const featureChecker: IFeatureChecker = {
    getOrEmpty(name: string) {
      return get(name)?.value ?? '';
    },
    
    isEnabled(featureNames: string | string[], requiresAll?: boolean) {
      if (Array.isArray(featureNames)) {
        if (featureNames.length === 0) return true;
        if (requiresAll === undefined || requiresAll === true) {
          for (let index = 0; index < featureNames.length; index++) {
            if (!_isEnabled(featureNames[index])) return false;
          }
          return true;
        }
  
        for (let index = 0; index < featureNames.length; index++) {
          if (_isEnabled(featureNames[index])) return true;
        }
      } else {
        return _isEnabled(featureNames);
      }

      return false;
    },
  };

  return { featureChecker };
}

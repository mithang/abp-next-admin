import { ref } from 'vue';
// Số lượng mỗi hàng
export const grid = ref(12);
// Thuộc tính slider
export const useSlider = (min = 6, max = 12) => {
  // Thanh trượt số lượng hiển thị mỗi hàng
  const getMarks = () => {
    const l = {};
    for (let i = min; i < max + 1; i++) {
      l[i] = {
        style: {
          color: '#fff',
        },
        label: i,
      };
    }
    return l;
  };
  return {
    min,
    max,
    marks: getMarks(),
    step: 1,
  };
};

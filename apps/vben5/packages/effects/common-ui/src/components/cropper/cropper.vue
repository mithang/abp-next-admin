<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

// Định nghĩa tham số của component
const props = defineProps<{
  /** Tỉ lệ cắt, định dạng như '1:1', '16:9', '3:4' v.v. (không bắt buộc) */
  aspectRatio?: string;
  /** Chiều cao vùng chứa (mặc định 400) */
  height?: number;
  /** Địa chỉ ảnh */
  img: string;
  /** Chiều rộng vùng chứa (mặc định 500) */
  width?: number;
}>();

const CROPPER_CONSTANTS = {
  MIN_WIDTH: 60 as const,
  MIN_HEIGHT: 60 as const,
  DEFAULT_WIDTH: 500 as const,
  DEFAULT_HEIGHT: 400 as const,
  PADDING_RATIO: 0.1 as const,
  MAX_PADDING: 50 as const,
} as const;

type Point = [number, number]; // [clientX, clientY]
type Dimension = [number, number, number, number]; // [top, right, bottom, left]

// Kiểu điểm kéo thả
type DragAction =
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'move'
  | 'right'
  | 'top'
  | 'top-left'
  | 'top-right';

// Tham chiếu DOM
const containerRef = ref<HTMLDivElement | null>(null);
const bgImageRef = ref<HTMLImageElement | null>(null);
// const maskRef = ref<HTMLDivElement | null>(null);
const maskViewRef = ref<HTMLDivElement | null>(null);
const cropperRef = ref<HTMLDivElement | null>(null);
// const cropperViewRef = ref<HTMLDivElement | null>(null);

// Dữ liệu phản ứng
const isCropperVisible = ref<boolean>(false);
const validAspectRatio = ref<null | number>(null); // Giá trị tỉ lệ hợp lệ (null nghĩa là không cố định tỉ lệ)
const containerWidth = ref<number>(
  props.width ?? CROPPER_CONSTANTS.DEFAULT_WIDTH,
);
const containerHeight = ref<number>(
  props.height ?? CROPPER_CONSTANTS.DEFAULT_HEIGHT,
);

// Kích thước vùng cắt (top, right, bottom, left)
const currentDimension = ref<Dimension>([50, 50, 50, 50]);
const initDimension = ref<Dimension>([50, 50, 50, 50]);

// Trạng thái kéo thả
const dragging = ref<boolean>(false);
const startPoint = ref<Point>([0, 0]);
const startDimension = ref<Dimension>([0, 0, 0, 0]);
const direction = ref<Dimension>([0, 0, 0, 0]);
const moving = ref<boolean>(false);

/**
 * Tính kích thước vừa vặn của ảnh, đảm bảo hiển thị đầy đủ và không vượt giới hạn rộng/cao tối đa
 */
const calculateImageFitSize = () => {
  if (!bgImageRef.value) return;

  // Lấy kích thước gốc của ảnh
  const imgWidth = bgImageRef.value.naturalWidth;
  const imgHeight = bgImageRef.value.naturalHeight;

  if (imgWidth === 0 || imgHeight === 0) return;

  // Tính tỉ lệ co giãn (dùng width/height được truyền vào, mặc định 500/400)
  const widthRatio =
    (props.width ?? CROPPER_CONSTANTS.DEFAULT_WIDTH) / imgWidth;
  const heightRatio =
    (props.height ?? CROPPER_CONSTANTS.DEFAULT_HEIGHT) / imgHeight;
  const scaleRatio = Math.min(widthRatio, heightRatio, 1); // Không phóng to ảnh, chỉ thu nhỏ

  // Tính kích thước vùng chứa sau khi vừa vặn
  const fitWidth = Math.floor(imgWidth * scaleRatio);
  const fitHeight = Math.floor(imgHeight * scaleRatio);

  containerWidth.value = fitWidth;
  containerHeight.value = fitHeight;

  // Đặt lại kích thước ban đầu của khung cắt (dựa trên kích thước vùng chứa mới)
  const padding = Math.min(
    CROPPER_CONSTANTS.MAX_PADDING,
    Math.floor(fitWidth * CROPPER_CONSTANTS.PADDING_RATIO),
    Math.floor(fitHeight * CROPPER_CONSTANTS.PADDING_RATIO),
  );

  initDimension.value = [padding, padding, padding, padding];
  currentDimension.value = [padding, padding, padding, padding];
};

/**
 * Xác thực và phân tích chuỗi tỉ lệ
 * @returns {number|null} Giá trị tỉ lệ (width/height), phân tích thất bại trả về null
 */
const parseAndValidateAspectRatio = (): null | number => {
  // Nếu không truyền tham số tỉ lệ, trả về null ngay
  if (!props.aspectRatio) {
    return null;
  }

  // Xác thực định dạng tỉ lệ
  const ratioRegex = /^[1-9]\d*:[1-9]\d*$/;
  if (!ratioRegex.test(props.aspectRatio)) {
    console.warn(
      'Định dạng tỉ lệ cắt sai, phải là định dạng "số:số", ví dụ "16:9"',
    );
    return null;
  }

  // Phân tích tỉ lệ
  const [width, height] = props.aspectRatio.split(':').map(Number);

  // Xác thực tính hợp lệ của kết quả phân tích
  if (Number.isNaN(width) || Number.isNaN(height) || !width || !height) {
    console.warn(
      'Phân tích tỉ lệ cắt thất bại, chiều rộng và chiều cao phải là số nguyên dương',
    );
    return null;
  }

  return width / height;
};

/**
 * Đặt kích thước vùng cắt
 * @param {Dimension} dimension - [top, right, bottom, left]
 */
const setDimension = (dimension: Dimension) => {
  currentDimension.value = [...dimension];
  if (maskViewRef.value) {
    maskViewRef.value.style.clipPath = `inset(${dimension[0]}px ${dimension[1]}px ${dimension[2]}px ${dimension[3]}px)`;
  }
};

/**
 * Điều chỉnh vùng cắt theo tỉ lệ đã chỉ định
 */
const adjustCropperToAspectRatio = () => {
  if (!cropperRef.value) return;

  // Xác thực và phân tích tỉ lệ
  validAspectRatio.value = parseAndValidateAspectRatio();

  // Nếu không có tỉ lệ hợp lệ, dùng kích thước ban đầu, không ép cố định tỉ lệ
  if (validAspectRatio.value === null) {
    setDimension(initDimension.value);
    return;
  }

  // Có tỉ lệ hợp lệ, điều chỉnh khung cắt theo tỉ lệ
  const ratio = validAspectRatio.value;
  const containerWidthVal = containerWidth.value;
  const containerHeightVal = containerHeight.value;

  // Tính kích thước khung cắt theo tỉ lệ
  let newHeight: number, newWidth: number;

  // Ưu tiên tính theo chiều rộng trước
  newWidth = containerWidthVal;
  newHeight = newWidth / ratio;

  // Nếu chiều cao vượt vùng chứa, tính ưu tiên theo chiều cao
  if (newHeight > containerHeightVal) {
    newHeight = containerHeightVal;
    newWidth = newHeight * ratio;
  }

  // Hiển thị ở giữa
  const leftRight = (containerWidthVal - newWidth) / 2;
  const topBottom = (containerHeightVal - newHeight) / 2;

  const newDimension: Dimension = [topBottom, leftRight, topBottom, leftRight];

  setDimension(newDimension);
};

/**
 * Tạo bộ cắt ảnh
 */
const createCropper = () => {
  // Tính kích thước vừa vặn của ảnh
  calculateImageFitSize();

  isCropperVisible.value = true;
  adjustCropperToAspectRatio();
};

/**
 * Xử lý sự kiện nhấn chuột
 * @param {MouseEvent} e - Sự kiện chuột
 * @param {DragAction} action - Loại thao tác
 */
const handleMouseDown = (e: MouseEvent, action: DragAction) => {
  dragging.value = true;
  startPoint.value = [e.clientX, e.clientY];
  startDimension.value = [...currentDimension.value];
  direction.value = [0, 0, 0, 0];
  moving.value = false;

  // Xử lý di chuyển
  if (action === 'move') {
    direction.value[0] = 1;
    direction.value[2] = -1;
    direction.value[3] = 1;
    direction.value[1] = -1;
    moving.value = true;
    return;
  }

  // Xử lý hướng kéo thả
  switch (action) {
    case 'bottom': {
      direction.value[2] = -1;
      break;
    }
    case 'bottom-left': {
      direction.value[2] = -1;
      direction.value[3] = 1;
      break;
    }
    case 'bottom-right': {
      direction.value[2] = -1;
      direction.value[1] = -1;
      break;
    }
    case 'left': {
      direction.value[3] = 1;
      break;
    }
    case 'right': {
      direction.value[1] = -1;
      break;
    }
    case 'top': {
      direction.value[0] = 1;
      break;
    }
    case 'top-left': {
      direction.value[0] = 1;
      direction.value[3] = 1;
      break;
    }
    case 'top-right': {
      direction.value[0] = 1;
      direction.value[1] = -1;
      break;
    }
  }
};

/**
 * Xử lý sự kiện di chuyển chuột
 * @param {MouseEvent} e - Sự kiện chuột
 */
const handleMouseMove = (e: MouseEvent) => {
  if (!dragging.value || !cropperRef.value) return;

  const { clientX, clientY } = e;
  const diffX = clientX - startPoint.value[0];
  const diffY = clientY - startPoint.value[1];

  // Xử lý di chuyển khung cắt
  if (moving.value) {
    handleMoveCropBox(diffX, diffY);
    return;
  }

  // Không có tỉ lệ hợp lệ
  if (validAspectRatio.value === null) {
    handleFreeAspectResize(diffX, diffY);
  } else {
    handleFixedAspectResize(diffX, diffY);
  }
};

const handleMoveCropBox = (diffX: number, diffY: number) => {
  const newDimension = [...startDimension.value] as Dimension;

  // Tính vị trí sau khi lệch tạm thời
  const tempTop = startDimension.value[0] + diffY;
  const tempLeft = startDimension.value[3] + diffX;

  // Tính kích thước cố định của khung cắt
  const cropWidth =
    containerWidth.value - startDimension.value[3] - startDimension.value[1];
  const cropHeight =
    containerHeight.value - startDimension.value[0] - startDimension.value[2];

  // Giới hạn biên: đảm bảo khung cắt nằm hoàn toàn trong vùng chứa và kích thước không đổi
  // Biên trên: top >= 0, và bottom = chiều cao vùng chứa - top - chiều cao cắt >= 0
  newDimension[0] = Math.max(
    0,
    Math.min(tempTop, containerHeight.value - cropHeight),
  );
  // Biên dưới: bottom = chiều cao vùng chứa - top - chiều cao cắt (suy ra từ top, không cần tính thêm)
  newDimension[2] = containerHeight.value - newDimension[0] - cropHeight;
  // Biên trái: left >= 0, và right = chiều rộng vùng chứa - left - chiều rộng cắt >= 0
  newDimension[3] = Math.max(
    0,
    Math.min(tempLeft, containerWidth.value - cropWidth),
  );
  // Biên phải: right = chiều rộng vùng chứa - left - chiều rộng cắt (suy ra từ left, không cần tính thêm)
  newDimension[1] = containerWidth.value - newDimension[3] - cropWidth;

  // Ép buộc đảm bảo kích thước không đổi (dự phòng)
  const finalWidth = containerWidth.value - newDimension[3] - newDimension[1];
  const finalHeight = containerHeight.value - newDimension[0] - newDimension[2];

  if (finalWidth !== cropWidth) {
    newDimension[1] = containerWidth.value - newDimension[3] - cropWidth;
  }

  if (finalHeight !== cropHeight) {
    newDimension[2] = containerHeight.value - newDimension[0] - cropHeight;
  }

  // Cập nhật vùng cắt (chỉ vị trí thay đổi, kích thước/tỉ lệ hoàn toàn không đổi)
  setDimension(newDimension);
};

const handleFreeAspectResize = (diffX: number, diffY: number) => {
  const cropperWidth = containerWidth.value;
  const cropperHeight = containerHeight.value;
  const currentDimensionNew: Dimension = [0, 0, 0, 0];

  // Tính kích thước mới, đảm bảo không nhỏ hơn giá trị tối thiểu
  currentDimensionNew[0] = Math.min(
    Math.max(startDimension.value[0] + direction.value[0] * diffY, 0),
    cropperHeight - CROPPER_CONSTANTS.MIN_HEIGHT,
  );

  currentDimensionNew[1] = Math.min(
    Math.max(startDimension.value[1] + direction.value[1] * diffX, 0),
    cropperWidth - CROPPER_CONSTANTS.MIN_WIDTH,
  );

  currentDimensionNew[2] = Math.min(
    Math.max(startDimension.value[2] + direction.value[2] * diffY, 0),
    cropperHeight - CROPPER_CONSTANTS.MIN_HEIGHT,
  );

  currentDimensionNew[3] = Math.min(
    Math.max(startDimension.value[3] + direction.value[3] * diffX, 0),
    cropperWidth - CROPPER_CONSTANTS.MIN_WIDTH,
  );

  // Đảm bảo chiều rộng và chiều cao vùng cắt không nhỏ hơn giá trị tối thiểu
  const newWidth =
    cropperWidth - currentDimensionNew[3] - currentDimensionNew[1];
  const newHeight =
    cropperHeight - currentDimensionNew[0] - currentDimensionNew[2];

  if (newWidth < CROPPER_CONSTANTS.MIN_WIDTH) {
    if (direction.value[3] === 1) {
      currentDimensionNew[3] =
        cropperWidth - currentDimensionNew[1] - CROPPER_CONSTANTS.MIN_WIDTH;
    } else {
      currentDimensionNew[1] =
        cropperWidth - currentDimensionNew[3] - CROPPER_CONSTANTS.MIN_WIDTH;
    }
  }

  if (newHeight < CROPPER_CONSTANTS.MIN_HEIGHT) {
    if (direction.value[0] === 1) {
      currentDimensionNew[0] =
        cropperHeight - currentDimensionNew[2] - CROPPER_CONSTANTS.MIN_HEIGHT;
    } else {
      currentDimensionNew[2] =
        cropperHeight - currentDimensionNew[0] - CROPPER_CONSTANTS.MIN_HEIGHT;
    }
  }

  setDimension(currentDimensionNew);
};

const handleFixedAspectResize = (diffX: number, diffY: number) => {
  if (validAspectRatio.value === null) return;
  const cropperWidth = containerWidth.value;
  const cropperHeight = containerHeight.value;
  // Có tỉ lệ hợp lệ - cắt với tỉ lệ cố định
  const ratio = validAspectRatio.value;
  const currentWidth =
    cropperWidth - startDimension.value[3] - startDimension.value[1];
  const currentHeight =
    cropperHeight - startDimension.value[0] - startDimension.value[2];

  let newHeight: number, newWidth: number;
  let widthChange = 0;
  let heightChange = 0;

  // Tính lượng thay đổi chiều rộng/chiều cao
  if (direction.value[3] === 1) widthChange = -diffX;
  else if (direction.value[1] === -1) widthChange = diffX;

  if (direction.value[0] === 1) heightChange = -diffY;
  else if (direction.value[2] === -1) heightChange = diffY;

  const isCornerDrag =
    (direction.value[3] === 1 || direction.value[1] === -1) &&
    (direction.value[0] === 1 || direction.value[2] === -1);

  // Tính kích thước mới
  if (isCornerDrag) {
    if (Math.abs(widthChange) > Math.abs(heightChange)) {
      newWidth = Math.max(
        CROPPER_CONSTANTS.MIN_WIDTH,
        currentWidth + widthChange,
      );
      newHeight = newWidth / ratio;
    } else {
      newHeight = Math.max(
        CROPPER_CONSTANTS.MIN_HEIGHT,
        currentHeight + heightChange,
      );
      newWidth = newHeight * ratio;
    }
  } else {
    if (direction.value[3] === 1 || direction.value[1] === -1) {
      newWidth = Math.max(
        CROPPER_CONSTANTS.MIN_WIDTH,
        currentWidth + widthChange,
      );
      newHeight = newWidth / ratio;
    } else {
      newHeight = Math.max(
        CROPPER_CONSTANTS.MIN_HEIGHT,
        currentHeight + heightChange,
      );
      newWidth = newHeight * ratio;
    }
  }

  // Giới hạn kích thước tối đa
  const maxWidth = cropperWidth;
  const maxHeight = cropperHeight;

  if (newWidth > maxWidth) {
    newWidth = maxWidth;
    newHeight = newWidth / ratio;
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * ratio;
  }

  // Tính vị trí mới
  let newLeft = startDimension.value[3];
  let newTop = startDimension.value[0];
  let newRight = startDimension.value[1];
  let newBottom = startDimension.value[2];

  // Điều chỉnh vị trí theo hướng kéo thả
  if (direction.value[3] === 1) {
    newLeft = cropperWidth - newWidth - startDimension.value[1];
  } else if (direction.value[1] === -1) {
    newRight = cropperWidth - newWidth - startDimension.value[3];
  } else if (!isCornerDrag) {
    // Điều chỉnh về giữa
    const currentHorizontalCenter = startDimension.value[3] + currentWidth / 2;
    newLeft = Math.max(
      0,
      Math.min(cropperWidth - newWidth, currentHorizontalCenter - newWidth / 2),
    );
    newRight = cropperWidth - newWidth - newLeft;
  }

  if (direction.value[0] === 1) {
    newTop = cropperHeight - newHeight - startDimension.value[2];
  } else if (direction.value[2] === -1) {
    newBottom = cropperHeight - newHeight - startDimension.value[0];
  } else if (!isCornerDrag) {
    // Điều chỉnh về giữa
    const currentVerticalCenter = startDimension.value[0] + currentHeight / 2;
    newTop = Math.max(
      0,
      Math.min(
        cropperHeight - newHeight,
        currentVerticalCenter - newHeight / 2,
      ),
    );
    newBottom = cropperHeight - newHeight - newTop;
  }

  // Kiểm tra biên
  newLeft = Math.max(0, newLeft);
  newTop = Math.max(0, newTop);
  newRight = Math.max(0, newRight);
  newBottom = Math.max(0, newBottom);

  const newDimension: Dimension = [newTop, newRight, newBottom, newLeft];
  setDimension(newDimension);
};

/**
 * Xử lý sự kiện nhả chuột
 */
const handleMouseUp = () => {
  dragging.value = false;
  moving.value = false;
  direction.value = [0, 0, 0, 0];
};

/**
 * Xử lý khi ảnh tải xong
 */
const handleImageLoad = () => {
  createCropper();
};

/**
 * Cắt ảnh
 * @param {'image/jpeg' | 'image/png'} format - Định dạng ảnh xuất ra
 * @param {number} quality - Chất lượng nén (0-1)
 * @param {'blob' | 'base64'} outputType - Loại đầu ra
 * @param {number} targetWidth - Chiều rộng đích (tùy chọn, không truyền thì là chiều rộng cắt gốc)
 * @param {number} targetHeight - Chiều cao đích (tùy chọn, không truyền thì là chiều cao cắt gốc)
 */
const getCropImage = async (
  format: 'image/jpeg' | 'image/png' = 'image/jpeg',
  quality: number = 0.92,
  outputType: 'base64' | 'blob' = 'blob',
  targetWidth?: number,
  targetHeight?: number,
): Promise<Blob | string | undefined> => {
  if (!props.img || !bgImageRef.value || !containerRef.value) return;

  // Hiệu chỉnh biên tham số chất lượng: ép buộc giới hạn trong khoảng 0-1, tránh lỗi khi truyền giá trị không hợp lệ
  const validQuality = Math.max(0, Math.min(1, quality));

  // Tạo đối tượng ảnh tạm để lấy kích thước gốc
  const tempImg = new Image();
  // Xử lý ảnh khác nguồn: chỉ đặt ẩn danh khác nguồn cho ảnh mạng không cùng nguồn
  if (props.img.startsWith('http://') || props.img.startsWith('https://')) {
    try {
      const url = new URL(props.img);
      if (url.origin !== location.origin) {
        tempImg.crossOrigin = 'anonymous';
      }
    } catch {
      // URL không hợp lệ, bỏ qua cấu hình khác nguồn, không làm gián đoạn thực thi
    }
  }

  // Chờ ảnh tạm tải xong
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      tempImg.removeEventListener('load', handleLoad);
      tempImg.removeEventListener('error', handleError);
      reject(new Error('Tải ảnh quá thời gian, thời gian chờ 10 giây'));
    }, 10_000);
    const handleLoad = () => {
      clearTimeout(timeout);
      tempImg.removeEventListener('load', handleLoad);
      tempImg.removeEventListener('error', handleError);
      resolve();
    };

    const handleError = (err: ErrorEvent) => {
      clearTimeout(timeout);
      tempImg.removeEventListener('load', handleLoad);
      tempImg.removeEventListener('error', handleError);
      reject(new Error(`Tải ảnh thất bại: ${err.message}`));
    };

    tempImg.addEventListener('load', handleLoad);
    tempImg.addEventListener('error', handleError);
    tempImg.src = props.img;
  });

  const containerRect = containerRef.value.getBoundingClientRect();
  const imgRect = bgImageRef.value.getBoundingClientRect();

  // 1. Tính tham số hiển thị của ảnh trong vùng chứa
  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;
  const renderedImgWidth = imgRect.width;
  const renderedImgHeight = imgRect.height;
  const imgOffsetX = (containerWidth - renderedImgWidth) / 2;
  const imgOffsetY = (containerHeight - renderedImgHeight) / 2;

  // 2. Tính tọa độ thực tế của khung cắt trong vùng chứa
  const [cropTop, cropRight, cropBottom, cropLeft] = currentDimension.value;
  const cropBoxWidth = containerWidth - cropLeft - cropRight;
  const cropBoxHeight = containerHeight - cropTop - cropBottom;

  // 3. Chuyển tọa độ khung cắt thành tọa độ trên ảnh (xét độ lệch của ảnh)
  const cropOnImgX = cropLeft - imgOffsetX;
  const cropOnImgY = cropTop - imgOffsetY;

  // 4. Tính tỉ lệ co giãn từ ảnh hiển thị sang ảnh gốc (giữ nguyên điểm ảnh gốc)
  const scaleX = tempImg.width / renderedImgWidth;
  const scaleY = tempImg.height / renderedImgHeight;

  // 5. Ánh xạ sang vùng cắt của ảnh gốc (chính xác đến điểm ảnh gốc, tránh vượt biên)
  const originalCropX = Math.max(0, Math.floor(cropOnImgX * scaleX));
  const originalCropY = Math.max(0, Math.floor(cropOnImgY * scaleY));
  const originalCropWidth = Math.min(
    Math.floor(cropBoxWidth * scaleX),
    tempImg.width - originalCropX,
  );
  const originalCropHeight = Math.min(
    Math.floor(cropBoxHeight * scaleY),
    tempImg.height - originalCropY,
  );

  // Kiểm tra biên: nếu kích thước cắt không hợp lệ thì trả về
  if (originalCropWidth <= 0 || originalCropHeight <= 0) return;

  // 6. Xử lý thích ứng màn hình độ phân giải cao (khắc phục mờ trên màn hình Retina)
  const dpr = window.devicePixelRatio || 1;

  // Kích thước canvas cuối cùng (ưu tiên dùng kích thước đích được truyền vào, nếu không có thì dùng kích thước cắt gốc)
  const finalWidth = targetWidth ? Math.max(1, targetWidth) : originalCropWidth;
  const finalHeight = targetHeight
    ? Math.max(1, targetHeight)
    : originalCropHeight;

  // Tạo canvas và lấy ngữ cảnh vẽ
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Kích thước vật lý của canvas (nhân với tỉ lệ điểm ảnh thiết bị, đảm bảo độ nét cao không mờ)
  canvas.width = finalWidth * dpr;
  canvas.height = finalHeight * dpr;

  // Kích thước hiển thị của canvas (kích thước trực quan, khớp với hiển thị cuối cùng)
  canvas.style.width = `${finalWidth}px`;
  canvas.style.height = `${finalHeight}px`;

  // Co giãn ngữ cảnh canvas, thích ứng DPR màn hình độ phân giải cao
  ctx.scale(dpr, dpr);

  // 7. Vẽ ảnh đã cắt (vẽ bằng điểm ảnh gốc, đảm bảo độ nét)
  ctx.drawImage(
    tempImg,
    originalCropX, // Điểm bắt đầu cắt X của ảnh gốc (điểm ảnh chính xác)
    originalCropY, // Điểm bắt đầu cắt Y của ảnh gốc (điểm ảnh chính xác)
    originalCropWidth, // Chiều rộng cắt của ảnh gốc (điểm ảnh chính xác)
    originalCropHeight, // Chiều cao cắt của ảnh gốc (điểm ảnh chính xác)
    0, // Điểm bắt đầu vẽ X của canvas
    0, // Điểm bắt đầu vẽ Y của canvas
    finalWidth, // Chiều rộng vẽ của canvas (kích thước đích)
    finalHeight, // Chiều cao vẽ của canvas (kích thước đích)
  );

  try {
    return outputType === 'base64'
      ? canvas.toDataURL(format, validQuality)
      : new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (blob) => {
              // Dự phòng: nếu tạo blob thất bại, trả về Blob rỗng (tránh null)
              resolve(blob || new Blob([], { type: format }));
            },
            format,
            validQuality,
          );
        });
  } catch (error) {
    console.error('Xuất ảnh thất bại:', error);
  }
};

// Theo dõi thay đổi tỉ lệ, điều chỉnh lại khung cắt
watch(() => props.aspectRatio, adjustCropperToAspectRatio);

// Theo dõi thay đổi width/height, tính lại kích thước
watch([() => props.width, () => props.height], () => {
  calculateImageFitSize();
  adjustCropperToAspectRatio();
});

// Khi component được gắn, đăng ký sự kiện toàn cục
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  // Nếu ảnh đã tải xong, kích hoạt thủ công việc tạo bộ cắt ảnh
  if (
    bgImageRef.value &&
    bgImageRef.value.complete &&
    bgImageRef.value.naturalWidth > 0
  ) {
    createCropper();
  }
});

// Dọn dẹp khi component bị gỡ
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});

defineExpose({ getCropImage });
</script>

<template>
  <div
    :style="{
      width: `${width || CROPPER_CONSTANTS.DEFAULT_WIDTH}px`,
      height: `${height || CROPPER_CONSTANTS.DEFAULT_HEIGHT}px`,
    }"
    class="cropper-action-wrapper"
  >
    <div
      ref="containerRef"
      class="cropper-container"
      :style="{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
      }"
    >
      <!-- Hiển thị ảnh gốc - kích thước tự thích ứng -->
      <img
        ref="bgImageRef"
        class="cropper-image"
        :src="img"
        @load="handleImageLoad"
        :style="{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }"
        alt="Ảnh gốc để cắt"
      />

      <!-- Lớp phủ -->
      <div
        class="cropper-mask"
        :style="{
          display: isCropperVisible ? 'block' : 'none',
          width: '100%',
          height: '100%',
        }"
      >
        <div
          ref="maskViewRef"
          class="cropper-mask-view"
          :style="{
            backgroundImage: `url(${img})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            clipPath: `inset(${currentDimension[0]}px ${currentDimension[1]}px ${currentDimension[2]}px ${currentDimension[3]}px)`,
            width: '100%',
            height: '100%',
          }"
        ></div>
      </div>

      <!-- Khung cắt -->
      <div
        ref="cropperRef"
        class="cropper-box"
        :style="{
          display: isCropperVisible ? 'block' : 'none',
          width: '100%',
          height: '100%',
        }"
      >
        <div
          class="cropper-view"
          :style="{
            inset: `${currentDimension[0]}px ${currentDimension[1]}px ${currentDimension[2]}px ${currentDimension[3]}px`,
          }"
        >
          <!-- Đường hỗ trợ của khung cắt -->
          <span class="cropper-dashed-h"></span>
          <span class="cropper-dashed-v"></span>

          <!-- Vùng kéo thả của khung cắt -->
          <span
            class="cropper-move-area"
            @mousedown="handleMouseDown($event, 'move')"
          ></span>

          <!-- Đường viền -->
          <span class="cropper-line-e"></span>
          <span class="cropper-line-n"></span>
          <span class="cropper-line-w"></span>
          <span class="cropper-line-s"></span>

          <!-- Điểm kéo thả ở góc -->
          <span
            class="cropper-point cropper-point-ne"
            @mousedown="handleMouseDown($event, 'top-right')"
          >
            <span class="cropper-point-inner"></span>
          </span>
          <span
            class="cropper-point cropper-point-nw"
            @mousedown="handleMouseDown($event, 'top-left')"
          >
            <span class="cropper-point-inner"></span>
          </span>
          <span
            class="cropper-point cropper-point-sw"
            @mousedown="handleMouseDown($event, 'bottom-left')"
          >
            <span class="cropper-point-inner"></span>
          </span>
          <span
            class="cropper-point cropper-point-se"
            @mousedown="handleMouseDown($event, 'bottom-right')"
          >
            <span class="cropper-point-inner"></span>
          </span>

          <!-- Điểm kéo thả ở giữa cạnh -->
          <span
            class="cropper-point cropper-point-e"
            @mousedown="handleMouseDown($event, 'right')"
          >
            <span class="cropper-point-inner"></span>
          </span>
          <span
            class="cropper-point cropper-point-n"
            @mousedown="handleMouseDown($event, 'top')"
          >
            <span class="cropper-point-inner"></span>
          </span>
          <span
            class="cropper-point cropper-point-w"
            @mousedown="handleMouseDown($event, 'left')"
          >
            <span class="cropper-point-inner"></span>
          </span>
          <span
            class="cropper-point cropper-point-s"
            @mousedown="handleMouseDown($event, 'bottom')"
          >
            <span class="cropper-point-inner"></span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cropper-action-wrapper {
  @apply box-border flex items-center justify-center;

  background-color: transparent;

  /* Nền dạng bàn cờ */
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0;
  background-size: 20px 20px;
}

.cropper-container {
  @apply relative;
}

.cropper-image {
  @apply block;
}

/* Lớp phủ */
.cropper-mask {
  @apply absolute left-0 top-0 bg-black/50;
}

.cropper-mask-view {
  @apply absolute left-0 top-0;
}

/* Khung cắt */
.cropper-box {
  @apply absolute left-0 top-0 z-10;
}

.cropper-view {
  @apply absolute bottom-0 left-0 right-0 top-0 select-none outline outline-1 outline-blue-500;
}

/* Đường hỗ trợ của khung cắt */
.cropper-dashed-h {
  @apply absolute left-0 top-1/3 block h-1/3 w-full border-b border-t border-dashed border-gray-200/50;
}

.cropper-dashed-v {
  @apply absolute left-1/3 top-0 block h-full w-1/3 border-l border-r border-dashed border-gray-200/50;
}

/* Vùng kéo thả của khung cắt */
.cropper-move-area {
  @apply absolute left-0 top-0 block h-full w-full cursor-move bg-white/10;
}

/* Đường kéo thả viền */
.cropper-line-e,
.cropper-line-n,
.cropper-line-w,
.cropper-line-s {
  @apply absolute block bg-blue-500/10;
}

.cropper-line-e {
  @apply right-[-3px] top-0 h-full w-1;
}

.cropper-line-n {
  @apply left-0 top-[-3px] h-1 w-full;
}

.cropper-line-w {
  @apply left-[-3px] top-0 h-full w-1;
}

.cropper-line-s {
  @apply bottom-[-3px] left-0 h-1 w-full;
}

/* Điểm kéo thả */
.cropper-point {
  @apply absolute flex h-2 w-2 items-center justify-center bg-blue-500;
}

.cropper-point-inner {
  @apply block h-1.5 w-1.5 bg-white;
}

/* Vị trí và con trỏ của điểm kéo thả ở góc */
.cropper-point-ne {
  @apply right-[-5px] top-[-5px] cursor-ne-resize;
}

.cropper-point-nw {
  @apply left-[-5px] top-[-5px] cursor-nw-resize;
}

.cropper-point-sw {
  @apply bottom-[-5px] left-[-5px] cursor-sw-resize;
}

.cropper-point-se {
  @apply bottom-[-5px] right-[-5px] cursor-se-resize;
}

/* Vị trí và con trỏ của điểm kéo thả ở giữa cạnh */
.cropper-point-e {
  @apply right-[-5px] top-1/2 -mt-1 cursor-e-resize;
}

.cropper-point-n {
  @apply left-1/2 top-[-5px] -ml-1 cursor-n-resize;
}

.cropper-point-w {
  @apply left-[-5px] top-1/2 -mt-1 cursor-w-resize;
}

.cropper-point-s {
  @apply bottom-[-5px] left-1/2 -ml-1 cursor-s-resize;
}
</style>

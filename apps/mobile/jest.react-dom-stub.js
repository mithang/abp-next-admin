// Jest-only stub cho react-dom: dep web-only mà react-aria (được Gluestack
// v5 kéo vào) require, nhưng app React Native không bao giờ dùng — Metro
// native không chạy code web này. Chỉ dùng flushSync trong hook animation
// web (useEnterAnimation/useExitAnimation), component test không gọi tới;
// stub giữ nguyên hành vi gọi callback để không che lỗi nếu lỡ gọi.
module.exports = {
  flushSync: (fn) => (typeof fn === 'function' ? fn() : undefined),
  unstable_batchedUpdates: (fn, ...args) => (typeof fn === 'function' ? fn(...args) : undefined),
};

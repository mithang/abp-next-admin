# Xóa code

## Xóa code thống kê Baidu

Trong tệp `index.html` của ứng dụng tương ứng, tìm đoạn code sau và xóa đi:

```html
<!-- apps/web-antd -->
<script>
  var _hmt = _hmt || [];
  (function () {
    var hm = document.createElement('script');
    hm.src = 'https://hm.baidu.com/hm.js?d20a01273820422b6aa2ee41b6c9414d';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(hm, s);
  })();
</script>
```

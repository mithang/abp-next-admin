$(function () {
    var l = abp.localization.getResource('AbpOpenIddict');

    // Tương tác chọn tài khoản - dùng list-group-item-action của Bootstrap
    $('.account-item').on('click', function (e) {
        // Nếu nhấn vào liên kết hoặc nút thì không xử lý
        if ($(e.target).is('a, button, .btn') ||
            $(e.target).closest('a, button, .btn').length) {
            return;
        }

        // Xóa mọi trạng thái active
        $('.account-item').removeClass('active');

        // Thêm trạng thái đang chọn hiện tại
        $(this).addClass('active');

        // Chọn radio button tương ứng
        var radio = $(this).find('input[type="radio"]');
        radio.prop('checked', true);
    });

    // Kiểm tra khi gửi biểu mẫu
    $('#selectAccountForm').on('submit', function (e) {
        var selectedAccount = $('input[name="Input.SelectedAccountId"]:checked').val();

        if (!selectedAccount) {
            e.preventDefault();
            abp.message.warn(l('SelectedAccountId'));
            return false;
        }

        return true;
    });

    // Ban đầu chọn tài khoản đầu tiên (nếu không phải tài khoản hiện tại)
    if (!$('.account-item.active').length) {
        $('.account-item:first').trigger('click');
    }

    // Tự động focus vào tài khoản đang chọn
    $('.account-item.active').find('input[type="radio"]').focus();
});

$(function () {
    // Khởi tạo Scope đã chọn
    updateSelectedScopes();

    // Lắng nghe thay đổi lựa chọn Scope
    $('.scope-checkbox').change(function () {
        updateSelectedScopes();
    });

    function updateSelectedScopes() {
        var selected = [];

        // Lấy Scope bắt buộc
        $('input[name="selectedScopeValues"]').each(function () {
            selected.push($(this).val());
        });

        // Lấy Scope người dùng đã chọn
        $('.scope-checkbox:checked').each(function () {
            var value = $(this).data('scope-value');
            if (!selected.includes(value)) {
                selected.push(value);
            }
        });

        // Cập nhật trường ẩn
        $('#selected_scopes').val(selected.join(' '));
    }
});

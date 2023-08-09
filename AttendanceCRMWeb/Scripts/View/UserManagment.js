(function (minaDent, $) {




    var showDetailModal = function (userId) {
        InitModal('', '/Admin/Register/Detail', { id: userId }, function () { }, true);
    };
    var userBox;

    var resetPasswordModal = function (userId) {
        $.ajax({
            type: "Get",
            url: "/Admin/Register/ResetPassword",
            data: { userId: userId },
            beforeSend: function () {
                showWait();
            },
            success: function (result) {
                userBox = bootbox.dialog({
                    message: result,
                    title: MinaDent.Common.ResetPassword,
                    buttons: {
                        danger: {
                            label: MinaDent.Common.cancelBtnTxt,
                            className: "red",
                            callback: function () {
                                activeModal = false;
                                userBox.hide();
                            }
                        },
                        main: {
                            label: MinaDent.Common.addBtnTxt,
                            className: "blue",
                            callback: function () {
                                resetPasswordCallBack();
                            }
                        }
                    }
                })
            },
            complete: function () {
                hideWait();
            }
        });
    };
    function resetPasswordCallBack() {
        $.post("/Admin/Register/ResetPassword", $("form").serialize(),
            function (res) {
                userBox.hide();
            });
    }

    minaDent.UserManagment = {
        ShowDetailModal: showDetailModal,
        ResetPasswordModal: resetPasswordModal
    };
})(MinaDent, jQuery);



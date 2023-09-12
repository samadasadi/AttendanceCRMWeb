/*[PATH @digikala/supernova-digikala-marketplace/assets/local/js/controllers/accountController/loginAction.js]*/
var LoginAction = {
    init: function () {
        this.initLoginForm();
        this.initPasswordTypeSwitcher();

        if (window.isModuleActive('marketplace_google_authorization')) {
            this.initGoogleLogin();
        }
    },

    initLoginForm: function () {
        const $form = $('#login-form');
        const $captchaInput = $('#g-recaptcha-value');

        $('#btnSubmit').click(function (e) {
            e.preventDefault();
            /** @var grecaptcha */
            /** @param grecaptcha.getResponse */
            const grecaptcha = window.grecaptcha;

            if (grecaptcha && $captchaInput) {
                const captcha = grecaptcha.getResponse();
                $captchaInput.val(captcha);
            }
            $form.submit();
        });

        $form.find('input').first().focus();

        $form.validate({
            rules: {
                'UserName': {
                    required: true,
                    //email: true,
                    maxlength: 255
                },
                'Password': {
                    required: true,
                    minlength: 3,
                    maxlength: 255
                }
            },
            messages: {
                'UserName': {
                    'required': 'وارد نمودن نام کاربری اجباری است',
                    'email': 'آدرس نام کاربری صحیح نمی‌باشد',
                    'maxlength': 'form.general.email.validation.toolong'
                },
                'Password': {
                    'required': 'وارد کردن رمز عبور اجباری می‌باشد',
                    'minlength': 'طول رمز عبور کوتاه است',
                    'maxlength': 'کلمه عبور فعلی بسیار بلند است'
                }
            }
        }).showBackendErrors();
    },

    initPasswordTypeSwitcher: function () {
        $('.c-ui-input__btn--password').on('click', function () {
            const $input = $(this).siblings('input');
            const type = $input.prop('type') === 'password' ? 'text': 'password';
            $input.prop('type', type);
        });
    },

    initGoogleLogin: function () {
        const googleBtn = document.querySelector('#google-auth');
        let form = document.getElementById('google-form');
        let input = document.getElementById('google-user-id');

        let startApp = function () {
            gapi.load('auth2', function() {
                auth2 = gapi.auth2.init({
                    client_id: form.dataset.api,
                    scope: 'profile'
                });

                attachSignin(document.getElementById('google-auth'));
            });
        };

        function attachSignin(element) {
            auth2.attachClickHandler(
                element,
                {},
                function (googleUser) {
                    let id = googleUser.getAuthResponse().id_token;
                    input.value = id;
                    form.submit();
                }, function(error) {
                    alert(JSON.stringify(error, undefined, 2));
                }
            );
        }

        startApp();

        googleBtn.addEventListener('click', function loginByGoogle(e)
        {
            e.preventDefault();
        });
    }
};

$(function () {
    LoginAction.init();
});
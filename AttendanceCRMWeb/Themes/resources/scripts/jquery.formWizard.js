
(function ($) {
    $.fn.formToWizard = function (options, cmdParam1) {
        if (typeof options !== 'string') {
            var defaultOption = {
                submitButton: "noButton",
                showProgress: true,
                showTitle: true,
                showStepNoStr: 'Step',
                style: 1,
                direction: 'ltr',
                validateBeforeNext: null,
                nextBtnEvent: null,
                prevBtnEvent: null,
                nextBtnName: 'Next >',
                prevBtnName: '< Back',
                customButton: [{
                    htmlCode: '<input type="submit"/>', step: "-1"// can split of ,
                }]
            };

            options = $.extend(defaultOption, options);
            options.customButton = $.extend(defaultOption.customButton, options.customButton);
        }

        var element = this
          , steps = $(element).find("fieldset")
          , count = steps.size()
          , submmitButtonName = "#" + options.submitButton
          , commands = null;

        $(element).addClass("wizard-content");

        options.id = $('.wizard-content').length;

        if (typeof options !== 'string') {
            //hide submit button initially
            $(submmitButtonName).hide();

            //assign options to current/selected form (element)
            $(element).data('options', options);

            /**************** Validate Options ********************/
            if (typeof (options.validateBeforeNext) !== "function")
                options.validateBeforeNext = function () { return true; };
            if (typeof (options.nextBtnEvent) !== "function")
                options.nextBtnEvent = function () { return true; };
            if (typeof (options.prevBtnEvent) !== "function")
                options.prevBtnEvent = function () { return true; };

            options.ul = "steps_" + options.id;

            if (options.showProgress) {
                if (options.style == 1)
                    $(element).before("<ul class='" + options.ul + " steps'></ul>");
                else if (options.style == 2)
                    $(element).before("<ul class='" + options.ul + " breadcrumb-" + options.direction + "'></ul>");
                else if (options.style == 3 || options.style == 4)
                    $(element).before("<ul class='" + options.ul + " circleWizard'></ul>");
            }
            /************** End Validate Options ******************/

            steps.each(function (i) {
                $(this).wrap("<div id='step" + i + "' class='stepDetails'></div>");
                if (options.showTitle) $(this).prepend('<div class="title-wizard-step">' + $(this).find("legend").html() + '</div>');
                $(this).append("<div id='step" + i + "commands' class='wizardButtonPlace'></div>");
                 
                $(this).find("legend").hide();

                if (options.showProgress) {
                    if (options.style == 1)
                        $("." + options.ul).append("<li class='right_left' id='stepDesc" + i + "'>" + options.showStepNoStr + " " + digitStr((i + 1), options.direction) + "<span>" + $(this).find("legend").html() + "</span></li>");
                    else if (options.style == 2)
                        $("." + options.ul).append("<li class='right_left' id='stepDesc" + i + "'>" + $(this).find("legend").html() + "</li>");
                    else if (options.style == 3)
                        $("." + options.ul).append("<li class='right_left' id='stepDesc" + i + "'>" +
                                            "<span class='number right_left'>" + digitStr((i + 1), options.direction) + "</span>" +
                                            "<div class='titleStep'>" + $(this).find("legend").html() + "</div>" +
                                            "<div class='desc'>" + $(this).find("legend").attr('title') + "</div>" +
                                           "</li>");
                    else if (options.style == 4)
                        $("." + options.ul).append("<li class='right_left' id='stepDesc" + i + "'>" +
                                            "<span class='number right_left'>" + digitStr((i + 1), options.direction) + "</span>" +
                                            "<div class='titleStepOnly'>" + $(this).find("legend").html() + "</div>" +
                                           "</li>");
                }

                if (i == 0) {
                    createNextButton(i, element);
                    selectStep(i, element);
                }
                else if (i == count - 1) {
                    element.find("#step" + i).hide();
                    createPrevButton(i, element);
                }
                else {
                    element.find("#step" + i).hide();
                    createPrevButton(i, element);
                    createNextButton(i, element);
                }

                //custom button
                for (var cu = 0; cu <= options.customButton.length - 1; cu++) {
                    var item = options.customButton[cu];
                    var arrSteps = item.step.split(",");
                    if (arrSteps.indexOf(i.toString()) != -1) {
                        $(this).find('.wizardButtonPlace').append(item.htmlCode);
                    }
                }
            });

        } else if (typeof options === 'string') {
            var cmd = options;

            initCommands();

            if (typeof commands[cmd] === 'function') {
                commands[cmd](cmdParam1);
            } else {
                throw cmd + ' is invalid command!';
            }
        }


        /******************** Command Methods ********************/
        function initCommands() {
            //restore options object from form element
            options = $(element).data('options');

            commands = {
                GotoStep: function (stepNo) {
                    var stepName = "step" + (--stepNo);

                    if ($('#' + stepName)[0] === undefined) {
                        throw 'Step No ' + stepNo + ' not found!';
                    }

                    if ($('#' + stepName).css('display') === 'none') {
                        // $(element).find('.stepDetails').hide();
                        // $('#' + stepName).show();
                        selectStep(stepNo, element);
                    }
                },
                NextStep: function () {
                    $('.stepDetails:visible').find('a.next').click();
                },
                PreviousStep: function () {
                    $('.stepDetails:visible').find('a.prev').click();
                }
            };
        }
        /******************** End Command Methods ********************/


        /******************** Private Methods ********************/
        function createPrevButton(i, element) {
            var stepName = "step" + i;
            element.find("#" + stepName + "commands").append("<a href='#' id='" + stepName + "_" + element.data().options.id + "_Prev' class='btnWizard right_left'>" + options.prevBtnName + "</a>");

            $("#" + stepName + "_" + element.data().options.id + "_Prev").bind("click", function (e) {
                if (options.prevBtnEvent(i) === true) {
                    $(submmitButtonName).hide();
                    selectStep(i - 1, $(this).parents('.wizard-content:first'));
                }
                return false;
            });
        }

        function createNextButton(i, element) {
            var stepName = "step" + i;
            element.find("#" + stepName + "commands").append("<a href='#' id='" + stepName + "_" + element.data().options.id + "_Next' class='btnWizard left_right'>" + options.nextBtnName + "</a>");

            $("#" + stepName + "_" + element.data().options.id + "_Next").bind("click", function (e) {
                if (options.validateBeforeNext(i) === true && options.nextBtnEvent(i) === true) {
                    if (i + 2 == count)
                        $(submmitButtonName).show();
                    selectStep(i + 1, $(this).parents('.wizard-content:first'));
                }

                return false;
            });
        }

        function selectStep(i, element) {
            element.find(".stepDetails").hide();
            element.find("#step" + (i)).show();
            if (options.showProgress) {
                $("." + element.data().options.ul).find("li").removeClass("current");
                $("." + element.data().options.ul).find("#stepDesc" + i).addClass("current");
            }
        }
        /******************** End Private Methods ********************/

        function digitStr(str, direction) {
            if (direction == "rtl") {
                str = str.toString();
                return str.replace(/\d+/g, function (digit) {
                    var ret = '';
                    for (var i = 0, len = digit.length; i < len; i++) {
                        ret += String.fromCharCode(digit.charCodeAt(i) + 1728);
                    }
                    return ret;
                });
            }
            else
                return str;
        }

        return $(this);

    }
})(jQuery);


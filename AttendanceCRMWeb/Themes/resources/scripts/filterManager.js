
var filterRes = {
    fa: {
        equal: "برابر با",
        notEqual: "به غیر از",
        beginsWith: "شروع شود با",
        beginsNotWith: "شروع نشود با",
        contains: "شامل شود",
        notContains: "شامل نشود",
        endsWith: "خاتمه یابد با",
        endsNotWith: "خاتمه نیابد با",
        isEmpty: "خالی باشد",
        isNotEmpty: "خالی نباشد",
        greater: "بزرگتر از",
        less: "کوچکتر از",
        equalCurrentDate: "برابر با تاریخ جاری",
        notEqualCurrentDate: "به غیر از تاریخ جاری",
        greaterCurrentDate: "بزرگتر از تاریخ جاری",
        lessCurrentDate: "کوچکتر از تاریخ جاری",
        equalCurrentWeek: "برابر با هفته‌ی جاری",
        equalCurrentMonth: "برابر با ماه جاری",
        and: "تمام",
        if_: "اگر",
        conditionsMet: "شرایط برقرار باشد",
        or: "یکی از",
        addBranch: "افزودن شاخه",
        addRule: "افزودن شرط",
        remove: "حذف",
        pleaseSelect: "انتخاب کنید",
        rule: "شرط",
        title: "عنوان",
        executeOn: "اجرا هنگام",
        addAndEditForm: "ثبت و ویرایش فرم",
        addForm: "ثبت فرم",
        editForm: "ویرایش فرم",
        conditions: "شرایط",
        actionOnlyShow: "آشکار شود",
        actionOnlyHide: "پنهان شود",
        actionOnlyEnable: "فعال شود",
        actionOnlyDisable: "غیرفعال شود",
        actionShow: "آشکار شود، غیر از این شرایط پنهان شود",
        actionHide: "پنهان شود، غیر از این شرایط آشکار شود",
        actionDisable: "غیرفعال شود، غیر از این شرایط فعال شود",
        actionEnable: "فعال شود، غیر از این شرایط غیرفعال شود",
        add: "افزودن",
        actions: "عملیات",
        ok: "تایید",
        errorNoTitle: "عنوان وارد نشده است",
        rules: "شرط‌ها",
        cancel: "نصراف",
        customer: "مشتری",
        price: "قیمت",
        group: "گروه",
        createDate: "تاریخ ایجاد",
        formNum: "فرم شماره‌ی",
        paymentSuccess: "پرداخت شده",
        paymentFail: "پرداخت ناموفق",
        toggleOn: "روشن",
        toggleOff: "خاموش",
        showAllSubmissions: "نمایش تمامی اطلاعات",
        filterBy: "فیلتر شده &quot;{0}&quot;",
        productGroups: "گروه های کالا",
        customerGroups:"گروه های مشتریان"
    },
    en: {
        equal: "Equal",
        notEqual: "Not equal",
        beginsWith: "Begin with",
        beginsNotWith: "Not begin With",
        contains: "Contain",
        notContains: "Not Contain",
        endsWith: "Ends with",
        endsNotWith: "Not ends with",
        isEmpty: "Is empty",
        isNotEmpty: "Is not empty",
        greater: "Greater",
        less: "Less",
        equalCurrentDate: "Equal to current date",
        notEqualCurrentDate: "Not equal to current date",
        greaterCurrentDate: "Greater than the current date",
        lessCurrentDate: "Less than the current date",
        equalCurrentWeek: "Equal to current week",
        equalCurrentMonth: "Equal to current month",
        and: "All",
        if_: "If",
        conditionsMet: "of the conditions are met",
        or: "Any",
        addBranch: "Add branch",
        addRule: "Add rule",
        remove: "Delete",
        pleaseSelect: "Please select",
        rule: "Rules",
        title: "Title",
        executeOn: "Execute On",
        addAndEditForm: "Add &amp; update form",
        addForm: "Add form",
        editForm: "Update form",
        conditions: "Conditions",
        actionOnlyShow: "Show",
        actionOnlyHide: "Hide",
        actionOnlyEnable: "Enable",
        actionOnlyDisable: "Disable",
        actionShow: "Show Else Hide",
        actionHide: "Hide Else Show",
        actionDisable: "Disable Else Enable",
        actionEnable: "Enable Else Disable",
        actions: "Actions",
        ok: "Ok",
        errorNoTitle: "Title not entered",
        cancel: "Cancel",
        customer: "Customer",
        price: "price",
        group: "Group",
        createDate: "Create date",
        formNum: "Submission",
        paymentSuccess: "Success",
        paymentFail: "Fail",
        toggleOn: "On",
        toggleOff: "Off",
        showAllSubmissions: "Displaying all submissions",
        filterBy: "Filtered &quot;{0}&quot;",
        productGroups: "Product Groups",
        customerGroups: "Customer Groups"
    }
}

function CreateRuleManagerField(options) {
    var ruleManager = this;

    var defaultOption = {
        selectedField: '',
        primaryField: false,
        useServerSide: true,
        lang:'fa'
    }
    options = $.extend(true, defaultOption, options || {});
    var fields = $.extend(true, {}, options.Fields);

    var lang = options.lang;
    var dir = lang == 'fa' ? 'rtl' : 'ltr';
    var container = $('<div>').addClass('rule-manager-main');
    var mainGroup;
    var hasError = false;
    var orderCounter = 0;


    // operator list
    var operators = {
        equal: { id: 1, title: filterRes[lang].equal },
        notEqual: { id: 2, title: filterRes[lang].notEqual },
        beginsWith: { id: 3, title: filterRes[lang].beginsWith },
        beginsNotWith: { id: 4, title: filterRes[lang].beginsNotWith },
        contains: { id: 5, title: filterRes[lang].contains },
        notContains: { id: 6, title: filterRes[lang].notContains },
        endsWith: { id: 7, title: filterRes[lang].endsWith },
        endsNotWith: { id: 8, title: filterRes[lang].endsNotWith },
        isEmpty: { id: 9, title: filterRes[lang].isEmpty, noValue: true },
        isNotEmpty: { id: 10, title: filterRes[lang].isNotEmpty, noValue: true },
        greater: { id: 11, title: filterRes[lang].greater },
        less: { id: 12, title: filterRes[lang].less },
        equalCurrentDate: { id: 15, title: filterRes[lang].equalCurrentDate, noValue: true },
        notEqualCurrentDate: { id: 16, title: filterRes[lang].notEqualCurrentDate, noValue: true },
        greaterCurrentDate: { id: 17, title: filterRes[lang].greaterCurrentDate, noValue: true },
        lessCurrentDate: { id: 18, title: filterRes[lang].lessCurrentDate, noValue: true },
        equalCurrentWeek: { id: 19, title: filterRes[lang].equalCurrentWeek, noValue: true, useServerSide: true },
        equalCurrentMonth: { id: 20, title: filterRes[lang].equalCurrentMonth, noValue: true, useServerSide: true },
        In: { id: 21, title: filterRes[lang].equal },
        NotIn: { id: 22, title: filterRes[lang].notEqual },
    }

    //// set field operator
    $.each(fields, function (f, field) {
        switch (field.type) {
            case 'text': case 'multiline': case 'number': case 'editor':
                field.operators = [
                    operators.equal, operators.notEqual, operators.beginsWith, operators.beginsNotWith, operators.contains,
                    operators.notContains, operators.endsWith, operators.endsNotWith, operators.isEmpty, operators.isNotEmpty,
                    operators.greater, operators.less
                ];
                break;

            case 'email': case 'telephone': case 'mobile': case 'website': case 'password':
                field.operators = [
                    operators.equal, operators.notEqual, operators.beginsWith, operators.beginsNotWith, operators.contains,
                    operators.notContains, operators.endsWith, operators.endsNotWith, operators.isEmpty, operators.isNotEmpty
                ];
                break;

            case 'date':
                field.operators = [
                    operators.equal, operators.notEqual, operators.isEmpty, operators.isNotEmpty,
                    operators.greater, operators.less, operators.equalCurrentDate, operators.notEqualCurrentDate,
                    operators.greaterCurrentDate, operators.lessCurrentDate, operators.equalCurrentWeek, operators.equalCurrentMonth
                ];
                break;

            case 'list': case 'checkbox': case 'radio': case 'picture': case 'user': case 'customer': case 'factor': case 'product': case 'sales': case 'productGroup': case 'customerGroup':
                field.operators = [
                    operators.equal, operators.notEqual,
                    operators.isEmpty, operators.isNotEmpty
                ];
                break;


            case 'list-IN': case 'user-IN': case 'text-IN': case 'number-IN': case 'customer-IN': case 'factor-IN': case 'product-IN': case 'productGroup-IN':case 'customerGroup-IN':
                field.operators = [operators.In, operators.NotIn]; break;


            case 'attachment': case 'signature': case 'termofuse':
                field.operators = [
                    operators.isEmpty, operators.isNotEmpty
                ];
                break;

            case 'rangeslider': case 'rating': case 'smileyrating': case 'time':
                field.operators = [
                    operators.equal, operators.notEqual,
                    operators.isEmpty, operators.isNotEmpty,
                    operators.greater, operators.less
                ];
                break;

            case 'label': case 'multimedia': case 'map':
                field.operators = null;
                break;

            case 'toggle':
                field.operators = [
                    operators.equal
                ];
                break;
        }
    });

    $.each(fields, function (f, field) {
        field.CreateRuleInputValue = CreateRuleInputValue;
    });

    //methods
    ruleManager.getUI = function () { return container; }

    ruleManager.getSerialize = function (checkEmpty) {
        hasError = false;
        var data = getSerialize(mainGroup);
        if (data[1].length == 0) {
            if (checkEmpty) {
                hasError = true;
                container.addClass('error');
            } else {
                data = [];
            }
        }
        return { data: data, hasError: hasError }
    };

    ruleManager.init = function () {
        mainGroup = new CreateRuleGroup(true);
        mainGroup.addRule()
        container.empty().append(mainGroup.getUI());
    }

    ruleManager.build = function (data) {
        var createGroup = function (groupData, group) {
            group.setAndOr(groupData[0]);

            $.each(groupData[1], function (r, ruleData) {
                if (ruleData.length == 2) {
                    var group2 = group.addGroup();
                    createGroup(ruleData, group2);
                } else {
                    var rule = group.addRule();
                    rule.setRuleValue(ruleData[0], ruleData[1], ruleData[2], ruleData[3], ruleData[4]);
                }
            });
        }

        mainGroup = new CreateRuleGroup(true);
        container.empty().append(mainGroup.getUI());
        createGroup(data, mainGroup);
    }

    function CreateRuleGroup(isMain) {
        var group = this;
        group.groups = new Array();
        group.rules = new Array();
        group.logic = 'and';

        var wrapper = $('<div>').addClass('rule-manager-group');
        var wrapperHead = $('<div>').addClass('rule-manager-group-head');
        var wrapperBody = $('<div>').addClass('rule-manager-group-body');


        var eAndOrContainer = $('<div>').addClass('rule-manager-and-or-container');
        var eAndOrText = $('<span>').text(filterRes[lang].and);
        var eAndOr = $('<span>').addClass('and-or').append(eAndOrText, $('<span>').addClass('arrow'));
        eAndOrContainer.append($('<span>').text(filterRes[lang].if_), eAndOr, $('<span>').text(filterRes[lang].conditionsMet));
        new RaveshUI.Menu(eAndOr, {
            align: lang == 'fa' ? 'right' : 'left',
            appendTo: container,
            options: [
                {
                    title: filterRes[lang].and,
                    callback: function () {
                        setAndOr('and');
                    }
                }, {
                    title: filterRes[lang].or,
                    callback: function () {
                        setAndOr('or');
                    }
                }
            ]
        });


        var eAddGroup = $('<div>').addClass('rule-manager-btn btn-add-group').append($('<span>').text(filterRes[lang].addBranch));
        var eAddRule = $('<div>').addClass('rule-manager-btn btn-add-rule').append($('<span>').text(filterRes[lang].addRule));
        var eDeleteGroup = $('<div>').addClass('rule-manager-btn btn-close').append($('<i>').addClass('icon-close')).attr('title', filterRes[lang].remove);
        wrapperHead.append(eAndOrContainer, eAddGroup, eAddRule);
        if (!isMain) wrapperHead.append(eDeleteGroup);
        wrapper.append(wrapperHead, wrapperBody);


        //Methods
        group.getUI = function () { return wrapper; }
        group.addGroup = addGroup;
        group.addRule = addRule;
        group.setAndOr = setAndOr;

        eAddGroup.click(function () {
            var newGroup = addGroup();
            newGroup.addRule();
        });

        eAddRule.click(function () {
            addRule();
        });

        eDeleteGroup.click(function () {
            wrapper.remove();
            onRemove(group);
        });


        //Events;
        var onRemove = function () { }
        group.setOnRemove = function (callback) { onRemove = callback }


        function addGroup() {
            var newGroup = new CreateRuleGroup();
            newGroup.setOnRemove(function (deletedGroup) {
                group.groups.splice($.inArray(deletedGroup, group.groups), 1);
                checkIsMultiCondision();
            });

            group.groups.push(newGroup);
            checkIsMultiCondision();

            wrapperBody.append(newGroup.getUI());

            newGroup.order = orderCounter++;
            return newGroup;
        }

        function addRule() {
            var newRule = new CreateRule();
            newRule.setOnRemove(function () {
                group.rules.splice($.inArray(newRule, group.rules), 1);
                checkIsMultiCondision();
            });

            group.rules.push(newRule);
            checkIsMultiCondision();

            wrapperBody.append(newRule.getUI());

            newRule.order = orderCounter++;
            return newRule;
        }

        function setAndOr(logic) {
            group.logic = logic;
            eAndOrText.text(logic == 'and' ? filterRes[lang].and : filterRes[lang].or);
        }

        function checkIsMultiCondision() {
            wrapper.toggleClass('multi-rule', group.groups.length + group.rules.length > 1);
        }

    }

    function CreateRule() {
        var rule = this;

        container.removeClass('error');
        var wrapper = $('<div>').addClass('rule-manager-rule');
        var content = $('<div>').css('overflow', 'hidden').appendTo(wrapper);

        var eDeleteRule = $('<div>').addClass('rule-manager-btn btn-close float-left').append($('<i>').addClass('icon-close')).attr('title', filterRes[lang].remove);
        var eSelectField;
        var eOperator = $('<select>').hide().addClass('ravesh-input rule-manager-operator float-right');
        var eValue = $('<div>').addClass('float-right').css('display', 'block');
        var inputValue = {};
        var operator = {};

        var fieldArr = new Array();
        $.each(fields, function (f, field) { fieldArr.push(field) });
        var eSelectFieldOptions = [{ id: '', title: filterRes[lang].pleaseSelect, icon: '', order: 0 }].concat(fieldArr); //&& fields[s.type].operators != null
      
        eSelectField = new RaveshUI.DropDown({
            dir: dir,
            width: 150,
            maxHeight: 350,
            defaultTitle: filterRes[lang].pleaseSelect,
            options: eSelectFieldOptions,
            allowSearch: true,
            createOptionUI: function (data) {
                return $('<div>').addClass('picture-and-detail').css({ 'min-width': 200 }).append(
                    $('<div>').addClass('picture float-right').append($('<i>').addClass(data.icon)),
                    $('<div>').addClass('title').css({ 'line-height': 2, 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' }).text(data.title)//.attr('title', data.title)
                );
            },
            createOptionUIBefore: function (data) {
                if (!data.sectionData) return '';
                return $('<div>').addClass('option-group')
                    .css({ 'padding': '7px', 'min-width': 200, 'line-height': 1.5, 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' })
                    .text(data.sectionData.title).attr('title', data.sectionData.title)
            },
            onSelected: function (opt) {
                setRuleValue(opt.id);
                wrapper.removeClass('error');
                container.removeClass('error');
            }
        });


        content.append(eSelectField.getUI().addClass('float-right'), eOperator, eValue, eDeleteRule);
        if (options.selectedField != '' && !options.selectedFieldComplete) {
            eSelectField.setSelectedById(options.selectedField);
            setRuleValue(options.selectedField);
            // options.selectedFieldComplete = true; add ro bezani field khodesh entekhab mishavad in az comment dar biad ye bar in etefagh miofte
        }


        //Methods
        rule.getUI = function () { return wrapper; }
        rule.setRuleValue = setRuleValue;
        rule.getValue = getValue;
        rule.checkValid = checkValid;
        rule.toggleError = toggleError;

        //Events;
        var onRemove = function () { }
        rule.setOnRemove = function (callback) { onRemove = callback }


        eDeleteRule.click(function () {
            wrapper.remove();
            onRemove();
        });


        function setRuleValue(fieldId, operatorId, value, type, title) {

            eSelectField.setSelectedById(fieldId);
            eOperator.empty().show();
            eOperator.unbind();
            eValue.empty();

            var fieldData = null;
            $.each(fields, function (f, field) { if (field.id == fieldId) fieldData = field });
            if (fieldId == '' || fieldData == null) { eOperator.hide(); return; }
            var field = fieldData;

            var getOperatorById = function (id) {
                for (var opt in field.operators)
                    if (field.operators[opt].id == id) return field.operators[opt];
            }
            operator = field.operators[0];
            if (operatorId != null) operator = getOperatorById(operatorId);
            if (operator == null) operator = field.operators[0];

            $.each(field.operators, function (i, item) {
                if (!options.useServerSide && item.useServerSide) return;
                eOperator.append($('<option>').val(item.id).text(item.title));
            });
            eOperator.val(operator.id).attr('selected', 'selected');
            eValue.toggle(!operator.noValue);

            eOperator.change(function () {
                operator = getOperatorById(eOperator.val());
                eValue.toggle(!operator.noValue);
                wrapper.removeClass('error');
            });


            if (field.CreateRuleInputValue) {
                inputValue = new field.CreateRuleInputValue(fieldData, lang);
                if (inputValue.getUI) {
                    if (value) inputValue.setValue(value, title);
                    eValue.append(inputValue.getUI());
                }
            }

        }

        function checkValid() {
            return !operator.noValue ? (inputValue.getValue().id == '' ? false : true) : true
        }

        function toggleError(ctl) {
            wrapper.toggleClass('error', ctl);
        }

        function getValue() {
            var fieldId = eSelectField.getSelectedOption().id || '';
            var fieldType = eSelectField.getSelectedOption().type || '';

            switch (fieldType) {
                case 'text': case 'text-IN': case 'multiline': case 'editor': case 'email': case 'telephone': case 'mobile': case 'website': case 'password': fieldType = 1; break;
                case 'number': case 'number-IN': fieldType = 2; break;
                case 'date': case 'date-IN': fieldType = 3; break;
                case 'time': case 'time-IN': fieldType = 4; break;
                case 'list': case 'list-IN': case 'checkbox': case 'radio': case 'picture': fieldType = 5; break;
                case 'user': case 'user-IN': fieldType = 6; break;
                case 'customer': case 'customer-IN': fieldType = 7; break;
                case 'factor':case 'factor-IN': fieldType = 8; break;
                case 'product': case 'product-IN': fieldType = 9; break;
                case 'sales': case 'sales-IN': fieldType = 10; break;
                case 'toggle': fieldType = 11; break;
                case 'productGroup':case 'productGroup-IN': fieldType = 12; break;
                case 'customerGroup': case 'customerGroup-IN': fieldType = 13; break;
                default : fieldType = 0; break
            };
           
            return [
                fieldId,
                eOperator.val() || '',
                !operator.noValue ? (fieldId != '' ? inputValue.getValue().id : '') : '',
                fieldType,
                !operator.noValue ? (fieldId != '' ? inputValue.getValue().title : '') : '',
            ];
        }
    }

    function getSerialize(group) {
        var result = [group.logic, []]; // [logic, [rule, group,...]]
        var items = new Array();
        $.each(group.rules, function (r, rule) {
            var ruleData = rule.getValue();
            rule.toggleError(false);
            if (ruleData[0] != '') {
                var valid = rule.checkValid();
                if (!valid) {
                    hasError = true;
                    rule.toggleError(true);
                }
                items.push([rule.order, ruleData]);
            }
        });
        $.each(group.groups, function (g, group) {
            var serialize = getSerialize(group);
            if (serialize[1].length > 0) items.push([group.order, serialize]);
        });
        $.each(items.sort(function (a, b) { return a[0] - b[0] }), function (i, item) {
            result[1].push(item[1]);
        });
        return result;
    }
}

function CreateRuleManager(options) {
    var that = this;

    var defaultOption = {
        showTitle: false,
        showAction: false,
        showExcuteOn: false,
        showRule: true,
        lang: 'fa'
    }
    options = $.extend(true, defaultOption, options);

    var lang = options.lang;
    var dir = lang == 'fa' ? 'rtl' : 'ltr';

    var container = $('<div>');

    //Methods
    that.getUI = function () { return container; }
    that.getValue = getValue;
    that.setValue = setValue;


    //title
    var txtTitle = $('<input>').attr({ 'type': 'text', 'value': filterRes[lang].rule }).css({ 'width': 170 }).addClass('ravesh-input float-right');
    if (options.showTitle) {
        var coverTitle = $('<div>').addClass('ravesh-input-cover').append(
                $('<span>').addClass('ravesh-label').text(filterRes[lang].title),
                txtTitle);
        container.append(coverTitle);
        txtTitle.select().focus();
    }


    // excute on
    if (options.showExcuteOn) {
        var name = 'name_' + Math.random().toString(36).substr(2, 10);
        var radAll = $('<input>').attr({ type: 'radio', name: name, value: 'all', checked: true }).addClass('float-right');
        var radInsert = $('<input>').attr({ type: 'radio', name: name, value: 'insert' }).addClass('float-right');
        var radUpdate = $('<input>').attr({ type: 'radio', name: name, value: 'update' }).addClass('float-right');
        var coverExecuteOn = $('<div>').addClass('ravesh-input-cover').append(
             $('<span>').addClass('ravesh-label').text(filterRes[lang].executeOn),
             $('<label>').addClass('ravesh-checkbox-cover float-right').css({ 'margin': '2px 0' })
                 .append(radAll, $('<span>').addClass('float-right').text(filterRes[lang].addAndEditForm)),
             $('<label>').addClass('ravesh-checkbox-cover float-right').css({ 'margin': '2px 20px' })
                 .append(radInsert, $('<span>').addClass('float-right').text(filterRes[lang].addForm)),
             $('<label>').addClass('ravesh-checkbox-cover float-right').css({ 'margin': '2px 20px' })
                 .append(radUpdate, $('<span>').addClass('float-right').text(filterRes[lang].editForm))
        );
        container.append(coverExecuteOn);
    }

    // rule manage
    var ruleManager = new CreateRuleManagerField(options);
    ruleManager.init();
    if (options.showRule) {
        container.append($('<div>').addClass('ravesh-label').css('margin-bottom', 5).text(filterRes[lang].conditions), ruleManager.getUI());
    }

   
    var actionList = new Array();
    var createAction = function (isMain) {
        var self = this;
        actionList.push(self);
        var wrapper = $('<div>').addClass('rule-manager-rule').css('overflow', 'hidden');

        var drdFields = new RaveshUI.DropDown({
            dir: dir,
            width: 150,
            maxHeight: 450,
            defaultTitle: filterRes[lang].pleaseSelect,
            options: [{ id: '', title: filterRes[lang].pleaseSelect, icon: '', order: 0 }], //.concat(actionFields),
            allowSearch: true,
            createOptionUI: function (data) {
                if (data.type == 'section') {
                    return $('<div>').addClass('single-line').css('background', '#eee').text(data.title);
                } else {
                    return $('<div>').addClass('picture-and-detail').css({ 'min-width': 200 }).append(
                        $('<div>').addClass('picture float-right').append($('<i>').addClass(data.icon)),
                        $('<div>').addClass('title').css({ 'line-height': 2, 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' }).text(data.title).attr('title', data.title)
                    );
                }
            },
            onSelected: function (opt) {
                drdAction.toggle((opt.id || '') != '');
                actionContainer.removeClass('error');
            }
        });
        wrapper.append(drdFields.getUI().addClass('float-right'));

        var drdAction = $('<select>').addClass('ravesh-input float-right').css({ 'margin': '0 10px', width: 202 }).appendTo(wrapper).hide();
        var actions = {
            showOnly: filterRes[lang].actionOnlyShow, hideOnly: filterRes[lang].actionOnlyHide,
            enableOnly: filterRes[lang].actionOnlyEnable, disableOnly: filterRes[lang].actionOnlyDisable,
            show: filterRes[lang].actionShow, hide: filterRes[lang].actionHide,
            enable: filterRes[lang].actionEnable, disable: filterRes[lang].actionDisable
        };
        $.each(actions, function (a, act) {
            drdAction.append($('<option>').val(a).text(act));
        });


        var btnAdd = $('<div>').addClass('rule-manager-btn btn-add-rule float-left').append($('<i>').addClass('icon-plus')).attr('title', filterRes[lang].add).appendTo(wrapper);
        btnAdd.click(function () {
            var newAction = new createAction(false);
            wrapper.after(newAction.getUI());
        });


        if (!isMain) {
            var btnDelete = $('<div>').addClass('rule-manager-btn btn-close float-left').append($('<i>').addClass('icon-close')).attr('title', filterRes[lang].remove).appendTo(wrapper);
            btnDelete.click(function () {
                wrapper.remove();
                actionList.splice($.inArray(self, actionList), 1);
            });
        }

        //Methods
        self.getValue = function () {
            return [drdFields.getSelectedOption().id || '', drdAction.val()];
        }
        self.setValue = function (fieldId, actionId) {
            drdFields.setSelectedById(fieldId);
            drdAction.val(actionId).attr('selected', true);
            drdAction.toggle((drdFields.getSelectedOption().id || '') != '');
        }
        self.getUI = function () { return wrapper };
    }
    var actionContainer = $('<div>').addClass('rule-manager-group');
    if (options.showAction) {
        actionContainer.append(new createAction(true).getUI());
        container.append($('<div>').addClass('ravesh-label').css('margin', '20px 0 5px').text(filterRes[lang].actions), actionContainer);
    }


    function getValue() {
        var result = { hasError: false };


        if (options.showTitle) {
            var title = txtTitle.val().trim();
            if (title == '') {
                RaveshUI.warningModal(filterRes[lang].ok, filterRes[lang].errorNoTitle);
                result.hasError = true;
            }
            result.title = title;
        }


        if (options.showExcuteOn) {
            result.executeOn = coverExecuteOn.find('input:checked').val();
            if (!result.executeOn) result.executeOn = 'all';
        }


        if (options.showRule) {
            var ruleData = ruleManager.getSerialize();
            if (ruleData.hasError) result.hasError = true;
            result.rules = ruleData.data;
        } else {
            result.rules = [];
        }

        if (options.showAction) {
            result.actions = new Array();
            $.each(actionList, function (a, act) {
                var value = act.getValue();
                if (value[0] != '' && $.grep(result.actions, function (s) { return s[0] == value[0] && s[1] == value[1] }).length == 0) {
                    result.actions.push(value);
                }
            });
            if (result.actions.length == 0) {
                result.hasError = true;
                actionContainer.addClass('error');
            }
        }


        return result;
    }


    function setValue(data) {

        if (options.showTitle) {
            txtTitle.val(data.title);
        }

        if (options.showExcuteOn) {
            coverExecuteOn.find('input:[value=' + data.executeOn + ']').attr('checked', true);
        }

        if (options.showRule) {
            if (data.rules.length > 0) {
                ruleManager.build(data.rules);
            } else {
                ruleManager.init();
            }
        }

        if (options.showAction) {
            actionContainer.empty();
            $.each(data.actions, function (a, actionData) {
                var action = new createAction(a == 0);
                action.setValue(actionData[0], actionData[1]);
                actionContainer.append(action.getUI());
            });
        }
    }
}

function showRuleManagerDialog(options) {

    var defaultOption = {
        onChange: function (rule) { },
        lang:'fa'
    }
    options = $.extend(true, defaultOption, options);

    var ruleManager = new CreateRuleManager(options);

    var container = $('<div>').addClass('dialog-rule-manager-field');
    container.append(ruleManager.getUI());

    var dialog = RaveshUI.showDialog({
        title: filterRes[options.lang].rules,
        allowMaximum: true,
        disableBodyScroll: true,
        width: '70%',
        minWidth: 600
    });
    dialog.setContent(container);
    dialog.addFooterButton(filterRes[options.lang].ok, 'submit float', submitRule);
    dialog.addFooterButton(filterRes[options.lang].cancel, 'float');

    //Methods
    dialog.setValue = function (data) {
        ruleManager.setValue(data);
    }

    function submitRule() {
        var data = ruleManager.getValue();
        if (!data.hasError) {
            dialog.close();
            delete data.hasError;
            options.onChange(data);
        }
    }

    return dialog;
}

function CreateRuleInputValue(fieldData, lang) {
    var dir = lang == 'fa' ? 'rtl' : 'ltr';
    var inputWidth = 150;

    switch (fieldData.type) {

        case 'text': case 'text-IN': case 'multiline': case 'number': case 'number-IN': case 'editor': case 'email': case 'telephone': case 'mobile': case 'website': case 'password':
            var input = $('<input>').attr({ 'type': 'text' }).css('width', inputWidth).addClass('ravesh-input');
            if ((fieldData.type == 'number' || fieldData.type == 'formule' || fieldData.type == 'number-IN') && fieldData.isPrice != true) { input.onlyDecimal(); input.attr({ 'maxLength': '16' }) }
            if (fieldData.isPrice == true) { input.currency(); input.onlyNumber(); };
            this.getUI = function () { return input }
            this.getValue = function () { return { id: input.val().replace(/,/gi, ''), title: '' } }
            this.setValue = function (id, title) { input.val(id) }
            break;

        case 'date':
            var dropdown = RaveshUI.selectDate({
                dir: dir,
                lang: lang,
                width: inputWidth
            });
            this.getUI = function () { return dropdown.getUI(); }
            this.getValue = function () { return { id: dropdown.getSelectedOption().id || '', title: '' }; }
            this.setValue = function (id, title) { dropdown.setSelected(id); }
            break;

        case 'time':
            var dropdown = RaveshUI.selectTime({
                lang: lang,
                width: inputWidth
            });
            this.getUI = function () { return dropdown.getUI(); }
            this.getValue = function () { return { id: dropdown.getSelectedOption().id, title: '' }; }
            this.setValue = function (id, title) { dropdown.setSelected(id); }
            break;

        case 'list': case 'checkbox': case 'radio': case 'picture': case 'list-IN':
            var select = $('<select>').css('width', inputWidth).addClass('ravesh-input');
            $.each(fieldData.items, function (p, param) {
                select.append($('<option>').val(param.id).text(param.title));
            });
            this.getUI = function () { return select }
            this.getValue = function () { return { id: select.val(), title: '' } }
            this.setValue = function (id, title) { select.val(id).attr('selected', 'selected'); }
            break;

        case 'user': case 'user-IN':
            var dropdown = new RaveshUI.selectUser({
                dir: dir,
                width: inputWidth,
                defaultTitle: filterRes[lang].pleaseSelect
            });
            this.getUI = function () { return dropdown.getUI(); }
            this.getValue = function () { return { id: dropdown.getSelectedOption().id, title: '' }; }
            this.setValue = function (id, title) { dropdown.setSelectedById(id); }
            break;

        case 'customer': case 'customer-IN':
            var dropdown = RaveshUI.selectCustomer({
                dir: dir,
                width: inputWidth,
                defaultTitle: filterRes[lang].pleaseSelect,
                detail: filterRes[lang].customer,
                getAjaxParam: function (key) { return { key: key, group: 0, rnd: $('#HFRnd').val() } }
            });
            this.getUI = function () { return dropdown.getUI(); }
            this.getValue = function () { return dropdown.getSelectedOption() }
            this.setValue = function (id, title) { dropdown.setSelected({ id: id, title: title }); }
            break;

        case 'customerGroup': case 'customerGroup-IN':
            var dropdown = RaveshUI.selectCustomerGroup({
                dir: dir,
                defaultTitleGroup: filterRes[lang].customerGroups,
            });
            this.getUI = function () { return dropdown.getUI(); }
            this.getValue = function () { return dropdown.getSelectedOption() }
            this.setValue = function (id, title) { dropdown.setSelected({ id: id, title: title }); }
            break;

        case 'factor': case 'factor-IN':
            var dropdown = RaveshUI.selectFactor({
                dir: dir,
                width: inputWidth,
                defaultTitle: filterRes[lang].pleaseSelect,
                detail: filterRes[lang].customer,
                price: filterRes[lang].price,
                getAjaxParam: function (key) { return { key: key, factorType: fieldData.extraInfo } }
            });
            this.getUI = function () { return dropdown.getUI(); }
            this.getValue = function () { return dropdown.getSelectedOption() }
            this.setValue = function (id, title) { dropdown.setSelected({ id: id, title: title }); }
            break;

        case 'product': case 'product-IN':
            var dropdown = RaveshUI.selectProduct({
                dir: dir,
                width: inputWidth,
                defaultTitle: filterRes[lang].pleaseSelect,
                detail: filterRes[lang].group,
                price: filterRes[lang].price,
                getAjaxParam: function (key) { return { key: key, group: 0 } }
            });
            this.getUI = function () { return dropdown.getUI(); }
            this.getValue = function () { return dropdown.getSelectedOption() }
            this.setValue = function (id, title) { dropdown.setSelected({ id: id, title: title }); }
            break;

        case 'productGroup': case 'productGroup-IN':
            var dropdown = RaveshUI.selectProductGroup({
                dir: dir,
                defaultTitleGroup: filterRes[lang].productGroups,
            });
            this.getUI = function () { return dropdown.getUI(); }
            this.getValue = function () { return dropdown.getSelectedOption() }
            this.setValue = function (id, title) { dropdown.setSelected({ id: id, title: title }); }
            break;

        case 'sales':
            var dropdown = RaveshUI.selectSales({
                dir: dir,
                width: inputWidth,
                defaultTitle: filterRes[lang].pleaseSelect,
                detail: filterRes[lang].group,
                price: filterRes[lang].price,
                createDate: filterRes[lang].createDate,
                getAjaxParam: function (key) { return { key: key } }
            });
            this.getUI = function () { return dropdown.getUI(); }
            this.getValue = function () { return dropdown.getSelectedOption() }
            this.setValue = function (id, title) { dropdown.setSelected({ id: id, title: title }); }
            break;

            //case 'toggle':
            //    var hasProperty = fieldData.property.onText != '' && fieldData.property.onText != null;//old data not property onText exists
            //    var select = $('<select>').css('width', inputWidth).addClass('ravesh-input');
            //    select.append(
            //        $('<option>').val('').text(filterRes[lang].pleaseSelect),
            //        $('<option>').val('1').text(hasProperty ? fieldData.property.onText : filterRes[lang].toggleOn),
            //        $('<option>').val('0').text(hasProperty ? fieldData.property.offText : filterRes[lang].toggleOff)
            //    );
            //    this.getUI = function () { return select }
            //    this.getValue = function () { return { id: select.val(), title: '' } }
            //    this.setValue = function (id, title) { select.val(id).attr('selected', 'selected'); }
            //    break;
            //case 'dependList':
            //    var dependListStore = {};
            //    var drilldown = new RaveshUI.DrillDown({
            //        dir: dir,
            //        width: inputWidth,
            //        options: { id: 0, title: fieldData.title, childs: [] },
            //        getChildOptions: function (opt, callback) {
            //            var parentId = opt.id || 0;
            //            if (fieldData.property.list.length == 0) return false;
            //            var listId = fieldData.property.list[0].id;
            //            var storeId = listId + '_' + parentId;
            //            if (dependListStore[storeId]) {
            //                callback(dependListStore[storeId]);
            //                return false
            //            }
            //            FormUtility.postExtra('/pages/FormBuilder/services/ListParameterService_.asmx/getParamTree_', { listId: listId, parentId: parentId },
            //                function (isSuccess, message, data) {
            //                    if (isSuccess) {
            //                        var params = [{ id: '', title: filterRes[lang].pleaseSelect }].concat(data)
            //                        callback(params);
            //                        dependListStore[storeId] = params;
            //                    }
            //                }
            //            )
            //        }
            //    });
            //    drilldown.setSelected({ id: '', title: filterRes[lang].pleaseSelect });
            //    this.getUI = function () { return drilldown.getUI() }
            //    this.getValue = function () { return drilldown.getSelectedOption() }
            //    this.setValue = function (id, title) { drilldown.setSelected({ id: id, title: title }); }
            //    break;
            //case 'matrix':
            //    var options = [{ id: '', title: filterRes[lang].pleaseSelect }];
            //    $.each(fieldData.property.list[0].items, function (r, row) {
            //        $.each(fieldData.property.list[1].items, function (c, col) {
            //            var opt = { id: row.id + '_' + col.id, title: row.title + ' / ' + col.title, col: col.title, group: c == 0 ? row.title : '' };
            //            options.push(opt);
            //        });
            //    });
            //    var dropdown = new RaveshUI.DropDown({
            //        dir: dir,
            //        width: inputWidth,
            //        defaultTitle: filterRes[lang].pleaseSelect,
            //        options: options,
            //        allowSearch: false,
            //        createOptionUI: function (data) {
            //            return $('<div>').addClass('single-line').text(data.col || data.title);
            //        },
            //        createOptionUIBefore: function (data) {
            //            if (!data.group) return '';
            //            return $('<div>').addClass('option-group').text(data.group);
            //        }
            //    });
            //    this.getUI = function () { return dropdown.getUI(); }
            //    this.getValue = function () { return { id: dropdown.getSelectedOption().id, title: '' }; }
            //    this.setValue = function (id, title) { dropdown.setSelectedById(id); }
            //    break;
            //case 'fixListSample':
            //    var select = $('<select>').css('width', inputWidth).addClass('ravesh-input');
            //    select.append(
            //        $('<option>').val('').text(filterRes[lang].pleaseSelect),
            //        $('<option>').val('1').text(filterRes[lang].paymentSuccess),
            //        $('<option>').val('2').text(filterRes[lang].paymentFail)
            //    );
            //    this.getUI = function () { return select }
            //    this.getValue = function () { return { id: select.val(), title: '' } }
            //    this.setValue = function (id, title) { select.val(id).attr('selected', 'selected'); }
            //    break;
    }
}

$(document).ready(function () { //vaghti css ha compress mishe ina az tosh hazf mishe
    $('body').append('<style>' +
                        '.multi-rule > .rule-manager-group-body > ::after, .multi-rule > .rule-manager-group-body > ::before {height: calc(50% + 4px);}' +
                        '.multi-rule > .rule-manager-group-body > :first-child::before {height: calc(50% + 14px);}' +
                     '</style>');
});
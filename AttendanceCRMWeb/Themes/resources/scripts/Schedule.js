
var TSchedule = { reminder: 1, event: 2, email: 3, sms: 4, workflow: 5, email_shedule: 6, email_template: 7, sms_shedule: 8, sms_template: 9, tcustomer:10 };
var DateTypeSch = { day: 1, week: 2, mount: 3, mount2: 4, year: 5, year2: 6, date: 7, form: 8, parametr: 9, getStr: function (type) { switch (type) { case 1: return "day"; case 2: return "week"; case 3: return "mount"; case 4: return "mount2"; case 5: return "year"; case 6: return "year2"; case 7: return "date"; case 8: return "form"; case 9: return "parametr" } } };
var ScheduleInfo = { type: 0, code: 0, data: [], tempID: 0, domain: '', user_code: '', DlgMode: 0, divList: "" }
var DlgIdSch = 'Dialog_Schedule_Opt';
var dateParam = {};

function Dlg_Schedule(domain, user_code, codeDU, sch_type, code, dialogTitle, DlgMode, divList, showDialog, enableMask) {
    var getUc = false;
    if ($('#' + DlgIdSch).length == 0) {
        getUc = true;
        $('body').append('<div id="' + DlgIdSch + '" title="' + dialogTitle + '"></div>');
        $('#' + DlgIdSch).append('<div class="wait tempWaitSch" style="margin: 5px auto;"></div>');
        $('#' + DlgIdSch).dialog({
            autoOpen: false,
            modal: true,
            minWidth: 390,
            minHeight: 360,
            open: function (event, ui) {
                openDialog($(this));
                $("#TxtFrom_DateSch").datepicker("enable");
            },
            close: function (event, ui) { $('.positionHelper').hide(); },
            drag: function (event, ui) {
                $('.positionHelper').css("left", $('#hierarchybreadcrumb_pram').offset().left + 'px');
                $('.positionHelper').css("top", $('#hierarchybreadcrumb_pram').offset().top + 'px');
            },
            dragStop: function (event, ui) {
                $('.positionHelper').css("left", $('#hierarchybreadcrumb_pram').offset().left + 'px');
                $('.positionHelper').css("top", $('#hierarchybreadcrumb_pram').offset().top + 'px');
            }
        });
        if (showDialog) $('#' + DlgIdSch).dialog("open");
    }
    else {
        $('#' + DlgIdSch).append('<div class="wait tempWaitSch" style="margin: 5px auto;"></div>');
        $('#' + DlgIdSch).find('.box').hide();
        $('#ui-dialog-title-' + DlgIdSch).text(dialogTitle); 
        if (showDialog) $('#' + DlgIdSch).dialog("open");
    }

    if (!showDialog) ScheduleInfo.DlgMode = 0;
    if (ScheduleInfo.DlgMode == 0) {
        if (enableMask) $(divList).mask("Loading ...");
        var e = {};
        e.domain = domain;
        e.user_code = user_code;
        e.codeDU = codeDU;
        e.code = code;
        e.mode = sch_type;
        e.r = $('#HFRnd').val();
        e.getUc = getUc;
        ClientSch.get_UC_Schedule(e, function (c) {
            $(divList).unmask();
            if (c.d[0] != 0) {
                ScheduleInfo.type = sch_type; ScheduleInfo.code = code; ScheduleInfo.domain = domain;
                ScheduleInfo.divList = divList; ScheduleInfo.user_code = user_code; ScheduleInfo.DlgMode = DlgMode;
                ScheduleInfo.data = c.d[2];
                if (getUc) {
                    $('#' + DlgIdSch).html(c.d[1]);
                    dateParam = eval("(" + $('#HFdateParam').val() + ")");
                    BuildDialog_Sch()
                }
                initialDialogSch();

                $('#' + DlgIdSch).find('.box').fadeIn();
                if (!showDialog) { ScheduleInfo.DlgMode = 1; bindScheduleData(); }
            }
            else {
                alert(c.d[2]);
            }
            $('.tempWaitSch').remove();
        });

    }
    else if (ScheduleInfo.DlgMode == 1) {
        $('.tempWaitSch').remove();
        $('#' + DlgIdSch).find('.box').fadeIn();
        ScheduleInfo.type = sch_type; ScheduleInfo.code = code; ScheduleInfo.domain = domain;
        ScheduleInfo.divList = divList; ScheduleInfo.user_code = user_code; ScheduleInfo.DlgMode = DlgMode;
        initialDialogSch();
    }
}

//===============================================

var SchDateTime = { hour: '', min: '' };

function BuildDialog_Sch() {

    $('.SchMoreSt').hide();

    $('#hierarchybreadcrumb_pram').menuA({
        content: $('#hierarchybreadcrumb_pram').next().html(),
        backLink: false
    });

    SchDateTime = { hour: dateParam.HH, min: dateParam.mm };

    $('#TxtSchDate_sp_julian').datepicker({ regional: '', dateFormat: 'mm/dd/yy' });
    $('#TxtSchDate_sp_julian').datepicker('option', 'minDate', $('#HFcurDate_julian').val());
    $("#TxtSchDate_sp_solar").datepicker();
    $("#TxtSchDate_sp_solar").datepicker("option", "minDate", $('#HFcurDate_solar').val());
    if (lanqSch == 'en') {
        $('#TxtFrom_DateSch').datepicker({
            regional: '', dateFormat: 'mm/dd/yy',
            onSelect: function (dateText, inst) {
                var the_date = $.datepicker.parseDate('mm/dd/yy', dateText);
                $('#TxtEndOnSch').datepicker('option', 'minDate', the_date);
            }
        });
        $('#TxtFrom_DateSch').datepicker('option', 'minDate', $('#HFcurDate').val());
        $('#TxtEndOnSch').datepicker({ regional: '', dateFormat: 'mm/dd/yy' });
        $('#TxtEndOnSch').datepicker('option', 'minDate', $('#HFcurDate').val());
    }
    else {
        $("#TxtFrom_DateSch").datepicker({
            onSelect: function (selectedDate) {
                $("#TxtEndOnSch").datepicker("option", "minDate", selectedDate);
            }
        });
        $("#TxtFrom_DateSch").datepicker("option", "minDate", $('#HFcurDate').val());
        $('#TxtEndOnSch').datepicker();
        $("#TxtEndOnSch").datepicker("option", "minDate", $('#HFcurDate').val());
    }
    $('p.ui-widget-content').hover(function () { $(this).addClass('ui-state-hover'); }, function () { $(this).removeClass('ui-state-hover'); });
    $('#TxtSchDate_sp_julian').val($('#HFcurDate_julian').val());
    $("#TxtSchDate_sp_solar").val($('#HFcurDate_solar').val());
    //============

    if ($('#DrdSchForms').find('option').length != 0) getFieldForm_Sch(ScheduleInfo.domain, $('#DrdSchForms').find('option:first').val(), 0);

    $('#DrdReapeatEvery,#DrdSchMount,#DrdSchYear,#DrdSchTedadForm,#DrdSchTedadParametr').html(function () {
        var result = "";
        for (i = 1; i <= 30; i++)
            result += '<option value="' + i + '">' + i + '</option>';
        return result;
    });
    $('#DrdHour_StartSch').html(function () {
        var result = "";
        for (i = 0; i <= 23; i++) {
            var StrI = (((i).toString().length == 1) ? "0" + i : i);
            result += '<option ' + ((SchDateTime.hour == StrI) ? 'selected="selected"' : '') + ' value="' + StrI + '">' + StrI + '</option>';
        }
        return result;
    });
    $('#DrdMin_StartSch').html(function () {
        var result = "";
        var curMin = 5;
        if (parseFloat(SchDateTime.min) > 5) curMin = Math.ceil(parseFloat(SchDateTime.min) / 5) * 5;
        for (i = 0; i < 60; i = i + 5) {
            var StrI = (((i).toString().length == 1) ? "0" + i : i);
            result += '<option ' + ((curMin == StrI) ? 'selected="selected"' : '') + ' value="' + StrI + '">' + StrI + '</option>';
        }
        return result;
    });
    var curDayOfMount = dateParam.dd;
    $('#DrdSchMount,#DrdSchYear').val(curDayOfMount).attr('selected', 'selected');

    $('#DrdSchMountYear,#DrdSchYear_Mount').html(function () {
        var CurMount = dateParam.MM2; 
        var result = "";
        for (i = 0; i <= MountStr.length - 1; i++) {
            result += '<option ' + ((i == CurMount - 1) ? 'selected="selected"' : '') + ' value="' + (i + 1) + '">' + MountStr[i] + '</option>';
        }
        return result;
    });
    $('.DivRep_week table tr').html(function () {
        var curDay = dateParam.ddd;
        var result = "";
        for (i = 0; i <= dayStr_ddd[lanqSch].length - 1; i++) {
            result += '<td><input item="' + i + '" type="checkbox" ' + ((i == curDay) ? 'checked="checked"' : '') + ' id="ChkSch_' + dayStr_ddd.en[i] + '" value="' + dayStr_ddd.en[i] + '" /><label for="ChkSch_' + dayStr_ddd.en[i] + '">' + dayStr_ddd[lanqSch][i] + '</label></td>';
        }
        return result;
    });
    $('#DrdSchMount_Week,#DrdSchYear_Week').html(function () {
        var curDay = dateParam.ddd;
        var result = "";
        for (i = 0; i <= WeekStr.length - 1; i++) {
            result += '<option ' + ((i == curDay) ? 'selected' : '') + ' value="' + i + '">' + WeekStr[i] + '</option>';
        }
        return result;
    });
    $('#DrdSchYear_Day,#DrdSchMount_Day').html(function () {
        var result = "";
        for (i = 0; i <= dayOminStr.length - 1; i++)
            result += '<option value="' + (i + 1) + '">' + dayOminStr[i] + '</option>';
        return result;
    });
    $(".mydds").msDropDown().data("dd");
    $('input:submit').button();
    $('#TxtFrom_DateSch').val($('#HFcurDate').val());

    $('#DrdRepeatsSch').change(function () {
        setTimeout('drdRepeatMode(0)', 200);
    });

    $('#DrdSchForms').change(function () {
        window.setTimeout("getFieldForm_Sch('" + ScheduleInfo.domain + "','" + $(this).val() + "', 0)", 200);
    });
    $('#DrdSchNext_Prev').change(function () {
        if ($(this).val() == "-") $('#LblSchNext_Prev').html(SchRes.cap_day + " " + SchRes.cap_before);
        if ($(this).val() == "") $('#LblSchNext_Prev').html(SchRes.cap_day + " " + SchRes.cap_after);
    });
    $('#DrdSchNext_Prev_Parametr').change(function () {
        if ($(this).val() == "-") $('#LblSchNext_Prev_parametr').html(SchRes.cap_day + " " + SchRes.cap_before);
        if ($(this).val() == "") $('#LblSchNext_Prev_parametr').html(SchRes.cap_day + " " + SchRes.cap_after);
    });
    $('#RadTime_repeat_TypeSch').click(function () {
        if ($(this).attr('checked')) {
            $('.SchMoreSt').show();
            $('#LblCapDateSch').text(SchRes.cap_date_from);
            drdRepeatMode($('#DrdRepeatsSch').val());
        } else {
            $('.SchMoreSt').hide();
            $('#LblCapDateSch').text(SchRes.cap_date);
            $('#TxtFrom_DateSch').show();
        }
    });
    $('#ChkMonthDay_Parametr').click(function () {
        if ($(this).attr('checked')) $('#ChkShamsi_Parametr,label:[for=ChkShamsi_Parametr]').show(); else $('#ChkShamsi_Parametr,label:[for=ChkShamsi_Parametr]').hide();
    });
    $('.btnCancelSch').click(function () {
        $('#' + DlgIdSch).dialog('close');
    });
    $('#btnListSch').click(function () {
        $('#Div_Sch_Insert').hide();
        $('#Div_Sch_List').fadeIn();
    });
    $('#btnNewSch').click(function () {
        $('#Div_Sch_Insert').fadeIn();
        $('#Div_Sch_List').hide();
        clearPageSch();
        ScheduleInfo.tempID = 0;
    });
    $('#btnDoneSch,#btnUpdateSch').click(function () {
        var e = {};
        e.e = ScheduleInfo.domain;
        var o = {};
        o.id = 0;
        if (ScheduleInfo.tempID != 0 && ScheduleInfo.DlgMode == 0) o.id = ScheduleInfo.tempID;
        o.mode = ScheduleInfo.type;
        o.code = ScheduleInfo.code;
        o.active = 1;
        o.owner = ScheduleInfo.user_code;
        o.date_start = $('#TxtFrom_DateSch').val();
        o.time_start = $('#DrdHour_StartSch').val() + ":" + $('#DrdMin_StartSch').val();
        o.dateType = 0;
        o.calendar = lanqSch;
        if ($('#RadTime_repeat_TypeSch').attr('checked')) {
            var dateTypeStr = $('#DrdRepeatsSch').val();
            o.dateType = dateTypeStr;
            if (dateTypeStr == DateTypeSch.day || dateTypeStr == DateTypeSch.week || dateTypeStr == DateTypeSch.mount || dateTypeStr == DateTypeSch.mount2 || dateTypeStr == DateTypeSch.year || dateTypeStr == DateTypeSch.year2) {
                o.repeatEvery = $('#DrdReapeatEvery').val();
                o.endMode = $('[name=RadTypeEnd]:checked').val();
                o.date_end = "";
                if (o.endMode == 1) {
                    o.date_end = $('#TxtEndAfterSch').val();
                    if (!checkDigitSch('#TxtEndAfterSch')) { alert(SchRes.cap_end_date); return false; }
                } else if (o.endMode == 2) {
                    o.date_end = $('#TxtEndOnSch').val();
                    if (o.date_end == "") { alert(SchRes.cap_end_date); return false; }
                }
                if (dateTypeStr == DateTypeSch.week) {
                    var WeekSch = new Array();
                    $('.DivRep_week table input[type=checkbox]').each(function () {
                        if ($(this).attr('checked')) WeekSch.push($(this).attr('item'));
                    });
                    o.week = WeekSch.join(",");
                }
                if (dateTypeStr == DateTypeSch.mount) {
                    var mode = $('[name=RadFirstModeMount]:checked').val();
                    if (mode == "0") {
                        o.day = $('#DrdSchMount').val();
                    }
                    else {
                        o.week = $('#DrdSchMount_Week').val();
                        o.day = $('#DrdSchMount_Day').val();
                        o.dateType = DateTypeSch.mount2;
                    }
                }
                if (dateTypeStr == DateTypeSch.year) {
                    var mode = $('[name=RadFirstModeYear]:checked').val();
                    if (mode == "0") {
                        o.day = $('#DrdSchYear').val();
                        o.mount = $('#DrdSchMountYear').val();
                    }
                    else {
                        o.day = $('#DrdSchYear_Day').val();
                        o.week = $('#DrdSchYear_Week').val();
                        o.mount = $('#DrdSchYear_Mount').val();
                        o.dateType = DateTypeSch.year2;
                    }
                }
            }
            if (dateTypeStr == DateTypeSch.date) {
                o.date_start = $('#TxtSchDate_sp_julian').val();
            }
            if (dateTypeStr == DateTypeSch.form) {
                var dayAddOrSub = 0;
                if (!$('#ChkSchoFormCurDate').attr('checked')) dayAddOrSub = $('#DrdSchNext_Prev').val() + $('#DrdSchTedadForm').val();
                o.day = $('#DrdSchForms').val() + "." + $('#DrdSchFieldForm').val() + '.' + dayAddOrSub + '.' + (($('#ChkMonthDay_Form').attr('checked')) ? '1' : '0');
            }
            if (dateTypeStr == DateTypeSch.parametr) {//5800
                if ($('#DrdSchFieldParametr').val() == "" || $('#DrdSchFieldParametr').val() == null) { alert(SchRes.cap_parameter_name); return false; }
                var dayAddOrSub = 0;
                if (!$('#ChkSchoParametrCurDate').attr('checked')) dayAddOrSub = $('#DrdSchNext_Prev_Parametr').val() + $('#DrdSchTedadParametr').val();
                o.day = $('#DrdSchFieldParametr').attr('group_code') + "." + $('#DrdSchFieldParametr').val() + '.' + dayAddOrSub + '.' + (($('#ChkMonthDay_Parametr').attr('checked')) ? '1' : '0') + '.' + (($('#ChkShamsi_Parametr').attr('checked')) ? '1' : '0');
            }
        }
        e.o = o;

        if (ScheduleInfo.DlgMode == 0) {
            $('#Div_Sch_Insert').mask('saving')
            ClientSch.Insetr_Schedule(e, function (c) {
                $('#Div_Sch_Insert').unmask();
                ResultSchedule(c.d);
                if (c.d == "error") return false;
                ScheduleInfo.tempID = 0;
                if (o.id != 0) {//update List
                    var indexData = -1;
                    for (j = 0; j <= ScheduleInfo.data.length - 1; j++)
                        if (ScheduleInfo.data[j].id == o.id) { indexData = j; break; }
                    if (indexData != -1) ScheduleInfo.data.splice(indexData, 1);
                    ScheduleInfo.data.push(c.d);
                }
                else {
                    ScheduleInfo.data.push(c.d);
                }
                initialDialogSch();
            });
        } else if (ScheduleInfo.DlgMode == 1) {
            if (ScheduleInfo.tempID != 0) {//update List
                var indexData = -1;
                for (j = 0; j <= ScheduleInfo.data.length - 1; j++)
                    if (ScheduleInfo.data[j].trItem == ScheduleInfo.tempID) { indexData = j; break; }
                o.trItem = ScheduleInfo.tempID;
                if (indexData != -1) ScheduleInfo.data[indexData] = (o);
                ScheduleInfo.tempID = 0;
            }
            else {
                ScheduleInfo.data.push(o);
            }
            ResultSchedule(o);
            bindScheduleData();
            $('#' + DlgIdSch).dialog("close");
        }

    });

    $('[name=RadFirstModeMount]').change(function () {
        if ($(this).val() == 0) {
            $('#DrdSchMount_Day,#DrdSchMount_Week').attr('disabled', 'disabled');
            $('#DrdSchMount').attr('disabled', '');
            $('#LblSchMountOmin').css('color', '');
        }
        else {
            $('#DrdSchMount').attr('disabled', 'disabled');
            $('#LblSchMountOmin').css('color', '#ddd');
            $('#DrdSchMount_Day,#DrdSchMount_Week').attr('disabled', '');
        }
        $(".mydds").msDropDown().data("dd");
    });
    $('[name=RadFirstModeYear]').change(function () {
        if ($(this).val() == 0) {
            $('#DrdSchYear_Week,#DrdSchYear_Day,#DrdSchYear_Mount').attr('disabled', 'disabled');
            $('#DrdSchMountYear,#DrdSchYear').attr('disabled', '');
            $('#LblYearOmin').css('color', '');
        }
        else {
            $('#DrdSchYear_Week,#DrdSchYear_Day,#DrdSchYear_Mount').attr('disabled', '');
            $('#DrdSchMountYear,#DrdSchYear').attr('disabled', 'disabled');
            $('#LblYearOmin').css('color', '#ddd');
        }
        $(".mydds").msDropDown().data("dd");
    });

    $('#ChkSchoFormCurDate').change(function () {
        if ($(this).attr('checked')) {
            $('#DrdSchTedadForm,#DrdSchNext_Prev').attr('disabled', 'disabled');
            $('#LblSchNext_Prev').css('color', '#ccc');
        }
        else {
            $('#DrdSchTedadForm,#DrdSchNext_Prev').attr('disabled', '');
            $('#LblSchNext_Prev').css('color', '#000');
        }
        $(".mydds").msDropDown().data("dd");
    });
    $('#ChkSchoParametrCurDate').change(function () {
        if ($(this).attr('checked')) {
            $('#DrdSchTedadParametr,#DrdSchNext_Prev_Parametr').attr('disabled', 'disabled');
            $('#LblSchNext_Prev_parametr').css('color', '#ccc');
        }
        else {
            $('#DrdSchTedadParametr,#DrdSchNext_Prev_Parametr').attr('disabled', '');
            $('#LblSchNext_Prev_parametr').css('color', '#000');
        }
        $(".mydds").msDropDown().data("dd");
    });
}


function setSchToHF(hfname) {
    $(hfname).val(JSON.stringify(ScheduleInfo.data));
}

function getActiveStr(intActive) {
    switch (intActive) {
        case 0: return SchRes.cap_end_task;
        case 1: return SchRes.cap_Runing;
        case 2: return SchRes.cap_stop;
        default: return "";
    }
}

function ResultSchedule(result) { }
function bindScheduleData() {
    $(ScheduleInfo.divList).empty();

    var tbl = $('<table id="TblSchList" width="100%"></table>');
    var tblHead = $('<tr></tr>');
    tblHead.append('<th>' + SchRes.cap_title + '</th>');
    tblHead.append('<th class="center" width="100">' + SchRes.cap_date_start + '</th>');
    tblHead.append('<th class="center" width="100">' + SchRes.cap_owner+ '</th>');
    tblHead.append('<th class="center" width="50">' + SchRes.cap_status + '</th>');
    tblHead.append('<th class="center" width="70">' + SchRes.cap_actions + '</th>');
    tbl.append(tblHead);

    for (i = 0; i <= ScheduleInfo.data.length - 1; i++) {
        var item = ScheduleInfo.data[i];
        ScheduleInfo.data[i].trItem = (i + 1);
        var tblrow = $('<tr item="' + item.trItem + '"></tr>');
        tblrow.append('<td>' + SchRes.cap_schedule + ' ' + item.trItem + '</td>');
        tblrow.append('<td>' + item.date_start + ' - ' + item.time_start + '</td>');
        tblrow.append('<td>' + item.owner + '</td>');
        tblrow.append('<td id="SchActiveStr">' + getActiveStr(parseInt(item.active)) + '</td>');
        tblrow.append('<td id="TdSchEdit"></td>');
        if (item.active == "0") {
            tblrow.find("#TdSchEdit").append('<span class="ui-icon ui-icon-stop left_right" style="margin-top: 4px;" title="Stop"></span>');
        }
        else {
            tblrow.find("#TdSchEdit").append('<span id="PlyTblSch" value="1" style="display: none;margin-top: 4px;font-size: 11px;padding: 0 5px 0 5px;" class="cursor ui-icon ui-icon-play left_right" title="Run"></span>');
            tblrow.find("#TdSchEdit").append('<span id="PlyTblSch" value="2" style="display: none;margin-top: 4px;font-size: 11px;padding: 0 5px 0 5px;" class="cursor ui-icon ui-icon-pause left_right" title="pause"></span>');
            if (item.active == 1) tblrow.find("#TdSchEdit").find('#PlyTblSch:[value=2]').show();
            if (item.active == 2) tblrow.find("#TdSchEdit").find('#PlyTblSch:[value=1]').show();
        }
        tblrow.find("#TdSchEdit").append('<span id="delTblSch" style="display:inline-block;margin-top: 4px;font-size: 12px;padding: 0 5px 0 5px;" class="cursor ui-icon ui-icon-closethick left_right" title="Delete"></span>');
        tblrow.find("#TdSchEdit").append('<span id="editTblSch" style="display:inline-block;margin-top: 4px;font-size: 12px;padding: 0 0px 0 5px;" class="cursor ui-icon ui-icon-pencil left_right" title="Edit"></span>');
        tbl.append(tblrow);
    }
    tbl.find('tr:even').addClass('alternate');
    $(ScheduleInfo.divList).append(tbl);
}

$(function () {

    $('#delTblSch').live('click', function () {
        if (!confirm(SchRes.cap_question_delete)) return false;
        if (ScheduleInfo.DlgMode == 0) {
            var parentDiv = $(this).parents('div:first');
            parentDiv.fadeOut();
            var e = { e: ScheduleInfo.domain, j: parentDiv.attr('item') };
            ClientSch.delete_Schedule(e, function (c) {
                if (c.d != "error") {
                    parentDiv.remove();
                    var indexData = -1;
                    for (j = 0; j <= ScheduleInfo.data.length - 1; j++)
                        if (ScheduleInfo.data[j].id == e.j) { indexData = j; break; }
                    if (indexData != -1) ScheduleInfo.data.splice(indexData, 1);
                }
                else
                    parentDiv.show();
            });
        } else if (ScheduleInfo.DlgMode == 1) {
            var parentDiv = $(this).parents('tr:first');
            parentDiv.fadeOut(function () { $(this).remove() });
            var indexData = -1;
            for (j = 0; j <= ScheduleInfo.data.length - 1; j++)
                if (ScheduleInfo.data[j].trItem == parentDiv.attr('item')) { indexData = j; break; }
            if (indexData != -1) ScheduleInfo.data.splice(indexData, 1);
        }
    });
    $('#PlyTblSch').live('click', function () {
        if (ScheduleInfo.DlgMode == 0) {
            var parentDiv = $(this).parents('div:first');
            var e = { e: ScheduleInfo.domain, j: parentDiv.attr('item'), z: $(this).attr('value') };
            parentDiv.find('[id=PlyTblSch]').css('visibility', 'hidden');
            ClientSch.changeActive(e, function (c) {
                if (c.d != "error")
                    parentDiv.find('#SchActiveStr').text(c.d);
                parentDiv.find('[id=PlyTblSch]').css('visibility', '').hide();
                if (e.z == 1) parentDiv.find('#PlyTblSch:[value=2]').show();
                if (e.z == 2) parentDiv.find('#PlyTblSch:[value=1]').show();
            });
        } else if (ScheduleInfo.DlgMode == 1) {
            parentDiv = $(this).parents('tr:first');
            parentDiv.find('[id=PlyTblSch]').css('visibility', '').hide();
            var thisVal = $(this).attr('value');
            if (thisVal == 1) parentDiv.find('#PlyTblSch:[value=2]').show();
            if (thisVal == 2) parentDiv.find('#PlyTblSch:[value=1]').show();
            parentDiv.find('#SchActiveStr').text(getActiveStr(parseInt(thisVal)));
            var item = getSchBy_trItem(parentDiv.attr('item'));
            if (item == null) return false;
            if (item.id != 0) {
                var e = { e: ScheduleInfo.domain, j: item.id, z: $(this).attr('value') };
                ClientSch.changeActive(e, function (c) { });
            }
            else {
                var indexData = -1;
                item.active = $(this).attr('value');
                for (j = 0; j <= ScheduleInfo.data.length - 1; j++)
                    if (ScheduleInfo.data[j].trItem == parentDiv.attr('item')) { indexData = j; break; }
                if (indexData != -1) ScheduleInfo.data[indexData] = item;
            }
        }
    });
    $('#editTblSch').live('click', function () {
        var parentDiv = $(this).parents('div:first');
        if (ScheduleInfo.DlgMode == 1) parentDiv = $(this).parents('tr:first');
        var d = {};

        if (ScheduleInfo.DlgMode == 0) {
            d = getSchBy_id(parentDiv.attr('item'));
            if (d == null) return false;
            ScheduleInfo.tempID = d.id;
        }
        else if (ScheduleInfo.DlgMode == 1) {
            d = getSchBy_trItem(parentDiv.attr('item'));
            if (d == null) return false;
            ScheduleInfo.tempID = d.trItem;
            $("#TxtFrom_DateSch").datepicker("disable");
            $('#' + DlgIdSch).dialog("open");
        }

        $('#Div_Sch_List').hide();
        $('#Div_Sch_Insert').fadeIn();
        clearPageSch();

        $('#btnUpdateSch').show();
        $('#btnDoneSch').hide();
        if (d.date_start != "") $('#TxtFrom_DateSch').val(d.date_start);
        if (d.time_start != "") {
            $('#DrdHour_StartSch').val(d.time_start.slice(0, 2)).attr('selected', 'selected');
            $('#DrdMin_StartSch').val(d.time_start.slice(3, 5)).attr('selected', 'selected');
        }

        if (d.dateType != 0) {
            $('#RadTime_repeat_TypeSch').attr('checked', 'checked');
            $('#DrdRepeatsSch').val(d.dateType).attr('selected', 'selected');
            $('.SchMoreSt').show();
            drdRepeatMode(d.dateType);
            if (d.dateType == DateTypeSch.day || d.dateType == DateTypeSch.week || d.dateType == DateTypeSch.mount || d.dateType == DateTypeSch.mount2 || d.dateType == DateTypeSch.year || d.dateType == DateTypeSch.year2) {
                $('#DrdReapeatEvery').val(d.repeatEvery).attr('selected', 'selected');
                $('[name=RadTypeEnd]:[value=' + d.endMode + ']').attr('checked', 'checked');
                if (d.endMode == 1)
                    $('#TxtEndAfterSch').val(d.date_end);
                else if (d.endMode == 2)
                    $('#TxtEndOnSch').val(d.date_end);

                if (d.dateType == DateTypeSch.week) {
                    $('.DivRep_week table input[type=checkbox]').attr('checked', '');
                    var WeekSch = d.week.split(",");
                    for (w = 0; w <= WeekSch.length - 1; w++)
                        $('.DivRep_week table input[type=checkbox]:[item=\'' + WeekSch[w] + '\']').attr('checked', 'checked');
                }
                if (d.dateType == DateTypeSch.mount) {
                    $('#DrdSchMount').val(d.day).attr('selected', 'selected').attr('disabled', '');
                    $('[name=RadFirstModeMount]:[value=0]').attr('checked', 'checked');
                    $('#LblSchMountOmin').css('color', '');
                    $('#DrdSchMount_Day,#DrdSchMount_Week').attr('disabled', 'disabled');
                }
                if (d.dateType == DateTypeSch.mount2) {
                    $('#DrdSchMount_Day').val(d.day).attr('selected', 'selected').attr('disabled', '');
                    $('#DrdSchMount_Week').val(d.week).attr('selected', 'selected').attr('disabled', '');
                    $('[name=RadFirstModeMount]:[value=1]').attr('checked', 'checked');
                    $('#DrdSchMount').attr('disabled', 'disabled');
                    $('#LblSchMountOmin').css('color', '#ddd');
                    $('#DrdRepeatsSch').val(DateTypeSch.mount).attr('selected', 'selected');
                }
                if (d.dateType == DateTypeSch.year) {
                    $('#DrdSchYear').val(d.day).attr('selected', 'selected').attr('disabled', '');
                    $('#DrdSchMountYear').val(d.mount).attr('selected', 'selected').attr('disabled', '');
                    $('[name=RadFirstModeYear]:[value=0]').attr('checked', 'checked');
                    $('#DrdSchYear_Day,#DrdSchYear_Mount,#DrdSchYear_Week').attr('disabled', 'disabled');
                    $('#LblYearOmin').css('color', '');
                }
                if (d.dateType == DateTypeSch.year2) {
                    $('#DrdSchYear_Day').val(d.day).attr('selected', 'selected').attr('disabled', '');
                    $('#DrdSchYear_Mount').val(d.mount).attr('selected', 'selected').attr('disabled', '');
                    $('#DrdSchYear_Week').val(d.week).attr('selected', 'selected').attr('disabled', '');
                    $('[name=RadFirstModeYear]:[value=1]').attr('checked', 'checked');
                    $('#DrdSchYear,#DrdSchMountYear').attr('disabled', 'disabled');
                    $('#LblYearOmin').css('color', '#ddd');
                    $('#DrdRepeatsSch').val(DateTypeSch.year).attr('selected', 'selected');
                }
            }
            if (d.dateType == DateTypeSch.date) {
                $('#TxtSchDate_sp_julian').val(d.date_start);
                miladi_to_shamsi(d.date_start);
            }
            if (d.dateType == DateTypeSch.form) {
                var formInfo = d.day.split("."); var form = formInfo[0]; var field = formInfo[1]; var next_prev = (parseInt(formInfo[2]) < 0) ? '-' : ''; var TedadForm = formInfo[2].replace('-', ''); var dayMonth = formInfo[3];
                $('#DrdSchForms').val(form).attr('selected', 'selected');
                getFieldForm_Sch(ScheduleInfo.domain, form, field);
                if (dayMonth == "1") $('#ChkMonthDay_Form').attr('checked', 'checked');
                if (TedadForm == "0") {
                    $('#DrdSchTedadForm,#DrdSchNext_Prev').attr('disabled', 'disabled');
                    $('#LblSchNext_Prev').css('color', '#ccc');
                    $('#ChkSchoFormCurDate').attr('checked', 'checked');
                } else {
                    $('#DrdSchNext_Prev').val(next_prev).attr('selected', 'selected');
                    $('#DrdSchTedadForm').val(TedadForm).attr('selected', 'selected');
                    if (next_prev == "-") $('#LblSchNext_Prev').html(SchRes.cap_day + " " + SchRes.cap_before);
                    if (next_prev == "") $('#LblSchNext_Prev').html(SchRes.cap_day + " " + SchRes.cap_after);
                }
            }
            if (d.dateType == DateTypeSch.parametr) {
                var ParametrInfo = d.day.split("."); var Group = ParametrInfo[0]; var field = ParametrInfo[1]; var next_prev = (parseInt(ParametrInfo[2]) < 0) ? '-' : ''; var TedadParametr = ParametrInfo[2].replace('-', ''); var dayMonth = ParametrInfo[3]; var dateShamsi = ParametrInfo[4];
                SelectGroup_Parametr(Group, "", field);
                if (dayMonth == "1") {
                    $('#ChkMonthDay_Parametr').attr('checked', 'checked');
                    $('#ChkShamsi_Parametr,label:[for=ChkShamsi_Parametr]').show();
                    if (dateShamsi == "1") $('#ChkShamsi_Parametr').attr('checked', 'checked');
                }
                if (TedadParametr == "0") {
                    $('#DrdSchTedadParametr,#DrdSchNext_Prev_Parametr').attr('disabled', 'disabled');
                    $('#LblSchNext_Prev_parametr').css('color', '#ccc');
                    $('#ChkSchoParametrCurDate').attr('checked', 'checked');
                } else {
                    $('#DrdSchNext_Prev_Parametr').val(next_prev).attr('selected', 'selected');
                    $('#DrdSchTedadParametr').val(TedadParametr).attr('selected', 'selected');
                    if (next_prev == "-") $('#LblSchNext_Prev_parametr').html(SchRes.cap_day + " " + SchRes.cap_before);
                    if (next_prev == "") $('#LblSchNext_Prev_parametr').html(SchRes.cap_day + " " + SchRes.cap_after);
                }
            }
        }
        $(".mydds").msDropDown().data("dd");
    });
});

function getSchBy_trItem(trItem) {
    for (s = 0; s <= ScheduleInfo.data.length - 1; s++) {
        var item = ScheduleInfo.data[s];
        if (item.trItem == trItem) return item;
    }
    return null;
}

function getSchBy_id(id) {
    for (s = 0; s <= ScheduleInfo.data.length - 1; s++) {
        var item = ScheduleInfo.data[s];
        if (item.id == id) return item;
    }
    return null;
}

function clearPageSch() {
    $('#TxtEndOnSch').val('');
    $('#TxtFrom_DateSch').val($('#HFcurDate').val());
    $('#TxtEndAfterSch').val('1');
    $('#RadTime_repeat_TypeSch').attr('checked', '');
    $('.drdSchTime').css('visibility', '').show();
    $('[name=RadTypeEnd]:[value=0]').attr('checked', 'checked');
    $('#DrdRepeatsSch').find('option:first').attr('selected', 'selected');
    $('.SchMoreSt').show();
    drdRepeatMode($('#DrdRepeatsSch').find('option:first').val());
    if (ScheduleInfo.type == TSchedule.email_template || ScheduleInfo.type == TSchedule.sms_template || ScheduleInfo.type == TSchedule.tcustomer) {//agar dar mode sms,email templaate shod
        if (ScheduleInfo.type == TSchedule.tcustomer) {
            $('#DrdRepeatsSch').find('option:[value=' + DateTypeSch.form + ']').attr('selected', 'selected');
            drdRepeatMode(DateTypeSch.form);
        }
        $('#LblCapDateSch').text(SchRes.cap_time);
    }
    else {
        $('.SchMoreSt').hide();
        $('#LblCapDateSch').text(SchRes.cap_date);
    }
    $('#btnUpdateSch').hide();
    $('#btnDoneSch').show();

    $('#DrdSchTedadForm,#DrdSchNext_Prev,#DrdSchTedadParametr,#DrdSchNext_Prev_Parametr').attr('disabled', '');
    $('#LblSchNext_Prev,#LblSchNext_Prev_parametr').css('color', '#000');
    $('#ChkSchoFormCurDate,#ChkSchoParametrCurDate,#ChkMonthDay_Parametr,#ChkMonthDay_Form,#ChkShamsi_Parametr').attr('checked', '');
    $('#ChkShamsi_Parametr,label:[for=ChkShamsi_Parametr]').hide();

    $('#' + LblCustName).text(SchRes.cap_select_links);
    
    $(".mydds").msDropDown().data("dd");
}
function initialDialogSch() {
    clearPageSch();
    ScheduleInfo.tempID = 0;
    if (ScheduleInfo.DlgMode == 0) {
        if (ScheduleInfo.data.length == 0) {
            $('#Div_Sch_Insert').fadeIn();
            $('#Div_Sch_List').hide();
            $('.SelList_Sch').empty();
        }
        else {
            $('#Div_Sch_Insert').hide();
            $('#Div_Sch_List').fadeIn();
            $('.SelList_Sch').empty();

            for (i = 0; i <= ScheduleInfo.data.length - 1; i++) {
                var item = ScheduleInfo.data[i];
                var MgDiv = $("<div item='" + item.id + "'></div>");
                MgDiv.append('<span class="right_left">' + SchRes.cap_schedule + ' ' + item.id + '</span>');
                MgDiv.append('<span class="right_left" style="margin: 0 20px;" >' + item.date_start + ' - ' + item.time_start + '</span>');
                MgDiv.append('<span class="right_left" id="SchActiveStr">' + item.activeStr + '</span>');
                if (item.active == "0") {
                    MgDiv.append('<span class="ui-icon ui-icon-stop left_right" style="margin-top: 4px;" title="Stop"></span>');
                }
                else {
                    MgDiv.append('<span id="PlyTblSch" value="1" style="display: none;margin-top: 4px;font-size: 12px;" class="cursor ui-icon ui-icon-play left_right" title="Run"></span>');
                    MgDiv.append('<span id="PlyTblSch" value="2" style="display: none;margin-top: 4px;font-size: 12px;" class="cursor ui-icon ui-icon-pause left_right" title="pause"></span>');
                    if (item.active == 1) MgDiv.find('#PlyTblSch:[value=2]').show();
                    if (item.active == 2) MgDiv.find('#PlyTblSch:[value=1]').show();
                }
                MgDiv.append('<span id="delTblSch" style="display:inline-block;margin-top: 4px;font-size: 12px;" class="cursor ui-icon ui-icon-closethick left_right" title="Delete"></span>');
                MgDiv.append('<span id="editTblSch" style="display:inline-block;margin-top: 4px;font-size: 12px;" class="cursor ui-icon ui-icon-pencil left_right" title="Edit"></span>');
                $('.SelList_Sch').append(MgDiv);
            }
        }
    }
    else if (ScheduleInfo.DlgMode == 1) {
        $('#Div_Sch_Insert').fadeIn();
        $('#Div_Sch_List').hide();
        $('.SelList_Sch').empty();
        $('#btnListSch').hide();
    }
}

function getFieldForm_Sch(e, j, s) {
    var e = { e: e, j: j };
    $('.waitGetfieldSchForm').remove();
    $('#SchFormLoadPlace').append('<div class="waitGetfieldSchForm"><div class="wait right_left" style="margin: 0 3px;"></div>' + SchRes.loading + '</div>');
    ClientSch.getField_Form(e, function (c) {
        $('#DrdSchFieldForm').empty();
        for (i = 0; i <= c.d.length - 1; i++) {
            var item = c.d[i];
            if (s != 0 && item[0] == s)
                $('#DrdSchFieldForm').append('<option selected="selected" value="' + item[0] + '">' + item[1] + '</option>');
            else
                $('#DrdSchFieldForm').append('<option value="' + item[0] + '">' + item[1] + '</option>');
        }
        $('.waitGetfieldSchForm').remove();
        $(".mydds").msDropDown().data("dd");
    });
}
function SelectGroup_Parametr(code, name, other) {
    var e = { e: ScheduleInfo.domain, l4: code, u: ScheduleInfo.user_code };
    if (name == "" && code != "") name = $('#' + lblrtvCustomer_group).find('li a:[code=' + code + ']').text();
    if (code == "") name = SchRes.cap_select_links;
    $('.waitGetfieldSchParametr').remove();
    $('#SchParametrrLoadPlace').append('<div class="waitGetfieldSchParametr"><div class="wait right_left" style="margin: 0 3px;"></div>' + SchRes.loading + '</div>');
    $('#' + LblCustName).text(name);
    $('#DrdSchFieldParametr').attr('group_code', code);
    ClientSch.getCustomer_parametr(e, function (c) {
        $('#DrdSchFieldParametr').empty();
        for (i = 0; i <= c.d.length - 1; i++) {
            var item = c.d[i];
            if (other != 0 && item[0] == other)
                $('#DrdSchFieldParametr').append('<option selected="selected" value="' + item[0] + '">' + item[1] + '</option>');
            else
                $('#DrdSchFieldParametr').append('<option value="' + item[0] + '">' + item[1] + '</option>');
        }
        $('.waitGetfieldSchParametr').remove();
        $(".mydds").msDropDown().data("dd");
    });
}
function drdRepeatMode(drdVal) {
    if (drdVal == 0) drdVal = $('#DrdRepeatsSch').val();
    var lblText = "";
    $('#TxtFrom_DateSch,.divAllSchField').show();
    $('#LblCapDateSch').text(SchRes.cap_date_from);
    switch (parseInt(drdVal)) {
        case DateTypeSch.day: lblText = SchRes.cap_day; break;
        case DateTypeSch.week: lblText = SchRes.cap_week; break;
        case DateTypeSch.mount: lblText = SchRes.cap_month; break;
        case DateTypeSch.mount2: drdVal = DateTypeSch.mount; lblText = SchRes.cap_month; break;
        case DateTypeSch.year: lblText = SchRes.cap_year; break;
        case DateTypeSch.year2: drdVal = DateTypeSch.year; lblText = SchRes.cap_year; break;
        case DateTypeSch.date:
            $('#TxtFrom_DateSch,.divAllSchField').hide();
            $('.divSchFromDate,.divSchTickMore').show();
            $('#LblCapDateSch').text(SchRes.cap_time);
            break;
        case DateTypeSch.form:
            $('#TxtFrom_DateSch,.divAllSchField').hide();
            $('.divSchFromDate,.divSchTickMore').show();
            $('#LblCapDateSch').text(SchRes.cap_time);
            break;
        case DateTypeSch.parametr:
            $('#TxtFrom_DateSch,.divAllSchField').hide();
            $('.divSchFromDate,.divSchTickMore').show();
            $('#LblCapDateSch').text(SchRes.cap_time);
            break;
    }
    $('#LblRepeatType').text(lblText);
    $('.DivRepeat').hide();
    $('.DivRep_' + DateTypeSch.getStr(parseInt(drdVal))).show();
    $('#DrdReapeatEvery').find('option:first').attr('selected', 'selected');

    $('#DrdRepeatsSch').find("option").css('display', 'block');
    if (ScheduleInfo.type == TSchedule.email_template || ScheduleInfo.type == TSchedule.sms_template) {//agar dar mode sms,email templaate shod 
        $('#RadTime_repeat_TypeSch').attr('checked', 'checked');
        $('#LblCapDateSch').text(SchRes.cap_time);
        $('#TxtFrom_DateSch,.divSchTickMore').hide();
        $('#DrdRepeatsSch').find('option:[value=' + DateTypeSch.form + '],option:[value=' + DateTypeSch.parametr + ']').hide(); //dar in halat form,parametr nadarim 
    }
    if (ScheduleInfo.type == TSchedule.tcustomer) {//agar dar mode tcustomer shod 
        $('#DrdRepeatsSch').find("option").hide();
        $('#RadTime_repeat_TypeSch').attr('checked', 'checked');
        $('#LblCapDateSch').text(SchRes.cap_time);
        $('#TxtFrom_DateSch,.divSchTickMore').hide();
        $('#DrdRepeatsSch').find('option:[value=' + DateTypeSch.form + '],option:[value=' + DateTypeSch.parametr + ']').css('display', 'block'); 
    }

    $(".mydds").msDropDown().data("dd");
}

function miladi_to_shamsi() {
    var e = {}; e.date_str = $('#TxtSchDate_sp_julian').val();
    ClientSch.m_to_sh(e, function (c) { $('#TxtSchDate_sp_solar').val(c.d); });
}
function shamsi_to_miladi() {
    var e = {}; e.date_str = $('#TxtSchDate_sp_solar').val();
    ClientSch.sh_to_m(e, function (c) { $('#TxtSchDate_sp_julian').val(c.d); });
}

function checkDigitSch(inputName) {
    var result = true
    var regex = /[0-9]|\./;
    if (!regex.test($(inputName).val())) {
        result = false;
    }
    return result;
}


var ClientSch = new GetJsonData;

function GetJsonData() {

    //--------------<<
    this.Insetr_ScheduleUrl = "../WebServices/workflow_.asmx/Insetr_Schedule";
    this.Insetr_Schedule = function (c, e) {
        this.POST(this.Insetr_ScheduleUrl, c, e)
    };
    //--------------<<
    this.getField_FormUrl = "../WebServices/workflow_.asmx/getField_Form";
    this.getField_Form = function (c, e) {
        this.POST(this.getField_FormUrl, c, e)
    };
    //--------------<<
    this.getCustomer_parametrUrl = "../WebServices/workflow_.asmx/getCustomer_parametr";
    this.getCustomer_parametr = function (c, e) {
        this.POST(this.getCustomer_parametrUrl, c, e)
    };
    //--------------<<
    this.delete_ScheduleUrl = "../WebServices/workflow_.asmx/delete_Schedule";
    this.delete_Schedule = function (c, e) {
        this.POST(this.delete_ScheduleUrl, c, e)
    };
    //--------------<<
    this.get_UC_ScheduleUrl = "Load_UserControl.aspx/get_UC_Schedule";
    this.get_UC_Schedule = function (c, e) {
        this.POST(this.get_UC_ScheduleUrl, c, e)
    };
    //--------------<<
    this.sh_to_mUrl = "../WebServices/get_info.asmx/sh_to_m";
    this.sh_to_m = function (c, e) {
        this.POST(this.sh_to_mUrl, c, e)
    };
    //--------------<<
    this.m_to_shUrl = "../WebServices/get_info.asmx/m_to_sh";
    this.m_to_sh = function (c, e) {
        this.POST(this.m_to_shUrl, c, e)
    };
    //--------------<<
    this.changeActiveUrl = "../WebServices/workflow_.asmx/change_Active";
    this.changeActive = function (c, e) {
        this.POST(this.changeActiveUrl, c, e)
    };

    this.POST = function (c, e, d) {
        e = JSON.stringify(e);
        $.post_(c, e, function (c) {
            d && d(c);
        }, "json")
    };
}


function _ajax_request(c, e, d, f, g, k) {
    jQuery.isFunction(e) && (d = e, e = {});
    return jQuery.ajax({ type: "POST", url: c, data: e, success: d, dataType: f, contentType: k })
}
jQuery.extend({ get_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "GET") },
    put_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "PUT") },
    post_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "POST", "application/json; charset=utf-8") },
    delete_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "DELETE") }
});
 
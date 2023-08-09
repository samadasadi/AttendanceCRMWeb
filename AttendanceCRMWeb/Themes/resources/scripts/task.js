
$(document).ready(function () {

    task_h();

    $('#task_add').click(function () {
        if ($("#task_0").length == 0) {
            $('.task_row').removeClass("task_rowbk");
            var str_ = "<div class='task_row task_rowbk' id='task_0'><div class='DI Crm-icon Crm-icon16 Crm-icon-box1'></div><div contenteditable class='DJ'></div><div class='DJnext'></div><div class='DJcomment'><div><nobr></nobr></div><div><span></span></div></div></div>";
            $('#taskbody').prepend(str_);
            // if ($("#taskbody")[0].scrollHeight > 240) { $("#taskbody").css("overflow-y", "scroll") }
            $('#taskbody').find('.DJ').first().focus();
            task_h();
        } else {
            $("#message_task2").slideDown();
            setTimeout("mas_up()", 1500);
        }
    });


    $('#task_delete').click(function () {
        $task_select = $('#taskbody').find(".task_rowbk");
        $task_select_p = $task_select.prev();
        if ($task_select_p.length == 0) { $task_select_p = $task_select.next(); }
        $task_select.remove();
        $task_select_p.addClass("task_rowbk");
        $task_select_p.find('.DJ').focus();
        // if ($("#taskbody")[0].scrollHeight <= 240) { $("#taskbody").css("overflow-y", "hidden") }
        var e = {};
        e.cmd = "delete";
        e.domain = $("#ctl00_txtdom").val();
        e.user = $("#ctl00_txtusr").val();
        e.id_ = $task_select.attr('id');
     
         jQuery.ajax({
            url: "../pages/task_server.aspx",
            type: "POST",
            data: e,
            error: function (e, xhr) { return_Operations(e.responseText); },
            success: function (data) { return_Operations(data); }
        });

    });


});
var auto = false;
function auto_new(id_) {
    auto = true;
    $("#message_task2").slideDown();
    setTimeout("mas_up()", 1500);
    setTimeout("save_task(" + id_ + ")", 800);
    
}
function mas_up() {
    $("#message_task2").slideUp();
}
function return_Operations(data_) {
    if (data_ == "error") {
        $("#message_task").show();

    }
}
var titleclicked_;
function task_h() {
    $('.DJ,.DJcomment').unbind();
    $(".task_row").unbind();
    $('.DI').unbind();
    $('.back_task').unbind();
    $('.DJnext').unbind();
    $('#task_list').unbind();
    $('#task_list_new').unbind();
    $('#task_list_delete').unbind();
    $('#task_list_rename').unbind();
    $('#task_list_refresh').unbind();

    $('.DJ,.DJcomment').click(function () {

        if ($(this).parent().hasClass("task_rowbk") == false) {
            $('.task_row').removeClass("task_rowbk");
            $(this).parent().addClass("task_rowbk");
        } else {
            $(this).parent().removeClass("task_rowbk");
        }

    });


    $(".task_row").hover(
          function () {
              //              if ($(this).find(".DI").hasClass("ui-icon-check") == false) {
              //                  $(this).find(".DI").removeClass("Crm-icon-box1").addClass("Crm-icon-box2");
              //              }
              $(this).find(".DJnext").addClass("ui-icon ui-icon-carat-1-w cursor");
              $(this).addClass("task_rowhover");
          },
          function () {
              //              if ($(this).find(".DI").hasClass("ui-icon-check") == false) {
              //                  $(this).find(".DI").removeClass("Crm-icon-box2").addClass("Crm-icon-box1");
              //              }
              $(this).find(".DJnext").removeClass("ui-icon ui-icon-carat-1-w cursor");
              $(this).removeClass("task_rowhover");
          }
    );


    $('.DI').click(function () {
        if ($(this).hasClass("Crm-icon-box1") == true) {
            $(this).removeClass("Crm-icon Crm-icon16 Crm-icon-box1").addClass("ui-icon ui-icon-check");
            $(this).next().addClass("DJread");
            $(this).parent().find(".DJcomment").addClass("DJread");
        } else {
            $(this).removeClass("ui-icon ui-icon-check").addClass("Crm-icon Crm-icon16 Crm-icon-box1");
            $(this).next().removeClass("DJread");
            $(this).parent().find(".DJcomment").removeClass("DJread");
        }

        var e = {};
        e.cmd = "show";
        e.domain = $("#ctl00_txtdom").val();
        e.user = $("#ctl00_txtusr").val();
        e.show = $(this).attr('class');
        var id_select = $(this).parent().attr('id');
        e.id_ = id_select;
        e.sub =  $(this).parent().find(".DJ").text();

         jQuery.ajax({
             url: "../pages/task_server.aspx",
            type: "POST",
            data: e,
            error: function (e, xhr) { return_save(e.responseText, id_select); },
            success: function (data) { return_save(data, id_select); }
        });


    });

    $('.DJnext').click(function () {
        $("#task_write").show();
        $("#taskbody").hide();
        $("#HFselecvalue_task").val($(this).parent().attr('id'));
        $("#txttitle_task").html($(this).parent().find(".DJ").text());
        $("#txtselect_task").removeClass();

        $("#txtselect_task").addClass($(this).parent().find(".DI").attr('class'));
        if ($("#txtselect_task").hasClass('ui-icon-check') == true) {
            $("#txttitle_task").addClass("DJread");
        } else { $("#txttitle_task").removeClass("DJread"); }
        $("#notes-editor").val($(this).parent().find(".DJcomment").find("nobr").text());
        $("#txtdate_task").val($(this).parent().find(".DJcomment").find("span").text());
    });

    $('.back_task').click(function () {
        $("#task_write").hide();
        $("#taskbody").show();

        //جایگزین کردن اطلاعات وارد شده در ردیف مورده نظر    
        $find_task = $("#" + $("#HFselecvalue_task").val());


        if ($find_task.find('.DI').hasClass($("#txtselect_task").attr('class')) == false) {
            $find_task.find('.DI').removeClass('ui-icon ui-icon-check');
            $find_task.find('.DI').removeClass('Crm-icon Crm-icon16 Crm-icon-box1');
            if ($("#txtselect_task").hasClass('ui-icon-check') == true) {
                $find_task.find('.DI').addClass('ui-icon ui-icon-check')
            } else { $find_task.find('.DI').addClass('Crm-icon Crm-icon16 Crm-icon-box1') }
        }

        if ($("#txtselect_task").hasClass('ui-icon-check') == true) {
            $find_task.find('.DJ').addClass("DJread");
            $find_task.find('.DJcomment').addClass("DJread");

        } else {
            $find_task.find('.DJ').removeClass("DJread");
            $find_task.find('.DJcomment').removeClass("DJread");
        }

        $find_task.find('.DJ').text($("#txttitle_task").text());
        $find_task.find('nobr').text($("#notes-editor").val());
        $find_task.find('span').text($("#txtdate_task").val());
        //ذخیره اطلاعات در دیتا بیس

     
        var e = {};
        e.cmd = "edit";
        e.domain = $("#ctl00_txtdom").val();
        e.user = $("#ctl00_txtusr").val();
        e.show = $find_task.find(".DI").attr('class');
        e.sub =$("#txttitle_task").text();
        e.com=$("#notes-editor").val();
        e.date= $("#txtdate_task").val();
        e.list = $("#task_list_id").val();
        var id_select = $("#HFselecvalue_task").val()
        e.id_ = id_select;

         jQuery.ajax({
             url: "../pages/task_server.aspx",
            type: "POST",
            data: e,
            error: function (e, xhr) { return_save(e.responseText, id_select); },
            success: function (data) { return_save(data, id_select); }
        });



    });
    $(".DJ").focusin(function () {
        titleclicked_ = $(this).text();
    });

    $('.DJ').keypress(function () {
        if (event.which == 13) {
            if ($("#task_write").is(":visible") == true) {
                //not save
                return false;
            } else {
                auto_new($(this).parent().attr('id'));
                return false;
            }
            
         
        }
    });

    $(".DJ").focusout(function () {
        if (titleclicked_ != $(this).text() || $(this).text() == "") {
            setTimeout("save_task(" + $(this).parent().attr('id') + ")", 800);
        }
    });
    //tasl_list
    $('#task_list').click(function () {
        if ($(".task_list").is(":visible") == true) {
            $('.task_list').hide();
        } else {
            $('.task_list').css('top', $(this).attr('offsetTop') - $('.task_list').height());
            $('.task_list').show();
        }
    });

    //task_list_new
    $('#task_list_new').click(function () {
        var name = prompt("Please enter list name", "");

        if (name != null) {
            $('#menu-note').mask("loading");
              var e = {};
        e.cmd = "newlist";
        e.domain = $("#ctl00_txtdom").val();
        e.user = $("#ctl00_txtusr").val();
        e.list = name;
       

             jQuery.ajax({
                 url: "../pages/task_server.aspx",
                type: "POST",
                data: e,
                error: function (e, xhr) { $("#taskbody").html(e.responseText); $("#message_task").hide(); task_h(); $('#menu-note').unmask(); $(".task_list_name").html($("#task_list_name").val()); $('#menu-note').unmask(); },
                success: function (data) { $("#taskbody").html(data); $("#message_task").hide(); task_h(); $('#menu-note').unmask(); $(".task_list_name").html($("#task_list_name").val()); $('#menu-note').unmask(); }
            });
        }
       
        $('.task_list').hide();

    });

    //task_list_delete
    $('#task_list_delete').click(function () {
        if ($(".task_oderlist").length == 1) {
            alert("You can not delete this list");
        } else {
            $('#menu-note').mask("loading");
            var r = confirm("All information will be removed from the list!Are you sure");
            if (r == true) {
                  var e = {};
                  e.cmd = "listdelete";
        e.domain = $("#ctl00_txtdom").val();
        e.user = $("#ctl00_txtusr").val();
        e.id_ = $("#task_list_id").val();
                 jQuery.ajax({
                     url: "../pages/task_server.aspx",
                    type: "POST",
                    data: e,
                    error: function (data) { if (data == "error") { alert('can not save task please tay again'); } else { $("#taskbody").html(data.responseText); $("#message_task").hide(); $('#menu-note').unmask(); $(".task_list_name").html($("#task_list_name").val()); task_h(); } },
                    success: function (data) { if (data == "error") { alert('can not save task please tay again'); } else { $("#taskbody").html(data); $("#message_task").hide(); $('#menu-note').unmask(); $(".task_list_name").html($("#task_list_name").val()); task_h(); } }
                });

            } else { $('#menu-note').unmask(); }
          }
    });

    //task_list_rename
    $('#task_list_rename').click(function () {

        var name = prompt("Please enter list name", $("#task_list_name").val());
        if (name != null) {
            var e = {};
            e.cmd = "listname";
            e.domain = $("#ctl00_txtdom").val();
            e.user = $("#ctl00_txtusr").val();
            e.id_ = $("#task_list_id").val();
            e.list = name;
            jQuery.ajax({
                url: "../pages/task_server.aspx",
                type: "POST",
                data: e,
                error: function (data) { if (data.responseText == "error") { $("#message_task").show(); } else { $(".task_list_name").html(name); $("#list_" + $("#task_list_id").val()).text(name); $("#task_list_name").val(name); } },
                success: function (data) { if (data == "error") { $("#message_task").show(); } else { $(".task_list_name").html(name); $("#list_" + $("#task_list_id").val()).text(name); $("#task_list_name").val(name); } }
            });
        }
        $('.task_list').hide();

    });

    //task_list_refresh
    $('#task_list_refresh').click(function () {
        $('#menu-note').mask("loading");

          var e = {};
          e.cmd = "select";
        e.domain = $("#ctl00_txtdom").val();
        e.user = $("#ctl00_txtusr").val();
        e.list = $("#task_list_id").val();
    
     
         jQuery.ajax({
             url: "../pages/task_server.aspx",
            type: "POST",
            data: e,
            error: function (e, xhr) { $("#taskbody").html(e.responseText); $("#message_task").hide(); task_h(); $('#menu-note').unmask(); $(".task_list_name").html($("#task_list_name").val()); },
            success: function (data) { $("#taskbody").html(data); $("#message_task").hide(); task_h(); $('#menu-note').unmask(); $(".task_list_name").html($("#task_list_name").val()); }
        });
        $('.task_list').hide();

    });

    //select by list
    $('.task_oderlist').click(function () {

        $('#menu-note').mask("loading");
          var e = {};
          e.cmd = "select";
        e.domain = $("#ctl00_txtdom").val();
        e.user = $("#ctl00_txtusr").val();
        e.list = $(this).attr('id');


         jQuery.ajax({
             url: "../pages/task_server.aspx",
            type: "POST",
            data: e,
            error: function (e, xhr) { $("#taskbody").html(e.responseText); $("#message_task").hide(); task_h(); $('#menu-note').unmask(); $(".task_list_name").html($("#task_list_name").val()); },
            success: function (data) { $("#taskbody").html(data); $("#message_task").hide(); task_h(); $('#menu-note').unmask(); $(".task_list_name").html($("#task_list_name").val()); }
        });
        $('.task_list').hide();
        task_h();

    });

}
function save_task(id_) {

    if ($("#task_write").is(":visible") == true) {
        //not save

    } else {

        //save new or edit only title
        var e = {};
        e.cmd = "new";
        e.show = $(id_).find(".DI").attr('class');
        e.sub = $(id_).find(".DJ").text();
        e.id_ = id_.id;
        e.domain = $("#ctl00_txtdom").val();
        e.user = $("#ctl00_txtusr").val();
        e.list = $("#task_list_id").val();

         jQuery.ajax({
             url: "../pages/task_server.aspx",
            type: "POST",
            data: e,
            error: function (e, xhr) { return_save(e.responseText, id_); },
            success: function (data) { return_save(data, id_); }
        });

    } //end if

}

function return_save(data_, id_) {
  
    if (data_ == "error") {$(id_).attr('id', "taskeeror"); alert('can not save task please tay again');} else {
        if (id_ == "task_0") {
            $("#" + id_).attr('id', data_);
        } else {
            $(id_).attr('id', data_);
        }
    }
    if (auto == true) {
        auto = false;
        $('#task_add').click();
    }
}

function get_task() {
         var e = {};
        e.cmd = "view";
        e.domain = $("#ctl00_txtdom").val();
        e.user = $("#ctl00_txtusr").val();
        var list_
        if ($("#task_0").length == 0) {
            e.list = '0';
        } else {
            e.list = $("#task_list_id").val();
        }

           
     jQuery.ajax({
         url: "../pages/task_server.aspx",
        type: "POST",
        data: e,
        error: function (e, xhr) { $("#taskbody").html(e.responseText); $("#message_task").hide(); task_h(); $('#menu-note').unmask(); $(".task_list_name").html($("#task_list_name").val()); },
        success: function (data) { $("#taskbody").html(data); $("#message_task").hide(); task_h(); $('#menu-note').unmask(); $(".task_list_name").html($("#task_list_name").val()); }
    });
}
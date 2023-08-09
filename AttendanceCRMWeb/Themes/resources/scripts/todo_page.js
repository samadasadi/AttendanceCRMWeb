
        var contant_project;
        var contant_Item;
        var select_project_menu;
        var select_Item_menu;
        var a_edit_title_;
        var b_edit_title_;
        var edit_title_selet;
        var left_selected;

        var serverUrl = document.domain, ClientTodo = new sadegTodo;

        function sadegTodo() {

            this.createProjectUrl = "../WebServices/todo1.asmx/inert_project";
            this.allProjectUrl = "../WebServices/todo1.asmx/get_all_project";
            this.sortProjectUrl = "../WebServices/todo1.asmx/sort_project";
            this.iconporjectUrl = "../WebServices/todo1.asmx/Change_Icon_project";
            this.deleteProjectUrl = "../WebServices/todo1.asmx/delete_project";
            this.editContantProjectUrl = "../WebServices/todo1.asmx/edit_contant_project";
            this.getAllItemUrl = "../WebServices/todo1.asmx/get_All_Item";
            this.sortItemtUrl = "../WebServices/todo1.asmx/sort_Item";
            this.editContantItemUrl = "../WebServices/todo1.asmx/edit_contant_Item";
            this.editcommentItemUrl = "../WebServices/todo1.asmx/edit_comment_Item";
            this.removeCommentItemUrl = "../WebServices/todo1.asmx/remove_comment_Item";
            this.editPriorityItemUrl = "../WebServices/todo1.asmx/edit_Priority_Item";
            this.deleteItemUrl = "../WebServices/todo1.asmx/delete_Item";
            this.editDuedateItemUrl = "../WebServices/todo1.asmx/edit_Duedate_Item";
            this.editPostponeItemUrl = "../WebServices/todo1.asmx/edit_Postpone_Item";
            this.deleteRecycleUrl = "../WebServices/todo1.asmx/delete_Recycle";
            this.getRecycleUrl = "../WebServices/todo1.asmx/get_Recycle";
            this.addnew_itemlistUrl = "../WebServices/todo1.asmx/add_new_item";
            this.gettodayItemUrl = "../WebServices/todo1.asmx/get_today_Item";
            this.getnextItemUrl = "../WebServices/todo1.asmx/get_next_Item";
            this.ItemCheckedUrl = "../WebServices/todo1.asmx/Item_Checked";
            this.showdoneItemUrl = "../WebServices/todo1.asmx/show_done_Item";
            this.deletedoneItemUrl = "../WebServices/todo1.asmx/delete_done_Item";
            this.ItemunCheckedUrl = "../WebServices/todo1.asmx/Item_un_Checked";


            this.editcommentworkUrl = "../WebServices/todo1.asmx/edit_comment_work";
            this.editprojectItemUrl = "../WebServices/todo1.asmx/edit_project_Item";
            this.getsearchItemUrl = "../WebServices/todo1.asmx/get_search_Item";

            this.getsearchItem = function (c, e) { this.POST(this.getsearchItemUrl, c, e) };
            this.editprojectItem = function (c, e) { this.POST(this.editprojectItemUrl, c, e) };

            this.CreateProject = function (c, e) {
                this.POST(this.createProjectUrl, c, e)
            };
            this.getallProject = function (c, e) {
                this.POST(this.allProjectUrl, c, e)
            };
            this.sortProject = function (c, e) {
                this.POST(this.sortProjectUrl, c, e)
            };
            this.ChangeIconProject = function (c, e) {
                this.POST(this.iconporjectUrl, c, e)
            };
            this.deleteProject = function (c, e) {
                this.POST(this.deleteProjectUrl, c, e)
            };
            this.editContantProject = function (c, e) {
                this.POST(this.editContantProjectUrl, c, e)
            };
            this.getAllItem = function (c, e) {
                this.POST(this.getAllItemUrl, c, e)
            };
            this.sortItem = function (c, e) {
                this.POST(this.sortItemtUrl, c, e)
            };
            this.editContantItem = function (c, e) {
                this.POST(this.editContantItemUrl, c, e)
            };
            this.editcommentItem = function (c, e) {
                this.POST(this.editcommentItemUrl, c, e)
            };
            this.removecommentItem = function (c, e) {
                this.POST(this.removeCommentItemUrl, c, e)
            };
            this.editPriorityItem = function (c, e) {
                this.POST(this.editPriorityItemUrl, c, e)
            };
            this.delete_Item = function (c, e) {
                this.POST(this.deleteItemUrl, c, e)
            };
            this.editDuedateItem = function (c, e) {
                this.POST(this.editDuedateItemUrl, c, e)
            };
            this.editPostponeItem = function (c, e) {
                this.POST(this.editPostponeItemUrl, c, e)
            };
            this.deleteRecycle = function (c, e) {
                this.POST(this.deleteRecycleUrl, c, e)
            };
            this.getRecycle = function (c, e) {
                this.POST(this.getRecycleUrl, c, e)
            };
            this.addnew_itemlist = function (c, e) {
                this.POST(this.addnew_itemlistUrl, c, e)
            };
            this.gettodayItem = function (c, e) {
                this.POST(this.gettodayItemUrl, c, e)
            };
            this.getnextItem = function (c, e) {
                this.POST(this.getnextItemUrl, c, e)
            };
            this.ItemChecked = function (c, e) {
                this.POST(this.ItemCheckedUrl, c, e)
            };
            this.showdoneItem = function (c, e) {
                this.POST(this.showdoneItemUrl, c, e)
            };
            this.deletedoneItem = function (c, e) {
                this.POST(this.deletedoneItemUrl, c, e)
            };
            this.ItemunChecked = function (c, e) {
                this.POST(this.ItemunCheckedUrl, c, e)
            };
            this.editcommentwork = function (c, e) {
                this.POST(this.editcommentworkUrl, c, e)
            };


            this.POST = function (c, e, d) {
                RequestStarted();
                e = JSON.stringify(e);
                $.post_(c, e, function (c) {
                    d && d(c);
                    RequestEnded();
                }, "json")
            };
        }


        function _ajax_request(c, e, d, f, g, k) {
            jQuery.isFunction(e) && (d = e, e = {});
            return jQuery.ajax({ type: "POST", url: c, data: e, success: d, dataType: f, contentType: k })
        }


        jQuery.extend({
            get_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "GET") },
            put_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "PUT") },
            post_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "POST", "application/json; charset=utf-8") },
            delete_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "DELETE") }
        });

        var numberOfCurrentRequests = 0;

        //request start **********************
        function RequestStarted() {
            numberOfCurrentRequests++;
            $("#LoaderImg").show()
        }
        //request end**************************
        function RequestEnded() {
            if (numberOfCurrentRequests != 0)
                numberOfCurrentRequests--;
            if (numberOfCurrentRequests == 0)
                $("#LoaderImg").hide();
        }


        $(document).ready(function () {
            init_todo();

            $('.div_newporject').toggle(function () {
                $('.div_addnewporject').slideDown();
            }, function () {
                $('.div_addnewporject').slideUp();
            });
            // add project **********************************
            $('#btn_addproject').click(function () {

                var c = $("#txtNewProjName").val();
                if (c && c.replace(/\s/g, "") != "") {
                    $("#txtNewProjName").attr("readonly", !0);
                    $("#btn_addproject").attr("disabled", !0);
                    var e = {};
                    e.Content = c;
                    e.user_code = $('#HFUserCode').val();
                    e.domain = $('#HFdomain').val();
                    e.sort = $(".BaseProjectLi").length;
                    e.codeing = $("#hfcodeing").val();
                    ClientTodo.CreateProject(e, function (c) {
                        ProjectList = new SmartList(c.d)
                        ProjectList.AddNewItem();
                        $("#Select_project").append('<option value="' + c.d.id + '">' + c.d.contant + '</option>');
                        $("#txtNewProjName").removeAttr("readonly");
                        $("#btn_addproject").removeAttr("disabled");
                        $("#txtNewProjName").val("");
                        RequestEnded();

                    })


                }

                return false;
            });
            //$('#AddItemNotesSpan').bind('DOMNodeInserted DOMNodeRemoved', function (event) {
            //    alert('a');
            //    call_height();
            //});
            $(".divComment").live("DOMNodeInserted DOMNodeRemoved", function () {
                call_height();
            });

            $("#mainProjectList").sortable({
                handle: '.icon_grippy',
                placeholder: "ui-state-highlight",
                update: function () {
                    var order = $('#mainProjectList').sortable('serialize');
                    var mylist = "";
                    $('#mainProjectList').children().each(function (index) {

                        mylist = mylist + "," + $(this).attr("id").replace("projectid_", "");

                    });
                    //send
                    var e = {};
                    e.user_code = $('#HFUserCode').val();
                    e.domain = $('#HFdomain').val();
                    e.str = mylist;
                    e.codeing = $("#hfcodeing").val();
                    ClientTodo.sortProject(e, function (c) {

                        RequestEnded();

                    })

                    //end send
                }
            });

            $("#mainProjectList").disableSelection();

            //sort list************************
            $('ol.sortable').nestedSortable({
                disableNesting: 'no-nest',  // be har tag in classo bedin dige zir grouh barash nemiravad
                forcePlaceholderSize: true,
                handle: '.icon_grippy',
                helper: 'clone',
                items: 'li',
                maxLevels: 5,
                opacity: .6,
                placeholder: 'placeholder',
                revert: 250,
                tabSize: 25, //How far right or left (in pixels) the item has to travel in order to be nested or to be sent outside its current list. Default: 20
                tolerance: 'pointer',
                toleranceElement: '> div',
                update: function () {
                    serialized = $('ol.sortable').nestedSortable('serialize');
                    var e = {};
                    e.user_code = $('#HFUserCode').val();
                    e.domain = $('#HFdomain').val();
                    e.str = serialized;
                    ClientTodo.sortItem(e, function (c) {

                        RequestEnded();

                    })
                }
            });


            //end sort list


            $('.BaseProjectLi').live("mouseenter", function () {
                $(this).find(".ProjItemMenu").show();
                $(this).find(".ListCountTodo").hide();
            }).live("mouseleave", function () {
                if ($(this).find(".ListCountTodo").html() == "") {
                    $(this).find(".ListCountTodo").hide();
                } else {
                    $(this).find(".ListCountTodo").show();
                }
                $(this).find(".ProjItemMenu").hide();
            });

            //set due date ****************************************
            $('.BaseItemLiDiv').live("mouseenter", function () {
                $(".ItemDueDateInner_pp3").hide();
                $(this).find(".ItemDueDateInner_pp3").eq(0).show();
            }).live("mouseleave", function () {

                if ($(".EditDueDateMiddle").is(':visible') == false)
                    $(this).find(".ItemDueDateInner_pp3").eq(0).hide();
            });






            //project select **********************************************
            $(".BaseProjectLi").live("click", function () {
                project_seleted(this);

            });

            //Note Edit work (title) **********************************************
            $("#workNotesedit").live("click", function () {
                var click_id = $(this).attr("id_wfts");
                var c = $("#itemwork_" + click_id);
                if ($(c).find("#worknoteEditDiv").is(':visible')) {
                    $(c).find("#worknoteEditDiv").remove();
                    $(c).find(".divmyComment ").hide();
                } else {

                    //contant_Item = $(c).html();
                    // $(c).html(""); 
                    var h = $("#worknoteEditDiv").clone(), k = h.find("#NoteEditSubmitwork"), l = h.find("#NoteEditCancelwork");
                    // j.css("height", "13px").css("width", "330px");
                    var a_ = $(c).find(".divmyComment").eq(0);
                    $(a_).show().addClass("selected_comment").attr("contenteditable", "True").addClass("write");
                    $(h).show();
                    $(c).children().eq(0).after(h);

                    k.attr("itemwork", click_id);
                    l.attr("itemwork", click_id);
                }

                hidemenu();


            });




            ///menu1 click*******************************
            $(".ProjItemMenu").live("click", function () {
                menu1($(this));
                select_project_menu = $(this).parent().parent().attr("id").replace("projectid_", "");
            });
            //menu2 click*******************************
            $(".ItemMenu").live("click", function () {
                menu2($(this));
                select_Item_menu = $(this).parent().parent().attr("id").replace("Item_", "");
            });
            //menu3 click*******************************
            $(".SortMenu").live("click", function () {
                menu3($(this));
            });

            //show commnet (note)*******************************
            $(".ItemNotesBtn").live("click", function () {

                var se_ = $(".selected_comment");
                se_.removeClass("selected_comment");
                var a_ = $(this).parent().addClass("selected_comment").parent().find(".divComment").eq(0);
                if ($(a_).is(':visible')) {
                    $(".divComment").hide();
                    $(".noteEditDiv").hide();
                    $(a_).hide()
                    se_.removeClass("selected_comment");
                } else {
                    $(".divComment").hide();
                    $(".noteEditDiv").hide();
                    $(a_).show().attr("contenteditable", "false").removeClass("write");
                    if ($(this).parent().parent().find(".divmyComment").html() != "")
                        $(this).parent().parent().find(".divmyComment").show();

                };
                call_height();
            });
            call_height();


            //empty Recycle********************************
            $("#emptyRecycle").live("click", function () {
                if (!confirm($("#hddelete").val()))
                { return false; } else {
                    var e = {};
                    e.domain = $('#HFdomain').val();
                    e.user_code = $('#HFUserCode').val();
                    e.codeing = $("#hfcodeing").val();
                    ClientTodo.deleteRecycle(e, function (c) {
                        $('.baseli_Recycle').click();
                        $('.baseli_Recycle').find('.ListCountTodo').html('').hide();
                        RequestEnded();
                        hidemenu();
                    })
                }
            });
            //item check click****************************************************
            $("#ItemCheckBox").live("click", function () {
                if ($(this).is(':checked')) {
                    //true
                    var itema_ = $("#" + $(this).attr("itemId_"));
                    var e = {};
                    e.domain = $('#HFdomain').val();
                    e.item_id = $(this).attr("itemId_").replace("Item_", "");
                    e.project_id = $(this).attr("ProjectId");
                    e.user_code = $('#HFUserCode').val();
                    e.codeing = $("#hfcodeing").val();
                    ClientTodo.ItemChecked(e, function (c) {
                        if (itema_.find(".ItemDueDateInner_pp1").length != 0) {
                            //today--
                            minus_today_count(itema_.find(".ItemDueDateInner_pp1").length);
                        }
                        if (itema_.find(".ItemDueDateInner_pp0").length != 0) {
                            //next--
                            minus_next_count(itema_.find(".ItemDueDateInner_pp0").length);

                        }
                        if (itema_.find(".ItemDueDateInner_pp2").length != 0) {
                            //today--
                            minus_today_count(itema_.find(".ItemDueDateInner_pp2").length);

                        }
                        $(itema_).hide("slow").remove();
                        var dount_count = $("#projectid_" + e.project_id).find(".ListCountTodo").html();
                        dount_count = parseInt(dount_count) - parseInt(c.d);
                        $("#DoneItemsCount").html(dount_count + parseInt($("#DoneItemsCount").html()));
                        $("#projectid_" + e.project_id).find(".ListCountTodo").html(c.d);

                        if (c.d == "0")
                            $("#projectid_" + e.project_id).find(".ListCountTodo").hide().html("");
                        RequestEnded();
                        hidemenu();
                        HideDoneItems();
                    })
                    //                

                } else {
                    //false

                }
            });

            //DoneCheckBox**************************************************
            $("#DoneCheckBox").live("click", function () {
                if ($(this).is(':checked')) {
                    //true


                } else {
                    //false
                    var itema_ = $("#" + $(this).attr("itemId_"));
                    var e = {};
                    e.domain = $('#HFdomain').val();
                    e.item_id = $(this).attr("itemId_").replace("Item_", "");
                    e.project_id = select_project_menu;
                    e.user_code = $('#HFUserCode').val();
                    e.codeing = $("#hfcodeing").val();
                    ClientTodo.ItemunChecked(e, function (c) {




                        $("#DoneItemsCount").html(c.d[4]);

                        $("#projectid_" + e.project_id).find(".ListCountTodo").html(c.d[0]).show();

                        if (c.d[0] == "0")
                            $("#projectid_" + e.project_id).find(".ListCountTodo").hide().html("");
                        //item
                        $("#mainitemlist").html("");
                        for (f = 0; f < c.d[1].length; f++) {
                            ProjectList = new ItemList(c.d[1][f]);
                            ProjectList.AddNewItem();
                        }
                        if (c.d[1].length != 0)
                            ProjectList.cheakChildren();

                        //


                        set_today(c.d[2]);
                        set_next(c.d[3]);


                        RequestEnded();
                        hidemenu();
                        HideDoneItems();
                    })

                }
            });


            //project edit****************************************
            $('#ProjMenuEdit').click(function () {

                var c = $("#projectid_" + select_project_menu).find(".ProjItemContent");
                if ($(c).find("#ProjectEditDiv").length != 0) {
                    hidemenu();
                    return '';
                }
                contant_project = $(c).html();
                $(c).html("");
                var g = $(c).width();
                g -= parseInt($(c).css("padding-left"),
                10) + parseInt($(c).css("padding-right"), 10);
                var h = $("#ProjectEditDiv").clone(), j = h.find("#ProjectEditTextbox"), k = h.find("#ProjectEditSubmit"), l = h.find("#ProjectmEditCancel");
                j.css("height", "15px").css("width", "85px");
                $(c).append(h);
                j.attr("ProjectId", select_project_menu);
                j.css("width", g - 52 + "px");
                k.attr("ProjectId", select_project_menu);
                l.attr("ProjectId", select_project_menu);
                j.val(contant_project);
                j.focus();
                hidemenu();


            });

            //prject delete********************************
            $('#ProjMenuDel').click(function () {
                if (!confirm($("#hddelete").val()))
                { return false; } else {

                    var e = {};
                    e.project_Id = select_project_menu;
                    e.user_code = $('#HFUserCode').val();
                    e.domain = $('#HFdomain').val();
                    e.codeing = $("#hfcodeing").val();
                    $("#projectid_" + select_project_menu).css("background-color", "black");
                    ClientTodo.deleteProject(e, function (c) {
                        $("#projectid_" + select_project_menu).remove();
                        $("#Select_project option[value='" + select_project_menu + "']").remove();
                        RequestEnded();
                        hidemenu();

                    })
                }

            });


            //icon click **************************************
            $('.iconframe').click(function () {
                var e = {};
                e.project_Id = select_project_menu;
                e.user_code = $('#HFUserCode').val();
                e.domain = $('#HFdomain').val();
                e.icon = $(this).attr("iconid");
                ClientTodo.ChangeIconProject(e, function (c) {
                    $("#projectid_" + select_project_menu).find(".prject_icon").removeClass().addClass(" icon prject_icon").addClass("icon_" + e.icon);
                    RequestEnded();
                    hidemenu();

                })

            });

            //Item Edit menu (title)************************************

            $('#ItemMenuEdit').click(function () {

                var c = $("#Item_" + select_Item_menu).find(".ItemContentDiv").eq(0);
                if ($(c).find("#ItemEditDiv").length != 0) {
                    hidemenu();
                    return '';
                }
                edit_title_selet = $("#Item_" + select_Item_menu);
                var w_ = edit_title_selet.css("width").replace("px", "") - 180 + "px";

                contant_Item = $(c).html();
                $(c).html("");
                var h = $("#ItemEditDiv").clone(), j = h.find("#ItemEditTextbox"), k = h.find("#ItemEditSubmit"), l = h.find("#ItemEditCancel");
                j.css("min-height", "17px").css("width", "85%").css("max-width", w_).css("font-family", "tahoma !important").css("font-size", "12px");

                $(c).append(h);
                j.attr("itemId_", select_Item_menu);
                k.attr("itemId_", select_Item_menu);
                l.attr("itemId_", select_Item_menu);
                $("#div_right").append('<div  style="display: none;width: ' + w_ + ';font-family: tahoma !important;font-size: 12px;min-height: 17px;" id="autogrow_text"></div>');
                a_edit_title_ = false;
                b_edit_title_ = false;
                if (edit_title_selet.find(".ItemDueDateOuter").eq(0).is(':visible')) {
                    a_edit_title_ = true;
                }
                if (edit_title_selet.find(".FilterItemProjectDiv").eq(0).is(':visible')) {
                    b_edit_title_ = true;
                }
                edit_title_selet.find(".ItemDueDateOuter").eq(0).hide();
                edit_title_selet.find(".FilterItemProjectDiv").eq(0).hide();
                j.css("height", $("#autogrow_text").html(contant_Item).height());
                $("#autogrow_text").remove();

                j.val(contant_Item);
                j.focus();
                hidemenu();
            });

            //Note Edit menu (title) ************************************
            $('#ItemMenuEditNote').click(function () {
                var c = $("#Item_" + select_Item_menu);
                //contant_Item = $(c).html();
                // $(c).html(""); 
                if ($(c).find(".BaseItemLiDiv").eq(0).find("#noteEditDiv").length != 0) {
                    hidemenu();
                    return '';
                }
                var h = $("#noteEditDiv").clone(), j = h.find("#divnote"), k = h.find("#NoteEditSubmit"), l = h.find("#NoteEditCancel");
                // j.css("height", "13px").css("width", "330px");
                var a_ = $(c).find(".divComment").eq(0);
                $(a_).show().addClass("selected_comment").attr("contenteditable", "True").addClass("write").css("z-index", "51").focus();
                $(h).show();
                $(c).find(".BaseItemLiDiv").eq(0).append(h);

                j.attr("itemId_", select_Item_menu);
                k.attr("itemId_", select_Item_menu);
                l.attr("itemId_", select_Item_menu);
                j.val(contant_Item);
                j.focus();
                hidemenu();
                call_height();
            });

            //Item Menu Delete *********************
            $('#ItemMenuDel').click(function () {
                if (!confirm($("#hddelete").val()))
                { return false; } else {

                    var itema_ = $("#Item_" + select_Item_menu);
                    var e = {};
                    e.Item_Id = select_Item_menu;
                    e.domain = $('#HFdomain').val();
                    e.project_id = $(itema_).find(".FilterItemProjectDiv").attr("project_id");
                    e.user_code = $('#HFUserCode').val();
                    e.codeing = $("#hfcodeing").val();
                    ClientTodo.delete_Item(e, function (c) {

                        if (itema_.find(".ItemDueDateInner_pp1").length != 0) {
                            //today--
                            minus_today_count(itema_.find(".ItemDueDateInner_pp1").length);
                        }
                        if (itema_.find(".ItemDueDateInner_pp0").length != 0) {
                            //next--
                            minus_next_count(itema_.find(".ItemDueDateInner_pp0").length);

                        }
                        if (itema_.find(".ItemDueDateInner_pp2").length != 0) {
                            //today--
                            minus_today_count(itema_.find(".ItemDueDateInner_pp2").length);

                        }
                        $(itema_).remove();
                        if ($(".baseli_Recycle").find(".ListCountTodo").html() == "") $(".baseli_Recycle").find(".ListCountTodo").html("0");
                        $(".baseli_Recycle").find(".ListCountTodo").html(parseInt($(".baseli_Recycle").find(".ListCountTodo").html()) + (parseInt($("#projectid_" + e.project_id).find(".ListCountTodo").html()) - parseInt(c.d))).show();
                        $("#projectid_" + e.project_id).find(".ListCountTodo").html(c.d);
                        if (c.d == "0")
                            $("#projectid_" + e.project_id).find(".ListCountTodo").hide().html("");


                        RequestEnded();
                        hidemenu();
                    })
                }

            });


            // e.Priority select *************************
            $('.PrioFrame').click(function () {

                var itema_ = $("#Item_" + select_Item_menu);
                var e = {};
                e.Item_Id = select_Item_menu;
                e.domain = $('#HFdomain').val();
                e.Priority = $(this).attr("iconid");
                ClientTodo.editPriorityItem(e, function (c) {
                    removePriority(itema_);
                    $(itema_).find(".ItemContentDiv").eq(0).addClass("Prioritycontant_" + e.Priority);
                    RequestEnded();
                    hidemenu();
                })

            });


            //Item select **********************************************
            $(".BaseItemLiDiv").live("click", function () {
                select_Item_menu = $(this).parent().attr("id").replace("Item_", "");
                if ($(this).parent().find(".divComment").eq(0).html() == "") {
                    $("#ItemMenuRemoveNote").addClass("disable");
                } else {
                    $('#ItemMenuRemoveNote').removeClass("disable");
                }
                $("#Select_project").val($(this).find(".FilterItemProjectDiv").attr("project_id"));

            });
            //Item Menu Remove Note  ************************************
            $('#ItemMenuRemoveNote').live("click", function () {
                if ($("#ItemMenuRemoveNote").hasClass("disable") == false) {
                    if (!confirm($("#hddelete").val()))
                    { return false; } else {
                        var K = $("#Item_" + select_Item_menu);
                        var e = {};
                        e.Item_Id = select_Item_menu;
                        e.domain = $('#HFdomain').val();
                        e.user_code = $('#HFUserCode').val();
                        e.codeing = $("#hfcodeing").val();
                        ClientTodo.removecommentItem(e, function (c) {
                            $(K).find(".divComment").eq(0).html('').hide();
                            $(K).find(".noteEditDiv").eq(0).hide();
                            RequestEnded();
                            $(K).find(".ItemNotesBtn").removeClass("icon_notes_full").addClass("icon_notes");

                            hidemenu();
                        })
                    }
                }
            });
            // item due click -----------------------------
            var EduDate_salect = 0;
            $(".ItemDueDateOuter").live("click", function () {

                var du_ = $(".EditDueDateMiddle")
                $("#divdatapiker").datepicker("destroy");
                var attr_ = $(this).attr("duedate")
                if ($(this).find('.ItemDueDateInner_pp3').length == 0) {
                    $(".EditDueDatePostpone").show();
                    $(".icon_clear_cross").css("top", "47px");
                } else {
                    $(".EditDueDatePostpone").hide();
                    $(".icon_clear_cross").css("top", "9px");
                }
                //--------------------------------------
                var dateFormat = "mm/dd/yy";
                if (translateTodo.hdcalander_todo == 'en') {
                    $("#txtduedate").val(attr_);
                    $("#divdatapiker").datepicker({
                        regional: '', dateFormat: 'mm/dd/yy',
                        defaultDate: new Date(attr_),
                        onSelect: function (date, picker) {
                            $("#txtduedate").val(date);
                        }
                    });
                    $('#AddItemAdvDate').datepicker({
                        regional: '', dateFormat: 'mm/dd/yy'
                    });

                    $(".ui-datepicker-calendar").css("direction", "ltr");
                } else {
                    var dua_ = attr_.split("/");
                    $("#txtduedate").val(attr_);
                    $("#divdatapiker").datepicker({
                        defaultDate: new JalaliDate(dua_[0], dua_[1] - 1, dua_[2]),
                        isRTL: true,
                        onSelect: function (date, picker) {
                            $("#txtduedate").val(date);
                        }
                    });
                    $('#AddItemAdvDate').datepicker();

                }

                $('p.ui-widget-content').hover(function () { $(this).addClass('ui-state-hover'); }, function () { $(this).removeClass('ui-state-hover'); });



                if (EduDate_salect != $(this).attr("itemId_")) {
                    EduDate_salect = $(this).attr("itemId_");
                    du_.attr("itemId_", EduDate_salect).css("top", $(this).offset().top + 20).css("left", $(this).offset().left - du_.width() + $(this).width()).show("fast");
                    du_.find("#btnPostpone").attr("itemId_", EduDate_salect);
                    du_.find("#btnsaveduedate").attr("itemId_", EduDate_salect);
                } else {

                    if (du_.is(':visible')) {
                        // du_.hide().removeAttr("itemId_");
                        closedu(du_);
                    } else {
                        du_.attr("itemId_", EduDate_salect).show("fast");
                        du_.find("#btnPostpone").attr("itemId_", EduDate_salect);
                        du_.find("#btnsaveduedate").attr("itemId_", EduDate_salect);
                    };

                }
                isMenu = true;
            });




            ///clear Duedate**************************
            $('.text_clear_button').click(function () {

                $("#txtduedate").val("");
            });

            /// save Duedate ***************************************
            $('#btnsaveduedate').click(function () {
                // var K = $("#Item_" + select_Item_menu);
                var K = $("#" + $(this).attr("itemId_"));
                var e = {};
                e.Item_Id = $(this).attr("itemId_").replace("Item_", "");
                e.domain = $('#HFdomain').val();
                e.duedate = $("#txtduedate").val();
                e.user_code = $('#HFUserCode').val();
                e.codeing = $("#hfcodeing").val();
                closedu($(".EditDueDateMiddle"));
                var ineer_ = K.find(".ItemDueDateInner").eq(0);
                ineer_.html("loading...");
                var old_duedate = ineer_.attr("date_mode");
                //alert(old_duedate);
                ClientTodo.editDuedateItem(e, function (c) {
                    K.find(".ItemDueDateOuter").eq(0).attr("duedate", c.d.DueDate);
                    setduedate(K, c.d.date_mode, c.d.show_date, old_duedate);
                    //tagire duedate dar inbox select
                    var select_mode_ = K.find(".FilterItemProjectDiv").attr("select_mode");
                    if (((c.d.date_mode == 2 || c.d.date_mode == 0) && select_mode_ == 1) || ((c.d.date_mode != 2 || c.d.date_mode == 0) && select_mode_ == 2)) {
                        //hazf
                        $(K).remove();
                    }
                    //
                    K.find(".ItemDueDateInner").eq(0).show();
                    RequestEnded();
                    hidemenu();
                })
                return false;
            });

            // save Postpone (click)**********************************
            $('#btnPostpone').click(function () {
                // var K = $("#Item_" + select_Item_menu);
                var K = $("#" + $(this).attr("itemId_"));
                var e = {};
                e.Item_Id = $(this).attr("itemId_").replace("Item_", "");
                e.domain = $('#HFdomain').val();
                e.Postpone = $("#DaySelect option:selected").val();

                e.duedate = K.find(".ItemDueDateOuter").eq(0).attr("duedate");
                e.user_code = $('#HFUserCode').val();
                e.codeing = $("#hfcodeing").val();
                closedu($(".EditDueDateMiddle"));
                var ineer_ = K.find(".ItemDueDateInner").eq(0);
                ineer_.html("loading...");
                var old_duedate = ineer_.attr("date_mode");
                //alert(old_duedate);
                ClientTodo.editPostponeItem(e, function (c) {
                    K.find(".ItemDueDateOuter").eq(0).attr("duedate", c.d.DueDate);
                    setduedate(K, c.d.date_mode, c.d.show_date, old_duedate);
                    //tagire duedate dar inbox select
                    var select_mode_ = K.find(".FilterItemProjectDiv").attr("select_mode");
                    if (((c.d.date_mode == 2 || c.d.date_mode == 0) && select_mode_ == 1) || ((c.d.date_mode != 2 || c.d.date_mode == 0) && select_mode_ == 2)) {
                        //hazf
                        $(K).remove();
                    }
                    //
                    RequestEnded();
                    hidemenu();
                })
                return false;
            });


            //Recycle click ******************************************
            $('.baseli_Recycle').click(function () {
                $("#txtseach").val("");
                $("#AddNewItemDiv").hide();
                var e = {};
                e.domain = $('#HFdomain').val();
                e.user_code = $('#HFUserCode').val();
                e.codeing = $("#hfcodeing").val();
                $(".ProjectSelected").removeClass("ProjectSelected");
                $(this).addClass('ProjectSelected');
                ClientTodo.getRecycle(e, function (c) {
                    $("#mainitemlist").html("");
                    for (f = 0; f < c.d.length; f++) {
                        RecycleLista = new RecycleList(c.d[f])
                        RecycleLista.AddNewRecycle();
                    }
                    if (c.d.length != 0)
                        RecycleLista.cheakChildrenRecycle();
                    $(".CurrentProjectTitle").html($('.baseli_Recycle').find(".item_contant").html());
                    if ($("#MainContentArea").find("li").length != 0) {
                        $("#mainitemlist").prepend('<a id="emptyRecycle" class="InputBtnAdd InputBtnAdd2">Empty&nbsp;Recycle&nbsp;Bin</a>');
                    } else { $("#mainitemlist").prepend('There are no items to display') }
                    RequestEnded();
                    hidemenu();
                    HideDoneItems();
                    $("#DoneItemsDiv").hide();
                    call_height();

                })

            });


            //Expander click (more - less) ******************************************
            $('.AddItemExpander').click(function () {
                $(".AddItemmore").slideToggle("slow");
                if ($(this).html() == "more") {
                    $(this).html("less");
                } else {
                    $(this).html("more");
                }
            });


            //today click***************************

            $('.baseli_today').click(function () {
                $("#txtseach").val("");
                $("#AddNewItemDiv").hide();
                $(".ProjectSelected").removeClass("ProjectSelected");
                $(this).addClass("ProjectSelected");
                $(".CurrentProjectTitle").html($(this).find(".item_contant").html());
                left_selected = "today";
                var e = {};
                e.domain = $('#HFdomain').val();
                e.user_code = $('#HFUserCode').val();
                e.sort = $(".ProjectActions").attr("sort");
                e.codeing = $("#hfcodeing").val();
                ClientTodo.gettodayItem(e, function (c) {
                    $("#mainitemlist").html("");
                    for (f = 0; f < c.d.length; f++) {
                        ProjectList = new ItemList(c.d[f])
                        ProjectList.AddNewItem();
                    }
                    if (c.d.length != 0)
                        ProjectList.cheakChildren();
                    RequestEnded();
                    $("#DoneItemsDiv").hide();
                    HideDoneItems();
                    call_height();
                })
            });


            //next click***************************

            $('.baseli_next').click(function () {
                $("#txtseach").val("");
                $("#AddNewItemDiv").hide();
                $(".ProjectSelected").removeClass("ProjectSelected");
                $(this).addClass("ProjectSelected");
                $(".CurrentProjectTitle").html($(this).find(".item_contant").html());
                left_selected = "next";
                var e = {};
                e.domain = $('#HFdomain').val();
                e.user_code = $('#HFUserCode').val();
                e.sort = $(".ProjectActions").attr("sort");
                e.codeing = $("#hfcodeing").val();
                ClientTodo.getnextItem(e, function (c) {
                    $("#mainitemlist").html("");
                    for (f = 0; f < c.d.length; f++) {
                        ProjectList = new ItemList(c.d[f])
                        ProjectList.AddNewItem();
                    }
                    if (c.d.length != 0)
                        ProjectList.cheakChildren();
                    RequestEnded();
                    $("#DoneItemsDiv").hide();
                    HideDoneItems();
                    call_height();
                })
            });

            //search click***************************
            $("#btn_search").keypress(function (event) {
                if (event.which == 13) {
                    $('.btn_search').click()
                }

            });

            $('#btn_search').click(function () {

                $("#AddNewItemDiv").hide();
                $(".ProjectSelected").removeClass("ProjectSelected");
                $(this).addClass("ProjectSelected");
                $(".CurrentProjectTitle").html($(this).find(".item_contant").html());
                left_selected = "search";
                var e = {};
                e.domain = $('#HFdomain').val();
                e.user_code = $('#HFUserCode').val();
                e.sort = $(".ProjectActions").attr("sort");
                e.text_ = $("#txtseach").val();
                e.codeing = $("#hfcodeing").val();
                ClientTodo.getsearchItem(e, function (c) {
                    $("#mainitemlist").html("");
                    for (f = 0; f < c.d.length; f++) {
                        ProjectList = new ItemList(c.d[f])
                        ProjectList.AddNewItem();
                    }
                    if (c.d.length != 0)
                        ProjectList.cheakChildren();
                    RequestEnded();
                    $("#DoneItemsDiv").hide();
                    HideDoneItems();
                    call_height();
                })
                return false;
            });


            //sort order  click **********************************
            $('.sort_order').click(function () {
                $(".ProjectActions").attr("sort", $(this).attr("id"));

                sorting_item('order');
                $("#SortMenu").html($(this).text());
                hidemenu();
            });
            //sort order  click **********************************
            $('.sort_priority').click(function () {
                $(".ProjectActions").attr("sort", $(this).attr("id"));
                $("#SortMenu").html($(this).text());
                sorting_item('priority');
                hidemenu();

            });
            //sort order  click **********************************
            $('.sort_dueDate').click(function () {
                $(".ProjectActions").attr("sort", $(this).attr("id"));
                sorting_item('DueDate');
                $("#SortMenu").html($(this).text());
                hidemenu();
            });



         





            //new contant item keypress **********************************
            $('#NewItemContentInput').keypress(function () {
                if (event.which == 13) {
                    AddNew_Item();
                    return false;
                }
            });
            
            $("#Select_project").change(function () {
                if (!confirm(translateTodo.hdchange_prohect))
                { hidemenu(); return false; } else {

                    var e = {};
                    e.Item_Id = select_Item_menu;
                    e.domain = $('#HFdomain').val();
                    var pr_new_id = $("#Select_project option:selected").val();
                    e.project_id = pr_new_id;
                    var pr_old_id = $("#Item_" + select_Item_menu).find(".FilterItemProjectDiv").attr("project_id");
                    e.project_old_id = pr_old_id;
                    ClientTodo.editprojectItem(e, function (c) {

                        add_project_count(pr_new_id);
                        minus_project_count(pr_old_id);
                        $(".ProjectSelected").click();
                        RequestEnded();
                        hidemenu();
                    })

                }
            });


            //***************
            var dateFormat = "mm/dd/yy";
            if (translateTodo.hdcalander_todo == 'en') {
                $('#AddItemAdvDate').datepicker({
                    regional: '', dateFormat: 'mm/dd/yy'
                });
                $(".ui-datepicker-calendar").css("direction", "ltr");

            } else {
                $('#AddItemAdvDate').datepicker();
                $(".ui-datepicker-calendar").css("direction", "rtl");
            }

            $('p.ui-widget-content').hover(function () { $(this).addClass('ui-state-hover'); }, function () { $(this).removeClass('ui-state-hover'); });

        });

        //$('.btnAddParametrTask').click(function () {
        //    parametr_manage("task", $("#DrdListParametrTodo").val(), {
        //        updateList: function (list) {
        //            var ddllist_ = $("#DrdListParametrTodo");
        //            var selectedValue = ddllist_.val();
        //            ddllist_.empty();
        //            ddllist_.append($("<option>").val("").text(''));
        //            $.each(list, function (i, item) {
        //                ddllist_.append($('<option>').val(item.value).text(item.text));
        //            });
        //            ddllist_.val(selectedValue).attr('selected', 'selected');
        //        },
        //        updateParametr: function (list_code, parametrs) { //N1
        //            //if ($('#DrdList_WfSwitch').val() == list_code) {
        //            //    var arrParam = new Array();
        //            //    $.each(parametrs, function (i, item) { arrParam.push([item.text, item.value]); });
        //            //    setItemsList_WfSwitch(arrParam);
        //            //}
        //        }
        //    });
        //    return false;
        //});

    //////////end document ready----------------------------------------------------------------------------------------------------------------------------------
        function AddNew_Item() {

            $.Watermark.HideAll();
          
            var e = {};
            e.domain = $('#HFdomain').val();
            e.Project_Id = select_project_menu;
            e.title = $("#NewItemContentInput").val();
            e.comment = $("#AddItemNotesSpan").html();
            e.duedate = $("#AddItemAdvDate").val();
            e.user_code = $('#HFUserCode').val();
            e.codeing = $("#hfcodeing").val();
            if (e.title != "") {
                ClientTodo.addnew_itemlist(e, function (c) {
                    ProjectList = new ItemList(c.d)
                    ProjectList.AddNewItem();
                    if (c.length != 0)
                        ProjectList.cheakChildren();

                    $("#NewItemContentInput").val("");
                    $("#AddItemNotesSpan").html("");
                    $("#AddItemAdvDate").val("");

                    $.Watermark.ShowAll();
                    $("#NewItemContentInput").focus();
                    add_project_count(e.Project_Id);

                    if (c.d.due.date_mode == "1" || c.d.due.date_mode == "3")
                        add_today();

                    if (c.d.due.date_mode == "2")
                        add_next();


                    RequestEnded();
                    hidemenu();
                    call_height();
                })

            } else { $.Watermark.ShowAll(); }
       
        }
        function call_height() {
            //var bo_ = true
            //while (bo_) {

            //    if ($("#iframetodo", window.parent.document).height() < $(document).height()) {
            //        $("#iframetodo", window.parent.document).height($(document).height()+250);

            //    } else { bo_ = false }
            //}
           
        }
        //close du**************
        function closedu(du_) {
            du_.hide().removeAttr("itemId_");
            du_.find("#btnPostpone").removeAttr("itemId_");
            du_.find("#btnsaveduedate").removeAttr("itemId_");

        }
//hide menu******************************
        function hidemenu() {
            $("#projectContextMenu").hide();
            $(".ProjectSelectedmenu").removeClass("ProjectSelectedmenu");
            $("#ItemContextMenu").hide();
            $("#moreContextMenu").hide();
            

        }

   
//jquery.ajax object
        var c = $("#ProjectList").clone().attr("id", "mainProjectList");
   

//project item *************************
     function SmartList(c) {
         this.options = c;
         this.id = c.id;
         this.sort = c.sort;
         this.icon = c.icon;
         this.contant = c.contant;
         this.itemCount=c.itemCount;



         this.AddNewItem = function () {
             var h = $("#BaseProjectLi").clone();
             h.attr("id", "projectid_" + this.id);
             h.find(".icon_1").removeClass("icon_1").addClass("icon_" + this.icon);
             h.find(".ProjItemContent").attr("fullname", this.contant);
             h.find(".ProjItemContent").html(ReplaceURLWithHTMLLinks(this.contant, 20));
          
             if (this.itemCount == 0) {
                 h.find(".ListCountTodo").hide();
             } else {
                 h.find(".ListCountTodo").html(this.itemCount);
             }

             $("#mainProjectList").append(h);

         };
     }

     function ItemList(c) {
         this.options = c;
         this.id = c.Id;
         this.Checked = c.Checked;
         this.Title = c.Title;
         this.Comment = c.Comment;
         this.Create_date = c.Create_date;
         this.DueDate = c.due.DueDate;
         this.Order = c.Order;
         this.Project_Id = c.Project_Id;
         this.Deleted = c.Deleted;
         this.Priority = c.Priority;
         this.path = c.path;
         this.checked_date = c.checked_date;
         this.show_date = c.due.show_date;
         this.date_mode = c.due.date_mode;
         this.project_name = c.project_name;
         this.select_mode = c.select_mode;

         this.cheakChildren = function () {
             var attr;
             $("#mainitemlist").children().each(function (index) {
                 attr = $(this).attr('path');
                 if (typeof attr !== 'undefined' && attr !== false) {
                     var item_ins = $("#" + attr)
                     if ($(item_ins).length != 0) {
                         if ($(item_ins).find('ol').length == 0) { $(item_ins).append('<ol ></ol>'); }
                         var h_ = $(this).clone();
                         $(this).remove();
                         h_.removeAttr('path');
                         $(item_ins).find('ol').eq(0).append(h_);
                     }
                 }
             });
         }

         this.AddNewItem = function () {
             var h = $("#BaselistLiTodo").clone();
             h.attr("id", "Item_" + this.id);
             if (this.path != "")
                 h.attr("path", "Item_" + this.path);
             h.find(".ItemContentDiv").html(this.Title).addClass("Prioritycontant_" + this.Priority);
             h.find(".divComment").html(this.Comment);
             if (this.Comment == "" || this.Comment == "<br>") {
                 h.find(".ItemNotesBtn").removeClass("icon_notes_full").addClass("icon_notes");
             } else {
                 h.find(".ItemNotesBtn").removeClass("icon_notes").addClass("icon_notes_full");
             }
             h.find(".ItemNotesBtn").attr("itemId_", "Item_" + this.id);
             h.find(".ItemCheckBox").attr("itemId_", "Item_" + this.id).attr("ProjectId", this.Project_Id);
             h.find(".ItemDueDateOuter").attr("itemId_", "Item_" + this.id).attr("duedate", this.DueDate);
             setduedate(h, this.date_mode, this.show_date, '');
             h.find(".FilterItemProjectDiv").attr("project_id", this.Project_Id).attr("select_mode", this.select_mode)
             if (this.select_mode == 1 || this.select_mode == 2) {
                 h.find(".icon_grippy").removeClass("icon_grippy").addClass("icon_grippy2");
                 h.find(".FilterItemProjectDiv").html(this.project_name).show();
             }

             if ($(".ProjectActions").attr("sort") != "order") {
                 h.find(".icon_grippy").addClass("icon_grippy2").removeClass("icon_grippy");
             }

             if (translateTodo.hdcalander_todo == "en")
                 h.find(".ItemDueDateInner").css("direction", "ltr");
             $("#mainitemlist").append(h);
         };
     }


     function RecycleList(c) {
         this.options = c;
         this.id = c.Id;
         this.Checked = c.Checked;
         this.Title = c.Title;
         this.path = c.path;

         this.cheakChildrenRecycle = function () {
             var attr;
             $("#mainitemlist").children().each(function (index) {
                 attr = $(this).attr('path');
                 if (typeof attr !== 'undefined' && attr !== false) {
                     var item_ins = $("#" + attr)
                     if ($(item_ins).length != 0) {
                         if ($(item_ins).find('ol').length == 0) { $(item_ins).append('<ol ></ol>'); }
                         var h_ = $(this).clone();
                         $(this).remove();
                         h_.removeAttr('path');
                         $(item_ins).find('ol').eq(0).append(h_);
                     }
                 }
             });
         }

         this.AddNewRecycle = function () {
             var h = $("#BaselistRecycleTodo").clone();
             h.attr("id", "ItemRecycle_" + this.id);
             if (this.path != "")
                 h.attr("path", "ItemRecycle_" + this.path);
             if (this.Checked == true) {
                 h.find(".RecycleCheckBox").attr("checked", "checked")
                 h.find(".RecycleContentDiv").addClass("DoneItem");
             }
             h.find(".RecycleCheckBox").attr("disabled", "disabled");

             h.find(".RecycleContentDiv").html(this.Title).addClass("Prioritycontant_" + this.Priority);
             $("#mainitemlist").append(h);
         };
     }


     function DoneList(c) {
         this.options = c;
         this.id = c.Id;
         this.Checked = c.Checked;
         this.Title = c.Title;
         this.path = c.path;
         this.DueDate = c.DueDate;
         this.checked_date = c.checked_date;
         this.Checked_parent = c.Checked_parent;
         this.Project_Id = c.Project_Id;
         this.date_mode = c.date_mode;

         this.cheakChildrenDoneItem = function () {
           
             var attr;
             $("#DoneItemListPlaceholder").children().each(function (index) {
                 attr = $(this).attr('path');
                 if (typeof attr !== 'undefined' && attr !== false) {
                     var item_ins = $("#" + attr)
                     if ($(item_ins).length != 0) {
                         if ($(item_ins).find('ol').length == 0) { $(item_ins).append('<ol ></ol>'); }
                         var h_ = $(this).clone();
                         $(this).remove();
                         h_.removeAttr('path');
                         $(item_ins).find('ol').eq(0).append(h_);
                     }
                 }
             });
         }

         this.AddNewDone = function () {
             var h = $("#BaselistDoneTodo").clone();
             h.attr("id", "ItemDone_" + this.id);
             if (this.path != "")
                 h.attr("path", "ItemDone_" + this.path);
             var chkdone_ = h.find(".DoneCheckBox");
             if (this.Checked == true) {
                 chkdone_.attr("checked", "checked")
                 h.find(".DoneContentDiv").addClass("DoneItem");
             }
             chkdone_.attr("itemId_", "Item_" + this.id);
             if (this.Checked == false)
                 chkdone_.attr("disabled", "disabled");

             if (this.DueDate != "")
                 h.find(".ItemDueDateInner_pp0").html(this.DueDate).show();

             if (this.checked_date != "")
                 h.find(".ItemDueDateInner_pp4").html(this.checked_date).show();
             else h.find(".ItemDueDateInner_pp4").css("min-width", "57px").css("min-height", "12px");

             if (this.date_mode == 1) {
                 h.find(".ItemDueDateInner_pp4").removeClass("ItemDueDateInner_pp4").addClass("ItemDueDateInner_pp1");

             } else if (this.date_mode == 3) {
                 h.find(".ItemDueDateInner_pp4").removeClass("ItemDueDateInner_pp4").addClass("ItemDueDateInner_pp2");

             }

             h.find(".DoneContentDiv").html(this.Title).addClass("Prioritycontant_" + this.Priority);


             $("#DoneItemListPlaceholder").append(h);
         };
     }

 

     function setduedate(h, date_mode, show_date,old_) {
         removeItemDueDateInner(h);
         if (date_mode == 0) {
             //dudate empty
             h.find(".ItemDueDateInner").eq(0).addClass("ItemDueDateInner_pp3").attr("date_mode", date_mode).html(translateTodo.hflabelset);
             if (old_ == "2") {
                 // next --
                 minus_next();
             } else if (old_ == "1" || old_ == "3") {
                 // today --
                 minus_today();
             }
         } else if (date_mode == 1) {
             //dudate now
             h.find(".ItemDueDateInner").eq(0).addClass("ItemDueDateInner_pp1").attr("date_mode", date_mode).html(show_date);
             if (old_ == "2") {
                 // today ++
                 add_today();
                 // next --
                 minus_next();
            } else if (old_ == "0") {
                 // today ++
                 add_today();
             }
         } else if (date_mode == 2) {
             //dudate left
             h.find(".ItemDueDateInner").eq(0).addClass("ItemDueDateInner_pp0").attr("date_mode", date_mode).html(show_date);
             if (old_ == "1" || old_ == "3") {
                 // today --
                 minus_today();
                 // next ++
                 add_next();
             } else if (old_ == "0") {
                 // next ++
                add_next();
                
             }

         } else if (date_mode == 3) {
             //dudate overdays
            h.find(".ItemDueDateInner").eq(0).addClass("ItemDueDateInner_pp2").attr("date_mode", date_mode).html(show_date);
            if (old_ == "2") {
                // today ++
                add_today();
                // next --
                minus_next();
            } else if (old_ == "0") {
                // today ++
                add_today();
            }

         }
     }


    

     function add_today() {
         var today_ = $(".baseli_today").find('.ListCountTodo');
         var count = today_.html();
         if (count == "") {
             today_.html("1")
             today_.show();
         } else {
             today_.html(parseInt(count) + 1).show();
         }
        // getlist_now("todo");
     }
     function minus_today() {
         var today_ = $(".baseli_today").find('.ListCountTodo');
         var count = today_.html();
         if (count == "1") {
             today_.html("")
             today_.hide();
         } else {
             today_.html(parseInt(count) - 1);
         }
      //   getlist_now("todo");
     }
     function minus_today_count(count_) {
         var today_ = $(".baseli_today").find('.ListCountTodo');
         var count = today_.html();
         today_.html(parseInt(count) - parseInt(count_));
         if (today_.html() == "0") {
             today_.html("")
             today_.hide();
         }
      //   getlist_now("todo");
     }
     function minus_next_count(count_) {
         var next_ = $(".baseli_next").find('.ListCountTodo');
         var count = next_.html();
         next_.html(parseInt(count) - parseInt(count_));
         if (next_.html() == "0") {
             next_.html("")
             next_.hide();
         } 
     }

     function minus_next() {
         var next_ = $(".baseli_next").find('.ListCountTodo');
         var count = next_.html();
         if (count == "1") {
             next_.html("")
             next_.hide();
         } else {
             next_.html(parseInt(count) - 1);
         }

     }
     function add_next() {
         var next_ = $(".baseli_next").find('.ListCountTodo');
         var count = next_.html();
         if (count == "") {
             next_.html("1")
             next_.show();
         } else {
             next_.html(parseInt(count) + 1).show();
         }

     }

   
  
  
     function set_today(count) {
         var today_ = $(".baseli_today").find('.ListCountTodo');
             today_.html(count);
             if (count == "0") {
                 today_.hide();
             } else {
                
                 today_.show();
             }
         }

         function set_next(count) {
             var next_ = $(".baseli_next").find('.ListCountTodo');
             next_.html(count);
             if (count == "0") {
                 next_.hide();
             } else {

                 next_.show();
             }
         }

         function set_Recycle(count) {
             var Recycle_ = $(".baseli_Recycle").find('.ListCountTodo');
             Recycle_.html(count);
             if (count == "0") {
                 Recycle_.hide();
             } else {

                 Recycle_.show();
             }
         }

       

         function set_doneItem(count) {
             $("#DoneItemsCount").html(count);
             $("#DoneItemsShowLink").show();
             $("#DoneItemsHideLink").hide();

         }

         function add_project_count(id_) {
             var project_count_ = $("#projectid_" + id_).find('.ListCountTodo');
             var count = project_count_.html();
             if (count == "") count = "0";
             project_count_.html(parseInt(count) + 1);
             if (project_count_.html() <= "0") {
                 project_count_.html("")
                 project_count_.hide();
             } else {
                 project_count_.show();

             }
         }


         function minus_project_count(id_) {
             var project_count_ = $("#projectid_" + id_).find('.ListCountTodo');
             var count = project_count_.html();
             if (count == "1") count = "0";
            if (count== "0") {
                 project_count_.html("")
                 project_count_.hide();
             } else {
                 project_count_.html(parseInt(count) - 1);
                 project_count_.show();
             }
         }



     


//init todo **********************************
     function init_todo(){
                    var e = {};
                    e.domain = $('#HFdomain').val();
                    e.user_code = $('#HFUserCode').val();
                    e.codeing = $("#hfcodeing").val();
                    ClientTodo.getallProject(e, function (c) {
                        for (f = 0; f < c.d[0].length; f++) {
                            $("#Select_project").html();
                            ProjectList = new SmartList(c.d[0][f])
                            ProjectList.AddNewItem();
                            $("#Select_project").append('<option value="' + c.d[0][f].id + '">' + c.d[0][f].contant + '</option>');
                        
                        }
                        set_today(c.d[1]);
                        set_next(c.d[2]);
                        set_Recycle(c.d[3]);
                   
                        $('.baseli_today').click();

                        RequestEnded();
                    })
                 //   getListParametrManage("task");

                }


//is menu ************************************

                var xmu;
                var ymu;
                var ie = document.all
                var ns6 = document.getElementById && !document.all
                var isMenu = false;
                var menuSelObj = null;
                var overpopupmenu = false;
                function mouseSelect(e) {
                    var obj = ns6 ? e.target.parentNode : event.srcElement.parentElement;
                    if (isMenu) {
                        if (overpopupmenu == false) {
                            isMenu = false;
                            overpopupmenu = false;
                            hidemenu();
                            var du_ = $(".EditDueDateMiddle");
                           if( $(e.target).parents(".EditDueDateMiddle").length==0){
                         //   if (e.clientX < du_.offset().left || e.clientX > du_.offset().left + du_.width() + 20 || e.clientY < du_.offset().top || e.clientY > du_.offset().top + du_.height()) {
                               // du_.hide().removeAttr("itemId_");
                                closedu(du_);
                              //  $(".ItemDueDateInner_pp3").hide();
                            } else {
                                isMenu = true;
                            }
                            return true;
                        }
                        return true;
                     }
                }
                document.onmousedown = mouseSelect;
                Browser = navigator.appName
                Net = Browser.indexOf("Netscape")
                Micro = Browser.indexOf("Microsoft")
                Netscape = false
                IE = false

                if (Net >= 0) {Netscape = true;window.captureEvents(Event.MOUSEDOWN);}
                if (Micro >= 0) {IE = true;}
                var IE = document.all ? true : false
                if (!IE) document.captureEvents(Event.MOUSEMOVE)
                document.onmousemove = getMouseXY;
                var tempX = 0
                var tempY = 0
                function getMouseXY(e) {
                    if (IE) { // grab the x-y pos.s if browser is IE
                        tempX = event.clientX + document.body.scrollLeft
                        tempY = event.clientY + document.body.scrollTop
                    } else {  // grab the x-y pos.s if browser is NS
                        tempX = e.pageX
                        tempY = e.pageY
                    }

                    if (tempX < 0) { tempX = 0 }
                    if (tempY < 0) { tempY = 0 }
                    xmu = tempX
                    ymu = tempY
                    return true
                }
//menu 1 **************************
                function menu1(e) {
                    if (IE) {

                    } else {
                       // document.getElementsByName('titleselect')[0].innerHTML = document.getElementById("ctl00_ContentHolder_HFmid").value;
                    }
                    //document.getElementById('menudiv').style.left = xmu + 'px';
                    //document.getElementById('menudiv').style.top = ymu + 'px';
                    $("#projectContextMenu").css("left", xmu+6 + 'px');
                    $("#projectContextMenu").css("top", ymu+4 + 'px');
                    $("#projectContextMenu").show();
                    $(e).parent().addClass("ProjectSelectedmenu");
                    isMenu = true;
                    return false;
                }
//menu2 *********************************
                function menu2(e) {
                    if (IE) {

                    } else {
                        // document.getElementsByName('titleselect')[0].innerHTML = document.getElementById("ctl00_ContentHolder_HFmid").value;
                    }
                    //document.getElementById('menudiv').style.left = xmu + 'px';
                    //document.getElementById('menudiv').style.top = ymu + 'px';
                    $("#ItemContextMenu").css("left", xmu - 116 + 'px');
                    $("#ItemContextMenu").css("top", ymu + 4 + 'px');
                    $("#ItemContextMenu").show();
                    //$(e).parent().addClass("ProjectSelectedmenu");
                    isMenu = true;
                    return false;
                }

                //menu2 *********************************
                function menu3(e) {
                    if (IE) {

                    } else {
                        // document.getElementsByName('titleselect')[0].innerHTML = document.getElementById("ctl00_ContentHolder_HFmid").value;
                    }
                    //document.getElementById('menudiv').style.left = xmu + 'px';
                    //document.getElementById('menudiv').style.top = ymu + 'px';
                    $("#moreContextMenu").css("left", xmu - 110 + 'px');
                    $("#moreContextMenu").css("top", ymu + 6 + 'px');
                    $("#moreContextMenu").show();
                    //$(e).parent().addClass("ProjectSelectedmenu");
                    isMenu = true;
                    return false;
                }
//cancel edit project***********************
                function   CancelEditProject(e)
                {
                    $(e).parent().parent().html(contant_project);
                   $(e).parent().remove();
               }
//cancel edit item(title)********************
               function CancelEditItem(e)
                {
                    $(e).parent().parent().parent().html(contant_Item);
                    $(e).parent().remove();
                    cheakreturntitle();
               }
               //cheak the return show
               function cheakreturntitle() {
                   if (a_edit_title_ == true)
                       $(edit_title_selet).find(".ItemDueDateOuter").eq(0).show();
                   if (b_edit_title_ == true)
                      $(edit_title_selet).find(".FilterItemProjectDiv").eq(0).show();
               }
//cancel edit note****************************
                function CancelEditNote(e) {
                    $(e).parent().next().hide();
                    $(e).parent().remove();

                }
//cancel edit note work****************************
                function CancelEditNotework(e) {
                  $("#itemwork_" +$(e).attr("itemwork")).find(".divmyComment").hide(); 
                    $(e).parent().remove();
                  
                }

//save edit project ***********************
                function SaveEditProject(d)
                {
                    var e = {};
                    e.project_Id = $(d).attr("ProjectId");
                    e.user_code = $('#HFUserCode').val();
                    e.domain = $('#HFdomain').val();
                    e.contant = $(d).parent().find("#ProjectEditTextbox").val();
                    e.codeing = $("#hfcodeing").val();
                    ClientTodo.editContantProject(e, function (c) {
                        $(d).parent().remove();
                        $("#projectid_" + e.project_Id).find(".ProjItemContent").html(ReplaceURLWithHTMLLinks(e.contant, 20));
                        $("#projectid_" + e.project_Id).find(".ProjItemContent").attr("fullname", e.contant);
                        $(".CurrentProjectTitle").html(ReplaceURLWithHTMLLinks(e.contant, 50));
                        $("#Select_project option[value='" + $(d).attr("ProjectId") + "']").html(e.contant);
                        RequestEnded();
                        hidemenu();



                    })
                }

//save item ****************************
                function SaveEditItem(d)
                {
                    var e = {};
                    e.Item_Id = $(d).attr("itemId_");
                    e.domain = $('#HFdomain').val();
                    e.contant = $(d).parent().find("#ItemEditTextbox").val();
                    e.user_code = $('#HFUserCode').val();
                    e.codeing = $("#hfcodeing").val();
                    ClientTodo.editContantItem(e, function (c) {
                        $(d).parent().remove();
                        $("#Item_" + $(d).attr("itemId_")).find(".ItemContentDiv").eq(0).html(ReplaceURLWithHTMLLinks(e.contant, e.contant.length+10));
                        RequestEnded();
                        hidemenu();
                    })
                    cheakreturntitle();
                }

//save comment****************************
                function SaveEditNote(d)
                {
                    var e = {};
                    e.Item_Id = $(d).attr("itemId_");
                    e.domain = $('#HFdomain').val();
                    e.comment = $(d).parent().parent().find(".divComment").html()
                    e.user_code = $('#HFUserCode').val();
                    e.codeing = $("#hfcodeing").val();
                    ClientTodo.editcommentItem(e, function (c) {
                        $(e).parent().next().hide();
                        $(e).parent().remove();
                        var kk = $("#Item_" + $(d).attr("itemId_"));

                        if ($(d).parent().next().html() == "" || $(d).parent().next().html() == "<br>") {
                            kk.find(".ItemNotesBtn").removeClass("icon_notes_full").addClass("icon_notes");
                        } else {
                            kk.find(".ItemNotesBtn").removeClass("icon_notes").addClass("icon_notes_full");
                        }
                        RequestEnded();
                        hidemenu();
                        CancelEditNote(d);
                    })
                }

//save comment work ****************************
                function SaveEditNotework(d)
                {
                    var e = {};
                    e.Item_Id = $(d).attr("itemwork");
                    e.domain = $('#HFdomain').val();
                    e.comment = $("#itemwork_" + $(d).attr("itemwork")).find(".divmyComment").html();
                    ClientTodo.editcommentwork(e, function (c) {
                        $(e).parent().next().hide();
                        $(e).parent().remove();
                        RequestEnded();
                        hidemenu();
                        CancelEditNotework(d);
                    })
                }


//Project Edit KeyDown **********************
                function ProjectEditKeyDown(c, d) {
                    if (typeof c != "undefined" && c.keyCode == 13 && c.shiftKey != 1) {
                        SaveEditProject(d);
                        return false;
                    }
                }
//Item Edit KeyDown*************************
                function ItemEditKeyDown(c, d) {
                    if (typeof c != "undefined" && c.keyCode == 13 && c.shiftKey != 1) {
                        SaveEditItem(d);
                        return false;
                    }
                }
//remove Priority********************
                function removePriority(itema_) {
                    $(itema_).find(".ItemContentDiv").eq(0).removeClass("Prioritycontant_1").removeClass("Prioritycontant_2").removeClass("Prioritycontant_3").removeClass("Prioritycontant_4").removeClass("Prioritycontant_5");

                }
//remove ItemDueDateInner_pp********************
                function removeItemDueDateInner(itema_) {
                    $(itema_).find(".ItemDueDateInner").eq(0).removeClass("ItemDueDateInner_pp0").removeClass("ItemDueDateInner_pp1").removeClass("ItemDueDateInner_pp2").removeClass("ItemDueDateInner_pp3");

                }


//******************************************
                function ReplaceURLWithHTMLLinks(c,size) {
                    var c = c.replace(/(\b(https?|ftp|file|notes|ftps):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='blank' class='itemTextLink'>$1</a>"), e = $("<div/>");

                    if (c.length > size)
                        c = c.substr(0, size) + "..."
                
                    return c
                }

                //************************
                function ShowDoneItems() {

                    var e = {};
                    e.domain = $('#HFdomain').val();
                    e.project_id = select_project_menu;
                    e.user_code = $('#HFUserCode').val();
                    e.codeing = $("#hfcodeing").val();
                    ClientTodo.showdoneItem(e, function (c) {
                        $("#DoneItemListPlaceholder").html("");
                        for (f = 0; f < c.d.length; f++) {    
                            DoneLista = new DoneList(c.d[f])
                            DoneLista.AddNewDone();
                        }
                        if (c.d.length != 0)
                            DoneLista.cheakChildrenDoneItem();
                       
                        RequestEnded();
                        hidemenu();
                        $("#DoneItemsShowLink").hide();
                        $("#DoneItemsHideLink").show();
                        call_height();
                    })


                 
                }
                //***************************
                function HideDoneItems() {
                    $("#DoneItemListPlaceholder").html("");
                    $("#DoneItemsShowLink").show();
                    $("#DoneItemsHideLink").hide();

                }

                //***************************
                function sorting_item(sort_) {
                    var e = {};
                    e.project_Id = left_selected;
                    e.domain = $('#HFdomain').val();
                    e.sort = sort_;
                    if (left_selected == "today") {
                        $('.baseli_today').click();

                    } else if (left_selected == "next") {
                        $('.baseli_next').click();

                    } else if (left_selected == "search") {
                        $('#btn_search').click();
                    } else {
                        project_seleted($("#projectid_" + e.project_Id));
                    }
                }


                //******************
                function project_seleted(this_) {
                    $("#txtseach").val("");
                    select_project_menu = $(this_).attr("id").replace("projectid_", "");
                left_selected = select_project_menu
                $("#AddNewItemDiv").show();
                $(".ProjectSelected").removeClass("ProjectSelected");
                $(this_).children().addClass("ProjectSelected");

                if ($(this_).find("#ProjectEditDiv").length == 0) {
                  
                    $(".CurrentProjectTitle").html($(this_).find(".ProjItemContent").attr('fullname'));
                    var e = {};
                    e.project_Id = select_project_menu;
                    e.domain = $('#HFdomain').val();
                    e.sort = $(".ProjectActions").attr("sort");
                    e.user_code = $('#HFUserCode').val();
                    e.codeing = $("#hfcodeing").val();
                    // $("#projectid_" + select_project_menu).css("background-color", "#0093D9");
                    ClientTodo.getAllItem(e, function (c) {
                        $("#mainitemlist").html("");
                        for (f = 0; f < c.d[0].length; f++) {
                            ProjectList = new ItemList(c.d[0][f]);
                            ProjectList.AddNewItem();
                        }
                        if (c.d[0].length != 0)
                            ProjectList.cheakChildren();
                        RequestEnded();
                        $("#DoneItemListPlaceholder").html("");
                        set_doneItem(c.d[1]);
                        $("#DoneItemsDiv").show();
                        call_height();
                    })
                }
            }
                //*************************
                function DeleteDoneItems() {
                    if (!confirm($("#hddelete").val()))
                    { return false; } else {
                        var e = {};
                        e.domain = $('#HFdomain').val();
                        e.project_id = select_project_menu;
                        e.user_code = $('#HFUserCode').val();
                        e.codeing = $("#hfcodeing").val();
                        ClientTodo.deletedoneItem(e, function (c) {

                            $(".baseli_Recycle").find(".ListCountTodo").html(parseInt($(".baseli_Recycle").find(".ListCountTodo").html()) + parseInt(c.d)).show();
                            $("#DoneItemsCount").html("0");
                            RequestEnded();
                            hidemenu();
                            $("#DoneItemsShowLink").hide();
                            $("#DoneItemsHideLink").show();
                            $("#DoneItemListPlaceholder").html("");
                        })

                    }

                }
              
                    function PrintMainArea() {
                        var c = $("#MainContentArea").clone(), e = $("#printFooter").clone();
                        c.addClass("printable");
                        c.find(".handle").hide();
                        c.find(".DragHandlerTop").hide();
                        c.append(e);
                        c.printElement({ leaveOpen: 1, printMode: "popup", pageTitle: "RaveshCrm" })
                    }

/*********New***/
                 //function getListParametrManage(mode) {
                 //       var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: { mode: mode } };
                 //       $.ajax({
                 //           type: "POST", url: "../webservices/parametr_manage.asmx/get_list",
                 //           data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                 //           success: function (c) {
                 //               if (c.d[0] == "success") {
                 //                   setOptionDrdListParameter(c.d[1]);
                 //               }
                 //           }
                 //       });
                 //}

                 //function setOptionDrdListParameter(data) {
                 //    var selectedOpt = $("#DrdListParametrTodo");
                 //    selectedOpt.html($('<option>').val(0).text(''));
                 //    $.each(data, function (i, item) {
                 //        selectedOpt.append($('<option>').val(item[0]).text(item[1]));
                 //    });
                 //}
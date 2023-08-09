     
 //------------------------------------------------- document ready

        var varnextwrapper = 0;
        var mode_wrapper;
        var click_bol = false;
        var click_sms=false;
        var editable = false;  // if customer edit = true
        var search_enter = false;
        var saveType_reload=true;
        var cus_add_tag='';
        var var_new_=false;
        var var_searach_property='';
         var link_search_click=false;  // zamni ke linke jostejuye pishrafte click shavad
        var varbtn_serachAdvanced=false; // zavani ke searvh jostejuye pishraft click shavad
        var var_link_edit_search=false; //zamani ke link edit serach zade shavad
        var group_add_inupdate = [];
        var group_delete_inupdate = [];
        var Switchery_;
        var CA;

        $(document).ready(function () {

            $('.advance_search_body').keypress(function (e) {
                if (e.keyCode == '13') {
                    e.preventDefault();
                }
            });
           
            $(".Search_quick").hide();
            init_cus();
            $("#groupSerchMerg").buttonset();
               // تنظيم حداقل بصورت پويا
	        /*-------------*/
	        var dateFormat = "mm/dd/yy";
	        if (translate._calander =='en')
	        {$('#ctl00_ContentHolder_search_From_date').datepicker({regional: '',  dateFormat: 'mm/dd/yy',onSelect: function(dateText, inst){var the_date = $.datepicker.parseDate(dateFormat,dateText);$('#ctl00_ContentHolder_search_to_date').datepicker('option', 'minDate', the_date)}});
	                $('#ctl00_ContentHolder_search_to_date').datepicker({regional: '',  dateFormat: 'mm/dd/yy'});
	        }else{$('#ctl00_ContentHolder_search_From_date').datepicker({onSelect: function(dateText, inst) {$('#ctl00_ContentHolder_search_to_date').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
	            }});$('#ctl00_ContentHolder_search_to_date').datepicker();}
	           $('p.ui-widget-content').hover(function() { $(this).addClass('ui-state-hover'); }, function() { $(this).removeClass('ui-state-hover'); });
             /*-------------*/
	
           
            set_customer_field_new();
               $('#ctl00_ContentHolder_hierarchybreadcrumb5').menuA({content:    $('#ctl00_ContentHolder_hierarchybreadcrumb5').next().html(),backLink: false});
             

               $(".navigationAddress").live("click", function () {
                   var from_ = $('#ctl00_ContentHolder_HMyCompanyAddress').val();
                   var to_ = $(this).parent().next().text();
                 
                   InitializeMap(from_, to_);
                   
               });

               $(".map_markerAddress").live("click", function () {
                   var to_ = $(this).parent().next().text();
                   InitializeMap("", to_);
               });
          
            ///*************************************************************map
               if ($("#hfGoogleMap").val()== "true"){
                   if (typeof (google) != "undefined") {

                       var directionsDisplay;
                       var directionsService = new google.maps.DirectionsService();
                       var map = null;



                       function InitializeMap(from_, to_) {
                           if ($("#hfGoogleMap").val() == "true") {
                           if (typeof (google) == "undefined") {
                               alert("google is not available");
                               return false;
                           }
                           $("#mapcalcRoute").remove();
                           var mapContainer = $("<div id='mapcalcRoute'><div id='div_printMap'  class='Crm-icon Crm-icon16-grid Crm-icon-print-16' ></div><div id='mapcalcRouteContact'><div id='googleMapPlace' ></div><div id='googleMapPlace_directionpanel'></div></div></div>");
                           //

                           mapContainer.dialog({
                               dialogClass: "topOverAll",
                               modal: false,
                               width: 745,
                               height: 500,
                               resizable: true
                               //,  resize: function (event, ui) {
                               //       $(mapContainer).find("#googleMapPlace").width($(this).width());
                               //      google.maps.event.trigger(map, 'resize');
                               //  }
                           })

                           var latlng = new google.maps.LatLng(0, 0);

                           var mapProp = {
                               center: latlng,
                               zoom: 11,
                               mapTypeId: google.maps.MapTypeId.ROADMAP
                           };



                           map = new google.maps.Map($(mapContainer).find("#googleMapPlace").get(0), mapProp);

                           if (from_.trim() == "") {
                               $(mapContainer).find("#googleMapPlace").width('700px');
                               FindLocaiton(to_)
                           } else {
                               calcRoute(from_, to_, mapContainer)
                           }

                       }

                       }



                       function calcRoute(from_, to_, mapContainer) {
                           if (typeof (google) == "undefined") {
                               alert("google is not available");
                               return false;
                           }
                           directionsDisplay = new google.maps.DirectionsRenderer();
                           directionsDisplay.setMap(map);
                           directionsDisplay.setPanel($(mapContainer).find("#googleMapPlace_directionpanel").get(0));


                           var request = {
                               origin: from_,
                               destination: to_,
                               travelMode: google.maps.DirectionsTravelMode.DRIVING
                           };
                           directionsService.route(request, function (response, status) {
                               if (status == google.maps.DirectionsStatus.OK) {
                                   directionsDisplay.setDirections(response);
                               }
                               else {
                                   $("#mapcalcRoute").prepend("Unable to retrieve your route<br />");
                                   FindLocaiton(to_);
                               }
                           });

                       }



                       function FindLocaiton(address) {
                           if (typeof (google) == "undefined") {
                               alert("google is not available");
                               return false;
                           }

                           geocoder = new google.maps.Geocoder();
                           //In this case it gets the address from an element on the page, but obviously you  could just pass it to the method instead

                           geocoder.geocode({ 'address': address }, function (results, status) {
                               if (status == google.maps.GeocoderStatus.OK) {
                                   //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
                                   map.setCenter(results[0].geometry.location);
                                   var marker = new google.maps.Marker({
                                       map: map,
                                       position: results[0].geometry.location
                                   });

                                   var infowindow = new google.maps.InfoWindow({
                                       content: address
                                   });

                                   infowindow.open(map, marker);
                               } else {
                                   $("#mapcalcRoute").prepend("Geocode was not successful<br />");
                               }
                           });
                       }

                   }
               }
            ///*************************************************************map

           







      

             // show system filed customer
            $("#contact_system").live("click", function () {
                $(".text_tab").removeClass("selected");
                $(this).addClass("selected");
                $(".CustomFieldsContainer").hide();
                $(".CustomFieldsSystem").show();
                 $(".contant_group .tags").removeClass("selected2")
            });

            // show primery filed customer
            $("#contact_primery").live("click", function () {
                $(".text_tab").removeClass("selected");
                $(this).addClass("selected");
                $(".CustomFieldsContainer").show();
                $(".CustomFieldsSystem").hide();
              
                 $(".contant_group .tags").removeClass("selected2")

                $(".CustomFieldsContainer").slideUp('fast','easeOutQuart',function(){
                 $("#content_customer .CustomFieldsContainer").find("#feild_contant").children().show();
                 $("#content_customer .CustomFieldsContainer .ContactPanel").show();
                $("#content_customer .CustomFieldsContainer").find("[field_group=1]").hide();
                cheak_height($("#content_customer .CustomFieldsContainer"));
                cheak_hide_field();
                      $(".CustomFieldsContainer").slideDown();
               });
                
               
           });
           
           // show all field customer
            $("#contact_default").live("click", function () {
                $(".text_tab").removeClass("selected");
                 $(".contant_group .tags").removeClass("selected2");
                $(this).addClass("selected");
                $(".CustomFieldsContainer").show();
                $(".CustomFieldsSystem").hide();
                $("#content_customer .CustomFieldsContainer").find("#feild_contant").children().show();
                $("#content_customer .CustomFieldsContainer .ContactPanel").show();
                 cheak_height($("#content_customer .CustomFieldsContainer"));
            });

            //show filed customer with group
            $(".contant_group .tags").live("click", function () {
                $(".CustomFieldsContainer").show();
                $(".CustomFieldsSystem").hide();
              
                if ($(this).hasClass('selected2') == true) {
                    $(".text_tab").removeClass("selected");
                    $(".contant_group .tags").removeClass("selected2");
                    $("#contact_default").click();
                    return false;
                }
                var cdi_ = $("#content_customer .CustomFieldsContainer");
                $(".text_tab").removeClass("selected");
                $(".contant_group .tags").removeClass("selected2");
                 $(this).addClass("selected2");
               
                 cdi_.find("#feild_contant").children().hide();
                 cdi_.find("[in_group="+$(this).attr("group_code")+"]").show();
                 cdi_.find(".ContactPanel").show();
                 cheak_height($("#content_customer .CustomFieldsContainer"));
                 cheak_hide_field();

            });

            //logic company click ************* set in one
            $(".logic_company").live("click", function () {
              $("#top_link").show();
              saveType_reload=true;
               selected_customer($(this).attr("cus_code"));

            });


          
            // custmore select (click)****************************************************************************************
            function cheak_hide_field(){
             $("#content_customer .CustomFieldsContainer .ContactPanel").each(function (index) {
                    var bol_=false;
                    $(this).find("[field_group]").each(function (index) {
                        if ($(this).is(":visible")==true) bol_=true;
                    });
                    if (bol_==false) $(this).hide();
                    });
           }

            $("#cus_name").live("click", function () {
                show_cus_befor();
              
                var cus_code_ = $(this).attr("cus_code");
                $('#hdSected2CusCode').val(cus_code_);
                $('#ctl00_ContentHolder_hdSected2CusCodeServer').val(cus_code_);
                $('#ctl00_ContentHolder_hdSected2CusNameServer').val($(this).find("#cus_name_text").text());
                $(".CustomFieldsContainer").html("");
                $("#advanced_search").hide();
                var e = {};
                e.domain = $('#HFdomain').val();
                e.cus_code = cus_code_;
                e.islogic = false;
                e.user_code=$('#HFUserCode').val();
                e.codeing = $("#hfcodeing").val();
                e.rnd = $("#HFRnd").val();

             

                var cus_selected = $("#customer_" + cus_code_);
                $("#maincustomerList").hide();
                WidthContant(false);
                $("#content_customer").remove();
                var w = $(".contentCustomer").clone();
                w.attr("id", "content_customer")
                w.find(".code_head").html(cus_code_);
                w.find('#ctl00_ContentHolder_btnEdit').hide();
               // w.find('#btnEdit_sample').show();
                w.find('#ctl00_ContentHolder_btnDelete').hide();
              //  w.find('#btndelete_sample').show();
                
                Client.getCustomerInfo(e, function (c) {
                    customer_info = new customerList(c.d)
                    customer_info.setItem(w);
                    get_logic(cus_code_, c.d.code2, c.d.tag);
                    RequestEnded();
                })
                w.find("#head_cus_perfix").html(cus_selected.find("#cus_name_perfix").html()).attr("prefix_id",cus_selected.find("#cus_name_perfix").attr("prefix_id"));
                w.find("#head_cus_name").text(cus_selected.find("#cus_name_text").text());
                w.find("#head_cus_title").text(cus_selected.find("#cus_title").text());

                var head_cus_company = w.find("#head_cus_company")
                head_cus_company.html(cus_selected.find("#cus_company").html()).attr("cus_code2", cus_selected.find("#cus_company").attr("cus_code2")).attr("tag", cus_selected.find("#cus_company").attr("tag"));
                var aa = cus_selected.find(".marggroup .tags").clone();
                w.find(".contant_group").append(aa.show());
                
                w.find(".profileHeaderContant img").attr("src", cus_selected.find("img").attr("src"))
                if (cus_selected.find("img").attr("isimage") == "1")
                {
                    w.find(".profileHeaderContant img").css("height", "65px").addClass("nopading imageLargPreview").attr("isimage", "1");
                }else{
                    if (cus_selected.find("img").hasClass("img_person") == false) {
                        w.find(".profileHeaderContant img").addClass("img_company img_contant").attr("isimage", "0").hide();
                        w.find(".profileHeaderContant img").after("<div class='img_company img_contant divAfterimgCus Crm-icon Crm-icon16 Crm-icon-diagram'></div>");
                    } else {
                        w.find(".profileHeaderContant img").addClass("img_person img_contant").attr("isimage", "0").hide();
                        w.find(".profileHeaderContant img").after("<div class='img_person img_contant divAfterimgCus Crm-icon Crm-icon16 Crm-icon-customer'></div>");
                    }
                }
                
                
               
                

                var rating_ = cus_selected.attr("rating", this.rating);
                var sre_reating = "";
                for (z = 0; z < 5; z++) {
                    if (rating_ != 0) {
                        sre_reating = sre_reating + '<i class="starImage filledStar fas icon-star"></i>';
                        rating_ = rating_ - 1;
                    } else {
                        sre_reating = sre_reating + '<i class="starImage emptyStar icon-star"></i>';
                    }

                }
                w.find(".ContactStarWidget").html(sre_reating).attr("rating",cus_selected.attr("rating", this.rating));
                var per_info_ = '';
                var bol_tel = false;
                cus_selected.find(".primary span").each(function (index) {
                    if ($(this).attr("mode") == 'tel') {
                        //set tel
                        per_info_ = per_info_ + '<div>' + $(this).attr("val").split("|*|")[0] + '</div>'
                        bol_tel = true;
                    }
                    if ($(this).attr("mode") == 'email') {
                        //set tel
                        per_info_ = per_info_ + '<div>' + emaillink(cus_code_, 1, $(this).attr("val").split("|*|")[0], $(this).attr("code_p")) + '</div>';

                    }

                    //                    if ($(this).attr("mode") == 'address') {
                    //                        //set tel
                    //                        '<div></div>';
                    //                    }


                });
                if (bol_tel == false) {
                    cus_selected.find(".primary span").each(function (index) {
                        if ($(this).attr("mode") == 'mobile') {
                            //set tel
                            //per_info_ = per_info_ + '<div><a href="#" onclick="smssend(' + cus_code_ + ',1);return false;">' + $(this).attr("val").split(",")[0] + '</a></div>';
                            per_info_ = per_info_ + '<div>' + smslink(cus_code_, 1, $(this).attr("val").split("|*|")[0], '4') + '</div>';
                            bol_tel = true;
                        }
                    });
                }

                var ca_=cus_selected.find("#cus_activity span");
                if (ca_.length != 0)
                {

                    ca_.each(function(index) {
                      per_info_+= '<div class="head_cus_activity" activity_code='+$(this).attr("activity_code")+' activity_id='+$(this).attr("activity_id")+'>'+ $(this).html()+'</div>';
                    });

                }

                w.find(".Wrapperinfo").after($("<span>").attr("title", translate.comments).addClass("CustomerCommenting"));


                w.find(".Wrapperinfo").append(jQuery(per_info_))
                $(".cp_contant").append(w);
             
                $("#commentComponentCustomer").commentComponent("setCode", cus_code_, w.find("#head_cus_perfix").text() + ' ' + w.find("#head_cus_name").text());
                $('html, body').animate({ scrollTop: 45 }, { duration: 400, queue: false });
                $(".infomenu").html("").css("top", 0).show().removeClass("selected");

                var cus_code2 = head_cus_company.attr("cus_code2");
                var tag = head_cus_company.attr("tag");
              
            });




            // tab click ******************************************************************************************************
            $("#content_customer .tab").live("click", function () {
                funselect_tabs($(this).attr("id"),"");
            });


            // back list click*******************************************************************************************************
            $(".bckToList").click(function () {
               backto_one();
                 if (varbtn_serachAdvanced==true){
                    $(".link_search").click();
                 }
            });

            function backto_one() {
                WidthContant(true);
             $(".bckToList").hide();
                $(".mr_add").show();
                click_bol = false;
                $(".infomenu").html("").css("top", 0).show();
                $("#div_left").show();
                $("#div_right").css("width", "85%");
                $(".cpanel_wrap1").removeClass("border_none").find(".contentCustomer").remove();
                if ($(".cpanel_wrap1 #maincustomerList").length <= 0)
                    $(".cpanel_wrap1").append('<ul id="maincustomerList"></ul>');
                $("#Pagination").show();
                $(".results").show();

                if (editable == false) {
                    $("#maincustomerList").show().find(".selected").removeClass("selected");
                    $(".infomenu").hide();
                } else {
                    //get all customer
                    $("#maincustomerList").remove();
                    init_cus();
                }

                $(".search").show();
                 $("#contant_search").remove();

            }

           

            // infomenu Close *********************************************************************************************
            $(".infomenuClose").live("click", function () {
                $(".cpanel_wrap2").hide(500);
                $(".contantlist").removeClass("selected");
                $(".infomenu").removeClass("selected").empty();
                $(".cpanel_wrap1.cp_contant").animate({ width: '99%' });
              
            });

            // li click ****************************************************************************************************
            $(".contantlist").live("click", function () {
                if (click_bol != true) {
                    $(".bckToList").hide();
                    $(".contantlist").removeClass("selected")
                    $(this).addClass("selected");
                    $(".cpanel_wrap2").show();
                    var app = $(".infomenu");
                    app.html("");
                    app.addClass("selected").css("display", "block").css("position", "absolute");
                    var cus_id = $(this).attr("id").replace("customer_", "");
                    app.append("<i class='icon-times left infomenuClose'></i>")
                    app.append("<span>"+translate.cod_customer+"</span>");
                    app.append("<span class='color_black'>" + cus_id + "</span>");

                    var cus_name =  " " + $(this).find("#cus_name_perfix").html() + " " + $(this).find("#cus_name_text").html();
                    app.append("<div class='name color_black marg_26'>" + cus_name + "</div>");


                    app.append("<div class='color_black marg_26'>" + $(this).find("#cus_title").html() + "</div>");


                    app.append("<div class='color_black marg_26'>" + $(this).find("#cus_company").html() + "</div>");
                    
                    var acr=$(this).find("#cus_activity span");
                    if (acr.length != 0){
                        app.append('<div>'+translate.activity+'</div>');
                        var s_acr='';
                        jQuery.each(acr, function () {
                            s_acr+= '<div class="color_black marg_26" activity_code='+$(this).attr("activity_code")+'>'+$(this).html()+'</div>';
                        });
                         app.append(s_acr);
                    }
                    

                    var cus_areacode=$(this).attr("cus_areacode");
                    var pre_ = $(this).find(".primary span");
                    if (pre_.length != 0) {
                        var call = "";
                        pre_.each(function (index) {

                            if ($(this).attr("val") != undefined && $(this).attr("title") != undefined) {

                                app.append("<div>" + $(this).attr("title") + "</div>");
                                var mode_ = $(this).attr("mode");
                                var icon_ = "";
                                var none_ = "";

                                if (mode_ == "fax") {
                                    icon_ = '<span class="ui-icon ui-icon-fax icon_infomenu right"></span>';
                                    none_ = " marg_26";
                                    call = "";
                                } else if (mode_ == "tel") {
                                    icon_ = '<span class="ui-icon ui-icon-tel icon_infomenu right"></span><div class="icon_contact icon_contact_call" style="display:none;"><span class="ui-icon ui-icon-telcall icon_infomenu left cursor"  style="margin:0px;"></span></div>';
                                    none_ = " marg_26";
                                } else {
                                    none_ = " marg_26";
                                }
                                if ($(this).attr("val")!=undefined){

                               
                                var val_ = $(this).attr("val").split("|*|");
                                for (z = 0; z < val_.length; z++) {
                                    if (mode_ == "email" || mode_ == "email_field") {

                                        //val_[z] = '<a href="#" onclick="emailsend(' + cus_id + ',' + (z + 1) + ');return false;">' + val_[z] + '</a>';
                                        val_[z] = emaillink(cus_id, (z + 1), val_[z], $(this).attr("code_p"));
                                        icon_ = '<span class="ui-icon ui-icon-mail-closed icon_infomenu right"></span>';
                                        call = "";
                                    } else if (mode_ == "mobile") {

                                        call = " class='call' CallsItem='" + val_[z] + "' callmode='mobile' callarea='' cuscode='"+cus_id+"' ";
                                        // val_[z] = '<a href="#" onclick="smssend(' + cus_id + ',' + (z + 1) + ');return false;">' + val_[z] + '</a>';
                                        var mn=val_[z];
                                        val_[z] = smslink(cus_id, z + 1, val_[z], $(this).attr("code_p"));
                                        icon_ = '<span class="ui-icon ui-icon-mobile icon_infomenu right"></span><div class="icon_contact icon_contact_call" style="display:none;"><span class="ui-icon ui-icon-telcall icon_infomenu left cursor" style="margin:0px;"></span></div>' + 
                                        '<div onclick="click_sms=true;qucikSendSms(\'' + cus_id + '\',\''+ mn + '\');return false;" class="icon_contact icon_contact_sms"  style="display:none;"><span class="Crm-icon Crm-icon16 Crm_icon_mobile_sms" style="margin:0px;"></span></div>';

                                    } else if (mode_ == "tel") {
                                        call = " class='call' CallsItem='" + val_[z] + "' callmode='tel' cuscode='"+cus_id+"' callarea='"+cus_areacode+"'";
                                        val_[z]= check_area_code(val_[z],cus_areacode);
                                       
                                    } else if (mode_ == "fax") {
                                        val_[z] = faxLink(cus_id, val_[z]);

                                    }
                                    if ($(this).attr("vType") == 9) {
                                        val_[z] = customeShowInfoLink(val_[z], $(this).attr("customerSelectedName").split("|*|")[z]);
                                    } else if ($(this).attr("vType") == 10) {
                                        val_[z] = factorShowInfoLink($(this).attr("factorId").split("|*|")[z], val_[z]);
                                    }

                                    app.append("<div" + call + ">" + icon_ + "<div class='color_black" + none_ + "' style='direction: ltr;'>" + val_[z] + "</div></div>");
                                }

                             }

                            } //end if

                        }); // end each
                    } //end if



                    app.append("<div class='merq_a'><div style='float: right;'>" + $(this).attr("createDate") + "</div><div style='text-align: left;'>" + $(this).attr("owner") + "</div></div>");

                    var merq_ = $("#merq_btn").clone();

                    // send email all****************************************************************************
                    merq_.find("#merq_email").unbind().bind('click', function () {
                        emailsend(cus_id, 0, "0"); return false;
                    });

                   
                    //send sms all*******************************************************************************
                    merq_.find("#merq_sms").unbind().bind('click', function () {
                      // smssend(cus_id, 0, '4'); return false;
                        var mobileList_s = new Array();
                        $(".infomenu").find('[callmode=mobile]').each(function(index){
                           mobileList_s.push($(this).attr('callsitem'));

                        });

                        qucikSendSms(cus_id,mobileList_s.join(",")); return false;
                  

                    });

                    // log**************************************************************************************
                    merq_.find("#merq_tiket").unbind().bind('click', function () {
                        //$("#div_loger").show();
                        //var toploger_ = ((($(window).height() - $('#div_logerbody').height()) / 2) + 20) + $(window).scrollTop();
                        //if (toploger_ <= 0) toploger_ = $(window).scrollTop() + 150;
                        //$("#div_logerbody").css("top", toploger_);
                        //$("#iframe1Alog").attr('src', 'log.aspx?cuscode=' + cus_id + '&mode=4&cusname=' + cus_name + '&rnd_=' + $("#ctl00_txtRnd").val());
                        LogUC(cus_id);
                    });


                    // reminder*********************************************************************************
                    merq_.find("#merq_reminder").unbind().bind('click', function () {
                        $('#hdSectedCusCode').val(cus_id);
                        $("#dialog21").dialog("open");
                        $('#div_dataframe1').mask("Loading...");
                    });

                   // event*********************************************************************************
                    merq_.find("#merq_event").unbind().bind('click', function () {
                        $('#hdSectedCusCode').val(cus_id);
                          $('[name="eventframe1"]').hide();
                          Event_Add_WU(cus_id, "", "", translate.event,true);
                           $('[name="eventframe1"]').show();
                         $("#div_eventframe1").mask("Loading...");
                    });



                    app.append(merq_);
                    //
                  if  ($(".infomenu").height()>$("#maincustomerList").height()) $("#maincustomerList").height($(".infomenu").height());



                    //*****************************************************************************************scroll

                    var a = $(this).position().top
                    var b = $('.infomenu').height();
                    var c = $(".cpanel_wrap1").height();
                    var topi_;

                    if ((a + b) > c) {
                        topi_ = (c - b) - 10;

                    } else {
                        topi_ = a;
                    }
                 
                    $(".infomenu").animate({ top: topi_ }, { duration: 500, queue: false });
                    $(".cpanel_wrap1.cp_contant").animate({width:'73%'});
                   

                    //***************************************************************************************

                } else {
                    //show logic primary
                    $(".infomenu .logicprimary").hide();
                    $(this).find(".logicprimary").fadeIn();
                }
            });  // end of li click




            $("#dialog21").dialog({
                bgiframe: true,
                modal: true,
                autoOpen: false,
                width: 720,
                height: 550,
                open: function (event, ui) {
                //    window.frames['dataframe1'].window.location.replace('remidner_box.aspx?cuscode=' + $('#hdSectedCusCode').val() + '&cusname=' + $(".title_header").text() + '&rnd_=' + $("#ctl00_txtRnd").val());
                  $('#div_dataframe1').html("");
                      $("#dialog21").mask("...");
                  var e = {};
                  e.control = '~/controls/reminder_uc.ascx';
                    e.Code=$('#hdSectedCusCode').val();
                    e.CustomerCode = $('#hdSectedCusCode').val();
                    e.Mode = 1;
                    $.ajax({
                        type: "POST",
                        url: "../pages/server_load_usercontrol.aspx/Get_usercontroler_reminder",
                        data: JSON.stringify(e),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (c) {
                            $('#div_dataframe1').html(c.d);
                              $("#dialog21").unmask();

                             $('.DivEditorRem').show();
                            Ed_detail_UcRem[0].disable(false).refresh();
                        }
                    });
                
                }
            });
             


            //            //drop dawn 
            //            // Toggle the dropdown menu's
            //            $(".dropdown .button, .dropdown button").click(function () {
            //                if (!$(this).find('span.toggle').hasClass('active')) {
            //                    $('.dropdown-slider').slideUp();
            //                    $('span.toggle').removeClass('active');
            //                }

            //                // open selected dropown
            //                $(this).parent().find('.dropdown-slider').slideToggle('fast');
            //                $(this).find('span.toggle').toggleClass('active');

            //                return false;
            //            });

            //            // Launch TipTip tooltip
            //            $('.tiptip a.button, .tiptip button').tipTip();



            //***************************************************************************
            $('.ContactEntitiesView .ContactPanel,.ContactEntitiesView .TextTabContant').live("mouseenter", function () {
                $(this).prepend('<div id="div_print" class="Crm-icon Crm-icon16-grid Crm-icon-print-16" ></div>');

            }).live("mouseleave", function () {
                $(this).find("#div_print").remove();
            });
            //***************************************************************************
          
            $('.call').live("mouseenter", function () {
                $(this).find(".icon_contact").show();

            }).live("mouseleave", function () {
                $(this).find(".icon_contact").hide();
            });

            //**************************************************************************
            $("#div_print").live("click", function () {
                var p_ = $(this).parent().clone();

                if (p_.hasClass("TextTabContant")) {
                    p_ = $(this).parent().parent().clone();
                    p_.find(".TextTabContant").remove();

                } else {
                    p_.removeClass("col2");
                }
                p_.prepend($(".name_title").eq(0).clone());
                p_.find(".name_title").addClass("title_print");
                p_.printElement({ leaveOpen: 1, printMode: "popup", pageTitle: "Crm" });

            });
  //**************************************************************************
            $("#div_printMap").live("click", function () {
                var p_ = $(this).parent().clone();
                p_.find("#div_printMap").remove();
                p_.removeClass("ui-dialog-content").removeClass("ui-widget-content");
                  p_.printElement({ leaveOpen: 1, printMode: "popup", pageTitle: "Crm" });
            
            });

          
            //calling tel******************************************************************
            $(".icon_contact_call").live("click", function () {
                if (click_sms == false) {
                    
                    var e = {};
                    var par_=$(this).parent();
                    e.tel = par_.attr("CallsItem");
                    //e.dakheli = $('#ctl00_ContentHolder_Hdakheli').val();
                    //e.ip = $('#ctl00_ContentHolder_Hip').val();
                    //e.azad = $('#ctl00_ContentHolder_Hazad').val();
                    //e.fromcode=$('#ctl00_ContentHolder_Hdaearcode').val();
                    e.mode=par_.attr("callmode");
                    e.tocode=par_.attr("callarea");
                    //e.areanumber_check=$('#ctl00_ContentHolder_areanumber_check').val();
                    //e.domain_= $('#HFdomain').val();
                    if (par_.attr("cuscode")==undefined){
                            e.cuscode=$('#hdSected2CusCode').val();
                    }else{
                            e.cuscode=par_.attr("cuscode");
                    }
                    //e.user_code=$('#HFUserCode').val();
                    //message(resources.conntIvr,false,4000,false);

                    //Client.calling(e, function (c) {
                    //    message(c.d,false);
                    //    RequestEnded();
                    //    })
                    StartCallOut(e.tel, e.tocode, e.mode, e.cuscode);
                 }
                click_sms=false;
            });


            $('#rblCartablType').change(function () {
                if ($('#rblCartablType input:checked').val() == 1) {
                    // is customer
                    $('#lblforcustomer').hide();
                    $('#blforcompany').show();
                } else {
                    //is company
                    $('#lblforcustomer').show();
                    $('#lblforcompany').hide();
                }
                $("#divattachcus").show();
                $("#btntype").show();
                clearattachCus("", "");
            });

            $("#txtAttachCus").keypress(function (event) {
                if (event.which == 13) {
                    $("#btnSearchAttachCust").click();
                    event.preventDefault();
                }

            });

         $("#btnSearchAttachCust").click(function(){
                search1($("#HFdomain").val());
    
         });

            // save type
            $('#btn_savetype').live("click", function () {
                if (saveType_reload==true){
                    var e = {};
                    e.domain = $('#HFdomain').val();
                    var code_att=$('#hdSected2CusCode').val();
                    e.cus_code = code_att;
                    var tag__=$('#rblCartablType input:checked').val();
                    e.tag = tag__;
                    var code2_att=$("#hdattachCus2_code").val();
                    e.cus_code2 = code2_att;
                    e.user_code=$('#HFUserCode').val();
                    e.codeing = $("#hfcodeing").val();
                    e.rnd = $("#HFRnd").val();
                    $("#btntype").mask("...");
                    Client.settag(e, function (c) {
                        //back 
                        $("#btntype").unmask();
                        RequestEnded();
                        $("#dialog2").dialog("close");
                        $("#divattachcus").hide();

                        if (tag__ == "1"){
                            $("#maincustomerList").find("#customer_"+code_att+" #cus_company").attr("tag","1").attr("cus_code2",code2_att).html($("#lblattachCus").html());
                        }else{
                            $("#maincustomerList").find("#customer_"+code2_att+" #cus_company").attr("tag","2").attr("cus_code2", code_att).html($("#head_cus_perfix").html() + " " + $("#head_cus_name").html());
                        }


                        var e = {};
                        e.domain = $('#HFdomain').val();
                        e.cus_code = $('#hdSected2CusCode').val();
                        e.islogic = false;
                        e.user_code=$('#HFUserCode').val();
                        e.codeing = $("#hfcodeing").val();
                          e.rnd=$("#HFRnd").val();
                        Client.getCustomerInfo(e, function (c) {
                            $("#maincustomerList").hide();
                            WidthContant(false);
                            $("#content_customer").remove();
                            var w = $(".contentCustomer").clone();
                            w.attr("id", "content_customer")
                            customer_info = new customerList(c.d)
                            customer_info.setcontent(w);
                            customer_info.setItem(w);
                            $(".infomenu").html("");
                            get_logic(c.d.code, c.d.code2, c.d.tag);
                            RequestEnded();
                        });
                    });
                }else{
                     if ( $('#HDisCompany_edit').val()=="true"){
                     //is company
                        var cop__=$("#contant_Edit");
                        fun_add_customer_logic($("#hdattachCus2_code").val(),$("#hdattachCus2_name").val(),$("#contant_Edit"),cop__);
                         cop__.find("#divtag_edit_logic_customer").show();
                         cop__.find("#link_add_person_clone").remove();
                        saveType_reload=false;

                     }else{
                     //is peson
                        $('#HDEdit_CusCode2').val($('#hdattachCus2_code').val());
                        $('#contant_Edit').find('#lblcompany_name').html($("#lblattachCus").html()).attr("cus_code2",$('#hdattachCus2_code').val());
                        $('#contant_Edit #divtag_edit_logic_company').show();
                        saveType_reload=true;
                     }

                        $("#dialog2").dialog("close");
                }
            }); //end save type


            // BaseLi click****************
            $("#div_left .BaseLi").live("click", function () {
                var ico;
                close_advanced_search();
                $('#HDsearch_quick').val("");
                $("#txtSearch").val("");
                $("#div_left  .BaseLi").each(function (index) {
                    ico = $(this).attr("ico");
                    $(this).removeClass("select_list").find(".Crm-icon").removeClass("fas").removeClass(ico).addClass($(this).attr("ico") + "-black");
                    $(this).find(".countitem").html("");
                });
                $(this).find(".Crm-icon").addClass("fas");
                //if ($(this).attr("send_") == "ReferredTo") {
                //    $(".link_search").hide();
                //} else {
                //    $(".link_search").show();
                //}
                //save search click
                    var e = {}; var send_ = {};
                    e.domain =$('#HFdomain').val();
                    e.user_code = $('#HFUserCode').val();
                    e.codeing = $("#hfcodeing").val();
                    if ($(this).attr("send_")=="search"){
                       e.id = $(this).attr("search_id");
                    }else{
                        e.id = $(this).attr("send_");
                    }
                    send_.items = e;
                    Client.save_search_click(send_, function (c) {
                    });
             
             
          

                ico = $(this).attr("ico");
                $(this).addClass("select_list");
                $(this).find(".Crm-icon").addClass(ico).removeClass(ico + "-black");

                if ($(this).attr("send_")=="search"){
                    //ersale property advanced into search tttttttttttttttttt
                    $('#btnsearch').trigger("myclick",$(this).attr('property_'));
                    $("#menu_advancedsearch").show();
                    
                }else{
                    $("#menu_advancedsearch").hide();
                     $('#ctl00_ContentHolder_HDintPage').val(1);
                    get_cuslist(true, 0, $(this).attr("send_"),"",false,"");
                }

               
                $(".clear_search").hide();
                $(".infomenu").html("").css("top", 0).hide().removeClass("selected");
                $("#maincustomerList").css("height","");
            });


            //autocomplete 

            $("#txtSearch").autocomplete({
                source: function (request, response) {

                    var e = {};
                    e.q = $('#txtSearch').val();
                    e.domain = $('#HFdomain').val();
                    e.a = $('#ctl00_ContentHolder_HDaccess').val();
                    e.g = $('#ctl00_ContentHolder_HDg').val();
                    e.user_code = $('#HFUserCode').val();
                    e.r = $("#HFRnd").val();

                    jQuery.ajax({
                        type: "POST",
                        url: "SearchHandler.ashx",
                        data: e,
                        success: function (e, xhr) {
                            response(e);
                        }, dataType: "json"
                    });

                },


                minLength: 3,

                focus: function (event, ui) {
                    $("#txtSearch").val(ui.item[0]);
                    return false;
                },
                select: function (event, ui) {
                    //                    $("#aa").html(ui.item.label);
                    close_advanced_search();
                    selected_customer(ui.item[1]);
                    $("#txtSearch").val("");
                    $(".search").hide();
                    $(".clear_search").hide();
                    return false;
                },
                open: function () {
                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                    $(".clear_search").show();
                    var autocomplete = $(".ui-autocomplete");
                    var oldTop = autocomplete.eq(1).offset().left;
                    var newTop = oldTop - 9;
                    autocomplete.eq(1).css("left", newTop);
                    // $(this).css('width', $(this).parent().width()).css('left', $(this).css('left') + 29);
                },
                close: function () {
                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                }
            }).data("autocomplete")._renderItem = function (ul, item) {
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a class='autocompleteSearchCurent'><div class='autocompleteSearch'>" + item[0] + "</div><div class='right com autocompleteextraSearch' title='" + item[3] + "'>" + item[2] + "</div><div class='left com'>" + item[1] + "</div></a>")
                    .appendTo(ul);
            };

            $("#txtSearch").keypress(function (e) {
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code == 13) { //Enter keycode
                    if ($(this).val() != "") {
                        Seach_enter();
                        e.preventDefault();
                    }
                    return false;
                }
            });
         

            // search clear ------------------------------------------
            $(".clear_search").click(function () {
                $("#txtSearch").val("");
                $(this).hide();
                $('#HDsearch_quick').val("");
                if (search_enter == true) {
                    //get_cuslist(true, 0, "all");
                       $('#ctl00_ContentHolder_HDintPage').val(1);
                     get_cuslist(true, 0, $("#div_left .BaseLi.select_list").attr("send_"),"",false,"");
                    search_enter = false;
                }


            });

            // customer delete ------------------------------------------
          $("#content_customer .profileHeader").find('#ctl00_ContentHolder_btnDelete').live("click", function () {

                if (!confirm(translate.question_delete)) {return false;}
                else{
                var comp_ =false;
                if ( $('#HDisCompany').val()=="true"){
                    //is company
                    if (!confirm(translate.cap_q_r))
                         {comp_=false; }else{comp_=true;}

                }
                var e = {};
                    e.domain = $('#HFdomain').val();
                    e.cus_code = $('#hdSected2CusCode').val();
                    e.user_code=$('#HFUserCode').val();
                    e.cus_name=$("#head_cus_name").html();
                    e.codeing = $("#hfcodeing").val();
                    e.delete_all = comp_;
                    e.rnd = $("#HFRnd").val();
                    $("#div_right").mask("...");
                    Client.delete_customer(e, function (c) {
                        if (c.d[0]==true){
                            $("#maincustomerList").find("#customer_" + $('#hdSected2CusCode').val()).remove();
                            $(".bckToList").click();
                            
                        if (comp_ == true){
                          for (xs = 0; xs < c.d[2].length; xs++) {
                                  $("#maincustomerList").find("#customer_" + c.d[2][xs]).remove();
                              }
                        }else{
                            // clear company tag
                            $("#maincustomerList").find("#cus_company[cus_code2="+$('#hdSected2CusCode').val()+"]").attr("tag","1").attr("cus_code2","").html('');

                        }

                        }
                          $("#div_right").unmask();
                         $('#hdSected2CusCode').val("");
                          message(c.d[1],true);
                       
                        RequestEnded();
                    });
	        }

            }); 


            //add any person or company*********************************
          $(".link_add_cus_com").live("click", function () {

                $('#rblCartablType :input').attr("disabled","disabled")
                $(".field_title_dialog2").hide();
                $("#rblCartablType :input").eq($(this).attr("tag")-1).attr("checked",true);
                $('#rblCartablType').change();
                $("#dialog2").dialog("open");
                 $("#dialog2").dialog('option', 'title', '');
            });

         
          

            //clicl edit btn ------------------------------------------123
           $("#content_customer .profileHeader").find('#ctl00_ContentHolder_btnEdit').live("click", function () {
               
                edit_click();
                  
            });



         //delete group customer ------------------------------------------
            $('.delete_group').live("click", function () {

             if (!confirm(translate.question_delete)) {return false;}
                else{


            if ($("#contant_Edit .group_edit").length >1){ // hamishe bayad yeki group dashte bashad moshtari
                
                 var group_name=$(this).parent().find("span").text();
                 var index_ = group_add_inupdate.indexOf(group_name)
                 if (index_ == -1){
                     group_delete_inupdate.push(group_name);
                     group_delete_inupdate.push($(this).attr("group_code"));
                 }else{
                     delete group_add_inupdate[index_]
                     delete group_add_inupdate[index_+1]
                 }


                var group_code=$(this).parent().attr("group_code");
                $(this).parent().fadeOut(function(){$(this).remove(); });
                $("#customer_primry_field_edit [in_group="+group_code+"]").attr('disabled', 'disabled');
                //  $("#customer_primry_field_edit [in_group="+group_code+"]").parent().parent().find(".ui-icon").hide();

                if ($.grep($('#HDGroupCustomer_select').val().split(","), function (a, index) { return a.indexOf(group_code + "_") == 0 }).length == 0) {
                    $("#customer_primry_field_edit [in_group_title=" + group_code + "]").addClass("disabled");
                };


                 var g='';
                var asplit= $('#HDGroupCustomer_select').val().split(",");
                var bolchack=false;
                $.each(asplit,function( intIndex, objValue ){
                    if (group_code != objValue){
                        if (g !='') g=g+",";
                        g=g + objValue;
                    }

                });
                $('#HDGroupCustomer_select').val(g);

                //remove parent parameter
                if (group_code.indexOf("_") != -1) {
                    var endW = true;
                    var len_ = group_code.split("_").length
                    for (var i = 0; i < len_ - 1; i++) {
                        var gw = group_code.split("_")[i];
                        if (i != 0) {
                            gw = "";
                            for (var j = 0; j <= i; j++) {
                                if (j != 0) {
                                    gw = gw + "_"
                                }

                                gw = gw + group_code.split("_")[j];
                            };
                        };
                        if ($.grep(g, function (a, index) { return a == gw }).length == 0) {
                            $("#customer_primry_field_edit [in_group_title=" + gw + "]").addClass("disabled");
                        };
                    }


                };

               
                }else{
                 message(translate.error_remove_group,false);

                }
            }
            });

            //delete customer customer ------------------------------------------
            $('.delete_customer').live("click", function () {
            var end_=false;
            if ($("#contant_Edit .cus_logic_edit").length ==1) end_=true;
            var cus_code=$(this).attr("cus_code");
                $(this).parent().fadeOut(function(){$(this).remove(); });
                 var g='';
                var asplit= $('#HDCustomer_logic_select').val().split(",");
                var bolchack=false;
                $.each(asplit,function( intIndex, objValue ){
                    if (cus_code != objValue){
                        if (g !='') g=g+",";
                        g=g + objValue;
                    }

                });
                  $('#HDCustomer_logic_select').val(g);
            if ( end_==true){
              $('#contant_Edit #lblcus_logic_name').html($("#link_add_person_clone").clone());
              $("#contant_Edit  #divtag_edit_logic_customer").hide();

            }
                
              
            });


            //click cancel edit btn ------------------------------------------
            $('#btnCancel').live("click", function () {
                   group_add_inupdate = [];
                   group_delete_inupdate = [];
                   $('#HDEdit_CusCode2').val('');
                if (var_new_==true){
                    selected_customer($('#hdSected2CusCode').val());
                    var send_=""
                 var d = {};

                if ($('#HDsearch_quick').val() == "") {
                    send_ = $("#div_left .BaseLi.select_list").attr("send_");

                      d=var_searach_property; 
                  if (varbtn_serachAdvanced==true) send_='Advanced';
                    
                   
                } else {
                    send_ = "quick";
                }
                   
                    get_cuslist(false,$('#ctl00_ContentHolder_HDintPage').val() , send_,d,false,"");
                }else{
                  cancel_edit();
                }
              
                
            });

            //click change tag mode 
            $(".changeTagModeCustomer .btnChangeType").live("click", function () {
                var e = {};
                var send_ = {};
                e.domain = $('#HFdomain').val();
                e.cus_code = $('#hdSected2CusCode').val();
                e.user_code = $('#HFUserCode').val();
                e.codeing = $("#hfcodeing").val();
                e.tag = $(this).attr("typechange");
                send_.items = e;
                Client.changeTageMode(send_, function (c) {
                    var_new_ = true;
                    $('#btnCancel').click();
                    saveType_reload = true;
                    $("#top_link").show();
                    RequestEnded();

                })
            });
        
          
            //click save edit btn ------------------------------------------
            $("#content_customer .head_edit").find('#btnregister_Edit').live("click", function () {

                if (group_add_inupdate.length > 0 || group_delete_inupdate > 0) {

                }

                 var e = {};
                 var send_={};
                 e.domain = $('#HFdomain').val();
                 e.cus_code = $('#hdSected2CusCode').val();
                 e.user=$('#HFUserCode').val();
                 e.perfix=$("#ctl00_ContentHolder_ddlPrefix option:selected").val();
                 e.name = $('#txtName').val();
                 e.title = $('#txttitle').val();
                 e.jazb = $('#ctl00_ContentHolder_ddljazb').LeadSourceComponent('get');
                 e.place=$("#txtplace option:selected").val();
                 if (e.place == undefined) e.place="";
                 e.rating=$("#ddrating option:selected").val();
                 e.group=$('#HDGroupCustomer_select').val();
                 e.iscompany=$('#HDisCompany_edit').val();
                 e.customer_logic=$('#HDCustomer_logic_select').val();
                 e.cus_code2=$('#HDEdit_CusCode2').val();
                 e.comment = $("#txtcomment").html();
                 e.codeing = $("#hfcodeing").val();
                 e.rnd = $("#HFRnd").val();
                 var group_edit={};
                 group_edit.add = group_add_inupdate;
                 group_edit.del= group_delete_inupdate;
                 e.group_edit = group_edit;
                 e.SetCustomerSubset = $('#chk_SetCustomerSubset').is(':checked');
                 e.active = $('#content_customer .btnActiveCustomer').hasClass('ActiveCustomer');
                 e.oldActive = $('#content_customer .btnActiveCustomer').attr('oldActive');
                 send_.items=e;

                
                var pr={};
                $("#customer_primry_field_edit input:disabled").val(""); // empty kardan an fildhayi ke grouhash  hazf shodeand
                var count_ ;
                $("#customer_primry_field_edit input").each(function(index) {
                    var r={};
                    r.code=$(this).attr("primary_text") +"," +  $(this).attr("field_group_")+"," +  $(this).attr("access");
                    r.text = $(this).val();
                    r.vtype = $(this).attr("vtype");
                    if (r.vtype == "4") { // is boolean
                        if ($(this).parents(".contantinfoval_container").find(".inactive").length > 0) {
                            r.checked = '';
                        } else {
                            r.checked = $(this).is(":checked");
                        }
                        
                    } else {
                        r.checked = '';
                    };

                    if (r.vtype == "9") { // customer Link
                        r.CustomerSelectedCode = $(this).attr("customerSelectedXCode");
                        if (r.CustomerSelectedCode == undefined) r.CustomerSelectedCode = '';
                    } else {
                        r.CustomerSelectedCode = '';
                    };
                    if (r.vtype == "10") { // factor Link
                        r.FactorSelectedId = $(this).attr("factorSelectedXId");
                        if (r.FactorSelectedId == undefined) r.FactorSelectedId = '';
                    } else {
                        r.FactorSelectedId = '';
                    };


                    r.parameter = $(this).attr("parameter_name");
                    r.in_list=$(this).attr("in_list");
                    r.select_text = "";
                    r.order = $(this).attr("order");
                    pr[index]=r;
                    count_=index;
                });
                $("#customer_primry_field_edit select").each(function(index) {
                    count_=count_+1;
                    var r={};
                    r.code=$(this).attr("primary_text") +"," +  $(this).attr("field_group_")+"," +  $(this).attr("access");
                    r.text=$(this).val();
                    r.parameter = $(this).attr("parameter_name");
                    r.vtype = $(this).attr("vtype");
                    r.in_list=$(this).attr("in_list");
                    r.select_text = $(this).find('option:selected').text();
                    r.order = $(this).attr("order");
                    r.checked = '';
                    r.CustomerSelectedCode = '';
                    r.FactorSelectedId = '';
                    pr[count_]=r;
                });
                send_.primery=pr;

                var act={}
               $("#infomenu_edit .cus_activity").each(function(index) {
                    var r={};
                    r.code=$(this).attr("activity_code");
                    r.text=$(this).find("span").html();
                    act[index]=r
                });

                send_.activity=act;



                $("#div_right").mask("saving...");
                Client.edit_custome(send_, function (c) {
                    
                    
                   var_new_=true;
                    $('#btnCancel').click();
                      saveType_reload=true;
                    $("#top_link").show();
                    RequestEnded();

                })
              

            });


        

            //click delete logic btn ------------------------------------------
            $('.delete_logic').live("click", function () {
                 $("#contant_Edit").find('#lblcompany_name').html($("#link_add_company_clone").clone());
                 $("#contant_Edit").find("#divtag_edit_logic_company").fadeOut();
                 $('#HDEdit_CusCode2').val("");
                 saveType_reload=false;
               
            });

            //click edit logic btn ------------------------------------------
            $('.edit_logic').live("click", function () {
                $(".link_add_cus_com").click();
                saveType_reload=false;
               
            });

            //click change_logic btn ------------------------------------------
            $('.change_logic').live("click", function () {
                var ch_;
                if ($(this).attr("tag")=="1") ch_=false;
                    else ch_=true;
                chang_cus_com(ch_);

               
            });

       //click add customer logic + btn ------------------------------------------
            $('.add_customer_logic').live("click", function () {
                $(".link_add_cus_com").click();
                saveType_reload=false;
               
            });

       //click add field ------------------------------------------
            $('.add_field').live("click", function () {
                add_edit_text(this);
               
            });

        //click add field cuss add
            $('.add_field_new').live("click", function () {
                add_addcus_text(this);
                 $("#dialog_new_customer").height($("#dialog_new_customer .box").height());
                 $("#dialog_add_person_new").height($("#dialog_add_person_new .box").height());
            });

            $('.delete_field_new').live("click", function () {
                if ($(this).hasClass("orginalBoolean")) {
                    // fild avale boolean bashe pakesh nikonad az aval ijad mikonam 
                    var fi_ = $(this).parents(".ContactPanelField");
                    fi_.find(".switchery").remove();
                    fi_.find(".switchbutton").attr('checked', false);
                    Switchery_ = new Switchery(fi_.find('.switchbutton')[0], { size: 'large', color: '#4caf50', secondaryColor: '#eee', trueLabel: resources.true_, falseLabel: resources.false_ });
                    fi_.find(".switchery").addClass("inactive");
                    fi_.find(".switchery").find(".label.no").hide();
                    $(this).parents(".ContactPanelField").find(".delete_field_new").hide();
                } else {
                    $(this).parent().fadeOut(300, function () {
                        $(this).remove();
                        cheak_height($("#dialog_new_customer")); cheak_height($("#dialog_add_person_new"));
                        $("#dialog_new_customer").height($("#dialog_new_customer .box").height()); $("#dialog_add_person_new").height($("#dialog_add_person_new .box").height());
                        $("#dialog_new_customer").parent().css("height", "auto"); $("#dialog_add_person_new").parent().css("height", "auto");


                    });
                };
          });
            
          
//              //click add field ------------------------------------------
//            $('.add_field_dropdawn').live("click", function () {
//               // var cop_=$('<div id="feild_contant"></div>').clone();
//                 //cop_.append($(this).parent().clone().hide());
//                 var cop_=$(this).parent().parent().clone().hide();
//                cop_.find(".add_field_dropdawn").hide();
//                cop_.find(".delete_field_dropdawn").show();
//                cop_.find("input").val("");

//                $(this).parent().parent().after(cop_.fadeIn(800));
//                cheak_height($("#contant_Edit #customer_primry_field_edit"));
//               
//            });
//            
//       //click delete field ------------------------------------------
//            $('.delete_field_dropdawn').live("click", function () {
//                 $(this).parent().parent().fadeOut(300, function(){ $(this).remove();});
//                 cheak_height($("#contant_Edit #customer_primry_field_edit"));
//            });

       //click delete field ------------------------------------------
          $('.delete_field').live("click", function () {
              if ($(this).hasClass("orginalBoolean")) {
                  // fild avale boolean bashe pakesh nikonad az aval ijad mikonam 
                  var fi_ = $(this).parents(".contantinfoval_container");
                  fi_.find(".switchery").remove();
                  fi_.find(".switchbutton").attr('checked', false);
                  Switchery_ = new Switchery(fi_.find('.switchbutton')[0], { size: 'large', color: '#4caf50', secondaryColor: '#eee', trueLabel: resources.true_, falseLabel: resources.false_ });
                  fi_.find(".switchery").addClass("inactive");
                  fi_.find(".switchery").find(".label.no").hide();
                  $(this).parents(".contantinfoval_container").find(".delete_field").hide();

              } else {
                  $(this).parent().fadeOut(300, function () {
                      $(this).remove();
                      cheak_height($("#contant_Edit #customer_primry_field_edit"));
                      if ($(".field_search").length<=1) $("#sum_mode").remove();
                    });
                  $('.search_ddl_mode').unbind();
              }

                
          });

        



            //change into customer or company
            function chang_cus_com(iscompany){
                if (iscompany==true){
                    $('#HDCustomer_logic_select').val("");
                    $('#contant_Edit #lblcus_logic_name').html($("#link_add_person_clone").clone());
                    $("#contant_Edit #divtag_edit_logic_customer").hide();
                    $(".diviscompany").show();
                    $(".diviscustomer").hide();
                    $("#content_customer").find("#field_titr").hide();
                }else{

                    $('#contant_Edit #lblcompany_name').html($("#link_add_company_clone").clone());
                    $("#contant_Edit #divtag_edit_logic_company").hide();    
                       $(".diviscompany").hide();
                    $(".diviscustomer").show();    
                     $("#content_customer").find("#field_titr").show(); 
                }
                $('#HDCustomer_logic_select').val("");
                $('#HDEdit_CusCode2').val("");
                $('#HDisCompany_edit').val(iscompany);

          }

      
              
     
                   
               
        $('#ctl00_ContentHolder_btnAdd_activity').live("click", function () {
            var fin_=$("#txtactivity");
            if (fin_.text() !=""){
              if ($("#infomenu_edit").find(".cus_activity [activity_code="+fin_.val()+"]").length !=0 && fin_.val() !="0"){
                 message(translate.error_select,false);
                 return false;
              }
                var g_cop=$("#group_cus_editable").clone().removeAttr("id");
                g_cop.find(".group_edit").removeClass("group_edit").addClass("cus_activity");
                g_cop.find(".delete_group").removeClass("delete_group").addClass("delete_activity");
                g_cop.find("div").attr("activity_code", fin_.val());
                g_cop.find("span:first").text(fin_.text());
                $("#infomenu_edit").find("#div_activity").append(g_cop);
                $("#txtactivity option").remove();
                $(".ui-combobox_activity-input").val("");
        }
        });

        $(".ui-combobox_activity-input").live("keypress", function () {
                if (event.which == 13) {
                    $("#ctl00_ContentHolder_btnAdd_activity").click();
                    event.preventDefault();
                }

            });


    //delete group customer ------------------------------------------
            $('.delete_activity').live("click", function () {

             if (!confirm(translate.question_delete)) {return false;}
                else{


                var activity_code=$(this).attr("activity_code");
                $(this).parent().fadeOut(function(){$(this).remove(); });
             
            }
            });

           $("#new_person").click(function () {
                                   
                cus_add_tag=1;
                $('#HDcheck_duplicate').val('true');
                $("#dialog_new_customer").dialog("open");   
                  $("#ui-dialog-title-dialog_new_customer").html(translate.add_person);
                   $(".div_add_company,.div_add_title").show();
                  cheak_height($("#dialog_new_customer"));
                $("#dialog_new_customer").height($("#dialog_new_customer .box").height()).find(".add_person_new").hide();
                $("#txtactivity_customeradd").combobox_company();
             
            });

           $("#new_company").click(function () {
                cus_add_tag=2;
                 $('#HDcheck_duplicate').val('true');
                 $("#dialog_new_customer").dialog("open");   
                 $(".div_add_company,.div_add_title").hide();
                 $("#ui-dialog-title-dialog_new_customer").html(translate.add_company);
                  cheak_height($("#dialog_new_customer"));
                $("#dialog_new_customer").height($("#dialog_new_customer .box").height()).find(".add_person_new").show();
              
           });

           $("#dialog_new_customer,#dialog_add_person_new").dialog({
                bgiframe: true,
                modal: true,
                autoOpen: false,
                resizable:false,
                width: 630,
                height: 410,
                close:function(event, ui){  clear_add_cutomer_oder();}
                 });


            $("#dialog_new_customer").keypress(function (event) {
                if (event.which == 13) {
                    $('#btn_addcustomer').click();
                    event.preventDefault();
                }

            });


            // add customer
            $('#btn_addcustomer').click(function () {
                var dialog_= $("#dialog_new_customer");
                if ($("#txtName_customeradd").val() =="" ){
                   dialog_.find("#lblName_addcus").addClass("field_empty");
                    return false;
                }
                if ($("#txtName_customeradd").val().trim() =="" ){
                   dialog_.find('#lbladd_cus_input').addClass("field_empty");
                    return false;
                }
                if ( $('#ctl00_ContentHolder_hfgroup_value_select').val()==""){
                   dialog_.find('#lblgroup_addcus').addClass("field_empty");
                    return false;

                }
                
                  close_advanced_search();
              
                  jQuery.grep($("#dialog_new_customer input"), function (n, i) {
                      $(n).val($(n).val());
                  });
                    var e = {};
                    var send_={};
                    e.domain = $('#HFdomain').val();
                    e.user=$('#HFUserCode').val();
                    e.name = $('#txtName_customeradd').val();
                    e.prefix_value=$('#ctl00_ContentHolder_ddlPrefix_new').val();
                    e.company_code=$("#txtactivity_customeradd").val();
                    e.company_name=$("#txtactivity_customeradd").text();
                    e.title=$("#txttitle_customeradd").val();
                    e.group_name=$('#ctl00_ContentHolder_hfgroup_name_select').val();
                    e.group_id=$('#ctl00_ContentHolder_hfgroup_value_select').val();
                    e.tag=cus_add_tag;
                    e.check=$('#HDcheck_duplicate').val();
                    e.jazb=null;
                    e.codeing = $("#hfcodeing").val();
                  
                    var oder_person={};
                    $("#dialog_new_customer .field_oder_person_add").each(function(index) {
                        oder_person[index]=$(this).data('info');
                    });
                    e.oder_person=oder_person;
                    send_.items=e;
                

                    var pr={};
                    var count=0;
                    dialog_.find(".ContactPanel").find("input").each(function(index) {
                        var r={};
                        r.code = $(this).attr("primary_text") + "," + $(this).attr("field_group_") + "," + $(this).attr("access");
                        r.text=$(this).val();
                        r.parameter = $(this).attr("parameter_name");
                        r.vtype = $(this).attr("vtype");
                        if (r.vtype == "4") { // is boolean
                            if ($(this).parents(".ContactPanelField").find(".inactive").length > 0) {
                                r.checked = '';
                            } else {
                                r.checked = $(this).is(":checked");
                            }
                          
                        } else {
                            r.checked = '';
                        };

                        if (r.vtype == "9") { // customer Link
                            r.CustomerSelectedCode = $(this).attr("customerSelectedXCode");
                            if (r.CustomerSelectedCode == undefined) r.CustomerSelectedCode = '';
                        } else {
                            r.CustomerSelectedCode = '';
                        };
                        if (r.vtype == "10") { // factor Link
                            r.FactorSelectedId = $(this).attr("factorSelectedXId");
                            if (r.FactorSelectedId == undefined) r.FactorSelectedId = '';
                        } else {
                            r.FactorSelectedId = '';
                        };
                        r.group = $(this).attr("field_group_");

                        r.in_list = $(this).attr("in_list");
                        r.order = $(this).attr("order");
                        r.select_text="";
                        pr[count]=r;
                        count=count+1;

                    });  
                    dialog_.find(".ContactPanel").find("select").each(function(index) {
                        var r={};
                        r.code = $(this).attr("primary_text") + "," + $(this).attr("field_group_") + "," + $(this).attr("access");
                        r.text=$(this).val();
                        r.parameter = $(this).attr("parameter_name");
                        r.vtype = $(this).attr("vtype");
                        r.checked = '';
                        r.CustomerSelectedCode = '';
                        r.FactorSelectedId = '';
                        r.group=$(this).attr("field_group_");
                        r.in_list=$(this).attr("in_list");
                        r.select_text = $(this).find('option:selected').text();
                        r.order = $(this).attr("order");
                        pr[count]=r
                        count=count+1;
                    });
                    send_.primery=pr;


                     dialog_.mask("...");
                     Client.add_customer(send_, function (c) {//zzzzzzzzzzzzzzz
                        RequestEnded();
                        var di_= $("#dialog_new_customer");
                        if (c.d[0]=='error'){
                             message(translate.error_register_done,true);
                             return false;
                        }else if (c.d[0]=='duplicate'){

                             di_.find("#div_create").hide();
                             di_.find("#div_duplicate").show();
                             for (cs = 0; cs < c.d[1].length; cs++) {
                                    customer_List = new duplicateList(c.d[1][cs]);
                                    customer_List.AddNew();
                             }
                            di_.find("#div_duplicate_list").height(di_.height() - 70 );
                            di_.unmask();
                        }else{
                        var_new_=true;
                        customer_info = new customerList(c.d[1]);
                        customer_info.create_edit();
                        customer_info = new customerList(c.d[2]);
                        customer_info.CreateItemEdit();
                        customer_info = new customerList(c.d[3]);
                        customer_info.SetItemEdit();

                        if (c.d[4].length !=0){
                             $('#HDCustomer_logic_select').val("");
                              var cop__=$("#contant_Edit");
                             $.each(c.d[4],function( intIndex, objValue ){
                                //set customer logic**********************
                                    fun_add_customer_logic(objValue.code,objValue.Name,cop__);
                         
                            });
                        }
                       

                        di_.unmask();
                        di_.dialog("close");
                         
                        }
                         
                     });
                    

                    // close dialog
                    

            });

             // close dialoge5 customer
            $('#btn_cancelcustomer').click(function () {
               
                  $("#dialog_new_customer").dialog("close");
               
               
            });

             $( "#dialog_new_customer" ).dialog({
                close: function(event, ui) {  clear_add_cutomer();$('.positionHelper').hide()  },
                 drag: function(event, ui) { 
                     $('.positionHelper').css("left",   $('#ctl00_ContentHolder_hierarchybreadcrumb5').offset().left +'px');
                     $('.positionHelper').css("top",   $('#ctl00_ContentHolder_hierarchybreadcrumb5').offset().top +'px');
                },
                dragStop: function(event, ui) {                     
                      $('.positionHelper').css("left",   $('#ctl00_ContentHolder_hierarchybreadcrumb5').offset().left +'px');
                     $('.positionHelper').css("top",   $('#ctl00_ContentHolder_hierarchybreadcrumb5').offset().top +'px'); 
                },
                open: function(event, ui) {                     
                      $('.positionHelper').css("left",   $('#ctl00_ContentHolder_hierarchybreadcrumb5').offset().left +'px');
                     $('.positionHelper').css("top",   $('#ctl00_ContentHolder_hierarchybreadcrumb5').offset().top +'px'); }
            });


            // continue add customer
         $('#btn_continue').live("click", function () {
          
            $('#HDcheck_duplicate').val('false');
             $('#btn_addcustomer').click();
            
         });
         $('#contant_Edit').live("keypress", function (evt) {
             if (evt.which == 13 && evt.target.id != "txtcomment") {
                 $("#content_customer .head_edit").find('#btnregister_Edit').click();
                 evt.preventDefault();
             }
         });

         //click advanced search
         $(".link_search").click(function () {

             $(".advanced_menu span").hide();
               if (link_search_click==true)
                $("#menu_advancedsearch").hide();
             $("#advanced_search").slideDown();

  
             $(".mr_add").hide();
              backto_one();

              if (var_link_edit_search==false){
                 link_search_click=true;
              }else{
                 link_search_click=false;
              }

            
             $('#hierarchybreadcrumb4').menuA({content: $('#hierarchybreadcrumb4').next().html(),backLink: false});
              $(".mydds").msDropDown().data("dd");
           
	
	     

            $('html, body').animate({ scrollTop: 45 }, { duration: 400, queue: false });
            $("#search_txt_place").combobox();
            $("#search_txt_activity").combobox();
            $(".infomenu").html("").css("top", 0).hide();


            if ($("#search_ddl_field option").length ==0){
            // get all field 
             var e = {};
             e.domain = $('#HFdomain').val();
             e.user_code=$('#HFUserCode').val();
              e.codeing = $("#hfcodeing").val();
             Client.get_field_all_name(e, function (c) {
              // customer_info = new customerList(c.d)
                if (c.d.primary_field != null) 
                    for(var i = 0; i < c.d.primary_field.length; i++){
                         
                        $('#search_ddl_field').append("<option value='" + c.d.primary_field[i].link2 + "_" + c.d.primary_field[i].code + "_" + c.d.primary_field[i].vtype + "'>" + c.d.primary_field[i].parameter + "</option>");
                         
                    }
                $('#search_ddl_field').prepend("<option value='0'>" + translate.select_field + "</option>");
                $('#search_ddl_field').val(0);
               $(".mydds").msDropDown().data("dd");
               RequestEnded();
               //call set search Item 
               if (var_link_edit_search==true)
               set_search_item(var_searach_property);
             });//end get_field_all_name

          }else{
          
           //call set search Item 
             if (var_link_edit_search==true)
            set_search_item(var_searach_property);
          }//end if 
             

         });


           //advaned search click
         $('#btnsearch_back').click(function () {
           
            
            if (varbtn_serachAdvanced==true) { $('#ctl00_ContentHolder_HDintPage').val(1); get_cuslist(true, 0, $("#div_left .BaseLi.select_list").attr("send_"),"",false,"");}
            close_advanced_search();

            
         });
        

         $("#search_ddl_item").change(function() {
            if ($(this).val()=="3"){
                $("#div_serach_create_user").hide();
                 $('#ctl00_ContentHolder_search_ddl_user').val("").attr("selected", "selected");
            }else{
             $("#div_serach_create_user").show();
            }

         });

           //advaned search click  
            $('#btnsearch').live("myclick", function(e, property_) {
      
                    var d = {};
                  
                  if (property_ == '' && $("#div_before_date").is(':visible')==true){
                    if (( $("#ddlNo").val()=="0" &&  $("#ddl_dwm").val()!="0") ||($("#ddlNo").val()!="0" &&  $("#ddl_dwm").val()=="0") )
                    {return false;}
                  }
               
                    d=split_property_advanced(property_);
                     var_searach_property=d; 
                     if (link_search_click==true){
                         $("#div_left .BaseLi").removeClass("select_list");
                        $("#div_left .BaseLi[send_=all]").addClass("select_list");
                         $("#div_left  .BaseLi").each(function (index) {
                            ico = $(this).attr("ico");
                            $(this).removeClass("select_list").find(".Crm-icon").removeClass(ico).addClass($(this).attr("ico") + "-black");
                         });
                        varbtn_serachAdvanced=true;
                     }
//                    if (property_ == '' && $("#div_left .BaseLi.select_list").attr("send_")!='search'){
//                     $("#div_left .BaseLi").removeClass("select_list");
//                        $("#div_left .BaseLi[send_=all]").addClass("select_list");
//                        varbtn_serachAdvanced=true;
//                    }
                     $('#ctl00_ContentHolder_HDintPage').val("1")
                     if ($("#hfinit").val() == "0") { //call with customerGroupTreeView.aspx
                         $("#hfinit").val("all") ;
                         get_cuslist(true, 0, "Advanced", d, true, "0");
                       
                     } else {
                         get_cuslist(true, 0, "Advanced", d, false, "");
                     }
               
                    $("#link_save_search").show();
                    
                    $('#link_email').show();
                    $('#link_map').show();
                     $('#link_sms').show();
                     $('#link_themplateprint').show();
                   
                     
            });

            
             $('#btnsearch').click(function(){
                 $('#btnsearch').trigger("myclick",'');
             });


          //dialoge save advanced search cancel
         $('#btn_cnacel_save_advanced').click(function () {
          
          
             $("#dialog_save_search").dialog("close");  
         });


         //dialoge save advanced search save click
         $('#btn_save_advanced').click(function(){
         
         if ($("#txt_advanced_name").val()==""){return false;}

         if (jQuery.grep($(".BaseLi[send_='search'] .SearchName"), function (n, i) {
                return $(n).text() == $("#txt_advanced_name").val();
         }).length > 0) {
             // Duplicate name
             $("#save_advancedMessag").text(translate.save_repeatcod).show();
             return;
         }
         
                var e = {};
                var send_={};
                e.domain = $('#HFdomain').val();
                e.user=$('#HFUserCode').val();
                e.name = $("#txt_advanced_name").val();
                var property=get_advanced_item();
                e.property=property;
                var property__=property;
                send_.items=e;
                $("#dialog_save_search").mask("...");
                Client.save_search(send_, function (c) {    
                   if (c.d != "0") {
                        var class_='';
                        if ($("#div_left .BaseLi[send_=search]").length == 0) { class_ = 'First_ul' } else { class_ = 'serachSaveCustomer' }
                        $("#div_left ul").append(create_serach_list(c.d,$("#txt_advanced_name").val(),property__,class_));
                   }
  
                   //namayesh dar samte chap
                   //namayeshe dokme edit
                   //namayesh dokme delete
                   
                   $("#dialog_save_search").unmask();
                   $("#dialog_save_search").dialog("close");  
                   RequestEnded();
                 });
        });

         $("#link_save_search").click(function () {
            
              $("#dialog_save_search").dialog("open");  
           });
         $("#dialog_save_search").dialog({
                bgiframe: true,
                modal: true,
                autoOpen: false,
                resizable:false,
                width: 350,
                height: 200,
                close: function (event, ui) { $("#txt_advanced_name").val(""); },
                open: function (event, ui) { $("#save_advancedMessag").text("").hide(); }

          });

            //edit menu advanced search 
            $("#edit_advancedsearch").click(function(){
                $(this).hide();
                $(".link_search").hide();
                var_link_edit_search=true;
                $("#update_advancedsearch").show();
                var id_=$("#div_left .BaseLi.select_list").attr("search_id");
                $(".link_search").click();
                $(".advance_search_body").mask("...");
                var e = {};
                var send_={};
                e.domain = $('#HFdomain').val();
                e.user_code=$('#HFUserCode').val();
                e.id=id_;
                e.codeing = $("#hfcodeing").val();
                send_.items=e;

                Client.get_advanced_serach(send_, function (c) {
                    var d=split_property_advanced(c.d[0].Property_)
                    $('#search_ddl_item').val(d.item).attr("selected", "selected");
                    $('#ctl00_ContentHolder_search_From_date').val(d.from_date);
                    $('#ctl00_ContentHolder_search_to_date').val(d.to_date);
                    $('#ctl00_ContentHolder_search_ddl_user').val(d.create_user);
                    $('#search_txt_name').val(d.name);
                    $('#search_ddl_rating').val(d.rating);

                    if (d.jazb != "") {
                        //lead Source
                        var ArrSelectedItem = new Array();
                     
                            var q = {};
                            q.name = $(this).find("span").text();
                            q.id = 0;
                            q.code = d.jazb.split("#")[0];
                            q.mode = d.jazb.split("#")[1];

                            if (q.mode == 2) {
                                q.name = $('#ctl00_ContentHolder_search_ddl_jazb option[value=' + d.jazb.split("#")[0] + ']').text();
                            } else {
                                q.name = q.code;
                            };
                            ArrSelectedItem.push(q);

                        
                            $('#ctl00_ContentHolder_search_ddl_jazb').LeadSourceComponent('set', ArrSelectedItem, { writeLabel: '#LeadSource_WriteSeach', clone: '#LeadSource_editable' });

                    }
                 //   $('#ctl00_ContentHolder_search_ddl_jazb').val(d.jazb).attr("selected", "selected");

                    $('#search_txt_place option').remove();
                    $("#search_txt_place").append("<option value="+d.place+">"+c.d[0].place+"</option>");
                    $("#search_txt_place").parent().find("input").val(c.d[0].place);
                
                
                    $('#search_txt_activity option').remove();
                    $("#search_txt_activity").append("<option value="+d.activity+">"+c.d[0].activity+"</option>");
                    $("#search_txt_activity").parent().find("input").val(c.d[0].activity);

                    if (d.befor_date !=""){

                        if ($("#div_before_date").is(':visible')==false){
                            $(".div_change_date").toggle();
                         }

                         $("#ddlNo").val(d.befor_date.split("_")[0]).attr("selected", "selected");
                         $("#ddl_dwm").val(d.befor_date.split("_")[1]).attr("selected", "selected");
                    
                    }else{
                        if ($("#div_before_date").is(':visible')==true){
                            $(".div_change_date").toggle();
                         }
                    }

                    var spl_gs=d.group_id.split("#");
                    $(".advance_search_body .field_search_group_append").find(".group_search").remove();
                    $.each(spl_gs,function( intIndex, objValue ){

                     var a= $.grep(c.d[0].group, function (a, b) {
                         return a.group_code == objValue.replace("!", "").replace("%", "");
                     })

                     var Gname_="";
                     if (a.length > 0) {
                         Gname_ = a[0].group_name;
                     }
                     select_group_search(Gname_, objValue, (objValue.indexOf("%") >=0 ? 1 : 0));
                    });
                    if (spl_gs.length >=2){
                         $("#groupSerchMerg").show();
                         if(d.group_merg=="and"){
                            $("#groupSerchMerg #rdgroupMerg_and").attr('checked', 'checked');
                         }else{
                            $("#groupSerchMerg #rdgroupMerg_or").attr('checked', 'checked');
                         }
                          $("#groupSerchMerg").buttonset();

                    }else{
                        $("#groupSerchMerg").hide();
                    }

                
//                     $('#hfgroup_value_search').val(d.group_id);
//                     $('#hfgroup_name_search').val(c.d[0].group);
//                     if(c.d[0].group==''){
//                    }else{$("#hierarchybreadcrumb4").html(c.d[0].group);}
                     $(".mydds").msDropDown().data("dd");
                     $(".advance_search_body").unmask();
                     RequestEnded();


                   

                });

                   
            });

       
      
            //delete menu advanced search
            $("#delete_advancedsearch").click(function(){

                if (!confirm(translate.question_delete)) {return false;}
                var id_=$("#div_left .BaseLi.select_list").attr("search_id");
                var e = {};
                var send_={};
                e.domain = $('#HFdomain').val();
                e.user_code=$('#HFUserCode').val();
                e.codeing = $("#hfcodeing").val();
                e.id=id_;
                send_.items=e;
                 $("#advanced_search").mask("...");
                Client.delete_advanced_search(send_, function (c) {
                    if (c.d==""){
                        $("#div_left .BaseLi.select_list").remove();
                        if ($("#div_left .BaseLi.First_ul").length==0){
                            $("#div_left .BaseLi[send_=search]").eq(0).addClass("First_ul");
                        }
                        $('#btnsearch_back').click();
                        $("#menu_advancedsearch").hide();
                        // get all
                        $("#div_left .BaseLi").eq(0).addClass("select_list");
                         $('#ctl00_ContentHolder_HDintPage').val(1);
                         get_cuslist(true, 0, $("#div_left .BaseLi").eq(0).attr("send_"),"",false,"");
                    }
                     $("#advanced_search").unmask();
                    RequestEnded();
                });



            });


            // update advanced search
            $("#update_advancedsearch").click(function(){
                var e = {};
                var send_={};
                var id_=$("#div_left .BaseLi.select_list").attr("search_id");
                e.domain = $('#HFdomain').val();
                e.user=$('#HFUserCode').val();
                e.name = $("#txt_advanced_name").val();
                e.id=id_;
                var property=get_advanced_item();
               
                e.property=property;
                var property__=property;
                send_.items=e;
                $("#advanced_search").mask("...");
                
                Client.update_search(send_, function (c) {
                      $("#advanced_search").unmask();
                      $('#div_left .BaseLi[search_id='+id_+']').attr('property_',property);
                      var d = {};
                      d=split_property_advanced(property);
                      $('#ctl00_ContentHolder_HDintPage').val(1);
                      get_cuslist(true, 0,"Advanced",d,false,"");
                      $('#btnsearch_back').click();
                      RequestEnded();
                 });
            });


            // change date advanced search
            $(".change_date").click(function(){
                $(".div_change_date").toggle().toggleClass("showDate");
            });



             //select seach item feild 
             $('#search_ddl_field').change(function(){
                 if ($(this).val() != "0") {
                     var cop_= $("#search_field_clone").clone().removeAttr("id");
                     if ($(this).val().split("_")[2] == "4") {
                         cop_.find(".txt_serach_input").remove();
                         cop_.find("#search_ddl_mode").find("option[value=3]").hide();
                         cop_.find("#search_ddl_mode").find("option[value=4]").hide();
                         cop_.find("#search_ddl_mode").find("option[value=5]").hide();

                     } else {
                         cop_.find(".ddl_serach_input_boolean").remove();
                     }
                     if ($(this).val().split("_")[2] == "9" ) {
                         cop_.find("#search_ddl_mode").find("option[value=4]").hide();
                         cop_.find("#search_ddl_mode").find("option[value=5]").hide();
                     }else if ( $(this).val().split("_")[2] == "10"){
                         cop_.find("#search_ddl_mode").find("option[value=3]").hide();
                         cop_.find("#search_ddl_mode").find("option[value=4]").hide();
                         cop_.find("#search_ddl_mode").find("option[value=5]").hide();
                    }

                  
                    cop_.find(".field").addClass("field_search");

                     var id_sel=$(this).val();
                    var loop_=true;
                    while (loop_)
                      {
                          if ($("[fid1="+id_sel+"]").length>0){
                                id_sel=id_sel + "_1"
                            }else{
                             loop_=false;
                            }
                        
                      }


                    cop_.find("#search_ddl_mode").addClass("search_ddl_mode").attr("fid",$(this).val()).attr("fid1",id_sel);
                    cop_.find("#search_ddl_mode").attr("id","search_ddl_mode" + $("#advanced_search .field_search").length +1 );
                   
                    cop_.find("span").html($(this).find("option:selected").text());
                    cop_.find(".field").attr("field_search_id",$(this).val()).attr("field_search_id1",id_sel);
                    $("#div_lugar_search_feild").append(cop_.html());
                    
                    $(this).val("0").attr("selected", "selected");

                    if ($("#advanced_search .field_search").length > 1 && $("#advanced_search #sum_mode").length ==0){
                        $("#div_lugar_search_feild").children().eq(0).after("<div id='sum_mode' class='field field-col3 left' style='width: 36%;'><div class='select select-0'><select id='search_ddl_sum_mode' class='mydds' style='width: 130px' ><option value='1'>"+translate.union+"</option><option value='2'>"+translate.intersection+"</option></select></div></div>");
                    }else if ($("#advanced_search .field_search").length <=1){
                         $("#advanced_search #sum_mode").remove();
                    }

                    $(".mydds").msDropDown().data("dd");
                      $('.search_ddl_mode').bind('change', function() {
                        change_search_ddl_mode($(this));
                      });
                  }
                  
              });

             

              //attache_remove click hazfe file attachment 
              $('.attache_remove').live("click", function () {
                
                    if (!confirm(translate.question_delete)) {return false;}
                    var e = {};
                    var send_={};
                    var id_=$(this).attr("attachmet_id");
                    e.domain = $('#HFdomain').val();
                    e.address =$(this).parent().find("a").attr("href");
                    e.id=id_;
                    e.user_code=$('#HFUserCode').val();
                    e.codeing = $("#hfcodeing").val();
                    e.cusCode = $('#hdSected2CusCode').val();
                    send_.items=e;
                    $(this).parent().mask("...");
                
                    Client.delete_attachment(send_, function (c) {
                          $("#advanced_search").unmask();
                          $(".infomenu_edit .div_attachmet_edit").find("[attachmet_id="+id_+"]").parent().remove();
                          $("#content_customer .main_contact_attachment").find("[attachmet_id="+id_+"]").remove();
                          RequestEnded();
                     });


           });
             $("#dialog_upload").dialog({
               bgiframe: true,
                modal: true,
                autoOpen: false,
                resizable:false,
                width: 439,
                height: 230,
                close: function(event, ui) { 
                     $("#mydiv_attachment").hide();
                 document.getElementById('frm_upload_file').reset();
                },open : function(event,ui){
                     $("#myfile_attachment").unbind();
                      $("#myfile_attachment").change(function () {

                          $("#frm_upload_file").attr("action", "upload_file.ashx?user_code=" + $('#HFUserCode').val() + "&cus_code=" + $('#hdSected2CusCode').val() + "&domain=" + $('#HFdomain').val() + "&name=" +encodeURIComponent( $('#txt_attachment_name').val()));
                      $('#frm_upload_file').submit();
                  }); 

                }
            });

           
        // var toltip     
       var title;
       $('.cusotmerCSS [title]').live({
         mouseenter: function(e) { 
         if ($(this).hasClass("selectLink_tree")==false && $(this).attr('role')!="menuAitem"){
            title = $(this).attr("title");
            $(this).attr("title","");									  				
				if (title != "" && title != undefined){	
                      $(".toltip").remove();		
					$("body").append("<div class='toltip'>"+ title +"</div>");		
					$(".toltip")
						.css("position","absolute")
						.css("top",(e.pageY +25) + "px")
						.css("left",(e.pageX + 12) + "px")						
						.css("display","none").delay(300)
						.fadeIn("slow")
				}
        }
       },
         mouseleave: function () {
          if ($(this).hasClass("selectLink_tree")==false && $(this).attr('role')!="menuAitem"){
                $(".toltip").remove();
	            $(this).attr("title",title);
                }
              },
         mousemove :function(e){
          if ($(this).hasClass("selectLink_tree")==false && $(this).attr('role')!="menuAitem"){
				$(".toltip")
					.css("top",(e.pageY +25) + "px")
					.css("left",(e.pageX + 12) + "px")		
                    }			
			},
          mousedown:function () {
           if ($(this).hasClass("selectLink_tree")==false && $(this).attr('role')!="menuAitem"){
                $(".toltip").remove();
	            $(this).attr("title",title);
                }
              }	
	    });
        
         $('#link_email').click(function(){
                var d = {};
                d=split_property_advanced("");
                var s={};
                s.link2=4;
                s.code = 1;
                d.send_to="email"
                d.send_to_param=s;
                 $('#ctl00_ContentHolder_HDintPage').val(1);              
               get_cuslist(true, 0,"Advanced",d,false,"");
                return false;
     
         });
         $('#link_map').click(function () {
                var d = {};
                d=split_property_advanced("");
                var s={};
                s.link2=0;
                s.code = 0;
                d.send_to="map"
                d.send_to_param=s;
                 $('#ctl00_ContentHolder_HDintPage').val(1);              
               get_cuslist(true, 0,"Advanced",d,false,"");
                return false;
     
         });
        
         $('#link_themplateprint').click(function () {
                
             showCustomerTemplate("",true);
             return false;
     
         });


         $('#link_sms').click(function(){
                var d = {};
                d=split_property_advanced("");
                var s={};
                s.link2=1;
                s.code = 4;
                d.send_to="sms"
                d.send_to_param=s;
                 $('#ctl00_ContentHolder_HDintPage').val(1);           
               get_cuslist(true, 0,"Advanced",d,false,"");
                return false;
         });

   
     



           //text_tab_edit click---------------------------
           $(".text_tab_edit").live("click", function () {

                $("#contant_Edit .group_edit ").removeClass("selected2");
                $(".text_tab_edit").removeClass("selected");
                $(this).addClass("selected");
                var id__=$(this).attr("id");

                //bisplay block all 
                 $("#customer_primry_field_edit #feild_contant").children().show()
                 $("#customer_primry_field_edit .ContactPanel ").show()

                if (id__=="edit_list_default"){/*---all---*/
                    
//                    $("#customer_primry_field_edit #feild_contant").children().show()
//                    $("#customer_primry_field_edit .ContactPanel ").show()
               
                }else if(id__=="edit_list_full" || id__=="edit_list_empty"){/*---full---empty---*/

                    $("#customer_primry_field_edit input").each(function (index) {
                        if(id__=="edit_list_full"){
                             if($(this).val()==''){ $(this).parent().parent().parent().hide();}
                        }else{
                             if($(this).val()!=''){ $(this).parent().parent().parent().hide();}
                        }
                    });
                    $("#customer_primry_field_edit select").each(function (index) {
                        if(id__=="edit_list_full"){
                             if($(this).val()==''){ $(this).parent().parent().parent().hide();}
                        }else{
                             if($(this).val()!=''){ $(this).parent().parent().parent().hide();}
                        }
                    });



                }else if(id__=="edit_list_basic" || id__=="edit_list_other"){/*---basic---other---*/
                    
                        if(id__=="edit_list_basic"){
                             $("#customer_primry_field_edit").find('[field_group_=1]').parent().parent().parent().hide();
                        }else{
                             $("#customer_primry_field_edit").find('[field_group_=0]').parent().parent().parent().hide();
                        }
               } else if(id__="add_field_specific"){
                   
                   $('#btnCancel').click();
                  var rnd_ = $("#ctl00_txtRnd").val();
                  window.open("createProperty.aspx?rnd_=" + rnd_ + "&code=" + $('#hdSected2CusCode').val());
                  return false;
                
               }


               cheak_primry_field_edit_show();


      });
        
           $("#dialog_support").dialog({
                bgiframe: true,
                modal: true,
                autoOpen: false,
                width: 650,
                minWidth:650,
                height: 550
            });

        


           $(".group_edit span").live("click", function () {
                   if ($(this).parent().hasClass("selected2")){
                    var cid_=$("#customer_primry_field_edit");
                       cid_.find("#feild_contant").children().show();
                        $("#customer_primry_field_edit .ContactPanel").show();
                   }else{
                       $("#contant_Edit .group_edit ").removeClass("selected2");
                       $(".text_tab_edit").removeClass("selected");
                       $(this).parent().addClass("selected2");
                       var cid_=$("#customer_primry_field_edit")
                       cid_.find("#feild_contant").children().hide()
                       var a_find=  cid_.find('[in_group='+$(this).parent().attr("group_code")+']');
                       a_find.parent().show();
                       a_find.parent().parent().show();
                       a_find.parent().parent().parent().show();
                       $("#customer_primry_field_edit .ContactPanel").show();

                     
                   }
                   cheak_primry_field_edit_show();

           });




     // refreshIntervalcustomer = setInterval("replace_cus()", 3000);
       
       $(".add_person_new").click(function(){
            $("#dialog_add_person_new").dialog("open");
            $("#dialog_add_person_new").height($("#dialog_add_person_new .box").height());

       });
          
       $('#btn_back_oder_person').click(function(){
      
            $("#dialog_add_person_new").dialog("close");
       });

       $('#btn_add_oder_person').click(function(){
            var dialog_= $("#dialog_add_person_new");
            if ($("#txtName_customeradd2").val() =="" ){
                dialog_.find("#lblName_addcus2").addClass("field_empty");
                return false;
            }
            jQuery.grep($("#dialog_add_person_new input"), function (n, i) {
                $(n).val($(n).val());
            });
                 var e = {}; var send_ = {};
               
                e.name = $('#txtName_customeradd2').val();
                e.perdfix=$('#ctl00_ContentHolder_ddlPrefix_new2 option:selected').text();
                e.prefix_value= $('#ctl00_ContentHolder_ddlPrefix_new2').val();
                e.title=$("#txttitle_customeradd2").val();
                 var pr={};
                var count=0;
                dialog_.find(".ContactPanel").find("input").each(function(index) {
                    var r={};
                    r.code = $(this).attr("primary_text") + "," +$(this).attr("field_group_") + "," +$(this).attr("access");
                    r.text=$(this).val();
                    r.parameter = $(this).attr("parameter_name");
                    r.vtype = $(this).attr("vtype");
                    if (r.vtype == "4") { // is boolean
                        if ($(this).parents(".ContactPanelField").find(".inactive").length > 0) {
                            r.checked = '';
                        } else {
                            r.checked = $(this).is(":checked");
                        }

                    } else {
                        r.checked = '';
                    };

                    if (r.vtype == "9") { // customer Link
                        r.CustomerSelectedCode = $(this).attr("customerSelectedXCode");
                        if (r.CustomerSelectedCode == undefined) r.CustomerSelectedCode = '';
                    } else {
                        r.CustomerSelectedCode = '';
                    };
                    if (r.vtype == "10") { // factor Link
                        r.FactorSelectedId = $(this).attr("factorSelectedXId");
                        if (r.FactorSelectedId == undefined) r.FactorSelectedId = '';
                    } else {
                        r.FactorSelectedId = '';
                    };
                    r.group=$(this).attr("field_group_");
                    r.in_list = $(this).attr("in_list");
                    r.order = $(this).attr("order");
                    r.select_text="";
                    pr[count]=r;
                    count=count+1;

                });  
                dialog_.find(".ContactPanel").find("select").each(function(index) {
                    var r={};
                    r.code = $(this).attr("primary_text") + "," + $(this).attr("field_group_") + "," + $(this).attr("access");
                    r.text=$(this).val();
                    r.parameter = $(this).attr("parameter_name");
                    r.vtype = $(this).attr("vtype");
                    r.checked = '';
                    r.CustomerSelectedCode = '';
                    r.FactorSelectedId = '';
                    r.group=$(this).attr("field_group_");
                    r.in_list=$(this).attr("in_list");
                    r.select_text = $(this).find('option:selected').text();
                    r.order = $(this).attr("order");
                    pr[count]=r
                    count=count+1;
                });
                e.primery=pr;
                send_.item=e;
                var col_p=$("#div_oder_person_add").clone().removeAttr("id");
                col_p.find(".field_oder_person_add").html(e.perdfix +" " + e.name).data('info',send_);
                $("#dialog_new_customer .field_primery_tab").before(col_p);
                $("#dialog_add_person_new").dialog("close");
                $("#dialog_new_customer").height($("#dialog_new_customer .box").height());
               
       });

       $(".field_oder_person_delete").live("click",function(){
        $(this).parent().parent().remove();
       });
        
    

    $("#wfTaskShow").live("click", function () {
        var id_ = $(this).attr("wfs");
        $(this).parent().find(".tempwfwaiteshow").css("display", "inline-block");
        $(this).parent().find("#linkgetWfsTask").remove();
        getWfsTask(id_,$(this));
        return false;
    });

    $("#Button2").live("click", function () {
            $('#dialog_upload').dialog('open');
    });

     //$("#dialogEmailView").dialog({
     //           bgiframe: true,
     //           modal: true,
     //           autoOpen: false,
     //           resizable: true,
     //           width: 850,
     //           height: 520
     //       });

     //          $(".div_print").click(function () {
     //           var p_ = "<div id='sadeg'>" + $("#" + $(this).attr("printed")).html() + "</div>";
     //           var p1_ = $(p_).clone();
     //           p1_.css("background-color", "#fff");
     //           p1_.printElement({ leaveOpen: 1, printMode: "popup", pageTitle: "RaveshCrm", printBodyOptions: { styleToAdd: 'padding:10px;margin:10px;background-color:#FFF;background-image: none;', classNameToAdd: ''} });

            //       });


    $(".PrintFormCustomer").live("click", function () {
        showFormInfo($(".main_contact_Forms #box-tabs [id*=box-messages]").filter(':visible').find("a").attr("id"), ''); return false;
          
        });

    $('#ctl00_ContentHolder_ddlPrefix_new').change(function () {
        if ($(this).val()==1 || $(this).val()==2){
            $("#lbladd_cus_input").text(translate.first_last_name);
        }else{
            $("#lbladd_cus_input").text(translate.name);
        }
       
    });

    $(".advance_search_body .field_search_group_append .group_search .contradict").live("click", function () {
        
        $(this).toggleClass("contradictory");
        var state_ = $(this).hasClass("contradictory");

        var g = '';
        var group_code = $(this).parent().attr("group_code_search");
        var asplit = $('#hfgroup_value_search').val().split("#");
        $.each(asplit, function (intIndex, objValue) {
            if (g != '') { g = g + "#"; }
            if (group_code.replace("!", "").replace("%", "") == objValue.replace("!", "").replace("%", "")) {
                g = g + (state_ === true ? "!" + objValue : objValue.replace("!", ""));
            } else {
                g = g + objValue;
            }
            $('#hfgroup_value_search').val(g);
        });

    });

    $(".advance_search_body .field_search_group_append .group_search .underGroup").live("click", function () {
        
        $(this).toggleClass("underGrouping");
        var state_ = $(this).hasClass("underGrouping");

        var g = '';
        var group_code = $(this).parent().attr("group_code_search");
        var asplit = $('#hfgroup_value_search').val().split("#");
        $.each(asplit, function (intIndex, objValue) {
            if (g != '') { g = g + "#"; }
            if (group_code.replace("!", "").replace("%", "") == objValue.replace("!", "").replace("%", "")) {
                g = g + (state_ === true ? "%" + objValue : objValue.replace("%", ""));
            } else {
                g = g + objValue;
            }
            $('#hfgroup_value_search').val(g);
        });

    });

   
    $('#ctl00_ContentHolder_search_ddl_jazb').LeadSourceComponent({ multiSelect: false, writeLabel: '#LeadSource_WriteSeach' });


    $("#contant_Edit .btn-customer-link-Add").live("click", function () {
        $("#contant_Edit .customer-link-Showinfo.isCalling").removeClass("isCalling");
        $(this).parents(".contantinfoval_container").find(".customer-link-Showinfo").addClass("isCalling");
        show_customer_search('btnCustomerLinkCallBackFunction');
    });
    $("#contant_Edit .btn-factor-link-Add").live("click", function () {
        $("#contant_Edit .factor-link-Showinfo.isCalling").removeClass("isCalling");
        $(this).parents(".contantinfoval_container").find(".factor-link-Showinfo").addClass("isCalling");
        show_factor_search(function (item) {

            $('#UCdialog_searchFactor').dialog('close');
            var find_ = $("#contant_Edit .factor-link-Showinfo.isCalling");
            find_.val(item.factext).attr("factorSelectedXCode", item.facCode).attr("factorSelectedXId", item.facId).addClass("mini");
            find_.parents(".contantinfoval_container").find(".btn-factor-link-Remove").show();
            find_.removeClass("isCalling");
            $('#UCdialog_searchFactor').dialog('close');

            
        },2);
    });

    $("#dialog_new_customer .btn-customer-link-Add,#dialog_add_person_new  .btn-customer-link-Add").live("click", function () {
        var id_;
        if ($(this).parents("#dialog_new_customer").length == 1) {
            $("#dialog_new_customer .customer-link-Showinfo.isCalling").removeClass("isCalling");
            id_ = 1;
        } else {
            $("#dialog_add_person_new .customer-link-Showinfo.isCalling").removeClass("isCalling");
            id_ = 2;
        };
     
        $(this).parents(".add_cus_input").find(".customer-link-Showinfo").addClass("isCalling");
        show_customer_search('btnCustomerNewLinkCallBackFunction', id_);
    });
    var callingFactorLink_;
    $("#dialog_new_customer .btn-factor-link-Add,#dialog_add_person_new  .btn-factor-link-Add").live("click", function () {
        if ($(this).parents("#dialog_new_customer").length == 1) {
            $("#dialog_new_customer .factor-link-Showinfo.isCalling").removeClass("isCalling");
            callingFactorLink_=1
        } else {
            $("#dialog_add_person_new .factor-link-Showinfo.isCalling").removeClass("isCalling");
            callingFactorLink_ = 2;
        };
        $(this).parents(".add_factor_input").find(".factor-link-Showinfo").addClass("isCalling");
        // call factor serach
        show_factor_search(function (item) {

            $('#UCdialog_searchFactor').dialog('close');
            var find_
            if (callingFactorLink_ == 1) {
                find_ = $("#dialog_new_customer .factor-link-Showinfo.isCalling");
            } else {
                find_ = $("#dialog_add_person_new .factor-link-Showinfo.isCalling");
            }

            find_.val(item.factext).attr("factorSelectedXCode", item.facCode).attr("factorSelectedXId", item.facId).addClass("mini");
            find_.parents(".add_factor_input").find(".btn-factor-link-Remove").show();
            find_.removeClass("isCalling");
            $('#UCdialog_searchFactor').dialog('close');


        }, 2);
    });
    $("#contant_Edit .btn-customer-link-Remove").live("click", function () {
        var find_=$(this).parents(".contantinfoval_container").find(".customer-link-Showinfo");
        find_.val("").removeAttr("customerSelectedXCode").removeClass("mini");
        $(this).hide();
    });
    $("#contant_Edit .btn-factor-link-Remove").live("click", function () {
        var find_=$(this).parents(".contantinfoval_container").find(".factor-link-Showinfo");
        find_.val("").removeAttr("factorSelectedXCode").removeAttr("factorSelectedXId").removeClass("mini");
        $(this).hide();
    });

    $("#dialog_new_customer .btn-customer-link-Remove,#dialog_add_person_new .btn-customer-link-Remove").live("click", function () {
        var find_ = $(this).parents(".add_cus_input").find(".customer-link-Showinfo");
        find_.val("").removeAttr("customerSelectedXCode").removeClass("mini");
        $(this).hide();
    });
    $("#dialog_new_customer .btn-factor-link-Remove,#dialog_add_person_new .btn-factor-link-Remove").live("click", function () {
        var find_ = $(this).parents(".add_factor_input").find(".factor-link-Showinfo");
        find_.val("").removeAttr("factorselectedxcode").removeAttr("factorselectedxid").removeClass("mini");
        $(this).hide();
    });
    $("#contant_Edit .customer-link-Showinfo").live("click", function () {
        var cusCode = $(this).attr("customerSelectedXCode");
        if (cusCode != undefined) {
            customer_Show_Info(cusCode, $(this).val()); 
        }
    });
    $("#contant_Edit .factor-link-Showinfo").live("click", function () {
        var factorId = $(this).attr("factorSelectedXId");
        if (factorId != undefined) {
            showfactorInfo(factorId, $(this).attr("factorSelectedXCode"));
        }
    });
    $("#dialog_new_customer .factor-link-Showinfo,#dialog_add_person_new .factor-link-Showinfo").live("click", function () {
        var factorId = $(this).attr("factorSelectedXId");
        if (factorId != undefined) {
            showfactorInfo(factorId, $(this).attr("factorSelectedXCode"));
        }
    });
    $("#contant_Edit .switchery.inactive").live("click", function () {
        $(this).removeClass("inactive");
        $(this).find(".label.no").show();
        $(this).parents(".contantinfoval_container").find(".delete_field").show();
    });
    $("#dialog_new_customer .switchery.inactive,#dialog_add_person_new .switchery.inactive").live("click", function () {
        $(this).removeClass("inactive");
        $(this).find(".label.no").show();
        $(this).parents(".ContactPanel").find(".delete_field_new").show();
    });

            //change and set and delete pciture customer
    $("#selectPictureCustomer").live("click", function () {
        
        var ImageUser_ = $("#infomenu_edit").find("img");
        var oldPicture='';
        if (! ImageUser_.hasClass("img_contant")) {
            oldPicture = ImageUser_.attr("src"); };

        setCustomerPicture({
            width: 150,
            picture: oldPicture,
            allowSave: true,
            allowDelete: true,
            cust_code:  $('#hdSected2CusCode').val(),
            callback: function (imgurl) {
                $(".infomenu_edit").find("img").show().attr("src", imgurl).css("height", "65px").removeClass("img_person").removeClass("img_contant").removeClass("img_company ");
                $(".infomenu_edit").find(".divAfterimgCus").remove();
                $("#content_customer .imgcontant").find("img").css("height", "65px").attr("src", imgurl).addClass("nopading imageLargPreview").removeClass("img_person").removeClass("img_contant").removeClass("img_company ").attr("isimage", "1");
                var ks = $(".cp_contant #customer_" + $('#hdSected2CusCode').val()).find("img")
                ks.css("height", "48px").attr("src", imgurl).attr("isimage", "1").addClass("nopading imageLargPreview").removeClass("img_person").removeClass("img_company ");
                if ($('#HDisCompany').val() == "true") { ks.addClass("img_company"); } else { ks.addClass("img_person"); }

            },
            onDelete: function (msg) {
               
                    if ($('#HDisCompany').val() == "true") {
                        $(".infomenu_edit").find("img").css("height", "").addClass("img_contant  Crm-icon Crm-icon16 Crm-icon-diagram").addClass("img_company").attr("isimage", "0").hide();
                        $(".infomenu_edit").find("img").after("<div class='img_company img_edit  img_contant divAfterimgCus Crm-icon Crm-icon16 Crm-icon-diagram'></div>");


                        $("#content_customer .imgcontant").find("img").css("height", "").removeClass("nopading").addClass("img_contant  Crm-icon Crm-icon16 Crm-icon-diagram").addClass("img_company").attr("isimage", "0").hide();
                        $("#content_customer .imgcontant").find("img").after("<div class='img_company img_contant divAfterimgCus Crm-icon Crm-icon16 Crm-icon-diagram'></div>");

                        $(".cp_contant #customer_" + $('#hdSected2CusCode').val()).find("img").css("height", "").addClass("img_company  Crm-icon Crm-icon16 Crm-icon-diagram").attr("isimage", "0").removeClass("nopading").hide();
                        $(".cp_contant #customer_" + $('#hdSected2CusCode').val()).find("img").after("<div class='divAfterimgCus img_company Crm-icon Crm-icon16 Crm-icon-diagram'></div>");
                    } else {
                        $(".infomenu_edit").find("img").css("height", "").addClass("img_contant Crm-icon Crm-icon16 Crm-icon-customer").addClass("img_person").attr("isimage", "0").hide();
                        $(".infomenu_edit").find("img").after("<div class='img_person img_edit  img_contant divAfterimgCus Crm-icon Crm-icon16 Crm-icon-customer'></div>");

                        $("#content_customer .imgcontant").find("img").css("height", "").removeClass("nopading").addClass("img_contant Crm-icon Crm-icon16 Crm-icon-customer").addClass("img_person").attr("isimage", "0").hide();
                        $("#content_customer .imgcontant").find("img").after("<div class='img_person img_contant divAfterimgCus Crm-icon Crm-icon16 Crm-icon-customer'></div>");


                        $(".cp_contant #customer_" + $('#hdSected2CusCode').val()).find("img").css("height", "").addClass("img_person Crm-icon Crm-icon16 Crm-icon-customer").attr("isimage", "0").removeClass("nopading").hide();
                        $(".cp_contant #customer_" + $('#hdSected2CusCode').val()).find("img").after("<div class='divAfterimgCus img_person Crm-icon Crm-icon16 Crm-icon-custome'></div>");
                    }

            }
        });

    });

    $(".accessChkShow:input").live("change", function (read) {
        var me = $(this);
        var p = me.parent().parent();
        if (me.is(":checked")) {
            p.find("input").removeAttr("disabled");
        } else {
            p.find("input").attr("disabled", "disabled").attr('checked', false);
        }
        me.removeAttr("disabled");
        saveReferredCustomer(this, $(this).parents(".AccessManagementRow").find(".NameOfUser").attr("username"));
    });

    $(".accessChkDelete:input,.accessChkEdit:input").live("change", function () {

        saveReferredCustomer(this, $(this).parents(".AccessManagementRow").find(".NameOfUser").attr("username"));
    });

    $(".main_contact_emailSection a").live("click", function () {
        var find_ = $(this).parents(".main_contact_email");
        if ($(this).attr("id") == "SendEmailtag") {
            find_.find(".tab_main").show();
            find_.find(".tab_mainpop3").hide();
            find_.find("#nextemail").show();
        } else {
            find_.find(".tab_main").hide();
            find_.find(".tab_mainpop3").show();
            find_.find("#nextemail").hide();
            var e = {};
            e.domain = $('#HFdomain').val();
            e.cus_code = $('#hdSected2CusCode').val();
            e.user_code=$('#HFUserCode').val();
            e.codeing = $("#hfcodeing").val();
            var mt = $("#content_customer .main_contact_email .tab_mainpop3");
            mt.html("").mask("...");
            Client.getEmailPop3(e, function (c) {
                if (c.d != null) {
                    for (f = 0; f < c.d.length; f++) {
                        customer_emailpop3 = new emailpop3List(c.d[f]);
                        customer_emailpop3.AddNew();
                    }
                }
                mt.find(".wrapper_field").show();
                mt.unmask();
                RequestEnded();
            })
        }
        $(this).parents(".main_contact_emailSection").find(".selectBoxEmail").removeClass("selectBoxEmail");
        $(this).parent().addClass("selectBoxEmail");
        return false;
    });


    $(".main_contact_FactorSection a").live("click", function () {
        //var find_ = $(this).parents(".main_contact_email");
        var add;
        if ($(this).parent().hasClass("selectBoxFactor")) {
            $(this).parent().removeClass("selectBoxFactor");
            add = false;
        } else {
            $(this).parent().addClass("selectBoxFactor");
            add = true;
        }

        var factor= $(".main_contact_factor .wrapper_field[type=3]");
        var perFactor=  $(".main_contact_factor .wrapper_field[type=2]");
        var buyFactor = $(".main_contact_factor .wrapper_field[type=1]");

        if ($(this).attr("id") == "FactorTag") {
            if (add) {
                factor.attr("show", true);
            } else {
                factor.attr("show", false);
            }

        } else   if ($(this).attr("id") == "PerFactorTag")  {
            if (add) {
                perFactor.attr("show", true);
            } else {
                perFactor.attr("show", false);
            }

        } else {
            if (add) {
                buyFactor.attr("show", true);
            } else {
                buyFactor.attr("show", false);
            }
        };
        $("#content_customer .main_contact_factor .wrapper_field").hide();
        paging_warpper("factor", $(".main_contact_factor .wrapper_field[show=true]").length);
        return false;
    });

//Active DeActive 
    $('#content_customer .btnActiveCustomer').live("click", function (e) {
        var me = $(this);
        e.stopPropagation();

        if (me.hasClass('ActiveCustomer')) {
            me.removeClass('ActiveCustomer');
            me.addClass('DeActiveCustomer');
            me.parents('.head_edit').addClass("headDeActive").addClass("animated");

        } else {
            me.removeClass('DeActiveCustomer');
            me.addClass('ActiveCustomer');
            me.parents('.head_edit').removeClass("headDeActive").addClass("animated");
        }

    });

    $(".shareCustomer").live("click", function () {
        shareInSocialNetworks($('#hdSected2CusCode').val(), '')
    });

    $("#commentComponentCustomer").commentComponent({
        mode: 2,
        width: 580,
        height: 310,
        maxDataLoad: 5,
        editable: true,
        removeable: false,
        changeOnlyMaster: true,
        textHeightGrowDuble: true,
        openDialog: true,
        dialogTitle: translate.comments,
        sendByEnter: true,
        iconSelector: '.CustomerCommenting'
    });

    $('.saleButton').live("click", function (e) {
        e.preventDefault();
        AddSaleDialog(null, null, $('#ctl00_ContentHolder_hdSected2CusCodeServer').val(), $('#ctl00_ContentHolder_hdSected2CusNameServer').val());
        return false;
    });

        });//--------------------------------------------------------------------------------------------------------------------------------End document ready

        function saveReferredCustomer(Object, userSelect_) {
            var z = $(Object);
            var e = { user_code: $('#HFUserCode').val(), codeing: $('#HFcodeDU').val(), domain: $('#HFdomain').val(), CusCode: $('#hdSected2CusCode').val() };
            e.mode = $(Object).attr("class");
            e.action = $(Object).is(":checked");
            e.userSelect = userSelect_;
            var send_ = {};
            send_.items = e;
            $.ajax({
                type: "POST", url: "../WebServices/ReferredCustomer.asmx/Save_ReferredCustomer", contentType: "application/json; charset=utf-8", dataType: "json",
                data: JSON.stringify(send_), success: function (c) {
                    message(c.d, true,700);
                }

            });
        }
        function btnCustomerLinkCallBackFunction(code, name, other, callbackId) {
            var find_ = $("#contant_Edit .customer-link-Showinfo.isCalling");
            find_.val(name).attr("customerSelectedXCode", code).addClass("mini");
            find_.parents(".contantinfoval_container").find(".btn-customer-link-Remove").show();
            find_.removeClass("isCalling");

            $('#UCdialog_searchCustomer').dialog('close');
        };


        function btnCustomerNewLinkCallBackFunction(code, name, other, callbackId) {
            var find_ 
            if (callbackId == 1) {
                find_ = $("#dialog_new_customer .customer-link-Showinfo.isCalling");
            } else {
                find_ = $("#dialog_add_person_new .customer-link-Showinfo.isCalling");
            }
       
            find_.val(name).attr("customerSelectedXCode", code).addClass("mini");
            find_.parents(".add_cus_input").find(".btn-customer-link-Remove").show();
            find_.removeClass("isCalling");

            $('#UCdialog_searchCustomer').dialog('close');
        };
        function WidthContant(WidthAll) {
            if (WidthAll) {
                $(".cpanel_wrap1.cp_contant").width("99%")
                $(".cpanel_wrap1.cpanel_wrap2").hide();

            } else {
                $(".cpanel_wrap1.cp_contant").width("73%");
                $(".cpanel_wrap1.cpanel_wrap2").show();
            };
           

        };
  
    
       
    //function showEmailStatus(id_,email_To_id_){
    //    var e = {};
    //    var send_ = {};
    //    e.domain = $('#HFdomain').val();
    //    e.user_code = $('#HFUserCode').val();
    //    e.codeing = $("#hfcodeing").val();
    //    e.id = id_;
    //    e.email_To_id=email_To_id_;
    //    send_.items = e;
    //    var dialog_ = $("#dialogEmailView");
    //    dialog_.dialog("open");
    //    dialog_.find("center").show();
    //    dialog_.find("#viewRecipientsbody").html("");
    //    dialog_.find(".attachtag_").remove();
    //    $.ajax({ type: "POST", url: "../WebServices/Email_service.asmx/get_Email_bodysent_auto",
    //        data: JSON.stringify(send_), contentType: "application/json; charset=utf-8", dataType: "json",
    //        success: function (c) {
    //          var dialog_= $("#dialogEmailView")
    //          dialog_.find("center").hide();
    //          dialog_.find("#viewRecipientsbody").html(c.d[0]);
    //        jQuery.each(c.d[1], function (Index, Value) {
          
    //                 dialog_.find("#viewRecipientsbody").after("<span class='tags m1 left attachtag_' style='background-color: #C5C5C5;color: #2E2E2E;'>"+ Value +"</span>");
    //        });
    //        }
    //    });


    //}


    function getWfsTask(id_wfs,obj_) {
            var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
            e.o.id_wfs = id_wfs;
            $.ajax({ type: "POST", url: "../WebServices/workflow_.asmx/Get_WfsTask",
                data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                success: function (c) {
                    if (c.d[0] != "error") {
                        var str_ = '';
                        var strlink_ = '';
                       $.each(c.d[1], function (i, item) {
                     
                       // str_=str_ + '<img style="margin: 5px;position: absolute;bottom: 0px;" class="left_right" src="workflow/src/images/symbols/icon/'+item.type+'.gif" title="'+item.title+'">'
                           str_ = str_ + '<div style="margin-bottom: 7px;cursor: pointer;" onclick="Workflow_Show_Info(\'' + item.id_wfstart + '\',\'' + item.id + '\',\'' + "" + '\');return false;"> ' + (item.subject === null ? " " : item.subject) + '  ' + item.date_start + ' ' + item.time_start + (item.date_end === "" ? " " : "-") + ' ' + item.date_end + ' ' + item.time_end + '</div>';
                           strlink_ = strlink_ + '<a id="linkgetWfsTask" style="margin: 0 10px;"  onclick="Workflow_Show_Info(\'' + item.id_wfstart + '\',\'' + item.id + '\',\'' + "" + '\');return false;"> ' + translate.report_txt + ' </a>';

                           obj_.parent().find(".tempwfwaiteshow").hide();

                       });
                       obj_.parent().parent().find(".contantinfo_name").show().html(str_);
                       obj_.parent().find("#wfTaskShow").after(strlink_);
                    }
                    else {
                        // show message error - > c.d[1]
                        
                    }
                }
            });
        }
      function clear_add_cutomer_oder(){
            var dig_cus=$("#dialog_add_person_new")
            dig_cus.find(".inputing").find("input").val("");
            dig_cus.find(".delete_field_new:visible").click();
                dig_cus.find(".expend_field").remove();
                dig_cus.find(".field_empty").removeClass("field_empty");
                $('#ctl00_ContentHolder_ddlPrefix_new2').val("").attr("selected", "selected");
                dig_cus.find(".btn-customer-link-Remove").click();
                dig_cus.find(".btn-factor-link-Remove").click();
                $(".mydds").msDropDown().data("dd");
                dig_cus.find("select").val("");
                cheak_height($("#dialog_add_person_new"));
                $("#dialog_add_person_new").height($("#dialog_add_person_new .box").height());

          }


//     function replace_cus(){
//         get_cuslist(true, $("#Pagination .current").text(), $("#div_left .BaseLi.select_list").attr("send_"),"",false);
//     }
 function check_area_code(text_,cus_areacode){
    var str_split_=$("#hfarea_code").val().split(",");
    var blaer=false;
        jQuery.each(str_split_, function (index) {
            var ozd=text_.indexOf(str_split_[index]);
        if (ozd !=-1 && ozd==0) {
            blaer=true;
        }
        });
        return (blaer ? text_ : cus_areacode + " " + text_);

}
//    function show_ticket(ticket_id, ticket_user, letter_id) {
//             $("#dialog_support").find(".field").html("");
//            $("#dialog_support").dialog("open").mask("...");
//            var e = {};  var send_ = {};
//            e.domain = $("#HFdomain").val();
//            e.user_code = $("#HFUserCode").val();
//            e.codeing = $("#HFcodeDU").val();
//            e.support = "false";
//            e.ticket_id = ticket_id;
//            e.ticket_user = ticket_user;
//            e.letter_id=letter_id
//             send_.items = e;
//            $.ajax({
//                type: "POST",
//                url: "../WebServices/get_info.asmx/get_ticket",
//                data: JSON.stringify(send_),
//                contentType: "application/json; charset=utf-8",
//                dataType: "json",
//                success: function (c) {
//                        var fi_=$("#dialog_support").find(".field");
//                        fi_.html(c.d[7]);
//                        fi_.find(".border").removeClass("border");
//                        fi_.find(".coling-2").css("width","47%");
//                        fi_.find(".time_step1").css("padding","9px 17px 6px 0px");

//                   $("#dialog_support").unmask();
//                }
//            });
//            
//     }

       function cheak_primry_field_edit_show() {
            $("#customer_primry_field_edit #feild_contant").each(function (index) {
                                    var bol_=false;
                                    $(this).children().each(function (index) {
                                        if ($(this).is(":visible")==true) bol_=true;
                                    });
                                    if (bol_==false) $(this).parent().hide();
                      });
            cheak_height($("#contant_Edit #customer_primry_field_edit"));
  
     }



      
             // change select search_ddl_mode
            function change_search_ddl_mode(e){ 
                if ($(e).val()=="6" || $(e).val()=="7"){
                    $("#div_lugar_search_feild").find("[field_search_id1="+ $(e).attr('fid1') + "]").find(".txt_serach_input").hide();
                }else{
                    $("#div_lugar_search_feild").find("[field_search_id1="+ $(e).attr('fid1') + "]").find(".txt_serach_input").show();
                }

            }

            function set_search_item(d){

                    //iiiiiiiiiiiiiiii
                    if (d.field.length != 0)
                    {
                        //d.field_mode=kk[10]
                         for(var i = 0; i < d.field.length; i++){
                             if (d.field[i].id != "_undefined"){
                                 var cop_ = $("#search_field_clone").clone().removeAttr("id");

                                 if (d.field[i].id.split("_")[2] == "4") {
                                     cop_.find(".txt_serach_input").remove();
                                     cop_.find("#search_ddl_mode").find("option[value=3]").hide()
                                     cop_.find("#search_ddl_mode").find("option[value=4]").hide()
                                     cop_.find("#search_ddl_mode").find("option[value=5]").hide()

                                 } else {
                                     cop_.find(".ddl_serach_input_boolean").remove();
                                 };

                                 if (d.field[i].id.split("_")[2] == "9") {
                                     cop_.find("#search_ddl_mode").find("option[value=4]").hide();
                                     cop_.find("#search_ddl_mode").find("option[value=5]").hide();
                                 } else if (d.field[i].id.split("_")[2] == "10") {
                                     cop_.find("#search_ddl_mode").find("option[value=3]").hide();
                                     cop_.find("#search_ddl_mode").find("option[value=4]").hide();
                                     cop_.find("#search_ddl_mode").find("option[value=5]").hide();
                                 };

                            var id_sel=$(this).val();
                            var loop_=true;
                            while (loop_)
                                {
                                    if ($("[fid1="+id_sel+"]").length>0){
                                        id_sel=id_sel + "_1"
                                    }else{
                                        loop_=false;
                                    }
                        
                                }


                            cop_.find(".field").addClass("field_search");
                            cop_.find("#search_ddl_mode").addClass("search_ddl_mode").attr("fid",d.field[i].id).attr("fid1",id_sel);
                             
                            cop_.find("#search_ddl_mode").attr("id","search_ddl_mode" + d.field[i].id)
                   
                            cop_.find("span").html($('#search_ddl_field option[value='+d.field[i].id+']').text());
                            cop_.find(".field").attr("field_search_id",d.field[i].id).attr("field_search_id1",id_sel);
                            cop_.find(".txt_serach_input").attr("id",d.field[i].id).attr("id1",id_sel);
                            $("#div_lugar_search_feild").append(cop_.html());
                            //$("#search_ddl_mode" + d.field[i].id).val(d.field[i].mode).attr("selected", "selected");
                            $("[fid1="+id_sel+"]").val(d.field[i].mode).attr("selected", "selected");
                            //$("#advanced_search").find('input[id='+d.field[i].id +']').val(d.field[i].text);
                            $("#advanced_search").find('input[id1='+id_sel +']').val(d.field[i].text);
                            change_search_ddl_mode($("#search_ddl_mode" + d.field[i].id));
                            }
                        }
                        
                        if (d.field.length >=2){
                         $("#div_lugar_search_feild").prepend("<div id='sum_mode' class='field field-col3 left' style='width: 36%;'><div class='select select-0'><select id='search_ddl_sum_mode' class='mydds' style='width: 130px' ><option value='1'>"+translate.union+"</option><option value='2'>"+translate.intersection+"</option></select></div></div>");
                        }
                       
                        $('.search_ddl_mode').bind('change', function() {change_search_ddl_mode($(this));});  
                     }

                     $("#search_ddl_sum_mode").val(d.field_mode).attr("selected", "selected");
                     //iiiiiiiiiiiiiii

            }
       
       function get_advanced_item(){
                var property;
                var t1,t2,d1,d2,d3;
                t1=$('#search_txt_place').val();
                if (t1==null) t1=""
                t2=$('#search_txt_activity').val();
                if (t2==null) t2=""

                
                 if ($("#div_before_date").is(':visible')==false){
                    d1=$('#ctl00_ContentHolder_search_From_date').val();
                    d2=$('#ctl00_ContentHolder_search_to_date').val();
                    d3="";
                }else{
                            
                    d1="";
                    d2="";
                   
                    d3=$("#ddlNo").val() +"_"+  $("#ddl_dwm").val();
                }


                property = $('#search_ddl_item').val();
                property +="," + d1;
                property += "," + d2;
                if ($('#ctl00_ContentHolder_search_ddl_jazb').LeadSourceComponent('get').length == 0) {
                    property += "," + ""
                } else {
                    property += "," + jQuery.map($('#ctl00_ContentHolder_search_ddl_jazb').LeadSourceComponent('get'), function (n, i) { return n.code + '#' + n.mode; })[0]//$('#ctl00_ContentHolder_search_ddl_jazb').val();
                }
                property +="," + $('#ctl00_ContentHolder_search_ddl_user').val();
                property +="," + t1;
                property +="," + t2;
                property +="," + $('#hfgroup_value_search').val();
                property +="," + $('#search_txt_name').val();
                property +="," + d3;
                property +="," + $('#search_ddl_rating').val();
                property+="," + $("#groupSerchMerg input[type='radio']:checked").val();
                var search='';
                $(".field_search").each(function(index) {
                          if (search !='') search+=",";
                            search+=$(this).attr("field_search_id") + "_";
                            search += $(this).find("select").val() + "_";
                            search += ($(this).find(".txt_serach_input").length === 0 ? $(this).find(".ddl_serach_input_boolean").val() :  $(this).find(".txt_serach_input").val());
                         
                           
                });

                property +=","  + (($("#search_ddl_sum_mode").length == 0) ? '0' : $("#search_ddl_sum_mode").val());
                property +="," + search;
              

                return property;

        }
        //oooooooooo
        function split_property_advanced(property_){
                    var d = {};
                    if (property_ != ''){
                        var kk= property_.split(',');
                        d.item = kk[0];
                        d.name= kk[8];
                        d.jazb=kk[3];
                        d.create_user=kk[4];
                        d.place=kk[5];
                        d.activity=kk[6];
                        d.group_id=kk[7];
                        d.from_date=kk[1];
                        d.to_date=kk[2];
                        d.befor_date=kk[9];
                        d.rating=kk[10];
                        var kk_ID=11;
                        if (kk[11] == "and" || kk[11] == "or") {
                            d.group_merg = kk[11];
                            kk_ID = 12;
                        };
                        d.field_mode=kk[kk_ID];
               
                        var search=new Array();
                        var count=0;
                        for (var i = kk_ID + 1; i < kk.length; i++) {

                            var field = {};
                            if (kk[i] != "") {
                                var spl__ = kk[i].split("_");
                                field.id = spl__[0] + "_" + spl__[1] + "_" + spl__[2];
                                field.mode = spl__[3];
                                field.text = spl__[4];
                                search[count] = field;
                                count += 1;
                            };
                        };
                        d.field=search;
                         

                    }else{
                        d.item = $('#search_ddl_item').val();
                        d.name = $('#search_txt_name').val();
                        if ($('#ctl00_ContentHolder_search_ddl_jazb').LeadSourceComponent('get').length == 0) {
                            d.jazb = "";
                        } else {
                            d.jazb = jQuery.map($('#ctl00_ContentHolder_search_ddl_jazb').LeadSourceComponent('get'), function (n, i) { return n.code + '#' + n.mode; })[0]//$('#ctl00_ContentHolder_search_ddl_jazb').val();
                        }
                       
                        d.create_user=$('#ctl00_ContentHolder_search_ddl_user').val();
                        d.place=$('#search_txt_place').val();
                        d.activity=$('#search_txt_activity').val();
                        d.group_id = $('#hfgroup_value_search').val();

                        //if ($("#groupSerchMerg").is(":visible") == false) {
                        //    d.group_merg = "";
                        //} else {
                            
                        //}
                        d.group_merg = $("#groupSerchMerg input[type='radio']:checked").val();

                        if (!$("#div_before_date").hasClass("showDate")) {
                            d.from_date=$('#ctl00_ContentHolder_search_From_date').val();
                            d.to_date=$('#ctl00_ContentHolder_search_to_date').val();
                            d.befor_date="";
                        }else{
                              
                            d.from_date="";
                            d.to_date="";
                            d.befor_date=$("#ddlNo").val() +"_"+  $("#ddl_dwm").val();

                        }

                       
                        var search=new Array();
                       $(".field_search").each(function(index) {
                            var field = {};
                            field.id=$(this).attr("field_search_id");
                            field.mode = $(this).find("select").val();
                            if ($(this).find(".txt_serach_input").length==0){
                                field.text=$(this).find(".ddl_serach_input_boolean").val();
                            }else{
                                field.text=$(this).find(".txt_serach_input").val();
                            }
                            
                            search[index]=field;
                       });
                       d.field=search;
                       d.field_mode=(($("#search_ddl_sum_mode").length == 0) ? '' : $("#search_ddl_sum_mode").val());
                       d.rating=$('#search_ddl_rating').val();

                        
                        
                    
                    }
                    return d;

            }
           function fun_add_customer_logic(cus_code,cus_name,cop_){
                     var g=$('#HDCustomer_logic_select').val(),g_txt='';
                     var spl_=g.split(",")
                     if (jQuery.inArray(cus_code, spl_)==-1){
                         var g_cop=$("#customer_logic_editable").clone().removeAttr("id");
                         var a='';
                         var g_copo=g_cop;
                         if (g !='') g=g+",";
                         g=g + cus_code;
                         g_cop=g_copo;
                         g_cop.find("i").attr("cus_code",cus_code);
                         g_cop.find("span").html(cus_name);
                         a=a+g_cop.html();
                         $('#HDCustomer_logic_select').val(g);
                         cop_.find("#lblcus_logic_name").prepend(a);
                        
                       
                      }else{
                            alert(translate.duplicate_customer)
                      }

               }
        function create_serach_list(id,name,property,class_){
            return '<li class="BaseLi '+class_+'" ico="Crm_icon-zoom-right" send_="search" search_id='+id+' property_="'+property+'"><span class="Crm-icon Crm-icon16 Crm_icon-zoom-right-black mark_image"   style="margin-left: 10px;"></span><span class="SearchName">'+name+'</span><span class="left countitem"></span></li>'
        }
        function customerAttach(){
$('#dialog_upload').dialog('open');return false;
}
         function close_advanced_search(){
           $("#advanced_search").slideUp();
           $(".mr_add").show();
           varbtn_serachAdvanced=false;
           link_search_click=false;
           var_link_edit_search=false;
           var_property_advanced='';
            $("#edit_advancedsearch").show();
            $("#update_advancedsearch").hide();
            $('.search_ddl_mode').unbind();
            $(".link_search").show();
            $('#link_map').hide();
            $('#link_email').hide();
            $('#link_sms').hide();
            $('#link_themplateprint').hide();
            clear_advanced_search();


         }

         function clear_advanced_search(){
            $("#search_ddl_item").val("0").attr("selected", "selected");
            $('#search_txt_name').val("");
             //  $('#ctl00_ContentHolder_search_ddl_jazb').val("").attr("selected", "selected");
            $('#ctl00_ContentHolder_search_ddl_jazb').LeadSourceComponent('clear', null, { writeLabel: '#LeadSource_WriteSeach'});

            $('#ctl00_ContentHolder_search_ddl_user').val("").attr("selected", "selected");
            $('#ddlNo').val("0").attr("selected", "selected");
            $('#ddl_dwm').val("0").attr("selected", "selected");
            $("#search_txt_place option").remove();
            $("#search_txt_activity option").remove();
            $(".ui-combobox-input").val("");
            $('#hfgroup_value_search').val("");
            $("#advanced_search .group_search").remove();
            $('#hfgroup_name_search').val("");
            $("#hierarchybreadcrumb4").html(translate.select_links);
            $('#ctl00_ContentHolder_search_From_date').val("");
            $('#ctl00_ContentHolder_search_to_date').val("");
            $("#div_lugar_search_feild").html("");
            if ($("#div_before_date").is(':visible')==true){
                $(".div_change_date").toggle().toggleClass("showDate");
             }
             $("#groupSerchMerg").hide();
            $(".mydds").msDropDown().data("dd");
         }
        

        function cancel_edit(){
                    var_new_==false;
                    var con=$("#content_customer");
                    con.find(".headerCell").show();
                    con.find(".ContactEntitiesView").show();
                    con.find("#contant_Edit").remove();
                    $("#myfile_attachment").unbind();
                    $(".infomenu_edit").remove();
                    $(".infomenu").show();
                    $("#top_link").show();
                    $('#HDCustomer_logic_select').val("");
                    saveType_reload = true;
                }	

        function edit_click() {
            if ($("#ctl00_ContentHolder_btnEdit").length == 0) return false;
                $("#top_link").hide();
               // $(".infomenu").empty();
                saveType_reload=false;
                var cus_=$("#content_customer");
                cus_.find(".headerCell").hide();
                cus_.find(".ContactEntitiesView").hide();
                var cop_=$("#contant_Edit_clone").clone().attr("id","contant_Edit");


                var e = {};
                e.domain = $('#HFdomain').val();
                e.cus_code = $('#hdSected2CusCode').val();
                e.islogic = false;
                e.user_code = $('#HFUserCode').val();
                e.codeing = $("#hfcodeing").val();
                e.rnd = $("#HFRnd").val();

                Client.getCustomerInfo(e, function (c) {
                    customer_info = new customerList(c.d)
                    cop_.find(".code_head").html(customer_info.code); //code
                    cop_.find('#txtName').val(customer_info.name);//name
                    cop_.find('#txttitle').val(customer_info.title);//title
                    cop_.find("#txtcomment").html(customer_info.comment);
                    $('#HDEdit_CusCode2').val(customer_info.code2); //code2

                    cop_.find(".btnActiveCustomer").attr("oldActive", customer_info.active);
                    if (customer_info.active) {
                        cop_.find(".btnActiveCustomer").addClass("ActiveCustomer");
                    } else {
                        cop_.find(".btnActiveCustomer").addClass("DeActiveCustomer");
                        cop_.find(".head_edit").addClass("headDeActive");
                    }
    

                    //set group**********************
                    var g='',g_txt='';
                    var g_cop=$("#group_cus_editable").clone().removeAttr("id");
                    var a='';
                    var g_copo=g_cop;
                    $.each( customer_info.group, function( index, value ) {
                        if (g !='') g=g+",";
                        g=g + value.group_code;
                        g_cop=g_copo;
                        g_cop.find("div").attr("group_code", value.group_code);
                        g_cop.find("span:first").html(value.group_name);
                        a=a+g_cop.html();
                    });
                   
                    $('#HDGroupCustomer_select').val(g);
                    cop_.find(".group_label").prepend(a);
                    //end set group*******************

                    cop_.find('.DDLeadSource').LeadSourceComponent({ writeLabel: '#contant_Edit .LeadSource_label' });
                    cop_.find('#ctl00_ContentHolder_ddlPrefix').val(customer_info.prefix);//perfix
                    cop_.find('#ddrating').val(customer_info.rating);//rating
                    if (customer_info.tag==2) {
                        //is Company
                        $(".changeTagModeCustomer .fieldName").html(translate.changesto_p);
                        $(".changeTagModeCustomer .btnChangeType").attr("typeChange", "1");
                    } else {
                        //is Person
                        $(".changeTagModeCustomer .fieldName").html(translate.changesto_c);
                        $(".changeTagModeCustomer .btnChangeType").attr("typeChange", "2");
                    }

                    if (customer_info.place != ""){
            
                        if (cop_.find("#txtplace").val(customer_info.place).val()==null){
                            cop_.find("#txtplace").append("<option value="+customer_info.place+">" + customer_info.place_name+"</option>");
                        }
                        cop_.find("#txtplace").val(customer_info.place).attr("selected", "selected");
                        cop_.find(".ui-combobox").find("input").val(customer_info.place_name);
                    }

                    //lead Source
                    var ddlLead = cop_.find('.DDLeadSource');

                    var ArrSelectedItem = new Array();
                    
              
                    $.each( customer_info.leadSources, function( index, value ) {
                        var d = {};
                        d.name =(value.type== 1 ? value.IntroductioncustName : value.leadSourceName);
                        d.id = value.Leadsourceid;
                        d.code =value.Code;
                        d.mode = value.type;
                        ArrSelectedItem.push(d);
                    });
                    ddlLead.LeadSourceComponent('set', ArrSelectedItem, { writeLabel: '#contant_Edit .LeadSource_label', clone: '#LeadSource_editable' });
           
                    var m_ = '';
                    if (customer_info.attachment != null) {
                        $.each(customer_info.attachment, function (index, value) {
                            var cop_at = $("#attachment_edit_clone").clone().removeAttr("id");
                            cop_at.find(".attache_remove").attr("attachmet_id", value.id);
                            cop_at.find("a").attr("href", value.attach_file);
                            cop_at.find(".attachment_name").html(value.name);
                            m_ += cop_at.html();
                        });
                    };
                    $(".infomenu_edit .div_attachmet_edit").prepend(m_);


                    //-----------------------------
                    if (customer_info.activity != null) {
                        $.each(customer_info.activity, function (index, value) {
                            var c_ = $("#group_cus_editable").clone().removeAttr("id");
                            c_.find(".group_edit").removeClass("group_edit").addClass("cus_activity");
                            c_.find(".delete_group").removeClass("delete_group").addClass("delete_activity");
                            c_.find("div").attr("activity_code", value.activity_id);
                            c_.find("span:first").html(value.name);
                            $(".infomenu_edit").find("#div_activity").append(c_);
                        });

                    };

                });

         

                //cop_.find(".code_head").html($('#hdSected2CusCode').val()); //code
                //cop_.find('#txtName').val(cus_.find("#head_cus_name").text());//name
                //cop_.find('#txttitle').val(cus_.find("#head_cus_title").text());//title
                //cop_.find("#txtcomment").html(cus_.find("#divcomment").html());
                //$('#HDEdit_CusCode2').val(cus_.find("#head_cus_company").attr("cus_code2")); //code2
                //

                //set group**********************
                //var g='',g_txt='';
                //var g_cop=$("#group_cus_editable").clone().removeAttr("id");
                //var a='';
                //var g_copo=g_cop;
                //$("#content_customer .contant_group .tags").each(function(index) {
                //    if (g !='') g=g+",";
                //    g=g + $(this).attr("group_code");
                //    g_cop=g_copo;
                //    g_cop.find("div").attr("group_code", $(this).attr("group_code"));
                //    g_cop.find("span").html($(this).html());
                //    a=a+g_cop.html();
                //});
                //$('#HDGroupCustomer_select').val(g);
                // cop_.find(".group_label").prepend(a);
               //end set group*******************

              

                 //cop_.find('.DDLeadSource').LeadSourceComponent({ writeLabel: '#contant_Edit .LeadSource_label' });


              
                 //cop_.find('#ctl00_ContentHolder_ddlPrefix').val(cus_.find("#head_cus_perfix").attr("prefix_id"));//perfix

           
             
                //cop_.find('#ddrating').val(cus_.find(".ContactStarWidget").attr("rating"));//rating
                $('#HDisCompany_edit').val($('#HDisCompany').val());
                //if ($('#HDisCompany').val() == "true") {
                //    //is Company
                //    $(".changeTagModeCustomer .fieldName").html(translate.changesto_p);
                //    $(".changeTagModeCustomer .btnChangeType").attr("typeChange", "1");
                //} else {
                //    //is Person
                //    $(".changeTagModeCustomer .fieldName").html(translate.changesto_c);
                //    $(".changeTagModeCustomer .btnChangeType").attr("typeChange", "2");
                //}

                //var plc=$("#divplace");
                //if (plc.length ==1){
            
                //    if (cop_.find("#txtplace").val(plc.attr("place_id")).val()==null){
                //         cop_.find("#txtplace").append("<option value="+plc.attr('place_id')+">"+plc.html()+"</option>");
                //     }
                //     cop_.find("#txtplace").val(plc.attr("place_id")).attr("selected", "selected");
                //    cop_.find(".ui-combobox").find("input").val(plc.html());
                //}

                

                  
               

                if ( $('#HDisCompany_edit').val()=="true"){
                        //is company
                        cop_.find("#field_titr").hide();
                         cop_.find(".diviscustomer").hide();
                         cop_.find(".diviscompany").show();
                        var customer_=$(".infomenu #cus_name");
                        if (customer_.length != 0)
                        {
                            
                            //
                            $('#HDCustomer_logic_select').val("");
                            //set customer logic**********************
                            customer_.each(function(index) {
                                fun_add_customer_logic($(this).attr("cus_code"), $(this).find("#cus_name_text").html(), cop_);
                                cop_.find("#DivSetSubsetCustomerChange").show();
                            });
                          
                             cop_.find("#divtag_edit_logic_customer").show();

                           //end set customer logic*******************

                        }else{
                            $('#HDCustomer_logic_select').val("");
                            cop_.find('#lblcus_logic_name').html($("#link_add_person_clone").clone());
                            cop_.find("#divtag_edit_logic_customer").hide();
                        }


               }else{
                    //is customer
                    //if customer link tu customer , select customer link
                    var customer_ = $(".infomenu #cus_name");
                    if (customer_.length != 0) {

                        //
                        $('#HDCustomer_logic_select').val("");
                        //set customer logic**********************
                        customer_.each(function (index) {
                            fun_add_customer_logic($(this).attr("cus_code"), $(this).find("#cus_name_text").html(), cop_);
                            cop_.find("#DivSetSubsetCustomerChange").show();
                        });

                        cop_.find("#divtag_edit_logic_customer").show();

                        //end set customer logic*******************

                    }
                    cop_.find("#field_titr").show();
                    cop_.find(".diviscustomer").show();
                         cop_.find(".diviscompany").hide();
                        var company_=cus_.find("#head_cus_company");
                        if (company_.attr("cus_code2") !=""){
                            cop_.find('#lblcompany_name').html(company_.html()).attr("cus_code2",company_.attr("cus_code2"));
                        }else{ 
                             cop_.find('#lblcompany_name').html($("#link_add_company_clone").clone());
                             cop_.find("#divtag_edit_logic_company").hide();
                          
                        }
                   
                }

                 cop_.find("#edit_list_default").addClass("selected");
                 cus_.append(cop_);

            ////lead Source
            //     var ddlLead = cop_.find('.DDLeadSource');
            //// var LeadSource_label__ = cop_.find(".LeadSource_label");
            //     var ArrSelectedItem = new Array();
            //     cus_.find("#divjazb .cus_LeadSourceView").each(function (index) {
            //         var d = {};
            //         d.name = $(this).find("span").text();
            //         d.id = $(this).attr("leadsource_id");
            //         d.code = $(this).attr("leadsource_code");
            //         d.mode = $(this).attr("leadsource_mode");
            //         ArrSelectedItem.push(d);
            //         //  LeadSource_label__.append($.CreateLeadSource(d, '', $("#group_cus_editable").clone(), ddlLead));
            //     });
            //     ddlLead.LeadSourceComponent('set', ArrSelectedItem, { writeLabel: '#contant_Edit .LeadSource_label', clone: '#LeadSource_editable' });
           

                 cus_.find('#btnregister_Edit').hide(); // hide save btn
                 $(".mydds").msDropDown().data("dd");
                 $('#hierarchybreadcrumb6').menuA({content: $('#hierarchybreadcrumb6').next().html(),backLink: false});//  run group menu
                 
                 
                 //images
                 var infoedit_cop=$("#infomenu_edit_clone").clone();
                 $(infoedit_cop).find("#infomenu_edit").addClass("infomenu_edit");
            
                 $(".infomenu").hide().after(infoedit_cop.html());
                 var img_edit=$("#infomenu_edit img").eq(0);
                 img_edit.attr("src",cus_.find('img').attr("src"));
                 
                  if (cus_.find("img").attr("isimage")=="0"){
                      if (cus_.find("img").hasClass("img_person") == false) {
                          img_edit.addClass("img_company img_contant").hide();
                          img_edit.after("<div class='img_company img_contant divAfterimgCus img_edit Crm-icon Crm-icon16 Crm-icon-diagram'></div>");

                      } else {
                          img_edit.addClass("img_person img_contant").hide();
                          img_edit.after("<div class='img_person img_contant divAfterimgCus img_edit Crm-icon Crm-icon16 Crm-icon-customer'></div>");
                      }
                  }else{
                    img_edit.css("height","65px");
                  }


                
                //   var m_='';
                //  $("#content_customer .main_contact_attachment .attachment_field").each(function(index) {
                //    var cop_at=$("#attachment_edit_clone").clone().removeAttr("id");
                //    cop_at.find(".attache_remove").attr("attachmet_id",$(this).attr("attachmet_id"));
                //    cop_at.find("a").attr("href",$(this).find("a").attr("href"));
                //    cop_at.find(".attachment_name").html($(this).find(".attachment_name").html());
                //    m_+=cop_at.html();
                //});

                //$(".infomenu_edit .div_attachmet_edit").prepend(m_);

                    
                  
            
                   
                       
     
                  $("#txtplace").combobox();
                  $("#txtactivity").combobox_activity();

                  
                ////-----------------------------
                //var cfa_=cus_.find(".head_cus_activity");
                //if (cfa_.length != 0)
                //{

                //    cfa_.each(function(index) {
                //         var c_=$("#group_cus_editable").clone().removeAttr("id");
                //        c_.find(".group_edit").removeClass("group_edit").addClass("cus_activity");
                //        c_.find(".delete_group").removeClass("delete_group").addClass("delete_activity");
                //        c_.find("div").attr("activity_code", $(this).attr("activity_code"));
                //        c_.find("span").html($(this).html());
                //        $(".infomenu_edit").find("#div_activity").append(c_);
                //    });
      
                //}

               
                //-----------------------------
                    



                 // get all field (primery and oder for user)1234
                   var e = {};
                    e.domain = $('#HFdomain').val();
                    e.cus_code = $('#hdSected2CusCode').val();
                    e.user_code= $('#HFUserCode').val();
                    e.codeing = $("#hfcodeing").val();
                 Client.getcustomerfield(e, function (c) {
                    customer_info = new customerList(c.d[0])
                    customer_info.CreateItemEdit();
                    customer_info = new customerList(c.d[1])
                    customer_info.SetItemEdit();
                    cus_.find('#btnregister_Edit').show(); // hide save btn
                    RequestEnded();

                })
           }// end of  edit_click

          function select_group_customer(name,id){
              $('#ctl00_ContentHolder_hfgroup_name_select').val(name);
              $('#ctl00_ContentHolder_hfgroup_value_select').val(id);
             
              return false;
              
           }



                //-----------------------------delete group search
        $('.delete_group_search').live("click", function () {
        

                var group_code=$(this).parent().attr("group_code_search");
                $(this).parent().fadeOut(function(){$(this).remove(); });
               
                 var g='',n='';
                var asplit= $('#hfgroup_value_search').val().split("#");
                var asplitn= $('#hfgroup_name_search').val().split("#");

                if (asplit.length ==2){
                   $("#groupSerchMerg").hide();
                }

                var bolchack=false;
                $.each(asplit,function( intIndex, objValue ){
                    if (group_code != objValue.replace("!","").replace("%","")){
                        if (g !='') {g=g+"#";n=n+"#";}
                        g=g + objValue;
                        n=n + asplitn[intIndex];

                    }

                });
                $('#hfgroup_value_search').val(g);
                 $('#hfgroup_name_search').val(n);

               
              
      
         });
                //-----------------------------add group search
          function select_group_search(name,id,len){
//              $('#hfgroup_name_search').val(name); 
              //              $('#hfgroup_value_search').val(id);
              var contradictory_ = false;
              var underGroup_ = false;
              if (id.indexOf("!") >= 0) {
                  contradictory_ = true;
                  id = id.replace("!", "");
              }
              if (id.indexOf("%") >= 0) {
                  underGroup_ = true;
                  id = id.replace("%", "");
              }

            $("#hierarchybreadcrumb4").html(translate.select_links);
            var asplit= $('#hfgroup_value_search').val().split("#");
            var bolchack=false;
            $.each(asplit,function( intIndex, objValue ){
                if (id == objValue.replace("!","").replace("%","")){
                    bolchack=true;
                    message(translate.error_select,false);
                    return false;
                }

            });
            if( bolchack==true) return false;

    
            var g_cop=$("#group_cus_editable").clone().removeAttr("id");
            g_cop.find(".group_edit").removeClass("group_edit").addClass("group_search");
            g_cop.find(".delete_group").removeClass("delete_group").addClass("delete_group_search");
            g_cop.find("div").attr("group_code_search", id);
            g_cop.find("span:first").after('<span class="ui-icon  ui-icon-notice cursor tools contradict " title="' + translate.contradictory + '"></span>')
            if (len > 0) {
                g_cop.find(".tools").after('<span class="ui-icon  ui-icon-arrowreturn-1-e cursor underGroup  tools " title="' + translate.under_group + '"></span>');
            };
            if (contradictory_ == true) {
                g_cop.find(".contradict").addClass("contradictory");
            };
            if (underGroup_ == true) {
                g_cop.find(".underGroup").addClass("underGrouping");
            };
            g_cop.find("span:first").html(name);

         
            //ezafe kardan be hd
            var hd_gs=$('#hfgroup_value_search');
            var hd_gsn=$('#hfgroup_name_search');
            if (hd_gs.val()!=""){
            hd_gs.val(hd_gs.val()+"#");
            hd_gsn.val(hd_gsn.val()+"#");
            }
            hd_gs.val(hd_gs.val() + (contradictory_ === true ? "!" : "") + (underGroup_ === true ? "%" : "") + id);
            hd_gsn.val(hd_gsn.val()+name);
            $(".advance_search_body .field_search_group_append").append(g_cop.html());

            if (asplit.length>= 1 && asplit[0]!=""){
                $("#groupSerchMerg").show();
            }else{
                $("#groupSerchMerg").hide();
            }
   

            return false;


           }

       
            //ezafe kardan field haye asli be dialog add customer
          function set_customer_field_new (){
                    var e = {};
                    e.domain = $('#HFdomain').val();
                    e.user_code=$('#HFUserCode').val();
                    e.mode=0;
                    e.group='';
                    e.codeing = $("#hfcodeing").val();
                    Client.get_primary_field_name(e, function (c) {

                        customer_info = new customerList(c.d)
                        customer_info.Addprimery_field_new();
                       

                    });
          }
          function clear_add_cutomer(){
            var dig_cus=$("#dialog_new_customer")
                dig_cus.find("#div_create").show();
                dig_cus.find(".inputing").find("input").val("");
                dig_cus.find(".delete_field_new:visible").click();
               dig_cus.find(".expend_field").remove();
                dig_cus.find(".field_empty").removeClass("field_empty");
                dig_cus.find("#div_duplicate_list").html("")
                dig_cus.find("#div_duplicate").hide();
                dig_cus.find(".btn-customer-link-Remove").click();
                dig_cus.find(".btn-factor-link-Remove").click();
//               $("#txtName_customeradd").val("");
//               $("#txttitle_customeradd").val("");
//               $(".ui-combobox_company-input").val("");
                $('#ctl00_ContentHolder_hfgroup_name_select').val("");
              $('#ctl00_ContentHolder_hfgroup_value_select').val("");
               $("#txtactivity_customeradd  option").remove();
               $('#ctl00_ContentHolder_ddlPrefix_new').val("").attr("selected", "selected");
               $("#lbladd_cus_input").text(translate.name);
               $(".mydds").msDropDown().data("dd");
                  $('#ctl00_ContentHolder_hierarchybreadcrumb5').html(translate.select_links);
                  dig_cus.find("select").val("");
              dig_cus.find(".div_field_oder_person_add").remove();
            
      
          }
            function add_addcus_text(obj){
                var cop_=$(obj).parent().clone().addClass("expend_field");
                cop_.find(".add_field_new").hide();
                cop_.find(".delete_field_new").show();
                cop_.find("input").val("");
                if (cop_.find("input").hasClass("class_datepicker")) {
                    cop_.find("input").removeClass("hasDatepicker").removeAttr("id");
                    var dateFormat = "mm/dd/yy";
                    if (translate._calander == 'en') { cop_.find("input").datepicker({ regional: '', dateFormat: 'mm/dd/yy' }); } else { cop_.find("input").datepicker(); }
                } else if (cop_.find("input").hasClass("switchbutton")) {

                        changeSwitchery(cop_, false, false);
                   
                } else if (cop_.find("input").hasClass("customer-link-Showinfo")) {

                    cop_.find(".customer-link-Showinfo").removeAttr("customerSelectedXCode").removeClass("mini");
                    cop_.find(".btn-customer-link-Remove").hide();
                };


               // $(obj).parent().after(cop_.fadeIn(800));
                 $(obj).parent().after(cop_);
                cheak_height($("#dialog_new_customer"));
                 cheak_height($("#dialog_add_person_new"));
            }

            function changeSwitchery(content,booleanCheck,deletedShow) {
                content.find(".switchery").remove();
                content.find(".switchbutton").attr('checked', booleanCheck);
                if (deletedShow == true) {
                    content.find(".delete_field").show();
                } else {
                    content.find(".delete_field").removeClass("right_left");
                    content.find(".orginalBoolean").removeClass("orginalBoolean");
                };
                Switchery_ = new Switchery(content.find('.switchbutton')[0], { size: 'large', color: '#4caf50', secondaryColor: '#eee', trueLabel: resources.true_, falseLabel: resources.false_ });
            }



          function add_edit_text(obj,mode,swithNotCreate){
            var bol_picker=false;
               
                var cop_=$(obj).parent().clone();
                cop_.find(".add_field").hide();
                cop_.find(".delete_field").show();
                cop_.find("input").val("");
                if (cop_.find("input").hasClass("class_datepicker") && mode == undefined) {
                    bol_picker = true;
                    cop_.find("input").removeClass("hasDatepicker").removeAttr("id");
                    var dateFormat = "mm/dd/yy";
                    if (translate._calander == 'en') { cop_.find("input").datepicker({ regional: '', dateFormat: 'mm/dd/yy' }); } else { cop_.find("input").datepicker(); }
                } else if (cop_.find("input").hasClass("switchbutton")) {

                    if (swithNotCreate != true) {
                        changeSwitchery(cop_, false, false);
                    };
                } else if (cop_.find("input").hasClass("customer-link-Showinfo")) {

                    cop_.find(".customer-link-Showinfo").removeAttr("customerSelectedXCode").removeClass("mini");
                    cop_.find(".btn-customer-link-Remove").hide();

                } else if (cop_.find("input").hasClass("factor-link-Showinfo")) {

                    cop_.find(".factor-link-Showinfo").removeAttr("factorSelectedXCode").removeAttr("factorSelectedXId").removeClass("mini");
                    cop_.find(".btn-factor-link-Remove").hide();
                };
                
             
              // $(".class_datepicker").each(function(){ // for datepicker
//                    $("#" + $(this).attr("id")).datepicker("destroy")
//               }); 
              
               // $(obj).parent().after(cop_.fadeIn(800));
               if(mode==1){
                    $(obj).parent().after(cop_);
               }else{
                 $(obj).parent().parent().append(cop_);
               }


                cheak_height($("#contant_Edit #customer_primry_field_edit"));
           
            }

       
      
        //ezafe kardan grouhe jadid be moshtari
        function add_group_customer(name,id){
            var asplit= $('#HDGroupCustomer_select').val().split(",");
            var bolchack=false;
            $.each(asplit,function( intIndex, objValue ){
                if (id == objValue){
                    bolchack=true;
                    message(translate.error_select,false);
                    return false;
                }

            });
            if( bolchack==true) return false;

    
            var g_cop=$("#group_cus_editable").clone().removeAttr("id");
            g_cop.find("div").attr("group_code", id);
            g_cop.find("span:first").html(name);

            var index_ = group_delete_inupdate.indexOf(name)
            if (index_ == -1){
                group_add_inupdate.push(name);
                group_add_inupdate.push(id);
            }else{
                delete group_delete_inupdate[index_];
                delete group_delete_inupdate[index_+1];
            }

            //ezafe kardan be hd
            $('#HDGroupCustomer_select').val( $('#HDGroupCustomer_select').val() + "," + id);
            $("#contant_Edit .group_label").append(g_cop.html());

            //ezafe kardane field haye makhsuse an grouh
                // get all field (primery and oder for user)1234
                   var e = {};
                    e.domain = $('#HFdomain').val();
                    e.user_code= $('#HFUserCode').val();
                    e.group=id;
                    e.codeing = $("#hfcodeing").val();
                    $(".loading_add_group").show();
                 Client.get_customer_field_byGroup(e, function (c) {
                    customer_info = new customerList(c.d)
                    customer_info.Addprimery_field_group(id);
                       $(".loading_add_group").hide();

                    RequestEnded();
                    });

            return false;
            
        }
        function get_logic(cus_code_, cus_code2, tag) {
            //get info company or customer in company
             var e = {};
            e.domain = $('#HFdomain').val();
            e.cus_code = cus_code_;
            e.cus_code2 = cus_code2;
            e.tag = tag;
            e.user_code = $('#HFUserCode').val();
            e.codeing = $("#hfcodeing").val();
            e.rnd=$("#HFRnd").val();
            if (tag==1){
                $('#HDisCompany').val(false);
            }else if(tag==2){
                $('#HDisCompany').val(true);

            }else{
             $('#HDisCompany').val(false);
            }
           
            if (tag == "1" && cus_code2 != "") {
                    //is customer - get company info
                     $('#ctl00_ContentHolder_btnEdit').show();
                    $('#btnEdit_sample').hide();
               $('#ctl00_ContentHolder_btnDelete').show();
                    $('#btndelete_sample').hide();
            
                     Client.getlogicInfo(e, function (c) {
                         // logic_company_info(c.d[0],false);
                         logic_cus(c.d[0]);
                         if (c.d.length == 2) {
                             logic_company_info(c.d[1], true);
                         }
                           if (c.d[1][0] == 0) $(".infomenu").append($("#link_add_company_clone").clone());
                            if (saveType_reload==false) $(".infomenu").hide();
                            RequestEnded();
                           
                     });
                 
                    if (tag == 1) $(".about").html(translate.tocompany);

             } else if (tag == "1" && cus_code2 == "") {
                     Client.getlogicInfo(e, function (c) {
                         logic_cus(c.d[0]);
                         if (c.d[0][0] == 0) $(".infomenu").append($("#link_add_company_clone").clone());
                         if (c.d.length == 2) {
                             logic_company_info(c.d[1], true);
                         }
                           RequestEnded();
                     });
                    $(".about").html(translate.People_company);
                    // 'vasl shavad be yek company (agr khast) 

                } else if (tag == "2") {
                    //is company -get customer in company
                    Client.getlogicInfo(e, function (c) {
                        logic_cus(c.d[0]);
                        if (c.d.length == 2) {
                            logic_company_info(c.d[1],true);
                        }
                             $(".infomenu").removeClass("selected").append($("#link_add_person_clone").clone());
                            RequestEnded();

                     });

                } else if (tag == "0") {
                    if (cus_code2 != "") {
                        //'is customer - get company info
                        $('#HDisCompany').val(false);
                         $('#ctl00_ContentHolder_btnEdit').show();
                        $('#btnEdit_sample').hide();
                         $('#ctl00_ContentHolder_btnDelete').show();
                        $('#btndelete_sample').hide();

                        Client.getlogicInfo(e, function (c) {
                            logic_company_info(c.d[0],false);
                             if (saveType_reload==false) $(".infomenu").hide();
                            RequestEnded();
                            if (c.d[0][0] == 0) $(".infomenu").append($("#link_add_company_clone").clone());
                     });
                    } else {
                        //"requset"
                         $('#ctl00_ContentHolder_btnEdit').show();
                         $('#btnEdit_sample').hide();
                         $('#ctl00_ContentHolder_btnDelete').show();
                         $('#btndelete_sample').hide();

                        change_type_run();
                        clearattachCus("", "");
                        $("#divattachcus").hide();
                          $('#blCartablType :input').removeAttr("disabled");
                          $(".field_title_dialog2").show();
                        $("#dialog2").dialog("open");
                    }

                }

                $(".infomenu").css("top", 0);
               


        }

        function logic_cus(c) {
            if (c[0] != "0") {
                $(".infomenu").html("<ul></ul>");
                for (cs = 0; cs < c[0].length; cs++) {
                    customer_List = new customerList(c[0][cs])
                    customer_List.AddNewItemCus("logic");
                     if (saveType_reload==false) $(".infomenu").hide();
                }
                $(".infomenu").addClass("selected").css("position", "static").prepend('<div class="about">'+translate.People_company+'</div>');
                
            }
            $('#ctl00_ContentHolder_btnEdit').show();
            $('#btnEdit_sample').hide();
            $('#ctl00_ContentHolder_btnDelete').show();
            $('#btndelete_sample').hide();

        }

        function logic_company_info(d, append_) {
            if (d == "") { return false;}
            var app = $(".infomenu");
            if (append_ == false) {
                app.html("");
            }

            app.addClass("selected").css("display", "block");
            app.append("<div class='about'>"+translate.about_company+"</div>");
            app.append("<div class='name color_black'><a id='head_cus_company' class='logic_company' cus_code='" + d.code + "' >" + d.Name + "</a></div>");
            app.append("<div class='color_black marg_26'>" + d.title + "</div>");
            app.append("<div class='contant_group'></div>");

            set_group(d.group, app, "contant_group", false);
            // app.append($(".contant_group").html());
            app.append('<div class="marg_26" >' + writr_activity(d.activity) + '</div>');

            set_Pri_parameter(d.primary_field, app, d.code, 0,d.number);
            if (d.comment != "") app.append("<div>"+translate.descriptions+"</div><div><div class='color_black marg_26'>" + d.comment + "</div></div>");
            app.append("<div class='merq_a'><div style='float: right;'>" + d.CreateDate + "</div><div style='text-align: left;'>" + d.Owner + "</div></div>");
             
        
        }
        
        //set activity in this.activity
        function writr_activity(activity){
               var s_ac='';
               if (activity != undefined)
                if (activity.length != 0)
                {
                   jQuery.each(activity, function () {
                      s_ac+= '<div class="head_cus_activity" activity_code='+$(this)[0].activity_id +' activity_id='+$(this)[0].id+'>'+ $(this)[0].name+'</div>';
                    });

                }
                return s_ac;
               }

        // Seach_enter
        function Seach_enter() {
            $('#HDsearch_quick').val($("#txtSearch").val());
            $(".ui-autocomplete").hide();
            $(".clear_search").show();
            search_enter = true;
            $(".bckToList").click();
            $("#div_left .BaseLi").removeClass("select_list");
            $("#div_left .BaseLi[send_=all]").addClass("select_list");
            close_advanced_search();
            $('#ctl00_ContentHolder_HDintPage').val(1);
            get_cuslist(true, 0, "quick","",false,"");
        }


        // search  -------------------- جستجوی یک مورد  
        function search_(txt_search) {
            $("#txtSearch").val(txt_search);
            Seach_enter();

        }

        //selected_customer  -------------------------- کد مشتری داده می شود تمام اطلاعات را نشان می دهد
        function selected_customer(cus_code_) {
            $('#hdSected2CusCode').val(cus_code_);
            var e = {};
            e.domain = $('#HFdomain').val();
            e.cus_code = cus_code_;
            e.islogic = false;
            e.user_code=$('#HFUserCode').val();
            e.codeing = $("#hfcodeing").val();
            e.rnd = $("#HFRnd").val();
            WidthContant(false);
            Client.getCustomerInfo(e, function (c) {
                show_cus_befor();
                $("#maincustomerList").hide();
               
                $("#content_customer").remove();
                var w = $(".contentCustomer").clone();
                w.attr("id", "content_customer")
                w.find(".Wrapperinfo").after($("<span>").attr("title", translate.comments).addClass("CustomerCommenting"));
                customer_info = new customerList(c.d)
                $('#ctl00_ContentHolder_hdSected2CusCodeServer').val(customer_info.code);
                $('#ctl00_ContentHolder_hdSected2CusNameServer').val(customer_info.name);
                CA = customer_info.active;
                customer_info.setcontent(w);
                customer_info.setItem(w);
                $(".infomenu").html("");
                get_logic(c.d.code, c.d.code2, c.d.tag);
                 $("#div_right").unmask(); //vagti ke az edit farakhani shode mask darad
                 if (var_new_ == true) { cancel_edit(); }
                 $("#commentComponentCustomer").commentComponent("setCode", cus_code_, customer_info.perfix_value + ' ' + customer_info.name);
                RequestEnded();
            })
        }


        function show_cus_befor() {
            click_bol = true;
            $(".bckToList").show();
            $("#div_left").hide();
            $("#div_right").css("width", "99%");
            $(".cpanel_wrap1").addClass("border_none");
            $("#Pagination").hide();
            $(".results").hide();
        }


        function set_Pri_parameter(d, app,cus_code,mode_,cus_areacode) {
         if (d != null )
           if (d.length != 0) {
                var call = "";
                for (xf = 0; xf < d.length; xf++) {
                    var pr = d[xf]
                    if (pr.value != "" && pr.parameter != "") {
                    if (mode_=0)
                        app.append("<div>" + pr.parameter + "</div>");
                        var mode_ = pr.mode;
                        var icon_ = "";
                        var none_ = "";
                        if (mode_ == "fax") {
                            icon_ = '<span class="ui-icon ui-icon-fax icon_infomenu right"></span>';
                            none_ = " marg_26";
                            call = "";
                        } else if (mode_ == "tel") {
                            icon_ = '<span class="ui-icon ui-icon-tel icon_infomenu right"></span><div class="icon_contact icon_contact_call" style="display:none;"><span class="ui-icon ui-icon-telcall icon_infomenu left cursor"  style="margin:0px;"></span></div>';
                            none_ = " marg_26";
                        } else {
                            none_ = " marg_26";
                        }
                        var val_ = pr.value.split("|*|");

                        for (z = 0; z < val_.length; z++) {
                            if (mode_ == "email" || mode_ == "email_field") {
                                val_[z] = emaillink(cus_code, (z + 1), val_[z], pr.code);
                                icon_ = '<span class="ui-icon ui-icon-mail-closed icon_infomenu right"></span>';
                                call = "";
                            } else if (mode_ == "mobile") {

                                call = " class='call' CallsItem='" + val_[z] + "'  callmode='mobile'  cuscode='"+cus_code+"' callarea=''";
                                var mn=val_[z];
                                val_[z] = smslink(cus_code, z + 1, val_[z], pr.code);
                                icon_ = '<span class="ui-icon ui-icon-mobile icon_infomenu right"></span><div class="icon_contact icon_contact_call" style="display:none;"><span class="ui-icon ui-icon-telcall icon_infomenu left cursor" style="margin:0px;"></span></div>' +
                                '<div  onclick="click_sms=true; qucikSendSms(\'' + cus_code + '\',\''+ mn + '\');return false;" class="icon_contact icon_contact_sms" style="display:none;"><span class="Crm-icon Crm-icon16 Crm_icon_mobile_sms" style="margin:0px;"></span></div>';

                            } else if (mode_ == "tel") {
                                call = " class='call' CallsItem='" + val_[z] + "'   cuscode='"+cus_code+"'  callmode='tel' callarea='"+cus_areacode+"'";
                                 val_[z]=check_area_code(val_[z], cus_areacode) ;
                            }else if (mode_ == "fax") {
                                val_[z] = faxLink(cus_code, val_[z]);
                            }
                            if (d != undefined) {
                                if (d[xf].vtype == 9) {
                                    val_[z] = customeShowInfoLink(val_[z], d[xf].customerSelectedName.split("|*|")[z]);
                                }if (d[xf].vtype == 10) {
                                    val_[z] = factorShowInfoLink(d[xf].vTypeExtraCode.split("|*|")[z], val_[z]);
                                }

                            };

                            app.append("<div" + call + ">" + icon_ + "<div title='" + pr.parameter + "' class='color_black" + none_ + "' style='direction: ltr;'>" + val_[z] + "</div></div>");
                        }



                    }

                }
            }
            
        }



        // Close open dropdown slider by clicking elsewhwere on page
        var vmessage = 0;
        function message(t,mode_,time_,timeOut_) {
            vmessage += 1;
            var mc = $(".messagcall")
            if (mode_==true) mc.addClass("none");else mc.removeClass('none');
            if (t == "") {
                mc.html('<div id="LoaderImg" style="background-color: transparent;"></div>');
            } else {
                mc.html(t);
            }
                mc.show().css("left", (screen.width / 2) - ($(".messagcall").width() / 2));
                if (timeOut_ != false){vmessage -= 1;
                 setTimeout("vmessage -= 1;if (vmessage <= 0) $('.messagcall').fadeOut();",  time_ === undefined ? 4000: time_);
                 }
            }
   

        $(document).bind('click', function (e) {
            if (e.target.id != $('.dropdown').attr('class')) {
                $('.dropdown-slider').slideUp();
                $('span.toggle').removeClass('active');
            }
        });

        //select tab **************************************************************
        function funselect_tabs(id,arg_1) {
            if (id != "contact_PrintFormat") {
                $("#content_customer .tab").removeClass("selected");
                $("#" + id).addClass("selected");
                $(".main_tab").hide();
                $(".main_" + id).show();
            }
            if (id == 'contact_log') {
               // $("#iframe1Blog").attr('src', 'log.aspx?cuscode=' + $('#hdSected2CusCode').val() + '&mode=1&cusname=&rnd_=' + $("#ctl00_txtRnd").val());
                //  $("#content_customer .main_contact_log .tab_main").load("Log_UC.ascx");
                logLoad($('#hdSected2CusCode').val(), $("#content_customer .main_contact_log .tab_main"));
            
        
            } else if (id == 'contact_sms') {


                var e = {};
                e.domain = $('#HFdomain').val();
                e.mobile = '';
                e.user_code=$('#HFUserCode').val();
                e.codeing = $("#hfcodeing").val();
                for (f = 0; f < $("#content_customer .ContactEntitiesView .mobilefield").length; f++) {
                    if (e.mobile != '') e.mobile = e.mobile + ",";
                    e.mobile = e.mobile + $("#content_customer .ContactEntitiesView .mobilefield").eq(f).html();
                }

                var mt = $("#content_customer .main_contact_sms .tab_main");
                mt.html("").mask("...");
                Client.getCustomerSmsSend(e, function (c) {
                    if (c.d != null) {
                        for (f = c.d.length - 1; f >= 0; f--) {
                            customer_email = new smsSendList(c.d[f]);
                            customer_email.AddNew();
                        }
                        paging_warpper("sms", c.d.length);
                    }
                    mt.unmask("...");
                    RequestEnded();
                })



            } else if (id == 'contact_email') {

                var e = {};
                e.domain = $('#HFdomain').val();
                e.cus_code = $('#hdSected2CusCode').val();
                e.user_code=$('#HFUserCode').val();
                e.codeing = $("#hfcodeing").val();

                var mt = $("#content_customer .main_contact_email .tab_main");
                mt.html("").mask("...");
                Client.getCustomerEmailSend(e, function (c) {
                    if (c.d != null) {
                        for (f = 0; f < c.d.length; f++) {
                            customer_email = new emailSendList(c.d[f]);
                            customer_email.AddNew();
                        }
                        paging_warpper("email", c.d.length);
                    }
                    mt.unmask();
                    RequestEnded();
                })

              




            } else if (id == 'contact_Forms') {

            
                var mt = $("#content_customer .main_contact_Forms .tab_main");
                 // registerForm(0, $('#hdSected2CusCode').val(), '', (CA === true ? "search" : "searchOnly"), false, "#content_customer .main_contact_Forms .tab_main");
                var formContainer = $('#content_customer .main_contact_Forms .tab_main').empty();
                new RaveshFormUtility.FormGridMini(formContainer, {
                    custCode: $('#hdSected2CusCode').val(),
                    custName: $('#head_cus_name').text()
                });
         
                //    mt.html(c.d);
                    RequestEnded();
                    showtabForms(0);
                  
   


            } else if (id == 'contact_factor') {
                var e = {};
                e.domain = $('#HFdomain').val();
                e.cus_code = $('#hdSected2CusCode').val();
                e.user_code=$('#HFUserCode').val();
                var oder_cus='';
                $(".infomenu").find("[cus_code]").each(function (index) {
                if (oder_cus!='') oder_cus+=","
                    oder_cus+=$(this).attr("cus_code");
                });
                e.oder_cus=oder_cus;
                e.codeing = $("#hfcodeing").val();
                e.Rnd = $("#HFRnd").val();
                var mt = $("#content_customer .main_contact_factor .tab_main");
                mt.html("").mask("...");
                Client.get_customer_factor(e, function (c) {
                    $(".main_contact_FactorSection a").parent().addClass("selectBoxFactor");
                     if (c.d[0] != null) {
                        for (f = 0; f < c.d[0].length; f++) {
                            customer_factor = new customerfactorList(c.d[0][f]);
                            customer_factor.AddNew();
                        }
                        paging_warpper("factor", c.d[0].length);
                     }
                     if (c.d[1] != null) {
                         var strS_ = "";
                         $.each(c.d[1], function (i, item) {
                             if (i != 0) {
                                 strS_ += " | "
                             }
                             strS_ += '<span>' + item.name + '</span> <span>(' + item.code + ')</span>';
                         });
                         if (strS_ !=''){
                             $("#content_customer .main_contact_factor .tab_main").prepend('<center class="supportUserName left_right">' + strS_ + '</center>')
                         };
                     }
                    mt.unmask();
                    RequestEnded();
                });
            }else if (id == 'contact_support') {
                var e = {};
                e.domain = $('#HFdomain').val();
                e.cus_code = $('#hdSected2CusCode').val();
                e.user_code = $('#HFUserCode').val();
                e.userSupport = arg_1;
                var mt = $("#content_customer .main_contact_support .tab_main");
                mt.html("").mask("...");
                Client.get_customer_suppor(e, function (c) {
                     if (c.d[0] != null) {
                        for (f = 0; f < c.d[0].length; f++) {
                            customer_factor = new customersupportList(c.d[0][f]);
                            customer_factor.AddNew();
                        }
                        paging_warpper("support", c.d[0].length);
                      
                     }
                     if (c.d[1].length!=0) {
                         var strS_ = "";
                         $.each(c.d[1], function (i, item) {
                             if (i != 0) {
                                 strS_+=" | " 
                             }
                             strS_ += '<a href="#"  onclick="show_userSupport_info(\'' + item.Username + '\',\'' + item.Username + '\');funselect_tabs(\'contact_support\',\'' + item.Username + '\')">' + item.Username + '</a>';
                         });
                         $("#content_customer .main_contact_support .tab_main").prepend('<center class="supportUserName">' + strS_ + '</center>')
                     }
                    mt.unmask();
                    RequestEnded();
                });
            }else if (id=='contact_event'){
             var e = {};
              var send_ = {};
                e.domain = $('#HFdomain').val();
                e.cus_code = $('#hdSected2CusCode').val();
                e.user_code=$('#HFUserCode').val();
                send_.items = e;
                var mt = $("#content_customer .main_contact_event .tab_main");
                mt.html("").mask("...");
                Client.get_list_event_customer(send_, function (c) {
                     if (c.d != null) {
                        for (f = 0; f < c.d.length; f++) {
                            customer_event = new customereventlist(c.d[f]);
                            customer_event.AddNew();
                          

                        }
                        paging_warpper("event", c.d.length); 
                       
                     }
                     $("#commentComponentEventCustomer").remove();
                     $("#content_customer .main_contact_event .tab_main").prepend("<a style='float: left;position: absolute;left: 22px;top: 2px;' onclick='call_new_event(); '>" + translate.cap_new + "</a>").append($("<div>").attr("id", "commentComponentEventCustomer"));
                     $("#commentComponentEventCustomer").commentComponent({
                         mode: 3,
                         width: 580,
                         height: 310,
                         maxDataLoad: 5,
                         editable: true,
                         removeable: false,
                         changeOnlyMaster: true,
                         textHeightGrowDuble: true,
                         openDialog: true,
                         dialogTitle: translate.comments,
                         sendByEnter: true,
                         iconSelector: '.CustomerCommentingEvent'
                     });
                     $("#commentComponentEventCustomer").commentComponent("setCodeAttribute", "eventIdCustomer", 'eventTitleCustomer');
                    mt.unmask();
                    RequestEnded();
                });

            }else if (id=='contact_reminder'){
             var e = {};
              var send_ = {};
                e.domain = $('#HFdomain').val();
                e.cus_code = $('#hdSected2CusCode').val();
                e.user_code=$('#HFUserCode').val();
                e.codeing = $("#hfcodeing").val();
                send_.items = e;
                var mt = $("#content_customer .main_contact_reminder .tab_main");
                mt.html("").mask("...");
                Client.get_list_reminder_customer(send_, function (c) {
                     if (c.d != null) {
                        for (f = 0; f < c.d.length; f++) {
                            customer_event = new customerreminderlist(c.d[f]);
                            customer_event.AddNew();
 
                        }
                        paging_warpper("reminder", c.d.length);
                    }
                       $(".main_contact_reminder .tab_main").prepend("<a style='float: left;position: absolute;left: 22px;top: 2px;' onclick='call_new_reminder(); '>" + translate.cap_new + "</a>");
                    mt.unmask();
                    RequestEnded();
                });
            }else if (id=='contact_fax'){
             var e = {};
              var send_ = {};
                e.domain = $('#HFdomain').val();
                e.cus_code = $('#hdSected2CusCode').val();
                e.user_code=$('#HFUserCode').val();
                e.codeing = $("#hfcodeing").val();
                send_.items = e;
                var mt = $("#content_customer .main_contact_fax .tab_main");
                mt.html("").mask("...");
                Client.get_list_fax_customer(send_, function (c) {
                     if (c.d != null) {
                        for (f = 0; f < c.d.length; f++) {
                            customer_event = new customerfaxlist(c.d[f]);
                            customer_event.AddNew();
 
                        }
                        paging_warpper("fax", c.d.length);
                    }
                    mt.unmask();
                    RequestEnded();
                });
            } else if (id == 'contact_sale') {
                var e = {};
                var send_ = {};
                e.domain = $('#HFdomain').val();
                e.cus_code = $('#hdSected2CusCode').val();
                e.user_code = $('#HFUserCode').val();
                e.codeing = $("#hfcodeing").val();
                send_.items = e;
                var mt = $("#content_customer .main_contact_sale .tab_main");
                mt.html("").mask("...");
                Client.get_list_sale_customer(send_, function (c) {
                    if (c.d != null) {
                        for (f = 0; f < c.d.length; f++) {
                            customer_event = new customerSalelist(c.d[f]);
                            customer_event.AddNew();

                        }
                        paging_warpper("sale", c.d.length);
                    }
                    mt.unmask();
                    RequestEnded();
                });
            }else if (id=='contact_workflow'){
                 var mt = $("#content_customer .main_contact_workflow .tab_main");
                mt.html("").mask("...");
               var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
                e.o.cust_code = $('#hdSected2CusCode').val();
                $.ajax({ type: "POST", url: "../WebServices/workflow_.asmx/Get_WfsCustomer",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        if (c.d[0] != "error") {
                            $.each(c.d[1], function (i, item) {
                                ObjUserStarter = eval("(" + item.userStarter + ")");
                                ObjRuntype = item.runType;
                                customer_event = new customerWorkflowlist(c.d[1][i],ObjUserStarter,ObjRuntype);
                                customer_event.AddNew();
                                
                            });
                             
                        }
                        else {
                            // show message error - > c.d[1]
                        }
                        paging_warpper("workflow", c.d.length);
                         $(".main_contact_workflow .tab_main").prepend("<a style='float: left;position: absolute;left: 22px;top: 2px;' onclick='call_new_workflow(); '>" + translate.cap_new + "</a>");
                        mt.unmask();
                        RequestEnded();
                    }
                });
                return false;

            } else if (id == 'contact_report') {
                var mt = $("#content_customer .main_contact_report .tab_main");
                var e = { n: 'CustomerReports', u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), p: '', m: '/reportgenerator/', r: $('#HFRnd').val() };
                $.ajax({
                    type: "POST", url: "/pages/Load_UserControl.aspx/Load_Control", contentType: "application/json; charset=utf-8", dataType: "json",
                    data: JSON.stringify(e), success: function (c) {
                        mt.html(c.d[1]).show();
                        mt.find(".filterContainer").attr("cusCode", $('#hdSected2CusCode').val());
                    }
                });

            } else if (id == 'contact_PrintFormat') {
                showCustomerTemplate($('#hdSected2CusCode').val(),false);
                return false;
            } else if (id == 'contact_CustomerReference') {
                CustomerRefrenceinit();
            }
        }
        function CustomerRefrenceinit() {
            $(".AccessManagement .wait").show();
            var send_ = {};
            var e = { user_code: $('#HFUserCode').val(), codeing: $('#HFcodeDU').val(), domain: $('#HFdomain').val() };
            send_.items = e;
            $.ajax({
                type: "POST", url: "../WebServices/get_info.asmx/get_ListOfUser", contentType: "application/json; charset=utf-8", dataType: "json",
                data: JSON.stringify(send_), success: function (c) {
                    $(".AccessManagement #AccessManagementContent").empty();
                    var tempTable=$(".templateAccessManagementRow");
                    $.each(c.d, function (i, item) {
                        var tmprow = tempTable.clone().eq(0);
                        tmprow.removeClass("templateAccessManagementRow").addClass("AccessManagementRow").attr("title", item.name);
                        tmprow.find(".NameOfUser").attr("Username", item.user_code).append($("<span>" + item.name + "</span>").attr("name", item.name).attr("customerCode", item.cust_code).click(function () {
                            customer_Show_Info($(this).attr("customerCode"), $(this).attr("Name"));
                        }));
                        tmprow.find(".NameOfUser img").attr("src", item.picture != "" ? item.picture : "../themes/resources/images/noimage.jpg").removeClass();
                       
                        tmprow.change();
                        $(".AccessManagement #AccessManagementContent").append(tmprow);
                    });
                    var send_ = {};
                    var e = { user_code: $('#HFUserCode').val(), codeing: $('#HFcodeDU').val(), domain: $('#HFdomain').val(), CusCode: $('#hdSected2CusCode').val() };
                    send_.items = e;
                    $.ajax({
                        type: "POST", url: "../WebServices/ReferredCustomer.asmx/get_ListReferredwithCustomer", contentType: "application/json; charset=utf-8", dataType: "json",
                        data: JSON.stringify(send_), success: function (c) {
                            $.each(c.d, function (i, item) {
                                var p = $(".AccessManagementRow div[username=" + item.UserCode + "]").parent();
                                p.find(".accessChkShow").attr("checked", "checked");
                                p.find("input").removeAttr("disabled");
                                if (item.Deletable == true) {
                                    p.find(".accessChkDelete").attr("checked", "checked");
                                }
                                if (item.Editable == true) {
                                    p.find(".accessChkEdit").attr("checked", "checked");
                                }
                            });
                            $(".AccessManagement .wait").hide();
                        }
                      
                    });
                }
            });



        }
        function call_new_reminder(){
               $('#hdSectedCusCode').val($('#hdSected2CusCode').val());
               $("#dialog21").dialog("open");
               $('#div_dataframe1').mask("Loading...");
        }
        function call_new_event(){
              $('#hdSectedCusCode').val($('#hdSected2CusCode').val());
              Event_Add_WU($('#hdSected2CusCode').val(), "", "", translate.event,true);
        }
        function call_new_workflow(){
            runwf_quick(3, 0, $('#hdSected2CusCode').val(), $('#hdSected2CusCode').val(), "");
         
        }
    

        function paging_warpper(mode_, length_) {
            varnextwrapper = 0;
            mode_wrapper = mode_;
          
            if (length_ > 4) {
                $(".emailpg").remove();
                if (mode_ == "sms") {
                 $("#content_customer .main_contact_sms.main_tab").append($("#nextemail").clone().addClass("emailpg"));
                }else if (mode_ == "factor"){
                   $("#content_customer .main_contact_factor.main_tab").append($("#nextemail").clone().addClass("emailpg"));
                 }else if (mode_ == "event"){
                   $("#content_customer .main_contact_event.main_tab").append($("#nextemail").clone().addClass("emailpg"));
                }else if (mode_ == "reminder"){
                   $("#content_customer .main_contact_reminder.main_tab").append($("#nextemail").clone().addClass("emailpg"));
                }else if (mode_ == "workflow"){
                   $("#content_customer .main_contact_workflowr.main_tab").append($("#nextemail").clone().addClass("emailpg"));
                }else if (mode_=="support"){
                    $("#content_customer .main_contact_support.main_tab").append($("#nextemail").clone().addClass("emailpg"));
                }else if (mode_=="fax"){
                    $("#content_customer .main_contact_fax.main_tab").append($("#nextemail").clone().addClass("emailpg"));
                }else if (mode_=="sale"){
                    $("#content_customer .main_contact_sale.main_tab").append($("#nextemail").clone().addClass("emailpg"));
                } else {
                    $("#content_customer .main_contact_email.main_tab").append($("#nextemail").clone().addClass("emailpg"));
                }
              
                $(".Previouswrapper").addClass("disabled");
                $(".count_wrapper").val(length_);
                if (length_ > 4) $(".nextwrapper").removeClass("disabled");
                nextwrapper(varnextwrapper);
            } else {
                if (mode_ == "factor") {
                    $(".main_contact_factor .wrapper_field[show=true]").show();
                } else {
                    $("#content_customer").find(".wrapper_field").show();
                }
                $(".count_wrapper").val(length_);
            }

        }
         
        var Client = new sadeg;
        //sadeg
        function sadeg() {


            this.getAllItemUrl = "../WebServices/customer_service.asmx/get_All_customer";
            this.getCustomerInfoUrl = "../WebServices/customer_service.asmx/get_customer_info";
            this.getCustomerEmailSendUrl = "../WebServices/customer_service.asmx/get_email_send";
            this.getEmailPop3dUrl = "../WebServices/customer_service.asmx/get_emailPop3ForCostomer";
            this.getCustomerSmsSendUrl = "../WebServices/customer_service.asmx/get_sms_send";
            //this.getCustomerformUrl = "../WebServices/customer_service.asmx/get_cus_form_info";
           // this.tel_goyaUrl = "../WebServices/customer_service.asmx/tel_goya";
            this.get_cus_logic_infoUrl = "../WebServices/customer_service.asmx/get_cus_logic_info";
            this.set_tagUrl = "../WebServices/customer_service.asmx/set_tag";
            this.delete_customerUrl = "../WebServices/customer_service.asmx/delete_customer";
            this.set_code2Url = "../WebServices/customer_service.asmx/set_code2";
            this.getcustomerfieldUrl = "../WebServices/customer_service.asmx/get_customer_field";
            this.changeTageModeUrl = "../WebServices/customer_service.asmx/change_Tag_Mode";
            this.crop_imageUrl = "../WebServices/customer_service.asmx/crop_image";
            this.delete_imageUrl = "../WebServices/customer_service.asmx/delete_image";
            this.edit_customerUrl = "../WebServices/customer_service.asmx/edit_customer";
            this.get_customer_field_byGroupUrl = "../WebServices/customer_service.asmx/get_customer_field_byGroup";
            this.add_customerUrl = "../WebServices/customer_service.asmx/add_customer";
            this.get_primary_field_nameUrl = "../WebServices/customer_service.asmx/get_primary_field_name";
            this.save_searchUrl = "../WebServices/customer_service.asmx/save_search";
            this.get_advanced_serachUrl = "../WebServices/customer_service.asmx/get_advanced_serach";
            this.delete_advanced_searchUrl = "../WebServices/customer_service.asmx/delete_advanced_search";
            this.update_searchUrl = "../WebServices/customer_service.asmx/update_search";
            this.get_field_all_nameUrl = "../WebServices/customer_service.asmx/get_field_all_name";
            this.delete_attachmentUrl = "../WebServices/customer_service.asmx/delete_attachment";
            this.get_customer_factorUrl = "../WebServices/customer_service.asmx/get_customer_factor";
            this.get_customer_supportUrl = "../WebServices/customer_service.asmx/get_customer_support";
            this.get_list_event_customerUrl = "../WebServices/Calendar_service.asmx/get_list_event_customer";
            this.get_list_reminder_customerUrl = "../WebServices/schedule_linked.asmx/get_list_reminder_customer";
            this.get_list_fax_customerUrl = "../WebServices/customer_service.asmx/get_list_fax_customer";
            this.get_list_sale_customerUrl = "../WebServices/customer_service.asmx/get_list_sale_customer";
            this.save_search_clickUrl = "../WebServices/customer_service.asmx/save_search_click_customer";

            this.save_search_click = function (c, e) {this.POST(this.save_search_clickUrl, c, e)};
            this.getAllItem = function (c, e) {this.POST(this.getAllItemUrl, c, e)};
            this.getCustomerInfo = function (c, e) {this.POST(this.getCustomerInfoUrl, c, e)};
            this.getCustomerEmailSend = function (c, e) { this.POST(this.getCustomerEmailSendUrl, c, e) };
            this.getEmailPop3 = function (c, e) { this.POST(this.getEmailPop3dUrl, c, e) };
            this.getCustomerSmsSend = function (c, e) {this.POST(this.getCustomerSmsSendUrl, c, e)};
          //  this.getCustomerform = function (c, e) { this.POST(this.getCustomerformUrl, c, e) };
           // this.calling = function (c, e) { this.POST(this.tel_goyaUrl, c, e) };
            this.getlogicInfo = function (c, e) { this.POST(this.get_cus_logic_infoUrl, c, e) };
            this.settag = function (c, e) { this.POST(this.set_tagUrl, c, e) };
            this.delete_customer = function (c, e) { this.POST(this.delete_customerUrl, c, e) };
            this.set_code2 = function (c, e) { this.POST(this.set_code2Url, c, e) };
            this.getcustomerfield = function (c, e) { this.POST(this.getcustomerfieldUrl, c, e) };
            this.changeTageMode = function (c, e) { this.POST(this.changeTageModeUrl, c, e) };
            this.crop_image = function (c, e) { this.POST(this.crop_imageUrl, c, e) };
            this.delete_image = function (c, e) { this.POST(this.delete_imageUrl, c, e) };
            this.edit_custome = function (c, e) { this.POST(this.edit_customerUrl, c, e) };
            this.get_customer_field_byGroup = function (c, e) { this.POST(this.get_customer_field_byGroupUrl, c, e) };
            this.add_customer = function (c, e) { this.POST(this.add_customerUrl, c, e) };
            this.get_primary_field_name = function (c, e) { this.POST(this.get_primary_field_nameUrl, c, e) };
            this.save_search = function (c, e) { this.POST(this.save_searchUrl, c, e) };
            this.get_advanced_serach = function (c, e) { this.POST(this.get_advanced_serachUrl, c, e) };
            this.delete_advanced_search = function (c, e) { this.POST(this.delete_advanced_searchUrl, c, e) };
            this.update_search = function (c, e) { this.POST(this.update_searchUrl, c, e) };
            this.get_field_all_name = function (c, e) { this.POST(this.get_field_all_nameUrl, c, e) };
            this.delete_attachment = function (c, e) { this.POST(this.delete_attachmentUrl, c, e) };
            this.get_customer_factor = function (c, e) { this.POST(this.get_customer_factorUrl, c, e) };
            this.get_customer_suppor = function (c, e) { this.POST(this.get_customer_supportUrl, c, e) };
            this.get_list_event_customer = function (c, e) { this.POST(this.get_list_event_customerUrl, c, e) };
            this.get_list_reminder_customer = function (c, e) { this.POST(this.get_list_reminder_customerUrl, c, e) };
            this.get_list_fax_customer = function (c, e) { this.POST(this.get_list_fax_customerUrl, c, e) };
            this.get_list_sale_customer = function (c, e) { this.POST(this.get_list_sale_customerUrl, c, e) };
            this.POST = function (c, e, d) {
                RequestStarted();
                e = JSON.stringify(e);
                $.post_(c, e, function (c) {
                    d && d(c);
                    RequestEnded();
                }, "json")
            };
        }//end sadeg


        function _ajax_request(c, e, d, f, g, k) {
            jQuery.isFunction(e) && (d = e, e = {});
            return jQuery.ajax({ type: "POST", url: c, data: e, success: d, dataType: f, contentType: k })
        }


        jQuery.extend({ get_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "GET") },
            put_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "PUT") },
            post_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "POST", "application/json; charset=utf-8") },
            delete_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "DELETE") }
        });


        var numberOfCurrentRequests = 0;
        //request start **************************************************
        function RequestStarted() {
            numberOfCurrentRequests++;
            $("#LoaderImg").show()
        }
        //request end*****************************************************
        function RequestEnded() {
            if (numberOfCurrentRequests != 0)
                numberOfCurrentRequests--;
            if (numberOfCurrentRequests == 0)
                $("#LoaderImg").hide();
        }

        //function********************************************************
        function init_cus() {
        if (search_enter != true)
            var hval = $("#hfinit").val();
        if (hval != "0") {
            //if (hval == "ReferredTo") { $(".link_search").hide(); } else { $(".link_search").show(); }
                get_cuslist(true, 0, $("#div_left .BaseLi").eq(0).attr("send_"), "", true, hval);
            };
        }

        function pageselectCallback(page_id, jq) {
            var pageTo_=all_count_row;
            var sum_pageTo=((page_id * $('#ctl00_ContentHolder_HDintPagesize').val()) + parseInt( $('#ctl00_ContentHolder_HDintPagesize').val()));
            if  (sum_pageTo < all_count_row){
            pageTo_=sum_pageTo;
            }
            $('#Searchresult').text(translate.result_search + ' ' + translate.from+' ' + ((page_id * $('#ctl00_ContentHolder_HDintPagesize').val()) + 1)+ '  ' + translate.until +'  ' + pageTo_+ ' ');
            $(".infomenu").hide();
            var send_=""
            var d = {};
            var hfinit = "";
            if ($('#HDsearch_quick').val() == "") {
                send_ = $("#div_left .BaseLi.select_list").attr("send_");
//                if (send_=='search'){
//                    d=var_searach_property; 
//                }else{
//                    
//                    d='';
//                }
                  d=var_searach_property; 
                  if (varbtn_serachAdvanced == true) send_ = 'Advanced';

                  if (d == "" && $(".select_list").hasClass("serachSaveCustomer")) {
                      hfinit = $("#hfinit").val();
                  }
                    
                   
            } else {
                send_ = "quick";
            }
            get_cuslist(false, page_id + 1, send_, d, false, hfinit);
            return false;
        }

       
       var all_count_row=0;
        function get_cuslist(init,page_,send_,advanced,list_advanced,load_one_) {
            var e = {};
            if (send_=="search"){
                send_="Advanced";
             //  advanced=split_property_advanced($("#div_left .BaseLi.select_list").attr("property_"));
            }
            if (send_=="Advanced"){
               $('#ctl00_ContentHolder_hdadvanced_item').val(JSON.stringify(advanced));
            }
            e.domain = $('#HFdomain').val();
            e.user_code = $('#HFUserCode').val();
            if (init == true) {
                e.intpage = $('#ctl00_ContentHolder_HDintPage').val();
                   
            } else {
                e.intpage = page_;
               $('#ctl00_ContentHolder_HDintPage').val(page_)
            }
            e.intPagesize = $('#ctl00_ContentHolder_HDintPagesize').val();
            e.access = $('#ctl00_ContentHolder_HDaccess').val();
            e.cus_group = $('#ctl00_ContentHolder_HDg').val();
            e.send_ = send_;
            e.cus_code2 = "0"
            e.search_quick = $('#HDsearch_quick').val();
            e.advanced=advanced;
            e.list_advanced=list_advanced;
            e.codeing = $("#hfcodeing").val();
            e.load_one=load_one_;
            var load_one__=load_one_;
            $("#maincustomerList").mask("loading...");
            Client.getAllItem(e, function (c) {
                if (c.d[1] != "print" ) { $("#maincustomerList").html(""); }
                var page_size_select, all_count_select;
                if (c.d[0] == "0") {
                    page_size_select = 0;
                    all_count_select = 0;

                    if (c.d[1]=="email"){
                        var rnd_ = $("#ctl00_txtRnd").val();
                       window.location="create_Email.aspx?advanced=email&rnd_=" + rnd_;
                    }else if (c.d[1] == "map") {
                        var rnd_ = $("#ctl00_txtRnd").val();
                        window.location = "map.aspx?advanced=map&rnd_=" + rnd_;
                    }else if (c.d[1] == "sms") {
                        var rnd_ = $("#ctl00_txtRnd").val();
                        window.location = "managesms2.aspx?advanced=sms&id=0&rnd_=" + rnd_;
                    } else if (c.d[1] == "print") {
                        // print elemet list
                        //c.d[3][1] text
                        //c.d[3][0] customer
                        $("#maincustomerList").unmask();
                        $('.waitloadforminfo').fadeOut();
                        $('.DivTempFormInfo').remove();
                        $.each(c.d[3][0], function (i, item) {
                            var kk = item;
                            var text_ = c.d[3][1];
                            text_ = text_.replace(/#customer_name#/g, item.Name);
                            text_ = text_.replace(/#customer_perfix#/g, item.perfix_value);
                            text_ = text_.replace(/#CUSFIELD_comment#/g, item.comment);
                            text_ = text_.replace(/#CUSFIELD_location#/g, item.place_name);
                            text_ = text_.replace(/#CUSFIELD_title#/g, item.title);

                            if (text_.indexOf("#customer_group_name#") != -1) {
                                var myArray = [];
                                $.map(item.group, function (val, i) {
                                    myArray.push(val.group_name);
                                });
                                text_ = text_.replace(/#customer_group_name#/g, myArray.join(","));
                            }

                            if (text_.indexOf("#CUSFIELD_") != -1) {
                                if (item.primary_field != null) {
                                    $.each(item.primary_field, function (a, b) {
                                        var r = new RegExp("#CUSFIELD_" + b.code + "_" + b.link2 + "#", "g");
                                        text_ = text_.replace(r, b.value.replace(/[|][*][|]/g, " , "));
                                    });
                                }

                            }


                            text_ = text_.replace(/#CUSFIELD[_]\d*[_]\d*#/g, " ");



                            text_ = text_.replace(/#customer_name#/g, "");
                            text_ = text_.replace(/#customer_perfix#/g, "");
                            text_ = text_.replace(/#CUSFIELD_comment#/g, "");
                            text_ = text_.replace(/#CUSFIELD_location#/g, "");
                            text_ = text_.replace(/#CUSFIELD_title#/g, "");


                            $('.formInfoContainer').append('<div class="DivTempFormInfo DivTempFormInfo_' + c.d[3][2] + "_" + i + '" style="clear: both;">' + text_ + '</div>');





                        });

                        return false;
                    }


                } else {
                    for (f = 0; f < c.d[0].length; f++) {
                        customer_List = new customerList(c.d[0][f]);
                        customer_List.AddNewItemCus("");
                        //$('[title]').easyTooltip(); 
                        
                   
                    }
                    page_size_select = c.d[1][0].intPageSize;
                    all_count_select = c.d[1][0].count_allrows;
                    all_count_row=all_count_select;
                }
              
                // <span class="left"></span>

                if (init == true) {
                    //c.d[1][0].count_allrows: 2550
                    //c.d[1][0].intPage: 1
                    //c.d[1][0].intPageSize: 10

                    //set pageing********************
                    var opt = { callback: pageselectCallback };
                    opt.items_per_page = page_size_select;
                    opt.next_text = translate.next_todo;
                    opt.num_display_entries =4;
                    opt.num_edge_entries = 2;
                    opt.prev_text = translate.previous_todo;
                   
                    var page_to=all_count_row;
                    var sum_pageTo=((0 * $('#ctl00_ContentHolder_HDintPagesize').val()) + parseInt( $('#ctl00_ContentHolder_HDintPagesize').val()));
                    if  (sum_pageTo < all_count_row){
                    page_to=sum_pageTo;}
                    $('#Searchresult').text(translate.result_search + ' ' + translate.from +' ' + 1 + '  ' + translate.until+'  ' + page_to + '  ');

                    $("#Pagination").pagination(all_count_select, opt);
                    //end set paging**********************
                
                }

                // create list advanced search in right menu
                if (c.d[2] != null) {
                    $("#div_left .BaseLi.serachSaveCustomer").remove();
                    var htm='';
                    var cl = '';
                    for (f = 0; f < c.d[2].length; f++) {
                        if (f == 0) { cl = "serachSaveCustomer First_ul"; } else { cl = "serachSaveCustomer" }
                        htm += create_serach_list(c.d[2][f].id,c.d[2][f].name,c.d[2][f].Property_,cl);
                        cl='';
                     }
                     $("#div_left ul").append(htm);
                }
                if (load_one__!=""){
                    $("#div_left  .BaseLi").each(function (index) {
                        ico = $(this).attr("ico");
                        $(this).removeClass("select_list").find(".Crm-icon").removeClass(ico).addClass($(this).attr("ico") + "-black")
                        $(this).find(".countitem").html("");
                    });
                   
                    var finder_;
                    if (parseInt(load_one__) || load_one__=="0") {
                       finder_= $("#div_left").find("[search_id='" + load_one__ + "']");
                    }else{
                       finder_= $("#div_left").find("[send_='" + load_one__ + "']");
                    }
                    ico = finder_.attr("ico");
                    finder_.addClass("select_list");
                    finder_.find(".Crm-icon").addClass(ico).removeClass(ico + "-black");
                }
                if ( $("#div_left .BaseLi.select_list").length==0){
                     ico = $("#div_left .BaseLi").eq(0).attr("ico");
                     $("#div_left .BaseLi").eq(0).addClass("select_list");
                     $("#div_left .BaseLi").eq(0).find(".Crm-icon").addClass(ico).removeClass(ico + "-black");
                }
                
                $("#div_left .BaseLi .countitem").html("");
                $("#div_left .BaseLi.select_list .countitem").html("(" + all_count_select + ")");
                     
              

                RequestEnded();
                $("#maincustomerList").unmask();
            })

        }

  

           //customer factor function**********************************

        function customerfactorList(c) {
            this.options = c;
            this.id = c.id;
            this.code = c.code;
            this.date_ = c.date_;
            this.time = c.time;
            this.temp = c.temp;
            this.type = c.type;
            this.price = c.price;
            this.typeId = c.typeId;
            this.owner=c.owner;
            this.unitprice=c.unitprice;
            this.name_tafzili = c.name_tafzili;
            this.seller = c.seller;
            this.sellerName = c.sellerName;

            this.AddNew = function () {
                var cp_ = $("#wrapper_field_clone").clone();
                var k = "";
                cp_.removeAttr("id");
                cp_.attr("type", this.typeId).attr("show", true);
                var result = '<a href="#" onclick="showfactorInfo(\'' + this.id + '\',\'' + $('#ctl00_ContentHolder_HDusercode_name').val() + '\');return false;">' + this.type + ' ' + '(' + translate.cod + ' ' + this.code + ' )' + '</a>';
                                                  
                cp_.find("h2").prepend(result);
                var rs_ = '';

                if (this.sellerName != '') {
                    rs_ = ' <span style="  padding: 0 45px;">' + resources.seller + ': ' + this.sellerName + ' </span>';
                };

                rs_ += ' <span>' + resources.registrar + ': ' + this.owner + ' </span>';

                cp_.find("h2 .left").html(rs_).css("font-weight","normal");
                if (this.price != '') {
                    cp_.find("p").prepend(translate.amount + ' ' + this.price + ' ' + this.unitprice);
                } else {
                    cp_.find("p").prepend(translate.amount + ' _____ ' );
                }
                cp_.find("p .left").html(this.temp);
                cp_.find(".contantinfo_container").html(translate.date);
                cp_.find(".contantinfoval_container").html(this.time + '  ' + this.date_);
                cp_.find(".contantinfo_name").show().html( this.name_tafzili);
                $("#content_customer").find(".main_contact_factor .tab_main").append(cp_);
            };
        } //end

           //customer event function**********************************

        function customereventlist(c) {
                  


            this.AddNew = function () {
                var cp_ = $("#wrapper_field_clone").clone();
                var k = "";
                cp_.removeAttr("id");
               
                 if (c.Link == 2) {
                    cp_.find("h2").prepend( ' ('+translate.form +' ' + c.form_name + ') ');
                }
                 cp_.find("h2").prepend(c.Create_user);
                 cp_.find("h2 .left").html(c.Date_start);
                cp_.find("p").prepend( c.Subject);
                var cos_=''
                if (c.commentig == null){cos_='0';}else{cos_=c.commentig.length;}
                var comment_ = '<div class="event_comment right_left" style="clear: both;margin-top: 4px;" ><div>' + c.Comment + '</div>'
                if (cos_!='0'){
                     //jQuery.each(c.commentig, function () {
                     //   comment_+="<div class='event_com'><div>"+this.name+"</div><div style='float: right;'>"+this.date_+"</div><div style='float: left;'>" +this.time + "</div><div style='clear: both;'>"+this.Commnet+"</div></div>";
                     // });

                }
                comment_ += '</div>';
                cp_.find("p .left").html("").append($("<span>").addClass("CustomerCommentingEvent left_right").attr("eventIdCustomer", c.Id).attr("eventTitleCustomer", c.Subject));
                cp_.find("p").append(comment_);
         
                cp_.find(".contantinfo_container").html(translate.date);
                cp_.find(".contantinfoval_container").html(c.Time_start + "  " + c.Date_start + "             " + c.Time_end + "  " + c.Date_end );
                $("#content_customer").find(".main_contact_event .tab_main").append(cp_);
            };
        } //end

      //customer reminder function**********************************

        function customerreminderlist(c) {
            this.AddNew = function () {
                var cp_ = $("#wrapper_field_clone").clone();
                var k = "";
                cp_.removeAttr("id");
                cp_.find("h2 .left").html(c.StartReminderDateTime.replace(/,/g, "<br>"));
                cp_.find("p").prepend( c.text_);
                cp_.find("p .left").html("");
                var to_str = "";
                if (c.to_ != null) {
                    jQuery.each(c.to_, function () {

                        if ($(this)[0].attachment_picture == "") {
                            to_str +=" <div class='gwt_Image_field' user_code='" + $(this)[0].user_code + "'  title='" + $(this)[0].name + "'><div class='gwt-Image'> <span class='Crm-icon Crm-icon16 mark_image  Crm-icon-person-black' style='margin: 7px;'></span> </div> </div>";
                        } else {
                            to_str += " <div class='gwt_Image_field'  user_code='" + $(this)[0].user_code + "' title='" + $(this)[0].name + "'><div class='gwt-Image'><img style='margin: 0px; border-width: 0px; height: 30px;' src='" + $(this)[0].attachment_picture + "'>  </div> </div>";

                        }
                    });
                }
           
                cp_.find("h2").prepend(to_str);
                $("#content_customer").find(".main_contact_reminder .tab_main").append(cp_);
            };
        } //end

      //customer fax function**********************************
        function customerfaxlist(c) {
            this.AddNew = function () {
                var cp_ = $("#wrapper_field_clone").clone();
                var k = "";
                cp_.removeAttr("id");
                cp_.find("h2 .left").html(c.date_ + " " + c.time_);
                if (c.subject_ == "") {
                    c.subject_ = translate.no_text + " (" + translate.view + ") ";
                }
                var result = '<a href="#" onclick="show_faxinfo(\'' + c.id_ + '\');return false;">' + c.subject_ + '</a>';
                cp_.find("h2").prepend(result);
                cp_.find("p").prepend(c.desc_);
                cp_.find("p .left").html(c.inbox_);
              

                $("#content_customer").find(".main_contact_fax .tab_main").append(cp_);
            };
        } //end

      //customer sale function**********************************
        function customerSalelist(c) {
            this.AddNew = function () {
                var cp_ = $("#wrapper_field_clone").clone();
               
                var k = "";
                cp_.removeAttr("id");
                cp_.find("h2 .left").html(c.regdate + (c.salefinaldate === "" ? " " : " | " + c.salefinaldate));
  

                var result = c.Username + ' ' + (c.storedocid === 0 ? " " : " | " + '<a href="#" onclick="showfactorInfo(\'' + c.storedocid + '\',\'' + $('#ctl00_ContentHolder_HDusercode_name').val() + '\');return false;">' + c.storedocid + '</a>');
                cp_.find("h2").prepend(result);
                cp_.find("p").prepend(translate.amount_forcast + ":" + c.saleamountapproximate + (c.saleamountfinal === 0 ? " " : " | " + translate.amount_final + ":" + c.saleamountfinal));
                if (c.Percente != null || c.SaleStateTitle != null) {
                    cp_.find("p .left").html(c.SaleStateTitle + "(" + c.Percente + ")");
                } else {
                    cp_.find("p .left").html('');
                };
                var result1_ = '';
                var color_ = '';
                if (c.won == 0) {
                    result1_ = translate.current; 
                    color_='rgb(79, 153, 192)';
                } else if (c.won == 1) {
                    result1_ = translate.successful;
                } else if (c.won == 2) {
                    result1_ = translate.unSuccessful;
                    color_='rgb(192, 79, 89)';
                }
                cp_.find(".contantinfo_name").show().html(result1_).css("background-color",color_);

                $("#content_customer").find(".main_contact_sale .tab_main").append(cp_);
            };
        } //end


      //customer workflow function**********************************

        function customerWorkflowlist(c,ObjUserStarter,ObjRuntype ) {
            this.AddNew = function () {
                var cp_ = $("#wrapper_field_clone").clone();
                var k = "";
                externalLink = "";
                if (c.run == 1) {
                    externalLink = '<span onclick="workFlowExtreanlLink(' + c.id_wf + ',' + c.id + ')" style="cursor: pointer;margin: 0px 4px;"><i class="icon-external-link"/></span>'
                }

                cp_.removeAttr("id");
                cp_.find("h2").prepend("<a id='wfTaskShow' href='#' class='right' wfs='" + c.id + "'>" + c.subject + "</a><div class='wait tempwfwaiteshow' style='vertical-align: top;display: none;margin: 0px 10px;'></div>" + externalLink);
                cp_.find("h2 .left").html( c.date_start  + " " + c.time_start+" " + (c.date_end === "" ? " " : "-")  +" " + c.date_end + " " + c.time_end).css("direction","ltr");
                
                 var s_;
                if (ObjRuntype[2]=="1"){ 
                    // onclick
                    if (ObjRuntype[1].indexOf("customer_Show_Info")==-1){
                        s_='<a href="#" onclick="'+ObjRuntype[1] +'">'+ObjRuntype[0]+'</a>';
                    }else{
                        s_=ObjRuntype[0];
                    }
                    
                }else{
                    // href
                    s_='<a href="'+ObjRuntype[1] +'" target="_blank" >'+ObjRuntype[0]+'</a>';
                }


                cp_.find("p").prepend(s_);
                cp_.find("p .left").html(translate.userStarter + " " + ObjUserStarter.name);
                cp_.find(".right .contantinfo_container").html(c.modeStr);
                cp_.find(".right .contantinfoval_container").html(c.runStr);
           
                $("#content_customer").find(".main_contact_workflow .tab_main").append(cp_);
            };
        } //end

           //customer support function**********************************

        function customersupportList(c) {
            this.options = c;
            this.id = c.id;
            this.subject = c.subject;
            this.status = c.status;
            this.priority = c.priority;
            this.group_ = c.group_;
            this.from_ = c.from_;
            this.letter_id = c.letter_id;
            this.date_=c.date_;
            this.time_=c.time_;


            this.AddNew = function () {
                var cp_ = $("#wrapper_field_clone").clone();
                var k = "";
                cp_.removeAttr("id");
                var result = '<a href="#" onclick="show_ticket(\'' + this.id + '\',\'' +" " + '\');return false;">' + ' (' + this.id + ') ' + this.group_ + '</a>';
                cp_.find("h2").prepend(result);
                cp_.find("h2 .left").html(this.status);
                cp_.find("p").prepend( this.subject);
                cp_.find("p .left").html(this.priority);
                cp_.find(".contantinfo_container").html(translate.date);
                cp_.find(".contantinfoval_container").html(this.time_ + '  ' + this.date_);
                $("#content_customer").find(".main_contact_support .tab_main").append(cp_);
            };
        } //end
        //email send function**********************************

        function emailSendList(c) {
            this.options = c;
            this.id=c.id;
            this.email_To_id=c.email_To_id;
            this.status = c.status;
            this.end_status = c.end_status;
            this.from_ = c.from_;
            this.from_name = c.from_name;
            this.subject = c.subject;
            this.subject_email = c.subject_email;
            this.create_date = c.create_date;
            this.create_time = c.create_time;
            this.End_date = c.End_date;
            this.End_time = c.End_time;
            this.to_ = c.to_;
            this.owner = c.owner;


            this.AddNew = function () {
                var cp_ = $("#wrapper_field_clone").clone();
                var k = "";
                cp_.removeAttr("id");
                if (this.subject != "") k = this.subject; else k = this.subject_email;
                if (k=="") k="("+ translate.email_text+")";
                var result = '<a href="#" onclick="showEmailStatus(\'' +  this.id + '\',\'' + this.email_To_id + '\');return false;">'+ k + '</a>'; 
                cp_.find("h2").prepend(result);
                cp_.find("h2 .left").html(this.owner);
                cp_.find("p").prepend(translate.from+' ' + this.from_ + ' '+translate.to+ ' '+ this.to_);
                cp_.find("p .left").html(this.status + ' - ' + this.end_status);
                cp_.find(".contantinfo_container").html(translate.date_send);
                cp_.find(".contantinfoval_container").html(this.End_time + '  ' + this.End_date);
                $("#content_customer").find(".main_contact_email .tab_main").append(cp_);
            };
        } //end
        //email pop3 function**********************************

        function emailpop3List(c) {
            this.options = c;
            this.id = c[0].MessageId;
            this.subject = c[0].Subject;
            this.to = c[0].To;
            this.from = c[0].From;
            this.date = c[1];

            this.AddNew = function () {
                var cp_ = $("#wrapper_field_clone").clone();
                var k = "";
                cp_.removeAttr("id");
                k = this.subject; 
                var result = '<a href="#" onclick="show_email_info(\'' + this.id + '\',\'\');return false;">' + k + '</a>';
                cp_.find("h2").prepend(result);
                cp_.find("h2 .left").html(this.from);
                cp_.find("p .left").html("");
                cp_.find(".contantinfo_container").html(translate.date_send);
                cp_.find(".contantinfoval_container").html(this.date);
                cp_.show();
                $("#content_customer").find(".main_contact_email .tab_mainpop3").append(cp_);
            };
        } //end
        
        //sms send function**********************************
        function smsSendList(c) {
            this.options = c;
            this.sms_number=c.sms_number;
            this.status=c.status;
            this.end_status=c.end_status;
            this.subject=c.subject;
            this.create_user=c.create_user;
            this.body=c.body;
            this.tel=c.tel;
            this.create_date=c.create_date;
            this.create_time=c.create_time;



            this.AddNew = function () {
                var cp_ = $("#wrapper_field_clone").clone();
                var k = "";
                cp_.removeAttr("id");
               
                 var strMode_ ='';
                if (this.create_user==""){
                    strMode_="<span style='color: #FFF;padding: 2px 6px 3px 5px;moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;font-weight: normal;font-size: 7pt !important;background-color: #4F97C0;' class='right'>"+ translate.recieved+"</span>";
                }else{
                    strMode_="<span style='color: #FFF;padding: 2px 6px 3px 5px;moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;font-weight: normal;font-size: 7pt !important;background-color: #93C04F;' class='right'>"+ translate.sent+"</span>";
                }
                 cp_.find("h2").prepend(strMode_ + "  " + this.subject);
                cp_.find("h2 .left").html(this.create_user);
                cp_.find("p").prepend(' ' + translate.from + ' ' + this.sms_number + ' '+translate.to+' ' + this.tel);
                cp_.find("p .left").html(this.status + '  ' + this.end_status);
                cp_.find(".contantinfo_container").html(translate.date);
                cp_.find(".contantinfoval_container").html(this.create_time + '  ' + this.create_date);
                cp_.find(".contantinfo_name").after( '<div style="padding: 0 28px 3px 28px;clear: both;">'+ this.body+'</div>');
                $("#content_customer").find(".main_contact_sms .tab_main").append(cp_);
            };
        } //end


       //customer duplicate function**********************************
        function duplicateList(c) {
            this.options = c;
            this.code=c.code;
            this.name=c.Name;
            this.code2_name=c.code2_name;
            this.perfix_value=c.perfix_value;
            this.title=c.title;
            this.tag=c.tag;
            this.tel=c.tel;
            this.mobile=c.mobile;
            this.fax=c.fax;
            this.email=c.email;
            this.attachment_picture=c.attachment_picture;

 
            this.AddNew = function () {  
                
                var h = $("#duplicate_clone").clone();
    
                h.attr("id", "customer_" + this.code).addClass("li_dup");

                h.find("#cus_company_dup").attr("tag", this.tag).text(this.code2_name);
                h.find("#cus_title_dup").text(this.title);        
                h.find("#cus_name_dup").attr("cus_code", this.code);
              
                var ha_='<a target="_blank" href="cus.aspx?rnd_='+$("#ctl00_txtRnd").val() +'&code='+this.code+'">'+this.name+'</a>'
                h.find("#cus_name_dup #cus_name_text_dup").html(ha_);
                h.find("#cus_name_dup #cus_name_perfix_dup").html(" " + this.perfix_value+ " ");
                if (this.tag == 1) { h.find("img").addClass("img_person"); } else if (this.tag == 2) { h.find("img").addClass("img_company"); }
                if (this.attachment_picture != '') {
                    h.find("img").attr("src", this.attachment_picture).addClass("nopading imageLargPreview").css("height", "48px").attr("isimage", "1");
                } else {
                    if (this.tag == 1) {
                        h.find("img").addClass("Crm-icon Crm-icon16 Crm-icon-customer").attr("isimage", "0").hide();
                        h.find("img").after("<div class='img_person  divAfterimgCus Crm-icon Crm-icon16 Crm-icon-customer'></div>");
                    } else if (this.tag == 2) {
                        h.find("img").addClass("Crm-icon Crm-icon16 Crm-icon-diagram").attr("isimage", "0").hide();
                        h.find("img").after("<div class='img_company  divAfterimgCus Crm-icon Crm-icon16 Crm-icon-diagram'></div>");
                    }
                }

                var prhtm='';
                if (this.email !='') prhtm='<div><span  title="'+translate.email+'" >'+replace_val(this.email)+'</span></div>';
                if (this.mobile !='') prhtm+='<div><span  title="'+translate.mobile+'" >'+replace_val(this.mobile)+'</span></div>';
                if (this.tel !='') prhtm+='<div><span  title="'+translate.tel+'" >'+replace_val(this.tel)+'</span></div>';
                if (this.fax !='') prhtm+='<div><span  title="'+translate.fax+'" >'+replace_val(this.fax)+'</span></div>';
                
                h.find(".primary").html(prhtm);
                $("#dialog_new_customer").find("#div_duplicate_list").append(h);
           }
           function replace_val(txt){
                var val_ = txt;
                if (val_.indexOf(",") != -1)
                         val_ = val_.substring(0, val_.indexOf(",")) + '<span class="andoder">...</span>';
            return val_
           }
        } //end

       
        var color_select = false;
        //customer item *************************
        function customerList(c) {
            this.options = c;
            this.code = c.code;
            this.code2 = c.code2;
            this.name = c.Name;
            this.code2_name = c.code2_name;
            this.active = c.Active;
            this.createDate = c.CreateDate;
            this.editDate = c.EditDate;
            this.owner = c.Owner;
            this.place = c.place;
            this.place_name = c.place_name;
          //  this.jazb = c.jazb;
          //  this.jazb_name = c.jazb_name;
            this.comment = c.comment;
            this.prefix = c.Prefix;
            this.perfix_value = c.perfix_value;
            this.title = c.title;
            this.tag = c.tag;
            this.rating = c.rating;
            this.last_view_date = c.last_view_date;
            this.attachment_picture = c.attachment_picture;
            this.primary_field = c.primary_field;
            this.group = c.group;
            this.attachment = c.attachment;
            this.activity=c.activity;
            this.cus_areacode=c.number;
            this.edit=c.edit;
            this.delete_=c.delete_;
            this.delete_person=c.delete_person;
            this.edit_personal = c.edit_personal;
            this.ownerName = c.ownerName
            this.leadSources = c.leadSources
            this.scoreClub = c.Score
      
            //this.log = c.log;




            this.AddNewItemCus = function (z) {

                var h = $("#BaselistLi").clone();
                if (color_select == false) {
                    color_select = true;
                } else {
                    h.addClass("color2");
                    color_select = false;
                }

                h.attr("id", "customer_" + this.code).attr("cus_areacode",this.cus_areacode);

                h.attr("rating", this.rating);
                h.attr("createDate", this.createDate);
                h.attr("owner", this.ownerName);
                h.find("#cus_company").attr("tag", this.tag).attr("cus_code2", this.code2).html(this.code2_name);
                h.find("#cus_title").text(this.title);
                if (this.activity != undefined){
                var s_='';
                for (act = 0; act < this.activity.length; act++) {
                   
                    s_=s_+ " <span activity_code="+this.activity[act].activity_id+" activity_id="+this.activity[act].id+">"+ this.activity[act].name+ "</span>";
                    
                }
                h.find("#cus_activity").html(s_);
                }

               

                var cusName= h.find("#cus_name");
                cusName.attr("cus_code", this.code);
                cusName.find("#cus_name_text").text(this.name);
                cusName.find("#cus_name_perfix").html(" " + this.perfix_value + " ").attr("prefix_id", this.prefix);
                if (!this.active) {
                    cusName.addClass("disabledCustomer")
                }
                //set primary_field
                if (z != "logic") {
                    if (this.primary_field != null) {
                        var k = h.find("#primary_field").clone();
                        var primary_ = "";
                        for (q = 0; q < this.primary_field.length; q++) {
                            var copy_ = k;
                            var val_ = this.primary_field[q].value;
                            if (this.primary_field[q].vtype == 9) {/* is customer Link*/
                                val_ = this.primary_field[q].customerSelectedName;
                            }
                            if (val_.indexOf("|*|") != -1) {
                                    val_ = val_.substring(0, val_.indexOf("|*|")) + '<span class="andoder">...</span>';
                            };
                            $(copy_).find('span').attr("mode", this.primary_field[q].mode).attr("val", this.primary_field[q].value).attr("title", this.primary_field[q].parameter).attr("code_p", this.primary_field[q].code).attr("vType", this.primary_field[q].vtype).html(val_);
                            if (this.primary_field[q].vtype == 9) {/* is customer Link*/
                                $(copy_).find('span').attr("customerSelectedName", this.primary_field[q].customerSelectedName)
                            } if (this.primary_field[q].vtype == 10) {/* is factor Link*/
                                $(copy_).find('span').attr("factorId", this.primary_field[q].vTypeExtraCode)
                            }
                           // if (this.primary_field[q].mode=="tel"){ $(copy_).find('span').attr("areacode",this.cus_areacode); }
                            primary_ = primary_ + $(copy_).html();
                        }
                        h.find(".primary").html(primary_);
                    }
                }
                //set group
                set_group(this.group, h, "contantinfo-group", true);

                 if (this.tag == 1) {
                        //this customer
                     h.find("img").addClass("img_person");
                    } else if (this.tag == 2) {
                        //this company 
                        h.find("img").addClass("img_company");
                    }

                if (this.attachment_picture != '') {
                    h.find("img").attr("src", this.attachment_picture).addClass("nopading imageLargPreview").css("height", "48px").attr("isimage", "1");
                   
                } else {
                    if (this.tag == 1) {
                        //this customer
                        h.find("img").addClass("Crm-icon Crm-icon16 Crm-icon-customer").attr("isimage", "0").hide();
                        h.find("img").after("<div class='img_person divAfterimgCus Crm-icon Crm-icon16 Crm-icon-customer'></div>");
                    } else if (this.tag == 2) {
                        //this company 
                        h.find("img").attr("isimage", "0").hide();
                        h.find("img").after("<div class='img_company divAfterimgCus Crm-icon Crm-icon16 Crm-icon-diagram'></div>");
                    }


                }

                if (z == "logic") {

                    h.find(".contantinfo-group").hide();

                    h.find(".contantinfo").addClass("contantinfologic")
                    h.find(".primary").hide().addClass("logicprimary").removeClass("contantinfo").removeClass("primary").removeClass("contantinfologic"); ;
                    set_Pri_parameter(this.primary_field, h.find(".logicprimary").hide(), this.code, 1,this.cus_areacode);
                    if (this.comment != '') h.find(".logicprimary").prepend('<div title="'+translate.descriptions+'" class="color_black" >' + this.comment + '</div>');
                    $(".infomenu").show();
                    $(".infomenu ul").append(h);
                } else {

                    $("#maincustomerList").append(h);
                }

            };



            this.create_edit=function (){
                show_cus_befor();
                $("#maincustomerList").hide();
                WidthContant(false);
               
                $("#top_link").hide();
                saveType_reload=false;

                $("#content_customer").remove();
                var w = $(".contentCustomer").clone();
                w.attr("id", "content_customer")
                $(".cp_contant").append(w)

                var cus_ = $("#content_customer")

                cus_.find(".headerCell").hide();
                cus_.find(".ContactEntitiesView").hide();

                var cop_=$("#contant_Edit_clone").clone().attr("id","contant_Edit");
                $('#hdSected2CusCode').val(this.code)
                cop_.find(".code_head").html(this.code); //code
                cop_.find('#txtName').val(this.name);//name
                cop_.find('#txttitle').val(this.title);//title
                cop_.find("#txtcomment").html(this.comment);
                $('#HDEdit_CusCode2').val(this.code2); //code2


                cop_.find(".btnActiveCustomer").attr("oldActive", this.active);
                if (this.active) {
                    cop_.find(".btnActiveCustomer").addClass("ActiveCustomer");
                } else {
                    cop_.find(".btnActiveCustomer").addClass("DeActiveCustomer");
                    cop_.find(".head_edit").addClass("headDeActive");
                }

                //set group**********************
                var g='',g_txt='';
                var g_cop=$("#group_cus_editable").clone().removeAttr("id");
                var a='';
                var g_copo=g_cop;
                jQuery.each(this.group, function () {
                    if (g !='') g=g+",";
                    g=g + this.group_code;
                    g_cop=g_copo;
                    g_cop.find("div").attr("group_code", this.group_code);
                    g_cop.find("span:first").html(this.group_name);
                    a=a+g_cop.html();

                });


                $('#HDGroupCustomer_select').val(g);
                 cop_.find(".group_label").prepend(a);
               //end set group*******************

                 cop_.find('.DDLeadSource').LeadSourceComponent({ writeLabel: '#contant_Edit .LeadSource_label' });
              
                cop_.find('#ctl00_ContentHolder_ddlPrefix').val(this.prefix);//perfix
                var ddllead = cop_.find('#ctl00_ContentHolder_ddljazb');
                var LeadSource_label_=cop_.find(".LeadSource_label");
                jQuery.each(this.leadSources, function () {
                    var d = {};
                    if (this.type == $.modeLeadSourceEnum.Introductioncust) {
                        d.name = this.IntroductioncustName;
                    }else{
                        d.name = this.leadSourceName;
                    }
                    d.id = this.Leadsourceid
                    d.code = this.Code
                    d.mode = this.type;
                    LeadSource_label_.append($.CreateLeadSource(d, '', $("#LeadSource_editable").clone(), ddllead));

                });
                

                cop_.find('#ddrating').val(this.rating);//rating
                if (this.tag==1){
                    $('#HDisCompany_edit').val("false")
                }else{
                    $('#HDisCompany_edit').val("true")
                }
  

             
                if (this.place != ''){
            
                    if (cop_.find("#txtplace").val(this.place).val()==null){
                         cop_.find("#txtplace").append("<option value="+this.place+">"+this.place_name+"</option>");
                     }
                    cop_.find("#txtplace").val(this.place).attr("selected", "selected");
                    cop_.find(".ui-combobox").find("input").val(this.place_name);
                }

  
               

                if ( $('#HDisCompany_edit').val()=="true"){
                        //is company
                         cop_.find("#field_titr").hide();
                         cop_.find(".diviscustomer").hide();
                         cop_.find(".diviscompany").show();
                         $('#HDCustomer_logic_select').val("");
                         cop_.find('#lblcus_logic_name').html($("#link_add_person_clone").clone());
                         cop_.find("#divtag_edit_logic_customer").hide();
                        


               }else{
                    //is customer
                    cop_.find("#field_titr").show();
                    cop_.find(".diviscustomer").show();
                    cop_.find(".diviscompany").hide();
                   
                        if (this.code2 !=""){
                            cop_.find('#lblcompany_name').html(this.code2_name).attr("cus_code2",this.code);
                        }else{ 
                             cop_.find('#lblcompany_name').html($("#link_add_company_clone").clone());
                             cop_.find("#divtag_edit_logic_company").hide();
                          
                        }
                   
                }

                
                 cus_.append(cop_);
                 $(".mydds").msDropDown().data("dd");
                 $('#hierarchybreadcrumb6').menuA({content: $('#hierarchybreadcrumb6').next().html(),backLink: false});//  run group menu
                 
                 
                 //images
                 var infoedit_cop=$("#infomenu_edit_clone").clone();
                 $(infoedit_cop).find("#infomenu_edit").addClass("infomenu_edit");
            
                 $(".infomenu").hide().after(infoedit_cop.html());
                 var img_edit=$("#infomenu_edit img").eq(0);
                 img_edit.attr("src",this.attachment_picture);
                 

                  if (this.attachment_picture==""){
                      if (this.tag == 2) {
                          img_edit.addClass("img_company img_contant").hide();
                          img_edit.after("<div class='img_company img_contant img_edit  divAfterimgCus Crm-icon Crm-icon16 Crm-icon-diagram'></div>");
                      } else {
                          img_edit.addClass("img_person img_contant").hide();
                          img_edit.after("<div class='img_person img_edit  img_contant divAfterimgCus Crm-icon Crm-icon16 Crm-icon-customer'></div>");
                      }
                  }else{
                    img_edit.css("height","65px");
                  }


                 
     
                  $("#txtplace").combobox();
                  $("#txtactivity").combobox_activity();

                  
    

            }//end of create_edit


            this.setcontent = function (w) {
                
                w.find("#head_cus_perfix").html(this.perfix_value).attr("prefix_id",this.prefix);
                w.find("#head_cus_name").text( this.name);
                w.find("#head_cus_title").text(this.title);
                var head_cus_company = w.find("#head_cus_company")
                head_cus_company.html(this.code2_name).attr("cus_code2", this.code2).attr("tag", this.tag);
                w.find(".code_head").html(this.code);
                //set group
                set_group(this.group, w, "contant_group", false);
                //  var aa = w.find(".marggroup .tags").clone();

                if (this.attachment_picture != '') {
                    w.find("img").attr("src", this.attachment_picture).addClass("nopading imageLargPreview").css("height", "65px");
                } else {
                    if (this.tag == 1) {
                        //this customer
                        w.find("img").css("height", "").addClass("img_contant").addClass("Crm-icon Crm-icon16 Crm-icon-customer img_person").attr("isimage", "0").hide();
                        w.find("img").after("<div class='img_contant img_person divAfterimgCus Crm-icon Crm-icon16 Crm-icon-customer'></div>");

                    } else if (this.tag == 2) {
                        //this company 
                        w.find("img").css("height", "").addClass("img_contant img_company Crm-icon Crm-icon16 Crm-icon-diagram").attr("isimage", "0").hide();
                        w.find("img").after("<div class='img_contant img_company divAfterimgCus Crm-icon Crm-icon16 Crm-icon-diagram'></div>");
                    }


                }


                var rating_ = this.rating;
                var sre_reating = "";
                for (z = 0; z < 5; z++) {
                    if (rating_ != 0) {
                        sre_reating = sre_reating + '<i class="starImage filledStar fas icon-star"></i>';
                        rating_ = rating_ - 1;
                    } else {
                        sre_reating = sre_reating + '<i class="starImage emptyStar icon-star"></i>';
                    }

                }
                w.find(".ContactStarWidget").html(sre_reating).attr("rating",this.rating);

                var per_info_ = '';
                var bol_tel = false;

                if (this.primary_field != null) {
                    for (z = 0; z < this.primary_field.length; z++) {
                        if (this.primary_field[z].mode == 'tel') {
                            //set tel
                            per_info_ = per_info_ + '<div>' + this.primary_field[z].value.split("|*|")[0] + '</div>'
                            bol_tel = true;
                        }
                        if (this.primary_field[z].mode == 'email') {
                            //set tel
                            per_info_ = per_info_ + '<div>' + emaillink(this.code, 1, this.primary_field[z].value.split("|*|")[0], this.primary_field[z].code) + '</div>';

                        }
                    }
                    if (bol_tel == false) {
                        for (z = 0; z < this.primary_field.length; z++) {
                            if (this.primary_field[z].mode == 'mobile') {
                                //set tel
                                per_info_ = per_info_ + '<div>' + smslink(this.code, 1, this.primary_field[z].value.split("|*|")[0], '4') + '</div>';
                                bol_tel = true;
                            }
                        }
                    }
                }

               
               per_info_=per_info_ + writr_activity(this.activity);

         
                w.find(".Wrapperinfo").append(per_info_)
                $(".cp_contant").append(w);

            }


            this.setItem = function (w) {
                if (this.active) {
                    w.find(".profileHeader").removeClass("headDeActive");
                } else {
                    w.find(".profileHeader").addClass("headDeActive");
                }
                CA = this.active;

                   if (this.edit==false && this.edit_personal==false){
                    w.find("#ctl00_ContentHolder_btnEdit").remove();
               
                 }else if (this.edit_personal==true && this.edit==false){
                    if ( this.owner != $("#HFUserCode").val()){
                        w.find("#ctl00_ContentHolder_btnEdit").remove();
                    }
                 }

                 if (this.delete_==false && this.delete_person==false){
                       w.find("#ctl00_ContentHolder_btnDelete").remove();

                 }else if (this.delete_person==true && this.delete_==false){
                   if ( this.owner != $("#HFUserCode").val()){
                        w.find("#ctl00_ContentHolder_btnDelete").remove();
                    }
                 }
                
                 if (this.scoreClub != '') {
                     w.find(".Score_club").text(this.scoreClub + " " + resources.score);
                 };
            

                 var t1 = false, e1 = false, od = false, ad = false, wb = false, os = false;
                 var t1_title = translate.phones + "/" + translate.fax;
                 var e1_title = translate.email;
                 var od_title = '';
                 var ad_title = translate.address;
                 var wb_title = translate.website;
                    var t1_s = '', e1_s = '', od_s = '', ad_s = '', wb_s = '',count_os=0;
                    var ost=new Array(); 
                    var os_s=new Array(); 
                 if (this.primary_field != null) {
                    for (r = 0; r < this.primary_field.length; r++) {

                        switch (this.primary_field[r].mode) {
                            case "mobile":
                                t1_s = t1_s + add_f_p(this.primary_field[r].parameter, this.primary_field[r].value, "mobile", this.primary_field[r].code,'',this.primary_field[r],'');
                                t1 = true;
                                break;
                            case "tel":
                                t1_s = t1_s + add_f_p(this.primary_field[r].parameter, this.primary_field[r].value, "tel",'','',this.primary_field[r],this.cus_areacode);
                                t1 = true;
                                break;
                            case "fax":
                            case "phone_field":
                            case "fax_field":
                                t1_s = t1_s + add_f_p(this.primary_field[r].parameter, this.primary_field[r].value, this.primary_field[r].mode, '', '', this.primary_field[r], '');
                                t1 = true;
                                break;

                            case "email":
                            case "email_field":
                                e1_s = e1_s + add_f_p(this.primary_field[r].parameter, this.primary_field[r].value, "email", this.primary_field[r].code,'',this.primary_field[r],'');
                                e1 = true;
                                e1_title = this.primary_field[r].mode_title;
                                break;

                            case "address":
                            case "address_field":
                                ad_s = ad_s + add_f_p(this.primary_field[r].parameter, this.primary_field[r].value, 'address', '', '', this.primary_field[r], '');
                                ad = true;
                                ad_title = this.primary_field[r].mode_title;
                                break;

                            case "website":
                            case "web_field":
                                wb_s = wb_s + add_f_p(this.primary_field[r].parameter, this.primary_field[r].value,this.primary_field[r].mode,'','',this.primary_field[r],'');
                                wb = true;
                                wb_title = this.primary_field[r].mode_title;
                                  break;
                            //    case "post":
                            //    case "post_field":
                            //case "oder_field":
                            case "oder":
                            //    od_title = this.primary_field[r].mode_title;
                                  if (count_os ==0){
                                      ost[count_os]=this.primary_field[r].mode_title;
                                      var aa= os_s[count_os];
                                       if (aa == undefined) aa='';
                                    os_s[count_os]= aa + add_f_p(this.primary_field[r].parameter, this.primary_field[r].value,'','','',this.primary_field[r],'');
                                    count_os=count_os+1;
                                    os=true;
                                  }else{
                                        var count1=count_os;
                                        var boloder=true;
                                        var Same;
                                       for (var xz = 0; xz < count1; xz++) {
                                            if ( this.primary_field[r].mode_title== ost[xz]){
                                                //ezafe be os_s
                                                boloder=false;
                                                Same=xz;
                                            }
                                       }
                                       if (boloder==true){
                                         //jadidi bezanad
                                                ost[count_os]=this.primary_field[r].mode_title;
                                                var aa= os_s[count_os];
                                                if (aa == undefined) aa='';
                                                os_s[count_os]= aa + add_f_p(this.primary_field[r].parameter, this.primary_field[r].value,'','','',this.primary_field[r],'');
                                                count_os=count_os+1;
                                       }else{
                                        //ezafe be os_s
                                        os_s[Same]=  os_s[Same] + add_f_p(this.primary_field[r].parameter, this.primary_field[r].value,'','','',this.primary_field[r],'');
                                       }


                                  }
                              
                                
                               
                                break;
                            default: //oder
                                //code CustomFieldsContainer
                                od_s = od_s + add_f_p(this.primary_field[r].parameter, this.primary_field[r].value, '', '', '', this.primary_field[r], '');
                                if (od_title == "") {
                                    od_title = this.primary_field[r].mode_title;
                                }
                                od = true;
                        }


                    }
                 }
                    var count_ = 0;
                    var cop_t1, cop_e1, cop_wb, cop_ad, cop_od, cop_jazb_plc, cop_comment;
                    var cop_os =new Array();
                    if (t1 == true) {
                        cop_t1 = add_f_c(translate.phones+"/"+translate.fax, t1_s);
                        count_ = count_ + 1;
                    }
                    if (e1 == true) {
                        cop_e1 = add_f_c(e1_title, e1_s);
                     //   cop_e1 = add_f_c(translate.email, e1_s);
                        count_ = count_ + 1;
                    }
                    if (wb == true) {
                        cop_wb = add_f_c(wb_title, wb_s);
                        //cop_wb = add_f_c(translate.website, wb_s);
                        count_ = count_ + 1;
                    }
                    if (ad == true) {
                        cop_ad = add_f_c(ad_title, ad_s);
                      //  cop_ad = add_f_c(translate.address, ad_s);
                        count_ = count_ + 1;
                    }
                    if (od == true) {
                        if (od_title == "") { od_title = translate.other_property; }
                        cop_od = add_f_c(od_title, od_s);

                       // cop_od = add_f_c( translate.other_property, od_s);
                        count_ = count_ + 1;
                    }
                    if (os ==true){ //1234567
                        for (var xz = 0; xz < ost.length; xz++) {
                           // if (cop_os.length ==0){
                                 cop_os[xz]= add_f_c(ost[xz], os_s[xz]);
                                 count_ = count_ + 1;
//                            }else{
//                                for (var xz1 = 0; xz1 <= xz; xz1++) {
//                                    if (ost[xz1]==ost[xz]){
//                                        //ezafe be om
//                                         cop_os[xz]=cop_os[xz] + add_f_c(ost[xz], os_s[xz]);

//                                    }else{
//                                        //jadid
//                                        cop_os[xz]= add_f_c(ost[xz], os_s[xz]);
//                                        count_ = count_ + 1;
//                                    }
//                                }
//                            }

                           
                           
                            
                        }

                    }

                    var jz_s = '';
                    var str_leadSources = '';
                    jQuery.each(this.leadSources, function () {
                        var d = {};
                        if (this.type == $.modeLeadSourceEnum.Introductioncust) {
                            d.name = this.IntroductioncustName;
                        } else {
                            d.name = this.leadSourceName;
                        }
                        d.id = this.Leadsourceid
                        d.code = this.Code
                        d.mode = this.type;
                        str_leadSources = str_leadSources + $.CreateLeadSource(d, "cus_LeadSourceView", $("#LeadSource_editable").clone(), undefined).html();
                    });



                    if (str_leadSources == "") {
                        jz_s="<div id='divjazb' jazb_id ></div>";
                    } else {
                        jz_s = add_f_p(translate.way_attract, str_leadSources, "", "", " id='divjazb' ", undefined, '', "  overflow: hidden;");
                    }
                        

                    if (this.place_name != "") jz_s = jz_s + add_f_p(translate.location, this.place_name,"",""," id='divplace' place_id='"+this.place+"'");

                    if (jz_s != "") {
                        cop_jazb_plc = add_f_c(translate.location+"/"+translate.way_attract, jz_s);
                        count_ = count_ + 1
                    }


                    z = count_ % 2;
                    if (cop_t1 != undefined) cop_t1.addClass("col2");
                    if (cop_e1 != undefined) cop_e1.addClass("col2");
                    if (cop_wb != undefined) cop_wb.addClass("col2");
                    if (cop_ad != undefined) cop_ad.addClass("col2");
                    if (cop_od != undefined) cop_od.addClass("col2");
                    if (cop_os != undefined) 
                        for(var ib = 0; ib < cop_os.length; ib++){
                         cop_os[ib].addClass("col2");
                        }
                       

                    if (z == 0) {
                        //zoj
                        if (cop_jazb_plc != undefined) cop_jazb_plc.addClass("col2");
                    }

                    var com_s = '';
                    if (this.comment != "") {
                        com_s = add_f_p(translate.descriptions, this.comment,"","","id='divcomment'");
                        cop_comment = add_f_c(translate.descriptions, com_s);
                    }
                /*new for order*/
                    var titleOrder = new Array();
                    var filedMobileTeleFax = false;
                    if (this.primary_field != null) {
                        $.each(this.primary_field, function (key, value) {
                            var title = value.mode_title;
                            var a = $.grep(titleOrder, function (a) { return a == title });
                            if (a.length == 0) {
                                titleOrder.push(title);
                                switch (value.link2) {
                                    case "1":
                                    case "2":
                                    case "3":
                                        if (filedMobileTeleFax == false) {
                                            w.find(".CustomFieldsContainer").append(cop_t1);
                                            filedMobileTeleFax = true;
                                        };
                                        break;
                                    case "4":
                                        w.find(".CustomFieldsContainer").append(cop_e1);
                                        break;
                                    case "5":
                                        w.find(".CustomFieldsContainer").append(cop_wb);
                                        break;
                                    case "6":
                                        w.find(".CustomFieldsContainer").append(cop_ad);
                                        break;
                                    default:
                                        var vfind = w.find(".CustomFieldsContainer")
                                        for (var ib = 0; ib < cop_os.length; ib++) {
                                            if ($(cop_os[ib]).find(".blockHeader").text() == title) {
                                                vfind.append(cop_os[ib]);
                                                break;
                                            }



                                        }

                                }
                            }
                        });
                    };
                /*end new for order*/
                 //   w.find(".CustomFieldsContainer").append(cop_t1).append(cop_e1).append(cop_wb).append(cop_ad);
                    var vfind= w.find(".CustomFieldsContainer")
                    // for(var ib = 0; ib < cop_os.length; ib++){
                    //    vfind.append(cop_os[ib]);
                    //    }

                       vfind.append(cop_od).append(cop_jazb_plc);
                   
                  //  if (cop_t1 != undefined) w.find(".CustomFieldsContainer").append(cop_comment);
                                               w.find(".CustomFieldsContainer").append(cop_comment);

                    funselect_tabs("contact_info","");
                    $("#contact_default").click();

                    var fi = w.find(".ContactPanel.col2");
                    fi.each(function (index) {
                        if (index % 2 == 0)
                            if ($(this).height() > fi.eq(index + 1).height())
                                fi.eq(index + 1).css("min-height",$(this).height());
                    });

                    var cop_sys, cop_sys1;
                    var sys_s = '', sys_s1 = '';
                    sys_s = sys_s + add_f_p(translate.date_create, this.createDate);
                    if (this.editDate != '') sys_s = sys_s + add_f_p(translate.date_edit, this.editDate);
                    if (this.last_view_date != '') sys_s = sys_s + add_f_p( translate.viewed, this.last_view_date);
                    sys1_s = add_f_p(translate.user, this.ownerName);

                    

                    cop_sys = add_f_c( translate.date_create+"|"+ translate.edit, sys_s);
                    cop_sys1 = add_f_c(translate.user_create, sys1_s);
                    w.find(".CustomFieldsSystem").append(cop_sys.addClass("col2")).append(cop_sys1.addClass("col2"));



                    // set attachment file
                    if (this.attachment != null) {
                        var att_s = '';
                        for (e = this.attachment.length -1; e >= 0; e--) {
                            att_s = att_s + add_attach(this.attachment[e].attach_file, this.attachment[e].name, this.attachment[e].id);
                        }
                      
                    }
                      w.find(".main_contact_attachment .tab_main").append(att_s).append("<a style='position: absolute;left: 22px;top: 2px;' class='left'  onclick='customerAttach();' >"+ translate.addAttach+"</a>");

                    //                    //set log
                    //                    if (this.log != null) {
                    //                        var log_s = '';
                    //                        var l_c = $("#logWrapper_clone").clone();
                    //                        // logWrapper_clone
                    //                        for (e = 0; e < this.log.length; e++) {
                    //                            var logvs = l_c.clone();
                    //                            logvs.removeAttr("id").find(".left").html(this.log[e].time_create);
                    //                            logvs.find("p").html(this.log[e].subject);
                    //                            logvs.find("h2").prepend(this.log[e].date_create);
                    //                            log_s = log_s + logvs.html();
                    //                            //                            this.log[0].Comment: "www"
                    //                            //                            this.log[0].date_create: "1391/02/05"
                    //                            //                            this.log[0].owner: "master"
                    //                            //                            this.log[0].subject: "تماس ورودی"
                    //                            //                            : "11:27"

                    //                        }
                    //                        w.find(".main_contact_log  .tab_main").append(log_s);
                    //                    }
              
                     
              


                 // end set item
            };
          
            this.CreateItemEdit = function () {
                // w.find("#head_cus_company").attr("tag", this.tag);
                if (this.primary_field != null) {
                    var t1 = false, e1 = false, od = false, ad = false, wb = false , os = false;
                    var t1_s = '', e1_s = '', od_s = '', ad_s = '', wb_s = '', count_os = 0;
                    var t1_title = translate.phones + "/" + translate.fax;
                    var e1_title = translate.email;
                    var od_title = '';
                    var ad_title = translate.address;
                    var wb_title = translate.website;
                    var t11_s = '', e11_s = '', od11_s = '', ad11_s = '', wb11_s = '';
                    var ost=new Array(); 
                    var os_s=new Array(); 
                     var os11_s=new Array(); 
                    for (r = 0; r < this.primary_field.length; r++) {

                        switch (this.primary_field[r].mode) {
                            case "mobile":
                                t1_s = t1_s + add_f_p_edit(this.primary_field[r]);
                                t11_s+="," +this.primary_field[r].parameter;
                                t1 = true;
                                break;
                            case "tel":
                                t1_s = t1_s + add_f_p_edit(this.primary_field[r]);
                                t11_s+="," +this.primary_field[r].parameter;
                                t1 = true;
                                break;
                            case "fax":
                            case "phone_field":
                            case "fax_field":
                                t1_s = t1_s + add_f_p_edit(this.primary_field[r]);
                                t11_s+="," +this.primary_field[r].parameter;
                                t1 = true;
                                break;

                            case "email":
                            case "email_field":
                                e1_s = e1_s + add_f_p_edit(this.primary_field[r]);
                                e11_s+="," +this.primary_field[r].parameter;
                                e1 = true;
                                e1_title = this.primary_field[r].mode_title;
                                break;

                            case "address":
                            case "address_field":
                                ad_s = ad_s + add_f_p_edit(this.primary_field[r]);
                                ad11_s+="," +this.primary_field[r].parameter;
                                ad = true;
                                ad_title = this.primary_field[r].mode_title;
                                break;

                            case "website":
                            case "web_field":
                                wb_s = wb_s + add_f_p_edit(this.primary_field[r]);
                                wb11_s+="," +this.primary_field[r].parameter;
                                wb = true;
                                wb_title = this.primary_field[r].mode_title;
                                  break;
                                //case "post":
                                //case "post_field":
                               // case "oder_field":
                            case "oder":
                            //    od_title = this.primary_field[r].mode_title;
                                  if (count_os ==0){
                                      ost[count_os]=this.primary_field[r].mode_title;
                                      var aa= os_s[count_os];
                                       if (aa == undefined) aa='';
                                    os_s[count_os]= aa + add_f_p_edit(this.primary_field[r]);
                                    os11_s[count_os]+="," +this.primary_field[r].parameter;
                                    count_os=count_os+1;
                                    os=true;
                                  }else{
                                        var count1=count_os;
                                        var boloder=true;
                                        var Same;
                                       for (var xz = 0; xz < count1; xz++) {
                                            if ( this.primary_field[r].mode_title== ost[xz]){
                                                //ezafe be os_s
                                                boloder=false;
                                                Same=xz;
                                            }
                                       }
                                       if (boloder==true){
                                         //jadidi bezanad
                                                ost[count_os]=this.primary_field[r].mode_title;
                                                var aa= os_s[count_os];
                                                if (aa == undefined) aa='';
                                                os_s[count_os]= aa + add_f_p_edit(this.primary_field[r]);
                                                os11_s[count_os]+="," +this.primary_field[r].parameter;
                                                count_os=count_os+1;
                                       }else{
                                        //ezafe be os_s
                                        os_s[Same]=  os_s[Same] + add_f_p_edit(this.primary_field[r]);
                                        os11_s[Same]+="," +this.primary_field[r].parameter;
                                       }


                                  }
                              
                                
                               
                                break;
                            default: //oder
                                //code CustomFieldsContainer
                                od_s = od_s + add_f_p_edit(this.primary_field[r]);
                                od11_s += "," + this.primary_field[r].parameter;
                                if (od_title == "") {
                                    od_title = this.primary_field[r].mode_title;
                                }
                                od = true;
                        }


                    }
                    var count_ = 0;
                    var cop_t1, cop_e1, cop_wb, cop_ad, cop_od, cop_jazb_plc, cop_comment;
                    var cop_os =new Array();
                    if (t1 == true) {
                        cop_t1 = add_f_c(translate.phones +"/"+ translate.fax, t1_s);
                       // cop_t1 = add_f_c_dropdawn("تلفن های تماس/فکس", t11_s);
                        count_ = count_ + 1;
                    }
                    if (e1 == true) {
                        cop_e1 = add_f_c(e1_title, e1_s);
                      //  cop_e1 = add_f_c(translate.email, e1_s);
                       //  cop_e1 = add_f_c_dropdawn("پست الکترونیکی", e11_s);
                        count_ = count_ + 1;
                    }
                    if (wb == true) {
                        cop_wb = add_f_c(wb_title, wb_s);
                        //   cop_wb = add_f_c(translate.website, wb_s);
                        // cop_wb = add_f_c_dropdawn("وب سایت", wb11_s);
                        count_ = count_ + 1;
                    }
                    if (ad == true) {
                        cop_ad = add_f_c(ad_title, ad_s);
                        //cop_ad = add_f_c(translate.address, ad_s);
                        //cop_ad = add_f_c_dropdawn("آدرس", ad11_s);
                        count_ = count_ + 1;
                    }
                    if (od == true) {
                        if (od_title == "") { od_title = translate.other_property; }
                        cop_od = add_f_c(od_title, od_s);
                       // cop_od = add_f_c(translate.other_property, od_s);
                       // cop_od = add_f_c_dropdawn("سایر مشخصات", od11_s);
                        count_ = count_ + 1;
                    }
                    if (os ==true){ //1234567
                        for (var xz = 0; xz < ost.length; xz++) {
                                 cop_os[xz]= add_f_c(ost[xz], os_s[xz]);
                                //cop_os[xz]= add_f_c_dropdawn(ost[xz], os11_s[xz]);
                                 count_ = count_ + 1;
                              }
                    }
    

                    z = count_ % 2;
                    if (cop_t1 != undefined) cop_t1.addClass("col2");
                    if (cop_e1 != undefined) cop_e1.addClass("col2");
                    if (cop_wb != undefined) cop_wb.addClass("col2");
                    if (cop_ad != undefined) cop_ad.addClass("col2");
                     if (cop_os != undefined) 
                        for(var ib = 0; ib < cop_os.length; ib++){
                          cop_os[ib].addClass("col2");
//                            if (z==1 && ib+1==cop_os.length){

//                            }else{
//                                cop_os[ib].addClass("col2");
//                            }  
                        }
                        if (z==0) if (cop_od != undefined) cop_od.addClass("col2");
                   
                  

                        var vfind = $("#contant_Edit #customer_primry_field_edit");

                    /*new for order*/
                        var titleOrder = new Array();
                        $.each(this.primary_field, function (key, value) {
                            var title = value.mode_title;
                            var a = $.grep(titleOrder, function (a) { return a == title });
                            if (a.length == 0) {
                                titleOrder.push(title);
                                switch (value.link2) {
                                    case "1":
                                        vfind.append(cop_t1);
                                        break;
                                    case "4":
                                        vfind.append(cop_e1);
                                        break;
                                    case "5":
                                        vfind.append(cop_wb);
                                        break;
                                    case "6":
                                        vfind.append(cop_ad);
                                        break;
                                    default:
                                        for (var ib = 0; ib < cop_os.length; ib++) {
                                            if ($(cop_os[ib]).find(".blockHeader").text() == title) {
                                                vfind.append(cop_os[ib]);
                                                break;
                                            }



                                        }

                                }
                            }
                        });
                    /*end new for order*/

                  //  vfind.append(cop_t1).append(cop_e1).append(cop_wb).append(cop_ad);
                    
                     //for(var ib = 0; ib < cop_os.length; ib++){
                     //   vfind.append(cop_os[ib]);
                     //   }

                     vfind.append(cop_od);
                   
                        cheak_height(vfind);

                 
                   // $(".mydds").msDropDown().data("dd");


                }  //end of CreateItemEdit

            
                 
               
                   
      
            
                //Switchery_ = new Switchery(document.querySelector('.switchbutton'), { size: 'large', color: '#4caf50', secondaryColor: '#eee', trueLabel: resources.true_, falseLabel: resources.false_ });
                var elem = Array.prototype.slice.call(document.querySelectorAll('#contant_Edit .switchbutton'));

                elem.forEach(function (html) {
                    Switchery_ = new Switchery(html, { size: 'large', color: '#4caf50', secondaryColor: '#eee', trueLabel: resources.true_, falseLabel: resources.false_ });
                
                });
                // inactiove kardan 
                var fi_ = $("#contant_Edit .switchery");
                fi_.addClass("inactive");
                fi_.find(".label.no").hide();
                
            };

         

            // ezafe kardan field primeriha be dialoge new
            this.Addprimery_field_new=function(){
                var htm_='';
                 if (this.primary_field == null){
                    //gozashtane 4 ta asliv
                    var name_=[translate.mobile,translate.email,translate.tel,translate.fax];
                    var p_key=['1,,4,0','4,,1,0','1,,1,0','2,,1,1']
                      for (r = 0; r < 4; r++) {
                       
                            var cop_new=$("#new_customer_field_clone").clone().removeAttr("id");
                            cop_new.find("span").html(name_[r]);
                            cop_new.find("input").attr("primary_text", p_key[r]).attr("parameter_name", name_[r]).attr("vtype", 0).attr("access", 1).attr("field_group_", "1").attr("in_list", 'false').attr("order", 0);
                      
                        

                         htm_+=cop_new.html();
                      }
                      

                }else{
                    //gozashtane az this.primary_field
                      for (r = 0; r < this.primary_field.length; r++) {
                       if (this.primary_field[r].list_item.length>0){

                            var cop_new=$("#new_customer_field_dropdown_clone").clone().removeAttr("id");
                             cop_new.find("span").html(this.primary_field[r].parameter);
                             cop_new.find("select").attr("primary_text", create_primary_key(this.primary_field[r])).attr("parameter_name", this.primary_field[r].parameter).attr("field_group_", this.primary_field[r].group_).attr("in_list", 'true').attr("vtype", this.primary_field[r].vtype).attr("order", this.primary_field[r].order).attr("access", this.primary_field[r].access);
                             cop_new.find("select").append("<option value=''></option>");
                              for (z = 0; z < this.primary_field[r].list_item.length; z++) {
                                 cop_new.find("select").append("<option value='"+this.primary_field[r].list_item[z][1]+"'>"+this.primary_field[r].list_item[z][0]+"</option>");
                              }
 
                       

                       } else {
                           var cop_new;
                           if (this.primary_field[r].vtype == 4) { /*is boolean*/
                               cop_new = $("#new_customer_field_boolean_clone").clone().removeAttr("id");
                           } else if (this.primary_field[r].vtype == 9) { /*is customer*/
                               cop_new = $("#new_customerLink_add_clone").clone().removeAttr("id");
                           } else if (this.primary_field[r].vtype == 10) { /*is factor*/
                               cop_new = $("#new_factorLink_add_clone").clone().removeAttr("id");
                           } else {
                               cop_new = $("#new_customer_field_clone").clone().removeAttr("id");
                           }
                           
                           if (this.primary_field[r].vtype == 5) {
                               cop_new.find("input").addClass("class_datepicker");
                           } else if (this.primary_field[r].vtype == 2) { /* is integer */
                               cop_new.find("input").addClass("isInteger");

                           } else if (this.primary_field[r].vtype == 3) { /* is float */
                               cop_new.find("input").addClass("isFloat");
                           } else if (this.primary_field[r].vtype == 4) { /* is boolean */

                           } else if (this.primary_field[r].vtype == 9) { /* link customer */

                           }
                           cop_new.find("span.fieldName").html(this.primary_field[r].parameter);
                           cop_new.find("input").attr("primary_text", create_primary_key(this.primary_field[r])).attr("parameter_name", this.primary_field[r].parameter).attr("field_group_", this.primary_field[r].group_).attr("in_list", 'false').attr("vtype", this.primary_field[r].vtype).attr("order", this.primary_field[r].order).attr("access", this.primary_field[r].access);
                         }
                         htm_+=cop_new.html();
                      }
                   
                   
          
                }
                 $("#dialog_new_customer .field_primery_tabContent").append(htm_);
                $("#dialog_add_person_new .field_primery_tab2").after(htm_);
                   $("#dialog_new_customer").height($("#dialog_new_customer .box").height());
                   set_datepicker();


                   var elem = Array.prototype.slice.call(document.querySelectorAll('#dialog_new_customer .switchbutton'));
                   elem.forEach(function (html) {
                       Switchery_ = new Switchery(html, { size: 'large', color: '#4caf50', secondaryColor: '#eee', trueLabel: resources.true_, falseLabel: resources.false_ });

                   });
                   var elem1 = Array.prototype.slice.call(document.querySelectorAll('#dialog_add_person_new .switchbutton'));
                   elem1.forEach(function (html) {
                       Switchery_ = new Switchery(html, { size: 'large', color: '#4caf50', secondaryColor: '#eee', trueLabel: resources.true_, falseLabel: resources.false_ });

                   });

                // inactiove kardan 
                   var fi_ = $("#dialog_new_customer .switchery");
                   fi_.addClass("inactive");
                   fi_.find(".label.no").hide();

                // inactiove kardan 
                   var fi_ = $("#dialog_add_person_new .switchery");
                   fi_.addClass("inactive");
                   fi_.find(".label.no").hide();

            };// end of Addprimery_field_new



            this.Addprimery_field_group=function(Group_cpde_){
              if (this.primary_field != null) {
                $("#customer_primry_field_edit [in_group="+Group_cpde_+"]").removeAttr('disabled');
                $("#customer_primry_field_edit [in_group_title="+Group_cpde_+"]").removeClass("disabled");

                var fi_='';
                for (r = 0; r < this.primary_field.length; r++) {
                      var primary_text_=create_primary_key(this.primary_field[r])
                      if ($("[primary_text='"+primary_text_+"']").length == 0 ){
                            
                            fi_ = fi_ + add_f_p_edit(this.primary_field[r]);
                            //
                        }

                    }// end for
                  
                    if (fi_ != '')
                    {
                        
                          var ap_find=$("#contant_Edit #customer_primry_field_edit");
                        if ($("#customer_primry_field_edit [new_field_group='true']").length == 0){
                            $("#customer_primry_field_edit .ContactPanel").addClass("col2");
                            z =  $("#customer_primry_field_edit .ContactPanel").length % 2;
                             var ad=add_f_c(translate.add_group, fi_);
                            ad.attr("new_field_group","true");
                            if (z==1) ad.addClass("col2"); 
                           
                            ap_find.prepend(ad);
                        }else{

                            $("#customer_primry_field_edit [new_field_group='true']").find("#feild_contant").append(fi_);
                        }
                        
                        cheak_height(ap_find);
                        set_datepicker();
                    }
                }// end if
            
            };

            this.SetItemEdit = function () {

           
              if (this.primary_field != null) {
                 
                    for (r = 0; r < this.primary_field.length; r++) {
                        var spl= this.primary_field[r].value.split("|*|");
                        var counter=spl.length -1;
                        var fit=0,fit2=0;
                        for (kk = 0; kk < spl.length; kk++) {
                            if (kk != 0) { fit = counter; counter -= 1; fit2 = 1 }
                            var fildFind_ = $("[primary_text='" + create_primary_key(this.primary_field[r]) + "']").eq(fit2);

                            if (this.primary_field[r].vtype == 4) { /* is boolean */
                                fildFind_.attr("id", fit).attr('checked', this.primary_field[r].booleanValue.split('|*|')[kk]);
                                changeSwitchery(fildFind_.parents(".contantinfoval_container"), JSON.parse(this.primary_field[r].booleanValue.split('|*|')[fit].toLowerCase()), (fit === 0 ? true : false));

                            }else if (this.primary_field[r].vtype == 9) { /* is customer link */
                                fildFind_.attr("id", fit).attr("customerSelectedXCode", spl[fit]).val(this.primary_field[r].customerSelectedName.split('|*|')[kk]).addClass("mini");
                                fildFind_.parents(".contantinfoval_container").find(".btn-customer-link-Remove").show();

                            } else if (this.primary_field[r].vtype == 10) { /* is factor link */
                                fildFind_.attr("id", fit).attr("factorSelectedXId", this.primary_field[r].vTypeExtraCode.split('|*|')[kk]).val(spl[fit]).addClass("mini");
                                fildFind_.parents(".contantinfoval_container").find(".btn-factor-link-Remove").show();

                            } else {
                               fildFind_.attr("id", fit).val(this.primary_field[r].vTypeExtraCode == '' ? spl[fit] : this.primary_field[r].vTypeExtraCode.split('|*|')[kk]);
                            }
                            var boolSwith = true;
                            if (kk + 1 < spl.length) {
                                boolSwith = (this.primary_field[r].vtype === 4 ? true : false);
                                add_edit_text($("[primary_id='" + create_primary_key(this.primary_field[r]) + "']:last").next().find(".add_field"), 1, boolSwith);
                            }
                        };

                    }
              } 
              set_datepicker();
            }; //end of SetItemEdit
           
           
        }

     
           function set_datepicker(){
               var pick_= $('.class_datepicker');
               pick_.removeAttr("id");
               var dateFormat = "mm/dd/yy";
	           if (translate._calander =='en'){pick_.datepicker({regional: '',  dateFormat: 'mm/dd/yy'});}else{pick_.datepicker();} 
	       
            }

        function cheak_height(vfind){
           var fi = vfind.find(".ContactPanel.col2");
                    fi.each(function (index) {
                        if (index % 2 == 0)
                            if ($(this).height() != fi.eq(index + 1).height())
                                fi.eq(index + 1).css("min-height",$(this).height());
                     });

        }


        function set_group(group, h, classname, vertical) {
            if (group != null) {
                var k = $("#cus_group").clone();
                var group_ = "";
                for (q = 0; q < group.length; q++) {
                    if (vertical==true)
                        var copy_ = k;
                    else
                        var copy_ = k.find(".marggroup");
                    $(copy_).find('span').addClass("m1").attr("group_code", group[q].group_code).attr("title", group[q].group_name).html(group[q].group_name);
                    group_ = group_ + $(copy_).html();
                }
                h.find("." + classname).html(group_);
            }

        }

        function add_f_c(text, obj) {
           var cop_z = $("#ContactPanel_clone").clone();
           cop_z.removeAttr("id");
           cop_z.find('.blockHeader').html(text);
           cop_z.find("#feild_contant").html(obj);
           return cop_z;
       }

//        function add_f_c_dropdawn(text, obj) {
//           var cop_z = $("#ContactPanel_clone").clone();
//           cop_z.removeAttr("id");
//           cop_z.find('.blockHeader').html(text);
//           var ddlcop=$("#dropdown_field_clone").clone().removeAttr("id");
//           ddlcop.find("select").attr("class","mydds");
//           var k=obj.split(",");
//           for (z = 1; z <k.length; z++) {
//                ddlcop.find("select").append($("<option></option>").attr("value", k[z]).text(k[z]));
//           }
//          var txtbox_=$("#text_add_dropdawn_clone").clone().removeAttr("id");
//         
//          var o='<div class="contantinfo_container ">' + ddlcop.html() +'</div>';
//          o = o + '<div class="contantinfoval_container">'+txtbox_.html()+'</div>';
//           cop_z.find("#feild_contant").html(o);
//         


//           return cop_z;
//       }


       function add_attach(attach_file, name,id) {
           var m = translate.file_show;
           var o = "<div attachmet_id="+id+" class='attachment_field'><div class='contantinfo_container attachment_link'> <a  href='" + attach_file + "' target='_blank'>" + m + "</a></div>";
           if (name == "") name = attach_file.split("/")[attach_file.split("/").length - 1];
           o=o +"<div class='contantinfoval_container attachment_name' style='direction:ltr;'>" + name + "</div></div>";
           return o;
       }

       function add_f_p(text, val, mode, code,attr,primary_field,cus_areacode,style_) {
            if (attr == undefined) attr="";
            
           var direction_;
           if (translate._calander == 'en') { direction_ = 'ltr' } else { direction_ = 'rtl' }
           var text_ = text;
           if (mode == "address" || mode == "address_field") {
               if ($("#hfGoogleMap").val() == "true") {
                   text_ += '<i id="chatExchange" class="icon-navigation googleNavigation right navigationAddress"  ></i> <i id="chatExchange" class="icon-map_marker googleNavigation right map_markerAddress" ></i> '
               }
           }
           var o = '<div class="contantinfo_container ">' + text_ + '</div>';
            var a=val.split("|*|");
            for (z = 0; z < a.length; z++) {
            if (a[z] !=''){
                
                if (mode == "email") {a[z] = emaillink($('#hdSected2CusCode').val(), z + 1, a[z], code);direction_='direction:ltr;'}
                if (mode == "mobile") {
                    o += "<div class='call' callsitem='" + a[z] + "'   callmode='mobile' callarea='' ><div class='icon_contact icon_contact_call' style='display:none;'><span class='ui-icon ui-icon-telcall icon_infomenu left cursor' style='margin:0px; '></span></div>"+
                    '<div  onclick="click_sms=true; qucikSendSms(\'' + $('#hdSected2CusCode').val() + '\',\''+ a[z] + '\');return false;" class="icon_contact icon_contact_sms" style="display:none;"><span class="Crm-icon Crm-icon16 Crm_icon_mobile_sms" style="margin:0px;"></span></div>';
                    a[z] = smslink($('#hdSected2CusCode').val(), z + 1, a[z], code);
                }
                if (mode == "tel" || mode=="phone_field") {
                    o += '<div class="call" callsitem="' + a[z] + '"   callmode="tel" callarea="' + cus_areacode + '" ><div class="icon_contact icon_contact_call" style="display:none;"><span class="ui-icon ui-icon-telcall icon_infomenu left cursor" style="margin:0px; "></span></div>';
                     a[z]= check_area_code(a[z], cus_areacode) ;
                     direction_="ltr";
                }
               if (mode == "website"){
                 var target ='';
                 if (a[z].indexOf("http://")==0 ||  a[z].indexOf("https://")==0){
                    target=a[z];
                 }else{
                    target="http://" + a[z];
                 }
              
                     a[z] = "<a href='" + target + "' target='_blank' >" + a[z] + "</a>";

               }
               if (mode == "fax") {
                   a[z] = faxLink($('#hdSected2CusCode').val(), a[z]);
               }

               if ((mode == "address" || mode == "address_field") && z > 0) {
                   if ($("#hfGoogleMap").val() == "true") {
                       o = o + '<div class="contantinfo_container "><i id="chatExchange" class="icon-navigation googleNavigation right navigationAddress"  ></i> <i id="chatExchange" class="icon-map_marker googleNavigation right map_markerAddress" ></i></div> '
                   }
               
               }
        
               if (primary_field != undefined) {
                   if (primary_field.vtype == 9) {
                       a[z] = customeShowInfoLink(a[z], primary_field.customerSelectedName.split("|*|")[z]);
                   } else if (primary_field.vtype == 10) {
                       a[z] = factorShowInfoLink(primary_field.vTypeExtraCode.split("|*|")[z], a[z]);
                   }
               };
               o = o + '<div class="contantinfoval_container" ' + attr + '  style="direction:' + direction_ + ';' + style_ + '">' + a[z] + '</div>';
           
               
                    if (mode == "mobile" || mode == "tel" || mode == "phone_field") o = o + '</div>';
                 }
              }
              if (primary_field !== undefined) o='<div  field_group="'+primary_field.group_+'" in_group="'+primary_field.link4+'">'+o+'</div>'
              return o;
        }

   
       function add_f_p_edit(primary_field) {
            var direction_='';
           var text=primary_field.parameter 
           if (primary_field.list_item.length!=0){ /*dropdown*/
                var dropdown_ = $("#dropdown_add_clone").clone().removeAttr("id");
                 dropdown_.find("select").append("<option value=''></option>");
                 jQuery.each(primary_field.list_item, function () {
                     dropdown_.find("select").append("<option value='"+$(this)[1]+"'>"+$(this)[0]+"</option>");

                 });
                 dropdown_.find("select").attr("primary_text", create_primary_key(primary_field)).attr("access", primary_field.access).attr("field_type", primary_field.type).attr("field_group_", primary_field.group_).attr("parameter_name", primary_field.parameter).attr("in_group", primary_field.link4).attr("in_list", 'true').attr("vtype", primary_field.vtype).attr("order", primary_field.order);
                  var o='<div><div class="contantinfo_container" primary_id="'+create_primary_key(primary_field)+'"  in_group_title="'+primary_field.link4+'" primary_mode="'+ primary_field.mode +'" >' + text + '</div>';
                  o = o + '<div class="contantinfoval_container" >'+dropdown_.html()+'</div></div>';


           }else{
                //  if (primary_field == undefined) attr="";
               var txtbox_;
               if (primary_field.vtype == 4) { /*is boolean*/
                   txtbox_ = $("#boolean_add_clone").clone().removeAttr("id");
               } else if (primary_field.vtype == 9) { /*is customer*/
                   txtbox_ = $("#customerLink_add_clone").clone().removeAttr("id");
               } else if (primary_field.vtype == 10) { /*is factor*/
                   txtbox_ = $("#factorLink_add_clone").clone().removeAttr("id");

               } else {
                    txtbox_ = $("#text_add_clone").clone().removeAttr("id");
               }

                txtbox_.find("input").attr("primary_text", create_primary_key(primary_field)).attr("access", primary_field.access).attr("field_type", primary_field.type).attr("field_group_", primary_field.group_).attr("parameter_name", primary_field.parameter).attr("in_group", primary_field.link4).attr("in_list", 'false').attr("vtype", primary_field.vtype).attr("order", primary_field.order);
                if (primary_field.vtype == 5) { /*  is date Type*/
                    txtbox_.find("input").addClass("class_datepicker");
                } else if (primary_field.vtype == 2) { /* is integer */
                    txtbox_.find("input").addClass("isInteger");

                } else if (primary_field.vtype == 3) { /* is float */
                    txtbox_.find("input").addClass("isFloat");
                } else if (primary_field.vtype == 4) { /* is boolean */
                   
                } else if (primary_field.vtype == 9) { /* link customer */
                  
                }

                var o='<div><div class="contantinfo_container" primary_id="'+create_primary_key(primary_field)+'"  in_group_title="'+primary_field.link4+'" primary_mode="'+ primary_field.mode +'" >' + text + '</div>';

                if(primary_field.mode =="address" || primary_field.mode =="oder" ||  primary_field.mode=="address_field"){
                    if (translate._calander =='en'){direction_='ltr'}else{direction_='rtl'}
                }else{
                    direction_='ltr';
                }
                txtbox_.find("input").css("direction",direction_);
                o = o + '<div class="contantinfoval_container" style="'+direction_+'">'+txtbox_.html()+'</div></div>';
           }
         
           
          return o;
        }


        function create_primary_key(primary_field){
            var s_="";
            s_=primary_field.link2+","+primary_field.link4+","+primary_field.code;
            return s_;
        }

//          function add_website(a) {
//            var k[a.length];
//              for (z = 0; z < a.length; z++) {
//                  k[z]= '<a target="_blank" href="'+a[z]+'" >'+a[z]+'</a>';
//              }

//          }
          function emaillink(cus_code,count,val,code_p) {
              return '<a href="#" onclick="emailsend(' + cus_code + ',' + count + ',' + code_p + ');return false;">' + val + '</a>';
          }
          function faxLink(cus_code,  val ) {
              return '<a href="#" onclick="faxSend(' + cus_code + ',\'' + val +'\');return false;">' + val + '</a>';
          }

          function smslink(cus_code, count, val, code_p) {
             // return '<a href="#"  class="mobilefield" onclick="smssend(' + cus_code + ',' + count + ',' + code_p + ');return false;">' + val + '</a>';
              return '<a href="#"  class="mobilefield" onclick="click_sms=true; qucikSendSms(\'' + cus_code + '\',\''+ val + '\');return false;">' + val + '</a>';

          }
          function customeShowInfoLink(cus_code, cust_name) {
              return '<a class="" onclick="customer_Show_Info(' + cus_code + ',\'' + cust_name + '\');return false;">' + cust_name + '</a>';
          }
          function factorShowInfoLink(factorId, text) {
              return '<a href="#" onclick="showfactorInfo(\'' + factorId + '\',\'' + text + '\');return false;">' + text + '</a>'
          }

          function emailsend(code, row, code_p) {
              var rnd_ = $("#ctl00_txtRnd").val();
              window.open("create_Email.aspx?customer_=" + code + "&row=" + row + "&code_p=" + code_p + "&rnd_=" + rnd_);
              return false;
          };
          function faxSend(cus_code, valParam,ar) {
              var rnd_ = $("#ctl00_txtRnd").val();
              window.open("fax_new.aspx?customer_=" + cus_code + "&node_=cust_send_fax&fax=" + valParam + "&rnd_=" + rnd_);
              return false;
          };
//        function smssend(code, row, code_p) {
//            click_sms=true;
//            var rnd_ = $("#ctl00_txtRnd").val();
//            window.open("create_SMS.aspx?customer_=" + code + "&row=" + row + "&code_p=" + code_p + "&rnd_=" + rnd_);
//        }
        function Previouswrapper() {
            varnextwrapper = varnextwrapper - 1;
            if (varnextwrapper < 0) {
                varnextwrapper = 0;
                $(".Previouswrapper").addClass("disabled");
            } else {
                $(".nextwrapper").removeClass("disabled");
                var oop;
                if (mode_wrapper == "sms") {
                    oop = $("#content_customer .main_contact_sms").find(".wrapper_field");
                 } else if(mode_wrapper == "factor") {
                   oop =  $("#content_customer .main_contact_factor ").find(".wrapper_field[show=true]");
                } else if(mode_wrapper == "event") {
                   oop =  $("#content_customer .main_contact_event ").find(".wrapper_field");
                 } else if(mode_wrapper == "reminder") {
                   oop =  $("#content_customer .main_contact_reminder ").find(".wrapper_field");
                 }else if(mode_wrapper == "workflow") {
                   oop =  $("#content_customer .main_contact_workflow ").find(".wrapper_field");
                 }else if(mode_wrapper == "support") {
                     oop = $("#content_customer .main_contact_support ").find(".wrapper_field");
                 }else if(mode_wrapper == "fax") {
                     oop = $("#content_customer .main_contact_fax ").find(".wrapper_field");
                 }else if(mode_wrapper == "sale") {
                     oop = $("#content_customer .main_contact_sale ").find(".wrapper_field");
                } else {
                    oop = $("#content_customer .main_contact_email").find(".wrapper_field");
                }
                oop.hide();
                oop.slice((varnextwrapper * 5), ((varnextwrapper + 1) * 5)).fadeIn();
                if (varnextwrapper == 0) $(".Previouswrapper").addClass("disabled");

            }
        }

        function nextwrapper(count) {
            if (count == 0) {
                if (mode_wrapper == "sms") {
                    $("#content_customer .main_contact_sms").find(".wrapper_field").slice(0, 5).show();
                } else if(mode_wrapper == "factor") {
                     $("#content_customer .main_contact_factor ").find(".wrapper_field[show=true]").slice(0, 5).show();
               } else if(mode_wrapper == "support") {
                   $("#content_customer .main_contact_support ").find(".wrapper_field").slice(0, 5).show();
               } else if(mode_wrapper == "fax") {
                   $("#content_customer .main_contact_fax ").find(".wrapper_field").slice(0, 5).show();
               } else if(mode_wrapper == "sale") {
                   $("#content_customer .main_contact_sale ").find(".wrapper_field").slice(0, 5).show();
               } else if(mode_wrapper == "event") {
                     $("#content_customer .main_contact_event ").find(".wrapper_field").slice(0, 5).show();
                } else if(mode_wrapper == "reminder") {
                     $("#content_customer .main_contact_reminder ").find(".wrapper_field").slice(0, 5).show();
                }else if(mode_wrapper == "workflow") {
                     $("#content_customer .main_contact_workflow ").find(".wrapper_field").slice(0, 5).show();
                }
                else {
                    $("#content_customer .main_contact_email").find(".wrapper_field").slice(0, 5).show();
                
                }
               

            } else {

                varnextwrapper = varnextwrapper + 1;
                var oo;
                if (mode_wrapper == "sms") {
                    oo = $("#content_customer .main_contact_sms").find(".wrapper_field").slice((varnextwrapper * 5), ((varnextwrapper + 1) * 5));
                 } else if(mode_wrapper == "factor") {
                     oo = $("#content_customer .main_contact_factor ").find(".wrapper_field[show=true]").slice((varnextwrapper * 5), ((varnextwrapper + 1) * 5));
                 } else if(mode_wrapper == "support") {
                     oo = $("#content_customer .main_contact_support ").find(".wrapper_field").slice((varnextwrapper * 5), ((varnextwrapper + 1) * 5));
                 } else if(mode_wrapper == "fax") {
                     oo = $("#content_customer .main_contact_fax ").find(".wrapper_field").slice((varnextwrapper * 5), ((varnextwrapper + 1) * 5));
                 } else if(mode_wrapper == "sale") {
                     oo = $("#content_customer .main_contact_sale ").find(".wrapper_field").slice((varnextwrapper * 5), ((varnextwrapper + 1) * 5));

                 } else if(mode_wrapper == "event") {
                        oo =  $("#content_customer .main_contact_event ").find(".wrapper_field").slice((varnextwrapper * 5), ((varnextwrapper + 1) * 5));
                } else if(mode_wrapper == "reminder") {
                        oo =  $("#content_customer .main_contact_reminder ").find(".wrapper_field").slice((varnextwrapper * 5), ((varnextwrapper + 1) * 5));


                } else {
                    oo = $("#content_customer .main_contact_email").find(".wrapper_field").slice((varnextwrapper * 5), ((varnextwrapper + 1) * 5));
                }
             
                if (oo.length != 0) {
                    $("#content_customer").find(".wrapper_field").hide();
                    oo.fadeIn();

                    $(".Previouswrapper").removeClass("disabled");
                } else {
                    varnextwrapper = varnextwrapper - 1;
                    $(".nextwrapper").addClass("disabled");
                }
                if (oo.length < 5) $(".nextwrapper").addClass("disabled") ;

            }

        }


        var form_show_tab_id;
        var form_online = "1";
        function showtabForms(z) {
           if ($("[id^=box-messages]").length!=0){
            $('#navigation_right').show();
            $('#navigation_left').show();
            form_show_tab_id = z;
            var i = 0;
            var counti = 1;
//            while (i == 0) {
//                if ($('#box-messages' + z + "_" + counti) != null) {
//                    $('#box-messages' + z + "_" + counti).hide();
//                    counti = counti + 1;
//                } else { i = 1; counti = counti - 1; }
//            }
            $("[id^=box-messages]").hide();

            $('#navigation_form').show();
            $('#form_count_id').html($("[id^=box-messages"+z+"_]").length);
            $('#form_count_id_').html($("[id^=box-messages"+z+"_]").length);
            $('#navigation_left').hide();

            if (document.getElementById(form_online) != null) {
                $("#" +form_online).hide(); // hazfe namayeshe forme gabli 
            }
            $('#box-messages' + z + "_" + $("[id^=box-messages"+z+"_]").length).show();
            form_online = 'box-messages' + z + "_" + counti;
            if ($('#form_count_id_').html()== "1") {
                $('#navigation_right').hide();
                $('#navigation_left').hide();
            }
            return false;
         }
       }

        function navigation_left() {
            var count = parseInt(document.getElementById('form_count_id').textContent);
            var count2 = count
            count = count + 1
            document.getElementById('navigation_right').style.display = "";
            if (document.getElementById('box-messages' + form_show_tab_id + "_" + count) != null) {
                $('#box-messages' + form_show_tab_id + "_" + count2).hide();
                $('#form_count_id').html(count);
                $('#box-messages' + form_show_tab_id + "_" + count).show();
                form_online = 'box-messages' + form_show_tab_id + "_" + count;
            }
            if ((document.getElementById('form_count_id').textContent) == (document.getElementById('form_count_id_').textContent)) {
                document.getElementById('navigation_left').style.display = "none";
            }

        }

        function navigation_right() {
            var count = parseInt(document.getElementById('form_count_id').textContent);
            var count2 = count;
            document.getElementById('navigation_left').style.display = "";
            count = count - 1;
            if (document.getElementById('box-messages' + form_show_tab_id + "_" + count) != null) {
                 $('#box-messages' + form_show_tab_id + "_" + count2).hide();
                 $('#form_count_id').html(count);
                 $('#box-messages' + form_show_tab_id + "_" + count).show();
                form_online = 'box-messages' + form_show_tab_id + "_" + count;
            }
            if (parseInt(document.getElementById('form_count_id').textContent) == 1) {
                document.getElementById('navigation_right').style.display = "none";
            }

        }



        function change_type_run() {
            $('#rblCartablType input:checked').removeAttr("checked");
            $("#btntype").hide();
        }


        function search1(domain_) {
            var text = $("#txtAttachCus").val();
            $("#lodig_code2").show();
            //MaghalatService49.cust_group_list(domain_, "", text, "", onSuccess5);
            var e = {};
            var send_ = {};
            e.domain = $("#HFdomain").val();
            e.user_code = $("#HFUserCode").val();
            e.codeing = $("#HFcodeDU").val();
            e.name = text;
              e.rnd=$("#HFRnd").val();
            send_.items = e;
            get_info.search_customer_byName(send_, function (c) {
               $("#td_cus_code2").html(c.d);
                $("#lodig_code2").hide();

            });
        }
        function select1(code_, name_,z) {

            clearattachCus(code_, name_);
      
        }

        function clearattachCus(code_, name_) {
            $("#hdattachCus2_name").val(name_);
            $("#hdattachCus2_code").val(code_);
            $("#lblattachCus").html(name_);
            $("#txtAttachCus").val("");
            $("#td_cus_code2").html("");
        }
       


      //combobox
        (function ($) {
	        $.widget("ui.combobox", {
	            _create: function () {
	                var input,
					self = this,
					select = this.element.hide(),
					selected = select.children(":selected"),
					value = selected.val() ? selected.text() : "",
					wrapper = this.wrapper = $("<span>")
						.addClass("ui-combobox")
						.insertAfter(select);

	                input = $("<input>")
					.appendTo(wrapper)
					.val(value)
					.addClass("ui-state-default ui-combobox-input")
					.autocomplete({
					    delay: 0,
					    minLength: 0,
					   source: function (request, response) {

                       
                    var e = {};
                    e.q = request.term;
                    e.domain = $('#HFdomain').val();
                    e.a = 'True';
                    e.g = "";
                    e.parent='';
                    e.user_code = $('#HFUserCode').val();
                    var url_;
                    if ($(self.element).attr("mode")=="city"){
                        url_="Search_city_Handler.ashx";
                    }else if ($(self.element).attr("mode")=="activity"){
                        url_="Search_activity_Handler.ashx";
                    }
                    
                    jQuery.ajax({
                        type: "POST",
                        url: url_,
                        data: e,
                        success: function (e, xhr) {
                            var arr = e.split(/\n/)
                            var count1 = 0;
                            var source_data =[{ value: "", id: "", parant: "",number: "", }];
                             var select_ed=$(self.element).find("option:selected");
                             $(self.element).find("option").remove();
                            
                            jQuery.each(arr, function () {
                                if (this.split(",")[1] != undefined) {
                                source_data[count1] = { value: this.split(",")[0], id: this.split(",")[1], parant:this.split(",")[3] , number: this.split(",")[4] };
                               if (request.term!=""){
                                     $(self.element).append("<option value="+this.split(",")[1]+">"+this.split(",")[0]+"</option>");
                                }
                                     
                                 count1 ++;
                                 }
                            });
                            if (select_ed != undefined && select_ed != 'undefined'){
                              $(self.element).val(select_ed).attr("selected", "selected");
                            }
                          
                             response(source_data);

                        }, dataType: "json"
                    });

                },
					    select: function (event, ui) {
                             $(self.element).find("option").remove();
                             $(self.element).append("<option value="+ui.item.id+">"+ui.item.value+"</option>");
//					        ui.item.option.selected = true;
//					        self._trigger("selected", event, {
//					            item: ui.item.option
//					        });
					    },focus: function (event, ui) {
                           input.val(ui.item.value);
                            return false;
                         },
                        
					    change: function (event, ui) {
					        if (!ui.item) {
					            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"),
									valid = false;
					            select.children("option").each(function () {
					                if ($(this).text().match(matcher)) {
					                    this.selected = valid = true;
					                    return false;
					                }
					            });
					            if (!valid) {
					                // remove invalid value, as it didn't match anything
					                $(this).val("");
					                select.val("");
					                input.data("autocomplete").term = "";
					                return false;
					            }
					        }
					    }
					})
					.addClass("ui-widget ui-widget-content ui-corner-left");

	                input.data("autocomplete")._renderItem = function (ul, item) {
	                    return $("<li></li>")
						.data("item.autocomplete", item)
                        .append( "<a><div>" + item.label + "</div><div class='right com'>" + item.parant + "</div><div class='left com'>"+item.number+"</div></a>" )
						.appendTo(ul);
	                };

	                $("<a>")
					.attr("tabIndex", -1)
					.attr("title", "Show All Items")
					.appendTo(wrapper)
					.button({
					    icons: {
					        primary: "ui-icon-triangle-1-s"
					    },
					    text: false
					})
					.removeClass("ui-corner-all")
					.addClass("ui-corner-right ui-combobox-toggle")
					.click(function () {
					    // close if already visible
					    if (input.autocomplete("widget").is(":visible")) {
					        input.autocomplete("close");
					        return;
					    }

					    // work around a bug (likely same cause as #5265)
					    $(this).blur();

					    // pass empty string as value to search for, displaying all results
					    input.autocomplete("search", "");
					    input.focus();
					});
	            },

	            destroy: function () {
	                this.wrapper.remove();
	                this.element.show();
	                $.Widget.prototype.destroy.call(this);
	            }
	        });
	    })(jQuery);


     //combobox_activity
        (function ($) {
	        $.widget("ui.combobox_activity", {
	            _create: function () {
	                var input,
					self = this,
					select = this.element.hide(),
					selected = select.children(":selected"),
					value = selected.val() ? selected.text() : "",
					wrapper = this.wrapper = $("<span>")
						.addClass("ui-combobox_activity")
						.insertAfter(select);

	                input = $("<input>")
					.appendTo(wrapper)
					.val(value)
					.addClass("ui-state-default ui-combobox_activity-input")
					.autocomplete({
					    delay: 0,
					    minLength: 0,
                        position: { my : "center top", at: "center bottom" },
					   source: function (request, response) {

                    var e = {};
                    e.q = request.term;
                    var t_ = htmlEncode(request.term);
                    e.domain = $('#HFdomain').val();
                    e.a = 'True';
                    e.g = "";
                    e.user_code = $('#HFUserCode').val();
                    
                    jQuery.ajax({
                        type: "POST",
                        url: "Search_activity_Handler.ashx",
                        data: e,
                        success: function (e, xhr) {
                            var arr = e.split(/\n/)
                            var count1 = 0;
                            var source_data =[{ value: "", id: "", parant: "",number: "", }];
                             var select_ed=$("#txtactivity option:selected").val();
                             $("#txtactivity option").remove();
                            
                            jQuery.each(arr, function () {
                                if (this.split(",")[1] != undefined) {
                                source_data[count1] = { value: this.split(",")[0], id: this.split(",")[1], parant:this.split(",")[3] , number: this.split(",")[4] };
                                   //$("#txtactivity").append("<option value="+this.split(",")[1]+">"+this.split(",")[0]+"</option>");
                                 count1 ++;
                                 }
                            }); 
                                $("#txtactivity option").remove();
                                if (source_data.length==1 && source_data[0].id !=""){
                                    $("#txtactivity").append("<option value="+source_data[0].id+">"+source_data[0].value+"</option>");
                                }else{
                                    $("#txtactivity").append("<option value='0'>"+t_+"</option>");                  
                                }

                            
                          
                             response(source_data);

                        }, dataType: "json"
                    });

                },
					    select: function (event, ui) {
                             input.val(ui.item.value);
                             $("#txtactivity option").remove();
                             $("#txtactivity").append("<option value="+ui.item.id+">"+ui.item.value+"</option>");
//					        ui.item.option.selected = true;
//					        self._trigger("selected", event, {
//					            item: ui.item.option
//					        });
					    },focus: function (event, ui) {
                           input.val(ui.item.label);
                            return false;
                         },
                        
					    change: function (event, ui) {
					        if (!ui.item) {
					            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"),
									valid = false;
					            select.children("option").each(function () {
					                if ($(this).text().match(matcher)) {
					                    this.selected = valid = true;
					                    return false;
					                }
					            });
					            if (!valid) {
					                //set only 1 item in write
					                 $("#txtactivity option").remove();
					                 $("#txtactivity").append("<option value='0'>" + htmlEncode($(this).val()) + "</option>");
					                return false;
					            }
					        }
					    }
					})
					.addClass("ui-widget ui-widget-content ui-corner-left");

	                input.data("autocomplete")._renderItem = function (ul, item) {
	                    return $("<li></li>")
						.data("item.autocomplete", item)
                        .append( "<a><div>" + item.label + "</div><div class='right com'></div><div class='left com'>"+item.parant+"</div></a>" )
						.appendTo(ul);
	                };

	            },

	            destroy: function () {
	                this.wrapper.remove();
	                this.element.show();
	                $.Widget.prototype.destroy.call(this);
	            }
	        });
	    })(jQuery);



      //combobox_company
        (function ($) {
	        $.widget("ui.combobox_company", {
	            _create: function () {
	                var input,
					self = this,
					select = this.element.hide(),
					selected = select.children(":selected"),
					value = selected.val() ? selected.text() : "",
					wrapper = this.wrapper = $("<span>")
						.addClass("ui-combobox_company")
						.insertAfter(select);

	                input = $("<input>")
					.appendTo(wrapper)
					.val(value)
					.addClass("ui-state-default ui-combobox_company-input add_company")
					.autocomplete({
					    delay: 0,
					    minLength: 2,
                        position: { my : "center top", at: "center bottom" },
					   source: function (request, response) {

                    
                    
                    var e = {};
                    e.q = request.term;
                    var t_ = htmlEncode(request.term);
                    e.domain = $('#HFdomain').val();
                    e.a = true;
                    e.g = $('#ctl00_ContentHolder_HDg').val();
                    e.user_code = $('#HFUserCode').val();
                    e.r=$("#HFRnd").val();

                    jQuery.ajax({
                        type: "POST",
                        url: "SearchHandler.ashx",
                        data: e,
                        success: function (e, xhr) {
                          //  var arr = e.split(/\n/)
                            var count1 = 0;
                            var source_data =[{ id: "",value : "", company: "",icon: "", }];
                             var select_ed=$("#txtactivity_customeradd option:selected").val();
                             $("#txtactivity_customeradd option").remove();
                            
                            jQuery.each(e, function () {
                                if (this[1] != undefined) {
                                    source_data[count1] = { value: this[0], id: this[1], company: this[2], icon: "", title: this[3] };
                                   //$("#txtactivity_customeradd").append("<option value="+this.split(",")[1]+">"+this.split(",")[0]+"</option>");
                                 count1 ++;
                                 }
                            }); 
                                $("#txtactivity_customeradd option").remove();
                                if (source_data.length==1 && source_data[0].id !=""){
                                    $("#txtactivity_customeradd").append("<option value="+source_data[0].id+">"+source_data[0].value+"</option>");
                                }else{
                                    $("#txtactivity_customeradd").append("<option value='0'>"+t_+"</option>");                  
                                }

                            
                          
                                response(source_data);

                        }, dataType: "json"
                    });

                },
					    select: function (event, ui) {
                             input.val(ui.item.value);
                             $("#txtactivity_customeradd option").remove();
                             $("#txtactivity_customeradd").append("<option value="+ui.item.id+">"+ui.item.value+"</option>");
//					        ui.item.option.selected = true;
//					        self._trigger("selected", event, {
//					            item: ui.item.option
//					        });
					    },focus: function (event, ui) {
                           input.val(ui.item.value);
                            return false;
                         },
                        
					    change: function (event, ui) {
					        if (!ui.item) {
					            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"),
									valid = false;
					            select.children("option").each(function () {
					                if ($(this).text().match(matcher)) {
					                    this.selected = valid = true;
					                    return false;
					                }
					            });
					            if (!valid) {
					                //set only 1 item in write
					                 $("#txtactivity_customeradd option").remove();
					                 $("#txtactivity_customeradd").append("<option value='0'>" + htmlEncode($(this).val()) + "</option>");
					                return false;
					            }
					        }
					    }
					})
					.addClass("ui-widget ui-widget-content ui-corner-left");

	                input.data("autocomplete")._renderItem = function (ul, item) {
                    	return $( "<li></li>" )
				            .data( "item.autocomplete", item )
				            .append("<a class='autocompleteSearchCurent'><div class='autocompleteSearch'>" + item.value + "</div><div class='right com autocompleteextraSearch' title='" + item.title + "'>" + item.company + "</div><div class='left com'>" + item.id + "</div></a>")
				            .appendTo(ul);
		                    };

	            },

	            destroy: function () {
	                this.wrapper.remove();
	                this.element.show();
	                $.Widget.prototype.destroy.call(this);
	            }
	        });
	    })(jQuery);


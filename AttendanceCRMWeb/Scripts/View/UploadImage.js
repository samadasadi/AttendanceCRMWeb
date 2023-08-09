
(function (minaDent, $) {
    var signutrebox;

    var showModalForEdit = function (id, customerId, enclosures, radio, photo) {

        $.ajax({
            type: "Get",
            url: "/Admin/CustomerDocument/editDocument",
            data: { id: id },
            async: true,
            beforeSend: function () {
                showWait();
            },
            success: function (result) {

                if (result.statusCode == "301") {
                    AlertDialog('شما مجوز انجام این عملیات را ندارید', 'خطا');
                    return;
                }
                var uploadbox = bootbox.dialog({
                    message: result,
                    title: window.MinaDent.Common.FormUpload,
                    buttons: {
                        main: {
                            label: window.MinaDent.Common.UploadDoc,
                            className: "blue",
                            callback: function () {

                                $.post("/Admin/CustomerDocument/editDocument", $("#frmEditDocument").serialize()).done(
                                    function (result) {

                                        if ($("#tabType").val() == enclosures)
                                            ReloadEnclosuresByTwoChar(customerId, radio, photo, enclosures);
                                        else
                                            reloadGalleryByTwoChar(customerId, radio, photo, enclosures);
                                    });
                            }
                        },
                        cancel: {
                            label: '<i class="fa fa-times"></i> ' + window.MinaDent.Common.cancelBtnTxt
                        }
                    }
                });
            },
            complete: function () {
                hideWait();
            }
        });
    };

    //var editLightPen = function (id, customerId) {

    //    var _img = new Image();

    //    $.ajax({
    //        type: "GET",
    //        url: "/Admin/CustomerDocument/editLightPen",
    //        data: { Id: id },
    //        async: true,
    //        success: function (res) {

    //            $("#lightPenIsEdit").val("true");
    //            $("#lightPenPath").val(res.Path);
    //            _img.src = res.Path;
    //            $("#ComentStr").val(res.Coment);
    //            $("#lightPenId").val(id);
    //        }
    //    }).done(function (o) {

    //        var canvas;
    //        var context;
    //        canvas = document.getElementById('canvas');
    //        context = canvas.getContext("2d");

    //        _img.onload = function () {
    //            context.drawImage(_img, 0, 0);
    //        };
    //    });


    //    AjaxCallAction('POST', '/Admin/CustomerDocument/editLightPen', { Id: id }, true,
    //        function (res) {

    //            reloadGallery($("#_CustomerId").val());

    //            getNotificationBarUploadImage();
    //            AddNewItem();

    //        }, false);



    //};

    function showModalWebTwain() {
        $("#divModalWebTwain").modal("show");
    }

    var showModalForEditImg = function (DWObject, strPath, Autoid, FileName, Coment) {

        DWObject.RemoveAllImages();
        LoadImages(strPath, false, Autoid);
        DWObject.ShowImageEditor();
        $("#FileName").val(FileName);
        $("#Coment").val(Coment);
        $("#Autoid").val(Autoid);
        //showModalWebTwain();
    }

    function reportMultiUploadImage(window, radiGra, customerId) {

        if ($("#PaperSize").val() == "" || $("#PaperSize").val() == null || $("#PaperSize").val() == undefined) {
            closeWindow(window);
            AlertDialog("سایز کاغذ را وارد کنید", "هشدار");
            return;
        }
        var res = $("#tabType").val() === "" ? radiGra : $("#tabType").val();
        $.post("/Admin/CustomerDocument/GetUploadImagesService", $("#" + res + " :input").serialize() + "&paperSize=" + $("#PaperSize").val() + "&customerId=" + customerId).done(
            function (result) {

                writeWindow(window, result);
            }).error(function () {

                closeWindow(window);
            });
    }

    function getNotificationBarUploadImage() {
        getNotificationBar("/Admin/CustomerDocument/DashBoardCustomerDocVM", "spnNotifCountCD", "liNotifCountCD");
    }

    //var showModal = function (customerId, TypeId, radiography = null, Photography = null, DWObject = null, idEnclosures = null, id = '00000000-0000-0000-0000-000000000000') {
    var showModal = function (customerId, TypeId, id = '00000000-0000-0000-0000-000000000000') {

        debugger;

        InitModal('تصاویر درمانی', '/Admin/CustomerDocument/Create', { customerId: customerId, TypeId: TypeId, id: id },
            function (result) {

                debugger;

                var type = $("#tabType").val();
                var fileUpload = $("#File").get(0);
                var files = fileUpload !== undefined ? fileUpload.files : null;
                var filesLenght = files !== null ? files.length : 0;
                if (type === "14" || filesLenght !== 0) {

                    var formData = new FormData($('#attachForm')[0]);
                    formData.append('File', $('#File')[0]);
                    formData.append('CustomerId', $("#CustomerId").val());
                    formData.append('TypeId', type);
                    formData.append('image', $("#Image").val());

                    formData.append('DentIntKey', $("#DentIntKey").val());
                    formData.append('DentisKey', $("#DentisKey").val());
                    formData.append('TeethType', $("#TeethType").val());
                    formData.append('URLAddress', $("#URLAddress").val());


                    var fileData = new FormData();
                    if (filesLenght != 0 || $("#Image").val() != "" ||
                        ($("#URLAddress").val() != null && $("#URLAddress").val() != undefined && $("#URLAddress").val() != ''))
                    {
                        for (var i = 0; i < filesLenght; i++)
                            fileData.append(files[i].name, files[i]);

                        $.ajax({
                            type: 'POST',
                            url: '/Admin/CustomerDocument/Create',
                            async: true,
                            dataType: 'application/json',
                            success: function (result) {

                            },
                            data: formData,
                            beforeSend: function () {
                                showWait();
                            },
                            complete: function () {

                                //if (type == "14") {
                                //    ReloadEnclosures(customerId);
                                //} else {
                                //    reloadGallery(customerId);
                                //}
                                reloadGallery(customerId);
                                hideWait();
                                CloseModal();
                            },
                            error: function (eee) {

                            },
                            failure: function (errMsg) {

                            },
                            cache: false,
                            contentType: false,
                            processData: false
                        }).done(function () {
                        });

                    }
                    else {
                        AlertDialog("لطفا فایل را انتخاب کنید", "هشدار");
                        return false;
                    }
                }
                else {

                    AjaxCallAction('POST', '/Admin/CustomerDocument/Create', {
                        File: window.imageEditor.toDataURL(),
                        customerId: $("#CustomerId").val(),
                        TypeId: type,
                        image: "",
                        Coment: $("#Coment").val(),
                        FileName: $("#FileName").val(),
                        Id: $("#Id").val(),
                        DentIntKey: $("#DentIntKey").val(),
                        DentisKey: $("#DentisKey").val(),
                        TeethType: $("#TeethType").val(),
                        Autoid: $("#Autoid").val()
                    }, true, function (res) {

                        //if (type == "14") {
                        //    ReloadEnclosures(customerId);
                        //} else {
                        //    reloadGallery(customerId);
                        //}
                        reloadGallery(customerId);
                        CloseModal();


                    }, false)

                }


            }, false, true, true, null, null, true, '80%');


    }

    var ModalForCustomerPen = function () {

        $.ajax({
            type: "Get",
            url: "/Admin/CustomerInfo/ModalForCustomerPen",
            beforeSend: function () {
                showWait();
            },
            success: function (result) {
                if (result.statusCode == "301") {
                    AlertDialog('شما مجوز انجام این عملیات را ندارید', 'خطا');
                    return;
                }
                var uploadbox = bootbox.dialog({
                    message: result,
                    title: window.MinaDent.Common.FormUpload,
                    size: 'Large',
                    className: "Large",
                    buttons: {
                        main: {
                            label: window.MinaDent.Common.UploadDoc,
                            className: "blue",
                            callback: function () {

                                canvas = document.getElementById('can');
                                var blankCan = document.createElement('canvas');
                                blankCan.width = canvas.width;
                                blankCan.height = canvas.height;
                                if (canvas.toDataURL() != blankCan.toDataURL()) {
                                    $("#CustomerBasicInfo_Canvas").val(canvas.toDataURL());
                                }
                            }
                        },
                        cancel: {
                            label: '<i class="fa fa-times"></i> ' + window.MinaDent.Common.cancelBtnTxt
                        }
                    }
                });
            },
            error: function (aaa) {

                alert("1- " + aaa.message);
            },
            complete: function () {
                hideWait();
            }
        });
    }

    var showSignatureModal = function (customerId, TypeId) {

        $.ajax({
            type: "Get",
            url: "/Admin/CustomerDocument/Lightpen",
            data: { customerId: customerId, TypeId: TypeId },
            async: true,
            beforeSend: function () {
                showWait();
            },
            success: function (result) {
                if (result.statusCode == "301") {
                    AlertDialog('شما مجوز انجام این عملیات را ندارید', 'خطا');
                    return;
                }
                var uploadbox = bootbox.dialog({
                    message: result,
                    size: 'large',
                    className: "larg",
                    title: " یادداشت قلم نوری",
                });
                signutrebox = uploadbox;
                hideWait();
            },
            complete: function () {
                hideWait();
            }
        });
    }

    function reloadGallery(customerId) {

        var tab = $("#tabType").val();
        $.ajax({
            type: "Get",
            url: "/Admin/CustomerDocument/GaleryImage",
            data: { customerId: customerId, type: tab },
            async: true,
            success: function (result) {

                //$("#" + tab + tab).html(result);

                //if (tab == "11") {
                //    $("#divContentTabRadiography").html(result);
                //}
                //else if (tab == "12") {
                //    $("#divContentTabPhotography").html(result);
                //}
                //else if (tab == "13") {
                //    $("#divContentTabLightPen").html(result);
                //}
                //else if (tab == "14") {
                //    $("#divContentTabEnclosures").html(result);
                //}

                $("#div_Result").html(result);

                createClassForCheckBox();
            },
        });
    }

    function checkTabContent(radio, photo, idEnclosures, result) {
        switch ($("#tabType").val()) {
            case radio:
                $("#divContentTabRadiography").html(result);
                break;
            case photo:
                $("#divContentTabPhotography").html(result);
                break;
            case idEnclosures:
                $("#divContentTabEnclosures").html(result);
                break;
            default:
                $("#divContentTabLightPen").html(result);
                break;
        }
    }

    function createClassForCheckBox() {
        $('.icheck').each(function () {
            var checkboxClass = $(this).attr('data-checkbox') ? $(this).attr('data-checkbox') : 'icheckbox_minimal-grey';
            var radioClass = $(this).attr('data-radio') ? $(this).attr('data-radio') : 'iradio_minimal-grey';

            if (checkboxClass.indexOf('_line') > -1 || radioClass.indexOf('_line') > -1) {
                $(this).iCheck({
                    checkboxClass: checkboxClass,
                    radioClass: radioClass,
                    insert: '<div class="icheck_line-icon"></div>' + $(this).attr("data-label")
                });
            } else {
                $(this).iCheck({
                    checkboxClass: checkboxClass,
                    radioClass: radioClass
                });
            }
        });
    }

    function reloadGalleryByTwoChar(customerId, radio, photo, idEnclosures) {

        //checkTabContent(radio, photo, idEnclosures, "لطفاً منتظر بمانید...");
        $("#div_Result").html("لطفاً منتظر بمانید...");
        $.ajax({
            type: "Get",
            url: "/Admin/CustomerDocument/GaleryImage",
            data: { customerId: customerId, type: $("#tabType").val() },
            async: true,
            success: function (result) {

                //checkTabContent(radio, photo, idEnclosures, result);
                $("#div_Result").html(result);
                createClassForCheckBox();
            },
        });
    }

    function ReloadEnclosures(customerId) {

        var tab = $("#tabType").val();
        $.ajax({
            type: "Get",
            url: "/Admin/CustomerDocument/Enclosures",
            data: { customerId: customerId, type: tab },
            async: true,
            success: function (result) {

                //$("#" + tab + tab).html(result);

                if (tab == "11") {
                    $("#divContentTabRadiography").html(result);
                }
                else if (tab == "12") {
                    $("#divContentTabPhotography").html(result);
                }
                else if (tab == "13") {
                    $("#divContentTabLightPen").html(result);
                }
                else if (tab == "14") {
                    $("#divContentTabEnclosures").html(result);
                }
                createClassForCheckBox();
            },
        });
    }

    function ReloadEnclosuresByTwoChar(customerId, radio, photo, idEnclosures) {

        //checkTabContent(radio, photo, idEnclosures, "لطفاً منتظر بمانید...");
        //$.ajax({
        //    type: "Get",
        //    url: "/Admin/CustomerDocument/Enclosures",
        //    data: { customerId: customerId, type: $("#tabType").val() },
        //    async: true,
        //    success: function (result) {
        //        checkTabContent(radio, photo, idEnclosures, result);
        //        createClassForCheckBox();
        //    },
        //});

        $("#div_Result").html("لطفاً منتظر بمانید...");
        $.ajax({
            type: "Get",
            url: "/Admin/CustomerDocument/Enclosures",
            data: { customerId: customerId, type: $("#tabType").val() },
            async: true,
            success: function (result) {
                //checkTabContent(radio, photo, idEnclosures, result);
                $("#div_Result").html(result);
                createClassForCheckBox();
            },
        });
    }

    function DeleteMultiDocument() {

        Multidelete();
    }

    function Multidelete() {

        var result = $("#tabType").val();
        if (result === "") {
            result = 11;
        }
        var _ids = [];
        var text = "";
        _ids = GetCheckedItems();
        var number = _ids.length;
        if (number == 0) {
            AlertDialog("یک مورد انتخاب کنید", "");
            return;
        }
        for (var i = 0; i < number - 1; i++) {
            text += "myselect=" + _ids[i] + "&";
        }
        text += "myselect=" + _ids[number - 1];


        //$.post("/Admin/CustomerDocument/MultiDelete?" + text,
        //    function (res) {
        //        if (res.statusCode == "301") {
        //            AlertDialog('شما مجوز انجام این عملیات را ندارید', 'خطا');
        //            return;
        //        }
        //        for (var i = 0; i < res.length; i++) {
        //            //$("#" + res[i]).remove();
        //            $('.row-container-image').filter(function () {
        //                return $(this).data('id') === res[i]
        //            }).remove();
        //        }
        //    });



        ConfirmDelete("POST", "/Admin/CustomerDocument/MultiDelete?" + text, {}, function (res) {
            if (res.statusCode == "301") {
                AlertDialog('شما مجوز انجام این عملیات را ندارید', 'خطا');
                return;
            }
            for (var i = 0; i < res.length; i++) {
                $('.row-container-image').filter(function () {
                    return $(this).data('id') === res[i]
                }).remove();
            }
        });
    }

    function gallery() {
        var initPhotoSwipeFromDOM = function (gallerySelector) {

            // parse slide data (url, title, size ...) from DOM elements
            // (children of gallerySelector)
            var parseThumbnailElements = function (el) {
                var thumbElements = $(el).find("figure"),
                    numNodes = thumbElements.length,
                    items = [],
                    figureEl,
                    linkEl,
                    size,
                    item;

                for (var i = 0; i < numNodes; i++) {

                    figureEl = thumbElements[i]; // <figure> element

                    // include only element nodes
                    if (figureEl.nodeType !== 1) {
                        continue;
                    }

                    linkEl = $(figureEl).find("a")[1]; // <a> element

                    size = linkEl.getAttribute('data-size').split('x');

                    // create slide object
                    item = {
                        src: linkEl.getAttribute('href'),
                        w: parseInt(size[0], 10),
                        h: parseInt(size[1], 10)
                    };



                    if (figureEl.children.length > 1) {
                        // <figcaption> content
                        item.title = figureEl.children[1].innerHTML;
                    }

                    if (linkEl.children.length > 0) {
                        // <img> thumbnail element, retrieving thumbnail url
                        item.msrc = $(linkEl).find("img")[0].getAttribute('src');
                    }

                    item.el = figureEl; // save link to element for getThumbBoundsFn
                    items.push(item);
                }

                return items;
            };

            // find nearest parent element
            var closest = function closest(el, fn) {
                return el && (fn(el) ? el : closest(el.parentNode, fn));
            };

            // triggers when user clicks on thumbnail
            var onThumbnailsClick = function (e) {
                e = e || window.event;


                if (e.target.className == "havenothave") {
                    return true;
                }
                //delete button click
                if (e.target.id == "deletedImage" || e.target.id == "deletedImageI" || e.target.className == "havenothave") {
                    e.preventDefault();
                    return false;
                }
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
                var eTarget = e.target || e.srcElement;

                // find root element of slide
                var clickedListItem = closest(eTarget, function (el) {
                    return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
                });

                if (!clickedListItem) {
                    return;
                }

                // find index of clicked item by looping through all child nodes
                // alternatively, you may define index via data- attribute
                var clickedGallery = clickedListItem.parentNode,
                    childNodes = clickedListItem.parentNode.childNodes,
                    numChildNodes = childNodes.length,
                    nodeIndex = 0,
                    index;
                var j = 0;
                for (var i = 0; i < numChildNodes; i++) {
                    if (childNodes[i].nodeType !== 1) {
                        continue;
                    }

                    if (childNodes[i] === clickedListItem) {
                        index = nodeIndex;
                        break;
                    }
                    j++;
                    nodeIndex++;
                }

                if (index >= 0) {
                    // open PhotoSwipe if valid index found
                    openPhotoSwipe(index, clickedGallery);
                }
                return false;
            };

            // parse picture index and gallery index from URL (#&pid=1&gid=2)
            var photoswipeParseHash = function () {
                var hash = window.location.hash.substring(1),
                    params = {};

                if (hash.length < 5) {
                    return params;
                }

                var vars = hash.split('&');
                for (var i = 0; i < vars.length; i++) {
                    if (!vars[i]) {
                        continue;
                    }
                    var pair = vars[i].split('=');
                    if (pair.length < 2) {
                        continue;
                    }
                    params[pair[0]] = pair[1];
                }

                if (params.gid) {
                    params.gid = parseInt(params.gid, 10);
                }

                return params;
            };

            var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
                var pswpElement = document.querySelectorAll('.pswp')[0],
                    gallery,
                    options,
                    items;

                items = parseThumbnailElements(galleryElement);

                // define options (if needed)
                options = {

                    // define gallery index (for URL)
                    galleryUID: galleryElement.getAttribute('data-pswp-uid'),

                    getThumbBoundsFn: function (index) {
                        // See Options -> getThumbBoundsFn section of documentation for more info
                        var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                            rect = thumbnail.getBoundingClientRect();
                        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
                    }
                };

                // PhotoSwipe opened from URL
                if (fromURL) {
                    if (options.galleryPIDs) {
                        // parse real index when custom PIDs are used
                        // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                        for (var j = 0; j < items.length; j++) {
                            if (items[j].pid == index) {
                                options.index = j;
                                break;
                            }
                        }
                    } else {
                        // in URL indexes start from 1
                        options.index = parseInt(index, 10) - 1;
                    }
                } else {
                    options.index = parseInt(index, 10);
                }

                // exit if index not found
                if (isNaN(options.index)) {
                    return;
                }

                if (disableAnimation) {
                    options.showAnimationDuration = 0;
                }

                // Pass data to PhotoSwipe and initialize it
                gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                gallery.init();
            };

            // loop through all gallery elements and bind events
            var galleryElements = document.querySelectorAll(gallerySelector);

            for (var i = 0, l = galleryElements.length; i < l; i++) {
                galleryElements[i].setAttribute('data-pswp-uid', i + 1);
                galleryElements[i].onclick = onThumbnailsClick;
            }

            // Parse URL and open gallery if it contains #&pid=3&gid=1
            var hashData = photoswipeParseHash();
            if (hashData.pid && hashData.gid) {
                openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
            }
        };

        // execute above function
        initPhotoSwipeFromDOM('.my-gallery');
        initPhotoSwipeFromDOM('.my-gallery2');
        initPhotoSwipeFromDOM('.my-gallery3');
    }

    function erase() {

        //var m = confirm("ایا تصویر پاک شود؟");
        if (true) {
            clickX_simple = new Array();
            clickY_simple = new Array();
            clickDrag_simple = new Array();
            clearCanvas_simple();
            document.getElementById("Path").style.display = "none";
        }
    }

    function SaveLightPen(/*radio, photo, idEnclosures*/) {

        //var $customerId = $("#CustomerId").val();
        //var $typeid = 13;
        //$.ajax({
        //    type: "POST",
        //    url: "/Admin/CustomerDocument/Create",
        //    async: true,
        //    dataType: 'application/json',
        //    data: {
        //        File: document.getElementById("canvas").toDataURL(), //; canvas.canvas.toDataURL(),
        //        customerId: $customerId,
        //        TypeId: $typeid,
        //        Coment: $("#Coment").val(),
        //        Id: $("#lightPenId").val()
        //    },
        //    success: function (res) {
        //    },
        //    complete: function () {
        //        $("#lightPenIsEdit").val("false");
        //        reloadGalleryByTwoChar($customerId, radio, photo, idEnclosures);
        //        $("#Coment").val("");
        //        signutrebox.remove();
        //        hideWait();
        //    },
        //    error: function (eee) {
        //    }
        //}).done(function (o) {
        //});




        AjaxCallAction('POST', '/Admin/CustomerDocument/Create', {
            File: window.imageEditor.toDataURL(),
            customerId: $("#_CustomerId").val(),
            TypeId: 13,
            Id: $("#Id").val(),
            Coment: $("#Coment").val(),
            FileName: $("#FileName").val()
        }, true, function (res) {

            reloadGallery($("#_CustomerId").val());

            getNotificationBarUploadImage();
            AddNewItem();

        }, false)



    }

    function saveRadiAndPhoto(DWObject, idJpg, idPdf, idEnclosures, autoId = 0, radio = null, photo = null) {

        if ($("#FileName").val() == "" && autoId == 0) { hideWait(); AlertDialog("لطفا نام را وارد کنید", "هشدار"); return; }
        $("#FormmatSave").val($("#FormmatSave").val() == "" ? idJpg : $("#FormmatSave").val());
        if (DWObject) {
            if (DWObject.HowManyImagesInBuffer > 0) {
                DWObject.HTTPPort = location.port == "" ? 80 : location.port;

                var filename = $("#FileName").val() + "." + $("#FormmatSave").find(":selected").text();

                for (var i = 0; i < DWObject.HowManyImagesInBuffer; i++)
                    $("#FormmatSave").find(":selected").val() == idPdf ?
                        DWObject.HTTPUploadAllThroughPostAsPDF(location.hostname, "/Admin/CustomerDocument/ScannerRadioAndPhotoSaveImage?coment=" + $("#Coment").val() + "&type=" + $("#tabType").val() + "&customerId=" + $("#CustomerId").val() + "&autoId=" + autoId + "&filename=" + filename, filename) :
                        DWObject.HTTPUploadThroughPostEx(location.hostname, i, "/Admin/CustomerDocument/ScannerRadioAndPhotoSaveImage?coment=" + $("#Coment").val() + "&type=" + $("#tabType").val() + "&customerId=" + $("#CustomerId").val() + "&autoId=" + autoId + "&filename=" + filename, filename, $("#FormmatSave").find(":selected").val());

                DWObject.RemoveAllImages();
                $("#tabType").val() == idEnclosures ? ReloadEnclosuresByTwoChar($("#CustomerId").val(), radio, photo, idEnclosures) : reloadGalleryByTwoChar($("#CustomerId").val(), radio, photo, idEnclosures);
                $("#divModalWebTwain").modal("hide");
                $("#frmScannerRadioAndPhotoSaveImage")[0].reset();
            }
            else
                AlertDialog("لطفا یک عکس انتخاب کنید", "هشدار");
            hideWait();
        }
    }

    minaDent.UploadImage = {
        showModal: showModal,
        showSignatureModal: showSignatureModal,
        DeleteMultiDocument: DeleteMultiDocument,
        Multidelete: Multidelete,
        erase: erase,
        SaveLightPen: SaveLightPen,
        getNotificationBarUploadImage: getNotificationBarUploadImage,
        ReloadEnclosures: ReloadEnclosures,
        reloadGallery: reloadGallery,
        saveRadiAndPhoto: saveRadiAndPhoto,
        reportMultiUploadImage: reportMultiUploadImage,
        showModalForEdit: showModalForEdit,
        reloadGalleryByTwoChar: reloadGalleryByTwoChar,
        ReloadEnclosuresByTwoChar: ReloadEnclosuresByTwoChar,
        showModalForEditImg: showModalForEditImg,
        //editLightPen: editLightPen,
        ModalForCustomerPen: ModalForCustomerPen
    };

})(MinaDent, jQuery);


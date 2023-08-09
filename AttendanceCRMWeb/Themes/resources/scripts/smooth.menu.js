


function quick() {
    $("#quick ul ").css({ display: "none" });
    $("#quick li").hover(function () {
        $(this).find('ul:first').css({ visibility: "visible", display: "none" }).show(400);
     
    }, function () {
        $(this).find('ul:first').css({ visibility: "hidden" });
    });
}

$(document).ready(function () {
    quick();
});
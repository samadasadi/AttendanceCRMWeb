

function SetLabels() {
    var e = {};
    var Send_ = {};
    e.d = $('#HFdomain').val();
    e.c = $('#HFcodeDU').val();
    e.u = $('#HFUserCode').val();
    e.lang = resources.lang
    Send_.items = e;

    $.ajax({
        url: "TestLabel.aspx/GetLabels_",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(Send_),
        success: function (c) {
            if (c.d[0] == "success") { //succsess
                if (resources.lang == "fa") {
                    var Fares = {};
                    for (j = 0; j <= c.d[1].length - 1; j++) {
                        var item = c.d[1][j];
                        Fares[item.Id] = item.Fa
                    };
                    CreateFaLabelsObject(Fares);
                }
                else {
                    var Enres = {};
                    for (j = 0; j <= c.d[1].length - 1; j++) {
                        var item = c.d[1][j];
                        Enres[item.Id] = item.En
                    };
                    CreateEnLabelsObject(Enres);
                }
            }
        }
    });

}

function CreateFaLabelsObject(Fares) {
    $("res").each(function (i, elemnt) {
        $(elemnt).before(Fares[$(elemnt).text()]).remove();
    });
};

function CreateEnLabelsObject(Enres) {
    $("res").each(function (i, elemnt) {
        $(elemnt).before(Enres[$(elemnt).text()]).remove();
    });
};



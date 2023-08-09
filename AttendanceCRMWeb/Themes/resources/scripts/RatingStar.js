/* ratingStar
version 1.0.0 */

$(function () {

    // bind component
    $.fn.ratingStar = function (options, data) {
        if (typeof options === 'string') {
            var container = $(this);
            if (options == "get") {
               return container.find(".RatingtarWidget").attr("rating");
                 
            } else if (options == "clear") {

                container.find(".RatingtarWidget").attr("rating", 0);
                container.find(".starImage").removeClass("fullStarNone").removeClass("fas").removeClass("filledStar").addClass("emptyStar");


            } else if (options == "disable") {

                container.find(".RatingtarWidget").addClass("disabled");

            } else if (options == "enable") {

                container.find(".RatingtarWidget").removeClass("disabled");

            } else if (options == "set") {
                try {

                    container.find(".starImage").removeClass("fullStarNone").removeClass("fas").removeClass("filledStar").addClass("emptyStar");
                    container.find(".RatingtarWidget").attr("rating", data);
                    for (var i = 0; i < data; i++) {
                        container.find(".starImage").eq(i).addClass("fas").addClass("filledStar").removeClass("emptyStar");
                    }

                }
                catch (err) {
                    container.find(".RatingtarWidget").attr("rating", 0);
                    container.find(".starImage").removeClass("fullStarNone").removeClass("fas").removeClass("filledStar").addClass("emptyStar");
                }


            }

        } else {

            var result;
            this.each(function () {
                result = (new $.ratingStar(options, $(this)));
            })
            return result;

        }

    };



    $.ratingStar = function (options, Container) {
        var FirstOption = options;
        options = $.extend({}, defaultratingStar, options);

        Container.empty();
        Container.append(createratingStar());
        binding(Container, options);
    };

    binding = function (Container, options) {
        //over
        //   $(Container).find(".RatingtarWidget:not(.disabled) .starImage")
        $(Container).find(".starImage")
          .mouseenter(function () {
              if (!$(this).parents(".RatingtarWidget").hasClass("disabled")) {
                  $(this).parent().find(".fas").addClass("fullStarNone").removeClass("fas");
                  $(this).prevAll(".emptyStar").removeClass("emptyStar").addClass("filledStar")
                  $(this).removeClass("emptyStar").addClass("filledStar");
              };
          })
          .mouseleave(function () {
              if (!$(this).parents(".RatingtarWidget").hasClass("disabled")) {
                  $(this).prevAll(".filledStar").removeClass("filledStar").addClass("emptyStar");
                  $(this).removeClass("filledStar").addClass("emptyStar");
                  $(this).parent().find(".fullStarNone").addClass("fas").removeClass("fullStarNone");
              };
          });

        //click
        $(Container).find(".starImage").click(function () {
            if (!$(this).parents(".RatingtarWidget").hasClass("disabled")) {
                var countSelectStar = $(this).prevAll(".starImage").length + 1;
                if ($(this).parent().attr("rating") == countSelectStar) {
                    // set rate 0
                    $(this).parent().attr("rating", 0);
                    $(this).parent().find(".fullStarNone").removeClass("fullStarNone");
                    $(this).parent().find(".filledStar").removeClass("filledStar");
                    $(this).parent().find(".starImage").addClass("emptyStar");
                    options.onSelect(0);
                } else {
                    // set rate selectaion
                    $(this).parent().attr("rating", countSelectStar);
                    $(this).parent().find(".fullStarNone").removeClass("fullStarNone");  // Star selected hidden
                    $(this).prevAll(".filledStar").addClass("fas") // Star selected
                    $(this).addClass("fas");  // Star selected
                    options.onSelect(countSelectStar);
                }
             
            };
         
        });
    };

    createratingStar = function () {
        var s_ = '<div class="ratingStar" ><div class="RatingtarWidget" rating="0">';
        s_ += '<i class="starImage emptyStar icon-star"></i>';
        s_ += '<i class="starImage emptyStar icon-star"></i>';
        s_ += '<i class="starImage emptyStar icon-star"></i>';
        s_ += '<i class="starImage emptyStar icon-star"></i>';
        s_ += '<i class="starImage emptyStar icon-star"></i>';
        s_ += '</div></div>';
        return s_;
    }


    var defaultratingStar = {
        onSelect: function () { },
        callback: function () { }
    };



});






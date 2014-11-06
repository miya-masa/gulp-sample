(function($) {
    var hello = function() {
        console.log('Hello MAIN!!!!');
    };
    $(function() {
        $('.main-hello').click(function(e) {
            hello();
        });
    })
})(jQuery);

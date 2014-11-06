(function($) {
    var hello = function() {
        console.log('Hello MIYA!!!!');
    };
    $(function() {
        $('.main-hello').click(function(e) {
            hello();
        });
    })
})(jQuery);

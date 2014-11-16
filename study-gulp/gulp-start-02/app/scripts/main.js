(function($) {
    var hello = function() {
        console.log('Helloooooo MAIN!!!!');
    };
    $(function() {
        $('.main-hello').click(function(e) {
            hello();
        });
    })
})(jQuery);

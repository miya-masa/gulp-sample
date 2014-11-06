(function($) {
    var hello = function() {
        console.log('Hello FO!!!!');
    };
    $(function() {
        $('.foo-hello').click(function(e) {
            hello();
        });
    })
})(jQuery);

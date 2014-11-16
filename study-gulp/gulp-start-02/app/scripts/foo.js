(function($) {
    var hello = function() {
        console.log('Hello FOO!!!!');
    };
    $(function() {
        $('.foo-hello').click(function(e) {
            hello();
        });
    })
})(jQuery);

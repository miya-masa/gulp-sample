(function($) {
    var hello = function() {
        console.log('Hello FOOOO!!!!');
    };
    $(function() {
        $('.foo-hello').click(function(e) {
            hello();
        });
    })
})(jQuery);

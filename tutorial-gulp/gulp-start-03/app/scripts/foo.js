(function($) {
    var hello = function() {
        console.log('Hello Foo!!!');
    };
    $(function() {
        $('.foo-hello').click(function(e) {
            hello();
        });
    })
})(jQuery);

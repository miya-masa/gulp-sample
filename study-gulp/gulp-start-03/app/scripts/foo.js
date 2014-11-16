(function($) {
    var hello = function() {
        console.log('Hello FooOOOO!!!');
    };
    $(function() {
        $('.foo-hello').click(function(e) {
            hello();
        });
    })
})(jQuery);

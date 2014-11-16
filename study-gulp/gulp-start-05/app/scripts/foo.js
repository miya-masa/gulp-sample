(function($) {
    'use strict';
    var hello = function() {
        console.log('Hello FOOOOO!!!!');
    };
    $(function() {
        $('.foo-hello').click(function() {
            hello();
            $('.target').append($('<div/>').text('Hello!!!!'));
        });
    });
})(jQuery);

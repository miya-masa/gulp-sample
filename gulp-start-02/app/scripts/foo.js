(function($) {
    'use strict';
    var hello = function() {
        console.log('Hello FOO!!!!');
    };
    $(function() {
        $('.foo-hello').click(function() {
            hello();
            $('.target').append($('<div/>').text('Hello!!!!'));
        });
    });
})(jQuery);

(function($) {
    'use strict';
    var hello = function() {
        console.log('Hello MIYA!!!!');
    };
    $(function() {
        $('.main-hello').click(hello);
    });
})(jQuery);

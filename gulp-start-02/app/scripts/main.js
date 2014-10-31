(function() {
    'use strict';
    var helloName = function(name) {
        return 'Hello' + name + '!!!';
    };
    var name = " miya";
    console.log('Hello World!!');
    console.log(helloName(name));
    $(function() {
        $('.test-div').click(function() {
            console.log($(this).text());
        });
    })
})();

// npm�Ŏ�荞��uniq�Ƃ������C�u�����̗��p�錾
var uniq = require('uniq');
var foo = require('./foo.js');
var nums = [5, 2, 1, 3, 2, 5, 4, 2, 0];
console.log(uniq(nums));
console.log(foo('Miya'));

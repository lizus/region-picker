const lizus = require('./lizus');
/**
 * 用于查询匹配，正确返回匹配数组，错误返回false
 */
lizus.match=lizus.curry(function (q,str) {
    if (lizus.isEmpty(str)) return false;
    return String.prototype.match.call(str,q) || false;
});

module.exports=lizus;

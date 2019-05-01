/* ---=*--*=*-=*-=-*-=* 🌹 *---=*--*=*-=*-=-*-=*
Lizus核心库
Author: lizus.com
---=*--*=*-=*-=-*-=* 🌹 *---=*--*=*-=*-=-*-=* */
//用于获取x的类型
//getType :: a -> string
var getType = function getType(x) {
    var type=Object.prototype.toString.call(x);
    return type.slice(8,-1);
};
//用于切换谓词函数的返回值
//not :: () -> ( a -> boolean )
var not = function not(fn) {
    return function () {
        return !fn.apply(null,[].slice.apply(arguments,[0]));
    }
};
//用于判断x是否存在
// isExist :: a -> boolean
var isExist=function isExist(x) {
    return x!=null;
};

//判断x是否为真，使用Boolean的结果
// isTrue :: a -> boolean
var isTrue =  Boolean;

//判断x是否为空，此处判断空对象不算empty
//isEmpty :: a -> boolean
var isEmpty = function isEmpty(x) {
    if (isTrue(x) && Math.abs(Number(x)) != 0) return false;
    return true;
};

//生成返回自身的函数
//of :: x -> () -> x
var of=function (x) {
    return function () {
        return x;
    };
};
//用于生成只接受len个参数的fn
//arity :: number -> () -> ()
var arity = function arity(len,fn) {
    if (len<1) len=1;
    if (typeof fn != 'function') return null;
    return function () {
        var args=[].slice.apply(arguments,[0,len]);
        return fn.apply(null,args);
    }
};
//生成反转参数的函数
//reverseArg :: () -> ()
var reverseArg = function reverseArg(fn) {
    if (typeof fn != 'function') return null;
    return function () {
        var args=[].slice.apply(arguments,[0]).reverse();
        return fn.apply(null,args);
    }
};
//curry函数
//curry :: () -> ()
var curry=function curry(fn) {
    if (typeof fn != 'function') return null;
    return function curryMe() {
        var args=[].slice.apply(arguments,[0]);
        if (args.length >= fn.length) return fn.apply(null,args);
        return function () {
            return curryMe.apply(null,args.concat([].slice.apply(arguments,[0])));
        }
    }
};
//用于调试，tag用于标识调试信息，x为调试项，最终返回x不阻止程序运行
//trace :: string -> a -> a
var trace=curry(function trace(tag,x) {
    if (isExist(console)) {
        console.log(tag,x);
    }else{
        alert(tag);
        alert(opt);
    }
    return x;
});
//compose函数，用于组合函数，从右至左执行
//compose :: () -> a
var compose=function compose() {
    var args=[].slice.apply(arguments,[0]).reverse();
    return function () {
        var result=[].slice.apply(arguments,[0]);
        for (var i=0;i<args.length;i++) {
            if (typeof args[i] != 'function') return trace('the arguments is not a function',args[i]);
            result=args[i].apply(null,[].concat(result));
        }
        return result;
    }
};
//同compose，但是从左至右执行
//flow:: () -> a
var flow=reverseArg(compose);

//用于判断两个参数是否相等
//e :: a -> b -> boolean
var e = curry(function e(a,b) {
    return a == b;
});
//用于判断b < a
//lt :: a -> b -> boolean
var lt = curry(function lt(a,b) {
    return b < a;
});
//用于判断b > a
//gt :: a -> b -> boolean
var gt = curry(function (a,b) {
    return b > a;
});

//用于判断x是否是a类型
//isType :: a -> x -> boolean
var isType = curry(function isType(a,x) {
    return e(a,getType(x));
});
//判断a是否是数组
//isArray :: a -> boolean
var isArray = isType('Array');

//判断a是否是对象
//isObject :: a -> boolean
var isObject = isType('Object');

//判断a是否是字符串
//isString :: a -> boolean
var isString = isType('String');

//判断a是否是数字
//isNumber :: a -> boolean
var isNumber = isType('Number');

//判断a是否是函数
//isFunction :: a -> boolean
var isFunction = isType('Function');

//判断a是否是正则表达式
//isRegExp :: a -> boolean
var isRegExp = isType('RegExp');

//判断a是否是布尔值
//isBoolean :: a -> boolean
var isBoolean = isType('Boolean');

//判断a是否是日期对象
//isDate :: a -> boolean
var isDate = isType('Date');

//curry化的Array重要函数，并将fn放在第一个参数位置上
//map :: () -> array -> array
var map = curry(function map(fn,col) {
    return Array.prototype.map.call(col,fn);
});
//filter :: () -> array -> array
var filter = curry(function filter(fn,col) {
    return Array.prototype.filter.call(col,fn);
});
//reduce :: () -> array -> array
var reduce = curry(function reduce(fn,col) {
    return Array.prototype.reduce.call(col,fn);
});

//深度复制，主要解决数组和对象的引用问题，通过深度复制去除引用
//deepCopy :: a -> b
var deepCopy=function (sth) {
    var re;
    if (isObject(sth)) {
        re={};
        for (var key in sth) {
            if (sth.hasOwnProperty(key)) {
                re[key]=deepCopy(sth[key]);
            }
        }
    }else if(isArray(sth)){
        re=map(deepCopy,sth);
    }else{
        re=sth;
    }
    return re;
};

//转变为数组
//toArray :: a -> b
var toArray = function (sth) {
    var re=[];
    if (isObject(sth)) {
        for (var key in sth) {
            if (sth.hasOwnProperty(key)) {
                if (isObject(sth[key])) {
                    re.push([key,toArray(sth[key])]);
                }else{
                    re.push([key,sth[key]]);
                }
            }
        }
    }else{
        re=re.concat(deepCopy(sth));
    }
    return re;
};

module.exports={
    trace:trace,
    arity:arity,
    reverseArg:reverseArg,
    curry:curry,
    compose:compose,
    flow:flow,
    not:not,
    of:of,
    e:e,
    lt:lt,
    gt:gt,
    getType:getType,
    isType:isType,
    isArray:isArray,
    isObject:isObject,
    isString:isString,
    isDate:isDate,
    isNumber:isNumber,
    isBoolean:isBoolean,
    isFunction:isFunction,
    isRegExp:isRegExp,
    isExist:isExist,
    isTrue:isTrue,
    isEmpty:isEmpty,
    map:map,
    filter:filter,
    reduce:reduce,
    deepCopy:deepCopy,
    toArray:toArray
  };
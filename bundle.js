(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.bj.aG === region.bQ.aG)
	{
		return 'on line ' + region.bj.aG;
	}
	return 'on lines ' + region.bj.aG + ' through ' + region.bQ.aG;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.c8,
		impl.dH,
		impl.dD,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		P: func(record.P),
		bk: record.bk,
		bh: record.bh
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.P;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.bk;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.bh) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.c8,
		impl.dH,
		impl.dD,
		function(sendToApp, initialModel) {
			var view = impl.dJ;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.c8,
		impl.dH,
		impl.dD,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.bi && impl.bi(sendToApp)
			var view = impl.dJ;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.cQ);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.cD) && (_VirtualDom_doc.title = title = doc.cD);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.dm;
	var onUrlRequest = impl.dn;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		bi: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.ci === next.ci
							&& curr.bX === next.bX
							&& curr.cf.a === next.cf.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		c8: function(flags)
		{
			return A3(impl.c8, flags, _Browser_getUrl(), key);
		},
		dJ: impl.dJ,
		dH: impl.dH,
		dD: impl.dD
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { c5: 'hidden', cS: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { c5: 'mozHidden', cS: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { c5: 'msHidden', cS: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { c5: 'webkitHidden', cS: 'webkitvisibilitychange' }
		: { c5: 'hidden', cS: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		cq: _Browser_getScene(),
		cJ: {
			o: _Browser_window.pageXOffset,
			p: _Browser_window.pageYOffset,
			ac: _Browser_doc.documentElement.clientWidth,
			aE: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		ac: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		aE: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			cq: {
				ac: node.scrollWidth,
				aE: node.scrollHeight
			},
			cJ: {
				o: node.scrollLeft,
				p: node.scrollTop,
				ac: node.clientWidth,
				aE: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			cq: _Browser_getScene(),
			cJ: {
				o: x,
				p: y,
				ac: _Browser_doc.documentElement.clientWidth,
				aE: _Browser_doc.documentElement.clientHeight
			},
			cZ: {
				o: x + rect.left,
				p: y + rect.top,
				ac: rect.width,
				aE: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.c$.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.c$.b, xhr)); });
		$elm$core$Maybe$isJust(request.cF) && _Http_track(router, xhr, request.cF.a);

		try {
			xhr.open(request.da, request.cI, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.cI));
		}

		_Http_configureRequest(xhr, request);

		request.cQ.a && xhr.setRequestHeader('Content-Type', request.cQ.a);
		xhr.send(request.cQ.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.bW; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.dG.a || 0;
	xhr.responseType = request.c$.d;
	xhr.withCredentials = request.cN;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		cI: xhr.responseURL,
		dA: xhr.status,
		dB: xhr.statusText,
		bW: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			dx: event.loaded,
			ct: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			ds: event.loaded,
			ct: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}var $author$project$Update$LinkClicked = function (a) {
	return {$: 0, a: a};
};
var $author$project$Update$UrlChanged = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.i) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.k),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.k);
		} else {
			var treeLen = builder.i * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.l) : builder.l;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.i);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.k) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.k);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{l: nodeList, i: (len / $elm$core$Array$branchFactor) | 0, k: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {bT: fragment, bX: host, dq: path, cf: port_, ci: protocol, cj: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Model$GraphAlgorithmModel = function (a) {
	return {$: 1, a: a};
};
var $author$project$Update$GraphMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Model$HomeModel = {$: 3};
var $author$project$Model$MazeAlgorithmModel = function (a) {
	return {$: 2, a: a};
};
var $author$project$Update$MazeMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Pages$Sort$Update$NewSeedStart = function (a) {
	return {$: 7, a: a};
};
var $author$project$Model$SortAlgorithmsModel = function (a) {
	return {$: 0, a: a};
};
var $author$project$Update$SortMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Update$SubPageMsg = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$random$Random$Generate = $elm$core$Basics$identity;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0;
		return function (seed0) {
			var _v1 = genA(seed0);
			var a = _v1.a;
			var seed1 = _v1.b;
			return _Utils_Tuple2(
				func(a),
				seed1);
		};
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0;
		return A2($elm$random$Random$map, func, generator);
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			A2($elm$random$Random$map, tagger, generator));
	});
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Update$getCanvasWidth = _Platform_outgoingPort(
	'getCanvasWidth',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Algorithms$Graphs$MazeGenerator$Dimension = F2(
	function (width, height) {
		return {aE: height, ac: width};
	});
var $author$project$Algorithms$Graphs$MazeGenerator$Position = F2(
	function (y, x) {
		return {o: x, p: y};
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Algorithms$Graphs$MazeGenerator$Edge = F2(
	function (from, to) {
		return {ak: from, av: to};
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Algorithms$Graphs$MazeGenerator$listPositionToPath = function (l) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (curr, _v0) {
				var prev = _v0.a;
				var acc = _v0.b;
				if (prev.$ === 1) {
					return _Utils_Tuple2(
						$elm$core$Maybe$Just(curr),
						acc);
				} else {
					var p = prev.a;
					return _Utils_Tuple2(
						$elm$core$Maybe$Just(curr),
						A2(
							$elm$core$List$cons,
							A2($author$project$Algorithms$Graphs$MazeGenerator$Edge, p, curr),
							acc));
				}
			}),
		_Utils_Tuple2($elm$core$Maybe$Nothing, _List_Nil),
		l).b;
};
var $elm$core$Tuple$mapBoth = F3(
	function (funcA, funcB, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			funcA(x),
			funcB(y));
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Algorithms$Graphs$MazeGenerator$dfs = F3(
	function (f, t, e) {
		var dfsAux = F3(
			function (from, to, visited) {
				var getNotVisited = A2(
					$elm$core$List$filter,
					function (neigh) {
						return !A2(
							$elm$core$Maybe$withDefault,
							false,
							A2(
								$elm$core$Dict$get,
								_Utils_Tuple2(neigh.p, neigh.o),
								visited));
					},
					A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							$elm$core$Dict$get,
							_Utils_Tuple2(from.p, from.o),
							e)));
				if (_Utils_eq(from, to)) {
					return _Utils_Tuple2(
						_List_fromArray(
							[to]),
						_List_fromArray(
							[to]));
				} else {
					if (A2(
						$elm$core$Maybe$withDefault,
						false,
						A2(
							$elm$core$Dict$get,
							_Utils_Tuple2(from.p, from.o),
							visited))) {
						return _Utils_Tuple2(
							_List_Nil,
							_List_fromArray(
								[from]));
					} else {
						var new_visited = A3(
							$elm$core$Dict$insert,
							_Utils_Tuple2(from.p, from.o),
							true,
							visited);
						var _v0 = A2(
							$elm$core$Tuple$mapSecond,
							$elm$core$List$concat,
							A3(
								$elm$core$List$foldl,
								F2(
									function (neighbour, _v1) {
										var accRes = _v1.a;
										var accPaths = _v1.b;
										var _v2 = A3(dfsAux, neighbour, to, new_visited);
										var res = _v2.a;
										var paths = _v2.b;
										return $elm$core$List$isEmpty(accRes) ? ($elm$core$List$isEmpty(res) ? _Utils_Tuple2(
											_List_Nil,
											A2(
												$elm$core$List$cons,
												_Utils_ap(
													paths,
													_List_fromArray(
														[from])),
												accPaths)) : _Utils_Tuple2(
											res,
											A2(
												$elm$core$List$cons,
												_Utils_ap(
													paths,
													_List_fromArray(
														[from])),
												accPaths))) : _Utils_Tuple2(accRes, accPaths);
									}),
								_Utils_Tuple2(_List_Nil, _List_Nil),
								getNotVisited));
						var results = _v0.a;
						var allpaths = _v0.b;
						if (!results.b) {
							return _Utils_Tuple2(
								_List_Nil,
								A2($elm$core$List$cons, from, allpaths));
						} else {
							var a = results;
							return _Utils_Tuple2(
								A2($elm$core$List$cons, from, a),
								A2($elm$core$List$cons, from, allpaths));
						}
					}
				}
			});
		return A3(
			$elm$core$Tuple$mapBoth,
			$author$project$Algorithms$Graphs$MazeGenerator$listPositionToPath,
			$author$project$Algorithms$Graphs$MazeGenerator$listPositionToPath,
			A3(dfsAux, f, t, $elm$core$Dict$empty));
	});
var $author$project$Algorithms$Graphs$MazeGenerator$generatePairs = function (_v0) {
	var width = _v0.ac;
	var height = _v0.aE;
	var getNeigh = F2(
		function (i, j) {
			var _v1 = _Utils_Tuple2(i, j);
			if (!_v1.a) {
				if (!_v1.b) {
					return _List_Nil;
				} else {
					var x = _v1.b;
					return _List_fromArray(
						[
							A2(
							$author$project$Algorithms$Graphs$MazeGenerator$Edge,
							A2($author$project$Algorithms$Graphs$MazeGenerator$Position, 0, x - 1),
							A2($author$project$Algorithms$Graphs$MazeGenerator$Position, 0, x))
						]);
				}
			} else {
				if (!_v1.b) {
					var y = _v1.a;
					return _List_fromArray(
						[
							A2(
							$author$project$Algorithms$Graphs$MazeGenerator$Edge,
							A2($author$project$Algorithms$Graphs$MazeGenerator$Position, y - 1, 0),
							A2($author$project$Algorithms$Graphs$MazeGenerator$Position, y, 0))
						]);
				} else {
					var y = _v1.a;
					var x = _v1.b;
					return _List_fromArray(
						[
							A2(
							$author$project$Algorithms$Graphs$MazeGenerator$Edge,
							A2($author$project$Algorithms$Graphs$MazeGenerator$Position, y - 1, x),
							A2($author$project$Algorithms$Graphs$MazeGenerator$Position, y, x)),
							A2(
							$author$project$Algorithms$Graphs$MazeGenerator$Edge,
							A2($author$project$Algorithms$Graphs$MazeGenerator$Position, y, x - 1),
							A2($author$project$Algorithms$Graphs$MazeGenerator$Position, y, x))
						]);
				}
			}
		});
	return $elm$core$List$concat(
		A2(
			$elm$core$List$map,
			function (i) {
				return $elm$core$List$concat(
					A2(
						$elm$core$List$map,
						function (j) {
							return A2(getNeigh, i, j);
						},
						A2($elm$core$List$range, 0, width - 1)));
			},
			A2($elm$core$List$range, 0, height - 1)));
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_v0.$) {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $author$project$Algorithms$Graphs$MazeGenerator$getPivotAndCompress = F2(
	function (index, arr) {
		var current = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Array$get, index, arr));
		if (_Utils_eq(index, current)) {
			return _Utils_Tuple2(index, arr);
		} else {
			var _v0 = A2($author$project$Algorithms$Graphs$MazeGenerator$getPivotAndCompress, current, arr);
			var res = _v0.a;
			var newArr = _v0.b;
			return _Utils_Tuple2(
				res,
				A3($elm$core$Array$set, index, res, newArr));
		}
	});
var $author$project$Algorithms$Graphs$MazeGenerator$getPathFromPairsAux = F4(
	function (dimension, edges, pivots, acc) {
		getPathFromPairsAux:
		while (true) {
			if (!edges.b) {
				return acc;
			} else {
				var from = edges.a.ak;
				var to = edges.a.av;
				var r = edges.b;
				var toIndex = (to.p * dimension.ac) + to.o;
				var newEdge = A2($author$project$Algorithms$Graphs$MazeGenerator$Edge, from, to);
				var fromIndex = (from.p * dimension.ac) + from.o;
				var _v1 = A2($author$project$Algorithms$Graphs$MazeGenerator$getPivotAndCompress, fromIndex, pivots);
				var pivotFrom = _v1.a;
				var pivotsFrom = _v1.b;
				var _v2 = A2($author$project$Algorithms$Graphs$MazeGenerator$getPivotAndCompress, toIndex, pivotsFrom);
				var pivotTo = _v2.a;
				var pivotsTo = _v2.b;
				if (_Utils_eq(pivotTo, pivotFrom)) {
					var $temp$dimension = dimension,
						$temp$edges = r,
						$temp$pivots = pivots,
						$temp$acc = acc;
					dimension = $temp$dimension;
					edges = $temp$edges;
					pivots = $temp$pivots;
					acc = $temp$acc;
					continue getPathFromPairsAux;
				} else {
					var $temp$dimension = dimension,
						$temp$edges = r,
						$temp$pivots = A3($elm$core$Array$set, pivotFrom, pivotTo, pivotsTo),
						$temp$acc = A2($elm$core$List$cons, newEdge, acc);
					dimension = $temp$dimension;
					edges = $temp$edges;
					pivots = $temp$pivots;
					acc = $temp$acc;
					continue getPathFromPairsAux;
				}
			}
		}
	});
var $author$project$Algorithms$Graphs$MazeGenerator$getPathFromPairs = F2(
	function (dimension, allEdges) {
		var _v0 = dimension;
		var width = _v0.ac;
		var height = _v0.aE;
		return A4(
			$author$project$Algorithms$Graphs$MazeGenerator$getPathFromPairsAux,
			dimension,
			allEdges,
			A2($elm$core$Array$initialize, width * height, $elm$core$Basics$identity),
			_List_Nil);
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{l: nodeList, i: nodeListSize, k: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return function (seed0) {
			var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
			var lo = _v0.a;
			var hi = _v0.b;
			var range = (hi - lo) + 1;
			if (!((range - 1) & range)) {
				return _Utils_Tuple2(
					(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
					$elm$random$Random$next(seed0));
			} else {
				var threshhold = (((-range) >>> 0) % range) >>> 0;
				var accountForBias = function (seed) {
					accountForBias:
					while (true) {
						var x = $elm$random$Random$peel(seed);
						var seedN = $elm$random$Random$next(seed);
						if (_Utils_cmp(x, threshhold) < 0) {
							var $temp$seed = seedN;
							seed = $temp$seed;
							continue accountForBias;
						} else {
							return _Utils_Tuple2((x % range) + lo, seedN);
						}
					}
				};
				return accountForBias(seed0);
			}
		};
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0;
		return function (seed) {
			return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
		};
	});
var $owanturist$elm_union_find$UnionFind$findFast = F2(
	function (id, dict) {
		findFast:
		while (true) {
			var _v0 = A2($elm$core$Dict$get, id, dict);
			if (_v0.$ === 1) {
				return id;
			} else {
				var cursor = _v0.a;
				if (_Utils_eq(id, cursor)) {
					return id;
				} else {
					var $temp$id = cursor,
						$temp$dict = dict;
					id = $temp$id;
					dict = $temp$dict;
					continue findFast;
				}
			}
		}
	});
var $owanturist$elm_union_find$UnionFind$find = F2(
	function (id, _v0) {
		var dict = _v0.b;
		return A2($owanturist$elm_union_find$UnionFind$findFast, id, dict);
	});
var $elm$core$Array$isEmpty = function (_v0) {
	var len = _v0.a;
	return !len;
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $owanturist$elm_union_find$UnionFind$QuickUnionPathCompression = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $owanturist$elm_union_find$UnionFind$quickUnionPathCompression = A2($owanturist$elm_union_find$UnionFind$QuickUnionPathCompression, 0, $elm$core$Dict$empty);
var $owanturist$elm_union_find$UnionFind$findCompressed = F2(
	function (id, dict) {
		var _v0 = A2($elm$core$Dict$get, id, dict);
		if (_v0.$ === 1) {
			return _Utils_Tuple2(
				id,
				A3($elm$core$Dict$insert, id, id, dict));
		} else {
			var cursor = _v0.a;
			if (_Utils_eq(id, cursor)) {
				return _Utils_Tuple2(id, dict);
			} else {
				var _v1 = A2($owanturist$elm_union_find$UnionFind$findCompressed, cursor, dict);
				var parent = _v1.a;
				var nextDict = _v1.b;
				return _Utils_Tuple2(
					parent,
					A3($elm$core$Dict$insert, id, parent, nextDict));
			}
		}
	});
var $owanturist$elm_union_find$UnionFind$union = F3(
	function (left, right, _v0) {
		var count_ = _v0.a;
		var dict = _v0.b;
		var _v1 = A2($owanturist$elm_union_find$UnionFind$findCompressed, left, dict);
		var leftRoot = _v1.a;
		var leftDict = _v1.b;
		var _v2 = A2($owanturist$elm_union_find$UnionFind$findCompressed, right, leftDict);
		var rightRoot = _v2.a;
		var rightDict = _v2.b;
		return _Utils_eq(leftRoot, rightRoot) ? A2($owanturist$elm_union_find$UnionFind$QuickUnionPathCompression, count_, rightDict) : A2(
			$owanturist$elm_union_find$UnionFind$QuickUnionPathCompression,
			count_ + 1,
			A3($elm$core$Dict$insert, leftRoot, rightRoot, rightDict));
	});
var $elm_community$random_extra$Utils$selectUniqByIndexes = F2(
	function (values, randomIndexes) {
		var modByLength = $elm$core$Basics$modBy(
			$elm$core$Array$length(values));
		var step = F2(
			function (randomIndex, _v1) {
				var uf = _v1.a;
				var acc = _v1.b;
				var leaderOfElement = A2($owanturist$elm_union_find$UnionFind$find, randomIndex, uf);
				var leaderOfNextElement = A2(
					$owanturist$elm_union_find$UnionFind$find,
					modByLength(leaderOfElement + 1),
					uf);
				var _v0 = A2($elm$core$Array$get, leaderOfElement, values);
				if (_v0.$ === 1) {
					return _Utils_Tuple2(uf, acc);
				} else {
					var value = _v0.a;
					return _Utils_Tuple2(
						A3($owanturist$elm_union_find$UnionFind$union, leaderOfElement, leaderOfNextElement, uf),
						A2($elm$core$List$cons, value, acc));
				}
			});
		return $elm$core$Array$isEmpty(values) ? _List_Nil : A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2($owanturist$elm_union_find$UnionFind$quickUnionPathCompression, _List_Nil),
			randomIndexes).b;
	});
var $elm_community$random_extra$Random$List$shuffle = function (list) {
	var values = $elm$core$Array$fromList(list);
	var length = $elm$core$Array$length(values);
	return A2(
		$elm$random$Random$map,
		$elm_community$random_extra$Utils$selectUniqByIndexes(values),
		A2(
			$elm$random$Random$list,
			length,
			A2($elm$random$Random$int, 0, length - 1)));
};
var $author$project$Algorithms$Graphs$MazeGenerator$generatePath = F2(
	function (dimension, seedNumber) {
		var initialSeed = $elm$random$Random$initialSeed(seedNumber);
		var _v0 = dimension;
		var width = _v0.ac;
		var height = _v0.aE;
		var _v1 = _Utils_Tuple2(width, height);
		if (!_v1.a) {
			return _List_Nil;
		} else {
			if (!_v1.b) {
				return _List_Nil;
			} else {
				return A2(
					$author$project$Algorithms$Graphs$MazeGenerator$getPathFromPairs,
					dimension,
					A2(
						$elm$random$Random$step,
						$elm_community$random_extra$Random$List$shuffle(
							$author$project$Algorithms$Graphs$MazeGenerator$generatePairs(dimension)),
						initialSeed).a);
			}
		}
	});
var $author$project$Algorithms$Graphs$MazeGenerator$pathToEdgesPerNode = function (path) {
	var completePath = _Utils_ap(
		path,
		A2(
			$elm$core$List$map,
			function (_v1) {
				var from = _v1.ak;
				var to = _v1.av;
				return {ak: to, av: from};
			},
			path));
	return A3(
		$elm$core$List$foldr,
		F2(
			function (_v0, acc) {
				var from = _v0.ak;
				var to = _v0.av;
				var edges = A2(
					$elm$core$List$cons,
					to,
					A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							$elm$core$Dict$get,
							_Utils_Tuple2(from.p, from.o),
							acc)));
				return A3(
					$elm$core$Dict$insert,
					_Utils_Tuple2(from.p, from.o),
					edges,
					acc);
			}),
		$elm$core$Dict$empty,
		completePath);
};
var $author$project$Pages$Graph$Model$initModel = function () {
	var dimension = A2($author$project$Algorithms$Graphs$MazeGenerator$Dimension, 14, 14);
	var endPosition = A2($author$project$Algorithms$Graphs$MazeGenerator$Position, dimension.aE - 1, dimension.ac - 1);
	var path = A2($author$project$Algorithms$Graphs$MazeGenerator$generatePath, dimension, 272);
	var beginPosition = A2($author$project$Algorithms$Graphs$MazeGenerator$Position, 0, 0);
	var _v0 = A3(
		$author$project$Algorithms$Graphs$MazeGenerator$dfs,
		beginPosition,
		endPosition,
		$author$project$Algorithms$Graphs$MazeGenerator$pathToEdgesPerNode(path));
	var beginEndPath = _v0.a;
	var allSteps = _v0.b;
	return {bs: allSteps, bw: beginEndPath, bx: beginPosition, bL: dimension, bM: $elm$core$Dict$empty, bN: _List_Nil, bP: 1024, bR: endPosition, bZ: 1, b7: path, cs: true, cD: 'DFS'};
}();
var $author$project$Algorithms$Graphs$MazeGenerator$Free = 1;
var $author$project$Algorithms$Graphs$MazeGenerator$Occupied = 0;
var $author$project$Algorithms$Graphs$MazeGenerator$pathToMaze = F2(
	function (dimension, path) {
		var getPos = function (_v2) {
			var from = _v2.ak;
			var to = _v2.av;
			var horizontal = _Utils_eq(from.o, to.o);
			return horizontal ? A2(
				$author$project$Algorithms$Graphs$MazeGenerator$Position,
				A2($elm$core$Basics$max, from.p, to.p) * 2,
				(2 * from.o) + 1) : A2(
				$author$project$Algorithms$Graphs$MazeGenerator$Position,
				(2 * from.p) + 1,
				A2($elm$core$Basics$max, from.o, to.o) * 2);
		};
		var setOccupied = F2(
			function (maze, edge) {
				var pos = getPos(edge);
				var line = A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Array$empty,
					A2($elm$core$Array$get, pos.p, maze));
				return A3(
					$elm$core$Array$set,
					pos.p,
					A3($elm$core$Array$set, pos.o, 1, line),
					maze);
			});
		var _v0 = dimension;
		var width = _v0.ac;
		var height = _v0.aE;
		var initMaze = A2(
			$elm$core$Array$initialize,
			(2 * height) + 1,
			function (i) {
				return A2(
					$elm$core$Array$initialize,
					(2 * width) + 1,
					function (j) {
						var _v1 = _Utils_Tuple2(i, j);
						if (!_v1.a) {
							return 0;
						} else {
							if (!_v1.b) {
								return 0;
							} else {
								var y = _v1.a;
								var x = _v1.b;
								return (((y % 2) === 1) && ((x % 2) === 1)) ? 1 : 0;
							}
						}
					});
			});
		return A3(
			$elm$core$List$foldl,
			F2(
				function (edge, acc) {
					return A2(setOccupied, acc, edge);
				}),
			initMaze,
			path);
	});
var $author$project$Pages$Maze$Model$initModel = function () {
	var dimension = A2($author$project$Algorithms$Graphs$MazeGenerator$Dimension, 30, 30);
	var path = A2($author$project$Algorithms$Graphs$MazeGenerator$generatePath, dimension, 272);
	var _v0 = A3(
		$author$project$Algorithms$Graphs$MazeGenerator$dfs,
		A2($author$project$Algorithms$Graphs$MazeGenerator$Position, 0, 0),
		A2($author$project$Algorithms$Graphs$MazeGenerator$Position, 29, 29),
		$author$project$Algorithms$Graphs$MazeGenerator$pathToEdgesPerNode(path));
	var beginEndPath = _v0.a;
	var allSteps = _v0.b;
	return {
		bw: beginEndPath,
		bM: $elm$core$Dict$empty,
		bN: _List_Nil,
		bP: 1024,
		bZ: 1,
		b7: A2($author$project$Algorithms$Graphs$MazeGenerator$pathToMaze, dimension, path),
		cD: 'Maze generator',
		cE: path
	};
}();
var $author$project$Pages$Sort$Model$SelectionSort = 1;
var $author$project$Pages$Sort$Model$SortInfo = F5(
	function (sortType, sortName, codeUrl, maxLength, stepsFunction) {
		return {cU: codeUrl, aZ: maxLength, dy: sortName, dz: sortType, dC: stepsFunction};
	});
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $author$project$Pages$Sort$Algorithms$SelectionSort$getMinAndPositionSteps = F4(
	function (l, index, _v0, steps) {
		getMinAndPositionSteps:
		while (true) {
			var minPosition = _v0.a;
			var minValue = _v0.b;
			if (!l.b) {
				return _Utils_Tuple3(minPosition, minValue, steps);
			} else {
				var v = l.a;
				var r = l.b;
				var _v2 = (_Utils_cmp(v, minValue) < 0) ? _Utils_Tuple2(index, v) : _Utils_Tuple2(minPosition, minValue);
				var newPosition = _v2.a;
				var newMin = _v2.b;
				var newSteps = A2(
					$elm$core$List$cons,
					_Utils_Tuple2(index, newPosition),
					steps);
				var $temp$l = r,
					$temp$index = index + 1,
					$temp$_v0 = _Utils_Tuple2(newPosition, newMin),
					$temp$steps = newSteps;
				l = $temp$l;
				index = $temp$index;
				_v0 = $temp$_v0;
				steps = $temp$steps;
				continue getMinAndPositionSteps;
			}
		}
	});
var $author$project$Pages$Sort$Algorithms$SelectionSort$insertList = F3(
	function (l, pos, ele) {
		return A2(
			$elm$core$List$indexedMap,
			F2(
				function (index, v) {
					return _Utils_eq(index, pos) ? ele : v;
				}),
			l);
	});
var $author$project$Pages$Sort$Algorithms$SelectionSort$selectionSortStepsAux = F4(
	function (l, index, orderedList, steps) {
		selectionSortStepsAux:
		while (true) {
			if (!l.b) {
				return _Utils_Tuple2(orderedList, steps);
			} else {
				var a = l.a;
				var r = l.b;
				var addI = $elm$core$Basics$add(index);
				var _v1 = A4(
					$author$project$Pages$Sort$Algorithms$SelectionSort$getMinAndPositionSteps,
					l,
					0,
					_Utils_Tuple2(0, a),
					_List_Nil);
				var minPosition = _v1.a;
				var minValue = _v1.b;
				var minSteps = _v1.c;
				var changedSubList = A3($author$project$Pages$Sort$Algorithms$SelectionSort$insertList, r, minPosition - 1, a);
				var newMinSteps = A2(
					$elm$core$List$map,
					function (p) {
						return A3($elm$core$Tuple$mapBoth, addI, addI, p);
					},
					$elm$core$List$reverse(minSteps));
				var newSteps = A2(
					$elm$core$List$cons,
					_Utils_Tuple2(
						_Utils_ap(orderedList, l),
						newMinSteps),
					steps);
				var $temp$l = changedSubList,
					$temp$index = index + 1,
					$temp$orderedList = _Utils_ap(
					orderedList,
					_List_fromArray(
						[minValue])),
					$temp$steps = newSteps;
				l = $temp$l;
				index = $temp$index;
				orderedList = $temp$orderedList;
				steps = $temp$steps;
				continue selectionSortStepsAux;
			}
		}
	});
var $author$project$Pages$Sort$Algorithms$SelectionSort$selectionSortSteps = function (l) {
	var _v0 = A2(
		$elm$core$Tuple$mapSecond,
		$elm$core$List$reverse,
		A4($author$project$Pages$Sort$Algorithms$SelectionSort$selectionSortStepsAux, l, 0, _List_Nil, _List_Nil));
	var sortedList = _v0.a;
	var allSteps = _v0.b;
	var leftRightSequence = $elm$core$List$concat(
		A2(
			$elm$core$List$map,
			function (_v2) {
				var lr = _v2.b;
				return lr;
			},
			allSteps));
	var steps = $elm$core$List$concat(
		A2(
			$elm$core$List$map,
			function (_v1) {
				var st = _v1.a;
				var lr = _v1.b;
				return A2(
					$elm$core$List$repeat,
					$elm$core$List$length(lr),
					st);
			},
			allSteps));
	return _Utils_Tuple3(sortedList, steps, leftRightSequence);
};
var $author$project$Pages$Sort$Model$BubbleSort = 2;
var $author$project$Pages$Sort$Model$MergeSort = 0;
var $author$project$Pages$Sort$Model$QuickSort = 3;
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Pages$Sort$Algorithms$BubbleSort$bubbleSortAuxSteps = F4(
	function (i, j, ord, l) {
		if (!j) {
			return _Utils_Tuple3(
				l,
				_List_fromArray(
					[
						_Utils_ap(ord, l)
					]),
				_List_fromArray(
					[
						_Utils_Tuple2(i, i)
					]));
		} else {
			if (!l.b) {
				return _Utils_Tuple3(
					_List_Nil,
					_List_Nil,
					_List_fromArray(
						[
							_Utils_Tuple2(i, i)
						]));
			} else {
				if (!l.b.b) {
					var a = l.a;
					return _Utils_Tuple3(
						_List_fromArray(
							[a]),
						_List_fromArray(
							[
								_Utils_ap(
								ord,
								_List_fromArray(
									[a]))
							]),
						_List_fromArray(
							[
								_Utils_Tuple2(i, i + 1)
							]));
				} else {
					var a = l.a;
					var _v1 = l.b;
					var b = _v1.a;
					var r = _v1.b;
					var smaller = A2($elm$core$Basics$min, a, b);
					var bigger = A2($elm$core$Basics$max, a, b);
					var _v2 = A4(
						$author$project$Pages$Sort$Algorithms$BubbleSort$bubbleSortAuxSteps,
						i + 1,
						j - 1,
						_Utils_ap(
							ord,
							_List_fromArray(
								[smaller])),
						A2($elm$core$List$cons, bigger, r));
					var ordered = _v2.a;
					var steps = _v2.b;
					var lr = _v2.c;
					return _Utils_Tuple3(
						A2($elm$core$List$cons, smaller, ordered),
						A2(
							$elm$core$List$cons,
							_Utils_ap(ord, l),
							steps),
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(i, i + 1),
							lr));
				}
			}
		}
	});
var $author$project$Pages$Sort$Algorithms$BubbleSort$bubbleSort = F3(
	function (i, l, _v0) {
		bubbleSort:
		while (true) {
			var steps = _v0.a;
			var leftRight = _v0.b;
			var _v1 = A4($author$project$Pages$Sort$Algorithms$BubbleSort$bubbleSortAuxSteps, 0, i - 1, _List_Nil, l);
			var newlist = _v1.a;
			var st = _v1.b;
			var lr = _v1.c;
			if (_Utils_eq(newlist, l)) {
				return _Utils_Tuple3(l, steps, leftRight);
			} else {
				var $temp$i = i - 1,
					$temp$l = newlist,
					$temp$_v0 = _Utils_Tuple2(
					_Utils_ap(steps, st),
					_Utils_ap(leftRight, lr));
				i = $temp$i;
				l = $temp$l;
				_v0 = $temp$_v0;
				continue bubbleSort;
			}
		}
	});
var $author$project$Pages$Sort$Algorithms$BubbleSort$bubbleSortSteps = function (l) {
	return A3(
		$author$project$Pages$Sort$Algorithms$BubbleSort$bubbleSort,
		$elm$core$List$length(l),
		l,
		_Utils_Tuple2(_List_Nil, _List_Nil));
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Pages$Sort$Algorithms$MergeSort$mergeSteps = F4(
	function (l1, l2, i1, i2) {
		var _v0 = _Utils_Tuple2(l1, l2);
		if (!_v0.a.b) {
			return _Utils_Tuple3(
				l2,
				_List_fromArray(
					[l2]),
				_List_fromArray(
					[
						_Utils_Tuple2(i1, i2)
					]));
		} else {
			if (!_v0.b.b) {
				return _Utils_Tuple3(
					l1,
					_List_fromArray(
						[l1]),
					_List_fromArray(
						[
							_Utils_Tuple2(i1, i2)
						]));
			} else {
				var _v1 = _v0.a;
				var e1 = _v1.a;
				var r1 = _v1.b;
				var _v2 = _v0.b;
				var e2 = _v2.a;
				var r2 = _v2.b;
				if (_Utils_cmp(e1, e2) < 0) {
					var _v3 = A4(
						$author$project$Pages$Sort$Algorithms$MergeSort$mergeSteps,
						r1,
						A2($elm$core$List$cons, e2, r2),
						i1 + 1,
						i2);
					var l = _v3.a;
					var res = _v3.b;
					var seq = _v3.c;
					return _Utils_Tuple3(
						A2($elm$core$List$cons, e1, l),
						A2(
							$elm$core$List$cons,
							A2(
								$elm$core$List$cons,
								e1,
								_Utils_ap(
									r1,
									A2($elm$core$List$cons, e2, r2))),
							A2(
								$elm$core$List$map,
								function (a) {
									return A2($elm$core$List$cons, e1, a);
								},
								res)),
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(i1, i2),
							seq));
				} else {
					var _v4 = A4(
						$author$project$Pages$Sort$Algorithms$MergeSort$mergeSteps,
						A2($elm$core$List$cons, e1, r1),
						r2,
						i1 + 1,
						i2 + 1);
					var l = _v4.a;
					var res = _v4.b;
					var seq = _v4.c;
					return _Utils_Tuple3(
						A2($elm$core$List$cons, e2, l),
						A2(
							$elm$core$List$cons,
							A2(
								$elm$core$List$cons,
								e2,
								_Utils_ap(
									A2($elm$core$List$cons, e1, r1),
									r2)),
							A2(
								$elm$core$List$map,
								function (a) {
									return A2($elm$core$List$cons, e2, a);
								},
								res)),
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(i1, i2 + 1),
							seq));
				}
			}
		}
	});
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $author$project$Algorithms$MergeSort$split = function (l) {
	var splitAux = F2(
		function (x, y) {
			var _v0 = _Utils_Tuple2(x, y);
			if ((_v0.a.b && _v0.b.b) && _v0.b.b.b) {
				var _v1 = _v0.a;
				var xs = _v1.a;
				var xr = _v1.b;
				var _v2 = _v0.b;
				var _v3 = _v2.b;
				var yr = _v3.b;
				return A2(
					$elm$core$Tuple$mapFirst,
					$elm$core$List$cons(xs),
					A2(splitAux, xr, yr));
			} else {
				var xs = _v0.a;
				return _Utils_Tuple2(_List_Nil, xs);
			}
		});
	return A2(splitAux, l, l);
};
var $author$project$Pages$Sort$Algorithms$MergeSort$mergeSortStepsAux = F2(
	function (i, l) {
		if (!l.b) {
			return _Utils_Tuple3(_List_Nil, _List_Nil, _List_Nil);
		} else {
			if (!l.b.b) {
				var a = l.a;
				return _Utils_Tuple3(
					_List_fromArray(
						[a]),
					_List_Nil,
					_List_Nil);
			} else {
				var _v1 = $author$project$Algorithms$MergeSort$split(l);
				var left = _v1.a;
				var right = _v1.b;
				var _v2 = _Utils_Tuple2(
					A2($author$project$Pages$Sort$Algorithms$MergeSort$mergeSortStepsAux, i, left),
					A2(
						$author$project$Pages$Sort$Algorithms$MergeSort$mergeSortStepsAux,
						i + $elm$core$List$length(left),
						right));
				var _v3 = _v2.a;
				var sortedLeft = _v3.a;
				var resLeft = _v3.b;
				var sequenceLeft = _v3.c;
				var _v4 = _v2.b;
				var sortedRight = _v4.a;
				var resRight = _v4.b;
				var sequenceRight = _v4.c;
				var _v5 = A4(
					$author$project$Pages$Sort$Algorithms$MergeSort$mergeSteps,
					sortedLeft,
					sortedRight,
					i,
					i + $elm$core$List$length(left));
				var sortedL = _v5.a;
				var res = _v5.b;
				var sequence = _v5.c;
				return _Utils_Tuple3(
					sortedL,
					_Utils_ap(
						A2(
							$elm$core$List$map,
							function (ele) {
								return _Utils_ap(ele, right);
							},
							resLeft),
						_Utils_ap(
							A2(
								$elm$core$List$map,
								function (ele) {
									return _Utils_ap(sortedLeft, ele);
								},
								resRight),
							res)),
					_Utils_ap(
						sequenceLeft,
						_Utils_ap(sequenceRight, sequence)));
			}
		}
	});
var $author$project$Pages$Sort$Algorithms$MergeSort$mergeSortSteps = $author$project$Pages$Sort$Algorithms$MergeSort$mergeSortStepsAux(0);
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$Pages$Sort$Algorithms$QuickSort$swap = F3(
	function (i, j, a) {
		var _v0 = _Utils_Tuple2(
			A2($elm$core$Array$get, i, a),
			A2($elm$core$Array$get, j, a));
		if ((!_v0.a.$) && (!_v0.b.$)) {
			var ii = _v0.a.a;
			var jj = _v0.b.a;
			return A3(
				$elm$core$Array$set,
				j,
				ii,
				A3($elm$core$Array$set, i, jj, a));
		} else {
			return a;
		}
	});
var $author$project$Pages$Sort$Algorithms$QuickSort$movePivotFinal = F2(
	function (l, _default) {
		var _v0 = A2(
			$elm$random$Random$step,
			A2(
				$elm$random$Random$int,
				0,
				$elm$core$List$length(l) - 1),
			$elm$random$Random$initialSeed(0));
		var i = _v0.a;
		var _v1 = A2($elm$core$List$drop, i, l);
		if (_v1.b) {
			var a = _v1.a;
			return _Utils_Tuple2(
				a,
				$elm$core$Array$toList(
					A3(
						$author$project$Pages$Sort$Algorithms$QuickSort$swap,
						i,
						$elm$core$List$length(l) - 1,
						$elm$core$Array$fromList(l))));
		} else {
			return _default;
		}
	});
var $author$project$Pages$Sort$Algorithms$QuickSort$splitSteps = F2(
	function (pivot, l) {
		var listLen = $elm$core$List$length(l);
		var leq = F2(
			function (i, a) {
				return _Utils_cmp(
					A2(
						$elm$core$Maybe$withDefault,
						pivot,
						A2($elm$core$Array$get, i, a)),
					pivot) < 1;
			});
		var lastPos = $elm$core$Basics$sub(listLen - 2);
		var arr = $elm$core$Array$fromList(l);
		var _v0 = A3(
			$elm$core$List$foldl,
			F2(
				function (i, _v2) {
					var _v3 = _v2.a;
					var acc = _v3.a;
					var steps = _v3.b;
					var lr = _v3.c;
					var j = _v2.b;
					return A2(leq, i - j, acc) ? _Utils_Tuple2(
						_Utils_Tuple3(
							acc,
							_Utils_ap(
								steps,
								_List_fromArray(
									[acc])),
							_Utils_ap(
								lr,
								_List_fromArray(
									[
										_Utils_Tuple2(
										i - j,
										lastPos(j))
									]))),
						j) : _Utils_Tuple2(
						_Utils_Tuple3(
							A3(
								$author$project$Pages$Sort$Algorithms$QuickSort$swap,
								i - j,
								lastPos(j),
								acc),
							_Utils_ap(
								steps,
								_List_fromArray(
									[
										A3(
										$author$project$Pages$Sort$Algorithms$QuickSort$swap,
										i - j,
										lastPos(j),
										acc)
									])),
							_Utils_ap(
								lr,
								_List_fromArray(
									[
										_Utils_Tuple2(
										i - j,
										lastPos(j))
									]))),
						j + 1);
				}),
			_Utils_Tuple2(
				_Utils_Tuple3(arr, _List_Nil, _List_Nil),
				0),
			A2($elm$core$List$range, 0, listLen - 2));
		var _v1 = _v0.a;
		var resA = _v1.a;
		var resSteps = _v1.b;
		var resLeftRight = _v1.c;
		var resI = _v0.b;
		var lastStep = A3($author$project$Pages$Sort$Algorithms$QuickSort$swap, (listLen - resI) - 1, listLen - 1, resA);
		return _Utils_Tuple3(
			$elm$core$Array$toList(lastStep),
			A2(
				$elm$core$List$map,
				$elm$core$Array$toList,
				_Utils_ap(
					resSteps,
					_List_fromArray(
						[lastStep]))),
			_Utils_ap(
				resLeftRight,
				_List_fromArray(
					[
						_Utils_Tuple2((listLen - resI) - 1, (listLen - resI) - 1)
					])));
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Pages$Sort$Algorithms$QuickSort$quickSort = function (l) {
	if (!l.b) {
		return _Utils_Tuple3(_List_Nil, _List_Nil, _List_Nil);
	} else {
		if (!l.b.b) {
			var a = l.a;
			return _Utils_Tuple3(
				_List_fromArray(
					[a]),
				_List_Nil,
				_List_Nil);
		} else {
			var a = l.a;
			var r = l.b;
			var _v1 = A2(
				$author$project$Pages$Sort$Algorithms$QuickSort$movePivotFinal,
				l,
				_Utils_Tuple2(
					a,
					_Utils_ap(
						r,
						_List_fromArray(
							[a]))));
			var pivot = _v1.a;
			var newL = _v1.b;
			var pivotIndex = $elm$core$List$length(
				A2(
					$elm$core$List$filter,
					function (x) {
						return _Utils_cmp(x, pivot) < 1;
					},
					newL)) - 1;
			var _v2 = A2($author$project$Pages$Sort$Algorithms$QuickSort$splitSteps, pivot, newL);
			var semiOrdered = _v2.a;
			var steps = _v2.b;
			var leftRight = _v2.c;
			var _v3 = $author$project$Pages$Sort$Algorithms$QuickSort$quickSort(
				A2($elm$core$List$drop, pivotIndex + 1, semiOrdered));
			var right = _v3.a;
			var rightSteps = _v3.b;
			var rightLr = _v3.c;
			var semiOrderedRight = A2($elm$core$List$drop, pivotIndex + 1, semiOrdered);
			var _v4 = $author$project$Pages$Sort$Algorithms$QuickSort$quickSort(
				A2($elm$core$List$take, pivotIndex, semiOrdered));
			var left = _v4.a;
			var leftSteps = _v4.b;
			var leftLr = _v4.c;
			return _Utils_Tuple3(
				_Utils_ap(
					left,
					A2($elm$core$List$cons, pivot, right)),
				_Utils_ap(
					steps,
					_Utils_ap(
						A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_ap(
									x,
									A2($elm$core$List$cons, pivot, semiOrderedRight));
							},
							leftSteps),
						A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_ap(
									left,
									A2($elm$core$List$cons, pivot, x));
							},
							rightSteps))),
				_Utils_ap(
					leftRight,
					_Utils_ap(
						leftLr,
						A2(
							$elm$core$List$map,
							function (p) {
								return A3(
									$elm$core$Tuple$mapBoth,
									$elm$core$Basics$add(pivotIndex),
									$elm$core$Basics$add(pivotIndex),
									p);
							},
							rightLr))));
		}
	}
};
var $author$project$Pages$Sort$Algorithms$QuickSort$quickSortSteps = $author$project$Pages$Sort$Algorithms$QuickSort$quickSort;
var $author$project$Pages$Sort$Model$sortInfos = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'SelectionSort',
			A5($author$project$Pages$Sort$Model$SortInfo, 1, 'SelectionSort', 'src/Algorithms/SelectionSort.elm', 64, $author$project$Pages$Sort$Algorithms$SelectionSort$selectionSortSteps)),
			_Utils_Tuple2(
			'MergeSort',
			A5($author$project$Pages$Sort$Model$SortInfo, 0, 'MergeSort', 'src/Algorithms/MergeSort.elm', 256, $author$project$Pages$Sort$Algorithms$MergeSort$mergeSortSteps)),
			_Utils_Tuple2(
			'QuickSort',
			A5($author$project$Pages$Sort$Model$SortInfo, 3, 'QuickSort', 'src/Algorithms/QuickSort.elm', 256, $author$project$Pages$Sort$Algorithms$QuickSort$quickSortSteps)),
			_Utils_Tuple2(
			'BubbleSort',
			A5($author$project$Pages$Sort$Model$SortInfo, 2, 'BubbleSort', 'src/Algorithms/BubbleSort.elm', 64, $author$project$Pages$Sort$Algorithms$BubbleSort$bubbleSortSteps))
		]));
var $author$project$Pages$Sort$Model$getSortInfo = function (sortName) {
	return A2(
		$elm$core$Maybe$withDefault,
		A5($author$project$Pages$Sort$Model$SortInfo, 1, 'SelectionSort', 'src/Algorithms/SelectionSort.elm', 64, $author$project$Pages$Sort$Algorithms$SelectionSort$selectionSortSteps),
		A2($elm$core$Dict$get, sortName, $author$project$Pages$Sort$Model$sortInfos));
};
var $author$project$Pages$Sort$Model$initModel = function (sortType) {
	var sortInfo = $author$project$Pages$Sort$Model$getSortInfo(sortType);
	return {
		bE: '',
		bF: 0,
		bH: 0,
		bI: $elm$core$Array$empty,
		bZ: 0,
		b4: $elm$core$Array$empty,
		b5: sortInfo.aZ,
		b6: A2($elm$core$List$range, 0, sortInfo.aZ - 1),
		cc: $elm$core$Array$fromList(
			A2($elm$core$List$range, 0, sortInfo.aZ - 1)),
		cd: true,
		cr: $elm$random$Random$initialSeed(1),
		cw: sortInfo,
		cx: $elm$core$Array$empty,
		ac: 512
	};
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Update$changeRouteTo = F2(
	function (url, model) {
		if (!url.$) {
			switch (url.a.$) {
				case 0:
					var _v1 = url.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bG: $author$project$Model$HomeModel}),
						$elm$core$Platform$Cmd$none);
				case 1:
					var sortAlgorithmName = url.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bG: $author$project$Model$SortAlgorithmsModel(
									$author$project$Pages$Sort$Model$initModel(sortAlgorithmName))
							}),
						$elm$core$Platform$Cmd$batch(
							_Utils_ap(
								A2(
									$elm$core$List$map,
									function (s) {
										return A2(
											$elm$core$Platform$Cmd$map,
											$author$project$Update$SubPageMsg,
											A2($elm$core$Platform$Cmd$map, $author$project$Update$SortMsg, s));
									},
									_List_fromArray(
										[
											A2(
											$elm$random$Random$generate,
											$author$project$Pages$Sort$Update$NewSeedStart,
											A2($elm$random$Random$int, 1, 1000000))
										])),
								_List_fromArray(
									[
										$author$project$Update$getCanvasWidth(0)
									]))));
				case 2:
					var graphAlgorithmName = url.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bG: $author$project$Model$GraphAlgorithmModel($author$project$Pages$Graph$Model$initModel)
							}),
						$elm$core$Platform$Cmd$batch(
							_Utils_ap(
								A2(
									$elm$core$List$map,
									function (s) {
										return A2(
											$elm$core$Platform$Cmd$map,
											$author$project$Update$SubPageMsg,
											A2($elm$core$Platform$Cmd$map, $author$project$Update$GraphMsg, s));
									},
									_List_Nil),
								_List_fromArray(
									[
										$author$project$Update$getCanvasWidth(0)
									]))));
				default:
					var mazeAlgorithmName = url.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bG: $author$project$Model$MazeAlgorithmModel($author$project$Pages$Maze$Model$initModel)
							}),
						$elm$core$Platform$Cmd$batch(
							_Utils_ap(
								A2(
									$elm$core$List$map,
									function (s) {
										return A2(
											$elm$core$Platform$Cmd$map,
											$author$project$Update$SubPageMsg,
											A2($elm$core$Platform$Cmd$map, $author$project$Update$MazeMsg, s));
									},
									_List_Nil),
								_List_fromArray(
									[
										$author$project$Update$getCanvasWidth(0)
									]))));
			}
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {V: frag, Y: params, S: unvisited, a: value, ab: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.S;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.a);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.a);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.dq),
					$elm$url$Url$Parser$prepareQuery(url.cj),
					url.bT,
					$elm$core$Basics$identity)));
	});
var $author$project$Route$GraphAlgorithmsPage = function (a) {
	return {$: 2, a: a};
};
var $author$project$Route$Home = {$: 0};
var $author$project$Route$MazeAlgorithmsPage = function (a) {
	return {$: 3, a: a};
};
var $author$project$Route$SortAlgorithmsPage = function (a) {
	return {$: 1, a: a};
};
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.ab;
		var unvisited = _v0.S;
		var params = _v0.Y;
		var frag = _v0.V;
		var value = _v0.a;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0;
		return function (_v1) {
			var visited = _v1.ab;
			var unvisited = _v1.S;
			var params = _v1.Y;
			var frag = _v1.V;
			var value = _v1.a;
			return A2(
				$elm$core$List$map,
				$elm$url$Url$Parser$mapState(value),
				parseArg(
					A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var parser = _v0;
				return parser(state);
			},
			parsers);
	};
};
var $elm$url$Url$Parser$s = function (str) {
	return function (_v0) {
		var visited = _v0.ab;
		var unvisited = _v0.S;
		var params = _v0.Y;
		var frag = _v0.V;
		var value = _v0.a;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					A2($elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var $elm$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0;
		var parseAfter = _v1;
		return function (state) {
			return A2(
				$elm$core$List$concatMap,
				parseAfter,
				parseBefore(state));
		};
	});
var $elm$url$Url$Parser$custom = F2(
	function (tipe, stringToSomething) {
		return function (_v0) {
			var visited = _v0.ab;
			var unvisited = _v0.S;
			var params = _v0.Y;
			var frag = _v0.V;
			var value = _v0.a;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				var _v2 = stringToSomething(next);
				if (!_v2.$) {
					var nextValue = _v2.a;
					return _List_fromArray(
						[
							A5(
							$elm$url$Url$Parser$State,
							A2($elm$core$List$cons, next, visited),
							rest,
							params,
							frag,
							value(nextValue))
						]);
				} else {
					return _List_Nil;
				}
			}
		};
	});
var $elm$url$Url$Parser$string = A2($elm$url$Url$Parser$custom, 'STRING', $elm$core$Maybe$Just);
var $elm$url$Url$Parser$top = function (state) {
	return _List_fromArray(
		[state]);
};
var $author$project$Route$parser = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2($elm$url$Url$Parser$map, $author$project$Route$Home, $elm$url$Url$Parser$top),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$SortAlgorithmsPage,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('sortAlgorithms'),
				$elm$url$Url$Parser$string)),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$GraphAlgorithmsPage,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('graphAlgorithms'),
				$elm$url$Url$Parser$string)),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$MazeAlgorithmsPage,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('mazeAlgorithms'),
				$elm$url$Url$Parser$string))
		]));
var $author$project$Route$fromUrl = function (url) {
	return A2(
		$elm$url$Url$Parser$parse,
		$author$project$Route$parser,
		_Utils_update(
			url,
			{
				bT: $elm$core$Maybe$Nothing,
				dq: A2($elm$core$Maybe$withDefault, '', url.bT)
			}));
};
var $author$project$Model$initModel = F2(
	function (url, key) {
		return {bG: $author$project$Model$HomeModel, b1: key, cI: url};
	});
var $author$project$Update$init = F3(
	function (_v0, url, key) {
		return A2(
			$author$project$Update$changeRouteTo,
			$author$project$Route$fromUrl(url),
			A2($author$project$Model$initModel, url, key));
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Pages$Graph$Update$Tick = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {ch: processes, cB: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.ch;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.cB);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $author$project$Pages$Graph$Subscriptions$subscriptions = function (model) {
	return $elm$core$List$isEmpty(model.bs) ? $elm$core$Platform$Sub$none : $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2($elm$time$Time$every, 25, $author$project$Pages$Graph$Update$Tick)
			]));
};
var $author$project$Pages$Maze$Update$Tick = function (a) {
	return {$: 1, a: a};
};
var $author$project$Pages$Maze$Subscriptions$subscriptions = function (model) {
	return $elm$core$List$isEmpty(model.cE) ? $elm$core$Platform$Sub$none : $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2($elm$time$Time$every, 1, $author$project$Pages$Maze$Update$Tick)
			]));
};
var $author$project$Pages$Sort$Update$Tick = function (a) {
	return {$: 6, a: a};
};
var $author$project$Pages$Sort$Subscriptions$subscriptions = function (model) {
	return model.cd ? $elm$core$Platform$Sub$none : $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2($elm$time$Time$every, 1, $author$project$Pages$Sort$Update$Tick)
			]));
};
var $author$project$Subscriptions$subscriptions = function (model) {
	var _v0 = model.bG;
	switch (_v0.$) {
		case 0:
			var subModel = _v0.a;
			return $elm$core$Platform$Sub$batch(
				A2(
					$elm$core$List$map,
					function (s) {
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Update$SubPageMsg,
							A2($elm$core$Platform$Sub$map, $author$project$Update$SortMsg, s));
					},
					_List_fromArray(
						[
							$author$project$Pages$Sort$Subscriptions$subscriptions(subModel)
						])));
		case 1:
			var subModel = _v0.a;
			return $elm$core$Platform$Sub$batch(
				A2(
					$elm$core$List$map,
					function (s) {
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Update$SubPageMsg,
							A2($elm$core$Platform$Sub$map, $author$project$Update$GraphMsg, s));
					},
					_List_fromArray(
						[
							$author$project$Pages$Graph$Subscriptions$subscriptions(subModel)
						])));
		case 2:
			var subModel = _v0.a;
			return $elm$core$Platform$Sub$batch(
				A2(
					$elm$core$List$map,
					function (s) {
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Update$SubPageMsg,
							A2($elm$core$Platform$Sub$map, $author$project$Update$MazeMsg, s));
					},
					_List_fromArray(
						[
							$author$project$Pages$Maze$Subscriptions$subscriptions(subModel)
						])));
		default:
			return $elm$core$Platform$Sub$none;
	}
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.ci;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.bT,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.cj,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.cf,
					_Utils_ap(http, url.bX)),
				url.dq)));
};
var $author$project$Pages$Graph$Update$setVisited = F2(
	function (edge, l) {
		var dictSetValue = function (key) {
			return A2(
				$elm$core$Dict$update,
				key,
				function (v) {
					if (!v.$) {
						var vv = v.a;
						return $elm$core$Maybe$Just(vv + 1);
					} else {
						return $elm$core$Maybe$Just(0);
					}
				});
		};
		return A2(
			dictSetValue,
			_Utils_Tuple2(
				_Utils_Tuple2(edge.av.o, edge.av.p),
				_Utils_Tuple2(edge.ak.o, edge.ak.p)),
			A2(
				dictSetValue,
				_Utils_Tuple2(
					_Utils_Tuple2(edge.ak.o, edge.ak.p),
					_Utils_Tuple2(edge.av.o, edge.av.p)),
				l));
	});
var $author$project$Pages$Graph$Update$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var _v1 = function () {
					var _v2 = model.bs;
					if (!_v2.b) {
						return _Utils_Tuple3(model.bN, model.bs, model.bM);
					} else {
						var a = _v2.a;
						var r = _v2.b;
						return _Utils_Tuple3(
							_Utils_ap(
								model.bN,
								_List_fromArray(
									[a])),
							r,
							A2($author$project$Pages$Graph$Update$setVisited, a, model.bM));
					}
				}();
				var newDrawedSteps = _v1.a;
				var newAllSteps = _v1.b;
				var newDrawed = _v1.c;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bs: newAllSteps, bM: newDrawed, bN: newDrawedSteps, bZ: model.bZ + 1}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var position = msg.a;
				var _v3 = model.cs ? _Utils_Tuple2(position, model.bR) : _Utils_Tuple2(model.bx, position);
				var newBeginPosition = _v3.a;
				var newEndPosition = _v3.b;
				var _v4 = A3(
					$author$project$Algorithms$Graphs$MazeGenerator$dfs,
					newBeginPosition,
					newEndPosition,
					$author$project$Algorithms$Graphs$MazeGenerator$pathToEdgesPerNode(model.b7));
				var beginEndPath = _v4.a;
				var allSteps = _v4.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bs: allSteps, bw: beginEndPath, bx: newBeginPosition, bM: $elm$core$Dict$empty, bN: _List_Nil, bR: newEndPosition, bZ: 0, cs: !model.cs}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Maze$Update$update = F2(
	function (msg, model) {
		if (msg.$ === 1) {
			var _v1 = function () {
				var _v2 = model.cE;
				if (!_v2.b) {
					return _Utils_Tuple2(model.bN, model.cE);
				} else {
					var a = _v2.a;
					var r = _v2.b;
					return _Utils_Tuple2(
						_Utils_ap(
							model.bN,
							_List_fromArray(
								[a])),
						r);
				}
			}();
			var newDrawedSteps = _v1.a;
			var newToDrawPath = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{bN: newDrawedSteps, bZ: model.bZ + 1, cE: newToDrawPath}),
				$elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Sort$Update$Shuffle = {$: 0};
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $author$project$Pages$Sort$Update$beep = _Platform_outgoingPort(
	'beep',
	function ($) {
		var a = $.a;
		var b = $.b;
		return A2(
			$elm$json$Json$Encode$list,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$elm$json$Json$Encode$int(a),
					$elm$json$Json$Encode$int(b)
				]));
	});
var $author$project$Pages$Sort$Update$getSoundFreq = function (model) {
	return 5 * A2(
		$elm$core$Maybe$withDefault,
		0,
		A2($elm$core$Array$get, model.bF, model.bI));
};
var $author$project$Pages$Sort$Update$GotText = function (a) {
	return {$: 8, a: a};
};
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 4, a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 0:
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 1:
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 2:
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 3:
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.dA));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectString = function (toMsg) {
	return A2(
		$elm$http$Http$expectStringResponse,
		toMsg,
		$elm$http$Http$resolve($elm$core$Result$Ok));
};
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {cl: reqs, cA: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.cF;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.cl));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.cA)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					cN: r.cN,
					cQ: r.cQ,
					c$: A2(_Http_mapExpect, func, r.c$),
					bW: r.bW,
					da: r.da,
					dG: r.dG,
					cF: r.cF,
					cI: r.cI
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{cN: false, cQ: r.cQ, c$: r.c$, bW: r.bW, da: r.da, dG: r.dG, cF: r.cF, cI: r.cI}));
};
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{cQ: $elm$http$Http$emptyBody, c$: r.c$, bW: _List_Nil, da: 'GET', dG: $elm$core$Maybe$Nothing, cF: $elm$core$Maybe$Nothing, cI: r.cI});
};
var $author$project$Pages$Sort$Update$getSourceCode = function (sortInfo) {
	return $elm$http$Http$get(
		{
			c$: $elm$http$Http$expectString($author$project$Pages$Sort$Update$GotText),
			cI: sortInfo.cU
		});
};
var $author$project$Pages$Sort$Update$highlight = _Platform_outgoingPort(
	'highlight',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Pages$Sort$Update$shuffle = F2(
	function (l, seed) {
		return A2(
			$elm$random$Random$step,
			$elm_community$random_extra$Random$List$shuffle(l),
			seed);
	});
var $author$project$Pages$Sort$Update$tooltip = _Platform_outgoingPort(
	'tooltip',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Pages$Sort$Update$getListParameters = F2(
	function (model, l) {
		var _v0 = model.cw.dC(l);
		var steps = _v0.b;
		var leftRightSequence = _v0.c;
		var leftRightSequenceArray = $elm$core$Array$fromList(leftRightSequence);
		var stepsArray = $elm$core$Array$fromList(
			A2(
				$elm$core$List$map,
				function (x) {
					return $elm$core$Array$fromList(x);
				},
				steps));
		return _Utils_Tuple2(stepsArray, leftRightSequenceArray);
	});
var $author$project$Pages$Sort$Update$updateIndex = F2(
	function (model, index) {
		var newIndex = (_Utils_cmp(index, model.bZ) > 0) ? A2(
			$elm$core$Basics$min,
			$elm$core$Array$length(model.cx),
			index) : A2($elm$core$Basics$max, 0, index);
		var newPause = model.cd || _Utils_eq(
			newIndex,
			$elm$core$Array$length(model.cx));
		var _v0 = $elm$core$Array$isEmpty(model.cx) ? A2($author$project$Pages$Sort$Update$getListParameters, model, model.b6) : _Utils_Tuple2(model.cx, model.b4);
		var steps = _v0.a;
		var leftRightSequence = _v0.b;
		var _v1 = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(model.bF, model.bH),
			A2($elm$core$Array$get, newIndex, leftRightSequence));
		var newLeft = _v1.a;
		var newRight = _v1.b;
		var newCurr = A2(
			$elm$core$Maybe$withDefault,
			model.bI,
			A2($elm$core$Array$get, newIndex, steps));
		return _Utils_update(
			model,
			{bF: newLeft, bH: newRight, bI: newCurr, bZ: newIndex, b4: leftRightSequence, cd: newPause, cx: steps});
	});
var $author$project$Pages$Sort$Update$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var _v1 = A2($author$project$Pages$Sort$Update$shuffle, model.b6, model.cr);
				var newListToBeSorted = _v1.a;
				var newSeed = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bZ: 0, b6: newListToBeSorted, cd: true, cr: newSeed, cx: $elm$core$Array$empty}),
					$elm$core$Platform$Cmd$none);
			case 5:
				var newLength = msg.a;
				var newListLength = A2(
					$elm$core$Maybe$withDefault,
					0,
					$elm$core$String$toInt(newLength));
				var _v2 = A2(
					$author$project$Pages$Sort$Update$shuffle,
					A2($elm$core$List$range, 0, newListLength - 1),
					model.cr);
				var newListToBeSorted = _v2.a;
				var newSeed = _v2.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bZ: 0, b5: newListLength, b6: newListToBeSorted, cd: true, cr: newSeed, cx: $elm$core$Array$empty}),
					$elm$core$Platform$Cmd$none);
			case 6:
				var newModel = A2($author$project$Pages$Sort$Update$updateIndex, model, model.bZ + 1);
				return _Utils_Tuple2(
					newModel,
					$author$project$Pages$Sort$Update$beep(
						_Utils_Tuple2(
							$author$project$Pages$Sort$Update$getSoundFreq(newModel),
							10)));
			case 1:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cd: true}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var newModel = A2($author$project$Pages$Sort$Update$updateIndex, model, model.bZ);
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{cd: false}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var newModel = A2($author$project$Pages$Sort$Update$updateIndex, model, model.bZ - 1);
				return _Utils_Tuple2(
					newModel,
					$author$project$Pages$Sort$Update$beep(
						_Utils_Tuple2(
							$author$project$Pages$Sort$Update$getSoundFreq(newModel),
							10)));
			case 4:
				var newModel = A2($author$project$Pages$Sort$Update$updateIndex, model, model.bZ + 1);
				return _Utils_Tuple2(
					newModel,
					$author$project$Pages$Sort$Update$beep(
						_Utils_Tuple2(
							$author$project$Pages$Sort$Update$getSoundFreq(newModel),
							10)));
			case 8:
				var result = msg.a;
				if (!result.$) {
					var code = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bE: code}),
						$author$project$Pages$Sort$Update$highlight(0));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bE: 'Error'}),
						$elm$core$Platform$Cmd$none);
				}
			default:
				var newSeed = msg.a;
				var _v4 = A2(
					$author$project$Pages$Sort$Update$update,
					$author$project$Pages$Sort$Update$Shuffle,
					_Utils_update(
						model,
						{
							cr: $elm$random$Random$initialSeed(newSeed)
						}));
				var newModel = _v4.a;
				var cmd = _v4.b;
				return _Utils_Tuple2(
					newModel,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								cmd,
								$author$project$Pages$Sort$Update$getSourceCode(model.cw),
								$author$project$Pages$Sort$Update$tooltip(0)
							])));
		}
	});
var $author$project$Update$update = F2(
	function (msg, model) {
		var _v0 = _Utils_Tuple2(msg, model);
		switch (_v0.a.$) {
			case 1:
				var url = _v0.a.a;
				return _Utils_eq(url, model.cI) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : A2(
					$author$project$Update$changeRouteTo,
					$author$project$Route$fromUrl(url),
					_Utils_update(
						model,
						{cI: url}));
			case 0:
				var urlRequest = _v0.a.a;
				if (!urlRequest.$) {
					var url = urlRequest.a;
					return _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							model.b1,
							$elm$url$Url$toString(url)));
				} else {
					var href = urlRequest.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(href));
				}
			default:
				var subPageMsg = _v0.a.a;
				var _v2 = _Utils_Tuple2(subPageMsg, model.bG);
				_v2$3:
				while (true) {
					switch (_v2.a.$) {
						case 0:
							if (!_v2.b.$) {
								var algortihmMsg = _v2.a.a;
								var subModel = _v2.b.a;
								var _v3 = A2($author$project$Pages$Sort$Update$update, algortihmMsg, subModel);
								var newModel = _v3.a;
								var subCmd = _v3.b;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											bG: $author$project$Model$SortAlgorithmsModel(newModel)
										}),
									A2(
										$elm$core$Platform$Cmd$map,
										$author$project$Update$SubPageMsg,
										A2($elm$core$Platform$Cmd$map, $author$project$Update$SortMsg, subCmd)));
							} else {
								break _v2$3;
							}
						case 1:
							if (_v2.b.$ === 1) {
								var algortihmMsg = _v2.a.a;
								var subModel = _v2.b.a;
								var _v4 = A2($author$project$Pages$Graph$Update$update, algortihmMsg, subModel);
								var newModel = _v4.a;
								var subCmd = _v4.b;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											bG: $author$project$Model$GraphAlgorithmModel(newModel)
										}),
									A2(
										$elm$core$Platform$Cmd$map,
										$author$project$Update$SubPageMsg,
										A2($elm$core$Platform$Cmd$map, $author$project$Update$GraphMsg, subCmd)));
							} else {
								break _v2$3;
							}
						default:
							if (_v2.b.$ === 2) {
								var algortihmMsg = _v2.a.a;
								var subModel = _v2.b.a;
								var _v5 = A2($author$project$Pages$Maze$Update$update, algortihmMsg, subModel);
								var newModel = _v5.a;
								var subCmd = _v5.b;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											bG: $author$project$Model$MazeAlgorithmModel(newModel)
										}),
									A2(
										$elm$core$Platform$Cmd$map,
										$author$project$Update$SubPageMsg,
										A2($elm$core$Platform$Cmd$map, $author$project$Update$MazeMsg, subCmd)));
							} else {
								break _v2$3;
							}
					}
				}
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$VirtualDom$Styled$Attribute = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $author$project$VirtualDom$Styled$property = F2(
	function (key, value) {
		return A3(
			$author$project$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$property, key, value),
			_List_Nil,
			'');
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Html$Styled$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			$author$project$VirtualDom$Styled$property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $author$project$Html$Styled$Attributes$class = $author$project$Html$Styled$Attributes$stringProperty('className');
var $author$project$Css$Structure$UniversalSelectorSequence = function (a) {
	return {$: 1, a: a};
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Css$Structure$compactHelp = F2(
	function (declaration, _v0) {
		var keyframesByName = _v0.a;
		var declarations = _v0.b;
		switch (declaration.$) {
			case 0:
				var _v2 = declaration.a;
				var properties = _v2.c;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 1:
				var styleBlocks = declaration.b;
				return A2(
					$elm$core$List$all,
					function (_v3) {
						var properties = _v3.c;
						return $elm$core$List$isEmpty(properties);
					},
					styleBlocks) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 2:
				var otherDeclarations = declaration.b;
				return $elm$core$List$isEmpty(otherDeclarations) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 3:
				return _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 4:
				var properties = declaration.b;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 5:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 6:
				var record = declaration.a;
				return $elm$core$String$isEmpty(record.cV) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					A3($elm$core$Dict$insert, record.dd, record.cV, keyframesByName),
					declarations);
			case 7:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 8:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			default:
				var tuples = declaration.a;
				return A2(
					$elm$core$List$all,
					function (_v4) {
						var properties = _v4.b;
						return $elm$core$List$isEmpty(properties);
					},
					tuples) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
		}
	});
var $author$project$Css$Structure$Keyframes = function (a) {
	return {$: 6, a: a};
};
var $author$project$Css$Structure$withKeyframeDeclarations = F2(
	function (keyframesByName, compactedDeclarations) {
		return A2(
			$elm$core$List$append,
			A2(
				$elm$core$List$map,
				function (_v0) {
					var name = _v0.a;
					var decl = _v0.b;
					return $author$project$Css$Structure$Keyframes(
						{cV: decl, dd: name});
				},
				$elm$core$Dict$toList(keyframesByName)),
			compactedDeclarations);
	});
var $author$project$Css$Structure$compactStylesheet = function (_v0) {
	var charset = _v0.bD;
	var imports = _v0.bY;
	var namespaces = _v0.b9;
	var declarations = _v0.cW;
	var _v1 = A3(
		$elm$core$List$foldr,
		$author$project$Css$Structure$compactHelp,
		_Utils_Tuple2($elm$core$Dict$empty, _List_Nil),
		declarations);
	var keyframesByName = _v1.a;
	var compactedDeclarations = _v1.b;
	var finalDeclarations = A2($author$project$Css$Structure$withKeyframeDeclarations, keyframesByName, compactedDeclarations);
	return {bD: charset, cW: finalDeclarations, bY: imports, b9: namespaces};
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Css$Structure$Output$charsetToString = function (charset) {
	return A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			function (str) {
				return '@charset \"' + (str + '\"');
			},
			charset));
};
var $author$project$Css$Structure$Output$mediaExpressionToString = function (expression) {
	return '(' + (expression.c4 + (A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			$elm$core$Basics$append(': '),
			expression.a)) + ')'));
};
var $author$project$Css$Structure$Output$mediaTypeToString = function (mediaType) {
	switch (mediaType) {
		case 0:
			return 'print';
		case 1:
			return 'screen';
		default:
			return 'speech';
	}
};
var $author$project$Css$Structure$Output$mediaQueryToString = function (mediaQuery) {
	var prefixWith = F3(
		function (str, mediaType, expressions) {
			return str + (' ' + A2(
				$elm$core$String$join,
				' and ',
				A2(
					$elm$core$List$cons,
					$author$project$Css$Structure$Output$mediaTypeToString(mediaType),
					A2($elm$core$List$map, $author$project$Css$Structure$Output$mediaExpressionToString, expressions))));
		});
	switch (mediaQuery.$) {
		case 0:
			var expressions = mediaQuery.a;
			return A2(
				$elm$core$String$join,
				' and ',
				A2($elm$core$List$map, $author$project$Css$Structure$Output$mediaExpressionToString, expressions));
		case 1:
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'only', mediaType, expressions);
		case 2:
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'not', mediaType, expressions);
		default:
			var str = mediaQuery.a;
			return str;
	}
};
var $author$project$Css$Structure$Output$importMediaQueryToString = F2(
	function (name, mediaQuery) {
		return '@import \"' + (name + ($author$project$Css$Structure$Output$mediaQueryToString(mediaQuery) + '\"'));
	});
var $author$project$Css$Structure$Output$importToString = function (_v0) {
	var name = _v0.a;
	var mediaQueries = _v0.b;
	return A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			$author$project$Css$Structure$Output$importMediaQueryToString(name),
			mediaQueries));
};
var $author$project$Css$Structure$Output$namespaceToString = function (_v0) {
	var prefix = _v0.a;
	var str = _v0.b;
	return '@namespace ' + (prefix + ('\"' + (str + '\"')));
};
var $author$project$Css$Structure$Output$spaceIndent = '    ';
var $author$project$Css$Structure$Output$indent = function (str) {
	return _Utils_ap($author$project$Css$Structure$Output$spaceIndent, str);
};
var $author$project$Css$Structure$Output$noIndent = '';
var $author$project$Css$Structure$Output$emitProperty = function (str) {
	return str + ';';
};
var $author$project$Css$Structure$Output$emitProperties = function (properties) {
	return A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			A2($elm$core$Basics$composeL, $author$project$Css$Structure$Output$indent, $author$project$Css$Structure$Output$emitProperty),
			properties));
};
var $elm$core$String$append = _String_append;
var $author$project$Css$Structure$Output$pseudoElementToString = function (_v0) {
	var str = _v0;
	return '::' + str;
};
var $author$project$Css$Structure$Output$combinatorToString = function (combinator) {
	switch (combinator) {
		case 0:
			return '+';
		case 1:
			return '~';
		case 2:
			return '>';
		default:
			return '';
	}
};
var $author$project$Css$Structure$Output$repeatableSimpleSelectorToString = function (repeatableSimpleSelector) {
	switch (repeatableSimpleSelector.$) {
		case 0:
			var str = repeatableSimpleSelector.a;
			return '.' + str;
		case 1:
			var str = repeatableSimpleSelector.a;
			return '#' + str;
		case 2:
			var str = repeatableSimpleSelector.a;
			return ':' + str;
		default:
			var str = repeatableSimpleSelector.a;
			return '[' + (str + ']');
	}
};
var $author$project$Css$Structure$Output$simpleSelectorSequenceToString = function (simpleSelectorSequence) {
	switch (simpleSelectorSequence.$) {
		case 0:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $author$project$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
		case 1:
			var repeatableSimpleSelectors = simpleSelectorSequence.a;
			return $elm$core$List$isEmpty(repeatableSimpleSelectors) ? '*' : A2(
				$elm$core$String$join,
				'',
				A2($elm$core$List$map, $author$project$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors));
		default:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $author$project$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
	}
};
var $author$project$Css$Structure$Output$selectorChainToString = function (_v0) {
	var combinator = _v0.a;
	var sequence = _v0.b;
	return A2(
		$elm$core$String$join,
		' ',
		_List_fromArray(
			[
				$author$project$Css$Structure$Output$combinatorToString(combinator),
				$author$project$Css$Structure$Output$simpleSelectorSequenceToString(sequence)
			]));
};
var $author$project$Css$Structure$Output$selectorToString = function (_v0) {
	var simpleSelectorSequence = _v0.a;
	var chain = _v0.b;
	var pseudoElement = _v0.c;
	var segments = A2(
		$elm$core$List$cons,
		$author$project$Css$Structure$Output$simpleSelectorSequenceToString(simpleSelectorSequence),
		A2($elm$core$List$map, $author$project$Css$Structure$Output$selectorChainToString, chain));
	var pseudoElementsString = A2(
		$elm$core$String$join,
		'',
		_List_fromArray(
			[
				A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Maybe$map, $author$project$Css$Structure$Output$pseudoElementToString, pseudoElement))
			]));
	return A2(
		$elm$core$String$append,
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$filter,
				A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
				segments)),
		pseudoElementsString);
};
var $author$project$Css$Structure$Output$prettyPrintStyleBlock = F2(
	function (indentLevel, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		var selectorStr = A2(
			$elm$core$String$join,
			', ',
			A2(
				$elm$core$List$map,
				$author$project$Css$Structure$Output$selectorToString,
				A2($elm$core$List$cons, firstSelector, otherSelectors)));
		return A2(
			$elm$core$String$join,
			'',
			_List_fromArray(
				[
					selectorStr,
					' {\n',
					indentLevel,
					$author$project$Css$Structure$Output$emitProperties(properties),
					'\n',
					indentLevel,
					'}'
				]));
	});
var $author$project$Css$Structure$Output$prettyPrintDeclaration = function (decl) {
	switch (decl.$) {
		case 0:
			var styleBlock = decl.a;
			return A2($author$project$Css$Structure$Output$prettyPrintStyleBlock, $author$project$Css$Structure$Output$noIndent, styleBlock);
		case 1:
			var mediaQueries = decl.a;
			var styleBlocks = decl.b;
			var query = A2(
				$elm$core$String$join,
				',\n',
				A2($elm$core$List$map, $author$project$Css$Structure$Output$mediaQueryToString, mediaQueries));
			var blocks = A2(
				$elm$core$String$join,
				'\n\n',
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeL,
						$author$project$Css$Structure$Output$indent,
						$author$project$Css$Structure$Output$prettyPrintStyleBlock($author$project$Css$Structure$Output$spaceIndent)),
					styleBlocks));
			return '@media ' + (query + (' {\n' + (blocks + '\n}')));
		case 2:
			return 'TODO';
		case 3:
			return 'TODO';
		case 4:
			return 'TODO';
		case 5:
			return 'TODO';
		case 6:
			var name = decl.a.dd;
			var declaration = decl.a.cV;
			return '@keyframes ' + (name + (' {\n' + (declaration + '\n}')));
		case 7:
			return 'TODO';
		case 8:
			return 'TODO';
		default:
			return 'TODO';
	}
};
var $author$project$Css$Structure$Output$prettyPrint = function (_v0) {
	var charset = _v0.bD;
	var imports = _v0.bY;
	var namespaces = _v0.b9;
	var declarations = _v0.cW;
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
			_List_fromArray(
				[
					$author$project$Css$Structure$Output$charsetToString(charset),
					A2(
					$elm$core$String$join,
					'\n',
					A2($elm$core$List$map, $author$project$Css$Structure$Output$importToString, imports)),
					A2(
					$elm$core$String$join,
					'\n',
					A2($elm$core$List$map, $author$project$Css$Structure$Output$namespaceToString, namespaces)),
					A2(
					$elm$core$String$join,
					'\n\n',
					A2($elm$core$List$map, $author$project$Css$Structure$Output$prettyPrintDeclaration, declarations))
				])));
};
var $author$project$Css$Structure$CounterStyle = function (a) {
	return {$: 8, a: a};
};
var $author$project$Css$Structure$FontFace = function (a) {
	return {$: 5, a: a};
};
var $author$project$Css$Structure$PageRule = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Css$Structure$Selector = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$Css$Structure$StyleBlock = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$Css$Structure$StyleBlockDeclaration = function (a) {
	return {$: 0, a: a};
};
var $author$project$Css$Structure$SupportsRule = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Css$Structure$Viewport = function (a) {
	return {$: 7, a: a};
};
var $author$project$Css$Structure$MediaRule = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Css$Structure$mapLast = F2(
	function (update, list) {
		if (!list.b) {
			return list;
		} else {
			if (!list.b.b) {
				var only = list.a;
				return _List_fromArray(
					[
						update(only)
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($author$project$Css$Structure$mapLast, update, rest));
			}
		}
	});
var $author$project$Css$Structure$withPropertyAppended = F2(
	function (property, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		return A3(
			$author$project$Css$Structure$StyleBlock,
			firstSelector,
			otherSelectors,
			_Utils_ap(
				properties,
				_List_fromArray(
					[property])));
	});
var $author$project$Css$Structure$appendProperty = F2(
	function (property, declarations) {
		if (!declarations.b) {
			return declarations;
		} else {
			if (!declarations.b.b) {
				switch (declarations.a.$) {
					case 0:
						var styleBlock = declarations.a.a;
						return _List_fromArray(
							[
								$author$project$Css$Structure$StyleBlockDeclaration(
								A2($author$project$Css$Structure$withPropertyAppended, property, styleBlock))
							]);
					case 1:
						var _v1 = declarations.a;
						var mediaQueries = _v1.a;
						var styleBlocks = _v1.b;
						return _List_fromArray(
							[
								A2(
								$author$project$Css$Structure$MediaRule,
								mediaQueries,
								A2(
									$author$project$Css$Structure$mapLast,
									$author$project$Css$Structure$withPropertyAppended(property),
									styleBlocks))
							]);
					default:
						return declarations;
				}
			} else {
				var first = declarations.a;
				var rest = declarations.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($author$project$Css$Structure$appendProperty, property, rest));
			}
		}
	});
var $author$project$Css$Structure$appendToLastSelector = F2(
	function (f, styleBlock) {
		if (!styleBlock.b.b) {
			var only = styleBlock.a;
			var properties = styleBlock.c;
			return _List_fromArray(
				[
					A3($author$project$Css$Structure$StyleBlock, only, _List_Nil, properties),
					A3(
					$author$project$Css$Structure$StyleBlock,
					f(only),
					_List_Nil,
					_List_Nil)
				]);
		} else {
			var first = styleBlock.a;
			var rest = styleBlock.b;
			var properties = styleBlock.c;
			var newRest = A2($elm$core$List$map, f, rest);
			var newFirst = f(first);
			return _List_fromArray(
				[
					A3($author$project$Css$Structure$StyleBlock, first, rest, properties),
					A3($author$project$Css$Structure$StyleBlock, newFirst, newRest, _List_Nil)
				]);
		}
	});
var $author$project$Css$Structure$applyPseudoElement = F2(
	function (pseudo, _v0) {
		var sequence = _v0.a;
		var selectors = _v0.b;
		return A3(
			$author$project$Css$Structure$Selector,
			sequence,
			selectors,
			$elm$core$Maybe$Just(pseudo));
	});
var $author$project$Css$Structure$appendPseudoElementToLastSelector = F2(
	function (pseudo, styleBlock) {
		return A2(
			$author$project$Css$Structure$appendToLastSelector,
			$author$project$Css$Structure$applyPseudoElement(pseudo),
			styleBlock);
	});
var $author$project$Css$Structure$CustomSelector = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Css$Structure$TypeSelectorSequence = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Css$Structure$appendRepeatable = F2(
	function (selector, sequence) {
		switch (sequence.$) {
			case 0:
				var typeSelector = sequence.a;
				var list = sequence.b;
				return A2(
					$author$project$Css$Structure$TypeSelectorSequence,
					typeSelector,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			case 1:
				var list = sequence.a;
				return $author$project$Css$Structure$UniversalSelectorSequence(
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			default:
				var str = sequence.a;
				var list = sequence.b;
				return A2(
					$author$project$Css$Structure$CustomSelector,
					str,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
		}
	});
var $author$project$Css$Structure$appendRepeatableWithCombinator = F2(
	function (selector, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			if (!list.b.b) {
				var _v1 = list.a;
				var combinator = _v1.a;
				var sequence = _v1.b;
				return _List_fromArray(
					[
						_Utils_Tuple2(
						combinator,
						A2($author$project$Css$Structure$appendRepeatable, selector, sequence))
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($author$project$Css$Structure$appendRepeatableWithCombinator, selector, rest));
			}
		}
	});
var $author$project$Css$Structure$appendRepeatableSelector = F2(
	function (repeatableSimpleSelector, selector) {
		if (!selector.b.b) {
			var sequence = selector.a;
			var pseudoElement = selector.c;
			return A3(
				$author$project$Css$Structure$Selector,
				A2($author$project$Css$Structure$appendRepeatable, repeatableSimpleSelector, sequence),
				_List_Nil,
				pseudoElement);
		} else {
			var firstSelector = selector.a;
			var tuples = selector.b;
			var pseudoElement = selector.c;
			return A3(
				$author$project$Css$Structure$Selector,
				firstSelector,
				A2($author$project$Css$Structure$appendRepeatableWithCombinator, repeatableSimpleSelector, tuples),
				pseudoElement);
		}
	});
var $author$project$Css$Structure$appendRepeatableToLastSelector = F2(
	function (selector, styleBlock) {
		return A2(
			$author$project$Css$Structure$appendToLastSelector,
			$author$project$Css$Structure$appendRepeatableSelector(selector),
			styleBlock);
	});
var $author$project$Css$Preprocess$Resolve$collectSelectors = function (declarations) {
	collectSelectors:
	while (true) {
		if (!declarations.b) {
			return _List_Nil;
		} else {
			if (!declarations.a.$) {
				var _v1 = declarations.a.a;
				var firstSelector = _v1.a;
				var otherSelectors = _v1.b;
				var rest = declarations.b;
				return _Utils_ap(
					A2($elm$core$List$cons, firstSelector, otherSelectors),
					$author$project$Css$Preprocess$Resolve$collectSelectors(rest));
			} else {
				var rest = declarations.b;
				var $temp$declarations = rest;
				declarations = $temp$declarations;
				continue collectSelectors;
			}
		}
	}
};
var $author$project$Css$Structure$DocumentRule = F5(
	function (a, b, c, d, e) {
		return {$: 3, a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$Css$Structure$concatMapLastStyleBlock = F2(
	function (update, declarations) {
		_v0$12:
		while (true) {
			if (!declarations.b) {
				return declarations;
			} else {
				if (!declarations.b.b) {
					switch (declarations.a.$) {
						case 0:
							var styleBlock = declarations.a.a;
							return A2(
								$elm$core$List$map,
								$author$project$Css$Structure$StyleBlockDeclaration,
								update(styleBlock));
						case 1:
							if (declarations.a.b.b) {
								if (!declarations.a.b.b.b) {
									var _v1 = declarations.a;
									var mediaQueries = _v1.a;
									var _v2 = _v1.b;
									var styleBlock = _v2.a;
									return _List_fromArray(
										[
											A2(
											$author$project$Css$Structure$MediaRule,
											mediaQueries,
											update(styleBlock))
										]);
								} else {
									var _v3 = declarations.a;
									var mediaQueries = _v3.a;
									var _v4 = _v3.b;
									var first = _v4.a;
									var rest = _v4.b;
									var _v5 = A2(
										$author$project$Css$Structure$concatMapLastStyleBlock,
										update,
										_List_fromArray(
											[
												A2($author$project$Css$Structure$MediaRule, mediaQueries, rest)
											]));
									if ((_v5.b && (_v5.a.$ === 1)) && (!_v5.b.b)) {
										var _v6 = _v5.a;
										var newMediaQueries = _v6.a;
										var newStyleBlocks = _v6.b;
										return _List_fromArray(
											[
												A2(
												$author$project$Css$Structure$MediaRule,
												newMediaQueries,
												A2($elm$core$List$cons, first, newStyleBlocks))
											]);
									} else {
										var newDeclarations = _v5;
										return newDeclarations;
									}
								}
							} else {
								break _v0$12;
							}
						case 2:
							var _v7 = declarations.a;
							var str = _v7.a;
							var nestedDeclarations = _v7.b;
							return _List_fromArray(
								[
									A2(
									$author$project$Css$Structure$SupportsRule,
									str,
									A2($author$project$Css$Structure$concatMapLastStyleBlock, update, nestedDeclarations))
								]);
						case 3:
							var _v8 = declarations.a;
							var str1 = _v8.a;
							var str2 = _v8.b;
							var str3 = _v8.c;
							var str4 = _v8.d;
							var styleBlock = _v8.e;
							return A2(
								$elm$core$List$map,
								A4($author$project$Css$Structure$DocumentRule, str1, str2, str3, str4),
								update(styleBlock));
						case 4:
							var _v9 = declarations.a;
							return declarations;
						case 5:
							return declarations;
						case 6:
							return declarations;
						case 7:
							return declarations;
						case 8:
							return declarations;
						default:
							return declarations;
					}
				} else {
					break _v0$12;
				}
			}
		}
		var first = declarations.a;
		var rest = declarations.b;
		return A2(
			$elm$core$List$cons,
			first,
			A2($author$project$Css$Structure$concatMapLastStyleBlock, update, rest));
	});
var $elm$core$String$cons = _String_cons;
var $Skinney$murmur3$Murmur3$HashData = F4(
	function (shift, seed, hash, charsProcessed) {
		return {af: charsProcessed, al: hash, cr: seed, aq: shift};
	});
var $Skinney$murmur3$Murmur3$c1 = 3432918353;
var $Skinney$murmur3$Murmur3$c2 = 461845907;
var $Skinney$murmur3$Murmur3$multiplyBy = F2(
	function (b, a) {
		return ((a & 65535) * b) + ((((a >>> 16) * b) & 65535) << 16);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Bitwise$or = _Bitwise_or;
var $Skinney$murmur3$Murmur3$rotlBy = F2(
	function (b, a) {
		return (a << b) | (a >>> (32 - b));
	});
var $Skinney$murmur3$Murmur3$finalize = function (data) {
	var acc = (!(!data.al)) ? (data.cr ^ A2(
		$Skinney$murmur3$Murmur3$multiplyBy,
		$Skinney$murmur3$Murmur3$c2,
		A2(
			$Skinney$murmur3$Murmur3$rotlBy,
			15,
			A2($Skinney$murmur3$Murmur3$multiplyBy, $Skinney$murmur3$Murmur3$c1, data.al)))) : data.cr;
	var h0 = acc ^ data.af;
	var h1 = A2($Skinney$murmur3$Murmur3$multiplyBy, 2246822507, h0 ^ (h0 >>> 16));
	var h2 = A2($Skinney$murmur3$Murmur3$multiplyBy, 3266489909, h1 ^ (h1 >>> 13));
	return (h2 ^ (h2 >>> 16)) >>> 0;
};
var $elm$core$String$foldl = _String_foldl;
var $Skinney$murmur3$Murmur3$mix = F2(
	function (h1, k1) {
		return A2(
			$Skinney$murmur3$Murmur3$multiplyBy,
			5,
			A2(
				$Skinney$murmur3$Murmur3$rotlBy,
				13,
				h1 ^ A2(
					$Skinney$murmur3$Murmur3$multiplyBy,
					$Skinney$murmur3$Murmur3$c2,
					A2(
						$Skinney$murmur3$Murmur3$rotlBy,
						15,
						A2($Skinney$murmur3$Murmur3$multiplyBy, $Skinney$murmur3$Murmur3$c1, k1))))) + 3864292196;
	});
var $Skinney$murmur3$Murmur3$hashFold = F2(
	function (c, data) {
		var res = data.al | ((255 & $elm$core$Char$toCode(c)) << data.aq);
		var _v0 = data.aq;
		if (_v0 === 24) {
			return {
				af: data.af + 1,
				al: 0,
				cr: A2($Skinney$murmur3$Murmur3$mix, data.cr, res),
				aq: 0
			};
		} else {
			return {af: data.af + 1, al: res, cr: data.cr, aq: data.aq + 8};
		}
	});
var $Skinney$murmur3$Murmur3$hashString = F2(
	function (seed, str) {
		return $Skinney$murmur3$Murmur3$finalize(
			A3(
				$elm$core$String$foldl,
				$Skinney$murmur3$Murmur3$hashFold,
				A4($Skinney$murmur3$Murmur3$HashData, 0, seed, 0, 0),
				str));
	});
var $author$project$Hash$murmurSeed = 15739;
var $elm$core$String$fromList = _String_fromList;
var $rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return '0';
			case 1:
				return '1';
			case 2:
				return '2';
			case 3:
				return '3';
			case 4:
				return '4';
			case 5:
				return '5';
			case 6:
				return '6';
			case 7:
				return '7';
			case 8:
				return '8';
			case 9:
				return '9';
			case 10:
				return 'a';
			case 11:
				return 'b';
			case 12:
				return 'c';
			case 13:
				return 'd';
			case 14:
				return 'e';
			case 15:
				return 'f';
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $rtfeldman$elm_hex$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			'-',
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $author$project$Hash$fromString = function (str) {
	return A2(
		$elm$core$String$cons,
		'_',
		$rtfeldman$elm_hex$Hex$toString(
			A2($Skinney$murmur3$Murmur3$hashString, $author$project$Hash$murmurSeed, str)));
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Css$Preprocess$Resolve$last = function (list) {
	last:
	while (true) {
		if (!list.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!list.b.b) {
				var singleton = list.a;
				return $elm$core$Maybe$Just(singleton);
			} else {
				var rest = list.b;
				var $temp$list = rest;
				list = $temp$list;
				continue last;
			}
		}
	}
};
var $author$project$Css$Preprocess$Resolve$lastDeclaration = function (declarations) {
	lastDeclaration:
	while (true) {
		if (!declarations.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!declarations.b.b) {
				var x = declarations.a;
				return $elm$core$Maybe$Just(
					_List_fromArray(
						[x]));
			} else {
				var xs = declarations.b;
				var $temp$declarations = xs;
				declarations = $temp$declarations;
				continue lastDeclaration;
			}
		}
	}
};
var $author$project$Css$Preprocess$Resolve$oneOf = function (maybes) {
	oneOf:
	while (true) {
		if (!maybes.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var maybe = maybes.a;
			var rest = maybes.b;
			if (maybe.$ === 1) {
				var $temp$maybes = rest;
				maybes = $temp$maybes;
				continue oneOf;
			} else {
				return maybe;
			}
		}
	}
};
var $author$project$Css$Structure$FontFeatureValues = function (a) {
	return {$: 9, a: a};
};
var $author$project$Css$Preprocess$Resolve$resolveFontFeatureValues = function (tuples) {
	var expandTuples = function (tuplesToExpand) {
		if (!tuplesToExpand.b) {
			return _List_Nil;
		} else {
			var properties = tuplesToExpand.a;
			var rest = tuplesToExpand.b;
			return A2(
				$elm$core$List$cons,
				properties,
				expandTuples(rest));
		}
	};
	var newTuples = expandTuples(tuples);
	return _List_fromArray(
		[
			$author$project$Css$Structure$FontFeatureValues(newTuples)
		]);
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $author$project$Css$Structure$styleBlockToMediaRule = F2(
	function (mediaQueries, declaration) {
		if (!declaration.$) {
			var styleBlock = declaration.a;
			return A2(
				$author$project$Css$Structure$MediaRule,
				mediaQueries,
				_List_fromArray(
					[styleBlock]));
		} else {
			return declaration;
		}
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Css$Preprocess$Resolve$toDocumentRule = F5(
	function (str1, str2, str3, str4, declaration) {
		if (!declaration.$) {
			var structureStyleBlock = declaration.a;
			return A5($author$project$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
		} else {
			return declaration;
		}
	});
var $author$project$Css$Preprocess$Resolve$toMediaRule = F2(
	function (mediaQueries, declaration) {
		switch (declaration.$) {
			case 0:
				var structureStyleBlock = declaration.a;
				return A2(
					$author$project$Css$Structure$MediaRule,
					mediaQueries,
					_List_fromArray(
						[structureStyleBlock]));
			case 1:
				var newMediaQueries = declaration.a;
				var structureStyleBlocks = declaration.b;
				return A2(
					$author$project$Css$Structure$MediaRule,
					_Utils_ap(mediaQueries, newMediaQueries),
					structureStyleBlocks);
			case 2:
				var str = declaration.a;
				var declarations = declaration.b;
				return A2(
					$author$project$Css$Structure$SupportsRule,
					str,
					A2(
						$elm$core$List$map,
						$author$project$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
						declarations));
			case 3:
				var str1 = declaration.a;
				var str2 = declaration.b;
				var str3 = declaration.c;
				var str4 = declaration.d;
				var structureStyleBlock = declaration.e;
				return A5($author$project$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
			case 4:
				return declaration;
			case 5:
				return declaration;
			case 6:
				return declaration;
			case 7:
				return declaration;
			case 8:
				return declaration;
			default:
				return declaration;
		}
	});
var $author$project$Css$Preprocess$unwrapSnippet = function (_v0) {
	var declarations = _v0;
	return declarations;
};
var $author$project$Css$Preprocess$Resolve$applyNestedStylesToLast = F4(
	function (nestedStyles, rest, f, declarations) {
		var withoutParent = function (decls) {
			return A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm$core$List$tail(decls));
		};
		var nextResult = A2(
			$author$project$Css$Preprocess$Resolve$applyStyles,
			rest,
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$author$project$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		var newDeclarations = function () {
			var _v14 = _Utils_Tuple2(
				$elm$core$List$head(nextResult),
				$author$project$Css$Preprocess$Resolve$last(declarations));
			if ((!_v14.a.$) && (!_v14.b.$)) {
				var nextResultParent = _v14.a.a;
				var originalParent = _v14.b.a;
				return _Utils_ap(
					A2(
						$elm$core$List$take,
						$elm$core$List$length(declarations) - 1,
						declarations),
					_List_fromArray(
						[
							(!_Utils_eq(originalParent, nextResultParent)) ? nextResultParent : originalParent
						]));
			} else {
				return declarations;
			}
		}();
		var insertStylesToNestedDecl = function (lastDecl) {
			return $elm$core$List$concat(
				A2(
					$author$project$Css$Structure$mapLast,
					$author$project$Css$Preprocess$Resolve$applyStyles(nestedStyles),
					A2(
						$elm$core$List$map,
						$elm$core$List$singleton,
						A2($author$project$Css$Structure$concatMapLastStyleBlock, f, lastDecl))));
		};
		var initialResult = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				insertStylesToNestedDecl,
				$author$project$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		return _Utils_ap(
			newDeclarations,
			_Utils_ap(
				withoutParent(initialResult),
				withoutParent(nextResult)));
	});
var $author$project$Css$Preprocess$Resolve$applyStyles = F2(
	function (styles, declarations) {
		if (!styles.b) {
			return declarations;
		} else {
			switch (styles.a.$) {
				case 0:
					var property = styles.a.a;
					var rest = styles.b;
					return A2(
						$author$project$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($author$project$Css$Structure$appendProperty, property, declarations));
				case 1:
					var _v4 = styles.a;
					var selector = _v4.a;
					var nestedStyles = _v4.b;
					var rest = styles.b;
					return A4(
						$author$project$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$author$project$Css$Structure$appendRepeatableToLastSelector(selector),
						declarations);
				case 2:
					var _v5 = styles.a;
					var selectorCombinator = _v5.a;
					var snippets = _v5.b;
					var rest = styles.b;
					var chain = F2(
						function (_v9, _v10) {
							var originalSequence = _v9.a;
							var originalTuples = _v9.b;
							var originalPseudoElement = _v9.c;
							var newSequence = _v10.a;
							var newTuples = _v10.b;
							var newPseudoElement = _v10.c;
							return A3(
								$author$project$Css$Structure$Selector,
								originalSequence,
								_Utils_ap(
									originalTuples,
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(selectorCombinator, newSequence),
										newTuples)),
								$author$project$Css$Preprocess$Resolve$oneOf(
									_List_fromArray(
										[newPseudoElement, originalPseudoElement])));
						});
					var expandDeclaration = function (declaration) {
						switch (declaration.$) {
							case 0:
								var _v7 = declaration.a;
								var firstSelector = _v7.a;
								var otherSelectors = _v7.b;
								var nestedStyles = _v7.c;
								var newSelectors = A2(
									$elm$core$List$concatMap,
									function (originalSelector) {
										return A2(
											$elm$core$List$map,
											chain(originalSelector),
											A2($elm$core$List$cons, firstSelector, otherSelectors));
									},
									$author$project$Css$Preprocess$Resolve$collectSelectors(declarations));
								var newDeclarations = function () {
									if (!newSelectors.b) {
										return _List_Nil;
									} else {
										var first = newSelectors.a;
										var remainder = newSelectors.b;
										return _List_fromArray(
											[
												$author$project$Css$Structure$StyleBlockDeclaration(
												A3($author$project$Css$Structure$StyleBlock, first, remainder, _List_Nil))
											]);
									}
								}();
								return A2($author$project$Css$Preprocess$Resolve$applyStyles, nestedStyles, newDeclarations);
							case 1:
								var mediaQueries = declaration.a;
								var styleBlocks = declaration.b;
								return A2($author$project$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
							case 2:
								var str = declaration.a;
								var otherSnippets = declaration.b;
								return A2($author$project$Css$Preprocess$Resolve$resolveSupportsRule, str, otherSnippets);
							case 3:
								var str1 = declaration.a;
								var str2 = declaration.b;
								var str3 = declaration.c;
								var str4 = declaration.d;
								var styleBlock = declaration.e;
								return A2(
									$elm$core$List$map,
									A4($author$project$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
									$author$project$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
							case 4:
								var str = declaration.a;
								var properties = declaration.b;
								return _List_fromArray(
									[
										A2($author$project$Css$Structure$PageRule, str, properties)
									]);
							case 5:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$author$project$Css$Structure$FontFace(properties)
									]);
							case 6:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$author$project$Css$Structure$Viewport(properties)
									]);
							case 7:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$author$project$Css$Structure$CounterStyle(properties)
									]);
							default:
								var tuples = declaration.a;
								return $author$project$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
						}
					};
					return $elm$core$List$concat(
						_Utils_ap(
							_List_fromArray(
								[
									A2($author$project$Css$Preprocess$Resolve$applyStyles, rest, declarations)
								]),
							A2(
								$elm$core$List$map,
								expandDeclaration,
								A2($elm$core$List$concatMap, $author$project$Css$Preprocess$unwrapSnippet, snippets))));
				case 3:
					var _v11 = styles.a;
					var pseudoElement = _v11.a;
					var nestedStyles = _v11.b;
					var rest = styles.b;
					return A4(
						$author$project$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$author$project$Css$Structure$appendPseudoElementToLastSelector(pseudoElement),
						declarations);
				case 5:
					var str = styles.a.a;
					var rest = styles.b;
					var name = $author$project$Hash$fromString(str);
					var newProperty = 'animation-name:' + name;
					var newDeclarations = A2(
						$author$project$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($author$project$Css$Structure$appendProperty, newProperty, declarations));
					return A2(
						$elm$core$List$append,
						newDeclarations,
						_List_fromArray(
							[
								$author$project$Css$Structure$Keyframes(
								{cV: str, dd: name})
							]));
				case 4:
					var _v12 = styles.a;
					var mediaQueries = _v12.a;
					var nestedStyles = _v12.b;
					var rest = styles.b;
					var extraDeclarations = function () {
						var _v13 = $author$project$Css$Preprocess$Resolve$collectSelectors(declarations);
						if (!_v13.b) {
							return _List_Nil;
						} else {
							var firstSelector = _v13.a;
							var otherSelectors = _v13.b;
							return A2(
								$elm$core$List$map,
								$author$project$Css$Structure$styleBlockToMediaRule(mediaQueries),
								A2(
									$author$project$Css$Preprocess$Resolve$applyStyles,
									nestedStyles,
									$elm$core$List$singleton(
										$author$project$Css$Structure$StyleBlockDeclaration(
											A3($author$project$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil)))));
						}
					}();
					return _Utils_ap(
						A2($author$project$Css$Preprocess$Resolve$applyStyles, rest, declarations),
						extraDeclarations);
				default:
					var otherStyles = styles.a.a;
					var rest = styles.b;
					return A2(
						$author$project$Css$Preprocess$Resolve$applyStyles,
						_Utils_ap(otherStyles, rest),
						declarations);
			}
		}
	});
var $author$project$Css$Preprocess$Resolve$expandStyleBlock = function (_v2) {
	var firstSelector = _v2.a;
	var otherSelectors = _v2.b;
	var styles = _v2.c;
	return A2(
		$author$project$Css$Preprocess$Resolve$applyStyles,
		styles,
		_List_fromArray(
			[
				$author$project$Css$Structure$StyleBlockDeclaration(
				A3($author$project$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil))
			]));
};
var $author$project$Css$Preprocess$Resolve$extract = function (snippetDeclarations) {
	if (!snippetDeclarations.b) {
		return _List_Nil;
	} else {
		var first = snippetDeclarations.a;
		var rest = snippetDeclarations.b;
		return _Utils_ap(
			$author$project$Css$Preprocess$Resolve$toDeclarations(first),
			$author$project$Css$Preprocess$Resolve$extract(rest));
	}
};
var $author$project$Css$Preprocess$Resolve$resolveMediaRule = F2(
	function (mediaQueries, styleBlocks) {
		var handleStyleBlock = function (styleBlock) {
			return A2(
				$elm$core$List$map,
				$author$project$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
				$author$project$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		};
		return A2($elm$core$List$concatMap, handleStyleBlock, styleBlocks);
	});
var $author$project$Css$Preprocess$Resolve$resolveSupportsRule = F2(
	function (str, snippets) {
		var declarations = $author$project$Css$Preprocess$Resolve$extract(
			A2($elm$core$List$concatMap, $author$project$Css$Preprocess$unwrapSnippet, snippets));
		return _List_fromArray(
			[
				A2($author$project$Css$Structure$SupportsRule, str, declarations)
			]);
	});
var $author$project$Css$Preprocess$Resolve$toDeclarations = function (snippetDeclaration) {
	switch (snippetDeclaration.$) {
		case 0:
			var styleBlock = snippetDeclaration.a;
			return $author$project$Css$Preprocess$Resolve$expandStyleBlock(styleBlock);
		case 1:
			var mediaQueries = snippetDeclaration.a;
			var styleBlocks = snippetDeclaration.b;
			return A2($author$project$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
		case 2:
			var str = snippetDeclaration.a;
			var snippets = snippetDeclaration.b;
			return A2($author$project$Css$Preprocess$Resolve$resolveSupportsRule, str, snippets);
		case 3:
			var str1 = snippetDeclaration.a;
			var str2 = snippetDeclaration.b;
			var str3 = snippetDeclaration.c;
			var str4 = snippetDeclaration.d;
			var styleBlock = snippetDeclaration.e;
			return A2(
				$elm$core$List$map,
				A4($author$project$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
				$author$project$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		case 4:
			var str = snippetDeclaration.a;
			var properties = snippetDeclaration.b;
			return _List_fromArray(
				[
					A2($author$project$Css$Structure$PageRule, str, properties)
				]);
		case 5:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$author$project$Css$Structure$FontFace(properties)
				]);
		case 6:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$author$project$Css$Structure$Viewport(properties)
				]);
		case 7:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$author$project$Css$Structure$CounterStyle(properties)
				]);
		default:
			var tuples = snippetDeclaration.a;
			return $author$project$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
	}
};
var $author$project$Css$Preprocess$Resolve$toStructure = function (_v0) {
	var charset = _v0.bD;
	var imports = _v0.bY;
	var namespaces = _v0.b9;
	var snippets = _v0.cv;
	var declarations = $author$project$Css$Preprocess$Resolve$extract(
		A2($elm$core$List$concatMap, $author$project$Css$Preprocess$unwrapSnippet, snippets));
	return {bD: charset, cW: declarations, bY: imports, b9: namespaces};
};
var $author$project$Css$Preprocess$Resolve$compileHelp = function (sheet) {
	return $author$project$Css$Structure$Output$prettyPrint(
		$author$project$Css$Structure$compactStylesheet(
			$author$project$Css$Preprocess$Resolve$toStructure(sheet)));
};
var $author$project$Css$Preprocess$Resolve$compile = function (styles) {
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2($elm$core$List$map, $author$project$Css$Preprocess$Resolve$compileHelp, styles));
};
var $author$project$Css$Preprocess$Snippet = $elm$core$Basics$identity;
var $author$project$Css$Preprocess$StyleBlock = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$Css$Preprocess$StyleBlockDeclaration = function (a) {
	return {$: 0, a: a};
};
var $author$project$VirtualDom$Styled$makeSnippet = F2(
	function (styles, sequence) {
		var selector = A3($author$project$Css$Structure$Selector, sequence, _List_Nil, $elm$core$Maybe$Nothing);
		return _List_fromArray(
			[
				$author$project$Css$Preprocess$StyleBlockDeclaration(
				A3($author$project$Css$Preprocess$StyleBlock, selector, _List_Nil, styles))
			]);
	});
var $author$project$VirtualDom$Styled$murmurSeed = 15739;
var $author$project$Css$Preprocess$stylesheet = function (snippets) {
	return {bD: $elm$core$Maybe$Nothing, bY: _List_Nil, b9: _List_Nil, cv: snippets};
};
var $author$project$VirtualDom$Styled$getClassname = function (styles) {
	return $elm$core$List$isEmpty(styles) ? 'unstyled' : A2(
		$elm$core$String$cons,
		'_',
		$rtfeldman$elm_hex$Hex$toString(
			A2(
				$Skinney$murmur3$Murmur3$hashString,
				$author$project$VirtualDom$Styled$murmurSeed,
				$author$project$Css$Preprocess$Resolve$compile(
					$elm$core$List$singleton(
						$author$project$Css$Preprocess$stylesheet(
							$elm$core$List$singleton(
								A2(
									$author$project$VirtualDom$Styled$makeSnippet,
									styles,
									$author$project$Css$Structure$UniversalSelectorSequence(_List_Nil)))))))));
};
var $author$project$Html$Styled$Internal$css = function (styles) {
	var classname = $author$project$VirtualDom$Styled$getClassname(styles);
	var classProperty = A2(
		$elm$virtual_dom$VirtualDom$property,
		'className',
		$elm$json$Json$Encode$string(classname));
	return A3($author$project$VirtualDom$Styled$Attribute, classProperty, styles, classname);
};
var $author$project$Html$Styled$Attributes$css = $author$project$Html$Styled$Internal$css;
var $author$project$VirtualDom$Styled$Node = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$VirtualDom$Styled$node = $author$project$VirtualDom$Styled$Node;
var $author$project$Html$Styled$node = $author$project$VirtualDom$Styled$node;
var $author$project$Html$Styled$div = $author$project$Html$Styled$node('div');
var $author$project$Html$Styled$a = $author$project$Html$Styled$node('a');
var $author$project$Css$Preprocess$ApplyStyles = function (a) {
	return {$: 6, a: a};
};
var $author$project$Css$Preprocess$AppendProperty = function (a) {
	return {$: 0, a: a};
};
var $author$project$Css$Internal$property = F2(
	function (key, value) {
		return $author$project$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $author$project$Css$Internal$getOverloadedProperty = F3(
	function (functionName, desiredKey, style) {
		getOverloadedProperty:
		while (true) {
			switch (style.$) {
				case 0:
					var str = style.a;
					var key = A2(
						$elm$core$Maybe$withDefault,
						'',
						$elm$core$List$head(
							A2($elm$core$String$split, ':', str)));
					return A2($author$project$Css$Internal$property, desiredKey, key);
				case 1:
					var selector = style.a;
					return A2($author$project$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-selector'));
				case 2:
					var combinator = style.a;
					return A2($author$project$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-combinator'));
				case 3:
					var pseudoElement = style.a;
					return A2($author$project$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-pseudo-element setter'));
				case 4:
					return A2($author$project$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-media-query'));
				case 5:
					return A2($author$project$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-keyframes'));
				default:
					if (!style.a.b) {
						return A2($author$project$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-empty-Style'));
					} else {
						if (!style.a.b.b) {
							var _v1 = style.a;
							var only = _v1.a;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = only;
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						} else {
							var _v2 = style.a;
							var first = _v2.a;
							var rest = _v2.b;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = $author$project$Css$Preprocess$ApplyStyles(rest);
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						}
					}
			}
		}
	});
var $author$project$Css$Internal$IncompatibleUnits = 0;
var $author$project$Css$Structure$Compatible = 0;
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$Css$Internal$lengthConverter = F3(
	function (units, unitLabel, numericValue) {
		return {
			bo: 0,
			bB: 0,
			ah: 0,
			r: 0,
			aF: 0,
			am: 0,
			O: 0,
			an: 0,
			ao: 0,
			W: 0,
			X: 0,
			H: 0,
			Q: numericValue,
			at: 0,
			aw: unitLabel,
			aR: units,
			a: _Utils_ap(
				$elm$core$String$fromFloat(numericValue),
				unitLabel)
		};
	});
var $author$project$Css$Internal$lengthForOverloadedProperty = A3($author$project$Css$Internal$lengthConverter, 0, '', 0);
var $author$project$Css$alignItems = function (fn) {
	return A3(
		$author$project$Css$Internal$getOverloadedProperty,
		'alignItems',
		'align-items',
		fn($author$project$Css$Internal$lengthForOverloadedProperty));
};
var $author$project$Css$property = F2(
	function (key, value) {
		return $author$project$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $author$project$Css$prop1 = F2(
	function (key, arg) {
		return A2($author$project$Css$property, key, arg.a);
	});
var $author$project$Css$bottom = $author$project$Css$prop1('bottom');
var $author$project$Css$center = $author$project$Css$prop1('center');
var $author$project$Css$displayFlex = A2($author$project$Css$property, 'display', 'flex');
var $author$project$Css$fixed = {aA: 0, aK: 0, a4: 0, a: 'fixed'};
var $author$project$Html$Styled$footer = $author$project$Html$Styled$node('footer');
var $author$project$Css$height = $author$project$Css$prop1('height');
var $author$project$Html$Styled$Attributes$href = function (url) {
	return A2($author$project$Html$Styled$Attributes$stringProperty, 'href', url);
};
var $author$project$Html$Styled$i = $author$project$Html$Styled$node('i');
var $author$project$Css$justifyContent = function (fn) {
	return A3(
		$author$project$Css$Internal$getOverloadedProperty,
		'justifyContent',
		'justify-content',
		fn($author$project$Css$Internal$lengthForOverloadedProperty));
};
var $author$project$Css$PercentageUnits = 0;
var $author$project$Css$pct = A2($author$project$Css$Internal$lengthConverter, 0, '%');
var $author$project$Css$position = $author$project$Css$prop1('position');
var $author$project$Css$PxUnits = 0;
var $author$project$Css$px = A2($author$project$Css$Internal$lengthConverter, 0, 'px');
var $author$project$Html$Styled$span = $author$project$Html$Styled$node('span');
var $author$project$VirtualDom$Styled$Unstyled = function (a) {
	return {$: 4, a: a};
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $author$project$VirtualDom$Styled$text = function (str) {
	return $author$project$VirtualDom$Styled$Unstyled(
		$elm$virtual_dom$VirtualDom$text(str));
};
var $author$project$Html$Styled$text = $author$project$VirtualDom$Styled$text;
var $author$project$Css$width = $author$project$Css$prop1('width');
var $author$project$View$footerBar = A2(
	$author$project$Html$Styled$footer,
	_List_fromArray(
		[
			$author$project$Html$Styled$Attributes$class('footer bg-light fixed-bottom'),
			$author$project$Html$Styled$Attributes$css(
			_List_fromArray(
				[
					$author$project$Css$position($author$project$Css$fixed),
					$author$project$Css$bottom(
					$author$project$Css$px(0)),
					$author$project$Css$width(
					$author$project$Css$pct(100)),
					$author$project$Css$height(
					$author$project$Css$px(25))
				]))
		]),
	_List_fromArray(
		[
			A2(
			$author$project$Html$Styled$div,
			_List_fromArray(
				[
					$author$project$Html$Styled$Attributes$class('container'),
					$author$project$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$author$project$Css$displayFlex,
							$author$project$Css$alignItems($author$project$Css$center),
							$author$project$Css$justifyContent($author$project$Css$center)
						]))
				]),
			_List_fromArray(
				[
					A2(
					$author$project$Html$Styled$span,
					_List_Nil,
					_List_fromArray(
						[
							$author$project$Html$Styled$text('Made with '),
							A2(
							$author$project$Html$Styled$i,
							_List_fromArray(
								[
									$author$project$Html$Styled$Attributes$class('devicon-elm-plain')
								]),
							_List_Nil),
							$author$project$Html$Styled$text(' by '),
							A2(
							$author$project$Html$Styled$a,
							_List_fromArray(
								[
									$author$project$Html$Styled$Attributes$href('https://github.com/allannozomu/Elm-algorithms')
								]),
							_List_fromArray(
								[
									$author$project$Html$Styled$text('allannozomu')
								]))
						]))
				]))
		]));
var $author$project$VirtualDom$Styled$KeyedNode = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $author$project$VirtualDom$Styled$KeyedNodeNS = F4(
	function (a, b, c, d) {
		return {$: 3, a: a, b: b, c: c, d: d};
	});
var $author$project$VirtualDom$Styled$NodeNS = F4(
	function (a, b, c, d) {
		return {$: 1, a: a, b: b, c: c, d: d};
	});
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var $author$project$VirtualDom$Styled$mapAttribute = F2(
	function (transform, _v0) {
		var prop = _v0.a;
		var styles = _v0.b;
		var classname = _v0.c;
		return A3(
			$author$project$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$mapAttribute, transform, prop),
			styles,
			classname);
	});
var $author$project$VirtualDom$Styled$map = F2(
	function (transform, vdomNode) {
		switch (vdomNode.$) {
			case 0:
				var elemType = vdomNode.a;
				var properties = vdomNode.b;
				var children = vdomNode.c;
				return A3(
					$author$project$VirtualDom$Styled$Node,
					elemType,
					A2(
						$elm$core$List$map,
						$author$project$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						$author$project$VirtualDom$Styled$map(transform),
						children));
			case 1:
				var ns = vdomNode.a;
				var elemType = vdomNode.b;
				var properties = vdomNode.c;
				var children = vdomNode.d;
				return A4(
					$author$project$VirtualDom$Styled$NodeNS,
					ns,
					elemType,
					A2(
						$elm$core$List$map,
						$author$project$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						$author$project$VirtualDom$Styled$map(transform),
						children));
			case 2:
				var elemType = vdomNode.a;
				var properties = vdomNode.b;
				var children = vdomNode.c;
				return A3(
					$author$project$VirtualDom$Styled$KeyedNode,
					elemType,
					A2(
						$elm$core$List$map,
						$author$project$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						function (_v1) {
							var key = _v1.a;
							var child = _v1.b;
							return _Utils_Tuple2(
								key,
								A2($author$project$VirtualDom$Styled$map, transform, child));
						},
						children));
			case 3:
				var ns = vdomNode.a;
				var elemType = vdomNode.b;
				var properties = vdomNode.c;
				var children = vdomNode.d;
				return A4(
					$author$project$VirtualDom$Styled$KeyedNodeNS,
					ns,
					elemType,
					A2(
						$elm$core$List$map,
						$author$project$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						function (_v2) {
							var key = _v2.a;
							var child = _v2.b;
							return _Utils_Tuple2(
								key,
								A2($author$project$VirtualDom$Styled$map, transform, child));
						},
						children));
			default:
				var vdom = vdomNode.a;
				return $author$project$VirtualDom$Styled$Unstyled(
					A2($elm$virtual_dom$VirtualDom$map, transform, vdom));
		}
	});
var $author$project$Html$Styled$map = $author$project$VirtualDom$Styled$map;
var $author$project$Css$marginBottom = $author$project$Css$prop1('margin-bottom');
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $author$project$VirtualDom$Styled$attribute = F2(
	function (key, value) {
		return A3(
			$author$project$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$attribute, key, value),
			_List_Nil,
			'');
	});
var $author$project$Html$Styled$button = $author$project$Html$Styled$node('button');
var $author$project$Route$routeToPieces = function (page) {
	switch (page.$) {
		case 0:
			return _List_Nil;
		case 1:
			var algorithm = page.a;
			return _List_fromArray(
				['sortAlgorithms', algorithm]);
		case 2:
			var algorithm = page.a;
			return _List_fromArray(
				['graphAlgorithms', algorithm]);
		default:
			var algorithm = page.a;
			return _List_fromArray(
				['mazeAlgorithms', algorithm]);
	}
};
var $author$project$Route$routeToString = function (page) {
	return '#/' + A2(
		$elm$core$String$join,
		'/',
		A2(
			$elm$core$List$filter,
			function (s) {
				return !$elm$core$String$isEmpty(s);
			},
			$author$project$Route$routeToPieces(page)));
};
var $author$project$Route$href = function (route) {
	return $author$project$Html$Styled$Attributes$href(
		$author$project$Route$routeToString(route));
};
var $author$project$Html$Styled$Attributes$id = $author$project$Html$Styled$Attributes$stringProperty('id');
var $author$project$Html$Styled$li = $author$project$Html$Styled$node('li');
var $author$project$Html$Styled$nav = $author$project$Html$Styled$node('nav');
var $author$project$Html$Styled$ul = $author$project$Html$Styled$node('ul');
var $author$project$View$navbar = function (url) {
	var sortMethods = A2(
		$elm$core$List$map,
		function (_v0) {
			var sortName = _v0.b.dy;
			return sortName;
		},
		$elm$core$Dict$toList($author$project$Pages$Sort$Model$sortInfos));
	return A2(
		$author$project$Html$Styled$nav,
		_List_fromArray(
			[
				$author$project$Html$Styled$Attributes$class('navbar navbar-expand-lg navbar-dark bg-dark')
			]),
		_List_fromArray(
			[
				A2(
				$author$project$Html$Styled$a,
				_List_fromArray(
					[
						$author$project$Html$Styled$Attributes$class('navbar-brand')
					]),
				_List_fromArray(
					[
						$author$project$Html$Styled$text('Algorithms in Elm')
					])),
				A2(
				$author$project$Html$Styled$button,
				_List_fromArray(
					[
						$author$project$Html$Styled$Attributes$class('navbar-toggler'),
						A2($author$project$VirtualDom$Styled$attribute, 'data-toggle', 'collapse'),
						A2($author$project$VirtualDom$Styled$attribute, 'data-target', '#navbarToggler')
					]),
				_List_fromArray(
					[
						A2(
						$author$project$Html$Styled$span,
						_List_fromArray(
							[
								$author$project$Html$Styled$Attributes$class('navbar-toggler-icon')
							]),
						_List_Nil)
					])),
				A2(
				$author$project$Html$Styled$div,
				_List_fromArray(
					[
						$author$project$Html$Styled$Attributes$class('collapse navbar-collapse'),
						$author$project$Html$Styled$Attributes$id('navbarToggler')
					]),
				_List_fromArray(
					[
						A2(
						$author$project$Html$Styled$ul,
						_List_fromArray(
							[
								$author$project$Html$Styled$Attributes$class('navbar-nav')
							]),
						_List_fromArray(
							[
								A2(
								$author$project$Html$Styled$li,
								_List_fromArray(
									[
										$author$project$Html$Styled$Attributes$class('nav-item dropdown')
									]),
								_List_fromArray(
									[
										A2(
										$author$project$Html$Styled$a,
										_List_fromArray(
											[
												$author$project$Html$Styled$Attributes$class('nav-link dropdown-toggle'),
												$author$project$Html$Styled$Attributes$href(
												'#' + A2($elm$core$Maybe$withDefault, '', url.bT)),
												A2($author$project$VirtualDom$Styled$attribute, 'data-toggle', 'dropdown'),
												A2($author$project$VirtualDom$Styled$attribute, 'aria-haspopup', 'true'),
												A2($author$project$VirtualDom$Styled$attribute, 'aria-expanded', 'false')
											]),
										_List_fromArray(
											[
												$author$project$Html$Styled$text('Sort Algorithms')
											])),
										A2(
										$author$project$Html$Styled$div,
										_List_fromArray(
											[
												$author$project$Html$Styled$Attributes$class('dropdown-menu')
											]),
										A2(
											$elm$core$List$map,
											function (sm) {
												return A2(
													$author$project$Html$Styled$a,
													_List_fromArray(
														[
															$author$project$Html$Styled$Attributes$class('dropdown-item'),
															$author$project$Route$href(
															$author$project$Route$SortAlgorithmsPage(sm))
														]),
													_List_fromArray(
														[
															$author$project$Html$Styled$text(sm)
														]));
											},
											sortMethods))
									])),
								A2(
								$author$project$Html$Styled$li,
								_List_fromArray(
									[
										$author$project$Html$Styled$Attributes$class('nav-item dropdown')
									]),
								_List_fromArray(
									[
										A2(
										$author$project$Html$Styled$a,
										_List_fromArray(
											[
												$author$project$Html$Styled$Attributes$class('nav-link dropdown-toggle'),
												$author$project$Html$Styled$Attributes$href(
												'#' + A2($elm$core$Maybe$withDefault, '', url.bT)),
												A2($author$project$VirtualDom$Styled$attribute, 'data-toggle', 'dropdown'),
												A2($author$project$VirtualDom$Styled$attribute, 'aria-haspopup', 'true'),
												A2($author$project$VirtualDom$Styled$attribute, 'aria-expanded', 'false')
											]),
										_List_fromArray(
											[
												$author$project$Html$Styled$text('Graph Algorithms')
											])),
										A2(
										$author$project$Html$Styled$div,
										_List_fromArray(
											[
												$author$project$Html$Styled$Attributes$class('dropdown-menu')
											]),
										_List_fromArray(
											[
												A2(
												$author$project$Html$Styled$a,
												_List_fromArray(
													[
														$author$project$Html$Styled$Attributes$class('dropdown-item'),
														$author$project$Route$href(
														$author$project$Route$GraphAlgorithmsPage('x'))
													]),
												_List_fromArray(
													[
														$author$project$Html$Styled$text('DFS')
													]))
											]))
									])),
								A2(
								$author$project$Html$Styled$li,
								_List_fromArray(
									[
										$author$project$Html$Styled$Attributes$class('nav-item dropdown')
									]),
								_List_fromArray(
									[
										A2(
										$author$project$Html$Styled$a,
										_List_fromArray(
											[
												$author$project$Html$Styled$Attributes$class('nav-link dropdown-toggle'),
												$author$project$Html$Styled$Attributes$href(
												'#' + A2($elm$core$Maybe$withDefault, '', url.bT)),
												A2($author$project$VirtualDom$Styled$attribute, 'data-toggle', 'dropdown'),
												A2($author$project$VirtualDom$Styled$attribute, 'aria-haspopup', 'true'),
												A2($author$project$VirtualDom$Styled$attribute, 'aria-expanded', 'false')
											]),
										_List_fromArray(
											[
												$author$project$Html$Styled$text('Mazes')
											])),
										A2(
										$author$project$Html$Styled$div,
										_List_fromArray(
											[
												$author$project$Html$Styled$Attributes$class('dropdown-menu')
											]),
										_List_fromArray(
											[
												A2(
												$author$project$Html$Styled$a,
												_List_fromArray(
													[
														$author$project$Html$Styled$Attributes$class('dropdown-item'),
														$author$project$Route$href(
														$author$project$Route$MazeAlgorithmsPage('x'))
													]),
												_List_fromArray(
													[
														$author$project$Html$Styled$text('Kruskal Maze Generator')
													]))
											]))
									])),
								A2(
								$author$project$Html$Styled$li,
								_List_fromArray(
									[
										$author$project$Html$Styled$Attributes$class('nav-item')
									]),
								_List_fromArray(
									[
										A2(
										$author$project$Html$Styled$a,
										_List_fromArray(
											[
												$author$project$Html$Styled$Attributes$class('nav-link disabled')
											]),
										_List_fromArray(
											[
												$author$project$Html$Styled$text('Under construction')
											]))
									]))
							]))
					]))
			]));
};
var $author$project$VirtualDom$Styled$accumulateStyles = F2(
	function (_v0, styles) {
		var newStyles = _v0.b;
		var classname = _v0.c;
		return $elm$core$List$isEmpty(newStyles) ? styles : A3($elm$core$Dict$insert, classname, newStyles, styles);
	});
var $author$project$VirtualDom$Styled$extractUnstyledAttribute = function (_v0) {
	var val = _v0.a;
	return val;
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$keyedNodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_keyedNodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$nodeNS = function (tag) {
	return _VirtualDom_nodeNS(
		_VirtualDom_noScript(tag));
};
var $author$project$VirtualDom$Styled$accumulateKeyedStyledHtml = F2(
	function (_v6, _v7) {
		var key = _v6.a;
		var html = _v6.b;
		var pairs = _v7.a;
		var styles = _v7.b;
		switch (html.$) {
			case 4:
				var vdom = html.a;
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					styles);
			case 0:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $author$project$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v9 = A3(
					$elm$core$List$foldl,
					$author$project$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v9.a;
				var finalStyles = _v9.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2($elm$core$List$map, $author$project$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 1:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $author$project$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v10 = A3(
					$elm$core$List$foldl,
					$author$project$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v10.a;
				var finalStyles = _v10.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $author$project$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 2:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $author$project$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v11 = A3(
					$elm$core$List$foldl,
					$author$project$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v11.a;
				var finalStyles = _v11.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2($elm$core$List$map, $author$project$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $author$project$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v12 = A3(
					$elm$core$List$foldl,
					$author$project$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v12.a;
				var finalStyles = _v12.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $author$project$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
		}
	});
var $author$project$VirtualDom$Styled$accumulateStyledHtml = F2(
	function (html, _v0) {
		var nodes = _v0.a;
		var styles = _v0.b;
		switch (html.$) {
			case 4:
				var vdomNode = html.a;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					styles);
			case 0:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $author$project$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v2 = A3(
					$elm$core$List$foldl,
					$author$project$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v2.a;
				var finalStyles = _v2.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2($elm$core$List$map, $author$project$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 1:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $author$project$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v3 = A3(
					$elm$core$List$foldl,
					$author$project$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v3.a;
				var finalStyles = _v3.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $author$project$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 2:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $author$project$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v4 = A3(
					$elm$core$List$foldl,
					$author$project$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v4.a;
				var finalStyles = _v4.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2($elm$core$List$map, $author$project$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $author$project$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v5 = A3(
					$elm$core$List$foldl,
					$author$project$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v5.a;
				var finalStyles = _v5.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $author$project$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
		}
	});
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $author$project$VirtualDom$Styled$stylesFromPropertiesHelp = F2(
	function (candidate, properties) {
		stylesFromPropertiesHelp:
		while (true) {
			if (!properties.b) {
				return candidate;
			} else {
				var _v1 = properties.a;
				var styles = _v1.b;
				var classname = _v1.c;
				var rest = properties.b;
				if ($elm$core$String$isEmpty(classname)) {
					var $temp$candidate = candidate,
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				} else {
					var $temp$candidate = $elm$core$Maybe$Just(
						_Utils_Tuple2(classname, styles)),
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				}
			}
		}
	});
var $author$project$VirtualDom$Styled$stylesFromProperties = function (properties) {
	var _v0 = A2($author$project$VirtualDom$Styled$stylesFromPropertiesHelp, $elm$core$Maybe$Nothing, properties);
	if (_v0.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var _v1 = _v0.a;
		var classname = _v1.a;
		var styles = _v1.b;
		return A2($elm$core$Dict$singleton, classname, styles);
	}
};
var $author$project$Css$Structure$ClassSelector = function (a) {
	return {$: 0, a: a};
};
var $author$project$VirtualDom$Styled$snippetFromPair = function (_v0) {
	var classname = _v0.a;
	var styles = _v0.b;
	return A2(
		$author$project$VirtualDom$Styled$makeSnippet,
		styles,
		$author$project$Css$Structure$UniversalSelectorSequence(
			_List_fromArray(
				[
					$author$project$Css$Structure$ClassSelector(classname)
				])));
};
var $author$project$VirtualDom$Styled$toDeclaration = function (dict) {
	return $author$project$Css$Preprocess$Resolve$compile(
		$elm$core$List$singleton(
			$author$project$Css$Preprocess$stylesheet(
				A2(
					$elm$core$List$map,
					$author$project$VirtualDom$Styled$snippetFromPair,
					$elm$core$Dict$toList(dict)))));
};
var $author$project$VirtualDom$Styled$toStyleNode = function (styles) {
	return A3(
		$elm$virtual_dom$VirtualDom$node,
		'style',
		_List_Nil,
		$elm$core$List$singleton(
			$elm$virtual_dom$VirtualDom$text(
				$author$project$VirtualDom$Styled$toDeclaration(styles))));
};
var $author$project$VirtualDom$Styled$unstyle = F3(
	function (elemType, properties, children) {
		var unstyledProperties = A2($elm$core$List$map, $author$project$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $author$project$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$author$project$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = $author$project$VirtualDom$Styled$toStyleNode(styles);
		return A3(
			$elm$virtual_dom$VirtualDom$node,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $author$project$VirtualDom$Styled$containsKey = F2(
	function (key, pairs) {
		containsKey:
		while (true) {
			if (!pairs.b) {
				return false;
			} else {
				var _v1 = pairs.a;
				var str = _v1.a;
				var rest = pairs.b;
				if (_Utils_eq(key, str)) {
					return true;
				} else {
					var $temp$key = key,
						$temp$pairs = rest;
					key = $temp$key;
					pairs = $temp$pairs;
					continue containsKey;
				}
			}
		}
	});
var $author$project$VirtualDom$Styled$getUnusedKey = F2(
	function (_default, pairs) {
		getUnusedKey:
		while (true) {
			if (!pairs.b) {
				return _default;
			} else {
				var _v1 = pairs.a;
				var firstKey = _v1.a;
				var rest = pairs.b;
				var newKey = '_' + firstKey;
				if (A2($author$project$VirtualDom$Styled$containsKey, newKey, rest)) {
					var $temp$default = newKey,
						$temp$pairs = rest;
					_default = $temp$default;
					pairs = $temp$pairs;
					continue getUnusedKey;
				} else {
					return newKey;
				}
			}
		}
	});
var $author$project$VirtualDom$Styled$toKeyedStyleNode = F2(
	function (allStyles, keyedChildNodes) {
		var styleNodeKey = A2($author$project$VirtualDom$Styled$getUnusedKey, '_', keyedChildNodes);
		var finalNode = $author$project$VirtualDom$Styled$toStyleNode(allStyles);
		return _Utils_Tuple2(styleNodeKey, finalNode);
	});
var $author$project$VirtualDom$Styled$unstyleKeyed = F3(
	function (elemType, properties, keyedChildren) {
		var unstyledProperties = A2($elm$core$List$map, $author$project$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $author$project$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$author$project$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A2($author$project$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A3(
			$elm$virtual_dom$VirtualDom$keyedNode,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $author$project$VirtualDom$Styled$unstyleKeyedNS = F4(
	function (ns, elemType, properties, keyedChildren) {
		var unstyledProperties = A2($elm$core$List$map, $author$project$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $author$project$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$author$project$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A2($author$project$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A4(
			$elm$virtual_dom$VirtualDom$keyedNodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $author$project$VirtualDom$Styled$unstyleNS = F4(
	function (ns, elemType, properties, children) {
		var unstyledProperties = A2($elm$core$List$map, $author$project$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $author$project$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$author$project$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = $author$project$VirtualDom$Styled$toStyleNode(styles);
		return A4(
			$elm$virtual_dom$VirtualDom$nodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $author$project$VirtualDom$Styled$toUnstyled = function (vdom) {
	switch (vdom.$) {
		case 4:
			var plainNode = vdom.a;
			return plainNode;
		case 0:
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($author$project$VirtualDom$Styled$unstyle, elemType, properties, children);
		case 1:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($author$project$VirtualDom$Styled$unstyleNS, ns, elemType, properties, children);
		case 2:
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($author$project$VirtualDom$Styled$unstyleKeyed, elemType, properties, children);
		default:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($author$project$VirtualDom$Styled$unstyleKeyedNS, ns, elemType, properties, children);
	}
};
var $author$project$Html$Styled$toUnstyled = $author$project$VirtualDom$Styled$toUnstyled;
var $author$project$Pages$Graph$Update$SelectTile = function (a) {
	return {$: 1, a: a};
};
var $author$project$Svg$Styled$Attributes$fill = $author$project$VirtualDom$Styled$attribute('fill');
var $author$project$Pages$Graph$View$blueCollorAttr = $author$project$Svg$Styled$Attributes$fill('blue');
var $author$project$Pages$Graph$View$svgSize_ = 512;
var $author$project$Pages$Graph$View$edgeSize = ($author$project$Pages$Graph$View$svgSize_ / 16) | 0;
var $author$project$Svg$Styled$Attributes$fillOpacity = $author$project$VirtualDom$Styled$attribute('fill-opacity');
var $author$project$Pages$Graph$View$greenCollorAttr = $author$project$Svg$Styled$Attributes$fill('lightgreen');
var $author$project$Svg$Styled$Attributes$height = $author$project$VirtualDom$Styled$attribute('height');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $author$project$VirtualDom$Styled$on = F2(
	function (eventName, handler) {
		return A3(
			$author$project$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$on, eventName, handler),
			_List_Nil,
			'');
	});
var $author$project$Html$Styled$Events$on = F2(
	function (event, decoder) {
		return A2(
			$author$project$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $author$project$Svg$Styled$Events$onClick = function (msg) {
	return A2(
		$author$project$Html$Styled$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$VirtualDom$Styled$nodeNS = $author$project$VirtualDom$Styled$NodeNS;
var $author$project$Svg$Styled$node = $author$project$VirtualDom$Styled$nodeNS('http://www.w3.org/2000/svg');
var $author$project$Svg$Styled$rect = $author$project$Svg$Styled$node('rect');
var $author$project$Svg$Styled$svg = $author$project$Svg$Styled$node('svg');
var $author$project$Svg$Styled$Attributes$width = $author$project$VirtualDom$Styled$attribute('width');
var $author$project$Svg$Styled$Attributes$x = $author$project$VirtualDom$Styled$attribute('x');
var $author$project$Svg$Styled$Attributes$y = $author$project$VirtualDom$Styled$attribute('y');
var $author$project$Pages$Graph$View$drawInvisibleClickableSquares = F3(
	function (dimension, beginPosition, endPosition) {
		var drawRect = function (index) {
			var posY = (index / dimension.ac) | 0;
			var posX = index % dimension.ac;
			return A2(
				$author$project$Svg$Styled$rect,
				_Utils_ap(
					_List_fromArray(
						[
							$author$project$Svg$Styled$Attributes$x(
							$elm$core$String$fromInt((posX + 1) * $author$project$Pages$Graph$View$edgeSize)),
							$author$project$Svg$Styled$Attributes$y(
							$elm$core$String$fromInt((posY + 1) * $author$project$Pages$Graph$View$edgeSize)),
							$author$project$Svg$Styled$Attributes$fill('transparent'),
							$author$project$Svg$Styled$Attributes$width(
							$elm$core$String$fromInt($author$project$Pages$Graph$View$edgeSize)),
							$author$project$Svg$Styled$Attributes$height(
							$elm$core$String$fromInt($author$project$Pages$Graph$View$edgeSize)),
							$author$project$Svg$Styled$Events$onClick(
							$author$project$Pages$Graph$Update$SelectTile(
								A2($author$project$Algorithms$Graphs$MazeGenerator$Position, posY, posX)))
						]),
					(_Utils_eq(posX, beginPosition.o) && _Utils_eq(posY, beginPosition.p)) ? _List_fromArray(
						[
							$author$project$Pages$Graph$View$blueCollorAttr,
							$author$project$Svg$Styled$Attributes$fillOpacity('0.4')
						]) : ((_Utils_eq(posX, endPosition.o) && _Utils_eq(posY, endPosition.p)) ? _List_fromArray(
						[
							$author$project$Pages$Graph$View$greenCollorAttr,
							$author$project$Svg$Styled$Attributes$fillOpacity('0.4')
						]) : _List_Nil)),
				_List_Nil);
		};
		return A2(
			$author$project$Svg$Styled$svg,
			_List_fromArray(
				[
					$author$project$Svg$Styled$Attributes$width(
					$elm$core$String$fromInt($author$project$Pages$Graph$View$svgSize_)),
					$author$project$Svg$Styled$Attributes$height(
					$elm$core$String$fromInt($author$project$Pages$Graph$View$svgSize_))
				]),
			A2(
				$elm$core$List$map,
				function (i) {
					return drawRect(i);
				},
				A2($elm$core$List$range, 0, (dimension.ac * dimension.aE) - 1)));
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Pages$Graph$View$redCollorAttr = $author$project$Svg$Styled$Attributes$fill('red');
var $author$project$Pages$Graph$View$whiteColorAttr = $author$project$Svg$Styled$Attributes$fill('white');
var $author$project$Pages$Graph$View$drawMazeFromListEdges = F4(
	function (path, beginEndPath, isPath, visited) {
		var drawRect = F2(
			function (from, to) {
				var y = A2($elm$core$Basics$min, from.p, to.p) + 1;
				var x = A2($elm$core$Basics$min, from.o, to.o) + 1;
				var middle = ($author$project$Pages$Graph$View$edgeSize / 2) | 0;
				var _v1 = isPath ? (_Utils_eq(from.o, to.o) ? _Utils_Tuple2(2, $author$project$Pages$Graph$View$edgeSize + 1) : _Utils_Tuple2($author$project$Pages$Graph$View$edgeSize + 1, 2)) : (_Utils_eq(from.o, to.o) ? _Utils_Tuple2($author$project$Pages$Graph$View$edgeSize - 2, (($author$project$Pages$Graph$View$edgeSize - 2) * 2) + 2) : _Utils_Tuple2((($author$project$Pages$Graph$View$edgeSize - 2) * 2) + 2, $author$project$Pages$Graph$View$edgeSize - 2));
				var width = _v1.a;
				var height = _v1.b;
				return A2(
					$author$project$Svg$Styled$rect,
					_List_fromArray(
						[
							$author$project$Svg$Styled$Attributes$x(
							$elm$core$String$fromInt(
								(x * $author$project$Pages$Graph$View$edgeSize) + (isPath ? (middle - 1) : 0))),
							$author$project$Svg$Styled$Attributes$y(
							$elm$core$String$fromInt(
								(y * $author$project$Pages$Graph$View$edgeSize) + (isPath ? (middle - 1) : 0))),
							$author$project$Svg$Styled$Attributes$width(
							$elm$core$String$fromInt(width)),
							$author$project$Svg$Styled$Attributes$height(
							$elm$core$String$fromInt(height)),
							(!isPath) ? $author$project$Pages$Graph$View$whiteColorAttr : ((!A2(
							$elm$core$Maybe$withDefault,
							0,
							A2(
								$elm$core$Dict$get,
								_Utils_Tuple2(
									_Utils_Tuple2(from.o, from.p),
									_Utils_Tuple2(to.o, to.p)),
								visited))) ? $author$project$Pages$Graph$View$blueCollorAttr : (A2(
							$elm$core$List$member,
							{ak: from, av: to},
							beginEndPath) ? $author$project$Pages$Graph$View$greenCollorAttr : $author$project$Pages$Graph$View$redCollorAttr))
						]),
					_List_Nil);
			});
		return A2(
			$author$project$Svg$Styled$svg,
			_List_fromArray(
				[
					$author$project$Svg$Styled$Attributes$width(
					$elm$core$String$fromInt($author$project$Pages$Graph$View$svgSize_)),
					$author$project$Svg$Styled$Attributes$height(
					$elm$core$String$fromInt($author$project$Pages$Graph$View$svgSize_))
				]),
			A2(
				$elm$core$List$map,
				function (_v0) {
					var from = _v0.ak;
					var to = _v0.av;
					return A2(drawRect, from, to);
				},
				path));
	});
var $author$project$Html$Styled$h1 = $author$project$Html$Styled$node('h1');
var $author$project$Svg$Styled$Attributes$viewBox = $author$project$VirtualDom$Styled$attribute('viewBox');
var $author$project$Pages$Graph$View$view = function (model) {
	return A2(
		$author$project$Html$Styled$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$author$project$Html$Styled$div,
				_List_fromArray(
					[
						$author$project$Html$Styled$Attributes$class('row')
					]),
				_List_fromArray(
					[
						A2(
						$author$project$Html$Styled$div,
						_List_fromArray(
							[
								$author$project$Html$Styled$Attributes$class('col')
							]),
						_List_fromArray(
							[
								A2(
								$author$project$Html$Styled$h1,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$Html$Styled$text(model.cD)
									])),
								A2(
								$author$project$Html$Styled$div,
								_List_fromArray(
									[
										$author$project$Html$Styled$Attributes$css(
										_List_fromArray(
											[
												$author$project$Css$displayFlex,
												$author$project$Css$alignItems($author$project$Css$center),
												$author$project$Css$justifyContent($author$project$Css$center)
											])),
										$author$project$Html$Styled$Attributes$id('canvaAnimation')
									]),
								_List_fromArray(
									[
										A2(
										$author$project$Svg$Styled$svg,
										_List_fromArray(
											[
												$author$project$Svg$Styled$Attributes$width(
												$elm$core$String$fromInt($author$project$Pages$Graph$View$svgSize_)),
												$author$project$Svg$Styled$Attributes$height(
												$elm$core$String$fromInt($author$project$Pages$Graph$View$svgSize_)),
												$author$project$Svg$Styled$Attributes$viewBox(
												A2(
													$elm$core$String$join,
													' ',
													A2(
														$elm$core$List$map,
														$elm$core$String$fromInt,
														_List_fromArray(
															[0, 0, $author$project$Pages$Graph$View$svgSize_, $author$project$Pages$Graph$View$svgSize_]))))
											]),
										_List_fromArray(
											[
												A2(
												$author$project$Svg$Styled$rect,
												_List_fromArray(
													[
														$author$project$Svg$Styled$Attributes$width(
														$elm$core$String$fromInt($author$project$Pages$Graph$View$svgSize_)),
														$author$project$Svg$Styled$Attributes$height(
														$elm$core$String$fromInt($author$project$Pages$Graph$View$svgSize_))
													]),
												_List_Nil),
												A4($author$project$Pages$Graph$View$drawMazeFromListEdges, model.b7, _List_Nil, false, $elm$core$Dict$empty),
												A4($author$project$Pages$Graph$View$drawMazeFromListEdges, model.bN, model.bw, true, model.bM),
												A3($author$project$Pages$Graph$View$drawInvisibleClickableSquares, model.bL, model.bx, model.bR)
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Html$Styled$h3 = $author$project$Html$Styled$node('h3');
var $author$project$Pages$Home$view = function () {
	var sortMethods = A2(
		$elm$core$List$map,
		function (_v0) {
			var sortName = _v0.b.dy;
			return sortName;
		},
		$elm$core$Dict$toList($author$project$Pages$Sort$Model$sortInfos));
	return A2(
		$author$project$Html$Styled$div,
		_List_fromArray(
			[
				$author$project$Html$Styled$Attributes$class('row')
			]),
		_List_fromArray(
			[
				A2(
				$author$project$Html$Styled$div,
				_List_fromArray(
					[
						$author$project$Html$Styled$Attributes$class('col')
					]),
				_List_fromArray(
					[
						A2(
						$author$project$Html$Styled$h1,
						_List_Nil,
						_List_fromArray(
							[
								$author$project$Html$Styled$text('Algorithms in elm')
							])),
						A2(
						$author$project$Html$Styled$h3,
						_List_Nil,
						_List_fromArray(
							[
								$author$project$Html$Styled$text('Sort Algorithms')
							])),
						A2(
						$author$project$Html$Styled$ul,
						_List_Nil,
						A2(
							$elm$core$List$map,
							function (sm) {
								return A2(
									$author$project$Html$Styled$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$author$project$Html$Styled$a,
											_List_fromArray(
												[
													$author$project$Route$href(
													$author$project$Route$SortAlgorithmsPage(sm))
												]),
											_List_fromArray(
												[
													$author$project$Html$Styled$text(sm)
												]))
										]));
							},
							sortMethods))
					]))
			]));
}();
var $author$project$Pages$Maze$View$blueCollorAttr = $author$project$Svg$Styled$Attributes$fill('blue');
var $author$project$Pages$Maze$View$svgSize_ = 512;
var $author$project$Pages$Maze$View$edgeSize = ($author$project$Pages$Maze$View$svgSize_ / 32) | 0;
var $author$project$Pages$Maze$View$whiteColorAttr = $author$project$Svg$Styled$Attributes$fill('white');
var $author$project$Pages$Maze$View$drawMazeFromListEdges = F2(
	function (path, beginEnd) {
		var drawRect = F2(
			function (from, to) {
				var y = A2($elm$core$Basics$min, from.p, to.p) + 1;
				var x = A2($elm$core$Basics$min, from.o, to.o) + 1;
				var middle = ($author$project$Pages$Maze$View$edgeSize / 2) | 0;
				var _v1 = beginEnd ? (_Utils_eq(from.o, to.o) ? _Utils_Tuple2(2, $author$project$Pages$Maze$View$edgeSize + 1) : _Utils_Tuple2($author$project$Pages$Maze$View$edgeSize + 1, 2)) : (_Utils_eq(from.o, to.o) ? _Utils_Tuple2($author$project$Pages$Maze$View$edgeSize - 2, (($author$project$Pages$Maze$View$edgeSize - 2) * 2) + 2) : _Utils_Tuple2((($author$project$Pages$Maze$View$edgeSize - 2) * 2) + 2, $author$project$Pages$Maze$View$edgeSize - 2));
				var width = _v1.a;
				var height = _v1.b;
				return A2(
					$author$project$Svg$Styled$rect,
					_List_fromArray(
						[
							$author$project$Svg$Styled$Attributes$x(
							$elm$core$String$fromInt(
								(x * $author$project$Pages$Maze$View$edgeSize) + (beginEnd ? (middle - 1) : 0))),
							$author$project$Svg$Styled$Attributes$y(
							$elm$core$String$fromInt(
								(y * $author$project$Pages$Maze$View$edgeSize) + (beginEnd ? (middle - 1) : 0))),
							$author$project$Svg$Styled$Attributes$width(
							$elm$core$String$fromInt(width)),
							$author$project$Svg$Styled$Attributes$height(
							$elm$core$String$fromInt(height)),
							beginEnd ? $author$project$Pages$Maze$View$blueCollorAttr : $author$project$Pages$Maze$View$whiteColorAttr
						]),
					_List_Nil);
			});
		return A2(
			$author$project$Svg$Styled$svg,
			_List_fromArray(
				[
					$author$project$Svg$Styled$Attributes$width(
					$elm$core$String$fromInt($author$project$Pages$Maze$View$svgSize_)),
					$author$project$Svg$Styled$Attributes$height(
					$elm$core$String$fromInt($author$project$Pages$Maze$View$svgSize_))
				]),
			A2(
				$elm$core$List$map,
				function (_v0) {
					var from = _v0.ak;
					var to = _v0.av;
					return A2(drawRect, from, to);
				},
				path));
	});
var $author$project$Pages$Maze$View$view = function (model) {
	return A2(
		$author$project$Html$Styled$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$author$project$Html$Styled$div,
				_List_fromArray(
					[
						$author$project$Html$Styled$Attributes$class('row')
					]),
				_List_fromArray(
					[
						A2(
						$author$project$Html$Styled$div,
						_List_fromArray(
							[
								$author$project$Html$Styled$Attributes$class('col')
							]),
						_List_fromArray(
							[
								A2(
								$author$project$Html$Styled$h1,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$Html$Styled$text(model.cD)
									])),
								A2(
								$author$project$Html$Styled$div,
								_List_fromArray(
									[
										$author$project$Html$Styled$Attributes$css(
										_List_fromArray(
											[
												$author$project$Css$displayFlex,
												$author$project$Css$alignItems($author$project$Css$center),
												$author$project$Css$justifyContent($author$project$Css$center)
											])),
										$author$project$Html$Styled$Attributes$id('canvaAnimation')
									]),
								_List_fromArray(
									[
										A2(
										$author$project$Svg$Styled$svg,
										_List_fromArray(
											[
												$author$project$Svg$Styled$Attributes$width(
												$elm$core$String$fromInt($author$project$Pages$Maze$View$svgSize_)),
												$author$project$Svg$Styled$Attributes$height(
												$elm$core$String$fromInt($author$project$Pages$Maze$View$svgSize_)),
												$author$project$Svg$Styled$Attributes$viewBox(
												A2(
													$elm$core$String$join,
													' ',
													A2(
														$elm$core$List$map,
														$elm$core$String$fromInt,
														_List_fromArray(
															[0, 0, $author$project$Pages$Maze$View$svgSize_, $author$project$Pages$Maze$View$svgSize_]))))
											]),
										_List_fromArray(
											[
												A2(
												$author$project$Svg$Styled$rect,
												_List_fromArray(
													[
														$author$project$Svg$Styled$Attributes$width(
														$elm$core$String$fromInt($author$project$Pages$Maze$View$svgSize_)),
														$author$project$Svg$Styled$Attributes$height(
														$elm$core$String$fromInt($author$project$Pages$Maze$View$svgSize_))
													]),
												_List_Nil),
												A2($author$project$Pages$Maze$View$drawMazeFromListEdges, model.bN, false)
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Sort$Update$Advance = {$: 4};
var $author$project$Pages$Sort$Update$Back = {$: 3};
var $author$project$Pages$Sort$Update$ChangeLength = function (a) {
	return {$: 5, a: a};
};
var $author$project$Pages$Sort$Update$Continue = {$: 2};
var $author$project$Pages$Sort$Update$Pause = {$: 1};
var $author$project$Html$Styled$Attributes$attribute = $author$project$VirtualDom$Styled$attribute;
var $elm$json$Json$Encode$bool = _Json_wrap;
var $author$project$Html$Styled$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			$author$project$VirtualDom$Styled$property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $author$project$Html$Styled$Attributes$disabled = $author$project$Html$Styled$Attributes$boolProperty('disabled');
var $author$project$Pages$Sort$View$getColor = F4(
	function (i, bh, l, r) {
		return _Utils_eq(i, l) ? $author$project$Svg$Styled$Attributes$fill('red') : (_Utils_eq(i, r) ? $author$project$Svg$Styled$Attributes$fill('yellow') : (_Utils_eq(i, bh) ? $author$project$Svg$Styled$Attributes$fill('green') : $author$project$Svg$Styled$Attributes$fill('black')));
	});
var $author$project$Pages$Sort$View$height_ = 256;
var $author$project$Pages$Sort$View$width_ = 512;
var $author$project$Pages$Sort$View$drawRects = F3(
	function (listToBeSorted, left, right) {
		var qty = $elm$core$List$length(listToBeSorted);
		var w = ($author$project$Pages$Sort$View$width_ / qty) | 0;
		var h = ($author$project$Pages$Sort$View$height_ / qty) | 0;
		return A2(
			$elm$core$List$indexedMap,
			F2(
				function (index, barHeight) {
					return A2(
						$author$project$Svg$Styled$rect,
						_List_fromArray(
							[
								$author$project$Svg$Styled$Attributes$x(
								$elm$core$String$fromInt(index * w)),
								$author$project$Svg$Styled$Attributes$y(
								$elm$core$String$fromInt($author$project$Pages$Sort$View$height_ - ((barHeight + 1) * h))),
								$author$project$Svg$Styled$Attributes$width(
								$elm$core$String$fromInt(w)),
								$author$project$Svg$Styled$Attributes$height(
								$elm$core$String$fromInt((barHeight + 1) * h)),
								A4($author$project$Pages$Sort$View$getColor, index, barHeight, left, right)
							]),
						_List_Nil);
				}),
			listToBeSorted);
	});
var $author$project$Html$Styled$h2 = $author$project$Html$Styled$node('h2');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $feathericons$elm_feather$FeatherIcons$Icon = $elm$core$Basics$identity;
var $feathericons$elm_feather$FeatherIcons$defaultAttributes = function (name) {
	return {
		aU: $elm$core$Maybe$Just('feather feather-' + name),
		ct: 24,
		aM: '',
		a3: 2,
		a5: '0 0 24 24'
	};
};
var $feathericons$elm_feather$FeatherIcons$makeBuilder = F2(
	function (name, src) {
		return {
			q: $feathericons$elm_feather$FeatherIcons$defaultAttributes(name),
			u: src
		};
	});
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $feathericons$elm_feather$FeatherIcons$info = A2(
	$feathericons$elm_feather$FeatherIcons$makeBuilder,
	'info',
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$circle,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$cx('12'),
					$elm$svg$Svg$Attributes$cy('12'),
					$elm$svg$Svg$Attributes$r('10')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$line,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1('12'),
					$elm$svg$Svg$Attributes$y1('16'),
					$elm$svg$Svg$Attributes$x2('12'),
					$elm$svg$Svg$Attributes$y2('12')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$line,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1('12'),
					$elm$svg$Svg$Attributes$y1('8'),
					$elm$svg$Svg$Attributes$x2('12.01'),
					$elm$svg$Svg$Attributes$y2('8')
				]),
			_List_Nil)
		]));
var $author$project$Html$Styled$input = $author$project$Html$Styled$node('input');
var $author$project$Html$Styled$Attributes$max = $author$project$Html$Styled$Attributes$stringProperty('max');
var $author$project$Html$Styled$Attributes$min = $author$project$Html$Styled$Attributes$stringProperty('min');
var $author$project$VirtualDom$Styled$keyedNode = $author$project$VirtualDom$Styled$KeyedNode;
var $author$project$Html$Styled$Keyed$node = $author$project$VirtualDom$Styled$keyedNode;
var $author$project$Html$Styled$Events$onClick = function (msg) {
	return A2(
		$author$project$Html$Styled$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Html$Styled$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $author$project$Html$Styled$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$author$project$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Html$Styled$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $author$project$Html$Styled$Events$onInput = function (tagger) {
	return A2(
		$author$project$Html$Styled$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$author$project$Html$Styled$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $author$project$Html$Styled$Events$targetValue)));
};
var $author$project$Html$Styled$code = $author$project$Html$Styled$node('code');
var $elm$virtual_dom$VirtualDom$lazy2 = _VirtualDom_lazy2;
var $author$project$VirtualDom$Styled$lazyHelp = F2(
	function (fn, arg) {
		return $author$project$VirtualDom$Styled$toUnstyled(
			fn(arg));
	});
var $author$project$VirtualDom$Styled$lazy = F2(
	function (fn, arg) {
		return $author$project$VirtualDom$Styled$Unstyled(
			A3($elm$virtual_dom$VirtualDom$lazy2, $author$project$VirtualDom$Styled$lazyHelp, fn, arg));
	});
var $author$project$Html$Styled$Lazy$lazy = $author$project$VirtualDom$Styled$lazy;
var $author$project$Pages$Sort$View$showCode = function (strCode) {
	var f = function (x) {
		return A2(
			$author$project$Html$Styled$code,
			_List_fromArray(
				[
					$author$project$Html$Styled$Attributes$class('elm')
				]),
			_List_fromArray(
				[
					$author$project$Html$Styled$text(x)
				]));
	};
	return _Utils_Tuple2(
		strCode,
		A2($author$project$Html$Styled$Lazy$lazy, f, strCode));
};
var $author$project$Html$Styled$Attributes$step = function (n) {
	return A2($author$project$Html$Styled$Attributes$stringProperty, 'step', n);
};
var $author$project$VirtualDom$Styled$unstyledNode = $author$project$VirtualDom$Styled$Unstyled;
var $author$project$Html$Styled$fromUnstyled = $author$project$VirtualDom$Styled$unstyledNode;
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$map = $elm$virtual_dom$VirtualDom$map;
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeLinecap = _VirtualDom_attribute('stroke-linecap');
var $elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $feathericons$elm_feather$FeatherIcons$toHtml = F2(
	function (attributes, _v0) {
		var src = _v0.u;
		var attrs = _v0.q;
		var strSize = $elm$core$String$fromFloat(attrs.ct);
		var baseAttributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$fill('none'),
				$elm$svg$Svg$Attributes$height(
				_Utils_ap(strSize, attrs.aM)),
				$elm$svg$Svg$Attributes$width(
				_Utils_ap(strSize, attrs.aM)),
				$elm$svg$Svg$Attributes$stroke('currentColor'),
				$elm$svg$Svg$Attributes$strokeLinecap('round'),
				$elm$svg$Svg$Attributes$strokeLinejoin('round'),
				$elm$svg$Svg$Attributes$strokeWidth(
				$elm$core$String$fromFloat(attrs.a3)),
				$elm$svg$Svg$Attributes$viewBox(attrs.a5)
			]);
		var combinedAttributes = _Utils_ap(
			function () {
				var _v1 = attrs.aU;
				if (!_v1.$) {
					var c = _v1.a;
					return A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$class(c),
						baseAttributes);
				} else {
					return baseAttributes;
				}
			}(),
			attributes);
		return A2(
			$elm$svg$Svg$svg,
			combinedAttributes,
			A2(
				$elm$core$List$map,
				$elm$svg$Svg$map($elm$core$Basics$never),
				src));
	});
var $author$project$Utils$IconUtils$toStyledHtml = function (icon) {
	return $author$project$Html$Styled$fromUnstyled(
		A2($feathericons$elm_feather$FeatherIcons$toHtml, _List_Nil, icon));
};
var $author$project$Html$Styled$Attributes$type_ = $author$project$Html$Styled$Attributes$stringProperty('type');
var $author$project$Html$Styled$Attributes$value = $author$project$Html$Styled$Attributes$stringProperty('value');
var $author$project$Pages$Sort$View$view = function (model) {
	var currentStep = $elm$core$Array$isEmpty(model.cx) ? model.b6 : $elm$core$Array$toList(model.bI);
	var _v0 = model;
	var sortInfo = _v0.cw;
	return A2(
		$author$project$Html$Styled$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$author$project$Html$Styled$div,
				_List_fromArray(
					[
						$author$project$Html$Styled$Attributes$class('row')
					]),
				_List_fromArray(
					[
						A2(
						$author$project$Html$Styled$div,
						_List_fromArray(
							[
								$author$project$Html$Styled$Attributes$class('col')
							]),
						_List_fromArray(
							[
								A2(
								$author$project$Html$Styled$h1,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$Html$Styled$text(sortInfo.dy)
									])),
								A2(
								$author$project$Html$Styled$h2,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$Html$Styled$text(
										$elm$core$String$fromInt(model.b5) + ' Elements')
									])),
								A2(
								$author$project$Html$Styled$input,
								_List_fromArray(
									[
										$author$project$Html$Styled$Attributes$type_('range'),
										$author$project$Html$Styled$Attributes$class('form-control-range'),
										$author$project$Html$Styled$Attributes$min('1'),
										$author$project$Html$Styled$Attributes$max(
										$elm$core$String$fromInt(sortInfo.aZ)),
										$author$project$Html$Styled$Attributes$step('1'),
										$author$project$Html$Styled$Events$onInput($author$project$Pages$Sort$Update$ChangeLength),
										$author$project$Html$Styled$Attributes$value(
										$elm$core$String$fromInt(model.b5))
									]),
								_List_Nil),
								A2(
								$author$project$Html$Styled$h2,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$Html$Styled$text(
										$elm$core$String$fromInt(model.bZ) + ' Steps '),
										A2(
										$author$project$Html$Styled$span,
										_List_fromArray(
											[
												A2($author$project$Html$Styled$Attributes$attribute, 'data-toggle', 'tooltip'),
												A2($author$project$Html$Styled$Attributes$attribute, 'data-placement', 'right'),
												A2($author$project$Html$Styled$Attributes$attribute, 'title', 'This number is a estimate number only and does not reflect the real number of steps. I just generate all steps and iterate to create an animation.')
											]),
										_List_fromArray(
											[
												$author$project$Utils$IconUtils$toStyledHtml($feathericons$elm_feather$FeatherIcons$info)
											]))
									])),
								A2(
								$author$project$Html$Styled$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$author$project$Svg$Styled$svg,
										_List_fromArray(
											[
												$author$project$Svg$Styled$Attributes$width('100%'),
												$author$project$Svg$Styled$Attributes$height('100%'),
												$author$project$Svg$Styled$Attributes$viewBox(
												A2(
													$elm$core$String$join,
													' ',
													A2(
														$elm$core$List$map,
														$elm$core$String$fromInt,
														_List_fromArray(
															[0, 0, $author$project$Pages$Sort$View$width_, $author$project$Pages$Sort$View$height_]))))
											]),
										A3($author$project$Pages$Sort$View$drawRects, currentStep, model.bF, model.bH))
									]))
							]))
					])),
				A2(
				$author$project$Html$Styled$div,
				_List_fromArray(
					[
						$author$project$Html$Styled$Attributes$class('row')
					]),
				_List_fromArray(
					[
						A2(
						$author$project$Html$Styled$div,
						_List_fromArray(
							[
								$author$project$Html$Styled$Attributes$class('col')
							]),
						_List_fromArray(
							[
								A2(
								$author$project$Html$Styled$button,
								_List_fromArray(
									[
										$author$project$Html$Styled$Events$onClick($author$project$Pages$Sort$Update$Shuffle),
										$author$project$Html$Styled$Attributes$class('btn mx-1 btn-dark')
									]),
								_List_fromArray(
									[
										$author$project$Html$Styled$text('Shuffle')
									])),
								A2(
								$author$project$Html$Styled$button,
								_List_fromArray(
									[
										$author$project$Html$Styled$Events$onClick($author$project$Pages$Sort$Update$Back),
										$author$project$Html$Styled$Attributes$disabled(model.bZ <= 0),
										$author$project$Html$Styled$Attributes$class('btn mx-1 btn-dark')
									]),
								_List_fromArray(
									[
										$author$project$Html$Styled$text('<')
									])),
								A2(
								$author$project$Html$Styled$button,
								_List_fromArray(
									[
										$author$project$Html$Styled$Events$onClick($author$project$Pages$Sort$Update$Pause),
										$author$project$Html$Styled$Attributes$disabled(model.cd),
										$author$project$Html$Styled$Attributes$class('btn mx-1 btn-dark')
									]),
								_List_fromArray(
									[
										$author$project$Html$Styled$text('Pause')
									])),
								A2(
								$author$project$Html$Styled$button,
								_List_fromArray(
									[
										$author$project$Html$Styled$Events$onClick($author$project$Pages$Sort$Update$Continue),
										$author$project$Html$Styled$Attributes$disabled(!model.cd),
										$author$project$Html$Styled$Attributes$class('btn mx-1 btn-dark')
									]),
								_List_fromArray(
									[
										$author$project$Html$Styled$text('Continue')
									])),
								A2(
								$author$project$Html$Styled$button,
								_List_fromArray(
									[
										$author$project$Html$Styled$Events$onClick($author$project$Pages$Sort$Update$Advance),
										$author$project$Html$Styled$Attributes$disabled(
										(_Utils_cmp(
											model.bZ,
											$elm$core$Array$length(model.cx)) > -1) || $elm$core$Array$isEmpty(model.cx)),
										$author$project$Html$Styled$Attributes$class('btn mx-1 btn-dark')
									]),
								_List_fromArray(
									[
										$author$project$Html$Styled$text('>')
									]))
							]))
					])),
				A2(
				$author$project$Html$Styled$div,
				_List_fromArray(
					[
						$author$project$Html$Styled$Attributes$class('row')
					]),
				_List_fromArray(
					[
						A2(
						$author$project$Html$Styled$div,
						_List_fromArray(
							[
								$author$project$Html$Styled$Attributes$class('col')
							]),
						_List_fromArray(
							[
								A2(
								$author$project$Html$Styled$h2,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$Html$Styled$text('Code '),
										A2(
										$author$project$Html$Styled$span,
										_List_fromArray(
											[
												A2($author$project$Html$Styled$Attributes$attribute, 'data-toggle', 'tooltip'),
												A2($author$project$Html$Styled$Attributes$attribute, 'data-placement', 'right'),
												A2($author$project$Html$Styled$Attributes$attribute, 'title', 'The steps above is not implemented using the code below. it implements a messy code in the repository. Check it out ;D')
											]),
										_List_fromArray(
											[
												$author$project$Utils$IconUtils$toStyledHtml($feathericons$elm_feather$FeatherIcons$info)
											]))
									])),
								A3(
								$author$project$Html$Styled$Keyed$node,
								'pre',
								_List_Nil,
								_List_fromArray(
									[
										$author$project$Pages$Sort$View$showCode(model.bE)
									]))
							]))
					]))
			]));
};
var $author$project$View$view = function (model) {
	var currentPage = function () {
		var _v0 = model.bG;
		switch (_v0.$) {
			case 0:
				var sortmodel = _v0.a;
				return A2(
					$author$project$Html$Styled$map,
					$author$project$Update$SubPageMsg,
					A2(
						$author$project$Html$Styled$map,
						$author$project$Update$SortMsg,
						$author$project$Pages$Sort$View$view(sortmodel)));
			case 1:
				var graphModel = _v0.a;
				return A2(
					$author$project$Html$Styled$map,
					$author$project$Update$SubPageMsg,
					A2(
						$author$project$Html$Styled$map,
						$author$project$Update$GraphMsg,
						$author$project$Pages$Graph$View$view(graphModel)));
			case 2:
				var mazeModel = _v0.a;
				return A2(
					$author$project$Html$Styled$map,
					$author$project$Update$SubPageMsg,
					A2(
						$author$project$Html$Styled$map,
						$author$project$Update$MazeMsg,
						$author$project$Pages$Maze$View$view(mazeModel)));
			default:
				return $author$project$Pages$Home$view;
		}
	}();
	return {
		cQ: A2(
			$elm$core$List$map,
			$author$project$Html$Styled$toUnstyled,
			_List_fromArray(
				[
					A2(
					$author$project$Html$Styled$div,
					_List_fromArray(
						[
							$author$project$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$author$project$Css$marginBottom(
									$author$project$Css$px(25))
								]))
						]),
					_List_fromArray(
						[
							$author$project$View$navbar(model.cI),
							A2(
							$author$project$Html$Styled$div,
							_List_fromArray(
								[
									$author$project$Html$Styled$Attributes$class('container')
								]),
							_List_fromArray(
								[currentPage])),
							$author$project$View$footerBar
						]))
				])),
		cD: 'Elm algorithms'
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{c8: $author$project$Update$init, dm: $author$project$Update$UrlChanged, dn: $author$project$Update$LinkClicked, dD: $author$project$Subscriptions$subscriptions, dH: $author$project$Update$update, dJ: $author$project$View$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));
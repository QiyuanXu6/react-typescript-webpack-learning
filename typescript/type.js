//1.交叉类型 Intersection Types
/*交叉类型是将多个类型合并为一个类型。
 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性
 */
function Extent(first, second) {
    var result = {};
    for (var id in first) {
        if (first.hasOwnProperty(id)) {
            result[id] = first[id];
        }
    }
    for (var id in second) {
        if (second.hasOwnProperty(id)) {
            if (!result.hasOwnProperty(id)) {
                result[id] = second[id];
            }
        }
    }
    return result;
}
function getStr(obj) {
    var r = "";
    for (var key in obj) {
        r += key + ":" + obj[key] + ";";
    }
    return r;
}
console.log("交叉类型:" + getStr(Extent(4, "string"))); //{ '0': 's', '1': 't', '2': 'r', '3': 'i', '4': 'n', '5': 'g' }
function getSmallPet() {
    return {
        fly: function () {
            console.log("fly");
        },
        layEggs: function () {
            console.log("layEggs");
        },
        swim: function () {
            console.log("swim");
        }
    };
}
/**注意TypeScript不仅知道在if分支里pet是Fish类型；
 * 它还清楚在 else分支里，一定不是Fish类型，一定是Bird类型。
 *
 * 1,直接用接口来判断类型不太合理，用类来实现接口，然后进行判断比较正规
 * 2,常量对象可以符合联合类型的需求，但不能用instanceof来判断，new出来的对象可以。原因可能没带构造函数等Object信息*/
function isFish(pet) {
    return pet.swim !== undefined;
}
var pet = getSmallPet(); //如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员
pet.layEggs(); //layEggs
if (pet) {
    pet.fly(); //fly
}
if (isFish(pet)) {
    pet.swim(); //swim
}
else {
    pet.fly();
}
//3,typeof类型保护
/**这些*typeof类型保护*只有两种形式能被识别：
 * typeof v === "typename"和typeof v !== "typename"，
 * "typename"必须是"number"，"string"，"boolean"或"symbol"。
 * 但是TypeScript并不会阻止你与其它字符串比较，语言不会把那些表达式识别为类型保护。*/
function padLeft(value, padding) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error("Expected string or number, got '" + padding + "'.");
}
var SpaceRepeatingPad = /** @class */ (function () {
    function SpaceRepeatingPad(numSpaces) {
        this.numSpaces = numSpaces;
    }
    SpaceRepeatingPad.prototype.getPaddingString = function () {
        return Array(this.numSpaces + 1).join("hello ");
    };
    return SpaceRepeatingPad;
}());
var StringPad = /** @class */ (function () {
    function StringPad(value) {
        this.value = value;
    }
    StringPad.prototype.getPaddingString = function () {
        return this.value;
    };
    return StringPad;
}());
function getRandomPad() {
    return Math.random() < 0.5 ?
        new SpaceRepeatingPad(4) :
        new StringPad("StringPad");
}
// 类型为SpaceRepeatingPad | StringPad
var pad = getRandomPad();
if (pad instanceof SpaceRepeatingPad) {
    console.log(pad.getPaddingString()); // 类型细化为'SpaceRepeatingPadder'
}
if (pad instanceof StringPad) {
    console.log(pad.getPaddingString()); // 类型细化为'StringPadder'
}
//5,可以为null的类型
/**可选参数和可选属性
 使用了--strictNullChecks，可选参数会被自动地加上| undefined:*/
// let s = "foo";
// s = null; // 错误, 'null'不能赋值给'string'
var sn = "bar"; //console.log(sn);//bar
sn = null; // 可以
if (sn) { //能过滤掉null类型
    console.log(sn); //null
}
//如果编译器不能够去除null或undefined，你可以使用类型断言手动去除。 语法是添加 !
function fixed(name) {
    function postfix(epithet) {
        return name.charAt(0) + '.  the ' + epithet; // ok
    }
    name = name || "Bob";
    return postfix("great");
}
console.log(fixed("hello")); //h.  the great
function getName(n) {
    if (typeof n === 'string') {
        return n;
    }
    else {
        return n();
    }
}
//8,多态的this类型
/**使用了this类型，你可以继承它，新的类可以直接使用之前的方法，不需要做任何的改变。*/
var BasicCalculator = /** @class */ (function () {
    function BasicCalculator(value) {
        if (value === void 0) { value = 0; }
        this.value = value;
    }
    BasicCalculator.prototype.currentValue = function () {
        return this.value;
    };
    BasicCalculator.prototype.add = function (operand) {
        this.value += operand;
        return this;
    };
    BasicCalculator.prototype.multiply = function (operand) {
        this.value *= operand;
        return this;
    };
    return BasicCalculator;
}());
var v = new BasicCalculator(2)
    .multiply(5)
    .add(1)
    .currentValue();
var person = {
    name: 'Jarid',
    name2: "hello",
    age: 35
};
function pluckOld(o, names) {
    return names.map(function (n) { return o[n] + "hello"; }); //这里怎么写都没问题
}
var pOld = pluckOld(person, ["name", "age", "add"]); //参数怎么给都行
console.log(pOld); //[ 'Jaridhello', '35hello', 'undefinedhello' ]
function pluck(o, names) {
    return names.map(function (n) {
        if (typeof o[n] == "string") {
            return o[n]; //如果返回T[K]类型的数组，那么这里怎么改都不行，只能是o[n]
        }
        else {
            return o[n];
        }
    });
}
var strings = pluck(person, ['name', "name2"]); //[ 'Jarid', 'hello' ]
console.log(strings);
var k = "name";
console.log(k); //name
var keys = "hello"; // string
var value = 32; // number
console.log(value); //32
//10,映射类型
var p33 = {
    name: 'Jarid',
    name2: "hello",
    age: 35
};
var p34 = {
    name: 'Jarid'
};
var p35 = {
    name: "hello"
};
var p36 = {
    hello: p33
};
console.log(p36["hello"]); //{ name: 'Jarid', name2: 'hello', age: 35 }

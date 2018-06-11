//1.交叉类型 Intersection Types
/*交叉类型是将多个类型合并为一个类型。
 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性
 */

  function Extent<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
      if (first.hasOwnProperty(id)) {
        result[id] = (<any>first)[id];
      }
    }
    for (let id in second) {
      if (second.hasOwnProperty(id)) {
        if (!result.hasOwnProperty(id)) {
          result[id] = (<any>second)[id];
        }
      }
    }
    return result;
  }
  
  function getStr(obj: Object): string {
    let r: string = "";
    for (let key in obj) {
      r += `${key}:${obj[key]};`;
    }
    return r;
  }
  console.log("交叉类型:" + getStr(Extent(4, "string")));//{ '0': 's', '1': 't', '2': 'r', '3': 'i', '4': 'n', '5': 'g' }
  
  //2,联合类型（Union Types)
  interface Bird {
    fly();
    layEggs();
  }
  
  interface Fish {
    swim();
    layEggs();
  }
  type animal = Fish | Bird;
  function getSmallPet(): animal {
    return {
      fly(){
        console.log("fly");
      },
      layEggs(){
        console.log("layEggs");
      },
      swim(){
        console.log("swim");
      }
    }
  }
  /**注意TypeScript不仅知道在if分支里pet是Fish类型；
   * 它还清楚在 else分支里，一定不是Fish类型，一定是Bird类型。
   *
   * 1,直接用接口来判断类型不太合理，用类来实现接口，然后进行判断比较正规
   * 2,常量对象可以符合联合类型的需求，但不能用instanceof来判断，new出来的对象可以。原因可能没带构造函数等Object信息*/
  function isFish(pet: Fish | Bird): pet is Fish {//pet is Fish就是类型谓词。 谓词为 parameterName is Type这种形式，
    return (<Fish>pet).swim !== undefined;
  }
  let pet = getSmallPet();//如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员
  pet.layEggs();       //layEggs
  if (<Bird>pet) {
    (pet as Bird).fly();//fly
  }
  if (isFish(pet)) {
    (pet as Fish).swim();//swim
  } else {
    pet.fly();
  }
  //3,typeof类型保护
  /**这些*typeof类型保护*只有两种形式能被识别：
   * typeof v === "typename"和typeof v !== "typename"，
   * "typename"必须是"number"，"string"，"boolean"或"symbol"。
   * 但是TypeScript并不会阻止你与其它字符串比较，语言不会把那些表达式识别为类型保护。*/
  function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
      return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
      return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
  }
  
  //4,instanceof类型保护
  /**instanceof的右侧要求是一个构造函数，TypeScript将细化为:
   * 1,此构造函数的prototype属性的类型，如果它的类型不为any的话
   * 2,构造签名所返回的类型的联合*/
  interface Pad {
    getPaddingString(): string
  }
  
  class SpaceRepeatingPad implements Pad {
    constructor(private numSpaces: number) {
    }
  
    getPaddingString() {
      return Array(this.numSpaces + 1).join("hello ");
    }
  }
  
  class StringPad implements Pad {
    constructor(private value: string) {
    }
  
    getPaddingString() {
      return this.value;
    }
  }
  
  function getRandomPad(): SpaceRepeatingPad | StringPad {
    return Math.random() < 0.5 ?
      new SpaceRepeatingPad(4) :
      new StringPad("StringPad");
  }
  
  // 类型为SpaceRepeatingPad | StringPad
  let pad: Pad = getRandomPad();
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
  let sn: string | null = "bar";//console.log(sn);//bar
  sn = null; // 可以
  if (sn) {//能过滤掉null类型
    console.log(sn);//null
  }
  //如果编译器不能够去除null或undefined，你可以使用类型断言手动去除。 语法是添加 !
  function fixed(name: string | null): string {
    function postfix(epithet: string) {
      return name!.charAt(0) + '.  the ' + epithet; // ok
    }
  
    name = name || "Bob";
    return postfix("great");
  }
  console.log(fixed("hello"));//h.  the great
  
  //6,类型别名
  /**类型别名不能出现在声明右侧的任何地方。
   * 接口 vs. 类型别名
   * 另一个重要区别是类型别名不能被extends和implements（自己也不能extends和implements其它类型）。
   * 因为 软件中的对象应该对于扩展是开放的，但是对于修改是封闭的，你应该尽量去使用接口代替类型别名。
   * 另一方面，如果你无法通过接口来描述一个类型并且需要使用联合类型或元组类型，这时通常会使用类型别名。*/
  type Int = (a: number) => {};
  type Name = string;
  type NameResolver = () => string;
  type NameOrResolver = Name | NameResolver;
  function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
      return n;
    }
    else {
      return n();
    }
  }
  
  //7,字符串字面量类型
  type Easing = "ease-in" | "ease-out" | "ease-in-out";
  
  //8,多态的this类型
  /**使用了this类型，你可以继承它，新的类可以直接使用之前的方法，不需要做任何的改变。*/
  
  class BasicCalculator {
    public constructor(protected value: number = 0) {
    }
  
    public currentValue(): number {
      return this.value;
    }
  
    public add(operand: number): this {
      this.value += operand;
      return this;
    }
  
    public multiply(operand: number): this {
      this.value *= operand;
      return this;
    }
  
    // ... other operations go here ...
  }
  
  let v = new BasicCalculator(2)
    .multiply(5)
    .add(1)
    .currentValue();
  
  //9,索引类型（Index types）
  interface PersonType {
    name: string;
    name2: string;
    age: number;
  }
  let person: PersonType = {
    name: 'Jarid',
    name2: "hello",
    age: 35
  };
  
  function pluckOld(o, names) {
    return names.map(n => o[n] + "hello");//这里怎么写都没问题
  }
  
  let pOld = pluckOld(person, ["name", "age", "add"]);//参数怎么给都行
  console.log(pOld);//[ 'Jaridhello', '35hello', 'undefinedhello' ]
  
  function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
    return names.map(n => {
      if (typeof o[n] == "string") {
        return o[n]//如果返回T[K]类型的数组，那么这里怎么改都不行，只能是o[n]
      }
      else {
        return o[n];
      }
    });
  }
  let strings: string[] = pluck(person, ['name', "name2"]);//[ 'Jarid', 'hello' ]
  console.log(strings);
  
  //索引类型和字符串索引签名
  type personKeys = keyof PersonType;
  let k: keyof PersonType = "name";
  console.log(k);//name
  
  interface Map<T> {
    [key: string]: T;
  }
  let keys: keyof Map<number> = "hello"; // string
  let value: Map<number>['foo'] = 32; // number
  console.log(value);//32
  
  //10,映射类型
  let p33: Readonly<PersonType> = {
    name: 'Jarid',
    name2: "hello",
    age: 35
  };
  let p34: Partial<PersonType> = {
    name: 'Jarid'
  };
  
  let p35: Pick<PersonType, "name"> = {
    name: "hello"
  };
  
  let p36: Record<string, PersonType> = {
    hello: p33
  };
  
  console.log(p36["hello"]);//{ name: 'Jarid', name2: 'hello', age: 35 }
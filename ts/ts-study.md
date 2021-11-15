#### 1. 为什么要使用 typescript 

js 是弱类型语言， 无法在编译阶段知道变量是什么类型

通过 typescript，在编译检查阶段就可以发现不匹配的变量类型

#### 2. 基础类型

- **boolean 类型**

    ```
    let isDone: boolean = false;
    ```
- **number 类型**
  
    ```
    let count: number = 1;
    ```
- **string 类型**

    ```
    let name: string = 'fengnian';
    ```
- **symbol 类型 ??**
  

- **undefined 类型 & null 类型**

    在 **ts** 中， **undefined** 和 **null** 两者各有自己的类型 **undefined** 和 **null**。

    和 **void** 类型一样， **undefined** 和 **null** 的用处不大。

    ```
    let u: undefined = undefined;  // 用处不大

    let u: null = null // 和 undefined 一样， 用处不大
    ```

    默认情况下，**undefined** 和 **null** 可以给除 **unknow**、**never** 以外的其他类型赋值。

    > 当我们在 **tsconfig.json** 的 **compilerOptions** 配置项中，设置 **strictNullChecks = true** 时, **undefined** 只能赋值给 **void** 和**自己**， 而 **null** 类型只能赋值给**自己**。

- **any 类型**

    任何类型都可以归为 **any** 类型，这使得 any 类型成为了类型系统的顶级类型。

    使用 **any** 类型，可以帮助我们**跳过 typescript 的类型检查**，这点在修改老代码却无法为变量指定一个类型时非常有用。

    滥用 **any** 类型，实际上是**屏蔽**了 **typescript** 的类型检查功能，违背了我们使用 **typescript** 的初衷。


    ```
    let u: any = 1;

    let u: any = 'fengnian';

    function func(params: any) {
        console.log(params);
    }

    ...
    ```

    在 **tsconfig.json** 的 **compilerOptions** 配置项中，我们可以通过配置 **noImplicitAny = true**，不允许代码中出现任何 any。

    > 设置 **noImplicitAny = true** 以后，给**变量**设置 **any** 类型不会报错，**函数**入参设置 **any** 类型会报错。

    > **注意，any 类型可以被其他任意类型赋值，也可以赋值给其他任意类型, 即 any 类型既可以作为所有类型的顶层类型，也可以作为所有类型(除 never 外) 的底层类型，这也导致了 any 类型基本放弃了类型检查。**


- **void 类型**
  
    某种程度上来讲， **void** 类型和 **any** 类型**相反**，表示没有任何类型。
    
    当一个**函数**没有**返回值**时，它的类型通常为 **void**。

    ```
    function func(): void {
        console.log('func');
    }
    ```

    声明 **void** 类型的**变量**没有什么意义，我们只能为它赋值 **undefined** 或者 **null**。(**严格模式**下，只能赋值 **undefined**)。
  
    ```
    let u: void = undefined || null;
    ```

    > **void 类型最大的意义就是用于定义没有返回值的函数。**

- **unknow 类型**

    就像 **any** 类型一样，任何类型都可以归为 **unknow** 类型， 这使得 **unkonw** 类型称为了类型系统的另一种**顶级类型**。

    任何类型，包括 **never**、**any** 类型，都可以赋值给 **unknow** 类型。

    和 **any** 类型不同的是，**unknow** 类型不能赋值给除 **any** 以外的其他类型，即 **unkonw** 类型只能赋值给 **unkonw** 类型和 **any** 类型。

    **unknow** 类型，意味着我们不知道变量的类型，那么对 **unknow** 类型的变量做**属性读取**、**方法调用**等操作都会报错。单独使用 **unknow** 类型没有任何实际意义，我们需要对 **unkonw** 类型做类型收敛，以得准确的**类型检查**。**unkonw** 类型要比 **any** 类型更加安全。

    类型收敛方式要再总结一下！！

    常用的类型收敛方式:
    - **typeof**;
    - **instanceof**;
    - **Array.isArray**;
    - ...
    - 

    **unkonw** 类型在做**类型收敛**之前，只能做**比较操作(===、 ==、 >=、 <=>)**，不能做**加减乘除**运算。

- **never 类型**

    **never** 类型表示那些**永不存在**的值的类型，例如 **never** 类型是那些总是会**抛出异常**或根本就**不会有返回值**的**函数表达式**或**箭头函数表达式**的返回值类型。

    **never** 类型可以赋值给任何类型，即 **never** 类型是任何类型的**子类型**。除了 **never** 类型，其他类型包括 **any** 类型都不可以赋值给 **never** 类型。(其实很好理解，**never** 表示用不存在的值，而 **any** 类型除了 **never** 类型，还可能是 **string**、**number** 等类型，所以 **any** 类型不能赋值给 **never** 类型)。

- **array 类型**
  
  ```
  let list: number[] = [1, 2, 3];

  let list: Array<string> = ['a', 'b', 'c'];
  ```
- **Tuple - 元祖类型**
  
   **Tuple - 元祖**类型表示一个已知**元素数量**和**类型**的数组，各个元素的类型不必相同。

   ```
   let list: [string, number] = ['a', 1]
   ```

   > **使用 Tuple - 元祖类型时，必须为每个类型提供值。**

- **object 类型**
  

- **enum 类型**
  
    使用**枚举**可以为一组数组赋予友好的名字。

    ```
    enum Color = { Red, Green, Yellow};

    let color: Color = Color.Red  // color = 0
    ```

    **枚举类型**编译以后的代码为:

    ```
    var Color;
    (function (Color) {
        Color[Color["red"] = 0] = "red";
        Color[Color["green"] = 1] = "green";
        Color[Color["yellow"] = 2] = "yellow";
    })(Color || (Color = {}));

    ```

    如果没有为**枚举元素**指定值，那么默认从 **0** 开始为**枚举元素**编号。我们可以为**枚举元素**指定为其它**数字**、**字符串**。

    > **注意，不能为枚举元素指定需要计算的值，如 1 + 2、boolean 类型、对象等**。

    使用**枚举类型**时，我们既可以通过**枚举元素**获取**值**，也可以通过**枚举值**获取对应的**枚举元素**(得到是**枚举元素**对应的**字符串**)。


#### 3. interface

**Typescript** 中 **interface** 是一个非常灵活的概念，除了可用于对**类的一部分行为进行抽象**以外，也常用于对**对象的形状**进行描述。

- **描述对象**
  
  ```
  interface T {
      name: string;
      age: number;
  }

  let student: T = { name: 'zjh', age: 30 };

  let student: T = { name: 'zjh', age: 30, phone: 'xxxxx'};  // error， T 中不存在 phone 属性
  ```
  使用 **interface** 类型时，变量需要和定义的 **interface** 完全匹配。

- **可选属性**
  
  ```
  interface T {
      name?: string;
      age?: number;
  }

  let student: T = { name: 'zjh'};

  let student: T = { name: 'zjh', phone: '********'};   // error， T 中不存在 phone 属性。 

  ```

  当 **interface** 中有**可选属性**时，我们可以在定义变量时**缺少**某个属性，但不能**多加**属性。

- **只读属性**
  
  ```
  interface T {
      readonly name: string;
  }
  ```

- **任意属性**
  
  ```
  interface T {
      [propName: string]: string | number | boolean;
  }
  ```

  **任意属性**是通过**索引签名**实现的。

- **interface 描述函数类型**
  
    **interface** 可以用来描述**函数类型**。

    ```
    interface Func {
        (param: number): string
    }
    ```

    **interface** 中的 **(param: T, ...)** 称为**调用签名**(??)。

- **interface 的 implement**
  
  我们可以通过一个**类**去实现一个 **interface**:

  ```
  interface T {
      count: number;
      setCount: (count: number) => void;
  }

  class C implements T {
      // count = 'string'  // error， count 的 类型为 number， C 未定义 count 也报错
      count = 0;
      // setCount = (count: string) => { ... }  // error， 入参应该为 number 类型， C 未定义 setCount 也报错
      setCount = (count: number) => { ... }
  }
  ```

  **interface** 只是描述了类的 **public** 部分，它只会帮忙检查类的 **public** 成员，不会帮忙检查类的 **private**、**protected** 成员。

  类静态部分和实例部分 ？？

- **interface 的 extends**
  
  **interface** 之间可以相互**继承**，这使得我们可以从一个接口里面**复制**成员到另一个接口里，更灵活的分割接口达到**可重用接口**的目的。

  ```
  interface Shape {
      color: string
  }

  // Square 为 { color: string; sideLength: number }
  interface Square extends Shape {
      sideLength: number; 
  }

  let a: Shape;
  let b: Square;
  a = b;
  b = a;  // error
  ```
  **子类 interface** 的值可以赋值给**父类 interface** 的值，相反**父类 interface** 无法赋值给**子类 interface**。

- **混合类型**
  
  在 js 中，函数作为一个对象，也存在属性。相应的，我们也可以在 ts 中通过**混合类型**定义一个有**额外属性**的函数：

  ```
  interface Func {
      (): void;
      name: string;
      age: number;
  }

  let func: Func = (() => {}) as Func;
  func.name = 'func';
  func.age = 12;
  func.key = '123';   // error, Func 中不存在 key

  ```

- **接口继承类 ？？**
  
#### 5. 类 - class

**类的定义**、**类的实例化**、**类的继承**、**privite / public / protected 成员** 、**set / get 访问器** 、**抽闲类**、**静态方法**、**静态属性**、**类方法重载**

#### 6. 函数重载

我们可以通过提供**多个函数定义**来实现**函数重载**。

```
function add(a: string, b: string): string;
function add(a: number, b: number): number;
function add(a: string | number, b: string | number): unknow {
    if(typeof a === 'string' && typeof b === 'string') {
        ...
    } else {
        ...
    }
}
```

#### 7. 泛型

- **泛型约束**

    我们可以通过关键字 **extends** 实现对**泛型**的约束:

    ```
    function func<T>(param: T): T {
        console.log(param.length);  // error， T 的类型不确定，可能没有 length 属性
        return T;
    }

    function func<T>(param: T): T {
        if (typeof param === 'string' || Array.isArray(param)) {
            console.log(param.length);    // 使用类型保护，进行类型收敛
        }
        return T;
    }

    interface Lengthwise {
        length: number;
    }

    function func<T extends Lengthwise>(param: T): T {
        console.log(param.length);  // 使用泛型约束
        return T;
    }
    ```

   **泛型约束**，就是 **T** 对应的值必须能赋值给对应的**约束类型**。

- **泛型 & 联合类型 & 类型别名**
  
    ```
    type T<U> = {
        [k in keyof U]: U[k]
    }

    type T1 = T <A | B>   // type T1 = T<A> | T<B>
    ```


#### 4. any、unknow、never 的比较

**unknow** 类型是类型系统的**顶层类型**，即任何类型包括 **never**、**void** 类型都可以赋值给 **unknow** 类型， 但是 **unknow** 类型无法赋值给除 **any**、**unknow** 以外的其他类型。使用 **unknow** 类型时，我们需要做**类型收敛**。


**never** 类型是类型系统的**底层类型**，即 **never** 类型可以赋值给**任何类型**，但是无法被除 **never** 以外的其他类型(包括 **void** 类型)赋值。

**any** 类型是一个特例，它既是类型系统的**顶层类型**，也是类型系统的**底层类型**, 即 **any** 类型可以赋值给除 **never** 外的任何类型，也可以被任何类型赋值。 这是 **any** 类型这种自身相互矛盾的特性，破坏了类型检查，因此尽量不要使用 **any**。

**any**、**unknow**、**never** 的使用总结:
- 在那些**不能取得任何值**的地方，使用 **never**；
- 在那些**可以取得任何值**，但不知道**类型**的地方，使用 **unknow**；
- 除非有意**忽略类型检查**，请不要使用 **any**；




#### 5. ts 中子集和父集的理解

继承的意义、联合类型、交叉类型

#### 6. 交叉类型 & 联合类型 

- **交叉类型 - &**
  
  **交叉类型**是将多个类型合并为一个类型，合并生成的类型，包含了所有类型的特性。

  ```
  interface A {
      name: string
  }

  interface B {
      age: number
  }

  type C = A & B  // 相当于 interface C { name: string; age: number }

  ```

  > **只有 interface 类型才可以做合并操作，基础类型不能合并。基础类型合并会返回 never 类型。这个很好理解， type a = string | number, 既是 string 又是 number 类型的值是不存在的，所以 a 只能是 never 类型。**

  通常情况下，**interface** 类型做合并操作会更有意义， 生成的新的 **interface** 类型会包含所有合并的 **interface** 的属性。
  
  **合并**时如果存在**同名属性**且**属性类型不同**，那么会根据属性类型的不同分别做处理:
  - 属性是**基础类型**，那么新的 **interface** 的属性的类型为 **never**;
  - 属性是 **interface** 类型，对 **interface** 类型再做合并处理;


  **交叉类型**可以作为所有**合并类型**的**子类型**， 即**交叉类型**可以赋值给**合并类型**。

  ```
  let c = { name: 'zjh', age: 20 };

  let a: A = c;   // C 是 A 和 B 的交叉类型， C 是 A、B 的子类型

  let b: B = c;  
  ```
  
- **联合类型 - |**
  
    有时，我们希望一个类型可以是 **string** 或者 **number**，此时可以使用**联合类型 - |**。

    ```
    type Param = string | number | boolean;   // Param 的类型是 string 或者 number 或者 boolean
    ```

    使用**联合类型**时，我们只能使用**联合类型**内所有类型**共有**的成员。

    ```
    function func(param: Param): void {
        console.log(param.length);   // Error, number、boolean 类型的值没有 length 属性
    }
    ```

    **联合类型**，适用于值可以为**不同类型**的情况。


#### 7. 类型保护

**类型保护**就是就是通过一些**表达式**，将**不确定的类型**收敛为某个**具体的类型**。

常见的**类型保护**:
- 将 **unkonw 类型**收敛为某个**具体类型**；
- 将**联合类型**收敛为**组成联合类型的某个具体类型 - 可辨识联合类型**；

实现**类型保护**的方式:

- **typeof 关键字**

    **typescript** 会根据 **typeof v** 的返回值，来判断 **v** 是什么类型:
    - 如果 **v** 是 **unknow** 类型，会根据 **typeof** 将 **v** 收敛为 **string**、**number**、**boolean**、**symbol**、**null**、**undefined**、**Function**、**object**； 不匹配 **typeof** 的还是 **unkonw** 类型；
    - 如果 **v** 是**联合类型**，匹配 **typeof** 的会被收敛为**联合类型**中的类型，不匹配的会收敛为 **never** 类型；
    - 如果 **v** 是**自变量类型**，匹配 **typeof** 的会被收敛为对应的**自变量**，不匹配的会收敛为 **never** 类型；

    ```
    function func(param: unknow) {
        switch(typeof param) {
            case 'string':
                console.log(param);   // param 的类型为 string
                break;
            case 'number':
                console.log(param);  // param 的类型为 number
                break;
            case 'boolean':
                console.log(param);  // param 的类型为 boolean
                break;
            case 'function':
                console.log(param);  // param 的类型为 Function
                break;
            default:
                console.log(param);  // param 的类型为 unknow
                break;
        }

    }
    ```
- **instanceof**
  
    **instanceof** 类型保护是通过**构造函数**来细化类型的一种方式。

- **in**
    
    我们也可以通过 **in** 来判断某个 **key** 是否存在于类型中来**收敛**类型。


当需要做保护的类型是**联合类型**时，**typescript** 会**自行判断**是什么类型。

```
type Param = string | number;

function func(param: Param) {
    if (typeof param === 'string') {
        ...    // param 的类型为 string
    } else {
        ...    // param 的类型为 number
    }
}

function func(param: Param) {
    if (typeof param === 'string') {
        ...    // param 的类型为 string
    } else if (typeof param === 'number') {
        ...    // param 的类型为 number
    } else {
        ...    // param 的类型为 never
    }
}    
```

#### 8. 可辨识联合类型

如果一个**联合类型**，可收敛为某一个具体的类型，那么这个**联合类型**可称为**可辨识联合类型**。

**可辨识联合类型**的特征:
- 组成**联合类型**的多个类型都具有**相同的属性**；
- 相同的属性为**字面量类型**，且**属性值**必须不相等；

```
interface Square {
    kind: "square";
    size: number;
}
interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}
interface Circle {
    kind: "circle";
    radius: number;
}

type Shape = Square | Rectangle | Circle;

function area(s: Shape): number {
    switch(s.kind) {
        case 'square': return s.size * s.size;    // Shape 收敛为 Square
        case 'rectangle': return s.width * s.height; // Shape 收敛为 Rectangle
        case 'circle': return Math.PI * s.radius ** 2; // Shape 收敛为 Circle
    }
}
```
在进行**类型收敛**时，如果没有涵盖所有**可辨识联合类型**的变化，编译器会提示报错 - **完整性检查**。如上面示例中，假如我们给 Shape 添加了新的类型，却没有修改 area， 编译器会报错，提醒我们去完善 area。

#### 9. 类型别名 - type

**类型别名 - type** 只会给类型起一个新的名字，并**不会创建**一个新的类型，只是创建一个类型的**引用**。

```
interface A {
    name: string
}

type B = A;

type C = string | number | boolean;
```

**类型别名**也可以使用**泛型**。

```
type A<T> = {
    name: T
}
```
**类型别名**一般在定义**交叉类型**、**联合类型**、**自定义高级类型**时使用。

#### 10. type 和 interface

**type** 和 **interface** 的区别:
- **interface** 创建了一个名字，可以在任何地方使用； **type** 并不会创建一个新的名字 ； ？？
- **type** 不能被 **extends**、**implements**，适用于**联合类型**、**交叉类型**、**元祖类型**、**自定义高级类型**，而 **interface** 不适用于此类场景。
- **type** 使用时需要**赋值**， 而 **interface** 不需要；


#### 11. 字面量类型

- **字符串字面量类型**
  
    ```
    type A = 'string' | 'number' | 'boolean';
    ```
- **数字字面量类型**
  
    ```
    type B = 1 | 2 | 3 | 4；
    ```

**字面量类型**常常配合**类型别名**、**联合类型**一起使用。




#### 12. 多态的 this 类型

为了让**类实例**的方法支持**链式调用**，我们通常会在**实例方法**中返回**实例对象**，如:

```
class BasicCalculator {
    public constructor(protected value: number = 0) { }
    public currentValue(): number {
        return this.value;
    }
    public add(operand: number): BasicCalculator {
        this.value += operand;
        return this;
    }
    public multiply(operand: number): BasicCalculator {
        this.value *= operand;
        return this;
    }
}

let v = new BasicCalculator(2).multiply(5).add(1);   // 支持链式调用
```

此时，有一个新的类 **ScientificCalculator** 继承 **BasicCalculator**，**ScientificCalculator** 实例可以使用继承自 **BasicCalculator** 的方法，

```
class ScientificCalculator extends BasicCalculator {
    public constructor(value = 0) {
        super(value);
    }
    public sin() {
        this.value = Math.sin(this.value);
        return this;
    }
}

let v = new ScientificCalculator(2).multiply(5).sin();  // Error
```
**multiply** 方法继承自 **BasicCalculator**， 返回一个 **BasicCalculator** 实例，而 **BasicCalculator** 实例没有 **sin** 方法，编译器会报错。 

我们可以通过将实例方法返回值的类型改为 **this 类型**的方式，来解决上述问题：

```
class BasicCalculator {
    public constructor(protected value: number = 0) { }
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
}
```

#### 13. 索引类型

- **keyof 索引查询**
  
    对于任何类型 **T**， **keyof T** 的结果为该类型上所有**公共属性(不包含类的私有属性、保护属性)** **key** 的**联合**:

    ```
    interface T1 {
        name: string;
        age: number;
    }

    typeof T2 = keyof T1  //  T2  的类型为 'name' | 'string', 由字符串字面量类型组成的联合类型

    class A {
        public name: string;
        private age: number;
        protected address: string;
    }

    typeof T3 = keyof A  // A 的类型为 'name', 不包括私有类型、保护类型
    ```
- **索引访问**
  
    通过 **T[k]** 的方式，可以获取到 **T** 中属性 **key** 对应的类型:

    ```
    type T2 = T1['name'];    // T2 的类型为 string

    type T3 = T1['age'];     // T3 的类型为 number

    type T4 = T1['phone'];   // T4 的类型为 any， 且会报错
    ```

    通过 **T[keyof T]** 的方式，可以获取到 **T** 中所有 **key** 类型的**联合类型**:

    ```
    type T5 = T1[keyof T1]   // T5 的类型为 string | number
    ```

    如果 **T** 的为**数组类型**，通过 **T[number]** 可以获取到 **T** 中所有**子类型**的**联合类型**:

    ```
    type T = [string, number];

    type T1 = T[number];   // T1 的类型为 string | number
    ```

- **索引遍历**
  
    通过 **k in keys** 的方式，可以遍历 **keys** 中的每个属性：

    ```
    type T2 = {
        [key in keyof T2]?: T2[key]
    }
    ```
    > **索引遍历只能用在 interface 的 key 中**？？

    在**索引遍历**时，如果 **keyof** 后面的是**泛型**，并且是**联合类型**，那么会出现**分发**的情况：

    ```
    interface T1 { name: string; age: number };

    interface T2 { phone: string; address: string };

    type T3<T> = {
        [k in keyof T]?: T[k]
    }

    type T4 = T3<T1 | T2>; // T4 为 T3[T1] | T3[T2]
    ```

    另外，**索引遍历**时不会遍历**原型链**上的**属性**。

- **索引签名**
    
    在定义一个 **interface** 时，我们可能只知道 **interface** 的部分属性，其他属性并不确定，此时我们可以使用**索引签名**:

    ```
    type T2 = {
        [key: string]: string | number | boolean;  // 字符串索引签名
        [key: number]: string | number | boolean;  // 数字索引签名
    }
    ```

#### 14. 映射类型

基于**原来的类型**，创建的**新类型**称为**映射类型**。在**映射类型**中，**新类型**以相同的方式去转换**旧类型**中的每个属性。

```
interface PersonPartial {
    name: string;
    age: number;
}

type Partial<T> = {
    [P in keyof T]?: T[P];
}

type PersonPartial = Partial<Person>;  // PersonPartial 为 { name?: string; age?: number }

```

#### 15. ts 中的 extends

在 **ts** 中， **extends** 关键字有三种用法:

- 用在 **interface**， 表示**继承**；
    
    ```
    interface T1 {
        name: string;
    }

    interface T2 {
        age: number;
    }

    // T3: { name: string; age: number; sex: string }
    interface T3 extends T1, T2 {
        sex: string;
    }
    ```

    我们可以使用**交叉类型 &** 来帮助 **type** 实现**继承**：

    ```
    type T3 = T1 & T2 & { sex: string }
    ```
- 用在**泛型**中，表示**泛型约束**；
  
    ```
    type Pick<T, U extends M> = {
        [k in U]: T[k]
    }
    ```
    其中 U 需要匹配 M， 否则就会报错。


- 表示**条件类型**，可用于**条件判断**

    条件类型，**xx extends xxx ? xx : xx**, 类似我们在 **js** 中使用的**三元运算符**，如果前面的条件满足，返回问号后面的第一个参数，否则返回第二个参数。

    **A extends B**，用于判断 **A** 是否可以分配给 **B**。
  
    ```
    // T 为 2
    // string | number 类型不可以分配给 number 类型， 返回 2
    type T = string | number extends number ? 1 : 2;  

    type P<T> = T extends number ? 1: 2;
    // T1 为 1 | 2
    // extends 作用于泛型，且 extends 之前的类型是泛型，会分发
    // string 不可分配给 number，返回 2； number 可分配给 number， 返回 1；最后的结果为 1 | 2
    type T1 = P<string | number>;
    ```
    在上面的示例中，我们发现当 **extends** 用于泛型时，结果会不一样。这是因为如果 **extends** 前面的类型是**泛型**，且泛型传入的是**联合类型**时，则会依次判断该**联合类型**的所有子类型是否可分配给 **extends** 后面的类型，这是一个**分发**的过程，然后将返回的结果组成新的**联合类型**。

    如果想阻止**分发**特性，可以使用**元祖类型**:

    ```
    type P<T> = [T] extends [number] ? 1 : 2;

    // T1 的类型为 2
    type T1 = P<string | number>; 
    ```

#### 16. infer

**infer** 用在 **extends** 条件语句中，表示待推断的**类型变量**。

**infer** 的用法:
- 返回**函数**的**参数类型**；
  
    ```
    type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
    ```
- 返回**函数**的**返回值类型**；
  
    ```
    type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer P ? P : never;
    ```

  



####  17. Ts 内置工具类型

- **Partial**
  
    通过 **Partial<T>**, 可以将 **T** 的属性变为**可选**的。

    ```
    interface T { name: string; age: number };

    type T1 = Partial<T>   // { name?: string; age?: number }
    ```

    **Partial** 的实现:

    ```
    type Partial<T> = {
        [k in keyof T]?: T[k]
    }
    ``` 
    扩展一下，将指定 T 中的指定属性变为可选:

    ```
    type PartialOption<T, K extends keyof T> = {
        [k in K]?: T[k]
    }

    PartialOption<T, 'name'>   // { name?: string}
    ``` 
  
- **Readonly**
  
    通过 **Readonly<T>**, 可以将 **T** 的属性变为**readonly**的。

    Readonly 的实现：

    ```
    type Readonly<T> = {
        readonly [k in keyof T]: T[k];
    }
    ```
  
- **Pick**
  
    通过 **Pick<T, K extends keyof T>**，可以从 T 中挑选一组属性构建新的类型。

    **Pick** 的实现：

    ```
    type Pick<T, K extends keyof T> = {
        [k in K]: T[k]
    }
    ```
    使用 **Pick** 时，必须保证选取的属性存在于 **T** 中。

- **Record**
  
    通过 **Record<T, K>** 构造一个 **type**，**key** 为**联合类型 T**中的每个子类型，类型为 **K**:

    ```
    type T = Record<'name' | 'age' | 'phone', string>;
    ```

    使用 Record 时，必须保证 T 是由 **string** 、**number**、**symbol** 组成的**联合类型**，如 'a' | 2 | 'b' | string | number。

    **Record** 的实现：

    ```
    type Record<T extends keyof any, K> = {
        [k in T]: K
    }
    ```

    **keyof any** 返回 **string | number | symbol**。

- **Exclude**

    **Exclude<T, U>** 提取存在于 **T**，但不存在于 **U** 的**类型**组成的**联合类型**。

    ```
    type T = Exclude<string | number | boolean, number | boolean>  // T 为 string
    ```

    Exclude 的实现:

    ```
    type Exclude<T, U> = T extends U ? never : T;

    type T = string | never  // T 的类型为 string
    ```

    注意，当 **extends** 关键字前面是**泛型**且是**联合类型**时，会**分发**。

- **Extract**
  
    **Extract<T, U>** 用于提取**联合类型 T** 和**联合类型 U** 的**交集**。 

    **Extract** 的实现:

    ```
    type Extract<T, U> = T extends U ? T : never;
    ```

- **Omit**
  
    **Omit<T, U>** 用于从 **T** 中剔除 **U** 中的所有属性, 其中 **T** 是一个**类型**， **U** 是一个**类型属性**构成的**联合类型**:

    ```
    interface T1 { name: string; age: number; phone: string };

    type T2 = Omit(T1, 'age' | 'phone')  // T2 为 { name: string }
    ```

    **Omit** 的实现：

    ```
    type Omit<T, U> = Pick<T, Exclude<keyof T, U>>

    // 这个实现是否有问题？？
    type Omit<T, U> = {
        [P in Exclude<keyof T, U>]: T[P]
    }
    ```

- **Parameters - 获取函数的参数类型**
  
    **Parameters** 用于获取**函数**的**参数类型**。

    ```
    type Func = (param1: string, param2: number) => string;

    type T = Parameters<Func>;   // T 为 [string, number];
    ```

    **Parameters** 的实现:

    ```
    type MyParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

    type T = MyParameters<Func>;  // T 为 [string, number];
    ```


- **ReturnType - 获取函数的返回值类型**
  
    **ReturnType** 用于获取**函数**的**返回类型**。

    ```
    type T = ReturnType<Func>;   // T 为 string;
    ```

    **ReturnType** 的实现:

    ```
    type MyReturnType<T extends (...args: any) => void> = T extends (...args: any) => infer P ? P : never;

    type T = MyReturnType<Func>;  // T 为 string;
    ```
#### 18. 同态 & 非同态


#### 19. 自定义高级类型

- **返回 T 中所有的类型**
  
    ```
    interface T1 {
        a: string;
        b: number;
        c: boolean;
        d: () => void;
        e: null;
        f: undefined;
        g: never
    }

    type GetType<T> = T[keyof T]   

    type T2 = GetType<T1>   // T2 为 string | number | boolean | () => void | null | undefined;
    ```

    **GetType** 返回的联合类型不包含 **never**。

- **返回 T 中所有可选的属性**
  
    返回 **T** 中所有**可选**的属性，最关键的一步就是如何**判断属性是可选**的。

    我们可以通过 **{} extends T**, 来判断 **T** 中的属性是否可选。如果 **{}** 是 **T** 的**子类型**，那么 **T** 中的属性都是**可选**的，如果不是，则 **T** 中存在**必选的属性**。
  
    ```
    type OptionalKey<T> = {
        [k in keyof T]: {} extends Pick<T, k> ? k : never;
    }[keyof T]
    ```

    返回 **T** 中所有**必选**的**属性**

    ```
    type RequiredKey<T> = Exclude<keyof T, OptionalKey<T>>
    ```

- **返回 T 中所有只读的属性？**


- **将一个 interface 中指定属性变为可选**

    ```
    type SetOptional<T, U extends keyof T> = {
        [k in U]?: T[k]
    } & Pick<T, Exclude<keyof T, U>>;

    type T2 = SetOptional<T1, 'a' | 'b'> 
    ```

    同样的，也可以将 **interface** 中指定属性变为**只读**的。

    ```
    type setReadonly<T, U extends keyof T> = {
        readonly [k in U]: T[k]
    } & Pick<T, Excluse<keyof T, U>>
    ```
- **将一个 interface 中的可选属性变为必选**
  
    ```
    type SetRequired<T> = {
        [k in keyof T]-?: T[k]
    }
    ```
    同样的，也可以将一个 **interface** 中的只读属性变为**非只读**

    ```
    type SetNoReadonly<T> = {
        -readonly [k in keyof T]: T[k]
    }
    ```

- **获取没有同时存在于 T 和 U 内的类型**
  
    ```
    type SymmetricDifference<T, U> = Exclude<T | U, T & U> ;

    type T1 = SymmetricDifference<'a' | 'b' | 'c', 'b' | 'c' | 'd'>   // T1 的类型为 'a' | 'd'
    ```

- **挑选 T 中指定类型的属性形成一个新的类型**
  
    我们知道，通过 **Pick** 可以从 **T** 中挑选**指定属性**形成一个新的类型，那么如何从 **T** 中挑选**指定类型**呢？

    分为两步:
    - 第一步，从 **T** 中挑选指定类型的 **key**；
    - 第二步， 利用 **Pick** 从 **T** 中挑选**指定属性**；
  
    ```
    // 挑选指定类型的 key
    type PickKeyByType<T, U> = {
        [k in keyof T]: T[k] extends U ? k : never   // 注意，在这里 T[k] 不是泛型哦
    }[keyof T]

    // 挑选指定属性
    type PickByType<T, U> = Pick<T,PickKeyByType<T, U>>
    ```

    关于上面的示例，我们还有另外一种实现:

    ```
    type T1<T, U, M> = T extends U ? M : never;

    type PickKeyByType1<T, U> = {
        [k in keyof T]: T1<T[k], U, k>   
    }[keyof T]

    // 挑选指定属性
    type PickByType1<T, U> = Pick<T,PickKeyByType1<T, U>>
    ```

    ```
    interface Foo {
        a: string;
        b: number;
        c: string | number;
    }

    type D1 = PickByType<Foo, string>;  // D1 为 { a: string };

    type D2 = PickByType1<Foo, string>; // D2 为 { a: string; c: string | number};
    ```

    上面两个结果之所以不同，是因为第二种实现中 **extends** 前面的是**泛型**并且是**联合类型**，发生分发，导致 **c: string | number** 也被匹配。如果要避免这种情况，是需要使用**元祖类型**来阻止**分发**。

    ```
    type T1<T, U, M> = [T] extends [U] ? M : never;

    type PickKeyByType1<T, U> = {
        [k in keyof T]: T1<T[k], U, k>   
    }[keyof T]

    // 挑选指定属性
    type PickByType1<T, U> = Pick<T,PickKeyByType1<T, U>>
    ```

- **从 T 中提取存在于 U 中的 key 和对应的类型**

    ```
    type Intersection<T extends object, U extends object> =  Pick<T, Extract<keyof T, keyof U>>
    ```
- **从 T 中排除存在于 U 中的 key 和对应的类型**
  
    ```
    type Diff<T extends object, U extends object> = Pick<T, Exclude<keyof T, keyof U>>;
    ```

- **Overwrite - 使用 U 覆写 T 中的同名属性**
  
    ```
    type Overwrite<T extends object, U extends object> = {
        [k in keyof T]: k extends Extract<keyof T, keyof U> ? U[k] : T[k]
    }
    ```

- **Assign - 合并 T、U**
  
    ```
    type Assign<T extends object, U extends object> = 
        Pick<U, Extract<keyof T, keyof U>> & Pick<T, Exclude<keyof T, keyof U>> & Pick<U, Exclude<keyof U, keyof T>>
    ```

- **ts 中的递归??**
    
    ```
    // 递归

    type DeepRequired<T> = 
        T extends Function ? T : 
            T extends Array<any> ? DeepRequiredArray<T[number]>   :
                T extends object ?  DeepRequiredObject<T>  :
                    T

    // 递归对象
    type DeepRequiredObject<T extends object> = {
        [k in keyof T]-?: DeepRequired<T[k]>
    } 

    // 递归数组
    interface DeepRequiredArray<T> extends Array<DeepRequired<T>> {}

    ```

    递归数组类型时，关键的一步是 **T<number>**。 通过 **T<number>**， 可以获取到数组类型 **T** 中所有**子类型**的**联合类型**。

    疑问：泛型中使用联合类型时的异常情况？？

- **数组类型扁平化**
  
    ```
    type FlatArray<T extends any[]> = {
        [k in keyof T]: T[k] extends any[] ? FlatArray<T[k]> : T[k]
    }[number]

    ```



#### 20. 关键知识点
- **基础 ts 类型**
- **父子类型**: 子类型可以分配给父类型；
- **索引相关**: keyof 索引查询、索引访问、索引遍历、索引签名；
- **keyof & in**: **keyof** 返回一个**联合类型**； **in** 用来遍历**联合类型**，**in** 不能**单独使用**，必须放在**索引签名？？**中使用；
- **函数重载**；
- **类型保护、泛型约束**；
- **extends 关键字**: interface 继承、类继承、泛型约束、条件判断(分发)；
- **泛型分发**：条件判断分发、keyof 分发、还有吗？？
- **阻止泛型分发**：使用**元祖**；
- **infer 推断**：必须和 **extends** 一起使用；
- **内置工具类型**: Partial、Readonly、Record、Pick、Exclude、Extract、Omit、Parameters、ReturnType;



#### 21. ts 中的小技巧
- 如何判断一个属性是否可选？
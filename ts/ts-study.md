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
  

- **enum类型**
  
    使用枚举可以为一组数组赋予友好的名字。

    ```
    enum Color = { Red, Green, Yellow};

    let color: Color = Color.Red  // color = 0
    ```

    枚举类型编译以后的代码为:

    ```
    var Color;
    (function (Color) {
        Color[Color["red"] = 0] = "red";
        Color[Color["green"] = 1] = "green";
        Color[Color["yellow"] = 2] = "yellow";
    })(Color || (Color = {}));

    ```

    如果没有为枚举元素指定值，那么默认从 0 开始为枚举元素编号。我们可以为枚举元素指定为其它数字、字符串。

    > **注意，不能为枚举元素指定需要计算的值，如 1 + 2、boolean 类型、对象等**。

    使用**枚举类型**时，我们既可以通过**枚举元素**获取**值**，也可以通过**枚举值**获取对应的**枚举元素(得到是**枚举元素**对应的**字符串**)**。


#### 3. interface




#### 3. any、unknow、never 的比较

**unknow** 类型是类型系统的**顶层类型**，即任何类型包括 **never**、**void** 类型都可以赋值给 **unknow** 类型， 但是 **unknow** 类型无法赋值给除 **any**、**unknow** 以外的其他类型。使用 **unknow** 类型时，我们需要做**类型收敛**。


**never** 类型是类型系统的**底层类型**，即 **never** 类型可以赋值给**任何类型**，但是无法被除 **never** 以外的其他类型(包括 **void** 类型)赋值。

**any** 类型是一个特例，它既是类型系统的**顶层类型**，也是类型系统的**底层类型**, 即 **any** 类型可以赋值给除 **never** 外的任何类型，也可以被任何类型赋值。 这是 **any** 类型这种自身相互矛盾的特性，破坏了类型检查，因此尽量不要使用 **any**。

**any**、**unknow**、**never** 的使用总结:
- 在那些**不能取得任何值**的地方，使用 **never**；
- 在那些**可以取得任何值**，但不知道**类型**的地方，使用 **unknow**；
- 除非有意**忽略类型检查**，请不要使用 **any**；




#### 4. ts 中子集和父集的理解


#### 5. 类型守卫(类型保护？)


#### 交叉类型 & 联合类型 

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
  
    有时，我们希望一个类型可以是 string 或者 number，此时可以使用**联合类型 - |**。

    ```
    type Param = string | number | boolean;   // Param 的类型是 string 或者 number 或者 boolean
    ```

    使用**联合类型**时，我们只能使用**联合类型**内所有类型**共有**的成员。

    ```
    function func(param: Param): void {
        console.log(param.length);   // Error, number、boolean 类型的值没有 length 属性
    }
    ```



  

#### 泛型

#### 泛型接口


#### 元祖


#### 泛型类


#### 泛型约束

泛型约束类型：
- 确保属性存在；  extends 
- 检查对象上的属性是否存在  keyof extends


#### 泛型参数默认类型 ？？


#### 泛型条件类型 ？？


#### 泛型工作类型 ？？



#### ts 知识点

1. 基础类型

2. K[keyof K]: K 所有 key 类型的联合类型

    ```
    interface IProps {
        name: string;
        age: number
    }

    type name = IProps["name"]  // type name = string;

    type age = IProps["age"]    // type age = number;

    type attr = keyof IProps    // type attr = 'name' | 'age';

    type attr1 = IProps[keyof IProps]   // type attr1 = string | number;
    ```

3. 交叉类型 & 取的是多个类型的并集，如果有相同的 key 但是类型不同，则 key 的类型为 never;

    ```
    interface IA {
        name: string;
        age: number;
    }

    interface IB {
        name: string;
        age: string;
    }

    const user: IA & IB = {
        name: 'zjh',
        age: (function() { throw new Error()})()   // age 为 never 类型
    }
    ```

4. 实现继承

    如果是 interface，通过 extends 关键字实现；

    如果是 type，通过交叉类型 & 实现；

    ```
    interface T1 {
        name: string;
    }

    interface T2 {
        age: number;
    }

    interface Student extends T1, T2
    ```
#### 为什么要使用 typescript 

js 是弱类型语言， 无法在编译阶段知道变量是什么类型

通过 typescript，在编译检查阶段就可以发现不匹配的变量类型

#### 基础类型

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
  
- **undefined 类型**

    ```
        let u: undefined = undefined;  // 用处不大
    ```
- **null 类型**

    ```
        let u: null = null // 和 undefined 一样， 用处不大
    ```

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

    在 tsconfig.json 的 compilerOptions 配置项中，我们可以通过配置 noImplicitAny = true，不允许代码中出现任何 any。



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
- **array 类型**
- **object 类型**
- **never 类型**
- **unknow 类型**
  

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
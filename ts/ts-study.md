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

- **void 类型**
  
    某种程度上来讲， **void** 类型和 **any** 类型**相反**，表示没有任何类型。当一个**函数**没有**返回值**时，它的类型通常为 **void**。

    ```
        function func(): void {
            console.log('func');
        }
    ```
  
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
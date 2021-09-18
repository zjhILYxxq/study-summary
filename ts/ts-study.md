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

4. 
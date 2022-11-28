1. 如果要手写 `promise`， 要实现哪些功能



2. 手写 `promise` 的 `all`、`race`、`allSettled`、`any`

    ```
    // 手写 all 方法
    function PromiseAll(list) {
        return new Promise((resolve, reject) => {
            let remain = list.length, res = [];
            list.forEach((item, index) => {
                item.then((data) => {
                    res[index] = data;
                    remain--;
                    if (reamin === 0) {
                        resolve(res);
                    }
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }
    ```

    ```
    // 手写 race 方法
    function PromiseRace(list) {
        return new Promise((resolve, reject) => {
            for(let item of list) {
                item.then(data => {
                    resolve(data);
                }).catch(error => {
                    resolve(error);
                });
            }
        });
    }
    ```

    ```
    // 手写 allSettled 方法
    function PromiseAllSettled(list) {
        return new Promise(resolve, rejct) {
            let res = [], remain = list.length;
            list.forEach((item, index) => {
                item.then(data => {
                    res[index] = data;
                    remain--;
                    if (reamin === 0) {
                        resolve(res);
                    }
                }).catch(error => {
                    res[index] = error;
                    remain--;
                    if (reamin === 0) {
                        resolve(res);
                    }
                });
            })
        }
    }
    ```

    ```
    // 手写 any 方法
    functiom PromiseAny(list) {
        return new Promise((resolve, reject) => {
            let res = [], remain = list.length;
            list.forEach((item, index) => {
                item.then(data => {
                    resolve(data);
                }).catch(error => {
                    res[index] = error;
                    remain--;
                    if (reamin === 0) {
                        reject(res);
                    }
                });
            });
        });
    }
    ```
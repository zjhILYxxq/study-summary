1. 如果要手写 `promise`， 要实现哪些功能

    手写 `promise`，要实现一下功能:
    - `promise` 类
    - `micro` 任务队列相关方法
    - 实例方法: `then`、`catch`、`finally`
    - 静态方法：`resolve`、`reject`、`all`、`race`、`allSettled`、`any`

    ```
    // 异步任务队列，借助 setTimeout 实现
    let TaskQueue = {
        queue: [],
        processing: false,
        queueTask(task) {
            if (!this.processing) {
                this.processing = true;
                setTimeout(() => {
                    this.flushQueue();
                }, 0)
            }
            queue.push(task);
        },
        flushQueue() {
            while(queue.length) {
                let cb = queue.shift();
                if (cb) {
                    cb()
                }
            }
            this.processing = false;
        }
    }
    ```



    ```

    function handler(promise, handle) {
        TaskQueue.queueTask(function() {
            // 处理 onFulled、onRejected
        })
    }


    function resolve(value) {
        // 要把 promise 中收集到的 onfullfilled 放到微任务队列中
        this._value = value;
        this._status = 'resolved';
        this.handle.forEach((item) => {
            handler(this, item);
        });
    }

    function reject(error) {
        // 要把 promise 中收集到 onRejected 放到微任务队列中
        this._value = error;
        this._status = 'rejected',
        this.handle.forEach((item) => {
            handler(this, item);
        });
    }

    class MyPromise {
        // promise 实例的值
        _value = undefined;
        // promise 实例的状态
        _status = 'pending';
        // 状态变更以后要处理的 callback
        _handle = [];

        constructor(fn) {
            try {
                if (fn) {
                    fn(resolve.bind(this), reject.bind(this));
                }
            } cache(e) {
                reject.call(this, e);
            }
        }

        then(onFullfilled, onRejected) {
            let P = this.constructor;
            let promise = new P();
            this._handle.push({
                onFullfilled,
                onRejected
            });
            return promise;
        }

        catch(onRejected) {
            let P = this.constructor;
            let promise = new P();
            this._handle.push({
                onFullfilled: null,
                onRejected
            });
            return promise;
        }

        finally(cb) {
            let P = this.constructor;
            let promise = new P();
            this._handle.push({
                onFullfilled: () => {
                    callback();
                    return this._value;
                },
                onRejected: () => {
                    callback();
                    return this._value;
                }
            });
            return promise;
        }

        static resolve(value) {
            let promise = new MyPromise()
            promise._status = 'resolved'
            promise._value = value
            return promise
        }

        static reject(err) {
            let promise = new MyPromise()
            promise._status = 'rejected'
            promise._value = err
            return promise
        }

        static all(arr) {}

        static race(arr) {}

        static allSettled(arr) {}

        static any(arr) {}
    }
    ```



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
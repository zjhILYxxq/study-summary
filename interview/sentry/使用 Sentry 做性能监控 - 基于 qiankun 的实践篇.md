---
theme: cyanosis
---

本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！

<h3>前言</h3>

还记得小编之前的一篇文章 - [如何优雅的解决 Qiankun 下 Sentry 异常上报无法自动区分项目的问题 ?](https://juejin.cn/post/7139452175088320520) 吗？在这篇文章中，小编针对 `Qiankun` 下 `Sentry` 异常上报无法自动区分项目的问题，提供了一种行之有效的解决方案，切实帮助了不少同学，成就感直接拉满，😄。

不过在后续使用过程中，小编发现该方案并不完整 - 如果开启了性能监控功能，客户端上报的性能指标数据，会和之前的异常数据一样，全部上报到主应用对应的 `project` 中。出现这种情况，当然是不合理的，我们需要性能指标数据也和异常数据一样，能上报到正确的 `project` 中。

有了之前的经验，这个问题的解决方案可以说是非常简单，就是拦截性能指标数据上报接口，然后再将数据做分发。本文，小编会综合异常上报解决方案，给大家提供一个完整版的方案。

<h3>解决方案</h3>

不管是异常数据上报，还是性能指标数据上报，我们的解决思路都是 `3` 步:

1. 拦截数据上报接口；

2. 对数据做分发，然后重组上报接口的 `url`；

3. 重新上报数据;


<h4>拦截数据上报接口</h4>


拦截数据上报接口，我们直接复用原来的技术方案，代码如下:

- `6.x` 版本

    ```
    // 6.x 版本

    import { Transports, init } from '@sentry/browser';
    import { Integrations } from '@sentry/tracing';

    const fetchImpl = (url, options) => {
        // 根据 options 中的异常信息，返回新的 url 和 options
        const [newUrl, newOptions] = sentryFilter(url, options);
        // 使用原生的 fetch
        return originFetch(newUrl, newOptions);
    }

    class CustomerTransport extends Transports.FetchTransport {
        constructor(options) {
            super(options, fetchImpl)
        }
    }

    init({
        dsn: 'xxxx',
        enabled: true,
        integrations: [
            new Integrations.BrowserTracing({
                idleTimeout: 2000,
            }),
        ],
        tracesSampleRate: 1,
        transport: CustomerTransport,
        ...
    });
    ```
- `7.x` 版本

    ```
    import { init, makeFetchTransport } from '@sentry/browser';
    import { Integrations } from '@sentry/tracing';

    const CustomeTransport = (options) => {
        const fetchImpl = (url, options) => {
            const [newUrl, newOptions] = sentryFilter(url, options);
            return window.fetch(newUrl, newOptions);
        };
        return makeFetchTransport(options, fetchImpl);
    };

    init({
        dsn: 'xxxx',
        enabled: true,
        integrations: [
            new Integrations.BrowserTracing({
                idleTimeout: 2000,
            }),
        ],
        tracesSampleRate: 1,
        transport: CustomerTransport,
        ...
    });

    ```

<h4>数据分发、重组 url</h4>

不管是异常数据上报，还是性能指标数据上报，上报接口的 `url` 都是由 `dsn` 信息转化而来的。

具体的转化过程如下:

```
// https://62187b367e474822bb9cb733c8a89814@sentry.byai.com/56
dsn - https://{param1}@{param2}/{param3}
                      |
                      |
                      v
errorUrl - https://{param2}/api/{param3}/store/?sentry_key={param1}&sentry_version=7 

performanceUrl - https://{param2}/api/{param3}/envelope/?sentry_key={param1}&sentry_version=7 

```
因此我们只要能根据上报数据找到正确的 `project`，就可以根据 `project` 的 `dsn` 重组 `url`。

首先，我们来创建一个 `project` 注册表。

```
const PROJECT_CONFIG = {
  'project-1': {
    project: 'project-1',
    errorUrl:
      'https://sentry.xxx.com/api/1/store/?sentry_key=a&sentry_version=7',
    errorCheck: (url: string) => url.includes('/project-1/'),
    performanceUrl:
      'https://sentry.xxx.com/api/1/envelope/?sentry_key=a&sentry_version=7',
    performanceCheck: (url: string) => url.includes('/project-1/'),
  },
  'project-2': {
    project: 'project-2',
    errorUrl:
      'https://sentry.xxx.com/api/2/store/?sentry_key=b&sentry_version=7',
    errorCheck: (url: string) => url.includes('/project-2/'),
    performanceUrl:
      'https://sentry.xxx.com/api/2/envelope/?sentry_key=b&sentry_version=7',
    performanceCheck: (url: string) => url.includes('/project-2/'),
  },
  'project-3': {
    project: 'project-3',
    errorUrl:
      'https://sentry.xxx.com/api/3/store/?sentry_key=c&sentry_version=7',
    errorCheck: (url: string) => url.includes('/project-3/'),
    performanceUrl:
      'https://sentry.xxx.com/api/56/envelope/?sentry_key=a&sentry_version=7',
    performanceCheck: (url: string) => url.includes('/project-3/'),
  },
  'project-4': {
    project: 'project-4',
    errorUrl:
      'https://sentry.xxx.com/api/4/store/?sentry_key=d&sentry_version=7',
    errorCheck: (url: string) => url.includes('/project-4/'),
    performanceUrl:
      'https://sentry.xxx.com/api/56/envelope/?sentry_key=a&sentry_version=7',
    performanceCheck: (url: string) => url.includes('/project-4/'),
  },
  ...
};
```
上述 `project` 注册表中的 `errorUrl`、`performanceUrl` 是数据分发以后重组的 `url`，根据实际项目中各个 `project` 真实的 `dsn` 信息生成；`errorCheck`、`performanceCheck` 是 `project` 分发的判断方法。

接下来，我们来实现将数据分发，分为异常数据分发和性能指标数据分发:

- 异常数据分发

    异常数据的分发，需要分析异常追踪栈中发生异常的文件对应的 `url`。

    ```
    const findErrorProject = (filename: string) => {
        const keys = Object.keys(PROJECT_CONFIG);
        for (const key of keys) {
            const project = PROJECT_CONFIG[key];
            if (project.errorCheck(filename)) {
            return project;
            }
        }
        return null;
    };


    const sentryErrorFilter = (url: string, options: any) => {
        let project = null;
        // 拿到 sentry 生成的异常信息
        const error = JSON.parse(options.body).exception;
        if (error && error.values && error.values.length) {
            // 找到异常追踪栈信息
            const stacktrace = error.values[0].stacktrace;
            if (stacktrace && stacktrace.frames && stacktrace.frames.length) {
                // 找到发生异常的文件对应的文件名
                const filename = stacktrace.frames[stacktrace.frames.length - 1].filename;
                // 根据文件名判断是那个子应用
                project = findErrorProject(filename);
            }
        }
        return project
            // 能找到子应用，返回重组以后的 url
            ? [project.errorUrl, { release: project.project, ...options }]
            // 没有匹配的子应用，返回原来的 url
            : [url, options];
    };

    ```
- 性能数据分发
  
    性能数据的分发就比较简单了，直接根据当前应用的路由信息判断即可。

    ```
    const findPerformanceProject = (pathname: string) => {
        const keys = Object.keys(PROJECT_CONFIG);
        for (const key of keys) {
            const project = PROJECT_CONFIG[key];
            if (project.performanceCheck(pathname)) {
                return project;
            }
        }
    };

    const sentryProformanceFilter = (url: string, options: any) => {
        // 应用当前路由信息
        const pathname = window.location.pathname;
        // 根据路由信息判断是哪个子应用
        const project = findPerformanceProject(pathname);
        return project 
            // 能找到子应用，返回重组以后的 url
            ? [project.performanceUrl, options]
            // 没有匹配的子应用，返回原来的 url
            : [url, options];
    };

    ```

最后，我们来实现如何区分异常数据上报和性能指标数据上报。 如果是性能指标数据上报， `Sentry` 会给上报的数据添加 `type: 'transaction'` 信息。通过这一点，可以很方便的区分异常数据和性能指标数据，代码如下:

```
const sentryFilter = (url, options) => {
  const body = options.body || '';
  // 性能
  if (body.includes('"type":"transaction"')) {
    return sentryProformanceFilter(url, options);
  } else {
    return sentryErrorFilter(url, options);
  }
};
```

这就是 `Qiankun` 架构下关于异常监控和性能监控的完整版技术方案了。亲测有效哦!

<h3>结束语</h3>

到这里，关于如何使用 `Sentry` 做异常监控、性能监控就告一段落了。

简单回顾一下，小编通过 `6` 篇文章，梳理了 `Sentry` 做异常、性能监控的原理、如何自动推送 `Sentry` 告警、如何分析性能监控数据，想必大家对 `Sentry` 的使用已经有一个初步的认识了吧。

其实，关于 `Sentry` 的使用，小编也只是了解一些皮毛, 还需要再继续深入了解。后续


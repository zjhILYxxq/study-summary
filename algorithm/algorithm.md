#### 常用的算法解题思路

常见的问题类型、解题思路、典型问题:
- **求最值**问题：**动态规划**，解题思路为**子问题的最优解得到原问题的最值**，典型题有**斐波那契数列**、**跳楼梯**、**股票**；
- **列出所有情况**的问题：**回溯算法**，解题思路为**将问题转化为多叉树的深度优先遍历**，典型题有 [全排列](https://leetcode-cn.com/problems/permutations/)、**皇后问题**；
- **最短路径**的问题: **BFS - 广度优先遍历**，典型题有**二叉树的最小高度**、**走迷宫**、**密码锁问题**， 一般需要配合 **queue** 使用；
- **链表问题**: 常用的解题方法有**双指针**、**快慢指针**、**正常遍历**、**配合其他数据结构使用如堆**，典型题有**合并两个链表**、**合并多个链表(配合堆使用)**、**寻找倒数第 k 个节点(双指针)**、**找到链表的中间节点(快慢指针)**、**判断链表有环(快慢指针)**、**判断链表相交(双链表)**；

    由于链表天然具有递归的性质，所以链表类型的题目，也可以考虑使用递归的算法。
    
- **数组、字符串反转问题**: 常用的解题方法有**左右指针**；
- **字符串寻找满足题意的子字符串**: 常用的解题方法有**滑动窗口**，最关键的地方是找到**缩小窗口的时机**，典型题有**最小覆盖子串**、**无重复字符的最长子串**、**找到字符串中所有字母异位词**；
- **岛屿问题**: 常用的解题方法 **DFS**，典型题有**统计岛屿数量**、**统计封闭岛屿的数量**、**统计飞地的数量**等；
- **二分查找问题**: 
- **字符串问题**: 常用的解题方法为**滑动窗口**；
- **数组问题**: 常用解题方法为**排序** + **左右指针**；
- **排序问题**: **快速排序**、**堆排序**；
- **抢红包**: 解题方法为**二倍均值法**；
- **n 数之和问题**: 解题思路是**先排序**，然后使用**左右指针**；
- **回文字符串**: 解题思路是**遍历字符串**，找到以某个字符为中心的**最大回文字符串**；
- **双指针算法**： 双指针一般可以分为**左右指针**、**快慢指针**。 **快慢指针**的变种 - **滑动窗口**。



#### 动态规划

**动态规划**问题的一般形式就是：**求最值**。

**动态规划**的核心思想：**穷举**。

动态规划问题的特点:
- 存在**重叠子问题** - 重叠子问题会导致不必要的计算；
- 具备**最优子结构** - 通过子问题的最值找到原问题的最值；
- 正确的**状态转移方程** - 只有列出正确的状态转移方法，才能正确的穷举； 


写出**状态转移方程**的思路:
- 明确 base case  - 找到初始情况；
- 明确状态 - 找到变化的值；
- 明确选择 - 选出最值的过程；
- 明确 dp 函数/数组的定义；

**动态规划问题**的解法：
- **自顶而下** - 递归，即确定 dp 函数，需要使用备忘录消除重叠子问题；
- **自底而上** - dp 数组；

常见的动态规划问题：
- **爬楼梯问题**
  - [x] [经典爬楼梯](https://leetcode.cn/problems/climbing-stairs/), 解法: dp[n] = dp[n - 1] + dp[n - 2];
  - [x] [最小成本爬楼梯](https://leetcode.cn/problems/GzCJIP/), 解法: dp[n] = Math.min(dp[n - 1] + cost[n - 1], dp[n - 2] + cost[n - 2]), 这道题的有意思的点 base case 有 3 个，即 dp[1], dp[2], dp[3];
- **单序列问题**，题目的输入通常是一个一维数组或者字符串
  - [x] [房屋偷盗问题](https://leetcode.cn/problems/Gu0c2T/) - 典型的动态规划问题， 解法: dp[n] = Math.max(dp[n - 1], dp[n - 2] + nums[n - 1]);
  - [x] [环形房屋偷盗问题](https://leetcode.cn/problems/PzWKhm/) - 环形房屋偷盗问题，和普通偷盗问题的区别是最后一个屋子和第一个屋子相邻。解决思路是，将整个问题分解为两个子问题，从 0 - n - 2 和 从 1 到 n - 1 两个子问题。  
  - [x] [粉刷房子](https://leetcode.cn/problems/JEj789/) - 思路是找到各个颜色粉刷房子的最小成本，然后自从各个颜色的最小成本中找出最小成本(这道题还是比较简单的);
  - [x] [翻转字符](https://leetcode.cn/problems/cyJERH/) - 思路是只需统计 0 翻转成 1 的最小次数；
  - [x] [最长斐波那契数列](https://leetcode.cn/problems/Q91FMA/) - 解题思路，dp[i][j] = dp[j][k] + 1, dp[i][j] 代表最后一位为 i， 前一位为 j 的斐波那契数列， d[j][k] 为最后一位为 j，前一位为 k 的斐波那契数列。解题时，需要建立一个 n * n 的 dp 数组。
  - [ ] [最少回文分割](https://leetcode.cn/problems/omKAoA/) - 困难
  
- **双序列问题**
  - [x] [最长公共子序列](https://leetcode.cn/problems/qJnOS7/)
  
    解题思路，dp[i, j] 表示从 s1[0...i] 和 s2[0...j] 中找到满足题意的最长公共子序列的长度，状态转移方程：如果 s1[i] === s2[j], dp[i][j] = dp[i - 1][j - 1] + 1; 如果 s1[i] !== s2[j], dp[i, j] = Math.max(dp[i - 1][j], dp[i][j - 1]);

  - [x] [字符串交织](https://leetcode.cn/problems/IY6buf/)

    解题思路, dp[i, j] 表示 s1[0...i] 和 s2[0...j] 是否能组成 s3， 状态转移方程，如果 dp[i][j] = s1[i - 1] === s3[i + j - 1] && dp[i - 1][j] || s2[j - 1] === s3[i + j - 1] && dp[i][j - 1];

    解题思路，
  - [x] [子序列的数目](https://leetcode.cn/problems/21dk04/)

    双序列问题的输入有两个或者更多的序列，通常是两个字符串或者数组。

    由于输入的是两个序列，因此状态转移方程通常有两个参数，即 f(i, j)，表示第一个序列中从 0 到 i的子序列和第二个子序列中从 0 到 j 的子序列的最优解。一旦找到了 f(i, j) 和 f(i - 1, j)、f(i - 1, j - 1)、f(i, j - 1) 的关系，通常问题就迎刃而解了。



- **矩阵路径问题**
  - [x] [路径的数目](https://leetcode.cn/problems/2AoeFn/) - 这个题也超级简答, dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
  - [x] [最小路径之和](https://leetcode.cn/problems/0i0mDW/) - 这个题比较简单，dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
  - [x] [三角形中最小路径之和](https://leetcode.cn/problems/IlPe0q/) - 这个题比较简单，dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i - 1][j]), 在考虑一下边界情况即可。

- **背包问题**
  - [x] [分割等和子集](https://leetcode-cn.com/problems/NUPfPr/) - 这道题和 [加减的目标值](https://leetcode.cn/problems/YaVDxD/) 解题思路一样。通过数学方法，转化从给定 list 中找到和为 target 的方案，变成 0 - 1 背包问题。
  - [x] [加减的目标值](https://leetcode.cn/problems/YaVDxD/) - 可以转化为 0 - 1 背包问题。这个问题稍微有点不好理解，解决思路是先通过数学方案，确定解题思路是从给定 list 中找到和为 target 的方案。dp[i][j] 表示从前 i 个数中找到和为 j 的方案， dp[i][j] = dp[i - 1][j] + dp[i - 1][j - list[i]]。这个题要回来回顾 ！！
  - [x] [最少的硬币数目](https://leetcode.cn/problems/gaM7Ch/) - 无限背包问题，dp[i] = Math.min(dp[i], dp[i - bag[j]] + 1);
  - [x] [排列的数目](https://leetcode.cn/problems/D0F0SV/) - 无限背包问题，类似于最少的硬币数目问题， dp[i] = dp[i] + dp[i - bag[j]];

    背包问题的基本描述: 给定一组物品，每组物品都有其重量和价格，在限定的总重量内如何选择才能是物品的价格最高。

    0-1 背包问题: 每种物品只有一个，可以放入或者不放入背包。0 - 1 背包问题是最基本的背包问题，其他类型的背包问题都可以转化为 0 - 1 背包问题。

    有限背包问题: 每种物品的个数是有限的。

    无限背包问题: 每种物品的个数是无限的。

  
- **股票问题**
  - [x] [交易一次的股票问题](https://leetcode.cn/problems/gu-piao-de-zui-da-li-run-lcof/)；
  - [x] [不限制交易次数的股票问题](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/)
  - [x] [交易 2 次的股票问题](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii/);
  - [x] [交易 k 次的股票问题](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv/)
  - [x] [含冷冻期的股票问题](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/)
  - [x] [含手续费的股票问题](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)

    股票问题有三个状态：股票交易天数、交易次数、持有股票情况

    dp[i][k][0] = max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i]);

    dp[i][k][1] = max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - prices[i]);

    当股票只能交易一次时：
    - 持有股票:  dp[i][1] = max(dp[i - 1][1], -prices[i]), 即要么之前买了没卖，要么今天买；
    - 不持有股票: dp[i][0] = max(dp[i - 1][0], dp[i - 1][1] + prices[i]);

    当股票可以交易无数次时:
    - 持有股票: dp[i][1] = max(dp[i - 1][1], dp[i - 1][0] - prices[i]);
    - 不持有股票: dp[i][0] = max(dp[i - 1][0], dp[i - 1][1] + prices[i]);

    当股票规定只能交易 k 次时：
    - 持有股票: dp[i][k][1] = max(dp[i - 1][k][1], k === 0 ? -prices[i] : dp[i - 1][k - 1][0] - prices);
    - 不持有股票: dp[i][k][0] = max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i])；

    卖出时有手续费：
    - 持有股票: - 持有股票 dp[i][k][1] = max(dp[i - 1][k][1], k === 0 ? -prices[i] : dp[i - 1][k - 1][0] - prices);
    - 不持有股票: dp[i][k][0] = max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i] - fee)；

    有冷冻期:
    - 持有股票: - 持有股票 dp[i][k][1] = max(dp[i - 1][k][1], k === 0 ? -prices[i] : dp[i - m][k - 1][0] - prices);
    - 不持有股票: 不持有股票 dp[i][k][0] = max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i])；


- **其他动态规划问题**
  - [ ] [剪绳子](https://leetcode-cn.com/problems/jian-sheng-zi-lcof/) - 这道题值得再回来回顾一下，是自己一遍做出来的，赞
  - [ ] [数值的整数次方](https://leetcode-cn.com/problems/shu-zhi-de-zheng-shu-ci-fang-lcof/) - 好题！！
  - [ ] [礼物的最大价值](https://leetcode.cn/problems/li-wu-de-zui-da-jie-zhi-lcof/) - dfs 超时，改用动态回归，好题！！
  - [ ] [回文字符串的个数](https://leetcode.cn/problems/a7VOhD/) - 使用动态规划可解，但是时间复杂度较大；

    一个问题，可以使用回溯、暴力求解，但是会超时，可以考虑是否可以使用动态回归。

    

#### 回溯算法

**回溯算法**问题的一般形式就是：**列出某个问题的所有情况**。

**回溯算法**的核心思想: **穷举**。

**回溯算法**的解题思路: 将问题转化为**多叉树的深度遍历问题**。

**回溯算法**的具体解题思路:
- 先将问题转化为一颗**多叉树**；
- 采用深度优先遍历方式(先遍历子节点，再遍历兄弟节点)，收集所有遍历到叶子节点的路径；
  
**回溯算法**的关键点是**递归 + 回溯**，解题模板：

```
let result = [];

let tract = [];

function backTrack(list, track) {

    if (满足条件) {
        result.add(track.slice(0))
    }

    for(item of list) {
        if (判断 item 是否可以添加到 track 中) {
            track.push(item);  // 做选择(处理当前节点)
            backTrack(list, track);  // 遍历子节点
            track.pop(item);  // 撤销选择(准备遍历兄弟节点)
        }
    }
}
```

回溯算法需要的时间复杂度很大，解题规模一般比较小。

回溯算法，关键是在所有选项形成的树上进行 DFS。如果明确知道某些子树没有必要遍历，那么在遍历的时候应该避开这些子树以优化效率，这个称之为剪枝。

常见的回溯算法问题：
- **集合、排列、子集问题**
  - [x] [所有子集](https://leetcode.cn/problems/TVdhkn/)
  - [x] [包含 K 个元素的组合](https://leetcode.cn/problems/uUsW3B/)
  - [x] [允许选择重复元素的组合](https://leetcode.cn/problems/Ygoe9J/)
  - [x] [含有重复元素的组合](https://leetcode.cn/problems/4sjJUc/), 这道题的关键是先排序，然后去除重复的组合(去除重复的组合的方法要回来回顾一下)
  - [x] [含有重复元素的全排列组合](https://leetcode.cn/problems/7p8L0Z/)
  - [x] [没有重复元素的全排列组合](https://leetcode.cn/problems/VvJkup/)
  - [x] [组合总和-1](https://leetcode.cn/problems/combination-sum/)
  - [x] [组合总和-2](https://leetcode.cn/problems/combination-sum-ii/)
  - [x] [组合总和-3](https://leetcode.cn/problems/combination-sum-iii/)
  - [ ] [组合总和-4](https://leetcode.cn/problems/combination-sum-iv/) - 使用回溯会超时，这就要考虑使用动态规划了
  - [x] [子集-1](https://leetcode.cn/problems/subsets/)
  - [x] [子集-2](https://leetcode.cn/problems/subsets-ii/)

    在集合、排列、子集问题中，如果给定的列表中有重复元素，那么就需要先做排序，然后再去做去重。

    去重有一个小技巧：如果当前元素和上一个元素相等，且上一个元素还没有被选择，那么当前元素不可选。如果不这么处理，那就造成重复了。

- **其他问题**
  - [生成匹配的括号](https://leetcode.cn/problems/IDBivT/)
  - [分割回文子字符串](https://leetcode.cn/problems/M99OJA/)
  - [恢复 IP 地址](https://leetcode.cn/problems/0on3uN/)


在使用回溯算法的时候，如果出现超时的情况，则要考虑使用动态规划算法了

#### DFS + BFS

- **岛屿问题**
  - [x] [岛屿的数量](https://leetcode.cn/problems/number-of-islands/), 找到小岛，然后使用 DFS 算法淹没它；
  - [x] [统计子岛屿](https://leetcode.cn/problems/count-sub-islands/), 对比 A、B， 将 B 中不是子岛屿的岛屿淹没掉，剩下的就是子岛屿了；
  - [x] [岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island/), 淹没岛屿时，要记录淹没的次数；
  - [x] [统计封闭岛屿的数量](https://leetcode.cn/problems/number-of-closed-islands/), 先淹没边缘，然后再用淹没岛屿的方法统一淹没岛屿的数量；
  - [x] [飞地的数量](https://leetcode.cn/problems/number-of-enclaves/), 先淹没边缘岛屿，然后再统计淹没剩余岛屿的次数；
  - [x] [岛屿的周长](https://leetcode.cn/problems/island-perimeter/), 这个题是简单类型的题目，不需要淹没岛屿；
  - [ ] [计算不同岛屿的数量](https://leetcode.cn/problems/number-of-distinct-islands/)，解题的关键 - 记录遍历的顺序并序列化，然后比较序列化的字符串就可以了，也比较简单；
  - [ ] [使陆地分离的最小天数](https://leetcode.cn/problems/minimum-number-of-days-to-disconnect-island/)




#### n 数之和问题
- [x] [两数之和](https://leetcode.cn/problems/two-sum/) - 两数之和比较简单，一种解法是两层循环暴力求解；另一种解法是两次循环，第一次循环记录 target - nums[i] 和 i，然后在第二次循环中找 nums 中是否存在 target-nums[i];
- [x] [三数之和](https://leetcode.cn/problems/3sum/) - 三数之和，关键之处有三点： 排序 + 双层循环 + 去除重复组合
- [x] [四数之和](https://leetcode.cn/problems/4sum/) - 四叔之和，和三数之和一样，关键之处也是三点: 排序 + 三层循环 + 去除重复组合

```
function threeSum(nums) {
    let result = [];
    if (!nums || !nums.length || nums.length < 3) return result;
    let start = 0, end = nums.length - 1;
    if (nums[start] <= 0 && nums[end] >= 0) {
        while(start < end) {
            let a = nums[start], j = start + 1, k = end;
            while( j < k) {
                let b = nums[j], c = nums[k];
                let res = a + b + c;
                if (res === 0) result.push([a, b, c]);
                if (res <= 0) {
                    while(nums[j] === b && j++ < k) {}
                }
                if (res >= 0) {
                    while(nums[k] === c && j < k--) {}
                }
            }
            while(nums[start] === a && start++ < end) {}

        }
    }
    return result;
}
```


#### 二叉树问题



#### 链表问题


#### 查找问题


#### 数组、字符串问题

- **左右指针**

- **滑动窗口** 


#### 排序问题
  




#### BFS 算法

**BFS**，**广度优先遍历**, 一般会借助**队列 - queue** 来实现。

**BSF** 和 **DSF** 算法相比，算法的空间复杂度要高一些。

**BFS** 算法的关键：能把实际问题理解为 **BFS**。

**DFS**、**BFS** 算法的的一般解题思路：将**实际问题转化为多叉树的遍历**，**求全解用 DFS**， **求最短用 BFS**


#### 链表问题

**链表问题**的常用解法: **双指针**、**快慢指针**。

- **合并两个有序链表**: 利用临时缓存合并(空间复杂度较高)、以某一链表为主合并(合并逻辑会稍微复杂一点)。
- **合并多个有序链表**: 利用临时缓存 + 最小堆(空间复杂度较高)。
- **寻找倒数第 k 个节点**: 双指针，第一个指针先走 k 步，然后第二个指针指向链表的头部，之后两个指针一起向后遍历，第一个指针到到链表尾部时，第二个指针也就指向了链表的第 k 个节点。
- **寻找链表的中间节点**: 快慢指针，一个指针一次走两步，另一个指针一次走一步，当第一个指针到达链表尾部时，第二个指针也就指向了链表的中间节点。
- **判断链表有环**: 快慢指针，一个指针一次走两步，另一个指针一次一步，快指针能追上慢指针，说明有环，否则没有。当快指针指向 null 或者快指针的 next 指向 null，停止追赶。
- **判断链表环的起点**: 快指针追上慢指针以后，慢指针指向 head，快指针继续前进，两者再次相遇的节点就是环的起点。
- **判断链表相交**: 双指针,第一个指针先遍历 A，再遍历 B; 第二个指针先遍历 再遍历 A； 当两个指针指向同一个节点时，说明链表相交。




#### 数组、字符串问题

数组、字符串问题的常用解法: **左右指针**、**滑动窗口**

- **数组、字符串反转**: 使用**左右指针**；
- **字符串寻找满足题意的子串**: 使用**左右指针**、**滑动窗口**，
  
    整个过程如下:
    - 移动右指针，扩大窗口，直到满足要求为止；
    - 移动左指针，缩小窗口，满足要求就更新结果；不满足要求，停止移动；
    - 重复第一步，移动右指针，直到右指针到底为止；

    **滑动窗口**最关键的就是找准**缩小窗口**的时机。

    常见的滑动窗口题目:
    - [ ] [不含重复字符的最长子字符串](https://leetcode.cn/problems/wtcaE1/)


#### 岛屿问题

岛屿问题的常用解法: 使用 **DFS/BFS** 遍历二维数组，遍历的方向有**上**、**下**、**左**、**右**四个。

常见的岛屿问题:
- **计算岛屿的数量**: 从 grid[0][0] 开始遍历二维数组，遇到 1 则 res 加 1， 然后使用 DFS 将附近的 1 全部变为 0；
- **计算封闭岛屿的数量**: 从四周开始，使用 DFS 算法将靠边岛屿全部淹没掉；然后再计算封闭岛屿；
- **计算岛屿的最大面积**: 使用 DFS 淹没岛屿时，记录淹没岛屿的面积；
- **计算子岛屿的数量**： 将不是子岛屿的先淹掉，然后再计算剩余岛屿的数量；
- **计算不同岛屿的数量**: 每次淹没子岛屿的时候，记录递归的顺序；

    ```
    void dfs(int[][] grid, int i, int j, StringBuilder sb, int dir) {
        int m = grid.length, n = grid[0].length;
        if (i < 0 || j < 0 || i >= m || j >= n 
            || grid[i][j] == 0) {
            return;
        }
        // 前序遍历位置：进入 (i, j)
        grid[i][j] = 0;
        sb.append(dir).append(',');
        
        dfs(grid, i - 1, j, sb, 1); // 上
        dfs(grid, i + 1, j, sb, 2); // 下
        dfs(grid, i, j - 1, sb, 3); // 左
        dfs(grid, i, j + 1, sb, 4); // 右
        
        // 后序遍历位置：离开 (i, j)
        sb.append(-dir).append(',');
    }
    ```

    最后比较一下序列化的结果就好。

- **使岛屿分离的最小天数**











#### 排序

- **堆排序**

    **堆排序**的过程:
    - 先将一个无序数组转化为最大堆(如果是从小到大排序，那么需要最大堆；如果是从大到小排序，那么需要最小堆)；
    - 依次将堆顶元素放在数组的末尾，然后重新调整堆。

    将一个无需数组转化为堆的过程: 从第 nums.length / 2 个开始到第 0 个节点，一次判断节点的值要不要下沉。节点下沉的时候要沉到底。

    堆排序: 将堆顶元素放在 nums 的末尾，然后把末尾的元素放在堆顶，然后将堆顶元素下沉。下沉的时候要结束边界要逐渐减少 1。

    出堆操作: 将堆底元素放在堆顶，然后下沉。

    入堆操作: 将新元素放在堆底，然后上浮

    ```
        let list = [1, 3, 7, 2, 5, 10, 12, 6, 4, 9];

        // heap 元素下沉
        function siftDown(nums, parentIndex, length) {
            if (parentIndex >= length) return;
            let childIndex = parentIndex * 2 + 1;
            while(childIndex < length) {
                let temp = numms[parentIndex];
                if (nums[childIndex] < nums[childIndex + 1] && childIndex + 1 < length) {
                    childIndex++;
                }
                if (nums[childIndex] > temp) {
                    nums[parent] = nums[childIndex];
                    parentIndex = childIndex;
                    childIndex = parentIndex * 2 + 1;
                }
                nums[parentIndex] = temp;
            }
        }

        // heap 元素上升
        function siftUp(heap, childIndex) {
            while(childIndex >= 0) {
                let parentIndex = parseInt((childIndex - 1) / 2);
                if (heap[parentIndex] < heap[childIndex]) {
                    let temp = heap[parentIndex];
                    heap[parentIndex] = heap[childIndex];
                    childIndex = parentIndex;
                }
                heap[childIndex] = temp;
            }
        }

        // 元素堆底入堆，每次添加到 heap 的底部
        function push(heap, num) {
            heap.push(num);
            siftUp(heap, heap.length - 1)
        }

        // 元素堆顶出堆，每次从 heap 的头部出堆
        function pop(heap) {
            let head = heap[0];
            heap[0] = heap[heap.length];
            heap.pop();
            siftDown(heap, 0, heap.length - 1);
            return head;
        }

        function heapSort(nums) {
            if (!nums || !nums.length) return nums;
            // 将 nums 调整为最小堆(最大堆)
            for(let i = nums.length / 2; i > 0; i--) {
                siftDown(nums, i, nums.length - 1);
            }
            for(let i = nums.length - 1; i >=0; i--) {
                let temp = nums[0];
                nums[0] = nums[i]
                nums[i] = temp;
                siftDown(nums, 0, i); 
            }
        }
    ```

- **快速排序**

    **快速排序**采用**分治**的思想，整个过程如下:
    - 找一个基准元素，将小于基准元素的放到左边，将大于基准元素的放到右边；
    - 替换基准元素和 left 的位置；
    - 基准元素左右进行快速排序；

    ```
    function quickSort(list, startIndex, endIndex) {
        if (startIndex >= endIndex) return;
        let pivotIndex = position(list, startIndex, endIndex);
        quickSort(list, startIndex, pivotIndex - 1);
        quickSort(list, pivotIndex + 1, endIndex); 

    }

    function position(list, startIndex, endIndex) {
        let left = startIndex, right = endIndex, pivotIndex = left, pivot = list[pivotIndex];
        while(left != right) {
            while(left < right && list[left] <= pivot) { left++ }
            while(left < right && list[right] >= pivot) { right++ }
            if (left < right) {
                let temp = list[left];
                list[left] = list[right];
                list[right] = temp;
            }
        }
        list[pivotIndex] = list[left];
        list[left] = pivot;
        return left;
    }

    ```
- **冒泡排序**

    **冒泡排序**的思路：每一次排序的时候都确定最大(最小)的元素。

    ```
    function bubbleSort(list) {
        if (!list || !list.length) return list;
        for(let i = 0; i < list.length; i++) {
            for(let j = 0; j < list.length - i - 1; j++) {
                if (list[j] < list[j + 1]) {
                    let temp = list[j];
                    list[j] = list[j + 1];
                    list[j + 1] = temp;
                }
            }
        }
        return list;
    }
    ```

#### 递归

**递归**算法的关键:
- 问题能分解为子问题；
- 找到 base case；

常见的递归解法:
- **反转链表**
- **有序链表合并**


#### 递归

- [求1+2+…+n](https://leetcode.cn/problems/qiu-12n-lcof/) - 递归 + 逻辑运算符(一般人想不到)；



#### 二叉树题目
- [二叉树的最近公共祖先](https://leetcode-cn.com/problems/er-cha-shu-de-zui-jin-gong-gong-zu-xian-lcof/);
- [二叉搜索树的最近公共祖先](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-zui-jin-gong-gong-zu-xian-lcof/);
- [二叉搜索树转双向链表](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-yu-shuang-xiang-lian-biao-lcof/), 这道题不错！
- [二叉搜索树的后序遍历序列](https://leetcode.cn/problems/er-cha-sou-suo-shu-de-hou-xu-bian-li-xu-lie-lcof/), 这道题也不错！

#### 链表题目
- [相交链表](https://leetcode-cn.com/problems/3u1WK4/submissions/);
- [复杂链表的复制](https://leetcode-cn.com/problems/fu-za-lian-biao-de-fu-zhi-lcof/);


#### 双指针
- [最多删除一个字符得到回文](https://leetcode-cn.com/problems/RQku0D/)





#### 排序
- [数据流的第 K 大数值](https://leetcode-cn.com/problems/jBjn9C/) - 采用堆排序？？
- [把数组排成最小的字符串](https://leetcode.cn/problems/ba-shu-zu-pai-cheng-zui-xiao-de-shu-lcof/) - 解题过程很巧妙
！！


#### 二分查找
- [山峰数组的顶部](https://leetcode-cn.com/problems/B1IidL/)
- [求平方根](https://leetcode-cn.com/problems/jJ0w9p/)
- [数值的整数次方](https://leetcode-cn.com/problems/shu-zhi-de-zheng-shu-ci-fang-lcof/) - 这个题很有意思，是二分法的巧妙使用，需要重点关注一下；


二分查找的核心：如何使用 middle 去替换 left 或者 right，缩小查找范围。


#### 坐标轴方法
- [二维数组中的查找](https://leetcode-cn.com/problems/er-wei-shu-zu-zhong-de-cha-zhao-lcof/submissions/)


#### 回溯
- [矩阵中的路径](https://leetcode-cn.com/problems/ju-zhen-zhong-de-lu-jing-lcof/) - 这一道题完全是自己独立做出来的，点赞！
- [机器人的运动范围](https://leetcode-cn.com/problems/ji-qi-ren-de-yun-dong-fan-wei-lcof/);
- [字符串的列表](https://leetcode.cn/problems/zi-fu-chuan-de-pai-lie-lcof/) - 这一道题，类似的题比较多，要注意一下哈
- [二叉树中和为某一值的路径](https://leetcode.cn/problems/er-cha-shu-zhong-he-wei-mou-yi-zhi-de-lu-jing-lcof/)
- [允许重复选择元素的组合](https://leetcode.cn/problems/Ygoe9J/), 元素可以重复使用;
- [含有重复元素集合的组合](https://leetcode.cn/problems/4sjJUc/), 每个元素只能使用一次;
- [没有重复元素集合的全排列](https://leetcode.cn/problems/VvJkup/), 这道题比较简单;
- [含有重复元素集合的全排列](https://leetcode.cn/problems/7p8L0Z/), 这个是好题，要注意！！

> 注意：遇到含有重复元素的题，要将给定的列表先排序，然后将重复的元素去除掉！！


#### 二叉树
- [重建二叉树](https://leetcode-cn.com/problems/zhong-jian-er-cha-shu-lcof/) - 利用前序遍历和中序遍历重建二叉树，这道题很有意思！！
- [树的子结构](https://leetcode-cn.com/problems/shu-de-zi-jie-gou-lcof/) - 判断一颗树是否是另一颗树的子树，层级遍历 + 递归判断两颗树是否一样；


#### 有限状态自动机
- [表示数值的字符串](https://leetcode-cn.com/problems/biao-shi-shu-zhi-de-zi-fu-chuan-lcof/), 这个题目前第一次看到，后面如果再碰到类似的题，或者有时间，可以再重点看一下；


#### 栈
- [栈的压入、弹出系列](https://leetcode.cn/problems/zhan-de-ya-ru-dan-chu-xu-lie-lcof/)

#### 滑动窗口
-[最长不含重复字符的子字符串](https://leetcode.cn/problems/zui-chang-bu-han-zhong-fu-zi-fu-de-zi-zi-fu-chuan-lcof/)


#### 先找到数学规律
- [数字序列中某一位的数字](https://leetcode.cn/problems/shu-zi-xu-lie-zhong-mou-yi-wei-de-shu-zi-lcof/) - 回来再看看！！


#### 位运算
- [数组中数字出现的次数-1](https://leetcode.cn/problems/er-jin-zhi-zhong-1de-ge-shu-lcof/)??
- [数组中数字出现的次数-2](https://leetcode.cn/problems/shu-zu-zhong-shu-zi-chu-xian-de-ci-shu-lcof/) - 回来再看看
- [数组中数字出现的次数-3](https://leetcode.cn/problems/shu-zu-zhong-shu-zi-chu-xian-de-ci-shu-ii-lcof/) - 回来再看看
- [数组中只出现一次的数字](https://leetcode.cn/problems/WGki4K/) - 有负数

位运算：**按位与 - &**、**按位或 - |**、**按位异或 - ^**、**按位取反 - ~**、**左移 - <<**、**带符号右移 - >>**、**无符号右移 - >>>**

**&**: 相同位的两个数字都为 1，则为 1；若有一个不为 1， 则为 0；
**|**: 相同位只要有一个为 1，则为 1；
**^**: 相同位不同则为 1，不同则为 0；
**~**:
**<<**:
**>>**:
**<<<**:

常用的位运算技巧:
- 判断奇数/偶数:  a & 1 = 0, 偶数； a & 1 = 1, 奇数；
- 消除二进制中的最后一个 1： **n & (n - 1)**;
- 一个数和它本身做异或运算返回 0： a ^ a = 0;
- 一个数和 0 做异或运算返回本身: a ^ 0 = a;
- 统计二进制中 1 的个数: 循环进行  **n & (n - 1)**, 直到 n 为 0 为止；
- 正整数循环向右移动一位，最后会变为 0； 负整数循环向右移动一位，最后会变为 -1， 这一点要注意哈！！；



#### 动态规划



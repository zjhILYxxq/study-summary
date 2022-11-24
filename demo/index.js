function func(n) {
    if (n === 1) return 9;
    let dp = new Array(n + 1).fill(0);
    dp[1] = 9;
    for(let i = 2; i <= n; i++) {
        dp[i] = Math.pow(10, i);
        for(let j = 1; j < i; j++) {
            dp[i] = dp[i] - dp[j] * j;
        }
    }
    return dp[n]
}

console.log(func(1));

console.log(func(2));

console.log(func(3));

console.log(func(4));
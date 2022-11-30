
/**
 * [1, 2, 3]
 * 输出结果: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3,2,1]]
 * @param {*} list 
 */
function allList(list) {
    let result = [], temp = [], cache = [];

    function help() {
        if (temp.length === list.length) {
            result.push(temp.slice(0));
            return;
        }
        for(let i = 0; i < list.length; i++) {
            if (cache[i]) continue;
            temp.push(list[i]);
            cache[i] = true;
            help();
            temp.pop();
            cache[i] = false;
        }
    }
    help();
    return result;
}

let list_1 = [1, 2, 3];

console.log(allList(list_1));

let list_2 = [1, 2, 3, 4];

console.log(allList(list_2));
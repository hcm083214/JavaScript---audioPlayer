/*
 * @Author: 黄灿民
 * @Date: 2021-05-01 11:57:53
 * @LastEditTime: 2021-05-10 20:41:54
 * @LastEditors: 黄灿民
 * @Description: 
 * @FilePath: \code6\js\reactive.js
 */
export function reactive(obj, effective) {
    return new Proxy(obj, {
        get(obj, key) {
            return Reflect.get(obj, key)
        },
        set(obj, key, value) {
            let set = Reflect.set(obj, key, value)
            effective();
            return set;
        }
    })
}
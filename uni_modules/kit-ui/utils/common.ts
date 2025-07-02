/**
 * 通用工具函数
 */

/**
 * 判断是否为空值
 * @param value 要判断的值
 * @returns 是否为空
 */
// export function isEmpty(value: any): boolean {
//   if (value === null || value === undefined) {
//     return true;
//   }

//   if (typeof value === 'string') {
//     return value.trim() === '';
//   }

//   if (Array.isArray(value)) {
//     return value.length === 0;
//   }

//   if (typeof value === 'object') {
//     return Object.keys(value).length === 0;
//   }

//   return false;
// }

/**
 * 判断是否为非空值
 * @param value 要判断的值
 * @returns 是否为非空
 */
// export function isNotEmpty(value: any): boolean {
//   return !isEmpty(value);
// }

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 拷贝后的对象
 */
// export function deepClone<T>(obj: T): T {
//   if (obj === null || typeof obj !== 'object') {
//     return obj;
//   }

//   if (obj instanceof Date) {
//     return new Date(obj.getTime()) as unknown as T;
//   }

//   if (obj instanceof Array) {
//     return obj.map(item => deepClone(item)) as unknown as T;
//   }

//   if (typeof obj === 'object') {
//     const clonedObj = {} as T;
//     for (const key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         clonedObj[key] = deepClone(obj[key]);
//       }
//     }
//     return clonedObj;
//   }

//   return obj;
// }

/**
 * 合并对象
 * @param target 目标对象
 * @param sources 源对象
 * @returns 合并后的对象
 */
// export function merge<T extends Record<string, any>>(
//   target: T,
//   ...sources: Partial<T>[]
// ): T {
//   if (!target) {
//     target = {} as T;
//   }

//   sources.forEach(source => {
//     if (source) {
//       Object.keys(source).forEach(key => {
//         const sourceValue = source[key];
//         const targetValue = target[key];

//         if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
//           target[key] = merge(targetValue, sourceValue);
//         } else {
//           target[key] = sourceValue;
//         }
//       });
//     }
//   });

//   return target;
// }

/**
 * 判断是否为纯对象
 * @param obj 要判断的对象
 * @returns 是否为纯对象
 */
// export function isPlainObject(obj: any): obj is Record<string, any> {
//   return Object.prototype.toString.call(obj) === '[object Object]';
// }

/**
 * 生成唯一ID
 * @param prefix 前缀
 * @returns 唯一ID
 */
export function generateId(prefix : string = 'k') : string {
	return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 获取对象属性值（支持嵌套路径）
 * @param obj 对象
 * @param path 属性路径，如 'a.b.c'
 * @param defaultValue 默认值
 * @returns 属性值
 */
// export function get<T = any>(
//   obj: Record<string, any>,
//   path: string,
//   defaultValue?: T
// ): T {
//   if (!obj || !path) {
//     return defaultValue as T;
//   }

//   const keys = path.split('.');
//   let result = obj;

//   for (const key of keys) {
//     if (result === null || result === undefined || !(key in result)) {
//       return defaultValue as T;
//     }
//     result = result[key];
//   }

//   return result as T;
// }

/**
 * 设置对象属性值（支持嵌套路径）
 * @param obj 对象
 * @param path 属性路径，如 'a.b.c'
 * @param value 要设置的值
 */
// export function set(
//   obj: Record<string, any>,
//   path: string,
//   value: any
// ): void {
//   if (!obj || !path) {
//     return;
//   }

//   const keys = path.split('.');
//   let current = obj;

//   for (let i = 0; i < keys.length - 1; i++) {
//     const key = keys[i];
//     if (!(key in current) || !isPlainObject(current[key])) {
//       current[key] = {};
//     }
//     current = current[key];
//   }

//   current[keys[keys.length - 1]] = value;
// }

/**
 * 数组去重
 * @param arr 数组
 * @param key 对象数组时的去重键
 * @returns 去重后的数组
 */
export function unique<T>(
	arr : T[],
	key ?: keyof T
) : T[] {
	if (!Array.isArray(arr)) {
		return [];
	}

	if (key) {
		const seen = new Set();
		return arr.filter(item => {
			const value = item[key];
			if (seen.has(value)) {
				return false;
			}
			seen.add(value);
			return true;
		});
	}

	return [...new Set(arr)];
}

/**
 * 数组分组
 * @param arr 数组
 * @param key 分组键
 * @returns 分组后的对象
 */
// export function groupBy<T>(
//   arr: T[],
//   key: keyof T | ((item: T) => string | number)
// ): Record<string, T[]> {
//   if (!Array.isArray(arr)) {
//     return {};
//   }

//   return arr.reduce((groups, item) => {
//     const groupKey = typeof key === 'function' ? key(item) : item[key];
//     const groupKeyStr = String(groupKey);

//     if (!groups[groupKeyStr]) {
//       groups[groupKeyStr] = [];
//     }

//     groups[groupKeyStr].push(item);
//     return groups;
//   }, {} as Record<string, T[]>);
// }

/**
 * 延迟执行
 * @param ms 延迟时间（毫秒）
 * @returns Promise
 */
export function sleep(ms : number) : Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 * @param fn 要重试的函数
 * @param times 重试次数
 * @param delay 重试间隔（毫秒）
 * @returns Promise
 */
export async function retry<T>(
	fn : () => Promise<T>,
	times : number = 3,
	delay : number = 1000
) : Promise<T> {
	let lastError : Error;

	for (let i = 0; i < times; i++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error as Error;
			if (i < times - 1) {
				await sleep(delay);
			}
		}
	}

	throw lastError!;
}

/**
 * 数字范围限制
 * @param value 值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的值
 */
export function clamp(value : number, min : number, max : number) : number {
	return Math.min(Math.max(value, min), max);
}

/**
 * 随机数生成
 * @param min 最小值
 * @param max 最大值
 * @param integer 是否为整数
 * @returns 随机数
 */
export function random(min : number = 0, max : number = 1, integer : boolean = false) : number {
	const value = Math.random() * (max - min) + min;
	return integer ? Math.floor(value) : value;
}
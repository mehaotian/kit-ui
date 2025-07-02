/**
 * 格式化工具函数
 */

/**
 * 数字格式化
 * @param num 数字
 * @param options 格式化选项
 * @returns 格式化后的字符串
 */
export function formatNumber(
	num : number,
	options : {
		decimals ?: number;
		thousandsSeparator ?: string;
		decimalSeparator ?: string;
		prefix ?: string;
		suffix ?: string;
	} = {}
) : string {
	const {
		decimals = 0,
		thousandsSeparator = ',',
		decimalSeparator = '.',
		prefix = '',
		suffix = ''
	} = options;

	if (isNaN(num)) {
		return 'NaN';
	}

	const fixedNum = num.toFixed(decimals);
	const parts = fixedNum.split('.');

	// 添加千位分隔符
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

	let result = parts.join(decimalSeparator);

	return `${prefix}${result}${suffix}`;
}

/**
 * 货币格式化
 * @param amount 金额
 * @param currency 货币符号
 * @param decimals 小数位数
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(
	amount : number,
	currency : string = '¥',
	decimals : number = 2
) : string {
	return formatNumber(amount, {
		decimals,
		thousandsSeparator: ',',
		prefix: currency
	});
}

/**
 * 百分比格式化
 * @param value 值
 * @param decimals 小数位数
 * @returns 格式化后的百分比字符串
 */
export function formatPercent(
	value : number,
	decimals : number = 2
) : string {
	return formatNumber(value * 100, {
		decimals,
		suffix: '%'
	});
}

/**
 * 文件大小格式化
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(
	bytes : number,
	decimals : number = 2
) : string {
	if (bytes === 0) return '0 B';

	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * 时间格式化
 * @param date 日期
 * @param format 格式字符串
 * @returns 格式化后的时间字符串
 */
// export function formatDate(
// 	date : Date | string | number,
// 	format : string = 'YYYY-MM-DD HH:mm:ss'
// ) : string {
// 	const d = new Date(date);

// 	if (isNaN(d.getTime())) {
// 		return 'Invalid Date';
// 	}

// 	const year = d.getFullYear();
// 	const month = d.getMonth() + 1;
// 	const day = d.getDate();
// 	const hour = d.getHours();
// 	const minute = d.getMinutes();
// 	const second = d.getSeconds();
// 	const millisecond = d.getMilliseconds();

// 	const formatMap = {
// 		'YYYY': year.toString(),
// 		'YY': year.toString().slice(-2),
// 		'MM': month.toString().padStart(2, '0'),
// 		'M': month.toString(),
// 		'DD': day.toString().padStart(2, '0'),
// 		'D': day.toString(),
// 		'HH': hour.toString().padStart(2, '0'),
// 		'H': hour.toString(),
// 		'mm': minute.toString().padStart(2, '0'),
// 		'm': minute.toString(),
// 		'ss': second.toString().padStart(2, '0'),
// 		's': second.toString(),
// 		'SSS': millisecond.toString().padStart(3, '0')
// 	};

// 	let result = format;
// 	Object.keys(formatMap).forEach(key => {
// 		result = result.replace(new RegExp(key, 'g'), formatMap[key]);
// 	});

// 	return result;
// }

/**
 * 相对时间格式化
 * @param date 日期
 * @param baseDate 基准日期
 * @returns 相对时间字符串
 */
// export function formatRelativeTime(
// 	date : Date | string | number,
// 	baseDate : Date = new Date()
// ) : string {
// 	const d = new Date(date);
// 	const base = new Date(baseDate);

// 	if (isNaN(d.getTime()) || isNaN(base.getTime())) {
// 		return 'Invalid Date';
// 	}

// 	const diff = base.getTime() - d.getTime();
// 	const seconds = Math.floor(diff / 1000);
// 	const minutes = Math.floor(seconds / 60);
// 	const hours = Math.floor(minutes / 60);
// 	const days = Math.floor(hours / 24);
// 	const months = Math.floor(days / 30);
// 	const years = Math.floor(days / 365);

// 	if (seconds < 60) {
// 		return '刚刚';
// 	} else if (minutes < 60) {
// 		return `${minutes}分钟前`;
// 	} else if (hours < 24) {
// 		return `${hours}小时前`;
// 	} else if (days < 30) {
// 		return `${days}天前`;
// 	} else if (months < 12) {
// 		return `${months}个月前`;
// 	} else {
// 		return `${years}年前`;
// 	}
// }

/**
 * 手机号格式化（脱敏）
 * @param phone 手机号
 * @param maskChar 掩码字符
 * @returns 格式化后的手机号
 */
export function formatPhone(
	phone : string,
	maskChar : string = '*'
) : string {
	if (!phone || phone.length !== 11) {
		return phone;
	}

	return phone.replace(/(\d{3})\d{4}(\d{4})/, `$1${maskChar.repeat(4)}$2`);
}

/**
 * 身份证号格式化（脱敏）
 * @param idCard 身份证号
 * @param maskChar 掩码字符
 * @returns 格式化后的身份证号
 */
export function formatIdCard(
	idCard : string,
	maskChar : string = '*'
) : string {
	if (!idCard) {
		return idCard;
	}

	if (idCard.length === 15) {
		return idCard.replace(/(\d{6})\d{6}(\d{3})/, `$1${maskChar.repeat(6)}$2`);
	} else if (idCard.length === 18) {
		return idCard.replace(/(\d{6})\d{8}(\d{4})/, `$1${maskChar.repeat(8)}$2`);
	}

	return idCard;
}

/**
 * 银行卡号格式化（脱敏）
 * @param cardNumber 银行卡号
 * @param maskChar 掩码字符
 * @returns 格式化后的银行卡号
 */
export function formatBankCard(
	cardNumber : string,
	maskChar : string = '*'
) : string {
	if (!cardNumber) {
		return cardNumber;
	}

	const cleanNumber = cardNumber.replace(/\s/g, '');

	if (cleanNumber.length < 8) {
		return cardNumber;
	}

	const firstFour = cleanNumber.slice(0, 4);
	const lastFour = cleanNumber.slice(-4);
	const middleLength = cleanNumber.length - 8;

	return `${firstFour} ${maskChar.repeat(middleLength)} ${lastFour}`;
}

/**
 * 邮箱格式化（脱敏）
 * @param email 邮箱
 * @param maskChar 掩码字符
 * @returns 格式化后的邮箱
 */
export function formatEmail(
	email : string,
	maskChar : string = '*'
) : string {
	if (!email || !email.includes('@')) {
		return email;
	}

	const [username, domain] = email.split('@');

	if (username.length <= 2) {
		return email;
	}

	const maskedUsername = username.charAt(0) +
		maskChar.repeat(username.length - 2) +
		username.charAt(username.length - 1);

	return `${maskedUsername}@${domain}`;
}

/**
 * 姓名格式化（脱敏）
 * @param name 姓名
 * @param maskChar 掩码字符
 * @returns 格式化后的姓名
 */
export function formatName(
	name : string,
	maskChar : string = '*'
) : string {
	if (!name || name.length < 2) {
		return name;
	}

	if (name.length === 2) {
		return name.charAt(0) + maskChar;
	}

	return name.charAt(0) + maskChar.repeat(name.length - 2) + name.charAt(name.length - 1);
}

/**
 * 数字转中文
 * @param num 数字
 * @returns 中文数字
 */
export function numberToChinese(num : number) : string {
	const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
	const units = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿'];

	if (num === 0) return '零';
	if (num < 0) return '负' + numberToChinese(-num);

	let result = '';
	let unitIndex = 0;

	while (num > 0) {
		const digit = num % 10;

		if (digit !== 0) {
			result = digits[digit] + units[unitIndex] + result;
		} else if (result && !result.startsWith('零')) {
			result = '零' + result;
		}

		num = Math.floor(num / 10);
		unitIndex++;
	}

	// 处理特殊情况
	result = result.replace(/零+/g, '零');
	result = result.replace(/零$/, '');

	return result;
}

/**
 * 金额转大写
 * @param amount 金额
 * @returns 大写金额
 */
export function amountToChinese(amount : number) : string {
	const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
	const units = ['', '拾', '佰', '仟', '万', '拾万', '佰万', '仟万', '亿'];
	const fractionUnits = ['角', '分'];

	if (amount === 0) return '零元整';
	if (amount < 0) return '负' + amountToChinese(-amount);

	const [integerPart, fractionPart = ''] = amount.toFixed(2).split('.');
	let result = '';

	// 处理整数部分
	let num = parseInt(integerPart);
	let unitIndex = 0;

	while (num > 0) {
		const digit = num % 10;

		if (digit !== 0) {
			result = digits[digit] + units[unitIndex] + result;
		} else if (result && !result.startsWith('零')) {
			result = '零' + result;
		}

		num = Math.floor(num / 10);
		unitIndex++;
	}

	result = result.replace(/零+/g, '零');
	result = result.replace(/零$/, '');
	result = result || '零';
	result += '元';

	// 处理小数部分
	if (fractionPart && fractionPart !== '00') {
		const jiao = parseInt(fractionPart.charAt(0));
		const fen = parseInt(fractionPart.charAt(1));

		if (jiao > 0) {
			result += digits[jiao] + fractionUnits[0];
		}

		if (fen > 0) {
			if (jiao === 0) {
				result += '零';
			}
			result += digits[fen] + fractionUnits[1];
		}
	} else {
		result += '整';
	}

	return result;
}

/**
 * 字符串截断
 * @param str 字符串
 * @param length 长度
 * @param suffix 后缀
 * @returns 截断后的字符串
 */
export function truncate(
	str : string,
	length : number,
	suffix : string = '...'
) : string {
	if (!str || str.length <= length) {
		return str;
	}

	return str.slice(0, length - suffix.length) + suffix;
}

/**
 * 驼峰转短横线
 * @param str 驼峰字符串
 * @returns 短横线字符串
 */
export function camelToKebab(str : string) : string {
	return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * 短横线转驼峰
 * @param str 短横线字符串
 * @returns 驼峰字符串
 */
export function kebabToCamel(str : string) : string {
	return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 首字母大写
 * @param str 字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str : string) : string {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 移除HTML标签
 * @param html HTML字符串
 * @returns 纯文本字符串
 */
export function stripHtml(html : string) : string {
	return html.replace(/<[^>]*>/g, '');
}
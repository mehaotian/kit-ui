/**
 * 颜色处理工具函数
 */

/**
 * RGB颜色接口
 */
export interface RGB {
	r : number;
	g : number;
	b : number;
}

/**
 * RGBA颜色接口
 */
export interface RGBA extends RGB {
	a : number;
}

/**
 * HSL颜色接口
 */
export interface HSL {
	h : number;
	s : number;
	l : number;
}

/**
 * HSLA颜色接口
 */
export interface HSLA extends HSL {
	a : number;
}

/**
 * 十六进制转RGB
 * @param hex 十六进制颜色值
 * @returns RGB对象
 */
export function hexToRgb(hex : string) : RGB | null {
	// 移除#号
	hex = hex.replace('#', '');

	// 支持3位和6位十六进制
	if (hex.length === 3) {
		hex = hex.split('').map(char => char + char).join('');
	}

	if (hex.length !== 6) {
		return null;
	}

	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	return { r, g, b };
}

/**
 * RGB转十六进制
 * @param r 红色值 (0-255)
 * @param g 绿色值 (0-255)
 * @param b 蓝色值 (0-255)
 * @returns 十六进制颜色值
 */
export function rgbToHex(r : number, g : number, b : number) : string {
	const toHex = (n : number) => {
		const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * RGB转HSL
 * @param r 红色值 (0-255)
 * @param g 绿色值 (0-255)
 * @param b 蓝色值 (0-255)
 * @returns HSL对象
 */
export function rgbToHsl(r : number, g : number, b : number) : HSL {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h : number;
	let s : number;
	const l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // 无色彩
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
			default:
				h = 0;
		}

		h /= 6;
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100)
	};
}

/**
 * HSL转RGB
 * @param h 色相 (0-360)
 * @param s 饱和度 (0-100)
 * @param l 亮度 (0-100)
 * @returns RGB对象
 */
export function hslToRgb(h : number, s : number, l : number) : RGB {
	h /= 360;
	s /= 100;
	l /= 100;

	const hue2rgb = (p : number, q : number, t : number) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};

	let r : number;
	let g : number;
	let b : number;

	if (s === 0) {
		r = g = b = l; // 无色彩
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}

/**
 * 解析颜色字符串
 * @param color 颜色字符串
 * @returns RGBA对象或null
 */
export function parseColor(color : string) : RGBA | null {
	color = color.trim();

	// 十六进制颜色
	if (color.startsWith('#')) {
		const rgb = hexToRgb(color);
		return rgb ? { ...rgb, a: 1 } : null;
	}

	// RGB颜色
	const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
	if (rgbMatch) {
		return {
			r: parseInt(rgbMatch[1] || '0'),
			g: parseInt(rgbMatch[2] || '0'),
			b: parseInt(rgbMatch[3] || '0'),
			a: 1
		};
	}

	// RGBA颜色
	const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
	if (rgbaMatch) {
		return {
			r: parseInt(rgbaMatch[1] || '0'),
			g: parseInt(rgbaMatch[2] || '0'),
			b: parseInt(rgbaMatch[3] || '0'),
			a: parseFloat(rgbaMatch[4] || '1')
		};
	}

	// HSL颜色
	const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
	if (hslMatch) {
		const rgb = hslToRgb(
			parseInt(hslMatch[1] || '0'),
			parseInt(hslMatch[2] || '0'),
			parseInt(hslMatch[3] || '0')
		);
		return { ...rgb, a: 1 };
	}

	// HSLA颜色
	const hslaMatch = color.match(/hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*([\d.]+)\)/);
	if (hslaMatch) {
		const rgb = hslToRgb(
			parseInt(hslaMatch[1] || '0'),
			parseInt(hslaMatch[2] || '0'),
			parseInt(hslaMatch[3] || '0')
		);
		return { ...rgb, a: parseFloat(hslaMatch[4] || '1') };
	}

	return null;
}

/**
 * 颜色转字符串
 * @param color RGBA对象
 * @param format 输出格式
 * @returns 颜色字符串
 */
export function colorToString(
	color : RGBA,
	format : 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' = 'hex'
) : string {
	const { r, g, b, a } = color;

	switch (format) {
		case 'hex':
			return rgbToHex(r, g, b);
		case 'rgb':
			return `rgb(${r}, ${g}, ${b})`;
		case 'rgba':
			return `rgba(${r}, ${g}, ${b}, ${a})`;
		case 'hsl': {
			const hsl = rgbToHsl(r, g, b);
			return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
		}
		case 'hsla': {
			const hsl = rgbToHsl(r, g, b);
			return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a})`;
		}
		default:
			return rgbToHex(r, g, b);
	}
}

/**
 * 调整颜色亮度
 * @param color 颜色字符串
 * @param amount 调整量 (-100 到 100)
 * @returns 调整后的颜色
 */
export function lighten(color : string, amount : number) : string {
	const rgba = parseColor(color);
	if (!rgba) return color;

	const hsl = rgbToHsl(rgba.r, rgba.g, rgba.b);
	hsl.l = Math.max(0, Math.min(100, hsl.l + amount));

	const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
	return colorToString({ ...rgb, a: rgba.a }, 'hex');
}

/**
 * 调整颜色饱和度
 * @param color 颜色字符串
 * @param amount 调整量 (-100 到 100)
 * @returns 调整后的颜色
 */
export function saturate(color : string, amount : number) : string {
	const rgba = parseColor(color);
	if (!rgba) return color;

	const hsl = rgbToHsl(rgba.r, rgba.g, rgba.b);
	hsl.s = Math.max(0, Math.min(100, hsl.s + amount));

	const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
	return colorToString({ ...rgb, a: rgba.a }, 'hex');
}

/**
 * 调整颜色透明度
 * @param color 颜色字符串
 * @param alpha 透明度 (0-1)
 * @returns 调整后的颜色
 */
export function fade(color : string, alpha : number) : string {
	const rgba = parseColor(color);
	if (!rgba) return color;

	rgba.a = Math.max(0, Math.min(1, alpha));
	return colorToString(rgba, 'rgba');
}

/**
 * 混合两个颜色
 * @param color1 颜色1
 * @param color2 颜色2
 * @param weight 权重 (0-1)
 * @returns 混合后的颜色
 */
export function mix(color1 : string, color2 : string, weight = 0.5) : string {
	const rgba1 = parseColor(color1);
	const rgba2 = parseColor(color2);

	if (!rgba1 || !rgba2) return color1;

	const w = weight * 2 - 1;
	const a = rgba1.a - rgba2.a;

	const w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2;
	const w2 = 1 - w1;

	const r = Math.round(rgba1.r * w1 + rgba2.r * w2);
	const g = Math.round(rgba1.g * w1 + rgba2.g * w2);
	const b = Math.round(rgba1.b * w1 + rgba2.b * w2);
	const alpha = rgba1.a * weight + rgba2.a * (1 - weight);

	return colorToString({ r, g, b, a: alpha }, 'hex');
}

/**
 * 获取颜色的对比色
 * @param color 颜色字符串
 * @returns 对比色
 */
export function getContrastColor(color : string) : string {
	const rgba = parseColor(color);
	if (!rgba) return '#000000';

	// 计算亮度
	const brightness = (rgba.r * 299 + rgba.g * 587 + rgba.b * 114) / 1000;

	// 根据亮度返回黑色或白色
	return brightness > 128 ? '#000000' : '#ffffff';
}

/**
 * 判断颜色是否为深色
 * @param color 颜色字符串
 * @returns 是否为深色
 */
export function isDark(color : string) : boolean {
	const rgba = parseColor(color);
	if (!rgba) return false;

	const brightness = (rgba.r * 299 + rgba.g * 587 + rgba.b * 114) / 1000;
	return brightness < 128;
}

/**
 * 判断颜色是否为浅色
 * @param color 颜色字符串
 * @returns 是否为浅色
 */
export function isLight(color : string) : boolean {
	return !isDark(color);
}

/**
 * 生成颜色渐变
 * @param startColor 起始颜色
 * @param endColor 结束颜色
 * @param steps 步数
 * @returns 颜色数组
 */
export function generateGradient(
	startColor : string,
	endColor : string,
	steps : number
) : string[] {
	const start = parseColor(startColor);
	const end = parseColor(endColor);

	if (!start || !end || steps < 2) return [startColor, endColor];

	const colors : string[] = [];

	for (let i = 0; i < steps; i++) {
		const ratio = i / (steps - 1);
		const r = Math.round(start.r + (end.r - start.r) * ratio);
		const g = Math.round(start.g + (end.g - start.g) * ratio);
		const b = Math.round(start.b + (end.b - start.b) * ratio);
		const a = start.a + (end.a - start.a) * ratio;

		colors.push(colorToString({ r, g, b, a }, 'hex'));
	}

	return colors;
}

/**
 * 生成随机颜色
 * @param format 输出格式
 * @returns 随机颜色
 */
export function randomColor(format : 'hex' | 'rgb' | 'hsl' = 'hex') : string {
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);

	return colorToString({ r, g, b, a: 1 }, format);
}

/**
 * 生成颜色调色板
 * @param baseColor 基础颜色
 * @param count 颜色数量
 * @returns 颜色数组
 */
export function generatePalette(baseColor : string, count = 10) : string[] {
	const rgba = parseColor(baseColor);
	if (!rgba) return [baseColor];

	const hsl = rgbToHsl(rgba.r, rgba.g, rgba.b);
	const colors : string[] = [];

	for (let i = 0; i < count; i++) {
		const lightness = 10 + (80 / (count - 1)) * i;
		const rgb = hslToRgb(hsl.h, hsl.s, lightness);
		colors.push(colorToString({ ...rgb, a: rgba.a }, 'hex'));
	}

	return colors;
}

/**
 * 获取互补色
 * @param color 颜色字符串
 * @returns 互补色
 */
export function getComplementaryColor(color : string) : string {
	const rgba = parseColor(color);
	if (!rgba) return color;

	const hsl = rgbToHsl(rgba.r, rgba.g, rgba.b);
	hsl.h = (hsl.h + 180) % 360;

	const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
	return colorToString({ ...rgb, a: rgba.a }, 'hex');
}

/**
 * 获取三元色
 * @param color 颜色字符串
 * @returns 三元色数组
 */
export function getTriadicColors(color : string) : string[] {
	const rgba = parseColor(color);
	if (!rgba) return [color];

	const hsl = rgbToHsl(rgba.r, rgba.g, rgba.b);
	const colors : string[] = [color];

	for (let i = 1; i < 3; i++) {
		const h = (hsl.h + 120 * i) % 360;
		const rgb = hslToRgb(h, hsl.s, hsl.l);
		colors.push(colorToString({ ...rgb, a: rgba.a }, 'hex'));
	}

	return colors;
}

/**
 * 获取类似色
 * @param color 颜色字符串
 * @param count 颜色数量
 * @param range 色相范围
 * @returns 类似色数组
 */
export function getAnalogousColors(
	color : string,
	count = 5,
	range = 30
) : string[] {
	const rgba = parseColor(color);
	if (!rgba) return [color];

	const hsl = rgbToHsl(rgba.r, rgba.g, rgba.b);
	const colors : string[] = [];
	const step = range / (count - 1);

	for (let i = 0; i < count; i++) {
		const h = (hsl.h - range / 2 + step * i + 360) % 360;
		const rgb = hslToRgb(h, hsl.s, hsl.l);
		colors.push(colorToString({ ...rgb, a: rgba.a }, 'hex'));
	}

	return colors;
}

/**
 * 颜色名称映射
 */
export const COLOR_NAMES = {
	// 基础颜色
	black: '#000000',
	white: '#ffffff',
	red: '#ff0000',
	green: '#008000',
	blue: '#0000ff',
	yellow: '#ffff00',
	cyan: '#00ffff',
	magenta: '#ff00ff',

	// 灰色系
	gray: '#808080',
	grey: '#808080',
	darkgray: '#a9a9a9',
	darkgrey: '#a9a9a9',
	lightgray: '#d3d3d3',
	lightgrey: '#d3d3d3',

	// 常用颜色
	orange: '#ffa500',
	purple: '#800080',
	pink: '#ffc0cb',
	brown: '#a52a2a',
	navy: '#000080',
	teal: '#008080',
	olive: '#808000',
	lime: '#00ff00',
	aqua: '#00ffff',
	silver: '#c0c0c0',
	maroon: '#800000',
	fuchsia: '#ff00ff'
};

/**
 * 根据颜色名称获取颜色值
 * @param name 颜色名称
 * @returns 颜色值
 */
export function getColorByName(name : string) : string | null {
	return COLOR_NAMES[name.toLowerCase()] || null;
}
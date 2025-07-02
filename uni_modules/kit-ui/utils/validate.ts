/**
 * 验证工具函数
 */

/**
 * 手机号验证
 * @param phone 手机号
 * @returns 是否有效
 */
export function isPhone(phone: string): boolean {
  const phoneReg = /^1[3-9]\d{9}$/;
  return phoneReg.test(phone);
}

/**
 * 邮箱验证
 * @param email 邮箱
 * @returns 是否有效
 */
export function isEmail(email: string): boolean {
  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailReg.test(email);
}

/**
 * 身份证号验证
 * @param idCard 身份证号
 * @returns 是否有效
 */
export function isIdCard(idCard: string): boolean {
  const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return idCardReg.test(idCard);
}

/**
 * URL验证
 * @param url URL地址
 * @returns 是否有效
 */
export function isUrl(url: string): boolean {
  const urlReg = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return urlReg.test(url);
}

/**
 * IP地址验证
 * @param ip IP地址
 * @returns 是否有效
 */
export function isIp(ip: string): boolean {
  const ipReg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipReg.test(ip);
}

/**
 * 数字验证
 * @param value 值
 * @returns 是否为数字
 */
export function isNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * 整数验证
 * @param value 值
 * @returns 是否为整数
 */
export function isInteger(value: any): boolean {
  return isNumber(value)
}

/**
 * 正整数验证
 * @param value 值
 * @returns 是否为正整数
 */
export function isPositiveInteger(value: any): boolean {
  return isInteger(value) && value > 0;
}

/**
 * 密码强度验证
 * @param password 密码
 * @param options 验证选项
 * @returns 验证结果
 */
export function validatePassword(
  password: string,
  options: {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): {
  valid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} {
  const {
    minLength = 6,
    maxLength = 20,
    requireUppercase = false,
    requireLowercase = false,
    requireNumbers = false,
    requireSpecialChars = false
  } = options;
  
  const errors: string[] = [];
  let score = 0;
  
  // 长度检查
  if (password.length < minLength) {
    errors.push(`密码长度不能少于${minLength}位`);
  } else if (password.length > maxLength) {
    errors.push(`密码长度不能超过${maxLength}位`);
  } else {
    score += 1;
  }
  
  // 大写字母检查
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('密码必须包含大写字母');
  } else if (/[A-Z]/.test(password)) {
    score += 1;
  }
  
  // 小写字母检查
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('密码必须包含小写字母');
  } else if (/[a-z]/.test(password)) {
    score += 1;
  }
  
  // 数字检查
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('密码必须包含数字');
  } else if (/\d/.test(password)) {
    score += 1;
  }
  
  // 特殊字符检查
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('密码必须包含特殊字符');
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  }
  
  // 计算强度
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 2) {
    strength = 'medium';
  }
  
  return {
    valid: errors.length === 0,
    strength,
    errors
  };
}

/**
 * 银行卡号验证
 * @param cardNumber 银行卡号
 * @returns 是否有效
 */
export function isBankCard(cardNumber: string): boolean {
  // 移除空格和连字符
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  
  // 检查是否为数字且长度在13-19位之间
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return false;
  }
  
  // Luhn算法验证
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * 中文姓名验证
 * @param name 姓名
 * @returns 是否有效
 */
export function isChineseName(name: string): boolean {
  const nameReg = /^[\u4e00-\u9fa5]{2,4}$/;
  return nameReg.test(name);
}

/**
 * 车牌号验证
 * @param plateNumber 车牌号
 * @returns 是否有效
 */
export function isPlateNumber(plateNumber: string): boolean {
  // 普通车牌
  const normalReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{4}[A-Z0-9挂学警港澳]$/;
  // 新能源车牌
  const newEnergyReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{5}$/;
  
  return normalReg.test(plateNumber) || newEnergyReg.test(plateNumber);
}

/**
 * 统一社会信用代码验证
 * @param code 统一社会信用代码
 * @returns 是否有效
 */
export function isSocialCreditCode(code: string): boolean {
  const codeReg = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/;
  return codeReg.test(code);
}

/**
 * 邮政编码验证
 * @param zipCode 邮政编码
 * @returns 是否有效
 */
export function isZipCode(zipCode: string): boolean {
  const zipReg = /^\d{6}$/;
  return zipReg.test(zipCode);
}

/**
 * QQ号验证
 * @param qq QQ号
 * @returns 是否有效
 */
export function isQQ(qq: string): boolean {
  const qqReg = /^[1-9][0-9]{4,10}$/;
  return qqReg.test(qq);
}

/**
 * 微信号验证
 * @param wechat 微信号
 * @returns 是否有效
 */
export function isWechat(wechat: string): boolean {
  const wechatReg = /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/;
  return wechatReg.test(wechat);
}

/**
 * 表单验证规则类型
 */
export interface ValidationRule {
  required?: boolean;
  message?: string;
  validator?: (value: any) => boolean | string;
  pattern?: RegExp;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'phone' | 'url';
}

/**
 * 表单验证
 * @param value 值
 * @param rules 验证规则
 * @returns 验证结果
 */
export function validateField(
  value: any,
  rules: ValidationRule[]
): {
  valid: boolean;
  message?: string;
} {
  for (const rule of rules) {
    // 必填验证
    if (rule.required && (value === null || value === undefined || value === '')) {
      return {
        valid: false,
        message: rule.message || '此字段为必填项'
      };
    }
    
    // 如果值为空且非必填，跳过其他验证
    if (!rule.required && (value === null || value === undefined || value === '')) {
      continue;
    }
    
    // 类型验证
    if (rule.type) {
      let typeValid = true;
      switch (rule.type) {
        case 'email':
          typeValid = isEmail(value);
          break;
        case 'phone':
          typeValid = isPhone(value);
          break;
        case 'url':
          typeValid = isUrl(value);
          break;
        case 'number':
          typeValid = isNumber(value);
          break;
        case 'array':
          typeValid = Array.isArray(value);
          break;
        case 'object':
          typeValid = typeof value === 'object' && value !== null;
          break;
        case 'boolean':
          typeValid = typeof value === 'boolean';
          break;
        case 'string':
          typeValid = typeof value === 'string';
          break;
      }
      
      if (!typeValid) {
        return {
          valid: false,
          message: rule.message || `字段类型必须为${rule.type}`
        };
      }
    }
    
    // 正则验证
    if (rule.pattern && !rule.pattern.test(String(value))) {
      return {
        valid: false,
        message: rule.message || '字段格式不正确'
      };
    }
    
    // 数值范围验证
    if (rule.min !== undefined && Number(value) < rule.min) {
      return {
        valid: false,
        message: rule.message || `值不能小于${rule.min}`
      };
    }
    
    if (rule.max !== undefined && Number(value) > rule.max) {
      return {
        valid: false,
        message: rule.message || `值不能大于${rule.max}`
      };
    }
    
    // 字符串长度验证
    if (rule.minLength !== undefined && String(value).length < rule.minLength) {
      return {
        valid: false,
        message: rule.message || `长度不能少于${rule.minLength}个字符`
      };
    }
    
    if (rule.maxLength !== undefined && String(value).length > rule.maxLength) {
      return {
        valid: false,
        message: rule.message || `长度不能超过${rule.maxLength}个字符`
      };
    }
    
    // 自定义验证器
    if (rule.validator) {
      const result = rule.validator(value);
      if (result === false) {
        return {
          valid: false,
          message: rule.message || '验证失败'
        };
      }
      if (typeof result === 'string') {
        return {
          valid: false,
          message: result
        };
      }
    }
  }
  
  return { valid: true };
}
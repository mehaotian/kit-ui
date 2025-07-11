<template>
	<view class="kit-ui--root k-button" :class="[
			`k-button--${type}`,
			`k-button--${size}`,
			{
				'k-button--disabled': disabled,
				'k-button--loading': loading,
				'k-button--plain': plain,
				'k-button--round': round,
				'k-button--circle': circle,
				'k-button--gradient': gradient,
				'k-button--shadow': shadow
			}
		]" :style="buttonStyle" @click="handleClick">
		<text class="k-button__text">
			<slot>{{ text }}</slot>
		</text>
		<!-- 按钮覆盖到最上层，样式自定义 -->
		<button class="k-button__btn"></button>
	</view>
</template>

<script setup>
	import {
		inject,
		computed
	} from 'vue'

	/**
	 * k-button 按钮组件
	 * 支持多种类型、尺寸和状态的按钮
	 */

	// 注入主题配置
	const themeConfig = inject('kit-theme', {})

	// 定义 props
	const props = defineProps({
		// 按钮类型: default, primary, success, warning, error
		type: {
			type: String,
			default: 'default'
		},
		// 按钮尺寸: small, medium, large
		size: {
			type: String,
			default: 'medium'
		},
		// 按钮文字
		text: {
			type: String,
			default: ''
		},
		// 是否禁用
		disabled: {
			type: Boolean,
			default: false
		},
		// 是否加载中
		loading: {
			type: Boolean,
			default: false
		},
		// 是否朴素按钮
		plain: {
			type: Boolean,
			default: false
		},
		// 是否圆角按钮
		round: {
			type: Boolean,
			default: false
		},
		// 是否圆形按钮
		circle: {
			type: Boolean,
			default: false
		},
		// 图标
		icon: {
			type: String,
			default: ''
		},
		// 是否启用渐变背景
		gradient: {
			type: Boolean,
			default: false
		},
		// 是否启用阴影效果
		shadow: {
			type: Boolean,
			default: false
		}
	});

	const emit = defineEmits(['click']);

	// 计算按钮动态样式
	const buttonStyle = computed(() => {
		// 如果有注入的主题配置，生成对应的 CSS 变量
		const styles: string[] = []
		// 遍历主题配置，生成 CSS 变量
		for (let key in themeConfig) {
			const value = themeConfig[key]
			if (key != 'mode' && value != null) {
				// 将驼峰命名转换为 kebab-case
				const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase()
				styles.push(`--k-${cssVar}: ${value}`)
			}
		}
		return styles.join('; ')
	})

	// 点击处理函数
	const handleClick = () => {
		if (props.disabled || props.loading) {
			return;
		}
		emit('click');
	};
</script>

<style lang="scss">
	@import "../../theme/index.scss";

	.k-button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		position: relative;
		box-sizing: border-box;
		padding-top: var(--k-spacing-base, 12px);
		padding-bottom: var(--k-spacing-base, 12px);
		padding-left: var(--k-spacing-xl, 24px);
		padding-right: var(--k-spacing-xl, 24px);
		border: var(--k-border-width-base, 1px) solid transparent;
		border-top-left-radius: var(--k-border-radius-md, 8px);
		border-top-right-radius: var(--k-border-radius-md, 8px);
		border-bottom-left-radius: var(--k-border-radius-md, 8px);
		border-bottom-right-radius: var(--k-border-radius-md, 8px);
		transition: all var(--k-animation-duration-normal, 0.3s) var(--k-animation-timing-ease-out, cubic-bezier(0.25, 0.46, 0.45, 0.94));
		/* #ifdef WEB */
		will-change: transform, box-shadow, background-color;
		// web 禁止选中
		user-select: none;
		cursor: pointer;
		/* #endif */


		// 默认样式 - 简洁风格
		background-color: var(--k-bg-color, #ffffff);
		border-color: var(--k-border-color-light, #e5e7eb);

		&__btn {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			line-height: 1;
			padding: 0;
			z-index: 10;
			opacity: 0;
		}

		&:hover {
			background-color: var(--k-bg-color-hover, #f9fafb);
			border-color: var(--k-border-color, #d1d5db);
		}

		&:active {
			background-color: var(--k-bg-color-active, #f3f4f6);
		}

		// 主要按钮 - 纯色背景
		&--primary {
			background-color: var(--k-color-primary, #6366f1);
			border-color: var(--k-color-primary, #6366f1);

			&:hover {
				background-color: var(--k-color-primary-hover, #5855eb);
				border-color: var(--k-color-primary-hover, #5855eb);
			}

			&:active {
				background-color: var(--k-color-primary-active, #4f46e5);
				border-color: var(--k-color-primary-active, #4f46e5);
			}
		}

		// 成功按钮 - 纯色背景
		&--success {
			background-color: var(--k-color-success, #10b981);
			border-color: var(--k-color-success, #10b981);

			&:hover {
				background-color: var(--k-color-success-hover, #059669);
				border-color: var(--k-color-success-hover, #059669);
			}

			&:active {
				background-color: var(--k-color-success-active, #047857);
				border-color: var(--k-color-success-active, #047857);
			}
		}

		// 警告按钮 - 纯色背景
		&--warning {
			background-color: var(--k-color-warning, #f59e0b);
			border-color: var(--k-color-warning, #f59e0b);

			&:hover {
				background-color: var(--k-color-warning-hover, #d97706);
				border-color: var(--k-color-warning-hover, #d97706);
			}

			&:active {
				background-color: var(--k-color-warning-active, #b45309);
				border-color: var(--k-color-warning-active, #b45309);
			}
		}

		// 危险按钮 - 纯色背景
		&--danger {
			background-color: var(--k-color-error, #ef4444);
			border-color: var(--k-color-error, #ef4444);

			&:hover {
				background-color: var(--k-color-error-hover, #dc2626);
				border-color: var(--k-color-error-hover, #dc2626);
			}

			&:active {
				background-color: var(--k-color-error-active, #b91c1c);
				border-color: var(--k-color-error-active, #b91c1c);
			}
		}

		// 朴素按钮 - 透明背景 + 柔和边框
		&--plain {
			background-color: transparent;
			box-shadow: none;

			&.k-button--primary {
				border-color: var(--k-color-primary, #6366f1);

				&:hover {
					background-color: rgba(99, 102, 241, 0.08);
					box-shadow: var(--k-box-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1));
				}
			}

			&.k-button--success {
				border-color: var(--k-color-success, #10b981);

				&:hover {
					background-color: rgba(16, 185, 129, 0.08);
					box-shadow: var(--k-box-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1));
				}
			}

			&.k-button--warning {
				border-color: var(--k-color-warning, #f59e0b);

				&:hover {
					background-color: rgba(245, 158, 11, 0.08);
					box-shadow: var(--k-box-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1));
				}
			}

			&.k-button--error {
				border-color: var(--k-color-error, #ef4444);

				&:hover {
					background-color: rgba(239, 68, 68, 0.08);
					box-shadow: var(--k-box-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1));
				}
			}
		}

		// 尺寸变体
		&--small {
			padding-top: var(--k-spacing-sm, 8px);
			padding-bottom: var(--k-spacing-sm, 8px);
			padding-left: var(--k-spacing-sm, 16px);
			padding-right: var(--k-spacing-sm, 16px);
			border-top-left-radius: var(--k-border-radius-sm, 6px);
			border-top-right-radius: var(--k-border-radius-sm, 6px);
			border-bottom-left-radius: var(--k-border-radius-sm, 6px);
			border-bottom-right-radius: var(--k-border-radius-sm, 6px);

			// 圆形按钮
			&.k-button--circle {
				width: var(--k-component-size-sm, 32px);
				height: var(--k-component-size-sm, 32px);
			}
		}

		&--medium {

			// 默认尺寸，使用基础样式
			// 圆形按钮
			&.k-button--circle {
				width: var(--k-component-size-md, 40px);
				height: var(--k-component-size-md, 40px);
			}
		}

		&--large {
			padding-left: var(--k-spacing-xxl, 32px);
			padding-right: var(--k-spacing-xxl, 32px);
			padding-top: var(--k-spacing-md, 16px);
			padding-bottom: var(--k-spacing-md, 16px);
			border-top-left-radius: var(--k-border-radius-lg, 12px);
			border-top-right-radius: var(--k-border-radius-lg, 12px);
			border-bottom-left-radius: var(--k-border-radius-lg, 12px);
			border-bottom-right-radius: var(--k-border-radius-lg, 12px);

			&.k-button--circle {
				width: var(--k-component-size-lg, 56px);
				height: var(--k-component-size-lg, 56px);
			}
		}

		// 圆角按钮
		&--round {
			border-radius: 100px;
		}

		// 圆形按钮
		&--circle {
			// width: 100px;
			// height: 100px;
			padding: 0;
			border-radius: 200px;
		}

		// 渐变效果 - 通过属性控制
		&--gradient {

			&.k-button--primary {
				// background-image: var(--k-gradient-primary, linear-gradient(to bottom right, #667eea, #764ba2));
				background-image: var(--k-gradient-primary);
			}

			&.k-button--success {
				background-image: var(--k-gradient-success);
			}

			&.k-button--warning {
				background-image: var(--k-gradient-warning);
			}

			&.k-button--danger {
				background-image: var(--k-gradient-error);
			}
		}

		// 阴影效果 - 通过属性控制
		&--shadow {
			&.k-button--default {
				box-shadow: var(--k-shadow-neumorphism-flat, 3px 3px 6px rgba(163, 177, 198, 0.4), -3px -3px 6px rgba(255, 255, 255, 0.3));

				&:hover {
					transform: translateY(-1px);
					box-shadow: var(--k-shadow-neumorphism-raised, 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.5));
				}

				&:active {
					transform: translateY(0);
					box-shadow: var(--k-shadow-neumorphism-inset, inset 6px 6px 12px rgba(163, 177, 198, 0.6), inset -6px -6px 12px rgba(255, 255, 255, 0.5));
				}
			}

			&.k-button--primary {
				box-shadow: var(--k-shadow-primary, 0 8px 25px rgba(99, 102, 241, 0.15));

				&:hover {
					transform: translateY(-2px);
					box-shadow: var(--k-shadow-primary, 0 8px 25px rgba(99, 102, 241, 0.15)), var(--k-box-shadow-lg, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
				}

				&:active {
					transform: translateY(-1px);
				}
			}

			&.k-button--success {
				box-shadow: var(--k-shadow-success, 0 8px 25px rgba(16, 185, 129, 0.15));

				&:hover {
					transform: translateY(-2px);
					box-shadow: var(--k-shadow-success, 0 8px 25px rgba(16, 185, 129, 0.15)), var(--k-box-shadow-lg, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
				}

				&:active {
					transform: translateY(-1px);
				}
			}

			&.k-button--warning {
				box-shadow: var(--k-shadow-warning, 0 8px 25px rgba(245, 158, 11, 0.15));

				&:hover {
					transform: translateY(-2px);
					box-shadow: var(--k-shadow-warning, 0 8px 25px rgba(245, 158, 11, 0.15)), var(--k-box-shadow-lg, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
				}

				&:active {
					transform: translateY(-1px);
				}
			}

			&.k-button--danger {
				box-shadow: var(--k-shadow-error, 0 8px 25px rgba(239, 68, 68, 0.15));

				&:hover {
					transform: translateY(-2px);
					box-shadow: var(--k-shadow-error, 0 8px 25px rgba(239, 68, 68, 0.15)), var(--k-box-shadow-lg, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
				}

				&:active {
					transform: translateY(-1px);
				}
			}
		}

		// 禁用状态
		&--disabled {
			opacity: 0.5;
			// cursor: not-allowed;

			&:hover {
				transform: none;
			}

			&:active {
				transform: none;
			}
		}

		// 加载状态
		&--loading {}

		// 内部元素
		&__loading {}

		&__loading-icon {}

		&__icon {}

		&__text {
			font-size: var(--k-font-size-base, 14px);
			font-weight: 400;
			// text-align: center;
			color: var(--k-text-color, #374151);
		}

		// 不同按钮类型的文字颜色
		&--primary &__text {
			color: #ffffff;
			font-weight: 700;
		}

		&--success &__text {
			color: #ffffff;
			font-weight: 700;
		}

		&--warning &__text {
			color: #ffffff;
			font-weight: 700;
		}

		&--danger &__text {
			color: #ffffff;
			font-weight: 700;
		}

		// 朴素按钮的文字颜色
		&--plain.k-button--primary &__text {
			color: var(--k-color-primary, #6366f1);
			font-weight: 700;
		}

		&--plain.k-button--success &__text {
			color: var(--k-color-success, #10b981);
			font-weight: 700;
		}

		&--plain.k-button--warning &__text {
			color: var(--k-color-warning, #f59e0b);
			font-weight: 700;
		}

		&--plain.k-button--danger &__text {
			color: var(--k-color-error, #ef4444);
			font-weight: 700;
		}

		// 不同尺寸的文字大小
		&--small &__text {
			font-size: var(--k-font-size-sm, 12px);
		}

		&--large &__text {
			font-size: var(--k-font-size-lg, 18px);
		}
	}
</style>
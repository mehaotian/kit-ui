<template>
	<view class="kit-ui--root k-button" :class="[
			`k-button--${type}`,
			`k-button--${size}`,
			{
				'k-button--disabled': disabled,
				'k-button--loading': loading,
				'k-button--plain': plain,
				'k-button--round': round,
				'k-button--circle': circle
			}
		]" :style="customStyle" @tap="handleClick">
		<!-- <view v-if="loading" class="k-button__loading">
			<view class="k-button__loading-icon"></view>
		</view>
		<view v-if="icon != null && !loading" class="k-button__icon">
			{{ icon }}
		</view> -->
		<text class="k-button__text">
			<slot>{{ text }}</slot>
		</text>
		<!-- 按钮覆盖到最上层，样式自定义 -->
		<button class="k-button__btn"></button>
	</view>
</template>

<script setup>
	/**
	 * k-button 按钮组件
	 * 支持多种类型、尺寸和状态的按钮
	 */

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
		// 自定义样式
		customStyle: {
			type: Object,
			default: () => ({})
		}
	});

	// 定义事件
	const emit = defineEmits(['click']);

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
		// transition: all var(--k-transition-duration-fast, 0.3s) var(--k-transition-timing-function-ease-in-out, ease-in-out);
		transition-duration: var(--k-transition-duration-fast, 0.3s);
		transition-timing-function: var(--k-transition-timing-function-ease-in-out, ease-in-out);
		transition-property: all;
		/* #ifdef WEB */
		// web 禁止选中
		user-select: none;
		cursor: pointer;
		/* #endif */
		

		// 默认样式
		background-color: var(--k-bg-color, #ffffff);
		border-color: var(--k-border-color, #ebeef5);

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

		// &:hover {
		// 	background-color: var(--k-bg-color-page, #f8f9fa);
		// }

		&:active {
			transform: scale(0.98);
		}

		// 主要按钮
		&--primary {
			background-color: var(--k-color-primary, #007aff);
			border-color: var(--k-color-primary, #007aff);

			&:hover {
				background-color: var(--k-color-primary-light, #4da6ff);
				border-color: var(--k-color-primary-light, #4da6ff);
			}
		}

		// 成功按钮
		&--success {
			background-color: var(--k-color-success, #4cd964);
			border-color: var(--k-color-success, #4cd964);

			&:hover {
				background-color: #7ee68a;
				border-color: #7ee68a;
			}
		}

		// 警告按钮
		&--warning {
			background-color: var(--k-color-warning, #ff9500);
			border-color: var(--k-color-warning, #ff9500);

			&:hover {
				background-color: #ffb84d;
				border-color: #ffb84d;
			}
		}

		// 危险按钮
		&--danger {
			background-color: var(--k-color-error, #ff3b30);
			border-color: var(--k-color-error, #ff3b30);

			&:hover {
				background-color: #ff6b5c;
				border-color: #ff6b5c;
			}
		}

		// 朴素按钮
		&--plain {
			background-color: transparent;

			&.k-button--primary {
				border-color: var(--k-color-primary, #007aff);

				&:hover {
					background-color: rgba(0, 122, 255, 0.1);
				}
			}

			&.k-button--success {
				border-color: var(--k-color-success, #4cd964);

				&:hover {
					background-color: rgba(76, 217, 100, 0.1);
				}
			}

			&.k-button--warning {
				border-color: var(--k-color-warning, #ff9500);

				&:hover {
					background-color: rgba(255, 149, 0, 0.1);
				}
			}

			&.k-button--error {
				border-color: var(--k-color-error, #ff3b30);

				&:hover {
					background-color: rgba(255, 59, 48, 0.1);
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
			color: var(--k-text-color-primary, #333333);
		}

		// 不同按钮类型的文字颜色
		&--primary &__text {
			color: var(--k-text-color-inverse, #ffffff);
		}

		&--success &__text {
			color: var(--k-text-color-inverse, #ffffff);
		}

		&--warning &__text {
			color: var(--k-text-color-inverse, #ffffff);
		}

		&--danger &__text {
			color: var(--k-text-color-inverse, #ffffff);
		}

		// 朴素按钮的文字颜色
		&--plain.k-button--primary &__text {
			color: var(--k-color-primary, #007aff);
		}

		&--plain.k-button--success &__text {
			color: var(--k-color-success, #4cd964);
		}

		&--plain.k-button--warning &__text {
			color: var(--k-color-warning, #ff9500);
		}

		&--plain.k-button--danger &__text {
			color: var(--k-color-error, #ff3b30);
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
<template>
	<view class="k-button" :class="[
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
		<view v-if="loading" class="k-button__loading">
			<view class="k-button__loading-icon"></view>
		</view>
		<view v-if="icon != null && !loading" class="k-button__icon">
			{{ icon }}
		</view>
		<view class="k-button__text" v-if="text !=null">
			<slot>{{ text }}</slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'k-button',
		props: {
			// 按钮类型
			type: {
				type: String,
				default: 'default'
			},
			// 按钮尺寸
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
		},
		methods: {
			handleClick() {
				if (this.disabled || this.loading) {
					return;
				}
				this.$emit('click');
			}
		}
	};
</script>

<style lang="scss">
	.k-button {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		box-sizing: border-box;
		padding: var(--k-button-padding-vertical, 12px) var(--k-button-padding-horizontal, 24px);
		border: var(--k-button-border-width, 1px) solid transparent;
		border-radius: var(--k-button-border-radius, 8px);
		// font-size: var(--k-button-font-size, 16px);
		// font-weight: var(--k-button-font-weight, 500);
		// line-height: 1;
		// text-align: center;
		// white-space: nowrap;
		// user-select: none;
		transition: all var(--k-animation-duration-base, 0.3s) var(--k-animation-timing-function, ease-in-out);
		cursor: pointer;

		// 默认样式
		background-color: var(--k-button-default-bg, var(--k-bg-color-container, #f8f8f8));
		// color: var(--k-button-default-color, var(--k-text-color-primary, #333));
		border-color: var(--k-button-default-border, var(--k-border-color, #c8c7cc));

		&:hover {
			background-color: var(--k-button-default-hover-bg, var(--k-bg-color-hover, #f1f1f1));
		}

		&:active {
			transform: scale(0.98);
		}

		// 主要按钮
		&--primary {
			background-color: var(--k-color-primary, #007aff);
			// color: var(--k-text-color-inverse, #fff);
			border-color: var(--k-color-primary, #007aff);

			&:hover {
				background-color: var(--k-color-primary-light, #4da6ff);
				border-color: var(--k-color-primary-light, #4da6ff);
			}
		}

		// 成功按钮
		&--success {
			background-color: var(--k-color-success, #4cd964);
			color: var(--k-text-color-inverse, #fff);
			border-color: var(--k-color-success, #4cd964);

			&:hover {
				background-color: var(--k-color-success-light, #7ee68a);
				border-color: var(--k-color-success-light, #7ee68a);
			}
		}

		// 警告按钮
		&--warning {
			background-color: var(--k-color-warning, #f0ad4e);
			color: var(--k-text-color-inverse, #fff);
			border-color: var(--k-color-warning, #f0ad4e);

			&:hover {
				background-color: var(--k-color-warning-light, #f4c374);
				border-color: var(--k-color-warning-light, #f4c374);
			}
		}

		// 危险按钮
		&--danger {
			background-color: var(--k-color-danger, #dd524d);
			color: var(--k-text-color-inverse, #fff);
			border-color: var(--k-color-danger, #dd524d);

			&:hover {
				background-color: var(--k-color-danger-light, #e57873);
				border-color: var(--k-color-danger-light, #e57873);
			}
		}

		// 朴素按钮
		&--plain {
			background-color: transparent;

			&.k-button--primary {
				color: var(--k-color-primary, #007aff);
				border-color: var(--k-color-primary, #007aff);

				&:hover {
					background-color: var(--k-color-primary-light-9, rgba(0, 122, 255, 0.1));
				}
			}

			&.k-button--success {
				color: var(--k-color-success, #4cd964);
				border-color: var(--k-color-success, #4cd964);

				&:hover {
					background-color: var(--k-color-success-light-9, rgba(76, 217, 100, 0.1));
				}
			}

			&.k-button--warning {
				color: var(--k-color-warning, #f0ad4e);
				border-color: var(--k-color-warning, #f0ad4e);

				&:hover {
					background-color: var(--k-color-warning-light-9, rgba(240, 173, 78, 0.1));
				}
			}

			&.k-button--danger {
				color: var(--k-color-danger, #dd524d);
				border-color: var(--k-color-danger, #dd524d);

				&:hover {
					background-color: var(--k-color-danger-light-9, rgba(221, 82, 77, 0.1));
				}
			}
		}

		// 尺寸变体
		&--small {
			padding: var(--k-button-small-padding-vertical, 8px) var(--k-button-small-padding-horizontal, 16px);
			font-size: var(--k-button-small-font-size, 14px);
			border-radius: var(--k-button-small-border-radius, 6px);
		}

		&--large {
			padding: var(--k-button-large-padding-vertical, 16px) var(--k-button-large-padding-horizontal, 32px);
			font-size: var(--k-button-large-font-size, 18px);
			border-radius: var(--k-button-large-border-radius, 10px);
		}

		// 圆角按钮
		&--round {
			border-radius: var(--k-button-round-border-radius, 50px);
		}

		// 圆形按钮
		&--circle {
			width: var(--k-button-circle-size, 48px);
			height: var(--k-button-circle-size, 48px);
			padding: 0;
			border-radius: 50%;
		}

		// 禁用状态
		&--disabled {
			opacity: var(--k-opacity-disabled, 0.5);
			cursor: not-allowed;

			&:hover {
				transform: none;
			}

			&:active {
				transform: none;
			}
		}

		// 加载状态
		&--loading {
			cursor: default;

			&:hover {
				transform: none;
			}

			&:active {
				transform: none;
			}
		}

		// 内部元素
		&__loading {
			display: flex;
			align-items: center;
			margin-right: 8px;
		}

		&__loading-icon {
			width: 16px;
			height: 16px;
			border: 2px solid currentColor;
			border-top-color: transparent;
			border-radius: 50%;
			animation: k-button-loading 1s linear infinite;
		}

		&__icon {
			display: flex;
			align-items: center;
			margin-right: 8px;
			font-size: 1.2em;
		}

		&__text {
			display: flex;
			align-items: center;
		}
	}

	@keyframes k-button-loading {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
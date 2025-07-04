<template>
	<view class="button-demo">
		<view class="demo-section">
			<text class="section-title">基础按钮（纯色）</text>
			<view class="button-group">
				<k-button>默认按钮</k-button>
				<k-button type="primary">主要按钮</k-button>
				<k-button type="success">成功按钮</k-button>
				<k-button type="warning">警告按钮</k-button>
				<k-button type="danger">危险按钮</k-button>
			</view>
		</view>

		<view class="demo-section">
			<text class="section-title">渐变按钮</text>
			<view class="button-group">
				<k-button type="primary" gradient>渐变主要</k-button>
				<k-button type="success" gradient>渐变成功</k-button>
				<k-button type="warning" gradient>渐变警告</k-button>
				<k-button type="danger" gradient>渐变危险</k-button>
			</view>
		</view>

		<view class="demo-section">
			<text class="section-title">阴影按钮</text>
			<view class="button-group">
				<k-button shadow>阴影默认</k-button>
				<k-button type="primary" shadow>阴影主要</k-button>
				<k-button type="success" shadow>阴影成功</k-button>
				<k-button type="warning" shadow>阴影警告</k-button>
				<k-button type="danger" shadow>阴影危险</k-button>
			</view>
		</view>

		<view class="demo-section">
			<text class="section-title">渐变 + 阴影组合</text>
			<view class="button-group">
				<k-button type="primary" gradient shadow>渐变阴影</k-button>
				<k-button type="success" gradient shadow>渐变阴影</k-button>
				<k-button type="warning" gradient shadow>渐变阴影</k-button>
				<k-button type="danger" gradient shadow>渐变阴影</k-button>
			</view>
		</view>

		<view class="demo-section">
			<text class="section-title">朴素按钮</text>
			<view class="button-group">
				<k-button plain>朴素按钮</k-button>
				<k-button type="primary" plain>主要按钮</k-button>
				<k-button type="success" plain>成功按钮</k-button>
				<k-button type="warning" plain>警告按钮</k-button>
				<k-button type="danger" plain>危险按钮</k-button>
			</view>
		</view>

		<view class="demo-section">
			<text class="section-title">不同尺寸</text>
			<view class="button-group">
				<k-button type="primary" size="small">小型按钮</k-button>
				<k-button type="primary">默认按钮</k-button>
				<k-button type="primary" size="large">大型按钮</k-button>
			</view>
		</view>

		<view class="demo-section">
			<text class="section-title">圆角按钮</text>
			<view class="button-group">
				<k-button type="primary" round>圆角按钮</k-button>
				<k-button type="success" round gradient>圆角渐变</k-button>
				<k-button type="warning" round shadow>圆角阴影</k-button>
			</view>
		</view>

		<view class="demo-section">
			<text class="section-title">禁用状态</text>
			<view class="button-group">
				<k-button disabled>禁用按钮</k-button>
				<k-button type="primary" disabled>禁用按钮</k-button>
				<k-button type="success" disabled gradient>禁用渐变</k-button>
			</view>
		</view>

		<view class="demo-section">
			<text class="section-title">加载状态</text>
			<view class="button-group">
				<k-button loading>加载中</k-button>
				<k-button type="primary" loading>加载中</k-button>
				<k-button type="success" loading gradient>加载渐变</k-button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

// 按钮点击事件
const handleClick = (type) => {
	console.log(`${type} 按钮被点击`)
	uni.showToast({
		title: `${type} 按钮被点击`,
		icon: 'none'
	})
}
</script>

<style lang="scss" scoped>
@import '@/uni_modules/kit-ui/theme/index.scss';

.button-demo {
	padding: var(--k-spacing-lg, 24px);
	background-color: var(--k-bg-color-page, #f8fafc);
	min-height: 100vh;
}

.demo-section {
	margin-bottom: var(--k-spacing-xl, 32px);
	padding: var(--k-spacing-lg, 24px);
	background-color: var(--k-bg-color, #ffffff);
	border-radius: var(--k-border-radius-lg, 12px);
	box-shadow: var(--k-box-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.1));
}

.section-title {
	display: block;
	font-size: var(--k-font-size-lg, 18px);
	font-weight: var(--k-font-weight-semibold, 600);
	color: var(--k-text-color, #374151);
	margin-bottom: var(--k-spacing-md, 16px);
}

.button-group {
	display: flex;
	flex-wrap: wrap;
	gap: var(--k-spacing-sm, 12px);
	align-items: center;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
	.button-demo {
		background-color: var(--k-bg-color-page-dark, #0f172a);
	}
	
	.demo-section {
		background-color: var(--k-bg-color-dark, #1e293b);
		box-shadow: var(--k-shadow-neumorphism-flat-dark, 3px 3px 6px rgba(0, 0, 0, 0.4), -3px -3px 6px rgba(255, 255, 255, 0.05));
	}
	
	.section-title {
		color: var(--k-text-color-dark, #f1f5f9);
	}
}
</style>
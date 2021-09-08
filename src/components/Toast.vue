<template>
	<transition name="slide">
		<div
			v-if="visible"
			class="m-7 p-5 top-0 right-0 fixed"
			:class="{
				'bg-green-600': props.severity == 'correct',
				'bg-red-600': props.severity == 'wrong',
			}"
		>
			<slot />
		</div>
	</transition>
</template>

<script setup lang="ts">
const props = defineProps(["severity", "visible"]);
</script>
<style scoped>
.slide-enter-active {
	animation: slide-in 0.5s;
}
.slide-leave-active {
	animation: fade-out 0.5s;
}
@keyframes slide-in {
	0% {
		transform: translateY(-50px);
	}
	100% {
		transform: translateY(0px);
	}
}
@keyframes fade-out {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}
</style>

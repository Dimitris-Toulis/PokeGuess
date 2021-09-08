<template>
	<button><slot></slot></button>
</template>

<style>
button {
	color: #151515;
	background: #8dd0ff;
	border: 1px solid #8dd0ff;
	padding: 0.5rem 0.75rem;
	font-size: 1rem;
	transition: background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
	border-radius: 4px;
}
button:enabled:hover {
	background: #56bdff;
	color: #151515;
	border-color: #56bdff;
}
</style>

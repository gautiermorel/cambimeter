<template>
	<div>
		<div class="flex flex-column align-items-center">
			<Header />

			<router-view v-slot="{ Component }">
				<component :is="Component" />
			</router-view>

			<Footer />
		</div>
	</div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
	name: "App",
	components: {
		Header,
		Footer,
	},
};
</script>

<style lang="scss">
* {
	font-family: "Arial", "sans-serif";
}

html {
	margin: 0;
	padding: 0;
}

body {
	background-color: #fcfcfc;
}
</style>

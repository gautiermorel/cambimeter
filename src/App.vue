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
import store from "@/store";
import { computed } from "vue";

import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
	name: "App",
	components: {
		Header,
		Footer,
	},
	setup () {
		return {
			isBusy: computed(() => store.state.isBusy),
			error: computed(() => store.state.error),
			isAuthenticated: computed(() => store.getters.isAuthenticated),
			onLogout: () => store.dispatch("logout"),
			currentUser: computed(() => store.getters.getUser),
		};
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

.wedding-list {
	a {
		text-decoration: none;
	}
	position: absolute;
	top: 10px;
	right: 25px;
}
</style>

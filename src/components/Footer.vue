<template>
	<div class="footer">
		<div class="flex justify-content-center">
			<Divider class="w-6" />
		</div>
	</div>
</template>

<script>
import { computed } from 'vue';
import store from '@/store';

export default {
	name: 'Footer',
	computed: {
		currentUser: () => store.getters.getUser
	},
	setup () {
		return {
			isAuthenticated: computed(() => store.getters.isAuthenticated),
			onLogout: () => store.dispatch("logout"),
		};
	},
	data () {
		return {
			show: false
		}
	}
}
</script>

<style scoped lang="scss">
.footer {
  padding: 20px;
  text-align: center;
}
</style>

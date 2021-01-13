<template>
	<div class="app">
		<router-view>
			<login></login>
		</router-view>
	</div>
</template>

<script>
import Login from './components/Login.vue'

export default {
  name: 'app',
  components: {
		Login
  }
}
</script>

<style>
	
</style>

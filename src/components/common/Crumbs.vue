<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item><slot name="crumbsa"></slot></el-breadcrumb-item>
		<el-breadcrumb-item><slot name="crumbsb"></slot></el-breadcrumb-item>
	</el-breadcrumb>
</template>

<script>
  export default{
    name:"Crumbs"
  }
</script>

<style scoped>
</style>

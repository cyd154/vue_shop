<template>
	<div class="Rights">
		<!-- 面包屑导航区域 -->
		<crumbs>
			<b slot="crumbsa">权限管理</b>
			<b slot="crumbsb">权限列表</b>
		</crumbs>
		<!-- 卡片视图 -->
		<el-card>
			<el-table border :data="rightsList">
				<el-table-column align="center" label='序号' type='index'></el-table-column>
				<el-table-column align="center" label='权限名称' prop="authName"></el-table-column>
				<el-table-column align="center" label='路径' prop="path"></el-table-column>
				<el-table-column align="center" label='权限等级' prop="level">
					<template v-slot="scope">
						<el-tag v-if="scope.row.level == '0'">一级</el-tag>
						<el-tag type="success" v-else-if="scope.row.level == '1'">二级</el-tag>
						<el-tag type="warning" v-else>三级</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	import Crumbs from '../common/Crumbs.vue'
  export default{
    name:"Rights",
		components:{
			Crumbs
		},
		data(){
			return {
				//权限列表
				rightsList:[]
			}
		},
		methods:{
			async getRightsList(){
			  const {data: res} = await this.$http.get('rights/list')
				// console.log(res)
				if(res.meta.status !== 200){
					return this.$message.error('获取权限列表失败')
				}
				this.rightsList = res.data
				// console.log(this.rightsList)
			}
		},
		created() {
			//获取所有权限
			this.getRightsList()
		}
  }
</script>

<style lang="less" scoped>
</style>

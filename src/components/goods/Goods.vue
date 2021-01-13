<template>
	<div class="goods">
		<!-- 面包屑导航区域 -->
		<crumbs>
			<b slot="crumbsa">商品管理</b>
			<b slot="crumbsb">商品列表</b>
		</crumbs>
		<!-- 卡片视图区域 -->
		<el-card>
			<el-row :gutter="15">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
					  <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="goAddpage">添加商品</el-button>
				</el-col>
			</el-row>
			
			<!-- table表格区域 -->
			<el-table :data="goodslist" border="">
				<el-table-column align="center" type="index" label="序号"></el-table-column>
				<el-table-column align="center" label="商品名称" prop="goods_name"></el-table-column>
				<el-table-column align="center" label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
				<el-table-column align="center" label="商品重量" prop="goods_weight" width="70px"></el-table-column>
				<el-table-column align="center" label="创建时间" prop="add_time" width="140px">
					<template v-slot="scope">
						{{scope.row.add_time | dateFormat}}
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" width="200px">
					<template v-slot="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="queryInfo.pagenum"
			      :page-sizes="[5, 10, 15, 20]"
			      :page-size="queryInfo.pagesize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total"
						background>
			    </el-pagination>
		</el-card>
	</div>
</template>

<script>
	import Crumbs from '../common/Crumbs.vue'
  export default{
    name:"Goods",
		components:{
			Crumbs
		},
		data() {
			return {
				//查询参数对象
				queryInfo:{
					query:'',
					pagenum: 1,
					pagesize: 10
				},
				//商品列表
				goodslist:[],
				// 总数据条数
				total:0
			}
		},
		created() {
			this.getGoodsList()
		},
		methods:{
			//根据分页获取对应商品列表
			async getGoodsList(){
				const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
				if(res.meta.status !== 200){
					return this.$message.error('获取商品列表失败')
				}
				// console.log(res.data)
				this.goodslist =  res.data.goods
				this.total = res.data.total
			},
			//改变分页数据条数
			handleSizeChange(newSize){
				this.queryInfo.pagesize = newSize
				this.getGoodsList()
			},	
			//改变分页页数
			handleCurrentChange(newPage){
				this.queryInfo.pagenum = newPage
				this.getGoodsList()
			},
			//删除该商品
			async removeById(id){
				const confirmResult =  await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				
				if(confirmResult !== 'confirm'){
					return this.$message.info('已取消删除')
				}
				
				const {data:res} = await this.$http.delete(`goods/${id}`)
				console.log(res)
				if(res.meta.status !== 200){
					return this.$message.error('删除失败')
				}
				this.$message.success('删除成功')
				this.getGoodsList()
			},
			
			goAddpage(){
				this.$router.push('/goods/add')
			}
			
		}
  }
</script>

<style scoped>
</style>

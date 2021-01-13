<template>
	<div class="Categories">
		<!-- 面包屑导航区域 -->
		<crumbs>
			<b slot="crumbsa">商品管理</b>
			<b slot="crumbsb">商品分类</b>
		</crumbs>
		<!-- 卡片视图区域 -->
		<el-card>
			<el-row>
				<el-col>
					<el-button class="bobutton" type="primary" @click="showAddCate">添加分类</el-button>
				</el-col>
			</el-row>
			<!-- 表格 -->
			<tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index border :show-row-hover="false">
				<!-- 是否有效 -->
				<template v-slot:isok="scope">
					<i class="el-icon-success" v-if="!scope.row.cat_deleted"></i>
					<i class="el-icon-error" v-else></i>
				</template>
				<!-- 排序 -->
				<template v-slot:order="scope">
					<el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
					<el-tag type="success" size="mini" v-else-if="scope.row.cat_level == 1">二级</el-tag>
					<el-tag type="warning" size="mini" v-else>三级</el-tag>
				</template>
				<!-- 操作 -->
				<template v-slot:opt="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCate(scope.row.cat_id)">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
				</template>
			</tree-table>	
				<!-- 分页区域 -->
				<el-pagination
				      @size-change="handleSizeChange"
				      @current-change="handleCurrentChange"
				      :current-page="queryInfo.pagenum"
				      :page-sizes="[3, 5, 10, 15]"
				      :page-size="queryInfo.pagesize"
				      layout="total, sizes, prev, pager, next, jumper"
				      :total="total">
				    </el-pagination>
		</el-card>
		
		<!-- 添加分类的对话框 -->
		<el-dialog
		  title="添加分类"
		  :visible.sync="addCateDialogVisible"
		  width="50%"
			@close="addCateDialogClosed">
			<!-- 添加分类的表单 -->
		  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
		    <el-form-item label="分类名称:" prop="cat_name">
		      <el-input v-model="addCateForm.cat_name"></el-input>
		    </el-form-item>
				<el-form-item label="父级名称:">
					<!-- options 用来指定数据源 -->
					<!-- props 用来指定配置对象 -->
				  <el-cascader
				      v-model="selectdeKeys"
				      :options="parentCatrList"
				      :props="cascaderProps"
				      @change="parentCatrChanged"
							clearable></el-cascader>
				</el-form-item>
			</el-form>	
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addCateDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addCate">确 定</el-button>
		  </span>
		</el-dialog>
		<!-- 修改分类对话框 -->
		<el-dialog
		  title="修改分类"
		  :visible.sync="editCateDialogVisible"
		  width="50%"
			@close="editCateDialogClosed">
		  <el-form :model="editCateForm" :rules="addCateFormRules" ref="editCateFormRef" label-width="100px">
		    <el-form-item label="分类名称:" prop="cat_name">
		      <el-input v-model="editCateForm.cat_name"></el-input>
		    </el-form-item>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editCateDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="eidtCate">确 定</el-button>
		  </span>
		</el-dialog>
		
	</div>
</template>

<script>
	import Crumbs from '../common/Crumbs.vue'
  export default{
    name:"Categories",
		components:{
			Crumbs
		},
		data() {
			return {
				// 查询条件
				queryInfo:{
					type:3,
					pagenum:1,
					pagesize:5
				},
				// 商品分类的数据列表
				catelist:[],
				// 总数据条数
				total:0,
				// 为table指定列的定义
				columns:[
					{
					label: '分类名称',
					prop: 'cat_name',
					},
					{
						label:'是否有效',
						// 表示将当前列定义为模板列
						type:'template',
						// 表示当前这一列使用的模板名称
						template:'isok'
					},
					{
						label:'排序',
						// 表示将当前列定义为模板列
						type:'template',
						// 表示当前这一列使用的模板名称
						template:'order'
					},
					{
						label:'操作',
						// 表示将当前列定义为模板列
						type:'template',
						// 表示当前这一列使用的模板名称
						template:'opt'
					}
				],
				// 控制添加分类对话框的显示与隐藏
				addCateDialogVisible:false,
				// 添加分类的表单数据对象
				addCateForm:{
					// 将要添加的分类名称
					cat_name:'',
					//父级分类的id
					cat_pid:0,
					//分类的等级默认添加一级分类
					cat_level:0
				},
				// 添加分类表单的验证规则对象
				addCateFormRules:{
					cat_name:[
						 { required: true, message: '请输入分类的名称', trigger: 'blur' },
						 { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
					]
				},
				// 父级分类列表
				parentCatrList:[],
				//指定级联选择器的配置对象
				cascaderProps:{
					// 次级菜单的展开方式
					expandTrigger: 'hover',
					value:'cat_id',
					label:'cat_name',
					children:'children',
					checkStrictly:true
				},
				// 选择的父级分类的id数组
				selectdeKeys:[],
				//控制修改分类对话框的显示与隐藏
				editCateDialogVisible:false,
				// 修改分类的表单数据对象
				editCateForm:{}
				
				
			}
		},
		created() {
			this.getCateList()
		},
		methods:{
			//获取商品分类数据
			async getCateList(){
				const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
				if(res.meta.status !== 200){
					return this.$message.error('获取商品分类失败')
				}
				// console.log(res.data)
				//把数据列表赋值给catelist
				this.catelist = res.data.result
				this.total = res.data.total
			},
			//监听pagesize改变的事件
			handleSizeChange(newSize){
				this.queryInfo.pagesize = newSize
				this.getCateList()
			},
			// 监听pagenum的改变	
			handleCurrentChange(newPage){
				this.queryInfo.pagenum = newPage
				this.getCateList()
			},
			// 添加分类按钮的监听
			showAddCate(){
				
				// 先获取父级分类数据列表，在展示对话框
				this.getParentCateList()
				this.addCateDialogVisible = true
			},
			// 获取父级分类的数据列表
			async getParentCateList(){
				const {data:res} = await this.$http.get('categories',{params:{type: 2 }})
				if(res.meta.status !== 200){
					return this.$message.error('获取父级数据分类失败')
				}
				// console.log(res.data)
				this.parentCatrList = res.data
			},
			//选择项发生变化触发
			parentCatrChanged(){
				// console.log(this.selectdeKeys)
				//如果selectdeKeys数组中的length>0 证明选中了父级分类
				if(this.selectdeKeys.length>0){
					// 父级分类id
					this.addCateForm.cat_pid = this.selectdeKeys[this.selectdeKeys.length-1]
					// 为当前分类的等级赋值
					this.addCateForm.cat_level = this.selectdeKeys.length
					return
				} else{
					// 父级分类id
					this.addCateForm.cat_pid = 0
					// 为当前分类的等级赋值
					this.addCateForm.cat_level = 0
				}
			},
			//点击按钮添加新的分类
			addCate(){
				// console.log(this.addCateForm)
				this.$refs.addCateFormRef.validate(async valid => {
					if(!valid) return
					const {data:res} = await this.$http.post('categories',this.addCateForm)
					if(res.meta.status !== 201){
						this.$message.error('添加分类失败')
					}
					this.$message.success('添加分类成功')
					this.getCateList()
					this.addCateDialogVisible = false
				})
			},
			//监听对话框的关闭事件,重置表单数据
			addCateDialogClosed(){
				this.$refs.addCateFormRef.resetFields()
				this.selectdeKeys = []
				this.addCateForm.cat_level = 0
				this.addCateForm.cat_pid = 0
			},
			//监听编辑按钮显示修改分类对话框
			async showEditCate(id){
				const {data:res} = await this.$http.get('categories/' + id)
				// console.log(res)
				if(res.meta.status !== 200){
					return this.$message.error('查询用户信息失败')
				}
				this.editCateForm = res.data
				this.editCateDialogVisible = true
			},
			//监听对话框的关闭事件,重置表单数据
			editCateDialogClosed(){
				this.$refs.editCateFormRef.resetFields()
				this.editCateForm = {}
			},
			//监听确定按钮,修改分类
			eidtCate(){
				this.$refs.editCateFormRef.validate(async valid => {
					if(!valid) return
					const {data:res} = await this.$http.put('categories/' + this.editCateForm.cat_id,{cat_name:this.editCateForm.cat_name})
					if(res.meta.status !== 200){
						return this.$message.error('修改失败')
					}
					this.$message.success('修改成功')
					this.getCateList()
					this.editCateDialogVisible = false
				})
			},
			//监听删除按钮的点击,删除数据
			async removeCate(id){
				const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				
				// 如果用户确认删除,则返回值为字符串 confirm
				// 如果用户取消删除,则返回值为字符串 cancel
				// console.log(confirmResult)
				if(confirmResult !== 'confirm'){
					return this.$message.info('已取消删除')
				}
				
				const {data:res} = await this.$http.delete('categories/' + id)
					if(res.meta.status !== 200){
						return this.$message.error('删除失败')
					}
					this.$message.success('删除成功')
					this.getCateList()
			},
			
			
			
		}
  }
</script>

<style scoped>
	.bobutton{
		margin-bottom: 0.9375rem;
	}
	.tree-table{
		text-align: center;
	}
	.el-cascader{
		width: 100%;
	}
</style>

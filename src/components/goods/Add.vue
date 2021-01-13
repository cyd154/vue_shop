<template>
	<div class="add">
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><b>商品管理</b></el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/goods' }"><b>商品列表</b></el-breadcrumb-item>
			<el-breadcrumb-item><b>添加商品</b></el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区域 -->
		<el-card>
			<el-alert title="添加商品信息" type="info" show-icon :closable="false" center></el-alert>
			<!-- 步骤条 -->
			<el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center="">
			  <el-step title="基本信息"></el-step>
			  <el-step title="商品参数"></el-step>
			  <el-step title="商品属性"></el-step>
			  <el-step title="商品图片"></el-step>
			  <el-step title="商品内容"></el-step>
			  <el-step title="完成"></el-step>
			</el-steps>
			<!-- tab栏区域 -->
			<el-form :model="addForm" :rules="addFormules" ref="addFormRef" label-width="100px" label-position="top">
			<el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
			    <el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品分类" prop="goods_cat">
							  <el-cascader
							    v-model="addForm.goods_cat"
							    :options="catelist"
							    :props="cateProps"
							    @change="handleChange">
								</el-cascader>
						</el-form-item>
						<el-form-item label="商品名称" prop="goods_name">
						    <el-input v-model="addForm.goods_name"></el-input>
						</el-form-item>
						<el-form-item label="商品价格" prop="goods_price">
						    <el-input v-model="addForm.goods_price" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
						    <el-input v-model="addForm.goods_weight" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number">
						    <el-input v-model="addForm.goods_number" type="number"></el-input>
						</el-form-item>
					</el-tab-pane>
			    <el-tab-pane label="商品参数" name="1">
						<el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
							<!-- 复选框 -->
							<el-checkbox-group v-model="item.attr_vals">
							    <el-checkbox border :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
							  </el-checkbox-group>
						</el-form-item>
					</el-tab-pane>
			    <el-tab-pane label="商品属性" name="2">
						<el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
							<el-input v-model="item.attr_vals"></el-input>
						</el-form-item>
					</el-tab-pane>
			    <el-tab-pane label="商品图片" name="3">
						<el-upload
						  :action="uploadURL"
						  :on-preview="handlePreview"
						  :on-remove="handleRemove"
						  list-type="picture"
							:headers="headerObj"
							:on-success="handleSuccess">
						  <el-button size="small" type="primary">点击上传</el-button>
						  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
						</el-upload>
					</el-tab-pane>
			    <el-tab-pane label="商品内容" name="4">
						<el-form-item label="商品内容：" prop="goods_introduce">
						    <el-input type="textarea" v-model="addForm.goods_introduce"></el-input>
								<el-button type="primary" @click="add">添加商品</el-button>
						</el-form-item>
					</el-tab-pane>
			  </el-tabs>
			</el-form>	
		</el-card>
		
		<!-- 图片预览对话框 -->
		<el-dialog
		  title="图片预览"
		  :visible.sync="previewVisible"
		  width="50%">
				<img :src="previewPath" alt="" style="width: 100%;">
		</el-dialog>
	</div>
</template>

<script>
	import _ from 'lodash'
  export default{
    name:"Add",
		data() {
			return {
				// 控制tab栏和步骤条
				activeIndex: '0',
				// 添加商品表单数据对象
				addForm:{
					goods_name:'',
					goods_price:'',
					goods_weight:'',
					goods_number:'',
					//商品所属的分类数组
					goods_cat:[],
					// 图片的数组
					pics:[],
					goods_introduce:'',
					attrs:[]
				},
				// 验证表单规则
				addFormules:{
					goods_name:[
						{ required: true, message: '请输入商品名称', trigger: 'blur' },
					],
					goods_price:[
						{ required: true, message: '请输入商品价格', trigger: 'blur' },
					],
					goods_weight:[
						{ required: true, message: '请输入商品重量', trigger: 'blur' },
					],
					goods_number:[
						{ required: true, message: '请输入商品数量', trigger: 'blur' },
					],
					goods_cat:[
						{ required: true, message: '请选择商品分类', trigger: 'blur' },
					],
					goods_introduce:[
						{ required: true, message: '请输入商品内容', trigger: 'blur' },
					]
				},
				//商品分类列表
				catelist:[],
				cateProps:{
					//次级菜单的展开方式
					expandTrigger: 'hover',
					label:'cat_name',
					value:'cat_id',
					children:'children'
				},
				// 商品参数列表
				manyTableData:[],
				// 商品属性列表
				onlyTableData:[],
				//上传图片的URL地址
				uploadURL:'http://119.23.53.78:8888/api/private/v1/upload',
				//图片上传组件的header请求头对象
				headerObj:{
					Authorization:window.sessionStorage.getItem('token')
				},
				//预览图片地址
				previewPath:'',
				//控制图片预览对话框的隐藏与显示
				previewVisible:false
				
				
				
				
			}
		},
		created() {
			this.getCateList()
		},
		methods:{
			//获取所有商品分类数据
			async getCateList(){
				const {data:res} = await this.$http.get('categories')
				if(res.meta.status !== 200){
					return this.$message.error('获取商品分类失败')
				}
				this.catelist = res.data
				// console.log(this.catelist)
			},
			//级联选择器选中变化触发函数
			handleChange(){
				if(this.addForm.goods_cat.length !== 3 ){
					this.addForm.goods_cat = []
				}
				// console.log(this.addForm.goods_cat)
			},
			// 切换tab标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
			beforeTabLeave(activeName, oldActiveName){
				// console.log('离开'+oldActiveName)
				// console.log('进入'+activeName)
				if(oldActiveName == '0' && this.addForm.goods_cat.length !== 3){
					this.$message.error('请先选择商品分类')
					return false
				}
			},
				// tab 被选中时触发
			async tabClicked(){
				// console.log(this.activeIndex)
				if(this.activeIndex == '1'){
					// 证明访问的是商品参数面板
					const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
					if(res.meta.status !== 200){
						return this.$message.error('获取商品参数失败')
					}
					res.data.forEach(item => {
						item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(",")
					})
					// console.log(res.data)
					this.manyTableData = res.data
				}else if(this.activeIndex == '2'){
					// 证明访问的是商品属性面板
					const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
					if(res.meta.status !== 200){
						return this.$message.error('获取商品属性失败')
					}
					// console.log(res.data)
					this.onlyTableData = res.data
				}	
			},
			//处理图片预览
			handlePreview(file){
				// console.log(file)
				this.previewPath = file.url
				this.previewVisible = true
			},
			//处理移除图片的操作
			handleRemove(file){
				// console.log(file)
				// 1.获取将要删除的图片的临时路径
				const filePath = file.response.data.tmp_path
				// 2.从pics数组中,找到这个图片对应的索引值
				const i = this.addForm.pics.findIndex(x => x.pic === filePath)
				// 3.调用数组的splice方法,把图片信息对象从pics数组中移除
				this.addForm.pics.splice(i, 1)
				// console.log(this.addForm)
			},
			// 监听图片上传成功的事件
			handleSuccess(response){
				// console.log(response)
				// 1.拼接得到一个图片信息对象
				const picInfo = {pic:response.data.tmp_path}
				// 2.将图片信息对象push到pics数组中
				this.addForm.pics.push(picInfo)
				// console.log(this.addForm)
			},
			//添加商品
			add(){
				// console.log(this.addForm)
				this.$refs.addFormRef.validate(async valid => {
					if(!valid) {
						return this.$message.error('请填写必要的表单项')
					}
					const form = _.cloneDeep(this.addForm)
					form.goods_cat = form.goods_cat.join(',')
					// 处理动态参数
					this.manyTableData.forEach(item => {
						const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals.join(',')}
						this.addForm.attrs.push(newInfo)
					})
					// 处理静态属性
					this.onlyTableData.forEach(item => {
						const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
						this.addForm.attrs.push(newInfo)
					})
					form.attrs = this.addForm.attrs
					// console.log(form)
					
					// 发起请求添加商品,商品的名称必须是唯一的
					const {data:res} = await this.$http.post('goods',form)
					if(res.meta.status !== 201){
						return this.$message.error('添加商品失败')
					}
					this.$message.success('添加商品成功')
					this.$router.push('/goods')
				})
			}
			
			
			
		},
		computed:{
			cateId(){
				if(this.addForm.goods_cat.length == 3){
					return this.addForm.goods_cat[2]
				}
				return null
			}
		}
  }
</script>

<style lang="less" scoped>
	.el-checkbox{
		margin: 0.3125rem 0.625rem 0 0 !important;
	}
	.el-button{
		margin-top: 0.9375rem;
	}
</style>

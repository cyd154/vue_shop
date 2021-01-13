<template>
	<el-container class="home-container">
		<!-- 头部区域 -->
	  <el-header>
			<div>
				<img src="../assets/logo.png" alt="">
				<span>电商后台管理系统</span>
			</div>
			<el-button type="info" @click="logout">退出</el-button>
		</el-header>
		<!-- 页面主体区域 -->
	  <el-container>
			<!-- 侧边栏 -->
				<el-aside :width="isCollapse ? '60px' : '200px'">
					<div class="toggle-button" @click="toggleCollapse">|||</div>
					<!-- 侧边栏菜单区域 -->
					<el-menu
						router
						:collapse="isCollapse"
						:collapse-transition="false"
					  unique-opened
						background-color="#333744"
						text-color="#fff"
						active-text-color="#409eff"
						:default-active="$route.path">
						<!-- 一级菜单 -->
						<el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
							<!-- 一级菜单模板区域 -->
							<template slot="title">
								<!-- 图标 -->
								<i :class="iconsObj[item.id]"></i>
								<!-- 文本 -->
								<span>{{item.authName}}</span>
							</template>
							<!-- 二级菜单 -->
							<el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" >
								<template slot="title">
									<!-- 图标 -->
									<i class="el-icon-menu"></i>
									<!-- 文本 -->
									<span>{{subItem.authName}}</span>
								</template>
							</el-menu-item>
						</el-submenu>
					</el-menu>
				</el-aside>
			<!-- 右侧主体 -->
	    <el-main>
				<!-- 路由占位符 -->
				<router-view></router-view>
			</el-main>
	  </el-container>
	</el-container>
</template>

<script>
  export default{
    name:"Home",
		data(){
			return {
				//左侧菜单数据
				menulist:[],
				iconsObj:{
					'125':'el-icon-user',
					'103':'el-icon-key',
					'101':'el-icon-shopping-bag-2',
					'102':'el-icon-tickets',
					'145':'el-icon-data-line'
				},
				isCollapse:false,
			}
		},
		methods:{
			logout(){
				window.sessionStorage.clear()
				this.$router.push('/login')
			},
			//获取所有菜单
			async getMenuList(){
			 const {data: res} = await this.$http.get('menus')
			 // console.log(res)
			 if(res.meta.status !== 200){
				 return this.$message.error(res.meta.msg)
			 }
			 this.menulist = res.data
			},
			//点击按钮切换菜单的折叠与展开
			toggleCollapse(){
				this.isCollapse = !this.isCollapse
			},
		},
		created() {
			this.getMenuList()
		},
  }
</script>

<style lang="less" scoped>
	.home-container{
		height: 100vh;
	}
	.el-header{
		background-color: #373d41;
		display: flex;
		justify-content: space-between;
		padding-left: 0;
		align-items: center;
		color: #fff;
		font-size: 1.25rem;
		>div{
			display: flex;
			align-items: center;
			img{
				width: 3.75rem;
				height: 3.75rem;
			}
			span{
				margin-left: 0.625rem;
			}
		}
	}
	.el-aside{
		background-color: #333744;
		.el-menu{
			border-right: none;
		}
	}
	.el-main{
		background-color: #eaedf1;
	}
	.toggle-button{
		background-color: #4a5064;
		color: #fff;
		font-size: 0.625rem;
		line-height: 24px;
		text-align: center;
		letter-spacing: 0.2em;
		cursor: pointer;
	}
</style>

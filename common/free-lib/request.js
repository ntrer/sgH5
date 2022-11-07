import $C from './config.js';
import $U from './util.js';
// import $store from '@/store/index.js';
export default {
    // 全局配置
    common:{
        baseUrl:$C.baseUrl,
        header:{
            'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
        },
        data:{},
        method:'GET',
        dataType:'json',
    },
	
  // 请求 返回promise
  request(options = {}){
  	// 组织参数
  	options.url = this.common.baseUrl + options.url
  	options.header = options.header || this.common.header
  	options.data = options.data || this.common.data
  	options.method = options.method || this.common.method
  	options.dataType = options.dataType || this.common.dataType
  	// 请求
  	return new Promise((res,rej)=>{
  		// 请求之前... todo
  		// 请求中...
  		uni.request({
  			...options,
  			success: (result) => {
  				// 服务端失败
  				if(result.data.code!= 200){
					
	               uni.showToast({
		               title: result.data.msg || '服务端请求失败',
		               icon: 'none',
		               duration:3000
	               });
	               return rej() 	
						
  					
  				}
  				// 成功
  				let data = result.data
  				res(data)
  			},
  			fail: (error) => {
  				uni.showToast({
  					title:"服务端失败",
  					icon: 'none',
					duration:3000
  				});
  				return rej()
  			}
  		});
  	})
  },
	
	
    // get请求
    get(url,data = {},options = {}){
        options.url = url
        options.data = data
        options.method = 'GET'
        return this.request(options)
    },
    // post请求
    post(url,data = {},options = {}){
        options.url = url
        options.data = data
        options.method = 'POST'
        return this.request(options)
    },
    // delete请求
    del(url,data = {},options = {}){
        options.url = url
        options.data = data
        options.method = 'DELETE'
        return this.request(options)
    },
	// 上传文件
	upload(url,data,onProgress = false){
		return new Promise((result,reject)=>{
			// 上传
			let token = $U.getStorage('token')
			if (!token) {
			    uni.showToast({ title: '请先登录', icon: 'none' });
			    // token不存在时跳转
			    return uni.reLaunch({
			        url: '/pages/common/login/login',
			    });
			}
			
			const uploadTask = uni.uploadFile({
				url:this.common.baseUrl + url,
				filePath:data.filePath,
				name:data.name || "files",
				header:{ token },
				success: (res) => {
					if(res.statusCode !== 200){
						return uni.showToast({
							title: '上传失败',
							icon: 'none',
							duration:3000
						});
					}
					let message = JSON.parse(res.data)
					result(message.data);
				},
				fail: (err) => {
					console.log(err);
					reject(err)
				}
			})
			
			uploadTask.onProgressUpdate((res) => {
				if(typeof onProgress === 'function'){
					onProgress(res.progress)
				}
			});
			
		})
	}
	
	
	
}
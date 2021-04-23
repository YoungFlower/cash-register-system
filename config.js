let env = 'production'
// let env = 'dev2'
// let env = 'test2'
// let env = 'sim'
const prodUrl = 'https://m.jianke.cc'
const prodDomain = 'https://m.jianke.cc'
const packageName = 'jianzhike'
const imgSrc = `https://wodan-idc.oss-cn-hangzhou.aliyuncs.com/miniProgram/${env==='production'?'test':'test'}/${packageName}/`
const config = {
  nodeEnv: env === 'production' ? 'production' : 'development',
  domain: env === 'production' ? prodDomain : `http://${env}-docker-www.shijianke.com`,
  baseUrl: env === 'production' ? prodUrl : `http://${env}-docker-www.shijianke.com`,
  upImageUrl: '/m/fileUpload/ossFileUpload',
  packageName: packageName,
  imgSrc: imgSrc
}

export default config
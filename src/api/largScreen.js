//使用axios请求数据
import axios from "axios"
//配置基础路径
axios.defaults.baseURL = "http://third.hengshituan.com";
axios.interceptors.response.use((data) => data.data);

/*获取中转港数据*/
let getEntrepot=()=>{
    return axios.get("api/hangce/cameras");
};

/*获取第三方商检数据*/
let getInspection=()=>{
    return axios.get("api/ys/videos?type=filter");
};

/*获取江阴中信数据*/
let getJYZX=()=>{
    return axios.get("api/hikvision/cameras?type=filter");
};
/* 根据code获取萤石云视频 */
let getYSYvideo=(indexcode)=>{
    return axios.get("api/hikvision/liveurl?indexcode="+indexcode);
};
export {getEntrepot,getInspection,getJYZX,getYSYvideo};
<template>
    <div class="entrepotInspectionBox">
        <div class="entrepotInspectionTop">
            <div class="entrepotTopTitle">今日转驳中转港信息</div>
            <div></div>
        </div>
        <div class="entrepotInspectionCenter">
            <div class="entrepotVideoTitle">中转港视频列表</div>
            <div class="entrepotList">
                <select class="zzgSelect">
                    <option v-for="(item,index) in entrepotData" :key="index" value="">{{item.areaName}}</option>
                </select>
            </div>
            <div class="entrepotBtnBox">
                <div class="entrepotBtnCss" v-for="(item,index) in videoBoxBtn" :key="index">{{index + 1}}</div>
            </div>
            <div class="entrepotBox">
                <div class="entrepotVideo" :class="'entrepotVideo'+index" v-for="(item,index) in videoForeDatas" :key="index">
                    <iframe :src="'http://third.hengshituan.com/api/hangce/play?uuid='+item.cameraUuid"></iframe>
                </div>
            </div>
        </div>
        <div class="entrepotInspectionBottom">
            <div class="inspectionVideoTitle">商检单位视频列表</div>
            <div class="inspectionList"></div>
            <div class="inspectionBox"></div>
        </div>
    </div>
</template>

<script>
    import {getEntrepot,getInspection,getJYZX} from "../../src/api/largScreen"

    window.player = null;
    window.playHandler = function(){
        // console.log('play');
    }
    window.errorHandler = function(){
        console.log('playError');
        //window.camHandle.setShipPlayUrl({sn:this.curCameraSN})
    }
    export default {
        name: "largeScreen",
        data(){
            return{
                entrepotData:[],
                videoBoxArr:[],//视频播放窗口
                videoBoxBtn:[],
                videoForeDatas:[],
            }
        },
        mounted() {
            this.getEntrepotList();
        },
        created(){},
        methods:{
            /*获取中转港数据*/
            getEntrepotList(){
                getEntrepot().then(response => {
                    this.entrepotData = response.data;
                    console.log(this.entrepotData);
                    this.entrepotListBtn(response.data[0].cameras);
                    //let videoDatas = response.data.cameras
                });
            },
            /* 中转港列表点击 */
            entrepotListBtn(data){
                let entrepotList = data;
                let zjgArr = [];
                for(var j=0;j<entrepotList.length;j+=4){
                    zjgArr.push(entrepotList.slice(j,j+4));
                }
                console.log(zjgArr);
                this.videoBoxBtn = zjgArr;
                this.videoForeDatas = zjgArr[0];
            },
            nowVideo(num){

            },


            //播放视频
            playVideo(params) {
                window.camHandle = this;
                var videoObject = {
                    container: '.playVideo0',
                    variable: 'player',
                    flashplayer: true,
                    autoplay: true, // 自动播放
                    live: true, // 是否是直播视频
                    loaded: 'loadedHandler',
                    video: params
                };
                player = new ckplayer(videoObject);
                window.loadedHandler = function (params){
                    player.addListener('play', playHandler);
                    player.addListener('error', errorHandler); //监听元数据
                }
                function playHandler(params) {}
                function errorHandler(params) {}
            },
            // 时间戳转换时间格式
            formatDateTime(timestamp,_temp) {
                var date = new Date(timestamp);
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                var minute = date.getMinutes();
                minute = minute < 10 ? ('0' + minute) : minute;
                if (_temp == 1){
                    return m + '-' + d + ' ' + h + ':' + minute;
                }else{
                    return y + '/' + m + '/' + d + ' ' + h + ':' + minute;
                }

            },

        }
    }
</script>

<style scoped>
.entrepotInspectionBox{
     width: 3840px;
     height: 3240px;
    background-color: #000e33;
 }
.entrepotInspectionTop{
    height: 15%;
    width: 100%;
}
.entrepotTopTitle{
    color: #fff;
}
.entrepotInspectionCenter,.entrepotInspectionBottom{
    height: 42%;
    width: 100%;
}

</style>
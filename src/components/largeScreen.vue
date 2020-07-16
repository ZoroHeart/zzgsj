<template>
    <div class="entrepotInspectionBox">
        <div class="entrepotInspectionTop">
            <i class="boxTop"></i><i class="boxBottom"></i>
            <div class="entrepotTopTitle">今日转驳中转港信息</div>
            <div class="entrepotTopCont">
                <div class="barIconCss"><p>张家港</p><i>2</i></div>
                <div class="barIconCss"><p>江阴中信</p><i>1</i></div>
                <div class="barIconCss"><p>扬州海昌</p><i>1</i></div>
                <div class="barIconCss"><p>太仓华能</p><i>1</i></div>
            </div>
        </div>
        <div class="entrepotInspectionCenter">
            <i class="boxTop"></i><i class="boxBottom"></i>
            <div class="entrepotVideoTitle">中转港视频列表</div>
            <div class="entrepotList">
                <select class="zzgSelect" @change="entrepotListBtn(entrepotData[entrepotArrIndex].cameras,entrepotData[entrepotArrIndex].typeFlag,1)" v-model="entrepotArrIndex">
                    <option v-for="(item,index) in entrepotData" :key="index" :value="index">{{item.areaName}}</option>
                </select>
            </div>
            <div class="entrepotBtnBox">
                <div class="entrepotBtnCss" v-for="(item,index) in videoBoxBtn" :key="index" @click="nowVideoBtn(index)">{{index + 1}}</div>
            </div>
            <div class="entrepotBox">
                <div class="entrepotIEcss" v-if="videoFlagIE">
                    <div class="entrepotVideo" v-for="(item,index) in videoForeDatas" :key="index">
                        <iframe :src="'http://third.hengshituan.com/api/hangce/play?uuid='+item.cameraUuid"></iframe>
                    </div>
                </div>

                <div class="entrepotYSYcss" v-if="videoFlag">
                    <div class="entrepotVideo0"></div>
                    <div class="entrepotVideo1"></div>
                    <div class="entrepotVideo2"></div>
                    <div class="entrepotVideo3"></div>
                </div>
            </div>
        </div>
        <div class="entrepotInspectionBottom">
            <i class="boxTop"></i><i class="boxBottom"></i>
            <div class="inspectionVideoTitle">商检单位视频列表</div>
            <div class="inspectionList">
                <select class="sjSelect" @change="inspectionListBtn(inspectionData[inspectionArrIndex].channels)" v-model="inspectionArrIndex">
                    <option v-for="(item,index) in inspectionData" :key="index" :value="index">{{item.deviceName}}</option>
                </select>
            </div>
            <div class="inspectionBtnBox">
                <div class="inspectionBtnCss" v-for="(item,index) in sjvideoBtn" :key="index" @click="nowVideoBtnSJ(index)">{{index + 1}}</div>
            </div>
            <div class="inspectionBox">
                <div class="inspectionVideo0"></div>
                <div class="inspectionVideo1"></div>
                <div class="inspectionVideo2"></div>
                <div class="inspectionVideo3"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getEntrepot,getInspection,getJYZX,getYSYvideo} from "../../src/api/largScreen"

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
                videoFlagIE:true,
                videoFlag:false,
                entrepotArrIndex:0,
                inspectionData:[],
                typeFlagNum:0,
                player:undefined,//视频播放插件
                playV:undefined,
                inspectionArrIndex:0,
                sjvideoBtn:[]
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
                    for(let i=0;i<response.data.length;i++){
                        response.data[i].typeFlag = 0;
                        this.entrepotData.push(response.data[i]);
                    }
                    getJYZX().then(response => {
                        let jyzxArr = [];
                        for(let i=0;i<response.data.length;i++){
                            jyzxArr = jyzxArr.concat(response.data[i].cameras);
                        }
                        let jyzxData = {
                            "areaName":"江阴中信",
                            "cameras":jyzxArr,
                            "typeFlag":1
                        };
                        this.entrepotData.push(jyzxData);
                    });
                    getInspection().then(response => {
                        for(let i=0;i<response.data.length;i++){
                            if(response.data[i].deviceName == "扬州海昌"){
                                let yzhcData = {
                                    "areaName":response.data[i].deviceName,
                                    "cameras":response.data[i].channels,
                                    "typeFlag":2
                                };
                                this.entrepotData.push(yzhcData);
                            }else{
                                this.inspectionData.push(response.data[i]);
                            }
                        }
                        this.inspectionListBtn(response.data[0].channels);
                    });
                    this.entrepotListBtn(this.entrepotData[0].cameras,0,0);
                });
            },
            /* 中转港列表切换 */
            entrepotListBtn(data,typeFlag,init){
                let entrepotList = data;
                let zjgArr = [];
                this.typeFlagNum = typeFlag;
                for(var j=0;j<entrepotList.length;j+=4){
                    zjgArr.push(entrepotList.slice(j,j+4));
                }
                this.videoBoxBtn = zjgArr;
                if(init == 0){//初始化
                    this.videoForeDatas = zjgArr[0];
                }
                if(typeFlag == 0){
                    this.videoFlagIE = true;
                    this.videoFlag = false;
                    this.nowVideoBtn(0);
                }else if(typeFlag == 1){
                    this.videoFlagIE = false;
                    this.videoFlag = true;
                    this.nowVideoBtn(0);
                } else if(typeFlag == 2){
                    this.videoFlagIE = false;
                    this.videoFlag = true;
                    this.nowVideoBtn(0);
                }

            },
            /* 点击视频分页 */
            nowVideoBtn(num){
                let nowVideoData = this.videoBoxBtn[num];
                console.log(nowVideoData);
                if(this.typeFlagNum == 0){
                    this.videoForeDatas = nowVideoData;
                }else if(this.typeFlagNum == 1){
                    for(let i=0;i<nowVideoData.length;i++){
                        this.getCodeYSYvideo(nowVideoData[i].indexCode,i);
                    }
                }else if(this.typeFlagNum == 2){
                    console.log(nowVideoData);
                    for(let i=0;i<nowVideoData.length;i++){
                        this.playVideo(nowVideoData[i].liveAddress,"entrepotVideo",i);
                    }
                }
            },

            /* 根据code获取萤石云视频 */
            getCodeYSYvideo(indexcode,num){
                getYSYvideo(indexcode).then(response => {
                    console.log(response.data);
                    this.playVideo(response.data.url,"entrepotVideo",num);
                })
            },
            inspectionListBtn(data){
                let inspectionList = data;
                console.log(inspectionList);
                let zjgArr = [];
                for(var j=0;j<inspectionList.length;j+=4){
                    zjgArr.push(inspectionList.slice(j,j+4));
                }
                console.log(zjgArr);
                this.sjvideoBtn = zjgArr;
                this.nowVideoBtnSJ(0);
            },
            nowVideoBtnSJ(num){
                let nowVideoDataSJ = this.sjvideoBtn[num];
                for(let i=0;i<nowVideoDataSJ.length;i++){
                    this.playVideo(nowVideoDataSJ[i].liveAddress,"inspectionVideo",i);
                }
            },


            //播放视频
            playVideo(params,str,num) {
                window.camHandle = this;
                var videoObject = {
                    container: '.'+str+num,
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
                };
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

<style src="../../src/api/largScreen.css"></style>
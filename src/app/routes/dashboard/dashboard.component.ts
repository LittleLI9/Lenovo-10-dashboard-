import { _HttpClient } from '@delon/theme';
import { yuan, getTimeDistance } from '@delon/util';
import * as echarts from 'echarts';
import { Component, OnInit, OnDestroy, ElementRef, TemplateRef, ChangeDetectorRef, ViewChild, HostListener, enableProdMode, Renderer2 } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { NzModalService } from 'ng-zorro-antd';
import { I18NService } from '@core/i18n/i18n.service'
import { Observable, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import 'echarts/theme/macarons.js';
import 'echarts/theme/dark.js'
import 'echarts/theme/infographic.js'
import 'echarts/theme/shine.js'
import 'echarts/theme/roma.js'
import 'echarts/theme/vintage.js'
import 'echarts/theme/helianthus.js'
import 'echarts/theme/macarons2.js'
import { ThemeService } from 'app/service/theme.service';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls:['./dashboard.component.less']
})

export class DashboardComponent implements OnInit {
    tplModal: NzModalRef;
    resourceUse = '最近一个月';
    resourcesMemory = '最近一个月';
    resourcesStorage = '最近一个月';
    Internet = '最近一小时';
    connectTime = '最近一小时';
    loadTime = '最近一小时';
    virtualTime = '最近一个月';
    isVisible1: boolean = false;
    isVisible: boolean = false;
    virtual1: boolean = false;
    detailed: boolean = false;
    memory: boolean = false;
    storage: boolean = false;
    healthDetail:boolean = false;
    loadSituation: any = ['CPU', '内存'];
    loadValue:any;
    date_range: Date[] = [];
    sortName = null;
    sortValue = null;
    listOfSearchName = [];
    searchAddress: string;
    loadDetail:boolean = false;
    total:any = 'v1/server/';
    severalBaseType = 'qps_amount';
    theme = 'macarons';
    year:any;
    month:any;
    day:any;
    hour:any;
    minute:any;
    second:any;
    loading: any;
    time:any;

    load:any = [];
    loadTwo:any = [];
    ResourceData = {
        normal: {
            show: true,
            position: 'inside'
        }
    };
    lineWidth = {
        normal:{
            lineStyle:{
                width:1
            }
        }
    };
    featrue =  {
        mark : {show: true},
        dataView : {show: true, readOnly: false},
        magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
        restore : {show: true},
        saveAsImage : {show: true}
    };
    itemStyle = {
        normal: {
            label : {
                show: true, 
                align:'middle',
                position: 'top',
            },
            color:function(params){
                var colorList = ['#2EC7C9','#B6A2DE','#5AB1EF','#FFB980','#D87A80','#8D98B3','#6E8B3D','#97B552','#95706D','#DC69AA','#388E8E'];
                return colorList[params.dataIndex]
            }
        }
    }
    cakeItem = {
        emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        normal:{
            color:function(params){
                var colorList = ['#2EC7C9','#B6A2DE','#5AB1EF','#FFB980','#D87A80','#8D98B3','#6E8B3D','#97B552','#95706D','#DC69AA','#388E8E'];
                return colorList[params.dataIndex]
            }
        }
    }
    resourPublicBox = {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature : this.featrue
    }
    publicTip =  {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    }
    publicGrid = {
        left: '4%',
        right: '5%',
        bottom: '3%',
        containLabel: true
    }
    publicMoreGrid ={
        left: '2%',
        right: '2%',
        bottom: '3%',
        containLabel: true
    }
    publicMoreBox = {
        show: true,
        top:25,
        right:15,
        feature :this.featrue
    }
    publicSmallGrid =  {
        left: '2%',
        right: '5%',
        bottom: '3%',
        containLabel: true
    }

    Cpu = {
        salesCakeDataCpu:{
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                left: '4%',
                top:'10%',
                data: []
            },
            series : [
                {
                    name: 'CPU个数',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[],
                    itemStyle: this.cakeItem
                }
            ]
        },
        salesBarDataCpu:{
            tooltip: this.publicTip,
            legend: {
                data: [],
                left:'9%'
            },
            grid: this.publicGrid,
            toolbox: this.resourPublicBox,
            calculable: true,
            xAxis:{
                type: 'category',
                axisTick: { show: false },
                axisLabel:{
                    interval:0,
                    rotate:30,
                    color:'#000'
                },
                data: []
            },
            yAxis:{
                name:'',
                type: 'value',
                nameTextStyle:{
                    fontSize:16,
                    padding:[25,40,0,0],
                    color:'#000'
                },
                axisLabel:{color:'#000'}
            },
            series: [
                {
                    type:'bar',
                    itemStyle:this.itemStyle,
                    data:[]
                }
            ]
        }
    }

    MemoryData = {
        salesCakeDataMemory:{
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                left: '4%',
                top:'10%',
                data: []
            },
            series : [
                {
                    name: '内存使用率',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[],
                    itemStyle: this.cakeItem
                }
            ]
        },
        salesBarDataMemory:{
            tooltip: this.publicTip,
            legend: {
                data: [],
                left:'9%'
            },
            grid:this.publicGrid,
            toolbox:this.resourPublicBox,
            calculable: true,
            xAxis:{
                type: 'category',
                axisTick: { show: false },
                axisLabel:{
                    interval:0,
                    rotate:30,
                    color:'#000'
                },
                data: []
            },
            yAxis:{
                name:'',
                type: 'value',
                nameTextStyle:{
                    fontSize:16,
                    padding:[25,40,0,0],
                    color:'#000'
                },
                axisLabel:{color:'#000'}
            },
            series: [
                {
                    type:'bar',
                    itemStyle:this.itemStyle,
                    data:[]
                }
            ]
        }
    }

    StorageData = {
        salesCakeDataStorage:{
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                left: '4%',
                top:'10%',
                data: []
            },
            series : [
                {
                    name: '存储使用率',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[],
                    itemStyle: this.cakeItem
                }
            ]
        },
        salesBarDataStorage:{
            tooltip: this.publicTip,
            legend: {
                data: [],
                left:'9%'
            },
            grid:this.publicGrid,
            toolbox: this.resourPublicBox,
            calculable: true,
            xAxis:{
                type: 'category',
                axisTick: { show: false },
                axisLabel:{
                    interval:0,
                    rotate:30,
                    color:'#000'
                },
                data: []
            },
            yAxis:{
                name:'',
                type: 'value',
                nameTextStyle:{
                    fontSize:16,
                    padding:[25,40,0,0],
                    color:'#000'
                },
                axisLabel:{color:'#000'}
            },
            series: [
                {
                    type:'bar',
                    itemStyle:this.itemStyle,
                    data:[]
                }
            ]
        }
    }

    dbDataVolume = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            left:'9%',
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '1%',
            containLabel: true
        },
        toolbox:this.resourPublicBox,
        calculable: true,
        xAxis:{
            type: 'category',
            axisTick: { show: false },
            axisLabel:{
                interval:0,
                rotate:30,
                color:'#000'
            },
            data: []
        },
        yAxis:{
            name:'',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[25,40,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: [
            {
                type:'bar',
                itemStyle:this.itemStyle,
                data:[]
            }
        ]
    };


    resources = [
        { id: 0, text: '最近一个月', value: true },
        { id: 1, text: '最近三个月', value: false },
        { id: 2, text: '最近一年', value: false },
    ];

    resources_memory = [
        { id: 0, text: '最近一个月', value: true },
        { id: 1, text: '最近三个月', value: false },
        { id: 2, text: '最近一年', value: false },
    ];

    resources_storage = [
        { id: 0, text: '最近一个月', value: true },
        { id: 1, text: '最近三个月', value: false },
        { id: 2, text: '最近一年', value: false },
    ]

    bandwidths = [
        { id: 0, text: '最近一小时', value: true },
        { id: 1, text: '最近一天', value: false },
        { id: 2, text: '最近一周', value: false },
    ]

    connect = [
        { id: 0, text: '最近一小时', value: true },
        { id: 1, text: '最近一天', value: false },
        { id: 2, text: '最近一周', value: false },
    ]

    loadTab = [
        { id: 0, text: '最近一小时', value: true },
        { id: 1, text: '最近一天', value: false },
        { id: 2, text: '最近一周', value: false },
    ]

    dbData = [
        { id: 0, text: '最近一个月', value: true },
        { id: 1, text: '最近三个月', value: false },
        { id: 2, text: '最近一年', value: false },
    ]

    VirtualDetail = [
        { id: 0, text: '最近一个月', value: true },
        { id: 1, text: '最近三个月', value: false },
        { id: 2, text: '最近一年', value: false },
    ]

    virtual = {
        tooltip:this.publicTip,
        toolbox: {
            show : true,
            feature : this.featrue,
            right:15
        },
        legend: {
            data: [],
        },
        grid: {
            left: '1%',
            right: '6%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            name:'',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[25,0,0,15],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        yAxis: {
            type: 'category',
            axisTick: { show: false },
            data:[],
            nameTextStyle: {
                fontSize: 6,
            },
            axisLabel:{color:'#000'}
        },
        series: []
    }

    Vcurve = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{},
            left:'8%'
        },
        grid:this.publicMoreGrid,
        toolbox:this.publicMoreBox ,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel:{
                // interval:2,
                color:'#000'
            }
        },
        yAxis:{
            name:'',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[25,45,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };

    VcurveThree = {
        tooltip: this.publicTip,
        legend: {
            data: [],
            selected:{},
            left:'8%'
        },
        grid: this.publicMoreGrid,
        toolbox:this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel:{
                color:'#000'
            }
        },
        yAxis:{
            name:'',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[25,45,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };

    VcurveYear = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{},
            left:'8%'
        },
        grid:this.publicMoreGrid,
        toolbox: this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel:{color:'#000'},
            data: []
        },
        yAxis:{
            name:'',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[25,45,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };

    // echarts数据
    bandwidth: any = {
        tooltip:this.publicTip,
        legend: {
            data: ['电脑管家', '智慧联想', 'upe', 'ase', 'ire', 'shop pay legou', '扬天业务', 'smb业务', 'smarthome-iot', 'smarthome-cui'],
            selected:{}
        },
        grid:this.publicMoreGrid,
        toolbox: this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel:{color:'#000'},
            data: ['12:00', '14:00', '16:00', '18:00', '20:00']
        },
        yAxis: {
            type: 'value',
            axisLabel:{color:'#000'},
            nameTextStyle:{color:'#000'}
        },
        series: [
            {
                name: '电脑管家',
                type: 'line',
                color: '#00EEEE',
                smooth: true,
                itemStyle:this.lineWidth,
                stack: '总量',
                data: [100, 202, 120, 130, 100]
            },
            {
                name: '智慧联想',
                type: 'line',
                color: '#B22222',
                itemStyle:this.lineWidth,
                smooth: true,
                stack: '总量',
                data: [330, 310, 100, 202, 120, 130]
            },
            {
                name: 'upe',
                type: 'line',
                stack: '总量',
                smooth: true,
                itemStyle:this.lineWidth,
                color: '#528B8B',
                data: [150, 232, 201, 154, 190]
            },
            {
                name: 'ase',
                type: 'line',
                color: '#8B658B',
                stack: '总量',
                itemStyle:this.lineWidth,
                smooth: true,
                data: [320, 332, 301, 334, 390]
            },
            {
                name: 'ire',
                type: 'line',
                color: '#FF6A6A',
                itemStyle:this.lineWidth,
                stack: '总量',
                smooth: true,
                data: [820, 932, 901, 934, 1290]
            },
            {
                name: 'shop pay legou',
                type: 'line',
                stack: '总量',
                itemStyle:this.lineWidth,
                smooth: true,
                color: '#191970',
                data: [120, 132, 101, 134, 90]
            },
            {
                name: '扬天业务',
                type: 'line',
                itemStyle:this.lineWidth,
                stack: '总量',
                smooth: true,
                color: '#54FF9F',
                data: [220, 182, 191, 234, 290]
            },
            {
                name: 'smb业务',
                type: 'line',
                stack: '总量',
                itemStyle:this.lineWidth,
                color: '#548B54',
                smooth: true,
                data: [150, 232, 201, 154, 190]
            },
            {
                name: 'smarthome-iot',
                type: 'line',
                stack: '总量',
                smooth: true,
                itemStyle:this.lineWidth,
                color: '#FF1493',
                data: [320, 332, 301, 334, 390]
            },
            {
                name: 'smarthome-cui',
                type: 'line',
                stack: '总量',
                smooth: true,
                itemStyle:this.lineWidth,
                color: '#1E90FF',
                data: [932, 901, 934, 1290, 1330]
            }
        ]
    };

    dataCpuOne: any = {
        tooltip: this.publicTip,
        legend: {
            data: [],
            selected:{},
            left:'7%'
        },
        grid: this.publicMoreGrid,
        toolbox:this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data:[],
            axisLabel:{
                // interval:2,
                color:'#000'
            }
        },
        yAxis: {
            name:'个',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[25,50,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    dataCpuThree: any = {
        tooltip: this.publicTip,
        legend: {
            data: [],
            selected:{},
            left:'7%'
        },
        grid: this.publicMoreGrid,
        toolbox: this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap : false,
            data: [],
            axisLabel:{
                color:'#000'
            }
        },
        yAxis: {
            name:'个',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[25,50,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    dataCpuYear: any = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{},
            left:'7%'
        },
        grid:this.publicMoreGrid,
        toolbox:this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel:{color:'#000'},
            data: []
        },
        yAxis: {
            name:'个',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[25,50,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    
    memoryDataOne: any = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{},
            left:'7%'
        },
        grid: this.publicMoreGrid,
        toolbox:this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel:{
                // interval:2,
                color:'#000'
            }
        },
        yAxis: {
            name:'GB',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[25,45,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    memoryDataThree: any = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{},
            left:'7%'
        },
        grid:this.publicMoreGrid,
        toolbox:this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel:{
                color:'#000'
            }
        },
        yAxis: {
            name:'GB',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[25,45,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    memoryDataYear: any = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{},
            left:'7%'
        },
        grid:this.publicMoreGrid,
        toolbox:this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel:{color:'#000'},
            data: []
        },
        yAxis: {
            name:'GB',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[25,45,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };

    storageDataOne: any = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{},
            left:'7%'
        },
        grid:this.publicMoreGrid,
        toolbox:this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel:{
                // interval:2,
                color:'#000'
            }
        },
        yAxis: {
            name:'GB',
            type: 'value',
            nameTextStyle:{
                fontSize:14,
                padding:[25,65,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    storageDataThree: any = {
        tooltip: this.publicTip,
        legend: {
            data: [],
            selected:{},
            left:'7%'
        },
        grid:this.publicMoreGrid,
        toolbox:this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel:{
                color:'#000'
            }
        },
        yAxis: {
            name:'GB',
            type: 'value',
            nameTextStyle:{
                fontSize:14,
                padding:[25,65,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    storageDataYear: any = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{},
            left:'7%'
        },
        grid:this.publicMoreGrid,
        toolbox:this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel:{color:'#000'},
            data: []
        },
        yAxis: {
            name:'GB',
            type: 'value',
            nameTextStyle:{
                fontSize:14,
                padding:[25,65,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };

    status = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            left:'9%'
        },
        grid:{
            left: '4%',
            right: '5%',
            bottom: '10%',
            containLabel: true
        },
        toolbox:this.resourPublicBox,
        calculable: true,
        xAxis: {
            name:'',
            type: 'category',
            axisTick: { show: false },
            axisLabel:{color:'#000'},
            data: []
        },
        yAxis: {
            name:'',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[25,65,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };

    optionStatus = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{},
            left:'9%'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox:this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel:{color:'#000'},
            data:[]
        },
        yAxis: {
            name:'',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[25,70,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    
    dayoption = {
        tooltip : this.publicTip,
        legend: {
            data:[],
            selected:{}
        },
        calculable : true,
        grid:this.publicSmallGrid,
        toolbox:{
            show:true,
            feature: this.featrue,
            top:25
        },
        xAxis : {
            type : 'category',
            boundaryGap : false,
            axisLabel:{color:'#000'},
            data:[],
        },
        yAxis :{
            name:'',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[17,30,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series : []
    };
    hoursoption = {
        tooltip :this.publicTip,
        legend: {
            data:[],
            selected:{}
        },
        calculable : true,
        grid:this.publicSmallGrid,
        toolbox:{
            show:true,
            feature : this.featrue,
            top:25
        },
        xAxis : {
            type : 'category',
            boundaryGap : false,
            axisLabel:{color:'#000'},
            data:[],
        },
        yAxis :{
            name:'',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[17,30,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series : []
    };
    weekoption = {
        tooltip :this.publicTip,
        legend: {
            data:[],
            selected:{}
        },
        calculable : true,
        grid:this.publicSmallGrid,
        toolbox:{
            show:true,
            feature : this.featrue,
            top:25
        },
        xAxis : {
            type : 'category',
            boundaryGap : false,
            data:[],
            axisLabel:{
                color:'#000'
            }
        },
        yAxis :{
            name:'',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[17,30,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series : []
    };

    Health = [
        {
            class:'td_green',
        },
        {
            class:'td_red',
        },
        {
            class:'td_green',
        },
        {
            class:'td_yellow',
        },
        {
            class:'td_green',
        },
        {
            class:'td_yellow',
        },
        {
            class:'td_yellow',
        },
        {
            class:'td_green',
        },
        {
            class:'td_yellow',
        },
        {
            class:'td_red',
        }
    ]

    data_health = [
        {
            url:'http://health1',
            status:'200',
            responseTime:'13:00'
        },
        {
            url:'http://health2',
            status:'400',
            responseTime:'13:00'
        },
        {
            url:'http://health3',
            status:'200',
            responseTime:'15:00'
        }
    ];

    data_connect = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{}
        },
        grid:this.publicSmallGrid,
        toolbox:this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel:{color:'#000'},
            data: []
        },
        yAxis:{
            name:'个',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[17,55,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    data_qps =  {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{}
        },
        grid:this.publicMoreGrid,
        toolbox:this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel:{color:'#000'},
            data: []
        },
        yAxis: {
            name:'个',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[17,55,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    data_rt = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{}
        },
        grid:this.publicMoreGrid,
        toolbox:this.publicMoreBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel:{color:'#000'},
            data: []
        },
        yAxis: {
            name:'个',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[17,55,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };

    data_cpu = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{}
        },
        grid:this.publicSmallGrid,
        toolbox:this.resourPublicBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel:{
                color:'#000'
            }
        },
        yAxis: {
            name:'%',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[17,30,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    data_memory = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{}
        },
        grid:this.publicSmallGrid,
        toolbox:this.resourPublicBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel:{color:'#000'},
            data: []
        },
        yAxis: {
            name:'%',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[17,30,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    data_cpuDay = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{}
        },
        grid:this.publicSmallGrid,
        toolbox:this.resourPublicBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel:{
                color:'#000'
            }
        },
        yAxis: {
            name:'%',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[17,30,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    data_memoryDay = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{}
        },
        grid:this.publicSmallGrid,
        toolbox:this.resourPublicBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel:{color:'#000'},
            data: []
        },
        yAxis: {
            name:'%',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[17,30,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    data_cpuWeek = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{}
        },
        grid:this.publicSmallGrid,
        toolbox:this.resourPublicBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel:{
                color:'#000'
            }
        },
        yAxis: {
            name:'%',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[17,30,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };
    data_memoryWeek = {
        tooltip:this.publicTip,
        legend: {
            data: [],
            selected:{}
        },
        grid:this.publicSmallGrid,
        toolbox:this.resourPublicBox,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel:{color:'#000'},
            data: []
        },
        yAxis: {
            name:'%',
            type: 'value',
            nameTextStyle:{
                fontSize:16,
                padding:[17,30,0,0],
                color:'#000'
            },
            axisLabel:{color:'#000'}
        },
        series: []
    };

    data_db = this.bandwidth
    data_db_ops = this.bandwidth
    
    constructor(
        private http: _HttpClient,
        private el: ElementRef, 
        private modalService: NzModalService,
        private ref: ChangeDetectorRef,
        private i18n:I18NService,
        public msg: NzMessageService,
        private renderer2:Renderer2,
        public themeService:ThemeService
    ){}

    ngOnInit() {
        this.getData();
        this.initialData(this.bandwidth);
        // this.themeService.eventEmit.subscribe((value:any) => {
        //     this.theme = value;
        //     this.nameColorZX()
        //     this.InternetPublic(this.Internet)
        //     this.LoadTheme(this.loadTime)
        //     this.ConnectionPublic(this.connectTime)
        // })
    }

    getData(){
        //资源概览接口
            //虚拟机接口
            this.http.get(this.total + 'aggregation/count',{'showTotal':true}).subscribe((res:any) => {
                this.virtual.yAxis.data = res.serviceLines;
                this.virtual.xAxis.name = '个';
                this.virtual.legend.data = [];
                this.virtual.series = [];
                var newHealth = res.serviceLines.slice(0,res.serviceLines.length-1);
                newHealth.forEach((item,i) => {
                    this.Health[i]['name'] = item;
                    this.Health[i]['id'] = i + 1;
                    this.Health[i]['title'] = item;
                })
                res.data.forEach((item,i) => {
                    res.data[i]
                    this.virtual.legend.data.push(item.fname)
                    this.virtual.series.push({
                        "name":item.fname,
                        "type":'bar',
                        "stack":'总量',
                        "label":this.ResourceData,
                        "data":item.serviceLines
                    })
                })
            })

            //db数据量接口
            this.http.get('v1/db-usage/aggregation').subscribe((res:any) => {
                this.dbDataVolume.yAxis.name = 'GB';
                this.dbDataVolume.xAxis.data = [];
                this.dbDataVolume.xAxis.data = res.serviceLines;
                this.dbDataVolume.series[0].data = [];
                res.data.forEach((item,i) => {
                    this.dbDataVolume.series[0].data.push(item.usage)
                })
            })

            //费用状况接口
            this.http.get('api/v1/expense/prev').subscribe((res:any) => {
                this.status.xAxis.data = [];
                this.status.xAxis.data = res.times;
                this.status.yAxis.name = res.unit;
                this.status.legend.data = res.serviceLines;
                this.status.series = [];
                res.data.forEach((item,i) => {
                    this.status.series.push({
                        "name":item.fname,
                        "type":'bar',
                        "data":item.value
                    })
                })
                this.colorData(this.status)
            })

            //资源使用总览接口
            this.ResourceG('cpu',this.Cpu)

            //网络带宽接口
            this.InternetData('minute','1','',this.hoursoption)

        //监控页面下的接口
            //虚机接口(目前只有连接数)
            this.VirtualData('minute','1','',this.data_connect)

            //负载接口
            this.LoadData('cpu','minute','1','',this.data_cpu)
            this.LoadData('memory','minute','1','',this.data_memory)
    }

    nameColor(data){
        if(this.theme == 'macarons' || this.theme == 'infographic'){
            data.xAxis.axisLabel.color = '#000';
            data.yAxis.axisLabel.color = '#000';
            data.yAxis.nameTextStyle.color = '#000';
        }else{
            data.xAxis.axisLabel.color = '';
            data.yAxis.axisLabel.color = '';
            data.yAxis.nameTextStyle.color = '';
        }
    }

    // nameColorZX(){
    //     this.nameColor(this.virtual)
    //     this.nameColor(this.Vcurve)
    //     this.nameColor(this.VcurveThree)
    //     this.nameColor(this.VcurveYear)

    //     this.nameColor(this.Cpu.salesBarDataCpu)
    //     this.nameColor(this.MemoryData.salesBarDataMemory)
    //     this.nameColor(this.StorageData.salesBarDataStorage)
    //     this.nameColor(this.dataCpuOne)
    //     this.nameColor(this.dataCpuThree)
    //     this.nameColor(this.dataCpuYear)
    //     this.nameColor(this.memoryDataOne)
    //     this.nameColor(this.memoryDataThree)
    //     this.nameColor(this.memoryDataYear)
    //     this.nameColor(this.storageDataOne)
    //     this.nameColor(this.storageDataThree)
    //     this.nameColor(this.storageDataYear)

    //     this.nameColor(this.bandwidth)
    //     this.nameColor(this.dbDataVolume)

    //     this.nameColor(this.status)
    //     this.nameColor(this.optionStatus)

    //     this.nameColor(this.dayoption)
    //     this.nameColor(this.hoursoption)
    //     this.nameColor(this.weekoption)

    //     this.nameColor(this.data_connect)
    //     this.nameColor(this.data_qps)
    //     this.nameColor(this.data_rt)

    //     this.nameColor(this.data_cpu)
    //     this.nameColor(this.data_memory)
    //     this.nameColor(this.data_cpuDay)
    //     this.nameColor(this.data_memoryDay)
    //     this.nameColor(this.data_cpuWeek)
    //     this.nameColor(this.data_memoryWeek)
    // }

    newTimeWeek(time){
        var now = new Date();
        var date = new Date(now.getTime() - time * 24 * 3600 * 1000);
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.day = date.getDate();
        this.hour = date.getHours();
        this.minute = date.getMinutes();
        this.second = date.getSeconds();
    }

    initialData(dataG){ 
        this.data_db.toolbox.orient = 'vertical'
        this.data_db.toolbox.left = 'right'
        this.data_db.toolbox.top = 'center'
        this.data_db.grid.right = '5%';       
        for(let i in dataG.legend.data){
            let name = dataG.legend.data[i]
            if(Number(i) < 3){
                dataG.legend.selected[name] = true
            }else{
                dataG.legend.selected[name] = false
            }
        }
    }

    Showlegend(id,data){
        echarts.registerTheme = this.theme;
        var myChart = echarts.init(document.getElementById(id),this.theme);
        myChart.on('legendselectchanged', function(obj) {
            data.legend.selected = {};
            for(let i in data.legend.data){
                if(obj.name == String(data.legend.data[i])){
                    let index = data.legend.data[i];
                    obj.selected[index] = true;
                }else{
                    obj.selected[data.legend.data[i]] = false;
                }
            }
            data.legend.selected = obj.selected;
            myChart.setOption(data,true)
        })
    }

    colorData(data){
        data.series[6]['color'] = '#6E8B3D';
        data.series[7]['color'] = '#97B552';
        data.series[8]['color'] = '#95706D';
        data.series[9]['color'] = '#DC69AA';
        data.series[10]['color'] = '#388E8E';
        if(data.series.length >= 12){
            data.series[11]['color'] = '#68228B';
        }
    }
    
    CpuDetail(time){
        if(time == '最近三个月'){
            this.newTimeWeek(90)
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + this.day + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            this.ResourceUsage('cpu','','1',startTime,this.dataCpuThree)
            setTimeout(() => {
                echarts.init(document.getElementById('cpuThree')).setOption(this.dataCpuThree,true)
                this.Showlegend('cpuThree',this.dataCpuThree)
            },100)
        }else if(time == '最近一年'){
            this.ResourceUsage('cpu','month','1','',this.dataCpuYear)
            setTimeout(() => {
                echarts.init(document.getElementById('cpuYear')).setOption(this.dataCpuYear,true)
                this.Showlegend('cpuYear',this.dataCpuYear)
            },100)
        }else if(time == '最近一个月'){
            this.ResourceUsage('cpu','day','1','',this.dataCpuOne)
            setTimeout(() => {
                echarts.init(document.getElementById('cpuOne')).setOption(this.dataCpuOne,true)
                this.Showlegend('cpuOne',this.dataCpuOne)
            },100)
        }
    }

    MemoryDetail(time){
        if(time == '最近一个月'){
            this.ResourceUsage('memory','day','1','',this.memoryDataOne)
            setTimeout(() => {
                echarts.init(document.getElementById('memoryOne')).setOption(this.memoryDataOne,true)
                this.Showlegend('memoryOne',this.memoryDataOne)
            },100)
        }else if(time == '最近三个月'){
            this.newTimeWeek(90)
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + this.day + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            this.ResourceUsage('memory','','1',startTime,this.memoryDataThree)
            setTimeout(() => {
                echarts.init(document.getElementById('memoryThree')).setOption(this.memoryDataThree,true)
                this.Showlegend('memoryThree',this.memoryDataThree)
            },100)
        }else if(time == '最近一年'){
            this.ResourceUsage('memory','month','1','',this.memoryDataYear)
            setTimeout(() => {
                echarts.init(document.getElementById('memoryYear')).setOption(this.memoryDataYear,true)
                this.Showlegend('memoryYear',this.memoryDataYear)
            },100)
        }
    }

    StorageDetail(time){
        if(time == '最近一个月'){
            this.ResourceUsage('disk','day','1','',this.storageDataOne)
            setTimeout(() => {
                echarts.init(document.getElementById('storageOne')).setOption(this.storageDataOne,true)
                this.Showlegend('storageOne',this.storageDataOne)
            },100)
        }else if(time == '最近三个月'){
            this.newTimeWeek(90)
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + this.day + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            this.ResourceUsage('disk','','1',startTime,this.storageDataThree)
            setTimeout(() => {
                echarts.init(document.getElementById('storageThree')).setOption(this.storageDataThree,true)
                this.Showlegend('storageThree',this.storageDataThree)
            },100)
        }else if(time == '最近一年'){
            this.ResourceUsage('disk','month','1','',this.storageDataYear)
            setTimeout(() => {
                echarts.init(document.getElementById('storageYear')).setOption(this.storageDataYear,true)
                this.Showlegend('storageYear',this.storageDataYear)
            },100)
        }
    }

    LoadData(type,timeInterval,span,startTime,data){
        if(type == 'cpu'){
            this.http.get('v1/server-load/history',{'dataType':type,'startTime':startTime,'interval':timeInterval,'span':span}).subscribe((res:any) => {
                data.xAxis.data = [];
                data.xAxis.data = res.times;
                data.legend.data = res.serviceLines;
                data.series = [];
                res.data.map((item,i) => {
                    data.series.push({
                        "name":item.fname,
                        "type":'line',
                        "smooth":true,
                        "itemStyle":this.lineWidth,
                        "data":item.cpus
                    })
                })
                this.initialData(data)
            })
        }else if(type == 'memory'){
            this.http.get('v1/server-load/history',{'dataType':type,'startTime':startTime,'interval':timeInterval,'span':span}).subscribe((res:any) => {
                data.xAxis.data = [];
                data.xAxis.data = res.times;
                data.legend.data = res.serviceLines;
                data.series = [];
                res.data.map((item,i) => {
                    data.series.push({
                        "name":item.fname,
                        "type":'line',
                        "smooth":true,
                        "itemStyle":this.lineWidth,
                        "data":item.memories
                    })
                })
                this.initialData(data)
            })
        }
    }

    InternetData(timeInterval,span,startTime,interData){
        this.http.get('v1/slb/history',{'dataType':'TRAFFICTX','interval':timeInterval,'span':span,'startTime':startTime,'showTotal':true}).subscribe((res:any) => {
            interData.legend.data = [];
            interData.xAxis.data = [];
            interData.legend.data = res.serviceLines;
            interData.yAxis.name = 'Mbps';
            interData.xAxis.data = res.times;
            interData.series = [];
            res.data.map((item,i) => {
                interData.series.push({
                    "name":item.fname,
                    "type":'line',
                    "smooth":true,
                    "itemStyle":this.lineWidth,
                    "data":item.traffictx
                })
            })
            interData.series[6]['color'] = '#6E8B3D';
            this.initialData(interData)
        })
    }

    VirtualData(timeInterval,span,startTime,virtualData){
        this.http.get('v1/slb/history',{'dataType':'connection','startTime':startTime,'interval':timeInterval,'span':span,'showTotal':true}).subscribe((res:any) => {
            virtualData.legend.data = [];
            virtualData.legend.data = res.serviceLines;
            virtualData.xAxis.data = res.times;
            virtualData.series = [];
            res.data.map((item,i) => {
                virtualData.series.push({
                    "name":item.fname,
                    "type":'line',
                    "smooth":true,
                    "itemStyle":this.lineWidth,
                    "data":item.connections
                })
            })
            virtualData.series[6]['color'] = '#6E8B3D';
            this.initialData(virtualData)
        })
    }

    ResourceUsage(type,interval,span,startTime,data){
        if(type == 'cpu'){
            this.http.get('v1/server/history/detail',{'interval':interval,'span':span,'dataType':type,'startTime':startTime,'showTotal':true}).subscribe((res:any) => {
                data.xAxis.data = [];
                data.xAxis.data = res.times;
                data.legend.data = res.serviceLines;
                data.series = [];
                res.data.forEach((item,i) => {
                    data.series.push({
                        "name":item.fname,
                        "type":'line',
                        "smooth":true,
                        "itemStyle":this.lineWidth,
                        "data":item.cpus
                    })
                })
                this.initialData(data)
                this.colorData(data)
            })
        }else if(type == 'memory'){
            this.http.get('v1/server/history/detail',{'interval':interval,'span':span,'dataType':type,'startTime':startTime,'showTotal':true}).subscribe((res:any) => {
                data.xAxis.data = [];
                data.xAxis.data = res.times;
                data.legend.data = res.serviceLines;
                data.series = []
                res.data.forEach((item,i) => {
                    data.series.push({
                        "name":item.fname,
                        "type":'line',
                        "smooth":true,
                        "itemStyle":this.lineWidth,
                        "stack":'总量',
                        "data":item.memories
                    })
                })
                this.initialData(data)
                this.colorData(data)
            })
        }else if(type == 'disk'){
            this.http.get('v1/server/history/detail',{'interval':interval,'span':span,'dataType':type,'startTime':startTime,'showTotal':true}).subscribe((res:any) => {
                data.xAxis.data = [];
                data.xAxis.data = res.times;
                data.legend.data = res.serviceLines;
                data.series = [];
                res.data.forEach((item,i) => {
                    data.series.push({
                        "name":item.fname,
                        "type":'line',
                        "smooth":true,
                        "itemStyle":this.lineWidth,
                        "stack":'总量',
                        "data":item.disks
                    })
                })
                this.initialData(data)
                this.colorData(data)
            })
        }
    }

    storUsage(type){
        if(type == 'memory'){
            this.ResourceG('memory',this.MemoryData)
            setTimeout(() =>{
                echarts.init(document.getElementById('memory')).setOption(this.MemoryData.salesBarDataMemory,true)
                echarts.init(document.getElementById('memoryCake')).setOption(this.MemoryData.salesCakeDataMemory,true)
            },100)
        }else if(type == 'storage'){
            this.ResourceG('disk',this.StorageData)
            setTimeout(() =>{
                echarts.init(document.getElementById('storage')).setOption(this.StorageData.salesBarDataStorage,true)
                echarts.init(document.getElementById('storageCake')).setOption(this.StorageData.salesCakeDataStorage,true)
            },100)
        }else if(type == 'cpu'){
            this.ResourceG('cpu',this.Cpu)
            setTimeout(() =>{
                echarts.init(document.getElementById('cpu')).setOption(this.Cpu.salesBarDataCpu,true)
                echarts.init(document.getElementById('cpuCake')).setOption(this.Cpu.salesCakeDataCpu,true)
            },100)
        }
    }

    LoadHour(type){
        if(this.loadTime == '最近一小时'){
            if(type == 'cpu'){
                this.LoadData('cpu','minute','1','',this.data_cpu)
                setTimeout(() =>{
                    echarts.init(document.getElementById('CPU')).setOption(this.data_cpu,true)
                    this.Showlegend('CPU',this.data_cpu)
                },100)
            }else if(type == 'memory'){
                this.LoadData('memory','minute','1','',this.data_memory)
                setTimeout(() =>{
                    echarts.init(document.getElementById('Memory')).setOption(this.data_memory,true)
                    this.Showlegend('Memory',this.data_memory)
                },100)
            }
        }else if(this.loadTime == '最近一天'){
            this.newTimeWeek(1)
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + (this.day) + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            if(type == 'cpu'){
                this.LoadData('cpu','minute','5',startTime,this.data_cpuDay)
                setTimeout(() =>{
                    echarts.init(document.getElementById('cpuDay')).setOption(this.data_cpuDay,true)
                    this.Showlegend('cpuDay',this.data_cpuDay)
                },100)
            }else if(type == 'memory'){
                this.LoadData('memory','minute','5',startTime,this.data_memoryDay)
                setTimeout(() =>{
                    echarts.init(document.getElementById('MemoryDay')).setOption(this.data_memoryDay,true)
                    this.Showlegend('MemoryDay',this.data_memoryDay)
                },300)
            }
        }else if(this.loadTime == '最近一周'){
            this.newTimeWeek(7)
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + (this.day) + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            if(type == 'cpu'){
                this.LoadData('cpu','minute','10',startTime,this.data_cpuWeek)
                setTimeout(() =>{
                    echarts.init(document.getElementById('cpuWeek')).setOption(this.data_cpuWeek,true)
                    this.Showlegend('cpuWeek',this.data_cpuWeek)
                },100)
            }else if(type == 'memory'){
                this.LoadData('memory','minute','10',startTime,this.data_memoryWeek)
                setTimeout(() =>{
                    echarts.init(document.getElementById('MemoryWeek')).setOption(this.data_memoryWeek,true)
                    this.Showlegend('MemoryWeek',this.data_memoryWeek)
                },500)
            }
        }
    }

    LoadTheme(time){
        if(time == '最近一小时'){
            this.LoadData('cpu','minute','1','',this.data_cpu)
            this.LoadData('memory','minute','1','',this.data_memory)
            setTimeout(() =>{
                echarts.init(document.getElementById('CPU')).setOption(this.data_cpu,true)
                this.Showlegend('CPU',this.data_cpu)
                echarts.init(document.getElementById('Memory')).setOption(this.data_memory,true)
                this.Showlegend('Memory',this.data_memory)
            },100)
        }else if(time == '最近一天'){
            this.newTimeWeek(1)
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + (this.day) + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            this.LoadData('cpu','minute','5',startTime,this.data_cpuDay)
            this.LoadData('memory','minute','5',startTime,this.data_memoryDay)
            setTimeout(() =>{
                echarts.init(document.getElementById('cpuDay')).setOption(this.data_cpuDay,true)
                this.Showlegend('cpuDay',this.data_cpuDay)
                echarts.init(document.getElementById('MemoryDay')).setOption(this.data_memoryDay,true)
                this.Showlegend('MemoryDay',this.data_memoryDay)
            },100)
        }else if(time == '最近一周'){
            this.newTimeWeek(7)
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + (this.day) + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            this.LoadData('cpu','minute','10',startTime,this.data_cpuWeek)
            this.LoadData('memory','minute','10',startTime,this.data_memoryWeek)
            setTimeout(() =>{
                echarts.init(document.getElementById('cpuWeek')).setOption(this.data_cpuWeek,true)
                this.Showlegend('cpuWeek',this.data_cpuWeek)
                echarts.init(document.getElementById('MemoryWeek')).setOption(this.data_memoryWeek,true)
                this.Showlegend('MemoryWeek',this.data_memoryWeek)
            },100)
        }
    }

    ResourceG(type,Resourcedata){
        this.http.get(this.total + 'aggregation/detail',{'dataType':type}).subscribe((res:any) => {
            if(type == 'cpu'){
                Resourcedata.salesBarDataCpu.yAxis.name = '个';
                Resourcedata.salesBarDataCpu.xAxis.data = [];
                Resourcedata.salesCakeDataCpu.legend.data = [];
                Resourcedata.salesBarDataCpu.xAxis.data = res.serviceLines;
                Resourcedata.salesCakeDataCpu.legend.data = res.serviceLines;
                Resourcedata.salesBarDataCpu.series[0].data = [];
                Resourcedata.salesCakeDataCpu.series[0].data = [];
                res.data.forEach((item,i) => {
                    Resourcedata.salesBarDataCpu.series[0].data.push(item.cpu)
                    Resourcedata.salesCakeDataCpu.series[0].data.push({
                        "value":item.cpu,
                        "name":item.fname
                    })
                })
            }else if(type == 'memory'){
                Resourcedata.salesBarDataMemory.yAxis.name = 'GB';
                Resourcedata.salesBarDataMemory.xAxis.data = [];
                Resourcedata.salesCakeDataMemory.legend.data = [];
                Resourcedata.salesBarDataMemory.xAxis.data = res.serviceLines;
                Resourcedata.salesCakeDataMemory.legend.data = res.serviceLines;
                Resourcedata.salesBarDataMemory.series[0].data = [];
                Resourcedata.salesCakeDataMemory.series[0].data = [];
                res.data.forEach((item,i) => {
                    Resourcedata.salesBarDataMemory.series[0].data.push(item.memory)
                    Resourcedata.salesCakeDataMemory.series[0].data.push({
                        "value":item.memory,
                        "name":item.fname
                    })
                })
            }else if(type == 'disk'){
                Resourcedata.salesBarDataStorage.yAxis.name = 'GB';
                Resourcedata.salesBarDataStorage.xAxis.data = [];
                Resourcedata.salesCakeDataStorage.legend.data = [];
                Resourcedata.salesBarDataStorage.xAxis.data = res.serviceLines;
                Resourcedata.salesCakeDataStorage.legend.data = res.serviceLines;
                Resourcedata.salesBarDataStorage.series[0].data = [];
                Resourcedata.salesCakeDataStorage.series[0].data = [];
                res.data.forEach((item,i) => {
                    Resourcedata.salesBarDataStorage.series[0].data.push(item.disk)
                    Resourcedata.salesCakeDataStorage.series[0].data.push({
                        "value":item.disk,
                        "name":item.fname
                    })
                })
            }
        })
    }

    IfdetailVir(time){
        if(time == '最近一个月'){
            this.VcurveDetail('day','1','',this.Vcurve)
            setTimeout(() => {
                echarts.init(document.getElementById('Vcurve')).setOption(this.Vcurve,true)
                this.Showlegend('Vcurve',this.Vcurve)
            },100)
        }else if(time == '最近三个月'){
            this.newTimeWeek(90)
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + this.day + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            this.VcurveDetail('','1',startTime,this.VcurveThree)
            setTimeout(() => {
                echarts.init(document.getElementById('VcurveThree')).setOption(this.VcurveThree,true)
                this.Showlegend('VcurveThree',this.VcurveThree)
            },100)
        }else if(time == '最近一年'){
            this.VcurveDetail('month','1','',this.VcurveYear)
            setTimeout(() => {
                echarts.init(document.getElementById('VcurveYear')).setOption(this.VcurveYear,true)
                this.Showlegend('VcurveYear',this.VcurveYear)
            },100)
        }
    }

    VcurveDetail(interval,span,startTime,data){
        this.http.get(this.total + 'history/count',{'startTime':startTime,'interval':interval,'span':span,'showTotal':true}).subscribe((res:any) => {
            data.xAxis.data = [];
            data.xAxis.data = res.times;
            data.yAxis.name = '个';
            data.legend.data = [];
            data.legend.data = res.serviceLines;
            data.series = [];
            res.data.forEach((item,i) => {
                data.series.push({
                    "name":item.fname,
                    "type":"line",
                    "smooth":true,
                    "itemStyle":this.lineWidth,
                    "showSybmol":false,
                    "hoverAnimation":false,
                    "data":item.counts
                })
                if(i < 3){
                    data.legend.selected[res.data[i].fname] = true;
                }else{
                    data.legend.selected[res.data[i].fname] = false;
                }
            })
            this.colorData(data)
        })
    }

    onChartEvent(event: any, type: string) {
        this.virtual1 = true;
        this.IfdetailVir(this.virtualTime)
    }

    statusDetail(startTime,endTime,data){
        this.http.get('api/v1/expense/history',{'startTime':startTime,'endTime':endTime}).subscribe((res:any) => {
            data.legend.data = res.serviceLines;
            data.xAxis.data = [];
            data.xAxis.data = res.times;
            data.yAxis.name = res.unit;
            data.series = [];
            res.data.map((item,i) => {
                data.series.push({
                    "name":item.fname,
                    "type":'line',
                    "smooth":true,
                    "itemStyle":this.lineWidth,
                    "data":item.value
                })
                if(i < 3){
                    data.legend.selected[res.data[i].fname] = true;
                }else{
                    data.legend.selected[res.data[i].fname] = false;
                }
            })
            this.colorData(data)
        })
    }

    onChartStatus(event: any, type: string){
        this.isVisible1 = true;
        this.newTimeWeek(210)
        let startTime = Date.parse(this.year + '-' + (this.month) + '-' + this.day + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
        this.statusDetail(startTime,'',this.optionStatus)
        setTimeout(() => {
            echarts.init(document.getElementById('status')).setOption(this.optionStatus,true);
            this.Showlegend('status',this.optionStatus)
        },100)
    }

    onChartLoad(){
        this.http.get('v1/server-load/aggregation').subscribe((res:any) => {
            this.load = [];
            this.loadTwo = [];
            res.data.map((item,i) => {
                this.load.push({
                    "business_id":item.serviceLineId,
                    "business_name":item.fname,
                    "CPU":item.cpu,
                    "memory":item.memory
                })
                this.loadTwo.push({
                    "business_id":item.serviceLineId,
                    "business_name":item.fname,
                    "CPU":item.cpu,
                    "memory":item.memory
                })
            })
        })
        this.loadDetail = true;
        this.load = this.loadTwo;
        this.selectedName = 'CPU';
        this.loadValue = '';
    }

    sort(sort: { key: string, value: string }): void {
        this.sortName = sort.key;
        this.sortValue = sort.value;
        this.search();
    }

    search(): void {
        const filterFunc = item => (this.searchAddress ? item.address.indexOf(this.searchAddress) !== -1 : true) && (this.listOfSearchName.length ? this.listOfSearchName.some(name => item.name.indexOf(name) !== -1) : true);
        const data = this.load.filter(item => filterFunc(item));
        /** sort data **/
        if (this.sortName && this.sortValue) {
            this.load = data.sort((a, b) => (this.sortValue === 'ascend') ? (a[ this.sortName ] > b[ this.sortName ] ? 1 : -1) : (b[ this.sortName ] > a[ this.sortName ] ? 1 : -1));
        } else {
            this.load = data;
          }
    }

    //负载详情 下拉框start
    selectedName = "CPU";
    selectName(e) {
        this.selectedName = e;
    }

    blur(){
        let load_cpu:any = [];
        if(this.selectedName == 'CPU'){
            this.loadTwo.forEach(item => {
                if(item.CPU > this.loadValue){
                    load_cpu.push(item);
                }
            })
            this.load = load_cpu;
        }else if(this.selectedName == '内存'){
            this.loadTwo.forEach(item => {
                if(item.memory > this.loadValue){
                    load_cpu.push(item);
                }
            })
            this.load = load_cpu;
        }
    }

    setDate(type: any) {
        this.date_range = getTimeDistance(type);
    }

    InternetPublic(time){
        if(time == '最近一天'){
            this.newTimeWeek(1)
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + (this.day) + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            this.InternetData('minute','5',startTime,this.dayoption)
            setTimeout(() => {
                echarts.init(document.getElementById('dayInternet')).setOption(this.dayoption,true)
                this.Showlegend('dayInternet',this.dayoption)
            },300)
        }else if(time == '最近一小时'){
            this.InternetData('minute','1','',this.hoursoption)
            setTimeout(() => {
                echarts.init(document.getElementById('hourInternet')).setOption(this.hoursoption,true)
                this.Showlegend('hourInternet',this.hoursoption)
            },100)
        }else if(time == '最近一周'){
            this.newTimeWeek(7)
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + (this.day) + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            this.InternetData('minute','10',startTime,this.weekoption)
            setTimeout(() => {
                echarts.init(document.getElementById('weekInternet')).setOption(this.weekoption,true)
                this.Showlegend('weekInternet',this.weekoption)
            },700)
        }
    }

    change_band(res:any,idx:number){
        if (idx === 999) {
            this.bandwidths.map(i => (i.value = res.value));
        } else {
            this.bandwidths.map(i => (i.value = false));
            this.bandwidths[idx].value = true;
        }
        this.Internet = this.bandwidths[idx].text;

        this.InternetPublic(res.text)
    }

    LoadPublic(time){
        if(time == '最近一天'){
            this.newTimeWeek(1);
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + (this.day) + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            this.LoadData('cpu','minute','5',startTime,this.data_cpuDay)
            setTimeout(() => {
                echarts.init(document.getElementById('cpuDay')).setOption(this.data_cpuDay,true)
                this.Showlegend('cpuDay',this.data_cpuDay)
            },100)
        }else if(time == '最近一小时'){
            this.LoadData('cpu','minute','1','',this.data_cpu)
            setTimeout(() => {
                echarts.init(document.getElementById('CPU')).setOption(this.data_cpu,true)
                this.Showlegend('CPU',this.data_cpu)
            },100)
        }else if(time == '最近一周'){
            this.newTimeWeek(7)
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + (this.day) + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            this.LoadData('cpu','minute','10',startTime,this.data_cpuWeek)
            setTimeout(() => {
                echarts.init(document.getElementById('cpuWeek')).setOption(this.data_cpuWeek,true)
                this.Showlegend('cpuWeek',this.data_cpuWeek)
            },700)
        }
    }

    change_load(res:any,idx:number){
        if (idx === 999) {
            this.loadTab.map(i => (i.value = res.value));
        } else {
            this.loadTab.map(i => (i.value = false));
            this.loadTab[idx].value = true;
        }
        this.loadTime = this.loadTab[idx].text;
        this.LoadPublic(res.text)
    }

    ConnectionPublic(time){
        if(time == '最近一天'){
            this.newTimeWeek(1);
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + (this.day) + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            this.VirtualData('minute','5',startTime,this.data_qps)
            setTimeout(() => {
                echarts.init(document.getElementById('contentDay')).setOption(this.data_qps,true)
                this.Showlegend('contentDay',this.data_qps)
            },100)
        }else if(time == '最近一小时'){
            this.VirtualData('minute','1','',this.data_connect)
            setTimeout(() => {
                echarts.init(document.getElementById('contentHour')).setOption(this.data_connect)
                this.Showlegend('contentHour',this.data_connect)
            },100)
        }else if(time == '最近一周'){
            this.newTimeWeek(7)
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + (this.day) + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            this.VirtualData('minute','10',startTime,this.data_rt)
            setTimeout(() => {
                echarts.init(document.getElementById('contentWeek')).setOption(this.data_rt,true)
                this.Showlegend('contentWeek',this.data_rt)
            },500)
        }
    }

    change_connect(res:any,idx:number){
        if (idx === 999) {
            this.connect.map(i => (i.value = res.value));
        } else {
            this.connect.map(i => (i.value = false));
            this.connect[idx].value = true;
        }
        this.connectTime = this.connect[idx].text;
        this.ConnectionPublic(res.text)
    }

    changeVirtual(res:any,idx:number){
        if (idx === 999) {
            this.VirtualDetail.map(i => (i.value = res.value));
        } else {
            this.VirtualDetail.map(i => (i.value = false));
            this.VirtualDetail[idx].value = true;
        }
        this.virtualTime = this.VirtualDetail[idx].text;

        this.IfdetailVir(res.text)
    }

    change(res:any,idx:number){
        if (idx === 999) {
            this.resources.map(i => (i.value = res.value));
        } else {
            this.resources.map(i => (i.value = false));
            this.resources[idx].value = true;
        }
        this.resourceUse = this.resources[idx].text;

        this.CpuDetail(res.text)
    }

    changeMemory(res:any,idx:number){
        if (idx === 999) {
            this.resources_memory.map(i => (i.value = res.value));
        } else {
            this.resources_memory.map(i => (i.value = false));
            this.resources_memory[idx].value = true;
        }
        this.resourcesMemory = this.resources_memory[idx].text;
        
        this.MemoryDetail(res.text)
    }

    changeSrotage(res:any,idx:number){
        if (idx === 999) {
            this.resources_storage.map(i => (i.value = res.value));
        } else {
            this.resources_storage.map(i => (i.value = false));
            this.resources_storage[idx].value = true;
        }
        this.resourcesStorage = this.resources_storage[idx].text;
        this.StorageDetail(res.text)
    }

    handleCancel() {
        this.isVisible = false;
    }
    handleOk() {
        this.isVisible = false;
    }

    ShowClick(){
        this.isVisible1 = false;
        this.detailed = false;
        this.memory = false;
        this.storage = false;
        this.virtual1 = false;
        this.loadDetail = false;
        this.healthDetail = false;
    }

    handleCancel1(): void {
        this.ShowClick()
    }

    handleOk1(): void {
        this.ShowClick()
    }

    Resources() {
        this.detailed = true;
        this.CpuDetail(this.resourceUse)
    }

    Memory() {
        this.memory = true;
        this.MemoryDetail(this.resourcesMemory)
    }

    Storage() {
        this.storage = true;
        this.StorageDetail(this.resourcesStorage)
    }

    ngAfterViewInit() {
        this.Showlegend('hourInternet',this.hoursoption)
        this.Showlegend('contentHour',this.data_connect)
        this.Showlegend('CPU',this.data_cpu)
        this.Showlegend('Memory',this.data_memory)
        setInterval(() => {
            this.newTimeWeek(1);
            let startTime = Date.parse(this.year + '-' + (this.month) + '-' + (this.day) + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            this.newTimeWeek(7)
            let startTimeWeek = Date.parse(this.year + '-' + (this.month) + '-' + (this.day) + ' ' + this.hour + ':' + this.minute + ':' + this.second)/1000;
            //网络带宽接口
            this.InternetData('minute','1','',this.hoursoption)
            this.InternetData('minute','10',startTime,this.dayoption)
            this.InternetData('minute','5',startTimeWeek,this.weekoption)

            // //虚机接口(目前只有连接数)
            this.VirtualData('minute','1','',this.data_connect)
            this.VirtualData('minute','10',startTime,this.data_qps)
            this.VirtualData('minute','5',startTimeWeek,this.data_rt)

            //负载接口
            this.LoadData('cpu','minute','1','',this.data_cpu)
            this.LoadData('memory','minute','1','',this.data_memory)
            this.LoadData('cpu','minute','10',startTime,this.data_cpuDay)
            this.LoadData('memory','minute','10',startTime,this.data_memoryDay)
            this.LoadData('cpu','minute','5',startTimeWeek,this.data_cpuWeek)
            this.LoadData('memory','minute','5',startTimeWeek,this.data_memoryWeek)
            
            setTimeout(() => {
                if(this.Internet == '最近一天'){
                    echarts.init(document.getElementById('dayInternet')).setOption(this.dayoption,true)
                }else if(this.Internet == '最近一小时'){
                    echarts.init(document.getElementById('hourInternet')).setOption(this.hoursoption,true)
                }else if(this.Internet == '最近一周'){
                    echarts.init(document.getElementById('weekInternet')).setOption(this.weekoption,true)
                }
                
                if(this.connectTime == '最近一天'){
                    echarts.init(document.getElementById('contentDay')).setOption(this.data_qps,true)
                }else if(this.connectTime == '最近一小时'){
                    echarts.init(document.getElementById('contentHour')).setOption(this.data_connect,true)
                }else if(this.connectTime == '最近一周'){
                    echarts.init(document.getElementById('contentWeek')).setOption(this.data_rt,true)
                }

                if(this.loadTime == '最近一天'){
                    echarts.init(document.getElementById('cpuDay')).setOption(this.data_cpuDay,true)
                    echarts.init(document.getElementById('MemoryDay')).setOption(this.data_memoryDay,true)
                }else if(this.loadTime == '最近一小时'){
                    echarts.init(document.getElementById('CPU')).setOption(this.data_cpu,true)
                    echarts.init(document.getElementById('Memory')).setOption(this.data_memory,true)
                }else if(this.loadTime == '最近一周'){
                    echarts.init(document.getElementById('cpuWeek')).setOption(this.data_cpuWeek,true)
                    echarts.init(document.getElementById('MemoryWeek')).setOption(this.data_memoryWeek,true)
                }
            },300)
        },300000)
        let input = fromEvent(document.querySelector('#inputDetail'),'input');
        input.pipe(debounceTime(500)).subscribe(e=>{
            this.blur()
        })
    }

    change_severalType() {
        // if (this.severalVirtualType === "lianjie_amount") {
        // } else if (this.severalVirtualType === "qps_amount") {
        // } else if (this.severalVirtualType === "rt_amount") {
        // }
    }

    click_health(text,idx) {
        this.healthDetail = true;
    }

    change_severalType_db() {
        if (this.severalBaseType === "qps_amount") {
            
        } else if (this.severalBaseType === "tps_amount") {
          
        }
    }

    _activeTab = 0;
    _tabChange(value: any) {
    }
}
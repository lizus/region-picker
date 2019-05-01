/** ---=*--*=*-=*-=-*-=* ^.^ *---=*--*=*-=*-=-*-=*
 * 省市县三联picker选择组件
 *
 * @author lizus.com
 * @updated 20190429
 *
 * @数据源 https://docs.alipay.com/isv/10327
 *
 * @使用范例：
    <region-picker bind:change="regionChange" province="浙江省" city="台州市" county="天台县"></region-picker>

 * @获取到的数据示例:
    e.detail={
        province:'浙江省',
        city:'台州市',
        county:'天台县'
    };
---=*--*=*-=*-=-*-=* ^.^ *---=*--*=*-=*-=-*-=* */
const area = require('./area');
const orz = require('./orz');
const areaArr=area.data;//省市县数据数组

/** provinces,cities,counties以数组的形式存储省市区数据，单位数组格式为[地方名称，地方名称在areaArr中的索引号] */
let provinces=[];//所有省,ready设定后不变
let cities=[];//城市数据，根据省的选择而变
let counties=[];//县区数据，根据市的选择而变

const matchProvince=orz.match(/([1-9]\d|\d[1-9])0000/);//省的编号特征
const matchCity=orz.match(/\d\d([1-9]\d|\d[1-9])00/);//市的编号特征
const matchCounty=orz.match(/\d\d\d\d([1-9]\d|\d[1-9])/);//县的编号特征
const notCounty=orz.not(matchCounty);

/** 用于获取某索引后符合fn条件的索引，fn为谓词函数 */
const getNextIndex=orz.curry(function (fn,index) {
    let n=areaArr.length;
    for (let i=index+1;i<n;i++) {
        if(fn(areaArr[i][0])) {
            n=i;
            break;
        }
    }
    return n;
});
const getNextCountyIndex=getNextIndex(notCounty);
const getNextCityIndex=getNextIndex(matchProvince);

/** 用于获取省市区各数据数组中的地区名称 */
const getName=function (arr,index) {
    if (index>=arr.length) return '';
    return arr[index][0];
};

/** 用于获取某数组中元素的索引号 */
const getIndex=orz.curry(function (arr,name) {
    let idx=Array.prototype.indexOf.call(arr,name);
    return (idx< 1) ? 0 : idx;
});

/** 用于获取省份数据，并传递给全局provinces，此函数只在ready中执行一次就可以了 */
const getProvinces=function () {
    let col=[];
    areaArr.forEach(function (item,index) {
        let num=item[0];
        let val=item[1];
        if(matchProvince(num)){
            provinces.push([val,index]);
            col.push(val);
        }
    });
    return col;
};
/**
 * 用于获取某一省份下市的数据，返回市名称的列表数组，同时重写全局cities数组
 * @param provinceIndex 省份在provinces数组中索引值
 * @returns {Array}
 */
const getCities=function (provinceIndex) {
    cities=[];
    let targetProvince=provinces[provinceIndex];
    let targetIndex=targetProvince[1];
    let nextIndex=getNextCityIndex(targetIndex);
    let col=[];
    for (let i=targetIndex;i<nextIndex;i++) {
        let item=areaArr[i];
        let num=item[0];
        let val=item[1];
        if(matchCity(num)){
            cities.push([val,i]);
            col.push(val);
        }
    }
    return col;
};
const getCounties=function (cityIndex) {
    counties=[];
    let targetCity=cities[cityIndex];
    let targetIndex=targetCity[1];
    let nextIndex=getNextCountyIndex(targetIndex);
    let col=[];
    for (let i=targetIndex+1;i<nextIndex;i++) {
        let item=areaArr[i];
        let val=item[1];
        counties.push([val,i]);
        col.push(val);
    }
    return col;
};

Component({
    properties:{
        province:{ type: String },
        city:{ type: String },
        county:{ type: String }
    },
    data:{
        province:'北京',//省
        city:'北京市',//市
        county:'东城区',//县区
        value:[0,0,0],//省，市,县在pickArr中的索引值
        pickArr:[[],[],[]]//省,市,县
    },
    methods:{
        colChange:function (e) {
            let col=e.detail.column;
            let val=e.detail.value;
            let pickArr=this.data.pickArr;
            let value=this.data.value;
            if (col==0) {//用户更换第一列数据，联动二三列，并重置二三列索引为0
                pickArr[1]=getCities(val);
                pickArr[2]=getCounties(0);
                value=[val,0,0];
                this.setData({
                    value:value
                });
            }
            if (col==1) {//用户更换第二列数据，联动第三列，并重置第三列索引为0
                pickArr[2]=getCounties(val);
                value[1]=val;
                value[2]=0;
                this.setData({
                    value:value
                });
            }
            this.setData({
                pickArr:pickArr,
            });
        },
        valChange:function (e) {
            let val=e.detail.value;
            let obj={
                province:getName(provinces,val[0]),
                city:getName(cities,val[1]),
                county:getName(counties,val[2])
            };
            this.setData(obj);
            this.triggerEvent('change',obj);
        },
    },
    ready: function () {
        let col1=getProvinces();
        let provinceIndex=getIndex(col1,this.data.province);
        let col2=getCities(provinceIndex);
        let cityIndex=getIndex(col2,this.data.city);
        let col3=getCounties(cityIndex);
        let countyIndex=getIndex(col3,this.data.county);
        let value=[provinceIndex,cityIndex,countyIndex];
        let pickArr=[col1,col2,col3];
        this.setData({
            pickArr:pickArr,
            value:value
        });
    }
});
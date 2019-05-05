# region-picker

## 说明

在微信小程序中使用的省市区联动选择器。微信小程序中内置有省市区联动选择器，但因为官方始终未公开具体的省市区数据，在实际项目中无法生成相应的列表使用。使得这一功能并不完善。

本插件使用蚂蚁金服的开放平台中公布的小程序服务区域文档：https://docs.alipay.com/isv/10327 重新制作了省市区联动选择器。有需要的用户可以根据文档，或area.js中提供的数据生成自己需要的区域列表。

## 布署

将region-picker文件夹整体放入小程序源码的components文件夹中，然后在需要使用的具体页面json文件中的`usingComponents`中引入即可。示例：

    "usingComponents": {
         "region-picker": "../../components/region-picker/region-picker"
     }

在页面的wxml文件中使用如下代码引入：

    <region-picker bind:change="regionChange" province="{{province}}" city="{{city}}" county="{{county}}"></region-picker>

在页面的js文件中使用类似如下代码处理区域选择事件： 

    page.regionChange=function (e) {
      that.setData({
        province:e.detail.province,
        city:e.detail.city,
        county:e.detail.county,
      });
    };

## 属性

`province` 设置选择器默认的省名称

`city` 设置选择器默认的市名称

`county` 设置选择器默认的区县名称

以上所有数据见area.js

## 方法

`bind:change` 中声明区域选择确定后的事件。调用后返回的e.detail中有三个数据：`province`,`city`,`county`分别对应省市区的名称

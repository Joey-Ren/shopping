/**
 * Created by Administrator on 2017/5/12.
 */
new Vue({

    /*模型*/
    data:{
        /*所有商品列表*/
        goodsList:[],
        /*记录是否为全选*/
        isSelectAll:false,
        /*当前总金额*/
        curTotal:0,
        /*记录当前是否弹出蒙版*/
        isShowPanner:false,
        /*当前要删除的商品*/
        curDelGoods:''

    },

    methods:{

        /**
         *
         * @param goods 当前的商品
         * @param type 类型，true为“+” false为“-”
         */
        singleCount(goods,type){
            if (type){ /*判断当前点击的是+ -*/
                goods.productQuentity++;
            }else {
                if (goods.productQuentity <= 1){
                    goods.productQuentity=1;
                    return;
                }
                goods.productQuentity--;
            };
            this.getTotalPrice();
        },

        /**
         * 点击全选
         */
        selectAll(){
            //1.把所有商品设置为选中状态
            this.goodsList.forEach((goods,key)=>{
                /*把商品设置为选中状态*/
                goods.checked = true;
            });
            //2.设置图标为选中状态
            this.isSelectAll = true;
            /*3.计算总金额*/
            this.getTotalPrice();
        },
        /*
        * 取消全选
        * */
        cancleSelAll(){
            //1.把所有商品设置为选中状态
            this.goodsList.forEach((goods,key)=>{
                /*把商品设置为选中状态*/
                goods.checked = false;
            });
            //2.设置图标为选中状态
            this.isSelectAll = false;
            /*3.计算总金额*/
            this.getTotalPrice();
        },

        /*单个商品状态点击
        * goods :当前点击的商品
        * */
        singleSel(goods){
            goods.checked = !goods.checked;

            /*默认所有都是全选*/
            let flag = true;
            /*判断当前是否为全选
            * 遍历所有商品，只要有一个不为选中状态，就把全选状态取消
            * */
            this.goodsList.forEach((goods,key)=>{
                if(goods.checked == false){
                    flag = false;
                }
            });
            /*设置全靠状态*/
            this.isSelectAll = flag;

            /*计算总金额*/
            this.getTotalPrice();

        },


        /*
        * 计算总金额
        * */
         getTotalPrice(){
            let total = 0;
            /*遍历所有的商品，把所有选中状态的商品总金额累加*/
             this.goodsList.forEach((goods,key)=>{
                 /*判断商品是否为选中状态*/
                 if(goods.checked == true){ /*如果为选中状态*/
                     /*金额累加*/
                     total += goods.productQuentity * goods.productPrice;
                 }
             });
             this.curTotal = total;
         },

         /*
         * 点击删除
         * */
        delGoods(goods){
            /*弹出蒙版*/
            this.isShowPanner = true;
            /*记录当前要删除的商品*/
            this.curDelGoods = goods;
        },
        isTrueDelete(isDel){
            if (isDel){
                //正在删除
                //获取当前商品在数组当中的位置
                let curIndex = this.goodsList.indexOf(this.curDelGoods);
                //删除商品
                this.goodsList.splice(curIndex,1);
            }
            /*取消蒙版*/
            this.isShowPanner = false;
        }

    },


    /*定义过滤器*/
    filters:{
      money(input){
          return "￥"+input.toFixed(2)+'元'
      }
    },

    mounted(){
        /*请求数据*/
        var url = "data/cart.json"
        this.$http.get(url).then(res=>{
            /*res.data.result.productList从json文件当中获取的列表*/
            this.goodsList = res.data.result.productList;
            /*在数据放到了模型当中，把模型的数据展示到视图当中*/

        },error=>{
            alert("请求数据失败");
        });
    }

}).$mount('#app');
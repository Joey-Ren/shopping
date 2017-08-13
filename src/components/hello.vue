<template>
  <div>
    <h1>{{gwc}}</h1>
    <div class="item-list-wrap">
      <div class="cart-item">
        <div class="cart-item-head">
          <ul>
            <li>商品信息</li>
            <li>商品金额</li>
            <li>商品数量</li>
            <li>总金额</li>
            <li>编辑</li>
          </ul>
        </div>
        <ul class="cart-item-list">
          <li v-for="(item,index) in productList">
            <div class="cart-tab-1">
              <div class="cart-item-check">
                <a href="javascript:void 0" class="item-check-btn" :class="{'check':item.checked}"
                   @click="selectedProduct(item)">
                  <svg class="icon icon-ok">
                    <use xlink:href="#icon-ok"></use>
                  </svg>
                </a>
              </div>
              <div class="cart-item-pic">
                <img :src="`static/${item.productImage}`" alt="烟">
                <!--<img src="../assets/goods-1.jpg.jpg" alt="烟">-->
              </div>
              <div class="cart-item-title">
                <div class="item-name">{{item.productName}}</div>
              </div>
              <div class="item-include">
                <dl>
                  <dt>赠送:</dt>
                  <dd v-for="patr in item.parts" v-text="patr.partsName"></dd>
                </dl>
              </div>
            </div>
            <div class="cart-tab-2">
              <div class="item-price">{{item.productPrice | money('元')}}</div>
            </div>
            <div class="cart-tab-3">
              <div class="item-quantity">
                <div class="select-self select-self-open">
                  <div class="quantity">
                    <a href="javascript:void 0" @click="changeMoney(item,-1)">-</a>
                    <input type="text" value="0" disabled v-model="item.productQuentity">
                    <a href="javascript:void 0" @click="changeMoney(item,1)">+</a>
                  </div>
                </div>
                <div class="item-stock">有货</div>
              </div>
            </div>
            <div class="cart-tab-4">
              <div class="item-price-total">{{item.productPrice * item.productQuentity | formatMoney}}</div>
            </div>
            <div class="cart-tab-5">
              <div class="cart-item-operation">
                <a href="javascript:void 0" class="item-edit-btn" @click="delConfirm(index)">P
                  <svg class="icon icon-del">
                    <use xlink:href="#icon-del"></use>
                  </svg>
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-foot-wrap">
      <div class="cart-foot-l">
        <div class="item-all-check">
          <a href="javascript:void 0">
            <span class="item-check-btn" :class="{'check':checkAllFlag}" @click="checkAll(true)">
              <svg class="icon icon-ok">
                <use xlink:href="#icon-ok"></use>
              </svg>
            </span>
            <span>全选</span>
          </a>
        </div>
        <div class="item-all-del">
          <a href="javascript:void 0" class="item-del-btn"  @click="checkAll(false)">
            <span>取消全选</span>
          </a>
        </div>
      </div>
      <div class="cart-foot-r">
        <div class="item-total">
          Item total:
          <span class="total-price">{{totalMoney}}</span>
        </div>
        <div class="next-btn-wrap">
          <a href="address.html" class="btn btn--red" style="width: 200px">结账</a>
        </div>
      </div>
    </div>
    <div class="md-modal modal-msg md-modal-transition" id="showModal" :class="{'md-show':delFlag}">
      <div class="md-modal-inner">
        <div class="md-top">
          <button class="md-close" @click="delFlag=false">关闭</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <p id="cusLanInfo">你确认删除此订单信息吗?</p>
          </div>
          <div class="btn-wrap col-2">
            <button class="btn btn--m" id="btnModalConfirm" @click="delProduct">Yes</button>
            <button class="btn btn--m btn--red" id="btnModalCancel" @click="delFlag=false">No</button>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="delFlag" @click="delFlag=false"></div>
  </div>
</template>
<script>
  import Vue from 'vue'
  export default {
    data() {
      return {
        gwc: '购物车',
        productList: [],
        totalMoney: 0,
        checkAllFlag: false,
        delFlag:false,
        curProduct:{},
        curItemIndex:0
      }
    },
    mounted () {
      this.$nextTick(() => {
        // 代码保证 this.$el 在 document 中
        this.cartView()
      })


    },
    methods: {
      cartView(){
        this.$http.get('http://localhost:8080/api/seller').then(res => {
          this.productList = res.data.data.result.list
          console.log(this.productList);
//          this.totalMoney = res.data.data.result.totalMoney

        })
      },
      changeMoney(item, way){
        if (way > 0) {
          item.productQuentity++

        } else {
          item.productQuentity--
          if (item.productQuentity < 1) {
            item.productQuentity = 1
          }
        }
        this.calcTotalPrice()
      },
      selectedProduct(item){
        if (typeof item.checked == 'undefined') {
          Vue.set(item, 'checked', true)//全局注册
          //this.$set(item,'checked',true) //局部注册
        } else {
          item.checked = !item.checked
        }
        this.calcTotalPrice()


      },
      checkAll(flag){
        this.checkAllFlag = flag
        var that = this
          this.productList.forEach(function (item, index) {
            if (typeof item.checked == 'undefined') {
              Vue.set(item, 'checked', that.checkAllFlag)//全局注册
              //this.$set(item,'checked',true) //局部注册
            } else {
              item.checked = that.checkAllFlag
            }
          })
        this.calcTotalPrice()
      },
      calcTotalPrice:function () {
        var that = this;
        that.totalMoney = 0
        this.productList.forEach(function (item, index) {
          if(item.checked){
              that.totalMoney+=item.productPrice * item.productQuentity
          }
        })


      },
      delConfirm(index){
          this.delFlag = true
          //this.curProduct = item //第一种方法从方法传入item, 然后在使用this.curProduct保存
        this.index = index
      },
      delProduct(){

      /*这里应该调用后台的API接口来实现删除*/
//          var index = this.productList.indexOf(this.curProduct)  this.productList.splice(index,1)第一种方法
        this.productList.splice(this.index,1)
        this.delFlag = false
        this.calcTotalPrice()

      }
    },
    filters: {
      formatMoney(value){
        return 'Y' + value.toFixed(2)
      }
    }
  }
</script>
<style>
  /*乱抄的
  */
  .cart-item {
    display: table;
    width: 100%;
  }

  .cart-item-head {
    display: table-header-group;
    width: 100%;
  }

  .cart-item-head ul {
    display: table-row;
    width: 100%;
  }

  .cart-item-head li {
    display: table-cell;
    height: 54px;
    line-height: 54px;
    background: #605F5F;
    color: #fff;
    font-size: 18px;
    text-align: center;
  }

  .cart-item-head li:nth-child(2),
  .cart-item-head li:nth-child(3),
  .cart-item-head li:nth-child(4),
  .cart-item-head li:nth-child(5) {
    width: 12%;
    padding: 0 10px;
  }

  .cart-item-list {
    display: table-row-group;
  }

  .cart-item-list > li {
    position: relative;
    display: table-row;
    padding: 36px 0;
  }

  .cart-item-list > li > div {
    position: relative;
    display: table-cell;
    text-align: center;
    vertical-align: top;
    border-bottom: 1px solid #e9e9e9;
  }

  .cart-item-list > li.disabled > div:after {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    width: 100%;
    height: 100%;
    background: rgba(96, 95, 95, 0.3);
    z-index: 5;
  }

  .cart-item-list .cart-tab-1 {
    min-height: 72px;
    padding: 36px 0;
    text-align: left;
    border-left: 1px solid #e9e9e9;
  }

  .cart-item-list .cart-tab-2 {
    padding-top: 64px;
  }

  .cart-item-list .cart-tab-3 {
    padding-top: 48px;
  }

  .cart-item-list .cart-tab-4 {
    padding-top: 64px;
  }

  .cart-item-list .cart-tab-5 {
    padding-top: 62px;
    border-right: 1px solid #e9e9e9;
  }

  .cart-item-list .cart-item-check {
    float: left;
    padding: 28px 0 28px 22px;
  }

  .cart-item-list .cart-item-pic {
    float: left;
    width: 80px;
    height: 72px;
    margin-left: 22px;
    border: 1px solid #e9e9e9;
  }

  .cart-item-list .cart-item-pic img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .cart-item-list .cart-item-title {
    min-height: 58px;
    padding: 0 20px 0 160px;
  }

  .cart-item-list .cart-item-title .item-name {
    margin: 2px 0 10px;
    line-height: 16px;
    color: #000;
  }

  .cart-item-list .cart-item-title .item-count-down .icon-clock {
    width: 14px;
    height: 14px;
    fill: #605F5F;
    vertical-align: middle;
  }

  .cart-item-list .cart-item-title .item-count-down .item-count-down-time {
    display: inline-block;
    height: 14px;
    line-height: 14px;
    padding: 0 5px;
    background: #f0f0f0;
    font-size: 12px;
    color: #605F5F;
  }

  .cart-item-list .item-include {
    position: relative;
    padding-left: 160px;
  }

  .cart-item-list .item-include dl {
    padding-right: 60px;
  }

  .cart-item-list .item-include dl dt {
    float: left;
    width: 65px;
  }

  .cart-item-list .item-include dl dd {
    margin-bottom: 13px;
    padding-left: 65px;
    color: #999;
  }

  .cart-item-list .item-include dl:after {
    visibility: hidden;
    display: block;
    content: " ";
    clear: both;
  }

  .cart-item-list .item-include .item-include-more {
    position: absolute;
    right: 10px;
    top: 0;
  }

  .cart-item-list .item-stock {
    margin-top: 5px;
    font-size: 12px;
    color: #999;
  }

  .cart-item-list .item-stock-no {
    color: #d1434a;
  }

  .cart-item-list .item-price-total {
    color: #d1434a;
  }

  .item-check-btn {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #ccc;
    border-radius: 50%;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
  }

  .item-check-btn .icon-ok {
    display: none;
    width: 100%;
    height: 100%;
    fill: #fff;
    -ms-transform: scale(0.8);
    transform: scale(0.8);
  }

  .item-check-btn.check {
    background: #EE7A23;
    border-color: #EE7A23;
  }

  .item-check-btn.check .icon-ok {
    display: inline-block;
  }

  .item-edit-btn {
    display: inline-block;
    width: 16px;
    height: 20px;
  }

  .item-edit-btn .icon-del {
    width: 100%;
    height: 100%;
    fill: #999;
  }

  .order-item .cart-item-list .cart-item-title,
  .order-item .cart-item-list .item-include {
    padding-left: 122px;
  }

  .order-item .select-self-area .select-ipt {
    padding: 0;
    text-align: center;
  }

  @media only screen and (max-width: 991px) {
    .cart-item {
      display: block;
      background: #f0f0f0;
    }

    .cart-item-head {
      display: none;
    }

    .cart-item-list {
      display: block;
    }

    .cart-item-list > li {
      position: relative;
      display: block;
      margin-bottom: 10px;
      padding: 0;
      background: #fff;
      border-top: 1px solid #e9e9e9;
      border-bottom: 1px solid #e9e9e9;
    }

    .cart-item-list > li > div {
      position: static;
      display: block;
      border: none;
    }

    .cart-item-list > li.disabled:after {
      position: absolute;
      top: 0;
      left: 0;
      content: "";
      width: 100%;
      height: 100%;
      background: rgba(96, 95, 95, 0.3);
      z-index: 5;
    }

    .cart-item-list > li.disabled > div:after {
      display: none;
    }

    .cart-item-list .cart-tab-1 {
      padding: 18px 0 0 0;
      border: none;
    }

    .cart-item-list .cart-tab-2 {
      display: none;
    }

    .cart-item-list .cart-tab-3 {
      float: left;
      width: 50%;
      padding: 8px 0 8px 10px;
      text-align: left;
    }

    .cart-item-list .cart-tab-4 {
      float: right;
      width: 50%;
      padding: 15px 10px 14px 0;
      text-align: right;
    }

    .cart-item-list .cart-tab-5 {
      clear: both;
      padding: 0;
    }

    .cart-item-list .cart-item-check {
      padding-left: 10px;
    }

    .cart-item-list .cart-item-pic {
      margin-left: 10px;
    }

    .cart-item-list .cart-item-title {
      height: 72px;
      padding: 0 10px 0 126px;
    }

    .cart-item-list .item-include {
      clear: both;
      margin-top: 10px;
      padding: 0 10px 0 36px;
      border-bottom: 1px solid #e9e9e9;
    }

    .cart-item-list .item-quantity > div {
      display: inline-block;
      margin-right: 3px;
      vertical-align: middle;
    }

    .cart-item-list .item-stock {
      margin-top: 0;
    }

    .cart-item-list .cart-item-opration {
      position: absolute;
      top: 60px;
      right: 10px;
    }

    .order-item .cart-item-list .cart-item-title {
      padding-left: 100px;
    }

    .order-item .cart-item-list .item-include {
      padding-left: 10px;
    }
  }

  .cart {
    padding: 69px 0 54px 0;
  }

  .cart-foot-wrap {
    height: 54px;
    line-height: 54px;
    margin-top: 18px;
  }

  .cart-foot-wrap .cart-foot-l {
    float: left;
    font-size: 16px;
    padding: 0 22px;
  }

  .cart-foot-wrap .item-all-check {
    float: left;
    color: #EE7A23;
  }

  .cart-foot-wrap .item-all-check .item-check-btn {
    margin-right: 18px;
  }

  .cart-foot-wrap .item-all-check span {
    vertical-align: middle;
  }

  .cart-foot-wrap .item-all-del {
    float: left;
    margin-top: 2px;
  }

  .cart-foot-wrap .cart-foot-r {
    float: right;
  }

  .cart-foot-wrap .item-total {
    float: left;
    margin-right: 31px;
    color: #605F5F;
    font-size: 18px;
  }

  .cart-foot-wrap .item-total .total-price {
    margin-left: 16px;
    color: #d1434a;
    font-family: "moderat", sans-serif;
  }

  .cart-foot-wrap .next-btn-wrap {
    float: right;
  }

  .cart-foot-wrap:after {
    visibility: hidden;
    display: block;
    content: " ";
    clear: both;
  }

  /** order confirm **/
  .checkout-order {
    padding: 69px 0 54px 0;
  }

  .confirm-item-list-wrap {
    margin-bottom: 124px;
  }

  .redeem-coupon-wrap {
    margin-bottom: 123px;
    text-align: center;
  }

  .redeem-coupon-wrap .text-redeem {
    width: 380px;
    height: 54px;
    line-height: 54px;
    margin-right: 16px;
    vertical-align: top;
  }

  .apply-promotion-wrap {
    margin-bottom: 124px;
  }

  .price-count-wrap {
    margin-bottom: 26px;
    padding-top: 62px;
    border-top: 1px solid #e9e9e9;
  }

  .order-foot-wrap .prev-btn-wrap {
    float: left;
  }

  .order-foot-wrap .next-btn-wrap {
    float: right;
  }

  .order-foot-wrap:after {
    visibility: hidden;
    display: block;
    content: " ";
    clear: both;
  }

  @media only screen and (max-width: 1280px) {
    .container {
      width: 100%;
    }
  }

  @media only screen and (max-width: 991px) {
    .cart {
      padding-top: 40px;
    }

    .cart-foot-wrap .cart-foot-l {
      padding: 0 10px;
    }
  }

  @media only screen and (max-width: 767px) {
    .checkout {
      background: #f0f0f0;
    }

    .checkout-title {
      margin: 0 10px 13px 10px;
    }

    .checkout-title span {
      font-size: 14px;
      background: #f0f0f0 !important;
    }

    .next-btn-wrap {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 101;
    }

    .next-btn-wrap .btn {
      display: block;
      width: 100%;
    }

    .checkout-addr .next-btn-wrap {
      padding: 0;
      border: none;
    }

    .cart, .checkout-order {
      padding-top: 13px;
    }

    .cart-foot-wrap {
      height: 42px;
      line-height: 42px;
      margin: 0;
    }

    .cart-foot-wrap .cart-foot-l {
      display: none;
    }

    .cart-foot-wrap .item-total {
      float: none;
      margin-right: 10px;
      font-size: 16px;
    }

    .confirm-item-list-wrap, .redeem-coupon-wrap, .apply-promotion-wrap {
      margin-bottom: 23px;
    }

    .redeem-coupon-wrap .redeem-coupon {
      margin: 0 10px;
    }

    .redeem-coupon-wrap .text-redeem {
      width: 100%;
      margin-bottom: 8px;
    }

    .redeem-coupon-wrap .btn {
      width: 100%;
    }

    .price-count-wrap {
      margin: 0;
      padding-top: 0;
      border: none;
    }

    .tee_tips_pop {
      display: none;
    }

    .order-foot-wrap .prev-btn-wrap {
      display: none;
    }

    .addr-list-wrap {
      padding-bottom: 23px;
    }
  }

  .md-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 535px;
    height: auto;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    visibility: hidden;
    z-index: 201;
  }

  .md-modal-transition.md-show .md-modal-inner {
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
    -webkit-transition: all .5s ease-out;
    transition: all .5s ease-out;
  }

  .md-modal-transition .md-modal-inner {
    background: #fff;
    -webkit-transform: translateY(20%);
    -ms-transform: translateY(20%);
    transform: translateY(20%);
    opacity: 0;
    -webkit-transition: all .3s ease-out;
    transition: all .3s ease-out;
  }

  .md-modal .md-modal-inner {
    padding: 60px 50px;
  }

  .md-modal .confirm-tips {
    min-height: 5.65em;
  }

  .md-modal .confirm-tips, .md-modal .alert-tips {
    font-size: 14px;
    font-weight: 200;
    text-align: center;
  }

  .md-modal .btn-wrap {
    margin-top: 20px;
    text-align: center;
    font-size: 0;
  }

  .md-modal .btn-wrap .btn {
    width: 45%;
    min-width: 80px;
    margin: 0 2.5%;
  }

  .md-modal .md-close {
    position: absolute;
    top: 7px;
    right: 7px;
    width: 34px;
    height: 34px;
    -webkit-transform: scale(0.5);
    -ms-transform: scale(0.5);
    transform: scale(0.5);
    text-indent: -8000px;
  }

  .md-modal .md-close:hover:before {
    -webkit-transform: rotate(-135deg);
    -ms-transform: rotate(-135deg);
    transform: rotate(-135deg);
  }

  .md-modal .md-close:hover:before, .md-modal .md-close:hover:after {
    -webkit-transition: -webkit-transform .3s ease-out;
    transition: -webkit-transform .3s ease-out;
    transition: transform .3s ease-out;
    transition: transform .3s ease-out, -webkit-transform .3s ease-out;
  }

  .md-modal .md-close:before {
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

  .md-modal .md-close:before, .md-modal .md-close:after {
    position: absolute;
    top: 16px;
    left: -4px;
    content: "";
    width: 44px;
    height: 3px;
    background: #605f5f;
    -webkit-transition: -webkit-transform .5s ease-out;
    transition: -webkit-transform .5s ease-out;
    transition: transform .5s ease-out;
    transition: transform .5s ease-out, -webkit-transform .5s ease-out;
  }

  .md-modal .md-close:hover:after {
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

  .md-modal .md-close:after {
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  .md-show {
    visibility: visible;
  }

  .md-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
  }

  .btn {
    display: inline-block;
    height: 54px;
    line-height: 54px;
    padding: 0 1.2em;
    text-align: center;
    font-size: 14px;
    font-family: "moderat", sans-serif;
    -webkit-transition: all .3s ease-out;
    transition: all .3s ease-out;
    border: 1px solid #d1434a;
    color: #d1434a;
    text-transform: uppercase;
    letter-spacing: .25em;
    white-space: nowrap;
  }

  .btn--m {
    height: 45px;
    line-height: 45px;
  }

  .btn--s {

    height: 30px;
    line-height: 30px;
  }

  input, select, button {
    vertical-align: middle;
  }

  .btn--m {
    height: 45px;
    line-height: 45px;
  }

  .btn--red {
    background-color: #d1434a;
    border-color: #d1434a;
    color: #fff;
  }

  .btn:hover, .btn[href]:hover {
    background-color: #d1434a;
    color: #fff;
    -webkit-transition: all .3s ease-out;
    transition: all .3s ease-out;
  }

  .btn--red:hover {
    background-color: #fff;
    color: #d1434a;
  }

  button {
    background: 0;
    border: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: inherit;
    cursor: pointer;
    font: inherit;
    line-height: inherit;
    overflow: visible;
    vertical-align: inherit;
  }

  .md-form-item {
    margin: 10px;
  }

  .md-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #48576a;
    line-height: 1;
    padding: 11px 12px 11px 0;
    box-sizing: border-box;
  }

  .md-form-item__content {
    line-height: 36px;
    position: relative;
    font-size: 14px;
  }

  .md-input__inner {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #333;
    box-sizing: border-box;
    color: #1f2d3d;
    display: block;
    font-size: inherit;
    height: 36px;
    line-height: 1;
    outline: 0;
    padding: 3px 10px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%;
  }

  .md-input__inner:focus {
    border-color: #20a0ff
  }
</style>



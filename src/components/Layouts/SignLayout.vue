<template>
  <div id="SignLayout" :class="['sign-layout-wrapper', isMobile && 'mobile']">
    <div class="container">

      <div class="top" v-if="isMobile">
        <div class="header">
          <a href="/">
            <span class="title">Vue Ant Admin</span>
          </a>
        </div>
        <div class="desc">
          牛逼plus 江北区最具影响力的 Web 后台管理系统
        </div>
      </div>

      <div  v-if="!isMobile" class="sign-layout-box">
        <div class="title"><span class="title">Vue Ant Admin</span> |  <span style="font-size: 14px;">牛逼plus 江北区最具影响力的 Web 后台管理系统</span></div>
        <div class="center">
          <img src="~@/assets/login/table_bg.png" alt="fdf">
          <div class="sheet">
            <router-view />
          </div>
        </div>
      </div>
      <div v-else >
        <router-view />
      </div>

      <div class="footer">
        <div class="links">
          <a href="_self">帮助</a>
          <a href="_self">隐私</a>
          <a href="_self">条款</a>
        </div>
        <div class="copyright">
          Copyright &copy; 2018 vueComponent
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { TOGGLE_MOBILE_TYPE } from '@/store/constants'

  export default {
    name: 'SignLayout',
    data() {
      return {
        // 是否手机模式
        isMobile: false,
        signLayoutBox: 'sign-layout-box'
      }
    },
    created () {
      const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      this.isMobile = !!flag
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    },
    mounted () {
      document.body.classList.add('SignLayout')
    },
    beforeDestroy () {
      document.body.classList.remove('SignLayout')
    }
  }
</script>

<style lang="less" scoped>
  #SignLayout.sign-layout-wrapper {
    height: 100%;
    background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
    background-size: 100%;

    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }

    .container {
      width: 100%;
      min-height: 100%;
      padding: 110px 0 144px;
      position: relative;

      a {
        text-decoration: none;
      }

      .top {
        text-align: center;

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, .85);
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .sign-layout-box {
        display: flex;
        flex-direction: column;
        width: 1014px;
        height: 669px;
        margin: auto;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 30px 0 0 30px;
        border-radius: 35px;
        background: rgba(250, 250, 250, 0.7);
        box-shadow: 0px 2px 14px 6px rgba(24, 144, 255, 0.2), -11px -4px 9px -16px rgba(24, 144, 255, 0.2);
        .title{
          font-size: 28px;
          width:100%;
          margin-left: 10px;
          color: #1890ff;
        }
        img{
          width:509px;
          height:497px;
        }
        .center{
          display: flex;
        }
        .sheet{
          margin: 90px 0 0 50px;
        }
        .main{
          width: 300px;
        }
      }

      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }

      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
  }
</style>

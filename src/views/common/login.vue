<template>
  <div class="main">
    <div class="login-title">登录管理后台</div>
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="账户或密码错误" />
          <a-form-item style="padding: 30px 0 0 0">
            <a-input
              size="large"
              type="text"
              autocomplete="on"
              placeholder="账户: admin"
              v-decorator="[
                'username',
                {rules: [{ required: true, message: '请输入帐户名或邮箱地址' }, { validator: 'required' }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              autocomplete="on"
              placeholder="密码: admin or ant.design"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>

      <a-form-item>
        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">自动登录</a-checkbox>
      </a-form-item>

      <a-form-item style="margin-top:50px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="loading"
          :disabled="loading"
        >登陆</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import md5 from 'md5'
  import { timeFix } from '@/utils'
  import { Form, Icon, Tabs, Input, Checkbox, Alert, Button, Notification } from 'ant-design-vue'
  export default {
    name: 'login',
    components: {
      AForm: Form,
      AFormItem: Form.Item,
      AIcon: Icon,
      AInput: Input,
      AInputPassword: Input.Password,
      ATabs: Tabs,
      AButton: Button,
      ACheckbox: Checkbox,
      AAlert: Alert,
      ATabPane: Tabs.TabPane
    },
    data () {
      return {
        classLoginChecking: '', // 登陆样式
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        isLoginError: false,
        loginForm: {
          username: 'admin',
          password: 'admin',
          captcha: '',
          captchaKey: ''
        },
        form: this.$form.createForm(this),
        loading: false
      }
    },
    created () {
      // this.requiredTwoStepCaptcha = true
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault()
        const {
          form: { validateFields }
        } = this
        const that = this
        that.classLoginChecking = 'checking'

        validateFields(['username', 'password'], { force: true }, (err, values) => {
          if (!err) {
            const loginParams = { ...values }
            delete loginParams.username
            loginParams.username = values.username
            loginParams.password = md5(values.password)
            that.$store
              .dispatch('Login', loginParams)
              .then((res) => this.loginSuccess(res))
              .catch(error => this.requestFailed(error))
              .finally(() => {
                that.loading = false
              })
          } else {
            setTimeout(() => {
              that.classLoginChecking = ''
            }, 1000)
          }
        })
      },
      loginSuccess (res) {
        this.$router.push({ path: '/' })
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          Notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        }, 1000)
        this.isLoginError = false
      },
      requestFailed (err) {
        this.isLoginError = true
        Notification.error({
          message: (err || {}).message || '错误',
          description: ((err || {}).result || {}).error || '请求出现错误，请稍后再试',
          duration: 4
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .main /deep/ .ant-input {
    border: none;
    outline: none;
    border-bottom: 1px solid #1890ff !important;
    box-shadow: none;
    background: transparent;
  }
  .login-title{
    width: 100%;
    text-align: center;
    font-size: 24px;
    color: #1890ff;
    margin-bottom:30px ;
  }
  .user-layout-login {
    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }
</style>

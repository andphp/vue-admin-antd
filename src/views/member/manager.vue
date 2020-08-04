<template>
  <div class="manager-container">
    <a-form-model layout="inline" :model="formSearch" @submit="handleSearch" @submit.native.prevent>
      <a-form-model-item>
        <a-input v-model="formSearch.username" allow-clear placeholder="用户名/手机号码">
          <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-button
          type="primary"
          html-type="submit"
          :disabled="formSearch.username === ''"
        >
          <a-icon type="search" /> 查询
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <a-divider />
    <div style="margin-bottom: 16px">
      <a-button-group class="btn-left">
        <a-button
          type="primary"
          @click="Reset"
          class="btn-left"
        >
          <a-icon type="rollback" /> 重置
        </a-button>
        <a-button type="primary" :loading="loading" @click="ReloadManagerList">
          <a-icon type="sync" /> 刷新
        </a-button>
      </a-button-group>
      <a-button-group class="btn-left">
        <a-button type="primary" @click="addManager">
          <a-icon type="user-add" /> 新增
        </a-button>
      </a-button-group>
      <a-button-group class="btn-left">
        <a-button @click="disableHandle" type="primary" :disabled="!hasSelected">
          <a-icon type="stop" /> 批量禁止
        </a-button>
        <a-button @click="deleteHandle" type="primary" :disabled="!hasSelected">
          <a-icon type="usergroup-delete" /> 批量删除
        </a-button>
        <a-button @click="resetPassword" type="primary" :disabled="!hasSelected">
          <a-icon type="team" /> 密码重置
        </a-button>
      </a-button-group>
    </div>
    <a-divider />
    <a-table
      :columns="columns"
      :data-source="listData"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      rowKey="userId"
    >
      <span slot="statusSlot" slot-scope="statusSlot">
        <a-tag
          :key="statusSlot"
          :color="statusSlot < 1 ? 'grey' : 'green'"
        >
          {{ statusSlot < 1 ? '禁用' : '正常' }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="row">
        <a @click="editManager(row)">修改</a>
        <a-divider type="vertical" />
        <a @click="disableHandle(row)"> 禁用  </a>
        <a-divider type="vertical" />
        <a @click="deleteHandle(row)"> 删除  </a>
      </span>
    </a-table>
    <!--   新增 / 编辑 管理员  -->
    <a-modal
      :title="messageAction"
      :visible="visible"
      :confirm-loading="confirmLoading"
      ok-text="确认"
      cancel-text="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model
        ref="ruleForm"
        :model="formData"
        :rules="formRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="username" label="用户名" prop="username">
          <a-input
            v-model="formData.username"
            @blur="
            () => {
              $refs.username.onFieldBlur();
            }"
          />
        </a-form-model-item>
        <a-form-model-item ref="email" label="邮箱">
          <a-input
            v-model="formData.email"
          />
        </a-form-model-item>
        <a-form-model-item ref="mobile" label="电话">
          <a-input
            v-model="formData.mobile"
          />
        </a-form-model-item>
        <a-form-model-item label="添加角色" prop="icon">
          <a-select
            mode="multiple"
            :value="formData.roleIdList"
            style="width: 100%"
            placeholder="Please select"
            @change="handleChangeRole"
          >
            <a-select-option v-for="role in roleList" :key="role.roleId">
              {{ role.roleName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import { Button, Icon, FormModel, Input, Divider, Table, Modal, Select, Tag } from 'ant-design-vue'
  import { getAdminList, saveAdmin, updateAdmin, getRoleList, getAdminRoleInfo, deleteAdmin, destroyAdmin, resetPassword } from '@/api/system'
  const columns = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId'
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '电话',
      dataIndex: 'mobile',
      key: 'mobile'
    },
    {
      title: '创建ID',
      dataIndex: 'createUserId',
      key: 'createUserId'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '100px',
      scopedSlots: { customRender: 'statusSlot' }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
  export default {
    name: 'manager',
    components: {
      AButton: Button,
      AButtonGroup: Button.Group,
      AIcon: Icon,
      AInput: Input,
      AFormModel: FormModel,
      AFormModelItem: FormModel.Item,
      ADivider: Divider,
      ATable: Table,
      AModal: Modal,
      ASelect: Select,
      ASelectOption: Select.Option,
      ATag: Tag
    },
    data() {
      return {
        columns,
        messageAction: '新增',
        formSearch: {
          username: ''
        },
        listData: [],
        pagination: {
          total: 0,
          pageSize: 10,
          current: 1,
          showSizeChanger: true
        },
        selectedRowKeys: [],
        loading: false,
        visible: false,
        roleList: [],
        // add or update
        confirmLoading: false,
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
        formData: {
          username: '',
          email: '',
          mobile: '',
          roleIdList: []
        },
        formRules: {
          username: [
            { required: true, message: '请输入 用户名', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      hasSelected() {
        return this.selectedRowKeys.length > 0
      }
    },
    created() {
      this.ReloadManagerList()
      this.GetRoleList()
    },
    methods: {
      Reset() {
        Object.assign(this.$data.formSearch, this.$options.data().formSearch)
      },
      handleSearch() {
        this.loading = true
        getAdminList(this.formSearch).then(response => {
          const result = response.result
          this.listData = result.list
          const pagination = { ...this.pagination }
          pagination.total = result.totalCount
          pagination.pageSize = result.pageSize
          pagination.current = result.currPage
          pagination.showSizeChanger = true
          this.pagination = pagination
        }).catch(error => {
          console.log('getAdminList-error', error)
        }).finally(() => {
          this.loading = false
          this.selectedRowKeys = []
        })
      },
      ReloadManagerList(e) {
        this.handleSearch()
      },
      GetRoleList() {
        getRoleList({ page: 1, limit: 1000 }).then(response => {
          const result = response.result
          this.roleList = result.list
        }).catch(error => {
          console.log('ReloadRoleList-error', error)
        })
      },
      addManager() {
        if (typeof this.formData.userId !== 'undefined') {
          this.$delete(this.formData, 'userId')
        }
        this.formData.username = ''
        this.formData.email = ''
        this.formData.mobile = ''
        this.formData.roleIdList = []
        this.visible = true
        this.messageAction = '新增'
      },
      editManager(row) {
        console.log('editManager')
        this.formData.username = row.username
        this.formData.email = row.email
        this.formData.mobile = row.mobile
        this.formData.userId = row.userId
        getAdminRoleInfo({ userId: row.userId }).then(response => {
          this.formData.roleIdList = response.result
        }).catch(error => {
          this.formData.roleIdList = []
            console.log('getUserRoleInfo-error', error)
        })
        this.visible = true
        this.messageAction = '编辑'
      },
      disableHandle(row) {
        const ids = row.userId ? [row.userId] : this.selectedRowKeys
        const _this = this
        _this.$modal.confirm({
          title: '你真的确认要禁用它（们）吗？',
          content: 'ID:' + JSON.stringify(ids),
          okText: '确认',
          cancelText: '取消',
          onOk() {
            destroyAdmin(ids).then(response => {
              _this.$message.info('成功禁用用户ID:' + JSON.stringify(ids))
              _this.ReloadManagerList()
            })
          },
          onCancel() {}
        })
      },
      deleteHandle(row) {
        const ids = row.userId ? [row.userId] : this.selectedRowKeys
        const _this = this
        _this.$modal.confirm({
          title: '你真的确认要删除它（们）吗？',
          content: 'ID:' + JSON.stringify(ids),
          okText: '确认',
          cancelText: '取消',
          onOk() {
            deleteAdmin(ids).then(response => {
              _this.$message.info('成功删除用户ID:' + JSON.stringify(ids))
              _this.ReloadManagerList()
            })
          },
          onCancel() {}
        })
      },
      resetPassword(row) {
        const ids = row.userId ? [row.userId] : this.selectedRowKeys
        const _this = this
        _this.$modal.confirm({
          title: '你真的确认要重置它（们）密码吗？',
          content: 'ID:' + JSON.stringify(ids),
          okText: '确认',
          cancelText: '取消',
          onOk() {
            resetPassword(ids).then(response => {
              _this.$message.info('成功重置密码用户ID:' + JSON.stringify(ids))
              _this.ReloadManagerList()
            })
          },
          onCancel() {}
        })
      },
      handleTableChange(pagination) {
        console.log('pagination', pagination)
        this.formSearch.page = pagination.current
        this.formSearch.limit = pagination.pageSize
        this.handleSearch()
      },
      onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        this.selectedRowKeys = selectedRowKeys
      },
      handleCancel(e) {
        this.visible = false
      },
      handleOk(e) {
        this.confirmLoading = true
        if (this.messageAction === '新增') {
          saveAdmin(this.formData).then(response => {
            this.$message.info(this.messageAction + '管理员信息成功')
          }).catch(error => {
            console.log('saveAdmin-error', error)
          }).finally(() => {
            this.visible = false
            this.confirmLoading = false
            this.ReloadManagerList()
          })
        } else {
          updateAdmin(this.formData).then(response => {
            this.$message.info(this.messageAction + '管理员信息成功')
          }).catch(error => {
            console.log('updateAdmin-error', error)
          }).finally(() => {
            this.visible = false
            this.confirmLoading = false
            this.ReloadManagerList()
          })
        }
      },
      handleChangeRole(e) {
        this.formData.roleIdList = e
      }
    }
  }
</script>

<style scoped>
  .btn-left {
    margin-left: 2px;
  }
</style>

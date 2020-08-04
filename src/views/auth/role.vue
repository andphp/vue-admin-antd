<template>
  <div class="role-container">
    <a-form-model layout="inline" :model="formSearch" @submit="handleSearch" @submit.native.prevent>
      <a-form-model-item>
        <a-input v-model="formSearch.roleName" allow-clear placeholder="角色名称">
          <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-button
          type="primary"
          html-type="submit"
          :disabled="formSearch.roleName === ''"
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
        <a-button type="primary" :loading="loading" @click="ReloadRoleList">
          <a-icon type="sync" /> 刷新
        </a-button>
      </a-button-group>
      <a-button-group class="btn-left">
        <a-button type="primary" @click="addRole">
          <a-icon type="user-add" /> 新增
        </a-button>
        <a-button @click="deleteHandle" type="primary" :disabled="!hasSelected">
          <a-icon type="delete" /> 批量删除
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
      rowKey="roleId"
    >
      <span slot="action" slot-scope="row">
        <a @click="editRole(row)">修改</a>
        <a-divider type="vertical" />
        <a @click="deleteHandle(row)"> 删除  </a>
      </span>
    </a-table>
    <!--   新增 / 编辑 角色、权限分配  -->
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
        <a-form-model-item ref="roleName" label="角色名称" prop="roleName">
          <a-input
            v-model="formData.roleName"
            @blur="
            () => {
              $refs.roleName.onFieldBlur();
            }"
          />
        </a-form-model-item>
        <a-form-model-item ref="remark" label="备注/描述">
          <a-input
            v-model="formData.remark"
          />
        </a-form-model-item>
        <a-form-model-item label="角色授权">
          <a-tree-select
            v-model="formData.menuIdList"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            placeholder="Please select"
            tree-checkable
            multiple
            allow-clear
            :show-checked-strategy="SHOW_ALL"
          >
          </a-tree-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import { Button, Icon, FormModel, Input, Divider, Table, Modal, TreeSelect } from 'ant-design-vue'
  import { getRoleList, getMenuRoleList, getRoleMenuInfo, saveRole, updateRole, deleteRole } from '@/api/system'

  const columns = [
    {
      title: 'ID',
      dataIndex: 'roleId',
      key: 'roleId'
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
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

  const SHOW_ALL = TreeSelect.SHOW_ALL
  export default {
    name: 'role',
    data() {
      return {
        formSearch: {
          roleName: ''
        },
        columns,
        listData: [],
        pagination: {
          total: 0,
          pageSize: 10,
          current: 1,
          showSizeChanger: true
        },
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        visible: false,
        confirmLoading: false,
        // add or update
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
        formData: {
          roleName: '',
          remark: '',
          menuIdList: []
        },
        formRules: {
          roleName: [
            { required: true, message: '请输入 角色名称', trigger: 'blur' }
          ]
        },
        treeData: [],
        SHOW_ALL,
        messageAction: '新增'
      }
    },
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
      ATreeSelect: TreeSelect
    },
    created() {
      this.ReloadRoleList()
      this.$nextTick(() => {
        this.LoadMenuList()
      })
    },
    computed: {
      hasSelected() {
        return this.selectedRowKeys.length > 0
      }
    },
    methods: {
      Reset() {
        Object.assign(this.$data.formSearch, this.$options.data().formSearch)
      },
      LoadMenuList() {
        getMenuRoleList().then(response => {
          this.treeData = response.result
        }).catch(error => {
          console.log('LoadMenuList-error', error)
        })
      },
      ReloadRoleList(e) {
        this.handleSearch()
      },
      handleSearch() {
        this.loading = true
        getRoleList(this.formSearch).then(response => {
          const result = response.result
          this.listData = result.list
          const pagination = { ...this.pagination }
          pagination.total = result.totalCount
          pagination.pageSize = result.pageSize
          pagination.current = result.currPage
          pagination.showSizeChanger = true
          this.pagination = pagination
        }).catch(error => {
          console.log('ReloadRoleList-error', error)
        }).finally(() => {
          this.loading = false
          this.selectedRowKeys = []
        })
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
          saveRole(this.formData).then(response => {
            this.$message.info(this.messageAction + '角色信息成功')
          }).catch(error => {
            console.log('getRoleUpdate-error', error)
          }).finally(() => {
            this.visible = false
            this.confirmLoading = false
            this.ReloadRoleList()
          })
        } else {
          updateRole(this.formData).then(response => {
            this.$message.info(this.messageAction + '角色信息成功')
          }).catch(error => {
            console.log('getRoleUpdate-error', error)
          }).finally(() => {
            this.visible = false
            this.confirmLoading = false
            this.ReloadRoleList()
          })
        }
      },
      editRole(row) {
        getRoleMenuInfo({ roleId: row.roleId }).then(response => {
          const result = response.result
          this.formData.menuIdList = result.menuIdList
        })
        this.formData.roleId = row.roleId
        this.formData.remark = row.remark
        this.formData.roleName = row.roleName
        this.visible = true
        this.messageAction = '编辑'
      },
      addRole() {
        if (typeof this.formData.roleId !== 'undefined') {
          this.$delete(this.formData, 'roleId')
        }
        this.formData.remark = ''
        this.formData.roleName = ''
        this.formData.menuIdList = []
        this.visible = true
        this.messageAction = '新增'
      },
      deleteHandle(row) {
        const ids = row.roleId ? [row.roleId] : this.selectedRowKeys
        const _this = this
        _this.$modal.confirm({
          title: '你真的确认要删除它（们）吗？',
          content: 'ID:' + JSON.stringify(ids),
          okText: '确认',
          cancelText: '取消',
          onOk() {
            deleteRole(ids).then(response => {
              _this.$message.info('成功删除角色ID:' + JSON.stringify(ids))
              _this.ReloadRoleList()
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
      }
    }
  }
</script>

<style scoped>
.btn-left {
  margin-left: 2px;
}
</style>

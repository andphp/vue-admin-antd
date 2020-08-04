<template>
  <div class="menu-container">
    <div style="margin-bottom: 16px">
      <a-button-group class="btn-left">
        <a-button type="primary" :loading="loading" @click="LoadMenuList">
          <a-icon type="sync" /> 刷新
        </a-button>
      </a-button-group>
      <a-button-group class="btn-left">
        <a-button type="primary" @click="addMenu">
          <a-icon type="user-add" /> 新增
        </a-button>
      </a-button-group>
    </div>
    <a-divider />
    <a-table
      :columns="columns"
      :data-source="listData"
      :bordered="true"
      :pagination="false"
      :defaultExpandAllRows="true"
      :loading="loading"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      rowKey="menuId"
    >
      <span slot="iconSlot" slot-scope="iconSlot">
        <icon-font :style="{ fontSize: '20px', color: '#08c' }" :name="iconSlot || 'icon-zhedie'" />
      </span>
      <span slot="typeSlot" slot-scope="typeSlot">
      <a-tag
        :key="typeSlot"
        :color="typeSlot < 1 ? 'grey' : typeSlot < 2 ? 'volcano' : typeSlot < 3 ? 'geekblue' : 'green'"
      >
        {{ typeSlot < 1 ? '顶级目录' : typeSlot < 2 ? '二级菜单' : typeSlot < 3 ? '操作按钮' : '跳转链接' }}
      </a-tag>
    </span>
      <span slot="action" slot-scope="row">
        <a @click="editMenu(row)">修改</a>
        <a-divider type="vertical" />
        <a @click="deleteHandle(row)"> 删除  </a>
      </span>
    </a-table>
    <!--  新增 / 编辑 菜单  -->
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
        <a-form-model-item ref="type" label="类型" prop="type">
          <a-radio-group v-model="formData.type">
            <a-radio-button v-for="(type, index) in typeList" :label="index" :key="index" :value="index">
              {{ type }}
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="name" label="菜单名称" prop="roleName">
          <a-input
            v-model="formData.name"
            @blur="
            () => {
              $refs.name.onFieldBlur();
            }"
          />
        </a-form-model-item>
        <a-form-model-item label="上级菜单">
          <a-tree-select
            v-model="formData.parentId"
            show-search
            style="width: 100%"
            :tree-data="treeData"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="Please select"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item v-if="formData.type === 1" label="菜单路由" prop="url">
          <a-input v-model="formData.url" placeholder="菜单路由"></a-input>
        </a-form-model-item>
        <a-form-model-item v-if="formData.type !== 0" label="授权标识" prop="perms">
          <a-input v-model="formData.perms" placeholder="多个用逗号分隔, 如: user:list,user:create"></a-input>
        </a-form-model-item>
        <a-form-model-item v-if="formData.type !== 2" label="排序号" prop="orderNum">
          <a-input-number v-model="formData.orderNum" :min="0" label="排序号"></a-input-number>
        </a-form-model-item>
        <a-form-model-item v-if="formData.type !== 2" label="菜单图标" prop="icon">
          <a-popover v-model="popoverVisible" :overlayStyle="{ width: '500px'}" placement="bottom" trigger="click">
            <template slot="content">
              <a-button
                v-if="iconList.length > 0"
                v-for="(item, index) in iconList"
                :type="formData.icon === item ? 'primary' : 'dashed'"
                :key="index"
                @click="iconActiveHandle(item)"
                :ghost="formData.icon === item"
              >
                <icon-font :name="item" />
              </a-button>
            </template>
            <template slot="title">
              <span>全站推荐使用SVG Sprite</span>
            </template>
            <a-input v-model="formData.icon" placeholder="菜单图标名称"></a-input>
          </a-popover>
        </a-form-model-item>
        <a-form-model-item v-if="formData.type === 3"  ref="redirect" label="跳转地址">
          <a-input
            v-model="formData.redirect"
          />
        </a-form-model-item>
        <a-form-model-item ref="description" label="备注/描述">
          <a-input
            v-model="formData.description"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import { Button, Icon, FormModel, Input, InputNumber, Divider, Table, Modal, TreeSelect, Tag, Radio, Popover } from 'ant-design-vue'
  import { getMenuList, getMenuSelectList, deleteMenu, saveMenu, updateMenu } from '@/api/system'
  import IconFont from '@/components/iconSvg/index.vue'
  import Icons from '@/icon'
  import { treeDataTranslateTable, treeDataTranslateSelect } from '@/utils/index'
  const columns = [
    {
      title: 'ID',
      dataIndex: 'menuId',
      width: '200px',
      key: 'menuId'
    },
    {
      title: '菜单名称',
      dataIndex: 'name',
      width: '120px',
      key: 'name'
    },
    {
      title: '上级菜单',
      dataIndex: 'parentName',
      width: '120px',
      key: 'parentName'
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      align: 'center',
      width: '80px',
      scopedSlots: { customRender: 'iconSlot' }
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: '100px',
      scopedSlots: { customRender: 'typeSlot' }
    },
    {
      title: '排序号',
      dataIndex: 'orderNum',
      width: '100px',
      key: 'orderNum'
    },
    {
      title: 'Url',
      dataIndex: 'url',
      key: 'url'
    },
    {
      title: '跳转链接',
      dataIndex: 'redirect',
      key: 'redirect'
    },
    {
      title: '授权标识',
      dataIndex: 'perms',
      width: '300px',
      key: 'perms'
    },
    {
      title: '备注/描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 120,
      scopedSlots: { customRender: 'action' }
    }
  ]
  export default {
    name: 'menuManager',
    data() {
      return {
        columns,
        listData: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        visible: false,
        confirmLoading: false,
        // add or update
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
        iconList: [],
        popoverVisible: false,
        typeList: ['目录', '菜单', '按钮', '链接'],
        messageAction: '新增',
        treeData: [],
        formData: {
          name: '',
          parentId: 0,
          type: 0,
          perms: '',
          orderNum: 1,
          icon: '',
          redirect: ''
        },
        formRules: {
          name: [
            { required: true, message: '请输入 菜单名称', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      IconFont,
      AButton: Button,
      AButtonGroup: Button.Group,
      AIcon: Icon,
      AInput: Input,
      AInputNumber: InputNumber,
      AFormModel: FormModel,
      AFormModelItem: FormModel.Item,
      ADivider: Divider,
      ATable: Table,
      AModal: Modal,
      ATreeSelect: TreeSelect,
      ATag: Tag,
      ARadio: Radio,
      ARadioGroup: Radio.Group,
      ARadioButton: Radio.Button,
      APopover: Popover
    },
    computed: {
      hasSelected() {
        return this.selectedRowKeys.length > 0
      }
    },
    created() {
      this.iconList = Icons.getNameList()
      this.$nextTick(() => {
        this.LoadMenuList()
        this.LoadMenuSelectList()
      })
    },
    methods: {
      LoadMenuList() {
        this.loading = true
        getMenuList().then(response => {
          this.listData = treeDataTranslateTable(response.result, 'menuId')
        }).catch(error => {
          console.log('LoadMenuList-error', error)
        }).finally(() => {
          this.loading = false
          this.selectedRowKeys = []
        })
      },
      LoadMenuSelectList() {
        getMenuSelectList().then(response => {
          this.treeData = treeDataTranslateSelect(response.result, 'menuId', 'parentId', 'name')
        }).catch(error => {
          console.log('LoadMenuSelectList-error', error)
        })
      },
      onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        this.selectedRowKeys = selectedRowKeys
      },
      deleteHandle(row) {
        const _this = this
        _this.$modal.confirm({
          title: '你真的确认要删除「 ' + row.parentName + '=>' + row.name + '」吗？',
          content: 'ID:' + JSON.stringify(row.menuId),
          okText: '确认',
          cancelText: '取消',
          onOk() {
            deleteMenu({ id: row.menuId }).then(response => {
              _this.$message.info('成功删除菜单ID:' + JSON.stringify(row.menuId))
              _this.LoadMenuList()
            }).catch(error => {
              console.log('deleteMenu-error', error)
            })
          },
          onCancel() {}
        })
      },
      addMenu() {
        if (typeof this.formData.menuId !== 'undefined') {
          this.$delete(this.formData, 'menuId')
        }
        this.formData.name = ''
        this.formData.parentId = ''
        this.formData.description = ''
        this.formData.icon = ''
        this.formData.menuId = ''
        this.formData.orderNum = 1
        this.formData.perms = ''
        this.formData.type = 0
        this.formData.url = ''
        this.visible = true
        this.messageAction = '新增'
      },
      editMenu(row) {
        this.formData.name = row.name
        this.formData.parentId = row.parentId
        this.formData.description = row.description
        this.formData.icon = row.icon
        this.formData.menuId = row.menuId
        this.formData.orderNum = row.orderNum
        this.formData.perms = row.perms
        this.formData.type = row.type
        this.formData.url = row.url
        this.formData.redirect = row.redirect
        this.visible = true
        this.messageAction = '编辑'
      },
      handleCancel(e) {
        this.visible = false
      },
      handleOk(e) {
        this.confirmLoading = true
        if (this.messageAction === '新增') {
          saveMenu(this.formData).then(response => {
            this.$message.info(this.messageAction + '菜单信息成功')
          }).catch(error => {
            console.log('saveMenu-error', error)
          }).finally(() => {
            this.visible = false
            this.confirmLoading = false
            this.LoadMenuList()
            this.LoadMenuSelectList()
          })
        } else {
          updateMenu(this.formData).then(response => {
            this.$message.info(this.messageAction + '菜单信息成功')
          }).catch(error => {
            console.log('updateMenu-error', error)
          }).finally(() => {
            this.visible = false
            this.confirmLoading = false
            this.LoadMenuList()
            this.LoadMenuSelectList()
          })
        }
      },
      // 图标选中
      iconActiveHandle (iconName) {
        this.formData.icon = iconName
        this.popoverVisible = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .btn-left {
    margin-left: 2px;
  }
</style>

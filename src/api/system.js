import request from '@/utils/request'

export function getInfo(token) { return request({ url: '/admin/info', method: 'get', params: { token } }) }
// <!-------------------------- 角色管理 start ------------------------>
// 角色列表
export function getRoleList(params) { return request({ url: '/role/list', method: 'get', params: params }) }
// 根据角色id 获取 角色权限信息
export function getRoleMenuInfo(params) { return request({ url: '/role/menu', method: 'get', params: params }) }
// 新增 角色
export function saveRole(params) { return request({ url: '/role/save', method: 'post', data: params }) }
// 更新 角色
export function updateRole(params) { return request({ url: '/role/update', method: 'post', data: params }) }
// 获取角色=》选择菜单列表
export function getMenuRoleList() { return request({ url: '/role/select', method: 'get' }) }
// 删除 角色
export function deleteRole(params) { return request({ url: '/role/delete', method: 'post', data: params }) }

// <!-------------------------- 菜单管理 start ------------------------>
// 菜单列表
export function getMenuList(params) { return request({ url: '/menu/list', method: 'get', params: params }) }
// 菜单选择列表
export function getMenuSelectList(params) { return request({ url: '/menu/select', method: 'get', params: params }) }
// 删除 菜单
export function deleteMenu(params) { return request({ url: '/menu/delete', method: 'post', data: params }) }
// 新增 菜单
export function saveMenu(params) { return request({ url: '/menu/save', method: 'post', data: params }) }
// 更新 菜单
export function updateMenu(params) { return request({ url: '/menu/update', method: 'post', data: params }) }

// <!-------------------------- 系统管理员管理 start ------------------------>
// 管理员列表
export function getAdminList(params) { return request({ url: '/admin/list', method: 'get', params: params }) }
// 管理员角色
export function getAdminRoleInfo(params) { return request({ url: '/admin/role', method: 'get', params: params }) }
// 新增 管理员
export function saveAdmin(params) { return request({ url: '/admin/save', method: 'post', data: params }) }
// 更新 管理员
export function updateAdmin(params) { return request({ url: '/admin/update', method: 'post', data: params }) }
// 删除 菜单
export function deleteAdmin(params) { return request({ url: '/admin/delete', method: 'post', data: params }) }
// 删除 菜单
export function destroyAdmin(params) { return request({ url: '/admin/destroy', method: 'post', data: params }) }
// 重置 密码
export function resetPassword(params) { return request({ url: '/admin/reset_password', method: 'post', data: params }) }

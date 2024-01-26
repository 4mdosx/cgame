
export const common = [{
  id: 'common_b_1',
  type: 'building',
  schema: 'bonfire',
}, {
  id: 'common_b_2',
  type: 'building',
  schema: 'workbench',
}, {
  id: 'common_s_1',
  type: 'research',
  schema: 'feature/application',
  data: {
    label: '功能：应用程序',
    action: '解锁'
  },
}]

export const application = [{
  id: 'application_s_1',
  type: 'research',
  schema: 'app/automator',
  data: {
    label: '应用程序：automator',
    action: '下载'
  },
}]

export const category = [{
    id: 'common',
    name: '常识',
    description: '常识是最不常见的东西',
  },
  {
    id: 'tools',
    name: '工具'
  },
  {
    id: 'contemporary_magic',
    name: '简明易懂的当代魔法',
  },
  {
    id: 'cyberia_key',
    name: '赛博利亚的钥匙'
  },
  {
    id: 'application',
    name: '应用程序'
  }
]

export const proposals = {
  common,
}

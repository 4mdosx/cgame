# 游戏模块

模块按功能组织

## 状态
inventory, 库存，集中处理所有玩家已拥有的物品数据
home, 已拥有建筑，家园地块，建筑运行状态
world, 大地图地块状态
character, 角色，已装备物品，状态，及位置信息
task，事件中心

## 工作流/task

### 任务队列

调用，task模块，对任务队列，创建任务
每个tick, character, 更新一次任务进度 step
每个tick, 检查任务进度，任务完成，删除任务，分发任务结束副作用
task 完成后，dispatch 新的 action，type 为 'inventory/*'，'home/*' 等，完成副作用

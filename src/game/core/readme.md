# 游戏模块

模块按功能组织

## 状态
inventory, 库存，集中处理所有玩家已拥有的物品数据
home, 已拥有建筑，家园地块，建筑运行状态
world, 大地图地块状态
character, 角色，已装备物品，状态，及位置信息

## 行为
task，事件中心, 对象在任务中进行实例化
system, 根据 keywords 执行流程脚本

## 数据流程
1. UI 界面上的各种动作，都会触发一个 action，type 为 'task/*'
2. task 模块接收到 action 后，Task 对象会包含该任务的副作用，比如消耗材料，增加建筑等
3. task 完成后，dispatch 新的 action，type 为 'inventory/*'，'home/*' 等，完成副作用
4. 副作用完成后 system 模块添加 keywords, system 模块根据 keywords 执行流程脚本，更新状态

## 工作流/task

### 建造流程 
```
{
 type: 'task/building'
 buildingName: 'buildingName'
}
```

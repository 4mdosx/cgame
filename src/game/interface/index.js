import { getContext } from '@/game/utils'

export function doProposal (proposalId) {
  return getContext().modules.task.doProposal(proposalId)
}

export function getGameStatus (key) {
  return getContext().modules.system.get(key)
}

export function buildingIsExist (schemaName) {
  return getGameStatus('building/' + schemaName)
}

export function getBuilding (schemaName) {
  return getContext().modules.home.buildings.find(building => building.data.name === schemaName)
}


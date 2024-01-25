export function getContext () {
  return globalThis.game
}

export function dispatch (action) {
  return getContext().dispatch(action)
}

export function acceptProposal (proposalId) {
  return dispatch({
    type: 'inventory/proposal/accept',
    proposalId
  })
}

export function getGameStatus (key) {
  return getContext().system.get(key)
}

export function buildingIsExist (schemaName) {
  return getGameStatus('building/' + schemaName)
}

export function getBuilding (schemaName) {
  return getContext().modules.home.buildings.find(building => building.data.name === schemaName)
}

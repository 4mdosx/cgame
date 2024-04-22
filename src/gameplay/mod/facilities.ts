
export const ap = {
  sud: {
    name: 'Supply Depot',
    description: 'A supply depot provides storage for resources.',
    cost: 1,
    effect: [{
      type: 'supply',
      resource: 'fertility',
      value: 1
    }, {
      type: 'area_used',
      value: 1
    }]
  },
  sop:{
    name: 'Solar Panel',
    description: 'A solar panel generates solar energy.',
    cost: 2,
    effect: [{
      type: 'energy',
      resource: 'solar',
      value: 1
    }, {
      type: 'area_used',
      value: 1
    }, {
      type: 'supply_used',
      value: 1
    }]
  },
  mref: {
    name: 'Mineral Refinery',
    description: 'A mineral refinery generates mineral resources.',
    cost: 2,
    effect: [{
      type: 'economy',
      value: 1
    }, {
      type: 'build',
      resource: 'mineral',
      value: 1
    }, {
      type: 'industrial',
      resource: 'mineral',
      value: 1
    }, {
      type: 'energy_used',
      value: 1
    },{
      type: 'supply_used',
      value: 1
    }, {
      type: 'area_used',
      value: 1
    }]
  },
  cref: {
    name: 'Crystal Refinery',
    description: 'A crystal refinery generates ether resources.',
    cost: 2,
    effect: [{
      type: 'economy',
      resource: 'ether',
      value: 1
    }, {
      type: 'intelligence',
      value: 2
    }, {
      type: 'energy_used',
      value: 1
    },{
      type: 'supply_used',
      value: 1
    }, {
      type: 'area_used',
      value: 1
    }]
  },
  zlib: {
    name: 'Zs library',
    description: 'A daunting library where ether is transformed into knowledge',
    cost: 6,
    effect: [{
      type: 'intelligence',
      resource: 'ether',
      value: 3
    }, {
      type: 'energy_used',
      value: 1
    },{
      type: 'supply_used',
      value: 1
    }, {
      type: 'area_used',
      value: 1
    }]
  },
  shp: {
    name: 'Shipyard',
    description: 'A shipyard produces ships and other vehicles.',
    cost: 5,
    effect: [{
      type: 'economy',
      value: 1
    }, {
      type: 'industrial',
      value: 2
    }, {
      type: 'energy_used',
      value: 1
    },{
      type: 'supply_used',
      value: 1
    }, {
      type: 'area_used',
      value: 1
    }]
  },
}

const facility = {
  ap
}

export default facility

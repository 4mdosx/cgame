import { useStore } from '@/store/main'
import { acceptProposal, buildingIsExist } from '@/game/interface'

function ProposalRow (props) {
  const { id, schema, type, data = {} } = props
  if (type === 'building') {
    const isExist = buildingIsExist(schema)
    return (
      <div className='proposal-item'>
        { schema }
        <button onClick={() => acceptProposal(id)}>
          { isExist ? 'Upgrade' : 'Build'}
        </button>
      </div>
    )
  }
  if (type === 'research') {
    return (
      <div className='proposal-item'>
        <span>
          { data.label || schema }
        </span>
        <button onClick={() => acceptProposal(id)} className='capitalize'>
          { data.action }
        </button>
      </div>
    )
  }

  return (
    <div onClick={() => acceptProposal(id)}>
      {type}: {schema}
    </div>
  )
}

export default function Proposals () {
  const proposals = useStore(state => state.proposals)
  return (
    <div className='proposals'>
      {
        proposals.map((proposal) => {
          return (
            <ProposalRow key={proposal.id} {...proposal} />
          )
        })
      }
    </div>
  )
}

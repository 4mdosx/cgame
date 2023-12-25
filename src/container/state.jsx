import { useStore } from '@/store/main'
import Overview from '@/container/overview.jsx'
import { useState } from 'react'

function Tabs (props) {
  const { onChange } = props
  return (
    <div>
      <span onClick={() => onChange('state')}>A Dark Where</span>
      <span className='ml-2' onClick={() => onChange('overview')}>Overview</span>
    </div>
  )
}

function ProposalButton (props) {
  const { id, schema, type } = props
  function exec () {
    globalThis.game.modules.task.doProposal(id)
  }
  return (
    <div onClick={exec}>
      {type}: {schema}
    </div>
  )
}

function StateTabContent () {
  const proposals = useStore(state => state.proposals)
  return (
    <div className='state'>
      {
        proposals.map((proposal) => {
          return (
            <ProposalButton key={proposal.id} {...proposal} />
          )
        })
      }
    </div>
  )
}

export default function State () {
  const [state, setState] = useState({ activeTab: 'state' })
  return (
    <div>
      <Tabs activeTab={state.activeTab} onChange={activeTab => setState({ activeTab })} />
      <div className="tab_content">
        { state.activeTab === 'state' && <StateTabContent /> }
        { state.activeTab === 'overview' && <Overview /> }
      </div>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { useEffect, useState, useRef } from 'react'
import './credit.css'

export default function Credit() {
  const { isPending, error, data } = useQuery({
    queryKey: ['ghost', 'me'],
    queryFn: () => fetch(`/api/cgame/ghost`).then((res) => res.json()),
    refetchInterval: 10 * 60 * 1000,
  })
  const [credit, setCredit] = useState<number | null>(null)
  const [diff, setDiff] = useState<null | number>(null)
  useEffect(() => {
    if (isPending) return
    if (data.credit === credit) return
    if (credit === null) {
      setCredit(data.credit)
    } else {
      setDiff(data.credit - credit)
      setCredit(data.credit)
    }
  }, [credit, data, isPending])
  const diffRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (diff === null) return
    if (diff === 0) {
      diffRef.current && (diffRef.current.style.display = 'none')
    } else {
      if (diff > 0) {
        diffRef.current?.classList.remove('text-red-500')
        diffRef.current?.classList.add('text-emerald-500')
      } else {
        diffRef.current?.classList.remove('text-emerald-500')
        diffRef.current?.classList.add('text-red-500')
      }
      diffRef.current?.classList.add('zoomIn')
      setTimeout(() => {
        diffRef.current?.classList.remove('zoomIn')
      }, 2000)
    }

  }, [diff, credit])

  return (
    <div className="bg-black rounded-lg p-2 text-right credit-box relative">
      <div className="credit relative">
        <i className="bi-hexagon-fill mr-1 text-emerald-500"></i>
        <span className="text-emerald-500">{credit || '...'}</span>
      </div>
      <span className='diff' ref={diffRef}>{diff}</span>
    </div>
  )
}

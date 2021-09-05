import React from 'react'
import * as Views from './styles'
import { VERTEX_RADIUS } from '../constants'
import useScaleDown from 'shared/hooks/use-scale-down'
import { Point } from '../../../../types'

type Props = {
  center: Point
  label?: string
  highlight: 'current' | 'memoized' | 'none'
}

const Vertice = ({ center, label, highlight }: Props) => {
  const textRef = React.useRef<SVGTextElement>(null)
  useScaleDown(textRef, label)
  const rsq = VERTEX_RADIUS * 1.9
  return (
    <Views.Container highlight={highlight}>
      <Views.Square
        x={center[0] - 32.5}
        y={center[1] - 33}
        width={rsq}
        height={rsq}
        rx='15'
      />
      {/* <Views.Circle cx={center[0]} cy={center[1]} r={VERTEX_RADIUS} /> */}
      <Views.Text x={center[0]} y={center[1]} ref={textRef}>
        {label}
      </Views.Text>
    </Views.Container>
  )
}

export default Vertice

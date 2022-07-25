import { useEffect, useRef } from 'react'
import { createUseGesture, pinchAction } from '@use-gesture/react'
import { useSpring, animated } from '@react-spring/web'
import { ViewOptions } from './optionsTop'
import { ControlOptions } from './optionsBottom'
import { DicomViewer } from './dicom'
import { ColorInfo } from "./color"

const topPanelStyle = {
    position: 'absolute',
    top: '4vh',
    left: '50px',
    zIndex: 1
}

const bottomPanelStyle = {
    position: "absolute",
    bottom: "4vh",
    left: "50px"
}

const infoContainerStyle = {
    position: 'absolute',
    left: '50px',
    top: '14vh',
    zIndex: 1
}


export default function Viewer(props) {
    const ref = useRef(null)
    const useGesture = createUseGesture([pinchAction])
    const [style, api] = useSpring(() => ({
        x: 0,
        y: 0,
        scale: 1,
        rotateZ: 0
    }))


    useEffect(() => {
        const handler = e => e.preventDefault()
        document.addEventListener('gesturestart', handler)
        document.addEventListener('gesturechange', handler)
        document.addEventListener('gestureend', handler)
        return () => {
            document.removeEventListener('gesturestart', handler)
            document.removeEventListener('gesturechange', handler)
            document.removeEventListener('gestureend', handler)
        }
    }, [])

    useGesture(
        {
            onPinch: ({ origin: [ox, oy], first, movement: [ms], offset: [s, a], memo }) => {
                if (first) {
                    const { width, height, x, y } = ref.current.getBoundingClientRect()
                    const tx = ox - (x + width / 2)
                    const ty = oy - (y + height / 2)
                    memo = [style.x.get(), style.y.get(), tx, ty]
                }

                const x = memo[0] - (ms - 1) * memo[2]
                const y = memo[1] - (ms - 1) * memo[3]
                api.start({ scale: s })
                return memo
            },
        },
        {
            target: ref,
            drag: { from: () => [style.x.get(), style.y.get()] },
            pinch: { scaleBounds: { min: 0.5, max: 3 }, rubberband: true },
        }
    )

    return (
        <div>
            <div style={topPanelStyle}>
                <ViewOptions />
            </div>
            <div style={infoContainerStyle}>
                <ColorInfo />
            </div>
            <animated.div ref={ref} style={{ ...style, marginTop: "50vh", zIndex: -1 }}>
                <DicomViewer />
            </animated.div>
            <div style={bottomPanelStyle}>
                <ControlOptions />
            </div>
        </div>
    )
}
import { useContext, useEffect, useState } from 'react'
import { Radio, Button } from 'antd'
import { AimOutlined, CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons"
import { dicomViewOptions, SegmentationContext } from '../../provider'

const HideSegmentations = () => <Button danger>Hide segmentations <CloseCircleOutlined /></Button>
const ShowSegmentations = () => <Button type="primary">Show segmentations <AimOutlined /></Button>
const LoadingSegmentations = () => <Button type='dashed'>Loading segmentations <LoadingOutlined /></Button>

export function ViewOptions() {
    const { options, setOptions } = useContext(dicomViewOptions)
    const { segmentation } = useContext(SegmentationContext)
    const [view, setView] = useState(options.view)
    const [ toggle, setToggle ] = useState(false)

    const onChange = (e) => {
        // change current view ie. t1, t1ce, t2, flair
        e.preventDefault()
        console.log("view", e.target.value)
        setOptions({ ...options, view: e.target.value })
        setView(e.target.value)
    }

    // update component every time toggle or context changed
    useEffect(() => {}, [toggle, segmentation])

    const onToggle = (e) => {
        e.preventDefault()
        
        if (segmentation !== undefined) {
            // change hide/show segmentation stack on view
            setToggle(!toggle)
            setOptions({ ...options, viewSegmentations: toggle })
        }
    }

    return (
        <div style={{display: 'flex'}}>
            <div>
                <Radio.Group value={view} onChange={onChange}>
                    <Radio.Button value="t1">T1 weights</Radio.Button>
                    <Radio.Button value="t1ce">T1CE weights</Radio.Button>
                    <Radio.Button value="t2">T2 weights</Radio.Button>
                    <Radio.Button value="flair">FLAIR weights</Radio.Button>
                </Radio.Group>
            </div>
            <div style={{marginLeft: "30px"}}  onClick={onToggle}>
                {
                    segmentation == undefined ? <LoadingSegmentations /> :
                    !toggle ? <HideSegmentations /> : <ShowSegmentations />
                }
            </div>
        </ div>
    )
}
import { useContext, useEffect, useState } from 'react'
import { Button, Slider, Typography } from 'antd'
import { RotateLeftOutlined } from "@ant-design/icons"
import { dicomViewOptions, dicomViewerContext } from "../../provider"
import { getNifiDepth } from "./nifti"

const { Text } = Typography
const style = {
    width: "200px",
    textAlign: "left",
    display: "flex",
    alignItems: "center"
}

export function ControlOptions(props) {
    const { options, setOptions } = useContext(dicomViewOptions)
    const { dicom } = useContext(dicomViewerContext)

    const setSlicer = (value) => {
        setOptions({ ...options, slice: value })
        console.log("slice from slicer", value)
    }

    useEffect(() => {
        if (dicom !== undefined) {
            const depth = getNifiDepth(dicom[options.view].header)
            // set maximum depth of image stack (Z dimentation)
            setOptions({ ...options, max: depth })
        }
    }, [dicom])

    return (
        <div style={style}>
            <div>
                <Text level={5}>[ {options.slice} / {options.max} ]</Text>
                <Slider defaultValue={0} min={1} max={options.max} style={{ width: '60vw' }} onChange={setSlicer} />
            </div>
        </div>
    )
}
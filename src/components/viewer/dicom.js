import { useContext, useEffect, useRef } from "react";
import { dicomViewerContext, dicomViewOptions, SegmentationContext } from "../../provider";
import { drawCanvas, drawSegmentation } from './nifti'

const absoluteStyle = {
    position: "absolute",
    top: '50%',
    lef: '50%',
    transform: 'translate(-50%,-50%)'
}

export function DicomViewer(props) {

    const canvasRef = useRef(null)
    const segmentationRef = useRef(null)
    const { dicom } = useContext(dicomViewerContext)
    const { options } = useContext(dicomViewOptions)
    const { segmentation } = useContext(SegmentationContext)

    useEffect(() => {
        console.log(options)
        if (dicom !== undefined) {
            let { header, context } = dicom[options.view]
            drawCanvas(canvasRef.current, options.slice, header, context)
        }

        if (segmentation !== undefined) {
            if (segmentationRef.current !== null) {
                let { header, context } = segmentation
                drawSegmentation(segmentationRef.current, options.slice, header, context)
            }
        }
    }, [dicom, options])

    return (
        <>
            <div style={{ position: "relative" }}>
                <canvas ref={canvasRef} style={absoluteStyle}></canvas>
                {
                    options.viewSegmentations ?
                        <canvas ref={segmentationRef} style={absoluteStyle}></canvas>
                        : <></>
                }
            </div>
        </>
    )
}
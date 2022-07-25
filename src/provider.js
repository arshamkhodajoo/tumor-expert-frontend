import { createContext, useState } from 'react'

export const dicomViewerContext = createContext()
export const dicomViewOptions = createContext()
export const SegmentationContext = createContext()

export const DicomViewerProvider = (props) => {
    const [dicom, setDicom] = useState()
    const [segmentation, setSegmentation] = useState()
    const [options, setOptions] = useState({
        view: 't1',
        slice: 0,
        viewSegmentations: true,
        max: 0
    })


    return (
        <dicomViewerContext.Provider value={{ dicom, setDicom }}>
            <dicomViewOptions.Provider value={{ options, setOptions }}>
                <SegmentationContext.Provider value={{ segmentation, setSegmentation }}>
                    {props.children}
                </SegmentationContext.Provider>
            </dicomViewOptions.Provider>
        </dicomViewerContext.Provider>
    )
}

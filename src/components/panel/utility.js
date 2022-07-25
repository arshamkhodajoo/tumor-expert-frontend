import axios from "axios"
import { readNifti } from "../viewer/nifti"

const modules = ["t1ce", "t1", "t2", "flair"]

export const createUploadForm = files => {
    const form = new FormData()
    for (const [key, value] of Object.entries(files)) {
        form.append(key, value)
    }

    return form
}

export const createSegmentationRequest = async form => {
    return axios({
        method: "POST",
        url: "/views/",
        data: form,
        headers: {
            "Content-Type": "multipart/form-data"
        },
        responseType: 'blob'
    })
}

export const sortWithFileName = fileList => {
    let sortedList = {}
    fileList.forEach(file => {
        modules.forEach(module => {

            if (!file.name.includes("t1ce") && file.name.includes("t1")) {
                sortedList["t1"] = file
            }

            else if (file.name.includes("t1ce")) {
                sortedList["t1ce"] = file
            }

            else {
                if (file.name.includes(module)) { sortedList[module] = file }
            }

        })
    });

    return sortedList
}

export const getContext = readNifti
export const extractContextFromFiles = async (sortedFiles) => {
    let container = {}
    for (const [key, value] of Object.entries(sortedFiles)) {
        let { context, header } = await getContext(value)
        container[key] = { header, context }
    }

    return container
}
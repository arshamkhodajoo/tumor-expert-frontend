import { useContext, useState } from 'react'
import { Upload, message, Button, notification } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { dicomViewerContext, SegmentationContext } from '../../provider'
import { createUploadForm, createSegmentationRequest, sortWithFileName, extractContextFromFiles, getContext } from './utility'

const success = () => message.success(`file uploaded successfully.`)
const failed = () => message.error(`file upload failed.`)
const responseNotification = () => notification["info"]({
    message: "Processing tumor segmentations",
    description: "this process may take a few minute, please be patient"
})

const uploadCompleted = () => notification["success"]({
    message: "segmentations applied successfuly",
    description: "you can now visualize segmented areas on the image"
})

const uploadFailed = () => notification["error"]({
    message: "segmentation request failed",
    description: "application failed recieving response from server, this may be due to network connection."
})

function Uploader() {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const { setDicom } = useContext(dicomViewerContext)
    const { setSegmentation } = useContext(SegmentationContext)

    const props = {
        multiple: true,

        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file, list) => {
            setFileList([...fileList, ...list]);
            return false;
        },
        fileList,
    };

    const handleUpload = async () => {
        // sort file by their keywords ie. "t1" -> "file_t1.nii.gz"
        const sort = sortWithFileName(fileList)
        const form = createUploadForm(sort)
        // start upload loader
        setUploading(true);
        // assign corresponding context and header to each module
        // "t1": { header, context }, "t2": ..
        const modulesWithContext = await extractContextFromFiles(sort)
        setDicom(modulesWithContext)

        try {
            responseNotification()
            // send all modules (T1, T1CE, T2, FLAIR)
            const response = await createSegmentationRequest(form)
            if (response.status !== 200) {
                uploadFailed()
                return
            }
            // read streamed file from response as File object
            const file = new File([response.data], "segmentation.nii.gz")
            const { header, context } = await getContext(file)
            console.log("header", header)
            setSegmentation({ header, context })
            success()
            uploadCompleted()
        }

        catch (error) {
            console.error(error)
            // notify failure on screen
            uploadFailed()
            failed()
        }

        finally {
            // stop upload loader
            setUploading(false)
        }
    }


    return (
        <>
            <Upload {...props} width>
                <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            <Button
                width
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{
                    marginTop: 16,
                }}
            >
                {uploading ? 'Uploading' : 'Start Upload'}
            </Button>
        </>
    )
}

export default Uploader
import { Row } from 'antd'
import { Typography } from 'antd'

const { Text, Title } = Typography

function Header() {
    return (
        <Row width style={{ textAlign: "left", marginBottom: "5vh" }}>
            <Title level={4}>Upload your files</Title>
            <Text level={1}>filenames should contain keys like <code>T1 | T2 | T1CE | FLAIR </code></Text>
        </Row>

    )
}

export default Header
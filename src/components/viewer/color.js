import { Typography } from "antd"

const { Text } = Typography

export function ColorMap(props) {
    const [r, g, b] = props.rgb

    const containerStyle = {
        maxWidth: "150px",
        display: "flex",
        alignItems: "center",
        alignContent: "center"
    }

    const boxStyle = {
        width: '10px',
        height: '15px',
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
        border: `2px solid rgb(${r}, ${g}, ${b})`,
        borderRadius: "20px"
    }

    const textStyle = {
        marginLeft: '10px'
    }

    return (
        <div style={containerStyle}>
            <div style={boxStyle}></div>
            <Text style={textStyle}>{props.header}</Text>
        </div>
    )
}

export function ColorInfo() {
    return (
        <>
            <ColorMap header={"Whole Tumor"} rgb={[0, 0, 255]}/>
            <ColorMap header={"Tumor Core"} rgb={[165, 42, 42]}/>
            <ColorMap header={"Enhancing Tumor"} rgb={[0, 255, 0]}/>
        </>
    )
}
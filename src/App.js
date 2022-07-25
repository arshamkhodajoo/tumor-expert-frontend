import './App.css';
import 'antd/dist/antd.dark.css';

import { Col, Row } from 'antd'

import { DicomViewerProvider } from './provider'
import { UploadPanel } from './components/panel/panel'
import Viewer from './components/viewer/viewer'


const panelStyle = {
  padding: '1.2rem',
  marginTop: '15vh',
}


function App() {

  return (
    <DicomViewerProvider>
      <div className="App">
        <Row style={{ height: '100vh', backgroundColor: "#181818" }}>

          <Col span={4} flex style={panelStyle}>
            <UploadPanel />
          </Col>

          <Col span={20} style={{ backgroundColor: "black" }}>
              <Viewer />
          </Col>

        </Row>
      </div>
    </DicomViewerProvider>
  );
}

export default App;

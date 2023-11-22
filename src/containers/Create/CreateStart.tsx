import React, { useContext } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  Layout,
  Radio,
  Row,
  Typography,
  theme,
} from "antd";
import { CreateContext } from "./CreateContainer";

const { Text, Title, Link } = Typography;

export const CreateStart = () => {
  const {
    templateType,
    setTemplateType,
    targetUrl,
    setTargetUrl,
    handleStart,
  } = useContext(CreateContext);
  return (
    <>
      {/* <Text style={{ fontSize: "80px" }}>ECのProduct Imageを</Text>
      <br />
      <Text style={{ fontSize: "80px" }}>一瞬で創作</Text>
      <p></p> */}
      <p></p>
      <Card style={{ width: "70%" }} title="Creative Type">
        <Radio.Group
          size="large"
          buttonStyle="solid"
          className="large-icons"
          value={templateType}
          onChange={(e) => {
            setTemplateType(e.target.value);
          }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Radio value="new">
                <Card>
                  <img width={120} height={120} src="/img/TA.png" />
                  New Item
                </Card>
              </Radio>
            </Col>
            <Col span={6}>
              <Radio value="comparison">
                <Card>
                  <img width={120} height={120} src="/img/TB.png" />
                  Comparison
                </Card>
              </Radio>
            </Col>
            <Col span={6}>
              <Radio value="feature">
                <Card>
                  {" "}
                  <img width={120} height={120} src="/img/TC.png" />
                  Feature
                </Card>
              </Radio>
            </Col>
            <Col span={6}>
              <Radio value="sale">
                <Card>
                  {" "}
                  <img width={120} height={120} src="/img/TD.png" />
                  Sale
                </Card>
              </Radio>
            </Col>
          </Row>
        </Radio.Group>
      </Card>
      <div style={{ width: "600px", textAlign: "left" }}>
        あなたの商品を出品しているECサイトのURLを入力して始める
        <br />
        <Input
          style={{ width: 600 }}
          onChange={(e) => {
            setTargetUrl(e.target.value);
          }}
          value={targetUrl}
        />
      </div>
      <div style={{ width: "600px", textAlign: "right" }}>
        <Button onClick={handleStart}>始める⇨</Button>
      </div>
    </>
  );
};

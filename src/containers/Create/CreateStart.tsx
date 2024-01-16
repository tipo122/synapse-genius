import React, { ReactEventHandler, useContext } from "react";
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
import "./Create.css";

const { Text, Title, Link } = Typography;

const CARD_TYPES = {
  NEW: "new",
  COMPARISON: "comparison",
  FEATURE: "feature",
  SALE: "sale",
};

export const CreateStart = () => {
  const {
    templateType,
    setTemplateType,
    targetUrl,
    setTargetUrl,
    handleStart,
  } = useContext(CreateContext);

  const handleTemplateTypeChange = (e: any) => {
    setTemplateType(e.target.value);
  };

  return (
    <>
      {/* <Text style={{ fontSize: "80px" }}>ECのProduct Imageを</Text>
      <br />
      <Text style={{ fontSize: "80px" }}>一瞬で創作</Text>*/}
      <Card className="create-start-entire-card" title="Creative Type">
        <Radio.Group
          size="large"
          optionType="button"
          className="large-icons"
          value={templateType}
          onChange={handleTemplateTypeChange}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Radio value={CARD_TYPES.NEW}>
                <Card style={{ border: "none" }}>
                  <img width={120} height={120} src="/img/TA.png" />
                  <div>New Item</div>
                </Card>
              </Radio>
            </Col>
            <Col span={6}>
              <Radio value={CARD_TYPES.COMPARISON}>
                <Card style={{ border: "none" }}>
                  <img width={120} height={120} src="/img/TB.png" />
                  <div>Comparison</div>
                </Card>
              </Radio>
            </Col>
            <Col span={6}>
              <Radio value={CARD_TYPES.FEATURE}>
                <Card style={{ border: "none" }}>
                  <img width={120} height={120} src="/img/TC.png" />
                  <div>Feature</div>
                </Card>
              </Radio>
            </Col>
            <Col span={6}>
              <Radio value={CARD_TYPES.SALE}>
                <Card style={{ border: "none" }}>
                  <img width={120} height={120} src="/img/TD.png" />
                  <div>Sale</div>
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

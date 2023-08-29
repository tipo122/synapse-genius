import React, { useState } from "react";
import "./ItemProperty.css";
import { Button, Input } from "antd";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
import { Canvas } from "@domain-types/canvas";
import { initialCanvasData } from "@hooks/useCanvasData";
interface ProductUrlFormProps {
  children?: React.ReactElement;
}
interface ProductNameFormProps {
  children?: React.ReactElement;
}
interface ProductCategoryFormProps {
  children?: React.ReactElement;
}
interface ProductFeatureFormProps {
  children?: React.ReactElement;
}
const { TextArea } = Input;

const ItemProperty = () => {
  const [canvasData, setCanvasData] = useState<Canvas>(initialCanvasData);
  const handleBlur = async () => {
    // ここでfirebaseにsaveする予定
  };

  const onAnalyzeProductInsight: (data: any) => Promise<{
    data: any;
  }> = httpsCallable(functions, "on_analyze_product_insight");

  const handleClick = async () => {
    const result = await onAnalyzeProductInsight({
      target_url: canvasData.item_property.item_url,
    });
  };
  return (
    <div>
      <div className="item-property-body-div">
        <p>商品のURL</p>
        <div className="item-property-input-div">
          <Input
            value={canvasData.item_property.item_url}
            onChange={(e) => {
              setCanvasData({
                ...canvasData,
                item_property: { item_url: e.target.value },
              });
            }}
            onBlur={handleBlur}
            placeholder="https://www.amazon.co.jp/sample"
          />
          <Button onClick={handleClick} />
        </div>
      </div>

      <div className="item-property-body-div">
        <p>商品名</p>
        <div className="item-property-input-div">
          <Input
            value={canvasData.item_property.item_name}
            onChange={(e) => {
              // setCanvasData(e.target.value);
            }}
            onBlur={handleBlur}
            placeholder="商品名を入力してください"
          />
        </div>
      </div>

      <div className="item-property-body-div">
        <p>商品カテゴリ</p>
        <div className="item-property-input-div">
          <Input
            value={canvasData.item_property.item_category}
            onChange={(e) => {
              // setCanvasData(e.target.value);
            }}
            onBlur={handleBlur}
            placeholder="商品カテゴリを入力してください"
          />
        </div>
      </div>

      <div className="item-property-body-div">
        <p>商品の特徴</p>
        <div className="item-property-textarea-div">
          <TextArea
            value={canvasData.item_property.item_description}
            onChange={(e) => {
              // setCanvasData(e.target.value);
            }}
            onBlur={handleBlur}
            placeholder="商品の特徴を入力してください"
          />
        </div>
      </div>
    </div>
  );
};

export default ItemProperty;

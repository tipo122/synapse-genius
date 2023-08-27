import React, {useState} from "react";
import "./ItemProperty.css";
import {Button, Input} from "antd";

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
  const [prompt, setPrompt] = useState<string>("");
  const handleBlur = async () => {
    // ここでfirebaseにsaveする予定
  };

  return (
    <div>
      <div className="item-property-body-div">
        <p>商品のURL</p>
        <div className="item-property-input-div">
          <Input
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            onBlur={handleBlur}
            placeholder="https://www.amazon.co.jp/sample"
          />
        </div>
      </div>

      <div className="item-property-body-div">
        <p>商品名</p>
        <div className="item-property-input-div">
          <Input
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
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
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
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
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
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

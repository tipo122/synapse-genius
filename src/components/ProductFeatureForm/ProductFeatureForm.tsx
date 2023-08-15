import React, {useState} from "react";
import {Button, Input} from "antd";
import "./ProductFeatureForm.css";

interface ProductFeatureFormProps {
  children?: React.ReactElement;
}
const { TextArea } = Input;

const ProductFeatureForm = (props: ProductFeatureFormProps) => {
  const [prompt, setPrompt] = useState<string>("");
  const handleClick = async () => {
    // ここでfirebaseにsaveする予定
  };

  return (
    <div className="product-feature-body-div">
      <p>商品の特徴</p>
      <div className="product-feature-textarea-div">
        <TextArea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          placeholder="商品の特徴を入力してください"
        />
        <Button onClick={handleClick} className="product-feature-button">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ProductFeatureForm;

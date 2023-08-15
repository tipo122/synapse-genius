import React, {useState} from "react";
import {Button, Input} from "antd";
import "./ProductNameForm.css";

interface ProductNameFormProps {
  children?: React.ReactElement;
}
const { TextArea } = Input;

const ProductNameForm = (props: ProductNameFormProps) => {
  const [prompt, setPrompt] = useState<string>("");
  const handleClick = async () => {
    // ここでfirebaseにsaveする予定
  };

  return (
    <div className="product-name-body-div">
      <p>商品名</p>
      <div className="product-name-textarea-div">
        <TextArea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          placeholder="商品名を入力してください"
        />
        <Button onClick={handleClick} className="product-name-button">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ProductNameForm;

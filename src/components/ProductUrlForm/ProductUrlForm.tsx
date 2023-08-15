import React, {useState} from "react";
import {Button, Input} from "antd";
import "./ProductUrlForm.css";

interface ProductUrlFormProps {
  children?: React.ReactElement;
}
const { TextArea } = Input;

const ProductUrlForm = (props: ProductUrlFormProps) => {
  const [prompt, setPrompt] = useState<string>("");
  const handleClick = async () => {
    // ここでfirebaseにsaveする予定
  };

  return (
    <div className="product-url-body-div">
      <p>商品のURL</p>
      <div className="product-url-textarea-div">
        <TextArea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          placeholder="https://www.amazon.co.jp/sample"
        />
        <Button onClick={handleClick} className="product-url-button">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ProductUrlForm;

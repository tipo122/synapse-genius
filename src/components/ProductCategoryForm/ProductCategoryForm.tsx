import React, {useState} from "react";
import {Button, Input} from "antd";
import "./ProductCategoryForm.css";

interface ProductCategoryFormProps {
  children?: React.ReactElement;
}
const { TextArea } = Input;

const ProductCategoryForm = (props: ProductCategoryFormProps) => {
  const [prompt, setPrompt] = useState<string>("");
  const handleClick = async () => {
    // ここでfirebaseにsaveする予定
  };

  return (
    <div className="product-category-body-div">
      <p>商品カテゴリ</p>
      <div className="product-category-textarea-div">
        <TextArea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          placeholder="商品カテゴリを入力してください"
        />
        <Button onClick={handleClick} className="product-category-button">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ProductCategoryForm;

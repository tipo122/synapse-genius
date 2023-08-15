import React from "react";
import ProductNameForm from "@components/ProductNameForm";
import ProductCategoryForm from "@components/ProductCategoryForm";
import ProductFeatureForm from "@components/ProductFeatureForm";
import ProductUrlForm from "@components/ProductUrlForm";

const ItemProperty = () => {
  return (
    <div>
      <ProductUrlForm />
      <ProductNameForm />
      <ProductCategoryForm />
      <ProductFeatureForm />
    </div>
  );
};

export default ItemProperty;

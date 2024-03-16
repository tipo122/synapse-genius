import { Typography } from "antd";
import React from "react";

interface TextItemProps {
  handleDragStart: (e) => void;
  text: string;
}
const { Text, Link } = Typography;

const TextItem = ({ text, handleDragStart }: TextItemProps) => {
  return (
    <Text draggable keyboard onDragStart={handleDragStart}>
      {text}
    </Text>
  );
};

export default TextItem;

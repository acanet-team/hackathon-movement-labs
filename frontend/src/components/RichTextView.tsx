import React from "react";

interface RichTextViewProps {
  text: string;
}

const RichTextView: React.FC<RichTextViewProps> = ({ text }) => {
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
};

export default RichTextView;

import React from "react";

export interface DividerTextProps {
  text: string;
}

export const DividerText: React.FC<DividerTextProps> = ({ text }) => {
  return (
    <div className='pt-20 lg:py-20'>
      <h3 className='text-primary text-center text-3xl px-12 md:px-32 lg:px-48 xl:px-80'>
        {text}
      </h3>
    </div>
  );
};

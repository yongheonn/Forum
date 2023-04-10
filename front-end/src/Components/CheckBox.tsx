import React, { Fragment } from 'react';

const CheckBox = ({
  children,
  disabled,
  checked,
  onChange,
}: {
  children: React.ReactNode | undefined;
  disabled: boolean | undefined;
  checked: boolean | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
}) => {
  const a = 1;
  return (
    <Fragment>
      <input type="checkbox" disabled={disabled} checked={checked} onChange={onChange} />
      {children}
    </Fragment>
  );
};

export { CheckBox };

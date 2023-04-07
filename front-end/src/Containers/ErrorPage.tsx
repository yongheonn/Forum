import React, { Fragment } from 'react';

const ErrorPage = ({ code }: { code: number }) => {
  const a = 1;
  return (
    <Fragment>
      <span>Error: {code}</span>
    </Fragment>
  );
};

export { ErrorPage };

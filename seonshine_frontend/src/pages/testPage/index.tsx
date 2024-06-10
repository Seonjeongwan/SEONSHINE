import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { paths } from '@/routes/paths';

const TestPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      TestPage
      <Link to={paths.forgotPassword}>GO TO</Link>;
    </div>
  );
};

export default TestPage;

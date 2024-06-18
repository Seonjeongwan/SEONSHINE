import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import SearchBar from '@/components/molecules/searchBar';

import { paths } from '@/routes/paths';

const Dashboard = () => {
  const handleSearch = (field: string, query: string) => {
    console.log(`Searching for ${query} in field ${field}`);
  };
  const options = [
    { value: 'user_id', label: 'ID' },
    { value: 'fullname', label: 'Fullname' },
    { value: 'branch', label: 'Branch' },
  ];
  const defaultOption = options[0].value;
  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        options={options}
      />
      TestPage
      <Link to={paths.forgotPassword}>GO TO</Link>;
    </div>
  );
};

export default Dashboard;

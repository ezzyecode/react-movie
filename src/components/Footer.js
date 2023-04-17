import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

function AppFooter() {
  return (
    <Footer style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
      <div className="container mx-auto text-center">
        &copy; {new Date().getFullYear()} MovieApp. All rights reserved.
      </div>
    </Footer>
  );
}

export default AppFooter;

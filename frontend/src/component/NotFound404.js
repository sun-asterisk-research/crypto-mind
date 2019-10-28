import React from 'react';
import '../style/NotFound404.css';
import Container from 'reactstrap/lib/Container';

const Site404 = () => {
  return (
    <div>
      <Container className='site-not-found col'>
        <div className='supper-man'>
          <img src='http://pngimg.com/uploads/superman/superman_PNG9.png' alt='' />
        </div>
        <div className='title'>404!</div>
        <p>The Page You're Looking For Was Not Found.</p>
        <a href='/'>Go Back Home Page</a>
      </Container>
    </div>
  );
};

export default Site404;

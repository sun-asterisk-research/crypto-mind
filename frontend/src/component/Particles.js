import React from 'react';
import ParticlesJS from 'react-particles-js';
import params from '../params.json';

const Particles = () => (
  <ParticlesJS
    style={{
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      position: 'fixed'
    }}
    params={params}
  />
);

export default Particles;

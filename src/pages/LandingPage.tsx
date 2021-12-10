import * as React from 'react';
import './landingPage.css'

export const LandingPage = () => {
  return <>
    <header>
      <p>
        <span className="bigTitle">StackDB</span>
        <span className="extension">.info</span>
      </p>
      <p>
        <span className="subtitle">
          The opensource tech database for developers & IT experts
        </span>
      </p>
      <input className="search" type="text" placeholder="Relational DBMS... Opensource js framework..."></input>
    </header>
  </>
}
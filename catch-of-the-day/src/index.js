import React from 'react';
import { render } from 'react-dom';
import Router from './components/Router';
import './css/style.css';
// why don't we need to import css in the component files?

render(<Router />, document.querySelector('#main'));

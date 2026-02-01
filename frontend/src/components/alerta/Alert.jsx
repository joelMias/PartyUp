import React from 'react';
import { SlCheck, SlClose, SlExclamation } from 'react-icons/sl';
import './alert.css';

export default function MyAlert({ type, title, message }) {
  let Icon;
  switch(type) {
    case 'success': Icon = <SlCheck size={20} />; break;
    case 'warning': Icon = <SlExclamation size={20} />; break;
    case 'error':   Icon = <SlClose size={20} />; break;
    default:        Icon = <SlExclamation size={20} />; break;
  }

  return (
    <div id="contenidor-alert">
      <div className={`my-alert ${type}`}>
        {Icon}
        <div>
          <strong>{title}</strong>
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
}

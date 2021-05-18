import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import I18 from '../../../i18n/component';
import ComponentsLayoutBase from '../../components/layout/base';

import './create.scss';

const PageWalletCreate: FC = () => {
  const [inputType, setInputType] = useState<'password'|'text'>('password');
  const [password, setPassword] = useState('');
  const changeInputType = () => {
    setInputType(status => status === 'text' ? 'password' : 'text');
  };

  return (
    <ComponentsLayoutBase className="wallet_create_page">
      <h2 className="wallet_title"><I18 text="createYourAccount" /></h2>
      <p className="wallet_password_tip_top"><I18 text="password" /><span className="wallet_password_important">*</span></p>
      <div className="wallet_password_box">
        <input
          className="wallet_password_input"
          type={inputType}
          value={password}
          onChange={e => setPassword(e.target.value)} />
        <button className="wallet_password_change" onClick={changeInputType}>
          <svg className="icon wallet_password_icon" aria-hidden="true">
            <use xlinkHref={inputType === 'text' ? '#icon-show' : '#icon-hide'}></use>
          </svg>
        </button>
      </div>
      <p className="wallet_password_tip_bottom"><I18 text="passwordTip" /></p>
      <div className="wallet_buttons">
        <button className="wallet_button"><I18 text="createStart" /></button>
        <button className="wallet_button">
          <I18 text="existingONPAccount" />
          <Link className="wallet_button_primary" to="/"><I18 text="signInNow" /></Link>
        </button>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageWalletCreate;

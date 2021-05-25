import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import I18 from '../../../../i18n/component';
import useI18 from '../../../../i18n/hooks';
import { useSafeLink } from '../../../../tools';
import ComConSvg from '../../../components/control/icon';
import ComponentsLayoutBase from '../../../components/layout/base';
import alertTools from '../../../components/tools/alert';

import './create.scss';

const PageWalletCreate: FC = () => {
  const safeLink = useSafeLink();
  const [inputType, setInputType] = useState<'password'|'text'>('password');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [creating, setCreating] = useState(false);
  const rePasswordText = useI18('rePassword');
  const passwordText = useI18('passwordTip');

  const changeInputType = () => {
    setInputType(status => status === 'text' ? 'password' : 'text');
  };
  const createAccount = () => {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!reg.test(password)) {
      alertTools.create({ message: <I18 text="passwordError" /> });
      return;
    }
    setCreating(true);
    console.log(password);
    safeLink('./create-backup');
  }

  return (
    <ComponentsLayoutBase className="wallet_create_page">
      <h2 className="wallet_title"><I18 text="createYourAccount" /></h2>
      <p className="wallet_password_tip_top"><I18 text="password" /><span className="wallet_password_important">*</span></p>
      <div className="wallet_password_box">
        <input
          className="wallet_password_input"
          placeholder={inputType === 'text' ? '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$/' : passwordText}
          type={inputType}
          value={password}
          onChange={e => setPassword(e.target.value)} />
        <button className="wallet_password_change" onClick={changeInputType}>
          <ComConSvg className="wallet_password_icon" xlinkHref={inputType === 'text' ? '#icon-show' : '#icon-hide'} />
        </button>
      </div>
      <div className="wallet_password_box">
        <input
          placeholder={rePasswordText}
          className="wallet_password_input"
          type="password"
          value={rePassword}
          onChange={e => setRePassword(e.target.value)} />
      </div>
      <p className="wallet_password_tip_bottom"><I18 text="passwordTip" /></p>
      <div className="wallet_buttons">
        <button
          className="wallet_button"
          disabled={creating}
          onClick={createAccount}>
          <I18 text="createStart" />
        </button>
        <button className="wallet_button">
          <I18 text="existingONPAccount" />
          <Link className="wallet_button_primary" to="./login"><I18 text="signInNow" /></Link>
        </button>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageWalletCreate;

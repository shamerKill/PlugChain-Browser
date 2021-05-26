import { FC, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import useI18 from '../../../../i18n/hooks';

import './login.scss';
import { Link } from 'react-router-dom';
import ComConSvg from '../../../components/control/icon';

const PageWalletLogin: FC = () => {
  const textAreaPlaceholder = useI18('inputWordPlaceholder');
  const passwordText = useI18('passwordTip');
  const [signInIng, setSignInIng] = useState(false);
  const [wordText, setWordText] = useState('');
  const [areaFocus, setAreaFocus] = useState(false);
  const [inputType, setInputType] = useState<'password'|'text'>('password');
  const [password, setPassword] = useState('');

  const changeInputType = () => {
    setInputType(status => status === 'text' ? 'password' : 'text');
  };

  const login = () => {
    const words = wordText.split(/[^a-zA-Z]+/g).filter(item => Boolean(item));
    console.log(words);
    setSignInIng(true);
  };

  return (
    <ComponentsLayoutBase className="wallet_login_page">
      <h2 className="wallet_title"><I18 text="signInToYourAccount" /></h2>
      <textarea
        className="wallet_login_area"
        placeholder={textAreaPlaceholder + (areaFocus ? '\n\n/[^a-zA-Z]+/g' : '')}
        name="word"
        id="wordInput"
        value={wordText}
        onChange={e => setWordText(e.target.value)}
        onBlur={() => setAreaFocus(false)}
        onFocus={() => setAreaFocus(true)}></textarea>
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
      <div className="wallet_buttons">
        <button
          className="wallet_button"
          disabled={signInIng}
          onClick={login}>
          <I18 text="signIn" />
        </button>
        <button className="wallet_button">
          <I18 text="noExistingONPAccount" />
          <Link className="wallet_button_primary" to="./create"><I18 text="createAccount" /></Link>
        </button>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageWalletLogin;

import { FC, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import useI18 from '../../../../i18n/hooks';

import './login.scss';
import { Link } from 'react-router-dom';

const PageWalletLogin: FC = () => {
  const textAreaPlaceholder = useI18('inputWordPlaceholder');
  const [signInIng, setSignInIng] = useState(false);
  const [wordText, setWordText] = useState('');
  const [areaFocus, setAreaFocus] = useState(false);

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

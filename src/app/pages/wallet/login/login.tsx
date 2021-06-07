import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ComConSvg from '../../../components/control/icon';
import ComConButton from '../../../components/control/button';
import { sleep, useSafeLink, verifyPassword, walletEncode, walletFormMnemonic, walletToAddress, walletVerifyMnemonic } from '../../../../tools';
import useGetDispatch from '../../../../databases/hook';
import { InRootState } from '../../../../@types/redux';
import { changeWallet } from '../../../../databases/store/wallet';
import alertTools from '../../../components/tools/alert';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import useI18 from '../../../../i18n/hooks';

import './login.scss';

const PageWalletLogin: FC = () => {
  const goLink = useSafeLink();
  const textAreaPlaceholder = useI18('inputWordPlaceholder');
  const passwordText = useI18('passwordTip');
  const [wallet, setWallet] = useGetDispatch<InRootState['wallet']>('wallet');
  const [signInIng, setSignInIng] = useState(false);
  const [wordText, setWordText] = useState('');
  const [areaFocus, setAreaFocus] = useState(false);
  const [inputType, setInputType] = useState<'password'|'text'>('password');
  const [password, setPassword] = useState('');

  const changeInputType = () => {
    setInputType(status => status === 'text' ? 'password' : 'text');
  };

  const login = async () => {
    setSignInIng(true);
    await sleep(0.5);
    const words = wordText.split(/[^a-zA-Z]+/g).filter(item => Boolean(item));
    if (!(await walletVerifyMnemonic(words))) {
      setSignInIng(false);
      return alertTools.create({ message: <I18 text="mnemonicError" />, type: 'warning' });
    }
    if (!verifyPassword(password)) {
      setSignInIng(false);
      return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    }
    const wallet = await walletFormMnemonic(words.join(' '));
    const saveWalletKey = await walletEncode(wallet, password);
    const address = await walletToAddress(wallet);
    setWallet({
      type: changeWallet,
      data: {
        hasWallet: true,
        address: address,
        encryptionKey: saveWalletKey
      }
    });
    alertTools.create({ message: <I18 text="success" />, type: 'success' });
  };

  useEffect(() => {
    if (wallet.hasWallet) goLink('/wallet/account');
  }, [goLink, wallet]);
  

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
        <ComConButton
          loading={signInIng}
          className="wallet_button"
          disabled={signInIng}
          onClick={login}>
          <I18 text="signIn" />
        </ComConButton>
        <button className="wallet_button">
          <I18 text="noExistingPLUGAccount" />
          <Link className="wallet_button_primary" to="./create"><I18 text="createAccount" /></Link>
        </button>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageWalletLogin;

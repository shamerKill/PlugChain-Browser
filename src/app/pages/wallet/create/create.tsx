import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { timer } from 'rxjs';
import { InRootState } from '../../../../@types/redux';
import useGetDispatch from '../../../../databases/hook';
import I18 from '../../../../i18n/component';
import useI18 from '../../../../i18n/hooks';
import { saveSession, useSafeLink, verifyPassword } from '../../../../tools';
import ComConSvg from '../../../components/control/icon';
import ComConLoading from '../../../components/control/loading';
import ComponentsLayoutBase from '../../../components/layout/base';
import alertTools from '../../../components/tools/alert';

import './create.scss';

const PageWalletCreate: FC = () => {
  const goTo = useSafeLink();
  const rePasswordText = useI18('rePassword');
  const passwordText = useI18('passwordTip');
  const [wallet] = useGetDispatch<InRootState['wallet']>('wallet');
  const [inputType, setInputType] = useState<'password'|'text'>('password');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [creating, setCreating] = useState(false);

  const changeInputType = () => {
    setInputType(status => status === 'text' ? 'password' : 'text');
  };
  const createAccount = () => {
    if (!verifyPassword(password)) return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    if (password !== rePassword) return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    saveSession('createPass', password);
    setCreating(true);
    timer(1000).subscribe(() => goTo('./create-backup'));
  }

  useEffect(() => {
    if (wallet.hasWallet) {
      goTo('/');
      alertTools.create({ message: <I18 text="onlyWallet" /> });
    }
  }, [wallet, goTo]);


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
          <ComConLoading visible={creating} />
          <I18 text="createStart" />
        </button>
        <button className="wallet_button">
          <I18 text="existingPLUGAccount" />
          <Link className="wallet_button_primary" to="./login"><I18 text="signInNow" /></Link>
        </button>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageWalletCreate;

import { FC, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import useI18 from '../../../../i18n/hooks';
import ComConButton from '../../../components/control/button';

import './reset.scss';
import { sleep, useSafeLink, verifyPassword, walletEncode, walletFormMnemonic, walletToAddress, walletVerifyMnemonic } from '../../../../tools';
import alertTools from '../../../components/tools/alert';
import useGetDispatch from '../../../../databases/hook';
import { InRootState } from '../../../../@types/redux';
import { changeWallet } from '../../../../databases/store/wallet';
import confirmTools from '../../../components/tools/confirm';
import { useHistory } from 'react-router-dom';

const PageWalletReset: FC = () => {
  const [, setWallet] = useGetDispatch<InRootState['wallet']>('wallet');
  const textAreaPlaceholder = useI18('inputWordPlaceholder');
  const goLink = useSafeLink();
  const history = useHistory();
  const [backupWord, setBackupWord] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading ,setResetLoading] = useState(false);
  const [areaFocus, setAreaFocus] = useState(false);

  const verifyReset = async () => {
    if (!verifyPassword(newPassword)) return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    if (confirmPassword !== newPassword) return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    setResetLoading(true);
    await sleep(0.5);
    const words = backupWord.split(new RegExp('[^a-zA-Z]+', 'g')).filter(item => Boolean(item));
    if (!(await walletVerifyMnemonic(words))) {
      setResetLoading(false);
      return alertTools.create({ message: <I18 text="mnemonicError" />, type: 'warning' });
    }
    if (!verifyPassword(newPassword)) {
      setResetLoading(false);
      return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    }
    const wallet = await walletFormMnemonic(words.join(' '));
    const saveWalletKey = await walletEncode(wallet, newPassword);
    const address = await walletToAddress(wallet);
    setWallet({
      type: changeWallet,
      data: {
        hasWallet: true,
        address: address,
        encryptionKey: saveWalletKey
      }
    });
    setResetLoading(false);
    alertTools.create({ message: <I18 text="success" />, type: 'success' });
    history.goBack();
  };

  const delAccount = () => {
    confirmTools.create({
      message: <I18 text="delNowAccount" />,
      success: () => {
        setWallet({
          type: changeWallet,
          data: {
            hasWallet: false,
            encryptionKey: undefined,
            address: undefined,
          },
        });
        goLink('/wallet/login');
      }
    });
  };

  return (
    <ComponentsLayoutBase className="page_wallet_reset">
      <div className="reset_inner">
        <h2 className="page_wallet_title">
          <I18 text="resetAccount" />
          <p className="page_wallet_create" onClick={delAccount}><I18 text="delAccount"/></p>
        </h2>
        <div className="reset_box">
          <p className="reset_box_title"><I18 text="backupWord" /></p>
          <div className="reset_box_label">
          <textarea
            className="reset_box_area"
            placeholder={textAreaPlaceholder + (areaFocus ? '\n\n/[^a-zA-Z]+/g' : '')}
            name="word"
            id="wordInput"
            value={backupWord}
            onChange={e => setBackupWord(e.target.value)}
            onBlur={() => setAreaFocus(false)}
            onFocus={() => setAreaFocus(true)}></textarea>
          </div>
          <form>
            <p className="reset_box_title"><I18 text="password" /></p>
            <div className="reset_box_label">
              <input
                className="reset_box_input"
                type="password"
                disabled={resetLoading}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)} />
            </div>
            <p className="reset_box_title"><I18 text="repeatPassword" /></p>
            <div className="reset_box_label">
              <input
                className="reset_box_input"
                type="password"
                disabled={resetLoading}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} />
            </div>
          </form>
          <ComConButton
            loading={resetLoading}
            onClick={verifyReset}
            className="reset_confirm_button">
            <I18 text="confirm" />
          </ComConButton>
        </div>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageWalletReset;

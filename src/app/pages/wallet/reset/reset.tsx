import { FC, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import useI18 from '../../../../i18n/hooks';
import ComConButton from '../../../components/control/button';

import './reset.scss';

const PageWalletReset: FC = () => {
  const textAreaPlaceholder = useI18('inputWordPlaceholder');
  const [backupWord, setBackupWord] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading ,setResetLoading] = useState(false);
  const [areaFocus, setAreaFocus] = useState(false);

  const verifyReset = () => {
    setResetLoading(true);
  };

  return (
    <ComponentsLayoutBase className="page_wallet_reset">
      <div className="reset_inner">
        <h2 className="page_wallet_title"><I18 text="resetAccount" /></h2>
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
                type="new-password"
                disabled={resetLoading}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)} />
            </div>
            <p className="reset_box_title"><I18 text="repeatPassword" /></p>
            <div className="reset_box_label">
              <input
                className="reset_box_input"
                type="new-password"
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

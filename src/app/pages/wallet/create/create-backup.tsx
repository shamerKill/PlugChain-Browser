import { FC, useEffect, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import { delSession, formatClass, getOnlyId, getSession, useSafeLink, walletCreate, walletToMnemonic } from '../../../../tools';
import alertTools from '../../../components/tools/alert';
import ComConButton from '../../../components/control/button';

import './create.scss';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import useGetDispatch from '../../../../databases/hook';
import { InRootState } from '../../../../@types/redux';

const PageWalletBackup: FC = () => {
  const goLink = useSafeLink();
  const [wallet] = useGetDispatch<InRootState['wallet']>('wallet');
  const [words,setWords] = useState<string[]>([]);
  const [password, setPassWord] = useState('');
  const [countTime, setCountTime] = useState(10);

  const goRoute = () => {
    goLink('./login');
  };

  useEffect(() => {
    if (!password) return;
    walletCreate()
      .then(wallet => walletToMnemonic(wallet))
      .then(mnemonic => mnemonic.split(' '))
      .then(words => setWords(words));
  }, [password]);

  useEffect(() => {
    const memPass = getSession<string>('createPass');
    if (wallet.hasWallet) {
      goLink('/');
      alertTools.create({ message: <I18 text="onlyWallet" /> });
    } else if (memPass === undefined) {
      alertTools.create({ message: <I18 text="passwordError" />, type: 'warning'});
      goLink('/wallet/create');
    }
    setPassWord(memPass);
  }, [goLink, wallet]);

  useEffect(() => {
    const interval = timer(1000, 1000).pipe(take(10)).subscribe(data => setCountTime(9 - data));
    return () => {
      interval.unsubscribe();
      delSession('createPass');
    }
  }, []);

  return (
    <ComponentsLayoutBase className="wallet_backup_page">
      <h2 className="wallet_title"><I18 text="accountCreatedSuccessful" /></h2>
      <h4 className="wallet_backup_tip_one"><I18 text="backupYourAccount" /></h4>
      <p className="wallet_backup_tip_two"><I18 text="backupTipFirst" /></p>
      <p className="wallet_backup_tip_three"><I18 text="backupTipSecond" /></p>
      <div className="wallet_backup_box">
        {
          words.map((item, index) => (
            <div className="wallet_backup_item" key={getOnlyId()}>
              <p className="wallet_backup_index">{index}</p>
              { item }
            </div>
          ))
        }
      </div>
      <ComConButton
        doubles
        disabled={countTime !== 0}
        className={formatClass(['wallet_backup_button', countTime === 0 && 'wallet_backup_button_success'])}
        onClick={goRoute}>
        <I18 text="backupSucceeded" />
        { countTime !== 0 && `(${countTime}s)` }
      </ComConButton>
    </ComponentsLayoutBase>
  );
};

export default PageWalletBackup;

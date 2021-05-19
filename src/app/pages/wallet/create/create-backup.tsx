import { FC, useEffect, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import { RandomString } from '../../../../tools/random-str';
import { formatClass, getOnlyId, useSafeLink } from '../../../../tools';

import './create.scss';

const PageWalletBackup: FC = () => {
  const [ words, setWords ] = useState<string[]>([]);
  const [timer, setTimer] = useState(10);
  const goLink = useSafeLink();

  const goRoute = () => {
    goLink('./login');
  };

  useEffect(() => {
    const mockValue = new RandomString(6);
    let i = 0;
    while (++i <= 12) { setWords(state => [...state, mockValue.random()]) }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(state => {
        if (state > 0) return (state - 1);
        else {
          clearInterval(interval);
          return state;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
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
      <button
        disabled={timer !== 0}
        className={formatClass(['wallet_backup_button', timer === 0 && 'wallet_backup_button_success'])}
        onClick={goRoute}>
        <I18 text="backupSucceeded" />
        { timer !== 0 && `(${timer}s)` }
      </button>
    </ComponentsLayoutBase>
  );
};

export default PageWalletBackup;

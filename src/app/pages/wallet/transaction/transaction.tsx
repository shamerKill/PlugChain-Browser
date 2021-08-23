import React, { FC, useCallback, useEffect, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import ComConButton from '../../../components/control/button';

import './transaction.scss';
import { Link } from 'react-router-dom';
import { getEnvConfig, sleep, useSafeReplaceLink, verifyNumber, verifyPassword, walletDecode, walletTransfer, walletVerifyAddress } from '../../../../tools';
import useGetDispatch from '../../../../databases/hook';
import { InRootState } from '../../../../@types/redux';
import { fetchData } from '../../../../tools/ajax';
import { formatNumberStr, formatStringNum } from '../../../../tools/string';
import confirmTools from '../../../components/tools/confirm';
import alertTools from '../../../components/tools/alert';
import { NumberTools } from '../../../../tools/number';

const PageWalletTransaction: FC = () => {
  const goLink = useSafeReplaceLink();
  const [wallet] = useGetDispatch<InRootState['wallet']>('wallet');
  const [toAddress, setToAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [volume, setVolume] = useState('');
  const [fee, setFee] = useState('');
  const [password, setPassword] = useState('');
  const [transactionLoading ,setTransactionLoading] = useState(false);

  const verifyTransaction = () => {
    if (!walletVerifyAddress(toAddress)) return alertTools.create({ message: <I18 text="addressInputError" />, type: 'warning' });
    if (toAddress === wallet.address) return alertTools.create({ message: <I18 text="addressInputError" />, type: 'warning' });
    if (!verifyNumber(volume, true)) return alertTools.create({ message: <I18 text="volumeInputError" />, type: 'warning' });
    if (!verifyNumber(fee, true)) return alertTools.create({ message: <I18 text="feeInputError" />, type: 'warning' });
    if (new NumberTools(formatStringNum(balance)).cut(formatStringNum(volume)).cut(formatStringNum(fee)).get() < 0) return alertTools.create({ message: <I18 text="volumeInputError" />, type: 'warning' });
    if (!verifyPassword(password)) return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    setTransactionLoading(true);
    confirmTools.create({
      message: <I18 text="confirmTransition" />,
      success: transactionCallback,
      close: () => setTransactionLoading(false),
    });
  };

  const transactionCallback = useCallback(async () => {
    await sleep(0.1);
    let useWallet
    try {
      useWallet = await walletDecode( wallet.encryptionKey, password );
    } catch (err) {
      setTransactionLoading(false);
      return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    }
    const subOption = walletTransfer({wallet: useWallet, toAddress, volume, gasAll: fee, }).subscribe(data => {
      if (!data.loading) setTransactionLoading(false);
      if (data.success) {
        alertTools.create({ message: <I18 text="exeSuccess" />, type: 'success' });
        setToAddress('');
        setVolume('');
        setPassword('');
        setBalance(`${new NumberTools(formatStringNum(balance)).cut(formatStringNum(fee)).cut(formatStringNum(volume)).get()}`);
      } else if (data.error) {
        setBalance(`${new NumberTools(formatStringNum(balance)).cut(formatStringNum(fee)).get()}`);
        alertTools.create({ message: <I18 text="exeSuccess" />, type: 'success' });
      }
    });
    return () => subOption.unsubscribe();
  }, [fee, password, volume, toAddress, wallet.encryptionKey, balance]);

  const transactionAllBalance = () => {
    setVolume(`${new NumberTools(formatStringNum(balance)).cut(formatStringNum(fee)).get()}`);
  };

  useEffect(() => {
    if (!wallet.hasWallet) return goLink('./login');
    const pledgeSub = fetchData('GET', 'balance', { address: wallet.address, coin: getEnvConfig.APP_TOKEN_NAME }).subscribe(({ success, data }) => {
      if (success) setBalance(formatNumberStr(`${data.Balance}`));
    });
    const feeSub = fetchData('GET', 'tx_fee').subscribe(({success, data}) => {
      if (success) setFee(data);
    });
    return () => {
      feeSub.unsubscribe();
      pledgeSub.unsubscribe();
    };
  }, [wallet, goLink]);

  
  return (
    <ComponentsLayoutBase className="page_wallet_transaction">
      <div className="transaction_inner">
        <h2 className="page_wallet_title"><I18 text="transaction" /></h2>
        <div className="transaction_box">
          <p className="transaction_box_title"><I18 text="toAddress" /></p>
          <div className="transaction_box_label">
            <input
              className="transaction_box_input"
              type="text"
              disabled={transactionLoading}
              value={toAddress}
              onChange={e => setToAddress(e.target.value)} />
          </div>
          <p className="transaction_box_title"><I18 text="transactionNumber" /></p>
          <div className="transaction_box_label">
            <input
              className="transaction_box_input"
              type="number"
              disabled={transactionLoading}
              value={volume}
              onChange={e => setVolume(e.target.value)} />
            <p className="transaction_box_info">{ getEnvConfig.APP_TOKEN_NAME }</p>
          </div>
          <p className="transaction_box_tip">
            <I18 text="canTransactionNumber" />
            <span className="transaction_tip_primary">{balance}{ getEnvConfig.APP_TOKEN_NAME }</span>
            <button className="transaction_tip_button" onClick={transactionAllBalance}><I18 text="allTransaction" /></button>
          </p>
          <p className="transaction_box_title"><I18 text="feeNumber" /></p>
          <div className="transaction_box_label">
            <input
              className="transaction_box_input"
              type="number"
              disabled={true}
              value={fee}
              onChange={e => setFee(e.target.value)} />
            <p className="transaction_box_info">{ getEnvConfig.APP_TOKEN_NAME }</p>
          </div>
          <p className="transaction_box_title"><I18 text="password" /></p>
          <form>
            <div className="transaction_box_label">
              <input
                className="transaction_box_input"
                type="password"
                disabled={transactionLoading}
                value={password}
                onChange={e => setPassword(e.target.value)} />
              <Link className="transaction_box_forget" to="./reset"><I18 text="forgetPassword" /></Link>
            </div>
          </form>
          <ComConButton
            loading={transactionLoading}
            onClick={verifyTransaction}
            className="transaction_confirm_button">
            <I18 text="confirm" />
          </ComConButton>
        </div>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageWalletTransaction;

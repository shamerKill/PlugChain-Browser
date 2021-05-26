import { FC, useEffect, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import ComConButton from '../../../components/control/button';

import './transaction.scss';
import { Link } from 'react-router-dom';

const PageWalletTransaction: FC = () => {
  const [toAddress, setToAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [volume, setVolume] = useState('0');
  const [fee, setFee] = useState('0');
  const [password, setPassword] = useState('');
  const [transactionLoading ,setTransactionLoading] = useState(false);

  const verifyTransaction = () => {
    setTransactionLoading(true);
  };

  const transactionAllBalance = () => {
    setVolume(balance);
  };

  useEffect(() => {
    setBalance('100');
  }, []);

  
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
            <p className="transaction_box_info">ONP</p>
          </div>
          <p className="transaction_box_tip">
            <I18 text="canTransactionNumber" />
            <span className="transaction_tip_primary">{balance}ONP</span>
            <button className="transaction_tip_button" onClick={transactionAllBalance}><I18 text="allTransaction" /></button>
          </p>
          <p className="transaction_box_title"><I18 text="feeNumber" /></p>
          <div className="transaction_box_label">
            <input
              className="transaction_box_input"
              type="number"
              disabled={transactionLoading}
              value={fee}
              onChange={e => setFee(e.target.value)} />
            <p className="transaction_box_info">ONP</p>
          </div>
          <p className="transaction_box_title"><I18 text="password" /></p>
          <div className="transaction_box_label">
            <input
              className="transaction_box_input"
              type="password"
              disabled={transactionLoading}
              value={password}
              onChange={e => setPassword(e.target.value)} />
            <Link className="transaction_box_forget" to="./reset"><I18 text="forgetPassword" /></Link>
          </div>
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

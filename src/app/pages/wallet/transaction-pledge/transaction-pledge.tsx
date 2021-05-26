import { FC, useEffect, useState } from 'react';
import ComConSvg from '../../../components/control/icon';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';

import './transaction-pledge.scss';
import { Link } from 'react-router-dom';
import ComConButton from '../../../components/control/button';

type TypeNodeInfo = {
  avatar: string;
  name: string;
  address: string;
  rate: string;
  minVolume: string;
  pledgedVolume: string;
  fee: string;
};

const PageWalletTransactionPledge: FC = () => {
  const [nodeInfo, setNodeInfo] = useState<TypeNodeInfo>({
    avatar: '', name: '', address: '', rate: '', minVolume: '', pledgedVolume: '', fee: '',
  });
  const [balance, setBalance] = useState('');
  const [volume, setVolume] = useState('0');
  const [password, setPassword] = useState('');
  const [pledgeLoading ,setPledgeLoading] = useState(false);

  const verifyPledge = () => {
    setPledgeLoading(true);
  };

  const pledgeAllBalance = () => {
    setVolume(balance);
  };

  useEffect(() => {
    setBalance('100');
    setNodeInfo({
      avatar: require('../../../../assets/images/user_avatar.png'),
      name: 'Compass', address: '0x1f8dec5061b0d9bf17e5828f249142b39dab84b4',
      rate: '10.9%', minVolume: '100', pledgedVolume: '15,293,231.21', fee: '12',
    });
  }, []);

  return (
    <ComponentsLayoutBase className="page_transaction_pledge">
      <div className="pledge_header">
        <div className="header_account">
          <div className="account_user">
            <img src={nodeInfo.avatar} alt="avatar" className="account_avatar" />
            <span className="account_name">{ nodeInfo.name }</span>
          </div>
          <p className="account_address">
            <ComConSvg className="account_address_icon" xlinkHref="#icon-card" />
            { nodeInfo.address }
          </p>
        </div>
        <div className="account_info">
          <dl className="account_info_dl">
            <dt className="account_info_dt"><I18 text="willProfit" /></dt>
            <dd className="account_info_dd account_info_green">{ nodeInfo.rate }</dd>
          </dl>
          <dl className="account_info_dl">
            <dt className="account_info_dt"><I18 text="minPledgeVolume" /></dt>
            <dd className="account_info_dd">{ nodeInfo.minVolume }</dd>
          </dl>
          <dl className="account_info_dl">
            <dt className="account_info_dt"><I18 text="pledgeVolume" /></dt>
            <dd className="account_info_dd">{ nodeInfo.pledgedVolume }</dd>
          </dl>
          <dl className="account_info_dl">
            <dt className="account_info_dt"><I18 text="feeNumber" /></dt>
            <dd className="account_info_dd">{ nodeInfo.fee }</dd>
          </dl>
        </div>
      </div>
      <div className="pledge_content">
        <p className="pledge_box_title"><I18 text="pledgeNumber" /></p>
        <div className="pledge_box_label">
          <input
            className="pledge_box_input"
            type="number"
            disabled={pledgeLoading}
            value={volume}
            onChange={e => setVolume(e.target.value)} />
          <p className="pledge_box_info">ONP</p>
        </div>
        <p className="pledge_box_tip">
          <I18 text="canTransactionNumber" />
          <span className="pledge_tip_primary">{balance}ONP</span>
          <button className="pledge_tip_button" onClick={pledgeAllBalance}><I18 text="allTransaction" /></button>
        </p>
        <p className="pledge_box_title"><I18 text="feeNumber" />&nbsp;&nbsp;&nbsp;{nodeInfo.fee}&nbsp;ONP</p>
        <p className="pledge_box_title"><I18 text="password" /></p>
        <div className="pledge_box_label">
          <input
            className="pledge_box_input"
            type="password"
            disabled={pledgeLoading}
            value={password}
            onChange={e => setPassword(e.target.value)} />
          <Link className="pledge_box_forget" to="./reset"><I18 text="forgetPassword" /></Link>
        </div>
        <ComConButton
          loading={pledgeLoading}
          onClick={verifyPledge}
          className="pledge_confirm_button">
          <I18 text="confirm" />
        </ComConButton>
      </div>
      <div className="pledge_footer">
        <div className="pledge_footer_item"><span className="pledge_footer_span"><I18 text="pledgeMoreTip1" /></span></div>
        <div className="pledge_footer_item"><span className="pledge_footer_span"><I18 text="pledgeMoreTip2" /></span></div>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageWalletTransactionPledge;

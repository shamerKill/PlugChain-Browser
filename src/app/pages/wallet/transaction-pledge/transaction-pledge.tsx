import { FC, useEffect, useState } from 'react';
import ComConSvg from '../../../components/control/icon';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import multiavatar from '@multiavatar/multiavatar/dist/esm';

import './transaction-pledge.scss';
import { Link } from 'react-router-dom';
import ComConButton from '../../../components/control/button';
import { timer } from 'rxjs';
import alertTools from '../../../components/tools/alert';
import { getEnvConfig, useFormatSearch, useSafeLink } from '../../../../tools';
import useGetDispatch from '../../../../databases/hook';
import { InRootState } from '../../../../@types/redux';
import { fetchData } from '../../../../tools/ajax';
import { formatNumberStr, formatStringNum } from '../../../../tools/string';

type TypeNodeInfo = {
  avatar: string;
  name: string;
  address: string;
  rate: string;
  minVolume: string;
  pledgedVolume: string;
  toCut: string;
};

const PageWalletTransactionPledge: FC = () => {
  const goLink = useSafeLink();
  const [wallet] = useGetDispatch<InRootState['wallet']>('wallet');
  const nodeSearch = useFormatSearch<{id: string}>();
  const [fee, setFee] = useState('0');
  const [nodeInfo, setNodeInfo] = useState<TypeNodeInfo>({
    avatar: '', name: '', address: '', rate: '', minVolume: '', pledgedVolume: '', toCut: '',
  });
  const [balance, setBalance] = useState('');
  const [volume, setVolume] = useState('');
  const [password, setPassword] = useState('');
  const [pledgeLoading ,setPledgeLoading] = useState(false);

  const verifyPledge = () => {
    setPledgeLoading(true);
    timer(2000).subscribe(() => {
      alertTools.create({ message: <I18 text="pledgeSuccess" />, type: 'info'});
      goLink('/wallet/my-pledge');
    });
  };

  const pledgeAllBalance = () => {
    setVolume(`${formatStringNum(balance)}`);
  };

  useEffect(() => {
    if (!wallet.hasWallet) return goLink('./login');
    const balanceSub = fetchData('GET', 'balance', { address: wallet.address, coin: getEnvConfig.APP_TOKEN_NAME }).subscribe(({ success, data }) => {
      if (success) setBalance(formatNumberStr(`${data.Balance}`));
    });
    return () => {
      balanceSub.unsubscribe();
    };
  }, [wallet, goLink]);

  useEffect(() => {
    if (!nodeSearch) return;
    if (!nodeSearch.id) return goLink('./pledge');
    const nodeInfoSub = fetchData('GET', '/validatorByAddress', { operator_address: nodeSearch.id }).subscribe(({ success, data}) => {
      if (success) {
        setNodeInfo({
          avatar: multiavatar(data.description.moniker) as any as string,
          name: data.description.moniker,
          // TODO: no year rate
          rate: '0.00%',
          pledgedVolume: formatNumberStr(`${parseFloat(data.delegator_shares)}`),
          minVolume: formatNumberStr(`${parseFloat(data.min_self_delegation)}`),
          address: data.operator_address,
          toCut: `${(data.commission.commission_rates.rate * 100).toFixed(2)}%`,
        });
      }
    });
    return () => nodeInfoSub.unsubscribe();
  }, [nodeSearch, goLink]);

  return (
    <ComponentsLayoutBase className="page_transaction_pledge">
      <div className="pledge_header">
        <div className="header_account">
          <div className="account_user">
            <div className="account_avatar" dangerouslySetInnerHTML={{__html: nodeInfo.avatar}}></div>
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
            <dt className="account_info_dt"><I18 text="toCut" /></dt>
            <dd className="account_info_dd">{ nodeInfo.toCut }</dd>
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
          <p className="pledge_box_info">PLUG</p>
        </div>
        <p className="pledge_box_tip">
          <I18 text="canTransactionNumber" />
          <span className="pledge_tip_primary">{balance}PLUG</span>
          <button className="pledge_tip_button" onClick={pledgeAllBalance}><I18 text="allTransaction" /></button>
        </p>
        <p className="pledge_box_title"><I18 text="feeNumber" /></p>
        <div className="pledge_box_label">
          <input
            className="pledge_box_input"
            type="number"
            disabled={pledgeLoading}
            value={fee}
            onChange={e => setFee(e.target.value)} />
        </div>
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

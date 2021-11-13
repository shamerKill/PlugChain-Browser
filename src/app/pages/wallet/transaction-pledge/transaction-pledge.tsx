import { FC, useCallback, useEffect, useState } from 'react';
import ComConSvg from '../../../components/control/icon';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';

import './transaction-pledge.scss';
import { Link } from 'react-router-dom';
import ComConButton from '../../../components/control/button';
import alertTools from '../../../components/tools/alert';
import { getEnvConfig, sleep, useFormatSearch, useSafeLink, verifyNumber, verifyPassword, walletAmountToToken, walletChainReward, walletDecode, walletDelegate } from '../../../../tools';
import useGetDispatch from '../../../../databases/hook';
import { InRootState } from '../../../../@types/redux';
import { fetchData } from '../../../../tools/ajax';
import { formatNumberStr, formatStringNum } from '../../../../tools/string';
import confirmTools from '../../../components/tools/confirm';
import { NumberTools } from '../../../../tools/number';

type TypeNodeInfo = {
  avatar: string;
  name: string;
  address: string;
  rate: string;
  minVolume: string;
  pledgedVolume: string;
  toCut: string;
  type: number; // 0 invalid / 1 off-line / 2 backing / 3 running
};

const PageWalletTransactionPledge: FC = () => {
  const goLink = useSafeLink();
  const [wallet] = useGetDispatch<InRootState['wallet']>('wallet');
  const nodeSearch = useFormatSearch<{id: string, link: string}>();
  const [nodeInfo, setNodeInfo] = useState<TypeNodeInfo>({
    avatar: '', name: '', address: '', rate: '', minVolume: '', pledgedVolume: '', toCut: '', type: 3,
  });
  const [balance, setBalance] = useState('');
  const [volume, setVolume] = useState('');
  const [fee, setFee] = useState('');
  const [password, setPassword] = useState('');
  const [pledgeLoading ,setPledgeLoading] = useState(false);
  const [showStaking, setShowStaking] = useState(false);


  const verifyPledge = () => {
    if (nodeInfo.type === 3) verifyPledgeForm();
    else confirmTools.create({
      message: (
        <>
          <h2 className="node-tip-title"><I18 text="nodeWarningTipTitle" /></h2>
          <p className="node-tip-message">{ nodeInfo.type === 1 ? <I18 text="nodeWarningTipMessage1" /> : <I18 text="nodeWarningTipMessage2" /> }</p>
        </>
      ),
      success: () => setTimeout(() => verifyPledgeForm(), 200),
      close: () => {}
    });
  };

  const verifyPledgeForm = () => {
    if (!verifyNumber(volume, true)) return alertTools.create({ message: <I18 text="volumeInputError" />, type: 'warning' });
    if (!verifyNumber(fee, true)) return alertTools.create({ message: <I18 text="feeInputError" />, type: 'warning'});
    if (new NumberTools(formatStringNum(balance)).cut(formatStringNum(volume)).cut(formatStringNum(fee)).get() < 0) return alertTools.create({ message: <I18 text="volumeInputError" />, type: 'warning' });
    if (new NumberTools(formatStringNum(volume)).cut(formatStringNum(nodeInfo.minVolume)).get() < 0) return alertTools.create({ message: <I18 text="volumeInputMinError" />, type: 'warning' });
    if (!verifyPassword(password)) return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning'});
    setPledgeLoading(true);
    confirmTools.create({
      message: <I18 text="confirmDelegate" />,
      success: submitPledge,
      close: () => setPledgeLoading(false),
    });
  };

  const submitPledge = useCallback(async () => {
    await sleep(0.1);
    let useWallet
    try {
      useWallet = await walletDecode( wallet.encryptionKey, password );
    } catch (err) {
      setPledgeLoading(false);
      return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    }
    const subOption = walletDelegate({ wallet: useWallet, validatorAddress: nodeInfo.address, volume: volume, gasAll: fee }, 'delegate').subscribe(data => {
      if (!data.loading) setPledgeLoading(false);
      if (data.success) {
        alertTools.create({ message: <I18 text="exeSuccess" />, type: 'success' });
        goLink('/wallet/my-pledge');
      } else if (data.error) {
        setBalance(`${new NumberTools(formatStringNum(balance)).cut(formatStringNum(fee)).get()}`);
        alertTools.create({ message: <p><I18 text="exeError" /><br />{ data.result }</p>, type: 'error' });
      }
    });
    return () => subOption.unsubscribe();
  }, [fee, nodeInfo.address, password, volume, wallet.encryptionKey, goLink, balance]);

  const pledgeAllBalance = () => {
    confirmTools.create({
      message: <p><I18 text="allAmountUseInfo" /></p>,
      success: () => setVolume(`${new NumberTools(formatStringNum(balance)).cut(formatStringNum(fee)).get()}`),
      close: () => {},
    });
  };

  useEffect(() => {
    // if (!wallet.hasWallet) return goLink('./login');
    const balanceSub = fetchData('GET', 'balance', { address: wallet.address, coin: getEnvConfig.APP_TOKEN_NAME }).subscribe(({ success, data }) => {
      if (success) setBalance(formatNumberStr(`${data.Balance}`));
    });
    const feeSub = fetchData('GET', 'tx_fee').subscribe(({success, data}) => {
      if (success) setFee(data);
    });
    return () => {
      feeSub.unsubscribe();
      balanceSub.unsubscribe();
    };
  }, [wallet, goLink]);

  useEffect(() => {
    if (!nodeSearch) return;
    if (!nodeSearch.id) return goLink('./pledge');
    const nodeInfoSub = fetchData('GET', '/validatorByAddress', { operator_address: nodeSearch.id }).subscribe(async ({ success, data}) => {
      if (success) {
        const obj = {
          avatar: data.description.image ? `${getEnvConfig.STATIC_URL}/${data.operator_address}/image.png` : `${getEnvConfig.STATIC_URL}/default/image.png`,
          name: data.description.moniker,
          rate: `${await (walletChainReward(parseFloat(`${data.commission.commission_rates.rate}`)))}%`,
          pledgedVolume: formatNumberStr(walletAmountToToken(`${parseFloat(data.tokens)}`)),
          minVolume: formatNumberStr(walletAmountToToken(`${parseFloat(data.min_self_delegation)}`)),
          address: data.operator_address,
          toCut: `${(data.commission.commission_rates.rate * 100).toFixed(2)}%`,
          type: 3,
        };
        switch(data.status) {
          case 'BOND_STATUS_UNSPECIFIED':
            obj.type = 0; break;
          case 'BOND_STATUS_UNBONDED':
            obj.type = 1; break;
          case 'BOND_STATUS_UNBONDING':
            obj.type = 2; break;
          case 'BOND_STATUS_BONDED':
            obj.type = 3; break;
        }
        setNodeInfo(obj);
      }
    });
    return () => nodeInfoSub.unsubscribe();
  }, [nodeSearch, goLink]);

  useEffect(() => {
    if (nodeSearch?.link !== 'true') setShowStaking(true);
    else setShowStaking(false);
  }, [nodeSearch]);

  return (
    <ComponentsLayoutBase className="page_transaction_pledge">
      <div className="pledge_header">
        <div className="header_account">
          <div className="account_user">
            <img className="account_avatar" alt={nodeInfo.name} src={nodeInfo.avatar} />
            <span className="account_name">
              { nodeInfo.name }
              { nodeInfo.type === 0 && (<i className="account_node_mark account_node_error"><I18 text="nodeInvalid" /></i>) }
              { nodeInfo.type === 1 && (<i className="account_node_mark account_node_warning"><I18 text="nodeOffLine" /></i>) }
              { nodeInfo.type === 2 && (<i className="account_node_mark account_node_warning"><I18 text="nodeJailed" /></i>) }
            </span>
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
      {
        wallet.hasWallet && showStaking && (
        <>
          <div className="pledge_content">
          <p className="pledge_box_title"><I18 text="pledgeNumber" /></p>
          <div className="pledge_box_label">
            <input
              className="pledge_box_input"
              type="number"
              disabled={pledgeLoading}
              value={volume}
              onChange={e => setVolume(e.target.value)} />
            <p className="pledge_box_info">{ getEnvConfig.APP_TOKEN_NAME_VIEW }</p>
          </div>
          <p className="pledge_box_tip">
            <I18 text="canTransactionNumber" />
            <span className="pledge_tip_primary">{balance}{ getEnvConfig.APP_TOKEN_NAME_VIEW }</span>
            <button className="pledge_tip_button" onClick={pledgeAllBalance}><I18 text="allTransaction" /></button>
          </p>
          <p className="pledge_box_title"><I18 text="feeNumber" /></p>
          <div className="pledge_box_label">
            <input
              className="pledge_box_input"
              type="number"
              disabled={true}
              value={fee}
              onChange={e => setFee(e.target.value)} />
            <p className="pledge_box_info">{ getEnvConfig.APP_TOKEN_NAME_VIEW }</p>
          </div>
          <p className="pledge_box_title"><I18 text="password" /></p>
          <form>
            <div className="pledge_box_label">
              <input
                className="pledge_box_input"
                type="password"
                disabled={pledgeLoading}
                value={password}
                onChange={e => setPassword(e.target.value)} />
              <Link className="pledge_box_forget" to="./reset"><I18 text="forgetPassword" /></Link>
            </div>
          </form>
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
        </>
        )
      }
      {
        wallet.hasWallet && !showStaking && (
          <ComConButton
            onClick={() => setShowStaking(true)}
            className="pledge_confirm_button pledge_step_button">
            <I18 text="delegate" />
          </ComConButton>
        )
      }
    </ComponentsLayoutBase>
  );
};

export default PageWalletTransactionPledge;

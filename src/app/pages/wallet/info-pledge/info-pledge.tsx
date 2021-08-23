import React, { FC, useCallback, useEffect, useState } from 'react';
import { formatClass, getEnvConfig, getOnlyId, sleep, useFormatSearch, useSafeLink, verifyNumber, verifyPassword, walletAmountToToken, walletChainReward, walletDecode, walletDelegate } from '../../../../tools';
import ComConSvg from '../../../components/control/icon';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import ComConButton from '../../../components/control/button';
import alertTools from '../../../components/tools/alert';
import useGetDispatch from '../../../../databases/hook';
import { InRootState } from '../../../../@types/redux';
import { fetchData } from '../../../../tools/ajax';
import { formatNumberStr, formatStringNum } from '../../../../tools/string';
import confirmTools from '../../../components/tools/confirm';
import { Link } from 'react-router-dom';

import './info-pledge.scss';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { Subscription } from 'rxjs';
import { NumberTools } from '../../../../tools/number';

type TypePledgeNodeInfo = {
  avatar: any;
  name: string;
  address: string;
  pledged: string;
  rewardRate: string;
  earned: string;
  type: number; // 0 invalid / 1 off-line / 2 backing / 3 running
};

type TypeNodesInfo = {
  avatar: string;
  name: string;
  rate: string;
  pledgedVolume: string;
  minVolume: string;
  address: string;
  type: number; // 0 invalid / 1 off-line / 2 backing / 3 running
};

const PageInfoPledge: FC = () => {
  const search = useFormatSearch<{id: string}>();
  const goLink = useSafeLink();
  const [wallet] = useGetDispatch<InRootState['wallet']>('wallet');
  const [pledgeNodeInfo, setPledgeNodeInfo] = useState<TypePledgeNodeInfo>({
    avatar: '', name: '', address: '', pledged: '', rewardRate: '', earned: '', type: 3,
  });
  const [balance, setBalance] = useState('');
  const [volume, setVolume] = useState('');
  const [fee, setFee] = useState('');
  const [password, setPassword] = useState('');
  const [nodes, setNodes] = useState<TypeNodesInfo[]>();
  
  const [showPass, setShowPass] = useState(false);
  const [exeLoading, setExeLoading] = useState(false);
  const [showNodes, setShowNodes] = useState(false);
  const [nodeSelected, setNodeSelected] = useState<number>(0);
  const [showReward, setShowReward] = useState(false);

  const backupToken = () => {
    if (!showPass || showNodes || showReward) {
      setShowNodes(false);
      setShowReward(false);
      return setShowPass(true);
    }
    if (!verifyNumber(volume, true)) return alertTools.create({ message: <I18 text="volumeInputError" />, type: 'warning' });
    if (!verifyNumber(fee, true)) return alertTools.create({ message: <I18 text="feeInputError" />, type: 'warning' });
    if (new NumberTools(formatStringNum(pledgeNodeInfo.pledged)).cut(formatStringNum(volume)).get() < 0) return alertTools.create({ message: <I18 text="volumeInputError" />, type: 'warning' });
    if (new NumberTools(formatStringNum(balance)).cut(formatStringNum(fee)).get() < 0) return alertTools.create({ message: <I18 text="feeInputError" />, type: 'warning' });
    if (!verifyPassword(password)) return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    setExeLoading(true);
    confirmTools.create({
      message: <I18 text="exeConfirm" />,
      success: () => submitBackup(),
      close: () => setExeLoading(false),
    });
  };
  const submitBackup = useCallback(async () => {
    await sleep(0.1);
    let useWallet: DirectSecp256k1HdWallet
    try {
      useWallet = await walletDecode( wallet.encryptionKey, password );
    } catch (err) {
      setExeLoading(false);
      return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    }
    let subOption: Subscription;
    if (volume === pledgeNodeInfo.pledged) {
      subOption = walletDelegate({ wallet: useWallet, validatorAddress: pledgeNodeInfo.address, volume: volume, gasAll: fee }, 'withdrawRewards').subscribe(data => {
        if (data.success) {
          subOption.unsubscribe();
          subOption = walletDelegate({ wallet: useWallet, validatorAddress: pledgeNodeInfo.address, volume: volume, gasAll: fee }, 'unDelegate').subscribe(res => {
            if (!res.loading) setExeLoading(false);
            if (res.success) {
              alertTools.create({ message: <I18 text="exeSuccess" />, type: 'success' });
              goLink('/wallet/my-pledge');
            } else if (res.error) {
              alertTools.create({ message: <p><I18 text="exeError" /><br />{res.result}</p>, type: 'error', time: 0 });
              setBalance(`${new NumberTools(formatStringNum(balance)).cut(formatStringNum(fee)).get()}`);
            }
          });
        } else if (data.error) {
          setExeLoading(false);
          setBalance(`${new NumberTools(formatStringNum(balance)).cut(formatStringNum(fee)).get()}`);
          alertTools.create({ message: <p><I18 text="exeError" /><br />{data.result}</p>, type: 'error', time: 0 });
        }
      });
    } else {
      subOption = walletDelegate({ wallet: useWallet, validatorAddress: pledgeNodeInfo.address, volume: volume, gasAll: fee }, 'unDelegate').subscribe(res => {
        if (!res.loading) setExeLoading(false);
        if (res.success) {
          alertTools.create({ message: <I18 text="exeSuccess" />, type: 'success' });
          goLink('/wallet/my-pledge');
        } else if (res.error) {
          setBalance(`${new NumberTools(formatStringNum(balance)).cut(formatStringNum(fee)).get()}`);
          alertTools.create({ message: <p><I18 text="exeError" /><br />{res.result}</p>, type: 'error', time: 0 });
        }
      });
    }
    return () => subOption.unsubscribe();
  }, [pledgeNodeInfo, goLink, password, wallet, fee, volume, balance]);

  const backupReward = () => {
    if (!showPass || showNodes || !showReward) {
      setShowNodes(false);
      setShowReward(true);
      return setShowPass(true);
    }
    if (!verifyNumber(fee, true)) return alertTools.create({ message: <I18 text="feeInputError" />, type: 'warning' });
    if (new NumberTools(formatStringNum(balance)).cut(formatStringNum(fee)).get() < 0) return alertTools.create({ message: <I18 text="feeInputError" />, type: 'warning' });
    if (!verifyPassword(password)) return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    setExeLoading(true);
    confirmTools.create({
      message: <I18 text="exeConfirm" />,
      success: () => submitReward(),
      close: () => setExeLoading(false),
    });
  };
  const submitReward = useCallback(async () => {
    await sleep(0.1);
    let useWallet
    try {
      useWallet = await walletDecode( wallet.encryptionKey, password );
    } catch (err) {
      setExeLoading(false);
      return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    }
    const subOption = walletDelegate({ wallet: useWallet, validatorAddress: pledgeNodeInfo.address, volume: volume, gasAll: fee }, 'withdrawRewards').subscribe(data => {
      if (!data.loading) setExeLoading(false);
      if (data.success) {
        alertTools.create({ message: <I18 text="exeSuccess" />, type: 'success' });
        goLink('/wallet/my-pledge');
      } else if (data.error) {
        setBalance(`${new NumberTools(parseFloat(balance)).cut(parseFloat(fee)).get()}`);
        alertTools.create({ message: <p><I18 text="exeError" /><br />{data.result}</p>, type: 'error', time: 0 });
      }
    });
    return () => subOption.unsubscribe();
  }, [pledgeNodeInfo, goLink, password, wallet, fee, volume, balance]);

  const changeNodeSelected = (index: number) => {
    setNodeSelected(index);
  }
  const rePledgeToken = () => {
    if (!showNodes || showReward) {
      setShowNodes(true);
      setShowPass(true);
      setShowReward(false);
      return;
    }
    if (!nodes?.[nodeSelected]) return alertTools.create({ message: <I18 text="exeError" />, type: 'warning' });
    if (nodes?.[nodeSelected].type === 3) rePledgeTokenVerify();
    else confirmTools.create({
      message: (
        <>
          <h2 className="node-tip-title"><I18 text="nodeWarningTipTitle" /></h2>
          <p className="node-tip-message">{ nodes?.[nodeSelected].type === 1 ? <I18 text="nodeWarningTipMessage1" /> : <I18 text="nodeWarningTipMessage2" /> }</p>
        </>
      ),
      success: () => setTimeout(() => rePledgeTokenVerify(), 200),
      close: () => {}
    });
  }
  const rePledgeTokenVerify = () => {
    if (!verifyNumber(volume, true)) return alertTools.create({ message: <I18 text="volumeInputError" />, type: 'warning' });
    if (!verifyNumber(fee, true)) return alertTools.create({ message: <I18 text="feeInputError" />, type: 'warning' });
    if (new NumberTools(formatStringNum(pledgeNodeInfo.pledged)).cut(formatStringNum(volume)).get() < 0) return alertTools.create({ message: <I18 text="volumeInputError" />, type: 'warning' });
    if (new NumberTools(formatStringNum(balance)).cut(formatStringNum(fee)).get() < 0) return alertTools.create({ message: <I18 text="feeInputError" />, type: 'warning' });
    if (!verifyPassword(password)) return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    setExeLoading(true);
    confirmTools.create({
      message: <I18 text="exeConfirm" />,
      success: submitRePledgeToken,
      close: () => setExeLoading(false),
    });
  };
  const submitRePledgeToken = useCallback(async () => {
    await sleep(0.1);
    let useWallet
    try {
      useWallet = await walletDecode( wallet.encryptionKey, password );
    } catch (err) {
      setExeLoading(false);
      return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    }
    const subOption = walletDelegate({ wallet: useWallet, validatorAddress: pledgeNodeInfo.address, volume: volume, gasAll: fee, reDelegateAddress: nodes?.[nodeSelected].address }, 'reDelegate').subscribe(data => {
      if (!data.loading) setExeLoading(false);
      if (data.success) {
        alertTools.create({ message: <I18 text="exeSuccess" />, type: 'success' });
        goLink('/wallet/my-pledge');
      } else if (data.error) {
        setBalance(`${new NumberTools(parseFloat(balance)).cut(parseFloat(fee)).get()}`);
        alertTools.create({ message: <p><I18 text="exeError" /><br />{data.result}</p>, type: 'error', time: 0 });
      }
    });
    return () => subOption.unsubscribe();
  }, [pledgeNodeInfo, goLink, password, wallet, fee, nodeSelected, nodes, volume, balance]);

  useEffect(() => {
    if (!wallet.hasWallet) return goLink('./login');
    if (!search) return;
    const pledgeSub = fetchData('GET', 'delegationsByAddress', { address: wallet.address }).subscribe(({ success, data }) => {
      if (success && data && data.length > 0) {
        data.forEach(async (node: any) => {
          if (node.operator_address === search.id) {
            const obj = {
              avatar: node.description.image ? `${getEnvConfig.STATIC_URL}/${node.operator_address}/image.png` : `${getEnvConfig.STATIC_URL}/default/image.png`,
              name: node.description.moniker,
              address: node.operator_address,
              pledged: formatNumberStr(`${parseFloat(walletAmountToToken(node.token || '0'))}`),
              rewardRate: `${await (walletChainReward(parseFloat(`${node.commission.commission_rates.rate}`)))}%`,
              earned: formatNumberStr(`${parseFloat(walletAmountToToken(node.my_reward || '0'))}`),
              type: 3,
            };
            switch(node.status) {
              case 'BOND_STATUS_UNSPECIFIED':
                obj.type = 0; break;
              case 'BOND_STATUS_UNBONDED':
                obj.type = 1; break;
              case 'BOND_STATUS_UNBONDING':
                obj.type = 2; break;
              case 'BOND_STATUS_BONDED':
                obj.type = 3; break;
            }
            setPledgeNodeInfo(obj);
          }
        });
      }
    });
    const feeSub = fetchData('GET', 'tx_fee').subscribe(({success, data}) => {
      if (success) setFee(data);
    });
    const balanceSub = fetchData('GET', 'balance', { address: wallet.address, coin: getEnvConfig.APP_TOKEN_NAME }).subscribe(({ success, data }) => {
      if (success) setBalance(`${data.Balance}`);
    });
    return () => {
      pledgeSub.unsubscribe();
      feeSub.unsubscribe();
      balanceSub.unsubscribe();
    };
  }, [wallet, goLink, search]);
  useEffect(() => {
    if (!showNodes || nodes) return;
    fetchData('GET', '/validators').subscribe(async ({ success, data }) => {
      if (success) {
        const resultArr: TypeNodesInfo[] = [];
        for (let i = 0; i < data.mininum.length; i++) {
          const node = data.mininum[i];
          const obj = {
            avatar: node.description.image ? `${getEnvConfig.STATIC_URL}/${node.operator_address}/image.png` : `${getEnvConfig.STATIC_URL}/default/image.png`,
            name: node.description.moniker,
            rate: `${await (walletChainReward(parseFloat(`${node.commission.commission_rates.rate}`)))}%`,
            pledgedVolume: formatNumberStr(walletAmountToToken(`${parseFloat(node.tokens)}`)),
            minVolume: formatNumberStr(walletAmountToToken(`${parseFloat(node.min_self_delegation)}`)),
            address: node.operator_address,
            type: 3,
          };
          switch(node.status) {
            case 'BOND_STATUS_UNSPECIFIED':
              obj.type = 0; break;
            case 'BOND_STATUS_UNBONDED':
              obj.type = 1; break;
            case 'BOND_STATUS_UNBONDING':
              obj.type = 2; break;
            case 'BOND_STATUS_BONDED':
              obj.type = 3; break;
          }
          resultArr.push(obj);
        }
        setNodes(resultArr.filter(node => node.address !== search?.id));
      }
    });
  }, [nodes, showNodes, search]);
  useEffect(() => {
    if (nodes?.length) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].type === 3) {
          setNodeSelected(i);
          break;
        }
      }
    }
  }, [nodes]);
  return (
    <ComponentsLayoutBase className="page_info_pledge">
      <div className="info_pledge_inner">
        <div className="header_account">
          <div className="account_user">
            <img className="account_avatar" src={ pledgeNodeInfo.avatar } alt={pledgeNodeInfo.name} />
            <span className="account_name">
              { pledgeNodeInfo.name }
              { pledgeNodeInfo.type === 0 && (<i className="account_node_mark account_node_error"><I18 text="nodeInvalid" /></i>) }
              { pledgeNodeInfo.type === 1 && (<i className="account_node_mark account_node_warning"><I18 text="nodeOffLine" /></i>) }
              { pledgeNodeInfo.type === 2 && (<i className="account_node_mark account_node_warning"><I18 text="nodeJailed" /></i>) }
            </span>
          </div>
          <p className="account_address">
            <ComConSvg className="account_address_icon" xlinkHref="#icon-card" />
            { pledgeNodeInfo.address }
          </p>
        </div>
        {/* info */}
        <div className="info_list">
          <div className="info_item_box">
            <dl className="info_item_dl">
              <dt className="info_item_dt">{ pledgeNodeInfo.pledged }&nbsp;<small className="info_item_small">{ getEnvConfig.APP_TOKEN_NAME }</small></dt>
              <dd className="info_item_dd"><I18 text="pledged" /></dd>
            </dl>
          </div>
          <div className="info_item_box">
          <dl className="info_item_dl">
            <dt className="info_item_dt">{ pledgeNodeInfo.rewardRate }</dt>
            <dd className="info_item_dd"><I18 text="willProfit" /></dd>
          </dl>
          </div>
          <div className="info_item_box">
            <dl className="info_item_dl">
              <dt className="info_item_dt">{ pledgeNodeInfo.earned }&nbsp;<small className="info_item_small">{ getEnvConfig.APP_TOKEN_NAME }</small></dt>
              <dd className="info_item_dd"><I18 text="earned" /></dd>
            </dl>
          </div>
        </div>
        {/* nodes */}
        { showNodes && (
          <div className="pledge_list">
            <div className="pledge_node_title"><I18 text="changePledgeNode" /></div>
            <div className="pledge_nodes">
              {
                nodes?.map((node, index) => (
                  <div
                    className={formatClass(['pledge_node', nodeSelected === index && 'pledge_node_selected'])}
                    key={getOnlyId()}
                    onClick={() => changeNodeSelected(index)}>
                    <div className="pledge_node_inner">
                      { node.type === 0 && (<div className="pledge_node_mark pledge_node_error"><I18 text="nodeInvalid" /></div>) }
                      { node.type === 1 && (<div className="pledge_node_mark pledge_node_warning"><I18 text="nodeOffLine" /></div>) }
                      { node.type === 2 && (<div className="pledge_node_mark pledge_node_warning"><I18 text="nodeJailed" /></div>) }
                      { node.type === 3 && (<div className="pledge_node_mark"><I18 text="nodeRunning" /></div>) }
                      <div className="pledge_node_header">
                        <img className="node_avatar" src={ node.avatar } alt={node.name} />
                        <Link className="node_name" to={`/wallet/transaction-pledge?id=${node.address}`}>{node.name}</Link>
                      </div>
                      <div className="pledge_node_content">
                        <div className="pledge_node_info">
                          <dl className="pledge_node_dl">
                            <dt className="pledge_node_dt">{node.rate}</dt>
                            <dt className="pledge_node_dd"><I18 text="willProfit" /></dt>
                          </dl>
                          <dl className="pledge_node_dl">
                            <dt className="pledge_node_dt">{node.pledgedVolume}</dt>
                            <dt className="pledge_node_dd"><I18 text="pledgeVolume" />({ getEnvConfig.APP_TOKEN_NAME })</dt>
                          </dl>
                          <dl className="pledge_node_dl">
                            <dt className="pledge_node_dt">{node.minVolume}</dt>
                            <dt className="pledge_node_dd"><I18 text="minPledgeVolume" />({ getEnvConfig.APP_TOKEN_NAME })</dt>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        ) }
        {/* password */}
        {showPass && (
          <div className="transaction_box">
            {
              !showReward && (
                <React.Fragment>
                  <p className="transaction_box_title"><I18 text="transactionNumber" /></p>
                  <div className="transaction_box_label">
                    <input
                      className="transaction_box_input"
                      type="number"
                      disabled={exeLoading}
                      value={volume}
                      onChange={e => setVolume(e.target.value)} />
                    <p className="transaction_box_info">{ getEnvConfig.APP_TOKEN_NAME }</p>
                  </div>
                </React.Fragment>
              )
            }
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
                  value={password}
                  disabled={exeLoading}
                  onChange={e => setPassword(e.target.value)} />
                <Link className="transaction_box_forget" to="./reset"><I18 text="forgetPassword" /></Link>
              </div>
            </form>
          </div>
        )}
        <div className="info_buttons">
          <ComConButton
            className="info_button"
            disabled={exeLoading}
            loading={exeLoading}
            onClick={() => backupToken()}>
            <ComConSvg className="info_button_icon" xlinkHref="#icon-redeem" />
            <I18 text="redeemAll" />
          </ComConButton>
          <ComConButton
            className="info_button"
            disabled={exeLoading}
            loading={exeLoading}
            onClick={() => backupReward()}
            contrast>
            <ComConSvg className="info_button_icon" xlinkHref="#icon-transfer" />
            <I18 text="redeemRewards" />
          </ComConButton>
          <ComConButton
            className="info_button"
            disabled={exeLoading}
            loading={exeLoading}
            onClick={() => rePledgeToken()}
            contrast>
            <ComConSvg className="info_button_icon" xlinkHref="#icon-transfer" />
            <I18 text="changePledge" />
          </ComConButton>
        </div>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageInfoPledge;

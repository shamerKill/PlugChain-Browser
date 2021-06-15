import React, { FC, useCallback, useEffect, useState } from 'react';
import { formatClass, getOnlyId, sleep, useFormatSearch, useSafeLink, verifyNumber, verifyPassword, walletAmountToToken, walletDecode, walletDelegate } from '../../../../tools';
import ComConSvg from '../../../components/control/icon';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import multiavatar from '@multiavatar/multiavatar/dist/esm';
import ComConButton from '../../../components/control/button';
import alertTools from '../../../components/tools/alert';
import useGetDispatch from '../../../../databases/hook';
import { InRootState } from '../../../../@types/redux';
import { fetchData } from '../../../../tools/ajax';
import { formatNumberStr } from '../../../../tools/string';
import confirmTools from '../../../components/tools/confirm';
import { Link } from 'react-router-dom';

import './info-pledge.scss';

type TypePledgeNodeInfo = {
  avatar: any;
  name: string;
  address: string;
  pledged: string;
  rewardRate: string;
  earned: string;
};

type TypeNodesInfo = {
  avatar: string;
  name: string;
  rate: string;
  pledgedVolume: string;
  minVolume: string;
  address: string;
};

const PageInfoPledge: FC = () => {
  const search = useFormatSearch<{id: string}>();
  const goLink = useSafeLink();
  const [wallet] = useGetDispatch<InRootState['wallet']>('wallet');
  const [pledgeNodeInfo, setPledgeNodeInfo] = useState<TypePledgeNodeInfo>({
    avatar: '', name: '', address: '', pledged: '', rewardRate: '', earned: '',
  });
  const [volume, setVolume] = useState('');
  const [fee, setFee] = useState('');
  const [password, setPassword] = useState('');
  const [nodes, setNodes] = useState<TypeNodesInfo[]>();
  
  const [showPass, setShowPass] = useState(false);
  const [exeLoading, setExeLoading] = useState(false);
  const [showNodes, setShowNodes] = useState(false);
  const [nodeSelected, setNodeSelected] = useState<number>(0);

  const backupToken = () => {
    if (!showPass) return setShowPass(true);
    if (!verifyNumber(volume, true)) return alertTools.create({ message: <I18 text="volumeInputError" />, type: 'warning' });
    if (!verifyNumber(fee, true)) return alertTools.create({ message: <I18 text="feeInputError" />, type: 'warning' });
    if (!verifyPassword(password)) return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    setExeLoading(true);
    confirmTools.create({
      message: <I18 text="exeConfirm" />,
      success: submitBackup,
      close: () => setExeLoading(false),
    });
  };
  const submitBackup = useCallback(async () => {
    await sleep(0.1);
    let useWallet
    try {
      useWallet = await walletDecode( wallet.encryptionKey, password );
    } catch (err) {
      setExeLoading(false);
      return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    }
    const subOption = walletDelegate({ wallet: useWallet, validatorAddress: pledgeNodeInfo.address, volume: pledgeNodeInfo.pledged, gasAll: fee }, 'unDelegate').subscribe(data => {
      if (!data.loading) setExeLoading(false);
      if (data.success) {
        alertTools.create({ message: <I18 text="exeSuccess" />, type: 'success' });
        goLink('/wallet/my-pledge');
      } else if (data.error) {
        alertTools.create({ message: <I18 text="exeSuccess" />, type: 'success' });
      }
    });
    return () => subOption.unsubscribe();
  }, [pledgeNodeInfo, goLink, password, wallet, fee]);

  const changeNodeSelected = (index: number) => {
    setNodeSelected(index);
  }
  const rePledgeToken = () => {
    if (!showNodes) {
      setShowNodes(true);
      setShowPass(true);
      return;
    }
    if (!nodes?.[nodeSelected]) return alertTools.create({ message: <I18 text="exeError" />, type: 'warning' });
    if (!verifyNumber(volume, true)) return alertTools.create({ message: <I18 text="volumeInputError" />, type: 'warning' });
    if (!verifyNumber(fee, true)) return alertTools.create({ message: <I18 text="feeInputError" />, type: 'warning' });
    if (!verifyPassword(password)) return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    setExeLoading(true);
    confirmTools.create({
      message: <I18 text="exeConfirm" />,
      success: submitRePledgeToken,
      close: () => setExeLoading(false),
    });
  }
  const submitRePledgeToken = useCallback(async () => {
    await sleep(0.1);
    let useWallet
    try {
      useWallet = await walletDecode( wallet.encryptionKey, password );
    } catch (err) {
      setExeLoading(false);
      return alertTools.create({ message: <I18 text="passwordError" />, type: 'warning' });
    }
    const subOption = walletDelegate({ wallet: useWallet, validatorAddress: pledgeNodeInfo.address, volume: pledgeNodeInfo.pledged, gasAll: fee, reDelegateAddress: nodes?.[nodeSelected].address }, 'reDelegate').subscribe(data => {
      if (!data.loading) setExeLoading(false);
      if (data.success) {
        alertTools.create({ message: <I18 text="exeSuccess" />, type: 'success' });
        goLink('/wallet/my-pledge');
      } else if (data.error) {
        alertTools.create({ message: <I18 text="exeSuccess" />, type: 'success' });
      }
    });
    return () => subOption.unsubscribe();
  }, [pledgeNodeInfo, goLink, password, wallet, fee, nodeSelected, nodes]);

  useEffect(() => {
    if (!wallet.hasWallet) return goLink('./login');
    if (!search) return;
    const pledgeSub = fetchData('GET', 'delegationsByAddress', { address: wallet.address }).subscribe(({ success, data }) => {
      if (success && data && data.length > 0) {
        data.forEach((node: any) => {
          if (node.description.moniker === search.id) {
            setPledgeNodeInfo({
              avatar: multiavatar(node.description.moniker),
              name: node.description.moniker,
              address: node.operator_address,
              pledged: formatNumberStr(`${parseFloat(walletAmountToToken(node.shares))}`),
              rewardRate: '0.00%',
              earned: formatNumberStr(`${parseFloat(walletAmountToToken(node.my_reward))}`),
            });
          }
        });
      }
    });
    return () => pledgeSub.unsubscribe();
  }, [wallet, goLink, search]);
  useEffect(() => {
    if (!showNodes || nodes) return;
    fetchData('GET', '/validators').subscribe(({ success, data }) => {
      if (success) {
        setNodes(data.mininum.filter((node: any) => node.description.moniker !== search?.id).map((node: any) => ({
          avatar: multiavatar(node.description.moniker),
          name: node.description.moniker,
          // TODO: no year rate
          rate: '0.00%',
          pledgedVolume: formatNumberStr(`${parseFloat(node.delegator_shares)}`),
          minVolume: formatNumberStr(`${parseFloat(node.min_self_delegation)}`),
          address: node.operator_address,
        })));
      }
      console.log(data);
    });
  }, [nodes, showNodes, search]);
  return (
    <ComponentsLayoutBase className="page_info_pledge">
      <div className="info_pledge_inner">
        <div className="header_account">
          <div className="account_user">
            <div className="account_avatar" dangerouslySetInnerHTML={{__html: pledgeNodeInfo.avatar}}></div>
            <span className="account_name">{ pledgeNodeInfo.name }</span>
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
              <dt className="info_item_dt">{ pledgeNodeInfo.pledged }&nbsp;<small className="info_item_small">PLUG</small></dt>
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
              <dt className="info_item_dt">{ pledgeNodeInfo.earned }&nbsp;<small className="info_item_small">PLUG</small></dt>
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
                      <div className="pledge_node_header">
                        <div className="node_avatar" dangerouslySetInnerHTML={{__html: node.avatar}}></div>
                        <Link className="node_name" to={`/wallet/transaction-pledge?id=${node.name}`}>{node.name}</Link>
                      </div>
                      <div className="pledge_node_content">
                        <div className="pledge_node_info">
                          <dl className="pledge_node_dl">
                            <dt className="pledge_node_dt">{node.rate}</dt>
                            <dt className="pledge_node_dd"><I18 text="willProfit" /></dt>
                          </dl>
                          <dl className="pledge_node_dl">
                            <dt className="pledge_node_dt">{node.pledgedVolume}</dt>
                            <dt className="pledge_node_dd"><I18 text="pledgeVolume" />(PLUG)</dt>
                          </dl>
                          <dl className="pledge_node_dl">
                            <dt className="pledge_node_dt">{node.minVolume}</dt>
                            <dt className="pledge_node_dd"><I18 text="minPledgeVolume" />(PLUG)</dt>
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
            <p className="transaction_box_title"><I18 text="transactionNumber" /></p>
            <div className="transaction_box_label">
              <input
                className="transaction_box_input"
                type="number"
                disabled={exeLoading}
                value={volume}
                onChange={e => setVolume(e.target.value)} />
              <p className="transaction_box_info">PLUG</p>
            </div>
            <p className="transaction_box_title"><I18 text="feeNumber" /></p>
            <div className="transaction_box_label">
              <input
                className="transaction_box_input"
                type="number"
                disabled={exeLoading}
                value={fee}
                onChange={e => setFee(e.target.value)} />
              <p className="transaction_box_info">PLUG</p>
            </div>
            <p className="transaction_box_title"><I18 text="password" /></p>
            <div className="transaction_box_label">
              <input
                className="transaction_box_input"
                type="password"
                value={password}
                disabled={exeLoading}
                onChange={e => setPassword(e.target.value)} />
              <Link className="transaction_box_forget" to="./reset"><I18 text="forgetPassword" /></Link>
            </div>
          </div>
        )}
        <div className="info_buttons">
          <ComConButton
            className="info_button"
            disabled={exeLoading}
            loading={exeLoading}
            onClick={backupToken}>
            <ComConSvg className="info_button_icon" xlinkHref="#icon-redeem" />
            <I18 text="redeem" />
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

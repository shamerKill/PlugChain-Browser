import { FC, useCallback, useEffect, useRef, useState } from 'react';
import ComponentsLayoutBase from '../../components/layout/base';
import I18 from '../../../i18n/component';
import useI18 from '../../../i18n/hooks';
import { HomeChainInfo, HomeNewsInfo } from './home-views';
import alertTools from '../../components/tools/alert';
import ComConSvg from '../../components/control/icon';
import { BehaviorSubject, timer, zip } from 'rxjs';

import './home.scss';
import { fetchData, zipAllSuccess } from '../../../tools/ajax';
import { switchMap } from 'rxjs/operators';
import { changeSeconds, formatTime } from '../../../tools/time';
import ComConLink from '../../components/control/link';
import { TypeComConTableContent } from '../../components/control/table.copy';
import { getOnlyId, useSafeLink, walletAmountToToken, walletVerifyAddress, walletVerifyUserAdd, walletVerifyVerAdd } from '../../../tools';
import { formatNumberStr } from '../../../tools/string';

export type TypePageHomeData = {
  blockHeight: string;
  transactionVolume: string;
  pendingBlockVolume: string;
  newBlockTransaction: string;
  transactionRate: number;
  price: string;
  priceRate: number;
  markValue: string;
  allTokenVolume: string;
  allPledge: string;
  pledgeRate: number;
  nowVolume: string; 
  historyMaxVolume: string;
  blockListTable: TypeComConTableContent;
  txsListTable: TypeComConTableContent;
};

const PageHome: FC = () => {
  const searchPlaceholder = useI18('searchPlaceholder');
  const goLink = useSafeLink();
  const [searchValue, setSearchValue] = useState('');
  const [ chainHeight, setChainHeight ] = useState('0');
  const homeDataObserve = useRef(new BehaviorSubject<TypePageHomeData>({
    blockHeight: '', transactionVolume: '', pendingBlockVolume: '', newBlockTransaction: '',
    transactionRate: 0, price: '', priceRate: 0, markValue: '', allTokenVolume: '',
    allPledge: '', pledgeRate: 0, nowVolume: '', historyMaxVolume: '',
    blockListTable: [], txsListTable: [],
  }));

  // searchData
  const searchCallback = useCallback(() => {
    if (searchValue === '') return alertTools.create({ message: <I18 text="no-data" />, time: 5000, type: 'error' });
    if (!Number.isNaN(Number(searchValue))) {
      if (Number(searchValue) <= Number(chainHeight)) return goLink(`/block/${searchValue}`);
      else return alertTools.create({ message: <I18 text="no-data" />, time: 5000, type: 'error' });
    }
    if (walletVerifyUserAdd(searchValue)) return goLink(walletVerifyAddress(searchValue));
    if (walletVerifyVerAdd(searchValue)) return goLink(walletVerifyAddress(searchValue));
    if (searchValue.length === 64) return goLink(`/transaction/${searchValue}`);
    alertTools.create({ message: <I18 text="undefined-data" />, time: 5000, type: 'error' });
  }, [searchValue, goLink, chainHeight]);

  const updateData = useCallback((obj: Partial<TypePageHomeData>) => homeDataObserve.current.next({ ...homeDataObserve.current.getValue(), ...obj }), []);

  useEffect(() => {
    // block List
    const getBlockList = timer(changeSeconds(0.1), changeSeconds(5)).pipe(switchMap(() => fetchData('GET', '/blockchain'))).subscribe(blockList => {
      if (blockList.status === 200) {
        updateData({ blockListTable: blockList.data.slice(0, 10).map((block: any) => ({
          key: getOnlyId(),
          value: [
            { key: getOnlyId(), value: <ComConLink link={`/block/${block.block_id}`}>{ block.block_id }</ComConLink> },
            { key: getOnlyId(), value: formatTime(block.time) },
            { key: getOnlyId(), value: <ComConLink link={walletVerifyAddress(block.address)}>{ block.address }</ComConLink> },
            { key: getOnlyId(), value: <ComConLink link={`/block/${block.block_id}`}>{ block.hash }</ComConLink> },
            { key: getOnlyId(), value: block.tx_num },
            // { key: getOnlyId(), value: block.tx_fee },
          ]
        })), blockHeight: blockList.data[0].block_id });
        setChainHeight(blockList.data[0].block_id);
      }
    });
    return () => getBlockList.unsubscribe();
  }, [updateData]);
  useEffect(() => {
    // txs List
    const getTxsList = timer(changeSeconds(0.1), changeSeconds(5)).pipe(switchMap(() => fetchData('GET', '/txs', { page: 1, limit: 10 }))).subscribe(txsList => {
      if (txsList.status === 200) updateData({ txsListTable: txsList.data.info.slice(0, 10).map((tx: any) => {
        let txError = tx.code !== 0;
        return {
          key: getOnlyId(),
          error: txError,
          value: [
            { key: getOnlyId(), value: <ComConLink link={`/transaction/${tx.hash}`}>{ tx.hash }</ComConLink> },
            { key: getOnlyId(), value: <ComConLink link={`/block/${tx.block_id}`}>{ tx.block_id }</ComConLink> },
            { key: getOnlyId(), value: formatTime(tx.create_time) },
            { key: getOnlyId(), value: <ComConLink link={walletVerifyAddress(tx.from)}>{ tx.from }</ComConLink> },
            { key: getOnlyId(), value: <ComConLink link={walletVerifyAddress(tx.to)}>{ tx.to }</ComConLink> },
            { key: getOnlyId(), value: tx.amount },
            { key: getOnlyId(), value: tx.fee },
          ]
        };
      })});
    });
    return () => getTxsList.unsubscribe();
  }, [updateData]);
  useEffect(() => {
    const getInfo = timer(changeSeconds(0.1), changeSeconds(5)).subscribe(() => zip([
      fetchData('GET', 'info'), fetchData('GET', 'num_unconfirmed_txs'), fetchData('GET', 'coin_info'),
    ]).pipe(zipAllSuccess()).subscribe(([info, unNum, coin]) => {
      if (unNum.success) updateData({ pendingBlockVolume: formatNumberStr(`${unNum.data}`) });
      if (coin.success) updateData({
        price: formatNumberStr(`${coin.data.price}`),
        priceRate: parseFloat(`${coin.data.price_drift_ratio}`),
        markValue: parseFloat(`${coin.data.total_price}`).toFixed(2),
        allTokenVolume: formatNumberStr(walletAmountToToken(`${coin.data.supply}`)),
        allPledge: formatNumberStr(walletAmountToToken(`${coin.data.staking}`)),
        pledgeRate: parseFloat(`${coin.data.staking_ratio}`),
      });
      if (info.success) updateData({
        blockHeight: formatNumberStr(`${info.data.block_num}`),
        nowVolume: formatNumberStr(`${info.data.avg_tx}`),
        historyMaxVolume: formatNumberStr(`${info.data.max_avg_tx}`),
        newBlockTransaction: formatNumberStr(`${info.data.tx_nums}`),
        transactionRate: info.data.ratio,
        transactionVolume: formatNumberStr(`${info.data.total_tx_num}`),
      });
    }));
    return () => getInfo.unsubscribe();
  }, [updateData]);
  
  return (
    <ComponentsLayoutBase className="home_page">
      {/* search */}
      <div className="home_header">
        <h1 className="header_title">
          <I18 text="PLUGBlockChainBrowser" />
        </h1>
        <div className="header_search">
          <input
            className="header_search_input"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={event => setSearchValue(event.target.value)} />
          <button className="header_search_btn" onClick={searchCallback}>
            <ComConSvg xlinkHref="#icon-search" />
          </button>
        </div>
      </div>
      {/* chainInfo */}
      <HomeChainInfo observerData={homeDataObserve.current} />
      {/* newInfo */}
      <HomeNewsInfo observerData={homeDataObserve.current} />
    </ComponentsLayoutBase>
  );
};

export default PageHome;

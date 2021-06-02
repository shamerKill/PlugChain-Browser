import { FC, useCallback, useEffect, useState } from 'react';
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
import { getOnlyId } from '../../../tools';

export type TypePageHomeData = {
  blockHeight: string;
  blockListTable: TypeComConTableContent,
};

const PageHome: FC = () => {
  const searchPlaceholder = useI18('searchPlaceholder');
  const [searchValue, setSearchValue] = useState('');
  const [homeDataObserve] = useState(new BehaviorSubject<TypePageHomeData>({
    blockHeight: '',
    blockListTable: [],
  }));

  // searchData
  const searchCallback = useCallback(() => {
    if (searchValue === '') return alertTools.create({ message: '没有内容', time: 5000, type: 'error' });
  }, [searchValue]);

  useEffect(() => {
    let maxHeight = Math.pow(10, 9);
    let minHeight = 0;
    const zipObserve = zip([
      timer(0, changeSeconds(5)).pipe(switchMap(() => fetchData('GET', '/blockchain', { minHeight: minHeight, maxHeight: maxHeight }))) // block chain info
    ]).pipe(zipAllSuccess()).subscribe(([blockChain]) => {
      const updateData = (obj: Partial<TypePageHomeData>) => homeDataObserve.next({ ...homeDataObserve.getValue(), ...obj });
      if (blockChain.status === 200) {
        console.log(blockChain.data);
        maxHeight = Number(blockChain.data.last_height) + 1;
        minHeight = maxHeight - 11;
        updateData({ blockHeight:  blockChain.data.last_height});
        updateData({ blockListTable: blockChain.data.block_metas.slice(0, 10).map((block: any) => ({
          key: getOnlyId(),
          value: [
            { key: getOnlyId(), value: <ComConLink link={`./block/${block.block_id.hash}`}>{ block.header.height }</ComConLink> },
            { key: getOnlyId(), value: formatTime(block.header.time) },
            { key: getOnlyId(), value: <ComConLink link={`./account/${block.header.proposer_address}`}>{ block.header.proposer_address }</ComConLink> },
            { key: getOnlyId(), value: <ComConLink link={`./block/${block.block_id.hash}`}>{ block.block_id.hash }</ComConLink> },
            { key: getOnlyId(), value: block.num_txs },
            { key: getOnlyId(), value: block.block_size, /** // TODO: don't have fee */},
          ]
        })) })
      }
    });
    return () => zipObserve.unsubscribe();
  }, [homeDataObserve]);
  
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
      <HomeChainInfo observerData={homeDataObserve} />
      {/* newInfo */}
      <HomeNewsInfo observerData={homeDataObserve} />
    </ComponentsLayoutBase>
  );
};

export default PageHome;

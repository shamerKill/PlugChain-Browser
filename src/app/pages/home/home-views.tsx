import { FC, useEffect, useMemo, useRef, useState } from 'react';
import I18 from '../../../i18n/component';
import { windowResizeObserver } from '../../../services/global.services';
import { formatClass, getEnvConfig, getOnlyId, useSafeLink } from '../../../tools';
import { DayTransactionVolume, TokenPledgeRate } from './home-components';
import { useLanguageHook } from '../../../services/config.services';
import { debounceTime, distinctUntilKeyChanged } from 'rxjs/operators';
import { BehaviorSubject, timer } from 'rxjs';
import ComConTable, { TypeComConTableHeader, TypeComConTableContent } from '../../components/control/table.copy';
import ComConSvg from '../../components/control/icon';
import { formatNumberStr } from '../../../tools/string';
import { TypePageHomeData } from './home';

import './home.scss';

export const HomeChainInfo: FC<{observerData: BehaviorSubject<TypePageHomeData>}> = ({ observerData }) => {
  const goLink = useSafeLink();
  const [infoData, setInfoData] = useState<{
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
  }>({
    blockHeight: '', transactionVolume: '', pendingBlockVolume: '', newBlockTransaction: '',
    transactionRate: 0, price: '', priceRate: 0, markValue: '', allTokenVolume: '',
    allPledge: '', pledgeRate: 0, nowVolume: '', historyMaxVolume: '',
  });

  const DayTransactionVolumeView = useMemo(() => <DayTransactionVolume />, []);
  const TokenPledgeRateView = useMemo(() => <TokenPledgeRate pledgeRate={infoData.pledgeRate} />, [infoData.pledgeRate]);

  useEffect(() => {
    const unObserve = observerData.subscribe(data => {
      let resultData: typeof infoData = data;
      const keysArr = Object.keys(data) as (keyof typeof infoData)[];
      keysArr.forEach(key => {
        if (typeof data[key] === 'string') resultData = { ...resultData, [key]: formatNumberStr(data[key]) };
      });
      setInfoData(resultData);
    });
    return () => unObserve.unsubscribe();
  }, [observerData]);

  return (
    <div className="home_chain">
      <div className="home_chain_box chain_first">
        <dl className="chain_info_dl">
          <dt className="chain_info_dt"><I18 text="newBlockHeight" /></dt>
          <dd className="chain_info_dd">{ infoData.blockHeight }</dd>
        </dl>
        <dl className="chain_info_dl">
          <dt className="chain_info_dt"><I18 text="transactionVolume" /></dt>
          <dd className="chain_info_dd">{ infoData.transactionVolume }</dd>
        </dl>
        <dl className="chain_info_dl">
          <dt className="chain_info_dt"><I18 text="pendingBlockVolume" /></dt>
          <dd className="chain_info_dd">{ infoData.pendingBlockVolume }</dd>
        </dl>
        <dl className="chain_info_dl">
          <dt className="chain_info_dt">
            <I18 text="newBlockTransaction" />
            <span className={formatClass(['chain_info_rate', infoData.transactionRate >= 0 ? 'chain_info_rate_green' : 'chain_info_rate_red'])}>
              <ComConSvg xlinkHref={infoData.transactionRate >= 0 ? '#icon-up' : '#icon-down'} />
              {infoData.transactionRate}%
            </span>
          </dt>
          <dd className="chain_info_dd">{ infoData.newBlockTransaction }</dd>
        </dl>
      </div>
      <div className="home_chain_box chain_view">
        { DayTransactionVolumeView }
      </div>
      <div className="home_chain_box chain_market">
        <dl className="chain_info_dl">
          <dt className="chain_info_dt">
            { getEnvConfig.APP_TOKEN_NAME }&nbsp;<I18 text="price" />
            <span className={formatClass(['chain_info_rate', infoData.priceRate >= 0 ? 'chain_info_rate_green' : 'chain_info_rate_red'])}>
              <ComConSvg xlinkHref={infoData.priceRate >= 0 ? '#icon-up' : '#icon-down'} />
              {infoData.priceRate}%
            </span>
          </dt>
          <dd className="chain_info_dd">{ infoData.price }</dd>
        </dl>
        <dl className="chain_info_dl">
          <dt className="chain_info_dt"><I18 text="markValue" /></dt>
          <dd className="chain_info_dd">{ infoData.markValue }</dd>
        </dl>
        <dl className="chain_info_dl">
          <dt className="chain_info_dt"><I18 text="allTokenVolume" /></dt>
          <dd className="chain_info_dd">{ infoData.allTokenVolume }</dd>
        </dl>
        <dl className="chain_info_dl">
          <dt className="chain_info_dt"><I18 text="allPledge" /></dt>
          <dd className="chain_info_dd">{ infoData.allPledge }</dd>
          { TokenPledgeRateView }
        </dl>
      </div>
      <div className="home_chain_box chain_volume">
        <span>
          <I18 text="secondNumber" />
          (<I18 text="nowVolume" />/<I18 text="historyMaxVolume" />):
          &nbsp;&nbsp;{infoData.nowVolume}/{infoData.historyMaxVolume}
        </span>
        <button className="chain_volume_button" onClick={() => goLink('./network')}>
          <I18 text="viewMoreValue" />
          <ComConSvg xlinkHref="#icon-more-copy" />
        </button>
      </div>
      {/* line_mark */}
      <div className="chain_view_none"></div>
    </div>
  );
};

export const HomeNewsInfo: FC<{observerData: BehaviorSubject<TypePageHomeData>}> = ({observerData}) => {
  const goLink = useSafeLink();
  const tabsRef = useRef<(HTMLButtonElement|null)[]>([]);
  const tabBg = useRef<HTMLDivElement>(null);
  const tableBox = useRef<HTMLDivElement>(null);
  const [ language ] = useLanguageHook();
  const [ tabSelect, setTabSelect ] = useState(0);
  const [ update, setUpdate ] = useState(0);
  const [ blockTableHeader, setBlockTableHeader ] = useState<TypeComConTableHeader>([]);
  const [ blockTableContent, setBlockTableContent] = useState<TypeComConTableContent>([]);
  const [ blockTableLoading, setBlockTableLoading ] = useState(false);
  const [ transTableHeader, setTransTableHeader ] = useState<TypeComConTableHeader>([]);
  const [ transTableContent, setTransTableContent] = useState<TypeComConTableContent>([]);
  const [ transTableLoading, setTransTableLoading ] = useState(false);

  const changeTab = (tab: number) => {
    setTabSelect(tab);
  }

  const goToMore = () => {
    if (tabSelect === 0) goLink('./blocks-list');
    else if (tabSelect === 1) goLink('./transaction-list');
  };
  
  useEffect(() => {
    const btnRef = tabsRef.current[tabSelect];
    if (tabBg.current === null || btnRef === null || tableBox.current === null) return;
    tabBg.current.style.width = `${btnRef.offsetWidth}px`;
    tabBg.current.style.left = `${btnRef.offsetLeft}px`;
    tabBg.current.style.height = `${btnRef.offsetHeight}px`;
    tableBox.current.style.marginLeft = `-${100 * tabSelect}%`;
  }, [tabSelect, update]);

  useEffect(() => {
    const observer = windowResizeObserver.pipe(debounceTime(100)).subscribe(() => setUpdate(state => ++state));
    return () => observer.unsubscribe();
  }, []);
  useEffect(() => {
    const observer = timer(100).subscribe(() => setUpdate(state => ++state));
    return () => observer.unsubscribe();
  }, [language]);

  // get tables header
  useEffect(() => {
    setBlockTableHeader([ 'blockHeight', 'blockTimeStamp', 'producer', 'blockId', 'transactionVolume', 'feeNumber' ].map(text => ({
      key: getOnlyId(),
      value: <I18 text={text} />
    })));
    setTransTableHeader([ 'hash', 'blockHeight', 'time', 'from', 'to', 'transactionVolume', 'feeNumber' ].map(text => ({
      key: getOnlyId(),
      value: <I18 text={text} />
    })));
  }, []);

  useEffect(() => {
    setBlockTableLoading(true);
    const observe = observerData.pipe(distinctUntilKeyChanged('blockListTable')).subscribe(({ blockListTable }) => {
      if (blockListTable.length) {
        setBlockTableLoading(false);
        setBlockTableContent(blockListTable);
      }
    });
    return () => observe.unsubscribe();
  }, [observerData]);

  useEffect(() => {
    setTransTableLoading(true);
    const observe = observerData.pipe(distinctUntilKeyChanged('txsListTable')).subscribe(({ txsListTable }) => {
      if (txsListTable.length) {
        setTransTableLoading(false);
        setTransTableContent(txsListTable);
      }
    });
    return () => observe.unsubscribe();
  }, [observerData]);

  return (
    <div className="home_news">
      <div className="tab_header">
        <button
          ref={ref => (tabsRef.current[0] = ref)}
          onClick={() => changeTab(0)}
          className={formatClass(['tab_header_item', tabSelect === 0 && 'tab_header_selected'])}>
          <ComConSvg className="tab_header_icon" xlinkHref="#icon-block" />
          <span><I18 text="newBlockHeight" /></span>
        </button>
        <button
          ref={ref => (tabsRef.current[1] = ref)}
          onClick={() => changeTab(1)}
          className={formatClass(['tab_header_item', tabSelect === 1 && 'tab_header_selected'])}>
          <ComConSvg className="tab_header_icon" xlinkHref="#icon-transition" />
          <span><I18 text="newTransaction" /></span>
        </button>
        <div className="tab_header_bg" ref={tabBg}></div>
      </div>
      <button className="tab_more" onClick={goToMore}>
        <span><I18 text="more" /></span>
        <ComConSvg className="tab_more_icon" xlinkHref="#icon-more-copy" />
      </button>
      <div className="tab_content">
        <div className="tab_content_scroll" ref={tableBox}>
        {useMemo(() => (
          <ComConTable
            boxClass="tab_content_inner"
            header={blockTableHeader}
            content={blockTableContent}
            loading={blockTableLoading} />
        ), [blockTableHeader, blockTableContent, blockTableLoading])}
        {useMemo(() => (
          <ComConTable
            boxClass="tab_content_inner"
            header={transTableHeader}
            content={transTableContent}
            loading={transTableLoading} />
        ), [transTableHeader, transTableContent, transTableLoading])}
        </div>
      </div>
    </div>
  );
};
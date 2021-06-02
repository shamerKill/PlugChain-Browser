import { FC, useEffect, useMemo, useRef, useState } from 'react';
import I18 from '../../../i18n/component';
import { windowResizeObserver } from '../../../services/global.services';
import { formatClass, getOnlyId, useSafeLink } from '../../../tools';
import { DayTransactionVolume, TokenPledgeRate } from './home-components';
import { useLanguageHook } from '../../../services/config.services';
import { debounceTime, distinctUntilKeyChanged } from 'rxjs/operators';
import { BehaviorSubject, timer } from 'rxjs';
import ComConTable, { TypeComConTableHeader, TypeComConTableContent } from '../../components/control/table.copy';
import { Link } from 'react-router-dom';
import ComConSvg from '../../components/control/icon';
import { formatNumberStr } from '../../../tools/string';
import { TypePageHomeData } from './home';

import './home.scss';

export const HomeChainInfo: FC<{observerData: BehaviorSubject<TypePageHomeData>}> = ({ observerData }) => {
  const goLink = useSafeLink();
  const [newBlockHeight, setNewBlockHeight] = useState('');
  const [transactionVolume, setTransactionVolume] = useState('');
  const [pendingBlockVolume, setPendingBlockVolume] = useState('');
  const [newBlockTransaction, setNewBlockTransaction] = useState('');
  const [transactionRate, setTransactionRate] = useState(0);
  const [price, setPrice] = useState('');
  const [priceRate, setPriceRate] = useState(0);
  const [markValue, setMarketValue] = useState('');
  const [allTokenVolume, setAllTokenVolume] = useState('');
  const [allPledge, setAllPledge] = useState('');
  const [pledgeRate, setPledgeRate] = useState(0);
  const [nowVolume, setNowVolume] = useState('');
  const [historyMaxVolume, setHistoryMaxVolume] = useState('');

  const DayTransactionVolumeView = useMemo(() => <DayTransactionVolume />, []);
  const TokenPledgeRateView = useMemo(() => <TokenPledgeRate pledgeRate={pledgeRate} />, [pledgeRate]);

  useEffect(() => {
    const unObserve = observerData.pipe(distinctUntilKeyChanged('blockHeight')).subscribe(data => {
      setNewBlockHeight(data.blockHeight);
    });
    return () => unObserve.unsubscribe();
  }, [observerData]);

  useEffect(() => {
    setTransactionVolume('221,035');
    setPendingBlockVolume('5');
    setNewBlockTransaction('829');
    setTransactionRate(0.96);
    setPrice('78992.11');
    setPriceRate(541.02);
    setMarketValue(`$${formatNumberStr('67781892927562')}`);
    setAllTokenVolume(formatNumberStr('1000000000'));
    setAllPledge(formatNumberStr('345362.198'));
    setPledgeRate(30);
    setNowVolume('18');
    setHistoryMaxVolume('302');
  }, []);
  return (
    <div className="home_chain">
      <div className="home_chain_box chain_first">
        <dl className="chain_info_dl">
          <dt className="chain_info_dt"><I18 text="newBlockHeight" /></dt>
          <dd className="chain_info_dd">{ newBlockHeight }</dd>
        </dl>
        <dl className="chain_info_dl">
          <dt className="chain_info_dt"><I18 text="transactionVolume" /></dt>
          <dd className="chain_info_dd">{ transactionVolume }</dd>
        </dl>
        <dl className="chain_info_dl">
          <dt className="chain_info_dt"><I18 text="pendingBlockVolume" /></dt>
          <dd className="chain_info_dd">{ pendingBlockVolume }</dd>
        </dl>
        <dl className="chain_info_dl">
          <dt className="chain_info_dt">
            <I18 text="newBlockTransaction" />
            <span className={formatClass(['chain_info_rate', transactionRate >= 0 ? 'chain_info_rate_green' : 'chain_info_rate_red'])}>
              <ComConSvg xlinkHref={transactionRate >= 0 ? '#icon-up' : '#icon-down'} />
              {transactionRate}%
            </span>
          </dt>
          <dd className="chain_info_dd">{ newBlockTransaction }</dd>
        </dl>
      </div>
      <div className="home_chain_box chain_view">
        { DayTransactionVolumeView }
      </div>
      <div className="home_chain_box chain_market">
        <dl className="chain_info_dl">
          <dt className="chain_info_dt">
            PLUG&nbsp;<I18 text="price" />
            <span className={formatClass(['chain_info_rate', priceRate >= 0 ? 'chain_info_rate_green' : 'chain_info_rate_red'])}>
              <ComConSvg xlinkHref={priceRate >= 0 ? '#icon-up' : '#icon-down'} />
              {priceRate}%
            </span>
          </dt>
          <dd className="chain_info_dd">{ price }</dd>
        </dl>
        <dl className="chain_info_dl">
          <dt className="chain_info_dt"><I18 text="markValue" /></dt>
          <dd className="chain_info_dd">{ markValue }</dd>
        </dl>
        <dl className="chain_info_dl">
          <dt className="chain_info_dt"><I18 text="allTokenVolume" /></dt>
          <dd className="chain_info_dd">{ allTokenVolume }</dd>
        </dl>
        <dl className="chain_info_dl">
          <dt className="chain_info_dt"><I18 text="allPledge" /></dt>
          <dd className="chain_info_dd">{ allPledge }</dd>
          { TokenPledgeRateView }
        </dl>
      </div>
      <div className="home_chain_box chain_volume">
        <span>
          <I18 text="secondNumber" />
          (<I18 text="nowVolume" />/<I18 text="historyMaxVolume" />):
          &nbsp;&nbsp;{nowVolume}/{historyMaxVolume}
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
    setTransTableHeader([ 'ID', 'blockHeight', 'time', 'from', 'to', 'transactionVolume', 'feeNumber' ].map(text => ({
      key: getOnlyId(),
      value: <I18 text={text} />
    })));
  }, []);
  // set tables content
  useEffect(() => {
    const getBlockLink = (text: string) => <Link className="a_link" to={`./block/${text}`}>{text}</Link>;
    const getAccountLink = (text: string) => <Link className="a_link" to={`./account/${text}`}>{text}</Link>;
    const getTransactionLink = (text: string) => <Link className="a_link" to={`./transaction/${text}`}>{text}</Link>;
    setTransTableContent([
      [ getTransactionLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getBlockLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), '2021-04-26 17:23:34', getAccountLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getAccountLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
      [ getTransactionLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getBlockLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), '2021-04-26 17:23:34', getAccountLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getAccountLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
      [ getTransactionLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getBlockLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), '2021-04-26 17:23:34', getAccountLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getAccountLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
      [ getTransactionLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getBlockLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), '2021-04-26 17:23:34', getAccountLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getAccountLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
    ].map(item => ({
      key: getOnlyId(),
      value: item.map(col => ({ value: col, key: getOnlyId() })),
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
            content={transTableContent} />
        ), [transTableHeader, transTableContent])}
        </div>
      </div>
    </div>
  );
};
import { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import I18 from '../../../i18n/component';
import { windowResizeObserver } from '../../../services/global.services';
import { formatClass } from '../../../tools';
import { DayTransactionVolume, TokenPledgeRate } from './home-components';
import { useLanguageHook } from '../../../services/config.services';

import './home.scss';
import { debounceTime } from 'rxjs/operators';
import { timer } from 'rxjs';
import ComConTable from '../../components/control/table';

export const HomeChainInfo: FC = () => {
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
    setNewBlockHeight('308,221,035');
    setTransactionVolume('221,035');
    setPendingBlockVolume('21,035');
    setNewBlockTransaction('305');
    setTransactionRate(0.96);
    setPrice('50.01');
    setPriceRate(-5);
    setMarketValue('$5999999.99');
    setAllTokenVolume('1,233,456.198');
    setAllPledge('3,456.198');
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
            <span className={formatClass(['chain_info_rate', transactionRate >= 0 ? 'chain_info_rate_green' : 'chain_info_rate_red'])}>{transactionRate}%</span>
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
            ONP&nbsp;<I18 text="price" />
            <span className={formatClass(['chain_info_rate', priceRate >= 0 ? 'chain_info_rate_green' : 'chain_info_rate_red'])}>{priceRate}%</span>
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
        <button className="chain_volume_button">
          <I18 text="viewMoreValue" />
          <svg className="icon chain_volume_icon" aria-hidden="true">
            <use xlinkHref="#icon-more-copy"></use>
          </svg>
        </button>
      </div>
      {/* line_mark */}
      <div className="chain_view_none"></div>
    </div>
  );
};

export const HomeNewsInfo: FC = () => {
  const [ tabSelect, setTabSelect ] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement|null)[]>([]);
  const tabBg = useRef<HTMLDivElement>(null);
  const tableBox = useRef<HTMLDivElement>(null);
  const [ language ] = useLanguageHook();
  const [ update, setUpdate ] = useState(0);
  const [ blockTableHeader, setBlockTableHeader ] = useState<string[]>([]);
  const [ blockTableContent, setBlockTableContent] = useState<(string|ReactElement)[][]>([]);
  const [ transTableHeader, setTransTableHeader ] = useState<string[]>([]);
  const [ transTableContent, setTransTableContent] = useState<(string|ReactElement)[][]>([]);

  const changeTab = (tab: number) => {
    setTabSelect(tab);
  }
  
  useEffect(() => {
    const btnRef = tabsRef.current[tabSelect];
    if (tabBg.current === null || btnRef === null || tableBox.current === null) return;
    tabBg.current.style.width = `${btnRef.offsetWidth}px`;
    tabBg.current.style.left = `${btnRef.offsetLeft}px`;
    tabBg.current.style.height = `${btnRef.offsetHeight}px`;
    tableBox.current.style.marginLeft = `-${100 * tabSelect}%`;
  }, [tabSelect, update])

  useEffect(() => {
    windowResizeObserver.pipe(debounceTime(100)).subscribe(() => setUpdate(state => ++state));
  }, []);
  useEffect(() => {
    timer(100).subscribe(() => setUpdate(state => ++state));
  }, [language]);

  // get tables header
  useEffect(() => {
    setBlockTableHeader([ 'blockHeight', 'blockTimeStamp', 'producer', 'blockId', 'transactionVolume', 'freeNumber' ]);
    setTransTableHeader([ 'ID', 'blockHeight', 'time', 'from', 'to', 'transactionVolume', 'freeNumber' ]);
  }, []);
  // set tables content
  useEffect(() => {
    const getLink = (text: string) => <a className="a_link" href="/">{text}</a>
    setBlockTableContent([
      [ getLink('13456233'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
      [ getLink('13456233'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
      [ getLink('13456233'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
      [ getLink('13456233'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
    ]);
    setTransTableContent([
      [ getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
      [ getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
      [ getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
      [ getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
    ]);
  }, []);

  return (
    <div className="home_news">
      <div className="tab_header">
        <button
          ref={ref => (tabsRef.current[0] = ref)}
          onClick={() => changeTab(0)}
          className={formatClass(['tab_header_item', tabSelect === 0 && 'tab_header_selected'])}>
          <svg className="tab_header_icon icon" aria-hidden="true">
            <use xlinkHref="#icon-block"></use>
          </svg>
          <span><I18 text="newBlockHeight" /></span>
        </button>
        <button
          ref={ref => (tabsRef.current[1] = ref)}
          onClick={() => changeTab(1)}
          className={formatClass(['tab_header_item', tabSelect === 1 && 'tab_header_selected'])}>
          <svg className="tab_header_icon icon" aria-hidden="true">
            <use xlinkHref="#icon-transition"></use>
          </svg>
          <span><I18 text="newTransaction" /></span>
        </button>
        <div className="tab_header_bg" ref={tabBg}></div>
      </div>
      <button className="tab_more">
        <span><I18 text="more" /></span>
        <svg className="tab_more_icon icon" aria-hidden="true">
            <use xlinkHref="#icon-more-copy"></use>
          </svg>
      </button>
      <div className="tab_content">
        <div className="tab_content_scroll" ref={tableBox}>
        {useMemo(() => (
          <ComConTable
            boxClass="tab_content_inner"
            header={blockTableHeader.map(text => <I18 text={text} />)}
            content={blockTableContent} />
        ), [blockTableHeader, blockTableContent])}
        {useMemo(() => (
          <ComConTable
            boxClass="tab_content_inner"
            header={transTableHeader.map(text => <I18 text={text} />)}
            content={transTableContent} />
        ), [transTableHeader, transTableContent])}
        </div>
      </div>
    </div>
  );
};
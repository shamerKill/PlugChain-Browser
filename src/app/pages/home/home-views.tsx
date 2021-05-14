import { FC, useEffect, useMemo, useState } from 'react';
import I18 from '../../../i18n/component';
import { formatClass } from '../../../tools';
import { DayTransactionVolume, TokenPledgeRate } from './home-components';

import './home.scss';

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
  return (
    <div className="home_news"></div>
  );
};
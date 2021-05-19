import { FC, useEffect, useMemo, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import { TokenPledgeRate, DayTransactionVolume } from '../../home/home-components';
import { formatClass } from '../../../../tools';

import './network.scss';

const PageChainNetwork: FC = () => {
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
    <ComponentsLayoutBase className="chain_network_page">
      <div className="network_content">
        <h2 className="network_title">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-network"></use>
          </svg>
          <I18 text="networkOverview" />
        </h2>
        {/* info */}
        <div className="network_info">
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
            </dt>
            <dd className="chain_info_dd">
              { newBlockTransaction }
              <span className={formatClass(['chain_info_rate', transactionRate >= 0 ? 'chain_info_rate_green' : 'chain_info_rate_red'])}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref={transactionRate >= 0 ? '#icon-up' : '#icon-down'}></use>
                </svg>
                {transactionRate}%
              </span>
            </dd>
          </dl>
          <dl className="chain_info_dl">
            <dt className="chain_info_dt"><I18 text="secondNumber" /><br /><small>(<I18 text="nowVolume" />/<I18 text="historyMaxVolume" />)</small></dt>
            <dd className="chain_info_dd">{nowVolume}/{historyMaxVolume}</dd>
          </dl>
          <dl className="chain_info_dl">
            <dt className="chain_info_dt">
              ONP&nbsp;<I18 text="price" />
            </dt>
            <dd className="chain_info_dd">
              { price }
              <span className={formatClass(['chain_info_rate', priceRate >= 0 ? 'chain_info_rate_green' : 'chain_info_rate_red'])}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref={priceRate >= 0 ? '#icon-up' : '#icon-down'}></use>
                </svg>
                {priceRate}%
              </span>
            </dd>
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
        {/* chart */}
        <div className="network_chart">
          <h3 className="network_inner_title">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-chart"></use>
            </svg>
            <I18 text="statisticalChart" />
          </h3>
          <div className="network_chart_list">
            <dl className="network_chart_item">
              <dt className="network_chart_dt"><I18 text="24hTransactionVolume" /></dt>
              <dd className="network_chart_dd">{DayTransactionVolumeView}</dd>
            </dl>
          </div>
        </div>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageChainNetwork;

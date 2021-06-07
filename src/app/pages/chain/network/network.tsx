import { FC, useEffect, useMemo, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import { TokenPledgeRate, DayTransactionVolume } from '../../home/home-components';
import { changeSeconds, formatClass } from '../../../../tools';

import './network.scss';
import ComConSvg from '../../../components/control/icon';
import { timer, zip } from 'rxjs';
import { fetchData, zipAllSuccess } from '../../../../tools/ajax';

const PageChainNetwork: FC = () => {
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
    const getInfo = timer(0, changeSeconds(5)).subscribe(() => zip([
      fetchData('GET', 'info'), fetchData('GET', 'num_unconfirmed_txs'), fetchData('GET', 'coin_info'),
    ]).pipe(zipAllSuccess()).subscribe(([info, unNum, coin]) => {
      if (unNum.success) setInfoData(state => ({ ...state, pendingBlockVolume: `${unNum.data}` }));
      if (coin.success) setInfoData(state => ({
        ...state,
        price: `${coin.data.price}`,
        priceRate: parseFloat(`${coin.data.price_drift_ratio}`),
        markValue: `${coin.data.total_price}`,
        allTokenVolume: `${coin.data.supply}`,
        allPledge: `${coin.data.staking}`,
        pledgeRate: parseFloat(`${coin.data.staking_ratio}`),
      }));
      if (info.success) setInfoData(state => ({
        ...state,
        blockHeight: `${info.data.block_num}`,
        nowVolume: `${info.data.avg_tx}`,
        historyMaxVolume: `${info.data.max_avg_tx}`,
        newBlockTransaction: `${info.data.tx_nums}`,
        transactionRate: info.data.ratio,
        transactionVolume: `${info.data.total_tx_num}`,
      }));
    }));
    return () => getInfo.unsubscribe();
  }, []);
  return (
    <ComponentsLayoutBase className="chain_network_page">
      <div className="network_content">
        <h2 className="network_title">
          <ComConSvg xlinkHref="#icon-network" />
          <I18 text="networkOverview" />
        </h2>
        {/* info */}
        <div className="network_info">
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
            </dt>
            <dd className="chain_info_dd">
              { infoData.newBlockTransaction }
              <span className={formatClass(['chain_info_rate', infoData.transactionRate >= 0 ? 'chain_info_rate_green' : 'chain_info_rate_red'])}>
                <ComConSvg xlinkHref={infoData.transactionRate >= 0 ? '#icon-up' : '#icon-down'} />
                {infoData.transactionRate}%
              </span>
            </dd>
          </dl>
          <dl className="chain_info_dl">
            <dt className="chain_info_dt"><I18 text="secondNumber" /><br /><small>(<I18 text="nowVolume" />/<I18 text="historyMaxVolume" />)</small></dt>
            <dd className="chain_info_dd">{infoData.nowVolume}/{infoData.historyMaxVolume}</dd>
          </dl>
          <dl className="chain_info_dl">
            <dt className="chain_info_dt">
              PLUG&nbsp;<I18 text="price" />
            </dt>
            <dd className="chain_info_dd">
              { infoData.price }
              <span className={formatClass(['chain_info_rate', infoData.priceRate >= 0 ? 'chain_info_rate_green' : 'chain_info_rate_red'])}>
                <ComConSvg xlinkHref={infoData.priceRate >= 0 ? '#icon-up' : '#icon-down'} />
                {infoData.priceRate}%
              </span>
            </dd>
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
        {/* chart */}
        <div className="network_chart">
          <h3 className="network_inner_title">
            <ComConSvg xlinkHref="#icon-chart" />
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

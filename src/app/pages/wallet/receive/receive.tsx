import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import useI18 from '../../../../i18n/hooks';
import ComConButton from '../../../components/control/button';
import ComConTable, { TypeComConTableContent, TypeComConTableHeader } from '../../../components/control/table.copy';
import { fetchData } from '../../../../tools/ajax';
import { formatTime, getEnvConfig, getOnlyId, sleep, walletVerifyAddress } from '../../../../tools';
import { formatNumberStr } from '../../../../tools/string';
import { Link } from 'react-router-dom';

import './receive.scss';
import alertTools from '../../../components/tools/alert';

const PageWalletReceive: FC = () => {
  const [address, setAddress] = useState('');
  const [volume, setVolume] = useState('');
  const [weekMax, setWeekMax] = useState('');
  const [onceMax, setOnceMax] = useState('');
  const [receiveLoading, setReceiveLoading] = useState(false);
  const [tableHeader, setTableHeader] = useState<TypeComConTableHeader>([]);
  const [tableContent, setTableContent] = useState<TypeComConTableContent>([]);
  const [page, setPage] = useState<number>(0);
  const [allCount, setAllCount] = useState<number>(0);
  const [limit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);

  const addressInputError = useI18('addressInputError');
  const volumeInputError = useI18('volumeInputError');
  const receiveSuccess = useI18('receiveSuccess');
  const receiveError = useI18('receiveError');

  const verifyReceive = async () => {
    if (!walletVerifyAddress(address)) return alertTools.create({ message: addressInputError, type: 'error' });
    const volumeNum = parseFloat(volume);
    if (!(volumeNum > 0) || volumeNum > parseFloat(onceMax)) return alertTools.create({ message: volumeInputError, type: 'error' });
    setReceiveLoading(true);
    await sleep(0.1);
    fetchData('POST', 'receive', { address, num: volume }).subscribe(({success, error, message, loading}) => {
      if (!loading) setReceiveLoading(false);
      if (success) {
        alertTools.create({ message: receiveSuccess, type: 'success' });
        setAddress('');
        setVolume('');
        setTableContent(state => ([ {
          key: getOnlyId(),
          value: [
            { key: getOnlyId(), value: <Link to={`../account/${address}`}>{ address }</Link> },
            { key: getOnlyId(), value: formatTime(new Date()) },
            { key: getOnlyId(), value: formatNumberStr(volume) },
          ]
        }, ...state ].slice(0, limit)));
      }
      if (error) alertTools.create({ message: message || receiveError, type: 'error' });
    });
  };

  useEffect(() => {
    fetchData('GET', 'receive_rule').subscribe(({success, data}) => {
      if (success) {
        setWeekMax(data[0].value);
        setOnceMax(data[1].value);
      }
    });
  }, []);

  const onPageChange = useCallback((num: number) => {
    setPage(num);
  }, []);
  useEffect(() => {
    setTableHeader(
      [ 'address', 'time', 'volume' ]
        .map(text => ({ key: getOnlyId(), value: <I18 text={text} /> }))
    );
    setPage(1);
  }, []);
  useEffect(() => {
    if (!page || !limit) return;
    setLoading(true);
    const subOption = fetchData('GET', 'receive_log', { page, limit }).subscribe(({success, data}) => {
      if (success) {
        setLoading(false);
        setAllCount(data.count);
        setTableContent(data.info.map((log: any) => ({
          key: getOnlyId(),
          value: [
            { key: getOnlyId(), value: <Link to={`../account/${log.Address}`}>{ log.Address }</Link> },
            { key: getOnlyId(), value: formatTime(new Date(log.CreateTime)) },
            { key: getOnlyId(), value: formatNumberStr(log.Amount) },
          ]
        })));
      }
    });
    return () => subOption.unsubscribe();
  }, [page, limit]);

  return (
    <ComponentsLayoutBase className="page_wallet_receive">
      <div className="receive_inner">
        <h2 className="page_wallet_title"><I18 text="receive" /></h2>
        <div className="receive_box">
          <div className="receive_tips">
            <dl className="receive_tip_dl">
              <dt className="receive_tip_dt"><I18 text="receiveWeek" /></dt>
              <dd className="receive_tip_dd">{ weekMax }&nbsp;{ getEnvConfig.APP_TOKEN_NAME }</dd>
            </dl>
            <dl className="receive_tip_dl">
              <dt className="receive_tip_dt"><I18 text="receiveOnce" /></dt>
              <dd className="receive_tip_dd">{ onceMax }&nbsp;{ getEnvConfig.APP_TOKEN_NAME }</dd>
            </dl>
          </div>
          <p className="receive_box_title"><I18 text="address" /></p>
          <div className="receive_box_label">
            <input
              className="receive_box_input"
              type="text"
              disabled={receiveLoading}
              value={address}
              onChange={e => setAddress(e.target.value)} />
          </div>
          <p className="receive_box_title"><I18 text="receiveVolume" /></p>
          <div className="receive_box_label">
            <input
              className="receive_box_input"
              type="number"
              disabled={receiveLoading}
              value={volume}
              onChange={e => setVolume(e.target.value)} />
            <p className="receive_box_info">{ getEnvConfig.APP_TOKEN_NAME }</p>
          </div>
          <ComConButton
            loading={receiveLoading}
            onClick={verifyReceive}
            className="receive_confirm_button">
            <I18 text="confirm" />
          </ComConButton>
        </div>
      </div>
      <div className="receive_content">
        <h2 className="receive_title"><I18 text="receiveLogs" /></h2>
        {useMemo(() => (
          <ComConTable
            showTools
            loading={loading}
            header={tableHeader}
            content={tableContent}
            allCount={allCount}
            page={page}
            limit={limit}
            onPageChange={onPageChange} />
        ), [tableHeader, tableContent, allCount, page, limit, onPageChange, loading])}
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageWalletReceive;

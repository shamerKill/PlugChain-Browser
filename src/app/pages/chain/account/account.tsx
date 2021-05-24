import { FC, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ComConTable from '../../../components/control/table';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';

import './account.scss';
import { useFormatPath } from '../../../../tools';

const PageChainAccount: FC = () => {
  const [, pathAddress] = useFormatPath();
  const [address, setAddress] = useState('');
  const [coinVolume, setCoinVolume] = useState('');
  const [coinPrice, setCoinPrice] = useState('');
  const [marketValue, setMarketValue] = useState('');
  const [transactionVolume, setTransactionVolume] = useState('');
  const [inputVolume, setInputVolume] = useState('');
  const [outputVolume, setOutputVolume] = useState('');

  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const [tableContent, setTableContent] = useState<(string|ReactElement)[][]>([]);
  const [page, setPage] = useState<number>(0);
  const [allCount, setAllCount] = useState<number>(0);
  const [limit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);

  const onPageChange = useCallback((num: number) => {
    setPage(num);
    setAllCount(100);
  }, []);

  useEffect(() => {
    setTableHeader([ 'ID', 'blockHeight', 'time', 'from', 'to', 'transactionVolume', 'feeNumber' ]);
    setAddress('0x1f8dec5061b0d9bf17e5828f249142b39dab84b4');
    setCoinVolume('29,291.291');
    setCoinPrice('6.5');
    setTransactionVolume('2');
    setInputVolume('30,912.12');
    setOutputVolume('100.1');
    onPageChange(1);
  }, [onPageChange]);

  useEffect(() => {
    if (pathAddress === undefined) return;
    console.log(pathAddress);
  }, [pathAddress]);

  useEffect(() => {
    setMarketValue((parseFloat(coinPrice) * parseFloat(coinVolume)).toFixed(2));
  }, [coinPrice, coinVolume]);

  useEffect(() => {
    setLoading(true);
    const getLink = (text: string): ReactElement => <Link className="a_link" to="/">{text}</Link>;
    if (page) {
      setLoading(true);
      const doTimer = setTimeout(() => {
        setLoading(false);
        setTableContent([
          [ getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('12345'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
          [ getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('12345'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
          [ getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('12345'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
          [ getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('12345'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
        ]);
      }, 1000);
      return () => clearTimeout(doTimer);
    }
  }, [page, limit]);

  return (
    <ComponentsLayoutBase className="page_chain_account">
      <div className="account_info">
        {/* title */}
        <h2 className="account_address">
          <svg className="account_icon_card icon" aria-hidden="true"><use xlinkHref="#icon-card"></use></svg>
          <I18 text="address" />&nbsp;:&nbsp;&nbsp;{address}
          <button className="account_func">
            <svg className="icon" aria-hidden="true"><use xlinkHref="#icon-copy"></use></svg>
          </button>
          <button className="account_func">
            <svg className="icon" aria-hidden="true"><use xlinkHref="#icon-qr-code"></use></svg>
          </button>
        </h2>
        {/* info */}
        <div className="account_info_box">
          <dl className="account_info_dl account_info_important">
            <dt className="account_info_dt"><I18 text="extra" /></dt>
            <dd className="account_info_dd">
              { coinVolume }&nbsp;ONP
              <span className="account_info_small">≈&nbsp;${marketValue}</span>
            </dd>
          </dl>
          <dl className="account_info_dl">
            <dt className="account_info_dt"><I18 text="transactionVolume" /></dt>
            <dd className="account_info_dd">{ transactionVolume }</dd>
          </dl>
          <dl className="account_info_dl">
            <dt className="account_info_dt"><I18 text="outputVolume" /></dt>
            <dd className="account_info_dd">{ outputVolume }</dd>
          </dl>
          <dl className="account_info_dl">
            <dt className="account_info_dt"><I18 text="inputVolume" /></dt>
            <dd className="account_info_dd">{ inputVolume }</dd>
          </dl>
        </div>
      </div>
      <div className="account_table">
        <h2 className="account_title"><I18 text="transactionList" /></h2>
        {useMemo(() => (
          <ComConTable
            showTools
            loading={loading}
            header={tableHeader.map(text => <I18 text={text} />)}
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

export default PageChainAccount;
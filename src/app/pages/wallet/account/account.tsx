import { FC, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import ComConTable from '../../../components/control/table';
import { Link } from 'react-router-dom';

import './account.scss';
import ComConButton from '../../../components/control/button';
import ComConSvg from '../../../components/control/icon';
import { useSafeLink } from '../../../../tools';
import useGetDispatch from '../../../../databases/hook';
import { InRootState } from '../../../../@types/redux';

const PageWalletAccount: FC = () => {
  const goLink = useSafeLink();
  const [wallet] = useGetDispatch<InRootState['wallet']>('wallet');
  const [address, setAddress] = useState('');
  const [coinVolume, setCoinVolume] = useState('');
  const [coinPrice, setCoinPrice] = useState('');
  const [marketValue, setMarketValue] = useState('');
  const [transactionVolume, setTransactionVolume] = useState('');
  const [inputVolume, setInputVolume] = useState('');
  const [outputVolume, setOutputVolume] = useState('');

  const [pledgingVol, setPledgingVol] = useState('0.00');
  const [redeemVol, setRedeemVol] = useState('0.00');
  const [rewardVol, setRewardVol] = useState('0.00');

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
    setLoading(true);
    const getLink = (text: string): ReactElement => <Link className="a_link" to="/">{text}</Link>;
    if (page) {
      setLoading(true);
      const doTimer = setTimeout(() => {
        setLoading(false);
        setTableContent([
          [ <span className="account_transaction_type transaction_input">接收</span>, getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('12345'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
          [ <span className="account_transaction_type transaction_output">发送</span>, getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('12345'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
          [ <span className="account_transaction_type transaction_output">发送</span>, getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('12345'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
          [ <span className="account_transaction_type transaction_input">接收</span>, getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('12345'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
        ]);
      }, 1000);
      return () => clearTimeout(doTimer);
    }
  }, [page, limit]);

  useEffect(() => {
    setMarketValue((parseFloat(coinPrice) * parseFloat(coinVolume)).toFixed(2));
  }, [coinPrice, coinVolume]);

  useEffect(() => {
    if (!wallet.hasWallet) return goLink('./login');
    setAddress(wallet.address);
    console.log(wallet);
  }, [wallet, goLink]);

  useEffect(() => {
    setTableHeader([ '', 'ID', 'blockHeight', 'time', 'from', 'to', 'transactionVolume', 'feeNumber' ]);
    setCoinVolume('29,291.291');
    setCoinPrice('6.5');
    setTransactionVolume('2');
    setInputVolume('30,912.12');
    setOutputVolume('100.1');
    onPageChange(1);
  }, [onPageChange]);
  useEffect(() => {
    setPledgingVol('0.00');
    setRedeemVol('0.00');
    setRewardVol('0.00');
  }, []);
  return (
    <ComponentsLayoutBase className="page_wallet_account">
      <div className="account_info">
        {/* title */}
        <h2 className="account_info_title"><I18 text="myAssets" /></h2>
        <h2 className="account_address">
          <ComConSvg className="account_icon_card" xlinkHref="#icon-card" />
          &nbsp;&nbsp;{address}
          <button className="account_func">
            <ComConSvg xlinkHref="#icon-copy" />
          </button>
          <button className="account_func">
            <ComConSvg xlinkHref="#icon-qr-code" />
          </button>
        </h2>
        {/* info */}
        <div className="account_info_account">
          <dl className="account_info_dl account_info_important">
            <dd className="account_info_dd">
              { coinVolume }&nbsp;PLUG
              <span className="account_info_small">≈&nbsp;${marketValue}</span>
            </dd>
            <dt className="account_info_dt"><I18 text="extra" /></dt>
          </dl>
          <ComConButton className="account_info_transaction" onClick={() => goLink('/wallet/transaction')}>
            <I18 text="transaction" />
          </ComConButton>
        </div>
        {/* more */}
        <div className="account_info_box">
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
      <div className="account_pledge">
        <h2 className="account_title"><I18 text="pledgeMining" /></h2>
        <div className="account_pledge_box">
          <dl className="account_pledge_dl">
            <dt className="account_pledge_dt">{ pledgingVol }<small className="pledge_unit">PLUG</small></dt>
            <dd className="account_pledge_dd"><I18 text="pledging" /></dd>
          </dl>
          <dl className="account_pledge_dl">
            <dt className="account_pledge_dt">{ redeemVol }<small className="pledge_unit">PLUG</small></dt>
            <dd className="account_pledge_dd"><I18 text="redeeming" /></dd>
          </dl>
          <dl className="account_pledge_dl">
            <dt className="account_pledge_dt">{ rewardVol }<small className="pledge_unit">PLUG</small></dt>
            <dd className="account_pledge_dd"><I18 text="pledgeReward" /></dd>
          </dl>
          <div className="account_pledge_buttons">
            <ComConButton className="account_pledge_button" onClick={() => goLink('/wallet/pledge')}>
              <ComConSvg className="account_pledge_icon" xlinkHref="#icon-pledge" /><I18 text="pledgeMining" />
            </ComConButton>
            <ComConButton contrast className="account_pledge_button" onClick={() => goLink('/wallet/my-pledge')}>
              <ComConSvg className="account_pledge_icon" xlinkHref="#icon-looking" /><I18 text="myPledge" />
            </ComConButton>
          </div>
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

export default PageWalletAccount;

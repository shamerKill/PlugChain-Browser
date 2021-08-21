import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import ComConTable, { TypeComConTableContent, TypeComConTableHeader } from '../../../components/control/table.copy';
import ComConButton from '../../../components/control/button';
import ComConSvg from '../../../components/control/icon';
import { formatClass, formatTime, getEnvConfig, getOnlyId, useFormatSearch, useSafeLink, walletAmountToToken, fetchData, justifySearch, walletVerifyAddress, walletDecode } from '../../../../tools';
import useGetDispatch from '../../../../databases/hook';
import { InRootState } from '../../../../@types/redux';
import { formatNumberStr } from '../../../../tools/string';
import ComConLink from '../../../components/control/link';
import { Link } from 'react-router-dom';

import './account.scss';
import ComConToolsCopy from '../../../components/tools/copy';
import alertTools from '../../../components/tools/alert';
import confirmTools from '../../../components/tools/confirm';
import useI18 from '../../../../i18n/hooks';


const PageWalletAccount: FC = () => {
  const accountPassword = useRef<string>();
  const clearAccountPassword = useRef<any>();
  const goLink = useSafeLink();
  const search = useFormatSearch<{ page: string }>();
  const [wallet] = useGetDispatch<InRootState['wallet']>('wallet');
  const [address, setAddress] = useState('');
  const [coinVolume, setCoinVolume] = useState('');
  // const [marketValue, setMarketValue] = useState('');
  const [transactionVolume, setTransactionVolume] = useState('');
  const [inputVolume, setInputVolume] = useState('');
  const [outputVolume, setOutputVolume] = useState('');

  const [pledgingVol, setPledgingVol] = useState('0.00');
  const [redeemVol, setRedeemVol] = useState('0.00');
  const [rewardVol, setRewardVol] = useState('0.00');

  const [tableHeader, setTableHeader] = useState<TypeComConTableHeader>([]);
  const [tableContent, setTableContent] = useState<TypeComConTableContent>([]);
  const [page, setPage] = useState<number>(0);
  const [allCount, setAllCount] = useState<number>(0);
  const [limit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);

  const accountPasswordTip = useI18('accountPassword');

  const changeValue = (value: string) => {
    accountPassword.current = value;
  }
  
  const copy = (str: string) => {
    ComConToolsCopy(str);
    alertTools.create({ message: <I18 text="copySuccess" />, type: 'success'});
  };

  const onPageChange = useCallback((num: number) => {
    const searchObj = search || {page: num};
    searchObj.page = `${num}`;
    goLink(`?${justifySearch(searchObj)}`);
    setPage(num);
  }, [search, goLink]);

  const ComPassAlert: FC = () => {
    const [accountPass, setAccountPass] = useState('');
    const changeAccountPass = (value: string) => {
      setAccountPass(value);
      changeValue(value);
    };
    clearAccountPassword.current = () => changeAccountPass('');
    return (
      <div className="export-alert">
        <p className="export-alert-title"><I18 text="exportAccount" /></p>
        <p className="export-alert-desc"><I18 text="exportAccountWarning" /></p>
        <input value={accountPass} onChange={e => changeAccountPass(e.target.value)} className="export-alert-input" type="password" placeholder={accountPasswordTip} />
      </div>
    );
  };
  const onChangeShowExport = () => {
    const close = confirmTools.create({
      message: '',
      Message: ComPassAlert,
      buttons: [
        {
          text:  <I18 text="exportFile" />,
          onClick: () => {
            if (!accountPassword.current) return;
            walletDecode(wallet.encryptionKey, accountPassword.current)
              .then(data => {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data.mnemonic));
                element.setAttribute('download', wallet.address);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                alertTools.create({ message: <I18 text="success" />, type: 'success' });
              })
              .catch(err => alertTools.create({ message: <I18 text="passwordError" />, type: 'error' }))
              .finally(close);
            clearAccountPassword.current();
          }
        },
        {
          text: <I18 text="onlyShow" />,
          onClick: () => {
            if (!accountPassword.current) return;
            walletDecode(wallet.encryptionKey, accountPassword.current)
              .then(data => {
                setTimeout(() => confirmTools.create({ message: data.mnemonic }), 300);
              })
              .catch(err => alertTools.create({ message: <I18 text="passwordError" />, type: 'error' }))
              .finally(close);
            clearAccountPassword.current();
          }
        }
      ],
    });
  }

  useEffect(() => {
    if (!page || !address || !limit) return;
    setLoading(true);
    const subOption = fetchData('GET', 'address_txs', { address, coin: getEnvConfig.APP_TOKEN_NAME, page, limit }).subscribe(({success, data}) => {
      if (success) {
        setLoading(false);
        setAllCount(parseInt(data.TxNum));
        setTableContent(data.Txs.map((tx: any) => {
          const txTypeOutput = tx.from === address ? true : false;
          const txTypeClass = formatClass(['account_transaction_type', `transaction_${txTypeOutput ? 'output' : 'input'}`]);
          const txTypeEle = <I18 text={txTypeOutput ? 'output' : 'input'} />
          return {
            key: getOnlyId(),
            value: [
              { key: getOnlyId(), value: <span className={txTypeClass}>{txTypeEle}</span> },
              { key: getOnlyId(), value: <ComConLink link={`../transaction/${tx.hash}`}>{ tx.hash }</ComConLink> },
              { key: getOnlyId(), value: <ComConLink link={`../block/${tx.block_id}`}>{ tx.block_id }</ComConLink> },
              { key: getOnlyId(), value: formatTime(tx.create_time) },
              { key: getOnlyId(), value: <ComConLink noLink={txTypeOutput || !walletVerifyAddress(tx.from)} link={`/account/${tx.from}`}>{ tx.from }</ComConLink> },
              { key: getOnlyId(), value: <ComConLink noLink={!txTypeOutput || !walletVerifyAddress(tx.to)} link={`/account/${tx.to}`}>{ tx.to }</ComConLink> },
              { key: getOnlyId(), value: tx.amount },
              { key: getOnlyId(), value: tx.fee },
            ]
          };
        }));
      }
    });
    return () => subOption.unsubscribe();
  }, [page, limit, address]);

  useEffect(() => {
    if (!wallet.hasWallet) return goLink('./login');
    setAddress(wallet.address);
  }, [wallet, goLink]);

  useEffect(() => {
    if (!address) return; 
    const balanceSub = fetchData('GET', 'balance', { address, coin: getEnvConfig.APP_TOKEN_NAME }).subscribe(({ success, data }) => {
      if (success) {
        setCoinVolume(formatNumberStr(`${data.Balance}`));
        setTransactionVolume(formatNumberStr(`${data.TxNum}`));
        setInputVolume(formatNumberStr(`${data.RecipientAmount}`));
        setOutputVolume(formatNumberStr(`${data.SendAmount}`));
      }
    });
    const pledgeSub = fetchData('GET', 'account', { address }).subscribe(({ success, data}) => {
      if (success) {
        setPledgingVol(formatNumberStr(walletAmountToToken(`${data.delegation_number}`)));
        setRedeemVol(formatNumberStr(walletAmountToToken(`${data.undelegation_number}`)));
        setRewardVol(formatNumberStr(walletAmountToToken(`${data.reward_number}`)));
      }
    });
    return () => {
      balanceSub.unsubscribe();
      pledgeSub.unsubscribe();
    };
  }, [address]);

  useEffect(() => {
    if (!search) return;
    onPageChange(Number(search.page) || 1);
  }, [search, onPageChange]);

  useEffect(() => {
    setTableHeader(
      [ '', 'ID', 'blockHeight', 'time', 'from', 'to', 'transactionVolume', 'feeNumber' ]
        .map(text => ({ key: getOnlyId(), value: <I18 text={text} /> }))
    );
  }, []);
  
  return (
    <ComponentsLayoutBase className="page_wallet_account">
      <div className="account_info">
        {/* title */}
        <h2 className="account_info_title">
          <I18 text="myAssets" />
          <Link className="account_info_reset" to="./reset"><I18 text="resetAccount"/></Link>
          <span className="account_info_export" onClick={() => onChangeShowExport()}><I18 text="exportAccount"/></span>
        </h2>
        <h2 className="account_address">
          <ComConSvg className="account_icon_card" xlinkHref="#icon-card" />
          &nbsp;&nbsp;{address}
          <button className="account_func" onClick={() => copy(address)}>
            <ComConSvg xlinkHref="#icon-copy" />
          </button>
          {/* <button className="account_func">
            <ComConSvg xlinkHref="#icon-qr-code" />
          </button> */}
        </h2>
        {/* info */}
        <div className="account_info_account">
          <dl className="account_info_dl account_info_important">
            <dd className="account_info_dd">
              { coinVolume }&nbsp;{ getEnvConfig.APP_TOKEN_NAME }
              {/* <span className="account_info_small">≈&nbsp;${marketValue}</span> */}
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
            <dt className="account_pledge_dt">{ pledgingVol }<small className="pledge_unit">{ getEnvConfig.APP_TOKEN_NAME }</small></dt>
            <dd className="account_pledge_dd"><I18 text="pledging" /></dd>
          </dl>
          <dl className="account_pledge_dl">
            <dt className="account_pledge_dt">{ redeemVol }<small className="pledge_unit">{ getEnvConfig.APP_TOKEN_NAME }</small></dt>
            <dd className="account_pledge_dd"><I18 text="redeeming" /></dd>
          </dl>
          <dl className="account_pledge_dl">
            <dt className="account_pledge_dt">{ rewardVol }<small className="pledge_unit">{ getEnvConfig.APP_TOKEN_NAME }</small></dt>
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

export default PageWalletAccount;

import { FC, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import I18 from '../../../../i18n/component';
import { fetchData, formatClass, formatTime, useFormatPath, walletVerifyAddress } from '../../../../tools';
import { formatNumberStr } from '../../../../tools/string';
import ComConSvg from '../../../components/control/icon';
import ComConLoading from '../../../components/control/loading';
import ComponentsLayoutBase from '../../../components/layout/base';
import alertTools from '../../../components/tools/alert';
import ComConToolsCopy from '../../../components/tools/copy';

import './transaction.scss';

const PageTransaction: FC = () => {
  const history = useHistory();
  const [, transactionId ] = useFormatPath();
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [transactionInfo, setTransactionInfo ] = useState<{
    id: string; block: number; fee: number;
    hash: string; from: string; to: string;
    remarks: string; time: string; amount: string;
    type: string; status: boolean, rawLog: string;
  }>(
    { id: '', block: 0, fee: 0, hash: '', from: '', to: '', remarks: '', time: '', amount: '', type: '', status: true, rawLog: '' }
  );
  
  const copy = (str: string) => {
    ComConToolsCopy(str);
    alertTools.create({ message: <I18 text="copySuccess" />, type: 'success'});
  };

  useEffect(() => {
    if (!transactionId) return;
    setInfoLoading(true);
    const subOption = fetchData('GET', 'tx_detail', { hash: transactionId }).subscribe(data => {
      if (data.loading === false) setInfoLoading(false);
      if (data.success) {
        const obj = {
          id: data.data.id,
          block: data.data.block_id,
          fee: data.data.fee,
          hash: transactionId,
          from: data.data.from,
          to: data.data.to,
          remarks: data.data.memo,
          time: formatTime(data.data.create_time),
          amount: formatNumberStr(data.data.amount),
          type: data.data.type,
          status: data.data.code === 0,
          rawLog: data.data.raw_log,
        };
        switch(obj.type) {
          case 'undelegate':
            obj.type = <I18 text="undelegate" />; break;
          case 'withdraw':
            obj.type = <I18 text="withdraw" />; break;
          case 'redelegate':
            obj.type = <I18 text="redelegate" />; break;
          case 'delegate':
            obj.type = <I18 text="delegate" />; break;
          case 'transfer':
            obj.type = <I18 text="transfer" />; break;
          default:
            break;
        }
        setTransactionInfo(obj);
      }
      if (data.error) {
        alertTools.create({
          message: <I18 text="no-data" />,
          type: 'warning',
        });
        history.goBack();
      }
    });
    return () => subOption.unsubscribe();
  }, [transactionId, history]);


  return (
    <ComponentsLayoutBase className="transaction_page">
      <h1 className="transaction_page_title">
        <I18 text="transactionId" />&nbsp;
        <span className="transaction_page_title_link">
          {transactionId}
          <button className="transaction_page_copy" onClick={() => copy(transactionInfo.hash)}>
            <ComConSvg xlinkHref="#icon-copy" />
          </button>
        </span>
      </h1>
      <div className="transaction_page_info">
        <h2 className="transaction_content_title"><I18 text="blockInfo" /></h2>
        <div className="transaction_info_box">
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="status" /></dt>
            <dd className={formatClass(['transaction_info_dd', transactionInfo.status ? 'transaction_info_green' : 'transaction_info_red'])}>
              {transactionInfo.status ? <I18 text="exeSuccess" /> : <I18 text="exeError" />}
            </dd>
          </dl>
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="type" /></dt>
            <dd className="transaction_info_dd">{transactionInfo.type}</dd>
          </dl>
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="blockId" /></dt>
            <dd className="transaction_info_dd"><Link to="/">{transactionInfo.block ? transactionInfo.block : ''}</Link></dd>
          </dl>
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="feeNumber" /></dt>
            <dd className="transaction_info_dd">{transactionInfo.fee ? transactionInfo.fee : ''}</dd>
          </dl>
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="transactionOfNumber" /></dt>
            <dd className="transaction_info_dd">{transactionInfo.amount ? transactionInfo.amount : ''}</dd>
          </dl>
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="transactionHash" /></dt>
            <dd className="transaction_info_dd">{transactionInfo.hash}</dd>
          </dl>
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="from" /></dt>
            <dd className="transaction_info_dd">
              {
                walletVerifyAddress(transactionInfo.from)
                  ? <Link to={`/account/${transactionInfo.from}`}>{transactionInfo.from}</Link>
                  : transactionInfo.from
              }
            </dd>
          </dl>
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="to" /></dt>
            <dd className="transaction_info_dd">
              {
                walletVerifyAddress(transactionInfo.to)
                  ? <Link to={`/account/${transactionInfo.to}`}>{transactionInfo.to}</Link>
                  : transactionInfo.to
              }
            </dd>
          </dl>
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="remarks" /></dt>
            <dd className="transaction_info_dd">
              { transactionInfo.remarks && <div className="transaction_info_remarks">{transactionInfo.remarks}</div> }
            </dd>
          </dl>
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="time" /></dt>
            <dd className="transaction_info_dd">{transactionInfo.time}</dd>
          </dl>
          {
            !transactionInfo.status && (
              <dl className="transaction_info_dl">
                <dt className="transaction_info_dt"><I18 text="rawLog" /></dt>
                <dd className="transaction_info_dd">
                  {
                    transactionInfo.rawLog && <div className="transaction_info_remarks">{transactionInfo.rawLog}</div>
                  }
                </dd>
              </dl>
            )
          }
        </div>
        <ComConLoading visible={infoLoading} />
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageTransaction;

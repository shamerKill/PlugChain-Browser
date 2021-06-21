import { FC, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import I18 from '../../../../i18n/component';
import { fetchData, formatTime, useFormatPath } from '../../../../tools';
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
  const [transactionInfo, setTransactionInfo ] = useState<{ id: string; block: number; fee: number; hash: string; from: string; to: string; remarks: string; time: string; }>(
    { id: '', block: 0, fee: 0, hash: '', from: '', to: '', remarks: '', time: '' }
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
        setTransactionInfo({
          id: data.data.id,
          block: data.data.block_id,
          fee: data.data.fee,
          hash: transactionId,
          from: data.data.from,
          to: data.data.to,
          remarks: data.data.memo,
          time: formatTime(new Date(data.data.create_time || null))
        });
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
          <button className="transaction_page_copy" onClick={() => copy(transactionInfo.id)}>
            <ComConSvg xlinkHref="#icon-copy" />
          </button>
        </span>
      </h1>
      <div className="transaction_page_info">
        <h2 className="transaction_content_title"><I18 text="blockInfo" /></h2>
        <div className="transaction_info_box">
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="blockId" /></dt>
            <dd className="transaction_info_dd"><Link to="/">{transactionInfo.block ? transactionInfo.block : ''}</Link></dd>
          </dl>
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="feeNumber" /></dt>
            <dd className="transaction_info_dd">{transactionInfo.fee ? transactionInfo.fee : ''}</dd>
          </dl>
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="transactionHash" /></dt>
            <dd className="transaction_info_dd">{transactionInfo.hash}</dd>
          </dl>
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="from" /></dt>
            <dd className="transaction_info_dd"><Link to="/">{transactionInfo.from}</Link></dd>
          </dl>
          <dl className="transaction_info_dl">
            <dt className="transaction_info_dt"><I18 text="to" /></dt>
            <dd className="transaction_info_dd"><Link to="/">{transactionInfo.to}</Link></dd>
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
        </div>
        <ComConLoading visible={infoLoading} />
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageTransaction;

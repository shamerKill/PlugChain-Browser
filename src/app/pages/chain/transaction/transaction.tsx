import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { timer } from 'rxjs';
import I18 from '../../../../i18n/component';
import useI18 from '../../../../i18n/hooks';
import { useFormatPath } from '../../../../tools';
import ComConLoading from '../../../components/control/loading';
import ComponentsLayoutBase from '../../../components/layout/base';
import alertTools from '../../../components/tools/alert';

import './transaction.scss';

const PageTransaction: FC = () => {
  const [, transactionId ] = useFormatPath();
  const copySuccess = useI18('copySuccess');
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [transactionInfo, setTransactionInfo] = useState<{ id: string; block: number; fee: number; hash: string; from: string; to: string; remarks: string; time: string; }>(
    { id: '', block: 0, fee: 0, hash: '', from: '', to: '', remarks: '', time: '' }
  );
  
  const copy = (str: string) => {
    alertTools.create({ message: copySuccess + str });
  };

  useEffect(() => {
    setInfoLoading(true);
    const doTimer = timer(1000).subscribe(() => {
      setTransactionInfo({
        id: transactionId,
        block: 10086,
        fee: 95,
        hash: 'abffb9e7a0aca6d9c9c315de8fb070c333c7f797d20215cb12cf70a972a7c00f',
        from: 'shamer',
        to: 'realer',
        remarks: 'transaction(to,volume)\n  to: realer\n  volume: 100',
        time: '2021-04-29 09:22:09'
      });
      setInfoLoading(false);
    });
    return () => doTimer.unsubscribe();
  }, [transactionId]);


  return (
    <ComponentsLayoutBase className="transaction_page">
      <h1 className="transaction_page_title">
        <I18 text="transactionId" />&nbsp;
        <span className="transaction_page_title_link">
          {transactionId}
          <button className="transaction_page_copy" onClick={() => copy(transactionInfo.id)}>
            <svg className="icon" aria-hidden="true"><use xlinkHref="#icon-copy"></use></svg>
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

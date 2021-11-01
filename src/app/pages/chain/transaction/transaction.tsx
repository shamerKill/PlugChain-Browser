import { FC, Fragment, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import I18 from '../../../../i18n/component';
import { fetchData, formatClass, formatTime, useFormatPath, useFormatSearch, walletVerifyAddress } from '../../../../tools';
import { formatNumberStr } from '../../../../tools/string';
import ComConSvg from '../../../components/control/icon';
import ComConLoading from '../../../components/control/loading';
import { TablePageTools } from '../../../components/control/table.copy';
import ComponentsLayoutBase from '../../../components/layout/base';
import alertTools from '../../../components/tools/alert';
import ComConToolsCopy from '../../../components/tools/copy';

import './transaction.scss';

const PageTransaction: FC = () => {
  const pageLimit = 5;
  const history = useHistory();
  const search = useFormatSearch<{page: string}>();
  const [, transactionId ] = useFormatPath();
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [transactionInfoArr, setTransactionInfoArr ] = useState<{
    id: string; block: number; fee: number;
    hash: string; from: string; to: string;
    remarks: string; time: string; amount: string;
    type: string; status: boolean, rawLog: string;
    sourceNode?: string; coin: string;
  }[]>([]);
  const [page, setPage] = useState(1);
  const [allCount, setAllCount] = useState(0);
  
  const copy = (str: string) => {
    ComConToolsCopy(str);
    alertTools.create({ message: <I18 text="copySuccess" />, type: 'success'});
  };

  useEffect(() => {
    if (!transactionId) return;
    setInfoLoading(true);
    const subOption = fetchData('GET', 'tx_detail', { hash: transactionId, page, limit: pageLimit }).subscribe(data => {
      if (data.loading === false) setInfoLoading(false);
      if (data.success) {
        if (!data.data?.data?.length) return;
        setAllCount(data.data.count);
        let rawLog: string|null = null;
        const dataArr = data.data.data.map((item: any) => {
          if (!rawLog) {
            try {
              rawLog = JSON.stringify(JSON.parse(item.raw_log), null, 2);
            } catch (e) {
              rawLog = item.raw_log;
            }
          }
          const obj = {
            id: item.id,
            block: item.block_id,
            fee: item.fee,
            hash: transactionId,
            from: item.from,
            to: item.to,
            remarks: item.memo,
            time: formatTime(item.create_time),
            amount: formatNumberStr(item.amount),
            type: item.type,
            status: item.code === 0,
            rawLog: rawLog,
            sourceNode: item.src_validator,
            coin: item.coin,
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
          return obj;
        });
        setTransactionInfoArr(dataArr);
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
  }, [transactionId, history, page]);

  useEffect(() => {
    if (search?.page) setPage(parseFloat(search?.page));
  }, [search]);


  if (!transactionInfoArr.length) return null;
  return (
    <ComponentsLayoutBase className="transaction_page">
      <h1 className="transaction_page_title">
        <I18 text="transactionId" />&nbsp;
        <span className="transaction_page_title_link">
          {transactionId}
          <button className="transaction_page_copy" onClick={() => copy(transactionInfoArr[0].hash)}>
            <ComConSvg xlinkHref="#icon-copy" />
          </button>
        </span>
      </h1>
      <div className="transaction_page_info">
        <h2 className="transaction_content_title"><I18 text="transferInfo" /></h2>
            <div className="transaction_info_box">
              <dl className="transaction_info_dl">
                <dt className="transaction_info_dt"><I18 text="status" /></dt>
                <dd className={formatClass(['transaction_info_dd', transactionInfoArr[0].status ? 'transaction_info_green' : 'transaction_info_red'])}>
                  {transactionInfoArr[0].status ? <I18 text="exeSuccess" /> : <I18 text="exeError" />}
                </dd>
              </dl>
              <dl className="transaction_info_dl">
                <dt className="transaction_info_dt"><I18 text="type" /></dt>
                <dd className="transaction_info_dd">{transactionInfoArr[0].type}</dd>
              </dl>
              <dl className="transaction_info_dl">
                <dt className="transaction_info_dt"><I18 text="time" /></dt>
                <dd className="transaction_info_dd">{transactionInfoArr[0].time}</dd>
              </dl>
              <dl className="transaction_info_dl">
                <dt className="transaction_info_dt"><I18 text="blockId" /></dt>
                <dd className="transaction_info_dd"><Link to={`/block/${transactionInfoArr[0].block}`}>{transactionInfoArr[0].block ? transactionInfoArr[0].block : ''}</Link></dd>
              </dl>
              <dl className="transaction_info_dl">
                <dt className="transaction_info_dt"><I18 text="feeNumber" /></dt>
                <dd className="transaction_info_dd">{transactionInfoArr[0].fee ? transactionInfoArr[0].fee : ''}</dd>
              </dl>
              <dl className="transaction_info_dl">
                <dt className="transaction_info_dt"><I18 text="transactionHash" /></dt>
                <dd className="transaction_info_dd">{transactionInfoArr[0].hash}</dd>
              </dl>
              {
                transactionInfoArr.length > 1 && (
                  <dl className="transaction_info_dl">
                    <dt className="transaction_info_dt"><I18 text="transactionItem" /></dt>
                    <dd className="transaction_info_dd">
                      {
                        transactionInfoArr.map((transactionInfo, index) => (
                          <div className="transaction_info_list" key={index}>
                            <dl className="transaction_info_dl">
                              <dt className="transaction_info_dt"><I18 text="from" /></dt>
                              <dd className="transaction_info_dd">
                                <Link to={walletVerifyAddress(transactionInfo.from)}>{transactionInfo.from}</Link>
                              </dd>
                            </dl>
                            {
                              transactionInfo.sourceNode && (
                                <dl className="transaction_info_dl">
                                  <dt className="transaction_info_dt"><I18 text="source" /></dt>
                                  <dd className="transaction_info_dd">
                                    <Link to={walletVerifyAddress(transactionInfo.sourceNode)}>{transactionInfo.sourceNode}</Link>
                                  </dd>
                                </dl>
                              )
                            }
                            <dl className="transaction_info_dl">
                              <dt className="transaction_info_dt"><I18 text="to" /></dt>
                              <dd className="transaction_info_dd">
                                <Link to={walletVerifyAddress(transactionInfo.to)}>{transactionInfo.to}</Link>
                              </dd>
                            </dl>
                            <dl className="transaction_info_dl">
                              <dt className="transaction_info_dt"><I18 text="transactionOfNumber" /></dt>
                              <dd className="transaction_info_dd">{transactionInfo.amount ? transactionInfo.amount : ''} ({transactionInfoArr[index].coin})</dd>
                            </dl>
                          </div>
                        ))
                      }
                    </dd>
                  </dl>
                )
              }
              {
                transactionInfoArr.length === 1 && transactionInfoArr.map((transactionInfo, index) => (
                  <Fragment key={index}>
                    <dl className="transaction_info_dl">
                      <dt className="transaction_info_dt"><I18 text="from" /></dt>
                      <dd className="transaction_info_dd">
                        <Link to={walletVerifyAddress(transactionInfo.from)}>{transactionInfo.from}</Link>
                      </dd>
                    </dl>
                    {
                      transactionInfo.sourceNode && (
                        <dl className="transaction_info_dl">
                          <dt className="transaction_info_dt"><I18 text="source" /></dt>
                          <dd className="transaction_info_dd">
                            <Link to={walletVerifyAddress(transactionInfo.sourceNode)}>{transactionInfo.sourceNode}</Link>
                          </dd>
                        </dl>
                      )
                    }
                    <dl className="transaction_info_dl">
                      <dt className="transaction_info_dt"><I18 text="to" /></dt>
                      <dd className="transaction_info_dd">
                        <Link to={walletVerifyAddress(transactionInfo.to)}>{transactionInfo.to}</Link>
                      </dd>
                    </dl>
                    <dl className="transaction_info_dl">
                      <dt className="transaction_info_dt"><I18 text="transactionOfNumber" /></dt>
                      <dd className="transaction_info_dd">{transactionInfoArr[index].amount ? transactionInfoArr[index].amount : ''} ({transactionInfoArr[index].coin})</dd>
                    </dl>
                  </Fragment>
                ))
              }
              {
                transactionInfoArr[0].remarks && <dl className="transaction_info_dl">
                  <dt className="transaction_info_dt"><I18 text="remarks" /></dt>
                  <dd className="transaction_info_dd">
                    { transactionInfoArr[0].remarks && <div className="transaction_info_remarks">{transactionInfoArr[0].remarks}</div> }
                  </dd>
                </dl>
              }
              <dl className="transaction_info_dl">
                <dt className="transaction_info_dt"><I18 text="rawLog" /></dt>
                <dd className="transaction_info_dd">
                  {
                    transactionInfoArr[0].rawLog && <div className="transaction_info_remarks">{transactionInfoArr[0].rawLog}</div>
                  }
                </dd>
              </dl>
            </div>
        <TablePageTools allCount={allCount} limit={pageLimit} page={page} showTools={allCount > pageLimit} onPageChange={setPage} />
        <ComConLoading visible={infoLoading} />
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageTransaction;

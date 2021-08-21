import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import I18 from '../../../../i18n/component';
import { formatTime, getOnlyId, useFormatPath, getEnvConfig, walletVerifyAddress } from '../../../../tools';
import { fetchData } from '../../../../tools/ajax';
import ComConSvg from '../../../components/control/icon';
import ComConLink from '../../../components/control/link';
import ComConLoading from '../../../components/control/loading';
import ComConTable, { TypeComConTableContent, TypeComConTableHeader } from '../../../components/control/table.copy';
import ComponentsLayoutBase from '../../../components/layout/base';
import alertTools from '../../../components/tools/alert';
import ComConToolsCopy from '../../../components/tools/copy';

import './blocks.scss';

const PageBlockInfo: FC = () => {
  const [, blockId ] = useFormatPath();
  const [tableHeader, setTableHeader] = useState<TypeComConTableHeader>([]);
  const [tableContent, setTableContent] = useState<TypeComConTableContent>([]);
  const [page, setPage] = useState<number>(0);
  const [allCount, setAllCount] = useState<number>(0);
  const [limit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [blockInfo, setBlockInfo] = useState<{ id: string; size: number; node: string; tranVol: number; fee: number; producer: string; hash: string; time: string; }>(
    { id: '', size: 0, node: '', tranVol: 0, fee: 0, producer: '', hash: '', time: '' }
  );
  
  const copy = (str: string) => {
    ComConToolsCopy(str);
    alertTools.create({ message: <I18 text="copySuccess" />, type: 'success'});
  };

  const onPageChange = useCallback((num: number) => {
    setPage(num);
  }, []);

  useEffect(() => {
    setTableHeader(
      [ 'hash', 'blockHeight', 'time', 'from', 'to', 'transactionVolume', 'feeNumber' ]
        .map(text => ({ key: getOnlyId(), value: <I18 text={text} /> }))
    );
    onPageChange(1);
  }, [onPageChange]);

  useEffect(() => {
    if (page === 0 || blockId === undefined || !limit) return;
    setLoading(true);
    const subOption = fetchData('GET', 'block_txs', { height: blockId, page, limit }).subscribe(({success, data}) => {
      if (success) {
        setLoading(false);
        setTableContent(data.Txs?.slice(0, 10).map((tx: any) => ({
          key: getOnlyId(),
          value: [
            { key: getOnlyId(), value: <ComConLink link={`../transaction/${tx.hash}`}>{ tx.hash }</ComConLink> },
            { key: getOnlyId(), value: <ComConLink link={`../block/${tx.block_id}`}>{ tx.block_id }</ComConLink> },
            { key: getOnlyId(), value: formatTime(tx.create_time) },
            { key: getOnlyId(), value: <ComConLink noLink={!walletVerifyAddress(tx.from)} link={`/account/${tx.from}`}>{ tx.from }</ComConLink> },
            { key: getOnlyId(), value: <ComConLink noLink={!walletVerifyAddress(tx.to)} link={`/account/${tx.to}`}>{ tx.to }</ComConLink> },
            { key: getOnlyId(), value: tx.amount },
            { key: getOnlyId(), value: tx.fee },
          ]
        })));
        setAllCount(parseInt(data.TxNum));
      }
    });
    return () => subOption.unsubscribe();
  }, [ page, blockId, limit ]);

  useEffect(() => {
    if (blockId === undefined) return;
    setInfoLoading(true);
    const sub = fetchData('GET', 'block_detail', { height: blockId }).subscribe(({ success, data }) => {
      if (success) {
        setInfoLoading(false);
        setBlockInfo({
          id: data.BlockId,
          size: data.Bytes,
          node: data.Node,
          tranVol: data.TxNum,
          fee: data.Fee,
          producer: data.Miner,
          hash: data.LastBlockId,
          time: formatTime(data.Timestamp),
        });
      }
    });
    return () => sub.unsubscribe();
  }, [blockId]);
  
  return (
    <ComponentsLayoutBase className="block_page">
      <h1 className="block_page_title">
        <I18 text="block" />&nbsp;
        <Link className="block_page_title_link" replace to={location => location}>#{blockId}</Link>
      </h1>
      <div className="block_page_info">
        <h2 className="block_content_title"><I18 text="blockInfo" /></h2>
        <div className="block_info_box">
          <dl className="block_info_dl">
            <dt className="block_info_dt"><I18 text="blockId" /></dt>
            <dd className="block_info_dd">
              {blockInfo.id}
              {blockInfo.id && (
                <button className="block_info_copy" onClick={() => copy(blockInfo.id)}>
                  <ComConSvg xlinkHref="#icon-copy" />
                </button>
              )}
            </dd>
          </dl>
          <dl className="block_info_dl">
            <dt className="block_info_dt"><I18 text="size" /></dt>
            <dd className="block_info_dd">{blockInfo.size ? `${blockInfo.size} Bytes` : ''}</dd>
          </dl>
          <dl className="block_info_dl">
            <dt className="block_info_dt"><I18 text="productionBlockNode" /></dt>
            <dd className="block_info_dd">{blockInfo.node}</dd>
          </dl>
          <dl className="block_info_dl">
            <dt className="block_info_dt"><I18 text="transactionVolume" /></dt>
            <dd className="block_info_dd">{blockInfo.tranVol}</dd>
          </dl>
          <dl className="block_info_dl">
            <dt className="block_info_dt"><I18 text="feeNumber" /></dt>
            <dd className="block_info_dd">{blockInfo.fee}{ getEnvConfig.APP_TOKEN_NAME }</dd>
          </dl>
          <dl className="block_info_dl">
            <dt className="block_info_dt"><I18 text="producer" /></dt>
            <dd className="block_info_dd">{blockInfo.producer}</dd>
          </dl>
          <dl className="block_info_dl">
            <dt className="block_info_dt"><I18 text="rootHashTree" /></dt>
            <dd className="block_info_dd">{blockInfo.hash}</dd>
          </dl>
          <dl className="block_info_dl">
            <dt className="block_info_dt"><I18 text="time" /></dt>
            <dd className="block_info_dd">{blockInfo.time}</dd>
          </dl>
        </div>
        <ComConLoading visible={infoLoading} />
      </div>
      <div className="block_page_table">
        <h2 className="block_content_title"><I18 text="transactionList" /></h2>
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

export default PageBlockInfo;

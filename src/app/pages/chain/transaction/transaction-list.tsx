import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import I18 from '../../../../i18n/component';
import { formatSearch, formatTime, getOnlyId, useSafeLink, walletVerifyAddress } from '../../../../tools';
import { fetchData } from '../../../../tools/ajax';
import { justifySearch } from '../../../../tools/url';
import ComConLink from '../../../components/control/link';
import ComConTable, { TypeComConTableContent, TypeComConTableHeader } from '../../../components/control/table.copy';
import ComponentsLayoutBase from '../../../components/layout/base';

import './transaction.scss';

const PageBlocksList: FC = () => {
  const location = useLocation();
  const goLink = useSafeLink();
  const [tableHeader, setTableHeader] = useState<TypeComConTableHeader>([]);
  const [tableContent, setTableContent] = useState<TypeComConTableContent>([]);
  const [page, setPage] = useState<number>(1);
  const [allCount, setAllCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTableHeader(
      [ 'ID', 'blockHeight', 'time', 'from', 'to', 'transactionOfNumber', 'feeNumber' ]
        .map(text => ({ key: getOnlyId(), value: <I18 text={text} /> }))
    );
  }, []);

  const onPageChange = useCallback((num: number) => {
    const searchObj = formatSearch<{page: string, limit: string}>(location.search);
    searchObj.page = `${num}`;
    goLink(`./transaction-list?${justifySearch(searchObj)}`);
  }, [goLink, location.search]);

  useEffect(() => {
    const searchObj = formatSearch<{page: string, limit: string}>(location.search);
    setPage(parseFloat(searchObj.page) || 1);
    setLimit(parseFloat(searchObj.limit) || 10);
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    const getBlockList = fetchData('GET', '/txs', { page: page, limit: limit }).subscribe(({ success, data: txsList }) => {
      if (success) {
        setLoading(false);
        setAllCount(parseInt(txsList.count));
        setTableContent(txsList.info.map((tx: any) => {
          let txError = tx.code !== 0;
          return {
            key: getOnlyId(),
            error: txError,
            value: [
              { key: getOnlyId(), value: <ComConLink link={`./transaction/${tx.hash}`}>{ tx.hash }</ComConLink> },
              { key: getOnlyId(), value: <ComConLink link={`./block/${tx.block_id}`}>{ tx.block_id }</ComConLink> },
              { key: getOnlyId(), value: formatTime(tx.create_time) },
              { key: getOnlyId(), value: <ComConLink link={walletVerifyAddress(tx.from)}>{ tx.from }</ComConLink> },
              { key: getOnlyId(), value: <ComConLink link={walletVerifyAddress(tx.to)}>{ tx.to }</ComConLink> },
              { key: getOnlyId(), value: tx.amount },
              { key: getOnlyId(), value: tx.fee },
            ]
          };
        }));
      }
    });
    return () => getBlockList.unsubscribe();
  }, [page, limit]);


  return (
    <ComponentsLayoutBase headerBg bg={false} className="transaction_list_page">
      <div className="transaction_list_content">
        <h2 className="transaction_title"><I18 text="newTransaction" /></h2>
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

export default PageBlocksList;

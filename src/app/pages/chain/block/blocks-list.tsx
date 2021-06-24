import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import I18 from '../../../../i18n/component';
import { formatSearch, formatTime, getOnlyId, useSafeLink } from '../../../../tools';
import { fetchData } from '../../../../tools/ajax';
import { justifySearch } from '../../../../tools/url';
import ComConLink from '../../../components/control/link';
import ComConTable, { TypeComConTableContent, TypeComConTableHeader } from '../../../components/control/table.copy';
import ComponentsLayoutBase from '../../../components/layout/base';

import './blocks.scss';

const PageBlocksList: FC = () => {
  const location = useLocation();
  const goLink = useSafeLink();
  const [blockHeight, setBlockHeight] = useState(0);
  const [tableHeader, setTableHeader] = useState<TypeComConTableHeader>([]);
  const [tableContent, setTableContent] = useState<TypeComConTableContent>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTableHeader(
      [ 'blockHeight', 'blockTimeStamp', 'producer', 'blockId', 'transactionVolume', 'feeNumber' ]
        .map(text => ({ key: getOnlyId(), value: <I18 text={text} /> }))
    );
  }, []);

  const onPageChange = useCallback((num: number) => {
    const searchObj = formatSearch<{page: string, limit: string}>(location.search);
    searchObj.page = `${num}`;
    goLink(`./blocks-list?${justifySearch(searchObj)}`);
  }, [goLink, location.search]);

  useEffect(() => {
    const searchObj = formatSearch<{page: string, limit: string}>(location.search);
    setPage(parseFloat(searchObj.page) || 1);
    setLimit(parseFloat(searchObj.limit) || 10);
  }, [location.search]);


  useEffect(() => {
    const getBlockHeight = fetchData('GET', 'info').subscribe(({ success, data }) => (success && setBlockHeight(parseInt(data.block_num))));
    return () => getBlockHeight.unsubscribe();
  }, []);

  useEffect(() => {
    if (blockHeight === 0) return;
    // block List
    const maxHeight = blockHeight - (page - 1) * limit;
    const minHeight = blockHeight - page * limit;
    setLoading(true);
    const getBlockList = fetchData('GET', '/blockchain', { minHeight: minHeight, maxHeight: maxHeight }).subscribe(({ success, data: blockList }) => {
      setLoading(false);
      if (success) {
        setTableContent(blockList.map((block: any) => ({
          key: getOnlyId(),
          value: [
            { key: getOnlyId(), value: <ComConLink link={`/block/${block.block_id}`}>{ block.block_id }</ComConLink> },
            { key: getOnlyId(), value: formatTime(block.time) },
            { key: getOnlyId(), value: <ComConLink link={`/account/${block.address}`} noLink>{ block.address }</ComConLink> },
            { key: getOnlyId(), value: <ComConLink link={`/block/${block.block_id}`}>{ block.hash }</ComConLink> },
            { key: getOnlyId(), value: block.tx_num },
            { key: getOnlyId(), value: block.tx_fee },
          ]
        })));
      }
    });
    return () => getBlockList.unsubscribe();
  }, [blockHeight, page, limit]);


  return (
    <ComponentsLayoutBase headerBg bg={false} className="blocks_list_page">
      <div className="blocks_list_content">
        <h2 className="block_title"><I18 text="blocksList" /></h2>
        {useMemo(() => (
          <ComConTable
            showTools
            loading={loading}
            header={tableHeader}
            content={tableContent}
            allCount={blockHeight}
            page={page}
            limit={limit}
            onPageChange={onPageChange} />
        ), [tableHeader, tableContent, blockHeight, page, limit, onPageChange, loading])}
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageBlocksList;

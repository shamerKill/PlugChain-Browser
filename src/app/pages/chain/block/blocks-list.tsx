import { FC, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import I18 from '../../../../i18n/component';
import { formatSearch, useSafeLink } from '../../../../tools';
import { justifySearch } from '../../../../tools/url';
import ComConTable from '../../../components/control/table';
import ComponentsLayoutBase from '../../../components/layout/base';

import './blocks.scss';

const PageBlocksList: FC = () => {
  const location = useLocation();
  const goLink = useSafeLink();
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const [tableContent, setTableContent] = useState<(string|ReactElement)[][]>([]);
  const [page, setPage] = useState<number>(1);
  const [allCount, setAllCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setTableHeader([ 'blockHeight', 'blockTimeStamp', 'producer', 'blockId', 'transactionVolume', 'freeNumber' ]);
  }, []);

  useEffect(() => {
    const getLink = (text: string): ReactElement => <Link className="a_link" to="/">{text}</Link>;
    if (page) {
      setTableContent([
        [ getLink('13456233'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
        [ getLink('13456233'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
        [ getLink('13456233'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
        [ getLink('13456233'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
      ]);
    }
  }, [page, limit]);

  const onPageChange = useCallback((num: number) => {
    const searchObj = formatSearch<{page: string, limit: string}>(location.search);
    searchObj.page = `${num}`;
    goLink(`./blocks-list?${justifySearch(searchObj)}`);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, [goLink, location.search]);

  useEffect(() => {
    const searchObj = formatSearch<{page: string, limit: string}>(location.search);
    setPage(parseFloat(searchObj.page) || 1);
    setLimit(parseFloat(searchObj.limit) || 10);
    setAllCount(1000);
  }, [location.search]);


  return (
    <ComponentsLayoutBase headerBg bg={false} className="blocks_list_page">
      <div className="blocks_list_content">
        <h2 className="block_title"><I18 text="blocksList" /></h2>
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

export default PageBlocksList;

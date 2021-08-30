import { FC, Fragment, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { formatClass, getOnlyId } from '../../../tools';
import I18 from '../../../i18n/component';
import ComConLoading from './loading';

export type TypeComConTableHeader = {key: string, value: (string|ReactElement)}[];
export type TypeComConTableContent = { key: string, value: {key: string, value: (string|ReactElement)}[], error?: boolean }[];

const ComConTable: FC<{
  header: TypeComConTableHeader;
  content: TypeComConTableContent;
  tableClass?: string;
  showTools?: boolean;
  boxClass?: string;
  allCount?: number;
  page?: number;
  limit?: number;
  loading?: boolean;
  onPageChange?: (num: number) => void;
}> = ({
  header, content, tableClass, boxClass, allCount, page, limit, onPageChange, showTools, loading,
}) => {
  
  return (
    <div className={formatClass(['control-table-box', boxClass])}>
      <div  className={formatClass(['control-table-inner', boxClass])}>
        <table className={formatClass(['control-table', tableClass])} cellSpacing="0">
          { useMemo(() => (
            <thead className={formatClass(['control-thead'])}>
              <tr className={formatClass(['control-tr'])}>
                {
                  header.map(item => (
                    <td className={formatClass(['control-td'])} key={item.key}>{ item.value }</td>
                  ))
                }
              </tr>
            </thead>
          ), [header]) }
          { useMemo(() => (
            <tbody className={formatClass(['control-tbody'])}>
              {
                content.map((row) => (
                  <tr className={formatClass(['control-tr', row.error && 'control-tr-error'])} key={row.key}>
                    {
                      row.value.map(col => (
                        <td className={formatClass(['control-td'])} key={col.key}>{ col.value }</td>
                      ))
                    }
                  </tr>
                ))
              }
            </tbody>
          ), [content]) }
        </table>
      </div>
      {/* tools */}
      <TablePageTools {...{allCount, page, limit, onPageChange, showTools}} />
      {/* loading */}
      <ComConLoading visible={loading} />
    </div>
  );
};


export const TablePageTools: FC<{
  showTools?: boolean;
  allCount?: number;
  page?: number;
  limit?: number;
  loading?: boolean;
  onPageChange?: (num: number) => void;
}> = ({
  allCount, page, limit, onPageChange, showTools
}) => {
  // max items length of page's list
  const showMaxPages = 5;
  // length of pages
  const [allPage, setAllPage] = useState<number>();
  const [pagesList, setPagesList] = useState<ReactElement[]>([]);
  const [goToPage, setGoToPage] = useState('');

  useEffect(() => {
    if (allCount && limit) setAllPage(Math.ceil(allCount / limit));
  }, [limit, allCount]);
  useEffect(() => {
    setGoToPage(`${page}`);
  }, [page]);
  const itemButton = useCallback((num: number, className?: string) => (
    <button className={formatClass(['control-table-options', className])} onClick={() => onPageChange?.(num)}>{ num }</button>
  ), [onPageChange]);
  const moreItem = useMemo(() => <div className={formatClass(['control-table-more'])}>...</div>, []);

  const customGoToPage = useCallback((input: string) => {
    const value = parseFloat(input);
    if (Number.isNaN(value)) return;
    if (!allPage) return;
    if (value > 0 && value <= allPage) onPageChange?.(value);
  }, [onPageChange, allPage]);

  useEffect(() => {
    if (page === undefined || allPage === undefined) return;
    const result: typeof pagesList = [];
    const maxShowLength = allPage > showMaxPages ? showMaxPages : allPage;
    let nowIndex = Math.floor(maxShowLength / 2);
    const moveLen = page - nowIndex - 1;
    // verify left
    if (moveLen <= 0 || maxShowLength === 4) nowIndex += moveLen;
    else if (moveLen === 1) result.push(itemButton(1));
    else result.push(<>{itemButton(1)}{moreItem}</>);
    // add item
    const showItemArr: typeof pagesList = [];
    for (let i = 0; i < maxShowLength; i++) {
      let ele: ReactElement;
      if (i === nowIndex) ele = itemButton(page, 'control-table-selected');
      else {
        let otherPage = page + i - nowIndex;
        if (otherPage > allPage) {
          otherPage = page - (otherPage - allPage) - nowIndex;
          ele = itemButton(otherPage);
          showItemArr.unshift(ele);
          continue;
        } else {
          ele = itemButton(otherPage);
        }
      }
      showItemArr.push(ele);
    }
    showItemArr.forEach(item => result.push(item));
    // verify right
    if ((maxShowLength + page - nowIndex) === allPage) result.push(itemButton(allPage));
    else if ((maxShowLength + page - nowIndex) < allPage) result.push(<>{moreItem}{itemButton(allPage)}</>);
    setPagesList(result);
  }, [allPage, page, itemButton, moreItem]);

  return (
    <div className={formatClass(['control-table-tools', showTools && 'control-table-tools-show'])}>
        {/* click */}
        {
          useMemo(() => pagesList.length ? (
            <div className={formatClass(['control-table-tabs'])}>
              { pagesList.map(item => <Fragment key={getOnlyId()}>{item}</Fragment>) }
            </div>
          ) : (<></>), [pagesList])
        }
        {/* go to */}
        {
          useMemo(() => pagesList.length ? (
            <div className={formatClass(['control-table-goto'])}>
              <button
                className={formatClass(['control-table-goto-button'])}
                onClick={() => customGoToPage(goToPage)}>
                <I18 text="goTo" />
              </button>
              <input
                type="number"
                className={formatClass(['control-table-goto-input'])}
                value={goToPage}
                onChange={e => setGoToPage(e.target.value)}
                onKeyDown={(e) => e.code === 'Enter' && customGoToPage(goToPage)} />
            </div>
          ) : (<></>), [pagesList, goToPage, customGoToPage])
        }
      </div>
  );
};

export default ComConTable;

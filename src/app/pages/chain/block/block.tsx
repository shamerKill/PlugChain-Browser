import { FC, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import I18 from '../../../../i18n/component';
import useI18 from '../../../../i18n/hooks';
import { useFormatPath } from '../../../../tools';
import ComConLoading from '../../../components/control/loading';
import ComConTable from '../../../components/control/table';
import ComponentsLayoutBase from '../../../components/layout/base';
import alertTools from '../../../components/tools/alert';

import './blocks.scss';

const PageBlockInfo: FC = () => {
  const [, blockId ] = useFormatPath();
  const copySuccess = useI18('copySuccess');
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const [tableContent, setTableContent] = useState<(string|ReactElement)[][]>([]);
  const [page, setPage] = useState<number>(0);
  const [allCount, setAllCount] = useState<number>(0);
  const [limit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [blockInfo, setBlockInfo] = useState<{ id: string; size: number; node: string; tranVol: number; fee: number; producer: string; hash: string; time: string; }>(
    { id: '', size: 0, node: '', tranVol: 0, fee: 0, producer: '', hash: '', time: '' }
  );
  
  const copy = (str: string) => {
    alertTools.create({ message: copySuccess + str });
  };

  const onPageChange = useCallback((num: number) => {
    setPage(num);
    setAllCount(100);
  }, []);

  useEffect(() => {
    setLoading(true);
    const getLink = (text: string): ReactElement => <Link className="a_link" to="/">{text}</Link>;
    if (page) {
      setLoading(true);
      const doTimer = setTimeout(() => {
        setLoading(false);
        setTableContent([
          [ getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('12345'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
          [ getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('12345'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
          [ getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('12345'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
          [ getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('12345'), '2021-04-26 17:23:34', getLink('AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A'), getLink('11c6aa6e40bf2211c6aa6e40bf22'), '0', '0' ],
        ]);
      }, 1000);
      return () => clearTimeout(doTimer);
    }
  }, [page, limit]);

  useEffect(() => {
    setTableHeader([ 'ID', 'blockHeight', 'time', 'from', 'to', 'transactionVolume', 'feeNumber' ]);
    onPageChange(1);
    setInfoLoading(true);
    const doTimer = setTimeout(() => {
      setInfoLoading(false);
      setBlockInfo({
        id: '5a7bd162f4d23ab0804374d00b54babe0d517d3d6178d8cade5eb7d3757c1357',
        size: 6080,
        node: 'D1c4f27a',
        tranVol: 1920,
        fee: 19200,
        producer: 'A2Fj1etiW7yQSbSKcgK3vpd4Y1YrgGXT5T',
        hash: 'abffb9e7a0aca6d9c9c315de8fb070c333c7f797d20215cb12cf70a972a7c00f',
        time: '2021-04-29 09:22:09',
      });
    }, 1000);
    return () => clearTimeout(doTimer);
  }, [onPageChange]);
  
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
                  <svg className="icon" aria-hidden="true"><use xlinkHref="#icon-copy"></use></svg>
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
            <dd className="block_info_dd"><Link to="/">{blockInfo.node}</Link></dd>
          </dl>
          <dl className="block_info_dl">
            <dt className="block_info_dt"><I18 text="transactionVolume" /></dt>
            <dd className="block_info_dd">{blockInfo.tranVol || ''}</dd>
          </dl>
          <dl className="block_info_dl">
            <dt className="block_info_dt"><I18 text="feeNumber" /></dt>
            <dd className="block_info_dd">{blockInfo.fee ? `${blockInfo.fee} ONP` : ''}</dd>
          </dl>
          <dl className="block_info_dl">
            <dt className="block_info_dt"><I18 text="producer" /></dt>
            <dd className="block_info_dd"><Link to="/">{blockInfo.producer}</Link></dd>
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

export default PageBlockInfo;

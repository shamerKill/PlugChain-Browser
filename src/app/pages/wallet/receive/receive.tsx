import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import ComConButton from '../../../components/control/button';

import './receive.scss';
import ComConTable from '../../../components/control/table';

const PageWalletReceive: FC = () => {
  const [address, setAddress] = useState('');
  const [volume, setVolume] = useState('0');
  const [receiveLoading, setReceiveLoading] = useState(false);
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const [tableContent, setTableContent] = useState<(string|ReactElement)[][]>([]);

  const verifyReceive = () => {
    setReceiveLoading(true);
  };

  useEffect(() => {
    setTableHeader([ 'address', 'time', 'volume' ]);
    setTableContent([
      [ 'AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A', '2021-04-26 17:23:34', '100.00' ],
      [ 'AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A', '2021-04-26 17:23:34', '100.00' ],
      [ 'AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A', '2021-04-26 17:23:34', '100.00' ],
      [ 'AF4g7NtfRJb57AAF4g7NtfRJb57AAF4g7NtfRJb57A', '2021-04-26 17:23:34', '100.00' ],
    ]);
  }, []);

  return (
    <ComponentsLayoutBase className="page_wallet_receive">
      <div className="receive_inner">
        <h2 className="page_wallet_title"><I18 text="receive" /></h2>
        <div className="receive_box">
          <div className="receive_tips">
            <dl className="receive_tip_dl">
              <dt className="receive_tip_dt"><I18 text="receiveWeek" /></dt>
              <dd className="receive_tip_dd">70&nbsp;ONP</dd>
            </dl>
            <dl className="receive_tip_dl">
              <dt className="receive_tip_dt"><I18 text="receiveOnce" /></dt>
              <dd className="receive_tip_dd">10&nbsp;ONP</dd>
            </dl>
          </div>
          <p className="receive_box_title"><I18 text="address" /></p>
          <div className="receive_box_label">
            <input
              className="receive_box_input"
              type="text"
              disabled={receiveLoading}
              value={address}
              onChange={e => setAddress(e.target.value)} />
          </div>
          <p className="receive_box_title"><I18 text="receiveVolume" /></p>
          <div className="receive_box_label">
            <input
              className="receive_box_input"
              type="number"
              disabled={receiveLoading}
              value={volume}
              onChange={e => setVolume(e.target.value)} />
            <p className="receive_box_info">ONP</p>
          </div>
          <ComConButton
            loading={receiveLoading}
            onClick={verifyReceive}
            className="receive_confirm_button">
            <I18 text="confirm" />
          </ComConButton>
        </div>
      </div>
      <div className="receive_content">
        <h2 className="receive_title"><I18 text="receiveLogs" /></h2>
        {useMemo(() => (
          <ComConTable
            showTools
            header={tableHeader.map(text => <I18 text={text} />)}
            content={tableContent} />
        ), [tableHeader, tableContent])}
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageWalletReceive;

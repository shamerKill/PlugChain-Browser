import { FC, useEffect, useState } from 'react';
import { useFormatSearch } from '../../../../tools';
import ComConSvg from '../../../components/control/icon';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';

import './info-pledge.scss';
import ComConButton from '../../../components/control/button';

type TypePledgeNodeInfo = {
  avatar: string;
  name: string;
  address: string;
  pledged: string;
  rewardRate: string;
  fee: string;
  earned: string;
};

const PageInfoPledge: FC = () => {
  const search = useFormatSearch<{id: string}>();
  const [pledgeNodeInfo, setPledgeNodeInfo] = useState<TypePledgeNodeInfo>({
    avatar: '', name: '', address: '', pledged: '', rewardRate: '', fee: '', earned: '',
  });

  useEffect(() => {
    if (!search) return;
    console.log('id:',search.id);
    setPledgeNodeInfo({
      avatar: require('../../../../assets/images/user_avatar.png'),
      name: 'Compass', address: '0x1f8dec5061b0d9bf17e5828f249142b39dab84b4',
      pledged: '12,129,199.31', rewardRate: '10.9%', fee: '12', earned: '199.31',
    });
  }, [search]);
  return (
    <ComponentsLayoutBase className="page_info_pledge">
      <div className="info_pledge_inner">
        <div className="header_account">
          <div className="account_user">
            <img src={pledgeNodeInfo.avatar} alt="avatar" className="account_avatar" />
            <span className="account_name">{ pledgeNodeInfo.name }</span>
          </div>
          <p className="account_address">
            <ComConSvg className="account_address_icon" xlinkHref="#icon-card" />
            { pledgeNodeInfo.address }
          </p>
        </div>
        {/* info */}
        <div className="info_list">
          <div className="info_item_box">
            <dl className="info_item_dl">
              <dt className="info_item_dt">{ pledgeNodeInfo.pledged }&nbsp;<small className="info_item_small">ONP</small></dt>
              <dd className="info_item_dd"><I18 text="pledged" /></dd>
            </dl>
          </div>
          <div className="info_item_box">
          <dl className="info_item_dl">
            <dt className="info_item_dt">{ pledgeNodeInfo.rewardRate }</dt>
            <dd className="info_item_dd"><I18 text="willProfit" /></dd>
          </dl>
          </div>
          <div className="info_item_box">
          <dl className="info_item_dl">
            <dt className="info_item_dt">{ pledgeNodeInfo.fee }&nbsp;<small className="info_item_small">ONP</small></dt>
            <dd className="info_item_dd"><I18 text="feeNumber" /></dd>
          </dl>
          </div>
          <div className="info_item_box">
            <dl className="info_item_dl">
              <dt className="info_item_dt">{ pledgeNodeInfo.earned }&nbsp;<small className="info_item_small">ONP</small></dt>
              <dd className="info_item_dd"><I18 text="earned" /></dd>
            </dl>
          </div>
        </div>
        <div className="info_buttons">
          <ComConButton
            className="info_button">
            <ComConSvg className="info_button_icon" xlinkHref="#icon-redeem" />
            <I18 text="redeem" />
          </ComConButton>
          <ComConButton
            className="info_button"
            contrast>
            <ComConSvg className="info_button_icon" xlinkHref="#icon-transfer" />
            <I18 text="changePledge" />
          </ComConButton>
        </div>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageInfoPledge;

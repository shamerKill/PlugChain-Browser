import { FC, useEffect, useState } from 'react';
import { formatClass, getEnvConfig, getOnlyId, useFormatSearch, useSafeLink } from '../../../../tools';
import ComConSvg from '../../../components/control/icon';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';

import './transfer-pledge.scss';
import { Link } from 'react-router-dom';
import ComConButton from '../../../components/control/button';
import alertTools from '../../../components/tools/alert';

type TypePledgeNodeInfo = {
  avatar: string;
  name: string;
  address: string;
  pledged: string;
  rewardRate: string;
  fee: string;
  earned: string;
};

type TypeNodesInfo = {
  avatar: string;
  name: string;
  rate: string;
  pledgedVolume: string;
  fee: string;
  key: string;
};

const PageTransferPledge: FC = () => {
  const goLink = useSafeLink();
  const search = useFormatSearch<{id: string}>();
  const [pledgeNodeInfo, setPledgeNodeInfo] = useState<TypePledgeNodeInfo>({
    avatar: '', name: '', address: '', pledged: '', rewardRate: '', fee: '', earned: '',
  });
  const [nodes, setNodes] = useState<TypeNodesInfo[]>([]);
  const [nodeSelected, setNodeSelected] = useState<number>();

  const changeNodeSelected = (index: number) => {
    setNodeSelected(index);
  }

  const submitTransfer = () => {
    alertTools.create({ message: <I18 text="success" />, type: 'info' });
    goLink('/wallet/my-pledge');
  }

  useEffect(() => {
    if (!search) return;
    console.log('id:',search.id);
    setPledgeNodeInfo({
      avatar: require('../../../../assets/images/user_avatar.png'),
      name: 'Compass', address: '0x1f8dec5061b0d9bf17e5828f249142b39dab84b4',
      pledged: '12,129,199.31', rewardRate: '10.9%', fee: '12', earned: '199.31',
    });
    setNodes([
      { avatar: require('../../../../assets/images/user_avatar.png'), name: '👋Nodes1🌈', rate: '90.2%', pledgedVolume: '100861.12', fee: '1', key: getOnlyId() },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: 'Nodes2🌈', rate: '90.2%', pledgedVolume: '100861.12', fee: '1', key: getOnlyId() },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: '👋Nodes2', rate: '90.2%', pledgedVolume: '100861.12', fee: '10', key: getOnlyId() },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: '(0.0)👂', rate: '90.2%', pledgedVolume: '100861.12', fee: '5', key: getOnlyId() },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: 'Nodes4🦢', rate: '90.2%', pledgedVolume: '100861.12', fee: '2', key: getOnlyId() },
    ]);
  }, [search]);

  return (
    <ComponentsLayoutBase className="page_transfer_pledge">
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
        <div className="info_list">
          <div className="info_item_box">
            <dl className="info_item_dl">
              <dt className="info_item_dt">{ pledgeNodeInfo.pledged }&nbsp;<small className="info_item_small">{ getEnvConfig.APP_TOKEN_NAME_VIEW }</small></dt>
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
            <dt className="info_item_dt">{ pledgeNodeInfo.fee }&nbsp;<small className="info_item_small">{ getEnvConfig.APP_TOKEN_NAME_VIEW }</small></dt>
            <dd className="info_item_dd"><I18 text="feeNumber" /></dd>
          </dl>
          </div>
          <div className="info_item_box">
            <dl className="info_item_dl">
              <dt className="info_item_dt">{ pledgeNodeInfo.earned }&nbsp;<small className="info_item_small">{ getEnvConfig.APP_TOKEN_NAME_VIEW }</small></dt>
              <dd className="info_item_dd"><I18 text="earned" /></dd>
            </dl>
          </div>
        </div>
        <div className="pledge_node_title"><I18 text="changePledgeNode" /></div>
        <div className="pledge_nodes">
          {
            nodes.map((node, index) => (
              <div
                className={formatClass(['pledge_node', nodeSelected === index && 'pledge_node_selected'])}
                key={node.key}
                onClick={() => changeNodeSelected(index)}>
                <div className="pledge_node_inner">
                  <div className="pledge_node_header">
                    <img src={node.avatar} alt={node.name} className="node_avatar" />
                    <Link className="node_name" to={`/wallet/transaction-pledge?id=${node.name}`}>{node.name}</Link>
                  </div>
                  <div className="pledge_node_content">
                    <div className="pledge_node_info">
                      <dl className="pledge_node_dl">
                        <dt className="pledge_node_dt">{node.rate}</dt>
                        <dt className="pledge_node_dd"><I18 text="willProfit" /></dt>
                      </dl>
                      <dl className="pledge_node_dl">
                        <dt className="pledge_node_dt">{node.pledgedVolume}</dt>
                        <dt className="pledge_node_dd"><I18 text="pledgeVolume" />({ getEnvConfig.APP_TOKEN_NAME_VIEW })</dt>
                      </dl>
                      <dl className="pledge_node_dl">
                        <dt className="pledge_node_dt">{node.fee}</dt>
                        <dt className="pledge_node_dd"><I18 text="feeNumber" />({ getEnvConfig.APP_TOKEN_NAME_VIEW })</dt>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <ComConButton onClick={submitTransfer} className="transfer_confirm_button"><I18 text="confirmTransfer" /></ComConButton>
        <div className="pledge_footer">
          <div className="pledge_footer_item"><span className="pledge_footer_span"><I18 text="pledgeTransferTip1" /></span></div>
        </div>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageTransferPledge;

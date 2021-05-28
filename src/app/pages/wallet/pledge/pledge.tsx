import { FC, useEffect, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';

import './pledge.scss';
import { getOnlyId, useSafeLink } from '../../../../tools';
import ComConButton from '../../../components/control/button';
import { Link } from 'react-router-dom';

type TypeNodesInfo = {
  avatar: string;
  name: string;
  rate: string;
  pledgedVolume: string;
  minVolume: string;
};

const PageWalletPledge: FC = () => {
  const goLink = useSafeLink();
  const [nodes, setNodes] = useState<TypeNodesInfo[]>([]);

  const goToChange = (id: string) => {
    goLink(`/wallet/transaction-pledge?id=${id}`);
  };

  useEffect(() => {
    setNodes([
      { avatar: require('../../../../assets/images/user_avatar.png'), name: '👋Nodes1🌈', rate: '90.2%', pledgedVolume: '100861.12', minVolume: '100' },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: 'Nodes2🌈', rate: '90.2%', pledgedVolume: '100861.12', minVolume: '100' },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: '👋Nodes2', rate: '90.2%', pledgedVolume: '100861.12', minVolume: '100' },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: '(0.0)👂', rate: '90.2%', pledgedVolume: '100861.12', minVolume: '100' },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: 'Nodes4🦢', rate: '90.2%', pledgedVolume: '100861.12', minVolume: '100' },
    ]);
  }, []);

  return (
    <ComponentsLayoutBase className="page_wallet_pledge" bg={false}>
      <img src={require('../../../../assets/images/pledge_bg.jpg')} alt="pledge_bg" className="pledge_bg" />
      <h1 className="pledge_title"><I18 text="pledgeMining" /></h1>
      <ul className="pledge_tip_list">
        <li className="pledge_tip_item"><I18 text="pledgePageTip1" /></li>
        <li className="pledge_tip_item"><I18 text="pledgePageTip2" /></li>
        <li className="pledge_tip_item"><I18 text="pledgePageTip3" /></li>
        <li className="pledge_tip_item"><I18 text="pledgePageTip4" /></li>
        <li className="pledge_tip_item"><I18 text="pledgePageTip5" /></li>
      </ul>
      <h1 className="pledge_title"><I18 text="selectJoin" /></h1>
      <div className="pledge_nodes">
        {
          nodes.map(node => (
            <div className="pledge_node" key={getOnlyId()}>
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
                      <dt className="pledge_node_dd"><I18 text="pledgeVolume" />(PLUG)</dt>
                    </dl>
                    <dl className="pledge_node_dl">
                      <dt className="pledge_node_dt">{node.minVolume}</dt>
                      <dt className="pledge_node_dd"><I18 text="minPledgeVolume" />(PLUG)</dt>
                    </dl>
                  </div>
                  <ComConButton className="pledge_node_button" onClick={() => goToChange(node.name)}>选择</ComConButton>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageWalletPledge;

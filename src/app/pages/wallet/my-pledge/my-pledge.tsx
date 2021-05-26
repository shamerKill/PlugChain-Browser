import React, { FC, useEffect, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';

import './my-pledge.scss';
import { getOnlyId } from '../../../../tools';
import { Link } from 'react-router-dom';
import ComConButton from '../../../components/control/button';

type TypeNodesInfo = {
  avatar: string;
  name: string;
  rate: string;
  pledgedVolume: string;
};

const PageMyPledge: FC = () => {
  const [nodes, setNodes] = useState<TypeNodesInfo[]>([]);

  useEffect(() => {
    setNodes([
      { avatar: require('../../../../assets/images/user_avatar.png'), name: '👋Nodes1🌈', rate: '90.2%', pledgedVolume: '1861.12' },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: 'Nodes2🌈', rate: '90.2%', pledgedVolume: '161.12' },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: '👋Nodes2', rate: '90.2%', pledgedVolume: '11.12' },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: '(0.0)👂', rate: '90.2%', pledgedVolume: '1.12' },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: 'Nodes4🦢', rate: '90.2%', pledgedVolume: '8.12' },
    ]);
  }, []);

  return (
    <ComponentsLayoutBase className="page_my_pledge">
      <div className="my_pledge_inner">
        <h2 className="page_wallet_title"><I18 text="myPledge" /></h2>
      <div className="pledge_nodes">
        {
          nodes.map(node => (
            <div className="pledge_node" key={getOnlyId()}>
              <div className="pledge_node_inner">
                <div className="pledge_node_header">
                  <img src={node.avatar} alt={node.name} className="node_avatar" />
                  <Link className="node_name" to="">{node.name}</Link>
                  <ComConButton contrast className="node_detail"><I18 text="detail" /></ComConButton>
                </div>
                <div className="pledge_node_content">
                  <div className="pledge_node_info">
                    <dl className="pledge_node_dl">
                      <dt className="pledge_node_dt">{node.rate}</dt>
                      <dt className="pledge_node_dd"><I18 text="willProfit" /></dt>
                    </dl>
                    <dl className="pledge_node_dl">
                      <dt className="pledge_node_dt">{node.pledgedVolume}</dt>
                      <dt className="pledge_node_dd"><I18 text="pledgeVolume" />(ONP)</dt>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageMyPledge;

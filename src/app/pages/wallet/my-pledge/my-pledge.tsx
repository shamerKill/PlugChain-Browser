import { FC, useEffect, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';

import './my-pledge.scss';
import { getOnlyId, useSafeLink } from '../../../../tools';
import { Link } from 'react-router-dom';
import ComConButton from '../../../components/control/button';
import useGetDispatch from '../../../../databases/hook';
import { InRootState } from '../../../../@types/redux';
import { fetchData } from '../../../../tools/ajax';

type TypeNodesInfo = {
  avatar: string;
  name: string;
  rate: string;
  pledgedVolume: string;
};

const PageMyPledge: FC = () => {
  const goLink = useSafeLink();
  const [wallet] = useGetDispatch<InRootState['wallet']>('wallet');
  const [nodes, setNodes] = useState<TypeNodesInfo[]>([]);

  const goToDetail = (id: string) => {
    goLink(`/wallet/info-pledge?id=${id}`);
  }

  useEffect(() => {
    setNodes([
      { avatar: require('../../../../assets/images/user_avatar.png'), name: '👋Nodes1🌈', rate: '90.2%', pledgedVolume: '1861.12' },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: 'Nodes2🌈', rate: '90.2%', pledgedVolume: '161.12' },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: '👋Nodes2', rate: '90.2%', pledgedVolume: '11.12' },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: '(0.0)👂', rate: '90.2%', pledgedVolume: '1.12' },
      { avatar: require('../../../../assets/images/user_avatar.png'), name: 'Nodes4🦢', rate: '90.2%', pledgedVolume: '8.12' },
    ]);
  }, []);

  useEffect(() => {
    if (!wallet.hasWallet) return goLink('./login');
    const pledgeSub = fetchData('GET', 'delegationsByAddress', { address: wallet.address }).subscribe(({ success, data }) => {
      if (success) {
        console.log(data);
      }
    });
    return () => pledgeSub.unsubscribe();
  }, [wallet, goLink]);

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
                  <Link className="node_name" to={`/wallet/transaction-pledge?id=${node.name}`}>{node.name}</Link>
                  <ComConButton contrast className="node_detail" onClick={() => goToDetail(node.name)}><I18 text="detail" /></ComConButton>
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

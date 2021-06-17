import { FC, useEffect, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import { getEnvConfig, getOnlyId, useSafeLink, walletAmountToToken } from '../../../../tools';
import ComConButton from '../../../components/control/button';
import { Link } from 'react-router-dom';
import { fetchData } from '../../../../tools/ajax';

import './pledge.scss';
import { formatNumberStr } from '../../../../tools/string';

type TypeNodesInfo = {
  avatar: string;
  name: string;
  rate: string;
  pledgedVolume: string;
  minVolume: string;
  address: string;
};

const PageWalletPledge: FC = () => {
  const goLink = useSafeLink();
  const [nodes, setNodes] = useState<TypeNodesInfo[]>([]);

  const goToChange = (id: string) => {
    goLink(`/wallet/transaction-pledge?id=${id}`);
  };

  useEffect(() => {
    fetchData('GET', '/validators').subscribe(({ success, data }) => {
      if (success) {
        setNodes(data.mininum.map((node: any) => ({
          avatar: node.description.image ? `${getEnvConfig.STATIC_URL}/${node.operator_address}/image.png` : `${getEnvConfig.STATIC_URL}/default/image.png`,
          name: node.description.moniker,
          // TODO: no year rate
          rate: '0.00%',
          pledgedVolume: formatNumberStr(walletAmountToToken(`${parseFloat(node.delegator_shares)}`)),
          minVolume: formatNumberStr(`${parseFloat(node.min_self_delegation)}`),
          address: node.operator_address,
        })));
      }
    });
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
                  <img className="node_avatar" alt={node.name} src={node.avatar} />
                  <Link className="node_name" to={`/wallet/transaction-pledge?id=${node.address}`}>{node.name}</Link>
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
                  <ComConButton className="pledge_node_button" onClick={() => goToChange(node.address)}>选择</ComConButton>
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

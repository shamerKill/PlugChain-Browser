import { FC, useEffect, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import { getEnvConfig, getOnlyId, useSafeLink, walletChainReward } from '../../../../tools';
import { Link } from 'react-router-dom';
import ComConButton from '../../../components/control/button';
import useGetDispatch from '../../../../databases/hook';
import { InRootState } from '../../../../@types/redux';
import { fetchData } from '../../../../tools/ajax';
import { formatNumberStr } from '../../../../tools/string';
import { walletAmountToToken } from '../../../../tools';

import './my-pledge.scss';

type TypeNodesInfo = {
  avatar: string;
  name: string;
  rate: string;
  pledgedVolume: string;
  address: string;
};

const PageMyPledge: FC = () => {
  const goLink = useSafeLink();
  const [wallet] = useGetDispatch<InRootState['wallet']>('wallet');
  const [nodes, setNodes] = useState<TypeNodesInfo[]>([]);
  const [loaded, setLoaded] = useState(false);

  const goToDetail = (id: string) => {
    goLink(`/wallet/info-pledge?id=${id}`);
  }

  useEffect(() => {
    if (!wallet.hasWallet) return goLink('./login');
    let canDo = true;
    const pledgeSub = fetchData('GET', 'delegationsByAddress', { address: wallet.address }).subscribe(async ({ success, data }) => {
      if (success && data && data.length > 0) {
        const resultArr: typeof nodes = [];
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const obj = {
            avatar: node.description.image ? `${getEnvConfig.STATIC_URL}/${node.operator_address}/image.png` : `${getEnvConfig.STATIC_URL}/default/image.png`,
            name: node.description.moniker,
            rate: `${await (walletChainReward(parseFloat(`${node.commission.commission_rates.rate}`)))}%`,
            pledgedVolume: formatNumberStr(walletAmountToToken(`${parseFloat(node.delegator_shares)}`)),
            minVolume: formatNumberStr(walletAmountToToken(`${parseFloat(node.min_self_delegation)}`)),
            address: node.operator_address,
          };
          resultArr.push(obj);
        }
        if (canDo) {
          setLoaded(true);
          setNodes(resultArr);
        }
      }
    });
    return () => {
      canDo = false;
      pledgeSub.unsubscribe();
    }
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
                    <img className="node_avatar" src={node.avatar} alt={node.name} />
                    <Link className="node_name" to={`/wallet/transaction-pledge?id=${node.address}`}>{node.name}</Link>
                    <ComConButton contrast className="node_detail" onClick={() => goToDetail(node.address)}><I18 text="detail" /></ComConButton>
                  </div>
                  <div className="pledge_node_content">
                    <div className="pledge_node_info">
                      <dl className="pledge_node_dl">
                        <dt className="pledge_node_dt">{node.rate}</dt>
                        <dt className="pledge_node_dd"><I18 text="willProfit" /></dt>
                      </dl>
                      <dl className="pledge_node_dl">
                        <dt className="pledge_node_dt">{node.pledgedVolume}</dt>
                        <dt className="pledge_node_dd"><I18 text="pledgeVolume" />({ getEnvConfig.APP_TOKEN_NAME })</dt>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
          {
            nodes.length === 0 && loaded && (
              <p className="pledge_no_node"><I18 text="noMyPledged" />. <Link to="./pledge"><I18 text="goToPledge" /></Link></p>
            )
          }
        </div>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageMyPledge;

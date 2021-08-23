import { FC, useEffect, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import { getEnvConfig, getOnlyId, useSafeLink, walletAmountToToken, walletChainReward } from '../../../../tools';
import ComConButton from '../../../components/control/button';
import { fetchData } from '../../../../tools/ajax';
import { formatNumberStr } from '../../../../tools/string';
import confirmTools from '../../../components/tools/confirm';

import './pledge.scss';
import alertTools from '../../../components/tools/alert';

type TypeNodesInfo = {
  avatar: string;
  name: string;
  rate: string;
  pledgedVolume: string;
  minVolume: string;
  address: string;
  type: number; // 0 invalid / 1 off-line / 2 backing / 3 running
};

const PageWalletPledge: FC = () => {
  const goLink = useSafeLink();
  const [nodes, setNodes] = useState<TypeNodesInfo[]>([]);

  const goToChange = (node: TypeNodesInfo) => {
    if (node.type === 3) return goLink(`/wallet/transaction-pledge?id=${node.address}`);
    if (node.type === 0) return alertTools.create({ message: <I18 text="nodeWarningTipMessage0" />, type: 'error'});
    else confirmTools.create({
      message: (
        <>
          <h2 className="node-tip-title"><I18 text="nodeWarningTipTitle" /></h2>
          <p className="node-tip-message">{ node.type === 1 ? <I18 text="nodeWarningTipMessage1" /> : <I18 text="nodeWarningTipMessage2" /> }</p>
        </>
      ),
      success: () => goLink(`/wallet/transaction-pledge?id=${node.address}`),
      close: () => {}
    });
  };

  useEffect(() => {
    let canDo = true;
    fetchData('GET', '/validators').subscribe(async ({ success, data }) => {
      if (success) {
        const resultArr: typeof nodes = [];
        for (let i = 0 ; i< data.mininum.length ; i++) {
          const node = data.mininum[i];
          const obj = {
            avatar: node.description.image ? `${getEnvConfig.STATIC_URL}/${node.operator_address}/image.png` : `${getEnvConfig.STATIC_URL}/default/image.png`,
            name: node.description.moniker,
            rate: `${await (walletChainReward(parseFloat(`${node.commission.commission_rates.rate}`)))}%`,
            pledgedVolume: formatNumberStr(walletAmountToToken(`${parseFloat(node.tokens)}`)),
            minVolume: formatNumberStr(walletAmountToToken(`${parseFloat(node.min_self_delegation)}`)),
            address: node.operator_address,
            type: 3,
          };
          switch(node.status) {
            case 'BOND_STATUS_UNSPECIFIED':
              obj.type = 0; break;
            case 'BOND_STATUS_UNBONDED':
              obj.type = 1; break;
            case 'BOND_STATUS_UNBONDING':
              obj.type = 2; break;
            case 'BOND_STATUS_BONDED':
              obj.type = 3; break;
          }
          resultArr.push(obj);
        }
        if (canDo) setNodes(resultArr);
      }
    });
    return () => {
      canDo = false;
    }
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
                { node.type === 0 && (<div className="pledge_node_mark pledge_node_error"><I18 text="nodeInvalid" /></div>) }
                { node.type === 1 && (<div className="pledge_node_mark pledge_node_warning"><I18 text="nodeOffLine" /></div>) }
                { node.type === 2 && (<div className="pledge_node_mark pledge_node_warning"><I18 text="nodeJailed" /></div>) }
                { node.type === 3 && (<div className="pledge_node_mark"><I18 text="nodeRunning" /></div>) }
                <div className="pledge_node_header">
                  <img className="node_avatar" alt={node.name} src={node.avatar} />
                  <p className="node_name" onClick={() => goToChange(node)}>{node.name}</p>
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
                    <dl className="pledge_node_dl">
                      <dt className="pledge_node_dt">{node.minVolume}</dt>
                      <dt className="pledge_node_dd"><I18 text="minPledgeVolume" />({ getEnvConfig.APP_TOKEN_NAME })</dt>
                    </dl>
                  </div>
                  <ComConButton className="pledge_node_button" onClick={() => goToChange(node)}><I18 text="select" /></ComConButton>
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

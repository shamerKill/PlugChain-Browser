import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import I18 from '../../../i18n/component';
import { useLanguageHook } from '../../../services/config.services';
import { formatClass, getOnlyId } from '../../../tools';
import ComConLogo, { TypeComponentsControlLogo } from '../control/logo';
// import alertTools from '../tools/alert';

const ComLayFooter: FC = () => {
  const [friendsLink, setFriendsLink] = useState<TypeComponentsControlLogo[]>([]);
  const [language, changeLanguage] = useLanguageHook();

  // const noOpenData = (e: MouseEvent<HTMLAnchorElement>) => {
  //   alertTools.create({ message: <I18 text="noOpen" />, type: 'warning' });
  //   e.preventDefault();
  //   return false;
  // };
  
  useEffect(() => {
    setFriendsLink([
      { link: 'http://www.plugchain.info/', src: require('../../../assets/logo/chain-full-light.png'), id: getOnlyId() },
      { link: 'http://www.onp.world/', src: require('../../../assets/logo/protocol-full-light.png'), id: getOnlyId() },
    ]);
  }, []);
  
  return (
    <footer className={formatClass(['layout-footer'])}>
      <div className={formatClass(['layout-footer-inner'])}>
        <div className={formatClass(['layout-footer-content'])}>
          {/* Site Info */}
          <div className={formatClass(['layout-footer-info'])}>
            <ComConLogo
              className={formatClass(['layout-footer-logo'])}
              link="/"
              src={require('../../../assets/logo/chain-full-light.png')} />
            <p className={formatClass(['layout-footer-language'])}>
              <button onClick={() => changeLanguage('en-US')} className={formatClass(['layout-footer-button'])}>
                <I18 text="enUS" />
              </button>
              <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
              <button onClick={() => changeLanguage('zh-CN')} className={formatClass(['layout-footer-button'])}>
                <I18 text="zhCN" />
              </button>
            </p>
            <p className={formatClass(['layout-footer-text'])}><I18 text="webSiteCopyInfo" /></p>
          </div>
          {/* More List */}
          <div className={formatClass(['layout-footer-lists'])}>
            <dl className={formatClass(['layout-footer-list'])}>
              <dt className={formatClass(['layout-footer-list-title'])}>
                <I18 text="footerList1Title" />
              </dt>
              <dd>
                <p className={formatClass(['layout-footer-list-item'])}>
                  <a href={`https://oraclenetworkprotocol.github.io/plugchain${language === 'zh-CN' ? '/zh' : ''}/endpoints/intro.html`}><I18 text="footerList1-1" /></a>
                </p>
                <p className={formatClass(['layout-footer-list-item'])}>
                  <a href="https://github.com/oracleNetworkProtocol/plugchain">Github</a>
                </p>
              </dd>
            </dl>
            <dl className={formatClass(['layout-footer-list'])}>
              <dt className={formatClass(['layout-footer-list-title'])}>
                <I18 text="footerList3Title" />
              </dt>
              <dd>
                <p className={formatClass(['layout-footer-list-item'])}>
                  <Link to="/nodes/node-apply"><I18 text="footerList3-1" /></Link>
                </p>
              </dd>
            </dl>
            {/* <dl className={formatClass(['layout-footer-list'])}>
              <dt className={formatClass(['layout-footer-list-title'])}>
                <I18 text="footerList2Title" />
              </dt>
              <dd>
                <p className={formatClass(['layout-footer-list-item'])}>
                  <Link to="/" onClick={noOpenData}><I18 text="footerList2-1" /></Link>
                </p>
                <p className={formatClass(['layout-footer-list-item'])}>
                  <a href="https://etherscan.io/"><I18 text="footerList2-2" /></a>
                </p>
                <p className={formatClass(['layout-footer-list-item'])}>
                  <Link to="/" onClick={noOpenData}><I18 text="footerList2-3" /></Link>
                </p>
                <p className={formatClass(['layout-footer-list-item'])}>
                  <Link to="/" onClick={noOpenData}><I18 text="footerListMore" /></Link>
                </p>
              </dd>
            </dl> */}
            <dl className={formatClass(['layout-footer-list'])}>
              <dt className={formatClass(['layout-footer-list-title'])}>
                <I18 text="footerList4Title" />
              </dt>
              <dd>
                <p className={formatClass(['layout-footer-list-item'])}>
                  <a download="cosmo_wallet.apk" href="https://cosmo-wallet.oss-accelerate.aliyuncs.com/app-release.apk"><I18 text="footerList4-1" /></a>
                </p>
              </dd>
            </dl>
          </div>
        </div>
        {/* Friends Link */}
        <dl className={formatClass(['layout-friends-dl'])}>
          <dt className={formatClass(['layout-friends-dt'])}><I18 text="footerFriendLinks" /> :</dt>
          <dd className={formatClass(['layout-friends-dd'])}>
            {
              friendsLink.map(item => (
                <ComConLogo
                  key={item.id}
                  className={formatClass(['layout-friends-img'])}
                  {...item} />
              ))
            }
          </dd>
        </dl>
      </div>
    </footer>
  );
};

export default ComLayFooter;

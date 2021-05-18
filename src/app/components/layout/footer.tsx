import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import I18 from '../../../i18n/component';
import { useLanguageHook } from '../../../services/config.services';
import { formatClass, getOnlyId } from '../../../tools';
import ComConLogo, { TypeComponentsControlLogo } from '../control/logo';

const links = [
  { link: '/', src: require('../../../assets/logo/protocol-full-light.png') },
  { link: '/', src: require('../../../assets/logo/protocol-full-light.png') },
  { link: '/', src: require('../../../assets/logo/protocol-full-light.png') },
  { link: '/', src: require('../../../assets/logo/protocol-full-light.png') },
  { link: '/', src: require('../../../assets/logo/protocol-full-light.png') },
  { link: '/', src: require('../../../assets/logo/protocol-full-light.png') },
  { link: '/', src: require('../../../assets/logo/protocol-full-light.png') },
];

const ComLayFooter: FC = () => {
  const [friendsLink, setFriendsLink] = useState<TypeComponentsControlLogo[]>([]);
  const [, changeLanguage] = useLanguageHook();
  
  useEffect(() => {
    setFriendsLink(links);
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
                  <Link to="/"><I18 text="footerList1-1" /></Link>
                </p>
              </dd>
            </dl>
            <dl className={formatClass(['layout-footer-list'])}>
              <dt className={formatClass(['layout-footer-list-title'])}>
                <I18 text="footerList2Title" />
              </dt>
              <dd>
                <p className={formatClass(['layout-footer-list-item'])}>
                  <Link to="/"><I18 text="footerList2-1" /></Link>
                </p>
                <p className={formatClass(['layout-footer-list-item'])}>
                  <Link to="/"><I18 text="footerList2-2" /></Link>
                </p>
                <p className={formatClass(['layout-footer-list-item'])}>
                  <Link to="/"><I18 text="footerList2-3" /></Link>
                </p>
                <p className={formatClass(['layout-footer-list-item'])}>
                  <Link to="/"><I18 text="footerListMore" /></Link>
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
                  key={getOnlyId()}
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

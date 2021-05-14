import { FC, useEffect, useState } from 'react';
import I18 from '../../../i18n/component';
import { useLanguageHook } from '../../../services/config.services';
import { formatClass } from '../../../tools';
import ComConLogo from '../control/logo';
import ComConButton from '../control/button';
import ComConSelector from '../control/selector';
import { BehaviorSubject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

const ComLayHeader: FC = () => {
  const [language, setLanguage] = useLanguageHook();
  const [menuObserver] = useState(new BehaviorSubject<boolean>(true));
  const [menuShow, setMenuShow] = useState(true);

  const changeLanguage = (type: number) => {
    const languageType = ['en-US', 'zh-CN'][type] as typeof language;
    setLanguage(languageType);
  };

  const changeMenuShow = () => {
    menuObserver.next(!menuShow);
  }

  useEffect(() => {
    menuObserver.pipe(throttleTime(1000)).subscribe(setMenuShow);
  }, [setMenuShow, menuObserver]);

  return (
    <header className={formatClass(['layout-header'])}>
      <div className={formatClass(['layout-header-inner'])}>
        <ComConLogo
          className={formatClass(['layout-header-logo'])}
          link="/"
          src={require('../../../assets/logo/chain-full-dark.png')} />
        <div className={formatClass(['layout-header-menu', 'layout-header-pc'])}>
          <ul className={formatClass(['layout-header-menu-ul'])}>
            <li className={formatClass(['layout-header-menu-list'])}><a href="/"><I18 text="home" /></a></li>
            <li className={formatClass(['layout-header-menu-list'])}><a href="/"><I18 text="blockChain" /></a></li>
            <li className={formatClass(['layout-header-menu-list'])}><a href="/"><I18 text="wallet" /></a></li>
          </ul>
          <ComConButton>
            <I18 text="signIn" />&nbsp;/&nbsp;<I18 text="create" />
          </ComConButton>
          <ComConSelector
            className="layout-header-menu-language"
            select={{'en-US': 0, 'zh-CN': 1}[language]}
            options={[
              <I18 text="enUS" />,
              <I18 text="zhCN" />
            ]}
            onSelfSelect={changeLanguage} />
        </div>
        <div className={formatClass(['layout-header-menu', 'layout-header-phone'])}>
          <ComConButton className={formatClass(['layout-header-phone-create'])}>
            <I18 text="create" />
          </ComConButton>
          <button
            onClick={changeMenuShow}
            className={formatClass(['layout-header-phone-change'])}>
            {
              menuShow ? (
                <svg className={formatClass(['icon', 'layout-header-phone-icon', 'layout-header-phone-menu'])} aria-hidden="true">
                  <use xlinkHref="#icon-ego-menu"></use>
                </svg>
              ) : (
                <svg className={formatClass(['icon', 'layout-header-phone-icon', 'layout-header-phone-close'])} aria-hidden="true">
                  <use xlinkHref="#icon-close"></use>
                </svg>
              )
            }
          </button>
          <div className={formatClass(['layout-header-phone-fix', !menuShow && 'layout-header-phone-fix-show'])}>
            <div className={formatClass(['layout-header-phone-accounts'])}>
              <ComConButton className={formatClass(['layout-header-phone-create'])}>
                <I18 text="createAccount" />
              </ComConButton>
              <ComConButton className={formatClass(['layout-header-phone-sign'])}>
                <I18 text="signIn" />
              </ComConButton>
            </div>
            <ul className={formatClass(['layout-header-menu-ul'])}>
              <li className={formatClass(['layout-header-menu-list'])}><a href="/"><I18 text="home" /></a></li>
              <li className={formatClass(['layout-header-menu-list'])}><a href="/"><I18 text="blockChain" /></a></li>
              <li className={formatClass(['layout-header-menu-list'])}><a href="/"><I18 text="wallet" /></a></li>
              <li className={formatClass(['layout-header-menu-list'])}>
                <div className={formatClass(['layout-header-phone-language'])}>
                  <p className={formatClass(['layout-header-phone-language-title'])}>
                    <I18 text="language" />
                    </p>
                  <button className={formatClass(['layout-header-phone-options', language === 'en-US' && 'layout-header-phone-selected'])} onClick={() => changeLanguage(0)}>
                    <I18 text="enUS" />
                  </button>
                  <button className={formatClass(['layout-header-phone-options', language === 'zh-CN' && 'layout-header-phone-selected'])} onClick={() => changeLanguage(1)}>
                    <I18 text="zhCN" />
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ComLayHeader;

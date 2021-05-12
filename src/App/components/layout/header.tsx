import { FC } from 'react';
import I18 from '../../../i18n/component';
import { useLanguageHook } from '../../../services/config.services';
import { formatClass } from '../../../tools';
import ComConLogo from '../control/logo';
import ComConButton from '../control/button';
import ComConSelector from '../control/selector';

const ComLayHeader: FC = () => {
  const [language, setLanguage] = useLanguageHook();

  const changeLanguage = (languageType: typeof language) => {
    setLanguage(languageType);
  };

  return (
    <header className={formatClass(['layout-header'])}>
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
          <I18 text="signIn" />/<I18 text="create" />
        </ComConButton>
        <ComConSelector
          className="layout-header-menu-language"
          select={0}
          options={[
            <I18 text="enUS" />,
            <I18 text="zhCN" />
          ]}
          onChange={() => changeLanguage('en-US')} />
      </div>
      {/* <div className={formatClass(['layout-header-menu', 'layout-header-phone'])}>
      </div> */}
    </header>
  );
};

export default ComLayHeader;

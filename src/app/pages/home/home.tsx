import { FC, useCallback, useState } from 'react';
import ComponentsLayoutBase from '../../components/layout/base';
import I18 from '../../../i18n/component';
import useI18 from '../../../i18n/hooks';
import { HomeChainInfo, HomeNewsInfo } from './home-views';

import './home.scss';


const PageHome: FC = () => {
  const searchPlaceholder = useI18('searchPlaceholder');
  const [searchValue, setSearchValue] = useState('');

  const searchCallback = useCallback(() => {
    if (searchValue === '') return alert('null');
  }, [searchValue]);
  
  return (
    <ComponentsLayoutBase className="home_page">
      {/* search */}
      <div className="home_header">
        <h1 className="header_title">
          <I18 text="ONPBlockChainBrowser" />
        </h1>
        <div className="header_search">
          <input
            className="header_search_input"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={event => setSearchValue(event.target.value)} />
          <button className="header_search_btn" onClick={searchCallback}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-search"></use>
            </svg>
          </button>
        </div>
      </div>
      {/* chainInfo */}
      <HomeChainInfo />
      {/* newInfo */}
      <HomeNewsInfo />
    </ComponentsLayoutBase>
  );
};

export default PageHome;

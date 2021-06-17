import { FC } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';

import './node-apply.scss';
import ComConSvg from '../../../components/control/icon';
import ComConButton from '../../../components/control/button';

const PageNodeApply: FC = () => {
  return (
    <ComponentsLayoutBase className="node_apply_page">
      <h2 className="apply_title"><I18 text="footerList3-1" /></h2>
      <h4 className="apply_title_desc"><I18 text="apply-title1" /></h4>
      <div className="apply_content">
        <div className="apply_upload">
          <div className="apply_upload_inner">
            <ComConSvg className="apply_upload_icon" xlinkHref="#icon-upload" />
            <p className="apply_upload_info"><I18 text="apply-upload-text" /></p>
          </div>
          <p className="apply_upload_desc"><I18 text="apply-upload-desc" /></p>
        </div>
        <div className="apply_content_form_important">
          <div className="apply_form_label">
            <p className="apply_form_label_title">
              <span className="apply_form_label_important">*</span>
              <I18 text="apply-node-name" />
            </p>
            <input
              className="apply_form_input"
              type="text" />
          </div>
          <div className="apply_form_label">
            <p className="apply_form_label_title">
              <span className="apply_form_label_important">*</span>
              <I18 text="apply-node-ID" />
            </p>
            <input
              className="apply_form_input"
              type="text" />
          </div>
          <div className="apply_form_label">
            <p className="apply_form_label_title">
              <I18 text="apply-node-website" />
            </p>
            <input
              className="apply_form_input"
              type="text" />
          </div>
          <div className="apply_form_label">
            <p className="apply_form_label_title">
              <span className="apply_form_label_important">*</span>
              <I18 text="apply-node-email" />
            </p>
            <input
              className="apply_form_input"
              type="text" />
          </div>
          <p className="apply_form_label_tip"><I18 text="apply-node-email-tip" /></p>
        </div>
      </div>
      <h4 className="apply_title_more"><I18 text="apply-node-media" /></h4>
      <div className="apply_content_media">

      </div>
      <h4 className="apply_title_desc"><I18 text="apply-title2" /></h4>
      <div className="apply_content_form">
        <h5 className="apply_form_title">
          <span className="apply_form_label_important">*</span><I18 text="apply-node-desc" />
        </h5>
        <textarea
          className="apply_form_area">
        </textarea>
        <h5 className="apply_form_title">
          <span className="apply_form_label_important">*</span><I18 text="apply-node-serve" />
          <a className="apply_form_label_link a_link" href="https://github.com/oracleNetworkProtocol/plugchain/tree/main/docs/tutorial">
            <I18 text="apply-node-serve-link" />
          </a>
        </h5>
        <textarea
          className="apply_form_area">
        </textarea>
        <h5 className="apply_form_title">
          <I18 text="apply-node-reward" />
        </h5>
        <p className="apply_form_tip"><I18 text="apply-node-reward-info" /></p>
        <textarea
          className="apply_form_area">
        </textarea>
        <ComConButton className="apply_form_submit">
          <I18 text="apply-node-submit" />
        </ComConButton>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageNodeApply;

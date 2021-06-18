import React, { FC, useCallback, useState } from 'react';
import ComponentsLayoutBase from '../../../components/layout/base';
import I18 from '../../../../i18n/component';
import useI18 from '../../../../i18n/hooks';
import ComConSvg from '../../../components/control/icon';
import ComConButton from '../../../components/control/button';

import './node-apply.scss';
import alertTools from '../../../components/tools/alert';
import { fetchData, useSafeLink, verifyEmail } from '../../../../tools';

const PageNodeApply: FC = () => {
  const goLink = useSafeLink();

  const telegramId = useI18('apply-node-telegram');
  const twitterId = useI18('apply-node-twitter');
  const weChatId = useI18('apply-node-weChat');

  const [ nodeAvatar, setNodeAvatar ] = useState('');
  const [ nodeName, setNodeName ] = useState('');
  const [ nodeID, setNodeID ] = useState('');
  const [ nodeWebsite, setNodeWebsite ] = useState('');
  const [ nodeEmail, setNodeEmail ] = useState('');
  const [ nodeTelegram, setNodeTelegram ] = useState('');
  const [ nodeTwitter, setNodeTwitter ] = useState('');
  const [ nodeWeChat, setNodeWeChat ] = useState('');
  const [ nodeDescribe, setNodeDescribe ] = useState('');
  const [ nodeServeInfo, setNodeServeInfo ] = useState('');
  const [ nodeReward, setNodeReward ] = useState('');
  
  const [ loading, setLoading ] = useState(false);

  const verifyInfo = () => {
    if (nodeName === '') return alertTools.create({ message: <I18 text="apply-error-name" />, type: 'warning'});
    if (nodeID === '') return alertTools.create({ message: <I18 text="apply-error-ID" />, type: 'warning'});
    if (!verifyEmail(nodeEmail)) return alertTools.create({ message: <I18 text="apply-error-email" />, type: 'warning'});
    if (nodeDescribe === '') return alertTools.create({ message: <I18 text="apply-error-describe" />, type: 'warning'});
    if (nodeServeInfo === '') return alertTools.create({ message: <I18 text="apply-error-serve" />, type: 'warning'});
    submitInfo();
  };

  const submitInfo = useCallback(() => {
    setLoading(true);
    const submit = fetchData('POST', 'apply_validator', {
        name: nodeName, node_id: nodeID, web_url: nodeWebsite, email: nodeEmail,
        telegram: nodeTelegram, twitter: nodeTwitter, wechat: nodeWeChat, des: nodeDescribe,
        server_info: nodeServeInfo, profit_plan: nodeReward, nodeAvatar: nodeAvatar,
      }).subscribe(({ loading, error, success, message }) => {
        if (!loading) {
          setLoading(false);
          if (success) {
            alertTools.create({ message: <I18 text="exeSuccess" />, type: 'success' });
            goLink('/');
          }
          if (error) {
            if (message) alertTools.create({ message, type: 'error' });
            else alertTools.create({ message: <I18 text="exeError" />, type: 'error' });
          }
        }
      });
    return () => submit.unsubscribe();
  }, [
    nodeName, nodeID, nodeWebsite, nodeTelegram, nodeTwitter, nodeWeChat, nodeDescribe,nodeServeInfo, nodeReward, nodeEmail, goLink, nodeAvatar,
  ]);

  const upload: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files?.length === 1) {
      const img = event.target.files[0];
      if (img.size > 2 * 1024 * 1024) return alertTools.create({ message: <I18 text="apply-error-avatar" />, type: 'error' });
      const reader = new FileReader();
      reader.onload = (aImg) => {
        if (aImg.target?.result && typeof aImg.target?.result === 'string') {
          const imgDom = document.createElement('img');
          imgDom.src = aImg.target.result;
          imgDom.onload = () => {
            if (imgDom.naturalWidth !== 400 || imgDom.naturalHeight !== 400) alertTools.create({ message: <I18 text="apply-error-avatar" />, type: 'error' });
            else setNodeAvatar(imgDom.src);
          };
        }
      };
      reader.readAsDataURL(img);
    }
  }

  return (
    <ComponentsLayoutBase className="node_apply_page">
      <h2 className="apply_title"><I18 text="footerList3-1" /></h2>
      <h4 className="apply_title_desc"><I18 text="apply-title1" /></h4>
      <div className="apply_content">
        <div className="apply_upload">
          <label className="apply_upload_inner" htmlFor="applyUploadAvatar">
            {
              nodeAvatar && <img className="apply_upload_avatar" src={nodeAvatar} alt="nodeAvatar" />
            }
            <ComConSvg className="apply_upload_icon" xlinkHref="#icon-upload" />
            <p className="apply_upload_info"><I18 text="apply-upload-text" /></p>
            <input
              id="applyUploadAvatar"
              type="file"
              accept=".png,.jpg,jpeg"
              className="apply_upload_input"
              disabled={loading}
              onChange={upload} />
          </label>
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
              type="text"
              disabled={loading}
              value={nodeName}
              onChange={e => setNodeName(e.target.value)} />
          </div>
          <div className="apply_form_label">
            <p className="apply_form_label_title">
              <span className="apply_form_label_important">*</span>
              <I18 text="apply-node-ID" />
            </p>
            <input
              className="apply_form_input"
              type="text"
              disabled={loading}
              value={nodeID}
              onChange={e => setNodeID(e.target.value)} />
          </div>
          <div className="apply_form_label">
            <p className="apply_form_label_title">
              <I18 text="apply-node-website" />
            </p>
            <input
              className="apply_form_input"
              type="text"
              disabled={loading}
              value={nodeWebsite}
              onChange={e => setNodeWebsite(e.target.value)} />
          </div>
          <div className="apply_form_label">
            <p className="apply_form_label_title">
              <span className="apply_form_label_important">*</span>
              <I18 text="apply-node-email" />
            </p>
            <input
              className="apply_form_input"
              type="text"
              disabled={loading}
              value={nodeEmail}
              onChange={e => setNodeEmail(e.target.value)} />
          </div>
          <p className="apply_form_label_tip"><I18 text="apply-node-email-tip" /></p>
        </div>
      </div>
      <h4 className="apply_title_more"><I18 text="apply-node-media" /></h4>
      <div className="apply_content_media">
        <div className="apply_media_item">
          <img src={require('../../../../assets/images/telegram.png')} alt="telegram" className="apply_media_img" />
          <div className="apply_media_label">
            <p className="apply_media_pre">@</p>
            <input
              className="apply_media_input"
              type="text"
              disabled={loading}
              placeholder={telegramId}
              value={nodeTelegram}
              onChange={e => setNodeTelegram(e.target.value)} />
          </div>
        </div>
        <div className="apply_media_item">
          <img src={require('../../../../assets/images/twitter.png')} alt="telegram" className="apply_media_img" />
          <div className="apply_media_label">
            <p className="apply_media_pre">@</p>
            <input
              className="apply_media_input"
              type="text"
              disabled={loading}
              placeholder={twitterId}
              value={nodeTwitter}
              onChange={e => setNodeTwitter(e.target.value)} />
          </div>
        </div>
        <div className="apply_media_item">
          <img src={require('../../../../assets/images/weChat.png')} alt="telegram" className="apply_media_img" />
          <div className="apply_media_label">
            <input
              className="apply_media_input"
              type="text"
              disabled={loading}
              placeholder={weChatId}
              value={nodeWeChat}
              onChange={e => setNodeWeChat(e.target.value)} />
          </div>
        </div>
      </div>
      <h4 className="apply_title_desc"><I18 text="apply-title2" /></h4>
      <div className="apply_content_form">
        <h5 className="apply_form_title">
          <span className="apply_form_label_important">*</span><I18 text="apply-node-desc" />
        </h5>
        <textarea
          className="apply_form_area"
          disabled={loading}
          value={nodeDescribe}
          onChange={e => setNodeDescribe(e.target.value)}>
        </textarea>
        <h5 className="apply_form_title">
          <span className="apply_form_label_important">*</span><I18 text="apply-node-serve" />
          <a className="apply_form_label_link a_link" href="https://github.com/oracleNetworkProtocol/plugchain/tree/main/docs/tutorial">
            <I18 text="apply-node-serve-link" />
          </a>
        </h5>
        <textarea
          className="apply_form_area"
          disabled={loading}
          value={nodeServeInfo}
          onChange={e => setNodeServeInfo(e.target.value)}>
        </textarea>
        <h5 className="apply_form_title">
          <I18 text="apply-node-reward" />
        </h5>
        <p className="apply_form_tip"><I18 text="apply-node-reward-info" /></p>
        <textarea
          className="apply_form_area"
          disabled={loading}
          value={nodeReward}
          onChange={e => setNodeReward(e.target.value)}>
        </textarea>
        <ComConButton
          className="apply_form_submit"
          loading={loading}
          disabled={loading}
          onClick={() => verifyInfo()}>
          <I18 text="apply-node-submit" />
        </ComConButton>
      </div>
    </ComponentsLayoutBase>
  );
};

export default PageNodeApply;

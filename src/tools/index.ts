import { formatClass } from './className';
import { useAjaxGet, useAjaxPost } from './ajax';
import { copyObject } from './copy';
import reportWebVitals from './reportWebVitals';
import getEnvConfig from './env-config';
import { getOnlyId, delOnlyId, verifyOnlyId } from './only-id';
import { randomString } from './random-str';
import { useSafeLink } from './route.hook';
import { formatSearch } from './url';


export {
  reportWebVitals,
  getOnlyId,
  delOnlyId,
  randomString,
  copyObject,
  verifyOnlyId,
  useAjaxGet,
  useAjaxPost,
  formatClass,
  getEnvConfig,
  useSafeLink,
  formatSearch,
};
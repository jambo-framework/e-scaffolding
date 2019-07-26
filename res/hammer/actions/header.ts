import axios, { AxiosResponse } from 'axios';
import { LicensePlateKey } from '../hammer.constants';
import { HAMMER } from '../../../services';

export const fetchSearchLikeData = (type, payload) => {
  const INFO_MAP = {
    [LicensePlateKey]: {
      url: HAMMER.LIKE_LICENSE_PLATE,
    },
  };
  let info = INFO_MAP[type];
  return new Promise(resolve => {
    if (!info) {
      resolve([]);
    } else {
      axios.post(info.url, payload).then((res: AxiosResponse<FMS.BFFResponse>) => {
        const { errCode, data } = res.data;
        if (typeof errCode === 'undefined') {
          resolve(data);
        }
      });
    }
  });
};

const processOrgList = (rawData: any, proData: any): void => {
  let info = {
    id: rawData.id,
    name: rawData.name,
    desc: rawData.name,
    key: rawData.id,
    enable: rawData.enable,
  };
  Object.assign(proData, info);
  if (rawData.children) {
    Object.assign(proData, { children: [] });
    rawData.children.forEach(rawChild => {
      let child = {};
      processOrgList(rawChild, child);
      proData.children.push(child);
    });
  }
};

export const fetchOrgList = () => {
  return new Promise(resolve => {
    axios.get(HAMMER.ORG_LIST).then((res: AxiosResponse<FMS.BFFResponse>) => {
      const { errCode, data } = res.data;
      if (errCode === 'ok') {
        let proData = {};
        resolve([data]);
      }
    });
  });
};

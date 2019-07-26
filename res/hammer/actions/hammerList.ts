import {
  HAMMER_SUMMARY,
  HAMMER_LIST,
  PAGINATION,
  HammerListDataKey,
  HammerListShowCount,
} from '../hammer.constants';
import { storage } from '../../../services';

export interface HammerSummaryData {
  totalHammer: number;
  pairHammer: number;
  unPairHammer: number;
}

export interface PaginationData {
  totalResult: number;
  itemsPerPage: number;
  pageIndex: number;
}

export default function getHammerList(props, pageIndex, onFailed) {
  return (dispatch: Function) => {
    refreshDriverList(dispatch, [], true);
    const { data = [], totalPairs = 0, totalUnpairs = 0, totalResult = 0 } = {
      data:    [
        {
          id: 'IHUO111222RCC0001',
          description: null,
          externalId: null,
          iccId: null,
          imsi: null,
          ivdId: 'IHUO111222RCC0001',
          lastConnectionTime: null,
          manufacturer: null,
          msisdn: null,
          password: '123456',
          serialNumber: null,
          status: 'enable',
          systemVersion: null,
          version: null,
          vin: null,
          ivdType: null,
          licenced: null,
          enterpriseId: null,
          vrn: null,
          enterpriseName: null,
          lastHeartbeat: null,
          searchIndex: '[1562822436263,hammer_entity#IHUO111222RCC0001]',
          lastModified: '2019-07-11T05:20:36.263Z',
        meta: null
  },
    {
      id: 'TEMO111222RCC0001',
          description: null,
        externalId: null,
        iccId: 'ICCID1112220000009',
        imsi: '46001112220000009',
        ivdId: 'TEMO111222RCC0001',
        lastConnectionTime: null,
        manufacturer: null,
        msisdn: '8611122200009',
        password: '123456',
        serialNumber: null,
        status: 'enable',
        systemVersion: null,
        version: null,
        vin: null,
        ivdType: null,
        licenced: null,
        enterpriseId: null,
        vrn: null,
        enterpriseName: null,
        lastHeartbeat: null,
        searchIndex: '[1562822436263,hammer_entity#TEMO111222RCC0001]',
      lastModified: '2019-07-11T05:20:36.263Z',
        meta: null
    },
    {
      id: '64e3d249-748a-447d-9a4d-7af7fd12d216',
        description: null,
        externalId: null,
        iccId: null,
        imsi: null,
        ivdId: '64e3d249-748a-447d-9a4d-7af7fd12d216',
        lastConnectionTime: null,
        manufacturer: null,
        msisdn: null,
        password: null,
        serialNumber: null,
        status: null,
        systemVersion: null,
        version: null,
        vin: 'AABBZZ00VSA391104',
        ivdType: null,
        licenced: null,
        enterpriseId: '153190339607957243',
        vrn: 'VSA 104',
        enterpriseName: 'integration',
        lastHeartbeat: null,
        searchIndex: '[1562659081944,hammer_entity#64e3d249-748a-447d-9a4d-7af7fd12d216]',
      lastModified: '2019-07-09T07:58:01.944Z',
        meta: null
    },
    {
      id: 'IHUDECO0123456789001',
          description: null,
        externalId: null,
        iccId: null,
        imsi: null,
        ivdId: 'IHUDECO0123456789001',
        lastConnectionTime: null,
        manufacturer: null,
        msisdn: null,
        password: '123456',
        serialNumber: null,
        status: 'enable',
        systemVersion: null,
        version: null,
        vin: 'DECO0123456789001',
        ivdType: null,
        licenced: null,
        enterpriseId: null,
        vrn: null,
        enterpriseName: null,
        lastHeartbeat: null,
        searchIndex: '[1562656260473,hammer_entity#IHUDECO0123456789001]',
      lastModified: '2019-07-09T07:11:00.473Z',
        meta: null
    },
    {
      id: 'TEMDECO0123456789001',
          description: null,
        externalId: null,
        iccId: 'iccid2656260',
        imsi: '46001112220000009',
        ivdId: 'TEMDECO0123456789001',
        lastConnectionTime: null,
        manufacturer: null,
        msisdn: '8614762656260',
        password: '123456',
        serialNumber: null,
        status: 'enable',
        systemVersion: null,
        version: null,
        vin: 'DECO0123456789001',
        ivdType: null,
        licenced: null,
        enterpriseId: null,
        vrn: null,
        enterpriseName: null,
        lastHeartbeat: null,
        searchIndex: '[1562656260473,hammer_entity#TEMDECO0123456789001]',
      lastModified: '2019-07-09T07:11:00.473Z',
        meta: null
    }
  ],
    totalResult: 96,
        totalPairs: 0,
        totalUnpairs: 96
  };
    const summary = {
      totalHammer: totalResult,
      pairHammer: totalPairs,
      unPairHammer: totalUnpairs,
    };
    const pagination = {
      totalResult: totalResult,
      itemsPerPage: HammerListShowCount,
      pageIndex: pageIndex,
    };
    refreshDriverList(dispatch, data, false, pagination, summary);
  };
}

export function paginationSwitch(props, pageIndex, onFailed) {
  return dispatch => {
    const hammerData = JSON.parse(storage.getItem(HammerListDataKey) || '{}');
    const pageSize = hammerData.pagination.itemsPerPage;
    const length = hammerData.list.length;
    const shortCount = (pageIndex - 1) * pageSize - length;
    if (pageIndex * pageSize > length && length < hammerData.pagination.totalResult) {
      // 假如缓存里面没有需要翻页的数据
      let exSearchIndex =
        length > 0 && hammerData.list[length - 1].searchIndex
          ? hammerData.list[length - 1].searchIndex
          : '';
      let payload = Object.assign({ searchAfter: exSearchIndex }, props);
      payload.count = shortCount >= payload.count ? payload.count + shortCount : payload.count;
      dispatch(getHammerList(payload, pageIndex, onFailed));
    } else {
      const data = hammerData.list.splice((pageIndex - 1) * pageSize, pageSize);
      dispatch(doneGetList(data, false));
    }
  };
}

const refreshDriverList = (
  dispatch: Function,
  list: Array<object>,
  isLoading: boolean,
  pagination: PaginationData = { totalResult: 0, itemsPerPage: HammerListShowCount, pageIndex: 1 },
  summary: HammerSummaryData = { totalHammer: 0, pairHammer: 0, unPairHammer: 0 },
): void => {
  let totalList = [];
  if (!isLoading) {
    const hammerData = JSON.parse(storage.getItem(HammerListDataKey) || '{}');
    const storageList = hammerData.list || [];
    totalList = pagination.pageIndex === 1 ? list : storageList.concat(list);
    storage.setItem(HammerListDataKey, {
      list: totalList,
      pagination,
      summary,
    });
  }
  dispatch(
    doneGetList(
      isLoading
        ? []
        : totalList.splice(
            (pagination.pageIndex - 1) * pagination.itemsPerPage,
            pagination.itemsPerPage,
          ),
      isLoading,
    ),
  );
  dispatch(donePagination(pagination));
  dispatch(doneGetSummary(summary));
};

const doneGetList = (data: Array<object>, isLoading: boolean): FMS.Action => {
  return {
    type: HAMMER_LIST,
    payload: {
      isLoading: isLoading,
      data: data,
    },
  };
};

const doneGetSummary = (data: HammerSummaryData): FMS.Action => {
  return {
    type: HAMMER_SUMMARY,
    payload: data,
  };
};

const donePagination = (data: PaginationData): FMS.Action => {
  return {
    type: PAGINATION,
    payload: data,
  };
};

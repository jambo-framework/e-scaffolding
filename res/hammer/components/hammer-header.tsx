import * as React from 'react';
import * as PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { LayoutHeader } from '../../../components/biz/layout';
import { fetchSearchLikeData } from '../actions';
import { getEnums } from '../../../utils/enums/index';
import { ATTRIBUTES_CODE } from '../../configurable-attributes/configurable-attributes.constants';
import {
  HammerIMEIKey,
  LicensePlateKey,
  VinKey,
  VendorKey,
  StatusKey,
  OrgKey,
  // vendorDataSource as vendorData,
  statusDataSource as statusData,
} from '../hammer.constants';
import messages from '../message';

interface SearchProps {
  text: string;
  value: string;
}

interface HammerHeaderProps {
  className?: string;
  reloadHammer: Function;
  defaultOptions?: object;
  configurableAttributesData?: any;
}

interface HammerHeaderState {
  likeHammerIMEI: string;
  likeLicensePlate: string;
  likeVin: string;
  vendor: Array<string>;
  status: Array<string>;
  opEnIds: Array<string>;
  vrnsDataSource: Array<SearchProps>;
  vendorDataSource: Array<{ text: string; value: string }>;
  statusDataSource: Array<{ text: string; value: string }>;
}

const initialState = {
  likeHammerIMEI: '',
  likeLicensePlate: '',
  likeVin: '',
  vendor: [],
  status: [],
  opEnIds: [],
  vrnsDataSource: [],
  vendorDataSource: [],
  statusDataSource: [...statusData],
};

class HammerHeader extends React.Component<HammerHeaderProps, HammerHeaderState> {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
    };
  }

  componentWillMount() {
    const { defaultOptions } = this.props;
    let params: any = {};
    let fields = [
      { name: 'likeHammerIMEI', key: [HammerIMEIKey] },
      { name: 'likeLicensePlate', key: [LicensePlateKey] },
      { name: 'likeVin', key: [VinKey] },
      { name: 'vendor', key: [VendorKey] },
      { name: 'status', key: [StatusKey] },
      { name: 'opEnIds', key: [OrgKey] },
    ];
    fields.forEach((field: any) => {
      if (defaultOptions.hasOwnProperty(field.key)) {
        params[field.name] = defaultOptions[field.key];
      }
    });
    if (params.likeHammerIMEI) {
      params.likeHammerIMEI = params.likeHammerIMEI[0];
    }
    if (params.likeLicensePlate) {
      params.likeLicensePlate = params.likeLicensePlate[0];
    }
    this.setState({ ...params });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.configurableAttributesData.length > 0) {
      const vendorDataSource = getEnums(nextProps.configurableAttributesData, ATTRIBUTES_CODE[2]);
      vendorDataSource && vendorDataSource.forEach((item) => {
        item.text = item.name;
        item.value = item.id && item.id.code;
      });
      this.setState({
        vendorDataSource
      });
    }
  }

  render(): JSX.Element {
    const { formatMessage } = this.context.intl;

    return (
      <LayoutHeader
        title={formatMessage(messages.headerTitle)}
        searchDataSource={this.getSearchData()}
        onSearchInputChange={this.handInputChange}
        onSearch={this.handleSearch}
        filterDataSource={this.getFilterData()}
        onSelectChange={this.handleSelectChange}
        onClearAll={this.handleClear}
        searchNote={formatMessage(messages.searchNote)}
      />
    );
  }

  private getSearchData = () => {
    let { likeHammerIMEI, likeLicensePlate, likeVin, vrnsDataSource } = this.state;

    return [
      {
        key: HammerIMEIKey,
        dataSource: [],
        hintText: <FormattedMessage {...messages.searchIMEI} />,
        searchText: likeHammerIMEI,
      },
      {
        key: LicensePlateKey,
        dataSource: vrnsDataSource,
        hintText: <FormattedMessage {...messages.searchLicensePlate} />,
        searchText: likeLicensePlate,
      },
      // 暂时不放出来
      // {
      //   key: VinKey,
      //   dataSource: [],
      //   hintText: <FormattedMessage {...messages.searchVin} />,
      //   searchText: likeVin,
      // },
    ];
  };

  private getFilterData = () => {
    let {
      vendor,
      status,
      opEnIds,
      vendorDataSource,
      statusDataSource,
    } = this.state;
    return [
      {
        key: VendorKey,
        hintText: this.context.intl.formatMessage(messages.fliterVendor),
        menuItems: vendorDataSource,
        value: vendor,
        dataTest: VendorKey,
      },
      {
        key: StatusKey,
        hintText: this.context.intl.formatMessage(messages.filterStatus),
        menuItems: statusDataSource,
        value: status,
        dataTest: StatusKey,
      },
      {
        key: OrgKey,
        hintText: this.context.intl.formatMessage(messages.filterOrganization),
        type: 'organization',
        value: opEnIds,
        dataTest: OrgKey,
      },
    ];
  };

  private handInputChange = (key, value): void => {
    const process = (k, data) => {
      let state = {};
      Object.assign(state, { [`${k}DataSource`]: data });
      this.setState(state);
    };
    if (value.length > 2) {
      let payload;
      switch (key) {
        case LicensePlateKey:
          payload = {
            vehicles: {
              vrns: { type: 'WILDCARD', values: [value] },
            },
          };
          break;
        default:
          payload = value;
          break;
      }
      fetchSearchLikeData(key, payload).then((data: Array<SearchProps>) => {
        switch (key) {
          case LicensePlateKey:
            process(
              key,
              data.map(v => {
                return { text: v, value: v };
              }),
            );
            break;
          default:
            process(key, data);
            break;
        }
      });
    } else {
      process(key, []);
    }
  };

  private handleSearch = (values): void => {
    let {
      [HammerIMEIKey]: likeHammerIMEI = '',
      [LicensePlateKey]: likeLicensePlate = '',
      // [VinKey]: likeVin = '',
    } = values;
    this.setState(
      {
        likeHammerIMEI,
        likeLicensePlate,
        // likeVin,
      },
      this.emit,
    );
  };

  private handleSelectChange = (key, filterValues): void => {
    let {
      [HammerIMEIKey]: likeHammerIMEI,
      [LicensePlateKey]: likeLicensePlate,
      [VinKey]: likeVin,
      [VendorKey]: vendor,
      [StatusKey]: status,
      [OrgKey]: opEnIds = [],
    } = filterValues;
    this.setState(
      {
        likeHammerIMEI,
        likeLicensePlate,
        likeVin,
        vendor,
        status,
        opEnIds,
      },
      this.emit,
    );
  };

  private handleClear = () => {
    this.setState(
      {
        likeHammerIMEI: '',
        likeLicensePlate: '',
        likeVin: '',
        vendor: [],
        status: [],
        opEnIds: [],
        vrnsDataSource: [],
      },
      this.emit,
    );
  };

  private emit = (): void => {
    let params: {
      [HammerIMEIKey]?: Array<any>;
      [LicensePlateKey]?: Array<any>;
      [VinKey]?: Array<any>;
      [VendorKey]?: Array<any>;
      [StatusKey]?: Array<any>;
      [OrgKey]?: string;
    } = {};
    let fields = [
      { name: 'likeHammerIMEI', key: [HammerIMEIKey] },
      { name: 'likeLicensePlate', key: [LicensePlateKey] },
      { name: 'likeVin', key: [VinKey] },
      { name: 'vendor', key: [VendorKey] },
      { name: 'status', key: [StatusKey] },
      { name: 'opEnIds', key: [OrgKey] },
    ];
    fields.forEach((field: any) => {
      if (this.state.hasOwnProperty(field.name)) {
        params[field.key] = this.state[field.name];
      }
    });
    params[HammerIMEIKey] = [params[HammerIMEIKey]];
    params[LicensePlateKey] = [params[LicensePlateKey]];
    // params[VinKey] = [params[VinKey]];
    // params[[OrgKey]] = params[[OrgKey]].join(',');
    for (let key in params) {
      if (
        !params[key] ||
        params[key].length === 0 ||
        (params[key].length === 1 && !params[key][0])
      ) {
        delete params[key];
      }
    }
    this.props.reloadHammer(params);
  };
}

(HammerHeader as React.ComponentType<HammerHeaderProps>).contextTypes = {
  intl: PropTypes.object,
};

export default HammerHeader;

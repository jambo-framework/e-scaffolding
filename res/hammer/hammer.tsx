import * as React from 'react';
import * as PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { PATHS } from '../../common';
import { storage } from '../../services';
import { message } from 'eds-react/lib/components/message';
import messages from './message';
import {
  prefixCls,
  HammerListGetCount,
  HammerListDataKey,
  HammerSearchOptions,
} from './hammer.constants';
import { HammerHeader, HammerSummary, HammerList, HammerDelete } from './components';
import { HammerSummaryData, PaginationData } from './actions/hammerList';
import { FormattedNumber } from '../../components/biz/formatted-number';

require('./hammer.scss');

const SummaryWrapper = HammerSummary;
const ListWrapper = HammerList;

const parse = val => {
  return typeof val === 'number' ? val + '' : ' ';
};

interface HeaderParams {
  likeHammerIMEI?: string;
  likeLicensePlate?: string;
  likeVin?: string;
  vendor?: string;
  status?: string;
  opEnIds?: string;
}

interface ListParams {
  count: number;
  order: string;
  sortByField: string;
}

export interface HammerProps extends EDS.BasicProps<any> {
  name?: string;
  summary: HammerSummaryData;
  hammerList: Array<any>;
  pagination: PaginationData;
  listLoading: boolean;
  history?: any;
}

interface HammerState {
  deleteOpen?: boolean;
  removeIds?: Array<string>;
  curHammerData: any;
  clearSelectedKeys?: boolean;
  configurableAttributesData?: any;
  
}

export const IntlContext: React.Context<FMS.ContextIntl> = React.createContext(null);

class Hammer extends React.Component<HammerProps, HammerState> {
  private listParams: ListParams;
  private headerParams: HeaderParams;
  private searchOptions: any;

  constructor(props) {
    super(props);
    let sortField = 'lastModified';
    if ('vrn' === sortField) {
      sortField = 'vehicle.vrn';
    } else if ('lastModified' === sortField) {
      sortField = 'hammer.lastModified';
    }
    let direction = 'DESC';
    this.listParams = {
      count: HammerListGetCount,
      order: direction,
      sortByField: sortField
    };
    this.headerParams = {};
    this.searchOptions = { header: {}, others: {} };
    this.state = {
      deleteOpen: false,
      curHammerData: null,
      clearSelectedKeys: false,
    };
  }

  componentDidMount() {
    this.headerParams = { ...this.searchOptions.header };
    this.loadPage();
  }

  componentWillMount() {
    storage.removeItem(HammerListDataKey);
    this.searchOptions = storage.getSearchCriteria(HammerSearchOptions) || {
      header: {},
      others: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { clearSelectedKeys } = this.state;
    if (clearSelectedKeys) {
      this.setState({
        clearSelectedKeys: false
      });
    }
  }

  render(): JSX.Element {
    const { summary, hammerList, listLoading, pagination, history, configurableAttributesData } = this.props;
    const {
      curHammerData,
      deleteOpen,
      clearSelectedKeys,
    } = this.state;
    return (
      <div className={`fms-page ${prefixCls}`}>
        <HammerHeader
          reloadHammer={this.reloadHammer}
          className={`${prefixCls}__header`}
          defaultOptions={this.searchOptions.header}
          configurableAttributesData={configurableAttributesData}
        />
        <div className={`${prefixCls}__container fms-content`}>
          <SummaryWrapper
            title={this.context.intl.formatMessage(messages.summaryTitle)}
            columns={this.getSummaryColumns(summary)}
          />
          <ListWrapper
            listLoading={listLoading}
            hammerList={hammerList}
            pagination={pagination}
            paginationSwitch={this.paginationSwitch}
            handleEdit={this.handleEdit}
            handleDelete={this.handleOpenDelete}
            handleView={this.handleView}
            handleAdd={this.handleAdd}
            history={history}
          />
        </div>
        <HammerDelete
          hammerData={curHammerData}
          open={deleteOpen}
          onOk={this.handleDelete}
          onCancel={this.handleCloseDelete}
        />
      </div>
    );
  }

  private handleDelete = () => {
    const { curHammerData } = this.state;
    this.props.deleteHammer(curHammerData.id).then(
      () => {
        this.setState({ deleteOpen: false, clearSelectedKeys: true }, this.loadPage);
      },
      (msg = '') => {
        message.notice(msg, { style: { position: 'fixed', bottom: '0px' } });
      },
    );
  };

  private handleOpenDelete = hammerData => {
    if (this.state.deleteOpen) {
      return;
    }
    this.setState({
      curHammerData: hammerData,
      deleteOpen: true,
      clearSelectedKeys: false,
    });
  };

  private handleCloseDelete = () => {
    this.setState({ deleteOpen: false });
  };

  private handleAdd = () => {
    this.props.history.push(PATHS.ADD_HAMMER);
  };

  private handleView = hammerData => {
    this.props.history.push(`${PATHS.HAMMER}/${hammerData.id}`);
  };

  private handleEdit = hammerData => {
    this.props.history.push(`${PATHS.ADD_HAMMER}?id=${hammerData.id}`);
  };

  private loadPage = (isPair = false) => {
    const { getHammerList } = this.props;
    this.listParams.count = HammerListGetCount;
    this.setState({
      curHammerData: null,
    });

    storage.setSearchCriteria(HammerSearchOptions, {
      header: this.headerParams,
      others: this.listParams,
    });
    getHammerList(Object.assign({}, this.listParams, this.headerParams), 1, (msg = '') => {
      message.notice(msg, { style: { position: 'fixed', bottom: '0px' } });
    });
  };

  private paginationSwitch = (pageIndex: number, pageSize: number): void => {
    this.props.paginationSwitch(
      Object.assign({}, this.listParams, this.headerParams),
      pageIndex,
      (msg = '') => {
        message.notice(msg, { style: { position: 'fixed', bottom: '0px' } });
      },
    );
  };

  private reloadHammer = filterConditions => {
    this.headerParams = { ...filterConditions };
    this.setState({ clearSelectedKeys: true }, this.loadPage);
  };

  private getSummaryColumns = summary => {
    if (!summary) {
      return [];
    }
    return [
      {
        name: <FormattedMessage {...messages.summaryTotalHammer} />,
        value: <FormattedNumber value={summary.totalHammer} />,
      },
    ];
  };
}

(Hammer as React.ComponentType<HammerProps>).contextTypes = {
  intl: PropTypes.object,
};

export default Hammer;

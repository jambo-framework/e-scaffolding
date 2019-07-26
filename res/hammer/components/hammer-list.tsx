import * as React from 'react';
import * as PropTypes from 'prop-types';
import { format as MyFormat } from 'date-fns';
import { FormattedMessage } from 'react-intl';

import { Pagination } from 'eds-react/lib/components/pagination';
import { OperationMenu } from '../../../components/biz/operation-menu';
import { Row, Col } from 'eds-react/lib/components/grid';
import { Menu, MenuItem } from 'eds-react/lib/components/menu';
import { ActionTable } from '../../../components/biz/action-table';
import { ATTRIBUTES_CODE } from '../../configurable-attributes/configurable-attributes.constants';
import {
  IconAdd,
  IconEdit,
  IconDelete,
  IconVisible,
} from '../../../utils/icon';
let defaultColumns;
import messages from '../message';
import { PaginationData } from '../actions/hammerList';
import { prefixCls, hammerPrefixCls } from '../hammer.constants';
import PATHS from '../../../common/paths';
const AddBtn = MenuItem;
interface HammerListProps {
  listLoading?: boolean;
  hammerList?: Array<any>;
  pagination?: PaginationData;
  history?: any;
  paginationSwitch?: (pageIndex: number, pageSize: number) => void;
  handleEdit?: (rowData: any) => void;
  handleDelete?: (rowData: any) => void;
  handleView?: (rowData: any) => void;
  handleAdd?: () => void;
}

interface HammerListState {
  selectedKeys: Array<string>;
  selectedRows: any;
  fixLeft?: number;
  forRefresh?: number;
}

const initState = {
  selectedKeys: [],
  selectedRows: [],
  fixLeft: 0,
  forRefresh: 0
};

const clickKey = {
  'ivdId': 'ivdIdClick',
  'vrn': 'vrnClick'
};

class HammerList extends React.Component<HammerListProps, HammerListState> {
  constructor(props) {
    super(props);

    this.state = { ...initState };
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    let { listLoading, hammerList, history } = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selectedKeys,
      type: 'checkbox',
      disableSelectAll: false,
      onChange: this.onSelectChange,
    };
    hammerList.forEach(hammer => {
      hammer[clickKey.ivdId] = () => hammer.id && history.push(PATHS.HAMMER + '/' + hammer.id);
    });
    defaultColumns = this.getColumns();
    return (
      <React.Fragment>
        <Row>
          <Col span={24}>
            <ActionTable
              withSetting
              headResizable
              hover
              frozen={{ fixRight: 0, fixLeft: this.state.fixLeft }}
              className={`${hammerPrefixCls}-list`}
              loading={listLoading}
              loadingProps={{ color: 'black', size: 100, thickness: 4.6 }}
              cardProps={{ title: <FormattedMessage {...messages.tableTitle} /> }}
              rowSelection={rowSelection}
              toolIcons={this.getTools()}
              dftColsConfig={this.getColumns()}
              dataSource={hammerList}
              columns={defaultColumns}
              onAction={this.onAction}
            />
          </Col>
        </Row>
        {this.renderPagination()}
      </React.Fragment>
    );
  }

  onAction = (action) => {
  }

  private renderPagination = () => {
    const { pagination, paginationSwitch } = this.props;
    if (!pagination || pagination.totalResult === 0) {
      return null;
    }
    return (
      <Pagination
        onPageSizeChange={paginationSwitch}
        onChange={paginationSwitch}
        pageSize={pagination.itemsPerPage}
        current={pagination.pageIndex}
        total={pagination.totalResult}
        pageSizeOptions={[10, 20, 30, 40, 50]}
      />
    );
  };

  private onSelectChange = (
    values: Array<string>,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { hammerList } = this.props;
    const { selectedRows } = this.state;

    let newSelectedRows = [];

    values.forEach(value => {
      let selectedRow = selectedRows.find(row => row.id === value);

      if (!selectedRow) {
        selectedRow = hammerList.find(item => item.id === value);
        if (selectedRow) {
          newSelectedRows.push(selectedRow);
        }
      } else {
        newSelectedRows.push(selectedRow);
      }
    });

    this.setState({
      selectedKeys: values,
      selectedRows: newSelectedRows,
    });
  };

  private getColumns = () => {
    const { handleEdit, handleDelete, handleView } = this.props;
    const { formatMessage } = this.context.intl;
    return [
      {
        title: <FormattedMessage {...messages.tableHeadIMEI} />,
        key: 'ivdId',
        exportKey: 'ivdId',
        exportHead: formatMessage(messages.tableHeadIMEI),
        require: true,
        checked: true,
        width: '20%',
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: <FormattedMessage {...messages.tableHeadVendor} />,
        key: 'manufacturer',
        exportKey: 'manufacturer',
        exportHead: formatMessage(messages.tableHeadVendor),
        checked: true,
        width: '20%',
        render: text => {
          const value = ATTRIBUTES_CODE[2];
          return (
            <span title={value}>{value}</span>
          );
        },
      },
      {
        title: <FormattedMessage {...messages.tableHeadHammerType} />,
        key: 'ivdType',
        exportKey: 'ivdType',
        exportHead: formatMessage(messages.tableHeadHammerType),
        checked: true,
        width: '20%',
        render: text => {
          const value = ATTRIBUTES_CODE[1];
          return (
            <span title={value}>{value}</span>
          );
        },
      },
      {
        title: <FormattedMessage {...messages.tableHeadStatus} />,
        key: 'status',
        exportKey: 'status',
        exportHead: formatMessage(messages.tableHeadStatus),
        checked: true,
        width: '10%',
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: <FormattedMessage {...messages.tableHeadLicensePlate} />,
        key: 'vrn',
        exportKey: 'vrn',
        exportHead: formatMessage(messages.tableHeadLicensePlate),
        require: true,
        checked: true,
        sort: 'NONE',
        width: '10%',
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: <FormattedMessage {...messages.tableHeadOrganization} />,
        key: 'enterpriseName',
        exportKey: 'enterpriseName',
        exportHead: formatMessage(messages.tableHeadOrganization),
        checked: true,
        width: '20%',
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: <FormattedMessage {...messages.tableHeadLastHeart} />,
        key: 'lastHeartbeat',
        exportKey: 'lastHeartbeat',
        exportHead: formatMessage(messages.tableHeadLastHeart),
        checked: true,
        width: '20%',
        render: (_value, rowData, columnIdx) => {
          let time = _value ? MyFormat(_value, 'H:mm:ss YYYY-MM-DD') : '';
          return <div className={`${prefixCls}-td__time`} title={time}>{time}</div>;
        },
      },
      {
        title: <FormattedMessage {...messages.tableHeadVin} />,
        key: 'vin',
        exportKey: 'vin',
        exportHead: formatMessage(messages.tableHeadVin),
        checked: false,
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: <FormattedMessage {...messages.tableHeadSerialNumber} />,
        key: 'serialNumber',
        exportKey: 'serialNumber',
        exportHead: formatMessage(messages.tableHeadSerialNumber),
        checked: false,
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: <FormattedMessage {...messages.tableHeadVersion} />,
        key: 'version',
        exportKey: 'version',
        exportHead: formatMessage(messages.tableHeadVersion),
        checked: false,
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: <FormattedMessage {...messages.tableHeadFirmwareVersion} />,
        key: 'systemVersion',
        exportKey: 'systemVersion',
        exportHead: formatMessage(messages.tableHeadFirmwareVersion),
        checked: false,
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: <FormattedMessage {...messages.tableHeadDescription} />,
        key: 'description',
        exportKey: 'description',
        exportHead: formatMessage(messages.tableHeadDescription),
        checked: false,
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: <FormattedMessage {...messages.tableHeadSIMPhoneNumber} />,
        key: 'msisdn',
        exportKey: 'msisdn',
        exportHead: formatMessage(messages.tableHeadSIMPhoneNumber),
        checked: false,
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: <FormattedMessage {...messages.tableHeadIMSI} />,
        key: 'imsi',
        exportKey: 'imsi',
        exportHead: formatMessage(messages.tableHeadIMSI),
        checked: false,
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: <FormattedMessage {...messages.tableHeadIccID} />,
        key: 'iccId',
        exportKey: 'iccId',
        exportHead: formatMessage(messages.tableHeadIccID),
        checked: false,
        render: text => <span title={text}>{text}</span>,
      },
      {
        title: <FormattedMessage {...messages.tableHeadLastModified} />,
        key: 'lastModified',
        exportKey: 'lastModified',
        exportHead: formatMessage(messages.tableHeadLastModified),
        checked: false,
        sort: 'DESC',
        render: (_value, rowData, columnIdx) => {
          let time = _value ? MyFormat(_value, 'H:mm:ss YYYY-MM-DD') : '';
          return <div className={`${prefixCls}-td__time`} title={time}>{time}</div>;
        },
      },
      {
        key: 'externalId',
        exportKey: 'externalId',
        exportHead: formatMessage(messages.listExternalId),
        title: <FormattedMessage {...messages.listExternalId} />,
        require: false,
        checked: false,
      },
      {
        title: '',
        key: 'operation',
        // exportKey: 'operation',
        // exportHead: formatMessage(messages.toolTipsAdd),
        render: (_value, rowData) => {
          const menuDatas = [
            {
              primaryText: <FormattedMessage {...messages.toolTipsView} />,
              ClickHandler: () => {
                handleView(rowData);
              },
            },
            {
              primaryText: <FormattedMessage {...messages.toolTipsEdit} />,
              ClickHandler: () => {
                handleEdit(rowData);
              },
            },
            {
              primaryText: <FormattedMessage {...messages.toolTipsDelete} />,
              ClickHandler: () => {
                handleDelete(rowData);
              },
            },
          ];
          return <OperationMenu menuDatas={menuDatas} />;
        },
      },
    ];
  };

  private getTools = () => {
    const {
      handleEdit,
      handleDelete,
      handleView,
      handleAdd,
    } = this.props;
    const { selectedKeys } = this.state;
    return [
      {
        icon: <IconDelete color="gray" />,
        tips: <FormattedMessage {...messages.toolTipsDelete} />,
        handle: this.toolsHandler.bind(this, handleDelete),
        testName: 'tableDeleteButton',
        show: selectedKeys && selectedKeys.length === 1,
      },
      {
        icon: <IconEdit color="gray" />,
        tips: <FormattedMessage {...messages.toolTipsEdit} />,
        handle: this.toolsHandler.bind(this, handleEdit),
        testName: 'tableEditButton',
        show: selectedKeys && selectedKeys.length === 1,
      },
      {
        icon: <IconVisible color="gray" />,
        tips: <FormattedMessage {...messages.toolTipsView} />,
        handle: this.toolsHandler.bind(this, handleView),
        testName: 'tableViewButton',
        show: selectedKeys && selectedKeys.length === 1,
      },
      {
        icon: <IconAdd color="gray" />,
        dropdownOptions: {
          trigger: 'click',
          placement: 'bottomRight',
          overlay: this.getDropdownMenus()
        },
        tips: <FormattedMessage {...messages.toolTipsAdd} />,
        handle: () => { },
        testName: 'tableAddButton',
        show: true,
      },
    ];
  };

  private getDropdownMenus = () => {
    return (
      <Menu onItemClick={this.handleItemClick} size="sm">        
        <AddBtn>
          <FormattedMessage {...messages.toolTipsAdd} />
        </AddBtn>
      </Menu>
    );
  };

  private handleItemClick = (key) => {
    const { handleAdd } = this.props;
    switch (key) {
      case '0':
        handleAdd && handleAdd();
        break;
      default:
    }
  };

  private toolsHandler = (handler: Function, force: boolean = false) => {
    const { hammerList } = this.props;
    let key = this.state.selectedKeys[0];
    if (key || force) {
      const hammerData = hammerList.filter(v => {
        return v.key === key;
      })[0];
      handler.call(this, hammerData);
    }
  };
}

(HammerList as React.ComponentType<HammerListProps>).contextTypes = {
  intl: PropTypes.object,
};

export default HammerList;

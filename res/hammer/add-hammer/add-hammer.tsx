// tslint:disable
import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as classNames from 'classnames';

import { Card } from 'eds-react/lib/components/card';
import { Button } from 'eds-react/lib/components/button';
import { Spinner } from 'eds-react/lib/components/spinner';
import { message } from 'eds-react/lib/components/message';
import { IconLink } from '../../../utils/icon';
import CardHeader from 'eds-react/lib/components/card/card-header';

import HeaderHead from '../../../components/biz/layout/header/header-head';
import { TreeSelectTextField } from '../../../components/biz/tree';

import validate from '../../../app/packages/common/utils/validate';
import FMSTextField from '../../../app/packages/common/components/fms-text-field';
import FMSSelect from '../../../app/packages/common/components/fms-select';
import { ATTRIBUTES_CODE } from '../../configurable-attributes/configurable-attributes.constants';
import { HammerIntro, HammerGroups } from '../components';

import {
  hammerPrefixCls,
  prefixCls,
  vendorDataSource,
  statusDataSource,
} from '../hammer.constants';
import hammersMessages from '../message';

import { getEnums } from '../../../utils/enums/index';

require('../hammer.scss');

const textStyle = {
    width: '100%',
    height: '69px',
    marginTop: '-3px',
  },
  closeBtnStyle = {
    right: '36px',
  };
const selectIconColor = 'rgba(0, 0, 0, 0.6)';

export interface AddHammerProps extends EDS.BasicProps<any> {
  name?: string;
  editData?: any;
}

export interface AddHammerState {
  vendorDataSource: Array<{ text: string; value: string }>;
  statusDataSource: Array<{ text: string; value: string }>;
  organizationDataSource: Array<any>;
  hammerObj: any;
  saveDisabled: boolean;
  isLoading: boolean;
  editData?: any;
}

const initialState = {
  editData: {},
  vendorDataSource: [...vendorDataSource],
  statusDataSource: [...statusDataSource],
  organizationDataSource: [],
  saveDisabled: true,
  isLoading: false,
};

class AddHammer extends React.Component<AddHammerProps, AddHammerState> {
  private editObj: object = {};
  private action = 'add';
  constructor(props) {
    super(props);

    let hammerObj = Object.assign({}, props.location.state, props.match.params);
    if (!hammerObj.id && props.location.search) {
      let search = props.location.search.replace(/^\?/, '');
      search = search.split('&').filter(v => {
        return v.split('=')[0] === 'hammerId';
      });
      search.length > 0 && (hammerObj.id = search[0].split('=')[1]);
    }
    hammerObj.hammerId = hammerObj.id;
    this.state = {
      hammerObj: hammerObj,
      ...initialState,
    };
  }

  componentDidMount() {
    const { hammerObj } = this.state;
    const { fetchHammerData } = this.props;
    if (!!hammerObj.hammerId) {
      this.action = 'edit';
      fetchHammerData(hammerObj.hammerId, this.action, (msg = '') => {
        message.notice(msg, { style: { position: 'fixed', bottom: '0px' } });
        this.setState({ saveDisabled: true });
      });
      this.setState({ saveDisabled: false });
    }
    this.props.getConfigurableAttributesData({
      attributeCode: [ATTRIBUTES_CODE[0], ATTRIBUTES_CODE[1], ATTRIBUTES_CODE[2]]
    });
  }

  componentWillReceiveProps(nextProps) {
    let { errorMessage } = nextProps;
    if (
      errorMessage !== undefined &&
      errorMessage !== null &&
      errorMessage !== '' &&
      this.props.errorMessage !== errorMessage
    ) {
      message.notice(errorMessage, { style: { position: 'fixed', bottom: '0px' } });
    }
    if (this.action == 'edit') {
      this.setState({
        editData: nextProps.editData,
      });
    }
  }

  render(): JSX.Element {
    const headerTrue = true;
    const { name } = this.props;
    const { editData, hammerObj, saveDisabled } = this.state;
    const { formatMessage } = this.context.intl;
    let avatarClassName = `${hammerPrefixCls}-intro__icon-unpaired`;
    let title = 'Unpaired';
    let subTitle = 'Save the hammer before pairing it with a vehicle.';
    let btnText = 'Pair';
    if (this.action == 'edit' && editData.vin) {
      avatarClassName = `${hammerPrefixCls}-intro__icon-paired`;
      title = 'Paired';
      btnText = 'Unpair';
    }
    return (
      <div className={`fms-page ${hammerPrefixCls}`}>
        <div className={'fms-layout-header'}>
          <HeaderHead
            title={
              this.action == 'edit'
                ? `${editData.manufacturer} - ${editData.ivdId}`
                : 'Add Hammer'
            }
            withGoBack={headerTrue}
            navigationMenu={headerTrue}
            onMenuClick={this.handleGoBack}
          />
        </div>
        <Card contentClassName={`${hammerPrefixCls}-content`}>
          <HammerIntro
              icon={<IconLink />}
              avatarClassName={avatarClassName}
              title={title}
              subTitle={subTitle}
              btnText={btnText}
              btnDisabled={true}
              btnExplain={this.renderBtnExplain()}
          />
          <div className={`${hammerPrefixCls}__line`} />
          <CardHeader
            className={`${hammerPrefixCls}-info__header`}
            title= 'Hammer information'
          />
          <HammerGroups groups={this.getGroups()} className={`${hammerPrefixCls}-edit`} />
          <div className={`${hammerPrefixCls}-edit__footer-tip`}>
            'When the hammer is paired with a vehicle it will inherit the vehicles organizational belonging.'
          </div>
          <div className={`${hammerPrefixCls}-edit__button`}>
            <Button
              className={`${prefixCls}-cancel__button`}
              children={formatMessage(hammersMessages.buttonCancel)}
              onClick={this.handleGoBack}
            />
            <Button
              className={classNames(
                `${prefixCls}-ok__button`,
                `${hammerPrefixCls}-edit-save__button`,
              )}
              children={formatMessage(hammersMessages.buttonSave)}
              disabled={saveDisabled}
              onClick={this.handleSave}
            />
          </div>
        </Card>
        {this.renderSpinner()}
      </div>
    ) ;
  }

  private handleChangeForDatePicker = (key, date) => {
    const d = new Date(date);
    const tf = i => {
      return (i < 10 ? '0' : '') + i;
    };
    const formatDate = d.getFullYear() + '-' + tf(d.getMonth() + 1) + '-' + tf(d.getDate());
    this.checkButtonStatus(key, formatDate);
  };

  private handleSave = () => {
    const { hammerObj } = this.state;
    const { saveHammer, editData } = this.props;
    let data: any = {};
    let payload: any = {};
    data.ivdId = (this.refs.imei as any).getValue();
    data.imsi = (this.refs.imsi as any).getValue();
    data.manufacturer = (this.refs.vendor as any).getValue();
    data.status = (this.refs.status as any).getValue();
    data.serialNumber = (this.refs.serialNumber as any).getValue();
    data.version = (this.refs.hardwareVersion as any).getValue();
    data.systemVersion = (this.refs.firmwareVersion as any).getValue();
    // data.licenced = (this.refs.expiryDate as any).getValue();
    data.description = (this.refs.description as any).getValue();
    data.msisdn = (this.refs.simPhoneNumber as any).getValue();
    data.iccId = (this.refs.iccId as any).getValue();
    data.externalId = (this.refs.externalId as any).getValue();
    data.enterpriseId = (this.refs.organization as any).getValue();
    data.ivdType = (this.refs.hammerType as any).getValue();
    if (
      data.ivdId === undefined ||
      data.manufacturer === undefined ||
      data.enterpriseId === undefined ||
      this.state.isLoading
    ) {
      return false;
    }
    for (let key in data) {
      if (this.action == 'edit') {
        if (
          !editData[key]
            ? data[key] !== undefined && data[key] !== '' && data[key] !== null
            : data[key] !== editData[key]
        ) {
          payload[key] = data[key];
        }
      } else {
        if (data[key] !== undefined && data[key] !== '' && data[key] !== null) {
          payload[key] = data[key];
        }
      }
    }
    this.setState(
      {
        isLoading: true,
      },
      () => {
        if (this.action == 'edit') {
          payload.id = hammerObj.hammerId;
        }
        saveHammer(
          payload,
          this.action,
          () => {
            this.setState(
              {
                isLoading: false,
              },
              () => {
                this.handleGoBack();
              },
            );
          },
          (msg: string = '') => {
            this.setState(
              {
                isLoading: false,
              },
              () => {
                message.notice(msg, { style: { position: 'fixed', bottom: '0px' } });
              },
            );
          },
        );
      },
    );
  };

  private handleGoBack = () => {
    this.props.history.goBack();
  };

  private renderSpinner = () => {
    const { isLoading } = this.state;
    return isLoading ? <Spinner className={`${hammerPrefixCls}-spinner`} size={100} /> : null;
  };

  private renderBtnExplain = () => {
    const { editData } = this.state;
    if (this.action == 'edit' && editData.vin) {
      return 'Save the hammer before unpairing it with a vehicle. ';
    }
    return null;
  };
  private getEnumsData = (items) => {
    const data = [];
    items && items.forEach((item) => {
      data.push({
        code: item.id && item.id.code,
        value: item.value
      })
    })
    return data
  }
  private getGroups = () => {
    const { formatMessage } = this.context.intl;
    const { configurableAttributesData } = this.props;
    const { editData, vendorDataSource, statusDataSource, organizationDataSource } = this.state;
    const treeProps = {
      dataSource: [...organizationDataSource],
      singleSelectable: true,
      columns: [
        {
          dataIndex: 'name',
          width: 200,
        },
      ],
    };
    const disableTree = this.action == 'edit' && editData.vin ? true : false;
    const NA = 'N/A';
    let groups = [
      {
        items: [
          {
            value: (
              <FMSTextField
                dataTest="imei"
                ref="imei"
                name="imei"
                textStyle={textStyle}
                closeBtnStyle={closeBtnStyle}
                underlineDisabledStyle={{ borderBottom: '1px solid #e0e0e0' }}
                disabled={this.action == 'edit' ? true : false}
                showErrorText={true}
                showCloseButton={true}
                autoComplete="off"
                floatingLabelText={`IMEI *`}
                defaultValue={editData.ivdId}
                validation={[validate.required]}
                onChange={(e, value) => this.checkButtonStatus('imei', e.target.value)}
              />
            ),
          },
          {
            value: (
              <FMSSelect
                dataTest="vendor"
                name="vendor"
                ref="vendor"
                selectStyle={textStyle}
                iconStyle={{ fill: selectIconColor }}
                floatingLabelText={`Vendor *`}
                defaultValue={editData.manufacturer}
                validation={[validate.required]}
                keyName="code"
                labelName="value"
                dataSource={this.getEnumsData(getEnums(configurableAttributesData, ATTRIBUTES_CODE[2]))}
                onChange={(e, key, value) => this.checkButtonStatus('vendor', value)}
              />
            ),
          },
          {
            value: (
              <FMSSelect
                dataTest="status"
                name="status"
                ref="status"
                selectStyle={textStyle}
                iconStyle={{ fill: selectIconColor }}
                disabled={true}
                floatingLabelText={`Status *`}
                defaultValue={editData.status || statusDataSource[0].value}
                keyName="text"
                dataSource={statusDataSource}
                onChange={(e, key, value) => this.checkButtonStatus('status', value)}
              />
            ),
          },
          {
            value: (
              <FMSTextField
                dataTest="serialNumber"
                ref="serialNumber"
                name="serialNumber"
                textStyle={textStyle}
                closeBtnStyle={closeBtnStyle}
                showCloseButton={true}
                autoComplete="off"
                floatingLabelText='Hammer serial number'
                defaultValue={editData.serialNumber}
                onChange={(e, value) => this.checkButtonStatus('serialNumber', e.target.value)}
              />
            ),
          },
          {
            value: (
              <FMSTextField
                dataTest="hardwareVersion"
                ref="hardwareVersion"
                name="hardwareVersion"
                textStyle={textStyle}
                closeBtnStyle={closeBtnStyle}
                showCloseButton={true}
                autoComplete="off"
                floatingLabelText='Hardware version'
                defaultValue={editData.version}
                onChange={(e, value) => this.checkButtonStatus('hardwareVersion', e.target.value)}
              />
            ),
          },
          {
            value: (
              <FMSTextField
                dataTest="firmwareVersion"
                ref="firmwareVersion"
                name="firmwareVersion"
                textStyle={textStyle}
                closeBtnStyle={closeBtnStyle}
                showCloseButton={true}
                autoComplete="off"
                floatingLabelText='Firmware version'
                defaultValue={editData.systemVersion}
                onChange={(e, value) => this.checkButtonStatus('firmwareVersion', e.target.value)}
              />
            ),
          },
          {
            value: (
              <FMSTextField
                dataTest="description"
                ref="description"
                name="description"
                textStyle={textStyle}
                closeBtnStyle={closeBtnStyle}
                showCloseButton={true}
                autoComplete="off"
                floatingLabelText='Description'
                defaultValue={editData.description}
                onChange={(e, value) => this.checkButtonStatus('description', e.target.value)}
              />
            ),
            spanCol: 16,
          },
          {
            value: (
              <FMSSelect
                dataTest="hammerType"
                name="hammerType"
                ref="hammerType"
                selectStyle={textStyle}
                iconStyle={{ fill: selectIconColor }}
                floatingLabelText='HammerType'
                defaultValue={editData.ivdType}
                // validation={[validate.required]}
                keyName="code"
                labelName="value"
                dataSource={this.getEnumsData(getEnums(configurableAttributesData, ATTRIBUTES_CODE[1]))}
                onChange={(e, key, value) => this.checkButtonStatus('hammerType', value)}
              />
            ),
            // spanCol: 16,
          },
        ],
      },
      {
        title: 'Subscription information',
        items: [
          {
            value: (
              <FMSTextField
                dataTest="simPhoneNumber"
                ref="simPhoneNumber"
                name="simPhoneNumber"
                textStyle={textStyle}
                closeBtnStyle={closeBtnStyle}
                showCloseButton={true}
                autoComplete="off"
                floatingLabelText='SIM phone number'
                defaultValue={editData.msisdn}
                onChange={(e, value) => this.checkButtonStatus('simPhoneNumber', e.target.value)}
              />
            ),
          },
          {
            value: (
              <FMSTextField
                dataTest="imsi"
                ref="imsi"
                name="imsi"
                textStyle={textStyle}
                closeBtnStyle={closeBtnStyle}
                showCloseButton={true}
                autoComplete="off"
                floatingLabelText='IMSI'
                defaultValue={editData.imsi}
                onChange={(e, value) => this.checkButtonStatus('imsi', e.target.value)}
              />
            ),
          },
          {
            value: (
              <FMSTextField
                dataTest="iccId"
                ref="iccId"
                name="iccId"
                textStyle={textStyle}
                closeBtnStyle={closeBtnStyle}
                showCloseButton={true}
                autoComplete="off"
                floatingLabelText='ICCID'
                defaultValue={editData.iccId}
                onChange={(e, value) => this.checkButtonStatus('iccId', e.target.value)}
              />
            ),
          },
          {
            value: (
              <FMSTextField
                dataTest="externalId"
                ref="externalId"
                name="externalId"
                textStyle={textStyle}
                closeBtnStyle={closeBtnStyle}
                showCloseButton={true}
                autoComplete="off"
                floatingLabelText='External ID'
                defaultValue={editData.externalId}
                onChange={(e, value) => this.checkButtonStatus('externalId', e.target.value)}
              />
            ),
          },
        ],
      },
      {
        title: 'Hammer belong to',
        items: [
          {
            value: (
              <TreeSelectTextField
                disable={disableTree}
                selectField={{ hintText: `Organization *` }}
                selectFieldStyle={Object.assign(
                  { width: '100%' },
                  disableTree ? { cursor: 'not-allowed' } : {},
                )}
                selectFieldTextStyle={disableTree ? { color: 'rgba(0, 0, 0, 0.3)' } : {}}
                dataTest="organization"
                ref="organization"
                tree={treeProps}
                defaultValue={editData.enterpriseId}
                validation={[validate.required]}
                onChange={value => this.checkButtonStatus('organization', value)}
              />
            ),
          },
        ],
      },
    ];
    return groups;
  };

  private checkButtonStatus = (key, value) => {
    const { editData } = this.state;
    if (value) {
      this.editObj[key] = value;
    } else {
      editData.id ? (this.editObj[key] = '') : delete this.editObj[key];
    }
    const bl = JSON.stringify(this.editObj) === JSON.stringify(editData);
    this.state.saveDisabled !== bl &&
      this.setState({
        saveDisabled: bl,
      });
  };

  private inspectTime = time => {
    if (time && new Date(time).toString() === 'Invalid Date') {
      return undefined;
    }
    return time;
  };
}

(AddHammer as React.ComponentType<AddHammerProps>).contextTypes = {
  intl: PropTypes.object,
};

export default AddHammer;


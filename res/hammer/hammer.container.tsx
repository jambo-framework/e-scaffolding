import * as React from 'react';
import { connect } from 'react-redux';
import * as Loadable from 'react-loadable';

import {
  getHammerList,
  paginationSwitch,
} from './actions';
import { getConfigurableAttributesData } from '../configurable-attributes/actions/index';
import { HammerProps } from './hammer';

interface HammerDispatch {
  getHammerList: Function;
  paginationSwitch: Function;
  getConfigurableAttributesData: Function;
}

const mapStateToProps = (state: any): HammerProps => ({
  name: 'hammer',
  summary: state.hammer.summary,
  hammerList: state.hammer.hammerList,
  pagination: state.hammer.pagination,
  listLoading: state.hammer.listLoading,
  configurableAttributesData: [],
});

const mapDispatchToProps = (dispatch: Function): HammerDispatch => ({
  getHammerList: (condition: object, pageIndex: number, onFailed?: Function) =>
    dispatch(getHammerList(condition, pageIndex, onFailed)),
  paginationSwitch: (condition: object, pageIndex: number, onFailed?: Function) =>
    dispatch(paginationSwitch(condition, pageIndex, onFailed)),
  getConfigurableAttributesData: (paras) => dispatch(getConfigurableAttributesData(paras)),
});

const Hammer: any = Loadable({
  loader: () => import('./hammer'),
  loading: () => null,
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Hammer);

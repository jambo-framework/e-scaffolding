import * as React from 'react';
import { connect } from 'react-redux';
import * as Loadable from 'react-loadable';
import { getConfigurableAttributesData } from '../../configurable-attributes/actions/index';
import { AddHammerProps } from './add-hammer';

interface AddHammerDispatch {
  getConfigurableAttributesData: Function;
}

const mapStateToProps = (state: any): AddHammerProps => ({
  name: 'addHammer',
  editData: state.hammer.editData,
  configurableAttributesData: [],
});

const mapDispatchToProps = (dispatch: Function): AddHammerDispatch => ({
    getConfigurableAttributesData: (paras) => dispatch(getConfigurableAttributesData(paras)),
});

const AddHammer: any = Loadable({
  loader: () => import(/* webpackChunkName: "addHammer" */ './add-hammer'),
  loading: () => null,
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddHammer);

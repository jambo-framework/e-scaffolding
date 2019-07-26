import * as React from 'react';
import * as classNames from 'classnames';
import { Row, Col } from 'eds-react/lib/components/grid';

import { hammerPrefixCls } from '../hammer.constants';

const prefixCls = `${hammerPrefixCls}-info`;
const outPrefixCls = hammerPrefixCls;

interface ItemParams {
  title?: string;
  value: React.ReactNode;
  spanCol?: number;
  required?: boolean;
}

interface GroupParams {
  title?: string;
  items: Array<ItemParams>;
}

interface HammerGroupsProps extends EDS.BasicProps<React.HtmlHTMLAttributes<HTMLDivElement>> {
  groups?: Array<GroupParams>;
}

class HammerGroups extends React.Component<HammerGroupsProps> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render(): JSX.Element {
    const { groups, className, ...others } = this.props;
    const classes = classNames(className, prefixCls);
    let rows = [];
    rows = groups.map((item, index) => {
      let title;
      if (item.title) {
        title = <div className={`${prefixCls}__title`}>{item.title}</div>;
      }
      return (
        <React.Fragment key={index}>
          {title}
          <Row className={`${prefixCls}__group`}>{this.getCols(item.items)}</Row>
          {index < groups.length - 1 && <div className={`${outPrefixCls}__line`} />}
        </React.Fragment>
      );
    });

    return <div className={classes}>{rows}</div>;
  }

  private getCols = (data: Array<ItemParams>) => {
    let cols = [];
    cols = data.map((item, index) => {
      let title;
      if (item.title) {
        title = (
          <div className={`${prefixCls}-item__title`}>
            {' '}
            {item.title}
            {item.required && ' *'}
          </div>
        );
      }
      return (
        <Col className={`${prefixCls}-item`} span={item.spanCol || 8} key={index}>
          {title}
          <div className={`${prefixCls}-item__value`}>{item.value}</div>
        </Col>
      );
    });
    return cols;
  };
}

export default HammerGroups;

import * as React from 'react';

import { Row, Col } from 'eds-react/lib/components/grid';
import { Summary } from '../../../components/biz/summary';

interface HammerSummaryProps {
  title: string;
  columns: Array<any>;
}

class HammerSummary extends React.Component<HammerSummaryProps, {}> {
  constructor(props) {
    super(props);
  }
  render() {
    let { title, columns } = this.props;
    return (
      <React.Fragment>
        <Row>
          <Col span={24}>
            <Summary title={title} columns={columns} />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default HammerSummary;

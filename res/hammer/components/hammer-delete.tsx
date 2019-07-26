import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { Dialog } from 'eds-react/lib/components/dialog';
import { Button } from 'eds-react/lib/components/button';

import messages from '../message';
import { prefixCls } from '../hammer.constants';

interface HammerDeleteProps extends InjectedIntlProps {
  hammerData: any;
  isPaired: boolean;
  open: boolean;
  onOk: (id) => void;
  onCancel?: () => void;
}

const dialogTextStyle = { lineHeight: '23px', color: 'rgba(0, 0, 0, 0.6)' };

class HammerDelete extends React.Component<HammerDeleteProps> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render(): JSX.Element {
    const { intl } = this.props;
    const { hammerData, isPaired, open, onOk, onCancel } = this.props;

    let contentText;
    let content;
    let title = 'dialogDeleteUnpairedTitle';
    if (isPaired && hammerData) {
      contentText = (
        <div style={{ ...dialogTextStyle }}>
          'dialogPairedText':  ${hammerData.vin}`}
          <br />
            'dialogDeletePairedTip'
        </div>
      );
      title = 'dialogDeletePairedTitle';
    }
    if (hammerData) {
      content = (
        <React.Fragment>
          <div style={{ marginBottom: '20px', ...dialogTextStyle }}>
            {`${hammerData.manufacturer} - ${hammerData.ivdId}`}
          </div>
          {contentText}
        </React.Fragment>
      );
    }
    return <Dialog title={title} open={open} children={content} footer={this.renderFooter()} />;
  }

  renderFooter = () => {
    const { intl } = this.props;
    const { hammerData, isPaired, open, onOk, onCancel } = this.props;
    return (
      <div style={{ marginTop: '16px', marginBottom: '16px' }}>
        <Button
          type="text"
          className={`${prefixCls}-cancel__button`}
          onClick={onCancel}
          children={intl.formatMessage(messages.buttonCancel)}
        />

        <Button
          type="text"
          className={`${prefixCls}-ok__button`}
          onClick={onOk}
          children={intl.formatMessage(messages.buttonDelete)}
        />
      </div>
    );
  };
}

export default injectIntl(HammerDelete);

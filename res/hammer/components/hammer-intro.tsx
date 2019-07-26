import * as React from 'react';
import * as classNames from 'classnames';

import { Avatar } from 'eds-react/lib/components/avatar';
import { Button } from 'eds-react/lib/components/button';

import { hammerPrefixCls, prefixCls as commonCls } from '../hammer.constants';

interface HammerIntroProps extends EDS.BasicProps<React.HtmlHTMLAttributes<HTMLDivElement>, 'title'> {
  icon: React.ReactNode;
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  btnText?: React.ReactNode;
  btnExplain?: React.ReactNode;
  className?: string;
  avatarClassName?: string;
  btnDisabled?: boolean;
  btnClick?: (data: any) => void;
  btnShow?: boolean;
}

const HammerIntro: React.StatelessComponent<HammerIntroProps> = props => {
  const {
    icon,
    title,
    subTitle,
    btnExplain,
    prefixCls,
    className,
    avatarClassName,
    btnShow,
    ...others
  } = props;

  const classes = classNames(className, prefixCls);

  const renderBtn = () => {
    const {
      btnText,
      btnDisabled,
      btnClick,
    } = props;

    return (
      <Button
        type="text"
        className={`${commonCls}-ok__button`}
        disabled={btnDisabled}
        onClick={btnClick}
        children={btnText}
      />
    );
  };

  const intro: JSX.Element = (
    <div className={classes}>
      <Avatar className={avatarClassName}>{icon}</Avatar>
      <div className={`${prefixCls}__title`}>
        <h3>{title}</h3>
        <h4>{subTitle}</h4>
      </div>
      {btnShow === false ? null : renderBtn()}
      <div className={`${prefixCls}__btn-explain`}>{btnExplain}</div>
    </div>
  );

  return intro;
};

HammerIntro.defaultProps = {
  prefixCls: `${hammerPrefixCls}-intro`,
};

export default HammerIntro;

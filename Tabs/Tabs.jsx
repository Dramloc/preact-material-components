import {MDCTabBar, MDCTabBarScroller} from '@material/tabs';

import MaterialComponent from '../MaterialComponent';
import {h, VNode} from 'preact';

/*
 * Default props for tabs
 */
const defaultProps = {
  activeTabIndex: 0
};

/**
 * @prop icons-with-text = false
 * @prop icon-tab-bar = false
 * @prop scroller = false
 */
class Tabs extends MaterialComponent {
  get tabBar() {
    return this.props.scroller ? this.MDComponent.tabBar : this.MDComponent;
  }
  constructor() {
    super();
    this.componentName = 'tab-bar';
    this._mdcProps = ['icon-tab-bar', 'icons-with-text', 'scroller'];
  }
  componentDidMount() {
    if (this.props.scroller) {
      this.MDComponent = new MDCTabBarScroller(this.control);
    } else {
      this.MDComponent = new MDCTabBar(this.control);
    }
    setActiveTabIndex(defaultProps, this.props, this.tabBar);
  }
  componentWillUnmount() {
    this.MDComponent.destroy && this.MDComponent.destroy();
  }
  componentWillUpdate(nextProps) {
    setActiveTabIndex(this.props, nextProps, this.tabBar);
  }
  materialDom(props) {
    return (
      <nav role="tablist" {...props}>
        {props.children}
        <span class="mdc-tab-bar__indicator" />
      </nav>
    );
  }
  render() {
    const tabBar = super.render();
    const element = this.props.scroller ? withTabBarScroller(tabBar) : tabBar;
    element.attributes.ref = this.setControlRef;
    return element;
  }
}

/**
 * @prop active = false
 */
class Tab extends MaterialComponent {
  constructor() {
    super();
    this.componentName = 'tab';
    this._mdcProps = ['active'];
  }
  materialDom(props) {
    return (
      <a role="tab" {...props} ref={this.setControlRef}>
        {props.children}
      </a>
    );
  }
}

class TabIconLabel extends MaterialComponent {
  constructor() {
    super();
    this.componentName = 'tab__icon-text';
  }
  materialDom(props) {
    return (
      <span {...props} ref={this.setControlRef}>
        {props.children}
      </span>
    );
  }
}

/*
 * Function to add declarative opening/closing to drawer
 */
function setActiveTabIndex(oldprops, newprops, tabs) {
  if (
    'activeTabIndex' in oldprops &&
    'activeTabIndex' in newprops &&
    oldprops.activeTabIndex !== newprops.activeTabIndex
  ) {
    tabs.activeTabIndex = newprops.activeTabIndex;
  }
}

/**
 * Wrap given tabBar in a tab-bar-scroller
 */
function withTabBarScroller(tabBar) {
  tabBar.attributes.className = `${
    tabBar.attributes.className
  } mdc-tab-bar-scroller__scroll-frame__tabs`;
  return (
    <div className="mdc-tab-bar-scroller">
      <div className="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--back">
        <a
          className="mdc-tab-bar-scroller__indicator__inner material-icons"
          href="#"
          aria-label="scroll back button">
          navigate_before
        </a>
      </div>
      <div className="mdc-tab-bar-scroller__scroll-frame">{tabBar}</div>
      <div className="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--forward">
        <a
          className="mdc-tab-bar-scroller__indicator__inner material-icons"
          href="#"
          aria-label="scroll forward button">
          navigate_next
        </a>
      </div>
    </div>
  );
}

Tabs.Tab = Tab;
Tabs.TabIconLabel = TabIconLabel;
export default Tabs;

let React = require('react');
let StylePropable = require('../mixins/style-propable');
let DateTime = require('../utils/date-time');
let Transitions = require('../styles/transitions');
let AutoPrefix = require('../styles/auto-prefix');
let SlideInTransitionGroup = require('../transition-groups/slide-in');


let DateDisplay = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    selectedDate: React.PropTypes.object.isRequired,
    weekCount: React.PropTypes.number,
    yearSelectionAvailable: React.PropTypes.bool,
    monthDaySelected: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      weekCount: 4,
      yearSelectionAvailable: true,
      monthDaySelected: true
    };
  },

  getInitialState() {
    return {
      transitionDirection: 'up',
      selectedYear: !this.props.monthDaySelected
    };
  },

  componentWillReceiveProps(nextProps) {
    let direction;

    if (nextProps.selectedDate !== this.props.selectedDate) {
      direction = nextProps.selectedDate > this.props.selectedDate ? 'up' : 'down';
      this.setState({
        transitionDirection: direction
      });
    }

    if (nextProps.monthDaySelected !== undefined) {
      this.setState({selectedYear: !nextProps.monthDaySelected});
    }
  },

  getTheme() {
    return this.context.muiTheme.component.datePicker;
  },

  render() {
    let {
      selectedDate,
      style,
      ...other
    } = this.props;
    let dayOfWeek = DateTime.getDayOfWeek(this.props.selectedDate);
    let month = DateTime.getShortMonth(this.props.selectedDate);
    let day = this.props.selectedDate.getDate();
    let year = this.props.selectedDate.getFullYear();

    let isLandscape = this.props.mode === 'landscape';
    let dateYPosition = '0px';
    let dayYPosition = '30px';
    let yearYPosition = '95px';

    if (isLandscape) {
      dateYPosition = this.props.weekCount === 5 ? '14px' :
        this.props.weekCount === 6 ? '34px' : '8px';
      yearYPosition = this.props.weekCount === 4 ? '114px' : '150px';
      if (this.props.weekCount > 4) dayYPosition = '50px';
    }

    let styles = {
      root: {
        textAlign: 'center',
        position: 'relative'
      },

      dateContainer: {
        backgroundColor: this.getTheme().color,
        height: isLandscape ? this.props.weekCount * 40 + 36 + 'px' : '150px',
        padding: '16px 0',
        transition: Transitions.easeOut(),
        boxSizing: 'border-box',
      },

      date: {
        position: 'relative',
        color: this.getTheme().textColor,
        transition: Transitions.easeOut(),
        transform: 'translate3d(0,' + dateYPosition + ',0)'
      },

      dowContainer: {
        height: '32px',
        backgroundColor: this.getTheme().selectColor,
        borderRadius: isLandscape ? '2px 0 0 0' : '2px 2px 0 0',
        paddingTop: '9px',
        boxSizing: 'border-box'
      },

      dow: {
        fontSize: '13px',
        lineHeight: '13px',
        height: '100%',
        color: this.getTheme().selectTextColor
      },

      day: {
        root: {
          position: 'absolute',
          lineHeight: isLandscape ? '76px' : '58px',
          fontSize: isLandscape ? '76px' : '58px',
          height: isLandscape ? '76px' : '58px',
          width: '100%',
          opacity: this.state.selectedYear ? '0.7' : '1.0',
          transition: Transitions.easeOut(),
          transform: 'translate3d(0,' + dayYPosition + ',0)'
        },

        title: {
          width: '100px',
          marginLeft: 'auto',
          marginRight: 'auto',
          cursor: !this.state.selectedYear ? 'default' : 'pointer'
        }
      },

      month: {
        root: {
          position: 'absolute',
          top: isLandscape ? '0px' : '1px',
          fontSize: isLandscape ? '26px' : '22px',
          lineHeight: isLandscape ? '26px' : '22px',
          height: isLandscape ? '26px' : '22px',
          width: '100%',
          textTransform: 'uppercase',
          opacity: this.state.selectedYear ? '0.7' : '1.0'
        },

        title: {
          width: '100px',
          marginLeft: 'auto',
          marginRight: 'auto',
          cursor: !this.state.selectedYear ? 'default' : 'pointer'
        }
      },

      year: {
        root: {
          position: 'absolute',
          margin: '0px',
          fontSize: isLandscape ? '26px' : '22px',
          lineHeight: isLandscape ? '26px' : '22px',
          height: isLandscape ? '26px' : '22px',
          width: '100%',
          textTransform: 'uppercase',
          opacity: this.state.selectedYear ? '1.0' : '0.7',
          transition: Transitions.easeOut(),
          transform: 'translate3d(0,' + yearYPosition + ',0)'
        },

        title: {
          width: '100px',
          marginLeft: 'auto',
          marginRight: 'auto',
          cursor: (!this.props.yearSelectionAvailable || this.state.selectedYear) ? 'default' : 'pointer'
        }
      }
    };

    return (
      <div {...other} style={this.mergeAndPrefix(styles.root, this.props.style)}>
        <div style={styles.dowContainer}>
          <SlideInTransitionGroup
            style={styles.dow}
            direction={this.state.transitionDirection}>
            <div key={dayOfWeek}>{dayOfWeek}</div>
          </SlideInTransitionGroup>
        </div>

        <div style={AutoPrefix.all(styles.dateContainer)}>
          <div style={AutoPrefix.all(styles.date)}>

            <SlideInTransitionGroup
              style={styles.month.root}
              direction={this.state.transitionDirection}>
              <div key={month} style={styles.month.title} onTouchTap={this._handleMonthDayClick}>{month}</div>
            </SlideInTransitionGroup>

            <SlideInTransitionGroup
              style={styles.day.root}
              direction={this.state.transitionDirection}>
              <div key={day} style={styles.day.title} onTouchTap={this._handleMonthDayClick}>{day}</div>
            </SlideInTransitionGroup>

            <SlideInTransitionGroup
              style={styles.year.root}
              direction={this.state.transitionDirection}>
              <div key={year} style={styles.year.title} onTouchTap={this._handleYearClick}>{year}</div>
            </SlideInTransitionGroup>
          </div>

        </div>

      </div>
    );
  },

  _handleMonthDayClick() {
    if (this.props.handleMonthDayClick && this.state.selectedYear) {
      this.props.handleMonthDayClick();
    }

    if (this.props.yearSelectionAvailable) this.setState({selectedYear: false});
  },

  _handleYearClick() {
    if (this.props.handleYearClick && !this.state.selectedYear && this.props.yearSelectionAvailable) {
      this.props.handleYearClick();
    }

    if (this.props.yearSelectionAvailable) this.setState({selectedYear: true});
  }

});

module.exports = DateDisplay;

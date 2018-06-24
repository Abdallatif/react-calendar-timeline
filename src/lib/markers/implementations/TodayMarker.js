import React from 'react'
import PropTypes from 'prop-types'

const criticalStyles = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  // FIXME: are these critical styles?
  width: '2px',
  backgroundColor: 'red'
}

// FIXME: this is used in all marker implementations
// REVIEW: might want to memoize this as it creates a new object
// in each render which is passed to React component
const createMarkerStylesWithLeftOffset = leftOffset => ({
  ...criticalStyles,
  left: leftOffset
})

// eslint-disable-next-line
const defaultRenderer = ({ styles }) => (
  <div style={styles} data-testid="default-today-line" />
)

/** Marker that is placed based on current date.  This component updates itself on
 * a set interval, dictated by the 'interval' prop.
 */
class TodayMarker extends React.Component {
  static propTypes = {
    getLeftOffsetFromDate: PropTypes.func.isRequired,
    renderer: PropTypes.func,
    interval: PropTypes.number.isRequired
  }

  static defaultProps = {
    renderer: defaultRenderer
  }

  state = {
    date: Date.now()
  }

  componentDidMount() {
    this.intervalToken = setInterval(
      () =>
        this.setState({
          date: Date.now() // FIXME: use date utils pass in as props
        }),
      this.props.interval
    )
  }

  componentWillUnmount() {
    clearInterval(this.intervalToken)
  }

  render() {
    const { date } = this.state
    const leftOffset = this.props.getLeftOffsetFromDate(date)
    const styles = createMarkerStylesWithLeftOffset(leftOffset)
    return this.props.renderer({ styles, date })
  }
}

export default TodayMarker

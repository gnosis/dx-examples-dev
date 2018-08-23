import React, { Component } from 'react'

const withErrorBoundary = WrapComponent =>
  class ErrorBoundary extends Component {
    state = { error: null }

    componentDidCatch(error, info) {
      this.setState({ error, info })
      // can log errors here
    }

    render() {
      const { error, info } = this.state

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          return (
            <pre style={{ position: 'relative', zIndex: 2 }}>
              Error: {error.message}
              <br />
              Info: {info.componentStack}
            </pre>
          )
        }
        return <h3>Error occurred!</h3>
      }

      return <WrapComponent {...this.props} />
    }
  }


export default withErrorBoundary

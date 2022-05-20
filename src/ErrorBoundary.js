import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    const { handleError } = this.props;
    handleError();
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <>
          <br />
          An error occurred with the data you provided.
          <br />
          <br />
        </>
      );
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }
}

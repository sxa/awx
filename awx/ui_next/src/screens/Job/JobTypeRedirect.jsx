import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { PageSection, Card } from '@patternfly/react-core';
import { UnifiedJobsAPI } from '@api';
import ContentError, { NotFoundError } from '@components/ContentError';
import { JOB_TYPE_URL_SEGMENTS } from '../../constants';

const NOT_FOUND = 'not found';

class JobTypeRedirect extends Component {
  static defaultProps = {
    view: 'details',
  };

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      job: null,
      isLoading: true,
    };
    this.loadJob = this.loadJob.bind(this);
  }

  componentDidMount() {
    this.loadJob();
  }

  async loadJob() {
    const { id } = this.props;
    this.setState({ isLoading: true });
    try {
      const { data } = await UnifiedJobsAPI.read({ id });
      const job = data.results[0];
      this.setState({
        job,
        isLoading: false,
        error: job ? null : NOT_FOUND,
      });
    } catch (error) {
      this.setState({
        error,
        isLoading: false,
      });
    }
  }

  render() {
    const { path, view } = this.props;
    const { error, job, isLoading } = this.state;

    if (error) {
      return (
        <PageSection>
          <Card className="awx-c-card">
            {error === NOT_FOUND ? (
              <NotFoundError>
                The requested job could not be found. <Link to="/jobs">View all Jobs.</Link>
              </NotFoundError>
            ) : (
              <ContentError error={error} />
            )}
          </Card>
        </PageSection>
      );
    }
    if (isLoading) {
      // TODO show loading state
      return <div>Loading...</div>;
    }
    const type = JOB_TYPE_URL_SEGMENTS[job.type];
    return <Redirect from={path} to={`/jobs/${type}/${job.id}/${view}`} />;
  }
}

export default JobTypeRedirect;

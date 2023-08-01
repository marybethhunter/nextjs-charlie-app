import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Button } from 'reactstrap';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Highlight from '../components/Highlight';

function Profile() {
  const { user, isLoading } = useUser();
  const [list, setList] = useState({ response: undefined, error: undefined });

  const callApi = async () => {
    setList(previous => ({ ...previous, isLoading: true }));

    try {
      const response = await fetch('/api/actions');
      const data = await response.json();

      setList(previous => ({ ...previous, response: data, error: undefined }));
    } catch (error) {
      setList(previous => ({ ...previous, response: undefined, error }));
    } finally {
      setList(previous => ({ ...previous, isLoading: false }));
    }
  };

  const handle = (event, fn) => {
    event.preventDefault();
    fn();
  };

  const { response, error } = list;

  return (
    <>
      {isLoading && <Loading />}
      {user && (
        <>
          <Row className="align-items-center profile-header mb-5 text-center text-md-left" data-testid="profile">
            <Col md={2}>
              <img
                src={user.picture}
                alt="Profile"
                className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                decode="async"
                data-testid="profile-picture"
              />
            </Col>
            <Col md>
              <h2 data-testid="profile-name">{user.name}</h2>
              <p className="lead text-muted" data-testid="profile-email">
                {user.email}
              </p>
            </Col>
          </Row>
          <div>
            <h3>Applications List</h3>
            <Button
              style={{ marginBottom: '12px', marginTop: '12px' }}
              color="primary"
              onClick={e => handle(e, callApi)}
              data-testid="external-action">
              Generate List
            </Button>
            <Highlight>{JSON.stringify(list, null, 2)}</Highlight>
          </div>
        </>
      )}
    </>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});

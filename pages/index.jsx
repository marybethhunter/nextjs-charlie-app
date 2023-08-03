import React, { useState } from 'react';
import Hero from '../components/Hero';
import Content from '../components/Content';
import { Button } from 'reactstrap';
import Highlight from '../components/Highlight';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Index() {
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
      {user && (
        <div>
          <h3>Application List</h3>
          <Button
            style={{ marginBottom: '12px', marginTop: '12px' }}
            color="primary"
            onClick={e => handle(e, callApi)}
            data-testid="external-action">
            Generate List
          </Button>
          <Highlight>{JSON.stringify(list, null, 2)}</Highlight>
        </div>
      )}
      <Hero />
      <hr />
      <Content />
    </>
  );
}

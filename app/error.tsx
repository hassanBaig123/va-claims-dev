'use client';
import React from 'react';

export default function Error({ reset }: { reset: () => void }) {
    return (
      <div>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </div>
    );
  }
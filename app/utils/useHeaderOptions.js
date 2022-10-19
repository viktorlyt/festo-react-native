import React, { useEffect } from 'react';

export default function useHeaderOptions(nav, options) {
  useEffect(() => {
    nav.setOptions(options);
  }, []);
}

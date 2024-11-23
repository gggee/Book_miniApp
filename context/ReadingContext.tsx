import React, { createContext, useState } from 'react';

const ReadingContext = createContext();

export const ReadingProvider = ({ children }) => {
  const [readingProgress, setReadingProgress] = useState({}); 

  return (
    <ReadingContext.Provider value={{ readingProgress, setReadingProgress }}>
      {children}
    </ReadingContext.Provider>
  );
};

export default ReadingContext;

import { useState, createContext, useContext } from 'react';

const ListingContext = createContext()

export function ListingContextProvider({children}) {
  return (
    <ListingContext.Provider value={
        {

        }
    }>
      
    </ListingContext.Provider>
  )
}

export default function useListingContext(){
    return useContext(ListingContext);
}

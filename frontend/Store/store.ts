import { create } from 'zustand'



type SearchParams = {
    searchParam: string,
    cursor: number,
    pageSize: number
}
type Actions = {
    setSearchParams: (searchParameter: string) => void
    clearSearchParams: () => void
    setCursor: (cursorValue: number) => void
    clearCursor: () => void
}

export const useSearchStore = create<SearchParams & Actions>((set) => ({
    searchParam: "",
    cursor: 0,
    pageSize: 15,

    setSearchParams: (searchParameter) => set({
        searchParam: searchParameter
    }),


    clearCursor: () => set({
        cursor: 0
    }),

    clearSearchParams: () => set({
        searchParam: ""
    }),
    setCursor: (cursorValue) => set({
        cursor: cursorValue
    })

}))





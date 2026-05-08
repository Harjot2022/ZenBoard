import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';

export const useBoardStore = create(
    devtools(
        persist(
            (set,get) => ({
                boards:[],
                currentBoard: null,
                lists:[],
                cards:[],
                selectedCard: null,
                loading: false,

                setBoards:(boards) => set({boards}),
                setCurrentBoard:(board) => set({currentBoard: board}),
                 setLists: (lists) => set({ lists }),  
                setCards: (cards) => set({ cards }), 
                setSelectedCard: (card) => set({ selectedCard: card }),  
                setLoading: (loading) => set({ loading }), 

                addCard:(card) => set((state) =>({
                    cards:[...state.cards, card]
                })),
                updateCard: (cardId ,updates) => set((state) => ({
                    cards: state.cards.map(c => c.id === cardId ? {...c , ...updates} : c
                    )
                })),
                deleteCard: (cardId) => set((state) => ({
                    cards: state.cards.filter(c => c.id !== cardId )
                })),

                addList: (list) => 
                    set((state) => ({lists: [...state.lists , list]
                    })),
                deleteList: (listId) => 
                    set((state) => ({
                        lists : state.lists.filter(l => l.id !== listId),
                        cards: state.cards.filter(c => c.list_id !== listId)
                    })),    

                getCardsByList: (listId) => 
                    get().cards.filter( c => c.list_id === listId),
                getList: (listId) => 
                    get().lists.find(l => l.id === listId),
            }),
            { name: 'board-store'}
        )
    )
);
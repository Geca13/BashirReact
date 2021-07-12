import React from 'react'
import { render ,fireEvent , waitFor, waitForElementToBeRemoved, } from '@testing-library/react'
import HoaxFeed from './HoaxFeed'
import * as apiCalls from '../api/apiCalls'
import { MemoryRouter } from 'react-router-dom'

const setup = (props) =>{
    return render(
        <MemoryRouter>
            <HoaxFeed {...props} />
        </MemoryRouter>
    )
}

const mockEmptyResponse = {
    data: {
        content: []
    }
};

const mockSuccessGetHoaxesSinglePage = {
    data: {
        content: [
            {
                id: 10,
                content: 'this is the latest hoax',
                date: 1561294668539,
                user: {
                    id: 1,
                    username: 'user1',
                    displayName: 'display1',
                    image: 'profile1.png'
                }
            }
        ],
        number: 0,
        first: true,
        last: true,
        size: 5,
        totalPages: 1
    }
}

const mockSuccessGetHoaxesFirstOfMultyPage = {
    data: {
        content: [
            {
                id: 10,
                content: 'this is the latest hoax',
                date: 1561294668539,
                user: {
                    id: 1,
                    username: 'user1',
                    displayName: 'display1',
                    image: 'profile1.png'
                }
            }
        ],
        number: 0,
        first: true,
        last: false,
        size: 5,
        totalPages: 2
    }
}

const mockSuccessGetHoaxesLastOfMultiPage = {
    data: {
      content: [
        {
          id: 1,
          content: 'This is the oldest hoax',
          date: 1561294668539,
          user: {
            id: 1,
            username: 'user1',
            displayName: 'display1',
            image: 'profile1.png',
          },
        },
      ],
      number: 0,
      first: true,
      last: true,
      size: 5,
      totalPages: 2,
    },
  };



describe('HoaxFeed', ()=> {
    describe('Lifecycle', ()=> {
    
        it('calls loadHoaxes when it is rendered', ()=> {
           apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
           setup();
           expect(apiCalls.loadHoaxes).toHaveBeenCalled();
        })
        it('calls loadHoaxes with user parameter when it is rendered with user property', ()=> {
            apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
            setup({user: 'user1'})
            expect(apiCalls.loadHoaxes).toHaveBeenCalledWith('user1');
         })
         it('calls loadHoaxes without user parameter when it is rendered without user property', ()=> {
            apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
            setup();
            const parameter = apiCalls.loadHoaxes.mock.calls[0][0];
            expect(parameter).toBeUndefined();
         })
         it('calls loadNewHoaxCount with topHoax id', async () => {
          useFakeIntervals();
          apiCalls.loadHoaxes = jest
            .fn()
            .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
          apiCalls.loadNewHoaxCount = jest
            .fn()
            .mockResolvedValue({ data: { count: 1 } });
          const { findByText } = setup();
          await findByText('This is the latest hoax');
          runTimer();
          await findByText('There is 1 new hoax');
          const firstParam = apiCalls.loadNewHoaxCount.mock.calls[0][0];
          expect(firstParam).toBe(10);
          useRealIntervals();
        });

        it('calls loadNewHoaxCount with topHoax id and username when rendered with user property', async () => {
          useFakeIntervals();
          apiCalls.loadHoaxes = jest
            .fn()
            .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
          apiCalls.loadNewHoaxCount = jest
            .fn()
            .mockResolvedValue({ data: { count: 1 } });
          const { findByText } = setup({ user: 'user1' });
          await findByText('This is the latest hoax');
          runTimer();
          await findByText('There is 1 new hoax');
          expect(apiCalls.loadNewHoaxCount).toHaveBeenCalledWith(10, 'user1');
          useRealIntervals();
        });

        it('displays new hoax count as 1 after loadNewHoaxCount success', async () => {
          useFakeIntervals();
          apiCalls.loadHoaxes = jest
            .fn()
            .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
          apiCalls.loadNewHoaxCount = jest
            .fn()
            .mockResolvedValue({ data: { count: 1 } });
          const { findByText } = setup({ user: 'user1' });
          await findByText('This is the latest hoax');
          runTimer();
          const newHoaxCount = await findByText('There is 1 new hoax');
          expect(newHoaxCount).toBeInTheDocument();
          useRealIntervals();
        });
        it('displays new hoax count constantly', async () => {
          useFakeIntervals();
          apiCalls.loadHoaxes = jest
            .fn()
            .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
          apiCalls.loadNewHoaxCount = jest
            .fn()
            .mockResolvedValue({ data: { count: 1 } });
          const { findByText } = setup({ user: 'user1' });
          await findByText('This is the latest hoax');
          runTimer();
          await findByText('There is 1 new hoax');
          apiCalls.loadNewHoaxCount = jest
            .fn()
            .mockResolvedValue({ data: { count: 2 } });
          runTimer();
          const newHoaxCount = await findByText('There are 2 new hoaxes');
          expect(newHoaxCount).toBeInTheDocument();
          useRealIntervals();
        });
        it('does not call loadNewHoaxCount after component is unmounted', async () => {
          useFakeIntervals();
          apiCalls.loadHoaxes = jest
            .fn()
            .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
          apiCalls.loadNewHoaxCount = jest
            .fn()
            .mockResolvedValue({ data: { count: 1 } });
          const { findByText, unmount } = setup({ user: 'user1' });
          await findByText('This is the latest hoax');
          runTimer();
          await findByText('There is 1 new hoax');
          unmount();
          expect(apiCalls.loadNewHoaxCount).toHaveBeenCalledTimes(1);
          useRealIntervals();
        });
        it('displays new hoax count as 1 after loadNewHoaxCount success when user does not have hoaxes initially', async () => {
          useFakeIntervals();
          apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
          apiCalls.loadNewHoaxCount = jest
            .fn()
            .mockResolvedValue({ data: { count: 1 } });
          const { findByText } = setup({ user: 'user1' });
          await findByText('There are no hoaxes');
          runTimer();
          const newHoaxCount = await findByText('There is 1 new hoax');
          expect(newHoaxCount).toBeInTheDocument();
          useRealIntervals();
        });
    });

    describe('Layout', ()=> {
    
        it('displays no hoax message when the response has empty page', async () => {
            apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
            const { findByText } = setup();
            const message = await findByText('There are no hoaxes');
            expect(message).toBeInTheDocument();
          });
        it('does not display no hoax message when response has page of hoax', ()=> {
            apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockSuccessGetHoaxesSinglePage);
            const { queryByText } = setup();
            await waitFor(() => {
                expect(message).not.toBeInTheDocument();
              });
        });

        it('displays spinner when loading the hoaxes', async () => {
            apiCalls.loadHoaxes = jest.fn().mockImplementation(() => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve(mockSuccessGetHoaxesSinglePage);
                }, 300);
              });
            });
            const { queryByText } = setup();
            expect(queryByText('Loading...')).toBeInTheDocument();
        });
        it('displays hoax content', async () => {
            apiCalls.loadHoaxes = jest
              .fn()
              .mockResolvedValue(mockSuccessGetHoaxesSinglePage);
            const { findByText } = setup();
            const hoaxContent = await findByText('This is the latest hoax');
            expect(hoaxContent).toBeInTheDocument();
        });

        it('displays Load More when there are next pages', async () => {
            apiCalls.loadHoaxes = jest
              .fn()
              .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultyPage);
            const { findByText } = setup();
            const loadMore = await findByText('Load More');
            expect(loadMore).toBeInTheDocument();
        });
    });

    describe('Interactions', ()=> {
    
        it('calls loadOldHoaxes with hoax id when clicking Load More', async () => {
            apiCalls.loadHoaxes = jest
              .fn()
              .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
            apiCalls.loadOldHoaxes = jest
              .fn()
              .mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
            const { findByText } = setup();
            const loadMore = await findByText('Load More');
            fireEvent.click(loadMore);
            const firstParam = apiCalls.loadOldHoaxes.mock.calls[0][0];
            expect(firstParam).toBe(9);
          });

          it('calls loadOldHoaxes with hoax id and username when clicking Load More when rendered with user property', async () => {
            apiCalls.loadHoaxes = jest
              .fn()
              .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
            apiCalls.loadOldHoaxes = jest
              .fn()
              .mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
            const { findByText } = setup({ user: 'user1' });
            const loadMore = await findByText('Load More');
            fireEvent.click(loadMore);
            expect(apiCalls.loadOldHoaxes).toHaveBeenCalledWith(9, 'user1');
          });

          it('displays loaded old hoax when loadOldHoaxes api call success', async () => {
            apiCalls.loadHoaxes = jest
              .fn()
              .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
            apiCalls.loadOldHoaxes = jest
              .fn()
              .mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
            const { findByText } = setup();
            const loadMore = await findByText('Load More');
            fireEvent.click(loadMore);
            const oldHoax = await findByText('This is the oldest hoax');
            expect(oldHoax).toBeInTheDocument();
          });
          it('hides Load More when loadOldHoaxes api call returns last page', async () => {
            apiCalls.loadHoaxes = jest
              .fn()
              .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
            apiCalls.loadOldHoaxes = jest
              .fn()
              .mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
            const { findByText } = setup();
            const loadMore = await findByText('Load More');
            fireEvent.click(loadMore);
            await waitFor(() => {
              expect(loadMore).not.toBeInTheDocument();
            });
          });
    });

});

console.error = () =>{}
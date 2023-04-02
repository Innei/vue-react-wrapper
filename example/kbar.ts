import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from 'kbar'
import React from 'react'

export const KBar = () => {
  return React.createElement(KBarProvider, {
    actions: [
      {
        id: 'blog',
        name: 'Blog',
        shortcut: ['b'],
        keywords: 'writing words',
        perform: () => (window.location.pathname = 'blog'),
      },
      {
        id: 'contact',
        name: 'Contact',
        shortcut: ['c'],
        keywords: 'email',
        perform: () => (window.location.pathname = 'contact'),
      },
    ],
    children: [
      React.createElement(KBarPortal, {
        children: [
          React.createElement(KBarPositioner, {
            children: [
              React.createElement(KBarAnimator, {
                children: [React.createElement(KBarSearch, {})],
              }),
            ],
          }),
        ],
      }),
      React.createElement('div', {
        style: {
          height: '100vh',
        },
      }),
    ],
  })
}

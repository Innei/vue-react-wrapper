// @ts-nocheck
import React, { forwardRef, useImperativeHandle } from 'react'
import Unidata from 'unidata.js'
import { WagmiConfig, createClient, useAccount } from 'wagmi'

import {
  ConnectKitProvider,
  getDefaultClientConfig,
  useAccountState,
  useConnectModal,
} from '@crossbell/connect-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export { useAccount } from 'wagmi'
export { useAccountState, useConnectModal } from '@crossbell/connect-kit'

const IPFS_PREFIX = 'ipfs://'
const IPFS_GATEWAY = 'https://ipfs.4everland.xyz/ipfs/'
const CSB_IO = 'https://crossbell.io'
const OUR_DOMAIN = 'xlog.app'

const namespace = 'xlog'
let data = {}
try {
  data = JSON.parse(localStorage.getItem(namespace) || '{}')
  // eslint-disable-next-line no-empty
} catch (error) {}
const getKeys = (key) => {
  return Object.keys(data).filter((k) => k.startsWith(key))
}
const getStorage = (key) => {
  return data[key]
}

const getLocalPages = (input) => {
  const pages = []
  getKeys(`draft-${input.site}-`).forEach((key) => {
    const page = getStorage(key)
    if (input.isPost === undefined || page.isPost === input.isPost) {
      pages.push({
        id: key.replace(`draft-${input.site}-`, ''),
        title: page.values?.title,
        body: {
          content: page.values?.content,
          mime_type: 'text/markdown',
        },
        date_updated: new Date(page.date).toISOString(),
        date_published: page.values?.publishedAt,
        summary: {
          content: page.values?.excerpt,
          mime_type: 'text/markdown',
        },
        tags: [
          page.isPost ? 'post' : 'page',
          ...(page.values?.tags
            ?.split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag) || []),
        ],
        applications: ['xlog'],
        ...(page.values?.slug && {
          attributes: [
            {
              trait_type: 'xlog_slug',
              value: page.values?.slug,
            },
          ],
        }),
        preview: true,
      })
    }
  })
  return pages
}
async function createOrUpdatePage(input, customUnidata, newbieToken) {
  if (!input.published) {
    return await customUnidata.notes.set(
      {
        source: 'Crossbell Note',
        identity: input.siteId,
        platform: 'Crossbell',
        action: 'remove',
      },
      {
        id: input.pageId,
      },
      {
        newbieToken,
      },
    )
  }
  return await customUnidata.notes.set(
    {
      source: 'Crossbell Note',
      identity: input.siteId,
      platform: 'Crossbell',
      action: input.pageId ? 'update' : 'add',
    },
    {
      ...(input.externalUrl && { related_urls: [input.externalUrl] }),
      ...(input.pageId && { id: input.pageId }),
      ...(input.title && { title: input.title }),
      ...(input.content && {
        body: {
          content: input.content,
          mime_type: 'text/markdown',
        },
      }),
      ...(input.publishedAt && {
        date_published: input.publishedAt,
      }),
      ...(input.excerpt && {
        summary: {
          content: input.excerpt,
          mime_type: 'text/markdown',
        },
      }),
      tags: [
        input.isPost ? 'post' : 'page',
        ...(input.tags
          ?.split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag) || []),
      ],
      applications: [
        'xlog',
        ...(input.applications?.filter((app) => app !== 'xlog') || []),
      ],
      ...(input.slug && {
        attributes: [
          {
            trait_type: 'xlog_slug',
            value: input.slug,
          },
        ],
      }),
    },
    {
      newbieToken,
    },
  )
}
async function getPage(input, customUnidata) {
  if (!input.site || !(input.page || input.pageId)) {
    return null
  }
  const mustLocal = input.pageId?.startsWith('local-')
  let page = null
  if (!mustLocal) {
    // on-chain page
    if (!input.pageId) {
      const params = new URLSearchParams()
      params.append('handle', input.site)
      input.page && params.append('slug', input.page)
      const slug2Id = await fetch(
        `https://xlog.app` + `/api/slug2id?${params.toString()}`,
      ).then((res) => res.json())
      if (!slug2Id?.noteId) {
        return null
      }
      input.pageId = `${slug2Id.characterId}-${slug2Id.noteId}`
    }
    const pages = await customUnidata.notes.get({
      source: 'Crossbell Note',
      identity: input.site,
      platform: 'Crossbell',
      filter: {
        id: input.pageId,
      },
    })
    page = pages?.list[0] || null
  }
  // local page
  const local = getLocalPages({
    site: input.site,
  })
  const localPage = local.find(
    (page) => page.id === input.page || page.id === input.pageId,
  )
  if (localPage) {
    if (page) {
      if (new Date(localPage.date_updated) > new Date(page.date_updated)) {
        localPage.metadata = page.metadata
        page = localPage
      }
    } else {
      page = localPage
    }
  }
  return page
}

let unidata
const useUnidata = () => {
  const { connector, isConnected } = useAccount()
  if (isConnected && connector) {
    connector?.getProvider().then((provider) => {
      unidata = new Unidata({
        ethereumProvider: provider,
        ipfsGateway: IPFS_GATEWAY,
      })
    })
  } else {
    unidata = new Unidata({
      ipfsGateway: IPFS_GATEWAY,
    })
  }
  return unidata
}
function useCreateOrUpdatePage() {
  const newbieToken = useAccountState((s) => s.email?.token)
  const unidata = useUnidata()
  return (payload) => createOrUpdatePage(payload, unidata, newbieToken)
}

const toGateway = (url) => {
  const ipfsUrl = toIPFS(url)
  return ipfsUrl?.replaceAll(IPFS_PREFIX, IPFS_GATEWAY)
}
const toIPFS = (url) => {
  return url
    ?.replaceAll(IPFS_GATEWAY, IPFS_PREFIX)
    .replaceAll('https://gateway.ipfs.io/ipfs/', IPFS_PREFIX)
    .replaceAll('https://ipfs.io/ipfs/', IPFS_PREFIX)
    .replaceAll('https://cf-ipfs.com/ipfs/', IPFS_PREFIX)
    .replaceAll('https://ipfs.4everland.xyz/ipfs/', IPFS_PREFIX)
    .replaceAll('https://rss3.mypinata.cloud/ipfs/', IPFS_PREFIX)
}

const getSiteLink = ({ domain, subdomain, noProtocol }) => {
  if (domain) {
    return `https://${domain}`
  }
  if (noProtocol) {
    return `${subdomain}.${OUR_DOMAIN}`
  }
  return `https://${subdomain}.${OUR_DOMAIN}`
}
const getNoteSlug = (note) => {
  return (
    note.metadata?.content?.attributes?.find(
      (a) => a?.trait_type === 'xlog_slug',
    )?.value ||
    note.metadata?.content?._xlog_slug ||
    note.metadata?.content?._crosslog_slug
  )?.toLowerCase?.()
}

const urlComposer = {
  characterUrl: ({ handle }) => getSiteLink({ subdomain: handle }),
  noteUrl: (note) => {
    let originalNote = note
    while (originalNote?.toNote) {
      originalNote = originalNote.toNote
    }
    if (originalNote.metadata?.content?.sources?.includes('xlog')) {
      if (originalNote.metadata?.content?.external_urls?.[0]) {
        return (
          originalNote.metadata.content.external_urls[0] +
          (originalNote !== note ? `#comments` : '')
        )
      } else {
        const { character } = originalNote
        if (character) {
          return `${getSiteLink({
            subdomain: character.handle,
          })}/${getNoteSlug(originalNote)}${
            originalNote !== note ? `#comments` : ''
          }`
        } else {
          return ''
        }
      }
    } else {
      return `${CSB_IO}/notes/${note.characterId}-${note.noteId}`
    }
  },
}

const wagmiClient = createClient(getDefaultClientConfig({ appName: 'xLog' }))
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})
const App = forwardRef((props, ref) => {
  return React.createElement(
    WagmiConfig,
    { client: wagmiClient },
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(
        ConnectKitProvider,
        { ipfsLinkToHttpLink: toGateway, urlComposer },
        React.createElement(Instance, { ref }),
        props.children,
      ),
    ),
  )
})
const Instance = forwardRef((props, ref) => {
  const model = useConnectModal()
  const poster = useCreateOrUpdatePage()
  useImperativeHandle(ref, () => {
    return {
      show() {
        model.show()
      },
      connectModal: model,
      createOrUpdatePage: (...rest) => {
        return poster.call(null, ...rest)
      },
    }
  })
  // TODO GC
  // useEffect(() => {}, [])
  return null
})

export {
  App,
  IPFS_GATEWAY,
  IPFS_PREFIX,
  createOrUpdatePage,
  getLocalPages,
  getPage,
  useCreateOrUpdatePage,
  useUnidata,
}
// # sourceMappingURL=index.js.map

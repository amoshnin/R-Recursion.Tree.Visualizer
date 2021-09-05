import React, { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { Toaster, toast } from 'react-hot-toast'
import GlobalStyle from 'shared/styles/global'
import theme from 'shared/styles/themes'
import * as s from './styles'
import FunctionForm from '../function-form'
import TreeViewer from '../graph-viewer'
import Footer from './footer'
import themes from 'shared/styles/themes'
import { TreeViewerData, ThemeType, FunctionData, Language } from '../../types'
import { safeParse, safeStringify } from 'shared/utils/safe-json'
import { url as apiUrl } from 'shared/config/api'
import { DEFAULT_THEME_TYPE } from 'shared/config/constants'

const fetchTreeViewerData = (requestBody: any) =>
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: safeStringify(requestBody),
  })

const App = () => {
  const [themeType, setThemeName] = useState<ThemeType>(DEFAULT_THEME_TYPE)
  const [treeViewerData, setTreeViewerData] = useState<TreeViewerData>(null)
  const [treeViewerOptions, setTreeViewerOptions] = useState({ animate: false })
  const [isLoading, setIsLoading] = useState(false)

  const handleFunctionFormSubmit = async (
    lang: Language,
    functionData: FunctionData,
    options: { memoize: boolean; animate: boolean }
  ) => {
    setIsLoading(true)

    try {
      const response = await fetchTreeViewerData({
        lang,
        functionData,
        options: { memoize: options.memoize },
      })

      const rawResponseBody = await response.text()

      if (response.ok) {
        const treeViewerData = safeParse(rawResponseBody) as TreeViewerData
        setTreeViewerData(treeViewerData)
        setTreeViewerOptions({ animate: options.animate })
      } else {
        const { reason } = safeParse(rawResponseBody) as { reason: string }
        toast.error(reason || 'Internal server error')
        setTreeViewerData(null)
      }
    } catch (e) {
      toast.error('Unexpected client error')
      setTreeViewerData(null)
    }

    setIsLoading(false)
  }

  return (
    <ThemeProvider theme={themes[themeType]}>
      <GlobalStyle />
      <Toaster
        position='top-left'
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            background: theme[themeType].colors.foreground,
            border: `1px solid ${theme[themeType].colors.border}`,
            color: theme[themeType].colors.contrast,
            boxShadow: 'none',
          },
        }}
      />
      <s.AppContainer>
        <s.Main>
          <Footer />
          <TreeViewer
            isLoading={isLoading}
            data={treeViewerData}
            options={treeViewerOptions}
          />
        </s.Main>
        <s.Sidebar>
          <FunctionForm
            onSubmit={handleFunctionFormSubmit}
            onThemeChange={setThemeName}
          />
        </s.Sidebar>
      </s.AppContainer>
    </ThemeProvider>
  )
}

export default App

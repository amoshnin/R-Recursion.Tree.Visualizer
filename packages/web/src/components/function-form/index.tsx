import React, { useContext, useState } from 'react'
import { ThemeContext } from 'styled-components'
import { toast } from 'react-hot-toast'

// PLUGINS IMPORTS //

// COMPONENTS IMPORTS //
import * as Views from './styles'
import CodeEditor from './code-editor'

// EXTRA IMPORTS //
import * as constants from 'shared/config/constants'
import templates from 'shared/config/templates'
import { useLocalStorageState, useFormInput, useCarbonAds } from 'shared/hooks'
import {
  buildFnCodeDecomposer,
  buildFnCodeComposer,
  composeFnData,
  decomposeFnData,
} from './template-handler'
import { buildFnCodeValidator, buildFnCallValidator } from './validators'
import './carbon-ads.css'

// TYPE IMPORTS //
import type {
  Template,
  ThemeType,
  FunctionData,
  Language,
  GlobalVar,
} from 'types'

/////////////////////////////////////////////////////////////////////////////

type PropsType = {
  onSubmit: (
    lang: Language,
    fnData: FunctionData,
    options: { memoize: boolean; animate: boolean }
  ) => void
  onThemeChange: (themeType: ThemeType) => void
}

const FunctionForm = ({ onSubmit, onThemeChange }: PropsType) => {
  const [lang, setLang] = useLocalStorageState<Language>(
    'fn-lang',
    constants.DEFAULT_LANGUAGE
  )
  const [fnCall, setFnCall] = useFormInput(
    'fn-call',
    'fn()',
    buildFnCallValidator(lang)
  )
  const [fnCode, setFnCode] = useLocalStorageState(
    'fn-code',
    constants.DEFAULT_FN_CODE
  )
  const [fnGlobalVars, setFnGlobalVars] = useLocalStorageState<GlobalVar[]>(
    'fn-global-vars',
    constants.DEFAULT_GLOBAL_VARS
  )

  const [memoize, setMemoize] = useLocalStorageState('memoize', false)
  const [animate, setAnimate] = useLocalStorageState('animate', true)

  const theme = useContext(ThemeContext)

  // if null, user changed the default code that comes in with template
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(
    constants.DEFAULT_TEMPLATE
  )

  // const divRefAds = useCarbonAds()

  const handleSelectTemplateChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newTemplate = e.target.value as Template
    setActiveTemplate(newTemplate)

    const res = decomposeFnData(templates[newTemplate].fnData[lang], lang)
    setFnCode(res.fnCode)
    setFnCall(res.fnCall)
    setFnGlobalVars(res.fnGlobalVars)
  }

  const handleSelectLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = e.target.value as Language
    setLang(newLang)

    if (activeTemplate === null) {
      // keep only the previous params names (inside fnCode)
      setFnCode((prevFnCode) => {
        const decomposeFnCode = buildFnCodeDecomposer(lang)
        const composeFnCode = buildFnCodeComposer(newLang)

        const { paramsNames } = decomposeFnCode(prevFnCode)
        return composeFnCode({ paramsNames })
      })
    } else {
      const { fnCode, fnCall, fnGlobalVars } = decomposeFnData(
        templates[activeTemplate].fnData[newLang],
        newLang
      )
      setFnCode(fnCode)
      setFnCall(fnCall)
      setFnGlobalVars(fnGlobalVars)
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // client-side validation
    // TODO: remover try/catch
    try {
      const fnData = composeFnData(fnCode, fnCall.value, fnGlobalVars, lang) // throw error
      onSubmit(lang, fnData, { memoize, animate })
    } catch (error) {
      // @ts-ignore
      toast.error(error.message)
    }
  }

  return (
    <Views.FormContainer onSubmit={handleFormSubmit}>
      <Views.FormContent>
        {/* <div ref={divRefAds} /> */}

        <Views.Title>Pre-defined templates</Views.Title>
        <Views.Select
          value={activeTemplate || 'custom'}
          onChange={handleSelectTemplateChange}
        >
          {Object.entries(templates).map(([key, template]) => (
            <option key={key} value={key}>
              {template.name}
            </option>
          ))}
        </Views.Select>

        <Views.Title>Global variables</Views.Title>
        {fnGlobalVars.map(({ name, value }, i) => (
          <Views.VariableContainer key={i}>
            <CodeEditor
              lang={lang}
              value={name}
              onValueChange={(value) => {
                setFnGlobalVars((v) => {
                  if (v[i]) v[i].name = value
                  return [...v]
                })
              }}
            />
            <span style={{ margin: '0 0.3em' }}>=</span>
            <CodeEditor
              lang={lang}
              value={value}
              onValueChange={(value) => {
                setFnGlobalVars((v) => {
                  if (v[i]) v[i].value = value
                  return [...v]
                })
              }}
            />
          </Views.VariableContainer>
        ))}

        <Views.Title>Recursive function</Views.Title>
        <div style={{ position: 'relative' }}>
          <Views.Select
            value={lang}
            onChange={handleSelectLanguageChange}
            style={{
              position: 'absolute',
              top: '-27px',
              right: '0',
              width: '80px',
              height: '22px',
              fontSize: '14px',
            }}
          >
            {constants.LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </Views.Select>
          <CodeEditor
            lang={lang}
            value={fnCode}
            shouldValueChange={buildFnCodeValidator(lang)}
            onValueChange={(newValue) => {
              setFnCode((prevValue) => {
                if (prevValue !== newValue) setActiveTemplate(null)
                return newValue
              })
            }}
            onValueReset={() => {
              const composeFnCode = buildFnCodeComposer(lang)
              setFnCode(composeFnCode())
            }}
          />
        </div>

        <Views.Title>Options</Views.Title>
        <Views.Option>
          <span>Enable step-by-step animation</span>
          <Views.Switch
            checked={animate}
            onChange={() => setAnimate((p) => !p)}
          />
        </Views.Option>
        <Views.Option>
          <span>Enable memoization</span>
          <Views.Switch
            checked={memoize}
            onChange={() => setMemoize((p) => !p)}
          />
        </Views.Option>
        <Views.Option>
          <span>Enable dark mode</span>
          <Views.Switch
            checked={theme.type === 'dark'}
            onChange={() =>
              onThemeChange(theme.type === 'light' ? 'dark' : 'light')
            }
          />
        </Views.Option>
      </Views.FormContent>

      <Views.FormSubmit>
        <Views.SubmitTextInput {...fnCall} />
        <Views.SubmitButton>Run</Views.SubmitButton>
      </Views.FormSubmit>
    </Views.FormContainer>
  )
}

export default FunctionForm

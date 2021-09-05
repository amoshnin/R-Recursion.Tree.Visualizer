// PLUGINS IMPORTS //
import { flow } from 'fp-ts/function'

// EXTRA IMPORTS //
import {
  getSourceCode,
  generateRecursionTree,
  translateToPlainCode,
  computeTreeViewerData,
} from './steps'

// TYPE IMPORTS //
import type { FunctionData, SupportedLanguages } from 'shared/types'

/////////////////////////////////////////////////////////////////////////////

/** Pipeline to input FuncionData and output TreeViewerData. */
export default function buildRunner(
  lang: SupportedLanguages,
  options: { memoize: boolean },
) {
  return flow(
    (fnData: FunctionData) => translateToPlainCode(fnData, lang, options),
    (plainCode) => getSourceCode(plainCode, lang),
    (sourceCode) => generateRecursionTree(sourceCode, lang),
    async (tree) => (await tree).onSuccess(computeTreeViewerData),
  )
}

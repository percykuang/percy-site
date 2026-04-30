const actionFeedbackDuration = 1600
const originalActionIcons = new WeakMap<HTMLButtonElement, string>()
const actionFeedbackTimers = new WeakMap<HTMLButtonElement, number>()

const checkIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M10.0007 15.1709L19.1931 5.97852L20.6073 7.39273L10.0007 17.9993L3.63672 11.6354L5.05093 10.2212L10.0007 15.1709Z" /></svg>'

export default defineNuxtPlugin(() => {
  const { openMarkdownImageViewer } = useMarkdownImageViewer()

  document.addEventListener('click', async (event) => {
    const target = event.target

    if (!(target instanceof Element)) {
      return
    }

    const copyButton = target.closest<HTMLButtonElement>('[data-code-copy]')

    if (copyButton) {
      await copyCode(copyButton)

      return
    }

    const downloadButton = target.closest<HTMLButtonElement>('[data-code-download]')

    if (downloadButton) {
      downloadCode(downloadButton)

      return
    }

    const image = target.closest<HTMLImageElement>('.markdown-body img')

    if (image) {
      event.preventDefault()
      openMarkdownImageViewer({
        alt: image.getAttribute('alt') ?? '',
        caption: image.getAttribute('title') ?? '',
        src: image.currentSrc || image.src,
      })
    }
  })
})

async function copyCode(button: HTMLButtonElement) {
  const code = getCodeText(button)

  if (!code) {
    return
  }

  await navigator.clipboard.writeText(code)
  showActionFeedback(button, {
    restoreLabel: '复制代码',
    state: 'copied',
    temporaryLabel: '已复制',
  })
}

function downloadCode(button: HTMLButtonElement) {
  const code = getCodeText(button)

  if (!code) {
    return
  }

  const block = button.closest<HTMLElement>('.markdown-code-block')
  const language = block?.dataset.language ?? 'txt'
  const blob = new Blob([code], {
    type: 'text/plain;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `snippet.${getFileExtension(language)}`
  link.click()
  URL.revokeObjectURL(url)
  showActionFeedback(button, {
    restoreLabel: '下载代码',
    state: 'downloaded',
    temporaryLabel: '已下载',
  })
}

function showActionFeedback(
  button: HTMLButtonElement,
  options: {
    restoreLabel: string
    state: string
    temporaryLabel: string
  },
) {
  originalActionIcons.set(button, originalActionIcons.get(button) ?? button.innerHTML)

  const activeTimer = actionFeedbackTimers.get(button)

  if (activeTimer) {
    window.clearTimeout(activeTimer)
  }

  button.dataset.state = options.state
  button.setAttribute('aria-label', options.temporaryLabel)
  button.innerHTML = checkIcon

  const timer = window.setTimeout(() => {
    const originalIcon = originalActionIcons.get(button)

    if (originalIcon) {
      button.innerHTML = originalIcon
    }

    delete button.dataset.state
    button.setAttribute('aria-label', options.restoreLabel)
    actionFeedbackTimers.delete(button)
  }, actionFeedbackDuration)

  actionFeedbackTimers.set(button, timer)
}

function getCodeText(button: HTMLButtonElement) {
  return button.closest('.markdown-code-block')?.querySelector('pre code')?.textContent ?? ''
}

function getFileExtension(language: string) {
  const extensions: Record<string, string> = {
    bash: 'sh',
    javascript: 'js',
    js: 'js',
    shell: 'sh',
    sh: 'sh',
    ts: 'ts',
    typescript: 'ts',
    vue: 'vue',
  }

  return extensions[language] ?? language
}

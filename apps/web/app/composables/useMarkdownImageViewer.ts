type MarkdownImageViewerState = {
  alt: string
  caption: string
  isOpen: boolean
  src: string
}

const initialMarkdownImageViewerState = (): MarkdownImageViewerState => ({
  alt: '',
  caption: '',
  isOpen: false,
  src: '',
})

export function useMarkdownImageViewer() {
  const state = useState<MarkdownImageViewerState>(
    'markdown-image-viewer',
    initialMarkdownImageViewerState,
  )

  function openMarkdownImageViewer(input: { alt?: string; caption?: string; src: string }) {
    state.value = {
      alt: input.alt?.trim() ?? '',
      caption: input.caption?.trim() ?? '',
      isOpen: true,
      src: input.src,
    }
  }

  function closeMarkdownImageViewer() {
    state.value = {
      ...state.value,
      isOpen: false,
    }
  }

  return {
    closeMarkdownImageViewer,
    markdownImageViewer: state,
    openMarkdownImageViewer,
  }
}

import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"

const config = await loadQuartzConfig()
config.plugins.transformers.push({
  name: "ExplorerInitialScroll",
  externalResources: () => ({
    js: [
      {
        loadTime: "beforeDOMReady",
        contentType: "inline",
        script: `
          if (sessionStorage.getItem("explorerScrollTop") === null) {
            sessionStorage.setItem("explorerScrollTop", "0")
          }
        `,
      },
    ],
  }),
})

export default config
export const layout = await loadQuartzLayout()
